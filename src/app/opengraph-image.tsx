import { ImageResponse } from "next/og";
import { getServerLocale } from "@/i18n/server";
import { getMessages } from "@/i18n/messages";

export const alt = "Conforma — EU AI Act compliance, automated";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="0" y1="0" x2="32" y2="32"><stop offset="0" stop-color="#6a72e6"/><stop offset="1" stop-color="#4f57d4"/></linearGradient></defs><rect width="32" height="32" rx="7" fill="url(#g)"/><path d="M9.5 16.4 14 20.6l8.5-8.8" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const markUri = `data:image/svg+xml;utf8,${encodeURIComponent(markSvg)}`;

export default async function OpengraphImage() {
  const locale = await getServerLocale();
  // The default OG font can't shape Arabic / CJK; fall back to the Latin copy
  // for those locales to avoid rendering missing-glyph boxes in the share card.
  const useLatin = locale === "ar" || locale === "zh-CN";
  const m = getMessages(useLatin ? "en" : locale).og;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c0c0f",
          backgroundImage:
            "radial-gradient(800px 420px at 70% -15%, rgba(94,102,224,0.22), transparent 70%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
        dir={dir}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markUri} width={64} height={64} alt="" />
          <div
            style={{
              marginInlineStart: 20,
              color: "white",
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            Conforma
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "white",
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 920,
            }}
          >
            {m.title}
          </div>
          <div
            style={{
              marginTop: 28,
              color: "#cbd5e1",
              fontSize: 30,
              maxWidth: 880,
              lineHeight: 1.3,
            }}
          >
            {m.subtitle}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 999,
              padding: "10px 22px",
              color: "#fcd34d",
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            {m.badge}
          </div>
          <div style={{ marginInlineStart: "auto", color: "#94a3b8", fontSize: 24 }}>
            {m.regulation}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
