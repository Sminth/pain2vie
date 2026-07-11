import { forwardRef } from "react";
import type { HolyCard } from "@/data/cards";
import { CardIconGlyph, ChapelOrnament, Divider } from "./icons";

/* Carte téléchargeable (parole + défi) rendue hors écran à taille fixe.
 * Uniquement du CSS + SVG inline (aucune image externe) pour une capture fiable. */
const ShareCard = forwardRef<HTMLDivElement, { card: HolyCard }>(
  function ShareCard({ card }, ref) {
    return (
      <div ref={ref} className="share-card">
        <div className="share-frame" />

        <div className="share-head">
          <span className="share-emblem">
            <ChapelOrnament size={62} />
          </span>
          <p className="share-head-title">
            Fête des saints Louis &amp; Zélie Martin
          </p>
          <p className="share-head-sub">Dimanche 12 juillet</p>
        </div>

        <div className="share-block">
          <p className="share-label">La Parole</p>
          <p className="share-quote">«&nbsp;{card.quote}&nbsp;»</p>
          {card.reference && <p className="share-ref">{card.reference}</p>}
        </div>

        <div className="share-rule">
          <Divider />
        </div>

        <div className="share-block share-block--defi">
          <span className="share-icon">
            <CardIconGlyph icon={card.icon} size={52} />
          </span>
          <p className="share-label">Défi spirituel</p>
          <p className="share-challenge">{card.challenge}</p>
        </div>

        <p className="share-foot">
          La sainteté de la famille commence à la maison.
        </p>
      </div>
    );
  },
);

export default ShareCard;
