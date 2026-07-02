"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { signInAction, type AuthActionState } from "@/lib/auth/actions";
import { AuthScreen, Field, PasswordField, SubmitButton, AuthError } from "./AuthUI";

export function SignInForm({ next }: { next: string }) {
  const { t } = useI18n();
  const [state, action] = useActionState<AuthActionState, FormData>(signInAction, {});

  return (
    <AuthScreen
      title={t("auth.signIn.title")}
      subtitle={t("auth.signIn.subtitle")}
      footer={
        <>
          {t("auth.signIn.noAccount")}{" "}
          <Link href="/signup" className="font-medium text-brand-400 hover:underline">
            {t("auth.signIn.createAccount")}
          </Link>
        </>
      }
    >
      <form action={action} className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <AuthError error={state.error} />
        <Field
          label={t("auth.emailLabel")}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t("auth.emailPlaceholder")}
          defaultValue={state.email}
        />
        <div>
          <PasswordField label={t("auth.passwordLabel")} name="password" />
          <div className="mt-1.5 text-end">
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-ink-3 hover:text-ink"
            >
              {t("auth.signIn.forgot")}
            </Link>
          </div>
        </div>
        <SubmitButton
          label={t("auth.signIn.submit")}
          pendingLabel={t("auth.signIn.submitting")}
        />
      </form>
    </AuthScreen>
  );
}
