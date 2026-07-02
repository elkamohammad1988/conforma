import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy.
 *
 * Conforma ships no third-party client scripts. The only cross-origin browser
 * traffic is the Supabase client (REST + realtime websocket) in Production Mode,
 * so its origin is added to `connect-src` when configured — otherwise the policy
 * stays tight and same-origin only. `'unsafe-inline'` is required for the
 * framework's hydration bootstrap and JSON-LD; `'unsafe-eval'` only in dev (HMR).
 * `form-action` allows Stripe/Supabase-hosted redirect targets for billing/auth.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseOrigin = supabaseUrl ? new URL(supabaseUrl).origin : "";
const supabaseWs = supabaseOrigin.replace(/^http/, "ws"); // https→wss for realtime

const connectSrc = ["'self'", supabaseOrigin, supabaseWs].filter(Boolean).join(" ");
// Stripe Checkout / Customer Portal and Supabase auth are full-page redirects.
const formAction = ["'self'", "https://checkout.stripe.com", "https://billing.stripe.com"]
  .join(" ");

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  `form-action ${formAction}`,
  // The app serves only same-origin images (icon, generated OG image) plus
  // inline data:/blob: URIs — no remote origins — so we don't open img-src to
  // all HTTPS, which would otherwise permit pixel beaconing on an XSS.
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `connect-src ${connectSrc}`,
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework/version in response headers.
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
