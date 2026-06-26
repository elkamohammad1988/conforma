# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
  fallback to structured offline templates (`src/lib/claude.ts`).
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

[1.0.0]: https://github.com/elkamohammad1988/conforma/releases/tag/v1.0.0
