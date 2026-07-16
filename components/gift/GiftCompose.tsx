"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { GIFT_STYLES, GIFT_THEMES, type GiftStyleId } from "@/data/gifts";
import { encodeGift } from "@/lib/giftCodec";
import { CornerFlora } from "../flowers";
import {
  CheckIcon,
  CopyIcon,
  EnvelopeIcon,
  FlowerIcon,
  HeartLineIcon,
  ParchmentIcon,
  PaperPlaneIcon,
  ShareIcon,
  CardIconGlyph,
} from "../icons";
import { GiftSender } from "./GiftOpeners";
import GiftStylePreview from "./GiftStylePreview";

const easeOut = [0.22, 1, 0.36, 1] as const;

type Phase = "pick" | "style" | "sending" | "share";

function StyleGlyph({ id, size = 26 }: { id: GiftStyleId; size?: number }) {
  switch (id) {
    case "envelope":
      return <EnvelopeIcon size={size} />;
    case "plane":
      return <PaperPlaneIcon size={size} />;
    case "flower":
      return <FlowerIcon size={size} />;
    case "burning":
      return <CardIconGlyph icon="flame" size={size} />;
    case "parchment":
      return <ParchmentIcon size={size} />;
    case "hearts":
      return <HeartLineIcon size={size} />;
  }
}

/* boucle d'apparition distincte par carte, pour que la grille ne soit pas statique */
const CARD_IDLE: Array<{
  animate: Record<string, number[]>;
  transition: Record<string, unknown>;
}> = [
  { animate: { y: [0, -7, 0] }, transition: { duration: 3.2, repeat: Infinity, ease: easeOut } },
  { animate: { rotate: [-2.5, 2.5, -2.5] }, transition: { duration: 3.6, repeat: Infinity, ease: easeOut } },
  { animate: { scale: [1, 1.045, 1] }, transition: { duration: 2.6, repeat: Infinity, ease: easeOut } },
  {
    animate: { y: [0, -5, 0], rotate: [1.6, -1.6, 1.6] },
    transition: { duration: 3.8, repeat: Infinity, ease: easeOut },
  },
  {
    animate: { y: [0, -4, 0], scale: [1, 1.03, 1] },
    transition: { duration: 3, repeat: Infinity, ease: easeOut, delay: 0.3 },
  },
];

export default function GiftCompose() {
  const [phase, setPhase] = useState<Phase>("pick");
  const [pickedId, setPickedId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [styleId, setStyleId] = useState<GiftStyleId | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const theme = useMemo(
    () => GIFT_THEMES.find((t) => t.id === pickedId) ?? null,
    [pickedId],
  );

  const link = useMemo(() => {
    if (!theme || !styleId || typeof window === "undefined") return "";
    const payload = encodeGift({ t: theme.id, m: message.trim(), s: styleId });
    return `${window.location.origin}/cadeau?g=${payload}`;
  }, [theme, styleId, message]);

  const shareText = "Je t'ai envoyé un magnifique cadeau, clique sur le lien pour le voir 🎁";

  const handleShare = async () => {
    if (busy || !link) return;
    setBusy(true);
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "Un cadeau pour toi", text: shareText, url: link });
        return;
      }
    } catch {
      /* partage annulé */
    } finally {
      setBusy(false);
    }
    try {
      await navigator.clipboard.writeText(`${shareText}\n${link}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papiers indisponible */
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papiers indisponible */
    }
  };

  return (
    <div className="gift-compose">
      <Link href="/" className="gift-close" aria-label="Fermer">
        ×
      </Link>

      <AnimatePresence mode="wait">
        {phase === "pick" && (
          <motion.div
            key="pick"
            className="gift-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
          >
            <p className="eyebrow">Un cadeau à offrir</p>
            <h1 className="gift-step-title">Choisis une carte</h1>
            <p className="gift-step-lede">
              Sélectionne le thème qui te parle, puis écris ton message.
            </p>

            <AnimatePresence mode="wait">
              {!theme ? (
                <motion.div
                  key="grid"
                  className="gift-cards"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: easeOut }}
                >
                  {GIFT_THEMES.map((t, i) => (
                    <motion.button
                      key={t.id}
                      type="button"
                      className="gift-card-face gift-card-face--front"
                      style={{
                        background: `linear-gradient(160deg, ${t.color}, ${t.colorDeep})`,
                      }}
                      onClick={() => setPickedId(t.id)}
                      aria-label={t.title}
                      {...CARD_IDLE[i % CARD_IDLE.length]}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <span className="gift-card-mark" aria-hidden>
                        ✦
                      </span>
                      <span className="gift-card-title">{t.title}</span>
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="single"
                  className="gift-card-single"
                  initial={{ opacity: 0, rotateY: -90, scale: 0.9 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.55, ease: easeOut }}
                >
                  <div className="gift-card-face gift-card-face--back" style={{ borderColor: theme.colorDeep }}>
                    <CornerFlora />
                    <p className="gift-card-back-title" style={{ color: theme.colorDeep }}>
                      {theme.title}
                    </p>
                    <textarea
                      className="gift-textarea"
                      placeholder="Écris ton message ici…"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={600}
                      autoFocus
                    />
                    <div className="gift-card-back-actions">
                      <button
                        type="button"
                        className="ghost"
                        onClick={() => {
                          setPickedId(null);
                          setMessage("");
                        }}
                      >
                        Changer
                      </button>
                      <button
                        type="button"
                        className="cta cta--small"
                        disabled={message.trim().length === 0}
                        onClick={() => setPhase("style")}
                      >
                        Terminer
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {phase === "style" && theme && (
          <motion.div
            key="style"
            className="gift-step"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: easeOut }}
          >
            <p className="eyebrow">Presque prêt</p>
            <h1 className="gift-step-title">Choisis l&apos;animation d&apos;envoi</h1>
            <p className="gift-step-lede">
              Le destinataire découvrira ton message avec ce style à l&apos;ouverture.
            </p>

            <div className="gift-style-grid">
              {GIFT_STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`gift-style-chip gift-style-chip--${s.id}${styleId === s.id ? " gift-style-chip--on" : ""}`}
                  onClick={() => {
                    setStyleId(s.id);
                    setPhase("sending");
                  }}
                >
                  <span className="gsp">
                    <GiftStylePreview id={s.id} color={theme.color} colorDeep={theme.colorDeep} />
                  </span>
                  <span className="gift-style-caption">{s.label}</span>
                </button>
              ))}
            </div>

            <button type="button" className="ghost gift-back" onClick={() => setPhase("pick")}>
              Retour
            </button>
          </motion.div>
        )}

        {phase === "sending" && theme && styleId && (
          <motion.div
            key="sending"
            className="gift-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
          >
            <p className="eyebrow">Un instant</p>
            <h1 className="gift-step-title">Ton cadeau s&apos;envole…</h1>
            <GiftSender
              styleId={styleId}
              theme={theme}
              message={message}
              onDone={() => setPhase("share")}
            />
          </motion.div>
        )}

        {phase === "share" && theme && styleId && (
          <motion.div
            key="share"
            className="gift-step"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: easeOut }}
          >
            <p className="eyebrow">C&apos;est prêt</p>
            <h1 className="gift-step-title">Envoie ton cadeau</h1>

            <div
              className="gift-preview"
              style={{ background: `linear-gradient(160deg, ${theme.color}, ${theme.colorDeep})` }}
            >
              <span className="gift-preview-icon">
                <StyleGlyph id={styleId} size={22} />
              </span>
              <p className="gift-preview-title">{theme.title}</p>
              <p className="gift-preview-msg">{message}</p>
            </div>

            <div className="ref-row">
              <button
                type="button"
                className={`icon-btn${copied ? " icon-btn--ok" : ""}`}
                onClick={handleCopy}
              >
                {copied ? <CheckIcon size={19} /> : <CopyIcon size={19} />}
                <span className="icon-btn-label">{copied ? "Copié" : "Copier le lien"}</span>
              </button>
              <button type="button" className="icon-btn" onClick={handleShare} disabled={busy}>
                <ShareIcon size={19} />
                <span className="icon-btn-label">Partager</span>
              </button>
            </div>

            <button type="button" className="ghost gift-back" onClick={() => setPhase("style")}>
              Retour
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
