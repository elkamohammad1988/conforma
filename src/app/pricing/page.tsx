import type { Metadata } from "next";
import Link from "next/link";
import { PricingTable } from "@/components/PricingTable";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for EU AI Act compliance. Start free, scale to unlimited systems with SSO, audit logs and EU data residency on Enterprise.",
};

export default function PricingPage() {
  return (
    <div>
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Pricing that beats a compliance retainer
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            A single high-risk audit from a law firm costs more than a year of
            Conforma. Start free — no credit card required.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <PricingTable />
      </section>

      {/* Feature comparison */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="text-center text-2xl font-bold tracking-tight">
            Compare plans
          </h2>
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="px-5 py-3 font-medium">Feature</th>
                  <th className="px-4 py-3 text-center font-medium">Starter</th>
                  <th className="px-4 py-3 text-center font-medium">Team</th>
                  <th className="px-4 py-3 text-center font-medium">Business</th>
                  <th className="px-4 py-3 text-center font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(
                  [
                    ["AI systems", "1", "25", "100", "Unlimited"],
                    ["Risk classification", "✓", "✓", "✓", "✓"],
                    ["Obligation checklists", "✓", "✓", "✓", "✓"],
                    ["AI-drafted documents", "—", "✓", "✓", "✓"],
                    ["Audit-ready exports", "—", "✓", "✓", "✓"],
                    ["Users & roles", "1", "5", "Unlimited", "Unlimited"],
                    ["Audit log", "—", "—", "✓", "✓"],
                    ["API access", "—", "—", "✓", "✓"],
                    ["SSO / SAML", "—", "—", "—", "✓"],
                    ["EU data residency", "—", "—", "—", "✓"],
                    ["Custom DPA", "—", "—", "—", "✓"],
                    ["Dedicated success manager", "—", "—", "—", "✓"],
                  ] as const
                ).map((row) => (
                  <tr key={row[0]}>
                    <td className="px-5 py-3 font-medium">{row[0]}</td>
                    {row.slice(1).map((v, i) => (
                      <td
                        key={i}
                        className={`px-4 py-3 text-center ${
                          v === "✓"
                            ? "text-emerald-600"
                            : v === "—"
                              ? "text-slate-300"
                              : "text-slate-600"
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
          <p className="mt-8 text-center text-slate-600">
            Need something custom?{" "}
            <Link href="/demo" className="font-semibold text-brand-700 hover:underline">
              Talk to sales →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
