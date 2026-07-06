"use server";

/**
 * Team management server actions: invite / revoke, change role, remove member,
 * rename org, and accept an invitation. Every mutation is authorized (owner or
 * admin, except self-serve accept), RLS-enforced at the database, and recorded
 * in the audit log. The Team page is revalidated after each change.
 */

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireManager } from "@/lib/auth/guards";
import { PLAN_LIMITS } from "@/lib/billing/plans";
import { logAudit } from "@/lib/audit";
import { requestOrigin } from "@/lib/request-origin";
import { isEmail } from "@/lib/validation";
import { sendEmail } from "@/lib/email/provider";
import { buildInviteEmail } from "@/lib/email/invite";
import {
  ACTIVE_ORG_COOKIE,
  ACTIVE_ORG_COOKIE_MAX_AGE,
} from "@/lib/auth/types";
import type { OrgRole } from "@/lib/supabase/types";

export interface TeamActionState {
  error?: string;
  ok?: boolean;
  /** On a successful invite, the shareable accept link (no email provider yet). */
  inviteUrl?: string;
}

export async function inviteMemberAction(
  _prev: TeamActionState,
  formData: FormData,
): Promise<TeamActionState> {
  const ctx = await requireManager();
  if (!ctx?.activeOrg) return { error: "forbidden" };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "generic" };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role: OrgRole = formData.get("role") === "admin" ? "admin" : "member";
  if (!isEmail(email)) return { error: "invalidEmail" };

  // Enforce the plan's seat cap server-side: current members + pending invites
  // must stay under the limit (the UI meter alone was bypassable via the action).
  // Fully race-proof enforcement would live in the create_invitation RPC; this
  // closes the common path.
  const seatLimit = PLAN_LIMITS[ctx.plan].members;
  if (seatLimit !== null) {
    const [members, invites] = await Promise.all([
      supabase
        .from("org_members")
        .select("user_id", { head: true, count: "exact" })
        .eq("org_id", ctx.activeOrg.id),
      supabase
        .from("invitations")
        .select("id", { head: true, count: "exact" })
        .eq("org_id", ctx.activeOrg.id)
        .eq("status", "pending"),
    ]);
    if ((members.count ?? 0) + (invites.count ?? 0) >= seatLimit) {
      return { error: "memberLimit" };
    }
  }

  const { data, error } = await supabase.rpc("create_invitation", {
    p_org: ctx.activeOrg.id,
    p_email: email,
    p_role: role,
  });
  if (error || !data) {
    return { error: error?.code === "23505" ? "alreadyInvited" : "generic" };
  }

  await logAudit(ctx.activeOrg.id, "member.invited", {
    targetType: "invitation",
    targetId: data.id,
    metadata: { email, role },
  });
  revalidatePath("/team");

  const origin = await requestOrigin();
  const inviteUrl = `${origin}/accept-invite?token=${data.token}`;

  // Best-effort delivery. When email is unconfigured (Demo Mode / self-host
  // without Resend) sendEmail returns {skipped} and the manager still shares the
  // copyable link below — so an invite never fails because email did.
  await sendEmail(
    buildInviteEmail({
      to: email,
      orgName: ctx.activeOrg.name,
      inviterName: ctx.fullName ?? ctx.email ?? "A teammate",
      role,
      acceptUrl: inviteUrl,
    }),
  );

  return { ok: true, inviteUrl };
}

export async function revokeInviteAction(inviteId: string): Promise<TeamActionState> {
  const ctx = await requireManager();
  if (!ctx?.activeOrg) return { error: "forbidden" };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "generic" };

  const { error } = await supabase
    .from("invitations")
    .update({ status: "revoked" })
    .eq("id", inviteId)
    .eq("org_id", ctx.activeOrg.id);
  if (error) return { error: "generic" };

  await logAudit(ctx.activeOrg.id, "member.inviteRevoked", {
    targetType: "invitation",
    targetId: inviteId,
  });
  revalidatePath("/team");
  return { ok: true };
}

export async function changeMemberRoleAction(
  userId: string,
  role: OrgRole,
): Promise<TeamActionState> {
  const ctx = await requireManager();
  if (!ctx?.activeOrg) return { error: "forbidden" };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "generic" };

  const { error } = await supabase
    .from("org_members")
    .update({ role })
    .eq("org_id", ctx.activeOrg.id)
    .eq("user_id", userId);
  // DB triggers may reject (e.g. only an owner can grant owner; last owner).
  if (error) return { error: "notAllowed" };

  await logAudit(ctx.activeOrg.id, "member.roleChanged", {
    targetType: "user",
    targetId: userId,
    metadata: { role },
  });
  revalidatePath("/team");
  return { ok: true };
}

export async function removeMemberAction(userId: string): Promise<TeamActionState> {
  const ctx = await requireManager();
  if (!ctx?.activeOrg) return { error: "forbidden" };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "generic" };

  const { error } = await supabase
    .from("org_members")
    .delete()
    .eq("org_id", ctx.activeOrg.id)
    .eq("user_id", userId);
  if (error) return { error: "notAllowed" };

  await logAudit(ctx.activeOrg.id, "member.removed", {
    targetType: "user",
    targetId: userId,
  });
  revalidatePath("/team");
  return { ok: true };
}

export async function renameOrgAction(
  _prev: TeamActionState,
  formData: FormData,
): Promise<TeamActionState> {
  const ctx = await requireManager();
  if (!ctx?.activeOrg) return { error: "forbidden" };
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "generic" };

  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  if (name.length < 2) return { error: "generic" };

  const { error } = await supabase
    .from("organizations")
    .update({ name })
    .eq("id", ctx.activeOrg.id);
  if (error) return { error: "generic" };

  await logAudit(ctx.activeOrg.id, "org.renamed", { metadata: { name } });
  revalidatePath("/team");
  return { ok: true };
}

export async function acceptInviteAction(token: string): Promise<TeamActionState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "generic" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/accept-invite?token=${token}`)}`);
  }

  const { data: orgId, error } = await supabase.rpc("accept_invitation", {
    p_token: token,
  });
  if (error || !orgId) return { error: "invalidInvite" };

  const store = await cookies();
  store.set(ACTIVE_ORG_COOKIE, orgId, {
    path: "/",
    maxAge: ACTIVE_ORG_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  await logAudit(orgId, "member.joined", {});

  redirect("/dashboard");
}
