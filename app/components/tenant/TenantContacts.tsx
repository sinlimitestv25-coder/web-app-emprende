"use client";

/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions -- modal backdrop is an optional pointer shortcut; every modal also has a keyboard-accessible close button */

import { useMemo, useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import type { Customer, Supplier, TenantDemoState } from "../../data/tenant-demo";
import { AppIcon } from "../ui/AppIcon";

type Props = { mode: "customers" | "suppliers"; state: TenantDemoState; setState: Dispatch<SetStateAction<TenantDemoState>>; flash: (message: string) => void };

export function TenantContacts({ mode, state, setState, flash }: Props) {
  const isCustomers = mode === "customers";
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [customerForm, setCustomerForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [supplierForm, setSupplierForm] = useState({ name: "", contact: "", phone: "", supplies: "" });
  const records = isCustomers ? state.customers : state.suppliers;
  const visible = useMemo(() => records.filter((record) => Object.values(record).join(" ").toLowerCase().includes(search.toLowerCase())), [records, search]);

  function save(event: FormEvent) {
    event.preventDefault();
    if (isCustomers) {
      const customer: Customer = { id: `cli_${Date.now()}`, ...customerForm };
      setState((current) => ({ ...current, customers: [customer, ...current.customers] }));
      setCustomerForm({ name: "", phone: "", email: "", notes: "" });
      flash("Cliente agendado correctamente.");
    } else {
      const supplier: Supplier = { id: `pro_${Date.now()}`, ...supplierForm };
      setState((current) => ({ ...current, suppliers: [supplier, ...current.suppliers] }));
      setSupplierForm({ name: "", contact: "", phone: "", supplies: "" });
      flash("Proveedor agregado correctamente.");
    }
    setOpen(false);
  }

  return <>
    <div className="page-heading"><div><p className="eyebrow">{isCustomers ? "Relaciones comerciales" : "Abastecimiento"}</p><h1>{isCustomers ? "Clientes" : "Proveedores"}</h1><p>{isCustomers ? "Guardá los datos, preferencias e historial de cada comprador." : "Centralizá los contactos y materiales que ofrece cada proveedor."}</p></div><button className="button primary" onClick={() => setOpen(true)}>+ {isCustomers ? "Agendar cliente" : "Agregar proveedor"}</button></div>
    <div className="summary-strip contact-summary icon-summary"><ContactStat icon={isCustomers ? "customers" : "suppliers"} tone="coral" label={isCustomers ? "Clientes registrados" : "Proveedores activos"} value={records.length} /><ContactStat icon="orders" tone="mint" label={isCustomers ? "Con pedidos" : "Rubros cubiertos"} value={isCustomers ? new Set(state.orders.map((order) => order.customerId)).size : state.suppliers.length} /><ContactStat icon={isCustomers ? "activity" : "portal"} tone="lilac" label={isCustomers ? "Pedidos históricos" : "Contactos disponibles"} value={isCustomers ? state.orders.length : state.suppliers.filter((supplier) => supplier.phone).length} /></div>
    <section className="panel contacts-panel"><div className="table-tools"><label className="search-field">⌕<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Buscar ${isCustomers ? "cliente" : "proveedor"}…`} /></label><span className="table-result">{visible.length} contactos</span></div><div className="contact-grid">{visible.map((record) => isCustomers ? <CustomerCard key={record.id} customer={record as Customer} orders={state.orders.filter((order) => order.customerId === record.id).length} /> : <SupplierCard key={record.id} supplier={record as Supplier} />)}</div></section>
    {open && <div className="modal-backdrop" onMouseDown={() => setOpen(false)}><form className="modal contact-modal" onSubmit={save} onMouseDown={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setOpen(false)}>×</button><p className="eyebrow">Nuevo contacto</p><h2>{isCustomers ? "Agendar cliente" : "Agregar proveedor"}</h2><p>Quedará disponible para los próximos pedidos y comunicaciones.</p>{isCustomers ? <><label>Nombre completo<input required value={customerForm.name} onChange={(event) => setCustomerForm({ ...customerForm, name: event.target.value })} /></label><div className="form-grid"><label>WhatsApp<input required value={customerForm.phone} onChange={(event) => setCustomerForm({ ...customerForm, phone: event.target.value })} placeholder="+54 9…" /></label><label>Correo electrónico<input type="email" value={customerForm.email} onChange={(event) => setCustomerForm({ ...customerForm, email: event.target.value })} /></label></div><label>Notas<input value={customerForm.notes} onChange={(event) => setCustomerForm({ ...customerForm, notes: event.target.value })} placeholder="Preferencias, entrega, personalización…" /></label></> : <><label>Empresa o proveedor<input required value={supplierForm.name} onChange={(event) => setSupplierForm({ ...supplierForm, name: event.target.value })} /></label><div className="form-grid"><label>Persona de contacto<input required value={supplierForm.contact} onChange={(event) => setSupplierForm({ ...supplierForm, contact: event.target.value })} /></label><label>WhatsApp<input required value={supplierForm.phone} onChange={(event) => setSupplierForm({ ...supplierForm, phone: event.target.value })} /></label></div><label>Materiales o productos<input required value={supplierForm.supplies} onChange={(event) => setSupplierForm({ ...supplierForm, supplies: event.target.value })} /></label></>}<button className="button primary full">Guardar contacto</button></form></div>}
  </>;
}

function ContactStat({ icon, tone, label, value }: { icon: string; tone: string; label: string; value: number }) {
  return <div><span className={`summary-icon ${tone}`}><AppIcon name={icon} label={label} /></span><span>{label}</span><strong>{value}</strong></div>;
}

function CustomerCard({ customer, orders }: { customer: Customer; orders: number }) {
  return <article className="contact-card"><span className="avatar avatar-mint">{customer.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</span><div className="contact-card-head"><strong>{customer.name}</strong><small>{orders} {orders === 1 ? "pedido" : "pedidos"}</small></div><dl><div><dt>WhatsApp</dt><dd>{customer.phone}</dd></div><div><dt>Correo</dt><dd>{customer.email || "Sin correo"}</dd></div></dl><p>{customer.notes || "Sin notas cargadas."}</p><a className="button secondary contact-action" href={`https://wa.me/${customer.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">Abrir WhatsApp</a></article>;
}

function SupplierCard({ supplier }: { supplier: Supplier }) {
  return <article className="contact-card"><span className="avatar avatar-lilac">{supplier.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</span><div className="contact-card-head"><strong>{supplier.name}</strong><small>{supplier.contact}</small></div><dl><div><dt>WhatsApp</dt><dd>{supplier.phone}</dd></div><div><dt>Provee</dt><dd>{supplier.supplies}</dd></div></dl><a className="button secondary contact-action" href={`https://wa.me/${supplier.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">Consultar disponibilidad</a></article>;
}
