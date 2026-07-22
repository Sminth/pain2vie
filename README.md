# La sainteté de la famille — Pioche une carte

Expérience web pour la fête des saints Louis et Zélie Martin :
on ouvre le lien, on lit le message d'accueil, on touche le paquet,
et on reçoit une carte — une **parole** à méditer (recto) et un
**défi spirituel** à vivre (verso), avec un retournement 3D de la carte.

- 30 cartes (versets, citations des papes, CEC, sainte Thérèse…)
- Pioche aléatoire **sans doublon** : les cartes déjà reçues sont mémorisées
  sur l'appareil (localStorage) ; après les 30, le paquet est remélangé.
- Mobile-first (pensé pour un lien partagé sur WhatsApp), fonctionne aussi sur desktop.
- Next.js (App Router) + Framer Motion, rendu 100 % statique.

## Développement

```bash
npm install
npm run dev        # http://localhost:3000
```

## Déploiement

```bash
npm run build      # site statique, prêt pour Vercel / Netlify
```

Le plus simple : pousser le repo sur GitHub puis l'importer sur https://vercel.com —
aucun réglage nécessaire.

## Modifier les cartes

Tout le contenu est dans [`data/cards.ts`](data/cards.ts) :
`quote` (recto), `reference`, `challenge` (verso), `icon`
(`flame`, `house`, `heart`, `dove`, `book`, `cross`).
# Thanksgiving-Mont Sina
