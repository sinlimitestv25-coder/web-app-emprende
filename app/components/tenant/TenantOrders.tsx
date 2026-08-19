"use client";

/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions -- modal backdrop is an optional pointer shortcut; every modal also has a keyboard-accessible close button */

import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { productStock, type Order, type OrderStatus, type TenantDemoState } from "../../data/tenant-demo";
import { AppIcon } from "../ui/AppIcon";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", currencyDisplay: "symbol", maximumFractionDigits: 0 });
const statuses: OrderStatus[] = ["Nuevo", "Preparando", "Listo", "Entregado", "Cancelado"];
const statusIcons: Record<OrderStatus, string> = { Nuevo: "new", Preparando: "clock", Listo: "ready", Entregado: "check", Cancelado: "cancel" };

export function TenantOrders({ state, setState, changeStatus, flash }: { state: TenantDemoState; setState: Dispatch<SetStateAction<TenantDemoState>>; changeStatus: (id: string, status: OrderStatus) => void; flash: (message: string) => void }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"Todos" | OrderStatus>("Todos");
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const firstProduct = state.products.find((product) => productStock(product) > 0);
  const [form, setForm] = useState({ customerId: "", productId: firstProduct?.id ?? "", variantId: firstProduct?.variants.find((variant) => variant.stock > 0)?.id ?? "", quantity: "1", location: "" });
  const visible = state.orders.filter((order) => filter === "Todos" || order.status === filter);
  const selectedProduct = state.products.find((item) => item.id === form.productId);
  const selectedVariant = selectedProduct?.variants.find((variant) => variant.id === form.variantId);

  function selectProduct(productId: string) {
    const product = state.products.find((item) => item.id === productId);
    setForm({ ...form, productId, variantId: product?.variants.find((variant) => variant.stock > 0)?.id ?? "" });
  }

  function save(event: FormEvent) {
    event.preventDefault();
    const customer = state.customers.find((item) => item.id === form.customerId);
    const product = state.products.find((item) => item.id === form.productId);
    const quantity = Math.max(1, Number(form.quantity));
    if (!product) return;
    const variant = product.variants.find((item) => item.id === form.variantId);
    if (product.variants.length > 0 && !variant) { flash("Elegí una variante."); return; }
    const availableStock = variant ? variant.stock : productStock(product);
    if (quantity > availableStock) { flash("La cantidad solicitada supera el stock disponible."); return; }
    const unitPrice = variant ? variant.price : product.price;
    const order: Order = { id: `PED-${1049 + state.orders.length}`, customerId: customer?.id ?? "", customerName: customer?.name ?? "Vendedora", items: [{ productId: product.id, productName: product.name, variantId: variant?.id ?? "", variantName: variant?.name ?? "", quantity, unitPrice }], total: unitPrice * quantity, status: "Nuevo", createdAt: "Ahora", stockCommitted: false, channel: "directa", location: form.location.trim() };
    setState((current) => ({ ...current, orders: [order, ...current.orders] }));
    setOpen(false);
    flash("Pedido creado. El stock se descontará al comenzar a prepararlo.");
  }

  return <>
    <div className="page-heading"><div><p className="eyebrow">Ventas</p><h1>Pedidos</h1><p>Armá pedidos, seguí su avance y actualizá el stock automáticamente.</p></div><button className="button primary" onClick={() => setOpen(true)}>+ Armar pedido</button></div>
    <div className="order-pipeline">
      <button className={filter === "Todos" ? "stage active" : "stage"} onClick={() => setFilter("Todos")}><AppIcon name="orders" className="stage-icon" /><strong>{state.orders.length}</strong><span>Todos</span></button>
      {statuses.map((status) => <button className={filter === status ? "stage active" : "stage"} key={status} onClick={() => setFilter(status)}><AppIcon name={statusIcons[status]} className="stage-icon" /><strong>{state.orders.filter((order) => order.status === status).length}</strong><span>{status}</span></button>)}
    </div>
    <section className="panel orders-table">
      <div className="panel-title order-title"><div><h2>{filter === "Todos" ? "Todos los pedidos" : `Pedidos: ${filter}`}</h2><p>Al pasar a “Preparando” se reservan y descuentan las unidades.</p></div><span className="table-result">{visible.length} pedidos</span></div>
      <div className="tenant-orders-head"><span>Pedido</span><span>Cliente</span><span>Detalle</span><span>Total</span><span>Estado</span><span>Contacto</span></div>
      {visible.map((order) => (
        <div className="tenant-orders-row" key={order.id}>
          <strong>{order.id}<small>{order.createdAt}</small>{order.channel === "directa" && <small className="order-channel-tag">Venta directa{order.location && ` · ${order.location}`}</small>}</strong>
          <div><span>{order.customerName}</span><small>{state.customers.find((customer) => customer.id === order.customerId)?.phone}</small></div>
          <div className="order-detail-cell">
            {order.items.length === 1
              ? <><span>{order.items[0].productName}{order.items[0].variantName && ` — ${order.items[0].variantName}`}</span><small>{order.items[0].quantity} × {money.format(order.items[0].unitPrice)} {order.stockCommitted ? "· Stock reservado" : ""}</small></>
              : <><span>{order.items.length} productos</span><button type="button" className="link-button" onClick={() => setDetailOrder(order)}>Ver detalle{order.stockCommitted ? " · Stock reservado" : ""}</button></>}
          </div>
          <b>{money.format(order.total)}</b>
          <select className={`order-status-select status-${order.status.toLowerCase()}`} value={order.status} onChange={(event) => changeStatus(order.id, event.target.value as OrderStatus)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
          {(() => {
            const phone = state.customers.find((customer) => customer.id === order.customerId)?.phone;
            return phone
              ? <a className="icon-action-button whatsapp" href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" aria-label={`Abrir WhatsApp con ${order.customerName}`}><AppIcon name="whatsapp" /></a>
              : <span className="icon-action-button whatsapp disabled" aria-hidden="true"><AppIcon name="whatsapp" /></span>;
          })()}
        </div>
      ))}
      {visible.length === 0 && <div className="empty-state">No hay pedidos en este estado.</div>}
    </section>
    {open && <div className="modal-backdrop" onMouseDown={() => setOpen(false)}><form className="modal" onSubmit={save} onMouseDown={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setOpen(false)}>×</button><p className="eyebrow">Nueva venta</p><h2>Armar pedido</h2><p>Seleccioná cliente, producto y cantidad. El pedido quedará pendiente de preparación.</p><label>Cliente<select value={form.customerId} onChange={(event) => setForm({ ...form, customerId: event.target.value })}><option value="">Venta directa (sin cliente)</option>{state.customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} · {customer.phone}</option>)}</select></label><label>Producto<select required value={form.productId} onChange={(event) => selectProduct(event.target.value)}>{state.products.filter((product) => productStock(product) > 0).map((product) => <option key={product.id} value={product.id}>{product.name} · {productStock(product)} disponibles</option>)}</select></label>{(selectedProduct?.variants.length ?? 0) > 0 && <label>Variante<select required value={form.variantId} onChange={(event) => setForm({ ...form, variantId: event.target.value })}><option value="">Elegir…</option>{selectedProduct!.variants.map((variant) => <option key={variant.id} value={variant.id} disabled={variant.stock <= 0}>{variant.name} · {variant.stock} disponibles · {money.format(variant.price)}</option>)}</select></label>}<label>Cantidad<input required type="number" min="1" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} /></label><label>Lugar de la venta (opcional)<input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Ej. Feria de Avellaneda" /></label><small className="field-hint">Este pedido queda marcado como venta directa (vos como vendedora), no como pedido de un cliente por WhatsApp o el portal.</small><div className="order-rule"><span>i</span><p><strong>Reserva de unidades</strong>El stock no cambia al crear el pedido. Se descuenta cuando comienza la preparación.</p></div><button className="button primary full">Crear pedido</button></form></div>}
    {detailOrder && <OrderDetailModal order={detailOrder} onClose={() => setDetailOrder(null)} />}
  </>;
}

function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        <p className="eyebrow">{order.id} · {order.customerName}</p>
        <h2>Detalle del pedido</h2>
        <div className="cart-lines">
          {order.items.map((item) => (
            <div key={`${item.productId}-${item.variantId}`}>
              <span><strong>{item.productName}{item.variantName && ` — ${item.variantName}`}</strong><small>{item.quantity} × {money.format(item.unitPrice)}</small></span>
              <b>{money.format(item.quantity * item.unitPrice)}</b>
            </div>
          ))}
        </div>
        <div className="cart-total"><span>Total del pedido</span><strong>{money.format(order.total)}</strong></div>
      </div>
    </div>
  );
}
