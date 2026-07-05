"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  EMPTY_ANSWERS,
  classify,
  type ClassificationAnswers,
  type ClassificationResult,
  type ProviderRole,
} from "@/lib/classifier";
import { ANNEX_III_AREAS, PROHIBITED_PRACTICES } from "@/lib/eu-ai-act";
import { RiskBadge } from "@/components/RiskBadge";
import { Countdown } from "@/components/Countdown";
import { ArrowForward, ArrowBackward } from "@/components/Arrow";
import { DemoModeBadge } from "@/components/DemoModeBadge";
import { Spinner } from "@/components/ui/Spinner";
import { saveSystem, makeSystem } from "@/lib/store";
import { INPUT_LIMITS } from "@/lib/input-limits";
import { useToast } from "@/components/ui/Toast";
import { useI18n } from "@/i18n/I18nProvider";
import { renderRationale } from "@/i18n/rationale";

const STEP_KEYS = ["basics", "definition", "prohibited", "highRisk", "transparency"] as const;
const TRANSPARENCY_KEYS = ["interacts", "synthetic", "deepfake", "emotion"] as const;

export default function ClassifyPage() {
  const { t } = useI18n();
  const { toast } = useToast();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<ClassificationAnswers>({ ...EMPTY_ANSWERS });
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
        result={result}
        onBack={() => setShowResult(false)}
        onSave={() => {
          // Single constructor — same shape the store uses everywhere else.
          const record = makeSystem(
            answers.name.trim(),
            answers.description.trim(),
            answers.owner ?? "",
            answers,
          );
          saveSystem(record);
          toast(t("toast.saved"));
          router.push(`/systems/${record.id}`);
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      {/* Page heading — visually the stepper carries the hierarchy, but the
          document still needs a single h1 for assistive tech. */}
      <h1 className="sr-only">{t("app.breadcrumb.classifyTitle")}</h1>
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-medium">
          {STEP_KEYS.map((key, i) => (
            <div
              key={key}
              className={`flex items-center gap-2 transition-colors ${i <= step ? "text-ink" : "text-ink-3"}`}
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-full border text-[11px] font-semibold transition-all duration-300 ${
                  i < step
                    ? "border-transparent text-on-accent [background:linear-gradient(180deg,var(--color-brand-500),var(--color-brand-600))]"
                    : i === step
                      ? "scale-110 border-brand-500 bg-brand-500/15 text-brand-300 shadow-[0_0_0_4px_rgba(var(--accent),0.12)]"
                      : "border-line bg-surface-2 text-ink-3"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <span className="hidden sm:inline">{t(`classify.steps.${key}`)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-[var(--ease-out-quint)]"
            style={{
              width: `${((step + 1) / STEP_KEYS.length) * 100}%`,
              background:
                "linear-gradient(90deg, var(--color-brand-600), var(--color-brand-400))",
              boxShadow: "0 0 10px rgba(var(--accent),0.5)",
            }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
        {step === 0 && (
          <Section title={t("classify.step0.title")} sub={t("classify.step0.sub")}>
            <Field label={t("classify.step0.nameLabel")}>
              <input
                autoFocus
                value={answers.name}
                onChange={(e) => set("name", e.target.value)}
                maxLength={INPUT_LIMITS.systemName}
                placeholder={t("classify.step0.namePlaceholder")}
                className={INPUT}
              />
            </Field>
            <Field label={t("classify.step0.descLabel")} optional>
              <textarea
                value={answers.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                maxLength={INPUT_LIMITS.description}
                placeholder={t("classify.step0.descPlaceholder")}
                className={`${INPUT} resize-none`}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t("classify.step0.roleLabel")}>
                <select
                  value={answers.role}
                  onChange={(e) => set("role", e.target.value as ProviderRole)}
                  className={INPUT}
                >
                  <option value="provider">{t("classify.step0.roleProvider")}</option>
                  <option value="deployer">{t("classify.step0.roleDeployer")}</option>
                  <option value="both">{t("classify.step0.roleBoth")}</option>
                </select>
              </Field>
              <Field label={t("classify.step0.ownerLabel")} optional>
                <input
                  value={answers.owner ?? ""}
                  onChange={(e) => set("owner", e.target.value)}
                  placeholder={t("classify.step0.ownerPlaceholder")}
                  className={INPUT}
                />
              </Field>
            </div>
          </Section>
        )}

        {step === 1 && (
          <Section title={t("classify.step1.title")} sub={t("classify.step1.sub")}>
            <YesNo
              label={t("classify.step1.isAi")}
              value={answers.isAISystem}
              onChange={(v) => set("isAISystem", v)}
            />
            <YesNo
              label={t("classify.step1.isGpai")}
              hint={t("classify.step1.isGpaiHint")}
              value={answers.isGPAI}
              onChange={(v) => set("isGPAI", v)}
            />
          </Section>
        )}

        {step === 2 && (
          <Section title={t("classify.step2.title")} sub={t("classify.step2.sub")}>
            <div className="space-y-2.5">
              {PROHIBITED_PRACTICES.map((p) => (
                <CheckCard
                  key={p.id}
                  checked={answers.prohibited.includes(p.id)}
                  onToggle={() => toggleIn("prohibited", p.id)}
                  title={t(`domain.prohibited.${p.id}.title`)}
                  desc={t(`domain.prohibited.${p.id}.description`)}
                  cite={p.citation}
                  danger
                />
              ))}
            </div>
          </Section>
        )}

        {step === 3 && (
          <Section title={t("classify.step3.title")} sub={t("classify.step3.sub")}>
            <YesNo
              label={t("classify.step3.annexI")}
              hint={t("classify.step3.annexIHint")}
              value={answers.annexI}
              onChange={(v) => set("annexI", v)}
            />
            <p className="pt-2 text-sm font-medium text-ink-2">
              {t("classify.step3.annexIIIHeading")}
            </p>
            <div className="space-y-2.5">
              {ANNEX_III_AREAS.map((a) => (
                <CheckCard
                  key={a.id}
                  checked={answers.annexIII.includes(a.id)}
                  onToggle={() => toggleIn("annexIII", a.id)}
                  title={t(`domain.annexIII.${a.id}.title`)}
                  desc={t(`domain.annexIII.${a.id}.examples`)}
                  cite={a.citation}
                />
              ))}
            </div>
            {answers.annexIII.length > 0 && (
              <div className="mt-2 rounded-lg bg-warn-500/10 p-4 ring-1 ring-warn-500/30">
                <YesNo
                  label={t("classify.step3.derogation")}
                  hint={t("classify.step3.derogationHint")}
                  value={answers.annexIIIDerogation}
                  onChange={(v) => set("annexIIIDerogation", v)}
                />
              </div>
            )}
          </Section>
        )}

        {step === 4 && (
          <Section title={t("classify.step4.title")} sub={t("classify.step4.sub")}>
            {TRANSPARENCY_KEYS.map((id) => (
              <CheckCard
                key={id}
                checked={answers.transparency.includes(id)}
                onToggle={() => toggleIn("transparency", id)}
                title={t(`classify.step4.${id}`)}
                cite="Art. 50"
              />
            ))}
          </Section>
        )}

        {/* Nav buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn btn-ghost disabled:opacity-40"
          >
            <ArrowBackward /> {t("classify.nav.back")}
          </button>
          {step < STEP_KEYS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canContinue}
              className="btn btn-primary disabled:opacity-40"
            >
              {t("classify.nav.continue")} <ArrowForward />
            </button>
          ) : (
            <button onClick={() => setShowResult(true)} className="btn btn-primary">
              {t("classify.nav.seeClassification")} <ArrowForward />
            </button>
          )}
        </div>
      </div>

      {/* Live preview */}
      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-ink-3">
        {t("classify.provisional")}
        <RiskBadge tier={result.tier} size="sm" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Result view */

function ResultView({
  answers,
  result,
  onBack,
  onSave,
}: {
  answers: ClassificationAnswers;
  result: ClassificationResult;
  onBack: () => void;
  onSave: () => void;
}) {
  const { t, formatDate, locale } = useI18n();
  const [narrative, setNarrative] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiSource, setAiSource] = useState<string | null>(null);
  const [aiError, setAiError] = useState(false);

  const explain = async () => {
    setLoadingAI(true);
    setAiError(false);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          systemName: answers.name,
          description: answers.description,
          result,
          locale,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setNarrative(data.narrative);
      setAiSource(data.source);
    } catch {
      setNarrative(t("classify.result.couldNotReach"));
      setAiError(true);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <div className="animate-in relative overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
        <div className="relative border-b border-line bg-paper-2 px-7 py-9 sm:px-8 sm:py-11">
          {/* verdict is lit by its own risk-tier colour */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 h-56 w-56 rounded-full"
            style={{
              insetInlineEnd: "-2.5rem",
              background: `radial-gradient(closest-side, color-mix(in srgb, var(--color-risk-${result.tier}) 24%, transparent), transparent 70%)`,
            }}
          />
          <div className="relative">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-3">
              {answers.name || t("classify.result.untitled")}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2.5">
              <RiskBadge tier={result.tier} />
              {result.isGPAI && (
                <span className="rounded-full border border-line bg-ink/[0.04] px-2.5 py-1 text-xs font-medium text-ink-2">
                  {t("classify.result.plusGpai")}
                </span>
              )}
            </div>
            <h1 className="mt-4 text-[2rem] font-semibold leading-[1.04] tracking-tight text-ink sm:text-[2.4rem]">
              {t(`domain.riskTiers.${result.tier}.label`)}
            </h1>
            <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-ink-2">
              {t(`domain.riskTiers.${result.tier}.summary`)}
            </p>
          </div>
        </div>

        <div className="p-7">
          <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-ink-3">
            {t("classify.result.whyTier")}
          </h2>
          <ul className="mt-3 space-y-2.5">
            {result.rationale.map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span dir="ltr" className="mt-0.5 rounded bg-brand-500/15 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-brand-300 ring-1 ring-brand-500/25">
                  {r.citation}
                </span>
                <span className="text-ink-2">{renderRationale(r, t)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl bg-ink/[0.03] p-4 text-sm ring-1 ring-ink/10">
            <div>
              <div className="text-xs uppercase tracking-[0.1em] text-ink-3">
                {t("classify.result.applicableDeadline")}
              </div>
              <div className="font-semibold text-ink">
                {t(`domain.deadlines.${result.deadline.id}.label`)}
              </div>
            </div>
            <div className="ms-auto text-end">
              <div className="font-mono text-sm text-ink-3">
                {formatDate(result.deadline.date, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <Countdown
                deadline={result.deadline.date}
                className="text-sm font-semibold text-warn-400"
              />
            </div>
          </div>

          {result.obligations.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-ink-3">
                {t("classify.result.obligationsToSatisfy", {
                  count: result.obligations.length,
                })}
              </h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {result.obligations.slice(0, 6).map((o) => (
                  <div
                    key={o.id}
                    className="rounded-lg border border-line px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-ink">
                      {t(`domain.obligations.${o.id}.title`)}
                    </span>
                    <span dir="ltr" className="ms-1.5 font-mono text-[11px] text-ink-3">
                      {o.citation}
                    </span>
                  </div>
                ))}
              </div>
              {result.obligations.length > 6 && (
                <p className="mt-2 text-xs text-ink-3">
                  {t("classify.result.moreObligations", {
                    count: result.obligations.length - 6,
                  })}
                </p>
              )}
            </div>
          )}

          {/* AI explanation */}
          <div className="mt-6">
            {!narrative && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={explain}
                  disabled={loadingAI}
                  className="btn btn-secondary disabled:opacity-60"
                >
                  {loadingAI ? (
                    <>
                      <Spinner className="h-4 w-4" label={t("common.thinking")} />
                      {t("common.thinking")}
                    </>
                  ) : (
                    t("classify.result.explain")
                  )}
                </button>
                <DemoModeBadge />
              </div>
            )}
            {narrative && (
              <div
                className="rounded-xl border border-line bg-ink/[0.02] p-4"
                role={aiError ? "alert" : "status"}
                aria-live="polite"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink-3">
                  {t("classify.result.aiExplanation")}
                  {aiSource === "demo" && (
                    <span
                      title={t("classify.result.demoModeTitle")}
                      className="inline-flex items-center gap-1 rounded border border-line bg-ink/[0.03] px-1.5 py-0.5 text-[10px] font-medium normal-case tracking-normal text-ink-2"
                    >
                      {t("classify.result.demoModeTag")}
                    </span>
                  )}
                </div>
                <p className="prose-doc text-sm text-ink-2">{narrative}</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
            <button onClick={onBack} className="btn btn-ghost">
              <ArrowBackward /> {t("classify.result.editAnswers")}
            </button>
            <button onClick={onSave} className="btn btn-primary">
              {t("classify.result.saveToRegistry")} <ArrowForward />
            </button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-ink-3">
        {t("classify.result.disclaimer")}{" "}
        <Link href="/dashboard" className="underline hover:text-ink-2">
          {t("classify.result.viewDashboard")}
        </Link>
      </p>
    </div>
  );
}

/* --------------------------------------------------------------- Primitives */

// Uses the shared `.field` design-system input (see globals.css) so focus rings,
// radius and surface match every other form in the product.
const INPUT = "field px-3.5 py-2.5";

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
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-3">{sub}</p>
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
  const { t } = useI18n();
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-2">
        {label}
        {optional && <span className="ms-1 text-ink-3">{t("common.optional")}</span>}
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
  const { t } = useI18n();
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-line px-4 py-3">
      <div>
        <div className="text-sm font-medium text-ink">{label}</div>
        {hint && <div className="mt-0.5 text-xs text-ink-3">{hint}</div>}
      </div>
      <div className="seg shrink-0" role="group" aria-label={label}>
        {[
          [t("common.no"), false],
          [t("common.yes"), true],
        ].map(([txt, val]) => (
          <button
            key={txt as string}
            type="button"
            onClick={() => onChange(val as boolean)}
            data-active={value === val}
            aria-pressed={value === val}
            className="seg-item"
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
    ? "border-danger-500/50 bg-danger-500/10 ring-1 ring-danger-500/30"
    : "border-brand-500/60 bg-brand-500/10 ring-1 ring-brand-500/40";
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-start transition ${
        checked ? activeRing : "border-line hover:border-line-2"
      }`}
    >
      <span
        aria-hidden
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border text-xs ${
          checked
            ? danger
              ? "border-danger-500 bg-danger-500 text-on-accent"
              : "border-brand-600 bg-brand-600 text-on-accent"
            : "border-line-2 bg-ink/[0.04]"
        }`}
      >
        {checked && "✓"}
      </span>
      <span className="flex-1">
        <span className="flex items-center gap-2">
          <span className="text-sm font-medium text-ink">{title}</span>
          <span dir="ltr" className="font-mono text-[11px] text-ink-3">{cite}</span>
        </span>
        {desc && <span className="mt-0.5 block text-xs text-ink-3">{desc}</span>}
      </span>
    </button>
  );
}
