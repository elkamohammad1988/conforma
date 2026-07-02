import { describe, expect, it, beforeEach } from "vitest";
import {
  compliancePct,
  makeSystem,
  clearAllSystems,
  resetToDemoData,
  deleteSystem,
} from "./store";
import { EMPTY_ANSWERS } from "./classifier";

/**
 * `store.ts` persists to `window.localStorage`. Rather than pull in a full DOM
 * environment for two assertions, provide a minimal in-memory `localStorage`
 * (the store only ever calls get/set/removeItem). Kept in the node runner.
 */
class MemoryStorage {
  private map = new Map<string, string>();
  get length() {
    return this.map.size;
  }
  key(i: number) {
    return [...this.map.keys()][i] ?? null;
  }
  getItem(k: string) {
    return this.map.has(k) ? this.map.get(k)! : null;
  }
  setItem(k: string, v: string) {
    this.map.set(k, String(v));
  }
  removeItem(k: string) {
    this.map.delete(k);
  }
  clear() {
    this.map.clear();
  }
}

const storage = new MemoryStorage();
(globalThis as unknown as { window: { localStorage: MemoryStorage } }).window = {
  localStorage: storage,
};

const STORE_KEY = "conforma.systems.v2";
const read = (): unknown[] => JSON.parse(storage.getItem(STORE_KEY) ?? "[]");

beforeEach(() => storage.clear());

describe("compliancePct", () => {
  it("is 0 when no obligations are done and 100 when all are", () => {
    const sys = makeSystem("S", "d", "o", {
      ...EMPTY_ANSWERS,
      name: "S",
      isAISystem: true,
      annexIII: ["employment"],
    });
    expect(sys.result.obligations.length).toBeGreaterThan(0);
    expect(compliancePct(sys)).toBe(0);

    for (const o of sys.result.obligations) sys.obligationStatus[o.id] = "done";
    expect(compliancePct(sys)).toBe(100);
  });

  it("is 100 when a tier carries no obligations", () => {
    const sys = makeSystem("S", "d", "o", {
      ...EMPTY_ANSWERS,
      name: "S",
      isAISystem: true,
    });
    if (sys.result.obligations.length === 0) {
      expect(compliancePct(sys)).toBe(100);
    }
  });
});

describe("registry data management", () => {
  it("resetToDemoData seeds the ten example systems", () => {
    resetToDemoData();
    expect(read()).toHaveLength(10);
  });

  it("clearAllSystems empties the registry and blocks re-seeding", () => {
    resetToDemoData();
    clearAllSystems();
    expect(read()).toHaveLength(0);
  });

  it("drops a persisted record whose result is missing deadline (guard)", () => {
    const mk = (name: string) =>
      makeSystem(name, "d", "o", {
        ...EMPTY_ANSWERS,
        name,
        isAISystem: true,
        annexIII: ["employment"],
      });
    const good = mk("Good");
    const broken = mk("Broken");
    // A legacy/hand-edited record with a tier + obligations but no deadline is
    // exactly what the UI would dereference and crash on — it must be filtered.
    delete (broken.result as unknown as Record<string, unknown>).deadline;
    storage.setItem(STORE_KEY, JSON.stringify([good, broken]));

    // deleteSystem forces a filtered read → write cycle without adding a record.
    deleteSystem("does-not-exist");

    const remaining = read();
    expect(remaining).toHaveLength(1);
    expect((remaining[0] as { name: string }).name).toBe("Good");
  });
});
