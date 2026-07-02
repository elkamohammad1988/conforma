# FAQ

## About the regulation

### Does the EU AI Act apply to us if we're not in the EU?

If your AI system is placed on the market in the EU, or its output is used in the
EU, the Act applies regardless of where your company is based — much like the GDPR.

### What is the August 2026 deadline?

Under Art. 113, the core obligations for high-risk systems (Annex III) and the
Art. 50 transparency duties become applicable on **2 August 2026** — the deadline
most organisations are racing toward. Prohibited practices applied from February
2025; GPAI and governance from August 2025; high-risk regulated products from
August 2027.

### How accurate is the classification?

Classification runs on a **deterministic decision tree** mapped directly to the
Act's text, so every result is traceable to specific Articles. AI is used only to
draft documentation and explanations — never to override the cited logic.

### Is Conforma legal advice?

**No.** Conforma is decision-support tooling that encodes the regulation as a
structured workflow with citations. It dramatically reduces the manual work, but you
should confirm classifications and obligations with qualified counsel. See the
[Disclaimer](../README.md#disclaimer).

## Using the app

### Do I need any API keys or accounts?

No. The classifier and obligation checklists run fully offline, and document
generation works out of the box in **Demo Mode** — realistic, pre-generated AI
documents, clearly labelled in the UI. An `ANTHROPIC_API_KEY` is optional and only
upgrades Demo Mode to live, system-specific drafting by Claude.

### Where is my data stored?

In this MVP, your registry is stored in your own browser's `localStorage` and is
never sent to a server. Clearing site data resets it. A production deployment would
use an EU-hosted database with row-level security (see
[security.md](security.md)).

### How do I enable live AI drafting?

Copy `.env.example` to `.env.local`, set `ANTHROPIC_API_KEY`, and restart the dev
server. Documents and explanations will then be drafted by Claude
(`claude-opus-4-8`); generated content is tagged with its source in the UI.

### What documents can it generate?

- **Technical Documentation** (Annex IV / Art. 11)
- **Transparency Notice** (Art. 50)
- **EU Declaration of Conformity** (Art. 47 / Annex V)

Each is tailored to the classified system and exportable as Markdown.

## For developers

### What's the tech stack?

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 ·
`@anthropic-ai/sdk`. See the [README](../README.md#tech-stack).

### How do I run the quality checks?

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

All four must pass with zero warnings — CI enforces this on every PR.

### How would I add a new obligation or high-risk area?

Add it as typed, cited data in [`src/lib/eu-ai-act.ts`](../src/lib/eu-ai-act.ts).
Because every consumer reads from that module, the classifier, checklist and
document generator pick it up automatically.
