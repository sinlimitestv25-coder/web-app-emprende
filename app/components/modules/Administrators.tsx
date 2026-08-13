/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import { useState } from "react";
import { administrators as initialAdministrators } from "../../data/demo";
import { isSupabaseConfigured, managePlatformUser } from "../../lib/supabase";

export function Administrators({ demoMode }: { demoMode: boolean }) {
  const [users, setUsers] = useState(initialAdministrators);
  const [notice, setNotice] = useState("");
  const [selected, setSelected] = useState<(typeof initialAdministrators)[number] | null>(null);

  async function action(actionName: "reset_access" | "resend_invite" | "suspend") {
    if (!selected) return;
    setNotice("");
    try {
      if (!demoMode && isSupabaseConfigured) await managePlatformUser({ action: actionName, userId: selected.id, email: selected.email });
      if (actionName === "suspend") setUsers((current) => current.map((user) => user.id === selected.id ? { ...user, status: "Bloqueado" } : user));
      setNotice(actionName === "reset_access" ? "Correo de recuperación enviado." : actionName === "resend_invite" ? "Invitación reenviada." : "Acceso suspendido.");
      setSelected(null);
    } catch {
      setNotice("No se pudo completar la acción.");
    }
  }

  return <><div className="page-heading"><div><p className="eyebrow">Identidades y acceso</p><h1>Administradores</h1><p>Usuarios vinculados a cada espacio, sin exposición de datos del negocio.</p></div><button className="button secondary">Exportar usuarios</button></div><div className="summary-strip"><div><span>Usuarios totales</span><strong>{users.length}</strong></div><div><span>Administradores</span><strong>{users.filter((user) => user.role === "Administradora").length}</strong></div><div><span>Empleados</span><strong>{users.filter((user) => user.role === "Empleado").length}</strong></div><div><span>Invitaciones pendientes</span><strong>{users.filter((user) => user.status === "Invitado").length}</strong></div></div>{notice && <div className="inline-notice">✓ {notice}</div>}<section className="panel table-panel"><div className="table-tools"><div className="search-field">⌕<input aria-label="Buscar usuarios" placeholder="Buscar persona, correo o espacio" /></div><button className="select-button">Todos los roles⌄</button></div><div className="users-table"><div className="users-head"><span>Usuario</span><span>Espacio</span><span>Rol</span><span>Estado</span><span>Último acceso</span><span>Acciones</span></div>{users.map((user) => <div className="users-row" key={user.id}><div className="user-cell"><span className="avatar avatar-blue">{user.name.split(" ").map((part) => part[0]).join("").slice(0,2)}</span><div><strong>{user.name}</strong><small>{user.email}</small></div></div><div><strong>{user.space}</strong><small>{user.spaceId}</small></div><span>{user.role}</span><span className={`status ${user.status === "Activo" ? "success" : user.status === "Bloqueado" ? "danger" : "neutral"}`}>{user.status}</span><span>{user.lastAccess}</span><button className="row-action" onClick={() => setSelected(user)}>Gestionar</button></div>)}</div></section>{selected && <div className="modal-backdrop" onMouseDown={() => setSelected(null)}><div className="modal access-modal" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)}>×</button><p className="eyebrow">Gestión de acceso</p><h2>{selected.name}</h2><p>{selected.email} · {selected.space}</p><div className="access-actions"><button onClick={() => action("reset_access")}><span>R</span><div><strong>Restablecer acceso</strong><small>Envía un correo seguro para crear una nueva contraseña.</small></div></button><button onClick={() => action("resend_invite")}><span>I</span><div><strong>Reenviar invitación</strong><small>Genera un nuevo enlace de incorporación.</small></div></button><button className="access-danger" onClick={() => action("suspend")}><span>B</span><div><strong>Bloquear usuario</strong><small>Impide nuevos accesos hasta su reactivación.</small></div></button></div></div></div>}</>;
}
