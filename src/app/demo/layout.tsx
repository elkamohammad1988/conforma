import type { Metadata } from "next";
import { getServerI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return {
    title: t("metadata.demo.title"),
    description: t("metadata.demo.description"),
    alternates: { canonical: "/demo" },
  };
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
