/**
 * Stripe server client + price/plan mapping (server-only).
 *
 * Billing is optional: with no `STRIPE_SECRET_KEY`, `getStripe()` returns null
 * and every org stays on the Free plan. Price IDs come from env (your Stripe
 * product catalog) and are mapped to/from the canonical plan tiers here — the
 * one place that knows the Stripe⇆plan correspondence.
 */

import "server-only";
import Stripe from "stripe";
import type { PlanTier } from "./plans";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export type PaidPlan = Exclude<PlanTier, "free">;
export type BillingInterval = "monthly" | "annual";

export function isStripeConfigured(): boolean {
  return STRIPE_SECRET_KEY.length > 0;
}

let cached: Stripe | null = null;

/** The shared Stripe client, or `null` when billing is not configured. */
export function getStripe(): Stripe | null {
  if (!isStripeConfigured()) return null;
  cached ??= new Stripe(STRIPE_SECRET_KEY, { typescript: true });
  return cached;
}

const PRICE_IDS: Record<PaidPlan, Record<BillingInterval, string>> = {
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
    annual: process.env.STRIPE_PRICE_PRO_ANNUAL ?? "",
  },
  team: {
    monthly: process.env.STRIPE_PRICE_TEAM_MONTHLY ?? "",
    annual: process.env.STRIPE_PRICE_TEAM_ANNUAL ?? "",
  },
};

/** The Stripe price id for a paid plan + interval (empty string if unset). */
export function priceIdFor(plan: PaidPlan, interval: BillingInterval): string {
  return PRICE_IDS[plan][interval];
}

/** Reverse-map a Stripe price id to a plan tier (for webhook sync). */
export function planForPriceId(priceId: string | null | undefined): PlanTier {
  if (!priceId) return "free";
  for (const plan of ["pro", "team"] as const) {
    if (PRICE_IDS[plan].monthly === priceId || PRICE_IDS[plan].annual === priceId) {
      return plan;
    }
  }
  return "free";
}
