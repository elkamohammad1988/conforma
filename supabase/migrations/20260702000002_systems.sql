-- =============================================================================
-- 0002 — Domain data: the AI-system registry, obligation tracking, documents.
--
-- These tables are the persistent home for what the demo kept in localStorage:
-- every classified system, the status of each obligation, and every generated
-- compliance document. All are org-scoped and protected by the same membership
-- helpers introduced in 0001.
--
-- `answers` and `result` are stored as jsonb: they mirror the deterministic
-- classifier's own types (ClassificationAnswers / ClassificationResult), which
-- are the source of truth and are already Zod-validated at the API boundary.
-- `tier` and `is_gpai` are denormalized out of `result` so the registry can be
-- filtered and aggregated in SQL without unpacking jsonb on every row.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Enums (mirror the TypeScript domain types exactly)
-- ---------------------------------------------------------------------------
create type public.provider_role   as enum ('provider', 'deployer', 'both');
create type public.risk_tier       as enum ('prohibited', 'high', 'limited', 'minimal');
create type public.obligation_state as enum ('todo', 'in-progress', 'done');
create type public.document_type    as enum (
  'technical-documentation',
  'transparency-notice',
  'conformity-declaration'
);

-- ===========================================================================
-- systems — a classified AI system in an org's registry.
-- ===========================================================================
create table public.systems (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 200),
  description text not null default '',
  owner       text not null default '',
  role        public.provider_role not null default 'provider',
  answers     jsonb not null,
  result      jsonb not null,
  tier        public.risk_tier not null,
  is_gpai     boolean not null default false,
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index systems_org_idx         on public.systems (org_id);
create index systems_org_updated_idx on public.systems (org_id, updated_at desc);
create index systems_org_tier_idx    on public.systems (org_id, tier);

create trigger systems_set_updated_at
  before update on public.systems
  for each row execute function public.set_updated_at();

-- Can the current user reach this system (i.e. is it in an org they belong to)?
-- Single joined query, SECURITY DEFINER — used by child-table policies.
create or replace function public.can_access_system(p_system uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.systems s
    join public.org_members m on m.org_id = s.org_id
    where s.id = p_system and m.user_id = auth.uid()
  );
$$;

-- ===========================================================================
-- obligation_status — per-obligation task state for a system.
--
-- Normalized (rather than a jsonb blob on `systems`) so each obligation carries
-- its own updated_at / updated_by — a real audit trail for a compliance tool,
-- and cheap to aggregate ("N of M obligations done across the org").
-- ===========================================================================
create table public.obligation_status (
  system_id     uuid not null references public.systems (id) on delete cascade,
  obligation_id text not null check (char_length(obligation_id) between 1 and 200),
  state         public.obligation_state not null default 'todo',
  updated_at    timestamptz not null default now(),
  updated_by    uuid references public.profiles (id) on delete set null,
  primary key (system_id, obligation_id)
);

create trigger obligation_status_set_updated_at
  before update on public.obligation_status
  for each row execute function public.set_updated_at();

-- ===========================================================================
-- documents — generated compliance documents (persisted, not ephemeral).
-- ===========================================================================
create table public.documents (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations (id) on delete cascade,
  system_id   uuid references public.systems (id) on delete set null,
  doc_type    public.document_type not null,
  title       text not null default '',
  content     text not null,
  locale      text,
  model       text,
  created_by  uuid references public.profiles (id) on delete set null,
  created_at  timestamptz not null default now()
);

create index documents_org_created_idx on public.documents (org_id, created_at desc);
create index documents_system_idx      on public.documents (system_id);

-- ===========================================================================
-- Row Level Security — everything gated by org membership.
-- ===========================================================================
alter table public.systems           enable row level security;
alter table public.obligation_status enable row level security;
alter table public.documents         enable row level security;

-- systems: any member of the owning org has full CRUD.
create policy systems_select on public.systems
  for select to authenticated
  using (public.is_org_member(org_id));

create policy systems_insert on public.systems
  for insert to authenticated
  with check (public.is_org_member(org_id) and created_by = auth.uid());

create policy systems_update on public.systems
  for update to authenticated
  using (public.is_org_member(org_id))
  with check (public.is_org_member(org_id));

create policy systems_delete on public.systems
  for delete to authenticated
  using (public.is_org_member(org_id));

-- obligation_status: reachable iff the parent system is reachable.
create policy obligation_status_select on public.obligation_status
  for select to authenticated
  using (public.can_access_system(system_id));

create policy obligation_status_insert on public.obligation_status
  for insert to authenticated
  with check (public.can_access_system(system_id));

create policy obligation_status_update on public.obligation_status
  for update to authenticated
  using (public.can_access_system(system_id))
  with check (public.can_access_system(system_id));

create policy obligation_status_delete on public.obligation_status
  for delete to authenticated
  using (public.can_access_system(system_id));

-- documents: member CRUD, scoped by org.
create policy documents_select on public.documents
  for select to authenticated
  using (public.is_org_member(org_id));

create policy documents_insert on public.documents
  for insert to authenticated
  with check (public.is_org_member(org_id) and created_by = auth.uid());

create policy documents_delete on public.documents
  for delete to authenticated
  using (public.is_org_member(org_id));

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
grant select, insert, update, delete on public.systems           to authenticated;
grant select, insert, update, delete on public.obligation_status to authenticated;
grant select, insert, update, delete on public.documents         to authenticated;

grant select, insert, update, delete on public.systems           to service_role;
grant select, insert, update, delete on public.obligation_status to service_role;
grant select, insert, update, delete on public.documents         to service_role;
