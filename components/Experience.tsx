"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CARDS, type HolyCard } from "@/data/cards";
import { locateReference } from "@/data/bible";
import BibleReveal from "./BibleReveal";
import LightReveal from "./LightReveal";
import IntroFeast from "./IntroFeast";

const STORAGE_KEY = "saintete-famille-drawn";
const TOTAL = CARDS.length;

type Phase = "intro" | "reveal";

export default function Experience() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [card, setCard] = useState<HolyCard | null>(null);
  const drawnRef = useRef<number[]>([]);

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

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) {
        drawnRef.current = saved.filter((n) => Number.isInteger(n));
      }
    } catch {
      /* première visite */
    }
  }, []);

  return (
    <main className="stage">
      <div className="grain" />
      <AnimatePresence mode="wait">
        {phase === "intro" && <IntroFeast key="intro" onStart={() => draw()} />}
        {phase === "reveal" && card && (
          card.reference && locateReference(card.reference) ? (
            <BibleReveal
              key={`reveal-${card.id}-${drawnRef.current.length}`}
              card={card}
              onAnother={() => setPhase("intro")}
            />
          ) : (
            <LightReveal
              key={`reveal-${card.id}-${drawnRef.current.length}`}
              card={card}
              onAnother={() => setPhase("intro")}
            />
          )
        )}
      </AnimatePresence>
    </main>
  );
}
