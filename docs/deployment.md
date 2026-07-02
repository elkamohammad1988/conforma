# Deployment

Conforma is a standard Next.js 16 app and deploys anywhere Next.js runs. It needs no
database or external service to function — without an Anthropic key the API routes
run in **Demo Mode**, returning realistic pre-generated AI documents, so a public
deployment is fully functional with zero paid credentials.

## Prerequisites

- Node.js `>= 20`
- (Optional) An `ANTHROPIC_API_KEY` to upgrade Demo Mode to live AI drafting

## Deploy to Vercel (recommended)

1. Push the repository to GitHub.
2. In [Vercel](https://vercel.com/new), **Import** the repository. The framework is
   auto-detected as Next.js — no build configuration needed.
3. (Optional) Add environment variables in **Settings → Environment Variables**:
   - `ANTHROPIC_API_KEY` — enables Claude drafting
   - `NEXT_PUBLIC_APP_URL` — your production URL, e.g. `https://conforma.example.com`
     (used for canonical/OG links and `sitemap.xml`)
4. Deploy. Subsequent pushes to `main` deploy automatically.

## Deploy to any Node host

```bash
npm ci
npm run build
npm run start        # serves on $PORT (default 3000)
```

Put it behind a reverse proxy (Nginx, Caddy) terminating TLS, and set the same
environment variables in your process manager.

### Docker (illustrative)

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "run", "start"]
```

## Environment variables

All optional — with none set the app runs in Demo Mode. Add them to switch on
Production Mode. Full annotated list in [`.env.example`](../.env.example).

| Variable | Group | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | AI | Live Claude drafting; Demo Mode when unset. |
| `NEXT_PUBLIC_APP_URL` | App | Absolute base URL for SEO/OG + auth redirects. |
| `NEXT_PUBLIC_SUPABASE_URL` | DB | Supabase project URL (public). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | DB | Supabase anon key (public; RLS protects data). |
| `SUPABASE_SERVICE_ROLE_KEY` | DB | **Server-only.** Bypasses RLS (webhooks, admin). |
| `STRIPE_SECRET_KEY` | Billing | **Server-only.** Enables subscriptions. |
| `STRIPE_WEBHOOK_SECRET` | Billing | **Server-only.** Verifies webhook signatures. |
| `STRIPE_PRICE_*` | Billing | Price IDs for Pro/Team monthly/annual. |

> Public `NEXT_PUBLIC_*` values are safe in the browser. `service_role` and Stripe
> secrets must never be exposed client-side.

## Pre-deploy checklist

```bash
npm run lint        # zero warnings/errors
npm run typecheck   # zero errors
npm test            # Vitest unit suite
npm run build       # clean production build
```

CI ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)) runs all four on
every push and pull request.

## Production Mode setup (database, auth, billing)

The multi-tenant backend is built in — provisioning it is configuration, not code.

1. **Supabase** — create a project, then from the repo:
   ```bash
   supabase link --project-ref <ref>
   supabase db push          # applies supabase/migrations/*
   ```
   Put the URL + anon key + service-role key in your environment. Configure Auth
   redirect URLs. Full steps: [DATABASE.md](DATABASE.md).
2. **Verify tenant isolation** against the live DB:
   ```bash
   npm run verify:rls        # 12 isolation checks, self-cleaning
   ```
3. **Stripe** (optional) — create Pro/Team products + prices, set the secret key,
   price IDs and a webhook (`/api/stripe/webhook`) signing secret. Steps in the
   Billing section of [DATABASE.md](DATABASE.md).
4. **Deploy** and set all env vars. Post-deploy, check `GET /api/health?deep=1`.

Operational detail (logging, monitoring, backups, rate limiting) is in
[OPERATIONS.md](OPERATIONS.md); the system design is in
[architecture.md](architecture.md).
