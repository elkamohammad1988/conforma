"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { RiskBadge } from "@/components/RiskBadge";
import { Countdown } from "@/components/Countdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { compliancePct, useSystems } from "@/lib/store";
import { RISK_TIERS, type RiskTier } from "@/lib/eu-ai-act";

const DIST_COLOR: Record<RiskTier, string> = {
  prohibited: "bg-red-500",
  high: "bg-amber-500",
  limited: "bg-blue-500",
  minimal: "bg-emerald-500",
};

/** Severity order for the "highest risk first" sort. */
const RISK_RANK: Record<RiskTier, number> = {
  prohibited: 0,
  high: 1,
  limited: 2,
  minimal: 3,
};

type SortKey = "recent" | "name" | "risk" | "compliance";
type TierFilter = "all" | RiskTier;
const PAGE_SIZE = 8;

export default function DashboardPage() {
  const systems = useSystems();

  const [query, setQuery] = useState("");
  const [tier, setTier] = useState<TierFilter>("all");
  const [sort, setSort] = useState<SortKey>("recent");
  const [page, setPage] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  // "/" focuses search from anywhere (unless already typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing =
        el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = useMemo(() => {
    if (!systems) return [];
    const q = query.trim().toLowerCase();
    const list = systems.filter((s) => {
      if (tier !== "all" && s.result.tier !== tier) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.owner.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    });
    const sorted = [...list];
    switch (sort) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "risk":
        sorted.sort((a, b) => RISK_RANK[a.result.tier] - RISK_RANK[b.result.tier]);
        break;
      case "compliance":
        sorted.sort((a, b) => compliancePct(a) - compliancePct(b));
        break;
      default:
        sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    }
    return sorted;
  }, [systems, query, tier, sort]);

  if (systems === null) return <DashboardSkeleton />;

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
  const nearest = systems
    .map((s) => s.result.deadline)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  // Clamp during render so a shrinking result set (after filtering) can't strand
  // the view on an out-of-range page — no page-reset effect needed.
  const currentPage = Math.min(page, pageCount - 1);
  const paged = filtered.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE,
  );

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
          sub={nearest ? <Countdown deadline={nearest.date} /> : "no systems yet"}
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
        <EmptyState
          className="mt-10"
          icon={<RegistryIcon />}
          title="No systems registered yet"
          description="Classify your first AI system to see exactly what the EU AI Act requires of it — with cited Articles and a tracked obligation checklist."
          action={{ href: "/classify", label: "Classify a system" }}
        />
      ) : (
        <>
          {/* Toolbar: search · tier filter · sort */}
          <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-xs flex-1">
              <SearchIcon />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search systems…"
                aria-label="Search systems"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-12 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 sm:block">
                /
              </kbd>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
                {(["all", "prohibited", "high", "limited", "minimal"] as TierFilter[]).map(
                  (t) => (
                    <button
                      key={t}
                      onClick={() => setTier(t)}
                      aria-pressed={tier === t}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium capitalize transition ${
                        tier === t
                          ? "bg-brand-600 text-white"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {t === "all" ? "All" : RISK_TIERS[t as RiskTier].short}
                    </button>
                  ),
                )}
              </div>
              <label className="sr-only" htmlFor="sort">
                Sort systems
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="recent">Most recent</option>
                <option value="risk">Highest risk</option>
                <option value="compliance">Lowest compliance</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 py-16 text-center">
              <p className="text-sm font-semibold text-slate-700">No matches</p>
              <p className="mt-1 text-sm text-slate-500">
                Try a different search or clear the filters.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setTier("all");
                }}
                className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">System</th>
                    <th className="px-5 py-3 font-medium">Risk</th>
                    <th className="hidden px-5 py-3 font-medium sm:table-cell">Owner</th>
                    <th className="px-5 py-3 font-medium">Compliance</th>
                    <th className="hidden px-5 py-3 font-medium md:table-cell">
                      Deadline
                    </th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paged.map((s) => {
                    const pct = compliancePct(s);
                    return (
                      <tr key={s.id} className="group transition hover:bg-slate-50">
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
                            <span className="text-xs font-medium text-slate-500 tabular-nums">
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
                            className="text-sm font-medium text-brand-600 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
                          >
                            Open →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination */}
              {pageCount > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-sm">
                  <span className="text-slate-500">
                    Showing{" "}
                    <span className="font-medium text-slate-700">
                      {currentPage * PAGE_SIZE + 1}–
                      {Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)}
                    </span>{" "}
                    of {filtered.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      className="rounded-lg px-3 py-1.5 font-medium text-slate-600 transition enabled:hover:bg-slate-200 disabled:opacity-40"
                    >
                      ← Prev
                    </button>
                    <span className="px-2 text-xs text-slate-400">
                      {currentPage + 1} / {pageCount}
                    </span>
                    <button
                      onClick={() => setPage(Math.min(pageCount - 1, currentPage + 1))}
                      disabled={currentPage >= pageCount - 1}
                      className="rounded-lg px-3 py-1.5 font-medium text-slate-600 transition enabled:hover:bg-slate-200 disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
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
      className={`rounded-xl border p-5 transition ${
        accent
          ? "border-brand-200 bg-brand-50/40"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1.5 text-2xl font-bold text-slate-900 tabular-nums">{value}</div>
      <div className="mt-0.5 text-xs text-slate-500">{sub}</div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Skeleton className="h-9 w-72" />
      <Skeleton className="mt-2 h-4 w-96 max-w-full" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[88px]" />
        ))}
      </div>
      <Skeleton className="mt-4 h-28" />
      <Skeleton className="mt-8 h-12" />
      <Skeleton className="mt-4 h-72" />
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 1 0 3.42 9.81l3.63 3.64a.75.75 0 1 0 1.06-1.06l-3.64-3.63A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function RegistryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
      <path
        d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path d="M4 9h16M9 13h6M9 16h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
