"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import type { GiftStyleId, GiftTheme } from "@/data/gifts";
import { CornerFlora } from "../flowers";
import { HeartsBurst } from "./GiftHearts";

const easeOut = [0.22, 1, 0.36, 1] as const;

interface OpenerProps {
  theme: GiftTheme;
  message: string;
  onDone: () => void;
}

/** Le message, tel qu'il apparaît une fois « sorti » de son emballage. */
function GiftNote({ theme, message }: { theme: GiftTheme; message: string }) {
  return (
    <div className="gopen-note" style={{ borderColor: theme.colorDeep }}>
      <CornerFlora />
      <p className="gopen-note-title" style={{ color: theme.colorDeep }}>
        {theme.title}
      </p>
      <p className="gopen-note-msg">{message}</p>
    </div>
  );
}

/** Pochette kraft en SVG (plis réels) — partagée par l'ouverture et l'envoi. */
function EnvelopePocket() {
  return (
    <svg className="gopen-envelope-pocket" viewBox="0 0 220 150" aria-hidden>
      <defs>
        <linearGradient id="gopenEnvKraft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2e3bf" />
          <stop offset="1" stopColor="#c2986a" />
        </linearGradient>
      </defs>
      <rect x="6" y="22" width="208" height="120" rx="10" fill="url(#gopenEnvKraft)" />
      <path d="M12 24 L110 82 L208 24" stroke="#9c774a" strokeWidth="2" fill="none" opacity="0.55" />
      <path d="M12 140 L110 88 L208 140" stroke="#9c774a" strokeWidth="2" fill="none" opacity="0.4" />
    </svg>
  );
}

function EnvelopeOpener({ theme, message, onDone }: OpenerProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="gopen-stage">
      <div className="gopen-envelope">
        <span className="gopen-envelope-shadow" />
        <EnvelopePocket />
        <motion.div
          className="gopen-envelope-letter"
          initial={{ top: "48px", opacity: 0, scale: 0.88 }}
          animate={{ top: "-108px", opacity: 1, scale: 1 }}
          transition={{ delay: 1.15, duration: 0.95, ease: easeOut }}
        >
          <GiftNote theme={theme} message={message} />
        </motion.div>
        <motion.svg
          className="gopen-envelope-flap"
          viewBox="0 0 220 96"
          initial={{ rotateX: 0 }}
          animate={{ rotateX: -152 }}
          transition={{ delay: 0.45, duration: 0.85, ease: easeOut }}
          aria-hidden
        >
          <defs>
            <linearGradient id="gopenEnvFlap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e6cd98" />
              <stop offset="1" stopColor="#b18b57" />
            </linearGradient>
          </defs>
          <path d="M6 2 L214 2 L110 86 Z" fill="url(#gopenEnvFlap)" />
        </motion.svg>
        <motion.span
          className="gopen-envelope-seal"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0.4 }}
          transition={{ delay: 0.3, duration: 0.45, ease: easeOut }}
        />
      </div>
    </div>
  );
}

function PlaneOpener({ theme, message, onDone }: OpenerProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="gopen-stage">
      <motion.svg
        className="gopen-plane"
        viewBox="0 0 24 24"
        width="64"
        height="64"
        initial={{ x: "-46vw", y: "34vh", rotate: -18, opacity: 1 }}
        animate={{ x: 0, y: 0, rotate: 0, opacity: [1, 1, 0] }}
        transition={{ duration: 1.35, ease: easeOut, opacity: { times: [0, 0.82, 1], duration: 1.35 } }}
        aria-hidden
      >
        <path
          d="M20.5 3.5 3 10.8l6.6 2.2 2.2 6.6L20.5 3.5Z"
          fill={theme.colorDeep}
          stroke={theme.colorDeep}
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </motion.svg>
      <motion.div
        className="gopen-plane-note"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.15, duration: 0.7, ease: easeOut }}
      >
        <GiftNote theme={theme} message={message} />
      </motion.div>
    </div>
  );
}

const FLOWER_RING = [
  { left: 12, top: 6, size: 30, delay: 0.15 },
  { left: 84, top: 10, size: 26, delay: 0.4 },
  { left: 92, top: 62, size: 30, delay: 0.65 },
  { left: 74, top: 92, size: 24, delay: 0.35 },
  { left: 20, top: 90, size: 28, delay: 0.55 },
  { left: 4, top: 46, size: 24, delay: 0.2 },
];

function FlowerOpener({ theme, message, onDone }: OpenerProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="gopen-stage">
      <div className="gopen-flower-ring">
        {FLOWER_RING.map((f, i) => (
          <motion.span
            key={i}
            className="gopen-flower"
            style={{
              left: `${f.left}%`,
              top: `${f.top}%`,
              width: f.size,
              height: f.size,
              marginLeft: -f.size / 2,
              marginTop: -f.size / 2,
            }}
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: f.delay, duration: 0.6, ease: easeOut }}
          >
            <svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse
                  key={a}
                  cx="20"
                  cy="11"
                  rx="6.2"
                  ry="9.4"
                  fill={i % 2 ? theme.color : theme.colorDeep}
                  transform={`rotate(${a} 20 20)`}
                />
              ))}
              <circle cx="20" cy="20" r="4.6" fill="#e6b463" />
            </svg>
          </motion.span>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.75, ease: easeOut }}
      >
        <GiftNote theme={theme} message={message} />
      </motion.div>
    </div>
  );
}

const EMBERS = Array.from({ length: 10 }, (_, i) => ({
  left: 8 + i * 9,
  delay: i * 0.16,
  dur: 1.6 + (i % 4) * 0.3,
}));

const FLAMES_BIG = [
  { left: 12, h: 40, flicker: 1.05 },
  { left: 28, h: 56, flicker: 0.85 },
  { left: 45, h: 34, flicker: 1.2 },
  { left: 62, h: 52, flicker: 0.95 },
  { left: 78, h: 30, flicker: 1.1 },
  { left: 92, h: 44, flicker: 1.0 },
];

/** Flamme réaliste (3 couches) qui vacille en continu. */
function FlameGlyph({ h, flicker }: { h: number; flicker: number }) {
  return (
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
  );
}

/** Socle sombre en dents de scie, comme des cendres/braises restées au sol. */
function BurnAsh() {
  return (
    <svg className="gopen-burn-ash" viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden>
      <path
        d="M0,26 L0,13 L7,18 L14,7 L22,16 L30,5 L38,15 L46,4 L54,14 L62,6 L70,17 L78,8 L86,16 L93,9 L100,13 L100,26 Z"
        fill="#0c0805"
      />
    </svg>
  );
}

function BurningOpener({ theme, message, onDone }: OpenerProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="gopen-stage">
      <div className="gopen-burn-wrap">
        <motion.span
          className="gopen-burn-glow"
          animate={{ opacity: [0.5, 0.2] }}
          transition={{ delay: 0.5, duration: 1.6, ease: easeOut }}
        />
        <BurnAsh />
        <motion.div
          className="gopen-burn-veil"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ delay: 0.5, duration: 1.5, ease: easeOut }}
        >
          <GiftNote theme={theme} message={message} />
        </motion.div>
        {FLAMES_BIG.map((f, i) => (
          <motion.span
            key={i}
            className="gopen-flame-track"
            style={{ left: `${f.left}%` }}
            initial={{ bottom: "94%", opacity: 0 }}
            animate={{ bottom: "4%", opacity: [0, 1, 1, 0] }}
            transition={{
              bottom: { delay: 0.5, duration: 1.6, ease: easeOut },
              opacity: { delay: 0.5, duration: 1.6, times: [0, 0.15, 0.75, 1] },
            }}
          >
            <FlameGlyph h={f.h} flicker={f.flicker} />
          </motion.span>
        ))}
        {EMBERS.map((e, i) => (
          <motion.span
            key={i}
            className="gopen-ember"
            style={{ left: `${e.left}%` }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -120, opacity: [0, 1, 0], x: [0, i % 2 ? 14 : -14, 0] }}
            transition={{ delay: e.delay, duration: e.dur, ease: "easeOut" }}
          />
        ))}
      </div>
    </div>
  );
}

function ParchmentOpener({ theme, message, onDone }: OpenerProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="gopen-stage">
      <div className="gopen-parchment">
        <div className="gopen-parchment-kraft" />
        <motion.div
          className="gopen-parchment-note-wrap"
          initial={{ clipPath: "inset(0% 50% 0% 50%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ delay: 0.35, duration: 1.1, ease: easeOut }}
        >
          <GiftNote theme={theme} message={message} />
        </motion.div>
        <motion.span
          className="gopen-parchment-roll gopen-parchment-roll--left"
          initial={{ left: "50%" }}
          animate={{ left: "0%" }}
          transition={{ delay: 0.35, duration: 1.1, ease: easeOut }}
        />
        <motion.span
          className="gopen-parchment-roll gopen-parchment-roll--right"
          initial={{ right: "50%" }}
          animate={{ right: "0%" }}
          transition={{ delay: 0.35, duration: 1.1, ease: easeOut }}
        />
      </div>
    </div>
  );
}

function HeartsOpener({ theme, message, onDone }: OpenerProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2300);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="gopen-stage">
      <div className="gopen-hearts">
        <HeartsBurst />
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.75, ease: easeOut }}
        >
          <GiftNote theme={theme} message={message} />
        </motion.div>
      </div>
    </div>
  );
}

export default function GiftOpener({
  styleId,
  theme,
  message,
  onDone,
}: OpenerProps & { styleId: GiftStyleId }) {
  switch (styleId) {
    case "envelope":
      return <EnvelopeOpener theme={theme} message={message} onDone={onDone} />;
    case "plane":
      return <PlaneOpener theme={theme} message={message} onDone={onDone} />;
    case "flower":
      return <FlowerOpener theme={theme} message={message} onDone={onDone} />;
    case "burning":
      return <BurningOpener theme={theme} message={message} onDone={onDone} />;
    case "parchment":
      return <ParchmentOpener theme={theme} message={message} onDone={onDone} />;
    case "hearts":
      return <HeartsOpener theme={theme} message={message} onDone={onDone} />;
  }
}

/* ================= animations d'envoi (le miroir, côté expéditeur) ========= */

function EnvelopeSender({ theme, message, onDone }: OpenerProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="gopen-stage">
      <div className="gopen-envelope">
        <span className="gopen-envelope-shadow" />
        <EnvelopePocket />
        <motion.div
          className="gopen-envelope-letter"
          initial={{ top: "-108px", opacity: 1, scale: 1 }}
          animate={{ top: "48px", opacity: 0, scale: 0.88 }}
          transition={{ delay: 0.55, duration: 0.8, ease: easeOut }}
        >
          <GiftNote theme={theme} message={message} />
        </motion.div>
        <motion.svg
          className="gopen-envelope-flap"
          viewBox="0 0 220 96"
          initial={{ rotateX: -152 }}
          animate={{ rotateX: 0 }}
          transition={{ delay: 1.1, duration: 0.65, ease: easeOut }}
          aria-hidden
        >
          <defs>
            <linearGradient id="gopenEnvFlap2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e6cd98" />
              <stop offset="1" stopColor="#b18b57" />
            </linearGradient>
          </defs>
          <path d="M6 2 L214 2 L110 86 Z" fill="url(#gopenEnvFlap2)" />
        </motion.svg>
        <motion.span
          className="gopen-envelope-seal"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.4, ease: easeOut }}
        />
      </div>
    </div>
  );
}

function PlaneSender({ theme, message, onDone }: OpenerProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2300);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="gopen-stage">
      <motion.div
        className="gopen-plane-note"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.7 }}
        transition={{ delay: 0.65, duration: 0.55, ease: easeOut }}
      >
        <GiftNote theme={theme} message={message} />
      </motion.div>
      <motion.svg
        className="gopen-plane"
        viewBox="0 0 24 24"
        width="64"
        height="64"
        initial={{ x: 0, y: 0, rotate: 0, opacity: 0 }}
        animate={{ x: "42vw", y: "-32vh", rotate: 22, opacity: [0, 1, 1, 0] }}
        transition={{
          delay: 0.85,
          duration: 1.25,
          ease: easeOut,
          opacity: { times: [0, 0.14, 0.8, 1], duration: 1.25 },
        }}
        aria-hidden
      >
        <path
          d="M20.5 3.5 3 10.8l6.6 2.2 2.2 6.6L20.5 3.5Z"
          fill={theme.colorDeep}
          stroke={theme.colorDeep}
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </motion.svg>
    </div>
  );
}

function FlowerSender({ theme, message, onDone }: OpenerProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2300);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="gopen-stage">
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.82 }}
        transition={{ delay: 1, duration: 0.55, ease: easeOut }}
      >
        <GiftNote theme={theme} message={message} />
      </motion.div>
      <div className="gopen-flower-ring">
        {FLOWER_RING.map((f, i) => (
          <motion.span
            key={i}
            className="gopen-flower"
            style={{ width: f.size, height: f.size, marginLeft: -f.size / 2, marginTop: -f.size / 2 }}
            initial={{ scale: 1, opacity: 1, rotate: 0, left: `${f.left}%`, top: `${f.top}%` }}
            animate={{ scale: 0, opacity: 0, rotate: 24, left: "50%", top: "50%" }}
            transition={{ delay: 0.25 + f.delay, duration: 0.65, ease: easeOut }}
          >
            <svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse
                  key={a}
                  cx="20"
                  cy="11"
                  rx="6.2"
                  ry="9.4"
                  fill={i % 2 ? theme.color : theme.colorDeep}
                  transform={`rotate(${a} 20 20)`}
                />
              ))}
              <circle cx="20" cy="20" r="4.6" fill="#e6b463" />
            </svg>
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function BurningSender({ theme, message, onDone }: OpenerProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="gopen-stage">
      <div className="gopen-burn-wrap">
        <motion.span
          className="gopen-burn-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.6, duration: 1.3, ease: easeOut }}
        />
        <BurnAsh />
        <motion.div
          className="gopen-burn-veil"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ delay: 0.6, duration: 1.3, ease: easeOut }}
        >
          <GiftNote theme={theme} message={message} />
        </motion.div>
        {FLAMES_BIG.map((f, i) => (
          <motion.span
            key={i}
            className="gopen-flame-track"
            style={{ left: `${f.left}%` }}
            initial={{ bottom: "4%", opacity: 0 }}
            animate={{ bottom: "94%", opacity: [0, 1, 1, 0] }}
            transition={{
              bottom: { delay: 0.6, duration: 1.4, ease: easeOut },
              opacity: { delay: 0.6, duration: 1.4, times: [0, 0.15, 0.8, 1] },
            }}
          >
            <FlameGlyph h={f.h} flicker={f.flicker} />
          </motion.span>
        ))}
        {EMBERS.map((e, i) => (
          <motion.span
            key={i}
            className="gopen-ember"
            style={{ left: `${e.left}%` }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -120, opacity: [0, 1, 0], x: [0, i % 2 ? 14 : -14, 0] }}
            transition={{ delay: 0.55 + e.delay, duration: e.dur, ease: "easeOut" }}
          />
        ))}
      </div>
    </div>
  );
}

function ParchmentSender({ theme, message, onDone }: OpenerProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="gopen-stage">
      <div className="gopen-parchment">
        <div className="gopen-parchment-kraft" />
        <motion.div
          className="gopen-parchment-note-wrap"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 50% 0% 50%)" }}
          transition={{ delay: 0.7, duration: 0.85, ease: easeOut }}
        >
          <GiftNote theme={theme} message={message} />
        </motion.div>
        <motion.span
          className="gopen-parchment-roll gopen-parchment-roll--left"
          initial={{ left: "0%" }}
          animate={{ left: "50%" }}
          transition={{ delay: 0.7, duration: 0.85, ease: easeOut }}
        />
        <motion.span
          className="gopen-parchment-roll gopen-parchment-roll--right"
          initial={{ right: "0%" }}
          animate={{ right: "50%" }}
          transition={{ delay: 0.7, duration: 0.85, ease: easeOut }}
        />
      </div>
    </div>
  );
}

function HeartsSender({ theme, message, onDone }: OpenerProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="gopen-stage">
      <div className="gopen-hearts">
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: 0.65, duration: 0.55, ease: easeOut }}
        >
          <GiftNote theme={theme} message={message} />
        </motion.div>
        <HeartsBurst />
      </div>
    </div>
  );
}

/** L'inverse de `GiftOpener` : l'animation « d'emballage » côté expéditeur,
 * jouée juste après le choix du style, avant l'écran de partage. */
export function GiftSender({
  styleId,
  theme,
  message,
  onDone,
}: OpenerProps & { styleId: GiftStyleId }) {
  switch (styleId) {
    case "envelope":
      return <EnvelopeSender theme={theme} message={message} onDone={onDone} />;
    case "plane":
      return <PlaneSender theme={theme} message={message} onDone={onDone} />;
    case "flower":
      return <FlowerSender theme={theme} message={message} onDone={onDone} />;
    case "burning":
      return <BurningSender theme={theme} message={message} onDone={onDone} />;
    case "parchment":
      return <ParchmentSender theme={theme} message={message} onDone={onDone} />;
    case "hearts":
      return <HeartsSender theme={theme} message={message} onDone={onDone} />;
  }
}
