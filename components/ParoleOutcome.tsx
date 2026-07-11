"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { HolyCard } from "@/data/cards";
import {
  CardIconGlyph,
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  Divider,
  ShareIcon,
} from "./icons";
import ShareCard from "./ShareCard";

const easeOut = [0.22, 1, 0.36, 1] as const;

/* Présentation finale partagée par les deux révélations (verset / lumière) :
 * la grande carte lisible + copier / partager / télécharger + le défi. */
export default function ParoleOutcome({
  card,
  onAnother,
}: {
  card: HolyCard;
  onAnother: () => void;
}) {
  const [showChallenge, setShowChallenge] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showUi, setShowUi] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);
  const pngRef = useRef<Blob | null>(null);
  const fileName = `parole-louis-zelie-${card.id}.png`;

  useEffect(() => {
    const t = setTimeout(() => setShowUi(true), 650);
    return () => clearTimeout(t);
  }, []);

  const shareText = card.reference
    ? `« ${card.quote} »\n${card.reference}\n\nDéfi : ${card.challenge}`
    : `« ${card.quote} »\n\nDéfi : ${card.challenge}`;

  const buildBlob = useCallback(async (): Promise<Blob | null> => {
    const node = shareRef.current;
    if (!node) return null;
    const { toPng } = await import("html-to-image");
    // toPng (toDataURL) puis fetch→Blob : évite le callback canvas.toBlob,
    // plus fiable selon les navigateurs. Garde-fou de temps pour ne jamais bloquer.
    const dataUrl = (await Promise.race([
      toPng(node, { pixelRatio: 2, cacheBust: true, backgroundColor: "#f8f3e8" }),
      new Promise<string>((_, rej) =>
        setTimeout(() => rej(new Error("timeout")), 15000),
      ),
    ])) as string;
    const res = await fetch(dataUrl);
    return res.blob();
  }, []);

  /* pré-génère l'image dès que la carte est prête → partage/téléchargement
     instantané (et compatible avec l'activation utilisateur d'iOS). */
  useEffect(() => {
    let alive = true;
    const t = setTimeout(async () => {
      try {
        const blob = await buildBlob();
        if (alive) pngRef.current = blob;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("[ParoleOutcome] pré-génération image :", e);
      }
    }, 900);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [buildBlob]);

  const getBlob = async (): Promise<Blob | null> => {
    if (!pngRef.current) pngRef.current = await buildBlob();
    return pngRef.current;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papiers indisponible */
    }
  };

  const handleShare = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await getBlob();
      if (blob && typeof navigator !== "undefined" && navigator.canShare) {
        const file = new File([blob], fileName, { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "La sainteté de la famille",
            text: shareText,
          });
          return;
        }
      }
    } catch {
      /* partage image annulé ou non supporté → replis ci-dessous */
    } finally {
      setBusy(false);
    }
    // repli : partage texte, sinon copie
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "La sainteté de la famille", text: shareText });
        return;
      } catch {
        /* annulé */
      }
    }
    handleCopy();
  };

  const handleDownload = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const blob = await getBlob();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = fileName;
      a.href = url;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("[ParoleOutcome] Téléchargement impossible :", e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <motion.div
        className="verse-present"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="verse-card"
          initial={{ opacity: 0, scale: 0.58, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, ease: easeOut }}
        >
          <span className="verse-card-icon">
            <CardIconGlyph icon={card.icon} size={30} />
          </span>
          <p className="verse-card-quote">«&nbsp;{card.quote}&nbsp;»</p>
          {card.reference && <p className="verse-card-ref">{card.reference}</p>}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showUi && (
          <motion.div
            className="reveal-ui"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: easeOut }}
          >
            <div className="ref-row">
              <button
                type="button"
                className={`icon-btn${copied ? " icon-btn--ok" : ""}`}
                onClick={handleCopy}
                aria-label="Copier"
                title="Copier"
              >
                {copied ? <CheckIcon size={19} /> : <CopyIcon size={19} />}
                <span className="icon-btn-label">{copied ? "Copié" : "Copier"}</span>
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={handleShare}
                aria-label="Partager"
                title="Partager"
              >
                <ShareIcon size={19} />
                <span className="icon-btn-label">Partager</span>
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={handleDownload}
                aria-label="Télécharger en image"
                title="Télécharger"
                disabled={busy}
              >
                <DownloadIcon size={19} />
                <span className="icon-btn-label">{busy ? "…" : "Télécharger"}</span>
              </button>
            </div>
            <div className="card-actions">
              <button className="ghost" onClick={onAnother}>
                Autre parole
              </button>
              <button className="cta cta--small" onClick={() => setShowChallenge(true)}>
                Voir le défi
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChallenge && (
          <>
            <motion.div
              className="sheet-mask"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChallenge(false)}
            />
            <div className="sheet-wrap" onClick={() => setShowChallenge(false)}>
              <motion.div
                className="sheet"
                initial={{ opacity: 0, scale: 0.88, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 16 }}
                transition={{ duration: 0.5, ease: easeOut }}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="ornament" style={{ color: "var(--wine)" }}>
                  <CardIconGlyph icon={card.icon} size={36} />
                </span>
                <p className="face-label">Défi spirituel</p>
                <p className="challenge">{card.challenge}</p>
                <Divider />
                <p className="footer-line">
                  La sainteté de la famille commence à la maison.
                </p>
                <button
                  className="ghost sheet-close"
                  onClick={() => setShowChallenge(false)}
                >
                  Fermer
                </button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* nœud hors écran capturé pour le téléchargement en image */}
      <div className="share-offscreen" aria-hidden>
        <ShareCard ref={shareRef} card={card} />
      </div>
    </>
  );
}
