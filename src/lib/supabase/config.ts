/**
 * Supabase configuration + dual-mode detection.
 *
 * Conforma runs in one of two modes, decided entirely by environment:
 *
 *   • **Demo Mode** (no Supabase env vars) — the historical zero-credential
 *     experience. The registry lives in localStorage; the public GitHub repo and
 *     Vercel deploy work with no backend. Nothing here changes that path.
 *
 *   • **Production Mode** (Supabase configured) — real Postgres, auth, RLS and
 *     multi-tenancy. Activated the moment the two public vars below are present.
 *
 * Only the URL + anon key are referenced here, so this module is safe to import
 * from client components. The service-role key is server-only (see `admin.ts`).
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Explicit override that forces Demo Mode even when Supabase credentials exist.
 *
 * Set `NEXT_PUBLIC_DEMO=1` on the public portfolio deploy to serve the whole
 * product as a frictionless, no-sign-up demo (localStorage registry, open
 * routes) while KEEPING the real Supabase/Stripe env in place — so the
 * dual-mode "Production" architecture is still wired and one flag flips it back.
 * Without this flag, presence of the Supabase vars alone selects Production Mode.
 */
export const FORCE_DEMO =
  process.env.NEXT_PUBLIC_DEMO === "1" || process.env.NEXT_PUBLIC_DEMO === "true";

/**
 * True when the app should talk to Supabase (Production Mode). Returns `false`
 * when `NEXT_PUBLIC_DEMO` forces the demo, so this stays the single source of
 * truth every caller (proxy route-guard, store, auth context, AI entitlement)
 * reads — flipping it here flips the entire app uniformly.
 */
export function isSupabaseConfigured(): boolean {
  if (FORCE_DEMO) return false;
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}
