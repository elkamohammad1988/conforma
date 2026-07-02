# Contributing to Conforma

Thanks for your interest in improving Conforma! This document covers how to get
set up, the standards we hold code to, and how to propose changes.

By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting started

```bash
git clone https://github.com/elkamohammad1988/conforma.git
cd conforma
npm install
npm run dev
```

No credentials are required to run the app. To exercise the live AI drafting path,
copy `.env.example` to `.env.local` and set `ANTHROPIC_API_KEY` (see the
[README](README.md#environment-variables)).

## Development workflow

1. **Open an issue first** for anything beyond a trivial fix, so we can agree on the
   approach before you invest time.
2. **Create a branch** from `main`: `git checkout -b feat/short-description`.
3. **Make your change**, keeping it focused — one concern per PR.
4. **Run the full check suite** locally before pushing (see below).
5. **Open a pull request** against `main` and fill in the template.

## Quality gates

Every change must pass all four checks — CI enforces them on each PR:

```bash
npm run lint        # ESLint — zero warnings, zero errors
npm run typecheck   # tsc --noEmit — zero errors
npm test            # Vitest unit suite — all green
npm run build       # production build must succeed cleanly
```

## Coding standards

- **TypeScript, strict.** No `any` unless genuinely unavoidable and commented.
- **Match the surrounding style.** Read nearby code first; mirror its naming,
  comment density and structure. The codebase favours small, well-named functions
  and typed data over cleverness.
- **Keep the regulation as the single source of truth.** New regulatory facts go in
  [`src/lib/eu-ai-act.ts`](src/lib/eu-ai-act.ts) as typed, cited data — not inline in
  components.
- **AI is an enhancement, never an authority.** The deterministic classifier
  ([`classifier.ts`](src/lib/classifier.ts)) must remain reproducible and offline.
  Claude may add narrative or draft documents but must never override a cited tier.
- **Secrets stay server-side.** Anything touching `ANTHROPIC_API_KEY` belongs in a
  route handler or a server-only module.
- **No debug noise.** No leftover `console.log`, commented-out code, or dead exports.

## Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Annex IV DOCX export
fix: correct Art. 6(3) derogation deadline mapping
docs: clarify environment variables
refactor: extract registry into an external store
chore: bump eslint-config-next
```

## Reporting bugs & requesting features

Use the [issue templates](https://github.com/elkamohammad1988/conforma/issues/new/choose).
For **security vulnerabilities**, do **not** open a public issue — follow
[SECURITY.md](SECURITY.md) instead.

## License

By contributing, you agree that your contributions will be licensed under the
[MIT License](LICENSE).
