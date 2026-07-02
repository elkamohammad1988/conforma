/**
 * Server-side reads for the Team surface: members, pending invitations, and the
 * activity timeline. Each joins across profiles in JS (rather than PostgREST
 * embedding) to stay well-typed against the hand-written schema. All reads are
 * RLS-scoped to the caller's org.
 */

import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { OrgRole, InvitationStatus, Json } from "@/lib/supabase/types";

export interface TeamMember {
  userId: string;
  email: string | null;
  fullName: string | null;
  role: OrgRole;
  joinedAt: string;
}

export interface PendingInvite {
  id: string;
  email: string;
  role: OrgRole;
  status: InvitationStatus;
  createdAt: string;
  expiresAt: string;
}

export interface ActivityItem {
  id: number;
  action: string;
  actorName: string | null;
  targetType: string | null;
  targetId: string | null;
  metadata: Json;
  createdAt: string;
}

export async function getTeamMembers(orgId: string): Promise<TeamMember[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data: mem } = await supabase
    .from("org_members")
    .select("user_id, role, created_at")
    .eq("org_id", orgId);
  const rows = mem ?? [];
  if (rows.length === 0) return [];

  const { data: profs } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .in(
      "id",
      rows.map((r) => r.user_id),
    );
  const byId = new Map((profs ?? []).map((p) => [p.id, p]));

  return rows
    .map((r) => {
      const p = byId.get(r.user_id);
      return {
        userId: r.user_id,
        email: p?.email ?? null,
        fullName: p?.full_name ?? null,
        role: r.role,
        joinedAt: r.created_at,
      };
    })
    .sort((a, b) => a.joinedAt.localeCompare(b.joinedAt));
}

export async function getPendingInvites(orgId: string): Promise<PendingInvite[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("invitations")
    .select("id, email, role, status, created_at, expires_at")
    .eq("org_id", orgId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return (data ?? []).map((i) => ({
    id: i.id,
    email: i.email,
    role: i.role,
    status: i.status,
    createdAt: i.created_at,
    expiresAt: i.expires_at,
  }));
}

/** Cheap head-count of the systems in an org (for usage meters). */
export async function getSystemsCount(orgId: string): Promise<number> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return 0;
  const { count } = await supabase
    .from("systems")
    .select("id", { head: true, count: "exact" })
    .eq("org_id", orgId);
  return count ?? 0;
}

export async function getActivity(
  orgId: string,
  limit = 25,
): Promise<ActivityItem[]> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("audit_logs")
    .select("id, action, actor_id, target_type, target_id, metadata, created_at")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false })
    .limit(limit);
  const rows = data ?? [];

  const actorIds = [
    ...new Set(rows.map((r) => r.actor_id).filter((v): v is string => Boolean(v))),
  ];
  const names = new Map<string, string | null>();
  if (actorIds.length > 0) {
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", actorIds);
    for (const p of profs ?? []) names.set(p.id, p.full_name ?? p.email);
  }

  return rows.map((r) => ({
    id: r.id,
    action: r.action,
    actorName: r.actor_id ? (names.get(r.actor_id) ?? null) : null,
    targetType: r.target_type,
    targetId: r.target_id,
    metadata: r.metadata,
    createdAt: r.created_at,
  }));
}
