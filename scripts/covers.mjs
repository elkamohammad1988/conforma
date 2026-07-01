/**
 * Portfolio cover generator.
 *
 * Derives delivery-ready cover images (Upwork Project Catalog, Upwork Portfolio,
 * social/OG) purely by resizing EXISTING app screenshots from docs/screenshots —
 * no invented or mocked-up application screens. Run after `npm run screenshots`.
 *
 * Usage:  npm run covers
 * Output: docs/portfolio/covers/*.png
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SHOTS = path.resolve("docs/screenshots");
const OUT = path.resolve("docs/portfolio/covers");

/** Each cover is a straight downscale (optionally a top-anchored crop) of one real screenshot. */
const COVERS = [
  // Upwork Project Catalog thumbnail — 16:9, recommended 1280×720.
  { src: "landing-16x9.png",   out: "conforma-catalog-16x9.png",         w: 1280, h: 720, fit: "cover", position: "top" },
  { src: "dashboard-16x9.png", out: "conforma-catalog-dashboard-16x9.png", w: 1280, h: 720, fit: "cover", position: "top" },
  // Upwork Portfolio square thumbnails — 1:1, 1200×1200.
  { src: "landing-1x1.png",    out: "conforma-portfolio-1x1.png",        w: 1200, h: 1200, fit: "cover", position: "top" },
  { src: "dashboard-1x1.png",  out: "conforma-portfolio-dashboard-1x1.png", w: 1200, h: 1200, fit: "cover", position: "top" },
  // 4:3 catalog/portfolio alternative — 1200×900.
  { src: "dashboard-4x3.png",  out: "conforma-cover-4x3.png",            w: 1200, h: 900,  fit: "cover", position: "top" },
  // Social / OpenGraph share card — 1.91:1, 1200×630.
  { src: "landing-16x9.png",   out: "conforma-social-1200x630.png",      w: 1200, h: 630,  fit: "cover", position: "top" },
  // i18n showcase cover (Arabic RTL) — 16:9 1280×720.
  { src: "dashboard-ar-rtl.png", out: "conforma-i18n-arabic-16x9.png",   w: 1280, h: 720,  fit: "cover", position: "top" },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const c of COVERS) {
    const inPath = path.join(SHOTS, c.src);
    const outPath = path.join(OUT, c.out);
    await sharp(inPath)
      .resize(c.w, c.h, { fit: c.fit, position: c.position })
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    const meta = await sharp(outPath).metadata();
    console.log(`  ✓ ${c.out}  ${meta.width}×${meta.height}  (from ${c.src})`);
  }
  console.log(`✔ Done — ${COVERS.length} covers written to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
