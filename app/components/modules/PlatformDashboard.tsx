import { platformEvents, spaces, type NavId } from "../../data/demo";

export function PlatformDashboard({ onNavigate }: { onNavigate: (id: NavId) => void }) {
  return (
    <>
      <div className="page-heading dashboard-heading">
        <div><p className="eyebrow">Jueves, 13 de agosto</p><h1>La plataforma está protegida.</h1><p>Información administrativa general, sin datos comerciales de los emprendimientos.</p></div>
        <button className="button primary" onClick={() => onNavigate("espacios")}>+ Crear emprendimiento</button>
      </div>

      <div className="privacy-banner"><span>✓</span><div><strong>Privacidad operativa activa</strong><p>Esta vista muestra estado, accesos y consumo. Clientes, pedidos, ventas y finanzas permanecen fuera de tu alcance.</p></div><button onClick={() => onNavigate("actividad")}>Ver auditoría</button></div>

      <div className="metric-grid platform-metrics">
        <Metric label="Emprendimientos" value="3" note="2 activos · 1 configurando" />
        <Metric label="Usuarios habilitados" value="4" note="1 invitación pendiente" />
        <Metric label="Almacenamiento" value="2,5 GB" note="de 10,5 GB asignados" progress={24} />
        <Metric label="Alertas de acceso" value="0" note="Sin incidentes abiertos" safe />
      </div>

      <div className="dashboard-grid platform-dashboard-grid">
        <section className="panel onboarding-panel">
          <div className="panel-title"><div><h2>Estado de los espacios</h2><p>Seguimiento del alta y la entrega</p></div><button className="link-button" onClick={() => onNavigate("espacios")}>Administrar</button></div>
          <div className="tenant-overview-head"><span>Emprendimiento</span><span>Acceso</span><span>Usuarios</span><span>Último ingreso</span></div>
          {spaces.map((space) => (
            <div className="tenant-overview-row" key={space.id}>
              <div className="space-name"><span className={`avatar avatar-${space.tone}`}>{space.initials}</span><div><strong>{space.name}</strong><small>{space.id} · {space.plan}</small></div></div>
              <span className={`status ${space.status === "Activo" ? "success" : "neutral"}`}>{space.status}</span>
              <span>{space.users} / {space.maxUsers}</span>
              <span>{space.lastAccess}</span>
            </div>
          ))}
        </section>

        <section className="panel activity-panel">
          <div className="panel-title"><div><h2>Actividad administrativa</h2><p>Sin contenido comercial</p></div><button className="link-button" onClick={() => onNavigate("actividad")}>Ver todo</button></div>
          <div className="activity-list">
            {platformEvents.slice(0, 4).map((event) => <div className="activity" key={event.id}><span className={`activity-icon ${event.tone}`}>{event.action.charAt(0)}</span><div><strong>{event.action}</strong><p>{event.subject} · {event.context}</p></div><small>{event.time}</small></div>)}
          </div>
        </section>
      </div>

      <div className="quick-actions">
        <button onClick={() => onNavigate("administradores")}><span>U</span><div><strong>Gestionar accesos</strong><small>Invitaciones, bloqueos y recuperación</small></div><b>→</b></button>
        <button onClick={() => onNavigate("planes")}><span>M</span><div><strong>Planes y módulos</strong><small>Límites por emprendimiento</small></div><b>→</b></button>
        <button onClick={() => onNavigate("actividad")}><span>A</span><div><strong>Auditoría</strong><small>Registro de acciones sensibles</small></div><b>→</b></button>
      </div>
    </>
  );
}

function Metric({ label, value, note, progress, safe }: { label: string; value: string; note: string; progress?: number; safe?: boolean }) {
  return <article className="metric-card platform-metric"><div><span>{label}</span><strong>{value}</strong><small className={safe ? "positive" : ""}>{safe ? "✓ " : ""}{note}</small>{progress !== undefined && <div className="mini-progress"><i style={{ width: `${progress}%` }} /></div>}</div></article>;
}
