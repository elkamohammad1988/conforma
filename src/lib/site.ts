/**
 * Canonical URLs for the project. Centralised so the app chrome, settings page,
 * metadata, sitemap and robots all resolve the same source of truth.
 */

/**
 * Absolute production origin, used for canonical tags, Open Graph, the sitemap
 * and robots. Override per environment with `NEXT_PUBLIC_APP_URL`; the fallback
 * is the live deployment so metadata is correct even when the var is unset.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://conforma-ten.vercel.app";

export const REPO_URL = "https://github.com/elkamohammad1988/conforma";
export const DOCS_URL = `${REPO_URL}/tree/main/docs`;
export const CASE_STUDY_URL = `${REPO_URL}/blob/main/docs/case-study.md`;

/** The developer behind this portfolio project — the person a client is evaluating. */
export const AUTHOR = {
  name: "Mohammad Elkabouri",
  email: "elkabouri.moha1988@gmail.com",
  url: "https://github.com/elkamohammad1988",
} as const;
