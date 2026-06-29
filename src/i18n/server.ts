/**
 * Server-side locale resolution.
 *
 * Used by the root layout, every `generateMetadata`, and the OpenGraph image to
 * render the first response in the visitor's language. Resolution order:
 *   1. the `x-conforma-locale` header the middleware forwards (first visit),
 *   2. the persisted `NEXT_LOCALE` cookie (returning visitors),
 *   3. the `Accept-Language` header (best-effort fallback).
 *
 * Importing `next/headers` keeps this module server-only.
 */
import { cookies, headers } from "next/headers";
import {
  type Locale,
  LOCALE_COOKIE,
  LOCALE_HEADER,
  isLocale,
  matchAcceptLanguage,
  resolveLocale,
} from "./config";
import { getMessages } from "./messages";
import { createTranslator, type Translator } from "./translator";

export async function getServerLocale(): Promise<Locale> {
  const headerList = await headers();

  const fromHeader = headerList.get(LOCALE_HEADER);
  if (fromHeader && isLocale(fromHeader)) return fromHeader;

  const cookieStore = await cookies();
  const fromCookie = resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  if (fromCookie) return fromCookie;

  return matchAcceptLanguage(headerList.get("accept-language"));
}

/** A translator bound to the request's resolved locale (for Server Components). */
export async function getServerI18n(): Promise<Translator> {
  const locale = await getServerLocale();
  return createTranslator(locale, getMessages(locale));
}
