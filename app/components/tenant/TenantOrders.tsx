"use client";

/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions -- modal backdrop is an optional pointer shortcut; every modal also has a keyboard-accessible close button */

import { useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import type { Order, OrderStatus, TenantDemoState } from "../../data/tenant-demo";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", currencyDisplay: "symbol", maximumFractionDigits: 0 });
const statuses: OrderStatus[] = ["Nuevo", "Preparando", "Listo", "Entregado", "Cancelado"];

export function TenantOrders({ state, setState, changeStatus, flash }: { state: TenantDemoState; setState: Dispatch<SetStateAction<TenantDemoState>>; changeStatus: (id: string, status: OrderStatus) => void; flash: (message: string) => void }) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"Todos" | OrderStatus>("Todos");
  const firstProduct = state.products.find((product) => product.stock > 0);
  const [form, setForm] = useState({ customerId: state.customers[0]?.id ?? "", productId: firstProduct?.id ?? "", quantity: "1" });
  const visible = state.orders.filter((order) => filter === "Todos" || order.status === filter);

  function save(event: FormEvent) {
    event.preventDefault();
    const customer = state.customers.find((item) => item.id === form.customerId);
    const product = state.products.find((item) => item.id === form.productId);
    const quantity = Math.max(1, Number(form.quantity));
    if (!customer || !product) return;
    if (quantity > product.stock) { flash("La cantidad solicitada supera el stock disponible."); return; }
    const order: Order = { id: `PED-${1049 + state.orders.length}`, customerId: customer.id, customerName: customer.name, productId: product.id, productName: product.name, quantity, unitPrice: product.price, total: product.price * quantity, status: "Nuevo", createdAt: "Ahora", stockCommitted: false };
    setState((current) => ({ ...current, orders: [order, ...current.orders] }));
    setOpen(false);
    flash("Pedido creado. El stock se descontará al comenzar a prepararlo.");
  }

  return <>
    <div className="page-heading"><div><p className="eyebrow">Ventas</p><h1>Pedidos</h1><p>Armá pedidos, seguí su avance y actualizá el stock automáticamente.</p></div><button className="button primary" onClick={() => setOpen(true)}>+ Armar pedido</button></div>
    <div className="order-pipeline">{statuses.map((status) => <button className={filter === status ? "stage active" : "stage"} key={status} onClick={() => setFilter(filter === status ? "Todos" : status)}><strong>{state.orders.filter((order) => order.status === status).length}</strong><span>{status}</span></button>)}</div>
    <section className="panel orders-table"><div className="panel-title order-title"><div><h2>{filter === "Todos" ? "Todos los pedidos" : `Pedidos: ${filter}`}</h2><p>Al pasar a “Preparando” se reservan y descuentan las unidades.</p></div><span className="table-result">{visible.length} pedidos</span></div><div className="tenant-orders-head"><span>Pedido</span><span>Cliente</span><span>Detalle</span><span>Total</span><span>Estado</span><span>Contacto</span></div>{visible.map((order) => <div className="tenant-orders-row" key={order.id}><strong>{order.id}<small>{order.createdAt}</small></strong><div><span>{order.customerName}</span><small>{state.customers.find((customer) => customer.id === order.customerId)?.phone}</small></div><div><span>{order.productName}</span><small>{order.quantity} × {money.format(order.unitPrice)} {order.stockCommitted ? "· Stock reservado" : ""}</small></div><b>{money.format(order.total)}</b><select className={`order-status-select status-${order.status.toLowerCase()}`} value={order.status} onChange={(event) => changeStatus(order.id, event.target.value as OrderStatus)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select><a className="row-action" href={`https://wa.me/${(state.customers.find((customer) => customer.id === order.customerId)?.phone ?? "").replace(/\D/g, "")}`} target="_blank" rel="noreferrer">WhatsApp</a></div>)}{visible.length === 0 && <div className="empty-state">No hay pedidos en este estado.</div>}</section>
    {open && <div className="modal-backdrop" onMouseDown={() => setOpen(false)}><form className="modal" onSubmit={save} onMouseDown={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setOpen(false)}>×</button><p className="eyebrow">Nueva venta</p><h2>Armar pedido</h2><p>Seleccioná cliente, producto y cantidad. El pedido quedará pendiente de preparación.</p><label>Cliente<select required value={form.customerId} onChange={(event) => setForm({ ...form, customerId: event.target.value })}>{state.customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name} · {customer.phone}</option>)}</select></label><label>Producto<select required value={form.productId} onChange={(event) => setForm({ ...form, productId: event.target.value })}>{state.products.filter((product) => product.stock > 0).map((product) => <option key={product.id} value={product.id}>{product.name} · {product.stock} disponibles · {money.format(product.price)}</option>)}</select></label><label>Cantidad<input required type="number" min="1" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} /></label><div className="order-rule"><span>i</span><p><strong>Reserva de unidades</strong>El stock no cambia al crear el pedido. Se descuenta cuando comienza la preparación.</p></div><button className="button primary full">Crear pedido</button></form></div>}
  </>;
}
