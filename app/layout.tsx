import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const description = "Plataforma modular para administrar espacios, inventario, pedidos, clientes y portales de venta.";

  return {
    title: "Nexo — Gestión para emprendedores",
    description,
    openGraph: {
      title: "Nexo — Gestión para emprendedores",
      description,
      images: [{ url: `${origin}/og.png`, width: 1536, height: 1024, alt: "Nexo, gestión que crece con cada emprendimiento" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Nexo — Gestión para emprendedores",
      description,
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
