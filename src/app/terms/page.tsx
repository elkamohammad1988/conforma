import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms governing use of Conforma, including the scope of the service, the no-legal-advice disclaimer, acceptable use, and liability.",
};

const EFFECTIVE = "24 June 2026";

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
        Legal
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-3 text-sm text-slate-500">Effective {EFFECTIVE}</p>

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-slate-700">
        <S title="1. Agreement">
          These terms govern your access to and use of Conforma (the
          &quot;Service&quot;). By using the Service, you agree to these terms. If you
          are using the Service on behalf of an organisation, you represent that you
          are authorised to bind it.
        </S>

        <S title="2. The Service">
          Conforma provides software to help organisations assess and document
          compliance with the EU AI Act. We may update, improve, or modify features
          over time.
        </S>

        <S title="3. Not legal advice">
          Conforma is a decision-support tool. Its classifications, checklists, and
          generated documents are informational and do{" "}
          <strong>not</strong> constitute legal advice. You remain responsible for
          your compliance and should confirm classifications with qualified counsel.
        </S>

        <S title="4. Accounts &amp; acceptable use">
          You are responsible for safeguarding your account and for activity under
          it. You agree not to misuse the Service, attempt to disrupt it, or use it
          to violate any law or third-party right.
        </S>

        <S title="5. Your content">
          You retain all rights to the data you submit. You grant us a limited licence
          to process it solely to provide the Service, as described in our{" "}
          <Link href="/privacy" className="font-medium text-brand-700 hover:underline">
            Privacy Policy
          </Link>
          .
        </S>

        <S title="6. Intellectual property">
          The Service, including its software, design, and content (excluding your
          data), is owned by Conforma and protected by applicable law. These terms
          grant you no rights to our trademarks or branding.
        </S>

        <S title="7. Disclaimers">
          The Service is provided &quot;as is&quot; without warranties of any kind,
          to the fullest extent permitted by law. We do not warrant that the Service
          will be uninterrupted, error-free, or that its outputs are complete or
          legally sufficient for your specific circumstances.
        </S>

        <S title="8. Limitation of liability">
          To the maximum extent permitted by law, Conforma will not be liable for any
          indirect, incidental, or consequential damages, or for any regulatory
          penalties arising from your use of the Service.
        </S>

        <S title="9. Governing law">
          These terms are governed by the laws of Ireland, without regard to conflict
          of law principles, and the courts of Ireland will have exclusive
          jurisdiction, unless your mandatory local consumer law provides otherwise.
        </S>

        <S title="10. Changes &amp; contact">
          We may update these terms; material changes will be notified in advance.
          Questions? Email{" "}
          <a
            href="mailto:legal@conforma.eu"
            className="font-medium text-brand-700 hover:underline"
          >
            legal@conforma.eu
          </a>
          .
        </S>
      </div>
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
