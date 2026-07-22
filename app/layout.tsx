import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const sans = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Thanksgiving - Mont Sinaï 2026",
  description:
    "Romains 12:10 (Louis Segond, 1910) — « Par amour fraternel, soyez pleins d’affection les uns pour les autres. Par honneur, prévenez-vous les uns les autres. »",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Thanksgiving - Mont Sinaï 2026",
    description:
      "Romains 12:10 (Louis Segond, 1910) — « Par amour fraternel, soyez pleins d’affection les uns pour les autres. Par honneur, prévenez-vous les uns les autres. »",
    locale: "fr_FR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f9f2e4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
