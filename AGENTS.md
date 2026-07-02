# AGENTS.md

Guidance for AI coding agents (and humans) working in this repository. This
complements [CONTRIBUTING.md](CONTRIBUTING.md) — read that for the full workflow.

## Project in one line

Conforma turns the EU AI Act (Regulation (EU) 2024/1689) into a guided compliance
workflow: a deterministic risk classifier with cited rationale, an obligation
tracker, and an optional Claude-powered document drafter — all in a Next.js App
Router app.

## Environment notes

- **Next.js 16 + React 19.** This is newer than many training cutoffs. APIs and
  conventions (App Router, async `params`, `useSyncExternalStore` for client state)
  may differ from older Next.js. Prefer the patterns already in `src/` over recalled
  ones, and check `node_modules/next/dist/` docs when unsure.
- **Tailwind CSS v4** uses the CSS-first `@theme` config in `src/app/globals.css`
  (no `tailwind.config.js`).

## Where things live

| Area | Path |
| --- | --- |
| Encoded regulation (source of truth) | `src/lib/eu-ai-act.ts` |
| Deterministic classifier | `src/lib/classifier.ts` |
| Optional, server-only AI layer | `src/lib/claude.ts` |
| Registry persistence (external store) | `src/lib/store.ts` |
| Pages, layouts, API routes, SEO | `src/app/` |
| Reusable UI | `src/components/` |

## Non-negotiables

1. **The classifier stays deterministic and offline.** AI may add narrative or draft
   documents; it must never change a cited risk tier.
2. **Regulatory facts are typed data** in `eu-ai-act.ts`, never hard-coded in JSX.
3. **`ANTHROPIC_API_KEY` is server-only.** Never reference it from a client component.
4. **No secrets committed.** Only `.env.example` is tracked.

## Before you finish

Run and pass all four, with zero warnings:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
