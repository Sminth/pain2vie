"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChapelOrnament, GiftIcon } from "./icons";
import GiftShower from "./GiftShower";
import GiftTrigger from "./gift/GiftTrigger";

const easeOut = [0.22, 1, 0.36, 1] as const;

type Photo = { src: string; alt: string; caption: string };

const PHOTOS: Photo[] = [
  { src: "/congres-1.jpeg", alt: "Fraternité au congrès Mont Sinaï", caption: "Fraternité" },
  { src: "/congres-2.jpeg", alt: "Louange au congrès Mont Sinaï", caption: "Louange" },
  { src: "/congres-3.jpeg", alt: "Communion fraternelle", caption: "Communion" },
  { src: "/congres-4.jpeg", alt: "Action de grâce au congrès", caption: "Action de grâce" },
  { src: "/congres-5.jpeg", alt: "Consécration pour le service", caption: "Consécration" },
  { src: "/congres-6.jpeg", alt: "Joie partagée entre frères et sœurs", caption: "Joie partagée" },
  { src: "/congres-7.jpeg", alt: "Vie de mission de la Fraternité", caption: "Vie de mission" },
  { src: "/congres-8.jpeg", alt: "Grâce et service", caption: "Grâce et service" },
  { src: "/congres-9.jpeg", alt: "Mont Sinaï 2026", caption: "Mont Sinaï 2026" },
];

const ROTATIONS = [-4, 3, -2, 4, -3, 2, -4, 3, -2];

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

export default function IntroFeast(_props: { onStart: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  const go = (dir: number) =>
    setZoomIndex((i) =>
      i === null ? i : (i + dir + PHOTOS.length) % PHOTOS.length,
    );

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
    <GiftShower />
    <motion.section
      className="feast"
      ref={scrollRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.5, ease: easeOut }}
    >
      <motion.div
        className="feast-logos"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: easeOut }}
      >
        <motion.img
          className="feast-logo feast-logo--sr"
          src="/logo-sr.png"
          alt="Sacerdoce Royal"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </motion.div>

      {/* cadeaux décoratifs de part et d'autre */}
      <span className="feast-flora feast-flora--1" aria-hidden>
        <GiftIcon size={72} />
      </span>
      <span className="feast-flora feast-flora--2" aria-hidden>
        <GiftIcon size={88} />
      </span>

      <div className="feast-inner">
        <motion.div className="feast-ornament" {...rise(0.15)}>
          <motion.img
            className="feast-ornament-logo"
            src="/logo-mont-sinai.png"
            alt="Mont Sinaï"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
        <motion.p className="eyebrow" {...rise(0.26)}>
          Mont Sinaï 2026
        </motion.p>
        <motion.p className="feast-tagline" {...rise(0.32)}>
          Cérémonie de Thanksgiving
        </motion.p>
        <motion.p className="feast-date" {...rise(0.4)}>
          12ᵉ congrès annuel
        </motion.p>
        <motion.p className="feast-note" {...rise(0.46)}>
          Congrès de la loyauté et de la fidélité
        </motion.p>

        <motion.div className="feast-cards" {...rise(0.46)}>
          <div className="feast-cards-track">
            {[0, 1].map((copy) =>
              PHOTOS.map((p, i) => (
                <FeastCard
                  key={`${p.src}-${copy}`}
                  photo={p}
                  index={i}
                  rot={ROTATIONS[i] ?? 0}
                  onOpen={setZoomIndex}
                />
              )),
            )}
          </div>
        </motion.div>

        <div className="feast-text">
          <motion.p {...inView(0)}>
            Bien plus qu’une clôture, la Cérémonie de Thanksgiving est un rendez-vous de
            gratitude, de reconnaissance et de communion fraternelle. Elle offre à chaque
            participant l’occasion de rendre grâce à Dieu, de célébrer les liens tissés
            durant le Mont Sinaï et d’honorer les frères et sœurs qui ont marqué son chemin.
          </motion.p>
        </div>

        <motion.h1 className="feast-title" {...inView(0.05)}>
          Innovation 2026 : la Plateforme de Gratitude
        </motion.h1>

        <div className="feast-text">
          <motion.p {...inView(0)}>
            En amont de la cérémonie, chaque participant pourra envoyer des messages
            personnalisés de remerciement, d’encouragement ou de bénédiction à un ou
            plusieurs membres de la Fraternité. Ces messages seront remis de manière
            personnalisée pendant la cérémonie, transformant chaque geste en une expérience
            profondément humaine, spirituelle et mémorable.
          </motion.p>
          <motion.p {...inView(0.1)}>
            Parce que les mots ont le pouvoir d’encourager, d’édifier et de laisser une
            empreinte durable, cette initiative fera de la gratitude un héritage que chacun
            emportera avec lui en repartant du Mont Sinaï.
          </motion.p>
        </div>

        <motion.p className="feast-blessing" {...inView(0.05)}>
          Dieu vous bénisse
        </motion.p>

        <motion.p className="feast-cta-lead" {...inView(0.05)}>
          Envoie un cadeau à un frère ou une sœur
        </motion.p>
      </div>
    </motion.section>

    <GiftTrigger className="gift-trigger--inline" />

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
