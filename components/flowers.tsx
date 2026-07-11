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

/* petite fleur (rose de face) — pour mêler de vraies fleurs aux pétales */
function Blossom({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="20"
          cy="11"
          rx="6.2"
          ry="9.4"
          fill={color}
          transform={`rotate(${a} 20 20)`}
        />
      ))}
      <circle cx="20" cy="20" r="4.6" fill="#e6b463" />
    </svg>
  );
}

/* grosse explosion de pétales & fleurs depuis le centre au chargement */
const BURST = Array.from({ length: 64 }, (_, i) => {
  const ang = i * 137.5 * (Math.PI / 180); // angle d'or → répartition régulière
  const R = 120 + (i % 11) * 52; // jusqu'à ~640px, remplit l'écran
  const kind = i % 4 === 0 ? "blossom" : "petal";
  return {
    kind,
    dx: Math.cos(ang) * R,
    dy: Math.sin(ang) * R * 0.72 + 130 + (i % 7) * 54,
    rot: (i % 2 ? 1 : -1) * (140 + (i % 9) * 46),
    scale: 0.7 + (i % 6) * 0.13,
    dur: 2 + (i % 8) * 0.18,
    delay: (i % 14) * 0.035,
    size: kind === "blossom" ? 26 + (i % 5) * 6 : 15 + (i % 6) * 5,
    color: PETAL_COLORS[i % PETAL_COLORS.length],
  };
});

/* pétales qui tombent doucement en continu */
const AMBIENT = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 5.7 + (i % 4) * 6) % 100,
  drift: 22 + (i % 5) * 15,
  r0: i * 26,
  r1: i * 26 + (i % 2 ? 220 : -220),
  dur: 8 + (i % 6) * 1.6,
  delay: (i % 18) * 0.55,
  size: 13 + (i % 4) * 6,
  kind: i % 5 === 0 ? "blossom" : "petal",
  color: PETAL_COLORS[i % PETAL_COLORS.length],
}));

export default function RosePetals() {
  return (
    <div className="petals" aria-hidden>
      {BURST.map((p, i) => (
        <motion.span
          key={`b${i}`}
          className="petal petal--burst"
          style={{ width: p.size, height: p.size * (p.kind === "blossom" ? 1 : 1.25) }}
          initial={{ x: 0, y: 0, rotate: 0, scale: 0.2, opacity: 0 }}
          animate={{
            x: p.dx,
            y: p.dy,
            rotate: p.rot,
            scale: p.scale,
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: p.dur, delay: p.delay, ease: [0.16, 0.6, 0.3, 1] }}
        >
          {p.kind === "blossom" ? <Blossom color={p.color} /> : <Petal color={p.color} />}
        </motion.span>
      ))}

      {AMBIENT.map((p, i) => (
        <motion.span
          key={`a${i}`}
          className="petal"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * (p.kind === "blossom" ? 1 : 1.25),
          }}
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
          {p.kind === "blossom" ? <Blossom color={p.color} /> : <Petal color={p.color} />}
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
