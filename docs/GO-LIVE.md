# Go-live checklist

One sequential runbook to take Conforma from Demo Mode to a live, multi-tenant
production SaaS. Consolidates [DATABASE.md](DATABASE.md), [deployment.md](deployment.md)
and [OPERATIONS.md](OPERATIONS.md) into the order you actually run them.

Everything below is optional — skip a section and that capability simply stays in
its zero-credential fallback (Free plan / no auth / demo data).

## 0. Preflight (local, no credentials)

```bash
npm install
npm run lint && npm run typecheck && npm test && npm run build   # must be green
```

## 1. Database + auth (Supabase)

1. Create a project at https://supabase.com — note the **project ref**.
2. Apply the schema + RLS:
   ```bash
   supabase link --project-ref <ref>
   supabase db push
   ```
3. Put these in `.env.local` (Project Settings → API):
   ```
   NEXT_PUBLIC_SUPABASE_URL="https://<ref>.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon>"
   SUPABASE_SERVICE_ROLE_KEY="<service_role>"     # server-only
   ```
4. Auth → URL Configuration: set **Site URL** and add redirect URLs
   `https://<domain>/auth/confirm` (+ `http://localhost:3000/auth/confirm` for dev).
5. **Prove tenant isolation:**
   ```bash
   npm run verify:rls        # expect 12× PASS, self-cleaning
   ```

## 2. Billing (Stripe) — optional

1. Create a **Product per paid plan** (Pro, Team), each with a monthly + annual price.
2. `.env.local`:
   ```
   STRIPE_SECRET_KEY="sk_live_…"          # server-only
   STRIPE_WEBHOOK_SECRET="whsec_…"        # server-only
   STRIPE_PRICE_PRO_MONTHLY="price_…"
   STRIPE_PRICE_PRO_ANNUAL="price_…"
   STRIPE_PRICE_TEAM_MONTHLY="price_…"
   STRIPE_PRICE_TEAM_ANNUAL="price_…"
   ```
3. Add a webhook endpoint → `https://<domain>/api/stripe/webhook`, events
   `checkout.session.completed` + `customer.subscription.*`. Enable the Customer Portal.
4. Local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

## 3. Deploy

1. Set every env var from `.env.example` in the host (Vercel: Settings → Env Vars).
   Set `NEXT_PUBLIC_APP_URL` to the production origin.
2. Deploy (`git push` → Vercel, or `npm run build && npm run start`).
3. Post-deploy smoke test:
   ```bash
   curl -s https://<domain>/api/health?deep=1     # {"status":"ok", database:"ok", ...}
   ```

## 4. Verify the customer journey

Walk the 10 acceptance criteria once, live:

1. Sign up → 2. verify email → 3. create organization → 4. classify a system →
5. confirm it persists (reload) → 6. invite a teammate (Team → Invite) →
7. subscribe (Settings → Billing → Upgrade) → 8. sign out, sign back in, data intact →
9. open the billing portal → 10. confirm RLS via `npm run verify:rls`.

## 5. Operational hardening (optional)

- Enable Supabase **PITR** (Settings → Database → Backups).
- Wire **error monitoring** into `captureError` (`src/lib/observability.ts`) — add `SENTRY_DSN`.
- Wire **analytics** in `resolveProvider` (`src/lib/analytics.ts`).
- Consider durable **rate limiting** (Vercel Firewall / Upstash) in front of the API routes.

See [OPERATIONS.md](OPERATIONS.md) for detail on each.
