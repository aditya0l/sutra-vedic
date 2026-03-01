import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sutra Vedic — Produits Naturels & Ayurvédiques",
  description: "Découvrez notre gamme de produits naturels et ayurvédiques de qualité premium.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
