import { ImageResponse } from "next/og";
import { getServerLocale } from "@/i18n/server";
import { getMessages } from "@/i18n/messages";

export const alt = "Conforma — EU AI Act compliance, automated";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><defs><linearGradient id="g" x1="5" y1="4" x2="27" y2="28" gradientUnits="userSpaceOnUse"><stop stop-color="#ff6b74"/><stop offset="1" stop-color="#cf1622"/></linearGradient></defs><path d="M22 5.6 L10 5.6 L4 16 L10 26.4 L22 26.4" fill="none" stroke="url(#g)" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 11.7 L20.3 16 L16 20.3 L11.7 16 Z" fill="url(#g)"/></svg>`;
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
          background: "#0a0a0e",
          backgroundImage:
            "radial-gradient(820px 460px at 76% -14%, rgba(225,29,42,0.3), transparent 66%), radial-gradient(680px 520px at 4% 112%, rgba(120,8,16,0.24), transparent 64%)",
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
              color: "#ffffff",
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
              color: "#f5f4f8",
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
              color: "#aeadb8",
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
              background: "rgba(225,29,42,0.15)",
              border: "1px solid rgba(225,29,42,0.42)",
              borderRadius: 999,
              padding: "10px 22px",
              color: "#ff9aa0",
              fontSize: 26,
              fontWeight: 600,
            }}
          >
            {m.badge}
          </div>
          <div style={{ marginInlineStart: "auto", color: "#8a8993", fontSize: 24 }}>
            {m.regulation}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
