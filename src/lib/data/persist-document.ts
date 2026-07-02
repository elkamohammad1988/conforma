/**
 * Persist a generated compliance document to the signed-in user's org.
 *
 * Best-effort and safe in every mode: returns `null` in Demo Mode (no Supabase)
 * or when there is no authenticated user/org, and swallows any error so document
 * *generation* never fails because *persistence* did. When it succeeds, the
 * document lives in the `documents` table under the active org (RLS-scoped).
 */

import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getActiveContext } from "@/lib/auth/context";
import { saveDocument } from "./documents-repository";
import { captureError } from "@/lib/observability";
import type { DocumentType } from "@/lib/supabase/types";

export async function persistGeneratedDocument(doc: {
  docType: DocumentType;
  title: string;
  content: string;
  locale: string | null;
  model: string | null;
  systemId: string | null;
}): Promise<string | null> {
  try {
    const supabase = await createSupabaseServerClient();
    if (!supabase) return null; // Demo Mode

    const ctx = await getActiveContext();
    if (!ctx?.activeOrg) return null; // unauthenticated / no org

    return await saveDocument(supabase, {
      orgId: ctx.activeOrg.id,
      systemId: doc.systemId,
      docType: doc.docType,
      title: doc.title,
      content: doc.content,
      locale: doc.locale,
      model: doc.model,
      createdBy: ctx.userId,
    });
  } catch (error) {
    captureError(error, { scope: "persistGeneratedDocument" });
    return null;
  }
}
