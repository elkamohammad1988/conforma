/**
 * Route-protection policy — the single source of truth for which paths require
 * authentication. Shared by the proxy (edge redirects) and the app-layout guard
 * (server-side backstop + org resolution) so the two never drift.
 *
 * This policy only takes effect in Production Mode (Supabase configured). In
 * Demo Mode every route stays open, exactly as before.
 */

import { NextResponse, type NextRequest } from "next/server";

/** The request URL type (`NextURL`), derived without importing an internal path. */
type NextURL = NextRequest["nextUrl"];

/** App routes that require a signed-in user. */
export const AUTH_REQUIRED = [
  "/dashboard",
  "/systems",
  "/classify",
  "/report",
  "/settings",
  "/onboarding",
  "/team",
] as const;

/** Auth pages a signed-in user should be bounced away from. */
export const AUTH_PAGES = ["/login", "/signup", "/forgot-password"] as const;

/** Where to send a user who lands on an app route without a session. */
export const SIGN_IN_PATH = "/login";
/** Where to send a signed-in user who has finished an auth page. */
export const AFTER_SIGN_IN_PATH = "/dashboard";

export function isAuthRequired(pathname: string): boolean {
  return AUTH_REQUIRED.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

export function isAuthPage(pathname: string): boolean {
  return AUTH_PAGES.some((r) => pathname === r);
}

/**
 * Decide the redirect (if any) for a request, given whether a user is present.
 * Returns a ready `NextResponse` redirect or `null` to proceed.
 */
export function authRedirect(
  pathname: string,
  userId: string | null,
  url: NextURL,
): NextResponse | null {
  if (isAuthRequired(pathname) && !userId) {
    const to = url.clone();
    to.pathname = SIGN_IN_PATH;
    to.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(to);
  }
  if (isAuthPage(pathname) && userId) {
    const to = url.clone();
    to.pathname = AFTER_SIGN_IN_PATH;
    to.search = "";
    return NextResponse.redirect(to);
  }
  return null;
}
