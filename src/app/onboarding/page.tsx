import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getActiveContext } from "@/lib/auth/context";
import { getServerI18n } from "@/i18n/server";
import { OnboardingForm } from "@/components/auth/OnboardingForm";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return {
    title: t("auth.onboarding.title"),
    robots: { index: false, follow: false },
  };
}

export default async function OnboardingPage() {
  if (!isSupabaseConfigured()) redirect("/dashboard");

  const ctx = await getActiveContext();
  if (!ctx) redirect("/login?next=/onboarding");
  // Already has a workspace — no need to onboard again.
  if (ctx.activeOrg) redirect("/dashboard");

  return <OnboardingForm />;
}
