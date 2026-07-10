"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CARDS, type HolyCard } from "@/data/cards";
import BibleReveal, { ClosedBible } from "./BibleReveal";

const STORAGE_KEY = "saintete-famille-drawn";
const TOTAL = CARDS.length;

type Phase = "reveal" | "bible";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function Experience() {
  const [phase, setPhase] = useState<Phase>("reveal");
  const [card, setCard] = useState<HolyCard | null>(null);
  const drawnRef = useRef<number[]>([]);
  const started = useRef(false);

  const draw = useCallback(() => {
    const prev = drawnRef.current;
    const exhausted = prev.length >= TOTAL;
    const base = exhausted ? [] : prev;
    const pool = CARDS.filter((c) => !base.includes(c.id));
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const next = [...base, pick.id];
    drawnRef.current = next;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* stockage indisponible */
    }
    setCard(pick);
    setPhase("reveal");
  }, []);

  /* au chargement / à l'actualisation : la Bible s'ouvre directement */
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) {
        drawnRef.current = saved.filter((n) => Number.isInteger(n));
      }
    } catch {
      /* première visite */
    }
    draw();
  }, [draw]);

  return (
    <main className="stage">
      <div className="grain" />
      <AnimatePresence mode="wait">
        {phase === "reveal" && card && (
          <BibleReveal
            key={`reveal-${card.id}-${drawnRef.current.length}`}
            card={card}
            onAnother={() => setPhase("bible")}
          />
        )}
        {phase === "bible" && <BibleWait key="bible" onOpen={draw} />}
      </AnimatePresence>
    </main>
  );
}

/* ------------------------- Bible fermée, en attente ------------------------ */

function BibleWait({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.section
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: easeOut }}
    >
      <motion.p
        className="eyebrow"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
        style={{ marginBottom: "clamp(28px, 6vh, 44px)" }}
      >
        La Parole
      </motion.p>

      <motion.button
        type="button"
        aria-label="Ouvrir la Bible pour recevoir une parole"
        className="bible-wait"
        onClick={onOpen}
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15, ease: easeOut }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
      >
        <ClosedBible />
      </motion.button>

      <motion.p
        className="hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      >
        Touche la Bible pour recevoir une parole
      </motion.p>
    </motion.section>
  );
}
