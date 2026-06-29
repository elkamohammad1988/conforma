"use client";

import { DemoForm } from "@/components/DemoForm";
import { useT } from "@/i18n/I18nProvider";

const BULLETS = ["riskRead", "gaps", "rollout"] as const;

export default function DemoPage() {
  const t = useT();
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div className="lg:pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-3">
            {t("demo.eyebrow")}
          </p>
          <h1 className="mt-3 text-[2.25rem] font-semibold leading-[1.1] text-ink">
            {t("demo.title")}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">
            {t("demo.subtitle")}
          </p>
          <ul className="mt-8 space-y-4">
            {BULLETS.map((key) => (
              <li key={key} className="flex gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-500/20 text-sm font-semibold text-brand-300">
                  ✓
                </span>
                <div>
                  <div className="font-semibold text-ink">
                    {t(`demo.bullets.${key}.title`)}
                  </div>
                  <div className="text-sm text-ink-2">
                    {t(`demo.bullets.${key}.desc`)}
                  </div>
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
