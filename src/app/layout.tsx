import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";
import { SiteChrome } from "@/components/SiteChrome";
import { Backdrop } from "@/components/Backdrop";
import { ToastProvider } from "@/components/ui/Toast";
import { AiModeProvider } from "@/components/AiModeProvider";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getServerI18n } from "@/i18n/server";
import { LOCALE_META, LOCALES } from "@/i18n/config";
import { aiMode } from "@/lib/claude";
import { SITE_URL as siteUrl, AUTHOR } from "@/lib/site";
import "./globals.css";

// One Latin typeface, used with discipline. Geist is a premium grotesque; the
// hierarchy comes from size, weight and tracking — not from a second font.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Arabic gets a dedicated, self-hosted face so RTL text is rendered with proper
// shaping and weight — not a Latin font's fallback glyphs. (CJK uses a system
// stack defined in globals.css to avoid shipping a multi-megabyte webfont.)
const notoArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { t, locale } = await getServerI18n();

  // hreflang: cookie-based i18n serves every language from the same URL, so we
  // advertise the canonical root for each and let `og:locale` carry the active one.
  const languages = Object.fromEntries(
    LOCALES.map((l) => [LOCALE_META[l].intlLocale, "/"]),
  );

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("metadata.root.titleDefault"),
      template: t("metadata.root.titleTemplate"),
    },
    description: t("metadata.root.description"),
    applicationName: "Conforma",
    authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
    creator: AUTHOR.name,
    alternates: { canonical: "/", languages },
    openGraph: {
      title: t("metadata.root.ogTitle"),
      description: t("metadata.root.ogDescription"),
      type: "website",
      siteName: "Conforma",
      locale: LOCALE_META[locale].ogLocale,
      alternateLocale: LOCALES.filter((l) => l !== locale).map(
        (l) => LOCALE_META[l].ogLocale,
      ),
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata.root.twitterTitle"),
      description: t("metadata.root.twitterDescription"),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { t, locale } = await getServerI18n();
  const dir = LOCALE_META[locale].dir;

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Conforma",
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    description: t("metadata.root.ogDescription"),
    founder: {
      "@type": "Person",
      name: AUTHOR.name,
      url: AUTHOR.url,
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@conforma.eu",
      contactType: "sales",
    },
  };

  return (
    <html
      lang={locale}
      dir={dir}
      // The pre-paint theme script sets `data-theme` on <html> before React
      // hydrates, so this element's attributes legitimately differ from the
      // server HTML. Scope the suppression to <html> only (it does not cascade).
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoArabic.variable} h-full`}
    >
      <body className="flex min-h-full flex-col text-ink antialiased">
        {/* Paint the saved / preferred theme before first paint — no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var k='conforma.theme',s=localStorage.getItem(k);document.documentElement.dataset.theme=(s==='light'||s==='dark')?s:'dark';}catch(e){document.documentElement.dataset.theme='dark';}})();",
          }}
        />
        <Backdrop />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationLd).replace(/</g, "\\u003c"),
          }}
        />
        <I18nProvider initialLocale={locale}>
          <AiModeProvider initialMode={aiMode()}>
          <ToastProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-accent focus:shadow-lg"
            >
              {t("nav.skipToContent")}
            </a>
            <SiteChrome>{children}</SiteChrome>
          </ToastProvider>
          </AiModeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
