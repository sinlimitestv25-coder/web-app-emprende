"use client";

import { useState } from "react";
import { spaces } from "../../data/demo";

export function Spaces() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">Plataforma multitenant</p><h1>Espacios</h1><p>Creá y administrá cada emprendimiento desde un solo lugar.</p></div><button className="button primary" onClick={() => setShowModal(true)}>+ Nuevo espacio</button></div>
      <div className="summary-strip"><div><span>Espacios totales</span><strong>3</strong></div><div><span>Activos</span><strong>2</strong></div><div><span>En prueba</span><strong>1</strong></div><div><span>Facturación mensual</span><strong>$ 1.968.700</strong></div></div>
      <section className="panel table-panel">
        <div className="table-tools"><div className="search-field">⌕<input aria-label="Buscar espacios" placeholder="Buscar por nombre, titular o ID" /></div><button className="select-button">Todos los estados⌄</button></div>
        <div className="spaces-table">
          <div className="table-head"><span>Emprendimiento</span><span>Plan</span><span>Estado</span><span>Este mes</span><span>Acciones</span></div>
          {spaces.map((space) => <div className="table-row" key={space.id}><div className="space-name"><span className={`avatar avatar-${space.tone}`}>{space.initials}</span><div><strong>{space.name}</strong><small>{space.owner} · {space.id}</small></div></div><span className="plan-pill">{space.plan}</span><span className={`status ${space.status === "Activo" ? "success" : "neutral"}`}>{space.status}</span><div><strong>{space.sales}</strong><small>{space.orders} pedidos</small></div><button className="row-menu" aria-label={`Opciones de ${space.name}`}>•••</button></div>)}
        </div>
      </section>
      {showModal && <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowModal(false)}><div className="modal" role="dialog" aria-modal="true" aria-labelledby="new-space-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowModal(false)} aria-label="Cerrar">×</button><p className="eyebrow">Nuevo cliente</p><h2 id="new-space-title">Crear un espacio</h2><p>El ID y la configuración inicial se generan automáticamente.</p><label>Nombre del emprendimiento<input placeholder="Ej. Mundo Creativo" autoFocus /></label><label>Nombre de la administradora<input placeholder="Nombre y apellido" /></label><div className="form-grid"><label>Correo<input type="email" placeholder="nombre@correo.com" /></label><label>Plan<select defaultValue="Pro"><option>Esencial</option><option>Pro</option><option>Prueba</option></select></label></div><div className="module-options"><span>Módulos iniciales</span><label><input type="checkbox" defaultChecked /> Inventario</label><label><input type="checkbox" defaultChecked /> Pedidos</label><label><input type="checkbox" defaultChecked /> Portal</label><label><input type="checkbox" /> Finanzas</label></div><button className="button primary full" onClick={() => setShowModal(false)}>Crear espacio y enviar invitación</button></div></div>}
    </>
  );
}
