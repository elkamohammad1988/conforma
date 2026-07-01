"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { RiskBadge } from "@/components/RiskBadge";
import { Countdown } from "@/components/Countdown";
import { ArrowForward } from "@/components/Arrow";
import { Magnetic } from "@/components/Motion";
import { Skeleton } from "@/components/ui/Skeleton";
import { compliancePct, useSystems, type RegisteredSystem } from "@/lib/store";
import { type RiskTier } from "@/lib/eu-ai-act";
import { useI18n } from "@/i18n/I18nProvider";

/** CSS custom-property colour for each tier — drives dots, bars and the donut. */
const RISK_VAR: Record<RiskTier, string> = {
  prohibited: "var(--color-risk-prohibited)",
  high: "var(--color-risk-high)",
  limited: "var(--color-risk-limited)",
  minimal: "var(--color-risk-minimal)",
};

/** Severity order — used for the donut, posture bar and "highest risk" sort. */
const RISK_RANK: Record<RiskTier, number> = {
  prohibited: 0,
  high: 1,
  limited: 2,
  minimal: 3,
};
const TIER_ORDER: RiskTier[] = ["prohibited", "high", "limited", "minimal"];
// Reuses the marketing "how it works" copy for the first-run onboarding steps.
const ONBOARD_STEPS = ["register", "classify", "closeGaps", "generate"] as const;

type SortKey = "recent" | "name" | "risk" | "compliance";
type TierFilter = "all" | RiskTier;
const PAGE_SIZE = 8;

export default function DashboardPage() {
  const { t, formatMonthYear, formatNumber } = useI18n();
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
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable);
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

  // Highest risk, then least compliant — the systems that need a human now.
  const attention = [...systems]
    .sort(
      (a, b) =>
        RISK_RANK[a.result.tier] - RISK_RANK[b.result.tier] ||
        compliancePct(a) - compliancePct(b),
    )
    .slice(0, 3);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const paged = filtered.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE,
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-9 sm:px-7 lg:py-11">
      {/* ------------------------------- Header ------------------------------ */}
      <header className="animate-rise relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-7 shadow-[var(--shadow-card)] sm:px-8 sm:py-8">
        {/* environmental corner light */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 h-64 w-64 rounded-full"
          style={{
            insetInlineEnd: "-3rem",
            background:
              "radial-gradient(closest-side, rgba(var(--crimson),0.18), transparent 70%)",
          }}
        />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-400/90">
              {t("dashboard.eyebrow")}
            </p>
            <h1 className="mt-2.5 text-[2rem] font-semibold leading-[1.02] tracking-tight text-ink sm:text-[2.4rem]">
              {t("dashboard.title")}
            </h1>
            <p className="mt-2.5 max-w-md text-[0.95rem] leading-relaxed text-ink-2">
              {t("dashboard.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {systems.length > 0 && (
              <Link href="/report" className="btn btn-secondary">
                <DownloadIcon />
                {t("dashboard.exportReport")}
              </Link>
            )}
            <Magnetic>
              <Link href="/classify" className="btn btn-primary">
                <PlusIcon />
                {t("dashboard.classifySystem")}
              </Link>
            </Magnetic>
          </div>
        </div>
      </header>

      {/* ----------------------------- KPI cards ----------------------------- */}
      {systems.length > 0 && (
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          delay={0}
          label={t("dashboard.kpi.systems")}
          tip={t("dashboard.kpi.systemsTip")}
          value={formatNumber(systems.length)}
          sub={t("dashboard.kpi.systemsSub", { count: highRiskCount })}
          icon={<RegistryGlyph />}
        />
        <StatCard
          delay={70}
          label={t("dashboard.kpi.compliance")}
          tip={t("dashboard.kpi.complianceTip")}
          value={`${avg}%`}
          progress={avg}
          sub={t("dashboard.kpi.complianceSub")}
          icon={<CheckGlyph />}
          featured
        />
        <StatCard
          delay={140}
          label={t("dashboard.kpi.highRisk")}
          tip={t("dashboard.kpi.highRiskTip")}
          value={formatNumber(counts.high ?? 0)}
          sub={t("dashboard.kpi.highRiskSub")}
          icon={<ShieldGlyph />}
        />
        <StatCard
          delay={210}
          label={t("dashboard.kpi.nearest")}
          tip={t("dashboard.kpi.nearestTip")}
          value={nearest ? formatMonthYear(nearest.date) : "—"}
          sub={
            nearest ? (
              <Countdown deadline={nearest.date} />
            ) : (
              t("dashboard.kpi.nearestNoSystems")
            )
          }
          icon={<ClockGlyph />}
        />
      </section>
      )}

      {systems.length === 0 ? (
        <DashboardEmpty />
      ) : (
        <>
          {/* ----------------------- Charts / overview ---------------------- */}
          <section className="mt-5 grid gap-4 lg:grid-cols-12">
            <RiskDistribution
              counts={counts}
              total={systems.length}
              className="lg:col-span-5"
            />
            <AttentionPanel
              systems={attention}
              avg={avg}
              nearest={nearest?.date}
              className="lg:col-span-7"
            />
          </section>

          {/* ------------------------- Registry table ----------------------- */}
          <section className="mt-9">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-lg font-semibold tracking-tight text-ink">
                {t("dashboard.allSystems")}
                <span className="ms-2 align-middle text-sm font-sans font-normal text-ink-3">
                  {formatNumber(filtered.length)}
                </span>
              </h2>
            </div>

            {/* Toolbar */}
            <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative max-w-xs flex-1">
                <SearchIcon />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("dashboard.searchPlaceholder")}
                  aria-label={t("dashboard.searchAria")}
                  className="field py-2.5 ps-9 pe-12"
                />
                <kbd className="pointer-events-none absolute end-3 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-ink-3 sm:block">
                  /
                </kbd>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="seg" role="group" aria-label={t("dashboard.filterAria")}>
                  {(["all", ...TIER_ORDER] as TierFilter[]).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTier(tf)}
                      data-active={tier === tf}
                      aria-pressed={tier === tf}
                      className="seg-item"
                    >
                      {tf === "all"
                        ? t("dashboard.all")
                        : t(`domain.riskTiers.${tf}.short`)}
                    </button>
                  ))}
                </div>
                <label className="sr-only" htmlFor="sort">
                  {t("dashboard.sortAria")}
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="field px-3 py-2.5"
                >
                  <option value="recent">{t("dashboard.sortRecent")}</option>
                  <option value="risk">{t("dashboard.sortRisk")}</option>
                  <option value="compliance">{t("dashboard.sortCompliance")}</option>
                  <option value="name">{t("dashboard.sortName")}</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-line-2 bg-surface-2/60 py-16 text-center">
                <p className="text-sm font-semibold text-ink">
                  {t("dashboard.noMatches")}
                </p>
                <p className="mt-1 text-sm text-ink-2">{t("dashboard.noMatchesBody")}</p>
                <button
                  onClick={() => {
                    setQuery("");
                    setTier("all");
                  }}
                  className="btn btn-secondary btn-sm mt-4"
                >
                  {t("dashboard.clearFilters")}
                </button>
              </div>
            ) : (
              <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
                <table className="w-full text-start text-sm">
                  <thead className="border-b border-line bg-surface-2 text-[11px] uppercase tracking-[0.08em] text-ink-3">
                    <tr>
                      <th className="px-5 py-3 text-start font-semibold">
                        {t("dashboard.table.system")}
                      </th>
                      <th className="px-5 py-3 text-start font-semibold">
                        {t("dashboard.table.risk")}
                      </th>
                      <th className="hidden px-5 py-3 text-start font-semibold sm:table-cell">
                        {t("dashboard.table.owner")}
                      </th>
                      <th className="px-5 py-3 text-start font-semibold">
                        {t("dashboard.table.compliance")}
                      </th>
                      <th className="hidden px-5 py-3 text-start font-semibold md:table-cell">
                        {t("dashboard.table.deadline")}
                      </th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {paged.map((s) => {
                      const pct = compliancePct(s);
                      return (
                        <tr
                          key={s.id}
                          className="group transition-colors hover:bg-surface-2/70"
                        >
                          <td className="px-5 py-3.5">
                            <Link
                              href={`/systems/${s.id}`}
                              className="font-semibold text-ink transition-colors group-hover:text-brand-300"
                            >
                              {s.name}
                            </Link>
                            {s.result.isGPAI && (
                              <span className="ms-2 rounded-md border border-brass-300/60 bg-brass-300/15 px-1.5 py-0.5 text-[10px] font-semibold text-brass-600">
                                GPAI
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <RiskBadge tier={s.result.tier} size="sm" />
                          </td>
                          <td className="hidden px-5 py-3.5 text-ink-2 sm:table-cell">
                            {s.owner || "—"}
                          </td>
                          <td className="px-5 py-3.5">
                            <ComplianceMeter pct={pct} />
                          </td>
                          <td className="hidden px-5 py-3.5 md:table-cell">
                            <Countdown
                              deadline={s.result.deadline.date}
                              className="text-xs font-medium text-ink-2"
                            />
                          </td>
                          <td className="px-5 py-3.5 text-end">
                            <Link
                              href={`/systems/${s.id}`}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-400 opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100"
                            >
                              {t("dashboard.table.open")}
                              <ArrowIcon />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {pageCount > 1 && (
                  <div className="flex items-center justify-between border-t border-line bg-surface-2/60 px-5 py-3 text-sm">
                    <span className="text-ink-2">
                      {t("dashboard.showing", {
                        from: formatNumber(currentPage * PAGE_SIZE + 1),
                        to: formatNumber(
                          Math.min((currentPage + 1) * PAGE_SIZE, filtered.length),
                        ),
                        total: formatNumber(filtered.length),
                      })}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPage(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                        className="btn btn-ghost btn-sm disabled:opacity-40"
                      >
                        <ArrowBack /> {t("dashboard.prev")}
                      </button>
                      <span className="px-2 text-xs text-ink-3 nums">
                        {formatNumber(currentPage + 1)} / {formatNumber(pageCount)}
                      </span>
                      <button
                        onClick={() => setPage(Math.min(pageCount - 1, currentPage + 1))}
                        disabled={currentPage >= pageCount - 1}
                        className="btn btn-ghost btn-sm disabled:opacity-40"
                      >
                        {t("dashboard.next")} <ArrowForward />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* KPI card                                                                   */
/* -------------------------------------------------------------------------- */
function StatCard({
  label,
  value,
  sub,
  tip,
  icon,
  progress,
  featured,
  delay = 0,
}: {
  label: string;
  value: string;
  sub: React.ReactNode;
  tip?: string;
  icon: React.ReactNode;
  progress?: number;
  featured?: boolean;
  delay?: number;
}) {
  return (
    <div
      className={`lift group animate-rise relative overflow-hidden rounded-2xl border p-5 shadow-[var(--shadow-card)] ${
        featured ? "border-brand-500/40 bg-brand-500/[0.07]" : "border-line bg-surface"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {featured && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/70 to-transparent"
        />
      )}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-3">
          {label}
          {tip && (
            <span
              className="tip cursor-help text-ink-3/70"
              data-tip={tip}
              tabIndex={0}
              aria-label={tip}
            >
              <InfoIcon />
            </span>
          )}
        </div>
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl border transition-transform duration-300 group-hover:scale-105 ${
            featured
              ? "border-transparent bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-[0_6px_18px_-6px_rgba(var(--crimson),0.7)]"
              : "border-line bg-surface-2 text-ink-2"
          }`}
        >
          {icon}
        </span>
      </div>
      <div className="mt-3.5 text-[2.1rem] font-semibold leading-none tracking-tight text-ink nums">
        {value}
      </div>
      {progress !== undefined ? (
        <div className="mt-3.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full transition-[width] duration-1000 ease-[var(--ease-out-quint)]"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, var(--color-brand-600), var(--color-brand-400))",
                boxShadow: "0 0 12px rgba(var(--crimson), 0.5)",
              }}
            />
          </div>
          <div className="mt-2 text-xs text-ink-2">{sub}</div>
        </div>
      ) : (
        <div className="mt-2 text-xs text-ink-2">{sub}</div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Risk distribution — bespoke donut                                          */
/* -------------------------------------------------------------------------- */
function RiskDistribution({
  counts,
  total,
  className = "",
}: {
  counts: Record<RiskTier, number>;
  total: number;
  className?: string;
}) {
  const { t, formatNumber } = useI18n();
  const R = 54;
  const C = 2 * Math.PI * R;
  const gap = total > 1 ? C * 0.014 : 0;

  const present = TIER_ORDER.filter((tier) => counts[tier]).map((tier) => ({
    t: tier,
    frac: (counts[tier] ?? 0) / total,
  }));
  const segments = present.map((s, i) => {
    const startFrac = present.slice(0, i).reduce((a, x) => a + x.frac, 0);
    const len = s.frac * C;
    return { t: s.t, len: Math.max(len - gap, 0.5), offset: -startFrac * C };
  });

  return (
    <div
      className={`animate-fade-in rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] ${className}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">
          {t("dashboard.riskDistribution")}
        </h2>
        <span className="rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-ink-3">
          {t("dashboard.total", { count: total })}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-6">
        <div className="relative h-[140px] w-[140px] shrink-0">
          <svg
            viewBox="0 0 140 140"
            className="h-full w-full -rotate-90"
            style={{ filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.5))" }}
          >
            <circle
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="15"
            />
            {segments.map((s) => (
              <circle
                key={s.t}
                cx="70"
                cy="70"
                r={R}
                fill="none"
                stroke={RISK_VAR[s.t]}
                strokeWidth="15"
                strokeLinecap="round"
                strokeDasharray={`${s.len} ${C - s.len}`}
                strokeDashoffset={s.offset}
                style={{ transition: "stroke-dasharray .8s var(--ease-out-quint)" }}
              />
            ))}
          </svg>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[20px] rounded-full"
            style={{ boxShadow: "inset 0 0 22px rgba(0,0,0,0.4)" }}
          />
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="text-[2.1rem] font-semibold leading-none text-ink nums">
                {formatNumber(total)}
              </div>
              <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-3">
                {t("dashboard.systemsUnit")}
              </div>
            </div>
          </div>
        </div>

        <ul className="flex-1 space-y-2.5">
          {TIER_ORDER.map((tier) => {
            const n = counts[tier] ?? 0;
            const pct = total ? Math.round((n / total) * 100) : 0;
            return (
              <li key={tier} className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                  style={{ background: RISK_VAR[tier] }}
                />
                <span className="text-sm text-ink-2">
                  {t(`domain.riskTiers.${tier}.short`)}
                </span>
                <span className="ms-auto text-sm font-semibold text-ink nums">
                  {formatNumber(n)}
                </span>
                <span className="w-10 text-end text-xs text-ink-3 nums">{pct}%</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Needs-attention panel                                                      */
/* -------------------------------------------------------------------------- */
function AttentionPanel({
  systems,
  avg,
  nearest,
  className = "",
}: {
  systems: RegisteredSystem[];
  avg: number;
  nearest?: string;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <div
      className={`animate-fade-in rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">{t("dashboard.needsAttention")}</h2>
          <p className="mt-0.5 text-xs text-ink-3">{t("dashboard.needsAttentionSub")}</p>
        </div>
        {nearest && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[11px] font-medium text-ink-2">
            <ClockGlyph className="h-3.5 w-3.5 text-brass-500" />
            <Countdown deadline={nearest} /> {t("dashboard.toNearestDeadline")}
          </span>
        )}
      </div>

      <ul className="mt-4 divide-y divide-line">
        {systems.map((s) => {
          const pct = compliancePct(s);
          return (
            <li key={s.id}>
              <Link
                href={`/systems/${s.id}`}
                className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-surface-2/70"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-ink group-hover:text-brand-300">
                      {s.name}
                    </span>
                    {s.result.isGPAI && (
                      <span className="rounded border border-brass-300/60 bg-brass-300/15 px-1 py-0.5 text-[9px] font-semibold text-brass-600">
                        GPAI
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ink-3">
                    {s.owner || t("dashboard.unassigned")}
                  </p>
                </div>
                <RiskBadge tier={s.result.tier} size="sm" />
                <div className="hidden w-28 sm:block">
                  <ComplianceMeter pct={pct} />
                </div>
                <ArrowIcon className="h-4 w-4 shrink-0 text-ink-3 transition group-hover:translate-x-0.5 group-hover:text-brand-400 rtl:-scale-x-100" />
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <span className="text-xs text-ink-2">
          {t("dashboard.portfolioCompliance")}{" "}
          <span className="font-semibold text-ink nums">{avg}%</span>
        </span>
        <Link
          href="/report"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300"
        >
          {t("dashboard.viewFullReport")}
          <ArrowIcon />
        </Link>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Compliance meter                                                           */
/* -------------------------------------------------------------------------- */
function ComplianceMeter({ pct }: { pct: number }) {
  const color =
    pct === 100
      ? "var(--color-brand-600)"
      : pct >= 50
        ? "var(--color-brass-500)"
        : "var(--color-risk-prohibited)";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="w-9 text-end text-xs font-medium text-ink-2 nums">{pct}%</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* First-run onboarding — the moment a new workspace first opens              */
/* -------------------------------------------------------------------------- */
function DashboardEmpty() {
  const { t } = useI18n();
  return (
    <section className="animate-fade-in relative mt-8 overflow-hidden rounded-3xl border border-line bg-surface px-6 py-14 text-center shadow-[var(--shadow-card)] sm:px-10 sm:py-20">
      {/* environmental light from above */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-28 h-72"
        style={{
          background:
            "radial-gradient(55% 100% at 50% 0%, rgba(var(--crimson),0.18), transparent 72%)",
        }}
      />
      <div className="relative mx-auto max-w-3xl">
        <div
          className="animate-float mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-brand-500/30 bg-brand-500/10 text-brand-400"
          style={{ boxShadow: "var(--glow-brand)" }}
        >
          <RegistryGlyph className="h-7 w-7" />
        </div>
        <h2 className="mt-7 text-[1.7rem] font-semibold tracking-tight text-ink">
          {t("dashboard.emptyTitle")}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink-2">
          {t("dashboard.emptyBody")}
        </p>

        <ol className="mx-auto mt-11 grid max-w-2xl gap-3 text-start sm:grid-cols-2 lg:grid-cols-4">
          {ONBOARD_STEPS.map((s, i) => (
            <li
              key={s}
              className="relative rounded-2xl border border-line bg-paper-2 p-4"
              style={{ animation: "enter 0.5s var(--ease-out-quint) both", animationDelay: `${i * 90}ms` }}
            >
              <div className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-sm font-semibold text-brand-400 nums">
                {i + 1}
              </div>
              <div className="mt-3 text-sm font-semibold text-ink">
                {t(`home.how.steps.${s}.title`)}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-ink-3">
                {t(`home.how.steps.${s}.desc`)}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex justify-center">
          <Magnetic>
            <Link href="/classify" className="btn btn-primary px-5 py-3 text-[0.95rem]">
              <PlusIcon /> {t("dashboard.classifySystem")}
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                   */
/* -------------------------------------------------------------------------- */
function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-9 sm:px-7 lg:py-11">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-3 h-10 w-72" />
      <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[124px] rounded-2xl" />
        ))}
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-12">
        <Skeleton className="h-56 rounded-2xl lg:col-span-5" />
        <Skeleton className="h-56 rounded-2xl lg:col-span-7" />
      </div>
      <Skeleton className="mt-9 h-12 rounded-xl" />
      <Skeleton className="mt-4 h-80 rounded-2xl" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers + icons                                                            */
/* -------------------------------------------------------------------------- */
function SearchIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
      className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 1 0 3.42 9.81l3.63 3.64a.75.75 0 1 0 1.06-1.06l-3.64-3.63A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function stroke(d: string, className = "h-[18px] w-[18px]") {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {d.split("|").map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

const PlusIcon = () => stroke("M12 5v14|M5 12h14", "h-4 w-4");
const ArrowIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) =>
  stroke("M5 12h14|M13 6l6 6-6 6", `${className} rtl:-scale-x-100`);
const ArrowBack = ({ className = "h-3.5 w-3.5" }: { className?: string }) =>
  stroke("M19 12H5|M11 6l-6 6 6 6", `${className} rtl:-scale-x-100`);
const DownloadIcon = () =>
  stroke("M12 4v11|M7.5 10.5 12 15l4.5-4.5|M5 19h14", "h-4 w-4");
const InfoIcon = () =>
  stroke("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z|M12 11v5|M12 7.5h.01", "h-3.5 w-3.5");
const RegistryGlyph = ({ className = "h-[18px] w-[18px]" }: { className?: string }) =>
  stroke(
    "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z|M4 9h16|M8 13h8|M8 16.5h5",
    className,
  );
const CheckGlyph = () =>
  stroke("M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M8 12.5l2.5 2.5L16 9.5");
const ShieldGlyph = () =>
  stroke("M12 3l7 2.5v5.5c0 4.6-3 8-7 9.5-4-1.5-7-4.9-7-9.5V5.5L12 3z|M12 8v4|M12 15.5h.01");
const ClockGlyph = ({ className = "h-[18px] w-[18px]" }: { className?: string }) =>
  stroke("M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z|M12 7v5l3 2", className);
