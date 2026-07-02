import { describe, it, expect } from "vitest";
import { rowToSystem, systemToInsert } from "./systems-repository";
import { makeSystem } from "@/lib/registry";
import { EMPTY_ANSWERS } from "@/lib/classifier";
import type { Database } from "@/lib/supabase/types";

type SystemRow = Database["public"]["Tables"]["systems"]["Row"];

/** A high-risk system row, as it would come back from Postgres. */
function sampleRow(): SystemRow {
  const answers = { ...EMPTY_ANSWERS, name: "TalentRank", annexIII: ["employment"] };
  const system = makeSystem("TalentRank", "CV screening", "People Ops", answers);
  return {
    id: system.id,
    org_id: "org_1",
    name: system.name,
    description: system.description,
    owner: system.owner,
    role: answers.role,
    answers,
    result: system.result,
    tier: system.result.tier,
    is_gpai: system.result.isGPAI,
    created_by: "user_1",
    created_at: "2026-06-01T00:00:00.000Z",
    updated_at: "2026-06-02T00:00:00.000Z",
  };
}

describe("rowToSystem", () => {
  it("assembles a RegisteredSystem with obligation status folded into a record", () => {
    const row = sampleRow();
    const system = rowToSystem(row, [
      { obligation_id: "ob-a", state: "done" },
      { obligation_id: "ob-b", state: "in-progress" },
    ]);

    expect(system.id).toBe(row.id);
    expect(system.name).toBe("TalentRank");
    expect(system.result.tier).toBe("high");
    expect(system.obligationStatus).toEqual({ "ob-a": "done", "ob-b": "in-progress" });
    expect(system.createdAt).toBe("2026-06-01T00:00:00.000Z");
    expect(system.updatedAt).toBe("2026-06-02T00:00:00.000Z");
  });

  it("yields an empty obligation record when there are no rows", () => {
    expect(rowToSystem(sampleRow(), []).obligationStatus).toEqual({});
  });
});

describe("systemToInsert", () => {
  it("denormalizes tier, role and gpai out of the classification result", () => {
    const answers = { ...EMPTY_ANSWERS, role: "deployer" as const, isGPAI: true };
    const system = makeSystem("HelpDesk", "chatbot", "Support", answers);

    const insert = systemToInsert("org_42", "user_9", system);

    expect(insert.org_id).toBe("org_42");
    expect(insert.created_by).toBe("user_9");
    expect(insert.role).toBe("deployer");
    expect(insert.is_gpai).toBe(true);
    expect(insert.tier).toBe(system.result.tier);
    expect(insert.answers).toEqual(answers);
  });

  it("round-trips through rowToSystem preserving identity fields", () => {
    const system = makeSystem("ForecastIQ", "demand", "Supply", EMPTY_ANSWERS);
    const insert = systemToInsert("org_1", null, system);
    const rebuilt = rowToSystem(
      {
        ...(insert as SystemRow),
        description: insert.description ?? "",
        owner: insert.owner ?? "",
        created_at: system.createdAt,
        updated_at: system.updatedAt,
      },
      [],
    );
    expect(rebuilt.id).toBe(system.id);
    expect(rebuilt.name).toBe(system.name);
    expect(rebuilt.result.tier).toBe(system.result.tier);
  });
});
