"use client";

/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions -- modal backdrop is an optional pointer shortcut; every modal also has a keyboard-accessible close button */

import { useMemo, useState, type FormEvent } from "react";
import { productCostValue, productLowStock, productMinPrice, productStock, type Category, type Product, type StockRequest } from "../../data/tenant-demo";
import { AppIcon } from "../ui/AppIcon";
import { ProductModal, emptyProductForm, fromVariantForm, toVariantForm, type ProductFormState } from "./ProductModal";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", currencyDisplay: "symbol", maximumFractionDigits: 0 });

export function TenantInventory({ products, setProducts, categories, stockRequests, flash }: { products: Product[]; setProducts: (products: Product[]) => void; categories: Category[]; stockRequests: StockRequest[]; flash: (message: string) => void }) {
  const [search, setSearch] = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyProductForm);
  const visible = useMemo(() => products.filter((product) => (!lowOnly || productLowStock(product)) && `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(search.toLowerCase())), [products, search, lowOnly]);
  const units = products.reduce((total, product) => total + productStock(product), 0);
  const inventoryValue = products.reduce((total, product) => total + productCostValue(product), 0);
  const low = products.filter(productLowStock);

  function openProduct(product?: Product) {
    setEditing(product?.id ?? null);
    setForm(product
      ? { name: product.name, sku: product.sku, category: product.category, subcategory: product.subcategory ?? "", variant: product.variant, description: product.description ?? "", image: product.image ?? "", stock: String(product.stock), minStock: String(product.minStock), price: String(product.price), cost: String(product.cost), hideWhenOutOfStock: product.hideWhenOutOfStock ?? true, variants: (product.variants ?? []).map(toVariantForm) }
      : { ...emptyProductForm, category: categories[0]?.name ?? "" });
    setFormOpen(true);
  }

  function save(event: FormEvent) {
    event.preventDefault();
    const variants = form.variants.map(fromVariantForm);
    const stock = variants.length > 0 ? variants.reduce((total, variant) => total + variant.stock, 0) : Math.max(0, Number(form.stock));
    const price = variants.length > 0 ? Math.min(...variants.map((variant) => variant.price)) : Math.max(0, Number(form.price));
    const item: Product = { id: editing ?? `prd_${Date.now()}`, name: form.name.trim(), sku: form.sku.trim().toUpperCase(), category: form.category, subcategory: form.subcategory, variant: form.variant.trim(), description: form.description.trim(), image: form.image, stock, minStock: Math.max(0, Number(form.minStock)), price, cost: Math.max(0, Number(form.cost)), hideWhenOutOfStock: form.hideWhenOutOfStock, variants, published: editing ? products.find((product) => product.id === editing)?.published ?? false : stock > 0 };
    setProducts(editing ? products.map((product) => product.id === editing ? item : product) : [item, ...products]);
    setFormOpen(false);
    flash(editing ? "Producto actualizado." : "Producto agregado al inventario.");
  }

  function togglePublished(id: string) {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    if (!productStock(product) && !product.published) { flash("No se puede publicar un producto sin stock."); return; }
    setProducts(products.map((item) => item.id === id ? { ...item, published: !item.published } : item));
    flash(product.published ? "Producto ocultado del portal." : "Producto publicado en el portal.");
  }

  return <>
    <div className="page-heading"><div><p className="eyebrow">Inventario</p><h1>Productos y stock</h1><p>Controlá variantes, costos, precios y disponibilidad del portal.</p></div><button className="button primary" onClick={() => openProduct()}>+ Agregar producto</button></div>
    {low.length > 0 && <div className="inventory-alert"><span>!</span><div><strong>{low.length} productos necesitan atención</strong><p>Los artículos sin unidades se ocultan automáticamente del portal (salvo que elijas mostrarlos igual).</p></div><button onClick={() => setLowOnly((current) => !current)}>{lowOnly ? "Ver todos" : "Revisar stock"}</button></div>}
    <div className="summary-strip icon-summary"><SummaryStat icon="inventory" tone="coral" label="Productos" value={String(products.length)} /><SummaryStat icon="stock" tone="mint" label="Unidades disponibles" value={String(units)} /><SummaryStat icon="money" tone="lilac" label="Valor a costo" value={money.format(inventoryValue)} /><SummaryStat icon="portal" tone="amber" label="Publicados" value={String(products.filter((product) => product.published && productStock(product) > 0).length)} /></div>
    <section className="panel table-panel inventory-table"><div className="table-tools"><label className="search-field">⌕<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, categoría o código…" /></label><span className="table-result">{visible.length} resultados</span></div><div className="inventory-head"><span>Producto</span><span>Stock</span><span>Mínimo</span><span>Costo</span><span>Precio</span><span>Portal</span></div>{visible.map((product) => <div className="inventory-row" key={product.id}><div>{product.image ? <img src={product.image} alt="" className="product-thumb product-thumb-image" /> : <span className="product-thumb">{product.category.slice(0, 1)}</span>}<div><strong>{product.name}{product.variants.length > 0 && <small className="variant-count-tag"> · {product.variants.length} variantes</small>}</strong><small>{product.sku} · {product.variant}</small></div></div><strong className={productLowStock(product) ? "stock-number low" : "stock-number"}>{productStock(product)}</strong><span>{product.variants.length > 0 ? "—" : product.minStock}</span><span>{money.format(product.variants.length > 0 ? product.variants.reduce((total, variant) => total + variant.cost, 0) / product.variants.length : product.cost)}</span><strong>{product.variants.length > 0 ? `Desde ${money.format(productMinPrice(product))}` : money.format(product.price)}</strong><div className="row-actions"><button className={product.published && productStock(product) > 0 ? "switch active" : "switch"} onClick={() => togglePublished(product.id)} aria-label={`${product.published ? "Ocultar" : "Publicar"} ${product.name}`}><i /></button><button className="row-action" onClick={() => openProduct(product)}>Editar</button></div></div>)}{visible.length === 0 && <div className="empty-state">No encontramos productos con esa búsqueda.</div>}</section>
    {formOpen && <ProductModal form={form} setForm={setForm} editing={editing !== null} categories={categories} onClose={() => setFormOpen(false)} onSubmit={save} flash={flash} />}

    <section className="panel">
      <div className="panel-title"><div><h2>Interés en productos sin stock</h2><p>Quién pidió que le avisen cuando repongas — te sirve para medir qué se busca más.</p></div></div>
      <div className="stock-request-list">
        {stockRequests.length === 0 && <div className="empty-state">Todavía no hay pedidos de aviso.</div>}
        {stockRequests.map((request) => (
          <div className="stock-request-row" key={request.id}>
            <div>
              <strong>{request.productName}{request.variantName && ` — ${request.variantName}`}</strong>
              <small>{request.customerName} · {request.createdAt}</small>
            </div>
            <a className="icon-action-button whatsapp" href={`https://wa.me/${request.customerPhone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" aria-label={`Escribir a ${request.customerName}`}><AppIcon name="whatsapp" /></a>
          </div>
        ))}
      </div>
    </section>
  </>;
}

function SummaryStat({ icon, tone, label, value }: { icon: string; tone: string; label: string; value: string }) {
  return <div><span className={`summary-icon ${tone}`}><AppIcon name={icon} label={label} /></span><span>{label}</span><strong>{value}</strong></div>;
}
