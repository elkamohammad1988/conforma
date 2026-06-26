"use client";

import Link from "next/link";
import { RiskBadge } from "@/components/RiskBadge";
import { Countdown } from "@/components/Countdown";
import { compliancePct, useSystems } from "@/lib/store";
import { RISK_TIERS, type RiskTier } from "@/lib/eu-ai-act";

const DIST_COLOR: Record<RiskTier, string> = {
  prohibited: "bg-red-500",
  high: "bg-amber-500",
  limited: "bg-blue-500",
  minimal: "bg-emerald-500",
};

export default function DashboardPage() {
  const systems = useSystems();

  if (systems === null) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-slate-400">Loading…</div>
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

  const highRiskCount = (counts.high ?? 0) + (counts.prohibited ?? 0);

  // Nearest upcoming deadline across the portfolio.
  const nearest = systems
    .map((s) => s.result.deadline)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI System Registry</h1>
          <p className="mt-1 text-slate-500">
            Every AI system you build or deploy, with its EU AI Act status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {systems.length > 0 && (
            <Link
              href="/report"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Export report
            </Link>
          )}
          <Link
            href="/classify"
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            + Classify a system
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Systems registered"
          value={String(systems.length)}
          sub={`${highRiskCount} high-risk or prohibited`}
        />
        <SummaryCard
          label="Portfolio compliance"
          value={`${avg}%`}
          sub="avg. obligations closed"
          accent
        />
        <SummaryCard
          label="High-risk systems"
          value={String(counts.high ?? 0)}
          sub="full Chapter III obligations"
        />
        <SummaryCard
          label="Nearest deadline"
          value={nearest ? nearest.date.slice(0, 7) : "—"}
          sub={
            nearest ? <Countdown deadline={nearest.date} /> : "no systems yet"
          }
        />
      </div>

      {/* Compliance posture */}
      {systems.length > 0 && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Compliance posture
            </h2>
            <Link
              href="/report"
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              View full report →
            </Link>
          </div>
          <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-slate-100">
            {(["prohibited", "high", "limited", "minimal"] as RiskTier[]).map((t) =>
              counts[t] ? (
                <div
                  key={t}
                  className={DIST_COLOR[t]}
                  style={{ width: `${((counts[t] ?? 0) / systems.length) * 100}%` }}
                  title={`${t}: ${counts[t]}`}
                />
              ) : null,
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-500">
            {(["prohibited", "high", "limited", "minimal"] as RiskTier[]).map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${DIST_COLOR[t]}`} />
                {RISK_TIERS[t].short} · {counts[t] ?? 0}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {systems.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center">
          <p className="text-lg font-semibold text-slate-700">
            No systems registered yet
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            Classify your first AI system to see exactly what the EU AI Act
            requires of it.
          </p>
          <Link
            href="/classify"
            className="mt-6 inline-flex rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Classify a system
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">System</th>
                <th className="px-5 py-3 font-medium">Risk</th>
                <th className="hidden px-5 py-3 font-medium sm:table-cell">
                  Owner
                </th>
                <th className="px-5 py-3 font-medium">Compliance</th>
                <th className="hidden px-5 py-3 font-medium md:table-cell">
                  Deadline
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {systems.map((s) => {
                const pct = compliancePct(s);
                return (
                  <tr key={s.id} className="group hover:bg-slate-50">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/systems/${s.id}`}
                        className="font-semibold text-slate-800 group-hover:text-brand-700"
                      >
                        {s.name}
                      </Link>
                      {s.result.isGPAI && (
                        <span className="ml-2 rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-medium text-brand-700">
                          GPAI
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <RiskBadge tier={s.result.tier} size="sm" />
                    </td>
                    <td className="hidden px-5 py-3.5 text-slate-500 sm:table-cell">
                      {s.owner || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              pct === 100
                                ? "bg-emerald-500"
                                : pct >= 50
                                  ? "bg-brand-500"
                                  : "bg-amber-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                          {pct}%
                        </span>
                      </div>
                    </td>
                    <td className="hidden px-5 py-3.5 md:table-cell">
                      <Countdown
                        deadline={s.result.deadline.date}
                        className="text-xs font-medium text-slate-500"
                      />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/systems/${s.id}`}
                        className="text-sm font-medium text-brand-600 opacity-0 transition group-hover:opacity-100"
                      >
                        Open →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        accent ? "border-brand-200 bg-brand-50/40" : "border-slate-200 bg-white"
      }`}
    >
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1.5 text-2xl font-bold text-slate-900">{value}</div>
      <div className="mt-0.5 text-xs text-slate-500">{sub}</div>
    </div>
  );
}
