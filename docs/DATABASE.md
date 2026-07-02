# Database — schema, RLS & how to apply it

Conforma's production backend is **Supabase (PostgreSQL)**. This document covers
the schema, the security model, and the exact steps to stand it up. The app is
**dual-mode**: with no Supabase environment variables set it runs in Demo Mode
(localStorage, no backend) and none of this is required. Set the variables in
[`.env.example`](../.env.example) to switch on the real backend.

> Comprehensive architecture and API docs land in Phase 7. This file is the
> operational guide for Phase 1's data layer.

## Schema at a glance

| Table | Purpose | Tenant key |
| --- | --- | --- |
| `profiles` | One row per auth user (auto-created on signup) | — |
| `organizations` | The tenant boundary | `id` |
| `org_members` | Membership + role (`owner`/`admin`/`member`) | `org_id` |
| `systems` | Classified AI systems (the registry) | `org_id` |
| `obligation_status` | Per-obligation task state for a system | via `systems` |
| `documents` | Generated compliance documents | `org_id` |
| `audit_logs` | Append-only activity record | `org_id` |
| `subscriptions` | One billing row per org (Stripe-owned) | `org_id` |
| `invitations` | Pending team invites (token + role) | `org_id` |
| `api_keys` | Hashed programmatic-access tokens | `org_id` |

Migrations live in [`supabase/migrations/`](../supabase/migrations) and apply in
order:

1. `..._init_core.sql` — profiles, organizations, memberships, roles, RLS helpers.
2. `..._systems.sql` — registry, obligation tracking, documents.
3. `..._audit_logs.sql` — append-only audit log.

## Security model (Row Level Security)

RLS is **enabled on every table**. Access is decided by a handful of
`SECURITY DEFINER` helper functions so policies never recurse:

- `is_org_member(org)` — is the caller a member of this org?
- `has_min_org_role(org, min)` — does the caller hold at least this role? (owner > admin > member)
- `can_access_system(system)` — is this system in an org the caller belongs to?
- `shares_org_with(user)` — do the caller and this user share any org?

Each helper pins `search_path = ''` and references only fully-qualified objects —
the standard guard against `search_path` hijacking in definer functions.

**Roles:** `owner` (full control incl. delete + billing), `admin` (manage members
and data), `member` (use the product). The last owner of an org cannot be removed
or demoted (enforced by the `protect_last_owner` trigger).

**Trusted server paths:** the `service_role` key bypasses RLS and is used only for
legitimately cross-tenant, session-less work (webhooks, background jobs, system
audit writes). It must never reach the browser.

## Provisioning

```bash
# 1. Create a project at https://supabase.com (note the project ref).
# 2. Link this repo to it (prompts for the database password).
supabase link --project-ref <your-project-ref>

# 3. Apply all migrations.
supabase db push

# 4. Put the three values from Project Settings → API into .env.local:
#      NEXT_PUBLIC_SUPABASE_URL
#      NEXT_PUBLIC_SUPABASE_ANON_KEY
#      SUPABASE_SERVICE_ROLE_KEY     (server-only, never NEXT_PUBLIC)
```

To regenerate the typed schema after a migration change:

```bash
supabase gen types typescript --linked > src/lib/supabase/types.ts
```

## Authentication setup (Supabase Auth)

Auth uses Supabase's email + password provider. In the Supabase dashboard:

1. **Authentication → URL Configuration**
   - Set **Site URL** to your app origin (e.g. `https://your-app.com`).
   - Add **Redirect URLs** allow-list entries for every origin you use:
     `https://your-app.com/auth/confirm`, and `http://localhost:3000/auth/confirm`
     for local dev.
2. **Authentication → Providers → Email**
   - Keep **Confirm email** on for production (users verify before first sign-in).
   - The signup and password-reset links land on `/auth/confirm`, which verifies
     the token and establishes the session (see `src/app/auth/confirm/route.ts`).
3. **(Recommended) Email templates** — for the cleanest SSR flow, point the
   *Confirm signup* and *Reset password* templates at the token-hash form:
   `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/onboarding`
   The route also handles the default `?code=` (PKCE) links, so this is optional.

New users are auto-provisioned a `profiles` row (the `handle_new_user` trigger),
then create their first organization at `/onboarding` via the `create_organization`
RPC, which makes them its **owner**.

## Billing setup (Stripe)

Billing is optional — with no Stripe keys every org stays on the **Free** plan and
the billing panel says so. To enable paid plans:

1. In Stripe, create one **Product per paid plan** (Pro, Team), each with a
   **monthly** and an **annual** recurring price. Copy the price IDs into
   `.env.local` (`STRIPE_PRICE_PRO_MONTHLY`, …).
2. Set `STRIPE_SECRET_KEY`.
3. Add a webhook endpoint pointing at `https://your-app.com/api/stripe/webhook`,
   subscribed to `checkout.session.completed` and `customer.subscription.*`.
   Put its signing secret in `STRIPE_WEBHOOK_SECRET`.
4. Enable the **Customer Portal** in Stripe (Billing → Customer portal) so users
   can upgrade, downgrade, update cards and cancel.

The webhook (`src/app/api/stripe/webhook/route.ts`) is the *only* writer of
subscription state — RLS blocks clients from touching `subscriptions`. Plan
limits are enforced in the database (migration `0006`), so caps can't be
bypassed from the browser. Keep the numbers in `plan_system_limit()` in sync
with `PLAN_LIMITS` in `src/lib/billing/plans.ts`.

Locally, forward events with the Stripe CLI:
`stripe listen --forward-to localhost:3000/api/stripe/webhook`.

## Verifying tenant isolation

A live, self-cleaning isolation suite ships in `scripts/verify-rls.mjs`. With the
three keys in `.env.local` and the migrations applied:

```bash
npm run verify:rls
```

It creates two throwaway tenants (A, B) plus a member (C) and asserts that:

- B cannot **read / update / delete / insert-into** A's data (RLS returns zero rows);
- B cannot **join** A's org via `org_members`;
- a member (C) cannot **self-promote to owner** (migration 0004);
- A's data is intact and A sees exactly its own rows.

Every check must print `PASS`. The script exits non-zero on any failure and
deletes the test users/orgs afterwards.
