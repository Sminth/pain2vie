"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1] as const;

/* Boîte-cadeau animée, posée en flottant sur l'accueil : point d'entrée du
 * parcours « envoyer un cadeau » (thème → message → style d'envoi → lien). */
export default function GiftTrigger() {
  return (
    <Link href="/cadeau" className="gift-trigger" aria-label="Envoyer un cadeau">
      <motion.span
        className="gift-trigger-glow"
        animate={{ opacity: [0.35, 0.6, 0.35], scale: [0.92, 1.08, 0.92] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.svg
        className="gift-trigger-box"
        viewBox="0 0 64 56"
        width="76"
        height="66"
        aria-hidden
        initial={{ rotate: -3 }}
        animate={{ rotate: [-3, 3, -3], y: [0, -3, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="6" y="24" width="52" height="28" rx="3" fill="#c05b68" />
        <rect x="6" y="24" width="52" height="28" rx="3" fill="url(#giftShade)" />
        <rect x="27" y="24" width="10" height="28" fill="#8a2535" />
        <motion.g
          style={{ originX: "32px", originY: "18px" }}
          animate={{ rotate: [0, -6, 0, 4, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
        >
          <rect x="3" y="14" width="58" height="11" rx="3" fill="#d4747f" />
          <rect x="27" y="14" width="10" height="11" fill="#b8414e" />
          <path
            d="M32 14C32 6 24 2 19 5c-4 2.4-2 9 13 9Z"
            fill="#e7a9af"
          />
          <path
            d="M32 14C32 6 40 2 45 5c4 2.4 2 9-13 9Z"
            fill="#d4747f"
          />
        </motion.g>
        <defs>
          <linearGradient id="giftShade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
            <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </motion.svg>
      <motion.span
        className="gift-trigger-label"
        initial={{ opacity: 0.9 }}
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        Envoyer un cadeau
      </motion.span>
    </Link>
  );
}
