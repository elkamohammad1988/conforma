-- =============================================================================
-- 0001 — Core tenancy: profiles, organizations, memberships, roles.
--
-- This migration establishes the multi-tenant foundation every other table
-- builds on. Design principles:
--
--   * Every tenant is an `organization`; users join via `org_members` with a
--     role (owner > admin > member). All app data is scoped by `org_id`.
--   * Row Level Security is ON for every table. Access is decided by a small set
--     of SECURITY DEFINER helper functions so policies never recurse (a policy
--     on `systems` that consults `org_members` must not re-trigger RLS on
--     `org_members`). Helpers run with a pinned empty search_path and reference
--     only fully-qualified objects — the standard guard against search_path
--     hijacking in definer functions.
--   * `service_role` (server-side, key never shipped to the browser) bypasses
--     RLS by design and is used for trusted server writes (audit, webhooks).
-- =============================================================================

-- gen_random_uuid() is in core Postgres 13+, but pgcrypto is harmless and makes
-- the intent explicit for anyone reading the schema in isolation.
create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.org_role as enum ('owner', 'admin', 'member');

-- ---------------------------------------------------------------------------
-- updated_at bookkeeping
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ===========================================================================
-- profiles — one row per auth user, auto-created on signup.
-- ===========================================================================
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  full_name  text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Mirror new auth users into public.profiles. SECURITY DEFINER so it can write
-- regardless of the calling context (the auth server inserts as a limited role).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===========================================================================
-- organizations — the tenant boundary.
-- ===========================================================================
create table public.organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 120),
  slug       text not null unique
             check (slug ~ '^[a-z0-9]([a-z0-9-]{0,48}[a-z0-9])?$'),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger organizations_set_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

-- ===========================================================================
-- org_members — who belongs to which org, and with what role.
-- ===========================================================================
create table public.org_members (
  org_id     uuid not null references public.organizations (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  role       public.org_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

create index org_members_user_idx on public.org_members (user_id);

-- ---------------------------------------------------------------------------
-- RLS helper functions (SECURITY DEFINER — evaluated without re-triggering RLS)
-- ---------------------------------------------------------------------------

-- Is the current user a member of this org?
create or replace function public.is_org_member(p_org uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.org_members m
    where m.org_id = p_org and m.user_id = auth.uid()
  );
$$;

-- Does the current user hold at least `p_min` role in this org?
-- Role rank: owner(3) > admin(2) > member(1).
create or replace function public.has_min_org_role(p_org uuid, p_min public.org_role)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select coalesce((
    select
      (case m.role  when 'owner' then 3 when 'admin' then 2 when 'member' then 1 else 0 end)
      >=
      (case p_min   when 'owner' then 3 when 'admin' then 2 when 'member' then 1 else 0 end)
    from public.org_members m
    where m.org_id = p_org and m.user_id = auth.uid()
  ), false);
$$;

-- Does the current user share any org with the given user? (member directory)
create or replace function public.shares_org_with(p_user uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.org_members a
    join public.org_members b on a.org_id = b.org_id
    where a.user_id = auth.uid() and b.user_id = p_user
  );
$$;

-- ---------------------------------------------------------------------------
-- Invariant: an org must always retain at least one owner.
-- ---------------------------------------------------------------------------
create or replace function public.protect_last_owner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner_count int;
begin
  if (tg_op = 'DELETE' and old.role = 'owner')
     or (tg_op = 'UPDATE' and old.role = 'owner' and new.role <> 'owner') then
    select count(*) into owner_count
    from public.org_members
    where org_id = old.org_id and role = 'owner';
    if owner_count <= 1 then
      raise exception 'Cannot remove or demote the last owner of an organization';
    end if;
  end if;
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create trigger org_members_protect_last_owner
  before update or delete on public.org_members
  for each row execute function public.protect_last_owner();

-- ---------------------------------------------------------------------------
-- Atomic org creation: insert the org and make the caller its owner in one
-- transaction. SECURITY DEFINER because the caller is not yet a member (so a
-- direct client insert would fail the admin-only membership policy).
-- ---------------------------------------------------------------------------
create or replace function public.create_organization(p_name text, p_slug text)
returns public.organizations
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_org public.organizations;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.organizations (name, slug, created_by)
  values (p_name, p_slug, v_uid)
  returning * into v_org;

  insert into public.org_members (org_id, user_id, role)
  values (v_org.id, v_uid, 'owner');

  return v_org;
end;
$$;

-- ===========================================================================
-- Row Level Security
-- ===========================================================================
alter table public.profiles      enable row level security;
alter table public.organizations enable row level security;
alter table public.org_members   enable row level security;

-- profiles: read your own + anyone you share an org with; edit only your own.
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.shares_org_with(id));

create policy profiles_insert on public.profiles
  for insert to authenticated
  with check (id = auth.uid());

create policy profiles_update on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- organizations: members read; admins update; owners delete; any authed user
-- may create one (and is made owner) — direct inserts also allowed for parity.
create policy organizations_select on public.organizations
  for select to authenticated
  using (public.is_org_member(id));

create policy organizations_insert on public.organizations
  for insert to authenticated
  with check (created_by = auth.uid());

create policy organizations_update on public.organizations
  for update to authenticated
  using (public.has_min_org_role(id, 'admin'))
  with check (public.has_min_org_role(id, 'admin'));

create policy organizations_delete on public.organizations
  for delete to authenticated
  using (public.has_min_org_role(id, 'owner'));

-- org_members: members read the roster; admins manage it; a user may remove
-- themselves (leave). The last-owner trigger enforces the safety invariant.
create policy org_members_select on public.org_members
  for select to authenticated
  using (public.is_org_member(org_id));

create policy org_members_insert on public.org_members
  for insert to authenticated
  with check (public.has_min_org_role(org_id, 'admin'));

create policy org_members_update on public.org_members
  for update to authenticated
  using (public.has_min_org_role(org_id, 'admin'))
  with check (public.has_min_org_role(org_id, 'admin'));

create policy org_members_delete on public.org_members
  for delete to authenticated
  using (public.has_min_org_role(org_id, 'admin') or user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Grants. RLS decides *rows*; grants decide *table-level* reachability. anon
-- gets nothing here — all of this is private, authenticated-only data.
-- ---------------------------------------------------------------------------
grant select, insert, update, delete on public.profiles      to authenticated;
grant select, insert, update, delete on public.organizations to authenticated;
grant select, insert, update, delete on public.org_members   to authenticated;

grant select, insert, update, delete on public.profiles      to service_role;
grant select, insert, update, delete on public.organizations to service_role;
grant select, insert, update, delete on public.org_members   to service_role;

-- RPCs: lock down the default PUBLIC execute grant, then re-grant deliberately.
revoke execute on function public.create_organization(text, text) from public;
grant  execute on function public.create_organization(text, text) to authenticated;
