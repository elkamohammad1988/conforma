"use client";

/**
 * Billing panel for Settings (Production Mode only).
 *
 * Reads the active plan from the session and live usage from the registry
 * store, then offers upgrade / manage actions to owners & admins. Renders
 * nothing in Demo Mode (no session). Kept visually consistent with the other
 * settings cards (`glass rounded-2xl` surface, same icon/heading rhythm).
 */

import { useTransition } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { useSession } from "@/components/auth/SessionProvider";
import { useSystems } from "@/lib/store";
import { useToast } from "@/components/ui/Toast";
import { PLAN_LIMITS, type PlanTier } from "@/lib/billing/plans";
import { track } from "@/lib/analytics";
import {
  createCheckoutSessionAction,
  openBillingPortalAction,
} from "@/lib/billing/actions";

function CardIcon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-[18px] w-[18px]"
    >
      {d.split("|").map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

export function BillingPanel() {
  const { t } = useI18n();
  const { toast } = useToast();
  const session = useSession();
  const systems = useSystems();
  const [pending, startTransition] = useTransition();

  // Demo Mode: no billing surface.
  if (!session) return null;

  const { plan, activeOrg, billingEnabled } = session;
  const canManage = activeOrg ? activeOrg.role !== "member" : false;
  const systemLimit = PLAN_LIMITS[plan].systems;
  const used = systems?.length ?? 0;
  const pct =
    systemLimit === null ? 0 : Math.min(100, Math.round((used / systemLimit) * 100));

  const run = (action: () => Promise<{ error?: string }>) =>
    startTransition(async () => {
      const res = await action();
      if (res?.error) toast(t("auth.errors.generic"));
    });

  const upgrade = (target: PlanTier) => {
    track("billing_upgrade_click", { from: plan, to: target });
    run(() => createCheckoutSessionAction(target === "team" ? "team" : "pro", "monthly"));
  };

  return (
    <section className="glass rounded-2xl p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-ink-2">
          <CardIcon d="M3 7h18v10H3z|M3 10h18|M7 14h4" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[0.95rem] font-semibold text-ink">{t("billing.title")}</h2>
          <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{t("billing.desc")}</p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {/* Current plan */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm text-ink-2">{t("billing.currentPlan")}</span>
          <span className="inline-flex items-center gap-2">
            <span className="rounded-full border border-brand-500/40 bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-400">
              {t(`billing.plan.${plan}`)}
            </span>
          </span>
        </div>

        {/* Usage meter */}
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-2">{t("billing.usage")}</span>
            <span className="nums font-medium text-ink">
              {systemLimit === null
                ? t("billing.unlimited")
                : t("billing.usageCount", { used, limit: systemLimit })}
            </span>
          </div>
          {systemLimit !== null && (
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        {!billingEnabled ? (
          <p className="text-xs text-ink-3">{t("billing.disabled")}</p>
        ) : !canManage ? (
          <p className="text-xs text-ink-3">{t("billing.memberNote")}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {plan === "free" && (
              <>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => upgrade("pro")}
                  className="btn btn-primary btn-sm"
                >
                  {t("billing.upgradePro")}
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => upgrade("team")}
                  className="btn btn-secondary btn-sm"
                >
                  {t("billing.upgradeTeam")}
                </button>
              </>
            )}
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => openBillingPortalAction())}
              className={`btn btn-sm ${plan === "free" ? "btn-secondary" : "btn-primary"}`}
            >
              {t("billing.manage")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
