"use client";

import { useActionState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { updatePasswordAction, type AuthActionState } from "@/lib/auth/actions";
import { AuthScreen, PasswordField, SubmitButton, AuthError } from "./AuthUI";

export function ResetPasswordForm() {
  const { t } = useI18n();
  const [state, action] = useActionState<AuthActionState, FormData>(
    updatePasswordAction,
    {},
  );

  return (
    <AuthScreen title={t("auth.reset.title")} subtitle={t("auth.reset.subtitle")}>
      <form action={action} className="space-y-4">
        <AuthError error={state.error} />
        <PasswordField
          label={t("auth.reset.newPassword")}
          name="password"
          autoComplete="new-password"
          hint={t("auth.passwordHint")}
        />
        <PasswordField
          label={t("auth.reset.confirmPassword")}
          name="confirmPassword"
          autoComplete="new-password"
        />
        <SubmitButton
          label={t("auth.reset.submit")}
          pendingLabel={t("auth.reset.submitting")}
        />
      </form>
    </AuthScreen>
  );
}
