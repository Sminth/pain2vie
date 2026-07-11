"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChapelOrnament } from "./icons";

const easeOut = [0.22, 1, 0.36, 1] as const;

const PHOTOS = [
  { src: "/martin/image.png", alt: "Les saints Louis et Zélie Martin", caption: "Louis & Zélie" },
  { src: "/martin/image1.png", alt: "La famille Martin", caption: "La famille Martin" },
  { src: "/martin/image2.png", alt: "Louis, sainte Thérèse et Zélie", caption: "Avec Thérèse" },
];

/* Carte-photo avec repli si le fichier manque. */
function FeastCard({
  src,
  alt,
  caption,
  rot,
}: {
  src: string;
  alt: string;
  caption: string;
  rot: number;
}) {
  const [ok, setOk] = useState(true);
  return (
    <figure className="feast-card" style={{ "--rot": `${rot}deg` } as React.CSSProperties}>
      {ok ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} onError={() => setOk(false)} />
      ) : (
        <div className="feast-card-ph">
          <ChapelOrnament size={24} />
          <code>public{src}</code>
        </div>
      )}
      <figcaption>{caption}</figcaption>
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

      <div className="feast-inner">
        <motion.div className="feast-ornament" {...rise(0.15)}>
          <ChapelOrnament size={46} />
        </motion.div>
        <motion.p className="eyebrow" {...rise(0.26)}>
          Fête des saints Louis &amp; Zélie Martin
        </motion.p>
        <motion.p className="feast-date" {...rise(0.36)}>
          Dimanche 12 juillet
        </motion.p>

        <motion.div className="feast-cards" {...rise(0.46)}>
          {PHOTOS.map((p, i) => (
            <FeastCard key={p.src} {...p} rot={[-4, 1.5, 3.5][i]} />
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
          <p className="feast-points-title">En bref</p>
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
          <button className="cta" onClick={onStart}>
            Recevoir ma parole
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
