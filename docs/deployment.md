# Deployment

Conforma is a standard Next.js 16 app and deploys anywhere Next.js runs. It needs no
database or external service to function — the API routes degrade gracefully without
an Anthropic key.

## Prerequisites

- Node.js `>= 20`
- (Optional) An `ANTHROPIC_API_KEY` for live AI document drafting

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

| Variable | Required | Purpose |
| --- | :---: | --- |
| `ANTHROPIC_API_KEY` | No | Live Claude drafting; templates are used when unset. |
| `NEXT_PUBLIC_APP_URL` | No | Absolute base URL for SEO/OG (defaults to `http://localhost:3000`). |

> Set `NEXT_PUBLIC_APP_URL` in production so `sitemap.xml`, canonical tags and Open
> Graph images point at your real domain.

## Pre-deploy checklist

```bash
npm run lint        # zero warnings/errors
npm run typecheck   # zero errors
npm run build       # clean production build
```

CI ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)) runs all three on
every push and pull request.

## Scaling beyond the demo

The demo persists the registry in the browser. A multi-user production deployment
would add:

- **Database** — swap `src/lib/store.ts` for Postgres/Supabase with row-level
  security. The store interface is isolated to make this a localised change.
- **Auth & tenancy** — organisations, SSO/SAML, role-based access.
- **Background jobs** — for long-running document generation and exports.

See [architecture.md](architecture.md) for the seams these would plug into.
