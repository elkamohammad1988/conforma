"use client";

import { useState } from "react";
import Link from "next/link";

interface Tier {
  name: string;
  tagline: string;
  monthly: number | null;
  annual: number | null; // per-month price when billed annually
  cta: string;
  href: string;
  highlight?: boolean;
  features: string[];
}

const TIERS: Tier[] = [
  {
    name: "Starter",
    tagline: "Map your first system",
    monthly: 0,
    annual: 0,
    cta: "Start free",
    href: "/classify",
    features: [
      "1 AI system",
      "Risk classification with cited Articles",
      "Obligation checklist",
      "Deadline tracking",
    ],
  },
  {
    name: "Team",
    tagline: "For teams shipping AI",
    monthly: 149,
    annual: 119,
    cta: "Start 14-day trial",
    href: "/demo",
    highlight: true,
    features: [
      "Up to 25 AI systems",
      "AI-drafted documentation",
      "Annex IV technical files",
      "Audit-ready exports",
      "Email support",
    ],
  },
  {
    name: "Business",
    tagline: "For scaling AI portfolios",
    monthly: 399,
    annual: 319,
    cta: "Start 14-day trial",
    href: "/demo",
    features: [
      "Up to 100 AI systems",
      "Multiple users & roles",
      "Audit log & change history",
      "API access",
      "Priority support",
    ],
  },
];

export function PricingTable() {
  const [annual, setAnnual] = useState(true);

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3">
        <span
          className={`text-sm font-medium ${annual ? "text-slate-400" : "text-slate-900"}`}
        >
          Monthly
        </span>
        <button
          role="switch"
          aria-checked={annual}
          onClick={() => setAnnual((a) => !a)}
          className={`relative h-6 w-11 rounded-full transition ${
            annual ? "bg-brand-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
              annual ? "left-[1.375rem]" : "left-0.5"
            }`}
          />
        </button>
        <span
          className={`text-sm font-medium ${annual ? "text-slate-900" : "text-slate-400"}`}
        >
          Annual
        </span>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
          Save 20%
        </span>
      </div>

      {/* Tier cards */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => {
          const price = annual ? t.annual : t.monthly;
          return (
            <div
              key={t.name}
              className={`flex flex-col rounded-2xl border bg-white p-7 ${
                t.highlight
                  ? "border-brand-600 shadow-xl shadow-brand-600/10 ring-1 ring-brand-600"
                  : "border-slate-200 shadow-sm"
              }`}
            >
              {t.highlight && (
                <div className="mb-3 inline-flex w-fit rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                  Most popular
                </div>
              )}
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <p className="mt-0.5 text-sm text-slate-500">{t.tagline}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">
                  {price === 0 ? "€0" : `€${price}`}
                </span>
                {price !== 0 && (
                  <span className="text-sm text-slate-500">/mo</span>
                )}
              </div>
              <p className="mt-1 h-4 text-xs text-slate-400">
                {price !== 0 && price !== null
                  ? annual
                    ? "billed annually"
                    : "billed monthly"
                  : "free forever"}
              </p>
              <ul className="mt-6 flex-1 space-y-2.5 text-sm text-slate-600">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={t.href}
                className={`mt-7 rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition ${
                  t.highlight
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Enterprise band */}
      <div className="mt-6 flex flex-col items-start justify-between gap-5 rounded-2xl border border-slate-200 bg-ink p-7 text-white sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Enterprise</h3>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-brand-200">
              SSO · RBAC · DPA
            </span>
          </div>
          <p className="mt-1.5 max-w-xl text-sm text-slate-300">
            Unlimited systems, SSO/SAML, role-based access, EU data residency,
            audit logs, custom DPA, and a dedicated compliance success manager.
          </p>
        </div>
        <Link
          href="/demo"
          className="shrink-0 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-slate-100"
        >
          Talk to sales →
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
      className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
    >
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.79 6.8-6.79a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
