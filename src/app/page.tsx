import Link from "next/link";
import { Countdown } from "@/components/Countdown";
import { PricingTable } from "@/components/PricingTable";
import {
  ANNEX_III_AREAS,
  PENALTIES,
  PRIMARY_DEADLINE,
  RISK_TIERS,
} from "@/lib/eu-ai-act";

function ArrowRight() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const FRAMEWORKS = [
  "EU AI Act · 2024/1689",
  "GDPR",
  "ISO/IEC 42001",
  "NIST AI RMF",
];

const FAQ = [
  {
    q: "Does the EU AI Act apply to us if we're not in the EU?",
    a: "If your AI system is placed on the market or its output is used in the EU, the Act applies regardless of where your company is based — much like GDPR. Conforma helps any global team scope their exposure.",
  },
  {
    q: "Is Conforma legal advice?",
    a: "No. Conforma is decision-support tooling that encodes the regulation as a structured workflow with citations. It dramatically reduces the work, but you should confirm classifications with qualified counsel.",
  },
  {
    q: "What's the August 2026 deadline?",
    a: "Under Art. 113, the core obligations for high-risk systems (Annex III) and the Art. 50 transparency duties become applicable on 2 August 2026 — the deadline most organisations are racing toward.",
  },
  {
    q: "How accurate is the classification?",
    a: "Classification runs on a deterministic decision tree mapped directly to the Act's text, so every result is traceable to specific Articles. AI is used only to draft documentation and explanations, never to override the cited logic.",
  },
  {
    q: "Where is our data stored?",
    a: "Enterprise plans run in EU data residency with encryption in transit and at rest. See our Security page for the full detail, including SSO, audit logs and our DPA.",
  },
];

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://conforma.eu";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Conforma",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: siteUrl,
      description:
        "The compliance platform for the EU AI Act. Classify AI systems, close obligation gaps, and generate audit-ready documentation.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="bg-grid absolute inset-0" />
        <div className="absolute -top-32 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-amber-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              High-risk obligations apply {PRIMARY_DEADLINE.date} —{" "}
              <Countdown deadline={PRIMARY_DEADLINE.date} className="font-semibold" />
            </div>
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              EU AI Act compliance,
              <span className="bg-gradient-to-r from-brand-100 to-brand-500 bg-clip-text text-transparent">
                {" "}
                on autopilot
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-slate-300">
              Conforma inventories your AI systems, auto-classifies their risk with
              citations to the exact Articles, closes every obligation gap, and
              generates the documentation regulators expect — without hiring a
              compliance team.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/classify"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold shadow-lg shadow-brand-600/30 transition hover:bg-brand-500"
              >
                Start free <ArrowRight />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Book a demo
              </Link>
            </div>
            <p className="mt-5 text-xs text-slate-400">
              No credit card · 30-second classification · audit-ready in minutes
            </p>
          </div>

          {/* Framework trust strip */}
          <div className="mx-auto mt-16 max-w-3xl">
            <p className="text-center text-xs font-medium uppercase tracking-wider text-slate-500">
              Aligned with the frameworks your auditors expect
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-slate-400">
              {FRAMEWORKS.map((f) => (
                <span key={f}>{f}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Stat strip */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-5 py-10 text-center sm:grid-cols-4">
          {[
            ["€35M", "max fine for prohibited AI", "or 7% of turnover"],
            ["8", "high-risk use-case areas", "Annex III"],
            ["Aug 2026", "the deadline most face", "Art. 113"],
            ["27", "EU member states", "one regulation"],
          ].map(([big, label, sub]) => (
            <div key={label} className="px-3">
              <div className="text-2xl font-bold text-brand-700 sm:text-3xl">
                {big}
              </div>
              <div className="mt-1 text-sm font-medium text-slate-700">{label}</div>
              <div className="text-xs text-slate-400">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------- The problem */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              The problem
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Every company now ships AI. Almost none can prove it&apos;s compliant.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              The EU AI Act is the world&apos;s first comprehensive AI law, and it
              reaches any organisation whose AI touches the EU market — wherever
              they&apos;re based. Yet compliance today means a lawyer, a spreadsheet,
              and weeks of cross-referencing a 100-page regulation.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Conforma turns that into a guided workflow: answer a few questions per
              system, get a defensible classification, and walk out with the
              evidence and documents you need.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50">
            <div className="rounded-xl bg-ink p-6 font-mono text-sm text-slate-300">
              <div className="text-slate-500"># classify a system</div>
              <div className="mt-2">
                <span className="text-brand-300">system</span> = &quot;CV
                screening model&quot;
              </div>
              <div>
                <span className="text-brand-300">use_case</span> = Annex III(4)
                employment
              </div>
              <div className="mt-3 text-amber-300">→ HIGH RISK</div>
              <div className="mt-2 text-slate-400">
                11 provider obligations · Art. 9–49
              </div>
              <div className="text-slate-400">
                deadline: {PRIMARY_DEADLINE.date}
              </div>
              <div className="mt-3 text-emerald-300">✓ documentation drafted</div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Personas */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              One source of truth for everyone on the hook
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              The AI Act doesn&apos;t sit with one team. Conforma gives each
              stakeholder the same defensible record.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                role: "Legal & Compliance",
                d: "Defensible, cited classifications and an auditable trail — without manually parsing the regulation.",
              },
              {
                role: "AI & Product teams",
                d: "Know what each model requires before launch, so compliance stops blocking the roadmap.",
              },
              {
                role: "Security & IT leaders",
                d: "A single registry of every AI system in the org, its risk tier, and its evidence.",
              },
            ].map((p) => (
              <div
                key={p.role}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="text-base font-semibold text-slate-900">
                  {p.role}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Risk tiers */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Four risk tiers. One clear answer.
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            The Act sorts every AI system into a risk tier — and the tier decides
            what you must do. Conforma pins yours, with the citation.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(["prohibited", "high", "limited", "minimal"] as const).map((t) => {
            const meta = RISK_TIERS[t];
            const accent: Record<string, string> = {
              prohibited: "border-t-red-500",
              high: "border-t-amber-500",
              limited: "border-t-blue-500",
              minimal: "border-t-emerald-500",
            };
            return (
              <div
                key={t}
                className={`rounded-xl border border-slate-200 border-t-4 bg-white p-5 shadow-sm ${accent[t]}`}
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {meta.primaryCitation}
                </div>
                <div className="mt-1 text-lg font-bold text-slate-900">
                  {meta.short}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {meta.summary.length > 130
                    ? meta.summary.slice(0, 130) + "…"
                    : meta.summary}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------------- How it works */}
      <section id="how" className="border-y border-slate-200 bg-slate-50 scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              From unknown to audit-ready in four steps
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              {
                n: "1",
                t: "Register",
                d: "Add each AI system to your registry — built, bought, or embedded in a product.",
              },
              {
                n: "2",
                t: "Classify",
                d: "A guided questionnaire maps the system to a risk tier with cited Articles. No lawyer required.",
              },
              {
                n: "3",
                t: "Close gaps",
                d: "Work through the exact obligations for that tier as a tracked checklist with owners and status.",
              },
              {
                n: "4",
                t: "Generate docs",
                d: "Draft the technical documentation, transparency notices and declaration of conformity in one click.",
              },
            ].map((s) => (
              <div key={s.n}>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Features */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Cited, not vibes",
              d: "Every classification and obligation links to the specific Article or Annex of Regulation (EU) 2024/1689 — defensible in an audit.",
            },
            {
              t: "Annex III coverage",
              d: `All ${ANNEX_III_AREAS.length} high-risk areas encoded — from employment and credit scoring to biometrics and law enforcement.`,
            },
            {
              t: "AI-drafted documents",
              d: "Claude drafts the Annex IV technical file, Art. 50 transparency notices and the EU declaration of conformity, tailored to each system.",
            },
            {
              t: "Deadline tracking",
              d: "Live countdowns to each phased application date so nothing slips past 2 Aug 2026 or 2027.",
            },
            {
              t: "Provider & deployer",
              d: "Obligations split by your role — whether you build the system or merely deploy someone else's.",
            },
            {
              t: "GPAI aware",
              d: "Flags general-purpose AI model obligations (Art. 53+) on top of the system-level risk tier.",
            },
          ].map((f) => (
            <div
              key={f.t}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-base font-semibold text-slate-900">{f.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------- Comparison */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              A fraction of the cost of the alternatives
            </h2>
          </div>
          <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="px-5 py-3.5 font-medium" />
                  <th className="px-5 py-3.5 text-center font-semibold text-brand-700">
                    Conforma
                  </th>
                  <th className="px-5 py-3.5 text-center font-medium">Law firm</th>
                  <th className="px-5 py-3.5 text-center font-medium">Spreadsheet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["Cited risk classification", true, true, false],
                  ["Continuous, not one-off", true, false, false],
                  ["AI-drafted documentation", true, false, false],
                  ["Whole-portfolio registry", true, false, "manual"],
                  ["Cost", "€149/mo", "€10k+/audit", "€0 + risk"],
                ].map(([label, c, l, s]) => (
                  <tr key={label as string}>
                    <td className="px-5 py-3.5 font-medium text-slate-700">
                      {label as string}
                    </td>
                    <Cell v={c} highlight />
                    <Cell v={l} />
                    <Cell v={s} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Testimonials */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for the teams on the hook
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              q: "We went from a 40-tab spreadsheet to a single registry our auditors actually trust. The cited classifications are the part that sold our GC.",
              n: "Head of Compliance",
              c: "B2B SaaS · 200 employees",
            },
            {
              q: "Our product team can finally self-serve a risk read before launch instead of waiting two weeks for legal. That alone paid for it.",
              n: "VP Product",
              c: "Fintech scale-up",
            },
            {
              q: "The generated Annex IV draft saved our outside counsel days of work. We treat Conforma as the system of record for AI governance.",
              n: "DPO",
              c: "Healthcare platform",
            },
          ].map((t) => (
            <figure
              key={t.n}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="text-brand-500" aria-hidden>
                ★★★★★
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">
                “{t.q}”
              </blockquote>
              <figcaption className="mt-4 border-t border-slate-100 pt-3 text-sm">
                <div className="font-semibold text-slate-900">{t.n}</div>
                <div className="text-slate-500">{t.c}</div>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">
          Illustrative of target customers during early access.
        </p>
      </section>

      {/* ------------------------------------------------------------- Penalty */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="relative overflow-hidden rounded-2xl bg-ink p-10 text-center text-white sm:p-14">
          <div className="bg-grid absolute inset-0" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              The cost of getting it wrong
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              Penalties under Art. 99 scale to the higher of a fixed cap or a share
              of worldwide annual turnover.
            </p>
            <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-3">
              {[
                ["Prohibited use", PENALTIES.prohibited],
                ["High-risk breach", PENALTIES.highRisk],
                ["Misleading info", PENALTIES.misleadingInfo],
              ].map(([label, p]) => {
                const pen = p as (typeof PENALTIES)["prohibited"];
                return (
                  <div
                    key={label as string}
                    className="rounded-xl border border-white/10 bg-white/5 p-6"
                  >
                    <div className="text-3xl font-bold text-amber-300">
                      €{(pen.amountEur / 1_000_000).toFixed(0)}M
                    </div>
                    <div className="mt-1 text-sm text-slate-300">
                      or {pen.turnoverPct}% of turnover
                    </div>
                    <div className="mt-3 text-xs uppercase tracking-wide text-slate-500">
                      {label as string} · {pen.citation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Security band */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid items-center gap-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-2 lg:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              Enterprise-ready
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Security and governance built in
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              EU data residency, encryption in transit and at rest, SSO/SAML,
              role-based access, audit logs and a custom DPA. Your compliance tool
              should be compliant too.
            </p>
            <Link
              href="/security"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
            >
              Read about our security <ArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              "EU data residency",
              "Encryption at rest & in transit",
              "SSO / SAML",
              "Role-based access",
              "Audit logging",
              "Custom DPA",
            ].map((b) => (
              <div
                key={b}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700"
              >
                <span className="text-brand-600">✓</span>
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Pricing */}
      <section id="pricing" className="border-t border-slate-200 bg-slate-50 scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Pricing that beats a compliance retainer
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              A single high-risk audit from a law firm costs more than a year of
              Conforma. Start free, upgrade when you scale.
            </p>
          </div>
          <div className="mt-12">
            <PricingTable />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-5 py-20 scroll-mt-20">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h2>
        <div className="mt-10 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-slate-900">
                {f.q}
                <span className="text-slate-400 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------- Final CTA */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Find out where you stand in 30 seconds
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
            No account, no card. Classify your first AI system and see exactly what
            the EU AI Act requires of it.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/classify"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500"
            >
              Start free <ArrowRight />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Book a demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Cell({ v, highlight }: { v: unknown; highlight?: boolean }) {
  let content: React.ReactNode;
  if (v === true)
    content = <span className="text-emerald-600">✓</span>;
  else if (v === false)
    content = <span className="text-slate-300">—</span>;
  else content = <span className="text-slate-600">{v as string}</span>;
  return (
    <td
      className={`px-5 py-3.5 text-center ${
        highlight ? "bg-brand-50/40 font-semibold" : ""
      }`}
    >
      {content}
    </td>
  );
}
