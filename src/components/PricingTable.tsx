"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowForward } from "@/components/Arrow";
import { useI18n } from "@/i18n/I18nProvider";

interface Tier {
  key: "starter" | "team" | "business";
  monthly: number;
  annual: number; // per-month price when billed annually
  href: string;
  highlight?: boolean;
  featureKeys: string[];
}

const TIERS: Tier[] = [
  {
    key: "starter",
    monthly: 0,
    annual: 0,
    href: "/classify",
    featureKeys: ["oneSystem", "classification", "checklist", "deadlines"],
  },
  {
    key: "team",
    monthly: 149,
    annual: 119,
    href: "/demo",
    highlight: true,
    featureKeys: ["systems", "drafted", "annexIV", "exports", "email"],
  },
  {
    key: "business",
    monthly: 399,
    annual: 319,
    href: "/demo",
    featureKeys: ["systems", "users", "auditLog", "api", "priority"],
  },
];

export function PricingTable() {
  const { t, formatCurrency } = useI18n();
  const [annual, setAnnual] = useState(true);

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={`text-sm font-medium ${annual ? "text-ink-3" : "text-ink"}`}>
          {t("pricingTable.monthly")}
        </span>
        <button
          role="switch"
          aria-checked={annual}
          aria-label={t("pricingTable.annual")}
          onClick={() => setAnnual((a) => !a)}
          className={`relative h-6 w-11 rounded-full transition ${
            annual ? "bg-brand-600" : "bg-white/10"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
              annual ? "start-[1.375rem]" : "start-0.5"
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${annual ? "text-ink" : "text-ink-3"}`}>
          {t("pricingTable.annual")}
        </span>
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400">
          {t("pricingTable.save")}
        </span>
      </div>

      {/* Tier cards */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => {
          const price = annual ? tier.annual : tier.monthly;
          return (
            <div
              key={tier.key}
              className={`flex flex-col rounded-2xl border bg-surface p-7 ${
                tier.highlight
                  ? "border-brand-500/40 shadow-[var(--shadow-card)] ring-1 ring-brand-500/30"
                  : "border-line shadow-[var(--shadow-card)]"
              }`}
            >
              {tier.highlight && (
                <div className="mb-3 inline-flex w-fit rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-300">
                  {t("pricingTable.mostPopular")}
                </div>
              )}
              <h3 className="text-lg font-semibold">
                {t(`pricingTable.tiers.${tier.key}.name`)}
              </h3>
              <p className="mt-0.5 text-sm text-ink-3">
                {t(`pricingTable.tiers.${tier.key}.tagline`)}
              </p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight">
                  {formatCurrency(price)}
                </span>
                {price !== 0 && (
                  <span className="text-sm text-ink-3">{t("pricingTable.perMonth")}</span>
                )}
              </div>
              <p className="mt-1 h-4 text-xs text-ink-3">
                {price !== 0
                  ? annual
                    ? t("pricingTable.billedAnnually")
                    : t("pricingTable.billedMonthly")
                  : t("pricingTable.freeForever")}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm text-ink-2">
                {tier.featureKeys.map((fk) => (
                  <li key={fk} className="flex items-start gap-2">
                    <CheckIcon />
                    {t(`pricingTable.tiers.${tier.key}.features.${fk}`)}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`mt-7 w-full ${
                  tier.highlight ? "btn btn-primary" : "btn btn-secondary"
                }`}
              >
                {t(`pricingTable.tiers.${tier.key}.cta`)}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Enterprise band */}
      <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-2xl border border-line bg-surface p-7 text-white sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{t("pricingTable.enterprise.name")}</h3>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-brand-200">
              {t("pricingTable.enterprise.badge")}
            </span>
          </div>
          <p className="mt-1.5 max-w-xl text-sm text-ink-2">
            {t("pricingTable.enterprise.desc")}
          </p>
        </div>
        <Link
          href="/demo"
          className="btn shrink-0 bg-white text-paper hover:bg-white/90"
        >
          {t("pricingTable.enterprise.cta")} <ArrowForward />
        </Link>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="mt-0.5 h-4 w-4 shrink-0 text-brand-400"
    >
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.79 6.8-6.79a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
