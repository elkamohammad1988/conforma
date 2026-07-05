import type { MetadataRoute } from "next";
import { SITE_URL as base } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // App / private / auth surfaces — keep out of the index.
      disallow: [
        "/dashboard",
        "/systems",
        "/report",
        "/settings",
        "/team",
        "/api",
        "/login",
        "/signup",
        "/onboarding",
        "/verify-email",
        "/forgot-password",
        "/reset-password",
        "/accept-invite",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
