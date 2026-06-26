"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  EMPTY_ANSWERS,
  classify,
  type ClassificationAnswers,
  type ProviderRole,
} from "@/lib/classifier";
import {
  ANNEX_III_AREAS,
  PROHIBITED_PRACTICES,
  RISK_TIERS,
} from "@/lib/eu-ai-act";
import { RiskBadge } from "@/components/RiskBadge";
import { Countdown } from "@/components/Countdown";
import { saveSystem, newId, type RegisteredSystem } from "@/lib/store";

const STEPS = ["Basics", "Definition", "Prohibited", "High-risk", "Transparency"];

export default function ClassifyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ClassificationAnswers>({
    ...EMPTY_ANSWERS,
  });
  const [showResult, setShowResult] = useState(false);

  const set = <K extends keyof ClassificationAnswers>(
    key: K,
    value: ClassificationAnswers[K],
  ) => setAnswers((a) => ({ ...a, [key]: value }));

  const toggleIn = (key: "prohibited" | "annexIII" | "transparency", id: string) =>
    setAnswers((a) => {
      const arr = a[key];
      return {
        ...a,
        [key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id],
      };
    });

  const result = useMemo(() => classify(answers), [answers]);
  const canContinue = step !== 0 || answers.name.trim().length > 0;

  if (showResult) {
    return (
      <ResultView
        answers={answers}
        onBack={() => setShowResult(false)}
        onSave={() => {
          const now = new Date().toISOString();
          const record: RegisteredSystem = {
            id: newId(),
            name: answers.name.trim(),
            description: answers.description.trim(),
            owner: answers.owner ?? "",
            answers,
            result,
            obligationStatus: {},
            createdAt: now,
            updatedAt: now,
          };
          saveSystem(record);
          router.push(`/systems/${record.id}`);
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-medium">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`flex items-center gap-2 ${
                i <= step ? "text-brand-700" : "text-slate-400"
              }`}
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold ${
                  i < step
                    ? "bg-brand-600 text-white"
                    : i === step
                      ? "bg-brand-100 text-brand-700 ring-2 ring-brand-600"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand-600 transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        {step === 0 && (
          <Section
            title="Tell us about the system"
            sub="The basics. You can register systems you build (provider) or systems you use (deployer)."
          >
            <Field label="System name">
              <input
                autoFocus
                value={answers.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. CV screening model"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </Field>
            <Field label="What does it do?" optional>
              <textarea
                value={answers.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                placeholder="Short description of its intended purpose."
                className="w-full resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Your role">
                <select
                  value={answers.role}
                  onChange={(e) => set("role", e.target.value as ProviderRole)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                >
                  <option value="provider">Provider (we build it)</option>
                  <option value="deployer">Deployer (we use it)</option>
                  <option value="both">Both</option>
                </select>
              </Field>
              <Field label="Owner / team" optional>
                <input
                  value={answers.owner ?? ""}
                  onChange={(e) => set("owner", e.target.value)}
                  placeholder="e.g. People Ops"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </Field>
            </div>
          </Section>
        )}

        {step === 1 && (
          <Section
            title="Is it an AI system?"
            sub="The Act applies to systems that infer outputs from inputs with some autonomy (Art. 3(1))."
          >
            <YesNo
              label="This meets the definition of an AI system"
              value={answers.isAISystem}
              onChange={(v) => set("isAISystem", v)}
            />
            <YesNo
              label="It is built on a general-purpose AI model (e.g. an LLM)"
              hint="Triggers extra GPAI provider obligations (Art. 53+)."
              value={answers.isGPAI}
              onChange={(v) => set("isGPAI", v)}
            />
          </Section>
        )}

        {step === 2 && (
          <Section
            title="Does it do any of these?"
            sub="These practices are prohibited outright under Art. 5. Select all that apply — or none."
          >
            <div className="space-y-2.5">
              {PROHIBITED_PRACTICES.map((p) => (
                <CheckCard
                  key={p.id}
                  checked={answers.prohibited.includes(p.id)}
                  onToggle={() => toggleIn("prohibited", p.id)}
                  title={p.title}
                  desc={p.description}
                  cite={p.citation}
                  danger
                />
              ))}
            </div>
          </Section>
        )}

        {step === 3 && (
          <Section
            title="High-risk use cases"
            sub="High-risk systems carry the full weight of the Act. Select any that match the system's intended purpose."
          >
            <YesNo
              label="It is a safety component of a product covered by EU harmonised law (Annex I)"
              hint="e.g. machinery, medical devices, vehicles."
              value={answers.annexI}
              onChange={(v) => set("annexI", v)}
            />
            <p className="pt-2 text-sm font-medium text-slate-700">
              Annex III areas
            </p>
            <div className="space-y-2.5">
              {ANNEX_III_AREAS.map((a) => (
                <CheckCard
                  key={a.id}
                  checked={answers.annexIII.includes(a.id)}
                  onToggle={() => toggleIn("annexIII", a.id)}
                  title={a.title}
                  desc={a.examples}
                  cite={a.citation}
                />
              ))}
            </div>
            {answers.annexIII.length > 0 && (
              <div className="mt-2 rounded-lg bg-amber-50 p-4 ring-1 ring-amber-200">
                <YesNo
                  label="It performs only a narrow procedural task and does not materially influence decisions"
                  hint="The Art. 6(3) derogation — may take it out of high-risk, but you must document the assessment."
                  value={answers.annexIIIDerogation}
                  onChange={(v) => set("annexIIIDerogation", v)}
                />
              </div>
            )}
          </Section>
        )}

        {step === 4 && (
          <Section
            title="Transparency triggers"
            sub="Even outside high-risk, some uses carry disclosure duties under Art. 50."
          >
            {[
              ["interacts", "Interacts directly with people (e.g. a chatbot)"],
              ["synthetic", "Generates synthetic audio, image, video or text"],
              ["deepfake", "Produces deepfakes"],
              ["emotion", "Emotion recognition or biometric categorisation"],
            ].map(([id, label]) => (
              <CheckCard
                key={id}
                checked={answers.transparency.includes(id)}
                onToggle={() => toggleIn("transparency", id)}
                title={label}
                cite="Art. 50"
              />
            ))}
          </Section>
        )}

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 enabled:hover:bg-slate-100 disabled:opacity-40"
          >
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canContinue}
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-40"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={() => setShowResult(true)}
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              See classification →
            </button>
          )}
        </div>
      </div>

      {/* Live preview */}
      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
        Provisional tier:
        <RiskBadge tier={result.tier} size="sm" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Result view */

function ResultView({
  answers,
  onBack,
  onSave,
}: {
  answers: ClassificationAnswers;
  onBack: () => void;
  onSave: () => void;
}) {
  const result = useMemo(() => classify(answers), [answers]);
  const meta = RISK_TIERS[result.tier];
  const [narrative, setNarrative] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiSource, setAiSource] = useState<string | null>(null);

  const explain = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          systemName: answers.name,
          description: answers.description,
          result,
        }),
      });
      const data = await res.json();
      setNarrative(data.narrative);
      setAiSource(data.source);
    } catch {
      setNarrative("Could not reach the explanation service.");
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <div className="animate-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-ink px-7 py-8 text-white">
          <div className="text-sm text-slate-400">
            {answers.name || "Untitled system"}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <RiskBadge tier={result.tier} />
            <h1 className="text-2xl font-bold">{meta.label}</h1>
            {result.isGPAI && (
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-brand-200">
                + GPAI obligations
              </span>
            )}
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
            {meta.summary}
          </p>
        </div>

        <div className="p-7">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Why this tier
          </h2>
          <ul className="mt-3 space-y-2.5">
            {result.rationale.map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 rounded bg-brand-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-brand-700">
                  {r.citation}
                </span>
                <span className="text-slate-700">{r.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl bg-slate-50 p-4 text-sm ring-1 ring-slate-200">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400">
                Applicable deadline
              </div>
              <div className="font-semibold text-slate-800">
                {result.deadline.label}
              </div>
            </div>
            <div className="ml-auto text-right">
              <div className="font-mono text-sm text-slate-500">
                {result.deadline.date}
              </div>
              <Countdown
                deadline={result.deadline.date}
                className="text-sm font-semibold text-amber-600"
              />
            </div>
          </div>

          {result.obligations.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {result.obligations.length} obligations to satisfy
              </h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {result.obligations.slice(0, 6).map((o) => (
                  <div
                    key={o.id}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-slate-800">{o.title}</span>
                    <span className="ml-1.5 font-mono text-[11px] text-slate-400">
                      {o.citation}
                    </span>
                  </div>
                ))}
              </div>
              {result.obligations.length > 6 && (
                <p className="mt-2 text-xs text-slate-400">
                  + {result.obligations.length - 6} more — full checklist after you
                  save.
                </p>
              )}
            </div>
          )}

          {/* AI explanation */}
          <div className="mt-6">
            {!narrative && (
              <button
                onClick={explain}
                disabled={loadingAI}
                className="inline-flex items-center gap-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-100 disabled:opacity-60"
              >
                {loadingAI ? "Thinking…" : "✨ Explain in plain English"}
              </button>
            )}
            {narrative && (
              <div className="rounded-xl border border-brand-100 bg-brand-50/50 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-brand-700">
                  ✨ AI explanation
                  {aiSource === "template" && (
                    <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                      offline template — add ANTHROPIC_API_KEY for live drafting
                    </span>
                  )}
                </div>
                <p className="prose-doc text-sm text-slate-700">{narrative}</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <button
              onClick={onBack}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
            >
              ← Edit answers
            </button>
            <button
              onClick={onSave}
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Save to registry →
            </button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Decision-support only — not legal advice. Confirm with qualified counsel.{" "}
        <Link href="/dashboard" className="underline hover:text-slate-600">
          View dashboard
        </Link>
      </p>
    </div>
  );
}

/* --------------------------------------------------------------- Primitives */

function Section({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-in">
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{sub}</p>
      <div className="mt-6 space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {optional && <span className="ml-1 text-slate-400">(optional)</span>}
      </span>
      {children}
    </label>
  );
}

function YesNo({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 px-4 py-3">
      <div>
        <div className="text-sm font-medium text-slate-800">{label}</div>
        {hint && <div className="mt-0.5 text-xs text-slate-500">{hint}</div>}
      </div>
      <div className="flex shrink-0 overflow-hidden rounded-lg border border-slate-200">
        {[
          ["No", false],
          ["Yes", true],
        ].map(([txt, val]) => (
          <button
            key={txt as string}
            onClick={() => onChange(val as boolean)}
            className={`px-4 py-1.5 text-sm font-medium transition ${
              value === val
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-500 hover:bg-slate-50"
            }`}
          >
            {txt}
          </button>
        ))}
      </div>
    </div>
  );
}

function CheckCard({
  checked,
  onToggle,
  title,
  desc,
  cite,
  danger,
}: {
  checked: boolean;
  onToggle: () => void;
  title: string;
  desc?: string;
  cite: string;
  danger?: boolean;
}) {
  const activeRing = danger
    ? "border-red-400 bg-red-50 ring-1 ring-red-300"
    : "border-brand-400 bg-brand-50 ring-1 ring-brand-300";
  return (
    <button
      onClick={onToggle}
      className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition ${
        checked ? activeRing : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <span
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border text-xs text-white ${
          checked
            ? danger
              ? "border-red-500 bg-red-500"
              : "border-brand-600 bg-brand-600"
            : "border-slate-300 bg-white"
        }`}
      >
        {checked && "✓"}
      </span>
      <span className="flex-1">
        <span className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-800">{title}</span>
          <span className="font-mono text-[11px] text-slate-400">{cite}</span>
        </span>
        {desc && <span className="mt-0.5 block text-xs text-slate-500">{desc}</span>}
      </span>
    </button>
  );
}
