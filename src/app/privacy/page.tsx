import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Conforma collects, uses, and protects personal data, your rights under the GDPR, data residency, retention, and our sub-processors.",
};

const EFFECTIVE = "24 June 2026";

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
        Legal
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-3 text-sm text-slate-500">Effective {EFFECTIVE}</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-slate-700">
        <S title="Overview">
          Conforma (&quot;we&quot;, &quot;us&quot;) provides software that helps
          organisations assess and document their compliance with the EU AI Act
          (Regulation (EU) 2024/1689). This policy explains what personal data we
          process and the choices you have. We are committed to processing personal
          data lawfully under the General Data Protection Regulation (GDPR).
        </S>

        <S title="Data we process">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>Account &amp; contact data</strong> — name, work email,
              company, and role, when you create an account or request a demo.
            </li>
            <li>
              <strong>Product data</strong> — the AI-system records, classifications
              and documents you create in Conforma. This is your content; we process
              it only to provide the service.
            </li>
            <li>
              <strong>Usage &amp; technical data</strong> — aggregated, scrubbed
              telemetry (e.g. error events) used to keep the service reliable.
            </li>
          </ul>
        </S>

        <S title="How we use data">
          We process personal data to provide and secure the service, respond to
          enquiries, and meet our legal obligations. We do{" "}
          <strong>not</strong> sell personal data, and we do not use your product
          content to train third-party AI models.
        </S>

        <S title="Legal bases">
          Depending on the context, we rely on the performance of a contract
          (providing the service), our legitimate interests (securing and improving
          the service), your consent (e.g. marketing), and compliance with legal
          obligations.
        </S>

        <S title="Data residency &amp; retention">
          Enterprise customer data is hosted in EU regions. We retain personal data
          only as long as needed to provide the service or as required by law, and
          delete or anonymise it on request. See our{" "}
          <Link href="/security" className="font-medium text-brand-700 hover:underline">
            Security page
          </Link>{" "}
          for technical detail.
        </S>

        <S title="Sub-processors">
          We use a small, vetted set of sub-processors bound by data-protection terms
          consistent with this policy. The current list is published on our{" "}
          <Link
            href="/security#subprocessors"
            className="font-medium text-brand-700 hover:underline"
          >
            Security page
          </Link>
          .
        </S>

        <S title="Your rights">
          Under the GDPR you have the right to access, rectify, erase, restrict, and
          port your personal data, and to object to certain processing. To exercise
          any of these, contact us at{" "}
          <a
            href="mailto:privacy@conforma.eu"
            className="font-medium text-brand-700 hover:underline"
          >
            privacy@conforma.eu
          </a>
          . You also have the right to lodge a complaint with your local supervisory
          authority.
        </S>

        <S title="Contact">
          Questions about this policy or your data? Email{" "}
          <a
            href="mailto:privacy@conforma.eu"
            className="font-medium text-brand-700 hover:underline"
          >
            privacy@conforma.eu
          </a>
          .
        </S>
      </div>

      <p className="mt-12 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-500">
        This page is provided for transparency about how the product handles data and
        does not constitute legal advice.
      </p>
    </article>
  );
}

function S({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
