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

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await authenticateApiKey(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();
  if (!admin) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  try {
    const documents = await listDocuments(admin, auth.orgId);
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
    });
  } catch (error) {
    captureError(error, { scope: "api.v1.documents", orgId: auth.orgId });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
