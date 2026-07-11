"use client";

import { useRef, useState } from "react";
import ShareCard from "@/components/ShareCard";
import { CARDS } from "@/data/cards";

export default function Preview() {
  const ref = useRef<HTMLDivElement>(null);
  const [out, setOut] = useState<string | null>(null);
  const card = CARDS[0]; // Josué 24,15 — verset + défi

  const gen = async () => {
    const { toPng } = await import("html-to-image");
    const url = await toPng(ref.current!, { pixelRatio: 1, cacheBust: true, backgroundColor: "#f8f3e8" });
    setOut(url);
  };

  return (
    <main className="stage" style={{ display: "block", overflow: "auto", minHeight: "100dvh", padding: 20 }}>
      <button className="cta cta--small" onClick={gen} style={{ marginBottom: 16 }}>
        Générer PNG
      </button>
      {/* aperçu réduit de la carte 1000px */}
      <div style={{ width: 1000, transform: "scale(0.36)", transformOrigin: "top left" }}>
        <ShareCard ref={ref} card={card} />
      </div>
      {out && (
        <div style={{ marginTop: -820 }}>
          <p style={{ font: "12px sans-serif", color: "#555" }}>PNG généré :</p>
          { /* eslint-disable-next-line @next/next/no-img-element */ }
          <img src={out} alt="png" style={{ width: 360, border: "1px solid #ccc" }} />
        </div>
      )}
    </main>
  );
}
