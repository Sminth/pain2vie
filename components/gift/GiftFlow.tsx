"use client";

import { useMemo } from "react";
import { decodeGift } from "@/lib/giftCodec";
import GiftCompose from "./GiftCompose";
import GiftReveal from "./GiftReveal";

export default function GiftFlow({ payload }: { payload?: string }) {
  const gift = useMemo(() => (payload ? decodeGift(payload) : null), [payload]);

  return (
    <main className="stage">
      <div className="grain" />
      {gift ? <GiftReveal payload={gift} /> : <GiftCompose />}
    </main>
  );
}
