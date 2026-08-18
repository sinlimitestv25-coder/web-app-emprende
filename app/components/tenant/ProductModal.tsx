"use client";

/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/label-has-associated-control -- modal backdrop is an optional pointer shortcut with a keyboard-accessible close button; the outer image label wraps a nested label+input for the file picker */

import type { ChangeEvent, FormEvent } from "react";
import { prepareImage } from "../../lib/image";

export type ProductFormState = {
  name: string;
  sku: string;
  category: string;
  variant: string;
  description: string;
  image: string;
  stock: string;
  minStock: string;
  price: string;
  cost: string;
};

export const emptyProductForm: ProductFormState = {
  name: "",
  sku: "",
  category: "Tazas",
  variant: "",
  description: "",
  image: "",
  stock: "0",
  minStock: "2",
  price: "",
  cost: "",
};

export function ProductModal({
  form,
  setForm,
  editing,
  onClose,
  onSubmit,
  flash,
}: {
  form: ProductFormState;
  setForm: (form: ProductFormState) => void;
  editing: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  flash: (message: string) => void;
}) {
  async function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const result = await prepareImage(file);
    if (!result.ok) {
      if (result.reason === "not-image") flash("Elegí un archivo de imagen.");
      else if (result.reason === "too-large") flash("Esta imagen pesa demasiado incluso comprimida. Probá con otra.");
      else flash("No se pudo leer la imagen.");
      return;
    }
    setForm({ ...form, image: result.dataUrl });
    if (result.compressed) flash("La imagen pesaba de más: se comprimió automáticamente para poder subirla.");
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <form className="modal product-modal" onSubmit={onSubmit} onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        <p className="eyebrow">{editing ? "Editar inventario" : "Nuevo artículo"}</p>
        <h2>{editing ? "Actualizar producto" : "Agregar producto"}</h2>
        <p>Esta información alimenta el stock y el portal de ventas.</p>

        <label className="image-upload-field">
          Foto del producto
          <div className="image-upload">
            {form.image
              ? <img src={form.image} alt="" className="image-upload-preview" />
              : <div className="image-upload-placeholder">Sin imagen</div>}
            <div className="image-upload-actions">
              <label className="button secondary image-upload-button">
                Subir imagen
                <input type="file" accept="image/*" onChange={handleImage} hidden />
              </label>
              {form.image && <button type="button" className="link-button" onClick={() => setForm({ ...form, image: "" })}>Quitar</button>}
            </div>
          </div>
        </label>

        <div className="form-grid">
          <label>Nombre<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ej. Taza personalizada" /></label>
          <label>Código / SKU<input required value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} placeholder="TAZ-001" /></label>
          <label>Categoría<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Tazas</option><option>Vasos térmicos</option><option>Vinilos</option><option>Llaveros</option><option>Botellas</option><option>Otros</option></select></label>
          <label>Variante<input required value={form.variant} onChange={(event) => setForm({ ...form, variant: event.target.value })} placeholder="Material, tamaño o diseño" /></label>
          <label>Stock actual<input required min="0" type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} /></label>
          <label>Alerta mínima<input required min="0" type="number" value={form.minStock} onChange={(event) => setForm({ ...form, minStock: event.target.value })} /></label>
          <label>Costo<input required min="0" type="number" value={form.cost} onChange={(event) => setForm({ ...form, cost: event.target.value })} /></label>
          <label>Precio de venta<input required min="0" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label>
        </div>
        <label>Descripción para el portal<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Contale a tus clientes por qué elegir este producto" /></label>

        <button className="button primary full">{editing ? "Guardar cambios" : "Agregar al inventario"}</button>
      </form>
    </div>
  );
}
