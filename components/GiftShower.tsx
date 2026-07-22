"use client";

import { motion } from "framer-motion";

/* Pluie de petits cadeaux — remplace la pluie de pétales sur l'accueil. */

const GIFT_COLORS: Array<[string, string, string]> = [
  ["#a13a24", "#6b2415", "#c98a2e"], // boîte, ruban, nœud
  ["#c98a2e", "#8f4f26", "#e0ab52"],
  ["#8f4f26", "#6b2415", "#c98a2e"],
];

function GiftGlyph({ colors }: { colors: [string, string, string] }) {
  const [box, ribbon, bow] = colors;
  return (
    <svg viewBox="0 0 24 22" width="100%" height="100%" aria-hidden>
      <rect x="3" y="9" width="18" height="11" rx="1.4" fill={box} />
      <rect x="10" y="9" width="4" height="11" fill={ribbon} />
      <rect x="2" y="5.5" width="20" height="4" rx="1.4" fill={bow} />
      <rect x="10" y="5.5" width="4" height="4" fill={ribbon} />
      <path d="M12 5.5C12 2.5 9 1 7 2.2c-1.6 1-.8 3.4 5 3.3Z" fill={bow} />
      <path d="M12 5.5C12 2.5 15 1 17 2.2c1.6 1 .8 3.4-5 3.3Z" fill={ribbon} />
    </svg>
  );
}

const BURST = Array.from({ length: 40 }, (_, i) => {
  const ang = i * 137.5 * (Math.PI / 180);
  const R = 110 + (i % 9) * 46;
  return {
    dx: Math.cos(ang) * R,
    dy: Math.sin(ang) * R * 0.72 + 120 + (i % 7) * 46,
    rot: (i % 2 ? 1 : -1) * (110 + (i % 8) * 34),
    scale: 0.6 + (i % 5) * 0.12,
    dur: 2 + (i % 8) * 0.18,
    delay: (i % 12) * 0.04,
    size: 16 + (i % 5) * 6,
    colors: GIFT_COLORS[i % GIFT_COLORS.length],
  };
});

const AMBIENT = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 6.9 + (i % 4) * 7) % 100,
  drift: 18 + (i % 5) * 12,
  r0: i * 24,
  r1: i * 24 + (i % 2 ? 200 : -200),
  dur: 9 + (i % 6) * 1.6,
  delay: (i % 14) * 0.6,
  size: 14 + (i % 4) * 6,
  colors: GIFT_COLORS[i % GIFT_COLORS.length],
}));

export default function GiftShower() {
  return (
    <div className="petals" aria-hidden>
      {BURST.map((g, i) => (
        <motion.span
          key={`b${i}`}
          className="petal petal--burst"
          style={{ width: g.size, height: g.size }}
          initial={{ x: 0, y: 0, rotate: 0, scale: 0.2, opacity: 0 }}
          animate={{
            x: g.dx,
            y: g.dy,
            rotate: g.rot,
            scale: g.scale,
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: g.dur, delay: g.delay, ease: [0.16, 0.6, 0.3, 1] }}
        >
          <GiftGlyph colors={g.colors} />
        </motion.span>
      ))}

      {AMBIENT.map((g, i) => (
        <motion.span
          key={`a${i}`}
          className="petal"
          style={{ left: `${g.left}%`, width: g.size, height: g.size }}
          initial={{ y: "-12vh", rotate: g.r0, opacity: 0 }}
          animate={{
            y: "116vh",
            x: [0, g.drift, -g.drift, 0],
            rotate: [g.r0, g.r1],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            y: { duration: g.dur, delay: g.delay, repeat: Infinity, ease: "linear" },
            rotate: { duration: g.dur, delay: g.delay, repeat: Infinity, ease: "linear" },
            x: { duration: g.dur * 0.9, delay: g.delay, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: g.dur, delay: g.delay, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <GiftGlyph colors={g.colors} />
        </motion.span>
      ))}
    </div>
  );
}
