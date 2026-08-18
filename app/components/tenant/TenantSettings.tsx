"use client";

/* eslint-disable jsx-a11y/label-has-associated-control -- the hidden file inputs remain reachable and labelled by their wrapping label */

import { useState, type ChangeEvent, type Dispatch, type FormEvent, type SetStateAction } from "react";
import type { TenantDemoState } from "../../data/tenant-demo";
import { prepareImage } from "../../lib/image";
import { AppIcon } from "../ui/AppIcon";

export function TenantSettings({ state, setState, flash, resetDemo }: { state: TenantDemoState; setState: Dispatch<SetStateAction<TenantDemoState>>; flash: (message: string) => void; resetDemo: () => void }) {
  const [newCategory, setNewCategory] = useState("");

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

  async function addBanner(event: ChangeEvent<HTMLInputElement>) {
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
    setState((current) => ({ ...current, portal: { ...current.portal, bannerImages: [...current.portal.bannerImages, result.dataUrl] } }));
    flash(result.compressed ? "La imagen pesaba de más: se comprimió automáticamente." : "Imagen agregada al banner.");
  }

  function removeBanner(index: number) {
    setState((current) => ({ ...current, portal: { ...current.portal, bannerImages: current.portal.bannerImages.filter((_, itemIndex) => itemIndex !== index) } }));
  }

  function addCategory(event: FormEvent) {
    event.preventDefault();
    const name = newCategory.trim();
    if (!name) return;
    if (state.categories.some((category) => category.toLowerCase() === name.toLowerCase())) { flash("Esa categoría ya existe."); return; }
    setState((current) => ({ ...current, categories: [...current.categories, name] }));
    setNewCategory("");
    flash("Categoría agregada.");
  }

  function removeCategory(name: string) {
    if (state.categories.length <= 1) { flash("Necesitás al menos una categoría."); return; }
    setState((current) => ({ ...current, categories: current.categories.filter((category) => category !== name) }));
    flash("Categoría eliminada.");
  }

  return <>
    <div className="page-heading"><div><p className="eyebrow">Mi negocio</p><h1>Ajustes</h1><p>Identidad de la marca, categorías y preferencias de la demostración.</p></div></div>

    <div className="portal-settings-grid">
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
        <div className="panel-title"><div><h2>Imágenes del banner</h2><p>Las mismas que ves en Portal de ventas: forman el carrusel de tu tienda.</p></div></div>
        <div className="portal-banner-manager">
          {state.portal.bannerImages.map((src, index) => (
            <div className="portal-banner-item" key={index}>
              <img src={src} alt="" />
              <button type="button" onClick={() => removeBanner(index)} aria-label={`Quitar imagen ${index + 1}`}>×</button>
            </div>
          ))}
          <label className="portal-banner-add">
            + Agregar imagen
            <input type="file" accept="image/*" onChange={addBanner} hidden />
          </label>
        </div>
      </section>
    </div>

    <section className="panel">
      <div className="panel-title"><div><h2>Categorías de productos</h2><p>Aparecen como opciones al cargar o editar un producto.</p></div></div>
      <div className="category-manager">
        <div className="category-chips">
          {state.categories.map((category) => (
            <span className="category-chip" key={category}>{category}<button type="button" onClick={() => removeCategory(category)} aria-label={`Quitar categoría ${category}`}>×</button></span>
          ))}
        </div>
        <form className="category-add-form" onSubmit={addCategory}>
          <input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Nueva categoría" />
          <button className="button secondary" type="submit">+ Agregar</button>
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
