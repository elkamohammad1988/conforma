"use client";

import { useActionState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import {
  createOrganizationAction,
  type OrgActionState,
} from "@/lib/auth/org-actions";
import { AuthScreen, Field, SubmitButton, AuthError } from "./AuthUI";

export function OnboardingForm() {
  const { t } = useI18n();
  const [state, action] = useActionState<OrgActionState, FormData>(
    createOrganizationAction,
    {},
  );

  return (
    <AuthScreen
      title={t("auth.onboarding.title")}
      subtitle={t("auth.onboarding.subtitle")}
    >
      <form action={action} className="space-y-4">
        <AuthError error={state.error} />
        <Field
          label={t("auth.orgNameLabel")}
          name="name"
          placeholder={t("auth.orgNamePlaceholder")}
          hint={t("auth.onboarding.slugHint")}
          autoComplete="organization"
        />
        <SubmitButton
          label={t("auth.onboarding.submit")}
          pendingLabel={t("auth.onboarding.submitting")}
        />
      </form>
    </AuthScreen>
  );
}
