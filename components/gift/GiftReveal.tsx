"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { giftThemeById, type GiftStyleId } from "@/data/gifts";
import type { GiftPayload } from "@/lib/giftCodec";
import GiftOpener from "./GiftOpeners";
import { GiftIcon } from "../icons";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function GiftReveal({ payload }: { payload: GiftPayload }) {
  const [revealed, setRevealed] = useState(false);
  const theme = giftThemeById(payload.t);
  const styleId = payload.s as GiftStyleId;

  return (
    <motion.section
      className="scene gift-reveal-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: easeOut }}
    >
      <GiftOpener
        styleId={styleId}
        theme={theme}
        message={payload.m}
        onDone={() => setRevealed(true)}
      />

      <AnimatePresence>
        {revealed && (
          <motion.div
            className="reveal-ui gift-reveal-ui"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
          >
            <Link href="/cadeau" className="gift-again-btn">
              <motion.span
                className="gift-again-glow"
                animate={{ opacity: [0.4, 0.75, 0.4] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              />
              <span className="gift-again-icon">
                <GiftIcon size={18} />
              </span>
              Envoyer un cadeau à mon tour
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
