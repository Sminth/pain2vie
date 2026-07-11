"use client";

import { motion } from "framer-motion";

/* Pétales & roses — clin d'œil à la « pluie de roses » de sainte Thérèse. */

const PETAL_COLORS = ["#e7a9af", "#d97f89", "#c05b68", "#e4b7a4", "#b8414e"];

function Petal({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 30" width="100%" height="100%" aria-hidden>
      <path d="M12 1C19 7 20 19 12 29C4 19 5 7 12 1Z" fill={color} />
      <path
        d="M12 4C12 12 12 21 12 27"
        stroke="rgba(255,255,255,0.42)"
        strokeWidth="0.7"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* explosion depuis le centre au chargement */
const BURST = Array.from({ length: 18 }, (_, i) => {
  const ang = (i / 18) * Math.PI * 2;
  const spread = 120 + (i % 5) * 30;
  return {
    dx: Math.cos(ang) * spread,
    dy: Math.sin(ang) * 80 + 150 + (i % 4) * 46,
    rot: (i % 2 ? 1 : -1) * (140 + i * 12),
    scale: 0.7 + (i % 5) * 0.12,
    dur: 1.9 + (i % 6) * 0.24,
    delay: (i % 9) * 0.045,
    size: 16 + (i % 5) * 5,
    color: PETAL_COLORS[i % PETAL_COLORS.length],
  };
});

/* pétales qui tombent doucement en continu */
const AMBIENT = Array.from({ length: 11 }, (_, i) => ({
  left: (i * 9 + (i % 3) * 5) % 100,
  drift: 22 + (i % 4) * 16,
  r0: i * 26,
  r1: i * 26 + (i % 2 ? 220 : -220),
  dur: 9 + (i % 5) * 1.7,
  delay: (i % 11) * 0.9,
  size: 13 + (i % 4) * 6,
  color: PETAL_COLORS[i % PETAL_COLORS.length],
}));

export default function RosePetals() {
  return (
    <div className="petals" aria-hidden>
      {BURST.map((p, i) => (
        <motion.span
          key={`b${i}`}
          className="petal petal--burst"
          style={{ width: p.size, height: p.size * 1.25 }}
          initial={{ x: 0, y: 0, rotate: 0, scale: 0.3, opacity: 0 }}
          animate={{
            x: p.dx,
            y: p.dy,
            rotate: p.rot,
            scale: p.scale,
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: p.dur, delay: p.delay, ease: "easeOut" }}
        >
          <Petal color={p.color} />
        </motion.span>
      ))}

      {AMBIENT.map((p, i) => (
        <motion.span
          key={`a${i}`}
          className="petal"
          style={{ left: `${p.left}%`, width: p.size, height: p.size * 1.25 }}
          initial={{ y: "-12vh", rotate: p.r0, opacity: 0 }}
          animate={{
            y: "116vh",
            x: [0, p.drift, -p.drift, 0],
            rotate: [p.r0, p.r1],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{
            y: { duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" },
            rotate: { duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear" },
            x: { duration: p.dur * 0.9, delay: p.delay, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Petal color={p.color} />
        </motion.span>
      ))}
    </div>
  );
}

/* petite rose + feuilles, motif de coin des cartes et de la page */
export function RoseSprig({ size = 70 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 90 90" fill="none" aria-hidden>
      <path
        d="M46 88C46 66 40 52 33 42"
        stroke="#8ea36a"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M36 60C25 58 18 49 20 40C31 41 38 49 36 60Z" fill="#9cb87a" />
      <path d="M46 50C57 49 64 40 62 31C51 32 45 40 46 50Z" fill="#8ea36a" />
      <circle cx="33" cy="29" r="15" fill="#e7a9af" />
      <circle cx="33" cy="29" r="9.5" fill="#d4747f" />
      <circle cx="33" cy="29" r="4.5" fill="#b8414e" />
    </svg>
  );
}

/* deux roses en coin, en filigrane — à poser dans une carte `position: relative` */
export function CornerFlora() {
  return (
    <>
      <span className="flora flora--tl" aria-hidden>
        <RoseSprig />
      </span>
      <span className="flora flora--br" aria-hidden>
        <RoseSprig />
      </span>
    </>
  );
}
