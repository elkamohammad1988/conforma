-- =============================================================================
-- 0007 — Team invitations.
--
-- Owners/admins invite teammates by email. An invitation carries an unguessable
-- token (server-generated) and a target role (member or admin — never owner;
-- ownership is granted later by an existing owner). Acceptance is a definer RPC
-- that verifies the signed-in user's email matches the invite, then adds the
-- membership. Invitations are visible only to org admins.
-- =============================================================================

create type public.invitation_status as enum (
  'pending',
  'accepted',
  'revoked',
  'expired'
);

create table public.invitations (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations (id) on delete cascade,
  email       text not null check (char_length(email) between 3 and 320),
  role        public.org_role not null default 'member'
              check (role in ('member', 'admin')),
  token       text not null unique,
  status      public.invitation_status not null default 'pending',
  invited_by  uuid references public.profiles (id) on delete set null,
  expires_at  timestamptz not null default (now() + interval '14 days'),
  accepted_at timestamptz,
  created_at  timestamptz not null default now()
);

create index invitations_org_idx on public.invitations (org_id);
-- At most one *pending* invite per (org, email).
create unique index invitations_unique_pending
  on public.invitations (org_id, lower(email))
  where status = 'pending';

-- ---------------------------------------------------------------------------
-- Create an invitation (admin+), returning it (incl. token) so the app can send
-- the link. Generates a cryptographically-strong token server-side.
-- ---------------------------------------------------------------------------
create or replace function public.create_invitation(
  p_org  uuid,
  p_email text,
  p_role public.org_role
)
returns public.invitations
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_inv public.invitations;
begin
  if not public.has_min_org_role(p_org, 'admin') then
    raise exception 'Only owners and admins can invite members';
  end if;
  if p_role not in ('member', 'admin') then
    raise exception 'Invitations may only grant member or admin';
  end if;

  insert into public.invitations (org_id, email, role, token, invited_by)
  values (
    p_org,
    lower(trim(p_email)),
    p_role,
    encode(extensions.gen_random_bytes(32), 'hex'),
    auth.uid()
  )
  returning * into v_inv;

  return v_inv;
end;
$$;

-- ---------------------------------------------------------------------------
-- Accept an invitation by token. Requires the signed-in user's email to match.
-- ---------------------------------------------------------------------------
create or replace function public.accept_invitation(p_token text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_inv   public.invitations;
  v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into v_inv
  from public.invitations
  where token = p_token and status = 'pending' and expires_at > now()
  for update;

  if not found then
    raise exception 'Invitation is invalid or has expired';
  end if;
  if lower(v_inv.email) <> v_email then
    raise exception 'This invitation is for a different email address';
  end if;

  insert into public.org_members (org_id, user_id, role)
  values (v_inv.org_id, auth.uid(), v_inv.role)
  on conflict (org_id, user_id) do update set role = excluded.role;

  update public.invitations
  set status = 'accepted', accepted_at = now()
  where id = v_inv.id;

  return v_inv.org_id;
end;
$$;

-- ===========================================================================
-- Row Level Security — admins manage; nobody else sees invitations.
-- ===========================================================================
alter table public.invitations enable row level security;

create policy invitations_select on public.invitations
  for select to authenticated
  using (public.has_min_org_role(org_id, 'admin'));

create policy invitations_update on public.invitations
  for update to authenticated
  using (public.has_min_org_role(org_id, 'admin'))
  with check (public.has_min_org_role(org_id, 'admin'));

create policy invitations_delete on public.invitations
  for delete to authenticated
  using (public.has_min_org_role(org_id, 'admin'));

-- Inserts flow through create_invitation (definer); no direct client insert.

grant select, update, delete on public.invitations to authenticated;
grant select, insert, update, delete on public.invitations to service_role;

revoke execute on function public.create_invitation(uuid, text, public.org_role) from public;
grant  execute on function public.create_invitation(uuid, text, public.org_role) to authenticated;
revoke execute on function public.accept_invitation(text) from public;
grant  execute on function public.accept_invitation(text) to authenticated;
