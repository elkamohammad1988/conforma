/**
 * Plan catalog — the canonical Free / Pro / Team tiers and their usage limits.
 *
 * Client-safe (no secrets): limits are used both server-side (enforcement) and
 * client-side (usage meters, upgrade prompts). Stripe price IDs are NOT here —
 * they live server-only in `stripe.ts`. The display names/prices shown to
 * visitors remain the marketing pricing page's concern; `PLAN_PRICING_KEY` maps
 * each canonical plan onto the tier that page already renders.
 */

export type PlanTier = "free" | "pro" | "team";

export const PLAN_TIERS: readonly PlanTier[] = ["free", "pro", "team"] as const;

export interface PlanLimits {
  /** Max registered systems; `null` = unlimited. */
  systems: number | null;
  /** Max organization members; `null` = unlimited. */
  members: number | null;
  /** Max AI document generations per calendar month; `null` = unlimited. */
  aiDocumentsPerMonth: number | null;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: { systems: 3, members: 1, aiDocumentsPerMonth: 5 },
  pro: { systems: 25, members: 5, aiDocumentsPerMonth: 100 },
  team: { systems: null, members: null, aiDocumentsPerMonth: null },
};

/** Marketing pricing tier each canonical plan corresponds to (display only). */
export const PLAN_PRICING_KEY: Record<PlanTier, "starter" | "team" | "business"> = {
  free: "starter",
  pro: "team",
  team: "business",
};

export function isPlanTier(value: string): value is PlanTier {
  return (PLAN_TIERS as readonly string[]).includes(value);
}

/** Is `count` within the plan's limit for `key`? A `null` limit is unlimited. */
export function withinLimit(
  plan: PlanTier,
  key: keyof PlanLimits,
  count: number,
): boolean {
  const limit = PLAN_LIMITS[plan][key];
  return limit === null || count < limit;
}

/** Remaining allowance for `key`, or `null` when unlimited. */
export function remaining(
  plan: PlanTier,
  key: keyof PlanLimits,
  count: number,
): number | null {
  const limit = PLAN_LIMITS[plan][key];
  return limit === null ? null : Math.max(0, limit - count);
}
