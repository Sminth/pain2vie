import type { CardIcon } from "@/data/cards";

/* Chapelle avec cœur — reprend l'emblème des cartes imprimées */
export function ChapelOrnament({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M24 4v5" />
      <path d="M21 6.5h6" />
      <path d="M10 24 24 12l14 12" />
      <path d="M13 22v18h22V22" />
      <path d="M24 34c-4.4-3-5-6-2.8-7.4 1.3-.8 2.5-.1 2.8.8.3-.9 1.5-1.6 2.8-.8 2.2 1.4 1.6 4.4-2.8 7.4Z" />
    </svg>
  );
}

/* Petit séparateur : ligne — cœur — ligne */
export function Divider() {
  return (
    <svg
      className="divider"
      viewBox="0 0 80 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden
    >
      <line x1="2" y1="6" x2="30" y2="6" />
      <path d="M40 9C36.6 6.7 36.2 4.4 37.9 3.3c1-.6 1.9-.1 2.1.6.2-.7 1.1-1.2 2.1-.6 1.7 1.1 1.3 3.4-2.1 5.7Z" />
      <line x1="50" y1="6" x2="78" y2="6" />
    </svg>
  );
}

/* Copier : deux feuillets superposés */
export function CopyIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="9" width="11" height="11" rx="2.4" />
      <path d="M5 15V5.5A1.5 1.5 0 0 1 6.5 4H15" />
    </svg>
  );
}

/* Partager : nœud relié (icône système iOS/Android) */
export function ShareIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3v13" />
      <path d="M8 7l4-4 4 4" />
      <path d="M6 12H5a1.6 1.6 0 0 0-1.6 1.6V19A1.6 1.6 0 0 0 5 20.6h14A1.6 1.6 0 0 0 20.6 19v-5.4A1.6 1.6 0 0 0 19 12h-1" />
    </svg>
  );
}

/* Télécharger : flèche vers un plateau */
export function DownloadIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3v11" />
      <path d="M8 10.5l4 4 4-4" />
      <path d="M5 20.5h14" />
    </svg>
  );
}

/* Coche : confirmation « copié » */
export function CheckIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12.5l4.2 4.2L19 7" />
    </svg>
  );
}

const ICON_PATHS: Record<CardIcon, React.ReactNode> = {
  flame: (
    <>
      <path d="M12 3c1.2 3.2 5 5.4 5 9.6a5 5 0 0 1-10 0C7 8.4 10.8 6.2 12 3Z" />
      <path d="M12 12.4c.7 1.3 1.8 2 1.8 3.5a1.8 1.8 0 0 1-3.6 0c0-1.5 1.1-2.2 1.8-3.5Z" />
    </>
  ),
  house: (
    <>
      <path d="M4.5 11 12 4.5 19.5 11" />
      <path d="M6.5 9.5V20h11V9.5" />
      <path d="M12 16.8c-2.6-1.8-3-3.6-1.7-4.4.8-.5 1.5-.1 1.7.5.2-.6.9-1 1.7-.5 1.3.8.9 2.6-1.7 4.4Z" />
    </>
  ),
  heart: (
    <path d="M12 19.5C5.8 15.2 5 10.8 7.7 8.9c1.7-1.2 3.5-.3 4.3 1 .8-1.3 2.6-2.2 4.3-1 2.7 1.9 1.9 6.3-4.3 10.6Z" />
  ),
  dove: (
    <>
      <path d="M20.5 6.5 18 8c0 5.5-3.6 9.5-9.5 9.5-1.8 0-3.2-.6-4-1.5 2.8-.4 4.6-1.5 5.8-3.2C8 12.3 6.6 10.4 6.8 7.6c1.9 1.9 3.9 2.7 6.2 2.4.4-2.2 1.9-3.5 4-3.5.9 0 2.4.5 3.5 0Z" />
      <path d="m21 9-2 2" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.2C10.2 4.8 7.2 4.7 4.5 5.6v12.8c2.7-.9 5.7-.8 7.5.6 1.8-1.4 4.8-1.5 7.5-.6V5.6c-2.7-.9-5.7-.8-7.5.6Z" />
      <path d="M12 6.2V19" />
    </>
  ),
  cross: (
    <>
      <path d="M12 4.5v15" />
      <path d="M6.8 9.5h10.4" />
    </>
  ),
};

export function CardIconGlyph({ icon, size = 34 }: { icon: CardIcon; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {ICON_PATHS[icon]}
    </svg>
  );
}
