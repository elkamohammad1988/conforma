"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RiskBadge } from "@/components/RiskBadge";
import { Countdown } from "@/components/Countdown";
import { ArrowForward } from "@/components/Arrow";
import { classify, EMPTY_ANSWERS, type ClassificationAnswers } from "@/lib/classifier";
import { useI18n } from "@/i18n/I18nProvider";
import { renderRationale } from "@/i18n/rationale";

/** Preset scenarios that exercise each branch of the real decision tree. */
const SCENARIOS: { id: string; patch: Partial<ClassificationAnswers> }[] = [
  { id: "employment", patch: { annexIII: ["employment"] } },
  { id: "credit", patch: { annexIII: ["essential-services"] } },
  { id: "chatbot", patch: { transparency: ["interacts"] } },
  { id: "deepfake", patch: { transparency: ["synthetic", "deepfake"] } },
  { id: "social", patch: { prohibited: ["social-scoring"] } },
  { id: "forecast", patch: {} },
];

export function LandingDemo() {
  const { t, formatDate } = useI18n();
  const [active, setActive] = useState("employment");
  const [gpai, setGpai] = useState(false);

  const result = useMemo(() => {
    const scenario = SCENARIOS.find((s) => s.id === active) ?? SCENARIOS[0];
    const answers: ClassificationAnswers = {
      ...EMPTY_ANSWERS,
      ...scenario.patch,
      isAISystem: true,
      isGPAI: gpai,
    };
    return classify(answers);
  }, [active, gpai]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-stretch">
      {/* Controls */}
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
        <div className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-3">
          {t("landingDemo.pickSystem")}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {SCENARIOS.map((s) => {
            const selected = s.id === active;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                aria-pressed={selected}
                className={`rounded-xl border px-3.5 py-3 text-start transition ${
                  selected
                    ? "border-brand-500/40 bg-brand-500/10 ring-1 ring-brand-500/30"
                    : "border-line bg-surface hover:border-line-2"
                }`}
              >
                <div className="text-sm font-semibold text-ink">
                  {t(`landingDemo.scenarios.${s.id}.label`)}
                </div>
                <div className="mt-0.5 text-xs text-ink-3">
                  {t(`landingDemo.scenarios.${s.id}.hint`)}
                </div>
              </button>
            );
          })}
        </div>

        <label className="mt-4 flex cursor-pointer items-center justify-between rounded-xl border border-line px-3.5 py-3">
          <span>
            <span className="text-sm font-medium text-ink">
              {t("landingDemo.builtOnGpai")}
            </span>
            <span className="mt-0.5 block text-xs text-ink-3">
              {t("landingDemo.builtOnGpaiHint")}
            </span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={gpai}
            aria-label={t("landingDemo.builtOnGpai")}
            onClick={() => setGpai((g) => !g)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              gpai ? "bg-brand-600" : "bg-ink/10"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-on-accent shadow transition-all ${
                gpai ? "start-[1.375rem]" : "start-0.5"
              }`}
            />
          </button>
        </label>
      </div>

      {/* Live result */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
        <div className="border-b border-line bg-ink/[0.03] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-ink-3">
          {t("landingDemo.liveClassification")}
        </div>
        <div key={`${active}-${gpai}`} className="animate-in flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center gap-3">
            <RiskBadge tier={result.tier} />
            <span className="text-lg font-semibold text-ink">
              {t(`domain.riskTiers.${result.tier}.label`)}
            </span>
            {result.isGPAI && (
              <span className="rounded-full bg-brand-500/10 px-2 py-0.5 text-[11px] font-semibold text-brand-400 ring-1 ring-brand-500/30">
                {t("landingDemo.plusGpai")}
              </span>
            )}
          </div>

          <ul className="mt-4 space-y-2">
            {result.rationale.slice(0, 3).map((r, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <span className="mt-0.5 shrink-0 rounded bg-brand-500/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-brand-400">
                  {r.citation}
                </span>
                <span className="text-ink-2">{renderRationale(r, t)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
            <div className="rounded-xl bg-ink/[0.03] p-3 ring-1 ring-ink/10">
              <div className="text-xs uppercase tracking-[0.1em] text-ink-3">
                {t("landingDemo.obligations")}
              </div>
              <div className="mt-0.5 text-xl font-semibold text-ink tabular-nums">
                {result.obligations.length}
              </div>
            </div>
            <div className="rounded-xl bg-ink/[0.03] p-3 ring-1 ring-ink/10">
              <div className="text-xs uppercase tracking-[0.1em] text-ink-3">
                {t("landingDemo.deadline")}
              </div>
              <div className="mt-0.5 text-sm font-semibold text-ink">
                {formatDate(result.deadline.date, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <Countdown
                deadline={result.deadline.date}
                className="text-xs font-medium text-brass-700"
              />
            </div>
          </div>

          <Link href="/classify" className="btn btn-primary mt-4 w-full">
            {t("landingDemo.runFull")} <ArrowForward />
          </Link>
        </div>
      </div>
    </div>
  );
}
