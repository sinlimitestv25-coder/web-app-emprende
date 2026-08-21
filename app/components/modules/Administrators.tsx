/* eslint-disable jsx-a11y/no-static-element-interactions */
"use client";

import { useState } from "react";
import { administrators as initialAdministrators } from "../../data/demo";
import { isSupabaseConfigured, managePlatformUser } from "../../lib/supabase";
import { AppIcon } from "../ui/AppIcon";

export function Administrators({ demoMode }: { demoMode: boolean }) {
  const [users, setUsers] = useState(initialAdministrators);
  const [notice, setNotice] = useState("");

  async function action(user: (typeof initialAdministrators)[number], actionName: "reset_access" | "resend_invite" | "suspend") {
    setNotice("");
    try {
      if (!demoMode && isSupabaseConfigured) await managePlatformUser({ action: actionName, userId: user.id, email: user.email });
      if (actionName === "suspend") setUsers((current) => current.map((item) => item.id === user.id ? { ...item, status: "Bloqueado" } : item));
      setNotice(actionName === "reset_access" ? "Correo de recuperación enviado." : actionName === "resend_invite" ? "Invitación reenviada." : "Acceso suspendido.");
    } catch {
      setNotice("No se pudo completar la acción.");
    }
  }

  return <><div className="page-heading"><div><p className="eyebrow">Identidades y acceso</p><h1>Administradores</h1><p>Usuarios vinculados a cada espacio, sin exposición de datos del negocio.</p></div><button className="button secondary">Exportar usuarios</button></div><div className="summary-strip"><div><span>Usuarios totales</span><strong>{users.length}</strong></div><div><span>Administradores</span><strong>{users.filter((user) => user.role === "Administradora").length}</strong></div><div><span>Empleados</span><strong>{users.filter((user) => user.role === "Empleado").length}</strong></div><div><span>Invitaciones pendientes</span><strong>{users.filter((user) => user.status === "Invitado").length}</strong></div></div>{notice && <div className="inline-notice">✓ {notice}</div>}<section className="panel table-panel"><div className="table-tools"><div className="search-field">⌕<input aria-label="Buscar usuarios" placeholder="Buscar persona, correo o espacio" /></div><button className="select-button">Todos los roles⌄</button></div><div className="users-table"><div className="users-head"><span>Usuario</span><span>Espacio</span><span>Rol</span><span>Estado</span><span>Último acceso</span><span>Acciones</span></div>{users.map((user) => <div className="users-row" key={user.id}><div className="user-cell"><span className="avatar avatar-blue">{user.name.split(" ").map((part) => part[0]).join("").slice(0,2)}</span><div><strong>{user.name}</strong><small>{user.email}</small></div></div><div><strong>{user.space}</strong><small>{user.spaceId}</small></div><span>{user.role}</span><span className={`status ${user.status === "Activo" ? "success" : user.status === "Bloqueado" ? "danger" : "neutral"}`}>{user.status}</span><span>{user.lastAccess}</span><div className="row-actions"><button type="button" className="icon-action-button lock" onClick={() => action(user, "reset_access")} aria-label={`Restablecer acceso de ${user.name}`} title="Restablecer acceso"><AppIcon name="lock" /></button><button type="button" className="icon-action-button edit" onClick={() => action(user, "resend_invite")} aria-label={`Reenviar invitación a ${user.name}`} title="Reenviar invitación"><AppIcon name="mail" /></button><button type="button" className="icon-action-button delete" disabled={user.status === "Bloqueado"} onClick={() => action(user, "suspend")} aria-label={`Bloquear a ${user.name}`} title="Bloquear usuario"><AppIcon name="cancel" /></button></div></div>)}</div></section></>;
}
