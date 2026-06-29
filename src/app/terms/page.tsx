"use client";

import { RichText } from "@/components/ui/RichText";
import { useI18n } from "@/i18n/I18nProvider";

const SECTIONS = [
  "agreement",
  "service",
  "notAdvice",
  "accounts",
  "content",
  "ip",
  "disclaimers",
  "liability",
  "law",
  "changes",
] as const;

export default function TermsPage() {
  const { t, formatDateLong } = useI18n();
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">
        {t("terms.eyebrow")}
      </p>
      <h1 className="mt-2 text-[2rem] font-semibold tracking-tight text-ink">
        {t("terms.title")}
      </h1>
      <p className="mt-3 text-sm text-ink-3">
        {t("terms.effective", { date: formatDateLong(t("terms.effectiveDate")) })}
      </p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink-2">
        {SECTIONS.map((s) => (
          <section key={s}>
            <h2 className="text-lg font-semibold text-ink">
              {t(`terms.sections.${s}.title`)}
            </h2>
            <div className="mt-2">
              <RichText source={t(`terms.sections.${s}.body`)} />
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
