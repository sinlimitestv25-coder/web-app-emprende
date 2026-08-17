"use client";

/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/label-has-associated-control -- nested native controls remain labelled; modal backdrop is only a pointer shortcut */

import { useMemo, useState, type CSSProperties, type Dispatch, type SetStateAction } from "react";
import type { PortalSettings, TenantDemoState } from "../../data/tenant-demo";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export function TenantPortal({ state, setState, flash }: { state: TenantDemoState; setState: Dispatch<SetStateAction<TenantDemoState>>; flash: (message: string) => void }) {
  const [draft, setDraft] = useState<PortalSettings>(state.portal);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const published = state.products.filter((product) => product.published && product.stock > 0);
  const cartLines = useMemo(() => published.filter((product) => cart[product.id]).map((product) => ({ ...product, quantity: cart[product.id] })), [cart, published]);
  const cartTotal = cartLines.reduce((total, line) => total + line.price * line.quantity, 0);
  const storePath = `/tienda/${draft.slug}`;
  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}${storePath}` : storePath;

  function setSlug(value: string) {
    setDraft({ ...draft, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") });
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      flash("Enlace del portal copiado.");
    } catch {
      flash("No se pudo copiar el enlace. Copialo manualmente.");
    }
  }

  function save() {
    setState((current) => ({ ...current, portal: draft }));
    flash("Los cambios del portal quedaron publicados en la demostración.");
  }

  function add(productId: string) {
    const product = published.find((item) => item.id === productId);
    if (!product) return;
    setCart((current) => ({ ...current, [productId]: Math.min(product.stock, (current[productId] ?? 0) + 1) }));
    flash(`${product.name} se agregó al carrito.`);
  }

  const message = encodeURIComponent(`Hola ${draft.storeName}, quiero hacer este pedido:\n${cartLines.map((line) => `• ${line.name} × ${line.quantity} — ${money.format(line.price * line.quantity)}`).join("\n")}\nTotal: ${money.format(cartTotal)}`);

  return <>
    <div className="page-heading"><div><p className="eyebrow">Vidriera online</p><h1>Portal de ventas</h1><p>Editá tu identidad, controlá lo publicado y probá el pedido por WhatsApp.</p></div><div className="heading-actions"><span className={state.portal.published ? "status success" : "status neutral"}>{state.portal.published ? "Portal publicado" : "Portal en borrador"}</span><button className="button primary" onClick={save}>Guardar y publicar</button></div></div>
    <div className="portal-workspace">
      <aside className="panel portal-editor"><div className="panel-title"><div><h2>Identidad del portal</h2><p>Los cambios se ven en la vista previa.</p></div></div><div className="portal-form"><label>Nombre del emprendimiento<input value={draft.storeName} onChange={(event) => setDraft({ ...draft, storeName: event.target.value })} /></label><label>Título principal<input value={draft.headline} onChange={(event) => setDraft({ ...draft, headline: event.target.value })} /></label><label>Descripción<textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label><label>Dirección del portal<span className="portal-slug-field"><span>/tienda/</span><input value={draft.slug} onChange={(event) => setSlug(event.target.value)} /></span></label><label>WhatsApp<input value={draft.whatsapp} onChange={(event) => setDraft({ ...draft, whatsapp: event.target.value.replace(/\D/g, "") })} /></label><label>Color de marca<span className="color-field"><input type="color" value={draft.accent} onChange={(event) => setDraft({ ...draft, accent: event.target.value })} /><code>{draft.accent}</code></span></label><label className="publish-check"><input type="checkbox" checked={draft.published} onChange={(event) => setDraft({ ...draft, published: event.target.checked })} /><span><strong>Portal visible</strong><small>Permití que tus clientes lo visiten.</small></span></label><div className="portal-link"><span>{publicUrl}</span><span className="portal-link-actions"><a href={storePath} target="_blank" rel="noreferrer">Abrir</a><button type="button" onClick={copyLink}>Copiar</button></span></div></div></aside>
      <section className="portal-browser portal-live" style={{ "--store-accent": draft.accent } as CSSProperties}><div className="browser-bar"><i /><i /><i /><span>{publicUrl.replace(/^https?:\/\//, "")}</span></div><div className="storefront"><header><div className="store-logo" style={{ color: draft.accent }}>{draft.storeName}<span>DETALLES PERSONALIZADOS</span></div><nav>Inicio &nbsp; Productos &nbsp; Ofertas</nav><button onClick={() => setCartOpen(true)}>Carrito <b style={{ background: draft.accent }}>{Object.values(cart).reduce((total, quantity) => total + quantity, 0)}</b></button></header><section className="store-hero"><div><span style={{ color: draft.accent }}>HECHO ESPECIALMENTE PARA VOS</span><h2>{draft.headline}</h2><p>{draft.description}</p><button style={{ background: draft.accent }} onClick={() => document.getElementById("demo-catalog")?.scrollIntoView({ behavior: "smooth" })}>Ver productos</button></div><div className="hero-object"><i /><i /><b>LC</b></div></section><section className="store-catalog" id="demo-catalog"><div className="catalog-head"><div><span style={{ color: draft.accent }}>CATÁLOGO</span><h3>Elegí tu próximo regalo</h3></div><small>{published.length} productos disponibles</small></div><div className="catalog-grid tenant-catalog">{published.map((product, index) => <article key={product.id}><div className={`portal-product product-tone-${index % 4}`}><span>{product.category.slice(0, 1)}</span>{product.stock <= product.minStock && <small>Últimas {product.stock}</small>}</div><strong>{product.name}</strong><p>{product.variant}</p><footer><b>{money.format(product.price)}</b><button onClick={() => add(product.id)} style={{ color: draft.accent }}>Agregar +</button></footer></article>)}</div></section></div></section>
    </div>
    <div className="portal-automation-note"><span>✓</span><div><strong>Portal conectado al inventario de prueba</strong><p>Un producto con stock cero se oculta; al reponerlo podés volver a publicarlo desde Productos y stock.</p></div></div>
    {cartOpen && <div className="modal-backdrop" onMouseDown={() => setCartOpen(false)}><div className="modal cart-modal" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setCartOpen(false)}>×</button><p className="eyebrow">Pedido del portal</p><h2>Tu carrito</h2><p>Esta simulación arma el mensaje que recibirá el emprendimiento.</p><div className="cart-lines">{cartLines.map((line) => <div key={line.id}><span><strong>{line.name}</strong><small>{line.quantity} × {money.format(line.price)}</small></span><b>{money.format(line.quantity * line.price)}</b><button onClick={() => setCart((current) => ({ ...current, [line.id]: Math.max(0, current[line.id] - 1) }))}>×</button></div>)}{cartLines.length === 0 && <div className="empty-state">Todavía no agregaste productos.</div>}</div><div className="cart-total"><span>Total del pedido</span><strong>{money.format(cartTotal)}</strong></div>{cartLines.length > 0 && <a className="button primary full whatsapp-checkout" href={`https://wa.me/${draft.whatsapp}?text=${message}`} target="_blank" rel="noreferrer">Enviar pedido por WhatsApp</a>}</div></div>}
  </>;
}
