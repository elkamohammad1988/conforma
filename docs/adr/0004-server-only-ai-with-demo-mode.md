# 4. Server-only AI routes with a first-class Demo Mode

- **Status:** Accepted
- **Date:** 2025-06

## Context

The AI drafting layer needs a paid Anthropic key. Two risks follow: the key must
never reach the browser, and the public demo must stay fully functional for
visitors (and CI) who have no key. The paid endpoints are also unauthenticated,
so they are a cost/DoS surface.

## Decision

- The Anthropic integration lives in a module marked `import "server-only"`
  ([`claude.ts`](../../src/lib/claude.ts)); importing it from a client component is
  a **build error**, so the SDK and key can't be bundled for the browser.
- Route handlers ([`/api/explain`](../../src/app/api/explain/route.ts),
  [`/api/generate-doc`](../../src/app/api/generate-doc/route.ts)) share one guard
  ([`parseAiBody`](../../src/lib/api-guard.ts)) that rate-limits, then validates the
  body against a [Zod](https://zod.dev) schema element-deep before any prompt runs.
- When no key is configured — or a live call fails — generation falls back to a
  **Demo Mode** draft (`source: "demo"`), labelled in the UI, never an error.

## Consequences

- **Good:** the key is structurally contained; malformed input returns a clean
  `4xx` instead of a `500`; the repo and Vercel deployment work with zero
  credentials; a transient Anthropic outage degrades to a draft rather than a
  broken flow.
- **Cost:** the rate limiter is in-memory and per-instance — a pragmatic backstop,
  not durable edge limiting. At scale it should move to Vercel Firewall or an
  Upstash/KV counter. Demo-Mode document bodies are English (with a localized note
  explaining that a configured key drafts natively in the user's language).
