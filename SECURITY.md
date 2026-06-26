# Security Policy

## Supported versions

This is an actively developed portfolio project; the latest `main` is the only
supported version. Please ensure issues reproduce against the current `main` before
reporting.

## Reporting a vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, report them privately via one of:

- GitHub's [private vulnerability reporting](https://github.com/elkamohammad1988/conforma/security/advisories/new)
  (preferred), or
- Email to **elkabouri.moha1988@gmail.com** with the subject `SECURITY: conforma`.

Please include:

- A description of the issue and its impact
- Steps to reproduce (proof-of-concept if possible)
- Affected files, routes, or versions

You can expect an acknowledgement within **3 business days**. We will keep you
informed as we investigate and will credit you in the fix unless you prefer to
remain anonymous.

## Scope & secure-by-design notes

- **No secrets in the client.** The optional `ANTHROPIC_API_KEY` is read only in
  server-side route handlers ([`src/lib/claude.ts`](src/lib/claude.ts)); it is never
  exposed to the browser bundle.
- **No secrets in the repository.** Only `.env.example` (with empty values) is
  tracked; `.env*` files are git-ignored.
- **Demo persistence is local.** The registry is stored in the visitor's own
  `localStorage` and never transmitted to a server in this MVP.

For the data-handling and security architecture of a production deployment, see
[docs/security.md](docs/security.md).
