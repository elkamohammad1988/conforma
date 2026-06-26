import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_APP_URL || "https://conforma.eu";

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
