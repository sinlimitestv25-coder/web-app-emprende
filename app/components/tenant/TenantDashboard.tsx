"use client";

import type { Order, TenantDemoState, TenantNavId } from "../../data/tenant-demo";
import { AppIcon } from "../ui/AppIcon";

const money = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", currencyDisplay: "symbol", maximumFractionDigits: 0 });

function orderCost(order: Order, state: TenantDemoState) {
  return order.items.reduce((total, item) => total + (state.products.find((product) => product.id === item.productId)?.cost ?? 0) * item.quantity, 0);
}

function orderSummary(order: Order) {
  if (order.items.length === 0) return "Sin productos";
  if (order.items.length === 1) return `${order.items[0].productName} × ${order.items[0].quantity}`;
  return `${order.items.length} productos`;
}

export function TenantDashboard({ state, onNavigate }: { state: TenantDemoState; onNavigate: (id: TenantNavId) => void }) {
  const delivered = state.orders.filter((order) => order.status === "Entregado");
  const sales = delivered.reduce((total, order) => total + order.total, 0);
  const estimatedCost = delivered.reduce((total, order) => total + orderCost(order, state), 0);
  const lowStock = state.products.filter((product) => product.stock <= product.minStock);
  const openOrders = state.orders.filter((order) => !["Entregado", "Cancelado"].includes(order.status));

  const chartOrders = state.orders.slice(0, 6).slice().reverse();
  const chartBars = chartOrders.map((order) => ({ order, cost: orderCost(order, state) }));
  const chartMax = Math.max(1, ...chartBars.flatMap(({ order, cost }) => [order.total, cost]));
  const yLabels = [1, 0.75, 0.5, 0.25, 0].map((fraction) => money.format(Math.round((chartMax * fraction) / 100) * 100));

  return <>
    <section className="tenant-welcome-banner">
      <div className="tenant-welcome-content"><p className="eyebrow">Resumen del negocio</p><h1>Hola, Natalia</h1><p>Todo lo importante de Pensando en ti, claro y a mano.</p><div className="heading-actions"><button className="button banner-secondary" onClick={() => onNavigate("portal")}>Ver portal</button><button className="button banner-primary" onClick={() => onNavigate("pedidos")}>+ Nuevo pedido</button></div></div>
      <span className="tenant-banner-chip">Sábado 15 de agosto · Datos de prueba</span>
    </section>
    <div className="metric-grid tenant-metrics">
      <article className="metric-card"><div><span>Ventas entregadas</span><strong>{money.format(sales)}</strong><small className="positive">{delivered.length} ventas concretadas</small></div><span className="metric-symbol coral"><AppIcon name="money" label="Ventas" /></span></article>
      <article className="metric-card"><div><span>Ganancia estimada</span><strong>{money.format(sales - estimatedCost)}</strong><small>Venta menos costo cargado</small></div><span className="metric-symbol mint"><AppIcon name="profit" label="Ganancia" /></span></article>
      <article className="metric-card"><div><span>Pedidos en curso</span><strong>{openOrders.length}</strong><small>{state.orders.filter((order) => order.status === "Nuevo").length} esperan confirmación</small></div><span className="metric-symbol lilac"><AppIcon name="orders" label="Pedidos" /></span></article>
      <article className="metric-card"><div><span>Stock con alerta</span><strong>{lowStock.length}</strong><small className={lowStock.length ? "warning" : "positive"}>{lowStock.length ? "Necesitan reposición" : "Todo disponible"}</small></div><span className="metric-symbol amber"><AppIcon name="warning" label="Alertas" /></span></article>
    </div>
    <section className="panel sales-chart-panel">
      <div className="panel-title">
        <div><h2>Venta vs. costo</h2><p>Comparación de los últimos pedidos.</p></div>
        <div className="legend"><span><i />Venta</span><span><i className="legend-soft" />Costo</span></div>
      </div>
      {chartBars.length > 0 ? (
        <div className="chart-wrap">
          <div className="y-labels">{yLabels.map((label, index) => <span key={index}>{label}</span>)}</div>
          <div className="bar-chart">
            {chartBars.map(({ order, cost }) => (
              <div className="bar-group" key={order.id}>
                <div className="bars">
                  <span className="bar-main" style={{ height: `${Math.max(4, (order.total / chartMax) * 100)}%` }} title={`Venta ${order.id}: ${money.format(order.total)}`} />
                  <span className="bar-soft" style={{ height: `${Math.max(4, (cost / chartMax) * 100)}%` }} title={`Costo ${order.id}: ${money.format(cost)}`} />
                </div>
                <small>{order.id.replace("PED-", "#")}</small>
              </div>
            ))}
          </div>
        </div>
      ) : <div className="empty-state">Todavía no hay pedidos para graficar.</div>}
    </section>
    <div className="dashboard-grid tenant-dashboard-grid">
      <section className="panel"><div className="panel-title"><div><h2>Pedidos recientes</h2><p>Seguimiento rápido de la preparación y entrega.</p></div><button className="link-button" onClick={() => onNavigate("pedidos")}>Ver todos →</button></div><div className="compact-list">{state.orders.slice(0, 4).map((order) => <article className="compact-row" key={order.id}><span className="order-code">{order.id}</span><div><strong>{order.customerName}</strong><small>{orderSummary(order)}</small></div><b>{money.format(order.total)}</b><span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span></article>)}</div></section>
      <section className="panel"><div className="panel-title"><div><h2>Atención de stock</h2><p>Productos en el mínimo configurado o sin unidades.</p></div><button className="link-button" onClick={() => onNavigate("inventario")}>Gestionar →</button></div><div className="compact-list">{lowStock.map((product) => <article className="stock-alert-row" key={product.id}><span className={product.stock === 0 ? "stock-dot empty" : "stock-dot"}>{product.stock}</span><div><strong>{product.name}</strong><small>Mínimo configurado: {product.minStock}</small></div><span className={product.stock === 0 ? "status danger" : "status neutral"}>{product.stock === 0 ? "Sin stock" : "Stock bajo"}</span></article>)}{lowStock.length === 0 && <div className="empty-state">No hay alertas de stock.</div>}</div></section>
    </div>
    <div className="quick-actions tenant-quick-actions"><button onClick={() => onNavigate("inventario")}><span><AppIcon name="inventory" /></span><div><strong>Cargar producto</strong><small>Sumá un artículo o una nueva variante</small></div><b>→</b></button><button onClick={() => onNavigate("clientes")}><span><AppIcon name="customers" /></span><div><strong>Agendar cliente</strong><small>Guardá sus datos y preferencias</small></div><b>→</b></button><button onClick={() => onNavigate("portal")}><span><AppIcon name="portal" /></span><div><strong>Editar vidriera</strong><small>Actualizá el banner y los productos</small></div><b>→</b></button></div>
  </>;
}
