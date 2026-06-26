"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RiskBadge } from "@/components/RiskBadge";
import { Countdown } from "@/components/Countdown";
import { classify, EMPTY_ANSWERS, type ClassificationAnswers } from "@/lib/classifier";
import { RISK_TIERS } from "@/lib/eu-ai-act";

/** Preset scenarios that exercise each branch of the real decision tree. */
const SCENARIOS: { id: string; label: string; hint: string; patch: Partial<ClassificationAnswers> }[] = [
  {
    id: "employment",
    label: "CV screening",
    hint: "Ranks job applicants",
    patch: { annexIII: ["employment"] },
  },
  {
    id: "credit",
    label: "Credit scoring",
    hint: "Assesses creditworthiness",
    patch: { annexIII: ["essential-services"] },
  },
  {
    id: "chatbot",
    label: "Support chatbot",
    hint: "Talks to customers",
    patch: { transparency: ["interacts"] },
  },
  {
    id: "deepfake",
    label: "Deepfake studio",
    hint: "Generates synthetic media",
    patch: { transparency: ["synthetic", "deepfake"] },
  },
  {
    id: "social",
    label: "Social scoring",
    hint: "Ranks citizens by behaviour",
    patch: { prohibited: ["social-scoring"] },
  },
  {
    id: "forecast",
    label: "Demand forecasting",
    hint: "Predicts inventory needs",
    patch: {},
  },
];

export function LandingDemo() {
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

  const meta = RISK_TIERS[result.tier];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-stretch">
      {/* Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Pick a system
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {SCENARIOS.map((s) => {
            const selected = s.id === active;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                aria-pressed={selected}
                className={`rounded-xl border px-3.5 py-3 text-left transition ${
                  selected
                    ? "border-brand-400 bg-brand-50 ring-1 ring-brand-300"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="text-sm font-semibold text-slate-800">{s.label}</div>
                <div className="mt-0.5 text-xs text-slate-500">{s.hint}</div>
              </button>
            );
          })}
        </div>

        <label className="mt-4 flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-3.5 py-3">
          <span>
            <span className="text-sm font-medium text-slate-800">
              Built on a general-purpose model
            </span>
            <span className="mt-0.5 block text-xs text-slate-500">
              Adds GPAI provider duties (Art. 53+)
            </span>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={gpai}
            aria-label="Built on a general-purpose model"
            onClick={() => setGpai((g) => !g)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition ${
              gpai ? "bg-brand-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                gpai ? "left-[1.375rem]" : "left-0.5"
              }`}
            />
          </button>
        </label>
      </div>

      {/* Live result */}
      <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Live classification
        </div>
        <div key={`${active}-${gpai}`} className="animate-in flex flex-1 flex-col p-6">
          <div className="flex flex-wrap items-center gap-3">
            <RiskBadge tier={result.tier} />
            <span className="text-lg font-bold text-slate-900">{meta.label}</span>
            {result.isGPAI && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 ring-1 ring-brand-200">
                + GPAI
              </span>
            )}
          </div>

          <ul className="mt-4 space-y-2">
            {result.rationale.slice(0, 3).map((r, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <span className="mt-0.5 shrink-0 rounded bg-brand-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-brand-700">
                  {r.citation}
                </span>
                <span className="text-slate-600">{r.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
            <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Obligations
              </div>
              <div className="mt-0.5 text-xl font-bold text-slate-900 tabular-nums">
                {result.obligations.length}
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-100">
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Deadline
              </div>
              <div className="mt-0.5 text-sm font-semibold text-slate-900">
                {result.deadline.date}
              </div>
              <Countdown
                deadline={result.deadline.date}
                className="text-xs font-medium text-amber-600"
              />
            </div>
          </div>

          <Link
            href="/classify"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Run the full 5-step classifier →
          </Link>
        </div>
      </div>
    </div>
  );
}
