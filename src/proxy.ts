/**
 * Detects the visitor's language on their first request and forwards it to the
 * server so the very first render is already in the right locale (no flash of
 * the default language). The choice is then persisted in a cookie:
 *   - returning visitors: the cookie wins;
 *   - first visit: `Accept-Language` decides, and we write the cookie.
 *
 * The resolved locale is also forwarded as a request header so Server
 * Components / `generateMetadata` can read it without re-parsing headers.
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

export function proxy(request: NextRequest) {
  const cookieLocale = resolveLocale(request.cookies.get(LOCALE_COOKIE)?.value);
  const locale =
    cookieLocale ?? matchAcceptLanguage(request.headers.get("accept-language"));

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (!cookieLocale) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  // Run on pages only — skip static assets and API routes (which read the
  // locale from the request body / cookie themselves).
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
