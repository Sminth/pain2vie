"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChapelOrnament } from "./icons";
import RosePetals, { PotButtonContent, RoseSprig } from "./flowers";

const easeOut = [0.22, 1, 0.36, 1] as const;

type Photo = { src: string; alt: string; caption: string };

const PHOTOS = [
  { src: "/martin/image.png", alt: "Les saints Louis et Zélie Martin", caption: "Louis & Zélie" },
  { src: "/martin/image1.png", alt: "La famille Martin", caption: "La famille Martin" },
  { src: "/martin/image2.png", alt: "Louis, sainte Thérèse et Zélie", caption: "Avec Thérèse" },
  { src: "/martin/image3.png", alt: "Louis, sainte Thérèse et Zélie", caption: "Avec Thérèse" },
];

/* Carte-photo cliquable (agrandissement) avec repli si le fichier manque. */
function FeastCard({
  photo,
  index,
  rot,
  onOpen,
}: {
  photo: Photo;
  index: number;
  rot: number;
  onOpen: (i: number) => void;
}) {
  const [ok, setOk] = useState(true);
  return (
    <figure
      className="feast-card"
      style={{ "--rot": `${rot}deg` } as React.CSSProperties}
      onClick={ok ? () => onOpen(index) : undefined}
      role={ok ? "button" : undefined}
      tabIndex={ok ? 0 : undefined}
      aria-label={ok ? `Agrandir la photo : ${photo.caption}` : undefined}
      onKeyDown={
        ok
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen(index);
              }
            }
          : undefined
      }
    >
      {ok ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo.src} alt={photo.alt} onError={() => setOk(false)} />
      ) : (
        <div className="feast-card-ph">
          <ChapelOrnament size={24} />
          <code>public{photo.src}</code>
        </div>
      )}
      <figcaption>{photo.caption}</figcaption>
    </figure>
  );
}

const PARAGRAPHS = [
  "L’histoire du couple de Louis et Zélie est une histoire simple mais pas ordinaire pour autant.",
  "Si Louis a eu l’habitude des voyages, au gré des mutations de son papa militaire, de garnison en garnison, Zélie, quoique fille de militaire aussi — son papa était gendarme — n’a pratiquement pas voyagé, se déplaçant tout juste de quelques dizaines de kilomètres pour rallier Alençon à l’âge de 13 ans.",
  "Leur histoire est originale. Désirant, l’un comme l’autre, devenir religieux, éconduits chacun pour leur part dans leur démarche, rendus à leur solitude de vie dans cette ville calme et paisible d’Alençon, ils se rencontrent sur le pont qui enjambe la Sarthe et se marient quelques mois plus tard.",
  "Homme et femme de foi, travailleurs, bons éducateurs de leurs enfants (ils en auront neuf), engagés dans les œuvres sociales, soucieux de témoigner de leur foi, éprouvés par la maladie de Zélie, ils ne laissent personne indifférent.",
  "Dix-neuf années d’un réel bonheur vécu comme époux et en famille, puis dix-sept années où la famille Martin, transplantée à Lisieux, vivra dans le souvenir de leur épouse et mère regrettée.",
  "Aujourd’hui, l’Église nous les offre comme modèles sur le chemin de la Sainteté parce qu’ils ont su, dans l’épreuve qui était la leur, « vivre d’Amour », pour reprendre le titre d’une poésie de leur fille sainte Thérèse.",
];

const POINTS = [
  "Désirant d’abord la vie religieuse, Louis Martin et Zélie Guérin se marient finalement en 1858 à Alençon.",
  "Entrepreneurs prospères, ils fondent une famille profondément chrétienne et axée sur la charité.",
  "Le couple traverse de douloureuses épreuves, perdant quatre de leurs neuf enfants en bas âge.",
  "Après la mort précoce de Zélie d’un cancer, Louis déménage à Lisieux pour élever leurs cinq filles, qui deviendront toutes religieuses, dont la future sainte Thérèse.",
  "Frappé par la maladie en fin de vie, Louis s’éteint en 1894, laissant le souvenir d’un couple exemplaire, canonisé en 2015.",
];

export default function IntroFeast({ onStart }: { onStart: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  const go = (dir: number) =>
    setZoomIndex((i) =>
      i === null ? i : (i + dir + PHOTOS.length) % PHOTOS.length,
    );

  /* le bouton flotte tant que le vrai bouton (en bas) n'est pas à l'écran */
  useEffect(() => {
    const root = scrollRef.current;
    const target = ctaRef.current;
    if (!root || !target) return;
    const io = new IntersectionObserver(
      ([entry]) => setCtaVisible(entry.isIntersecting),
      { root, threshold: 0.6 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  /* navigation clavier dans le carrousel */
  useEffect(() => {
    if (zoomIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomIndex(null);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomIndex]);

  const rise = (delay = 0) => ({
    initial: { opacity: 0, y: 24, filter: "blur(6px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.8, delay, ease: easeOut },
  });

  const inView = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25, root: scrollRef },
    transition: { duration: 0.7, delay, ease: easeOut },
  });

  return (
    <>
    <RosePetals />
    <motion.section
      className="feast"
      ref={scrollRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.5, ease: easeOut }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        className="feast-logo"
        src="/logo.png"
        alt="Joseph d’Arimathée du Sacerdoce Royal"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
      />

      {/* fleurs décoratives de part et d'autre */}
      <span className="feast-flora feast-flora--1" aria-hidden>
        <RoseSprig size={104} />
      </span>
      <span className="feast-flora feast-flora--2" aria-hidden>
        <RoseSprig size={128} />
      </span>

      <div className="feast-inner">
        <motion.div className="feast-ornament" {...rise(0.15)}>
          <ChapelOrnament size={46} />
        </motion.div>
        <motion.p className="eyebrow" {...rise(0.26)}>
          Fête des saints Louis &amp; Zélie Martin
        </motion.p>
        <motion.p className="feast-tagline" {...rise(0.32)}>
          Couple missionnaire
        </motion.p>
        <motion.p className="feast-date" {...rise(0.4)}>
          Dimanche 12 juillet 2026
        </motion.p>

        <motion.div className="feast-cards" {...rise(0.46)}>
          {PHOTOS.map((p, i) => (
            <FeastCard
              key={p.src}
              photo={p}
              index={i}
              rot={[-5, -1.5, 2, 5][i] ?? 0}
              onOpen={setZoomIndex}
            />
          ))}
        </motion.div>

        <motion.h1 className="feast-title" {...rise(0.6)}>
          La sainteté commence à la maison
        </motion.h1>

        <div className="feast-text">
          {PARAGRAPHS.map((p, i) => (
            <motion.p key={i} {...inView(0)}>
              {p}
            </motion.p>
          ))}
        </div>

        <motion.div className="feast-points-wrap" {...inView(0)}>
          <p className="feast-points-title">En resumé</p>
          <ul className="feast-points">
            {POINTS.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div className="feast-cta" {...inView(0.05)}>
          <p className="feast-cta-lead">Et toi, cette semaine&nbsp;?</p>
          <p className="feast-question">Quelle parole t’accompagne cette semaine&nbsp;?</p>
          <p className="feast-question">Quel est ton défi de la semaine&nbsp;?</p>
          <button
            className="pot-btn"
            ref={ctaRef}
            onClick={onStart}
            aria-label="Reçois ta pétale du jour"
          >
            <PotButtonContent />
          </button>
        </motion.div>
      </div>
    </motion.section>

    <div className="feast-float-wrap">
      <AnimatePresence>
        {!ctaVisible && zoomIndex === null && (
          <motion.button
            type="button"
            className="pot-btn pot-btn--float"
            onClick={onStart}
            aria-label="Reçois ta pétale du jour"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: easeOut }}
          >
            <PotButtonContent />
          </motion.button>
        )}
      </AnimatePresence>
    </div>

    <AnimatePresence>
      {zoomIndex !== null && (
        <motion.div
          className="lightbox"
          onClick={() => setZoomIndex(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            className="lightbox-nav lightbox-prev"
            aria-label="Photo précédente"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
          >
            ‹
          </button>

          <motion.figure
            className="lightbox-fig"
            onClick={(e) => e.stopPropagation()}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(1);
              else if (info.offset.x > 60) go(-1);
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={zoomIndex}
                src={PHOTOS[zoomIndex].src}
                alt={PHOTOS[zoomIndex].alt}
                draggable={false}
                initial={{ opacity: 0, x: 36 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -36 }}
                transition={{ duration: 0.28, ease: easeOut }}
              />
            </AnimatePresence>
            <figcaption>{PHOTOS[zoomIndex].caption}</figcaption>
          </motion.figure>

          <button
            type="button"
            className="lightbox-nav lightbox-next"
            aria-label="Photo suivante"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
          >
            ›
          </button>

          <div className="lightbox-dots" onClick={(e) => e.stopPropagation()}>
            {PHOTOS.map((_, i) => (
              <button
                key={i}
                type="button"
                className={i === zoomIndex ? "on" : ""}
                aria-label={`Photo ${i + 1}`}
                onClick={() => setZoomIndex(i)}
              />
            ))}
          </div>

          <button
            type="button"
            className="lightbox-close"
            aria-label="Fermer"
            onClick={() => setZoomIndex(null)}
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
