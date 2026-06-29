"use client";

import Link from "next/link";
import { PricingTable } from "@/components/PricingTable";
import { ArrowForward } from "@/components/Arrow";
import { useI18n } from "@/i18n/I18nProvider";

const CHECK = "✓";
const DASH = "—";

export default function PricingPage() {
  const { t } = useI18n();
  const UN = t("pricing.table.unlimited");

  const rows: { key: string; values: string[] }[] = [
    { key: "systems", values: ["1", "25", "100", UN] },
    { key: "classification", values: [CHECK, CHECK, CHECK, CHECK] },
    { key: "checklists", values: [CHECK, CHECK, CHECK, CHECK] },
    { key: "drafted", values: [DASH, CHECK, CHECK, CHECK] },
    { key: "exports", values: [DASH, CHECK, CHECK, CHECK] },
    { key: "users", values: ["1", "5", UN, UN] },
    { key: "auditLog", values: [DASH, DASH, CHECK, CHECK] },
    { key: "api", values: [DASH, DASH, CHECK, CHECK] },
    { key: "sso", values: [DASH, DASH, DASH, CHECK] },
    { key: "residency", values: [DASH, DASH, DASH, CHECK] },
    { key: "dpa", values: [DASH, DASH, DASH, CHECK] },
    { key: "successManager", values: [DASH, DASH, DASH, CHECK] },
  ];

  return (
    <div>
      <section className="border-b border-line bg-white/[0.03]">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("pricing.hero.title")}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">
            {t("pricing.hero.subtitle")}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <PricingTable />
      </section>

      {/* Feature comparison */}
      <section className="border-t border-line bg-white/[0.03]">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            {t("pricing.comparePlans")}
          </h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-card)]">
            <table className="w-full text-start text-sm">
              <thead>
                <tr className="border-b border-line bg-white/[0.03] text-ink-3">
                  <th className="px-5 py-3 text-start font-medium">
                    {t("pricing.table.feature")}
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    {t("pricing.table.starter")}
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    {t("pricing.table.team")}
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    {t("pricing.table.business")}
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    {t("pricing.table.enterprise")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-ink-2">
                {rows.map((row) => (
                  <tr key={row.key}>
                    <td className="px-5 py-3 font-medium">
                      {t(`pricing.table.rows.${row.key}`)}
                    </td>
                    {row.values.map((v, i) => (
                      <td
                        key={i}
                        className={`px-4 py-3 text-center ${
                          v === CHECK
                            ? "text-emerald-400"
                            : v === DASH
                              ? "text-ink-3"
                              : "text-ink-2"
                        }`}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-8 text-center text-ink-2">
            {t("pricing.custom.text")}{" "}
            <Link href="/demo" className="font-semibold text-brand-300 hover:underline">
              {t("pricing.custom.cta")} <ArrowForward />
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
