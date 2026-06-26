import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Logo, LogoMark } from "@/components/Logo";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { MobileNav } from "@/components/MobileNav";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://conforma.eu";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Conforma — EU AI Act compliance, automated",
    template: "%s · Conforma",
  },
  description:
    "Conforma is the compliance platform for the EU AI Act. Inventory your AI systems, auto-classify their risk with cited Articles, close obligation gaps, and generate audit-ready documentation before the August 2026 deadline.",
  applicationName: "Conforma",
  keywords: [
    "EU AI Act",
    "AI compliance software",
    "AI governance platform",
    "Regulation 2024/1689",
    "high-risk AI",
    "conformity assessment",
    "AI risk management",
    "ISO 42001",
  ],
  authors: [{ name: "Conforma" }],
  openGraph: {
    title: "Conforma — EU AI Act compliance, automated",
    description:
      "Auto-classify your AI systems, close obligation gaps, and generate audit-ready documentation before the EU AI Act's August 2026 deadline.",
    type: "website",
    siteName: "Conforma",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Conforma — EU AI Act compliance, automated",
    description:
      "The compliance platform for the EU AI Act. Classify, close gaps, and generate documentation before August 2026.",
  },
};

const NAV = [
  { href: "/#how", label: "How it works" },
  { href: "/security", label: "Security" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
];

function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur print:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-1 text-sm font-medium text-slate-600 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/demo"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 sm:inline-block"
          >
            Book a demo
          </Link>
          <Link
            href="/classify"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Start free
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

const FRAMEWORKS = ["EU AI Act", "GDPR", "ISO/IEC 42001", "NIST AI RMF"];

function SiteFooter() {
  const cols: { title: string; links: { href: string; label: string }[] }[] = [
    {
      title: "Product",
      links: [
        { href: "/classify", label: "Risk classifier" },
        { href: "/dashboard", label: "AI registry" },
        { href: "/pricing", label: "Pricing" },
        { href: "/demo", label: "Book a demo" },
      ],
    },
    {
      title: "Trust",
      links: [
        { href: "/security", label: "Security" },
        { href: "/security#privacy", label: "Data residency" },
        { href: "/security#subprocessors", label: "Sub-processors" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/#how", label: "How it works" },
        { href: "/#faq", label: "FAQ" },
        { href: "/demo", label: "Contact sales" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/terms", label: "Terms of Service" },
        { href: "/privacy", label: "Privacy Policy" },
        { href: "/security#privacy", label: "Data Processing" },
      ],
    },
  ];
  return (
    <footer className="border-t border-slate-200 bg-slate-50 print:hidden">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-7 w-7" />
              <span className="text-lg font-semibold tracking-tight">Conforma</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              The compliance platform for the EU AI Act. Classify, close gaps, and
              prove conformity — without a compliance team.
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {FRAMEWORKS.map((f) => (
                <span
                  key={f}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-500"
                >
                  {f}
                </span>
              ))}
            </div>
            <a
              href="mailto:hello@conforma.eu"
              className="mt-4 inline-block text-sm font-medium text-brand-700 hover:underline"
            >
              hello@conforma.eu
            </a>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {c.title}
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {c.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link href={l.href} className="hover:text-brand-700">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Conforma. All rights reserved.</p>
          <p className="max-w-md leading-relaxed">
            Decision-support tooling for Regulation (EU) 2024/1689 — not legal
            advice. Confirm classifications with qualified counsel.
          </p>
        </div>
      </div>
    </footer>
  );
}

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Conforma",
  url: siteUrl,
  logo: `${siteUrl}/icon.svg`,
  description:
    "The compliance platform for the EU AI Act — classify AI systems, close obligation gaps, and generate audit-ready documentation.",
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@conforma.eu",
    contactType: "sales",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-white text-slate-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <AnnouncementBar />
        <TopNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
