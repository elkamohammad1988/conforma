import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getServerI18n } from "@/i18n/server";
import { SignUpForm } from "@/components/auth/SignUpForm";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("auth.signUp.title"), robots: { index: false, follow: false } };
}

export default function SignUpPage() {
  if (!isSupabaseConfigured()) redirect("/dashboard");
  return <SignUpForm />;
}
