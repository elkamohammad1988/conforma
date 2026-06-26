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
`@anthropic-ai/sdk`, lucide-react). Keep it that way; review any new dependency for
maintenance health and license compatibility before adding it.

## Responsible disclosure

Found something? Please report it privately — see [SECURITY.md](../SECURITY.md). Do
not open a public issue for security matters.
