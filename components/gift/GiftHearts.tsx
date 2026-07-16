"use client";

import { motion } from "framer-motion";

const HEART_D =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z";

const HEART_COLORS = ["#e7a9af", "#d97f89", "#c05b68", "#b8414e", "#8a2535"];

function HeartGlyph({ size, color }: { size: number; color: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path d={HEART_D} fill={color} />
    </svg>
  );
}

/* pluie de cœurs en continu — utilisée pour l'aperçu de puce : beaucoup de
 * cœurs qui tombent et dérivent, sans fin. */
const AMBIENT_HEARTS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 7.3 + (i % 3) * 11) % 100,
  size: 10 + (i % 5) * 4,
  dur: 3.2 + (i % 6) * 0.6,
  delay: (i % 14) * 0.28,
  drift: 12 + (i % 4) * 8,
  color: HEART_COLORS[i % HEART_COLORS.length],
}));

export function HeartsFall() {
  return (
    <>
      {AMBIENT_HEARTS.map((h, i) => (
        <motion.span
          key={i}
          className="ghearts-drop"
          style={{ left: `${h.left}%`, width: h.size, height: h.size }}
          initial={{ top: "-16%", opacity: 0, rotate: 0 }}
          animate={{
            top: "112%",
            x: [0, h.drift, -h.drift, 0],
            rotate: [0, 18, -14, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            top: { duration: h.dur, delay: h.delay, repeat: Infinity, ease: "linear" },
            x: { duration: h.dur * 0.9, delay: h.delay, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: h.dur, delay: h.delay, repeat: Infinity, ease: "linear" },
            opacity: { duration: h.dur, delay: h.delay, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <HeartGlyph size={h.size} color={h.color} />
        </motion.span>
      ))}
    </>
  );
}

/* éclat de cœurs qui jaillissent depuis le centre, une fois — utilisé dans
 * les animations d'envoi / réception. */
const BURST_HEARTS = Array.from({ length: 18 }, (_, i) => {
  const ang = i * 137.5 * (Math.PI / 180);
  const R = 44 + (i % 5) * 24;
  return {
    dx: Math.cos(ang) * R,
    dy: Math.sin(ang) * R * 0.8 - 12,
    size: 10 + (i % 4) * 6,
    delay: (i % 9) * 0.045,
    dur: 1.15 + (i % 5) * 0.16,
    color: HEART_COLORS[i % HEART_COLORS.length],
  };
});

export function HeartsBurst() {
  return (
    <>
      {BURST_HEARTS.map((h, i) => (
        <motion.span
          key={i}
          className="ghearts-burst"
          style={{ width: h.size, height: h.size, marginLeft: -h.size / 2, marginTop: -h.size / 2 }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
          animate={{ x: h.dx, y: h.dy, opacity: [0, 1, 0], scale: 1 }}
          transition={{ duration: h.dur, delay: h.delay, ease: "easeOut" }}
        >
          <HeartGlyph size={h.size} color={h.color} />
        </motion.span>
      ))}
    </>
  );
}
