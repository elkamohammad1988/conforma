# Operations runbook

How Conforma is run in production: health, logging, monitoring, rate limiting,
security, and backups.

## Health checks

`GET /api/health` — shallow probe (fast, no external calls), reports configured
services and app version. Point uptime monitors / load balancers here.

`GET /api/health?deep=1` — readiness probe that also pings the database; returns
`503` if the DB is unreachable. Use for deploy gates, not high-frequency polling.

```json
{ "status": "ok", "version": "1.1.0", "services": { "database": "ok", "billing": "configured", "ai": "live" } }
```

## Structured logging

`src/lib/observability.ts` emits one JSON object per line via `logger.{info,warn,error}`.
On Vercel these appear in the function logs, already parsed into fields. Query by
`msg`, `level`, `scope`, etc. No secrets are logged.

## Error monitoring

`captureError(error, context)` is the single reporting choke point (used e.g. in
the Stripe webhook). It structured-logs today; to enable a provider, wire Sentry
(or similar) inside `captureError` — every existing call site starts reporting
with no other changes. Add `SENTRY_DSN` to the environment when you do.

## Product analytics

`src/lib/analytics.ts` exposes `track()` / `identify()` — no-ops until a provider
is attached in `resolveProvider()` (drop in PostHog/Segment). The app already
calls `identify` on session and `track` on billing upgrades; add more freely.

## Rate limiting

The unauthenticated AI routes (`/api/explain`, `/api/generate-doc`) are guarded by
`src/lib/api-guard.ts`: an in-memory sliding-window limiter (30 req/min/IP) plus
body-size and Zod field caps. This is a per-instance backstop — for durable,
cross-instance limiting at scale, put Vercel Firewall or Upstash Redis in front
(the guard is the seam to swap in). Auth endpoints are rate-limited by Supabase;
the Stripe webhook is signature-gated.

## Security posture

- **Transport/headers**: strict CSP, HSTS (preload), `X-Frame-Options: DENY`,
  `nosniff`, tight `Referrer-Policy` / `Permissions-Policy` — see `next.config.ts`.
  `connect-src` is same-origin plus the Supabase origin (REST + realtime).
- **Tenant isolation**: enforced in the database by RLS (see `DATABASE.md`),
  verified by `npm run verify:rls`.
- **Secrets**: `service_role` and Stripe secrets are server-only; `.env*` is
  git-ignored. Only public `NEXT_PUBLIC_*` values reach the browser.
- **Webhooks**: Stripe signatures verified against the raw body.

## Backup & recovery

Supabase provides managed Postgres backups:

- **Automated daily backups** on all paid projects; **Point-in-Time Recovery
  (PITR)** is available as an add-on for finer-grained restore.
- Enable PITR in *Project Settings → Database → Backups* for production.
- **Restore**: use the Supabase dashboard (Backups) or `supabase db dump` +
  `psql` restore into a fresh project. Test a restore periodically.
- **Schema is code**: `supabase/migrations/*` is the source of truth — a project
  can be rebuilt from scratch with `supabase db push`.
- The application registry data lives entirely in Postgres (Production Mode), so
  a database backup is a complete data backup. Generated documents and audit
  logs are included.

## Local development

```bash
npm install
cp .env.example .env.local          # blank = Demo Mode (no backend needed)
npm run dev                          # http://localhost:3000
```

Run against a real backend locally by filling `.env.local` (Supabase, optionally
Stripe), then:

```bash
npm run check:env                    # validate config (flags partial groups)
supabase db push                     # apply migrations to your project
npm run seed                         # demo user + org + systems (needs service role)
npm run verify:rls                   # prove tenant isolation (12 checks)
stripe listen --forward-to localhost:3000/api/stripe/webhook   # if testing billing
```

Sign in with the seeded credentials printed by `npm run seed`.

## Deploy

Preflight (all must pass — this is the CI gate):

```bash
npm run check:env                    # no partial/mis-configured env groups
npm run lint && npm run typecheck && npm test && npm run build
```

Deploy target: Vercel (or any Node host). Set every variable from `.env.example`
in the host; apply DB migrations with `supabase db push` before cutover; verify
`GET /api/health?deep=1` after. Rollback procedures for every layer are in
[ROLLBACK.md](ROLLBACK.md).
