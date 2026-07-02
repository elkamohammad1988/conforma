/**
 * Request proxy — two concerns, composed:
 *
 *   1. **Locale** — detect the visitor's language on first request, forward it
 *      to Server Components via a header, and persist it in a cookie so the very
 *      first render is in the right language (no flash of the default locale).
 *
 *   2. **Session** (Production Mode only) — refresh the Supabase auth cookies
 *      and enforce protected routes. In Demo Mode (no Supabase env) this half is
 *      skipped entirely and behaviour is identical to before.
 *
 * (Next 16 renamed the `middleware` convention to `proxy`.)
 */
import { NextResponse, type NextRequest } from "next/server";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_HEADER,
  matchAcceptLanguage,
  resolveLocale,
} from "@/i18n/config";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { refreshSupabaseSession } from "@/lib/supabase/middleware";
import { authRedirect } from "@/lib/auth/routes";

function persistLocaleCookie(
  response: NextResponse,
  locale: string,
  alreadySet: boolean,
): void {
  if (alreadySet) return;
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
}

export async function proxy(request: NextRequest) {
  const cookieLocale = resolveLocale(request.cookies.get(LOCALE_COOKIE)?.value);
  const locale =
    cookieLocale ?? matchAcceptLanguage(request.headers.get("accept-language"));

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  // Demo Mode: locale only, exactly as before.
  if (!isSupabaseConfigured()) {
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    persistLocaleCookie(response, locale, Boolean(cookieLocale));
    return response;
  }

  // Production Mode: refresh session, then apply route protection.
  const { response, userId } = await refreshSupabaseSession(request, requestHeaders);
  const redirect = authRedirect(request.nextUrl.pathname, userId, request.nextUrl);

  if (redirect) {
    // Carry the rotated auth cookies onto the redirect so the session survives.
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    persistLocaleCookie(redirect, locale, Boolean(cookieLocale));
    return redirect;
  }

  persistLocaleCookie(response, locale, Boolean(cookieLocale));
  return response;
}

export const config = {
  // Run on pages only — skip static assets and API routes (which read the
  // locale from the request body / cookie themselves).
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
