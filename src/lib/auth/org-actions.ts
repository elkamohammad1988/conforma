"use server";

/**
 * Organization server actions: create an org (onboarding) and switch the active
 * org. Creation goes through the `create_organization` RPC, which atomically
 * inserts the org and the caller's owner membership.
 */

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ACTIVE_ORG_COOKIE, ACTIVE_ORG_COOKIE_MAX_AGE } from "./types";

export interface OrgActionState {
  error?: string;
}

/** Derive a URL-safe slug from a display name (matches the DB slug CHECK). */
function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritical marks
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
  return base.length >= 1 ? base : "org";
}

function setActiveOrgCookie(
  store: Awaited<ReturnType<typeof cookies>>,
  id: string,
): void {
  store.set(ACTIVE_ORG_COOKIE, id, {
    path: "/",
    maxAge: ACTIVE_ORG_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
}

export async function createOrganizationAction(
  _prev: OrgActionState,
  formData: FormData,
): Promise<OrgActionState> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return { error: "errors.generic" };

  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  if (name.length < 2) return { error: "errors.generic" };

  const baseSlug = slugify(name);
  let orgId: string | null = null;

  // Retry with a random suffix on slug collision (unique_violation = 23505).
  for (let attempt = 0; attempt < 5 && !orgId; attempt++) {
    const slug =
      attempt === 0
        ? baseSlug
        : `${baseSlug.slice(0, 34)}-${Math.random().toString(36).slice(2, 6)}`;
    const { data, error } = await supabase.rpc("create_organization", {
      p_name: name,
      p_slug: slug,
    });
    if (!error && data) {
      orgId = data.id;
    } else if (error && error.code !== "23505") {
      return { error: "errors.generic" };
    }
  }
  if (!orgId) return { error: "errors.generic" };

  const store = await cookies();
  setActiveOrgCookie(store, orgId);
  redirect("/dashboard");
}

/** Switch the active organization (must be one the user belongs to). */
export async function switchOrganizationAction(orgId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return;

  // RLS ensures the user can only read orgs they belong to, so this both
  // validates membership and prevents pointing the cookie at a foreign org.
  const { data } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("org_id", orgId)
    .maybeSingle();
  if (!data) return;

  const store = await cookies();
  setActiveOrgCookie(store, orgId);
}
