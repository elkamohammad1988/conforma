# Rollback procedures

How to safely undo a change at each layer. Ordered from cheapest/fastest to most
involved. Know which one you need before you touch anything.

## 0. Fastest lever: fall back to Demo Mode

Because Conforma is dual-mode, **removing the Supabase env vars reverts the entire
app to the zero-credential Demo Mode** — no database, no auth, no billing. If a
backend problem is causing an outage and you need the marketing/demo surface up
immediately, unset `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
and redeploy. (Customer data is untouched in Postgres; it simply isn't served
until you restore the vars.) This is a stopgap, not a fix.

## 1. Roll back a deployment (bad code, good data)

The change built and deployed, but is misbehaving; the database is fine.

- **Vercel:** Deployments → find the last-known-good deployment → **Promote to
  Production** (instant, no rebuild). Or `vercel rollback`.
- **Any host:** redeploy the previous good commit:
  ```bash
  git checkout <last-good-sha>
  npm ci && npm run build && npm run start
  ```
- **Via git history:** `git revert <bad-sha>` (creates an inverse commit — safe on
  a shared branch) and deploy. Prefer `revert` over `reset` on anything pushed.

## 2. Roll back a migration (bad schema change)

Migrations in `supabase/migrations/` are **forward-only** — there are no down
files. To reverse a schema change, write a **new migration** that undoes it, then
`supabase db push`. Example (drop a column added by mistake):

```sql
-- supabase/migrations/<timestamp>_revert_add_foo.sql
alter table public.systems drop column if exists foo;
```

Never edit or delete an already-applied migration — that causes drift between
environments. Always move forward. If a migration is only half-applied and the
project is a throwaway, `supabase db reset` rebuilds from scratch (destroys data).

**Before any risky migration in production:** take a snapshot (see §3) so §3 is
available as the fallback.

## 3. Restore the database (bad data / destructive migration)

Data was corrupted or destroyed and code can't fix it.

- **Point-in-Time Recovery (PITR):** Supabase → Project Settings → Database →
  Backups → restore to a timestamp *just before* the incident. Enable PITR ahead
  of time (it can't recover time it wasn't running for).
- **Daily backup:** restore the most recent automated backup (Supabase dashboard).
- **Manual dump/restore** into a fresh project:
  ```bash
  supabase db dump -f backup.sql        # taken beforehand
  psql "$DATABASE_URL" -f backup.sql    # restore
  ```
- The schema itself is code (`supabase/migrations/`), so a project can always be
  rebuilt with `supabase db push`; §3 is about restoring the *rows*.

## 4. Roll back a Stripe/billing change

- Subscription state is Stripe-owned; the webhook re-syncs it. If the local
  projection is wrong, re-send the latest `customer.subscription.*` event from the
  Stripe dashboard (Webhooks → the endpoint → resend) to re-sync.
- To disable billing entirely, unset `STRIPE_SECRET_KEY` — every org falls back to
  the Free plan and the billing UI reports it as unconfigured.

## Decision guide

| Symptom | Use |
| --- | --- |
| New deploy broken, data OK | §1 deployment rollback |
| Bad schema change | §2 forward "revert" migration |
| Data corrupted/lost | §3 PITR / backup restore |
| Backend outage, need demo up now | §0 fall back to Demo Mode |
| Wrong plan/subscription state | §4 resend Stripe event |
