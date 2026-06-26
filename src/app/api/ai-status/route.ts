import { NextResponse } from "next/server";
import { aiMode } from "@/lib/claude";

export const runtime = "nodejs";
// Reflects server configuration, not request data — safe to evaluate per request.
export const dynamic = "force-dynamic";

/**
 * Lets the client show a Demo Mode indicator *before* generating anything,
 * without ever exposing the key itself — we only return the resolved mode.
 */
export async function GET() {
  const mode = aiMode();
  return NextResponse.json({ mode, demo: mode === "demo" });
}
