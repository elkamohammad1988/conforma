-- =============================================================================
-- 0008 — API keys: programmatic, org-scoped access tokens.
--
-- Only a SHA-256 *hash* of each key is stored; the plaintext is shown to the
-- creator exactly once. Incoming API requests are authenticated by hashing the
-- presented token and matching `key_hash` (done server-side via the service
-- role, since API calls carry no user session). Keys are managed by org
-- owners/admins; revocation is a soft flag so the row remains for audit.
-- =============================================================================

create table public.api_keys (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references public.organizations (id) on delete cascade,
  name         text not null check (char_length(name) between 1 and 100),
  key_prefix   text not null,          -- shown for identification (e.g. cfm_ab12cd34)
  key_hash     text not null unique,   -- sha-256 hex of the full key
  last_used_at timestamptz,
  created_by   uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  revoked_at   timestamptz
);

create index api_keys_org_idx on public.api_keys (org_id);
create index api_keys_hash_idx on public.api_keys (key_hash);

-- ===========================================================================
-- Row Level Security — admins manage; the secret hash is never client-readable
-- in practice (queries select non-secret columns), and auth lookups use the
-- service role.
-- ===========================================================================
alter table public.api_keys enable row level security;

create policy api_keys_select on public.api_keys
  for select to authenticated
  using (public.has_min_org_role(org_id, 'admin'));

create policy api_keys_insert on public.api_keys
  for insert to authenticated
  with check (public.has_min_org_role(org_id, 'admin') and created_by = auth.uid());

create policy api_keys_update on public.api_keys
  for update to authenticated
  using (public.has_min_org_role(org_id, 'admin'))
  with check (public.has_min_org_role(org_id, 'admin'));

create policy api_keys_delete on public.api_keys
  for delete to authenticated
  using (public.has_min_org_role(org_id, 'admin'));

grant select, insert, update, delete on public.api_keys to authenticated;
grant select, insert, update, delete on public.api_keys to service_role;
