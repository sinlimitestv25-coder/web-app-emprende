import type { Metadata } from "next";
import { PublicStore } from "../../components/store/PublicStore";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${slug} — Tienda en Nexo` };
}

export default async function TiendaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PublicStore slug={slug} />;
}
