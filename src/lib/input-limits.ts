/**
 * Per-field input caps — the single source of truth shared by the client-side
 * form inputs (as `maxLength`) and the server-side Zod request schemas (as
 * `.max()`). Kept dependency-free (no `zod`, no `server-only`) so importing it
 * into a Client Component doesn't pull the validation stack into the browser
 * bundle. Keeping the cap in one place means the textarea and the API can never
 * disagree about what "too long" means.
 */
export const INPUT_LIMITS = {
  systemName: 200,
  description: 4_000,
  organisation: 200,
} as const;
