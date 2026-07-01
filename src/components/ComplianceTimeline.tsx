"use client";

import { COMPLIANCE_DEADLINES, daysUntil } from "@/lib/eu-ai-act";
import { Countdown } from "@/components/Countdown";
import { useClientValue } from "@/lib/use-client-value";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * The Art. 113 staged-application timeline. Each milestone shows whether it is
 * already in force or still upcoming, with a live countdown. "Today" is resolved
 * on the client so the status is always current rather than frozen at build time.
 */
export function ComplianceTimeline() {
  const { t, formatDate } = useI18n();
  const today = useClientValue(() => new Date().toISOString().slice(0, 10), null);

  const fmt = (iso: string) =>
    formatDate(iso, { year: "numeric", month: "short", day: "numeric" });

  const InForce = () => (
    <span className="inline-flex items-center gap-1 rounded-full bg-ok-500/10 px-2 py-0.5 text-[11px] font-semibold text-ok-400">
      ● {t("home.timeline.inForce")}
    </span>
  );

  return (
    <ol className="relative space-y-6 sm:space-y-0">
      {/* Connecting line */}
      <div
        aria-hidden
        className="absolute start-[15px] top-2 bottom-2 w-px bg-ink/10 sm:hidden"
      />
      <div className="hidden sm:grid sm:grid-cols-5 sm:gap-4">
        {COMPLIANCE_DEADLINES.map((d) => {
          const inForce = today ? daysUntil(d.date, today) < 0 : false;
          return (
            <li key={d.id} className="relative">
              <div
                aria-hidden
                className="absolute left-0 right-0 top-[11px] h-px bg-ink/10"
              />
              <div className="relative flex justify-center">
                <span
                  className={`h-3.5 w-3.5 rounded-full ring-4 ring-paper ${
                    inForce ? "bg-ok-500" : "bg-brand-600"
                  }`}
                />
              </div>
              <div className="mt-4 rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)]">
                <div className="font-mono text-xs font-semibold text-ink">
                  {fmt(d.date)}
                </div>
                <div className="mt-1 text-sm font-semibold text-ink">
                  {t(`domain.deadlines.${d.id}.label`)}
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-3">
                  {t(`domain.deadlines.${d.id}.description`)}
                </p>
                <div className="mt-2.5">
                  {inForce ? (
                    <InForce />
                  ) : (
                    <Countdown
                      deadline={d.date}
                      className="text-[11px] font-semibold text-warn-400"
                    />
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </div>

      {/* Mobile: vertical list */}
      <div className="space-y-5 sm:hidden">
        {COMPLIANCE_DEADLINES.map((d) => {
          const inForce = today ? daysUntil(d.date, today) < 0 : false;
          return (
            <li key={d.id} className="relative ps-10">
              <span
                className={`absolute start-2 top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-paper ${
                  inForce ? "bg-ok-500" : "bg-brand-600"
                }`}
              />
              <div className="font-mono text-xs font-semibold text-ink">
                {fmt(d.date)}
              </div>
              <div className="mt-0.5 text-sm font-semibold text-ink">
                {t(`domain.deadlines.${d.id}.label`)}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-ink-3">
                {t(`domain.deadlines.${d.id}.description`)}
              </p>
              <div className="mt-1.5">
                {inForce ? (
                  <InForce />
                ) : (
                  <Countdown
                    deadline={d.date}
                    className="text-[11px] font-semibold text-warn-400"
                  />
                )}
              </div>
            </li>
          );
        })}
      </div>
    </ol>
  );
}
