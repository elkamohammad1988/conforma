/**
 * The environment. A single, fixed, non-interactive layer that sits behind all
 * content and gives the product its cinematic depth: volumetric crimson light
 * pools that drift, a faint engineering grid that fades toward the edges, a
 * scatter of glowing particles, and a film grain over everything. Pure CSS —
 * no canvas, no JS — so it costs nothing and respects reduced-motion.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E\")";

const PARTICLES = [
  { top: "18%", left: "12%", d: "0s" },
  { top: "30%", left: "82%", d: "1.2s" },
  { top: "62%", left: "24%", d: "2.1s" },
  { top: "48%", left: "67%", d: "0.6s" },
  { top: "76%", left: "88%", d: "3s" },
  { top: "12%", left: "54%", d: "1.8s" },
];

export function Backdrop() {
  return (
    <div aria-hidden className="backdrop-layer pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Volumetric light pools — slow drift */}
      <div
        className="animate-drift absolute -top-48 h-[46rem] w-[46rem] rounded-full"
        style={{
          insetInlineEnd: "-12%",
          background:
            "radial-gradient(closest-side, rgba(225,29,42,0.22), transparent 70%)",
          filter: "blur(36px)",
        }}
      />
      <div
        className="animate-drift absolute h-[42rem] w-[42rem] rounded-full"
        style={{
          bottom: "-22%",
          insetInlineStart: "-14%",
          background:
            "radial-gradient(closest-side, rgba(225,29,42,0.12), transparent 70%)",
          filter: "blur(48px)",
          animationDelay: "4s",
        }}
      />
      <div
        className="animate-drift absolute left-1/2 top-1/3 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(120,8,16,0.16), transparent 70%)",
          filter: "blur(60px)",
          animationDelay: "2s",
        }}
      />

      {/* Engineering grid, masked to fade toward the edges */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px)",
          backgroundSize: "58px 58px",
          maskImage:
            "radial-gradient(125% 85% at 50% -5%, #000 28%, transparent 76%)",
          WebkitMaskImage:
            "radial-gradient(125% 85% at 50% -5%, #000 28%, transparent 76%)",
        }}
      />

      {/* Glowing particles */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="animate-pulse-glow absolute h-[3px] w-[3px] rounded-full"
          style={{
            top: p.top,
            left: p.left,
            animationDelay: p.d,
            background: "rgba(255,120,128,0.9)",
            boxShadow: "0 0 8px 1px rgba(225,29,42,0.7)",
          }}
        />
      ))}

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-60 mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
    </div>
  );
}
