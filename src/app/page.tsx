"use client";

import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { PricingTable } from "@/components/PricingTable";
import { LandingDemo } from "@/components/LandingDemo";
import { ComplianceTimeline } from "@/components/ComplianceTimeline";
import { Reveal } from "@/components/Reveal";
import { RiskBadge } from "@/components/RiskBadge";
import { LogoMark } from "@/components/Logo";
import { Spotlight, TiltCard, Magnetic } from "@/components/Motion";
import {
  ANNEX_III_AREAS,
  PENALTIES,
  PRIMARY_DEADLINE,
  RISK_TIERS,
} from "@/lib/eu-ai-act";
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

/** Compact progress ring for the hero compliance card. */
function Ring({ pct }: { pct: number }) {
  const r = 17;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 44 44" className="h-11 w-11 -rotate-90" aria-hidden>
      <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3.5" />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke="var(--color-risk-minimal)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct / 100)}
      />
    </svg>
  );
}

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
              <h1 className="text-balance text-[2.75rem] font-semibold leading-[1.01] tracking-[-0.022em] sm:text-[3.5rem] lg:text-[4rem]">
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

            {/* Floating intelligence cluster (lg+) */}
            <div className="relative hidden h-[30rem] lg:block" aria-hidden>
              {/* platform light */}
              <div className="absolute bottom-10 left-1/2 h-24 w-[78%] -translate-x-1/2 rounded-[50%] bg-[rgba(var(--accent),0.28)] blur-3xl" />

              {/* central plinth */}
              <TiltCard
                className="absolute left-1/2 top-1/2 z-10 w-48 -translate-x-1/2 -translate-y-1/2"
                max={6}
              >
                <div className="glass sweep relative overflow-hidden rounded-2xl p-6 text-center">
                  <LogoMark className="mx-auto h-16 w-16 drop-shadow-[0_0_20px_rgba(225,29,42,0.6)]" />
                  <div className="mt-3 text-base font-semibold tracking-tight text-ink">
                    Conforma
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-ink-3">
                    EU AI ACT
                  </div>
                </div>
              </TiltCard>

              {/* compliance ring — top right */}
              <div
                className="animate-float absolute right-0 top-1 w-44"
                style={{ animationDelay: "0.4s" }}
              >
                <TiltCard max={12}>
                  <div className="glass rounded-2xl p-4">
                    <div className="text-xs text-ink-3">
                      {t("home.showcase.stats.compliance")}
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <Ring pct={94} />
                      <div>
                        <div className="text-xl font-semibold text-ink nums">94%</div>
                        <div className="text-[11px] font-medium text-risk-minimal">
                          ▲ +6
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>

              {/* risk — left */}
              <div
                className="animate-float absolute left-0 top-[30%] w-40"
                style={{ animationDelay: "1.6s" }}
              >
                <TiltCard max={12}>
                  <div className="glass rounded-2xl p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-ink-3">Risk</span>
                      <RiskBadge tier="high" size="sm" />
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-ink nums">23</div>
                    <svg viewBox="0 0 120 28" className="mt-1 h-7 w-full" preserveAspectRatio="none" aria-hidden>
                      <polyline
                        points="0,22 18,18 36,20 54,12 72,15 90,7 108,10 120,4"
                        fill="none"
                        stroke="var(--color-brand-500)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </TiltCard>
              </div>

              {/* systems monitored — bottom right */}
              <div
                className="animate-float absolute bottom-6 right-8 w-44"
                style={{ animationDelay: "1s" }}
              >
                <TiltCard max={12}>
                  <div className="glass rounded-2xl p-4">
                    <div className="text-xs text-ink-3">
                      {t("home.showcase.stats.systems")}
                    </div>
                    <div className="mt-1 text-2xl font-semibold text-ink nums">128</div>
                    <div className="mt-2 flex items-end gap-1">
                      {[0.4, 0.6, 0.45, 0.8, 0.55, 1, 0.7].map((h, i) => (
                        <span
                          key={i}
                          className="w-1.5 rounded-full bg-brand-500/70"
                          style={{ height: `${0.55 + h * 1.2}rem` }}
                        />
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </div>
            </div>
          </div>

          {/* Framework trust strip */}
          <div className="mt-20">
            <p className="text-center text-xs font-medium uppercase tracking-[0.13em] text-ink-3">
              {t("home.hero.trustEyebrow")}
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-ink-2">
              {FRAMEWORKS.map((f) => (
                <span key={f}>{f}</span>
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

      {/* ------------------------------------------------------------ Stat strip */}
      <section className="border-y border-line bg-paper-2">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-5 py-10 text-center sm:grid-cols-4">
          {STAT_KEYS.map((k) => (
            <div key={k} className="px-3">
              <div className="text-[2rem] font-semibold tracking-tight text-ink nums sm:text-[2.5rem]">
                {t(`home.stats.${k}.value`)}
              </div>
              <div className="mt-1 text-sm font-medium text-ink-2">
                {t(`home.stats.${k}.label`)}
              </div>
              <div className="text-xs text-ink-3">{t(`home.stats.${k}.sub`)}</div>
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
          <h2 className="mt-3 text-[1.75rem] font-semibold text-ink sm:text-[2rem]">
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
            <h2 className="mt-3 text-[1.75rem] font-semibold text-ink sm:text-[2rem]">
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

      {/* ------------------------------------------------------------- Personas */}
      <section className="border-y border-line bg-paper-2">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[1.75rem] font-semibold text-ink sm:text-[2rem]">
              {t("home.personas.title")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-2">
              {t("home.personas.subtitle")}
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PERSONA_KEYS.map((p) => (
              <div
                key={p}
                className="lift rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]"
              >
                <div className="text-base font-semibold text-ink">
                  {t(`home.personas.items.${p}.role`)}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">
                  {t(`home.personas.items.${p}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Risk tiers */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[1.75rem] font-semibold text-ink sm:text-[2rem]">
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
            <h2 className="text-[1.75rem] font-semibold text-ink sm:text-[2rem]">
              {t("home.how.title")}
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {STEP_KEYS.map((s, idx) => (
              <div key={s}>
                <div className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-sm font-semibold text-brand-400">
                  {idx + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">
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
          <h2 className="mt-3 text-[1.75rem] font-semibold text-ink sm:text-[2rem]">
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
          <h2 className="text-[1.75rem] font-semibold text-ink sm:text-[2rem]">
            {t("home.features.title")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">
            {t("home.features.subtitle")}
          </p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURE_KEYS.map((f) => (
            <div
              key={f}
              className="lift rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]"
            >
              <h3 className="text-base font-semibold text-ink">
                {t(`home.features.items.${f}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                {t(`home.features.items.${f}.desc`, { count: ANNEX_III_AREAS.length })}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------- Comparison */}
      <section className="border-y border-line bg-paper-2">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[1.75rem] font-semibold text-ink sm:text-[2rem]">
              {t("home.comparison.title")}
            </h2>
          </div>
          <ComparisonTable />
        </div>
      </section>

      {/* ---------------------------------------------------------- Testimonials */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[1.75rem] font-semibold text-ink sm:text-[2rem]">
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
            <h2 className="text-[1.75rem] font-semibold text-ink sm:text-[2rem]">
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
                  className="rounded-xl border border-line bg-paper-2 p-6"
                >
                  <div className="text-3xl font-semibold text-ink nums">
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
            <h2 className="mt-3 text-[1.75rem] font-semibold text-ink sm:text-[2rem]">
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
            <h2 className="text-[1.75rem] font-semibold text-ink sm:text-[2rem]">
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
        <h2 className="text-center text-[1.75rem] font-semibold text-ink sm:text-[2rem]">
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
          <h2 className="text-[1.75rem] font-semibold text-ink sm:text-[2rem]">
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
