# Security architecture

This document describes how Conforma handles secrets and data, both in the current
MVP and in a production deployment. For **reporting a vulnerability**, see
[SECURITY.md](../SECURITY.md).

## Secret handling

- **`ANTHROPIC_API_KEY` is server-only.** It is read exclusively inside route
  handlers via [`src/lib/claude.ts`](../src/lib/claude.ts), which is imported only
  from `/api/explain` and `/api/generate-doc`. It is never referenced from a client
  component and therefore never reaches the browser bundle.
- **No secrets in the repository.** The `.gitignore` excludes all `.env*` files
  except `.env.example`, which contains empty placeholders only. There are no API
  keys, tokens or credentials anywhere in the source.
- **No framework fingerprinting.** `poweredByHeader` is disabled in
  `next.config.ts`, so responses don't advertise the framework/version.

## Application security controls (implemented)

These ship in this repository today — not a roadmap:

- **HTTP security headers** ([`next.config.ts`](../next.config.ts)) on every
  response: a tight Content-Security-Policy (`default-src 'self'`, no third-party
  origins, `object-src 'none'`, `frame-ancestors 'none'`), HSTS with `preload`,
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, a strict
  `Referrer-Policy`, and a locked-down `Permissions-Policy`.
- **Enforced server-only boundary.** `claude.ts` and `api-guard.ts` carry
  `import "server-only"`, so an accidental client import is a build error.
- **Input validation.** Both AI routes validate the request body against a
  [Zod](https://zod.dev) schema ([`schemas.ts`](../src/lib/schemas.ts))
  element-deep before any prompt runs; malformed input returns `400`/`413`.
- **Abuse guard.** An in-memory rate limiter caps the unauthenticated AI routes at
  30 requests/minute/IP ([`api-guard.ts`](../src/lib/api-guard.ts)).
- **XSS-safe rendering.** Generated Markdown renders to React text nodes (no
  `dangerouslySetInnerHTML`) and JSON-LD is escaped; a regression test asserts
  hostile input is neutralised.
- **Supply chain.** CodeQL (`security-and-quality`) and Dependabot run in CI.

## Threat model (current surface)

| Surface | Risk | Mitigation |
| --- | --- | --- |
| Public `POST` AI routes | Cost abuse / DoS on the paid API | Rate limiting + input caps; graceful Demo Mode when unkeyed |
| Untrusted request body | Malformed data reaching prompt builders | Zod validation element-deep → `400`/`413` |
| Rendered AI / user content | Stored or reflected XSS | React text-node rendering; escaped JSON-LD; CSP |
| Clickjacking | UI redress | `X-Frame-Options: DENY` + `frame-ancestors 'none'` |
| Secret exposure | Key in client bundle or repo | `server-only` boundary; `.env*` git-ignored |
| Dependencies | Known CVEs | Dependabot + CodeQL |

Out of scope for the MVP (no auth or database yet): authorization, multi-tenant
isolation and CSRF — covered by the production roadmap below.

## Data handling in the MVP

The demo is intentionally credential-free:

- The AI system registry is stored in the visitor's own **`localStorage`** and is
  never transmitted to a server.
- The only outbound network call is the optional document/narrative generation,
  which sends the (user-authored) system details to the Anthropic API **only when a
  key is configured**.
- The demo form does not submit anywhere — it is a client-side mock.

## Production hardening (roadmap)

A multi-tenant production deployment would add the controls described on the
in-app [Security page](../src/app/security/page.tsx):

| Control | Approach |
| --- | --- |
| Encryption in transit | TLS 1.2+ everywhere |
| Encryption at rest | AES-256; secrets in a managed KMS |
| Data residency | EU regions for application and database |
| Access control | RBAC, SSO/SAML, enforced MFA, least privilege |
| Tenant isolation | Row-level security per organisation |
| Auditability | Append-only change log with actor + timestamp |
| Resilience | Automated backups and a tested recovery process |

These are the targets the data model and store interface are designed to support;
they are **not** all implemented in this portfolio MVP, which is documented honestly
rather than overstated.

## Dependencies

The dependency surface is deliberately small (Next.js, React, Tailwind,
`@anthropic-ai/sdk`, lucide-react, `zod`, `server-only`). Keep it that way; review
any new dependency for maintenance health and license compatibility before adding
it. CodeQL and Dependabot watch the surface continuously.

## Responsible disclosure

Found something? Please report it privately — see [SECURITY.md](../SECURITY.md). Do
not open a public issue for security matters.
