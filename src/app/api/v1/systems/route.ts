/**
 * Public API v1 — list the AI systems in the org that owns the API key.
 *
 * Authenticated by `Authorization: Bearer cfm_...`. Org-scoped: the key resolves
 * to exactly one org and results are filtered to it (the service role bypasses
 * RLS, so the `org_id` filter is the authoritative scope — never widen it).
 */

import { NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-keys/authenticate";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { listSystems } from "@/lib/data/systems-repository";
import { compliancePct } from "@/lib/registry";
import { captureError } from "@/lib/observability";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await authenticateApiKey(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  try {
    const systems = await listSystems(admin, auth.orgId);
    return NextResponse.json({
      systems: systems.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        owner: s.owner,
        tier: s.result.tier,
        isGPAI: s.result.isGPAI,
        compliance: compliancePct(s),
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
    });
  } catch (error) {
    captureError(error, { scope: "api.v1.systems", orgId: auth.orgId });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
