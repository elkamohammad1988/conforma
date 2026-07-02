import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getServerI18n } from "@/i18n/server";
import { AcceptInvite } from "@/components/team/AcceptInvite";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("team.acceptTitle"), robots: { index: false, follow: false } };
}

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  if (!isSupabaseConfigured()) redirect("/dashboard");

  const { token } = await searchParams;
  const value = Array.isArray(token) ? token[0] : token;
  if (!value) redirect("/dashboard");

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

  return <AcceptInvite token={value} signedIn={Boolean(user)} />;
}
