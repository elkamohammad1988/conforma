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

/** All documents in an org, newest first. */
export async function listDocuments(
  client: Client,
  orgId: string,
): Promise<StoredDocument[]> {
  const { data, error } = await client
    .from("documents")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToDocument);
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
