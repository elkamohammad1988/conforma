# Conforma documentation

Conforma turns the EU AI Act (Regulation (EU) 2024/1689) into a guided compliance
workflow. It is **dual-mode**: a zero-credential demo out of the box, a full
multi-tenant SaaS once configured.

## Map

| Doc | What it covers |
| --- | --- |
| [GO-LIVE.md](GO-LIVE.md) | **Start here to launch** — one sequential runbook |
| [architecture.md](architecture.md) | System design, layers, dual-mode, request flow |
| [DATABASE.md](DATABASE.md) | Schema, RLS, auth setup, billing setup, isolation proof |
| [OPERATIONS.md](OPERATIONS.md) | Local dev, health, logging, monitoring, rate limiting, backups |
| [ROLLBACK.md](ROLLBACK.md) | Rollback procedures for every layer (deploy, migration, data) |
| [deployment.md](deployment.md) | Deploy + Production Mode provisioning + env vars |
| [api.md](api.md) | HTTP endpoints |
| [security.md](security.md) | Security posture |
| [accessibility.md](accessibility.md) | Accessibility approach |
| [../.env.example](../.env.example) | Annotated environment variables |
| [../AGENTS.md](../AGENTS.md) · [../CONTRIBUTING.md](../CONTRIBUTING.md) | Working in the repo |

## Developer onboarding (5 minutes)

```bash
git clone <repo> && cd conforma
npm install
cp .env.example .env.local     # leave blank to run in Demo Mode
npm run dev                     # http://localhost:3000
```

That's it — with no env vars the app is fully functional (localStorage, no login).

**Before every commit**, all four must pass with zero warnings:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

### Turning on Production Mode locally

1. Create a Supabase project; put its URL + keys in `.env.local`.
2. `supabase link --project-ref <ref> && supabase db push`
3. `npm run verify:rls` — proves tenant isolation (12 checks).
4. (Optional) add Stripe keys + `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

See [DATABASE.md](DATABASE.md) and [deployment.md](deployment.md) for detail.

## Where things live

| Area | Path |
| --- | --- |
| Encoded regulation (source of truth) | `src/lib/eu-ai-act.ts` |
| Deterministic classifier | `src/lib/classifier.ts` |
| Domain model / registry store | `src/lib/registry.ts`, `src/lib/store.ts` |
| Supabase clients + typed schema | `src/lib/supabase/` |
| Data access (repository) | `src/lib/data/` |
| Auth (session, routes, actions) | `src/lib/auth/`, `src/app/(auth pages)` |
| Billing (plans, Stripe, webhook) | `src/lib/billing/`, `src/app/api/stripe/` |
| Team (invitations, members) | `src/lib/team/`, `src/app/team/` |
| Observability + analytics | `src/lib/observability.ts`, `src/lib/analytics.ts` |
| Database schema + RLS | `supabase/migrations/` |
| i18n (5 locales, parity-tested) | `src/i18n/` |
