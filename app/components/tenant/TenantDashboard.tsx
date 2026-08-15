"use client";

import type { TenantDemoState, TenantNavId } from "../../data/tenant-demo";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export function TenantDashboard({ state, onNavigate }: { state: TenantDemoState; onNavigate: (id: TenantNavId) => void }) {
  const delivered = state.orders.filter((order) => order.status === "Entregado");
  const sales = delivered.reduce((total, order) => total + order.total, 0);
  const estimatedCost = delivered.reduce((total, order) => total + (state.products.find((product) => product.id === order.productId)?.cost ?? 0) * order.quantity, 0);
  const lowStock = state.products.filter((product) => product.stock <= product.minStock);
  const openOrders = state.orders.filter((order) => !["Entregado", "Cancelado"].includes(order.status));

  return <>
    <section className="tenant-welcome-banner">
      <div className="tenant-welcome-content"><p className="eyebrow">Resumen del negocio</p><h1>Hola, Marina</h1><p>Todo lo importante de Luna Creativa, claro y a mano.</p><div className="heading-actions"><button className="button banner-secondary" onClick={() => onNavigate("portal")}>Ver portal</button><button className="button banner-primary" onClick={() => onNavigate("pedidos")}>+ Nuevo pedido</button></div></div>
      <span className="tenant-banner-chip">Sábado 15 de agosto · Datos de prueba</span>
    </section>
    <div className="metric-grid tenant-metrics">
      <article className="metric-card"><div><span>Ventas entregadas</span><strong>{money.format(sales)}</strong><small className="positive">{delivered.length} ventas concretadas</small></div><span className="metric-symbol coral">$</span></article>
      <article className="metric-card"><div><span>Ganancia estimada</span><strong>{money.format(sales - estimatedCost)}</strong><small>Venta menos costo cargado</small></div><span className="metric-symbol mint">↗</span></article>
      <article className="metric-card"><div><span>Pedidos en curso</span><strong>{openOrders.length}</strong><small>{state.orders.filter((order) => order.status === "Nuevo").length} esperan confirmación</small></div><span className="metric-symbol lilac">P</span></article>
      <article className="metric-card"><div><span>Stock con alerta</span><strong>{lowStock.length}</strong><small className={lowStock.length ? "warning" : "positive"}>{lowStock.length ? "Necesitan reposición" : "Todo disponible"}</small></div><span className="metric-symbol amber">!</span></article>
    </div>
    <div className="dashboard-grid tenant-dashboard-grid">
      <section className="panel"><div className="panel-title"><div><h2>Pedidos recientes</h2><p>Seguimiento rápido de la preparación y entrega.</p></div><button className="link-button" onClick={() => onNavigate("pedidos")}>Ver todos →</button></div><div className="compact-list">{state.orders.slice(0, 4).map((order) => <article className="compact-row" key={order.id}><span className="order-code">{order.id}</span><div><strong>{order.customerName}</strong><small>{order.productName} × {order.quantity}</small></div><b>{money.format(order.total)}</b><span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span></article>)}</div></section>
      <section className="panel"><div className="panel-title"><div><h2>Atención de stock</h2><p>Productos en el mínimo configurado o sin unidades.</p></div><button className="link-button" onClick={() => onNavigate("inventario")}>Gestionar →</button></div><div className="compact-list">{lowStock.map((product) => <article className="stock-alert-row" key={product.id}><span className={product.stock === 0 ? "stock-dot empty" : "stock-dot"}>{product.stock}</span><div><strong>{product.name}</strong><small>Mínimo configurado: {product.minStock}</small></div><span className={product.stock === 0 ? "status danger" : "status neutral"}>{product.stock === 0 ? "Sin stock" : "Stock bajo"}</span></article>)}{lowStock.length === 0 && <div className="empty-state">No hay alertas de stock.</div>}</div></section>
    </div>
    <div className="quick-actions tenant-quick-actions"><button onClick={() => onNavigate("inventario")}><span>+</span><div><strong>Cargar producto</strong><small>Sumá un artículo o una nueva variante</small></div><b>→</b></button><button onClick={() => onNavigate("clientes")}><span>C</span><div><strong>Agendar cliente</strong><small>Guardá sus datos y preferencias</small></div><b>→</b></button><button onClick={() => onNavigate("portal")}><span>W</span><div><strong>Editar vidriera</strong><small>Actualizá el banner y los productos</small></div><b>→</b></button></div>
  </>;
}
