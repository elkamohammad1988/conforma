/**
 * Service-role Supabase client — trusted server-side, bypasses RLS.
 *
 * The service-role key must never reach the browser, hence `server-only`. Use
 * this ONLY for operations that are legitimately cross-tenant or run without a
 * user session: Stripe webhooks, background jobs, system audit writes. For any
 * user-initiated request, prefer `createSupabaseServerClient()` so RLS still
 * enforces tenant boundaries.
 */

import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";
import type { Database } from "./types";

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/** True when the server holds a service-role key (in addition to the URL). */
export function isSupabaseAdminConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SERVICE_ROLE_KEY.length > 0;
}

/** A service-role client, or `null` when not configured. */
export function createSupabaseAdminClient(): SupabaseClient<Database> | null {
  if (!isSupabaseAdminConfigured()) return null;
  return createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
