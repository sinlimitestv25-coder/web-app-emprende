"use client";

/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions -- modal backdrop is an optional pointer shortcut; every modal also has a keyboard-accessible close button */

import { useMemo, useState, type FormEvent } from "react";
import type { Category, Product } from "../../data/tenant-demo";
import { AppIcon } from "../ui/AppIcon";
import { ProductModal, emptyProductForm, type ProductFormState } from "./ProductModal";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", currencyDisplay: "symbol", maximumFractionDigits: 0 });

export function TenantInventory({ products, setProducts, categories, flash }: { products: Product[]; setProducts: (products: Product[]) => void; categories: Category[]; flash: (message: string) => void }) {
  const [search, setSearch] = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyProductForm);
  const visible = useMemo(() => products.filter((product) => (!lowOnly || product.stock <= product.minStock) && `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(search.toLowerCase())), [products, search, lowOnly]);
  const units = products.reduce((total, product) => total + product.stock, 0);
  const inventoryValue = products.reduce((total, product) => total + product.stock * product.cost, 0);
  const low = products.filter((product) => product.stock <= product.minStock);

  function openProduct(product?: Product) {
    setEditing(product?.id ?? null);
    setForm(product ? { name: product.name, sku: product.sku, category: product.category, subcategory: product.subcategory ?? "", variant: product.variant, description: product.description ?? "", image: product.image ?? "", stock: String(product.stock), minStock: String(product.minStock), price: String(product.price), cost: String(product.cost) } : { ...emptyProductForm, category: categories[0]?.name ?? "" });
    setFormOpen(true);
  }

  function save(event: FormEvent) {
    event.preventDefault();
    const item: Product = { id: editing ?? `prd_${Date.now()}`, name: form.name.trim(), sku: form.sku.trim().toUpperCase(), category: form.category, subcategory: form.subcategory, variant: form.variant.trim(), description: form.description.trim(), image: form.image, stock: Math.max(0, Number(form.stock)), minStock: Math.max(0, Number(form.minStock)), price: Math.max(0, Number(form.price)), cost: Math.max(0, Number(form.cost)), published: editing ? products.find((product) => product.id === editing)?.published ?? false : Number(form.stock) > 0 };
    setProducts(editing ? products.map((product) => product.id === editing ? item : product) : [item, ...products]);
    setFormOpen(false);
    flash(editing ? "Producto actualizado." : "Producto agregado al inventario.");
  }

  function togglePublished(id: string) {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    if (!product.stock && !product.published) { flash("No se puede publicar un producto sin stock."); return; }
    setProducts(products.map((item) => item.id === id ? { ...item, published: !item.published } : item));
    flash(product.published ? "Producto ocultado del portal." : "Producto publicado en el portal.");
  }

  return <>
    <div className="page-heading"><div><p className="eyebrow">Inventario</p><h1>Productos y stock</h1><p>Controlá variantes, costos, precios y disponibilidad del portal.</p></div><button className="button primary" onClick={() => openProduct()}>+ Agregar producto</button></div>
    {low.length > 0 && <div className="inventory-alert"><span>!</span><div><strong>{low.length} productos necesitan atención</strong><p>Los artículos sin unidades se ocultan automáticamente del portal.</p></div><button onClick={() => setLowOnly((current) => !current)}>{lowOnly ? "Ver todos" : "Revisar stock"}</button></div>}
    <div className="summary-strip icon-summary"><SummaryStat icon="inventory" tone="coral" label="Productos" value={String(products.length)} /><SummaryStat icon="stock" tone="mint" label="Unidades disponibles" value={String(units)} /><SummaryStat icon="money" tone="lilac" label="Valor a costo" value={money.format(inventoryValue)} /><SummaryStat icon="portal" tone="amber" label="Publicados" value={String(products.filter((product) => product.published && product.stock > 0).length)} /></div>
    <section className="panel table-panel inventory-table"><div className="table-tools"><label className="search-field">⌕<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, categoría o código…" /></label><span className="table-result">{visible.length} resultados</span></div><div className="inventory-head"><span>Producto</span><span>Stock</span><span>Mínimo</span><span>Costo</span><span>Precio</span><span>Portal</span></div>{visible.map((product) => <div className="inventory-row" key={product.id}><div>{product.image ? <img src={product.image} alt="" className="product-thumb product-thumb-image" /> : <span className="product-thumb">{product.category.slice(0, 1)}</span>}<div><strong>{product.name}</strong><small>{product.sku} · {product.variant}</small></div></div><strong className={product.stock <= product.minStock ? "stock-number low" : "stock-number"}>{product.stock}</strong><span>{product.minStock}</span><span>{money.format(product.cost)}</span><strong>{money.format(product.price)}</strong><div className="row-actions"><button className={product.published && product.stock > 0 ? "switch active" : "switch"} onClick={() => togglePublished(product.id)} aria-label={`${product.published ? "Ocultar" : "Publicar"} ${product.name}`}><i /></button><button className="row-action" onClick={() => openProduct(product)}>Editar</button></div></div>)}{visible.length === 0 && <div className="empty-state">No encontramos productos con esa búsqueda.</div>}</section>
    {formOpen && <ProductModal form={form} setForm={setForm} editing={editing !== null} categories={categories} onClose={() => setFormOpen(false)} onSubmit={save} flash={flash} />}
  </>;
}

function SummaryStat({ icon, tone, label, value }: { icon: string; tone: string; label: string; value: string }) {
  return <div><span className={`summary-icon ${tone}`}><AppIcon name={icon} label={label} /></span><span>{label}</span><strong>{value}</strong></div>;
}
