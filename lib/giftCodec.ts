export interface GiftPayload {
  t: number; // id du thème
  m: string; // message écrit
  s: string; // id du style d'envoi
}

/* Le lien de partage encode tout le cadeau (thème + message + style) en
 * base64url — aucun serveur/stockage n'est nécessaire pour le faire vivre. */
export function encodeGift(data: GiftPayload): string {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeGift(raw: string): GiftPayload | null {
  try {
    let b64 = raw.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const data = JSON.parse(json);
    if (
      typeof data === "object" &&
      data !== null &&
      typeof data.t === "number" &&
      typeof data.m === "string" &&
      typeof data.s === "string" &&
      data.m.trim().length > 0
    ) {
      return { t: data.t, m: data.m, s: data.s };
    }
    return null;
  } catch {
    return null;
  }
}
