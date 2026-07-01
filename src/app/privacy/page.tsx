"use client";

import { RichText } from "@/components/ui/RichText";
import { useI18n } from "@/i18n/I18nProvider";

const SECTIONS = [
  "overview",
  "dataWeProcess",
  "howWeUse",
  "legalBases",
  "residency",
  "subprocessors",
  "rights",
  "contact",
] as const;

export default function PrivacyPage() {
  const { t, formatDateLong } = useI18n();
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">
        {t("privacy.eyebrow")}
      </p>
      <h1 className="mt-2 text-[2rem] font-semibold tracking-tight text-ink">
        {t("privacy.title")}
      </h1>
      <p className="mt-3 text-sm text-ink-3">
        {t("privacy.effective", { date: formatDateLong(t("privacy.effectiveDate")) })}
      </p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink-2">
        {SECTIONS.map((s) => (
          <section key={s}>
            <h2 className="text-lg font-semibold text-ink">
              {t(`privacy.sections.${s}.title`)}
            </h2>
            <div className="mt-2">
              <RichText source={t(`privacy.sections.${s}.body`)} />
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 rounded-lg border border-line bg-ink/[0.03] p-4 text-xs leading-relaxed text-ink-3">
        {t("privacy.footnote")}
      </p>
    </article>
  );
}
