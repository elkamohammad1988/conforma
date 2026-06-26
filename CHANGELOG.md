# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Premium design system** — shared entrance/skeleton/hover-lift animations,
  custom scrollbars and rendered-markdown styling in `globals.css`, plus reusable
  primitives (`Skeleton`, `Spinner`, `EmptyState`, `Reveal`) and a dependency-free,
  XSS-safe `Markdown` renderer.
- **World-class landing page** — interactive live classifier demo, an Art. 113
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

- **Demo Mode** — when no `ANTHROPIC_API_KEY` is configured (or a request fails),
  AI generation now returns realistic, system-specific **pre-generated documents**
  instead of bare placeholder templates, and is clearly labelled as Demo Mode in the
  UI. Added `GET /api/ai-status` and a `DemoModeBadge` so the mode is shown
  proactively. The public repo and Vercel deployment are fully functional, premium
  and error-free with zero paid API credentials (`src/lib/claude.ts`).

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
- GitHub Actions CI (lint · typecheck · build), issue templates and a PR template.

[Unreleased]: https://github.com/elkamohammad1988/conforma/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/elkamohammad1988/conforma/releases/tag/v1.0.0
