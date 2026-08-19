# Entrega Nexo v1.0.6

## Qué incluye

- **"Quiénes somos" en el portal**: junto a "Términos de uso" y "Privacidad" en el pie de la tienda pública, ahora hay un tercer botón, "Quiénes somos", que abre una ventana con la presentación del emprendimiento: foto, texto de "quiénes somos" y ubicación / zona de envíos, más un botón directo para escribir por WhatsApp.
- **Editable desde Portal de ventas**: nueva sección "Acerca de nosotros" (debajo de las imágenes del banner) donde la clienta escribe su propio texto de presentación, sube una foto y anota la ubicación. Queda vacío por defecto — mientras no lo completen, el botón "Quiénes somos" del portal simplemente no muestra esas partes.

## Archivos para subir (6 en total, entran en una sola subida)

- `app/data/tenant-demo.ts`
- `app/components/tenant/TenantPortal.tsx`
- `app/components/store/PublicStore.tsx`
- `app/globals.css`
- `package.json`
- `README.md`

## Commit sugerido

```
Nexo v1.0.6: sección Quiénes somos en el portal público
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.

## Nota técnica

Al editar `app/data/tenant-demo.ts` (el archivo grande con los datos de prueba) detecté y corregí, antes de esta entrega, un problema de codificación que podía romper las tildes y la "ñ" en los textos existentes (nombres de categorías, descripciones de productos, etc.). Ya quedó verificado y corregido — si en algún texto viejo ves un acento raro avisame para revisarlo puntualmente, pero no debería pasar.
