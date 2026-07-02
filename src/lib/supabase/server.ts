/**
 * Server Supabase client, bound to the request's cookies.
 *
 * Used from Server Components, Route Handlers and Server Actions. It reads the
 * session from cookies and refreshes it via `setAll`, so queries run as the
 * signed-in user and RLS applies. `server-only` guarantees this never leaks
 * into a client bundle. Returns `null` in Demo Mode.
 */

import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./config";
import type { Database } from "./types";

export async function createSupabaseServerClient(): Promise<SupabaseClient<Database> | null> {
  if (!isSupabaseConfigured()) return null;

  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // `setAll` was called from a Server Component, where cookies are
          // read-only. The middleware refreshes the session cookie instead, so
          // this is safe to ignore.
        }
      },
    },
  });
}
