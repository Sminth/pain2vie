"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { CARDS, type HolyCard } from "@/data/cards";
import { CardIconGlyph, ChapelOrnament, Divider } from "./icons";

const STORAGE_KEY = "saintete-famille-drawn";
const TOTAL = CARDS.length;

type Phase = "intro" | "deck" | "card";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function Experience() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [drawn, setDrawn] = useState<number[]>([]);
  const [card, setCard] = useState<HolyCard | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) setDrawn(saved.filter((n) => Number.isInteger(n)));
    } catch {
      /* première visite */
    }
  }, []);

  const draw = useCallback(() => {
    setDrawn((prev) => {
      const exhausted = prev.length >= TOTAL;
      const base = exhausted ? [] : prev;
      const pool = CARDS.filter((c) => !base.includes(c.id));
      const pick = pool[Math.floor(Math.random() * pool.length)];
      const next = [...base, pick.id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* stockage indisponible */
      }
      setCard(pick);
      return next;
    });
    setPhase("card");
  }, []);

  return (
    <main className="stage">
      <div className="grain" />
      <AnimatePresence mode="wait">
        {phase === "intro" && <Intro key="intro" onStart={() => setPhase("deck")} />}
        {phase === "deck" && (
          <Deck key="deck" onDraw={draw} drawnCount={drawn.length} />
        )}
        {phase === "card" && card && (
          <RevealedCard
            key={`card-${card.id}-${drawn.length}`}
            card={card}
            index={drawn.length}
            onDraw={draw}
            onBack={() => setPhase("deck")}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

/* ---------------------------------- intro --------------------------------- */

function Intro({ onStart }: { onStart: () => void }) {
  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 26, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.9, delay: 0.25 + i * 0.18, ease: easeOut },
  });

  return (
    <motion.section
      className="scene"
      exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
      transition={{ duration: 0.55, ease: easeOut }}
    >
      <motion.div className="ornament" {...stagger(0)}>
        <ChapelOrnament />
      </motion.div>
      <motion.p className="eyebrow" {...stagger(1)}>
        Fête des saints Louis et Zélie Martin
      </motion.p>
      <motion.h1 className="title" {...stagger(2)}>
        La sainteté
        <br />
        de la famille
      </motion.h1>
      <motion.p className="lede" {...stagger(3)}>
        Elle commence à la maison. Pioche une carte&nbsp;: reçois une parole à
        méditer, et un défi à vivre aujourd’hui.
      </motion.p>
      <motion.button className="cta" onClick={onStart} {...stagger(4)}>
        Ouvrir le paquet
      </motion.button>
    </motion.section>
  );
}

/* ---------------------------------- pioche -------------------------------- */

const DECK_LAYERS = [
  { r: -8, x: -14, y: 10 },
  { r: 5, x: 10, y: 6 },
  { r: -3, x: -5, y: 3 },
  { r: 2, x: 6, y: 1 },
  { r: 0, x: 0, y: 0 },
];

function CardBack() {
  return (
    <div className="card-back-design">
      <span style={{ color: "#d4b96a" }}>
        <ChapelOrnament size={64} />
      </span>
    </div>
  );
}

function Deck({ onDraw, drawnCount }: { onDraw: () => void; drawnCount: number }) {
  const [shuffling, setShuffling] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const handleDraw = () => {
    if (shuffling) return;
    setShuffling(true);
    timer.current = setTimeout(onDraw, 750);
  };

  return (
    <motion.section
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: easeOut }}
    >
      <motion.p
        className="eyebrow"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: easeOut }}
        style={{ marginBottom: 44 }}
      >
        La pioche
      </motion.p>

      <motion.div
        role="button"
        aria-label="Piocher une carte"
        className="deck-wrap"
        onClick={handleDraw}
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: easeOut }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <motion.div
          style={{ position: "absolute", inset: 0 }}
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {DECK_LAYERS.map((l, i) => {
            const top = i === DECK_LAYERS.length - 1;
            return (
              <motion.div
                key={i}
                style={{ position: "absolute", inset: 0 }}
                initial={false}
                animate={
                  shuffling
                    ? top
                      ? { y: -170, rotate: 8, scale: 1.06, opacity: 0 }
                      : {
                          rotate: [l.r, l.r + (i % 2 ? 10 : -10), l.r],
                          x: [l.x, l.x + (i % 2 ? 16 : -16), l.x],
                        }
                    : { rotate: l.r, x: l.x, y: l.y }
                }
                transition={
                  shuffling && top
                    ? { duration: 0.55, delay: 0.25, ease: easeOut }
                    : { duration: 0.55, ease: easeOut }
                }
              >
                <CardBack />
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      <motion.p
        className="hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        Touche le paquet pour piocher
      </motion.p>

      <p className="counter">
        {drawnCount === 0
          ? `${TOTAL} cartes t’attendent`
          : drawnCount >= TOTAL
            ? "Tu as reçu les 30 paroles — le paquet est remélangé"
            : `${drawnCount} carte${drawnCount > 1 ? "s" : ""} reçue${drawnCount > 1 ? "s" : ""} sur ${TOTAL}`}
      </p>
    </motion.section>
  );
}

/* ------------------------------ carte révélée ------------------------------ */

function RevealedCard({
  card,
  index,
  onDraw,
  onBack,
}: {
  card: HolyCard;
  index: number;
  onDraw: () => void;
  onBack: () => void;
}) {
  const [rot, setRot] = useState(0);
  const [rearContent, setRearContent] = useState<"back" | "verso">("back");
  const revealed = rot >= 180;
  const showingRecto = revealed && (rot / 180) % 2 === 1;

  /* révélation automatique après l'arrivée de la carte */
  useEffect(() => {
    const t = setTimeout(() => setRot(180), 550);
    return () => clearTimeout(t);
  }, []);

  /* inclinaison douce qui suit le doigt / la souris */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 140,
    damping: 18,
  });
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), {
    stiffness: 140,
    damping: 18,
  });
  const glossRef = useRef<HTMLDivElement>(null);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px - 0.5);
    my.set(py - 0.5);
    glossRef.current?.style.setProperty("--gx", `${px * 100}%`);
    glossRef.current?.style.setProperty("--gy", `${py * 100}%`);
  };

  const resetTilt = () => {
    mx.set(0);
    my.set(0);
  };

  const flip = () => setRot((r) => r + 180);

  return (
    <motion.section
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
      transition={{ duration: 0.45, ease: easeOut }}
    >
      <motion.div
        className="card-scene"
        initial={{ y: 90, scale: 0.72, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: easeOut }}
        onPointerMove={onPointerMove}
        onPointerLeave={resetTilt}
      >
        <motion.div
          style={{ width: "100%", height: "100%", rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
        >
          <motion.div
            className="card-3d"
            onClick={flip}
            animate={{ rotateY: rot }}
            transition={{ duration: 0.9, ease: easeOut }}
            onAnimationComplete={() => {
              if (rot >= 180 && rearContent === "back") setRearContent("verso");
            }}
          >
            {/* face arrière (0°) : dos du paquet, puis défi une fois cachée */}
            <div className="card-face">
              {rearContent === "back" ? (
                <div className="card-back-design" style={{ inset: 0, borderRadius: 20 }}>
                  <span style={{ color: "#d4b96a" }}>
                    <ChapelOrnament size={64} />
                  </span>
                </div>
              ) : (
                <VersoFace card={card} />
              )}
            </div>

            {/* face avant (180°) : la parole */}
            <div className="card-face" style={{ transform: "rotateY(180deg)" }}>
              <RectoFace card={card} />
            </div>

            <div ref={glossRef} className="gloss" />
          </motion.div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {revealed && (
          <motion.p
            key={showingRecto ? "hint-recto" : "hint-verso"}
            className="tap-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {showingRecto
              ? "Touche la carte pour découvrir ton défi"
              : "Touche la carte pour relire la parole"}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div
        className="card-actions"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.6, ease: easeOut }}
      >
        <button className="ghost" onClick={onBack}>
          Le paquet
        </button>
        <button className="ghost" onClick={onDraw}>
          Piocher encore
        </button>
      </motion.div>

      <p className="counter">
        Carte {index} sur {TOTAL}
      </p>
    </motion.section>
  );
}

function RectoFace({ card }: { card: HolyCard }) {
  return (
    <>
      <p className="face-label">Parole</p>
      <p className="quote">«&nbsp;{card.quote}&nbsp;»</p>
      {card.reference && <p className="reference">{card.reference}</p>}
      <Divider />
    </>
  );
}

function VersoFace({ card }: { card: HolyCard }) {
  return (
    <>
      <span className="ornament" style={{ color: "var(--wine)" }}>
        <CardIconGlyph icon={card.icon} size={40} />
      </span>
      <p className="face-label">Défi spirituel</p>
      <p className="challenge">{card.challenge}</p>
      <Divider />
      <p className="footer-line">La sainteté de la famille commence à la maison.</p>
    </>
  );
}
