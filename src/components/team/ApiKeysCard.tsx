"use client";

/**
 * API keys management (owner/admin). Create reveals the plaintext key exactly
 * once; the list shows only the identifying prefix and usage. Revoking is a soft
 * flag. Rendered inside the Team surface.
 */

import { useActionState, useState, useTransition } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { useToast } from "@/components/ui/Toast";
import {
  createApiKeyAction,
  revokeApiKeyAction,
  type ApiKeyActionState,
} from "@/lib/api-keys/actions";
import type { ApiKeySummary } from "@/lib/api-keys/queries";

export function ApiKeysCard({ apiKeys }: { apiKeys: ApiKeySummary[] }) {
  const { t, formatDate } = useI18n();
  const { toast } = useToast();
  const [state, action] = useActionState<ApiKeyActionState, FormData>(
    createApiKeyAction,
    {},
  );
  const [pending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  if (state.error) toast(t("team.errors.generic"));

  const copy = async () => {
    if (!state.plaintextKey) return;
    try {
      await navigator.clipboard.writeText(state.plaintextKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const revoke = (id: string) =>
    startTransition(async () => {
      const res = await revokeApiKeyAction(id);
      if (res?.error) toast(t("team.errors.generic"));
    });

  const day = { day: "numeric", month: "short", year: "numeric" } as const;

  return (
    <section className="glass rounded-2xl p-5 sm:p-6">
      <h2 className="text-[0.95rem] font-semibold text-ink">{t("apiKeys.title")}</h2>
      <p className="mt-0.5 text-sm text-ink-2">{t("apiKeys.desc")}</p>

      <form action={action} className="mt-4 flex flex-wrap items-end gap-2">
        <input
          name="name"
          required
          maxLength={100}
          placeholder={t("apiKeys.namePlaceholder")}
          className="field min-w-[14rem] flex-1 px-3.5 py-2.5"
        />
        <button type="submit" className="btn btn-primary btn-sm">
          {t("apiKeys.create")}
        </button>
      </form>

      {state.ok && state.plaintextKey && (
        <div className="mt-3 rounded-lg border border-brand-500/40 bg-brand-500/10 p-3">
          <p className="text-xs font-medium text-ink">{t("apiKeys.created")}</p>
          <div className="mt-2 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded bg-ink/[0.06] px-2 py-1 font-mono text-xs text-ink">
              {state.plaintextKey}
            </code>
            <button type="button" onClick={copy} className="btn btn-secondary btn-sm">
              {copied ? t("apiKeys.copied") : t("apiKeys.copy")}
            </button>
          </div>
        </div>
      )}

      {apiKeys.length === 0 ? (
        <p className="mt-4 text-sm text-ink-3">{t("apiKeys.none")}</p>
      ) : (
        <ul className="mt-4 divide-y divide-line">
          {apiKeys.map((k) => (
            <li key={k.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {k.name}{" "}
                  <code className="ms-1 rounded bg-ink/[0.05] px-1.5 py-0.5 font-mono text-xs text-ink-3">
                    {k.keyPrefix}…
                  </code>
                </p>
                <p className="text-xs text-ink-3">
                  {t("apiKeys.createdOn", { date: formatDate(k.createdAt, day) })} ·{" "}
                  {k.lastUsedAt
                    ? t("apiKeys.lastUsed", { date: formatDate(k.lastUsedAt, day) })
                    : t("apiKeys.neverUsed")}
                </p>
              </div>
              {k.revokedAt ? (
                <span className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-ink-3">
                  {t("apiKeys.revoked")}
                </span>
              ) : (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => revoke(k.id)}
                  className="btn btn-secondary btn-sm"
                >
                  {t("apiKeys.revoke")}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
