"use client";

/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions -- modal backdrop is an optional pointer shortcut; every modal also has a keyboard-accessible close button */

import { useMemo, useState, type FormEvent } from "react";
import type { Product } from "../../data/tenant-demo";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const emptyForm = { name: "", sku: "", category: "Tazas", variant: "", stock: "0", minStock: "2", price: "", cost: "" };

export function TenantInventory({ products, setProducts, flash }: { products: Product[]; setProducts: (products: Product[]) => void; flash: (message: string) => void }) {
  const [search, setSearch] = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const visible = useMemo(() => products.filter((product) => (!lowOnly || product.stock <= product.minStock) && `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(search.toLowerCase())), [products, search, lowOnly]);
  const units = products.reduce((total, product) => total + product.stock, 0);
  const inventoryValue = products.reduce((total, product) => total + product.stock * product.cost, 0);
  const low = products.filter((product) => product.stock <= product.minStock);

  function openProduct(product?: Product) {
    setEditing(product?.id ?? null);
    setForm(product ? { name: product.name, sku: product.sku, category: product.category, variant: product.variant, stock: String(product.stock), minStock: String(product.minStock), price: String(product.price), cost: String(product.cost) } : emptyForm);
    setFormOpen(true);
  }

  function save(event: FormEvent) {
    event.preventDefault();
    const item: Product = { id: editing ?? `prd_${Date.now()}`, name: form.name.trim(), sku: form.sku.trim().toUpperCase(), category: form.category, variant: form.variant.trim(), stock: Math.max(0, Number(form.stock)), minStock: Math.max(0, Number(form.minStock)), price: Math.max(0, Number(form.price)), cost: Math.max(0, Number(form.cost)), published: editing ? products.find((product) => product.id === editing)?.published ?? false : Number(form.stock) > 0 };
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
    <div className="summary-strip"><div><span>Productos</span><strong>{products.length}</strong></div><div><span>Unidades disponibles</span><strong>{units}</strong></div><div><span>Valor a costo</span><strong>{money.format(inventoryValue)}</strong></div><div><span>Publicados</span><strong>{products.filter((product) => product.published && product.stock > 0).length}</strong></div></div>
    <section className="panel table-panel inventory-table"><div className="table-tools"><label className="search-field">⌕<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, categoría o código…" /></label><span className="table-result">{visible.length} resultados</span></div><div className="inventory-head"><span>Producto</span><span>Stock</span><span>Mínimo</span><span>Costo</span><span>Precio</span><span>Portal</span></div>{visible.map((product) => <div className="inventory-row" key={product.id}><div><span className="product-thumb">{product.category.slice(0, 1)}</span><div><strong>{product.name}</strong><small>{product.sku} · {product.variant}</small></div></div><strong className={product.stock <= product.minStock ? "stock-number low" : "stock-number"}>{product.stock}</strong><span>{product.minStock}</span><span>{money.format(product.cost)}</span><strong>{money.format(product.price)}</strong><div className="row-actions"><button className={product.published && product.stock > 0 ? "switch active" : "switch"} onClick={() => togglePublished(product.id)} aria-label={`${product.published ? "Ocultar" : "Publicar"} ${product.name}`}><i /></button><button className="row-action" onClick={() => openProduct(product)}>Editar</button></div></div>)}{visible.length === 0 && <div className="empty-state">No encontramos productos con esa búsqueda.</div>}</section>
    {formOpen && <div className="modal-backdrop" onMouseDown={() => setFormOpen(false)}><form className="modal product-modal" onSubmit={save} onMouseDown={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setFormOpen(false)}>×</button><p className="eyebrow">{editing ? "Editar inventario" : "Nuevo artículo"}</p><h2>{editing ? "Actualizar producto" : "Agregar producto"}</h2><p>Esta información alimenta el stock y el portal de ventas.</p><div className="form-grid"><label>Nombre<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ej. Taza personalizada" /></label><label>Código / SKU<input required value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} placeholder="TAZ-001" /></label><label>Categoría<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Tazas</option><option>Vasos térmicos</option><option>Vinilos</option><option>Llaveros</option><option>Botellas</option><option>Otros</option></select></label><label>Variante<input required value={form.variant} onChange={(event) => setForm({ ...form, variant: event.target.value })} placeholder="Material, tamaño o diseño" /></label><label>Stock actual<input required min="0" type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} /></label><label>Alerta mínima<input required min="0" type="number" value={form.minStock} onChange={(event) => setForm({ ...form, minStock: event.target.value })} /></label><label>Costo<input required min="0" type="number" value={form.cost} onChange={(event) => setForm({ ...form, cost: event.target.value })} /></label><label>Precio de venta<input required min="0" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label></div><button className="button primary full">{editing ? "Guardar cambios" : "Agregar al inventario"}</button></form></div>}
  </>;
}
