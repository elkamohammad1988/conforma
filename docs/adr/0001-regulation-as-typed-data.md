# 1. Encode the regulation as typed data, not prose

- **Status:** Accepted
- **Date:** 2025-06

## Context

The EU AI Act is ~100 pages of legal text. Three parts of the product need to
agree on the same facts: the classifier (which tier?), the obligation checklist
(which duties?), and the document generator (what to cite?). If each embedded its
own reading of the regulation as inline strings or `if` branches, they would drift
apart, and an amendment would mean hunting through the codebase.

## Decision

Encode the regulation once, as typed data, in a single module
([`src/lib/eu-ai-act.ts`](../../src/lib/eu-ai-act.ts)): risk tiers, prohibited
practices, Annex III areas, obligations (with roles and citations), and the phased
deadlines. Everything else reads from it. Display strings live in the i18n
catalogs keyed by the same ids, so the data module stays locale-free.

## Consequences

- **Good:** one auditable source of truth; a citation is attached to the fact, not
  re-typed at each call site; adding an obligation is a single, typed edit.
- **Cost:** ids in `eu-ai-act.ts` and display text in `en.ts` must be kept in sync
  by convention (the type system enforces the *keys*, not that a label exists for
  every id). A future refactor could collapse this by sourcing all display text
  from the catalog and leaving only ids/citations in the data module.
