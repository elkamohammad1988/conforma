"use client";

import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { PricingTable } from "@/components/PricingTable";
import { LandingDemo } from "@/components/LandingDemo";
import { ComplianceTimeline } from "@/components/ComplianceTimeline";
import { Reveal } from "@/components/Reveal";
import { RiskBadge } from "@/components/RiskBadge";
import { Spotlight, TiltCard, Magnetic } from "@/components/Motion";
import { classify, EMPTY_ANSWERS } from "@/lib/classifier";
import { renderRationale } from "@/i18n/rationale";
import {
  ANNEX_III_AREAS,
  PENALTIES,
  PRIMARY_DEADLINE,
  RISK_TIERS,
} from "@/lib/eu-ai-act";
import { AUTHOR } from "@/lib/site";
import { useI18n } from "@/i18n/I18nProvider";

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 rtl:-scale-x-100">
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// The hero instrument shows the product's real output — a genuine, cited
// classification from the same deterministic engine the app ships. Employment /
// CV-screening resolves to High risk with Annex III + Chapter III citations. The
// result is locale-free, so it is computed once here and rendered per-locale.
const HERO_RESULT = classify({
  ...EMPTY_ANSWERS,
  isAISystem: true,
  annexIII: ["employment"],
});

// A faint registry sits behind the focused verdict — depth, plus the "inventory"
// story. System names are product nouns; the header label is translated.
const REGISTRY_HINT = [
  { name: "HelpDesk Copilot", dot: "bg-risk-limited", pct: 100 },
  { name: "SentinelAML — transaction monitoring", dot: "bg-risk-high", pct: 20 },
  { name: "ForecastIQ — demand planning", dot: "bg-risk-minimal", pct: 100 },
] as const;

// Standard/brand framework names — intentionally not translated.
const FRAMEWORKS = ["EU AI Act · 2024/1689", "GDPR", "ISO/IEC 42001", "NIST AI RMF"];
const FAQ_KEYS = ["scope", "advice", "deadline", "accuracy", "data"] as const;
const FEATURE_KEYS = ["cited", "annexIII", "drafted", "deadlines", "roles", "gpai"] as const;
const PERSONA_KEYS = ["legal", "product", "security"] as const;
const STEP_KEYS = ["register", "classify", "closeGaps", "generate"] as const;
const STAT_KEYS = ["fine", "areas", "deadline", "states"] as const;
const SECURITY_BADGES = ["residency", "encryption", "sso", "rbac", "audit", "dpa"] as const;
const TIER_ORDER = ["prohibited", "high", "limited", "minimal"] as const;

export default function Home() {
  const { t, formatCurrency, formatDate } = useI18n();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Conforma",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: t("metadata.root.ogDescription"),
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        author: { "@type": "Person", name: AUTHOR.name, url: AUTHOR.url },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_KEYS.map((k) => ({
          "@type": "Question",
          name: t(`home.faq.items.${k}.q`),
          acceptedAnswer: { "@type": "Answer", text: t(`home.faq.items.${k}.a`) },
        })),
      },
    ],
  };

  const heroDate = formatDate(PRIMARY_DEADLINE.date, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden border-b border-line">
        {/* Ambient crimson light behind the headline — a glow that sits BEHIND
            the hero, not on it. Logical inset so it mirrors in RTL; low opacity
            reads as a soft halo on dark and a faint warm wash on light. */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-4 h-80 w-80 rounded-full bg-[rgba(var(--accent),0.10)] blur-[110px] [inset-inline-start:-5rem]"
        />
        <Spotlight className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr]">
            {/* Message */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-ink/[0.05] px-3.5 py-1.5 text-xs font-medium text-ink-2 backdrop-blur">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
                </span>
                {t("home.hero.badge")} {heroDate}
                <span className="text-ink-3">·</span>
                <Countdown
                  deadline={PRIMARY_DEADLINE.date}
                  className="font-medium text-brass-300"
                />
              </div>
              <h1 className="text-balance text-[2.9rem] font-semibold leading-[0.97] tracking-[-0.03em] sm:text-[3.65rem] lg:text-[4.35rem]">
                {t("home.hero.titleLine1")}{" "}
                <span className="text-accent">{t("home.hero.titleAccent")}</span>
              </h1>
              <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-ink-2">
                {t("home.hero.subtitle")}
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Magnetic>
                  <Link href="/classify" className="btn btn-primary px-5 py-3 text-[0.95rem]">
                    {t("common.startFree")} <ArrowRight />
                  </Link>
                </Magnetic>
                <Link href="/demo" className="btn btn-secondary px-5 py-3 text-[0.95rem]">
                  {t("common.bookDemo")}
                </Link>
              </div>
              <p className="mt-5 text-xs text-ink-3">{t("home.hero.fineprint")}</p>
            </div>

            {/* The product's real output — a live, cited classification laid
                over a hint of the registry behind it. One authoritative
                instrument with layered depth, not a cluster of vanity KPIs. */}
            <div className="relative hidden h-[28rem] lg:block" aria-hidden>
              <HeroClassification />
            </div>
          </div>

          {/* Framework certification rail — a designed band, not floating words.
              A centred eyebrow flanked by fading hairlines, then each framework
              on a single baseline behind a brand-diamond mark, split by logical
              start-dividers so the whole reads as "aligned / certified". */}
          <div className="mt-20">
            <div className="flex items-center justify-center gap-4">
              <span
                aria-hidden
                className="h-px w-8 bg-gradient-to-r from-transparent to-line-2 sm:w-14"
              />
              <p className="text-center text-[0.7rem] font-semibold uppercase tracking-[0.17em] text-ink-3">
                {t("home.hero.trustEyebrow")}
              </p>
              <span
                aria-hidden
                className="h-px w-8 bg-gradient-to-l from-transparent to-line-2 sm:w-14"
              />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {FRAMEWORKS.map((f) => (
                <span
                  key={f}
                  className="group inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-ink-soft transition-colors hover:text-ink sm:border-s sm:border-line-2 sm:ps-6 sm:first:border-s-0 sm:first:ps-0"
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rotate-45 rounded-[1px] bg-brand-500/70 transition-all duration-300 group-hover:bg-brand-500 group-hover:shadow-[0_0_8px_rgba(var(--accent),0.85)]"
                  />
                  {f}
                </span>
              ))}
            </div>
          </div>
        </Spotlight>
      </section>

      {/* ------------------------------------------------------- Product showcase */}
      <section className="relative bg-paper">
        <div className="mx-auto -mt-12 max-w-5xl px-5 pb-16 sm:-mt-16">
          <ProductShowcase />
        </div>
      </section>

      {/* --------------------------------------------------------- Stat strip
          A designed metric band — start-side hairline rules (only across the
          4-up row, so mobile stays clean; logical, so they mirror in RTL),
          confident display numerals, and the max-penalty figure carrying the
          signature accent as the stakes hook. Not a plain centered number row. */}
      <section className="border-y border-line bg-paper-2">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-5 py-12 sm:grid-cols-4 sm:gap-y-0">
          {STAT_KEYS.map((k, i) => (
            <div
              key={k}
              className={`px-4 text-center sm:px-6 ${
                i > 0 ? "sm:border-s sm:border-line" : ""
              }`}
            >
              <div
                className={`text-[2.15rem] font-semibold leading-none tracking-tight nums sm:text-[2.6rem] ${
                  i === 0 ? "text-accent" : "text-ink"
                }`}
              >
                {t(`home.stats.${k}.value`)}
              </div>
              <div className="mt-2.5 text-sm font-medium text-ink-2">
                {t(`home.stats.${k}.label`)}
              </div>
              <div className="mt-0.5 text-xs text-ink-3">{t(`home.stats.${k}.sub`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- Interactive demo */}
      <section id="try" className="mx-auto max-w-6xl px-5 py-20 scroll-mt-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">
            {t("home.interactiveDemo.eyebrow")}
          </p>
          <h2 className="mt-3 text-[1.9rem] font-semibold tracking-tight text-ink sm:text-[2.35rem]">
            {t("home.interactiveDemo.title")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">
            {t("home.interactiveDemo.subtitle")}
          </p>
        </Reveal>
        <Reveal className="mt-12" delay={80}>
          <LandingDemo />
        </Reveal>
      </section>

      {/* --------------------------------------------------------- The problem */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">
              {t("home.problem.eyebrow")}
            </p>
            <h2 className="mt-3 text-[1.9rem] font-semibold tracking-tight text-ink sm:text-[2.35rem]">
              {t("home.problem.title")}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-2">
              {t("home.problem.p1")}
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-2">
              {t("home.problem.p2")}
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow-card)]">
            <div className="rounded-xl bg-paper-2 p-6 font-mono text-sm text-ink-2" dir="ltr">
              <div className="text-ink-3">{t("home.problem.code.comment")}</div>
              <div className="mt-2">
                <span className="text-brand-400">system</span> = &quot;CV screening
                model&quot;
              </div>
              <div>
                <span className="text-brand-400">use_case</span> = Annex III(4)
                employment
              </div>
              <div className="mt-3 text-warn-400">{t("home.problem.code.result")}</div>
              <div className="mt-2 text-ink-3">{t("home.problem.code.obligations")}</div>
              <div className="text-ink-3">
                {t("home.problem.code.deadlineLabel")} {PRIMARY_DEADLINE.date}
              </div>
              <div className="mt-3 text-ok-400">{t("home.problem.code.drafted")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Personas
          An asymmetric editorial split — thesis pinned on the start side, the
          three stakeholders as an icon-led list on the end side. A deliberately
          different rhythm from the centred card grids, and it embodies the
          "one source, every stakeholder" message. */}
      <section className="border-y border-line bg-paper-2">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">
                  {t("home.personas.eyebrow")}
                </p>
                <h2 className="mt-3 text-[1.9rem] font-semibold tracking-tight text-ink sm:text-[2.35rem]">
                  {t("home.personas.title")}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-ink-2">
                  {t("home.personas.subtitle")}
                </p>
              </div>
            </Reveal>
            <div className="flex flex-col gap-4">
              {PERSONA_KEYS.map((p, i) => (
                <Reveal key={p} delay={i * 90}>
                  <div className="lift sweep group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)] sm:p-6">
                    <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-surface text-brand-400 shadow-[var(--shadow-card)]">
                      <FIcon d={PERSONA_ICONS[p]} className="h-[19px] w-[19px]" />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent"
                      />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[1.05rem] font-semibold tracking-tight text-ink">
                        {t(`home.personas.items.${p}.role`)}
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
                        {t(`home.personas.items.${p}.desc`)}
                      </p>
                    </div>
                    <span
                      aria-hidden
                      className="ms-auto self-center text-ink-3 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 rtl:-scale-x-100"
                    >
                      <ArrowRight />
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Risk tiers */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[1.9rem] font-semibold tracking-tight text-ink sm:text-[2.35rem]">
            {t("home.tiers.title")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">
            {t("home.tiers.subtitle")}
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TIER_ORDER.map((tier) => {
            const accent: Record<string, string> = {
              prohibited: "border-t-[var(--color-risk-prohibited)]",
              high: "border-t-[var(--color-risk-high)]",
              limited: "border-t-[var(--color-risk-limited)]",
              minimal: "border-t-[var(--color-risk-minimal)]",
            };
            const summary = t(`domain.riskTiers.${tier}.summary`);
            return (
              <div
                key={tier}
                className={`lift rounded-xl border border-line border-t-4 bg-surface p-5 shadow-[var(--shadow-card)] ${accent[tier]}`}
              >
                <div className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-3">
                  {RISK_TIERS[tier].primaryCitation}
                </div>
                <div className="mt-1 text-lg font-semibold text-ink">
                  {t(`domain.riskTiers.${tier}.short`)}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  {summary.length > 130 ? summary.slice(0, 130) + "…" : summary}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------------- How it works */}
      <section id="how" className="border-y border-line bg-paper-2 scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[1.9rem] font-semibold tracking-tight text-ink sm:text-[2.35rem]">
              {t("home.how.title")}
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {STEP_KEYS.map((s, idx) => (
              <div key={s} className="group">
                <div className="relative grid h-12 w-12 place-items-center rounded-xl border border-line bg-surface text-[1.05rem] font-semibold text-brand-400 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-quint)] nums group-hover:-translate-y-0.5 group-hover:shadow-[var(--shadow-raised)]">
                  {idx + 1}
                  {/* 1px top-edge highlight, tinted with the accent — catches the light. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">
                  {t(`home.how.steps.${s}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  {t(`home.how.steps.${s}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- Compliance timeline */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">
            {t("home.timeline.eyebrow")}
          </p>
          <h2 className="mt-3 text-[1.9rem] font-semibold tracking-tight text-ink sm:text-[2.35rem]">
            {t("home.timeline.title")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">
            {t("home.timeline.subtitle")}
          </p>
        </Reveal>
        <Reveal className="mt-14" delay={80}>
          <ComplianceTimeline />
        </Reveal>
      </section>

      {/* ------------------------------------------------------------- Features */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-[1.9rem] font-semibold tracking-tight text-ink sm:text-[2.35rem]">
            {t("home.features.title")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">
            {t("home.features.subtitle")}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <FeaturesBento />
        </Reveal>
      </section>

      {/* ----------------------------------------------------------- Comparison */}
      <section className="border-y border-line bg-paper-2">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[1.9rem] font-semibold tracking-tight text-ink sm:text-[2.35rem]">
              {t("home.comparison.title")}
            </h2>
          </div>
          <ComparisonTable />
        </div>
      </section>

      {/* ---------------------------------------------------------- Testimonials */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[1.9rem] font-semibold tracking-tight text-ink sm:text-[2.35rem]">
            {t("home.testimonials.title")}
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {(["one", "two", "three"] as const).map((k) => (
            <figure
              key={k}
              className="lift flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]"
            >
              <div className="text-brass-600" aria-hidden>
                ★★★★★
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-2">
                “{t(`home.testimonials.items.${k}.quote`)}”
              </blockquote>
              <figcaption className="mt-4 border-t border-line pt-3 text-sm">
                <div className="font-semibold text-ink">
                  {t(`home.testimonials.items.${k}.name`)}
                </div>
                <div className="text-ink-3">
                  {t(`home.testimonials.items.${k}.company`)}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-ink-3">
          {t("home.testimonials.note")}
        </p>
      </section>

      {/* ------------------------------------------------------------- Penalty */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="rounded-2xl border border-line bg-surface p-10 text-center shadow-[var(--shadow-card)] sm:p-14">
          <div>
            <h2 className="text-[1.9rem] font-semibold tracking-tight text-ink sm:text-[2.35rem]">
              {t("home.penalty.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-ink-2">
              {t("home.penalty.subtitle")}
            </p>
            <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
              {(
                [
                  ["prohibited", PENALTIES.prohibited],
                  ["highRisk", PENALTIES.highRisk],
                  ["misleadingInfo", PENALTIES.misleadingInfo],
                ] as const
              ).map(([key, pen]) => (
                <div
                  key={key}
                  className="lift rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]"
                >
                  <div className="text-[2.5rem] font-semibold leading-none tracking-tight text-ink nums sm:text-[2.75rem]">
                    {formatCurrency(pen.amountEur / 1_000_000)}M
                  </div>
                  <div className="mt-1 text-sm text-ink-2">
                    {t("home.penalty.orTurnover", { pct: pen.turnoverPct })}
                  </div>
                  <div className="mt-3 text-xs uppercase tracking-[0.1em] text-ink-3">
                    {t(`home.penalty.labels.${key}`)} · {pen.citation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Security band */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid items-center gap-10 rounded-2xl border border-line bg-surface p-8 shadow-[var(--shadow-card)] lg:grid-cols-2 lg:p-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">
              {t("home.security.eyebrow")}
            </p>
            <h2 className="mt-3 text-[1.9rem] font-semibold tracking-tight text-ink sm:text-[2.35rem]">
              {t("home.security.title")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-2">
              {t("home.security.body")}
            </p>
            <Link
              href="/security"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-400 hover:underline"
            >
              {t("home.security.cta")} <ArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SECURITY_BADGES.map((b) => (
              <div
                key={b}
                className="flex items-center gap-2 rounded-lg border border-line bg-ink/[0.03] px-3 py-2.5 text-sm font-medium text-ink-2"
              >
                <span className="text-brand-400">✓</span>
                {t(`home.security.badges.${b}`)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Pricing */}
      <section id="pricing" className="border-t border-line bg-paper-2 scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[1.9rem] font-semibold tracking-tight text-ink sm:text-[2.35rem]">
              {t("home.pricing.title")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-2">
              {t("home.pricing.subtitle")}
            </p>
          </div>
          <div className="mt-12">
            <PricingTable />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-5 py-20 scroll-mt-20">
        <h2 className="text-center text-[1.9rem] font-semibold tracking-tight text-ink sm:text-[2.35rem]">
          {t("home.faq.title")}
        </h2>
        <div className="mt-10 divide-y divide-line rounded-2xl border border-line bg-surface">
          {FAQ_KEYS.map((k) => (
            <details key={k} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
                {t(`home.faq.items.${k}.q`)}
                <span className="text-ink-3 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-2">
                {t(`home.faq.items.${k}.a`)}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------- Final CTA */}
      <section className="border-t border-line bg-paper-2">
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h2 className="text-[1.9rem] font-semibold tracking-tight text-ink sm:text-[2.35rem]">
            {t("home.finalCta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-2">
            {t("home.finalCta.subtitle")}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/classify" className="btn btn-primary px-5 py-3 text-[0.95rem]">
              {t("common.startFree")} <ArrowRight />
            </Link>
            <Link href="/demo" className="btn btn-secondary px-5 py-3 text-[0.95rem]">
              {t("common.bookDemo")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * The hero instrument. Not decorative KPIs — the product's actual verdict: a
 * real classification (from the shipped engine) with its cited Articles, floated
 * over a dimmed hint of the registry for depth. A slow aperture scan gives it
 * life; every string is already localised, so it mirrors cleanly in RTL.
 */
function HeroClassification() {
  const { t } = useI18n();
  const result = HERO_RESULT;
  const cites = result.rationale.filter((r) => r.citation).slice(0, 2);

  return (
    <>
      {/* Environmental platform light beneath the composition. Two crimson
          pools, tuned so the instrument sits on a soft halo on the dark canvas
          AND on a faint warm ground on the daylight paper — the card never
          floats untethered on light. */}
      <div className="absolute bottom-4 start-1/2 h-28 w-[82%] -translate-x-1/2 rounded-[50%] bg-[rgba(var(--accent),0.24)] blur-[64px] rtl:translate-x-1/2" />
      <div className="absolute bottom-20 start-[56%] h-44 w-44 -translate-x-1/2 rounded-full bg-[rgba(var(--accent),0.12)] blur-[80px] rtl:translate-x-1/2" />

      {/* Registry behind — the inventory the verdict was drawn from. Tucked up
          and to the end so it peeks from behind the verdict card, its lower edge
          fading under it. Kept legible in BOTH themes (was over-dimmed on the
          light paper): a real shadowed card, faded only at its foot. */}
      <div className="absolute end-0 top-1 w-[17.5rem] rotate-[2.4deg] opacity-[0.88] [mask-image:linear-gradient(180deg,#000_0%,#000_60%,transparent)]">
        <div className="glass rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-ink-3">
            {t("home.showcase.registryTitle")}
          </div>
          <div className="mt-3 space-y-2.5">
            {REGISTRY_HINT.map((r) => (
              <div key={r.name} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${r.dot}`} />
                  <span className="truncate text-xs text-ink-2">{r.name}</span>
                </div>
                <span className="h-1 w-9 shrink-0 overflow-hidden rounded-full bg-ink/10">
                  <span
                    className="block h-full rounded-full bg-ink/25"
                    style={{ width: `${r.pct}%` }}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Foreground — the live, cited verdict. */}
      <TiltCard max={7} className="absolute bottom-1 start-0 z-10 w-[22rem]">
        <div className="glass sweep relative overflow-hidden rounded-2xl p-5 shadow-[var(--shadow-raised)]">
          <span
            aria-hidden
            className="hero-scan pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(var(--accent),0.16),transparent)]"
          />

          {/* Live header */}
          <div className="relative flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-3">
              {t("landingDemo.liveClassification")}
            </span>
          </div>

          {/* The system under assessment */}
          <div className="relative mt-3 text-[0.95rem] font-semibold tracking-tight text-ink">
            TalentRank — CV screening
          </div>

          {/* The verdict */}
          <div className="relative mt-3 flex flex-wrap items-center gap-2.5">
            <RiskBadge tier={result.tier} />
            <span className="text-sm font-semibold text-ink-soft">
              {t(`domain.riskTiers.${result.tier}.label`)}
            </span>
          </div>

          {/* Cited rationale — the auditor-grade signature */}
          <ul className="relative mt-4 space-y-2">
            {cites.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-px shrink-0 rounded bg-brand-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-brand-400 ring-1 ring-brand-500/20">
                  {r.citation}
                </span>
                <span className="line-clamp-2 text-xs leading-relaxed text-ink-2">
                  {renderRationale(r, t)}
                </span>
              </li>
            ))}
          </ul>

          {/* Obligations meter */}
          <div className="relative mt-4 border-t border-line pt-3">
            <div className="flex items-center justify-between text-[11px]">
              <span className="uppercase tracking-[0.14em] text-ink-3">
                {t("landingDemo.obligations")}
              </span>
              <span className="font-semibold text-ink nums">
                {result.obligations.length}
              </span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/10">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
                style={{ width: "45%" }}
              />
            </div>
          </div>
        </div>
      </TiltCard>
    </>
  );
}

/** A crisp, in-browser product mockup — stays in sync with the real design. */
function ProductShowcase() {
  const { t } = useI18n();
  const rows: {
    name: string;
    tier: "high" | "limited" | "minimal";
    ownerKey: "peopleOps" | "support" | "supplyChain";
    pct: number;
  }[] = [
    { name: "TalentRank — CV screening", tier: "high", ownerKey: "peopleOps", pct: 45 },
    { name: "HelpDesk Copilot", tier: "limited", ownerKey: "support", pct: 75 },
    {
      name: "ForecastIQ — demand planning",
      tier: "minimal",
      ownerKey: "supplyChain",
      pct: 100,
    },
  ];
  const stats: [string, string][] = [
    [t("home.showcase.stats.systems"), "3"],
    [t("home.showcase.stats.compliance"), "73%"],
    [t("home.showcase.stats.nearest"), "2026-08"],
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-raised)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-line bg-paper-2 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-ink/10" />
        <span className="h-3 w-3 rounded-full bg-ink/10" />
        <span className="h-3 w-3 rounded-full bg-ink/10" />
        <div className="ms-3 hidden flex-1 rounded-md border border-line bg-ink/[0.04] px-3 py-1 text-xs text-ink-3 sm:block">
          {t("home.showcase.url")}
        </div>
      </div>
      {/* App body */}
      <div className="p-5 sm:p-7">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-lg font-semibold tracking-tight text-ink">
              {t("home.showcase.registryTitle")}
            </div>
            <div className="text-xs text-ink-3">{t("home.showcase.registrySub")}</div>
          </div>
          <div className="rounded-lg border border-brand-500 bg-brand-600 px-3 py-1.5 text-xs font-semibold text-on-accent">
            + {t("home.showcase.classify")}
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {stats.map(([l, v]) => (
            <div key={l} className="rounded-xl border border-line bg-ink/[0.03] p-3">
              <div className="text-[10px] uppercase tracking-[0.1em] text-ink-3">{l}</div>
              <div className="mt-0.5 text-lg font-semibold text-ink">{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-line">
          <table className="w-full text-start text-xs sm:text-sm">
            <thead className="border-b border-line bg-ink/[0.03] text-[10px] uppercase tracking-[0.1em] text-ink-3">
              <tr>
                <th className="px-4 py-2.5 text-start font-medium">
                  {t("home.showcase.table.system")}
                </th>
                <th className="px-4 py-2.5 text-start font-medium">
                  {t("home.showcase.table.risk")}
                </th>
                <th className="hidden px-4 py-2.5 text-start font-medium sm:table-cell">
                  {t("home.showcase.table.owner")}
                </th>
                <th className="px-4 py-2.5 text-start font-medium">
                  {t("home.showcase.table.compliance")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.name}>
                  <td className="px-4 py-2.5 font-medium text-ink-2">{r.name}</td>
                  <td className="px-4 py-2.5">
                    <RiskBadge tier={r.tier} size="sm" />
                  </td>
                  <td className="hidden px-4 py-2.5 text-ink-3 sm:table-cell">
                    {t(`home.showcase.owners.${r.ownerKey}`)}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-ink/10">
                        <div
                          className={`h-full rounded-full ${
                            r.pct === 100
                              ? "bg-ok-500"
                              : r.pct >= 50
                                ? "bg-brand-500"
                                : "bg-warn-500"
                          }`}
                          style={{ width: `${r.pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-medium text-ink-3 tabular-nums">
                        {r.pct}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ComparisonTable() {
  const { t } = useI18n();
  const rows: { key: string; cells: (boolean | string)[] }[] = [
    { key: "cited", cells: [true, true, false] },
    { key: "continuous", cells: [true, false, false] },
    { key: "drafted", cells: [true, false, false] },
    { key: "registry", cells: [true, false, t("home.comparison.values.manual")] },
    {
      key: "cost",
      cells: [
        t("home.comparison.values.conformaCost"),
        t("home.comparison.values.lawFirmCost"),
        t("home.comparison.values.spreadsheetCost"),
      ],
    },
  ];
  return (
    <div className="mt-12 overflow-x-auto scrollbar-thin rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
      <table className="w-full min-w-[36rem] text-start text-sm">
        <thead>
          <tr className="border-b border-line bg-ink/[0.03] text-ink-3">
            <th className="px-5 py-3.5 font-medium" />
            <th className="px-5 py-3.5 text-center font-semibold text-brand-400">
              {t("home.comparison.conforma")}
            </th>
            <th className="px-5 py-3.5 text-center font-medium">
              {t("home.comparison.lawFirm")}
            </th>
            <th className="px-5 py-3.5 text-center font-medium">
              {t("home.comparison.spreadsheet")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((row) => (
            <tr key={row.key}>
              <td className="px-5 py-3.5 font-medium text-ink-2">
                {t(`home.comparison.rows.${row.key}`)}
              </td>
              {row.cells.map((v, i) => (
                <Cell key={i} v={v} highlight={i === 0} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ v, highlight }: { v: boolean | string; highlight?: boolean }) {
  let content: React.ReactNode;
  if (v === true) content = <span className="text-ok-400">✓</span>;
  else if (v === false) content = <span className="text-ink-3">—</span>;
  else content = <span className="text-ink-2">{v}</span>;
  return (
    <td
      className={`px-5 py-3.5 text-center ${
        highlight ? "bg-brand-500/10 font-semibold" : ""
      }`}
    >
      {content}
    </td>
  );
}

/* Feature iconography — same 1.6-stroke, 24-grid hand-drawn idiom as the app
   sidebar, so the marketing surface and the product speak one visual language. */
const FEATURE_ICONS: Record<(typeof FEATURE_KEYS)[number], string> = {
  cited: "M12 3 4 6v5c0 4.6 3.1 7.4 8 9 4.9-1.6 8-4.4 8-9V6l-8-3z|M9 12l2 2 4-4",
  annexIII: "M4 5h6v6H4z|M14 5h6v6h-6z|M4 15h6v4H4z|M14 15h6v4h-6z",
  drafted:
    "M7 3h8l3 3v15H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z|M14 3v4h4|M9.5 15l.7-1.6.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7z",
  deadlines: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z|M12 7.5v5l3 1.8",
  roles:
    "M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19|M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7|M20 19v-1.5a3.5 3.5 0 0 0-2.6-3.4|M15 4.2a3.5 3.5 0 0 1 0 6.6",
  gpai:
    "M8 8h8v8H8z|M10.5 10.5h3v3h-3z|M10 3v2|M14 3v2|M10 19v2|M14 19v2|M3 10h2|M3 14h2|M19 10h2|M19 14h2",
};

/* Persona iconography — legal (balance scale), product (stacked layers),
   security (lock). Same idiom, so the "who it's for" list reads as one family. */
const PERSONA_ICONS: Record<(typeof PERSONA_KEYS)[number], string> = {
  legal:
    "M12 4v16|M8 20h8|M4 8h16|M12 4 4 8m8-4 8 4|M4 8l-1.9 4.6h3.8L4 8z|M20 8l-1.9 4.6h3.8L20 8z",
  product: "M12 3 3 7.5l9 4.5 9-4.5-9-4.5z|M3 12l9 4.5 9-4.5|M3 16.5 12 21l9-4.5",
  security:
    "M7 11V8a5 5 0 0 1 10 0v3|M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z|M12 14.5v2.5",
};

function FIcon({ d, className = "h-[18px] w-[18px]" }: { d: string; className?: string }) {
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

/** Depth-treated crimson icon plinth — matches the "how it works" step tiles. */
function IconTile({ k, big }: { k: (typeof FEATURE_KEYS)[number]; big?: boolean }) {
  return (
    <span
      className={`relative grid ${
        big ? "h-12 w-12" : "h-10 w-10"
      } place-items-center rounded-xl border border-line bg-surface text-brand-400 shadow-[var(--shadow-card)]`}
    >
      <FIcon d={FEATURE_ICONS[k]} className={big ? "h-6 w-6" : "h-[18px] w-[18px]"} />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent"
      />
    </span>
  );
}

/**
 * The capabilities section as a bento — a deliberately different rhythm from the
 * uniform card grids elsewhere. The signature promise ("Cited, not vibes") gets
 * a 2×2 hero tile that puts REAL Article citations on screen; the rest are
 * icon-led tiles. Every surface is token-driven, so it flips in light + RTL.
 */
function FeaturesBento() {
  const { t } = useI18n();
  // The product's ACTUAL output for a high-risk employment system: real Chapter
  // III obligations, each pinned to its Article. Localised via the same
  // domain.obligations keys the in-product checklist uses — i18n/RTL-safe.
  const citedRows = HERO_RESULT.obligations.slice(0, 4);

  const smallTile = (f: (typeof FEATURE_KEYS)[number]) => (
    <div
      key={f}
      className="lift sweep group relative overflow-hidden rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]"
    >
      <IconTile k={f} />
      <h3 className="mt-4 text-[1.02rem] font-semibold tracking-tight text-ink">
        {t(`home.features.items.${f}.title`)}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">
        {t(`home.features.items.${f}.desc`, { count: ANNEX_III_AREAS.length })}
      </p>
    </div>
  );

  return (
    <div className="grid gap-4 md:auto-rows-fr md:grid-cols-3">
      {/* Signature tile — the thesis of the whole product, shown not told. */}
      <div className="lift sweep group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-7 md:col-span-2 md:row-span-2">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-16 h-48 w-48 rounded-full bg-[rgba(var(--accent),0.10)] blur-3xl [inset-inline-end:-4rem]"
        />
        <IconTile k="cited" big />
        <h3 className="relative mt-5 text-2xl font-semibold tracking-tight text-ink sm:text-[1.7rem]">
          {t("home.features.items.cited.title")}
        </h3>
        <p className="relative mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink-2">
          {t("home.features.items.cited.desc")}
        </p>
        {/* The signature tile SHOWS the promise: real obligations, each pinned
            to its exact Article/Annex — the product's own localised output. */}
        <div className="relative mt-6 flex flex-1 flex-col rounded-xl border border-line bg-ink/[0.03] p-4 sm:p-5">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              {t("landingDemo.obligations")}
            </span>
            <span className="font-mono text-ink-2 nums">{HERO_RESULT.obligations.length}</span>
          </div>
          <ul className="mt-2 flex flex-1 flex-col justify-between divide-y divide-line">
            {citedRows.map((o) => (
              <li key={o.id} className="flex items-center gap-3 py-2.5">
                <span
                  dir="ltr"
                  className="shrink-0 whitespace-nowrap rounded bg-brand-500/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-brand-400 ring-1 ring-brand-500/20"
                >
                  {o.citation}
                </span>
                <span className="line-clamp-1 text-sm leading-relaxed text-ink-2">
                  {t(`domain.obligations.${o.id}.title`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {FEATURE_KEYS.filter((f) => f !== "cited").map(smallTile)}
    </div>
  );
}
