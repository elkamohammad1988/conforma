"use client";

import Link from "next/link";
import { useT } from "@/i18n/I18nProvider";

const BADGES = ["gdpr", "iso", "nist", "dpa"] as const;
const PRINCIPLES = [
  "encryption",
  "residency",
  "leastPrivilege",
  "audit",
  "isolation",
  "resilient",
] as const;
const PRIVACY_CARDS = ["residency", "retention", "portability"] as const;
const SUBPROCESSORS = ["hosting", "ai", "monitoring", "email"] as const;

export default function SecurityPage() {
  const t = useT();
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-paper">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-72"
          style={{
            background:
              "radial-gradient(60% 100% at 50% 0%, rgba(200,30,40,0.06), transparent 72%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5 py-20 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">
            {t("security.eyebrow")}
          </p>
          <h1 className="mt-3 text-[2.25rem] font-semibold leading-[1.08] text-ink sm:text-[2.75rem]">
            {t("security.title")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">
            {t("security.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {BADGES.map((b) => (
              <span
                key={b}
                className="rounded-full border border-line bg-ink/[0.03] px-3 py-1 text-sm font-medium text-ink-2"
              >
                {t(`security.badges.${b}`)}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div
              key={p}
              className="lift rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]"
            >
              <h3 className="text-base font-semibold text-ink">
                {t(`security.principles.${p}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                {t(`security.principles.${p}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy / data handling */}
      <section id="privacy" className="scroll-mt-20 border-y border-line bg-ink/[0.03]">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("security.privacy.title")}
          </h2>
          <div className="mt-6 space-y-5 text-ink-2">
            <p className="leading-relaxed">{t("security.privacy.body")}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {PRIVACY_CARDS.map((c) => (
                <div key={c} className="rounded-lg border border-line bg-surface p-4">
                  <div className="text-xs uppercase tracking-[0.1em] text-ink-3">
                    {t(`security.privacy.cards.${c}.title`)}
                  </div>
                  <div className="mt-1 text-sm font-medium text-ink">
                    {t(`security.privacy.cards.${c}.value`)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sub-processors */}
      <section id="subprocessors" className="scroll-mt-20 mx-auto max-w-4xl px-5 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("security.subprocessors.title")}
        </h2>
        <p className="mt-3 text-ink-2">{t("security.subprocessors.intro")}</p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
          <table className="w-full text-start text-sm">
            <thead className="border-b border-line bg-ink/[0.03] text-xs uppercase tracking-[0.1em] text-ink-3">
              <tr>
                <th className="px-5 py-3 text-start font-medium">
                  {t("security.subprocessors.table.category")}
                </th>
                <th className="px-5 py-3 text-start font-medium">
                  {t("security.subprocessors.table.purpose")}
                </th>
                <th className="px-5 py-3 text-start font-medium">
                  {t("security.subprocessors.table.region")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-ink-2">
              {SUBPROCESSORS.map((s) => (
                <tr key={s}>
                  <td className="px-5 py-3 font-medium">
                    {t(`security.subprocessors.rows.${s}.category`)}
                  </td>
                  <td className="px-5 py-3 text-ink-2">
                    {t(`security.subprocessors.rows.${s}.purpose`)}
                  </td>
                  <td className="px-5 py-3">
                    {t(`security.subprocessors.rows.${s}.region`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-3">{t("security.subprocessors.note")}</p>
      </section>

      {/* Disclosure / CTA */}
      <section className="border-t border-line bg-ink/[0.03]">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-surface p-8 shadow-[var(--shadow-card)] sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                {t("security.disclosure.title")}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-2">
                {t("security.disclosure.bodyBefore")}
                <span className="font-medium text-ink">
                  {t("security.disclosure.email")}
                </span>
                {t("security.disclosure.bodyAfter")}
              </p>
            </div>
            <Link href="/demo" className="btn btn-primary shrink-0">
              {t("security.disclosure.cta")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
