# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] — 2026-07-02

### Added

- **Settings page** (`/settings`) — appearance (theme), language, and registry-data
  controls (reset to / clear the seeded demo data), plus an About panel.
- **Alerts** — the app-bar bell opens a registry-driven notifications popover
  (prohibited practices, high-risk systems below target, the Art. 113 deadline).
- **Toast notifications** — a dependency-free primitive wired into the save,
  delete, copy and export flows.
- **Error boundaries** — a localized route-level `error.tsx` and a self-contained
  `global-error.tsx`.
- **Request validation** — Zod schemas validate the AI routes element-deep; a
  shared `parseAiBody` guard (rate-limit → parse → validate) returns clean
  `400`/`413`/`429`, and `claude.ts`/`api-guard.ts` are `import "server-only"`.
- **Expanded tests & coverage** — suites for the request schemas, the abuse guard,
  locale resolution, the translator, the store and cross-locale placeholder parity
  (84 tests); V8 coverage wired into CI.
- **CI hardening** — coverage artifact upload, CodeQL, Dependabot and Lighthouse
  CI; CI now runs on pull requests to any branch.
- **Engineering docs** — Architecture Decision Records (`docs/adr/`), an API
  reference (`docs/api.md`), an accessibility statement, and a threat model in the
  security doc.
- **Premium design system** — shared entrance/skeleton/hover-lift animations,
  custom scrollbars and rendered-markdown styling in `globals.css`, plus reusable
  primitives (`Skeleton`, `Spinner`, `EmptyState`, `Reveal`) and a dependency-free,
  XSS-safe `Markdown` renderer.
- **Flagship landing page** — interactive live classifier demo, an Art. 113
  compliance timeline with live status, an in-browser product showcase, scroll
  reveals and hover-lift cards.
- **Dashboard upgrades** — search (`/` to focus), tier filter, sort, client-side
  pagination, skeleton loading and a polished empty state.
- **Document export** — preview ⇄ raw toggle with one-click export to Markdown,
  Word (`.doc`) and PDF (print), with no new runtime dependencies.
- **Test suite** — Vitest unit tests for the deterministic classifier, the encoded
  regulation helpers, Demo Mode output and the Markdown renderer (incl. XSS
  escaping); wired into CI.
- **Security headers** — Content-Security-Policy, HSTS, `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy` via
  `next.config.ts`; a skip-to-content link for keyboard users.

### Changed

- **Localized demo documents** — demo-mode drafts carry a per-language note
  explaining the English sample and that a configured key drafts natively in the
  user's language.
- **AI mode via context** — the Demo Mode indicator reads a server-seeded value
  instead of fetching `/api/ai-status` on every mount.
- **Demo Mode** — when no `ANTHROPIC_API_KEY` is configured (or a request fails),
  AI generation now returns realistic, system-specific **pre-generated documents**
  instead of bare placeholder templates, and is clearly labelled as Demo Mode in the
  UI. Added `GET /api/ai-status` and a `DemoModeBadge` so the mode is shown
  proactively. The public repo and Vercel deployment are fully functional, premium
  and error-free with zero paid API credentials (`src/lib/claude.ts`).

### Fixed

- **Markdown parser hang** — a table-shaped line with no divider row could spin
  the renderer indefinitely; it now always makes progress.
- **Clean report printing** — the app sidebar and topbar are hidden and a legible
  light palette is forced when printing, even from the dark theme.
- **Dead controls removed** — Settings, Help and Notifications now resolve to real
  destinations (a settings page, the docs, and the alerts popover).
- **Light-theme colour leaks** — hardcoded dark-tuned values routed through the
  design tokens; the cinematic backdrop is softened in the light theme.
- **Accessibility** — mobile-navigation focus trap and dialog semantics; muted-text
  contrast raised to AA.

## [1.0.0] — 2026-06-26

First public release.

### Added

- **Risk-classification engine** — a deterministic decision tree mapping a guided
  questionnaire to one of four EU AI Act risk tiers, with Article-level cited
  rationale (`src/lib/classifier.ts`).
- **Encoded regulation** — Regulation (EU) 2024/1689 as a single typed source of
  truth: risk tiers, Art. 5 prohibited practices, all eight Annex III high-risk
  areas, Chapter III obligations, Art. 50 transparency duties, GPAI obligations,
  penalties and the Art. 113 application timeline (`src/lib/eu-ai-act.ts`).
- **Optional Claude integration** — server-only AI drafting of the Annex IV technical
  file, transparency notices and the EU declaration of conformity, with graceful
  fallback to a built-in Demo Mode (`src/lib/claude.ts`).
- **AI system registry** — classify, save, track obligations, and view a portfolio
  dashboard with risk distribution and deadline countdowns.
- **Printable readiness report** with an executive summary.
- **Marketing & legal surface** — landing, pricing, security, demo, privacy and
  terms pages.
- **SEO & social** — metadata, generated Open Graph image, JSON-LD structured data,
  `robots.txt` and `sitemap.xml`.

### Documentation

- World-class README, plus `docs/` (architecture, deployment, security, FAQ),
  `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md` and this changelog.
- GitHub Actions CI (lint · typecheck · test · build), issue templates and a PR template.

[Unreleased]: https://github.com/elkamohammad1988/conforma/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/elkamohammad1988/conforma/releases/tag/v1.0.0
