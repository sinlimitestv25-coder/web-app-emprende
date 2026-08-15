import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const description = "Nexo reúne la gestión de productos, stock, clientes, pedidos y portal de ventas de cada emprendimiento en un espacio seguro.";

export const metadata: Metadata = {
  title: "Nexo — Gestión para emprendimientos",
  description,
  openGraph: {
    title: "Nexo — Gestión para emprendimientos",
    description,
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Nexo, gestión que crece con cada emprendimiento" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Nexo — Gestión para emprendimientos", description, images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
