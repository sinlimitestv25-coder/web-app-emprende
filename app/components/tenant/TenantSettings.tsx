"use client";

/* eslint-disable jsx-a11y/label-has-associated-control -- the hidden file input remains reachable and labelled by its wrapping label */

import { useState, type ChangeEvent, type Dispatch, type FormEvent, type SetStateAction } from "react";
import type { TenantDemoState } from "../../data/tenant-demo";
import { prepareImage } from "../../lib/image";
import { AppIcon } from "../ui/AppIcon";

export function TenantSettings({ state, setState, flash, resetDemo }: { state: TenantDemoState; setState: Dispatch<SetStateAction<TenantDemoState>>; flash: (message: string) => void; resetDemo: () => void }) {
  const [newCategory, setNewCategory] = useState("");
  const [subcategoryDrafts, setSubcategoryDrafts] = useState<Record<string, { name: string; keywords: string }>>({});
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");

  async function handleLogo(event: ChangeEvent<HTMLInputElement>) {
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
    setState((current) => ({ ...current, portal: { ...current.portal, logo: result.dataUrl } }));
    flash(result.compressed ? "Logo actualizado: se comprimió automáticamente." : "Logo actualizado.");
  }

  function removeLogo() {
    setState((current) => ({ ...current, portal: { ...current.portal, logo: "" } }));
    flash("Logo quitado.");
  }

  function addCategory(event: FormEvent) {
    event.preventDefault();
    const name = newCategory.trim();
    if (!name) return;
    if (state.categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) { flash("Esa categoría ya existe."); return; }
    setState((current) => ({ ...current, categories: [...current.categories, { name, subcategories: [] }] }));
    setNewCategory("");
    flash("Categoría agregada.");
  }

  function removeCategory(name: string) {
    if (state.categories.length <= 1) { flash("Necesitás al menos una categoría."); return; }
    setState((current) => ({ ...current, categories: current.categories.filter((category) => category.name !== name) }));
    flash("Categoría eliminada.");
  }

  function addSubcategory(categoryName: string, event: FormEvent) {
    event.preventDefault();
    const draft = subcategoryDrafts[categoryName] ?? { name: "", keywords: "" };
    const name = draft.name.trim();
    if (!name) return;
    const keywords = draft.keywords.split(",").map((word) => word.trim()).filter(Boolean);
    setState((current) => ({
      ...current,
      categories: current.categories.map((category) => category.name === categoryName
        ? { ...category, subcategories: [...category.subcategories, { name, keywords }] }
        : category),
    }));
    setSubcategoryDrafts((current) => ({ ...current, [categoryName]: { name: "", keywords: "" } }));
    flash("Subcategoría agregada.");
  }

  function removeSubcategory(categoryName: string, subcategoryName: string) {
    setState((current) => ({
      ...current,
      categories: current.categories.map((category) => category.name === categoryName
        ? { ...category, subcategories: category.subcategories.filter((sub) => sub.name !== subcategoryName) }
        : category),
    }));
  }

  function addFaq(event: FormEvent) {
    event.preventDefault();
    const question = newFaqQuestion.trim();
    const answer = newFaqAnswer.trim();
    if (!question || !answer) return;
    setState((current) => ({ ...current, faqs: [...current.faqs, { question, answer }] }));
    setNewFaqQuestion("");
    setNewFaqAnswer("");
    flash("Pregunta agregada.");
  }

  function removeFaq(index: number) {
    setState((current) => ({ ...current, faqs: current.faqs.filter((_, itemIndex) => itemIndex !== index) }));
  }

  return <>
    <div className="page-heading"><div><p className="eyebrow">Mi negocio</p><h1>Ajustes</h1><p>Identidad de la marca, categorías y preferencias de la demostración.</p></div></div>

    <section className="panel">
      <div className="panel-title"><div><h2>Logo del emprendimiento</h2><p>Se ve chico en el sidebar y más grande cuando se expande.</p></div></div>
      <div className="image-upload settings-logo-upload">
        {state.portal.logo
          ? <img src={state.portal.logo} alt="" className="image-upload-preview" />
          : <div className="image-upload-placeholder">Sin logo</div>}
        <div className="image-upload-actions">
          <label className="button secondary image-upload-button">
            Subir logo
            <input type="file" accept="image/*" onChange={handleLogo} hidden />
          </label>
          {state.portal.logo && <button type="button" className="link-button" onClick={removeLogo}>Quitar</button>}
        </div>
      </div>
    </section>

    <section className="panel">
      <div className="panel-title"><div><h2>Categorías y subcategorías</h2><p>Organizan el menú del portal. Las palabras clave sugieren la subcategoría sola cuando coinciden con la descripción de un producto.</p></div></div>
      <div className="category-manager">
        {state.categories.map((category) => (
          <div className="category-block" key={category.name}>
            <div className="category-block-head">
              <strong>{category.name}</strong>
              <button type="button" className="link-button" onClick={() => removeCategory(category.name)}>Quitar categoría</button>
            </div>
            {category.subcategories.length > 0 && (
              <div className="subcategory-chips">
                {category.subcategories.map((sub) => (
                  <span className="category-chip" key={sub.name}>
                    {sub.name}{sub.keywords.length > 0 && <small> · {sub.keywords.join(", ")}</small>}
                    <button type="button" onClick={() => removeSubcategory(category.name, sub.name)} aria-label={`Quitar subcategoría ${sub.name}`}>×</button>
                  </span>
                ))}
              </div>
            )}
            <form className="subcategory-add-form" onSubmit={(event) => addSubcategory(category.name, event)}>
              <input value={subcategoryDrafts[category.name]?.name ?? ""} onChange={(event) => setSubcategoryDrafts((current) => ({ ...current, [category.name]: { name: event.target.value, keywords: current[category.name]?.keywords ?? "" } }))} placeholder="Nueva subcategoría" />
              <input value={subcategoryDrafts[category.name]?.keywords ?? ""} onChange={(event) => setSubcategoryDrafts((current) => ({ ...current, [category.name]: { name: current[category.name]?.name ?? "", keywords: event.target.value } }))} placeholder="Palabras clave separadas por coma" />
              <button className="button secondary" type="submit">+ Agregar</button>
            </form>
          </div>
        ))}
        <form className="category-add-form" onSubmit={addCategory}>
          <input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Nueva categoría" />
          <button className="button secondary" type="submit">+ Agregar categoría</button>
        </form>
      </div>
    </section>

    <section className="panel">
      <div className="panel-title"><div><h2>Preguntas frecuentes</h2><p>Se ven en tu tienda pública, en el botón "Preguntas frecuentes" arriba del banner.</p></div></div>
      <div className="faq-manager">
        {state.faqs.map((faq, index) => (
          <div className="faq-item" key={index}>
            <div>
              <strong>{faq.question}</strong>
              <p>{faq.answer}</p>
            </div>
            <button type="button" className="link-button" onClick={() => removeFaq(index)}>Quitar</button>
          </div>
        ))}
        {state.faqs.length === 0 && <p className="portal-banner-empty">Todavía no cargaste preguntas frecuentes.</p>}
        <form className="faq-add-form" onSubmit={addFaq}>
          <input value={newFaqQuestion} onChange={(event) => setNewFaqQuestion(event.target.value)} placeholder="Pregunta, ej. ¿Hacen envíos?" />
          <textarea value={newFaqAnswer} onChange={(event) => setNewFaqAnswer(event.target.value)} placeholder="Respuesta" />
          <button className="button secondary" type="submit">+ Agregar pregunta</button>
        </form>
      </div>
    </section>

    <div className="settings-grid">
      <section className="panel settings-card"><span className="settings-icon"><AppIcon name="activity" /></span><div><h2>Datos de demostración</h2><p>Volvé a cargar productos, clientes, proveedores y pedidos originales.</p><button className="button secondary" onClick={resetDemo}>Restablecer demostración</button></div></section>
      <section className="panel settings-card"><span className="settings-icon"><AppIcon name="users" /></span><div><h2>Usuarios del espacio</h2><p>Tu plan actual admite una administradora. La gestión de empleados llegará en una próxima versión.</p><button className="button secondary" disabled>1 de 1 usuario</button></div></section>
      <section className="panel settings-card"><span className="settings-icon"><AppIcon name="storage" /></span><div><h2>Conexión definitiva</h2><p>Esta versión prueba los flujos sin mezclar datos con la futura base productiva.</p><button className="button secondary" disabled>Supabase pendiente</button></div></section>
    </div>
  </>;
}
