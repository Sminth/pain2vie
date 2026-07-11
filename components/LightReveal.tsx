"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { HolyCard } from "@/data/cards";
import { ChapelOrnament } from "./icons";
import ParoleOutcome from "./ParoleOutcome";

const easeOut = [0.22, 1, 0.36, 1] as const;

/* Révélation « lumineuse » pour les paroles qui ne sont pas des versets
 * bibliques (pape, saints, magistère) : pas de Bible, une apparition de
 * lumière puis la carte de la parole. */
export default function LightReveal({
  card,
  onAnother,
}: {
  card: HolyCard;
  onAnother: () => void;
}) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.section
      className="scene light-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.45, ease: easeOut }}
    >
      <div className="light-stage">
        <motion.div
          className="light-rays"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: revealed ? 0.35 : 0.6, scale: 1, rotate: 360 }}
          transition={{
            opacity: { duration: 1.4, ease: easeOut },
            scale: { duration: 1.6, ease: easeOut },
            rotate: { duration: 48, repeat: Infinity, ease: "linear" },
          }}
        />
        <motion.div
          className="light-bloom"
          initial={{ scale: 0.15, opacity: 0 }}
          animate={{ scale: 1, opacity: revealed ? 0.7 : 1 }}
          transition={{ duration: 1.5, ease: easeOut }}
        />
        <AnimatePresence>
          {!revealed && (
            <motion.div
              className="light-ornament"
              initial={{ opacity: 0, scale: 0.7, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.25, filter: "blur(4px)" }}
              transition={{ duration: 1, ease: easeOut }}
            >
              <ChapelOrnament size={66} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {revealed && <ParoleOutcome card={card} onAnother={onAnother} />}
    </motion.section>
  );
}
