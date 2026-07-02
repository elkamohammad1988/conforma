-- =============================================================================
-- 0003 — Audit log: an append-only record of who did what, per org.
--
-- This is the substrate for the Activity Timeline and for compliance evidence.
-- Design:
--   * Append-only: there is NO update or delete policy, so once written a row
--     cannot be altered through the client API. Only service_role (server) can
--     ever mutate it, and it never should.
--   * Members can read their org's activity. Writes go through the
--     `log_audit_event` RPC (membership-checked) or trusted server code using
--     the service role — never a raw client insert.
-- =============================================================================

create table public.audit_logs (
  id          bigint generated always as identity primary key,
  org_id      uuid not null references public.organizations (id) on delete cascade,
  actor_id    uuid references public.profiles (id) on delete set null,
  action      text not null check (char_length(action) between 1 and 100),
  target_type text,
  target_id   text,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index audit_logs_org_created_idx on public.audit_logs (org_id, created_at desc);
create index audit_logs_target_idx      on public.audit_logs (org_id, target_type, target_id);

-- Membership-checked writer. Client callers may only log against an org they
-- belong to, and the actor is always pinned to the authenticated user — a
-- caller cannot forge `actor_id`. Server code that needs to log system events
-- (webhooks, background jobs) inserts directly via the service role instead.
create or replace function public.log_audit_event(
  p_org         uuid,
  p_action      text,
  p_target_type text default null,
  p_target_id   text default null,
  p_metadata    jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_org_member(p_org) then
    raise exception 'Not authorized to log for this organization';
  end if;

  insert into public.audit_logs (org_id, actor_id, action, target_type, target_id, metadata)
  values (p_org, auth.uid(), p_action, p_target_type, p_target_id, coalesce(p_metadata, '{}'::jsonb));
end;
$$;

-- ===========================================================================
-- Row Level Security — read-only for members, append-only overall.
-- ===========================================================================
alter table public.audit_logs enable row level security;

create policy audit_logs_select on public.audit_logs
  for select to authenticated
  using (public.is_org_member(org_id));

-- Intentionally: no insert/update/delete policies for `authenticated`.
-- Writes flow through log_audit_event (definer) or the service role.

grant select on public.audit_logs to authenticated;
grant select, insert on public.audit_logs to service_role;

revoke execute on function public.log_audit_event(uuid, text, text, text, jsonb) from public;
grant  execute on function public.log_audit_event(uuid, text, text, text, jsonb) to authenticated;
