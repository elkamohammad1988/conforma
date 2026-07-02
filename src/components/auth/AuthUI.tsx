"use client";

/**
 * Shared building blocks for the auth screens (sign in, sign up, reset,
 * verify, onboarding). Kept in one module so every screen shares the exact same
 * card, spacing, field styling and focus behaviour — and reuses the product's
 * design tokens (`.field`, `.btn`, surface/line/ink colours) rather than
 * inventing new ones.
 */

import { useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { LogoMark } from "@/components/Logo";
import { useI18n } from "@/i18n/I18nProvider";

const inputCls = "field px-3.5 py-2.5";

/** Centered auth surface: brand mark, title, subtitle, card body, footer slot. */
export function AuthScreen({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="app-canvas flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-[25rem]">
        <Link
          href="/"
          className="mx-auto mb-7 flex w-fit items-center gap-2.5"
          aria-label="Conforma"
        >
          <LogoMark className="h-9 w-9" />
          <span className="text-[1.15rem] font-semibold tracking-tight text-ink">
            Conforma
          </span>
        </Link>

        <div className="rounded-2xl border border-line bg-surface p-7 shadow-[var(--shadow-card)] sm:p-8">
          <h1 className="text-xl font-semibold tracking-tight text-ink">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-ink-2">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>

        {footer && (
          <p className="mt-5 text-center text-sm text-ink-2">{footer}</p>
        )}
      </div>
    </div>
  );
}

/** Labelled text input. */
export function Field({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  required = true,
  defaultValue,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-2">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className={inputCls}
      />
      {hint && <span className="mt-1 block text-xs text-ink-3">{hint}</span>}
    </label>
  );
}

/** Password input with a show/hide toggle. */
export function PasswordField({
  label,
  name,
  autoComplete = "current-password",
  hint,
}: {
  label: string;
  name: string;
  autoComplete?: string;
  hint?: string;
}) {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-2">{label}</span>
      <div className="relative">
        <input
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={8}
          className={`${inputCls} pe-11`}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 end-0 grid w-10 place-items-center rounded-e-[0.6rem] text-ink-3 transition hover:text-ink"
          aria-label={show ? t("auth.hidePassword") : t("auth.showPassword")}
          aria-pressed={show}
        >
          {show ? <EyeOff /> : <Eye />}
        </button>
      </div>
      {hint && <span className="mt-1 block text-xs text-ink-3">{hint}</span>}
    </label>
  );
}

/** Full-width submit button that reflects the form's pending state. */
export function SubmitButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="btn btn-primary w-full"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

/** Inline error, rendered from an i18n subpath under `auth.`. */
export function AuthError({ error }: { error?: string }) {
  const { t } = useI18n();
  if (!error) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-danger-500/30 bg-danger-500/10 px-3 py-2 text-sm text-danger-500"
    >
      {t(`auth.${error}`)}
    </p>
  );
}

function Eye() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOff() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-[18px] w-[18px]" aria-hidden>
      <path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 5.2A9.7 9.7 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.1 6.1A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 3.1-.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
