"use client";

import { useState, type FormEvent } from "react";
import { getSupabase, isSupabaseConfigured, requirePlatformAdmin } from "../../lib/supabase";

export function LoginScreen({ onDemo, onSignedIn }: { onDemo: (view: "platform" | "tenant") => void; onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!isSupabaseConfigured) {
      setMessage("Conectá el proyecto de Supabase para habilitar el acceso real.");
      return;
    }

    setLoading(true);
    setMessage("");
    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage("No pudimos validar esas credenciales.");
      setLoading(false);
      return;
    }

    if (!(await requirePlatformAdmin())) {
      await supabase.auth.signOut();
      setMessage("Esta cuenta no tiene acceso a la superadministración.");
      setLoading(false);
      return;
    }

    onSignedIn();
  }

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand"><span className="brand-mark">N</span><strong>Nexo</strong></div>
        <div className="login-message"><p>PLATAFORMA MULTITENANT</p><h1>Administrá el crecimiento.<br/>Protegé cada negocio.</h1><span>Un panel exclusivamente diseñado para crear espacios, gestionar accesos y controlar la plataforma sin entrar en la operación privada de los emprendimientos.</span></div>
        <div className="login-security"><i>✓</i><span><strong>Aislamiento por diseño</strong>Las reglas de acceso se aplican también en la base de datos.</span></div>
      </section>
      <section className="login-form-panel">
        <form className="login-card" onSubmit={submit}>
          <p className="eyebrow">Acceso restringido</p>
          <h2>Superadministración</h2>
          <p>Ingresá con tu cuenta autorizada de Nexo.</p>
          <label>Correo electrónico<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@correo.com" required /></label>
          <label>Contraseña<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••••" required /></label>
          {message && <div className="auth-message">{message}</div>}
          <button className="button primary full" disabled={loading}>{loading ? "Verificando…" : "Ingresar de forma segura"}</button>
          <div className="demo-options">
            <button type="button" className="demo-access demo-tenant" onClick={() => onDemo("tenant")}><strong>Entrar al emprendimiento</strong><span>Probar stock, clientes, pedidos y portal</span></button>
            <button type="button" className="demo-access" onClick={() => onDemo("platform")}><strong>Entrar como superadministrador</strong><span>Gestionar espacios, accesos y módulos</span></button>
          </div>
          <small>{isSupabaseConfigured ? "Conexión Supabase disponible" : "Demostración local · Supabase pendiente de vinculación"}</small>
        </form>
      </section>
    </main>
  );
}
