/**
 * Browser Supabase client (singleton).
 *
 * Runs in the user's browser under their session cookie, so every query it
 * issues is scoped by Row Level Security to the tenant the user belongs to —
 * this is the primary read/write path for the reactive registry store. Returns
 * `null` in Demo Mode so callers fall back to localStorage without branching on
 * env themselves.
 */

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./config";
import type { Database } from "./types";

let cached: SupabaseClient<Database> | null = null;

/** The shared browser client, or `null` in Demo Mode. */
export function getSupabaseBrowserClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null;
  cached ??= createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  return cached;
}
