"use client";

/* eslint-disable jsx-a11y/no-static-element-interactions -- modal backdrop is only a pointer shortcut, closable by its own button */

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { defaultTenantDemo, tenantStorageKey, type TenantDemoState } from "../../data/tenant-demo";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const slideIntervalMs = 5000;

export function PublicStore({ slug }: { slug: string }) {
  const [state, setState] = useState<TenantDemoState>(defaultTenantDemo);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const saved = window.localStorage.getItem(tenantStorageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as TenantDemoState;
      setState({ ...parsed, portal: { ...defaultTenantDemo.portal, ...parsed.portal } });
    } catch {
      /* datos de prueba corruptos: se ignoran */
    }
  }, []);

  const { portal, products } = state;
  const published = useMemo(() => products.filter((product) => product.published && product.stock > 0), [products]);
  const cartLines = useMemo(() => published.filter((product) => cart[product.id]).map((product) => ({ ...product, quantity: cart[product.id] })), [cart, published]);
  const cartTotal = cartLines.reduce((total, line) => total + line.price * line.quantity, 0);
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const bannerImages = portal.bannerImages;

  useEffect(() => {
    setSlide(0);
    if (bannerImages.length < 2) return;
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % bannerImages.length), slideIntervalMs);
    return () => window.clearInterval(timer);
  }, [bannerImages.length]);

  function add(productId: string) {
    const product = published.find((item) => item.id === productId);
    if (!product) return;
    setCart((current) => ({ ...current, [productId]: Math.min(product.stock, (current[productId] ?? 0) + 1) }));
  }

  function remove(productId: string) {
    setCart((current) => ({ ...current, [productId]: Math.max(0, (current[productId] ?? 0) - 1) }));
  }

  const message = encodeURIComponent(`Hola ${portal.storeName}, quiero hacer este pedido:\n${cartLines.map((line) => `• ${line.name} × ${line.quantity} — ${money.format(line.price * line.quantity)}`).join("\n")}\nTotal: ${money.format(cartTotal)}`);

  if (portal.slug !== slug) {
    return (
      <main className="public-store-missing">
        <div>
          <span className="public-store-badge">Nexo</span>
          <h1>Tienda no encontrada</h1>
          <p>El enlace <code>/tienda/{slug}</code> no corresponde a ningún emprendimiento publicado.</p>
        </div>
      </main>
    );
  }

  if (!portal.published) {
    return (
      <main className="public-store-missing">
        <div>
          <span className="public-store-badge">Nexo</span>
          <h1>{portal.storeName}</h1>
          <p>Esta tienda todavía no está publicada. Volvé a visitar este enlace más tarde.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="public-store" style={{ "--store-accent": portal.accent } as CSSProperties}>
      <header className="public-store-header">
        <div className="public-store-logo">
          {portal.storeName}
          <span>Detalles personalizados</span>
        </div>
        <button type="button" className="public-store-cart-button" onClick={() => setCartOpen(true)}>
          Carrito <b>{cartCount}</b>
        </button>
      </header>

      <section className="public-store-hero">
        {bannerImages.length > 0 && (
          <div className="public-store-hero-slides">
            {bannerImages.map((src, index) => (
              <div key={index} className={index === slide ? "public-store-slide active" : "public-store-slide"} style={{ backgroundImage: `url(${src})` }} />
            ))}
          </div>
        )}
        <div className="public-store-hero-content">
          <span className="public-store-eyebrow">Hecho especialmente para vos</span>
          <h1>{portal.headline}</h1>
          <p>{portal.description}</p>
          <button type="button" onClick={() => document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" })}>
            Ver productos
          </button>
        </div>
        {bannerImages.length > 1 && (
          <div className="public-store-hero-dots">
            {bannerImages.map((_, index) => (
              <button key={index} type="button" className={index === slide ? "active" : ""} aria-label={`Ir a la imagen ${index + 1}`} onClick={() => setSlide(index)} />
            ))}
          </div>
        )}
      </section>

      <section className="public-store-catalog" id="catalogo">
        <div className="public-store-catalog-head">
          <div>
            <span className="public-store-eyebrow">Catálogo</span>
            <h2>Elegí tu próximo regalo</h2>
          </div>
          <small>{published.length} productos disponibles</small>
        </div>
        <div className="public-store-grid">
          {published.map((product, index) => (
            <article key={product.id} className={`public-store-card tone-${index % 4}`}>
              <div className="public-store-thumb">
                {product.image ? <img src={product.image} alt={product.name} /> : <span>{product.category.slice(0, 1)}</span>}
                {product.stock <= product.minStock && <small>Últimas {product.stock}</small>}
              </div>
              <strong>{product.name}</strong>
              <p>{product.description || product.variant}</p>
              <footer>
                <b>{money.format(product.price)}</b>
                <button type="button" onClick={() => add(product.id)}>Agregar +</button>
              </footer>
            </article>
          ))}
          {published.length === 0 && <p className="public-store-empty">Todavía no hay productos publicados.</p>}
        </div>
      </section>

      <footer className="public-store-footer">
        <p>Catálogo de prueba gestionado con Nexo. Los pedidos se coordinan por WhatsApp.</p>
      </footer>

      {cartOpen && (
        <div className="public-store-modal-backdrop" onMouseDown={() => setCartOpen(false)}>
          <div className="public-store-modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="public-store-modal-close" type="button" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito">×</button>
            <span className="public-store-eyebrow">Pedido del portal</span>
            <h2>Tu carrito</h2>
            <div className="public-store-cart-lines">
              {cartLines.map((line) => (
                <div key={line.id}>
                  <span><strong>{line.name}</strong><small>{line.quantity} × {money.format(line.price)}</small></span>
                  <b>{money.format(line.quantity * line.price)}</b>
                  <button type="button" onClick={() => remove(line.id)} aria-label={`Quitar una unidad de ${line.name}`}>×</button>
                </div>
              ))}
              {cartLines.length === 0 && <div className="public-store-cart-empty">Todavía no agregaste productos.</div>}
            </div>
            <div className="public-store-cart-total"><span>Total del pedido</span><strong>{money.format(cartTotal)}</strong></div>
            {cartLines.length > 0 && (
              <a className="public-store-checkout" href={`https://wa.me/${portal.whatsapp}?text=${message}`} target="_blank" rel="noreferrer">
                Enviar pedido por WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
