import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getActiveContext } from "@/lib/auth/context";
import { getServerI18n } from "@/i18n/server";
import { AppShell } from "@/components/AppShell";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { TeamManager } from "@/components/team/TeamManager";
import {
  getTeamMembers,
  getPendingInvites,
  getActivity,
  getSystemsCount,
} from "@/lib/team/queries";
import { getApiKeys } from "@/lib/api-keys/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("team.title"), robots: { index: false, follow: false } };
}

export default async function TeamPage() {
  // Team is a Production-only surface (no orgs in Demo Mode).
  if (!isSupabaseConfigured()) redirect("/dashboard");

  const ctx = await getActiveContext();
  if (!ctx) redirect("/login?next=/team");
  if (!ctx.activeOrg) redirect("/onboarding");

  const canManage = ctx.activeOrg.role !== "member";
  const [members, invites, activity, apiKeys, systemsCount] = await Promise.all([
    getTeamMembers(ctx.activeOrg.id),
    canManage ? getPendingInvites(ctx.activeOrg.id) : Promise.resolve([]),
    getActivity(ctx.activeOrg.id),
    canManage ? getApiKeys(ctx.activeOrg.id) : Promise.resolve([]),
    getSystemsCount(ctx.activeOrg.id),
  ]);

  return (
    <SessionProvider value={ctx}>
      <AppShell>
        <TeamManager
          orgName={ctx.activeOrg.name}
          canManage={canManage}
          currentUserId={ctx.userId}
          members={members}
          invites={invites}
          activity={activity}
          apiKeys={apiKeys}
          systemsCount={systemsCount}
        />
      </AppShell>
    </SessionProvider>
  );
}
