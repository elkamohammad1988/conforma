import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Verifies the store's dual-mode dispatch: with a tenant configured, mutations
 * route to the Supabase repository; with none, they fall back to localStorage.
 * The Supabase browser client and repository are mocked (no live DB here), so
 * these tests pin the *routing + optimistic* behaviour, not the network layer.
 */

vi.mock("@/lib/supabase/client", () => ({
  getSupabaseBrowserClient: () => ({ __fake: true }),
}));

vi.mock("@/lib/data/systems-repository", () => ({
  listSystems: vi.fn(async () => []),
  saveSystem: vi.fn(async () => {}),
  deleteSystem: vi.fn(async () => {}),
  setObligationState: vi.fn(async () => {}),
}));

import * as repo from "@/lib/data/systems-repository";
import {
  configureRegistryBackend,
  saveSystem,
  deleteSystem,
  setObligationState,
  makeSystem,
} from "./store";
import { EMPTY_ANSWERS } from "./classifier";

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

beforeEach(() => {
  vi.clearAllMocks();
  storage.clear();
});

function sampleSystem(name: string) {
  return makeSystem(name, "desc", "owner", {
    ...EMPTY_ANSWERS,
    name,
    annexIII: ["employment"],
  });
}

describe("registry store — Production (Supabase) mode", () => {
  it("routes writes to the repository, scoped to the active tenant", () => {
    configureRegistryBackend({ orgId: "org-1", userId: "user-1" });

    const sys = sampleSystem("TalentRank");
    saveSystem(sys);
    expect(repo.saveSystem).toHaveBeenCalledWith(
      expect.anything(),
      "org-1",
      "user-1",
      sys,
    );

    setObligationState(sys.id, "ob-1", "done");
    expect(repo.setObligationState).toHaveBeenCalledWith(
      expect.anything(),
      sys.id,
      "ob-1",
      "done",
      "user-1",
    );

    deleteSystem(sys.id);
    expect(repo.deleteSystem).toHaveBeenCalledWith(expect.anything(), sys.id);
  });

  it("generates UUID ids valid as a Postgres uuid primary key", () => {
    const sys = sampleSystem("BorderVision");
    expect(sys.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
  });
});

describe("registry store — Demo (localStorage) mode", () => {
  it("falls back to localStorage when no tenant is configured", () => {
    configureRegistryBackend(null);

    const sys = sampleSystem("ForecastIQ");
    saveSystem(sys);

    expect(repo.saveSystem).not.toHaveBeenCalled();
    expect(storage.getItem("conforma.systems.v2")).toContain("ForecastIQ");
  });
});
