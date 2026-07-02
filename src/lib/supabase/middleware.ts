/**
 * Supabase session refresh for the Next.js proxy (middleware).
 *
 * On every matched request this reads the auth cookies, refreshes the access
 * token if needed, and writes the rotated cookies back onto the response — the
 * canonical `@supabase/ssr` pattern, adapted to compose with Conforma's existing
 * locale proxy (it threads through the same `requestHeaders` the locale layer
 * builds, so both concerns share one response).
 *
 * Only invoked when Supabase is configured; Demo Mode never touches this file.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";
import type { Database } from "./types";

export async function refreshSupabaseSession(
  request: NextRequest,
  requestHeaders: Headers,
): Promise<{ response: NextResponse; userId: string | null }> {
  let response = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Mirror onto the request (for any downstream reads in this pass) and
        // rebuild the response so Set-Cookie carries the rotated tokens.
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request: { headers: requestHeaders } });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // getUser() validates the JWT with the auth server and triggers a refresh
  // (hence a setAll) when the access token is stale. Do not remove.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, userId: user?.id ?? null };
}
