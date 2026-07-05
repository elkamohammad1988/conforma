import type { Metadata } from "next";
import { getServerI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getServerI18n();
  return {
    title: t("metadata.pricing.title"),
    description: t("metadata.pricing.description"),
    // Self-referential canonical — without this the page inherits the root
    // layout's `canonical: "/"` and Google deindexes it into the homepage.
    alternates: { canonical: "/pricing" },
  };
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
