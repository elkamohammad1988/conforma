import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Security & Trust",
  description:
    "How Conforma protects your data: EU data residency, encryption in transit and at rest, SSO/SAML, role-based access, audit logging, sub-processor transparency and a custom DPA.",
};

const PRINCIPLES = [
  {
    t: "Encryption everywhere",
    d: "All data is encrypted in transit with TLS 1.2+ and at rest with AES-256. Secrets are managed in a dedicated key-management service.",
  },
  {
    t: "EU data residency",
    d: "Enterprise data is stored and processed in EU regions, so your compliance record never leaves the jurisdiction it covers.",
  },
  {
    t: "Least-privilege access",
    d: "Role-based access control, SSO/SAML and enforced MFA mean people see only what their role requires — and you can prove it.",
  },
  {
    t: "Full audit trail",
    d: "Every change to a classification, obligation or document is logged with actor and timestamp — your evidence for an audit.",
  },
  {
    t: "Tenant isolation",
    d: "Customer data is logically isolated per organisation, with strict access boundaries enforced at the application and data layers.",
  },
  {
    t: "Resilient by design",
    d: "Automated backups, monitored infrastructure and a tested recovery process keep your registry available and intact.",
  },
];

const SUBPROCESSORS = [
  ["Cloud hosting", "EU region application & database hosting", "EU"],
  ["AI document drafting", "Generates draft compliance documents on request", "EU / US"],
  ["Error monitoring", "Aggregated, scrubbed application telemetry", "EU"],
  ["Email delivery", "Transactional and notification email", "EU"],
];

export default function SecurityPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-300">
            Security &amp; Trust
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Your compliance tool should be compliant too
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            Conforma holds the most sensitive map of your AI estate. We protect it
            with enterprise-grade controls and full transparency about how your data
            is handled.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["GDPR-aligned", "ISO/IEC 42001 aligned", "NIST AI RMF", "Custom DPA"].map(
              (b) => (
                <span
                  key={b}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm font-medium text-slate-200"
                >
                  {b}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <div
              key={p.t}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-base font-semibold text-slate-900">{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy / data handling */}
      <section
        id="privacy"
        className="scroll-mt-20 border-y border-slate-200 bg-slate-50"
      >
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="text-2xl font-bold tracking-tight">
            Data protection &amp; privacy
          </h2>
          <div className="mt-6 space-y-5 text-slate-600">
            <p className="leading-relaxed">
              You own your data. We process it solely to provide the service, never
              to train third-party models, and we make it exportable at any time.
              Enterprise customers receive a custom Data Processing Agreement (DPA)
              covering roles, sub-processors and security commitments under the GDPR.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Data residency", "EU regions (Enterprise)"],
                ["Retention", "Yours to control; deleted on request"],
                ["Portability", "Full export, any time"],
              ].map(([t, d]) => (
                <div
                  key={t}
                  className="rounded-lg border border-slate-200 bg-white p-4"
                >
                  <div className="text-xs uppercase tracking-wide text-slate-400">
                    {t}
                  </div>
                  <div className="mt-1 text-sm font-medium text-slate-800">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sub-processors */}
      <section id="subprocessors" className="scroll-mt-20 mx-auto max-w-4xl px-5 py-16">
        <h2 className="text-2xl font-bold tracking-tight">Sub-processors</h2>
        <p className="mt-3 text-slate-600">
          We use a small, vetted set of sub-processors to deliver the service. Each
          is bound by data-protection terms consistent with our commitments to you.
        </p>
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Purpose</th>
                <th className="px-5 py-3 font-medium">Region</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {SUBPROCESSORS.map((s) => (
                <tr key={s[0]}>
                  <td className="px-5 py-3 font-medium">{s[0]}</td>
                  <td className="px-5 py-3 text-slate-600">{s[1]}</td>
                  <td className="px-5 py-3">{s[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Representative list for the current product stage; the binding list is
          maintained in your DPA.
        </p>
      </section>

      {/* Disclosure / CTA */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Responsible disclosure
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
                Found a vulnerability? We want to hear from you. Report it to{" "}
                <span className="font-medium text-slate-800">
                  security@conforma.eu
                </span>{" "}
                and we&apos;ll acknowledge within one business day.
              </p>
            </div>
            <Link
              href="/demo"
              className="shrink-0 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Request our security pack
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
