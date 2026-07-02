# 2. Deterministic classifier; AI strictly layered on top

- **Status:** Accepted
- **Date:** 2025-06

## Context

The product could have asked an LLM to read a system description and return a risk
tier. That is faster to build but wrong for compliance tooling: results would be
non-reproducible, unciteable, and impossible to defend in an audit — the exact
properties the EU AI Act demands of high-risk systems.

## Decision

Classification is a **deterministic decision tree**
([`classifier.ts`](../../src/lib/classifier.ts)) over a short questionnaire, with
strict precedence (`prohibited > high > limited > minimal`). Every branch attaches
the Article/Annex that drives it. The LLM is layered *on top* and may only do what
a decision tree cannot: write a plain-language narrative and draft documents. It
can never change a cited tier.

## Consequences

- **Good:** results are reproducible, traceable, and testable in isolation
  (`classifier.test.ts`, `eu-ai-act.test.ts`); the core engine needs no API key,
  so it runs offline and the public demo is fully functional.
- **Cost:** the questionnaire must be kept faithful to the regulation by hand; the
  engine can't infer nuance from free-text the way an LLM would. Considered
  acceptable — nuance belongs in human review, not in an unciteable model output.

## Alternatives considered

- *LLM-as-classifier:* rejected (non-reproducible, unciteable).
- *Rules engine / DSL:* over-engineered for a decision tree this small; a typed
  function is simpler to read and test.
