/**
 * Public API v1 — list the generated compliance documents in the org that owns
 * the API key. Authenticated by `Authorization: Bearer cfm_...`; org-scoped (the
 * key resolves to one org and results are filtered to it).
 */

import { NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-keys/authenticate";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { listDocuments } from "@/lib/data/documents-repository";
import { captureError } from "@/lib/observability";
import { parsePageParams, withinRateLimit } from "@/lib/api-guard";

export const dynamic = "force-dynamic";

const V1_RATE_PER_MIN = 120;

export async function GET(request: Request) {
  const auth = await authenticateApiKey(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!withinRateLimit(`v1:${auth.orgId}`, V1_RATE_PER_MIN)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const page = parsePageParams(request.url);
  try {
    const documents = await listDocuments(admin, auth.orgId, page);
    return NextResponse.json({
      documents: documents.map((d) => ({
        id: d.id,
        systemId: d.systemId,
        docType: d.docType,
        title: d.title,
        locale: d.locale,
        createdAt: d.createdAt,
        // content omitted from the list; fetch a single document to get it.
      })),
      pagination: { limit: page.limit, offset: page.offset, count: documents.length },
    });
  } catch (error) {
    captureError(error, { scope: "api.v1.documents", orgId: auth.orgId });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
