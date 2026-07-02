import { describe, it, expect } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import {
  listSystems,
  getSystem,
  saveSystem,
  deleteSystem,
  setObligationState,
} from "./systems-repository";
import { makeSystem } from "@/lib/registry";
import { EMPTY_ANSWERS } from "@/lib/classifier";

type Result = { data?: unknown; error?: unknown };
type Call = { table: string; methods: string[] };

/**
 * Minimal chainable Supabase-client stub. Records `from(table)` + the method
 * chain, and resolves each awaited terminal (`await builder` / `.maybeSingle()`)
 * to the next queued result — enough to assert the repository builds the right
 * queries against the right tables without a live database.
 */
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
    for (const m of ["select", "eq", "in", "order", "upsert", "update", "delete", "insert"]) {
      b[m] = chain(m);
    }
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

function sampleRow(id = "sys-1") {
  const answers = { ...EMPTY_ANSWERS, name: "S", annexIII: ["employment"] };
  const sys = makeSystem("S", "d", "o", answers);
  return {
    id,
    org_id: "org-1",
    name: sys.name,
    description: sys.description,
    owner: sys.owner,
    role: answers.role,
    answers,
    result: sys.result,
    tier: sys.result.tier,
    is_gpai: sys.result.isGPAI,
    created_by: "u1",
    created_at: "2026-06-01T00:00:00.000Z",
    updated_at: "2026-06-02T00:00:00.000Z",
  };
}

describe("listSystems", () => {
  it("queries systems then obligations, and folds obligations onto each system", async () => {
    const { client, calls } = makeClient([
      { data: [sampleRow("sys-1")] },
      { data: [{ system_id: "sys-1", obligation_id: "ob-a", state: "done" }] },
    ]);

    const out = await listSystems(client, "org-1");

    expect(calls[0].table).toBe("systems");
    expect(calls[0].methods).toContain("eq"); // .eq("org_id", ...)
    expect(calls[1].table).toBe("obligation_status");
    expect(out).toHaveLength(1);
    expect(out[0].obligationStatus).toEqual({ "ob-a": "done" });
  });

  it("short-circuits with no obligation query when there are no systems", async () => {
    const { client, calls } = makeClient([{ data: [] }]);
    const out = await listSystems(client, "org-1");
    expect(out).toEqual([]);
    expect(calls).toHaveLength(1); // never queried obligation_status
  });

  it("throws on a systems query error", async () => {
    const { client } = makeClient([{ error: { message: "boom" } }]);
    await expect(listSystems(client, "org-1")).rejects.toBeTruthy();
  });
});

describe("getSystem", () => {
  it("returns null when the row is not found", async () => {
    const { client } = makeClient([{ data: null }]);
    expect(await getSystem(client, "missing")).toBeNull();
  });

  it("assembles a single system with its obligations", async () => {
    const { client } = makeClient([
      { data: sampleRow("sys-9") },
      { data: [{ obligation_id: "ob-x", state: "in-progress" }] },
    ]);
    const sys = await getSystem(client, "sys-9");
    expect(sys?.id).toBe("sys-9");
    expect(sys?.obligationStatus).toEqual({ "ob-x": "in-progress" });
  });
});

describe("saveSystem", () => {
  it("upserts the system, then upserts its obligation states", async () => {
    const system = makeSystem("S", "d", "o", { ...EMPTY_ANSWERS, annexIII: ["employment"] });
    system.obligationStatus = { "ob-a": "done" };
    const { client, calls } = makeClient([{ error: null }, { error: null }]);

    await saveSystem(client, "org-1", "u1", system);

    expect(calls[0].table).toBe("systems");
    expect(calls[0].methods).toContain("upsert");
    expect(calls[1].table).toBe("obligation_status");
    expect(calls[1].methods).toContain("upsert");
  });

  it("skips the obligation upsert when there are none", async () => {
    const system = makeSystem("S", "d", "o", EMPTY_ANSWERS); // empty obligationStatus
    const { client, calls } = makeClient([{ error: null }]);
    await saveSystem(client, "org-1", "u1", system);
    expect(calls).toHaveLength(1);
  });
});

describe("setObligationState", () => {
  it("upserts the obligation then touches the system's updated_at", async () => {
    const { client, calls } = makeClient([{ error: null }, { error: null }]);
    await setObligationState(client, "sys-1", "ob-a", "done", "u1");
    expect(calls[0].table).toBe("obligation_status");
    expect(calls[0].methods).toContain("upsert");
    expect(calls[1].table).toBe("systems");
    expect(calls[1].methods).toContain("update");
  });
});

describe("deleteSystem", () => {
  it("deletes by id from systems", async () => {
    const { client, calls } = makeClient([{ error: null }]);
    await deleteSystem(client, "sys-1");
    expect(calls[0].table).toBe("systems");
    expect(calls[0].methods).toContain("delete");
    expect(calls[0].methods).toContain("eq");
  });
});
