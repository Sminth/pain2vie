export type GiftStyleId = "envelope" | "plane" | "flower" | "burning" | "parchment" | "hearts";

export interface GiftTheme {
  id: number;
  title: string;
  emoji: string;
  color: string;
  colorDeep: string;
}

export interface GiftStyle {
  id: GiftStyleId;
  label: string;
}

export const GIFT_THEMES: GiftTheme[] = [
  { id: 1, title: "Merci pour ton engagement", emoji: "🙏", color: "#c9a659", colorDeep: "#a9822f" },
  { id: 2, title: "Tu es une bénédiction pour moi", emoji: "🕊️", color: "#c05b68", colorDeep: "#8a2535" },
  {
    id: 3,
    title: "Te voir travailler dans le champ de Dieu m’inspire",
    emoji: "🌾",
    color: "#d4747f",
    colorDeep: "#b8414e",
  },
  { id: 4, title: "Tu es un modèle", emoji: "⭐", color: "#c17a45", colorDeep: "#8f4f26" },
];

export const GIFT_STYLES: GiftStyle[] = [
  { id: "envelope", label: "Enveloppe" },
  { id: "plane", label: "Avion en papier" },
  { id: "flower", label: "Carte fleurie" },
  { id: "burning", label: "Carte qui brûle" },
  { id: "parchment", label: "Parchemin" },
  { id: "hearts", label: "Pluie de cœurs" },
];

export function giftThemeById(id: number): GiftTheme {
  return GIFT_THEMES.find((t) => t.id === id) ?? GIFT_THEMES[0];
}

export function giftStyleById(id: string): GiftStyle {
  return GIFT_STYLES.find((s) => s.id === id) ?? GIFT_STYLES[0];
}
