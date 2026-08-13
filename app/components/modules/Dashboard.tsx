import type { NavId } from "../../data/demo";
import { orders, spaces } from "../../data/demo";

export function Dashboard({ onNavigate }: { onNavigate: (id: NavId) => void }) {
  return (
    <>
      <div className="page-heading dashboard-heading">
        <div><p className="eyebrow">Jueves, 13 de agosto</p><h1>Todo en orden, Juan.</h1><p>Así se está moviendo la plataforma este mes.</p></div>
        <div className="heading-actions"><button className="button secondary">Descargar reporte</button><button className="button primary" onClick={() => onNavigate("espacios")}>+ Nuevo espacio</button></div>
      </div>

      <div className="metric-grid">
        <Metric label="Ventas totales" value="$ 1.968.700" note="↑ 18,4% vs. mes anterior" positive spark="sales" />
        <Metric label="Ganancia estimada" value="$ 742.840" note="37,7% de margen" spark="profit" />
        <Metric label="Pedidos" value="75" note="12 por preparar" alert spark="orders" />
        <Metric label="Espacios activos" value="2" note="+ 1 en configuración" spark="spaces" />
      </div>

      <div className="dashboard-grid">
        <section className="panel chart-panel">
          <div className="panel-title"><div><h2>Rendimiento</h2><p>Ventas de todos los espacios</p></div><button className="select-button">Últimos 6 meses⌄</button></div>
          <div className="legend"><span><i className="legend-primary" />Ventas</span><span><i className="legend-soft" />Gastos</span></div>
          <div className="chart-wrap">
            <div className="y-labels"><span>$2M</span><span>$1.5M</span><span>$1M</span><span>$500K</span><span>$0</span></div>
            <div className="bar-chart" aria-label="Gráfico de ventas y gastos de marzo a agosto">
              {[{m:"Mar",a:42,b:22},{m:"Abr",a:55,b:28},{m:"May",a:48,b:24},{m:"Jun",a:68,b:31},{m:"Jul",a:74,b:35},{m:"Ago",a:88,b:39}].map((bar) => <div className="bar-group" key={bar.m}><div className="bars"><span className="bar-main" style={{height:`${bar.a}%`}}/><span className="bar-soft" style={{height:`${bar.b}%`}}/></div><small>{bar.m}</small></div>)}
            </div>
          </div>
        </section>

        <section className="panel activity-panel">
          <div className="panel-title"><div><h2>Actividad reciente</h2><p>En toda la plataforma</p></div><button className="link-button">Ver todo</button></div>
          <div className="activity-list">
            <Activity glyph="P" tone="mint" title="Nuevo pedido #1048" text="Luna Creativa · $ 38.400" time="Hace 12 min" />
            <Activity glyph="S" tone="amber" title="Stock bajo" text="Vinilo Dragon Ball · 3 unidades" time="Hace 36 min" />
            <Activity glyph="E" tone="lilac" title="Nuevo espacio creado" text="Tinta & Magia · Plan prueba" time="Hace 2 h" />
            <Activity glyph="$" tone="blue" title="Venta confirmada #1045" text="Luna Creativa · $ 18.900" time="Hace 4 h" />
          </div>
        </section>
      </div>

      <div className="dashboard-grid lower-grid">
        <section className="panel spaces-compact">
          <div className="panel-title"><div><h2>Espacios</h2><p>Estado general de tus clientes</p></div><button className="link-button" onClick={() => onNavigate("espacios")}>Administrar</button></div>
          {spaces.slice(0, 2).map((space) => <div className="space-row" key={space.id}><span className={`avatar avatar-${space.tone}`}>{space.initials}</span><div><strong>{space.name}</strong><small>{space.owner} · {space.id}</small></div><span className="status success">{space.status}</span><div className="space-sales"><strong>{space.sales}</strong><small>{space.orders} pedidos</small></div></div>)}
        </section>
        <section className="panel orders-compact">
          <div className="panel-title"><div><h2>Pedidos recientes</h2><p>Luna Creativa</p></div><button className="link-button" onClick={() => onNavigate("pedidos")}>Ver pedidos</button></div>
          {orders.slice(0, 3).map((order) => <div className="order-row" key={order.id}><strong>{order.id}</strong><div><span>{order.customer}</span><small>{order.item}</small></div><span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span><b>{order.total}</b></div>)}
        </section>
      </div>
    </>
  );
}

function Metric({ label, value, note, positive, alert, spark }: { label: string; value: string; note: string; positive?: boolean; alert?: boolean; spark: string }) {
  return <article className="metric-card"><div><span>{label}</span><strong>{value}</strong><small className={positive ? "positive" : alert ? "warning" : ""}>{note}</small></div><div className={`spark spark-${spark}`}><i/><i/><i/><i/><i/><i/></div></article>;
}

function Activity({ glyph, tone, title, text, time }: { glyph: string; tone: string; title: string; text: string; time: string }) {
  return <div className="activity"><span className={`activity-icon ${tone}`}>{glyph}</span><div><strong>{title}</strong><p>{text}</p></div><small>{time}</small></div>;
}
