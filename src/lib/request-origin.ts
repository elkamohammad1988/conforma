/**
 * Resolve the absolute origin of the current request (server-only).
 *
 * Prefers the live forwarded host so redirect/callback URLs are correct across
 * dev, preview and production, falling back to the configured `SITE_URL`.
 */

import "server-only";
import { headers } from "next/headers";
import { SITE_URL } from "./site";

export async function requestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : SITE_URL;
}
