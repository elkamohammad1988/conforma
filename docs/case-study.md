# Case Study — Conforma

**EU AI Act compliance, automated.** A portfolio-grade product that encodes a
real, current EU regulation as typed software and puts a premium SaaS experience
on top of it.

| | |
| --- | --- |
| **Role** | Solo — product, architecture, engineering, design |
| **Type** | Portfolio / flagship project (production-shaped MVP) |
| **Stack** | Next.js 16 · React 19 · TypeScript (strict) · Tailwind CSS v4 |
| **AI** | Claude (`@anthropic-ai/sdk`), server-only, with a first-class Demo Mode |
| **Live demo** | https://conforma-ten.vercel.app |
| **Source** | https://github.com/elkamohammad1988/conforma |

---

## Problem

The EU AI Act (Regulation (EU) 2024/1689) is the world's first comprehensive AI
law. Like the GDPR, it reaches any organisation whose AI is placed on, or whose
output is used in, the EU market — regardless of where the company sits. The
core obligations for high-risk systems apply from **2 August 2026**, and the
penalties are severe: up to **€35M or 7% of worldwide turnover**.

Yet "getting compliant" today usually means a lawyer, a spreadsheet, and weeks of
cross-referencing a 100-page regulation — per AI system. There's no fast,
defensible, repeatable way for a team to answer three questions:

1. *Which risk tier is this system in, and why?*
2. *What exactly do we have to do about it?*
3. *Where's the evidence an auditor will accept?*

## Solution

Conforma encodes the regulation as **typed, citable logic** and wraps it in a
guided product:

- **Classify** — a five-step questionnaire maps each system to one of the four
  risk tiers (prohibited · high · limited · minimal), with every conclusion
  traced to a specific Article or Annex.
- **Close gaps** — a per-system obligation checklist (Chapter III / Art. 50),
  split by role (provider vs deployer), tracked To do → In progress → Done.
- **Document** — one click drafts the Annex IV technical file, the Art. 50
  transparency notice and the EU declaration of conformity, tailored per system.
- **Report** — a printable, audit-ready readiness report across the whole AI
  portfolio, with a live countdown to each phased deadline.

The result: from *"we don't know"* to a defensible, documented position in
minutes instead of weeks.

## Architecture

The design principle is a **single, typed source of truth** for the regulation,
consumed by a deterministic engine, with AI strictly layered on top — never able
to override a cited legal conclusion.

```
            ┌─────────────────────────────────────────────┐
            │  eu-ai-act.ts  (encoded Regulation 2024/1689) │
            │  tiers · prohibited · Annex III · obligations │
            │  · penalties · phased deadlines               │
            └───────────────┬─────────────────────────────┘
                            │ (one import, shared by all)
  questionnaire ─▶ classifier.ts (deterministic decision tree)
                            │
                            ▼
              risk tier + cited rationale + obligations
                   │                         │
                   ▼                         ▼
        store.ts (registry,         claude.ts (server-only AI layer)
        useSyncExternalStore         ├─ key set  ─▶ live Claude drafts
        + localStorage)              └─ no key   ─▶ Demo Mode drafts
                   │                         │
                   ▼                         ▼
        App Router pages: classify · dashboard · systems/[id] · report
```

**Key decisions**

| Decision | Why it matters |
| --- | --- |
| Regulation encoded as typed data, not prose | One auditable source the engine, checklist and docs all share — no drift. |
| Deterministic classifier; AI on top | Results are reproducible and every one cites an Article; the LLM can't change a legal conclusion. |
| Server-only Claude integration | The API key never reaches the browser; route handlers are the only caller. |
| First-class **Demo Mode** | No key? The app returns realistic, labelled pre-generated drafts, so the repo and deploy are fully functional with zero paid credentials. |
| `useSyncExternalStore` registry | SSR-safe client persistence with no hydration mismatch — and a clean seam to swap in Postgres/RLS later. |

A deeper write-up lives in [`docs/architecture.md`](architecture.md).

## Technical highlights

- **Regulation-as-code.** Tiers, prohibited practices, all Annex III high-risk
  areas, role-split obligations, penalties and the Art. 113 phased deadlines are
  one strongly-typed module. Change the law in one place; the whole app updates.
- **Pure, tested classification engine.** The decision tree is a pure function
  covered by a Vitest suite, so the risk logic is verifiable independent of the UI.
- **AI that degrades gracefully.** A single server-only module resolves
  live-Claude vs Demo Mode and tags every output with its provenance ("Drafted by
  Claude" vs "Demo Mode · sample AI output").
- **Live, client-resolved time.** Deadlines and countdowns compute against
  *today* on the client (no build-time freezing, no hydration mismatch).
- **Premium, accessible UI.** Tailwind v4 design tokens, scroll-reveal animations
  that respect `prefers-reduced-motion`, skeleton loading states, keyboard focus
  styles, a skip link, and a fully responsive layout down to mobile.
- **Document export with no server.** Generated drafts export to Markdown, Word
  and print-to-PDF entirely client-side.
- **SEO/social ready.** Generated Open Graph image, JSON-LD (SoftwareApplication +
  FAQ), `robots.txt` and `sitemap.xml` out of the box.
- **Green by default.** Strict TypeScript, ESLint (flat config), a Vitest suite
  and a production build — all wired into GitHub Actions CI.
- **Reproducible screenshots.** A committed Playwright script
  (`npm run screenshots`) drives a system browser to regenerate the entire image
  set at 2× — the marketing assets are themselves automated.

## Business value

- **Weeks → minutes.** A defensible, cited classification and first-draft
  documents without booking legal time per system.
- **Cheaper than the alternative.** A single high-risk audit from a law firm
  costs more than a year of the product; the spreadsheet approach carries the
  full risk of getting it wrong.
- **Defensible by construction.** Because every output cites the Article that
  drives it, the record is built to survive scrutiny rather than to look tidy.
- **One source of truth across teams.** Legal, product and security read the same
  registry — risk tier, evidence and the nearest deadline — instead of three
  conflicting spreadsheets.

## Screenshots

| | |
| :---: | :---: |
| ![Landing](screenshots/landing.png) | ![Classify wizard](screenshots/classify.png) |
| **Landing — the problem & urgency** | **Classify — guided, cited wizard** |
| ![Dashboard](screenshots/dashboard.png) | ![System detail](screenshots/system-detail.png) |
| **Dashboard — the AI system registry** | **System detail — rationale, obligations, docs** |
| ![Report](screenshots/report.png) | ![Pricing](screenshots/pricing.png) |
| **Report — audit-ready readiness sheet** | **Pricing — transparent plans** |
| ![Security](screenshots/security.png) | ![Mobile](screenshots/mobile.png) |
| **Security & Trust** | **Mobile — fully responsive** |

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 (`strict`) |
| UI | React 19 + Tailwind CSS v4 |
| Icons | lucide-react |
| AI (optional) | `@anthropic-ai/sdk` — Claude, server-only |
| Persistence (demo) | Browser `localStorage` via an external store |
| Tooling | ESLint 9 · `tsc` · Vitest · GitHub Actions CI · Playwright (screenshots) |

## What makes it different

- **It encodes a real, current law** — not a generic CRUD demo. The domain *is*
  the value, and it's modelled as types, not prose.
- **It's honest about AI.** The hard logic is deterministic and cited; AI is a
  drafting assistant that's clearly labelled and can't override the law.
- **It runs for anyone, instantly.** Demo Mode means no key, no database, no
  signup — `npm install && npm run dev` and the whole product works, premium and
  populated.
- **It's shaped like production.** Auth, billing and Postgres are intentionally
  *not* built, but every seam (store, AI layer, role model) is drawn exactly
  where a real SaaS would extend — so it reads as an architecture, not a toy.

---

> **Disclaimer:** Conforma is decision-support tooling, not legal advice. It
> encodes a good-faith, structured reading of Regulation (EU) 2024/1689 to power
> a compliance *workflow*; classifications should be confirmed with qualified
> counsel. It is an independent portfolio project, not affiliated with the EU.
