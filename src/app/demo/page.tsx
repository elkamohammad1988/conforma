import type { Metadata } from "next";
import { DemoForm } from "@/components/DemoForm";

export const metadata: Metadata = {
  title: "Book a demo",
  description:
    "See how Conforma classifies your AI systems under the EU AI Act, closes obligation gaps, and generates audit-ready documentation. Book a 30-minute walkthrough.",
};

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div className="lg:pt-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Book a demo
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            See your AI Act exposure in 30 minutes
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            A compliance specialist will walk your team through classifying your AI
            systems, closing obligation gaps, and generating the documentation your
            auditors expect.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              [
                "A live risk read",
                "We classify one of your real systems on the call, with cited Articles.",
              ],
              [
                "Your obligation gaps",
                "See exactly what's outstanding and the deadline that applies.",
              ],
              [
                "Enterprise rollout",
                "SSO, roles, EU data residency and how teams adopt Conforma.",
              ],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  ✓
                </span>
                <div>
                  <div className="font-semibold text-slate-900">{t}</div>
                  <div className="text-sm text-slate-600">{d}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <DemoForm />
      </div>
    </div>
  );
}
