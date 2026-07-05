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
import { validateEnv } from "@/lib/env";
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

  const env = validateEnv();
  const healthy = database !== "error" && env.ok;

  // The detailed env report (which vars are missing/partial) is infra recon, so
  // it is only surfaced to an authorized caller — a shared HEALTH_TOKEN via query
  // or `x-health-token`. Everyone else gets a plain boolean. The readiness status
  // itself stays public so uptime monitors and load balancers still work.
  const healthToken = process.env.HEALTH_TOKEN;
  const authorized =
    Boolean(healthToken) &&
    (request.nextUrl.searchParams.get("token") === healthToken ||
      request.headers.get("x-health-token") === healthToken);

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      version: pkg.version,
      time: new Date().toISOString(),
      mode: env.mode,
      services: {
        database,
        billing: process.env.STRIPE_SECRET_KEY ? "configured" : "disabled",
        ai: aiMode(),
      },
      ...(authorized ? { config: env } : { configOk: env.ok }),
    },
    { status: healthy ? 200 : 503 },
  );
}
