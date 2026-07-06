import { describe, it, expect, afterEach, vi } from "vitest";

/**
 * Loads a FRESH copy of ./config with the given env stubbed. The module reads
 * process.env at import time, so each case resets the module registry first.
 */
async function loadConfig(env: Record<string, string>) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "");
  vi.stubEnv("NEXT_PUBLIC_DEMO", env.NEXT_PUBLIC_DEMO ?? "");
  return import("./config");
}

const CREDS = {
  NEXT_PUBLIC_SUPABASE_URL: "https://x.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("isSupabaseConfigured", () => {
  it("is false with no Supabase credentials (Demo Mode)", async () => {
    const { isSupabaseConfigured } = await loadConfig({});
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("is true when both public Supabase vars are set (Production Mode)", async () => {
    const { isSupabaseConfigured } = await loadConfig({ ...CREDS });
    expect(isSupabaseConfigured()).toBe(true);
  });

  it("NEXT_PUBLIC_DEMO=1 forces Demo Mode even with Supabase configured", async () => {
    const { isSupabaseConfigured, FORCE_DEMO } = await loadConfig({
      ...CREDS,
      NEXT_PUBLIC_DEMO: "1",
    });
    expect(FORCE_DEMO).toBe(true);
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("NEXT_PUBLIC_DEMO=true also forces Demo Mode", async () => {
    const { isSupabaseConfigured } = await loadConfig({
      ...CREDS,
      NEXT_PUBLIC_DEMO: "true",
    });
    expect(isSupabaseConfigured()).toBe(false);
  });

  it("an unrelated NEXT_PUBLIC_DEMO value does not force Demo Mode", async () => {
    const { isSupabaseConfigured, FORCE_DEMO } = await loadConfig({
      ...CREDS,
      NEXT_PUBLIC_DEMO: "0",
    });
    expect(FORCE_DEMO).toBe(false);
    expect(isSupabaseConfigured()).toBe(true);
  });
});
