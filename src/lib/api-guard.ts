/**
 * Best-effort abuse guards for the public, unauthenticated AI routes.
 *
 * These cap the blast radius of the paid Claude endpoints (cost / DoS) and
 * reject oversized or malformed payloads before any generation runs. The rate
 * limiter is in-memory and per-instance — a pragmatic backstop, NOT a
 * substitute for durable edge rate limiting (Vercel Firewall, or KV/Upstash)
 * once a real ANTHROPIC_API_KEY is configured at scale.
 */
import "server-only";
import { NextResponse } from "next/server";
import type { z } from "zod";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const hits = new Map<string, number[]>();

/**
 * Hard ceiling on the request body, checked from `Content-Length` before the
 * body is read into memory. The per-field Zod caps are the authoritative limit;
 * this is a cheap early-out that rejects an oversized POST before `req.json()`
 * ever buffers it. Comfortably above a legitimate `result` payload.
 */
const MAX_BODY_BYTES = 64_000;

/** True if the request is within the allowed rate; false if it should be throttled. */
export function withinRateLimit(ip: string, max = MAX_PER_WINDOW): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic cleanup so the map can't grow unbounded on a long-lived instance.
  if (hits.size > 5_000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return recent.length <= max;
}

/**
 * Parse `?limit=&offset=` for a list endpoint, clamped to safe bounds so a
 * client can't request an unbounded page. Used by the public v1 API.
 */
export function parsePageParams(
  url: string,
  { defaultLimit = 50, maxLimit = 200 } = {},
): { limit: number; offset: number } {
  const params = new URL(url).searchParams;
  const rawLimit = Number(params.get("limit"));
  const rawOffset = Number(params.get("offset"));
  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0
      ? Math.min(Math.floor(rawLimit), maxLimit)
      : defaultLimit;
  const offset =
    Number.isFinite(rawOffset) && rawOffset > 0 ? Math.floor(rawOffset) : 0;
  return { limit, offset };
}

/**
 * Best-effort client IP for the rate-limit bucket key.
 *
 * Prefer `x-real-ip`, which the hosting platform (Vercel) sets from the trusted
 * connecting hop, over the *leftmost* `x-forwarded-for` token — that token is
 * client-supplied and trivially spoofable, so keying on it lets an attacker land
 * every request in a fresh bucket and defeat the cap. This only holds behind a
 * trusted proxy that overwrites these headers; it is a backstop, not a security
 * boundary (see the module header on durable edge limiting).
 */
export function clientIp(req: Request): string {
  return (
    req.headers.get("x-real-ip")?.trim() ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

/**
 * The single gate for both AI routes: rate-limit, parse JSON, and validate the
 * body against its Zod schema. Returns the typed data on success, or a ready-to
 * -return error `Response` (429 throttled · 400 malformed · 413 too long).
 */
export async function parseAiBody<T>(
  req: Request,
  schema: z.ZodType<T>,
): Promise<{ data: T } | { response: Response }> {
  if (!withinRateLimit(clientIp(req))) {
    return {
      response: NextResponse.json(
        { error: "Too many requests. Please slow down and try again shortly." },
        { status: 429 },
      ),
    };
  }

  const declaredLength = Number(req.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return {
      response: NextResponse.json({ error: "Input too long." }, { status: 413 }),
    };
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return {
      response: NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }),
    };
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    // Preserve the "413 Payload Too Large" semantic for over-cap fields.
    const tooBig = parsed.error.issues.some((i) => i.code === "too_big");
    return {
      response: NextResponse.json(
        { error: tooBig ? "Input too long." : "Invalid request body." },
        { status: tooBig ? 413 : 400 },
      ),
    };
  }

  return { data: parsed.data };
}
