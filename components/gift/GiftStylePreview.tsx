"use client";

import { motion } from "framer-motion";
import type { GiftStyleId } from "@/data/gifts";
import { PotFlower } from "../flowers";
import { HeartsFall } from "./GiftHearts";

/* Aperçus animés en boucle qui occupent toute la puce (plus de simple icône
 * dans un cadre) : c'est la carte — avec ses lignes de titre — qui se
 * transforme réellement d'un style à l'autre. */

const REPEAT = { repeat: Infinity, repeatDelay: 0.6 } as const;

function CardLines() {
  return (
    <>
      <span className="gsp-card-line gsp-card-line--1" />
      <span className="gsp-card-line gsp-card-line--2" />
    </>
  );
}

function EnvelopePreview({ color }: { color: string }) {
  return (
    <span className="gsp-envelope">
      <span className="gsp-envelope-shadow" />

      {/* pochette : rectangle kraft + plis diagonaux (comme une vraie enveloppe) */}
      <svg className="gsp-envelope-pocket" viewBox="0 0 152 118" aria-hidden>
        <defs>
          <linearGradient id="envKraft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f2e3bf" />
            <stop offset="1" stopColor="#c2986a" />
          </linearGradient>
        </defs>
        <rect x="5" y="16" width="142" height="98" rx="9" fill="url(#envKraft)" />
        <path d="M9 18 L76 64 L143 18" stroke="#9c774a" strokeWidth="1.6" fill="none" opacity="0.55" />
        <path d="M9 112 L76 70 L143 112" stroke="#9c774a" strokeWidth="1.6" fill="none" opacity="0.4" />
      </svg>

      {/* carte qui glisse et s'enfonce vraiment dans la pochette */}
      <motion.span
        className="gsp-card gsp-card-slide"
        style={{ background: color }}
        animate={{
          y: [-52, -52, 6, 6, -52],
          scale: [1, 1, 0.9, 0.9, 1],
          opacity: [1, 1, 1, 0, 1],
        }}
        transition={{ duration: 3.2, times: [0, 0.36, 0.56, 0.62, 1], ease: "easeInOut", ...REPEAT }}
      >
        <CardLines />
      </motion.span>

      {/* rabat : se replie sur la carte puis se scelle */}
      <motion.svg
        className="gsp-envelope-flap"
        viewBox="0 0 152 74"
        animate={{ rotateX: [-152, -152, 0, 0, -152] }}
        transition={{ duration: 3.2, times: [0, 0.3, 0.48, 0.86, 1], ease: "easeInOut", ...REPEAT }}
        aria-hidden
      >
        <defs>
          <linearGradient id="envFlap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e6cd98" />
            <stop offset="1" stopColor="#b18b57" />
          </linearGradient>
        </defs>
        <path d="M4 2 L148 2 L76 66 Z" fill="url(#envFlap)" />
      </motion.svg>

      <motion.span
        className="gsp-envelope-seal"
        animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.4, 0.4, 1, 1, 0.4] }}
        transition={{ duration: 3.2, times: [0, 0.48, 0.6, 0.84, 1], ease: "easeInOut", ...REPEAT }}
      />
    </span>
  );
}

function PlanePreview({ color }: { color: string }) {
  return (
    <>
      <motion.span
        className="gsp-card gsp-plane-shape"
        style={{ background: color }}
        animate={{
          clipPath: [
            "polygon(4% 6%, 96% 6%, 96% 94%, 4% 94%)",
            "polygon(4% 6%, 96% 6%, 96% 94%, 4% 94%)",
            "polygon(50% 0%, 98% 88%, 50% 62%, 2% 88%)",
            "polygon(50% 0%, 98% 88%, 50% 62%, 2% 88%)",
            "polygon(4% 6%, 96% 6%, 96% 94%, 4% 94%)",
          ],
          x: [0, 0, 0, 64, 0],
          y: [0, 0, 0, -48, 0],
          rotate: [0, 0, 0, -18, 0],
          opacity: [1, 1, 1, 0, 0],
        }}
        transition={{
          duration: 3.2,
          times: [0, 0.24, 0.4, 0.78, 1],
          ease: "easeInOut",
          ...REPEAT,
        }}
      >
        <CardLines />
      </motion.span>
      <motion.span
        className="gsp-plane-in"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0, 0, 1, 1, 0] }}
        transition={{ duration: 3.2, times: [0, 0.78, 0.8, 0.9, 0.94, 0.98, 1], ...REPEAT }}
      >
        <span className="gsp-card" style={{ background: color }}>
          <CardLines />
        </span>
      </motion.span>
    </>
  );
}

function FlowerPreview({ colorDeep }: { colorDeep: string }) {
  return (
    <>
      <motion.span
        className="gsp-flower-card"
        animate={{ opacity: [1, 1, 0, 0, 1], scale: [1, 1, 0.6, 0.6, 1] }}
        transition={{ duration: 3.2, times: [0, 0.3, 0.5, 0.85, 1], ease: "easeInOut", ...REPEAT }}
      >
        <span className="gsp-card" style={{ background: colorDeep }}>
          <CardLines />
        </span>
      </motion.span>
      <motion.span
        className="gsp-rose"
        initial={{ scale: 0, opacity: 0, rotate: -12 }}
        animate={{ scale: [0, 0, 1.1, 1.1, 0], opacity: [0, 0, 1, 1, 0], rotate: [-12, -12, 0, 0, 8] }}
        transition={{ duration: 3.2, times: [0, 0.34, 0.55, 0.85, 1], ease: "easeInOut", ...REPEAT }}
      >
        <PotFlower size={64} />
      </motion.span>
    </>
  );
}

const FLAMES = [
  { left: 14, h: 30, flicker: 1.05 },
  { left: 32, h: 42, flicker: 0.85 },
  { left: 50, h: 26, flicker: 1.2 },
  { left: 68, h: 38, flicker: 0.95 },
  { left: 86, h: 22, flicker: 1.1 },
];

function Flame({ left, h, flicker }: { left: number; h: number; flicker: number }) {
  return (
    <motion.span
      className="gsp-flame-track"
      style={{ left: `${left}%` }}
      animate={{ bottom: ["4%", "92%", "92%", "4%"], opacity: [1, 1, 0, 1] }}
      transition={{ duration: 3, times: [0, 0.62, 0.82, 1], ease: "easeInOut", ...REPEAT }}
    >
      <motion.svg
        viewBox="0 0 20 32"
        width={h * 0.62}
        height={h}
        style={{ overflow: "visible" }}
        animate={{ scaleY: [1, 1.14, 0.9, 1.05, 1], scaleX: [1, 0.92, 1.05, 0.95, 1] }}
        transition={{ duration: flicker, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      >
        <path d="M10 1C10 1 1 14 1 22a9 9 0 0 0 18 0C19 14 10 1 10 1Z" fill="#d3491f" />
        <path d="M10 9C10 9 4.5 17.5 4.5 23a5.5 5.5 0 0 0 11 0C15.5 17.5 10 9 10 9Z" fill="#f3902c" />
        <path d="M10 15C10 15 7.5 19.5 7.5 23a2.5 2.5 0 0 0 5 0C12.5 19.5 10 15 10 15Z" fill="#ffe08a" />
      </motion.svg>
    </motion.span>
  );
}

function BurningPreview({ color }: { color: string }) {
  return (
    <span className="gsp-burning">
      <motion.span
        className="gsp-burn-glow"
        animate={{ opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg className="gsp-burn-ash" viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden>
        <path
          d="M0,26 L0,13 L7,18 L14,7 L22,16 L30,5 L38,15 L46,4 L54,14 L62,6 L70,17 L78,8 L86,16 L93,9 L100,13 L100,26 Z"
          fill="#0c0805"
        />
      </svg>
      <motion.span
        className="gsp-card gsp-burn-card"
        style={{ background: color }}
        animate={{ clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)", "inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"] }}
        transition={{ duration: 3, times: [0, 0.62, 0.82, 1], ease: "easeInOut", ...REPEAT }}
      >
        <CardLines />
      </motion.span>
      {FLAMES.map((f, i) => (
        <Flame key={i} {...f} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="gsp-ember"
          style={{ left: `${20 + i * 20}%` }}
          animate={{ y: [0, -46, -62], x: [0, i % 2 ? 10 : -10, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 1.8, delay: i * 0.4, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </span>
  );
}

function ParchmentPreview() {
  return (
    <span className="gsp-parchment">
      <span className="gsp-parchment-shadow" />

      <motion.span
        className="gsp-parchment-sheet"
        animate={{ scaleX: [0.05, 0.05, 1, 1, 0.05] }}
        transition={{ duration: 3.4, times: [0, 0.26, 0.5, 0.82, 1], ease: "easeInOut", ...REPEAT }}
      >
        <svg viewBox="0 0 130 84" preserveAspectRatio="none" className="gsp-parchment-svg" aria-hidden>
          <defs>
            <linearGradient id="parchGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f5ecd2" />
              <stop offset="0.5" stopColor="#e6d19d" />
              <stop offset="1" stopColor="#cdaf76" />
            </linearGradient>
          </defs>
          <path
            d="M2,10 L11,3 L21,9 L31,2 L41,8 L51,3 L61,9 L69,3 L79,9 L89,2 L99,8 L109,3 L119,9 L128,4
               L128,74 L119,80 L109,75 L99,81 L89,75 L79,80 L69,76 L61,81 L51,75 L41,80 L31,76 L21,81 L11,77 L2,73 Z"
            fill="url(#parchGrad)"
            stroke="#a9855333"
            strokeWidth="0.8"
          />
          <ellipse cx="34" cy="26" rx="16" ry="10" fill="#b8935a" opacity="0.22" />
          <ellipse cx="92" cy="54" rx="18" ry="11" fill="#a9784a" opacity="0.2" />
          <ellipse cx="60" cy="14" rx="10" ry="5" fill="#c9a877" opacity="0.25" />
        </svg>
        <span className="gsp-card-line gsp-card-line--1 gsp-card-line--ink" />
        <span className="gsp-card-line gsp-card-line--2 gsp-card-line--ink" />
        <motion.span
          className="gsp-parchment-seal"
          animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.4, 0.4, 1, 1, 0.4] }}
          transition={{ duration: 3.4, times: [0, 0.52, 0.64, 0.8, 1], ease: "easeInOut", ...REPEAT }}
        />
      </motion.span>

      <motion.span
        className="gsp-parchment-roll gsp-parchment-roll--left"
        animate={{ x: [58, 58, 0, 0, 58] }}
        transition={{ duration: 3.4, times: [0, 0.26, 0.5, 0.82, 1], ease: "easeInOut", ...REPEAT }}
      >
        <motion.span
          className="gsp-parchment-roll-spin"
          animate={{ backgroundPositionY: ["0px", "-64px"] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
      </motion.span>
      <motion.span
        className="gsp-parchment-roll gsp-parchment-roll--right"
        animate={{ x: [-58, -58, 0, 0, -58] }}
        transition={{ duration: 3.4, times: [0, 0.26, 0.5, 0.82, 1], ease: "easeInOut", ...REPEAT }}
      >
        <motion.span
          className="gsp-parchment-roll-spin"
          animate={{ backgroundPositionY: ["0px", "64px"] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
        />
      </motion.span>
    </span>
  );
}

function HeartsPreview({ color }: { color: string }) {
  return (
    <span className="gsp-hearts">
      <HeartsFall />
      <motion.span
        className="gsp-hearts-card"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="gsp-card" style={{ background: color }}>
          <CardLines />
        </span>
      </motion.span>
    </span>
  );
}

export default function GiftStylePreview({
  id,
  color,
  colorDeep,
}: {
  id: GiftStyleId;
  color: string;
  colorDeep: string;
}) {
  switch (id) {
    case "envelope":
      return <EnvelopePreview color={colorDeep} />;
    case "plane":
      return <PlanePreview color={colorDeep} />;
    case "flower":
      return <FlowerPreview colorDeep={colorDeep} />;
    case "burning":
      return <BurningPreview color={colorDeep} />;
    case "parchment":
      return <ParchmentPreview />;
    case "hearts":
      return <HeartsPreview color={colorDeep} />;
  }
}
