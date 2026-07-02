"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";

const ROLE_KEYS = ["compliance", "product", "security", "executive", "other"] as const;
// Numeric ranges read the same in every locale.
const SYSTEM_RANGES = ["1–10", "11–50", "51–200", "200+"];
// A character that will never appear in the copy, used to split the success
// sentence so the email can be emphasised inline regardless of word order.
const EMAIL_SLOT = "￼";

export function DemoForm() {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "compliance",
    systems: "1–10",
    message: "",
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  if (submitted) {
    const [beforeEmail, afterEmail] = t("demoForm.success.body", {
      email: EMAIL_SLOT,
    }).split(EMAIL_SLOT);
    return (
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-10 text-center shadow-[var(--shadow-card)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 h-56"
          style={{
            background:
              "radial-gradient(55% 100% at 50% 0%, color-mix(in srgb, var(--color-ok-500) 18%, transparent), transparent 72%)",
          }}
        />
        <div className="relative">
          <div
            className="animate-scale-in mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-ok-500/30 bg-ok-500/10 text-2xl text-ok-400"
            style={{ boxShadow: "0 10px 30px -10px rgba(35,184,119,0.55)" }}
          >
            ✓
          </div>
        <h2 className="mt-5 text-2xl font-semibold text-ink">
          {t("demoForm.success.title", {
            name: form.name || t("demoForm.success.nameFallback"),
          })}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-ink-2">
          {beforeEmail}
          <span className="font-medium text-ink">
            {form.email || t("demoForm.success.emailFallback")}
          </span>
          {afterEmail ?? ""}
        </p>
        <p className="mt-2 text-sm text-ink-3">
          {t("demoForm.success.impatient")}
          <Link href="/classify" className="font-medium text-brand-400 hover:underline">
            {t("demoForm.success.impatientLink")}
          </Link>
          .
        </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="rounded-2xl border border-line bg-surface p-7 shadow-[var(--shadow-card)] sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <L label={t("demoForm.fullName")}>
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={input}
            placeholder={t("demoForm.placeholders.name")}
          />
        </L>
        <L label={t("demoForm.workEmail")}>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={input}
            placeholder={t("demoForm.placeholders.email")}
          />
        </L>
        <L label={t("demoForm.company")}>
          <input
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
            className={input}
            placeholder={t("demoForm.placeholders.company")}
          />
        </L>
        <L label={t("demoForm.role")}>
          <select
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
            className={input}
          >
            {ROLE_KEYS.map((r) => (
              <option key={r} value={r}>
                {t(`demoForm.roles.${r}`)}
              </option>
            ))}
          </select>
        </L>
        <L label={t("demoForm.systemsInScope")}>
          <select
            value={form.systems}
            onChange={(e) => set("systems", e.target.value)}
            className={input}
          >
            {SYSTEM_RANGES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </L>
        <div className="sm:col-span-2">
          <L label={t("demoForm.anythingElse")} optional>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              className={`${input} resize-none`}
              placeholder={t("demoForm.placeholders.message")}
            />
          </L>
        </div>
      </div>
      <button type="submit" className="btn btn-primary mt-6 w-full">
        {t("demoForm.submit")}
      </button>
      <p className="mt-3 text-center text-xs text-ink-3">{t("demoForm.consent")}</p>
    </form>
  );
}

// Shared `.field` design-system input (globals.css) — consistent focus ring,
// radius and surface with the rest of the product's forms.
const input = "field px-3.5 py-2.5";

function L({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-2">
        {label}
        {optional && <span className="ms-1 text-ink-3">{t("common.optional")}</span>}
      </span>
      {children}
    </label>
  );
}
