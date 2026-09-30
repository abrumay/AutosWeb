import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { sitio } from "@/config/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });

export const metadata: Metadata = {
  title: { default: `${sitio.nombre} ${sitio.rubro} | Mar del Plata`, template: `%s | ${sitio.nombre}` },
  description: sitio.descripcion,
};

export const viewport: Viewport = {
  themeColor: "#1b1a5e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
