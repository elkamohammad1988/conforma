import type { MetadataRoute } from "next";
import { SITE_URL as base } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // App / private surfaces — keep out of the index.
      disallow: ["/dashboard", "/systems", "/report", "/api"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
