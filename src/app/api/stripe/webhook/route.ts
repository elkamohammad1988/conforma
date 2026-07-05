/**
 * Stripe webhook — the single writer of subscription state.
 *
 * Verifies the signature against the raw body, then projects Stripe's view of a
 * subscription into `public.subscriptions` via the service role (RLS is closed
 * to clients for this table). Idempotent: every relevant event re-syncs the same
 * row, keyed by org. Unconfigured billing returns 503; a bad signature 400.
 */

import { type NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, STRIPE_WEBHOOK_SECRET, planForPriceId } from "@/lib/billing/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, SubscriptionStatus } from "@/lib/supabase/types";
import { captureError, logger } from "@/lib/observability";

// Read the Unix-seconds period end across Stripe API-version shapes.
function periodEndOf(sub: Stripe.Subscription): number | null {
  const s = sub as unknown as {
    current_period_end?: number;
    items?: { data?: Array<{ current_period_end?: number }> };
  };
  return s.current_period_end ?? s.items?.data?.[0]?.current_period_end ?? null;
}

async function syncSubscription(
  admin: SupabaseClient<Database>,
  sub: Stripe.Subscription,
): Promise<void> {
  const orgId = sub.metadata?.org_id ?? null;
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const priceId = sub.items.data[0]?.price.id ?? null;
  const periodEnd = periodEndOf(sub);

  // Entitle the paid plan ONLY while the subscription is genuinely paying.
  // `incomplete`, `incomplete_expired`, `past_due`, `unpaid` and `canceled` all
  // fall back to `free` — otherwise a sub whose first payment never clears, or a
  // customer who stops paying, would keep full paid access until Stripe cancels.
  const entitled = sub.status === "active" || sub.status === "trialing";
  const patch = {
    plan: entitled ? planForPriceId(priceId) : ("free" as const),
    status: sub.status as SubscriptionStatus,
    stripe_subscription_id: sub.id,
    stripe_price_id: priceId,
    seats: sub.items.data[0]?.quantity ?? null,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    cancel_at_period_end: sub.cancel_at_period_end,
  };

  // Prefer the org id carried in metadata; otherwise match on the customer.
  if (orgId) {
    await admin
      .from("subscriptions")
      .update({ ...patch, stripe_customer_id: customerId })
      .eq("org_id", orgId);
  } else {
    await admin.from("subscriptions").update(patch).eq("stripe_customer_id", customerId);
  }
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const admin = createSupabaseAdminClient();
  if (!stripe || !STRIPE_WEBHOOK_SECRET || !admin) {
    return NextResponse.json({ error: "billing not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch {
    logger.warn("stripe webhook: invalid signature");
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await syncSubscription(admin, event.data.object);
        break;
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id,
          );
          await syncSubscription(admin, sub);
        }
        break;
      }
      default:
        break;
    }
  } catch (error) {
    // Log and signal Stripe to retry.
    captureError(error, { scope: "stripe.webhook", eventType: event.type });
    return NextResponse.json({ error: "handler error" }, { status: 500 });
  }

  logger.info("stripe webhook handled", { eventType: event.type });
  return NextResponse.json({ received: true });
}
