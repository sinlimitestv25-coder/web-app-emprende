"use client";

import { useEffect, useState } from "react";
import { navItems, type NavId } from "../data/demo";
import { getSupabase, isSupabaseConfigured } from "../lib/supabase";
import { LoginScreen } from "./auth/LoginScreen";
import { PlatformDashboard } from "./modules/PlatformDashboard";
import { Spaces } from "./modules/Spaces";
import { Administrators } from "./modules/Administrators";
import { Plans } from "./modules/Plans";
import { Activity } from "./modules/Activity";
import { TenantApp } from "./tenant/TenantApp";
import { AppIcon } from "./ui/AppIcon";

export function AppShell() {
  const [active, setActive] = useState<NavId>("resumen");
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [authState, setAuthState] = useState<"signed-out" | "signed-in">("signed-out");
  const [demoMode, setDemoMode] = useState(false);
  const [demoView, setDemoView] = useState<"platform" | "tenant">("platform");

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => setAuthState(data.session ? "signed-in" : "signed-out"));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState(session ? "signed-in" : "signed-out");
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  function navigate(id: NavId) {
    setActive(id);
    setMenuOpen(false);
  }

  async function signOut() {
    if (!demoMode && isSupabaseConfigured) await getSupabase().auth.signOut();
    setDemoMode(false);
    setAuthState("signed-out");
  }

  if (demoMode && demoView === "tenant") {
    return <TenantApp onExit={() => { setDemoMode(false); setDemoView("platform"); setAuthState("signed-out"); }} />;
  }

  if (authState === "signed-out" && !demoMode) {
    return <LoginScreen onDemo={(view) => { setDemoView(view); setDemoMode(true); setAuthState("signed-in"); }} onSignedIn={() => setAuthState("signed-in")} />;
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""} ${sidebarPinned ? "sidebar-pinned" : ""}`}>
        <button className="brand" onClick={() => navigate("resumen")} aria-label="Ir al resumen">
          <span className="brand-mark">N</span>
          <span className="sidebar-copy"><strong>Nexo</strong><small>plataforma SaaS</small></span>
        </button>
        <button className="sidebar-pin" type="button" onClick={() => setSidebarPinned((current) => !current)} aria-label={sidebarPinned ? "Desfijar menú lateral" : "Fijar menú lateral"} title={sidebarPinned ? "Dejar menú compacto" : "Mantener menú abierto"}>{sidebarPinned ? "‹" : "›"}</button>

        <div className="platform-badge">
          <span className="platform-badge-icon">S</span>
          <span className="sidebar-copy"><small>Vista actual</small><strong>Superadministración</strong></span>
        </div>

        <nav aria-label="Navegación principal">
          <p className="nav-label">Plataforma</p>
          {navItems.map((item) => (
            <button key={item.id} className={active === item.id ? "nav-item active" : "nav-item"} onClick={() => navigate(item.id)} aria-current={active === item.id ? "page" : undefined} title={item.label}>
              <span className="nav-glyph"><AppIcon name={item.glyph} /></span><span className="nav-text">{item.label}</span>
              {item.id === "administradores" && <span className="nav-count">1</span>}
            </button>
          ))}
          <p className="nav-label nav-label-system">Sistema</p>
          <button className={active === "configuracion" ? "nav-item active" : "nav-item"} onClick={() => navigate("configuracion")} aria-current={active === "configuracion" ? "page" : undefined} title="Configuración">
            <span className="nav-glyph"><AppIcon name="settings" /></span><span className="nav-text">Configuración</span>
          </button>
        </nav>

        <div className="privacy-note"><span>✓</span><p><strong>Vista protegida</strong>Sin acceso a datos comerciales de los emprendimientos.</p></div>

        <div className="sidebar-footer">
          <div className="mini-profile"><span className="avatar avatar-dark">JM</span><span className="sidebar-copy"><strong>Juan Martín</strong><small>Superadministrador</small></span></div>
          <button className="dots" onClick={signOut} aria-label="Cerrar sesión">Salir</button>
        </div>
      </aside>

      {menuOpen && <button className="scrim" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" />}

      <main className="main">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">☰</button>
          <div className="topbar-path"><span>Superadministración</span><b>/</b><strong>{navItems.find((item) => item.id === active)?.label ?? "Configuración"}</strong></div>
          <div className="topbar-actions">
            {demoMode && <span className="demo-chip">Modo demostración</span>}
            <button className="icon-button" aria-label="Buscar">⌕</button>
            <button className="icon-button notification" aria-label="Notificaciones">○<span /></button>
          </div>
        </header>

        <section className="content">
          {active === "resumen" && <PlatformDashboard onNavigate={navigate} />}
          {active === "espacios" && <Spaces demoMode={demoMode} />}
          {active === "administradores" && <Administrators demoMode={demoMode} />}
          {active === "planes" && <Plans />}
          {active === "actividad" && <Activity />}
          {active === "configuracion" && <Settings />}
        </section>
      </main>
    </div>
  );
}

function Settings() {
  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">Seguridad y plataforma</p><h1>Configuración</h1><p>Parámetros generales sin acceso a información privada de los negocios.</p></div></div>
      <div className="settings-grid">
        <section className="panel settings-card"><span className="settings-icon"><AppIcon name="shield" /></span><div><h2>Seguridad del superadministrador</h2><p>Autenticación de dos factores, duración de sesión y alertas de acceso.</p><button className="button secondary">Configurar seguridad</button></div></section>
        <section className="panel settings-card"><span className="settings-icon"><AppIcon name="portal" /></span><div><h2>Correos de acceso</h2><p>Invitaciones, recuperación de contraseña y remitente de confianza.</p><button className="button secondary">Editar comunicaciones</button></div></section>
        <section className="panel settings-card"><span className="settings-icon"><AppIcon name="activity" /></span><div><h2>Auditoría</h2><p>Retención de eventos administrativos y exportación de registros.</p><button className="button secondary">Ver política</button></div></section>
      </div>
    </>
  );
}
