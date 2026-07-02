# Architecture Decision Records

Short records of the decisions that shaped Conforma — the context, the choice,
and what it costs. Each is immutable once accepted; a reversal is a new record
that supersedes the old one.

| # | Decision | Status |
|---|----------|--------|
| [0001](0001-regulation-as-typed-data.md) | Encode the regulation as typed data, not prose | Accepted |
| [0002](0002-deterministic-engine-ai-on-top.md) | Deterministic classifier; AI strictly layered on top | Accepted |
| [0003](0003-client-side-store-for-the-demo.md) | Client-side external store for the zero-credential demo | Accepted |
| [0004](0004-server-only-ai-with-demo-mode.md) | Server-only AI routes with a first-class Demo Mode | Accepted |
| [0005](0005-dual-mode-supabase-backend.md) | Dual-mode backend: Supabase when configured, localStorage otherwise | Accepted |

Format follows [Michael Nygard's ADR template](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).
