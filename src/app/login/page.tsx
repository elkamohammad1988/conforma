import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getServerI18n } from "@/i18n/server";
import { SignInForm } from "@/components/auth/SignInForm";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return { title: t("auth.signIn.title"), robots: { index: false, follow: false } };
}

function sanitizeNext(next: string | string[] | undefined): string {
  const v = Array.isArray(next) ? next[0] : next;
  return v && v.startsWith("/") && !v.startsWith("//") ? v : "/dashboard";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  // Demo Mode has no auth — never show a login screen.
  if (!isSupabaseConfigured()) redirect("/dashboard");
  const { next } = await searchParams;
  return <SignInForm next={sanitizeNext(next)} />;
}
