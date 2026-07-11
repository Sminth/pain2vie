"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import type { HolyCard } from "@/data/cards";
import {
  BIBLE_TOC,
  BOOKS,
  CHAPTERS,
  locateReference,
  type BibleVerse,
  type VerseTarget,
} from "@/data/bible";
import ParoleOutcome from "./ParoleOutcome";

/* ------------------------------- géométrie -------------------------------- */

const PAGE_W = 220;
const PAGE_H = 330;
const SPREAD_W = PAGE_W * 2;
const COVER_PAD = 7;
const RIM = 9;
const N_FLIPS = 14;
const STAGE_W = 500;
const STAGE_H = 430;

const easeOut = [0.22, 1, 0.36, 1] as const;

type Step =
  | "closed"
  | "opening"
  | "flipping"
  | "landed"
  | "zoom"
  | "pen"
  | "focus"
  | "present"
  | "done";

interface LineRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/* --------------------------------- contenu -------------------------------- */

interface Block {
  chapterNo?: number;
  verses: BibleVerse[];
  /** plage de versets à envelopper dans le span cible du surlignage */
  markFrom?: number;
  markTo?: number;
}

interface PageData {
  head: string;
  folio: number;
  blocks: Block[];
}

function tocNameAt(frac: number): string {
  let name = BIBLE_TOC[0][0];
  for (const [n, f] of BIBLE_TOC) {
    if (f <= frac) name = n;
    else break;
  }
  return name;
}

/** Versets d'ambiance (texte réel) pour les pages qui défilent. */
function buildPool(excludeKey: string): BibleVerse[] {
  const pool: BibleVerse[] = [];
  for (const [key, ch] of Object.entries(CHAPTERS)) {
    if (key === excludeKey) continue;
    pool.push(...ch.verses);
  }
  return pool;
}

function poolSlice(pool: BibleVerse[], seed: number, count: number): BibleVerse[] {
  const out: BibleVerse[] = [];
  const start = (seed * 11) % pool.length;
  for (let i = 0; i < count; i++) {
    const src = pool[(start + i) % pool.length];
    out.push({ v: (i % 29) + 3, text: src.text });
  }
  return out;
}

interface Landing {
  chapterKey: string;
  frac: number;
  left: PageData;
  right: PageData;
  /** null → parole non biblique, présentée en image pieuse */
  target: VerseTarget | null;
}

function buildLanding(card: HolyCard): Landing {
  const target = card.reference ? locateReference(card.reference) : null;
  const chapterKey = target?.chapterKey ?? "ps23";
  const chapter = CHAPTERS[chapterKey];
  const book = BOOKS[chapter.book];
  const pool = buildPool(chapterKey);

  // le verset cible arrive dans le premier tiers de la page de droite :
  // on remonte de ~400 caractères avant lui.
  let startIdx = 0;
  if (target) {
    startIdx = chapter.verses.findIndex((v) => v.v === target.from);
    if (startIdx < 0) startIdx = 0;
    let budget = 400;
    while (startIdx > 0 && budget > 0) {
      budget -= chapter.verses[startIdx - 1].text.length;
      startIdx--;
    }
  }

  const folio = Math.round(18 + book.frac * 1760) & ~1;

  const right: PageData = {
    head: `${book.name} ${chapter.chapter}`,
    folio: folio + 1,
    blocks: [
      {
        chapterNo: startIdx === 0 ? chapter.chapter : undefined,
        verses: chapter.verses.slice(startIdx),
        markFrom: target?.from,
        markTo: target?.to,
      },
      // suite d'ambiance : largement de quoi remplir, le surplus est rogné
      { chapterNo: chapter.chapter + 1, verses: poolSlice(pool, 5, 42) },
    ],
  };

  const left: PageData = {
    head: book.name,
    folio,
    blocks: [{ verses: poolSlice(pool, 2, 42) }],
  };

  return { chapterKey, frac: book.frac, left, right, target };
}

function buildFillerPages(targetFrac: number, pool: BibleVerse[]): Array<{
  front: PageData;
  back: PageData;
}> {
  const pages = [];
  for (let i = 0; i < N_FLIPS; i++) {
    const u = (i + 1) / N_FLIPS;
    const p = u * u * (3 - 2 * u); // avance douce vers le livre cible
    const frac = 0.03 + (targetFrac - 0.05) * p;
    const head = tocNameAt(frac);
    const chap = ((i * 7) % 38) + 3;
    const folio = Math.round(18 + frac * 1760) & ~1;
    pages.push({
      front: {
        head: `${head} ${chap}`,
        folio: folio + 1,
        blocks: [{ verses: poolSlice(pool, i * 2 + 1, 42) }],
      },
      back: {
        head,
        folio: folio + 2,
        blocks: [{ verses: poolSlice(pool, i * 2 + 2, 42) }],
      },
    });
  }
  return pages;
}

/* ------------------------------ page imprimée ----------------------------- */

function VerseRun({ verses }: { verses: BibleVerse[] }) {
  return (
    <>
      {verses.map((vr, i) => (
        <span key={`${vr.v}-${i}`}>
          {i > 0 && " "}
          <sup className="vnum">{vr.v}</sup> {vr.text}
        </span>
      ))}
    </>
  );
}

function BlockRun({
  block,
  markRef,
}: {
  block: Block;
  markRef?: React.Ref<HTMLSpanElement>;
}) {
  const { verses, markFrom, markTo } = block;
  if (markFrom == null || markTo == null) {
    return <VerseRun verses={verses} />;
  }
  const before = verses.filter((v) => v.v < markFrom);
  const inRange = verses.filter((v) => v.v >= markFrom && v.v <= markTo);
  const after = verses.filter((v) => v.v > markTo);

  // verset unique très long : on ne surligne que sa dernière phrase,
  // celle qui porte la parole de la carte.
  let pre: React.ReactNode = null;
  let markNodes: React.ReactNode;
  if (inRange.length === 1 && inRange[0].text.length > 210) {
    const text = inRange[0].text;
    const cut = text.lastIndexOf(". ");
    const idx = cut > 40 ? cut + 2 : 0;
    pre = (
      <span>
        {" "}
        <sup className="vnum">{inRange[0].v}</sup> {text.slice(0, idx)}
      </span>
    );
    markNodes = <>{text.slice(idx)}</>;
  } else {
    markNodes = <VerseRun verses={inRange} />;
  }

  return (
    <>
      <VerseRun verses={before} />
      {pre}
      {before.length > 0 && !pre && " "}
      <span className="hl-target" ref={markRef}>
        {markNodes}
      </span>{" "}
      <VerseRun verses={after} />
    </>
  );
}

function PageBody({
  data,
  side,
  markRef,
}: {
  data: PageData;
  side: "left" | "right";
  markRef?: React.Ref<HTMLSpanElement>;
}) {
  return (
    <div className={`pbody pbody--${side}`}>
      <div className="phead">
        {side === "left" ? (
          <>
            <span className="pfolio">{data.folio}</span>
            <span>{data.head}</span>
            <span />
          </>
        ) : (
          <>
            <span />
            <span>{data.head}</span>
            <span className="pfolio">{data.folio}</span>
          </>
        )}
      </div>
      <div className="pcols">
        {data.blocks.map((b, i) => (
          <p className="pverse" key={i}>
            {b.chapterNo != null && <span className="dropcap">{b.chapterNo}</span>}
            <BlockRun block={b} markRef={b.markFrom != null ? markRef : undefined} />
          </p>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- couverture ------------------------------- */

function CoverFace() {
  return (
    <div className="b-cover-face">
      <div className="b-cover-frame" />
      <svg className="b-cover-cross" viewBox="0 0 40 56" aria-hidden>
        <rect x="17" y="2" width="6" height="52" rx="1.6" fill="currentColor" />
        <rect x="4" y="16" width="32" height="6" rx="1.6" fill="currentColor" />
      </svg>
      <p className="b-cover-title">LA BIBLE</p>
      <p className="b-cover-sub">Traduction œcuménique</p>
    </div>
  );
}

/** Bible fermée réutilisée par l'écran d'attente. */
export function ClosedBible({ float = true }: { float?: boolean }) {
  return (
    <motion.div
      className="bible-closed"
      animate={float ? { y: [0, -7, 0] } : undefined}
      transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="bible-closed-block" />
      <div className="bible-closed-cover">
        <CoverFace />
      </div>
      <div className="bible-closed-ribbon" />
    </motion.div>
  );
}

/* ------------------------------ feutre (SVG) ------------------------------ */

function PenSvg() {
  return (
    <svg width="44" height="150" viewBox="0 0 44 150" aria-hidden>
      <defs>
        <linearGradient id="penBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f9d84a" />
          <stop offset="0.45" stopColor="#f2c218" />
          <stop offset="1" stopColor="#c99d0b" />
        </linearGradient>
        <linearGradient id="penCone" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e8c33c" />
          <stop offset="1" stopColor="#b9930e" />
        </linearGradient>
      </defs>
      <rect x="9" y="0" width="26" height="86" rx="6" fill="url(#penBody)" />
      <rect x="9" y="78" width="26" height="12" fill="#d9a90c" />
      <path d="M11 90 L33 90 L27.5 119 L16.5 119 Z" fill="url(#penCone)" />
      <path d="M17.5 119 L26.5 119 L23 132 L20 131 Z" fill="#a8850a" />
      <rect x="13" y="8" width="5" height="70" rx="2.5" fill="rgba(255,255,255,0.35)" />
    </svg>
  );
}

/* ------------------------------- composant -------------------------------- */

interface PenTimeline {
  xs: number[];
  ys: number[];
  times: number[];
  total: number;
  strokes: Array<{ delay: number; dur: number; r: LineRect }>;
}

function buildPenTimeline(lines: LineRect[]): PenTimeline {
  const SPEED = 250; // px (repère de la page) par seconde
  const HOP = 0.16; // saut de ligne
  let t = 0;
  const xs: number[] = [];
  const ys: number[] = [];
  const times: number[] = [];
  const strokes: PenTimeline["strokes"] = [];
  lines.forEach((r, i) => {
    const y = r.y + r.h * 0.62;
    if (i > 0) t += HOP;
    xs.push(r.x - 4);
    ys.push(y);
    times.push(t);
    const d = Math.max(0.34, r.w / SPEED);
    strokes.push({ delay: t, dur: d, r });
    t += d;
    xs.push(r.x + r.w + 3);
    ys.push(y);
    times.push(t);
  });
  return { xs, ys, times: times.map((v) => v / t), total: t, strokes };
}

export default function BibleReveal({
  card,
  onAnother,
}: {
  card: HolyCard;
  onAnother: () => void;
}) {
  const [step, setStep] = useState<Step>("closed");
  const [flown, setFlown] = useState(0);
  const [coverLanded, setCoverLanded] = useState(false);
  const [lines, setLines] = useState<LineRect[] | null>(null);
  const [cam, setCam] = useState<{ x: number; y: number; scale: number } | null>(null);
  const [fit, setFit] = useState(1);

  const bookRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<HTMLDivElement>(null);
  const verseRef = useRef<HTMLSpanElement>(null);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const landing = useMemo(() => buildLanding(card), [card]);
  const fillers = useMemo(
    () => buildFillerPages(landing.frac, buildPool(landing.chapterKey)),
    [landing],
  );
  const pen = useMemo(() => (lines ? buildPenTimeline(lines) : null), [lines]);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  /* adapte la scène (dimensions fixes) à l'écran */
  useLayoutEffect(() => {
    const update = () =>
      setFit(
        Math.min(
          (window.innerWidth - 16) / STAGE_W,
          (window.innerHeight * 0.66) / STAGE_H,
          1.25,
        ),
      );
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* déroulé : fermé → zoom + ouverture → défilement des pages */
  useEffect(() => {
    later(() => setStep("opening"), 500);
    later(() => setStep("flipping"), 1950);
    const t = timers.current;
    return () => t.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* toutes les pages sont retombées → double page atteinte */
  useEffect(() => {
    if (step === "flipping" && flown >= N_FLIPS) {
      later(() => setStep("landed"), 180);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flown, step]);

  /* mesure du verset puis zoom caméra (ou mode image pieuse) */
  useEffect(() => {
    if (step !== "landed") return;
    later(() => {
      const span = verseRef.current;
      const book = bookRef.current;
      const camEl = camRef.current;
      if (!landing.target || !span || !book || !camEl) {
        setStep("focus");
        later(() => setStep("present"), 550);
        later(() => setStep("done"), 1250);
        return;
      }
      const br = book.getBoundingClientRect();
      const scale = br.width / SPREAD_W;
      const rects = Array.from(span.getClientRects()).filter(
        (r) => r.width > 3 && r.height > 2,
      );
      // verset introuvable ou rogné : on retombe sur la présentation carte
      const pageBottom = br.top + PAGE_H * scale;
      if (!rects.length || rects[rects.length - 1].bottom > pageBottom + 2) {
        setStep("focus");
        later(() => setStep("present"), 550);
        later(() => setStep("done"), 1250);
        return;
      }
      const ls = rects.map((r) => ({
        x: (r.left - br.left) / scale,
        y: (r.top - br.top) / scale,
        w: r.width / scale,
        h: r.height / scale,
      }));
      setLines(ls);

      const cr = camEl.getBoundingClientRect();
      const camScale = cr.width / SPREAD_W;
      const minX = Math.min(...ls.map((l) => l.x));
      const maxX = Math.max(...ls.map((l) => l.x + l.w));
      const midY = (Math.min(...ls.map((l) => l.y)) + Math.max(...ls.map((l) => l.y + l.h))) / 2;
      const cxScreen = br.left + ((minX + maxX) / 2) * scale;
      const cyScreen = br.top + midY * scale;
      const px = (cxScreen - (cr.left + cr.width / 2)) / camScale;
      const py = (cyScreen - (cr.top + cr.height / 2)) / camScale;
      const Z = Math.min(3.1, Math.max(1.7, 255 / Math.max(...ls.map((l) => l.w))));
      setCam({ x: -Z * px, y: -Z * py - 10, scale: Z });
      setStep("zoom");
      later(() => setStep("pen"), 1450);
    }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  /* feutre terminé → flou du reste → actions */
  useEffect(() => {
    if (step !== "pen" || !pen) return;
    // on laisse le verset souligné bien visible dans la Bible avant qu'il sorte
    later(() => setStep("focus"), pen.total * 1000 + 300);
    later(() => setStep("present"), pen.total * 1000 + 1500);
    later(() => setStep("done"), pen.total * 1000 + 2100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, pen]);

  /* masque du voile : des fenêtres nettes sur les lignes surlignées */
  const veilMask = useMemo(() => {
    if (!lines) return undefined;
    let d = `M0 0H${SPREAD_W}V${PAGE_H}H0Z`;
    for (const l of lines) {
      const x = l.x - 6;
      const y = l.y - 4;
      const w = l.w + 12;
      const h = l.h + 8;
      d += ` M${x} ${y}h${w}v${h}h${-w}Z`;
    }
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${SPREAD_W} ${PAGE_H}'><path fill-rule='evenodd' fill='white' d='${d}'/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, [lines]);

  const opened = step !== "closed";
  const flying = step !== "closed" && step !== "opening";
  const focused = step === "focus" || step === "present" || step === "done";
  const holyCardMode = !landing.target;

  /* variables de caméra selon l'étape */
  const camAnimate =
    (step === "zoom" || step === "pen" || focused) && cam && !holyCardMode
      ? { x: cam.x, y: cam.y, scale: cam.scale, rotateX: 0, rotateZ: 0 }
      : step === "closed"
        ? { x: 0, y: 0, scale: 0.94, rotateX: 22, rotateZ: -3 }
        : step === "opening"
          ? { x: 0, y: 0, scale: 1.1, rotateX: 8, rotateZ: 0 }
          : { x: 0, y: 0, scale: 1.18, rotateX: 0, rotateZ: 0 };

  /* cadence du défilement : lent, très rapide, puis freine sur la fin */
  const flipTimings = useMemo(() => {
    let acc = 0;
    return Array.from({ length: N_FLIPS }, (_, i) => {
      const u = i / (N_FLIPS - 1);
      const gap = 0.09 + 0.42 * Math.pow(Math.abs(2 * u - 1), 3.2);
      const delay = acc;
      acc += gap;
      return { delay, duration: Math.min(0.85, Math.max(0.34, gap * 2.3)) };
    });
  }, []);

  return (
    <motion.section
      className="scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(6px)" }}
      transition={{ duration: 0.45, ease: easeOut }}
    >
      <div className="bible-anchor">
      <div
        className="bible-stage"
        style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${fit})` }}
      >
        {/* ombre portée sur la table */}
        <motion.div
          className="book-shadow3d"
          animate={{
            opacity: step === "zoom" || step === "pen" || focused ? 0 : 0.5,
            scaleX: opened ? 1.55 : 0.9,
          }}
          transition={{ duration: 1 }}
        />

        <motion.div
          ref={camRef}
          className="bible-camera"
          style={{ width: SPREAD_W, height: PAGE_H }}
          animate={camAnimate}
          transition={{ duration: step === "zoom" ? 1.35 : 1.15, ease: easeOut }}
        >
          <div className="book3d" ref={bookRef} style={{ width: SPREAD_W, height: PAGE_H }}>
            <motion.div
              className="book-inner"
              initial={false}
              animate={{ x: opened ? 0 : -(PAGE_W + COVER_PAD) / 2 }}
              transition={{ duration: 1.35, ease: easeOut }}
            >
              {/* couverture arrière, dépasse sous le bloc de pages */}
              <div
                className="b-backcover"
                style={{
                  left: PAGE_W,
                  top: -COVER_PAD,
                  width: PAGE_W + COVER_PAD,
                  height: PAGE_H + COVER_PAD * 2,
                }}
              />

              {/* page de droite finale (sous les pages qui volent) */}
              <div
                className="b-page b-page--base"
                style={{ left: PAGE_W, width: PAGE_W, height: PAGE_H, zIndex: 99 }}
              >
                <PageBody data={landing.right} side="right" markRef={verseRef} />
              </div>

              {/* tranches : épaisseur restante à droite / feuilletée à gauche */}
              <motion.div
                className="rim rim--right"
                style={{ height: PAGE_H - 6 }}
                initial={false}
                animate={{
                  width: flying ? Math.max(2, (1 - landing.frac) * RIM) : RIM,
                  opacity: opened ? 1 : 0,
                }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />
              <motion.div
                className="rim rim--left"
                style={{ height: PAGE_H - 6 }}
                initial={false}
                animate={{
                  width: flying ? Math.max(2, landing.frac * RIM) : 2,
                  opacity: coverLanded ? 1 : 0,
                }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />

              {/* pages qui défilent */}
              {fillers.map((pg, i) => {
                const last = i === N_FLIPS - 1;
                const hasFlown = flown > i;
                return (
                  <motion.div
                    key={i}
                    className="flip-page"
                    style={{
                      left: PAGE_W,
                      width: PAGE_W,
                      height: PAGE_H,
                      zIndex: hasFlown ? 100 + i : 200 - i,
                    }}
                    initial={false}
                    animate={{ rotateY: flying ? -180 : 0 }}
                    transition={{
                      delay: flipTimings[i].delay,
                      duration: flipTimings[i].duration,
                      ease: [0.45, 0, 0.3, 1],
                    }}
                    onAnimationComplete={() => flying && setFlown((n) => Math.max(n, i + 1))}
                  >
                    <div className="page-face page-face--front">
                      {i === 0 ? (
                        <div className="b-titlepage">
                          <p className="b-titlepage-main">LA SAINTE BIBLE</p>
                          <p className="b-titlepage-sub">
                            Ancien et Nouveau Testament
                          </p>
                        </div>
                      ) : (
                        <PageBody data={pg.front} side="right" />
                      )}
                      <motion.div
                        className="page-sheen"
                        initial={false}
                        animate={{ opacity: flying ? [0, 0.5, 0] : 0 }}
                        transition={{
                          delay: flipTimings[i].delay,
                          duration: flipTimings[i].duration,
                        }}
                      />
                    </div>
                    <div className="page-face page-face--back">
                      <PageBody
                        data={last ? landing.left : pg.back}
                        side="left"
                      />
                      <div className="page-shade-left" />
                    </div>
                  </motion.div>
                );
              })}

              {/* couverture avant */}
              <motion.div
                className="b-cover"
                style={{
                  left: PAGE_W,
                  top: -COVER_PAD,
                  width: PAGE_W + COVER_PAD,
                  height: PAGE_H + COVER_PAD * 2,
                  zIndex: coverLanded ? 90 : 300,
                }}
                initial={false}
                animate={{ rotateY: opened ? -180 : 0 }}
                transition={{ duration: 1.35, ease: [0.55, 0.05, 0.35, 1] }}
                onAnimationComplete={() => opened && setCoverLanded(true)}
              >
                <div className="page-face page-face--front">
                  <CoverFace />
                </div>
                <div className="page-face page-face--back b-endpaper" />
              </motion.div>

              {/* pli central */}
              <motion.div
                className="gutter-shade"
                initial={false}
                animate={{ opacity: coverLanded ? 1 : 0 }}
                transition={{ duration: 0.8 }}
              />

              {/* surlignage + feutre + voile */}
              <div className="spread-overlay" style={{ width: SPREAD_W, height: PAGE_H }}>
                <motion.div
                  className="dim-veil"
                  style={
                    veilMask && !holyCardMode
                      ? { WebkitMaskImage: veilMask, maskImage: veilMask }
                      : undefined
                  }
                  initial={{ opacity: 0 }}
                  animate={{ opacity: focused ? 1 : 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                />

                {step === "pen" && pen && (
                  <>
                    {pen.strokes.map((s, i) => (
                      <motion.div
                        key={i}
                        className="hl-stroke"
                        style={{
                          left: s.r.x - 3,
                          top: s.r.y - 2,
                          width: s.r.w + 6,
                          height: s.r.h + 4,
                          originX: 0,
                        }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: s.delay, duration: s.dur, ease: "linear" }}
                      />
                    ))}
                    <motion.div
                      className="pen-wrap"
                      initial={{ opacity: 0 }}
                      animate={{ x: pen.xs, y: pen.ys, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        x: { duration: pen.total, times: pen.times, ease: "linear" },
                        y: { duration: pen.total, times: pen.times, ease: "linear" },
                        opacity: { duration: 0.25 },
                      }}
                    >
                      <div className="pen-rot">
                        <PenSvg />
                      </div>
                    </motion.div>
                  </>
                )}

                {/* traits laissés par le feutre, conservés après son passage */}
                {(step === "focus" || step === "present" || step === "done") &&
                  lines?.map((r, i) => (
                    <div
                      key={i}
                      className="hl-stroke"
                      style={{
                        left: r.x - 3,
                        top: r.y - 2,
                        width: r.w + 6,
                        height: r.h + 4,
                      }}
                    />
                  ))}

              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      </div>

      {/* le verset « sort » de la Bible : carte lisible + partage + défi */}
      {(step === "present" || step === "done") && (
        <ParoleOutcome card={card} onAnother={onAnother} />
      )}
    </motion.section>
  );
}
