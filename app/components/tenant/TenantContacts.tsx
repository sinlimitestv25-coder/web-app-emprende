"use client";

/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions -- modal backdrop is an optional pointer shortcut; every modal also has a keyboard-accessible close button */

import { useMemo, useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import type { Customer, Supplier, TenantDemoState } from "../../data/tenant-demo";
import { AppIcon } from "../ui/AppIcon";

type Props = { mode: "customers" | "suppliers"; state: TenantDemoState; setState: Dispatch<SetStateAction<TenantDemoState>>; flash: (message: string) => void };

const emptyCustomerForm = { name: "", phone: "", email: "", notes: "" };
const emptySupplierForm = { name: "", contact: "", phone: "", supplies: "" };

export function TenantContacts({ mode, state, setState, flash }: Props) {
  const isCustomers = mode === "customers";
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customerForm, setCustomerForm] = useState(emptyCustomerForm);
  const [supplierForm, setSupplierForm] = useState(emptySupplierForm);
  const records = isCustomers ? state.customers : state.suppliers;
  const visible = useMemo(() => records.filter((record) => Object.values(record).join(" ").toLowerCase().includes(search.toLowerCase())), [records, search]);

  function openNew() {
    setEditingId(null);
    setCustomerForm(emptyCustomerForm);
    setSupplierForm(emptySupplierForm);
    setOpen(true);
  }

  function openEdit(record: Customer | Supplier) {
    setEditingId(record.id);
    if (isCustomers) setCustomerForm(record as Customer);
    else setSupplierForm(record as Supplier);
    setOpen(true);
  }

  function remove(id: string) {
    if (isCustomers) setState((current) => ({ ...current, customers: current.customers.filter((customer) => customer.id !== id) }));
    else setState((current) => ({ ...current, suppliers: current.suppliers.filter((supplier) => supplier.id !== id) }));
    flash(isCustomers ? "Cliente eliminado." : "Proveedor eliminado.");
  }

  function save(event: FormEvent) {
    event.preventDefault();
    if (isCustomers) {
      const customer: Customer = { id: editingId ?? `cli_${Date.now()}`, ...customerForm };
      setState((current) => ({ ...current, customers: editingId ? current.customers.map((item) => item.id === editingId ? customer : item) : [customer, ...current.customers] }));
      flash(editingId ? "Cliente actualizado." : "Cliente agendado correctamente.");
    } else {
      const supplier: Supplier = { id: editingId ?? `pro_${Date.now()}`, ...supplierForm };
      setState((current) => ({ ...current, suppliers: editingId ? current.suppliers.map((item) => item.id === editingId ? supplier : item) : [supplier, ...current.suppliers] }));
      flash(editingId ? "Proveedor actualizado." : "Proveedor agregado correctamente.");
    }
    setOpen(false);
  }

  return <>
    <div className="page-heading"><div><p className="eyebrow">{isCustomers ? "Relaciones comerciales" : "Abastecimiento"}</p><h1>{isCustomers ? "Clientes" : "Proveedores"}</h1><p>{isCustomers ? "Guardá los datos, preferencias e historial de cada comprador." : "Centralizá los contactos y materiales que ofrece cada proveedor."}</p></div><button className="button primary" onClick={openNew}>+ {isCustomers ? "Agendar cliente" : "Agregar proveedor"}</button></div>
    <div className="summary-strip contact-summary icon-summary"><ContactStat icon={isCustomers ? "customers" : "suppliers"} tone="coral" label={isCustomers ? "Clientes registrados" : "Proveedores activos"} value={records.length} /><ContactStat icon="orders" tone="mint" label={isCustomers ? "Con pedidos" : "Rubros cubiertos"} value={isCustomers ? new Set(state.orders.map((order) => order.customerId)).size : state.suppliers.length} /><ContactStat icon={isCustomers ? "activity" : "portal"} tone="lilac" label={isCustomers ? "Pedidos históricos" : "Contactos disponibles"} value={isCustomers ? state.orders.length : state.suppliers.filter((supplier) => supplier.phone).length} /></div>
    <section className="panel contacts-panel table-panel">
      <div className="table-tools"><label className="search-field">⌕<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Buscar ${isCustomers ? "cliente" : "proveedor"}…`} /></label><span className="table-result">{visible.length} contactos</span></div>
      <div className="contacts-head"><span>{isCustomers ? "Cliente" : "Proveedor"}</span><span>WhatsApp</span><span>{isCustomers ? "Notas" : "Provee"}</span><span>Acciones</span></div>
      {visible.map((record) => isCustomers
        ? <CustomerRow key={record.id} customer={record as Customer} orders={state.orders.filter((order) => order.customerId === record.id).length} onEdit={() => openEdit(record)} onDelete={() => remove(record.id)} />
        : <SupplierRow key={record.id} supplier={record as Supplier} onEdit={() => openEdit(record)} onDelete={() => remove(record.id)} />)}
      {visible.length === 0 && <div className="empty-state">No encontramos contactos con esa búsqueda.</div>}
    </section>
    {open && <div className="modal-backdrop" onMouseDown={() => setOpen(false)}><form className="modal contact-modal" onSubmit={save} onMouseDown={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setOpen(false)}>×</button><p className="eyebrow">{editingId ? "Editar contacto" : "Nuevo contacto"}</p><h2>{editingId ? (isCustomers ? "Editar cliente" : "Editar proveedor") : (isCustomers ? "Agendar cliente" : "Agregar proveedor")}</h2><p>Quedará disponible para los próximos pedidos y comunicaciones.</p>{isCustomers ? <><label>Nombre completo<input required value={customerForm.name} onChange={(event) => setCustomerForm({ ...customerForm, name: event.target.value })} /></label><div className="form-grid"><label>WhatsApp<input required value={customerForm.phone} onChange={(event) => setCustomerForm({ ...customerForm, phone: event.target.value })} placeholder="+54 9…" /></label><label>Correo electrónico<input type="email" value={customerForm.email} onChange={(event) => setCustomerForm({ ...customerForm, email: event.target.value })} /></label></div><label>Notas<input value={customerForm.notes} onChange={(event) => setCustomerForm({ ...customerForm, notes: event.target.value })} placeholder="Preferencias, entrega, personalización…" /></label></> : <><label>Empresa o proveedor<input required value={supplierForm.name} onChange={(event) => setSupplierForm({ ...supplierForm, name: event.target.value })} /></label><div className="form-grid"><label>Persona de contacto<input required value={supplierForm.contact} onChange={(event) => setSupplierForm({ ...supplierForm, contact: event.target.value })} /></label><label>WhatsApp<input required value={supplierForm.phone} onChange={(event) => setSupplierForm({ ...supplierForm, phone: event.target.value })} /></label></div><label>Materiales o productos<input required value={supplierForm.supplies} onChange={(event) => setSupplierForm({ ...supplierForm, supplies: event.target.value })} /></label></>}<button className="button primary full">{editingId ? "Guardar cambios" : "Guardar contacto"}</button></form></div>}
  </>;
}

function ContactStat({ icon, tone, label, value }: { icon: string; tone: string; label: string; value: number }) {
  return <div><span className={`summary-icon ${tone}`}><AppIcon name={icon} label={label} /></span><span>{label}</span><strong>{value}</strong></div>;
}

function initials(name: string) {
  return name.split(" ").map((word) => word[0]).slice(0, 2).join("");
}

function RowActions({ phone, name, onEdit, onDelete }: { phone: string; name: string; onEdit: () => void; onDelete: () => void }) {
  return <div className="row-actions">
    <a className="icon-action-button whatsapp" href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" aria-label={`Abrir WhatsApp con ${name}`}><AppIcon name="whatsapp" /></a>
    <button type="button" className="icon-action-button edit" onClick={onEdit} aria-label={`Editar ${name}`}><AppIcon name="edit" /></button>
    <button type="button" className="icon-action-button delete" onClick={onDelete} aria-label={`Borrar ${name}`}><AppIcon name="delete" /></button>
  </div>;
}

function CustomerRow({ customer, orders, onEdit, onDelete }: { customer: Customer; orders: number; onEdit: () => void; onDelete: () => void }) {
  return <div className="contacts-row">
    <div className="contact-name"><span className="avatar avatar-mint">{initials(customer.name)}</span><div><strong>{customer.name}</strong><small>{customer.email || "Sin correo"} · {orders} {orders === 1 ? "pedido" : "pedidos"}</small></div></div>
    <span>{customer.phone}</span>
    <span>{customer.notes || "Sin notas cargadas."}</span>
    <RowActions phone={customer.phone} name={customer.name} onEdit={onEdit} onDelete={onDelete} />
  </div>;
}

function SupplierRow({ supplier, onEdit, onDelete }: { supplier: Supplier; onEdit: () => void; onDelete: () => void }) {
  return <div className="contacts-row">
    <div className="contact-name"><span className="avatar avatar-lilac">{initials(supplier.name)}</span><div><strong>{supplier.name}</strong><small>{supplier.contact}</small></div></div>
    <span>{supplier.phone}</span>
    <span>{supplier.supplies}</span>
    <RowActions phone={supplier.phone} name={supplier.name} onEdit={onEdit} onDelete={onDelete} />
  </div>;
}
