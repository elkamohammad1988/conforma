/**
 * Email link handler — verifies signup confirmations and password-reset links,
 * establishing a session cookie, then forwards to `next`.
 *
 * Robust to both Supabase flows:
 *   • `token_hash` + `type`  — the recommended SSR email-template form (verifyOtp)
 *   • `code`                 — the default PKCE form (exchangeCodeForSession)
 *
 * On success the Supabase client writes the session cookies onto this response;
 * on failure we bounce to /login. See docs/DATABASE.md for the email-template note.
 */

import { type NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Only allow internal, single-slash redirect targets. */
function safeNext(next: string | null): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  const supabase = await createSupabaseServerClient();
  if (!supabase) return NextResponse.redirect(`${origin}/login`);

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/login?error=link`);
}
