"use client";

/* eslint-disable jsx-a11y/no-static-element-interactions -- modal backdrop is only a pointer shortcut, closable by its own button */

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  defaultTenantDemo,
  migrateBanners,
  migrateCategories,
  migrateOrders,
  migrateProducts,
  productStock,
  tenantStorageKey,
  type Banner,
  type Order,
  type Product,
  type ProductVariant,
  type StockRequest,
  type TenantDemoState,
} from "../../data/tenant-demo";
import { LegalModal, type LegalDoc } from "../ui/LegalFooter";
import { AppIcon } from "../ui/AppIcon";
import { version } from "../../../package.json";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", currencyDisplay: "symbol", maximumFractionDigits: 0 });
const slideIntervalMs = 5000;

type CartLine = {
  key: string;
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  price: number;
  image: string;
  quantity: number;
};

function cartKey(productId: string, variantId: string) {
  return `${productId}::${variantId}`;
}

function readLatestState(fallback: TenantDemoState): TenantDemoState {
  const saved = window.localStorage.getItem(tenantStorageKey);
  if (!saved) return fallback;
  try {
    const parsed = JSON.parse(saved) as TenantDemoState;
    return {
      ...parsed,
      products: migrateProducts(parsed.products),
      orders: migrateOrders(parsed.orders),
      stockRequests: Array.isArray(parsed.stockRequests) ? parsed.stockRequests : [],
      faqs: Array.isArray(parsed.faqs) ? parsed.faqs : fallback.faqs,
      shippingZones: Array.isArray(parsed.shippingZones) ? parsed.shippingZones : fallback.shippingZones,
    };
  } catch {
    return fallback;
  }
}

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
  const [selectedVariant, setSelectedVariant] = useState<Record<string, string>>({});
  const [notifyFor, setNotifyFor] = useState<{ product: Product; variant: ProductVariant | null } | null>(null);
  const [requestName, setRequestName] = useState("");
  const [requestPhone, setRequestPhone] = useState("");
  const [legalOpen, setLegalOpen] = useState<LegalDoc | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid-lg" | "grid-sm" | "list">("grid-lg");
  const [deliveryMethod, setDeliveryMethod] = useState<"" | "envio" | "retiro">("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"" | "transferencia" | "mercadopago" | "efectivo" | "tarjeta">("");

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
        products: migrateProducts(parsed.products),
        stockRequests: Array.isArray(parsed.stockRequests) ? parsed.stockRequests : [],
        faqs: Array.isArray(parsed.faqs) ? parsed.faqs : defaultTenantDemo.faqs,
        shippingZones: Array.isArray(parsed.shippingZones) ? parsed.shippingZones : defaultTenantDemo.shippingZones,
      });
    } catch {
      /* datos de prueba corruptos: se ignoran */
    }
  }, []);

  const { portal, products, faqs } = state;
  const banners = portal.banners;
  const published = useMemo(() => products.filter((product) => {
    if (!product.published) return false;
    const stock = productStock(product);
    return stock > 0 || !product.hideWhenOutOfStock;
  }), [products]);
  const filtered = useMemo(() => published.filter((product) => {
    if (categoryFilter && product.category !== categoryFilter) return false;
    if (!searchText.trim()) return true;
    const haystack = `${product.name} ${product.description} ${product.category} ${product.subcategory ?? ""}`.toLowerCase();
    return haystack.includes(searchText.trim().toLowerCase());
  }), [published, categoryFilter, searchText]);

  function variantFor(product: Product): ProductVariant | null {
    if (product.variants.length === 0) return null;
    const selectedId = selectedVariant[product.id];
    if (selectedId) return product.variants.find((item) => item.id === selectedId) ?? product.variants[0];
    return product.variants.find((item) => item.stock > 0) ?? product.variants[0];
  }

  const cartLines = useMemo(() => {
    const lines: CartLine[] = [];
    for (const [key, quantity] of Object.entries(cart)) {
      if (!quantity) continue;
      const [productId, variantId] = key.split("::");
      const product = published.find((item) => item.id === productId);
      if (!product) continue;
      const variant = variantId ? product.variants.find((item) => item.id === variantId) : undefined;
      lines.push({
        key,
        productId,
        productName: product.name,
        variantId: variantId || "",
        variantName: variant?.name ?? "",
        price: variant ? variant.price : product.price,
        image: variant?.image || product.image,
        quantity,
      });
    }
    return lines;
  }, [cart, published]);
  const cartTotal = cartLines.reduce((total, line) => total + line.price * line.quantity, 0);
  const cartCount = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  const matchedZone = deliveryMethod === "envio" && postalCode.trim()
    ? state.shippingZones.find((zone) => zone.prefixes.some((prefix) => postalCode.trim().startsWith(prefix))) ?? null
    : null;
  const shippingCost = matchedZone ? matchedZone.cost : 0;
  const orderTotal = cartTotal + shippingCost;

  useEffect(() => {
    setSlide(0);
    if (banners.length < 2) return;
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % banners.length), slideIntervalMs);
    return () => window.clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = portal.logo || "/nexo-icon.png";
  }, [portal.logo]);

  function openBanner(banner: Banner) {
    if (banner.linkType === "category") { setCategoryFilter(banner.linkValue); setSearchText(""); }
    else if (banner.linkType === "subcategory" || banner.linkType === "keyword") { setCategoryFilter(""); setSearchText(banner.linkValue); }
    else return;
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  }

  function add(product: Product, variant: ProductVariant | null) {
    const key = cartKey(product.id, variant?.id ?? "");
    const stock = variant ? variant.stock : productStock(product);
    setCart((current) => ({ ...current, [key]: Math.min(stock, (current[key] ?? 0) + 1) }));
  }

  function remove(key: string) {
    setCart((current) => ({ ...current, [key]: Math.max(0, (current[key] ?? 0) - 1) }));
  }

  function flash(text: string) {
    setNotice(text);
    window.setTimeout(() => setNotice(""), 2800);
  }

  function consultUrl(product: Product) {
    const text = encodeURIComponent(`Hola ${portal.storeName}, quería consultar sobre "${product.name}".`);
    return `https://wa.me/${portal.whatsapp}?text=${text}`;
  }

  function checkout() {
    if (!buyerName.trim() || !buyerPhone.trim()) {
      flash("Ingresá tu nombre y tu WhatsApp para enviar el pedido.");
      return;
    }
    if (!deliveryMethod) {
      flash("Elegí si querés retiro o envío.");
      return;
    }
    if (deliveryMethod === "envio" && !postalCode.trim()) {
      flash("Ingresá tu código postal para calcular el envío.");
      return;
    }
    if (!paymentMethod) {
      flash("Elegí un medio de pago.");
      return;
    }

    const paymentLabels: Record<string, string> = { transferencia: "Transferencia bancaria", mercadopago: "Mercado Pago", efectivo: "Efectivo", tarjeta: "Tarjeta" };
    const deliveryLine = deliveryMethod === "retiro"
      ? "Retiro en el local"
      : matchedZone
        ? `Envío a CP ${postalCode.trim()} (${matchedZone.name}) — ${money.format(matchedZone.cost)}`
        : `Envío a CP ${postalCode.trim()} — a confirmar costo`;
    const message = encodeURIComponent(`Hola ${portal.storeName}, quiero hacer este pedido:\n${cartLines.map((line) => `• ${line.productName}${line.variantName ? ` (${line.variantName})` : ""} × ${line.quantity} — ${money.format(line.price * line.quantity)}`).join("\n")}\n${deliveryLine}\nMedio de pago: ${paymentLabels[paymentMethod]}\nTotal: ${money.format(orderTotal)}`);
    const whatsappUrl = `https://wa.me/${portal.whatsapp}?text=${message}`;

    const latest = readLatestState(state);
    const phoneDigits = buyerPhone.replace(/\D/g, "");
    const existing = latest.customers.find((customer) => customer.phone.replace(/\D/g, "") === phoneDigits);
    const customer = existing ?? { id: `cli_${Date.now()}`, name: buyerName.trim(), phone: buyerPhone.trim(), email: "", notes: "Pedido realizado desde el portal." };
    const customers = existing ? latest.customers : [customer, ...latest.customers];

    const newOrder: Order = {
      id: `PED-${1049 + latest.orders.length}`,
      customerId: customer.id,
      customerName: customer.name,
      items: cartLines.map((line) => ({ productId: line.productId, productName: line.productName, variantId: line.variantId, variantName: line.variantName, quantity: line.quantity, unitPrice: line.price })),
      total: orderTotal,
      status: "Nuevo",
      createdAt: "Portal · ahora",
      stockCommitted: false,
      channel: "portal",
      location: "",
      paymentMethod,
      deliveryMethod,
      postalCode: deliveryMethod === "envio" ? postalCode.trim() : "",
      shippingCost,
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
    setDeliveryMethod("");
    setPostalCode("");
    setPaymentMethod("");
    setBuyerPhone("");
    setCartOpen(false);
  }

  function submitStockRequest() {
    if (!notifyFor) return;
    if (!requestName.trim() || !requestPhone.trim()) {
      flash("Ingresá tu nombre y tu WhatsApp para avisarte.");
      return;
    }
    const latest = readLatestState(state);
    const request: StockRequest = {
      id: `req_${Date.now()}`,
      productId: notifyFor.product.id,
      productName: notifyFor.product.name,
      variantId: notifyFor.variant?.id ?? "",
      variantName: notifyFor.variant?.name ?? "",
      customerName: requestName.trim(),
      customerPhone: requestPhone.trim(),
      createdAt: "Portal · ahora",
    };
    const updated: TenantDemoState = { ...latest, stockRequests: [request, ...latest.stockRequests] };
    try {
      window.localStorage.setItem(tenantStorageKey, JSON.stringify(updated));
    } catch {
      /* si no se pudo guardar, igual confirmamos: no es un dato crítico para el comprador */
    }
    setState(updated);
    setNotifyFor(null);
    setRequestName("");
    setRequestPhone("");
    flash("¡Listo! Te avisamos apenas tengamos stock.");
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
          <AppIcon name="cart" /> Carrito <b>{cartCount}</b>
        </button>
      </header>

      <div className="public-store-quicklinks">
        <button type="button" onClick={() => setAboutOpen(true)}><AppIcon name="customers" /> Quiénes somos</button>
        {faqs.length > 0 && <button type="button" onClick={() => setFaqOpen(true)}><AppIcon name="question" /> Preguntas frecuentes</button>}
      </div>

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
          <div className="public-store-filters-right">
            <input className="public-store-search" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Buscar por material, tema, nombre…" />
            <div className="public-store-view-toggle" role="group" aria-label="Cómo ver los productos">
              <button type="button" className={viewMode === "list" ? "active" : ""} aria-label="Ver como lista" title="Lista" onClick={() => setViewMode("list")}><AppIcon name="list" /></button>
              <button type="button" className={viewMode === "grid-lg" ? "active" : ""} aria-label="Ver como mosaico grande" title="Mosaico grande" onClick={() => setViewMode("grid-lg")}><AppIcon name="spaces" /></button>
              <button type="button" className={viewMode === "grid-sm" ? "active" : ""} aria-label="Ver como mosaico chico" title="Mosaico chico" onClick={() => setViewMode("grid-sm")}><AppIcon name="gridSmall" /></button>
            </div>
          </div>
        </div>
        <div className={`public-store-grid mode-${viewMode}`}>
          {filtered.map((product, index) => {
            const variant = variantFor(product);
            const stock = variant ? variant.stock : productStock(product);
            const minStock = variant ? variant.minStock : product.minStock;
            const price = variant ? variant.price : product.price;
            const image = variant?.image || product.image;
            const outOfStock = stock <= 0;
            return (
              <article key={product.id} className={`public-store-card tone-${index % 4}`}>
                <div className="public-store-thumb">
                  {image ? <img src={image} alt={product.name} /> : <span>{product.category.slice(0, 1)}</span>}
                  {!outOfStock && stock <= minStock && <small>Últimas {stock}</small>}
                  {outOfStock && <small className="public-store-out-badge">Sin stock</small>}
                </div>
                <strong>{product.name}</strong>
                <p>{product.description || product.variant}</p>
                {product.variants.length > 0 && (
                  <div className="public-store-variant-picker">
                    {product.variants.map((item) => (
                      <button key={item.id} type="button" className={variant?.id === item.id ? (item.stock <= 0 ? "active is-out" : "active") : (item.stock <= 0 ? "is-out" : "")} onClick={() => setSelectedVariant((current) => ({ ...current, [product.id]: item.id }))}>{item.name}</button>
                    ))}
                  </div>
                )}
                <footer>
                  <b>{money.format(price)}</b>
                  <div className="public-store-card-actions">
                    {outOfStock
                      ? <button type="button" className="public-store-notify" onClick={() => setNotifyFor({ product, variant })}>Avisame</button>
                      : <button type="button" onClick={() => add(product, variant)}><AppIcon name="cart" /> Agregar +</button>}
                    <a className="public-store-consult" href={consultUrl(product)} target="_blank" rel="noreferrer" aria-label={`Consultar por WhatsApp sobre ${product.name}`} title="Consultar por WhatsApp"><AppIcon name="whatsapp" /></a>
                  </div>
                </footer>
              </article>
            );
          })}
          {published.length === 0 && <p className="public-store-empty">Todavía no hay productos publicados.</p>}
          {published.length > 0 && filtered.length === 0 && <p className="public-store-empty">No encontramos productos con ese filtro.</p>}
        </div>
      </section>

      <footer className="public-store-footer">
        <p className="public-store-footer-note">Catálogo de prueba gestionado con Nexo. Los pedidos se coordinan por WhatsApp.</p>
        <div className="public-store-footer-bottom">
          <p>© C&amp;R Soluciones Digitales · v{version}</p>
          <div className="public-store-footer-links">
            <button type="button" onClick={() => setLegalOpen("terminos")}>Términos de uso</button>
            <button type="button" onClick={() => setLegalOpen("privacidad")}>Privacidad</button>
          </div>
        </div>
      </footer>
      {legalOpen && <LegalModal doc={legalOpen} onClose={() => setLegalOpen(null)} />}
      {aboutOpen && (
        <div className="public-store-modal-backdrop" onMouseDown={() => setAboutOpen(false)}>
          <div className="public-store-modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="public-store-modal-close" type="button" onClick={() => setAboutOpen(false)} aria-label="Cerrar">×</button>
            <span className="public-store-eyebrow">Quiénes somos</span>
            <h2>{portal.storeName}</h2>
            {portal.aboutImage && <img src={portal.aboutImage} alt="" className="public-store-about-image" />}
            {portal.about && <p className="public-store-about-text">{portal.about}</p>}
            {portal.aboutLocation && <p className="public-store-about-location"><AppIcon name="globe" /> {portal.aboutLocation}</p>}
            <a className="public-store-checkout" href={`https://wa.me/${portal.whatsapp}`} target="_blank" rel="noreferrer">Escribinos por WhatsApp</a>
          </div>
        </div>
      )}

      {faqOpen && (
        <div className="public-store-modal-backdrop" onMouseDown={() => setFaqOpen(false)}>
          <div className="public-store-modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="public-store-modal-close" type="button" onClick={() => setFaqOpen(false)} aria-label="Cerrar">×</button>
            <span className="public-store-eyebrow">Preguntas frecuentes</span>
            <h2>¿En qué te podemos ayudar?</h2>
            <div className="public-store-faq-list">
              {faqs.map((faq, index) => (
                <div className={openFaqIndex === index ? "public-store-faq-item open" : "public-store-faq-item"} key={index}>
                  <button type="button" onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}>
                    {faq.question}<span>{openFaqIndex === index ? "−" : "+"}</span>
                  </button>
                  {openFaqIndex === index && <p>{faq.answer}</p>}
                </div>
              ))}
            </div>
            <a className="public-store-checkout" href={`https://wa.me/${portal.whatsapp}`} target="_blank" rel="noreferrer">¿No encontraste tu respuesta? Escribinos</a>
          </div>
        </div>
      )}

      {cartOpen && (
        <div className="public-store-modal-backdrop" onMouseDown={() => setCartOpen(false)}>
          <div className="public-store-modal public-store-modal-lg" onMouseDown={(event) => event.stopPropagation()}>
            <button className="public-store-modal-close" type="button" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito">×</button>
            <span className="public-store-eyebrow">Pedido del portal</span>
            <h2>Tu carrito</h2>
            <div className="public-store-cart-lines">
              {cartLines.map((line) => (
                <div key={line.key}>
                  <span><strong>{line.productName}{line.variantName && ` — ${line.variantName}`}</strong><small>{line.quantity} × {money.format(line.price)}</small></span>
                  <b>{money.format(line.quantity * line.price)}</b>
                  <button type="button" onClick={() => remove(line.key)} aria-label={`Quitar una unidad de ${line.productName}`}>×</button>
                </div>
              ))}
              {cartLines.length === 0 && <div className="public-store-cart-empty">Todavía no agregaste productos.</div>}
            </div>
            <div className="public-store-cart-total"><span>Subtotal productos</span><strong>{money.format(cartTotal)}</strong></div>
            {cartLines.length > 0 && (
              <div className="public-store-buyer-form">
                <label>Tu nombre<input value={buyerName} onChange={(event) => setBuyerName(event.target.value)} placeholder="Nombre y apellido" /></label>
                <label>Tu WhatsApp<input value={buyerPhone} onChange={(event) => setBuyerPhone(event.target.value)} placeholder="+54 9…" /></label>

                <span className="public-store-option-label">Retiro o envío</span>
                <div className="public-store-option-row">
                  <button type="button" className={deliveryMethod === "retiro" ? "active" : ""} onClick={() => setDeliveryMethod("retiro")}>Retiro en el local</button>
                  <button type="button" className={deliveryMethod === "envio" ? "active" : ""} onClick={() => setDeliveryMethod("envio")}>Envío a domicilio</button>
                </div>
                {deliveryMethod === "envio" && (
                  <label>Código postal<input value={postalCode} onChange={(event) => setPostalCode(event.target.value)} placeholder="Ej. 1900" /></label>
                )}
                {deliveryMethod === "envio" && postalCode.trim() && (
                  matchedZone
                    ? <p className="public-store-shipping-note">Envío a {matchedZone.name}: {money.format(matchedZone.cost)}</p>
                    : <p className="public-store-shipping-note muted">No tenemos una zona cargada para ese código postal — coordinamos el costo de envío por WhatsApp.</p>
                )}

                <span className="public-store-option-label">Medio de pago</span>
                <div className="public-store-option-row">
                  <button type="button" className={paymentMethod === "transferencia" ? "active" : ""} onClick={() => setPaymentMethod("transferencia")}>Transferencia</button>
                  <button type="button" className={paymentMethod === "efectivo" ? "active" : ""} onClick={() => setPaymentMethod("efectivo")}>Efectivo</button>
                  <button type="button" disabled title="Próximamente">Mercado Pago<small>Próximamente</small></button>
                  <button type="button" disabled title="Próximamente">Tarjeta<small>Próximamente</small></button>
                </div>
                {paymentMethod === "transferencia" && <p className="public-store-payment-note">Elegiste transferencia bancaria — te pasamos el alias por WhatsApp para coordinar el pago.</p>}
                {paymentMethod === "efectivo" && <p className="public-store-payment-note">Elegiste efectivo — coordinamos el pago a través de WhatsApp con la vendedora.</p>}

                {shippingCost > 0 && <div className="public-store-cart-total"><span>Envío</span><strong>{money.format(shippingCost)}</strong></div>}
                <div className="public-store-cart-total public-store-cart-total-grand"><span>Total a pagar</span><strong>{money.format(orderTotal)}</strong></div>

                <button type="button" className="public-store-checkout" onClick={checkout}>
                  Enviar pedido por WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {notifyFor && (
        <div className="public-store-modal-backdrop" onMouseDown={() => setNotifyFor(null)}>
          <div className="public-store-modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="public-store-modal-close" type="button" onClick={() => setNotifyFor(null)} aria-label="Cerrar">×</button>
            <span className="public-store-eyebrow">Avisame cuando haya stock</span>
            <h2>{notifyFor.product.name}{notifyFor.variant && ` — ${notifyFor.variant.name}`}</h2>
            <p>Dejanos tus datos y te contactamos apenas repongamos.</p>
            <div className="public-store-buyer-form">
              <label>Tu nombre<input value={requestName} onChange={(event) => setRequestName(event.target.value)} placeholder="Nombre y apellido" /></label>
              <label>Tu WhatsApp<input value={requestPhone} onChange={(event) => setRequestPhone(event.target.value)} placeholder="+54 9…" /></label>
              <button type="button" className="public-store-checkout" onClick={submitStockRequest}>
                Avisarme cuando haya stock
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
