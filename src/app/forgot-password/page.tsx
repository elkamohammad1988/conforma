import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getServerI18n } from "@/i18n/server";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("auth.forgot.title"), robots: { index: false, follow: false } };
}

export default function ForgotPasswordPage() {
  if (!isSupabaseConfigured()) redirect("/dashboard");
  return <ForgotPasswordForm />;
}
