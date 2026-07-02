-- =============================================================================
-- 0005 — Billing: one subscription row per organization.
--
-- Every org has exactly one subscription (1:1), defaulting to the free plan and
-- auto-created the moment an org is created. Stripe is the source of truth for
-- paid state; this table is the local projection, written ONLY by trusted server
-- code (webhooks) via the service role — never by the client. Members may read
-- their org's plan (to show usage/limits); they cannot mutate it.
-- =============================================================================

create type public.plan_tier as enum ('free', 'pro', 'team');

-- Mirrors Stripe's subscription.status values.
create type public.subscription_status as enum (
  'active',
  'trialing',
  'past_due',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'unpaid',
  'paused'
);

create table public.subscriptions (
  org_id                 uuid primary key references public.organizations (id) on delete cascade,
  plan                   public.plan_tier not null default 'free',
  status                 public.subscription_status not null default 'active',
  stripe_customer_id     text unique,
  stripe_subscription_id text unique,
  stripe_price_id        text,
  seats                  int,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index subscriptions_customer_idx on public.subscriptions (stripe_customer_id);

create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- Auto-provision a free subscription whenever an org is created (covers both the
-- create_organization RPC and any direct insert). SECURITY DEFINER so it can
-- write past the (deliberately write-closed) subscriptions RLS.
create or replace function public.handle_new_org()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.subscriptions (org_id) values (new.id)
  on conflict (org_id) do nothing;
  return new;
end;
$$;

create trigger on_organization_created
  after insert on public.organizations
  for each row execute function public.handle_new_org();

-- ===========================================================================
-- Row Level Security — members read; nobody writes from the client.
-- ===========================================================================
alter table public.subscriptions enable row level security;

create policy subscriptions_select on public.subscriptions
  for select to authenticated
  using (public.is_org_member(org_id));

-- No insert/update/delete policies for `authenticated`: subscription state is
-- owned by Stripe webhooks running under the service role.

grant select on public.subscriptions to authenticated;
grant select, insert, update, delete on public.subscriptions to service_role;
