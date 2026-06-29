import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { getServerI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return {
    title: t("metadata.classify.title"),
    description: t("metadata.classify.description"),
  };
}

export default function ClassifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
