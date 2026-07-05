/**
 * Supabase data-access for generated compliance documents.
 *
 * The `documents` table (migration 0002) is the persistent home for docs drafted
 * via `/api/generate-doc`. Like the systems repository this is isomorphic —
 * it accepts any Supabase client and RLS enforces the tenant boundary; the
 * `orgId` on writes targets the tenant, it is not the security boundary.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, DocumentType } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;
type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];

export interface StoredDocument {
  id: string;
  systemId: string | null;
  docType: DocumentType;
  title: string;
  content: string;
  locale: string | null;
  model: string | null;
  createdAt: string;
}

export interface NewDocument {
  orgId: string;
  systemId?: string | null;
  docType: DocumentType;
  title: string;
  content: string;
  locale?: string | null;
  model?: string | null;
  createdBy: string | null;
}

/** Map a `documents` row to the domain shape (never exposes org_id/created_by). */
export function rowToDocument(row: DocumentRow): StoredDocument {
  return {
    id: row.id,
    systemId: row.system_id,
    docType: row.doc_type,
    title: row.title,
    content: row.content,
    locale: row.locale,
    model: row.model,
    createdAt: row.created_at,
  };
}

/** Persist a generated document; returns its id. */
export async function saveDocument(client: Client, doc: NewDocument): Promise<string> {
  const { data, error } = await client
    .from("documents")
    .insert({
      org_id: doc.orgId,
      system_id: doc.systemId ?? null,
      doc_type: doc.docType,
      title: doc.title,
      content: doc.content,
      locale: doc.locale ?? null,
      model: doc.model ?? null,
      created_by: doc.createdBy,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

/** All documents in an org, newest first. Optional keyset window for the API. */
export async function listDocuments(
  client: Client,
  orgId: string,
  page?: { limit: number; offset: number },
): Promise<StoredDocument[]> {
  let query = client
    .from("documents")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  if (page) query = query.range(page.offset, page.offset + page.limit - 1);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(rowToDocument);
}

/**
 * Count an org's real (non-demo) AI document generations since a timestamp —
 * the authoritative meter for the monthly `aiDocumentsPerMonth` quota. `.neq`
 * excludes NULL model rows in Postgres, so only paid generations are counted.
 */
export async function countAiDocumentsSince(
  client: Client,
  orgId: string,
  sinceIso: string,
): Promise<number> {
  const { count, error } = await client
    .from("documents")
    .select("id", { count: "exact", head: true })
    .eq("org_id", orgId)
    .neq("model", "demo")
    .gte("created_at", sinceIso);
  if (error) throw error;
  return count ?? 0;
}

/** A single document by id, or `null` if not found/authorized. */
export async function getDocument(
  client: Client,
  id: string,
): Promise<StoredDocument | null> {
  const { data, error } = await client
    .from("documents")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToDocument(data) : null;
}

/** Delete a document by id. */
export async function deleteDocument(client: Client, id: string): Promise<void> {
  const { error } = await client.from("documents").delete().eq("id", id);
  if (error) throw error;
}
