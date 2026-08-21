/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-autofocus */
"use client";

import { useMemo, useState, type FormEvent } from "react";
import { modules, spaces as initialSpaces, type PlatformSpace, type SpaceStatus } from "../../data/demo";
import { isSupabaseConfigured, provisionSpace } from "../../lib/supabase";
import { AppIcon } from "../ui/AppIcon";

export function Spaces({ demoMode }: { demoMode: boolean }) {
  const [spaces, setSpaces] = useState(initialSpaces);
  const [showWizard, setShowWizard] = useState(false);
  const [selected, setSelected] = useState<PlatformSpace | null>(null);
  const [filter, setFilter] = useState("");
  const [notice, setNotice] = useState("");
  const visibleSpaces = useMemo(() => spaces.filter((space) => `${space.name} ${space.owner} ${space.id}`.toLowerCase().includes(filter.toLowerCase())), [spaces, filter]);

  function flash(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  function updateStatus(id: string, status: SpaceStatus) {
    setSpaces((current) => current.map((space) => space.id === id ? { ...space, status } : space));
    setSelected((current) => current?.id === id ? { ...current, status } : current);
  }

  function toggleStatus(space: PlatformSpace) {
    if (space.status !== "Activo" && space.status !== "Suspendido") return;
    updateStatus(space.id, space.status === "Activo" ? "Suspendido" : "Activo");
  }

  function updateDetails(id: string, patch: { name: string; plan: PlatformSpace["plan"]; maxUsers: number }) {
    setSpaces((current) => current.map((space) => space.id === id ? { ...space, ...patch } : space));
    setSelected((current) => current?.id === id ? { ...current, ...patch } : current);
    flash("Espacio actualizado.");
  }

  function deleteSpace(id: string, name: string) {
    if (!window.confirm(`¿Eliminar definitivamente "${name}"? Esta acción no se puede deshacer.`)) return;
    setSpaces((current) => current.filter((space) => space.id !== id));
    setSelected((current) => current?.id === id ? null : current);
    flash("Espacio eliminado.");
  }

  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">Gestión de la plataforma</p><h1>Espacios</h1><p>Creá y administrá emprendimientos sin entrar en su información comercial.</p></div><button className="button primary" onClick={() => setShowWizard(true)}>+ Nuevo emprendimiento</button></div>
      {notice && <div className="toast" role="status"><AppIcon name="check" /> {notice}</div>}
      <div className="summary-strip"><div><span>Espacios totales</span><strong>{spaces.length}</strong></div><div><span>Activos</span><strong>{spaces.filter((space) => space.status === "Activo").length}</strong></div><div><span>Configurando</span><strong>{spaces.filter((space) => space.status === "Configurando").length}</strong></div><div><span>Usuarios asignados</span><strong>{spaces.reduce((total, space) => total + space.users, 0)}</strong></div></div>
      <section className="panel table-panel">
        <div className="table-tools"><div className="search-field">⌕<input aria-label="Buscar espacios" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Buscar por nombre, titular o ID" /></div><button className="select-button">Todos los estados⌄</button></div>
        <div className="spaces-table platform-spaces-table">
          <div className="table-head"><span>Emprendimiento</span><span>Plan</span><span>Estado</span><span>Uso</span><span>Acciones</span></div>
          {visibleSpaces.map((space) => <div className="table-row" key={space.id}><div className="space-name"><span className={`avatar avatar-${space.tone}`}>{space.initials}</span><div><strong>{space.name}</strong><small>{space.owner} · {space.id}</small></div></div><span className="plan-pill">{space.plan}</span><div className="space-status-cell"><span className={`status ${space.status === "Activo" ? "success" : space.status === "Suspendido" ? "danger" : "neutral"}`}>{space.status}</span><button type="button" className={space.status === "Activo" ? "switch active" : "switch"} disabled={space.status !== "Activo" && space.status !== "Suspendido"} aria-label={space.status === "Activo" ? `Suspender ${space.name}` : `Activar ${space.name}`} onClick={() => toggleStatus(space)}><i /></button></div><div><strong>{space.storage}</strong><small>{space.users}/{space.maxUsers} usuarios · {space.portal}</small></div><button className="row-action" onClick={() => setSelected(space)}>Editar</button></div>)}
        </div>
      </section>
      {showWizard && <ProvisionWizard demoMode={demoMode} nextNumber={spaces.length + 1} onClose={() => setShowWizard(false)} onCreated={(space) => { setSpaces((current) => [...current, space]); setShowWizard(false); }} />}
      {selected && <SpaceDrawer space={selected} onClose={() => setSelected(null)} onStatus={updateStatus} onUpdate={updateDetails} onDelete={deleteSpace} flash={flash} />}
    </>
  );
}

function ProvisionWizard({ demoMode, nextNumber, onClose, onCreated }: { demoMode: boolean; nextNumber: number; onClose: () => void; onCreated: (space: PlatformSpace) => void }) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ businessName: "", ownerName: "", email: "", phone: "", plan: "Base", maxUsers: "1", color: "#e7674e", selectedModules: modules.slice(0, 5) });

  function toggleModule(name: string) {
    setForm((current) => ({ ...current, selectedModules: current.selectedModules.includes(name) ? current.selectedModules.filter((item) => item !== name) : [...current.selectedModules, name] }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      let publicId = `NX-${String(nextNumber).padStart(6, "0")}`;
      if (!demoMode && isSupabaseConfigured) {
        const planCode = form.plan === "Equipo" ? "team" : form.plan === "Prueba" ? "trial" : "base";
        const result = await provisionSpace({ name: form.businessName, ownerName: form.ownerName, email: form.email, phone: form.phone, plan: planCode, maxUsers: Number(form.maxUsers), accentColor: form.color, modules: form.selectedModules });
        publicId = result.publicId;
      }
      onCreated({ id: publicId, name: form.businessName, owner: form.ownerName, email: form.email, plan: form.plan as PlatformSpace["plan"], status: "Configurando", modules: form.selectedModules, users: 1, maxUsers: Number(form.maxUsers), storage: "0 MB", lastAccess: "Invitación pendiente", portal: "Borrador", initials: form.businessName.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase(), tone: "blue" });
    } catch {
      setError("No se pudo crear el espacio. Revisá la conexión y volvé a intentar.");
    } finally {
      setSaving(false);
    }
  }

  return <div className="modal-backdrop"><form className="modal provision-modal" onSubmit={submit}><button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">×</button><div className="wizard-progress"><span className={step >= 1 ? "active" : ""}>1</span><i/><span className={step >= 2 ? "active" : ""}>2</span><i/><span className={step >= 3 ? "active" : ""}>3</span></div>{step === 1 && <><p className="eyebrow">Paso 1 de 3</p><h2>Datos del emprendimiento</h2><p>Esta información identifica el espacio; no incluye datos comerciales.</p><label>Nombre del emprendimiento<input value={form.businessName} onChange={(event) => setForm({...form,businessName:event.target.value})} placeholder="Ej. Mundo Creativo" required autoFocus /></label><div className="form-grid"><label>Administradora principal<input value={form.ownerName} onChange={(event) => setForm({...form,ownerName:event.target.value})} placeholder="Nombre y apellido" required /></label><label>Teléfono<input value={form.phone} onChange={(event) => setForm({...form,phone:event.target.value})} placeholder="+54 9..." /></label></div><label>Correo para la invitación<input type="email" value={form.email} onChange={(event) => setForm({...form,email:event.target.value})} placeholder="nombre@correo.com" required /></label><button type="button" className="button primary full" onClick={() => setStep(2)}>Continuar</button></>}{step === 2 && <><p className="eyebrow">Paso 2 de 3</p><h2>Plan, usuarios y módulos</h2><p>Todo queda habilitado inicialmente y puede ajustarse más adelante.</p><div className="form-grid"><label>Plan<select value={form.plan} onChange={(event) => setForm({...form,plan:event.target.value})}><option>Base</option><option>Equipo</option><option>Prueba</option></select></label><label>Máximo de usuarios<select value={form.maxUsers} onChange={(event) => setForm({...form,maxUsers:event.target.value})}><option value="1">1 administrador</option><option value="3">1 admin + 2 empleados</option><option value="6">Hasta 6 usuarios</option></select></label></div><div className="module-selector"><span>Módulos habilitados</span>{modules.map((name) => <label key={name}><input type="checkbox" checked={form.selectedModules.includes(name)} onChange={() => toggleModule(name)} /><i>{form.selectedModules.includes(name) ? "✓" : ""}</i>{name}</label>)}</div><div className="wizard-buttons"><button type="button" className="button secondary" onClick={() => setStep(1)}>Atrás</button><button type="button" className="button primary" onClick={() => setStep(3)}>Continuar</button></div></>}{step === 3 && <><p className="eyebrow">Paso 3 de 3</p><h2>Identidad y confirmación</h2><p>Podrás cargar las primeras imágenes luego de crear el espacio.</p><div className="brand-setup"><div className="logo-drop"><span>{form.businessName ? form.businessName.charAt(0).toUpperCase() : "N"}</span><button type="button">Cargar logo</button></div><label>Color principal<input type="color" value={form.color} onChange={(event) => setForm({...form,color:event.target.value})} /></label></div><div className="provision-summary"><div><span>Emprendimiento</span><strong>{form.businessName || "Sin nombre"}</strong></div><div><span>Administradora</span><strong>{form.ownerName || "Sin asignar"}</strong></div><div><span>Acceso</span><strong>Invitación por correo</strong></div><div><span>Módulos</span><strong>{form.selectedModules.length} habilitados</strong></div></div>{error && <div className="auth-message">{error}</div>}<div className="wizard-buttons"><button type="button" className="button secondary" onClick={() => setStep(2)}>Atrás</button><button className="button primary" disabled={saving}>{saving ? "Creando…" : "Crear espacio e invitar"}</button></div></>}</form></div>;
}

function SpaceDrawer({ space, onClose, onStatus, onUpdate, onDelete, flash }: { space: PlatformSpace; onClose: () => void; onStatus: (id: string, status: SpaceStatus) => void; onUpdate: (id: string, patch: { name: string; plan: PlatformSpace["plan"]; maxUsers: number }) => void; onDelete: (id: string, name: string) => void; flash: (message: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: space.name, plan: space.plan, maxUsers: String(space.maxUsers) });

  function startEdit() {
    setForm({ name: space.name, plan: space.plan, maxUsers: String(space.maxUsers) });
    setEditing(true);
  }

  function saveEdit(event: FormEvent) {
    event.preventDefault();
    onUpdate(space.id, { name: form.name.trim() || space.name, plan: form.plan, maxUsers: Math.max(1, Number(form.maxUsers)) });
    setEditing(false);
  }

  function resetPassword() {
    flash(`Se envió un correo para restablecer la contraseña de ${space.owner}.`);
  }

  return <div className="drawer-backdrop" onMouseDown={onClose}><aside className="space-drawer" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}>×</button><div className="drawer-identity"><span className={`avatar avatar-${space.tone}`}>{space.initials}</span><div><p>{space.id}</p><h2>{space.name}</h2><span className={`status ${space.status === "Activo" ? "success" : "neutral"}`}>{space.status}</span></div></div>
    {editing ? (
      <form className="drawer-edit-form" onSubmit={saveEdit}>
        <label>Nombre del emprendimiento<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
        <label>Plan<select value={form.plan} onChange={(event) => setForm({ ...form, plan: event.target.value as PlatformSpace["plan"] })}><option>Base</option><option>Equipo</option><option>Prueba</option></select></label>
        <label>Máximo de usuarios<input type="number" min="1" value={form.maxUsers} onChange={(event) => setForm({ ...form, maxUsers: event.target.value })} /></label>
        <div className="wizard-buttons"><button type="button" className="button secondary" onClick={() => setEditing(false)}>Cancelar</button><button className="button primary">Guardar cambios</button></div>
      </form>
    ) : (
      <section><h3>Administración</h3><dl><div><dt>Responsable</dt><dd>{space.owner}</dd></div><div><dt>Correo</dt><dd>{space.email}</dd></div><div><dt>Plan</dt><dd>{space.plan}</dd></div><div><dt>Usuarios</dt><dd>{space.users} de {space.maxUsers}</dd></div><div><dt>Uso</dt><dd>{space.storage}</dd></div><div><dt>Último acceso</dt><dd>{space.lastAccess}</dd></div></dl></section>
    )}
    <section><h3>Módulos habilitados</h3><div className="drawer-modules">{space.modules.map((name) => <span key={name}>✓ {name}</span>)}</div></section>
    <div className="privacy-lock"><strong>Información comercial protegida</strong><p>Productos, clientes, pedidos y finanzas no están disponibles en esta vista.</p></div>
    <div className="drawer-actions">
      <button type="button" className="button secondary" onClick={resetPassword}><AppIcon name="lock" /> Restablecer contraseña</button>
      <button type="button" className="button secondary" onClick={startEdit}><AppIcon name="edit" /> Editar</button>
      {space.status === "Suspendido"
        ? <button type="button" className="button primary" onClick={() => onStatus(space.id, "Activo")}>Reactivar espacio</button>
        : <button type="button" className="button danger-button" onClick={() => onStatus(space.id, "Suspendido")}>Suspender espacio</button>}
      <button type="button" className="archive-button" onClick={() => onStatus(space.id, "Archivado")}>Archivar emprendimiento</button>
      <button type="button" className="delete-button" onClick={() => onDelete(space.id, space.name)}><AppIcon name="delete" /> Eliminar espacio</button>
    </div>
  </aside></div>;
}
