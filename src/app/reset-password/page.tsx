import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getServerI18n } from "@/i18n/server";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("auth.reset.title"), robots: { index: false, follow: false } };
}

export default function ResetPasswordPage() {
  if (!isSupabaseConfigured()) redirect("/dashboard");
  return <ResetPasswordForm />;
}
