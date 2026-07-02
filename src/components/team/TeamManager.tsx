"use client";

/**
 * Team management surface: workspace name, members (with role control + remove),
 * pending invitations (invite form + revoke) and an activity timeline. All
 * mutations go through role-gated, audited server actions; the page revalidates
 * server-side after each change. Managers (owner/admin) see controls; members
 * see a read-only view.
 */

import { useActionState, useState, useTransition } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { useToast } from "@/components/ui/Toast";
import { useSession } from "@/components/auth/SessionProvider";
import { PLAN_LIMITS } from "@/lib/billing/plans";
import {
  inviteMemberAction,
  revokeInviteAction,
  changeMemberRoleAction,
  removeMemberAction,
  renameOrgAction,
  type TeamActionState,
} from "@/lib/team/actions";
import type { OrgRole } from "@/lib/supabase/types";
import type {
  TeamMember,
  PendingInvite,
  ActivityItem,
} from "@/lib/team/queries";
import type { ApiKeySummary } from "@/lib/api-keys/queries";
import { ApiKeysCard } from "./ApiKeysCard";

const ACTION_KEYS: Record<string, string> = {
  "member.invited": "invited",
  "member.joined": "joined",
  "member.removed": "removed",
  "member.roleChanged": "roleChanged",
  "member.inviteRevoked": "inviteRevoked",
  "org.renamed": "orgRenamed",
  "apikey.created": "apiKeyCreated",
  "apikey.revoked": "apiKeyRevoked",
};

export function TeamManager({
  orgName,
  canManage,
  currentUserId,
  members,
  invites,
  activity,
  apiKeys,
  systemsCount,
}: {
  orgName: string;
  canManage: boolean;
  currentUserId: string;
  members: TeamMember[];
  invites: PendingInvite[];
  activity: ActivityItem[];
  apiKeys: ApiKeySummary[];
  systemsCount: number;
}) {
  const { t, formatDate } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {t("team.title")}
        </h1>
        <p className="mt-1 text-sm text-ink-2">{t("team.subtitle")}</p>
      </header>

      <div className="flex flex-col gap-4">
        <WorkspaceName name={orgName} canManage={canManage} />
        <UsageOverview
          systemsCount={systemsCount}
          membersCount={members.length}
          apiKeysCount={apiKeys.filter((k) => !k.revokedAt).length}
        />
        {canManage && <InviteForm />}
        <MembersCard members={members} canManage={canManage} currentUserId={currentUserId} />
        {canManage && invites.length > 0 && <InvitesCard invites={invites} />}
        {canManage && <ApiKeysCard apiKeys={apiKeys} />}
        <ActivityCard activity={activity} formatDate={formatDate} />
      </div>
      {!canManage && (
        <p className="mt-4 text-center text-xs text-ink-3">{t("team.memberNote")}</p>
      )}
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-2xl p-5 sm:p-6">
      <h2 className="text-[0.95rem] font-semibold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Meter({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number | null;
}) {
  const { t } = useI18n();
  const pct = limit === null ? 0 : Math.min(100, Math.round((used / limit) * 100));
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink-2">{label}</span>
        <span className="nums font-medium text-ink">
          {limit === null
            ? `${used} · ${t("billing.unlimited")}`
            : t("billing.usageCount", { used, limit })}
        </span>
      </div>
      {limit !== null && (
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
          <div
            className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-danger-500" : "bg-brand-500"}`}
            style={{ width: `${Math.max(4, pct)}%` }}
          />
        </div>
      )}
    </div>
  );
}

function UsageOverview({
  systemsCount,
  membersCount,
  apiKeysCount,
}: {
  systemsCount: number;
  membersCount: number;
  apiKeysCount: number;
}) {
  const { t } = useI18n();
  const session = useSession();
  const plan = session?.plan ?? "free";
  const limits = PLAN_LIMITS[plan];

  return (
    <Card title={t("team.usageTitle")}>
      <div className="space-y-4">
        <Meter label={t("billing.usage")} used={systemsCount} limit={limits.systems} />
        <Meter label={t("team.members")} used={membersCount} limit={limits.members} />
        <Meter label={t("apiKeys.title")} used={apiKeysCount} limit={null} />
      </div>
    </Card>
  );
}

function WorkspaceName({ name, canManage }: { name: string; canManage: boolean }) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [state, action] = useActionState<TeamActionState, FormData>(renameOrgAction, {});
  if (state.error) toast(t(`team.errors.${state.error}`));

  return (
    <Card title={t("team.orgName")}>
      <form action={action} className="flex flex-wrap items-center gap-2">
        <input
          name="name"
          defaultValue={name}
          disabled={!canManage}
          maxLength={120}
          aria-label={t("team.orgName")}
          className="field max-w-xs px-3.5 py-2.5"
        />
        {canManage && (
          <button type="submit" className="btn btn-secondary btn-sm">
            {t("team.save")}
          </button>
        )}
        {state.ok && <span className="text-xs text-ok-400">{t("team.saved")}</span>}
      </form>
    </Card>
  );
}

function InviteForm() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [state, action] = useActionState<TeamActionState, FormData>(inviteMemberAction, {});
  const [copied, setCopied] = useState(false);
  if (state.error) toast(t(`team.errors.${state.error}`));

  const copy = async () => {
    if (!state.inviteUrl) return;
    try {
      await navigator.clipboard.writeText(state.inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <Card title={t("team.invite")}>
      <form action={action} className="flex flex-wrap items-end gap-2">
        <input
          name="email"
          type="email"
          required
          placeholder={t("team.emailPlaceholder")}
          aria-label={t("auth.emailLabel")}
          className="field min-w-[14rem] flex-1 px-3.5 py-2.5"
        />
        <select
          name="role"
          aria-label={t("team.role")}
          className="field px-3.5 py-2.5"
          defaultValue="member"
        >
          <option value="member">{t("team.roles.member")}</option>
          <option value="admin">{t("team.roles.admin")}</option>
        </select>
        <button type="submit" className="btn btn-primary btn-sm">
          {t("team.sendInvite")}
        </button>
      </form>

      {state.ok && state.inviteUrl && (
        <div className="mt-3 rounded-lg border border-line bg-surface-2 p-3">
          <p className="text-xs text-ink-2">{t("team.inviteCreated")}</p>
          <div className="mt-2 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded bg-ink/[0.04] px-2 py-1 text-xs text-ink">
              {state.inviteUrl}
            </code>
            <button type="button" onClick={copy} className="btn btn-secondary btn-sm">
              {copied ? t("team.copied") : t("team.copy")}
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

function MembersCard({
  members,
  canManage,
  currentUserId,
}: {
  members: TeamMember[];
  canManage: boolean;
  currentUserId: string;
}) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<TeamActionState>) =>
    startTransition(async () => {
      const res = await fn();
      if (res?.error) toast(t(`team.errors.${res.error}`));
    });

  return (
    <Card title={t("team.members")}>
      <ul className="divide-y divide-line">
        {members.map((m) => (
          <li key={m.userId} className="flex items-center gap-3 py-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-500/15 text-xs font-semibold text-brand-400">
              {(m.fullName || m.email || "?").slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">
                {m.fullName || m.email || m.userId}
                {m.userId === currentUserId && (
                  <span className="ms-2 text-xs font-normal text-ink-3">
                    ({t("team.you")})
                  </span>
                )}
              </p>
              {m.fullName && m.email && (
                <p className="truncate text-xs text-ink-3">{m.email}</p>
              )}
            </div>

            {canManage && m.userId !== currentUserId ? (
              <div className="flex items-center gap-2">
                <select
                  defaultValue={m.role}
                  disabled={pending}
                  aria-label={`${t("team.role")} — ${m.fullName || m.email || m.userId}`}
                  onChange={(e) =>
                    run(() => changeMemberRoleAction(m.userId, e.target.value as OrgRole))
                  }
                  className="field px-2 py-1 text-xs"
                >
                  <option value="owner">{t("team.roles.owner")}</option>
                  <option value="admin">{t("team.roles.admin")}</option>
                  <option value="member">{t("team.roles.member")}</option>
                </select>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => run(() => removeMemberAction(m.userId))}
                  className="btn btn-danger btn-sm"
                >
                  {t("team.remove")}
                </button>
              </div>
            ) : (
              <span className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-ink-2">
                {t(`team.roles.${m.role}`)}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function InvitesCard({ invites }: { invites: PendingInvite[] }) {
  const { t, formatDate } = useI18n();
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();

  const revoke = (id: string) =>
    startTransition(async () => {
      const res = await revokeInviteAction(id);
      if (res?.error) toast(t(`team.errors.${res.error}`));
    });

  return (
    <Card title={t("team.pendingInvites")}>
      <ul className="divide-y divide-line">
        {invites.map((inv) => (
          <li key={inv.id} className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{inv.email}</p>
              <p className="text-xs text-ink-3">
                {t(`team.roles.${inv.role}`)} ·{" "}
                {t("team.expires", {
                  date: formatDate(inv.expiresAt, {
                    day: "numeric",
                    month: "short",
                  }),
                })}
              </p>
            </div>
            <button
              type="button"
              disabled={pending}
              onClick={() => revoke(inv.id)}
              className="btn btn-secondary btn-sm"
            >
              {t("team.revoke")}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ActivityCard({
  activity,
  formatDate,
}: {
  activity: ActivityItem[];
  formatDate: ReturnType<typeof useI18n>["formatDate"];
}) {
  const { t } = useI18n();

  if (activity.length === 0) {
    return (
      <Card title={t("team.activity")}>
        <p className="text-sm text-ink-3">{t("team.noActivity")}</p>
      </Card>
    );
  }

  return (
    <Card title={t("team.activity")}>
      <ul className="space-y-3">
        {activity.map((a) => {
          const key = ACTION_KEYS[a.action];
          const label = key
            ? t(`team.actions.${key}`)
            : t("team.actions.generic", { action: a.action });
          return (
            <li key={a.id} className="flex items-start gap-2.5 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              <div className="min-w-0 flex-1">
                <p className="text-ink-2">
                  <span className="font-medium text-ink">
                    {a.actorName ?? "—"}
                  </span>{" "}
                  {label}
                </p>
                <p className="text-xs text-ink-3">
                  {formatDate(a.createdAt, {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
