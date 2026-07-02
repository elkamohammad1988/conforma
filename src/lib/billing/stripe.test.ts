import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * The Stripe price-id ↔ plan mapping is billing-critical: a wrong mapping in the
 * webhook grants (or charges for) the wrong plan. The mapping is built from env
 * at module load, so each test stubs env and re-imports the module fresh.
 */
describe("stripe plan/price mapping", () => {
  beforeEach(() => vi.resetModules());
  afterEach(() => vi.unstubAllEnvs());

  it("maps configured price ids back to their plan, both intervals", async () => {
    vi.stubEnv("STRIPE_PRICE_PRO_MONTHLY", "price_pro_m");
    vi.stubEnv("STRIPE_PRICE_PRO_ANNUAL", "price_pro_a");
    vi.stubEnv("STRIPE_PRICE_TEAM_MONTHLY", "price_team_m");
    vi.stubEnv("STRIPE_PRICE_TEAM_ANNUAL", "price_team_a");
    const { planForPriceId, priceIdFor } = await import("./stripe");

    expect(planForPriceId("price_pro_m")).toBe("pro");
    expect(planForPriceId("price_pro_a")).toBe("pro");
    expect(planForPriceId("price_team_m")).toBe("team");
    expect(planForPriceId("price_team_a")).toBe("team");

    expect(priceIdFor("pro", "monthly")).toBe("price_pro_m");
    expect(priceIdFor("team", "annual")).toBe("price_team_a");
  });

  it("defaults to free for null, undefined or unknown price ids", async () => {
    vi.stubEnv("STRIPE_PRICE_PRO_MONTHLY", "price_pro_m");
    const { planForPriceId } = await import("./stripe");

    expect(planForPriceId(null)).toBe("free");
    expect(planForPriceId(undefined)).toBe("free");
    expect(planForPriceId("price_does_not_exist")).toBe("free");
    expect(planForPriceId("")).toBe("free");
  });

  it("does not report Stripe as configured without a secret key", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    const { isStripeConfigured, getStripe } = await import("./stripe");
    expect(isStripeConfigured()).toBe(false);
    expect(getStripe()).toBeNull();
  });
});
