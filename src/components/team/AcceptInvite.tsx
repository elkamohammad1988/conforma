"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";
import { acceptInviteAction } from "@/lib/team/actions";
import { AuthScreen } from "@/components/auth/AuthUI";

export function AcceptInvite({
  token,
  signedIn,
}: {
  token: string;
  signedIn: boolean;
}) {
  const { t } = useI18n();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const accept = () =>
    startTransition(async () => {
      const res = await acceptInviteAction(token);
      if (res?.error) setError(res.error);
    });

  const next = `/accept-invite?token=${encodeURIComponent(token)}`;

  return (
    <AuthScreen title={t("team.acceptTitle")} subtitle={t("team.acceptBody")}>
      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-danger-500/30 bg-danger-500/10 px-3 py-2 text-sm text-danger-500"
        >
          {t(`team.errors.${error}`)}
        </p>
      )}

      {signedIn ? (
        <button
          type="button"
          onClick={accept}
          disabled={pending}
          aria-busy={pending}
          className="btn btn-primary w-full"
        >
          {t("team.acceptButton")}
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-ink-2">{t("team.acceptSignedOut")}</p>
          <div className="flex gap-2">
            <Link
              href={`/login?next=${encodeURIComponent(next)}`}
              className="btn btn-primary flex-1"
            >
              {t("auth.signIn.submit")}
            </Link>
            <Link href="/signup" className="btn btn-secondary flex-1">
              {t("auth.signIn.createAccount")}
            </Link>
          </div>
        </div>
      )}
    </AuthScreen>
  );
}
