"use client";

/* eslint-disable jsx-a11y/no-static-element-interactions -- modal backdrop is only a pointer shortcut, closable by its own button */

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { defaultTenantDemo, migrateBanners, migrateCategories, migrateOrders, tenantStorageKey, type Banner, type Order, type TenantDemoState } from "../../data/tenant-demo";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", currencyDisplay: "symbol", maximumFractionDigits: 0 });
const slideIntervalMs = 5000;

export function PublicStore({ slug }: { slug: string }) {
  const [state, setState] = useState<TenantDemoState>(defaultTenantDemo);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [notice, setNotice] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(tenantStorageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as TenantDemoState;
      setState({
        ...parsed,
        portal: { ...defaultTenantDemo.portal, ...parsed.portal, banners: migrateBanners(parsed.portal) },
        categories: parsed.categories?.length ? migrateCategories(parsed.categories) : defaultTenantDemo.categories,
        orders: migrateOrders(parsed.orders),
      });
    } catch {
      /* datos de prueba corruptos: se ignoran */
    }
  }, []);

  const { portal, products } = state;
  const banners = portal.banners;
  const published = useMemo(() => products.filter((product) => product.published && product.stock > 0), [products]);
  const filtered = useMemo(() => published.filter((product) => {
    if (categoryFilter && product.category !== categoryFilter) return false;
    if (!searchText.trim()) return true;
    const haystack = `${product.name} ${product.description} ${product.category} ${product.subcategory ?? ""}`.toLowerCase();
    return haystack.includes(searchText.trim().toLowerCase());
  }), [published, categoryFilter, searchText]);
  const cartLines = useMemo(() => published.filter((product) => cart[product.id]).map((product) => ({ ...product, quantity: cart[product.id] })), [cart, published]);
  const cartTotal = cartLines.reduce((total, line) => total + line.price * line.quantity, 0);
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);

  useEffect(() => {
    setSlide(0);
    if (banners.length < 2) return;
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % banners.length), slideIntervalMs);
    return () => window.clearInterval(timer);
  }, [banners.length]);

  function openBanner(banner: Banner) {
    if (banner.linkType === "category") { setCategoryFilter(banner.linkValue); setSearchText(""); }
    else if (banner.linkType === "subcategory" || banner.linkType === "keyword") { setCategoryFilter(""); setSearchText(banner.linkValue); }
    else return;
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  }

  function add(productId: string) {
    const product = published.find((item) => item.id === productId);
    if (!product) return;
    setCart((current) => ({ ...current, [productId]: Math.min(product.stock, (current[productId] ?? 0) + 1) }));
  }

  function remove(productId: string) {
    setCart((current) => ({ ...current, [productId]: Math.max(0, (current[productId] ?? 0) - 1) }));
  }

  function flash(text: string) {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2800);
  }

  const message = encodeURIComponent(`Hola ${portal.storeName}, quiero hacer este pedido:\n${cartLines.map((line) => `• ${line.name} × ${line.quantity} — ${money.format(line.price * line.quantity)}`).join("\n")}\nTotal: ${money.format(cartTotal)}`);
  const whatsappUrl = `https://wa.me/${portal.whatsapp}?text=${message}`;

  function checkout() {
    if (!buyerName.trim() || !buyerPhone.trim()) {
      flash("Ingresá tu nombre y tu WhatsApp para enviar el pedido.");
      return;
    }

    const saved = window.localStorage.getItem(tenantStorageKey);
    let latest = state;
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as TenantDemoState;
        latest = { ...parsed, orders: migrateOrders(parsed.orders) };
      } catch {
        latest = state;
      }
    }

    const phoneDigits = buyerPhone.replace(/\D/g, "");
    const existing = latest.customers.find((customer) => customer.phone.replace(/\D/g, "") === phoneDigits);
    const customer = existing ?? { id: `cli_${Date.now()}`, name: buyerName.trim(), phone: buyerPhone.trim(), email: "", notes: "Pedido realizado desde el portal." };
    const customers = existing ? latest.customers : [customer, ...latest.customers];

    const newOrder: Order = {
      id: `PED-${1049 + latest.orders.length}`,
      customerId: customer.id,
      customerName: customer.name,
      items: cartLines.map((line) => ({ productId: line.id, productName: line.name, quantity: line.quantity, unitPrice: line.price })),
      total: cartTotal,
      status: "Nuevo",
      createdAt: "Portal · ahora",
      stockCommitted: false,
    };

    const updated: TenantDemoState = { ...latest, customers, orders: [newOrder, ...latest.orders] };
    try {
      window.localStorage.setItem(tenantStorageKey, JSON.stringify(updated));
    } catch {
      flash("No se pudo guardar el pedido en este dispositivo, pero se abrirá WhatsApp igual.");
    }
    setState(updated);
    window.open(whatsappUrl, "_blank", "noreferrer");
    setCart({});
    setBuyerName("");
    setBuyerPhone("");
    setCartOpen(false);
  }

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
      {notice && <div className="public-store-toast" role="status">{notice}</div>}
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
        {banners.length > 0 && (
          <div className="public-store-hero-slides">
            {banners.map((banner, index) => (
              <div key={index} className={index === slide ? "public-store-slide active" : "public-store-slide"} style={{ backgroundImage: `url(${banner.image})` }} />
            ))}
          </div>
        )}
        <div className={banners[slide] && banners[slide].linkType !== "none" ? "public-store-hero-content is-clickable" : "public-store-hero-content"} onClick={banners[slide] && banners[slide].linkType !== "none" ? () => openBanner(banners[slide]) : undefined}>
          <span className="public-store-eyebrow">Hecho especialmente para vos</span>
          <h1>{banners[slide]?.title || portal.headline}</h1>
          <p>{portal.description}</p>
          <button type="button" onClick={(event) => { event.stopPropagation(); document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }}>
            Ver productos
          </button>
        </div>
        {banners.length > 1 && (
          <div className="public-store-hero-dots">
            {banners.map((_, index) => (
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
          <small>{filtered.length} productos disponibles</small>
        </div>
        <div className="public-store-filters">
          <div className="public-store-category-chips">
            <button type="button" className={!categoryFilter ? "active" : ""} onClick={() => setCategoryFilter("")}>Todos</button>
            {state.categories.map((category) => (
              <button key={category.name} type="button" className={categoryFilter === category.name ? "active" : ""} onClick={() => setCategoryFilter(category.name)}>{category.name}</button>
            ))}
          </div>
          <input className="public-store-search" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Buscar por material, tema, nombre…" />
        </div>
        <div className="public-store-grid">
          {filtered.map((product, index) => (
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
          {published.length > 0 && filtered.length === 0 && <p className="public-store-empty">No encontramos productos con ese filtro.</p>}
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
              <div className="public-store-buyer-form">
                <label>Tu nombre<input value={buyerName} onChange={(event) => setBuyerName(event.target.value)} placeholder="Nombre y apellido" /></label>
                <label>Tu WhatsApp<input value={buyerPhone} onChange={(event) => setBuyerPhone(event.target.value)} placeholder="+54 9…" /></label>
                <button type="button" className="public-store-checkout" onClick={checkout}>
                  Enviar pedido por WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
