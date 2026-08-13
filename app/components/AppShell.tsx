"use client";

import { useState } from "react";
import { navItems, type NavId } from "../data/demo";
import { Dashboard } from "./modules/Dashboard";
import { Spaces } from "./modules/Spaces";
import { Inventory } from "./modules/Inventory";
import { Orders } from "./modules/Orders";
import { Portal } from "./modules/Portal";

const moduleCopy: Partial<Record<NavId, { eyebrow: string; title: string; text: string }>> = {
  clientes: { eyebrow: "Relaciones", title: "Clientes", text: "Agenda, historial de compras y comunicación en un solo lugar." },
  finanzas: { eyebrow: "Rentabilidad", title: "Finanzas", text: "Ventas, costos, gastos y ganancias reales por emprendimiento." },
  configuracion: { eyebrow: "Plataforma", title: "Configuración", text: "Planes, permisos, módulos y reglas generales de la plataforma." },
};

export function AppShell() {
  const [active, setActive] = useState<NavId>("resumen");
  const [menuOpen, setMenuOpen] = useState(false);

  function navigate(id: NavId) {
    setActive(id);
    setMenuOpen(false);
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <button className="brand" onClick={() => navigate("resumen")} aria-label="Ir al resumen">
          <span className="brand-mark">N</span>
          <span><strong>Nexo</strong><small>gestión modular</small></span>
        </button>

        <div className="workspace-switcher">
          <span className="avatar avatar-coral">LC</span>
          <span><small>Espacio activo</small><strong>Luna Creativa</strong></span>
          <span className="chevron">⌄</span>
        </div>

        <nav aria-label="Navegación principal">
          <p className="nav-label">Gestión</p>
          {navItems.map((item) => (
            <button key={item.id} className={active === item.id ? "nav-item active" : "nav-item"} onClick={() => navigate(item.id)}>
              <span className="nav-glyph">{item.glyph}</span>{item.label}
              {item.id === "pedidos" && <span className="nav-count">3</span>}
            </button>
          ))}
          <p className="nav-label nav-label-system">Sistema</p>
          <button className={active === "configuracion" ? "nav-item active" : "nav-item"} onClick={() => navigate("configuracion")}>
            <span className="nav-glyph">A</span>Configuración
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="mini-profile"><span className="avatar avatar-dark">JM</span><span><strong>Juan Martín</strong><small>Superadministrador</small></span></div>
          <button className="dots" aria-label="Opciones de cuenta">•••</button>
        </div>
      </aside>

      {menuOpen && <button className="scrim" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" />}

      <main className="main">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">☰</button>
          <div className="topbar-path"><span>Plataforma</span><b>/</b><strong>{navItems.find((item) => item.id === active)?.label ?? "Configuración"}</strong></div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Buscar">⌕</button>
            <button className="icon-button notification" aria-label="Notificaciones">○<span /></button>
            <button className="help-button">¿Necesitás ayuda?</button>
          </div>
        </header>

        <section className="content">
          {active === "resumen" && <Dashboard onNavigate={navigate} />}
          {active === "espacios" && <Spaces />}
          {active === "inventario" && <Inventory />}
          {active === "pedidos" && <Orders />}
          {active === "portal" && <Portal />}
          {moduleCopy[active] && <ComingSoon {...moduleCopy[active]!} />}
        </section>
      </main>
    </div>
  );
}

function ComingSoon({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="coming-page">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{text}</p>
      <div className="coming-card"><span>v0.2</span><strong>Módulo preparado para la siguiente etapa</strong><p>La navegación y el aislamiento por espacio ya forman parte de la base.</p></div>
    </div>
  );
}
