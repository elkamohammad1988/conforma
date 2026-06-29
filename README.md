<div align="center">

<img src="src/app/icon.svg" alt="Conforma logo" width="76" height="76" />

# Conforma

### EU AI Act compliance, automated.

Turn **Regulation (EU) 2024/1689** into a guided workflow — inventory your AI systems,
auto-classify their risk tier with citations to the exact Articles, close the
obligations that apply, and generate the documentation regulators expect.

[![CI](https://github.com/elkamohammad1988/conforma/actions/workflows/ci.yml/badge.svg)](https://github.com/elkamohammad1988/conforma/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-2b3.svg)](LICENSE)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

<br/>

**▶ [Live demo](#)** &nbsp;·&nbsp; runs in **Demo Mode** — no sign-up, no API key, no backend
<br/>
<sub>Deploying your own? Replace the link above with your Vercel/Netlify URL.</sub>

<br/>

<img src="docs/screenshots/landing.png" alt="Conforma landing page" width="860" />

</div>

---

## Table of contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Installation](#installation)
- [Environment variables](#environment-variables)
- [Usage](#usage)
- [Folder structure](#folder-structure)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)
- [Contact](#contact)

---

## Overview

Every organisation now ships AI, and the EU AI Act reaches any AI that touches the
EU market — wherever the company is based, much like the GDPR. Yet "compliance"
today usually means a lawyer, a spreadsheet, and weeks cross-referencing a
100-page regulation, all against the **2 August 2026** deadline for high-risk
systems.

**Conforma encodes the regulation as typed, citable logic and puts a product on
top of it.** Answer a short questionnaire per system and you get a defensible risk
classification — every conclusion traceable to a specific Article or Annex — the
exact obligations that apply, a live countdown to your deadline, and first-draft
regulatory documents.

> [!NOTE]
> Conforma is a **portfolio-grade MVP**: a lean, fully working Next.js app that
> demonstrates the architecture a production SaaS (auth + billing + Postgres)
> would grow into. The registry persists in the browser so the whole product is
> demo-able with **zero credentials**. It is decision-support tooling, **not legal
> advice** — see the [Disclaimer](#disclaimer).

📂 **Portfolio:** read the full **[case study](docs/case-study.md)**, follow the
**[90-second demo script](docs/demo-script.md)**, or dive into the
**[architecture write-up](docs/architecture.md)**.

### Why it stands out

- **Cited, not vibes.** Risk tiers come from a deterministic decision tree mapped
  directly to the Act's text — every result links to the Article that drives it.
- **Works offline, scales online.** The core engine needs no API key. When an
  `ANTHROPIC_API_KEY` is absent the app drops into **Demo Mode** — realistic,
  system-specific pre-generated AI documents — so the public repo and the Vercel
  deployment are fully functional, and premium, with zero paid credentials.
- **One source of truth.** The entire regulation lives in a single typed module
  ([`eu-ai-act.ts`](src/lib/eu-ai-act.ts)) that the classifier, the obligation
  checklist and the document generator all read from.

---

## Screenshots

| Guided risk classifier | AI system registry (dashboard) |
| :---: | :---: |
| <img src="docs/screenshots/classify.png" alt="Guided risk-classification wizard" width="420" /> | <img src="docs/screenshots/dashboard.png" alt="AI system registry dashboard" width="420" /> |
| **System detail — rationale, obligations & AI docs** | **Audit-ready readiness report** |
| <img src="docs/screenshots/system-detail.png" alt="System detail with cited rationale and obligation checklist" width="420" /> | <img src="docs/screenshots/report.png" alt="Audit-ready compliance readiness report" width="420" /> |
| **Transparent pricing** | **Security &amp; trust** |
| <img src="docs/screenshots/pricing.png" alt="Pricing page" width="420" /> | <img src="docs/screenshots/security.png" alt="Security and trust page" width="420" /> |
| **Marketing landing** | **Mobile (responsive)** |
| <img src="docs/screenshots/landing.png" alt="Landing page" width="420" /> | <img src="docs/screenshots/mobile.png" alt="Mobile responsive view" width="240" /> |

> Every shot is generated from the running app with `npm run screenshots`
> (Playwright drives your installed Chrome/Edge at 2× — no browser download). A
> longer narrated walkthrough lives in **[docs/demo-script.md](docs/demo-script.md)**.

---

## Features

- 🧭 **Guided risk classification** — a five-step questionnaire maps each system to
  one of the four EU AI Act risk tiers (prohibited · high · limited · minimal).
- 📑 **Article-level citations** — every classification and obligation references the
  specific Article or Annex of Regulation (EU) 2024/1689, so it is defensible in an
  audit.
- ✅ **Obligation tracking** — a per-system checklist of the exact Chapter III / Art. 50
  duties, split by your role (provider vs deployer), with To do → In progress → Done.
- 📂 **AI system registry** — a portfolio dashboard with risk distribution, average
  compliance, and the nearest deadline across every system.
- 🤖 **AI-drafted documents** — generate the Annex IV technical file, Art. 50
  transparency notice and the EU declaration of conformity, tailored per system
  (powered by Claude when configured; realistic Demo Mode drafts otherwise, with a
  clear in-app indicator).
- ⏳ **Live deadline countdowns** — to each phased application date from Art. 113.
- 🧠 **GPAI aware** — flags general-purpose AI model obligations (Art. 53+) on top of
  the system-level tier.
- 🧾 **Printable readiness report** — an executive summary you can export to PDF.
- 🔍 **SEO & social ready** — metadata, Open Graph image, JSON-LD, `robots.txt` and
  `sitemap.xml` out of the box.

---

## Architecture

Conforma's design principle is a **single, typed source of truth** for the
regulation, consumed by a deterministic engine, with AI strictly layered on top —
never able to override a cited legal conclusion.

```mermaid
flowchart TD
    REG["eu-ai-act.ts<br/>encoded Regulation (EU) 2024/1689<br/>tiers · prohibited practices · Annex III · obligations · deadlines"]
    Q["Questionnaire answers"] --> ENG["classifier.ts<br/>deterministic decision tree"]
    REG --> ENG
    ENG --> R{"Risk tier<br/>+ cited rationale<br/>+ obligations"}
    R --> STORE["store.ts<br/>registry (useSyncExternalStore + localStorage)"]
    R --> AI["claude.ts<br/>optional drafting layer (server-only)"]
    AI -->|ANTHROPIC_API_KEY set| C["Claude documents & narrative (live)"]
    AI -->|no key / error| T["Demo Mode<br/>realistic pre-generated drafts"]
    STORE --> UI["App Router pages<br/>classify · dashboard · systems · report"]
    R --> UI
```

**Key decisions**

| Decision | Why |
| --- | --- |
| Regulation encoded as typed data, not prose | One auditable source the engine, checklist and docs all share. |
| Deterministic classifier, AI on top | Results are reproducible and traceable; AI never overrides cited logic. |
| Server-only Claude integration | The API key never reaches the browser; route handlers are the only caller. |
| `useSyncExternalStore`-backed registry | SSR-safe client persistence with no hydration mismatch and no effect-based refetching. |

A deeper write-up lives in **[docs/architecture.md](docs/architecture.md)**.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) (`strict`) |
| UI | [React 19](https://react.dev/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| Icons | [lucide-react](https://lucide.dev/) |
| AI (optional) | [`@anthropic-ai/sdk`](https://github.com/anthropics/anthropic-sdk-typescript) — Claude (`claude-opus-4-8`) |
| Persistence (demo) | Browser `localStorage` via an external store |
| Tooling | ESLint 9 (flat config) · `tsc` · Vitest · GitHub Actions CI |

---

## Installation

**Prerequisites:** Node.js `>= 20` and npm.

```bash
# 1. Clone
git clone https://github.com/elkamohammad1988/conforma.git
cd conforma

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev

# 4. Open http://localhost:3000
```

No credentials are required. With no `ANTHROPIC_API_KEY`, the app runs in **Demo
Mode**: the classifier works fully offline and document generation returns
realistic pre-generated AI drafts, clearly labelled in the UI.

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint with ESLint |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm test` | Run the Vitest unit suite |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run screenshots` | Regenerate `docs/screenshots/` from a running build (Playwright) |

---

## Environment variables

All variables are **optional** — copy the template and fill in only what you need:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | :---: | --- |
| `ANTHROPIC_API_KEY` | No | Enables live Claude drafting of compliance documents and plain-language narratives. Without it, Conforma runs in **Demo Mode** with realistic pre-generated drafts — no paid API required. Get one at [console.anthropic.com](https://console.anthropic.com/). |
| `NEXT_PUBLIC_APP_URL` | No | Public base URL used for absolute links, canonical tags and Open Graph (defaults to `http://localhost:3000`). |

> `.env.local` is git-ignored. **Never commit real secrets** — only `.env.example`
> is tracked.

---

## Usage

1. **Classify** — go to `/classify` and answer the guided questionnaire. The
   provisional tier updates live as you answer.
2. **Review** — see the cited rationale, the applicable deadline with a countdown,
   and the obligations that apply. Optionally generate a plain-language explanation.
3. **Register** — save the system to your registry (`/dashboard`).
4. **Close gaps** — open a system (`/systems/[id]`) and work the obligation
   checklist; generate the technical file, transparency notice or declaration of
   conformity.
5. **Report** — export a printable readiness report (`/report`) for stakeholders.

---

## Folder structure

```text
conforma/
├─ .github/                 # CI workflow, issue & PR templates
├─ docs/                    # Architecture, deployment, security, FAQ, screenshots
├─ src/
│  ├─ app/                  # Next.js App Router (pages, layouts, API routes, SEO)
│  │  ├─ api/               #   POST /api/explain · /api/generate-doc (server-only)
│  │  ├─ classify/          #   risk-classification wizard
│  │  ├─ dashboard/         #   AI system registry
│  │  ├─ systems/[id]/      #   per-system detail, checklist & document generation
│  │  ├─ report/            #   printable readiness report
│  │  ├─ (marketing)        #   pricing · security · demo · privacy · terms
│  │  ├─ layout.tsx         #   shell, nav, footer, metadata, JSON-LD
│  │  ├─ opengraph-image.tsx#   generated OG image
│  │  ├─ robots.ts · sitemap.ts
│  ├─ components/           # Reusable UI (RiskBadge, Countdown, PricingTable, …)
│  └─ lib/                  # Domain logic
│     ├─ eu-ai-act.ts       #   encoded regulation — single source of truth
│     ├─ classifier.ts      #   deterministic risk-classification engine
│     ├─ claude.ts          #   optional, server-only AI drafting layer
│     ├─ store.ts           #   registry persistence (external store)
│     └─ use-client-value.ts#   SSR-safe client-only value hook
├─ .env.example
└─ package.json
```

---

## Roadmap

This is a focused MVP; the data model is intentionally shaped to grow. Planned
directions:

- [ ] **Persistence** — swap the localStorage store for Postgres/Supabase with
      row-level security (the store interface is already isolated).
- [ ] **Auth & multi-tenancy** — organisations, SSO/SAML, role-based access.
- [ ] **Audit trail** — immutable change history per classification and document.
- [ ] **Annex IV exports** — DOCX/PDF generation of the technical file.
- [ ] **Regulation versioning** — track amendments and re-flag affected systems.
- [x] **Test suite** — Vitest unit tests over the classifier, obligation mapping and Demo Mode, wired into CI.

See [open issues](https://github.com/elkamohammad1988/conforma/issues) for the
current list.

---

## Contributing

Contributions are welcome! Please read **[CONTRIBUTING.md](CONTRIBUTING.md)** for the
development workflow, coding standards, and commit conventions, and our
**[Code of Conduct](CODE_OF_CONDUCT.md)**. Every PR is gated by CI (lint, typecheck,
build).

---

## License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

## Disclaimer

Conforma is **decision-support tooling, not legal advice**. It encodes a good-faith,
structured reading of Regulation (EU) 2024/1689 to power a compliance *workflow*.
Classifications, checklists and generated documents are informational; always
confirm them with qualified legal counsel before relying on them. This repository
is an independent portfolio project and is not affiliated with the European Union
or any regulatory authority.

---

## Contact

**ELKABOURI Mohammad**

- GitHub: [@elkamohammad1988](https://github.com/elkamohammad1988)
- Email: [elkabouri.moha1988@gmail.com](mailto:elkabouri.moha1988@gmail.com)
- Issues & ideas: [github.com/elkamohammad1988/conforma/issues](https://github.com/elkamohammad1988/conforma/issues)

<div align="center">

<sub>Built with Next.js, TypeScript and a great deal of care for the regulation.</sub>

</div>
