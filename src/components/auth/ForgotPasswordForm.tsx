"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import {
  requestPasswordResetAction,
  type AuthActionState,
} from "@/lib/auth/actions";
import { AuthScreen, Field, SubmitButton, AuthError } from "./AuthUI";

export function ForgotPasswordForm() {
  const { t } = useI18n();
  const [state, action] = useActionState<AuthActionState, FormData>(
    requestPasswordResetAction,
    {},
  );

  const footer = (
    <Link href="/login" className="font-medium text-brand-400 hover:underline">
      {t("auth.forgot.backToSignIn")}
    </Link>
  );

  if (state.ok) {
    return (
      <AuthScreen title={t("auth.forgot.title")} footer={footer}>
        <p
          role="status"
          className="rounded-lg border border-ok-500/30 bg-ok-500/10 px-3 py-3 text-sm text-ink-2"
        >
          {t("auth.forgot.sent", { email: state.email ?? "" })}
        </p>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title={t("auth.forgot.title")}
      subtitle={t("auth.forgot.subtitle")}
      footer={footer}
    >
      <form action={action} className="space-y-4">
        <AuthError error={state.error} />
        <Field
          label={t("auth.emailLabel")}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t("auth.emailPlaceholder")}
        />
        <SubmitButton
          label={t("auth.forgot.submit")}
          pendingLabel={t("auth.forgot.submitting")}
        />
      </form>
    </AuthScreen>
  );
}
