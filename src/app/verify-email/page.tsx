import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getServerI18n } from "@/i18n/server";
import { VerifyEmailPanel } from "@/components/auth/VerifyEmailPanel";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("auth.verify.title"), robots: { index: false, follow: false } };
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string | string[] }>;
}) {
  if (!isSupabaseConfigured()) redirect("/dashboard");
  const { email } = await searchParams;
  const value = Array.isArray(email) ? email[0] : (email ?? "");
  return <VerifyEmailPanel email={value} />;
}
