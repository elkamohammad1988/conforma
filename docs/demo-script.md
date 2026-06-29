# Conforma — 90-Second Demo Script

A tight, timed walkthrough for a screen recording, a live client demo, or a
Loom/Upwork intro. It needs **no API key and no backend** — the whole product
runs on a static deploy with a self-seeding in-browser registry, so it never
fails on stage.

- **Total runtime:** ~90 seconds
- **Setup:** open the deployed URL (or `npm run dev`). The registry seeds three
  example systems on first load, so the dashboard and report are populated.
- **Tip:** speak the **bold** lines; the rest is stage direction.

---

### 0:00–0:12 — The problem (Landing)

> **"The EU AI Act is now in force, and it reaches any company whose AI touches
> the EU market. The catch: classifying a system today means a lawyer, a
> spreadsheet, and weeks against a 100-page regulation — with fines up to €35
> million."**

*Land on the home page. Point to the live countdown in the header — "high-risk
obligations apply 2 August 2026" — then scroll past the risk tiers.*

---

### 0:12–0:32 — Classification (Classify wizard)

> **"Conforma turns that into a guided workflow. I answer a few questions about
> one system…"**

*Click **Start free**. On the wizard, type a name ("CV screening model"), pick
**Provider**, advance to the high-risk step and tick **Employment & worker
management**.*

> **"…and the engine pins the risk tier instantly — High Risk — because the use
> case falls under Annex III. Notice every conclusion cites the exact Article."**

*Land on the result card: the dark **High Risk** header, the cited rationale
(`Annex III(4)`), the applicable deadline with a countdown, and the obligation
count.*

---

### 0:32–0:50 — Why it's trustworthy (Result + AI explanation)

> **"This isn't a guess from a language model — it's a deterministic decision
> tree mapped to the regulation's text, so it's reproducible and defensible in
> an audit. AI is layered on top only to explain and to draft."**

*Click **✨ Explain in plain English**. A plain-language narrative appears, tagged
with its source.*

> **"And here's the part that makes it demo-proof…"**

*Point at the **Demo Mode** pill.*

---

### 0:50–1:05 — Demo Mode, no API key (the technical hook)

> **"There's no API key configured here, so the app drops into Demo Mode and
> serves realistic, system-specific drafts — clearly labelled. The exact same
> code path calls Claude live the moment a key is present. That's why the public
> repo and this deployment are fully functional with zero paid credentials."**

*Save the system to the registry.*

---

### 1:05–1:20 — The portfolio view (Dashboard)

> **"Every classified system lands in one registry — risk tier, owner, a live
> compliance score as you close obligations, and the nearest deadline across the
> whole portfolio."**

*On the dashboard, sweep across the summary cards and the compliance-posture bar.
Open the **High Risk** system to show the obligation checklist with Article-level
citations, then click a document type (Technical Documentation) to show an
AI-drafted Annex IV file generate.*

---

### 1:20–1:30 — Audit-ready output + the close (Report)

> **"And one click produces an audit-ready readiness report you can hand to a
> regulator or print to PDF. From unknown to defensible in under two minutes —
> no compliance team required."**

*Click **Export report**, let the report sheet render, end on it.*

---

## Why this project is impressive (the 20-second technical version)

If asked "why is this good engineering?", hit these:

- **One typed source of truth.** The entire regulation — tiers, prohibited
  practices, Annex III areas, obligations, penalties and phased deadlines — lives
  in a single typed module (`src/lib/eu-ai-act.ts`). The classifier, the
  checklist and the document generator all read from it, so there's no drift.
- **Deterministic core, AI on top.** Risk tiers come from a pure, unit-tested
  decision tree — not an LLM — so results are reproducible and every one cites an
  Article. The AI layer can never override a cited legal conclusion.
- **Graceful degradation by design.** A first-class **Demo Mode** means the
  product is fully functional with no `ANTHROPIC_API_KEY`. The same server-only
  route handler calls Claude when a key exists. The key never reaches the browser.
- **SSR-safe state.** The registry persists in `localStorage` behind a
  `useSyncExternalStore` external store — no hydration mismatch, no effect-based
  refetching, and a clean seam to swap in Postgres later.
- **Production hygiene.** Strict TypeScript, ESLint, a Vitest suite over the
  classifier/obligation logic, generated OG image, JSON-LD, sitemap and robots —
  green typecheck, lint, tests and build, wired into CI.

> Portfolio framing: *"It's a lean Next.js 16 app that encodes a real, current EU
> regulation as software and puts a premium product on top — demonstrating the
> exact architecture a production compliance SaaS (auth + billing + Postgres)
> would grow into, while staying runnable by anyone in one command."*
