"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultTenantDemo, migrateOrders, tenantNavItems, tenantStorageKey, type OrderStatus, type TenantDemoState, type TenantNavId } from "../../data/tenant-demo";
import { TenantDashboard } from "./TenantDashboard";
import { TenantInventory } from "./TenantInventory";
import { TenantContacts } from "./TenantContacts";
import { TenantOrders } from "./TenantOrders";
import { TenantPortal } from "./TenantPortal";
import { TenantSettings } from "./TenantSettings";
import { AppIcon } from "../ui/AppIcon";

export function TenantApp({ onExit }: { onExit: () => void }) {
  const [active, setActive] = useState<TenantNavId>("inicio");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [state, setState] = useState<TenantDemoState>(() => {
    if (typeof window === "undefined") return defaultTenantDemo;
    const saved = window.localStorage.getItem(tenantStorageKey);
    if (!saved) return defaultTenantDemo;
    try {
      const parsed = JSON.parse(saved) as TenantDemoState;
      return { ...parsed, portal: { ...defaultTenantDemo.portal, ...parsed.portal }, categories: parsed.categories?.length ? parsed.categories : defaultTenantDemo.categories, orders: migrateOrders(parsed.orders) };
    } catch {
      window.localStorage.removeItem(tenantStorageKey);
      return defaultTenantDemo;
    }
  });
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(tenantStorageKey, JSON.stringify(state));
    } catch {
      flash("No se pudo guardar: el navegador está sin espacio. Probá con imágenes más livianas.");
    }
  }, [state]);

  const lowStock = useMemo(() => state.products.filter((product) => product.stock <= product.minStock).length, [state.products]);

  function navigate(id: TenantNavId) {
    setActive(id);
    setMenuOpen(false);
  }

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  function changeOrderStatus(orderId: string, nextStatus: OrderStatus) {
    let result = "Estado del pedido actualizado.";
    setState((current) => {
      const order = current.orders.find((item) => item.id === orderId);
      if (!order) return current;
      let products = current.products;
      let committed = order.stockCommitted;
      if (!committed && ["Preparando", "Listo", "Entregado"].includes(nextStatus)) {
        const insufficient = order.items.find((line) => {
          const product = products.find((item) => item.id === line.productId);
          return !product || product.stock < line.quantity;
        });
        if (insufficient) {
          result = "No hay stock suficiente para preparar este pedido.";
          return current;
        }
        products = products.map((product) => {
          const line = order.items.find((item) => item.productId === product.id);
          if (!line) return product;
          const stock = product.stock - line.quantity;
          return { ...product, stock, published: stock > 0 && product.published };
        });
        committed = true;
        result = "Pedido en preparación: el stock quedó descontado.";
      }
      if (committed && nextStatus === "Cancelado") {
        products = products.map((product) => {
          const line = order.items.find((item) => item.productId === product.id);
          return line ? { ...product, stock: product.stock + line.quantity } : product;
        });
        committed = false;
        result = "Pedido cancelado: el stock fue reintegrado.";
      }
      return { ...current, products, orders: current.orders.map((item) => item.id === orderId ? { ...item, status: nextStatus, stockCommitted: committed } : item) };
    });
    window.setTimeout(() => flash(result), 0);
  }

  function resetDemo() {
    setState(defaultTenantDemo);
    window.localStorage.removeItem(tenantStorageKey);
    flash("La demostración volvió a sus datos originales.");
  }

  return (
    <div className="app-shell tenant-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""} ${sidebarPinned ? "sidebar-pinned" : ""}`}>
        <button className="brand" onClick={() => navigate("inicio")} aria-label="Ir al inicio"><span className="brand-mark">N</span><span className="sidebar-copy"><strong>Nexo</strong><small>gestión de negocio</small></span></button>
        <button className="sidebar-pin" type="button" onClick={() => setSidebarPinned((current) => !current)} aria-label={sidebarPinned ? "Desfijar menú lateral" : "Fijar menú lateral"} title={sidebarPinned ? "Dejar menú compacto" : "Mantener menú abierto"}>{sidebarPinned ? "‹" : "›"}</button>
        <div className="workspace-switcher">{state.portal.logo ? <img src={state.portal.logo} alt="" className="workspace-logo" /> : <span className="avatar avatar-coral">{state.portal.storeName.split(" ").map((word) => word[0]).slice(0, 2).join("")}</span>}<span className="sidebar-copy"><small>Mi emprendimiento</small><strong>{state.portal.storeName}</strong></span></div>
        <nav aria-label="Navegación del emprendimiento">
          <p className="nav-label">Gestión</p>
          {tenantNavItems.map((item) => <button key={item.id} className={active === item.id ? "nav-item active" : "nav-item"} onClick={() => navigate(item.id)} aria-current={active === item.id ? "page" : undefined} title={item.label}><span className="nav-glyph"><AppIcon name={item.glyph} /></span><span className="nav-text">{item.label}</span>{item.id === "pedidos" && <span className="nav-count">{state.orders.filter((order) => order.status === "Nuevo").length}</span>}{item.id === "inventario" && lowStock > 0 && <span className="nav-alert">{lowStock}</span>}</button>)}
          <p className="nav-label nav-label-system">Negocio</p>
          <button className={active === "ajustes" ? "nav-item active" : "nav-item"} onClick={() => navigate("ajustes")} aria-current={active === "ajustes" ? "page" : undefined} title="Ajustes"><span className="nav-glyph"><AppIcon name="settings" /></span><span className="nav-text">Ajustes</span></button>
        </nav>
        <div className="tenant-demo-note"><strong>Demostración v0.3</strong><span>Los cambios se guardan solamente en este dispositivo.</span></div>
        <div className="sidebar-footer"><div className="mini-profile"><span className="avatar avatar-dark">NM</span><span className="sidebar-copy"><strong>Natalia Martínez</strong><small>Administradora</small></span></div><button className="dots" onClick={onExit} aria-label="Cerrar sesión" title="Cerrar sesión"><AppIcon name="logout" /><span className="sidebar-copy">Salir</span></button></div>
      </aside>
      {menuOpen && <button className="scrim" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" />}
      <main className="main">
        <header className="topbar"><button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">☰</button><div className="topbar-path"><span>{state.portal.storeName}</span><b>/</b><strong>{tenantNavItems.find((item) => item.id === active)?.label ?? "Ajustes"}</strong></div><div className="topbar-actions"><span className="demo-chip">Datos de prueba</span><button className="icon-button notification" aria-label="Notificaciones">○{lowStock > 0 && <span />}</button></div></header>
        <section className="content">
          {notice && <div className="toast" role="status"><AppIcon name="check" /> {notice}</div>}
          {active === "inicio" && <TenantDashboard state={state} onNavigate={navigate} />}
          {active === "inventario" && <TenantInventory products={state.products} setProducts={(products) => setState((current) => ({ ...current, products }))} categories={state.categories} flash={flash} />}
          {active === "clientes" && <TenantContacts mode="customers" state={state} setState={setState} flash={flash} />}
          {active === "proveedores" && <TenantContacts mode="suppliers" state={state} setState={setState} flash={flash} />}
          {active === "pedidos" && <TenantOrders state={state} setState={setState} changeStatus={changeOrderStatus} flash={flash} />}
          {active === "portal" && <TenantPortal state={state} setState={setState} flash={flash} />}
          {active === "ajustes" && <TenantSettings state={state} setState={setState} flash={flash} resetDemo={resetDemo} />}
        </section>
      </main>
    </div>
  );
}
