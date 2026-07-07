import { describe, it, expect } from "vitest";
import { validateEnv } from "./env";

const EMPTY: Record<string, string | undefined> = {};

const SUPABASE = {
  NEXT_PUBLIC_SUPABASE_URL: "https://x.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
};
const ADMIN = { SUPABASE_SERVICE_ROLE_KEY: "service" };
const STRIPE = {
  STRIPE_SECRET_KEY: "sk",
  STRIPE_WEBHOOK_SECRET: "whsec",
  STRIPE_PRICE_PRO_MONTHLY: "p1",
  STRIPE_PRICE_PRO_ANNUAL: "p2",
  STRIPE_PRICE_TEAM_MONTHLY: "p3",
  STRIPE_PRICE_TEAM_ANNUAL: "p4",
};

describe("validateEnv", () => {
  it("reports Demo Mode and is ok with no env", () => {
    const r = validateEnv(EMPTY);
    expect(r.mode).toBe("demo");
    expect(r.ok).toBe(true);
    expect(r.groups.find((g) => g.name === "supabase")?.state).toBe("unset");
  });

  it("reports Production Mode when the public Supabase vars are set", () => {
    const r = validateEnv({ ...SUPABASE });
    expect(r.mode).toBe("production");
    expect(r.groups.find((g) => g.name === "supabase")?.state).toBe("configured");
  });

  it("flags a partial group as a warning with the missing var", () => {
    const r = validateEnv({ NEXT_PUBLIC_SUPABASE_URL: "https://x.supabase.co" });
    const supa = r.groups.find((g) => g.name === "supabase");
    expect(supa?.state).toBe("partial");
    expect(supa?.missing).toContain("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    expect(r.ok).toBe(false);
    expect(r.warnings.join(" ")).toMatch(/partially configured/);
  });

  it("warns when the admin key is set without the public keys", () => {
    const r = validateEnv({ ...ADMIN });
    expect(r.ok).toBe(false);
    expect(r.warnings.join(" ")).toMatch(/public Supabase vars/);
  });

  it("warns when Stripe is configured without the service-role key", () => {
    const r = validateEnv({ ...SUPABASE, ...STRIPE });
    expect(r.warnings.join(" ")).toMatch(/webhook cannot persist/);
  });

  it("is fully ok with a complete production configuration", () => {
    const r = validateEnv({ ...SUPABASE, ...ADMIN, ...STRIPE });
    expect(r.ok).toBe(true);
    expect(r.mode).toBe("production");
    expect(r.groups.every((g) => g.state === "configured")).toBe(true);
  });
});
