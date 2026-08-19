"use client";

/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/label-has-associated-control -- modal backdrop is an optional pointer shortcut with a keyboard-accessible close button; the outer image label wraps a nested label+input for the file picker */

import type { ChangeEvent, FormEvent } from "react";
import { prepareImage } from "../../lib/image";
import { suggestSubcategory, type Category, type ProductVariant } from "../../data/tenant-demo";

export type VariantFormState = {
  id: string;
  name: string;
  image: string;
  price: string;
  cost: string;
  stock: string;
  minStock: string;
};

export type ProductFormState = {
  name: string;
  sku: string;
  category: string;
  subcategory: string;
  variant: string;
  description: string;
  image: string;
  stock: string;
  minStock: string;
  price: string;
  cost: string;
  hideWhenOutOfStock: boolean;
  variants: VariantFormState[];
};

export const emptyProductForm: ProductFormState = {
  name: "",
  sku: "",
  category: "",
  subcategory: "",
  variant: "",
  description: "",
  image: "",
  stock: "0",
  minStock: "2",
  price: "",
  cost: "",
  hideWhenOutOfStock: true,
  variants: [],
};

const emptyVariantForm: Omit<VariantFormState, "id"> = { name: "", image: "", price: "", cost: "", stock: "0", minStock: "2" };

export function toVariantForm(variant: ProductVariant): VariantFormState {
  return { id: variant.id, name: variant.name, image: variant.image, price: String(variant.price), cost: String(variant.cost), stock: String(variant.stock), minStock: String(variant.minStock) };
}

export function fromVariantForm(variant: VariantFormState): ProductVariant {
  return { id: variant.id, name: variant.name.trim(), image: variant.image, price: Math.max(0, Number(variant.price)), cost: Math.max(0, Number(variant.cost)), stock: Math.max(0, Number(variant.stock)), minStock: Math.max(0, Number(variant.minStock)) };
}

export function ProductModal({
  form,
  setForm,
  editing,
  categories,
  onClose,
  onSubmit,
  flash,
}: {
  form: ProductFormState;
  setForm: (form: ProductFormState) => void;
  editing: boolean;
  categories: Category[];
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
  flash: (message: string) => void;
}) {
  const category = categories.find((item) => item.name === form.category);
  const subcategories = category?.subcategories ?? [];
  const hasVariants = form.variants.length > 0;

  function updateAndSuggest(patch: Partial<ProductFormState>) {
    const next = { ...form, ...patch };
    if (!form.subcategory) {
      const nextCategory = categories.find((item) => item.name === next.category);
      next.subcategory = suggestSubcategory(nextCategory, `${next.name} ${next.description}`);
    }
    setForm(next);
  }

  function addVariant() {
    setForm({ ...form, variants: [...form.variants, { id: `v_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, ...emptyVariantForm }] });
  }

  function updateVariant(id: string, patch: Partial<VariantFormState>) {
    setForm({ ...form, variants: form.variants.map((variant) => variant.id === id ? { ...variant, ...patch } : variant) });
  }

  function removeVariant(id: string) {
    setForm({ ...form, variants: form.variants.filter((variant) => variant.id !== id) });
  }

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

  async function handleVariantImage(id: string, event: ChangeEvent<HTMLInputElement>) {
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
    updateVariant(id, { image: result.dataUrl });
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
          Foto principal
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
          {hasVariants && <small className="field-hint">Se usa si una variante no tiene foto propia.</small>}
        </label>

        <div className="form-grid">
          <label>Nombre<input required value={form.name} onChange={(event) => updateAndSuggest({ name: event.target.value })} placeholder="Ej. Taza personalizada" /></label>
          <label>Código / SKU<input required value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} placeholder="TAZ-001" /></label>
          <label>Categoría<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value, subcategory: "" })}>{categories.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
          <label>Subcategoría<select value={form.subcategory} onChange={(event) => setForm({ ...form, subcategory: event.target.value })} disabled={subcategories.length === 0}><option value="">{subcategories.length === 0 ? "Sin subcategorías" : "Sin asignar"}</option>{subcategories.map((sub) => <option key={sub.name} value={sub.name}>{sub.name}</option>)}</select></label>
          <label>Variante<input required value={form.variant} onChange={(event) => setForm({ ...form, variant: event.target.value })} placeholder="Material, tamaño o diseño" /></label>
        </div>

        {!hasVariants && (
          <div className="form-grid">
            <label>Stock actual<input required min="0" type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} /></label>
            <label>Alerta mínima<input required min="0" type="number" value={form.minStock} onChange={(event) => setForm({ ...form, minStock: event.target.value })} /></label>
            <label>Costo<input required min="0" type="number" value={form.cost} onChange={(event) => setForm({ ...form, cost: event.target.value })} /></label>
            <label>Precio de venta<input required min="0" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} /></label>
          </div>
        )}

        <label>Descripción para el portal<textarea value={form.description} onChange={(event) => updateAndSuggest({ description: event.target.value })} placeholder="Contale a tus clientes por qué elegir este producto" /><small className="field-hint">Si el texto menciona una palabra clave configurada, la subcategoría se sugiere sola.</small></label>

        <label className="publish-check"><input type="checkbox" checked={!form.hideWhenOutOfStock} onChange={(event) => setForm({ ...form, hideWhenOutOfStock: !event.target.checked })} /><span><strong>Mostrar sin stock</strong><small>Si está desmarcado, el producto se oculta solo del portal al llegar a cero.</small></span></label>

        <div className="variant-editor">
          <div className="variant-editor-head">
            <div><strong>Variantes</strong><small>Para vender el mismo producto en distintas opciones (personaje, talle, color…), cada una con su propia foto, precio y stock.</small></div>
            <button type="button" className="button secondary" onClick={addVariant}>+ Agregar variante</button>
          </div>
          {form.variants.map((variant) => (
            <div className="variant-row" key={variant.id}>
              <label className="variant-row-image">
                {variant.image ? <img src={variant.image} alt="" /> : <div className="variant-row-image-placeholder">Sin foto</div>}
                <input type="file" accept="image/*" onChange={(event) => handleVariantImage(variant.id, event)} hidden />
              </label>
              <div className="variant-row-fields">
                <label>Nombre<input required value={variant.name} onChange={(event) => updateVariant(variant.id, { name: event.target.value })} placeholder="Ej. Goku" /></label>
                <label>Stock<input required min="0" type="number" value={variant.stock} onChange={(event) => updateVariant(variant.id, { stock: event.target.value })} /></label>
                <label>Mínimo<input required min="0" type="number" value={variant.minStock} onChange={(event) => updateVariant(variant.id, { minStock: event.target.value })} /></label>
                <label>Costo<input required min="0" type="number" value={variant.cost} onChange={(event) => updateVariant(variant.id, { cost: event.target.value })} /></label>
                <label>Precio<input required min="0" type="number" value={variant.price} onChange={(event) => updateVariant(variant.id, { price: event.target.value })} /></label>
              </div>
              <button type="button" className="variant-row-remove" onClick={() => removeVariant(variant.id)} aria-label={`Quitar variante ${variant.name || ""}`}>×</button>
            </div>
          ))}
          {form.variants.length === 0 && <p className="field-hint">Sin variantes, este producto vende directo con el stock y precio de arriba.</p>}
        </div>

        <button className="button primary full">{editing ? "Guardar cambios" : "Agregar al inventario"}</button>
      </form>
    </div>
  );
}
