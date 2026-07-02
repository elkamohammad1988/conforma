"use server";

/**
 * Billing server actions: start a Checkout session (subscribe / change plan) and
 * open the Stripe customer portal (manage / cancel / update card).
 *
 * Both are restricted to org owners/admins. Subscription *state* is never
 * written here — Stripe owns it, and the webhook projects it into the DB. These
 * actions only create Stripe-hosted sessions and redirect to them.
 */

import { redirect } from "next/navigation";
import {
  getStripe,
  priceIdFor,
  type BillingInterval,
  type PaidPlan,
} from "./stripe";
import { getActiveContext } from "@/lib/auth/context";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requestOrigin } from "@/lib/request-origin";

export interface BillingActionState {
  error?: string;
}

/** Ensure the org has a Stripe customer, creating + persisting one if needed. */
async function ensureCustomer(
  orgId: string,
  orgName: string,
  email: string | null,
): Promise<string | null> {
  const stripe = getStripe();
  const admin = createSupabaseAdminClient();
  if (!stripe || !admin) return null;

  const { data } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("org_id", orgId)
    .maybeSingle();
  if (data?.stripe_customer_id) return data.stripe_customer_id;

  const customer = await stripe.customers.create({
    email: email ?? undefined,
    name: orgName,
    metadata: { org_id: orgId },
  });
  await admin
    .from("subscriptions")
    .update({ stripe_customer_id: customer.id })
    .eq("org_id", orgId);
  return customer.id;
}

export async function createCheckoutSessionAction(
  plan: PaidPlan,
  interval: BillingInterval,
): Promise<BillingActionState> {
  const stripe = getStripe();
  if (!stripe) return { error: "notConfigured" };

  const ctx = await getActiveContext();
  if (!ctx?.activeOrg) return { error: "generic" };
  if (ctx.activeOrg.role === "member") return { error: "forbidden" };

  const priceId = priceIdFor(plan, interval);
  if (!priceId) return { error: "notConfigured" };

  const customerId = await ensureCustomer(
    ctx.activeOrg.id,
    ctx.activeOrg.name,
    ctx.email,
  );
  if (!customerId) return { error: "notConfigured" };

  const origin = await requestOrigin();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/settings?billing=success`,
    cancel_url: `${origin}/settings?billing=cancelled`,
    allow_promotion_codes: true,
    subscription_data: { metadata: { org_id: ctx.activeOrg.id } },
    metadata: { org_id: ctx.activeOrg.id, plan },
  });
  if (!session.url) return { error: "generic" };

  redirect(session.url);
}

export async function openBillingPortalAction(): Promise<BillingActionState> {
  const stripe = getStripe();
  if (!stripe) return { error: "notConfigured" };

  const ctx = await getActiveContext();
  if (!ctx?.activeOrg) return { error: "generic" };
  if (ctx.activeOrg.role === "member") return { error: "forbidden" };

  const admin = createSupabaseAdminClient();
  if (!admin) return { error: "notConfigured" };

  const { data } = await admin
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("org_id", ctx.activeOrg.id)
    .maybeSingle();
  if (!data?.stripe_customer_id) return { error: "noCustomer" };

  const origin = await requestOrigin();
  const session = await stripe.billingPortal.sessions.create({
    customer: data.stripe_customer_id,
    return_url: `${origin}/settings`,
  });

  redirect(session.url);
}
