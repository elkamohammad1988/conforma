"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import {
  resendVerificationAction,
  type AuthActionState,
} from "@/lib/auth/actions";
import { AuthScreen, SubmitButton } from "./AuthUI";

export function VerifyEmailPanel({ email }: { email: string }) {
  const { t } = useI18n();
  const [state, action] = useActionState<AuthActionState, FormData>(
    resendVerificationAction,
    {},
  );

  return (
    <AuthScreen
      title={t("auth.verify.title")}
      subtitle={t("auth.verify.subtitle", { email: email || t("auth.emailLabel") })}
      footer={
        <Link href="/login" className="font-medium text-brand-400 hover:underline">
          {t("auth.verify.backToSignIn")}
        </Link>
      }
    >
      <div className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-surface-2 text-brand-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6" aria-hidden>
          <path d="M4 6h16v12H4z" strokeLinejoin="round" />
          <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {state.ok ? (
        <p role="status" className="mt-5 text-sm text-ok-400">
          {t("auth.verify.resent")}
        </p>
      ) : (
        <form action={action} className="mt-5">
          <input type="hidden" name="email" value={email} />
          <SubmitButton
            label={t("auth.verify.resend")}
            pendingLabel={t("auth.forgot.submitting")}
          />
        </form>
      )}
    </AuthScreen>
  );
}
