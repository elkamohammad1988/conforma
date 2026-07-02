# 3. Client-side external store for the zero-credential demo

- **Status:** Accepted
- **Date:** 2025-06

## Context

A portfolio project needs to be explorable in one click — no sign-up, no database
to provision, no secrets. But it must also demonstrate the shape a production SaaS
would take, so the persistence layer can't be a dead end.

## Decision

Persist the AI-system registry in `localStorage`, exposed through a small external
store ([`store.ts`](../../src/lib/store.ts)) that React reads via
`useSyncExternalStore`. The store's surface (`useSystems`, `saveSystem`,
`deleteSystem`, `compliancePct`, …) is deliberately the interface a repository
backed by Postgres + row-level security would implement.

## Consequences

- **Good:** zero-credential demo; SSR-safe with no hydration mismatch (a
  `getServerSnapshot` returns `null`, so the client owns the data); no effect-based
  refetching after a mutation. Seeding runs once at client module-init, keeping the
  snapshot getter pure.
- **Cost:** data is per-browser and not shared or durable — correct for a demo,
  unacceptable for production. Swapping to a server repository means implementing
  the same interface and moving reads to the server; the UI components would change
  little, but they are client components today and would need an auth/session
  boundary. Honest scope: that boundary is intentionally not built here.
