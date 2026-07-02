"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { RichText } from "@/components/ui/RichText";
import { signUpAction, type AuthActionState } from "@/lib/auth/actions";
import { AuthScreen, Field, PasswordField, SubmitButton, AuthError } from "./AuthUI";

export function SignUpForm() {
  const { t } = useI18n();
  const [state, action] = useActionState<AuthActionState, FormData>(signUpAction, {});

  return (
    <AuthScreen
      title={t("auth.signUp.title")}
      subtitle={t("auth.signUp.subtitle")}
      footer={
        <>
          {t("auth.signUp.haveAccount")}{" "}
          <Link href="/login" className="font-medium text-brand-400 hover:underline">
            {t("auth.signUp.signInLink")}
          </Link>
        </>
      }
    >
      <form action={action} className="space-y-4">
        <AuthError error={state.error} />
        <Field
          label={t("auth.fullNameLabel")}
          name="fullName"
          autoComplete="name"
          placeholder={t("auth.fullNamePlaceholder")}
          required={false}
        />
        <Field
          label={t("auth.emailLabel")}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t("auth.emailPlaceholder")}
          defaultValue={state.email}
        />
        <PasswordField
          label={t("auth.passwordLabel")}
          name="password"
          autoComplete="new-password"
          hint={t("auth.passwordHint")}
        />
        <SubmitButton
          label={t("auth.signUp.submit")}
          pendingLabel={t("auth.signUp.submitting")}
        />
        <RichText
          source={t("auth.signUp.terms")}
          className="text-center text-xs text-ink-3"
        />
      </form>
    </AuthScreen>
  );
}
