"use client";

/* eslint-disable jsx-a11y/label-has-associated-control -- the hidden file input inside each label remains reachable and labelled by its wrapping label */

import { useState, type ChangeEvent, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { productMinPrice, productStock, type Banner, type BannerLinkType, type PortalSettings, type Product, type TenantDemoState } from "../../data/tenant-demo";
import { ProductModal, emptyProductForm, fromVariantForm, toVariantForm, type ProductFormState } from "./ProductModal";
import { prepareImage } from "../../lib/image";
import { AppIcon } from "../ui/AppIcon";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", currencyDisplay: "symbol", maximumFractionDigits: 0 });

export function TenantPortal({ state, setState, flash }: { state: TenantDemoState; setState: Dispatch<SetStateAction<TenantDemoState>>; flash: (message: string) => void }) {
  const [draft, setDraft] = useState<PortalSettings>(state.portal);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<ProductFormState>(emptyProductForm);

  const storePath = `/tienda/${draft.slug}`;
  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}${storePath}` : storePath;

  function setSlug(value: string) {
    setDraft({ ...draft, slug: value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") });
  }

  function save() {
    setState((current) => ({ ...current, portal: draft }));
    flash("Los cambios del portal quedaron publicados en la demostración.");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      flash("Enlace del portal copiado.");
    } catch {
      flash("No se pudo copiar el enlace. Copialo manualmente.");
    }
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(`Mirá el catálogo de ${draft.storeName}: ${publicUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noreferrer");
  }

  async function addBanner(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const result = await prepareImage(file);
    if (!result.ok) {
      if (result.reason === "not-image") flash("Elegí un archivo de imagen.");
      else if (result.reason === "too-large") flash("Esta imagen pesa demasiado incluso comprimida. Probá con otra.");
      else flash("No se pudo leer la imagen.");
      return;
    }
    const banner: Banner = { image: result.dataUrl, title: "", linkType: "none", linkValue: "" };
    setDraft((current) => ({ ...current, banners: [...current.banners, banner] }));
    if (result.compressed) flash("La imagen pesaba de más: se comprimió automáticamente para poder subirla.");
  }

  function removeBanner(index: number) {
    setDraft((current) => ({ ...current, banners: current.banners.filter((_, itemIndex) => itemIndex !== index) }));
  }

  function updateBanner(index: number, patch: Partial<Banner>) {
    setDraft((current) => ({ ...current, banners: current.banners.map((banner, itemIndex) => itemIndex === index ? { ...banner, ...patch } : banner) }));
  }

  function openProduct(product?: Product) {
    setEditingProductId(product?.id ?? null);
    setProductForm(product
      ? { name: product.name, sku: product.sku, category: product.category, subcategory: product.subcategory ?? "", variant: product.variant, description: product.description ?? "", image: product.image ?? "", stock: String(product.stock), minStock: String(product.minStock), price: String(product.price), cost: String(product.cost), hideWhenOutOfStock: product.hideWhenOutOfStock ?? true, variants: (product.variants ?? []).map(toVariantForm) }
      : { ...emptyProductForm, category: state.categories[0]?.name ?? "" });
    setProductModalOpen(true);
  }

  function saveProduct(event: FormEvent) {
    event.preventDefault();
    const variants = productForm.variants.map(fromVariantForm);
    const stock = variants.length > 0 ? variants.reduce((total, variant) => total + variant.stock, 0) : Math.max(0, Number(productForm.stock));
    const price = variants.length > 0 ? Math.min(...variants.map((variant) => variant.price)) : Math.max(0, Number(productForm.price));
    const item: Product = { id: editingProductId ?? `prd_${Date.now()}`, name: productForm.name.trim(), sku: productForm.sku.trim().toUpperCase(), category: productForm.category, subcategory: productForm.subcategory, variant: productForm.variant.trim(), description: productForm.description.trim(), image: productForm.image, stock, minStock: Math.max(0, Number(productForm.minStock)), price, cost: Math.max(0, Number(productForm.cost)), hideWhenOutOfStock: productForm.hideWhenOutOfStock, variants, published: editingProductId ? state.products.find((product) => product.id === editingProductId)?.published ?? false : stock > 0 };
    setState((current) => ({ ...current, products: editingProductId ? current.products.map((product) => product.id === editingProductId ? item : product) : [item, ...current.products] }));
    setProductModalOpen(false);
    flash(editingProductId ? "Producto actualizado." : "Producto agregado al catálogo.");
  }

  function toggleProductPublished(id: string) {
    const product = state.products.find((item) => item.id === id);
    if (!product) return;
    if (!productStock(product) && !product.published) { flash("No se puede publicar un producto sin stock."); return; }
    setState((current) => ({ ...current, products: current.products.map((item) => item.id === id ? { ...item, published: !item.published } : item) }));
    flash(product.published ? "Producto ocultado del portal." : "Producto publicado en el portal.");
  }

  return <div className="tenant-portal-page">
    <div className="page-heading"><div><p className="eyebrow">Vidriera online</p><h1>Portal de ventas</h1><p>Editá tu identidad, subí fotos de producto y compartí el enlace público.</p></div><div className="heading-actions"><span className={state.portal.published ? "status success" : "status neutral"}>{state.portal.published ? "Portal publicado" : "Portal en borrador"}</span><button className="button primary" onClick={save}><AppIcon name="check" /> Guardar y publicar</button></div></div>

    <section className="panel portal-link-panel">
      <div>
        <span className="portal-link-label">Enlace público del portal</span>
        <strong className="portal-link-url">{publicUrl}</strong>
      </div>
      <div className="portal-link-buttons">
        <a className="button primary" href={storePath} target="_blank" rel="noreferrer"><AppIcon name="globe" /> Abrir portal</a>
        <button type="button" className="button secondary" onClick={copyLink}><AppIcon name="copy" /> Copiar enlace</button>
        <button type="button" className="button whatsapp-share" onClick={shareWhatsApp}><AppIcon name="whatsapp" /> Enviar por WhatsApp</button>
      </div>
    </section>

    <div className="portal-settings-grid">
      <section className="panel">
        <div className="panel-title"><div><h2>Identidad del portal</h2><p>Estos datos se ven en tu tienda pública.</p></div></div>
        <div className="portal-form">
          <label>Nombre del emprendimiento<input value={draft.storeName} onChange={(event) => setDraft({ ...draft, storeName: event.target.value })} /></label>
          <label>Título principal<input value={draft.headline} onChange={(event) => setDraft({ ...draft, headline: event.target.value })} /></label>
          <label>Descripción<textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
          <label>Dirección del portal<span className="portal-slug-field"><span>/tienda/</span><input value={draft.slug} onChange={(event) => setSlug(event.target.value)} /></span></label>
          <label>WhatsApp para pedidos<input value={draft.whatsapp} onChange={(event) => setDraft({ ...draft, whatsapp: event.target.value.replace(/\D/g, "") })} /></label>
          <label>Color de marca<span className="color-field"><input type="color" value={draft.accent} onChange={(event) => setDraft({ ...draft, accent: event.target.value })} /><code>{draft.accent}</code></span></label>
          <label className="publish-check"><input type="checkbox" checked={draft.published} onChange={(event) => setDraft({ ...draft, published: event.target.checked })} /><span><strong>Portal visible</strong><small>Permití que tus clientes lo visiten.</small></span></label>
        </div>
      </section>

      <section className="panel">
        <div className="panel-title"><div><h2>Imágenes del banner</h2><p>Forman un carrusel en la portada de tu tienda. Cada una puede tener su propio texto y, si querés, llevar a una categoría, subcategoría o palabra clave al hacer clic.</p></div></div>
        <div className="portal-banner-manager">
          {draft.banners.map((banner, index) => (
            <div className="portal-banner-card" key={index}>
              <img src={banner.image} alt="" className="portal-banner-card-image" />
              <div className="portal-banner-card-fields">
                <label>Título<input value={banner.title} onChange={(event) => updateBanner(index, { title: event.target.value })} placeholder="Ej. Saiyans" /></label>
                <label>Al hacer clic, mostrar<select value={banner.linkType} onChange={(event) => updateBanner(index, { linkType: event.target.value as BannerLinkType, linkValue: "" })}><option value="none">Nada (solo decorativo)</option><option value="category">Una categoría</option><option value="subcategory">Una subcategoría</option><option value="keyword">Una palabra clave</option></select></label>
                {banner.linkType === "category" && <label>Categoría<select value={banner.linkValue} onChange={(event) => updateBanner(index, { linkValue: event.target.value })}><option value="">Elegir…</option>{state.categories.map((category) => <option key={category.name} value={category.name}>{category.name}</option>)}</select></label>}
                {banner.linkType === "subcategory" && <label>Subcategoría<select value={banner.linkValue} onChange={(event) => updateBanner(index, { linkValue: event.target.value })}><option value="">Elegir…</option>{state.categories.flatMap((category) => category.subcategories).map((sub) => <option key={sub.name} value={sub.name}>{sub.name}</option>)}</select></label>}
                {banner.linkType === "keyword" && <label>Palabra clave<input value={banner.linkValue} onChange={(event) => updateBanner(index, { linkValue: event.target.value })} placeholder="Ej. aluminio" /></label>}
              </div>
              <button type="button" className="portal-banner-card-remove" onClick={() => removeBanner(index)} aria-label={`Quitar imagen ${index + 1}`}>×</button>
            </div>
          ))}
          <label className="portal-banner-add">
            + Agregar imagen
            <input type="file" accept="image/*" onChange={addBanner} hidden />
          </label>
        </div>
        {draft.banners.length === 0 && <p className="portal-banner-empty">Todavía no subiste imágenes. Mientras tanto se muestra un fondo de color en el banner.</p>}
      </section>
    </div>

    <section className="panel">
      <div className="panel-title">
        <div><h2>Catálogo del portal</h2><p>Subí una foto, descripción y precio de cada producto que se ve en tu tienda.</p></div>
        <button className="button primary" type="button" onClick={() => openProduct()}>+ Nuevo producto</button>
      </div>
      <div className="portal-catalog-grid">
        {state.products.map((product) => (
          <article className="portal-catalog-card" key={product.id}>
            {product.image ? <img src={product.image} alt="" /> : <div className="portal-catalog-placeholder">{product.category.slice(0, 1)}</div>}
            <div className="portal-catalog-info">
              <strong>{product.name}{product.variants.length > 0 && <small> · {product.variants.length} variantes</small>}</strong>
              <span>{product.variants.length > 0 ? `Desde ${money.format(productMinPrice(product))}` : money.format(product.price)}</span>
            </div>
            <div className="portal-catalog-actions">
              <button className={product.published && productStock(product) > 0 ? "switch active" : "switch"} onClick={() => toggleProductPublished(product.id)} aria-label={`${product.published ? "Ocultar" : "Publicar"} ${product.name}`}><i /></button>
              <button className="row-action" onClick={() => openProduct(product)}>Editar</button>
            </div>
          </article>
        ))}
        {state.products.length === 0 && <div className="empty-state">Todavía no cargaste productos.</div>}
      </div>
      <div className="portal-automation-note"><span>✓</span><div><strong>Catálogo conectado al inventario</strong><p>Un producto sin stock se oculta solo; al reponerlo lo volvés a publicar desde acá.</p></div></div>
    </section>

    {productModalOpen && <ProductModal form={productForm} setForm={setProductForm} editing={editingProductId !== null} categories={state.categories} onClose={() => setProductModalOpen(false)} onSubmit={saveProduct} flash={flash} />}
  </div>;
}
