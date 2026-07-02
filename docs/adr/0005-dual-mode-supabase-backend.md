# 5. Dual-mode backend: Supabase when configured, localStorage otherwise

- **Status:** Accepted
- **Date:** 2026-07

## Context

[ADR 0003](0003-client-side-store-for-the-demo.md) chose a localStorage store so
the demo runs with zero credentials, and noted that a real deployment "would back
this with Postgres/Supabase + RLS." Turning Conforma into a SaaS that can hold
paying customers' data requires exactly that — a real database, authentication,
multi-tenancy and billing. But the zero-credential property is valuable in its own
right: it keeps the public repo, preview deploys and the sales demo working with
no setup and no secrets to leak. We did not want to trade one for the other.

## Decision

Make every backend capability **dual-mode**, selected purely by environment:

- **Demo Mode** (no env vars) — the historical experience is unchanged:
  localStorage persistence, no auth, seeded demo data.
- **Production Mode** (Supabase, and optionally Stripe, configured) — the same
  codebase becomes a multi-tenant SaaS: Postgres with Row Level Security, auth,
  organizations/roles, and Stripe billing.

The switch is centralized in `isSupabaseConfigured()` / `isStripeConfigured()`.
The registry store keeps its exact public API (`useSystems`, `saveSystem`, …) and
swaps its backend behind the scenes (`configureRegistryBackend`), so consuming
components never branch on mode. Tenant isolation is enforced in the database
(RLS), not just the app, and is verifiable with `npm run verify:rls`.

This supersedes the "localStorage only" stance of ADR 0003 (which remains the
Demo-Mode implementation) without superseding its rationale.

## Consequences

- **Good:** the public/demo experience is preserved byte-for-byte; production is a
  configuration change, not a fork; secrets never reach the browser; isolation is
  defence-in-depth (DB-level). Existing components and tests were untouched.
- **Good:** the store's external-store shape already modelled "null while loading,"
  so an async Supabase backend slotted in without changing the hook contract.
- **Cost:** two code paths to keep working, and some logic (auth guards, plan
  limits) is intentionally duplicated between the app and the database as the
  security boundary. The dual-mode branches must be exercised in both states.
- **Cost:** the hand-written `Database` type must track the migrations until a
  live project is linked and `supabase gen types` can regenerate it.
