import type { Metadata } from "next";
import { AppGuard } from "@/components/auth/AppGuard";
import { getServerI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return {
    title: t("metadata.system.title"),
    robots: { index: false, follow: false },
  };
}

export default function SystemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppGuard>{children}</AppGuard>;
}
