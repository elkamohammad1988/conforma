# API reference

Conforma exposes server-only route handlers: two draft AI content, one reports the
generation mode, one is a health check, and one receives Stripe webhooks. The
deterministic classifier runs client-side and has no HTTP surface; tenant data is
read/written directly via the RLS-scoped Supabase client, not a bespoke API.

All routes run on the Node.js runtime with a 60-second `maxDuration`. The two
`POST` routes are unauthenticated and therefore guarded: an in-memory,
per-instance rate limiter (**30 requests / minute / IP**, best-effort) and strict
[Zod](https://zod.dev) body validation ([`src/lib/schemas.ts`](../src/lib/schemas.ts)).
The Anthropic key is read only on the server ([`claude.ts`](../src/lib/claude.ts)
is marked `import "server-only"`), so it can never reach the browser bundle.

> **Demo Mode.** When `ANTHROPIC_API_KEY` is unset, the AI routes return realistic
> pre-generated drafts and set `source: "demo"`. Behaviour and status codes are
> otherwise identical, so the public deployment is fully exercisable.

---

## Shared types

```ts
type Locale = "en" | "ar" | "fr" | "es" | "zh-CN";
type AiSource = "claude" | "demo";

// The full result produced by the deterministic classifier (see classifier.ts).
// Validated element-deep on every request.
interface ClassificationResult {
  tier: "prohibited" | "high" | "limited" | "minimal";
  rationale: RationalePoint[];   // discriminated union on `kind`, each with a citation
  citations: string[];
  obligations: { id: string; title: string; description: string; citation: string; role: "provider" | "deployer" | "both" }[];
  deadline: { id: string; date: string; label: string; description: string; citation: string; appliesTo: string[] | "all" };
  isGPAI: boolean;
  confidence: number;            // 0–1
  narrative?: string;
}
```

### Error responses

Every route returns JSON `{ "error": string }` with one of these statuses:

| Status | Meaning |
| :---: | --- |
| `400` | Malformed JSON, or a body that fails schema validation |
| `413` | A text field exceeds its cap (name 200, description 4 000, organisation 200) |
| `429` | Rate limit exceeded for the caller's IP |
| `500` | Generation failed unexpectedly (the AI routes fall back to a draft before reaching this) |

---

## `POST /api/explain`

Returns a short, plain-language narrative explaining a classification.

**Request body**

```jsonc
{
  "systemName": "TalentRank — CV screening", // required, 1–200 chars
  "description": "Ranks inbound job applicants…", // optional, ≤ 4000 chars
  "result": { /* ClassificationResult */ },       // required
  "locale": "fr"                                   // optional; defaults to en
}
```

**`200` response**

```json
{ "narrative": "This system is classified as high-risk because…", "source": "claude" }
```

---

## `POST /api/generate-doc`

Drafts a regulatory document tailored to the system.

**Request body**

```jsonc
{
  "docType": "technical-documentation", // "technical-documentation" | "transparency-notice" | "conformity-declaration"
  "systemName": "TalentRank — CV screening", // required, 1–200 chars
  "description": "Ranks inbound job applicants…", // optional, ≤ 4000 chars
  "organisation": "Acme AI",                      // optional, ≤ 200 chars
  "result": { /* ClassificationResult */ },       // required
  "locale": "fr"                                   // optional
}
```

**`200` response**

```json
{
  "docType": "technical-documentation",
  "label": "Technical Documentation (Annex IV)",
  "markdown": "# Technical Documentation — TalentRank…",
  "source": "demo"
}
```

---

## `GET /api/ai-status`

Reports the current generation mode without exposing the key. In-product surfaces
read this from server-seeded context rather than fetching it per render, but the
endpoint is handy for health checks and external monitoring.

**`200` response**

```json
{ "mode": "demo", "demo": true }
```

---

## `GET /api/health`

Health check for uptime monitors and load balancers. Shallow by default; pass
`?deep=1` for a readiness probe that also pings the database (returns `503` if it
is unreachable).

**`200` response**

```json
{
  "status": "ok",
  "version": "1.1.0",
  "time": "2026-07-02T12:00:00.000Z",
  "services": { "database": "ok", "billing": "configured", "ai": "live" }
}
```

---

## `POST /api/stripe/webhook`

Receives Stripe events and is the **only** writer of subscription state. Verifies
the `stripe-signature` header against the raw body; returns `400` on a bad
signature and `503` if billing is not configured. Handles
`checkout.session.completed` and `customer.subscription.*`. Not called directly —
Stripe delivers to it. See [OPERATIONS.md](./OPERATIONS.md) and the Billing setup
in [DATABASE.md](./DATABASE.md).

---

## Authenticated API (v1)

Available in Production Mode. Create an **API key** in *Team → API keys* (owner/
admin). The plaintext key (`cfm_…`) is shown once; only its hash is stored. Send
it as a bearer token; the key resolves to exactly one organization and all data
is scoped to it.

### `GET /api/v1/systems`

Lists the AI systems in the key's organization.

```bash
curl -s https://your-app.com/api/v1/systems \
  -H "Authorization: Bearer cfm_your_key_here"
```

```json
{
  "systems": [
    { "id": "…", "name": "TalentRank — CV screening", "tier": "high",
      "isGPAI": false, "compliance": 45, "owner": "People Operations",
      "createdAt": "…", "updatedAt": "…" }
  ]
}
```

Returns `401` for a missing/invalid/revoked key.

---

## Example

```bash
curl -s https://conforma-ten.vercel.app/api/health
# {"status":"ok","version":"1.1.0",...}

curl -s https://conforma-ten.vercel.app/api/ai-status
# {"mode":"demo","demo":true}
```
