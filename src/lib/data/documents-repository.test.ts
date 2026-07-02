import { describe, it, expect } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import {
  rowToDocument,
  saveDocument,
  listDocuments,
  getDocument,
  deleteDocument,
} from "./documents-repository";

type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
type Result = { data?: unknown; error?: unknown };
type Call = { table: string; methods: string[] };

function makeClient(results: Result[]) {
  const calls: Call[] = [];
  let i = 0;
  const pull = (): Result => results[i++] ?? { data: null, error: null };
  function builder(rec: Call) {
    const b: Record<string, unknown> = {};
    const chain = (name: string) => () => {
      rec.methods.push(name);
      return b;
    };
    for (const m of ["select", "eq", "order", "insert", "delete"]) b[m] = chain(m);
    b.single = () => {
      rec.methods.push("single");
      return Promise.resolve(pull());
    };
    b.maybeSingle = () => {
      rec.methods.push("maybeSingle");
      return Promise.resolve(pull());
    };
    b.then = (resolve: (v: Result) => unknown, reject?: (e: unknown) => unknown) =>
      Promise.resolve(pull()).then(resolve, reject);
    return b;
  }
  const client = {
    from(table: string) {
      const rec: Call = { table, methods: [] };
      calls.push(rec);
      return builder(rec);
    },
  };
  return { client: client as unknown as SupabaseClient<Database>, calls };
}

function sampleRow(): DocumentRow {
  return {
    id: "doc-1",
    org_id: "org-1",
    system_id: "sys-1",
    doc_type: "technical-documentation",
    title: "Technical Documentation — TalentRank",
    content: "# Technical Documentation…",
    locale: "en",
    model: "claude-opus-4-8",
    created_by: "u1",
    created_at: "2026-06-01T00:00:00.000Z",
  };
}

describe("rowToDocument", () => {
  it("maps a row to the domain shape without leaking org/creator", () => {
    const doc = rowToDocument(sampleRow());
    expect(doc).toEqual({
      id: "doc-1",
      systemId: "sys-1",
      docType: "technical-documentation",
      title: "Technical Documentation — TalentRank",
      content: "# Technical Documentation…",
      locale: "en",
      model: "claude-opus-4-8",
      createdAt: "2026-06-01T00:00:00.000Z",
    });
    expect(doc).not.toHaveProperty("org_id");
    expect(doc).not.toHaveProperty("created_by");
  });
});

describe("documents CRUD", () => {
  it("saveDocument inserts and returns the new id", async () => {
    const { client, calls } = makeClient([{ data: { id: "doc-9" } }]);
    const id = await saveDocument(client, {
      orgId: "org-1",
      docType: "transparency-notice",
      title: "T",
      content: "C",
      createdBy: "u1",
    });
    expect(id).toBe("doc-9");
    expect(calls[0].table).toBe("documents");
    expect(calls[0].methods).toContain("insert");
  });

  it("listDocuments maps rows for the org", async () => {
    const { client, calls } = makeClient([{ data: [sampleRow()] }]);
    const docs = await listDocuments(client, "org-1");
    expect(docs).toHaveLength(1);
    expect(docs[0].id).toBe("doc-1");
    expect(calls[0].methods).toContain("eq");
    expect(calls[0].methods).toContain("order");
  });

  it("getDocument returns null when absent", async () => {
    const { client } = makeClient([{ data: null }]);
    expect(await getDocument(client, "missing")).toBeNull();
  });

  it("deleteDocument deletes by id", async () => {
    const { client, calls } = makeClient([{ error: null }]);
    await deleteDocument(client, "doc-1");
    expect(calls[0].methods).toContain("delete");
    expect(calls[0].methods).toContain("eq");
  });
});
