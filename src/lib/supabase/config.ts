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

/** True when the public Supabase credentials are present (URL + anon key). */
export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}
