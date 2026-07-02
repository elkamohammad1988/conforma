"use client";

import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { RiskBadge } from "@/components/RiskBadge";
import { ArrowBackward } from "@/components/Arrow";
import { Skeleton } from "@/components/ui/Skeleton";
import { compliancePct, useSystems } from "@/lib/store";
import { type RiskTier } from "@/lib/eu-ai-act";
import { useClientValue } from "@/lib/use-client-value";
import { useI18n } from "@/i18n/I18nProvider";

export default function ReportPage() {
  const { t, formatDateLong } = useI18n();
  const systems = useSystems();
  const generated = useClientValue(() => formatDateLong(new Date()), "");

  if (systems === null) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-10">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
        <Skeleton className="h-[36rem] rounded-2xl" />
      </div>
    );
  }

  const counts = systems.reduce(
    (acc, s) => {
      acc[s.result.tier] = (acc[s.result.tier] ?? 0) + 1;
      return acc;
    },
    {} as Record<RiskTier, number>,
  );
  const avg =
    systems.length === 0
      ? 0
      : Math.round(
          systems.reduce((sum, s) => sum + compliancePct(s), 0) / systems.length,
        );
  const highRisk = (counts.high ?? 0) + (counts.prohibited ?? 0);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      {/* Action bar (hidden in print) */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm font-medium text-ink-3 hover:text-ink-2"
        >
          <ArrowBackward /> {t("report.backDashboard")}
        </Link>
        <button onClick={() => window.print()} className="btn btn-primary">
          {t("report.printSave")}
        </button>
      </div>

      {/* Report sheet */}
      <article className="rounded-2xl border border-line bg-surface p-8 shadow-[var(--shadow-card)] print:border-0 print:shadow-none sm:p-12">
        <header className="flex items-start justify-between border-b border-line pb-6">
          <div className="flex items-center gap-3">
            <LogoMark className="h-9 w-9" />
            <div>
              <div className="text-lg font-semibold tracking-tight">Conforma</div>
              <div className="text-xs text-ink-3">{t("report.reportTitle")}</div>
            </div>
          </div>
          <div className="text-end text-xs text-ink-3">
            <div>{t("report.generated", { date: generated })}</div>
            <div>{t("report.regulation")}</div>
          </div>
        </header>

        {/* Executive summary */}
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-ink-3">
            {t("report.executiveSummary")}
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              [t("report.summary.systems"), String(systems.length)],
              [t("report.summary.highRiskPlus"), String(highRisk)],
              [t("report.summary.avgCompliance"), `${avg}%`],
              [t("report.summary.tiersInUse"), String(Object.keys(counts).length)],
            ].map(([l, v]) => (
              <div key={l} className="rounded-lg border border-line p-4">
                <div className="text-xs uppercase tracking-[0.1em] text-ink-3">{l}</div>
                <div className="mt-1 text-2xl font-semibold text-ink nums">{v}</div>
              </div>
            ))}
          </div>

          {/* Risk distribution */}
          <div className="mt-6">
            <div className="mb-2 text-xs font-medium text-ink-3">
              {t("report.riskDistribution")}
            </div>
            <RiskDistribution counts={counts} total={systems.length} />
          </div>
        </section>

        {/* Per-system table */}
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-ink-3">
            {t("report.systemRegister")}
          </h2>
          <div className="mt-3 overflow-x-auto scrollbar-thin print:overflow-x-visible">
          <table className="w-full min-w-[32rem] text-start text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.1em] text-ink-3">
              <tr>
                <th className="py-2 text-start font-medium">{t("report.table.system")}</th>
                <th className="py-2 text-start font-medium">{t("report.table.risk")}</th>
                <th className="py-2 text-start font-medium">{t("report.table.owner")}</th>
                <th className="py-2 text-end font-medium">
                  {t("report.table.outstanding")}
                </th>
                <th className="py-2 text-end font-medium">
                  {t("report.table.compliance")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {systems.map((s) => {
                const done = s.result.obligations.filter(
                  (o) => s.obligationStatus[o.id] === "done",
                ).length;
                const outstanding = s.result.obligations.length - done;
                return (
                  <tr key={s.id}>
                    <td className="py-2.5 font-medium text-ink">{s.name}</td>
                    <td className="py-2.5">
                      <RiskBadge tier={s.result.tier} size="sm" />
                    </td>
                    <td className="py-2.5 text-ink-3">{s.owner || "—"}</td>
                    <td className="py-2.5 text-end nums text-ink-2">
                      {outstanding}
                    </td>
                    <td className="py-2.5 text-end font-medium nums">
                      {compliancePct(s)}%
                    </td>
                  </tr>
                );
              })}
              {systems.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-ink-3">
                    {t("report.noSystems")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </section>

        <footer className="mt-10 border-t border-line pt-5 text-xs leading-relaxed text-ink-3">
          {t("report.footer")}
        </footer>
      </article>
    </div>
  );
}

function RiskDistribution({
  counts,
  total,
}: {
  counts: Record<RiskTier, number>;
  total: number;
}) {
  const { t } = useI18n();
  const order: RiskTier[] = ["prohibited", "high", "limited", "minimal"];
  const color: Record<RiskTier, string> = {
    prohibited: "bg-[var(--color-risk-prohibited)]",
    high: "bg-[var(--color-risk-high)]",
    limited: "bg-[var(--color-risk-limited)]",
    minimal: "bg-[var(--color-risk-minimal)]",
  };
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-ink/10">
        {total > 0 &&
          order.map((tier) =>
            counts[tier] ? (
              <div
                key={tier}
                className={color[tier]}
                style={{ width: `${((counts[tier] ?? 0) / total) * 100}%` }}
              />
            ) : null,
          )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-3">
        {order.map((tier) => (
          <span key={tier} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${color[tier]}`} />
            {t(`domain.riskTiers.${tier}.short`)} · {counts[tier] ?? 0}
          </span>
        ))}
      </div>
    </div>
  );
}
