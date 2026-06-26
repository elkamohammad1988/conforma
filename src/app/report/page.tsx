"use client";

import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { RiskBadge } from "@/components/RiskBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { compliancePct, useSystems } from "@/lib/store";
import { RISK_TIERS, type RiskTier } from "@/lib/eu-ai-act";
import { useClientValue } from "@/lib/use-client-value";

export default function ReportPage() {
  const systems = useSystems();
  const generated = useClientValue(
    () =>
      new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    "",
  );

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
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          ← Dashboard
        </Link>
        <button
          onClick={() => window.print()}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Print / Save as PDF
        </button>
      </div>

      {/* Report sheet */}
      <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm print:border-0 print:shadow-none sm:p-12">
        <header className="flex items-start justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <LogoMark className="h-9 w-9" />
            <div>
              <div className="text-lg font-semibold tracking-tight">Conforma</div>
              <div className="text-xs text-slate-500">
                EU AI Act Compliance Readiness Report
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>Generated {generated}</div>
            <div>Regulation (EU) 2024/1689</div>
          </div>
        </header>

        {/* Executive summary */}
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Executive summary
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["Systems", String(systems.length)],
              ["High-risk +", String(highRisk)],
              ["Avg. compliance", `${avg}%`],
              ["Tiers in use", String(Object.keys(counts).length)],
            ].map(([l, v]) => (
              <div key={l} className="rounded-lg border border-slate-200 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-400">
                  {l}
                </div>
                <div className="mt-1 text-2xl font-bold text-slate-900">{v}</div>
              </div>
            ))}
          </div>

          {/* Risk distribution */}
          <div className="mt-6">
            <div className="mb-2 text-xs font-medium text-slate-500">
              Risk distribution
            </div>
            <RiskDistribution counts={counts} total={systems.length} />
          </div>
        </section>

        {/* Per-system table */}
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            System register
          </h2>
          <table className="mt-3 w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="py-2 font-medium">System</th>
                <th className="py-2 font-medium">Risk</th>
                <th className="py-2 font-medium">Owner</th>
                <th className="py-2 text-right font-medium">Outstanding</th>
                <th className="py-2 text-right font-medium">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {systems.map((s) => {
                const done = s.result.obligations.filter(
                  (o) => s.obligationStatus[o.id] === "done",
                ).length;
                const outstanding = s.result.obligations.length - done;
                return (
                  <tr key={s.id}>
                    <td className="py-2.5 font-medium text-slate-800">{s.name}</td>
                    <td className="py-2.5">
                      <RiskBadge tier={s.result.tier} size="sm" />
                    </td>
                    <td className="py-2.5 text-slate-500">{s.owner || "—"}</td>
                    <td className="py-2.5 text-right tabular-nums text-slate-700">
                      {outstanding}
                    </td>
                    <td className="py-2.5 text-right font-medium tabular-nums">
                      {compliancePct(s)}%
                    </td>
                  </tr>
                );
              })}
              {systems.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No systems registered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <footer className="mt-10 border-t border-slate-200 pt-5 text-xs leading-relaxed text-slate-400">
          This report is generated by Conforma as decision-support for Regulation
          (EU) 2024/1689. It does not constitute legal advice. Classifications
          should be confirmed with qualified counsel before reliance.
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
  const order: RiskTier[] = ["prohibited", "high", "limited", "minimal"];
  const color: Record<RiskTier, string> = {
    prohibited: "bg-red-500",
    high: "bg-amber-500",
    limited: "bg-blue-500",
    minimal: "bg-emerald-500",
  };
  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
        {total > 0 &&
          order.map((t) =>
            counts[t] ? (
              <div
                key={t}
                className={color[t]}
                style={{ width: `${((counts[t] ?? 0) / total) * 100}%` }}
              />
            ) : null,
          )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
        {order.map((t) => (
          <span key={t} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${color[t]}`} />
            {RISK_TIERS[t].short} · {counts[t] ?? 0}
          </span>
        ))}
      </div>
    </div>
  );
}
