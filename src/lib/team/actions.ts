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
import { getActiveContext } from "@/lib/auth/context";
import { logAudit } from "@/lib/audit";
import { requestOrigin } from "@/lib/request-origin";
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

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Require an active org where the caller is owner or admin. */
async function requireManager() {
  const ctx = await getActiveContext();
  if (!ctx?.activeOrg || ctx.activeOrg.role === "member") return null;
  return ctx;
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
  if (!EMAIL_RE.test(email)) return { error: "invalidEmail" };

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
  return { ok: true, inviteUrl: `${origin}/accept-invite?token=${data.token}` };
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
