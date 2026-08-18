# Entrega Nexo v0.7

## Qué incluye

- **El emprendimiento de demostración se renombró a "Pensando en ti"** (antes "Luna Creativa"), en todos lados: panel del emprendimiento, portal público y superadministración.
- **Logo del emprendimiento** ("Pensando en ti — regalos con amor") cargado por defecto.
- **Dos imágenes de banner** (el dormitorio "Lo mejor está por venir" y la repisa colorida) cargadas por defecto en el carrusel del portal — las mandaste vos, las comprimí bastante (de ~2,2 MB a ~100-150 KB cada una) para no inflar el código.
- **Logo real de Nexo** en el sidebar (arriba a la izquierda), reemplazando la letra "N", tanto en superadministración como en el panel del emprendimiento.
- **Banner del inicio del panel** actualizado con una de tus imágenes, en vez del banner genérico anterior.
- **Corrección del botón "Salir"**: en el sidebar expandido se cortaba y mostraba "Sali" porque el bloque de nombre/perfil le dejaba muy poco lugar. Ya tiene su espacio garantizado.

## Archivos para subir (11 en total, entran en una sola subida)

**Código (texto):**
- `app/data/tenant-demo.ts` *(este archivo pesa bastante más que de costumbre — trae el logo y los banners incrustados como imagen. Es normal, subilo igual.)*
- `app/data/demo.ts`
- `app/components/tenant/TenantDashboard.tsx`
- `app/components/tenant/TenantApp.tsx`
- `app/components/AppShell.tsx`
- `app/globals.css`
- `package.json`
- `README.md`

**Imágenes nuevas (subir como archivo, no como texto):**
- `public/nexo-logo.png`
- `public/pensando-en-ti-banner-v1.jpg`

**Para borrar del repositorio (opcional, prolijidad):**
- `public/luna-creativa-banner-v1.png` — ya no se usa, quedó reemplazado por el de arriba. Podés borrarlo desde GitHub (entrás al archivo → ícono de tacho) o dejarlo, no rompe nada si se queda.

## Commit sugerido

```
Nexo v0.7: identidad real "Pensando en ti", logo de Nexo y corrección del botón Salir
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.
