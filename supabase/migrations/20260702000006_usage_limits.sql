-- =============================================================================
-- 0006 — Usage limits: enforce the per-plan system cap in the database.
--
-- The registry is written directly from the browser (under RLS), so a client
-- limit check alone is bypassable. This BEFORE INSERT trigger makes the cap
-- authoritative: it reads the org's plan and blocks inserts once the plan's
-- system allowance is reached. `null` allowance = unlimited.
--
-- The numbers here MUST match `PLAN_LIMITS` in src/lib/billing/plans.ts. They
-- are duplicated deliberately — the DB is the security boundary, the TS catalog
-- drives the UI. Keep them in sync when limits change.
-- =============================================================================

create or replace function public.plan_system_limit(p_plan public.plan_tier)
returns int
language sql
immutable
set search_path = ''
as $$
  select case p_plan
    when 'free' then 3
    when 'pro'  then 25
    else null            -- team = unlimited
  end;
$$;

create or replace function public.enforce_system_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_plan  public.plan_tier;
  v_limit int;
  v_count int;
begin
  select plan into v_plan from public.subscriptions where org_id = new.org_id;
  v_plan := coalesce(v_plan, 'free');

  v_limit := public.plan_system_limit(v_plan);
  if v_limit is null then
    return new; -- unlimited
  end if;

  select count(*) into v_count from public.systems where org_id = new.org_id;
  if v_count >= v_limit then
    raise exception 'Plan limit reached: the % plan allows % systems', v_plan, v_limit
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

create trigger systems_enforce_plan_limit
  before insert on public.systems
  for each row execute function public.enforce_system_limit();
