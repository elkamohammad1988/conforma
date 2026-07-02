/**
 * Health check for uptime monitors and load balancers.
 *
 * Shallow by default (fast, no external calls) — reports which services are
 * configured. Pass `?deep=1` for a readiness probe that also pings the database.
 * Never cached.
 */

import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { aiMode } from "@/lib/claude";
import pkg from "../../../../package.json";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const deep = request.nextUrl.searchParams.get("deep") === "1";

  let database: "demo" | "configured" | "ok" | "error" = isSupabaseConfigured()
    ? "configured"
    : "demo";

  if (deep && isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      // Cheap, RLS-safe probe: HEAD count on a public table.
      const { error } = await supabase!
        .from("organizations")
        .select("id", { head: true, count: "exact" })
        .limit(1);
      database = error ? "error" : "ok";
    } catch {
      database = "error";
    }
  }

  const healthy = database !== "error";
  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      version: pkg.version,
      time: new Date().toISOString(),
      services: {
        database,
        billing: process.env.STRIPE_SECRET_KEY ? "configured" : "disabled",
        ai: aiMode(),
      },
    },
    { status: healthy ? 200 : 503 },
  );
}
