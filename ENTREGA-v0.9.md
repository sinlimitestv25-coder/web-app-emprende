# Entrega Nexo v0.9

## Qué incluye

Esta es la primera tanda del feedback de la clienta (punto 1 del documento): jerarquía de categorías, buscador/filtro, y banners con enlace. Los 4 puntos que hablamos:

1. **Categorías con subcategorías.** Se editan desde Ajustes: cada categoría (Tazas, Llaveros, etc.) puede tener subcategorías propias (ej. dentro de Llaveros: "Disney", "Dragon Ball"), cada una con una lista de palabras clave.
2. **Sugerencia automática de subcategoría.** Al cargar o editar un producto, si escribís el nombre o la descripción y el texto menciona una palabra clave configurada (ej. "Goku"), la subcategoría se completa sola (ej. "Dragon Ball"). Siempre se puede cambiar a mano si no coincide.
3. **Buscador + filtro por categoría en el portal público.** Fila de botones chicos con las categorías arriba del catálogo, y un buscador de texto debajo que busca en nombre, descripción, categoría y subcategoría de todos los productos (no solo dentro de la categoría elegida).
4. **Banners con título propio y enlace.** Cada imagen del carrusel ahora tiene su propio texto (antes todas compartían el mismo título) y, opcionalmente, un destino: categoría, subcategoría o palabra clave. Al hacer clic en el banner, el catálogo se filtra solo a eso.

## Cambio de estructura interna

De paso, saqué el editor de banners que estaba duplicado en Ajustes (había uno ahí y otro en Portal de ventas, editando los mismos datos de formas distintas). Ahora vive solo en Portal de ventas, para evitar que se desincronicen.

## Datos de ejemplo cargados

Para que se vea la función funcionando sin que tengas que cargar nada, dejé armado: categoría "Tazas" con subcategoría "Dragon Ball" (palabras clave: Dragon Ball, Goku, Vegeta, Krillin, Piccolo), categoría "Llaveros" con subcategoría "Disney" (palabras clave: Disney, Stitch, Minnie, Mickey), y uno de los banners ya apunta a "Tazas" para que puedas probar el clic.

## Importante: protegido contra datos guardados viejos

Como en la corrección anterior por los pedidos, agregué funciones que adaptan automáticamente los datos que ya tenías guardados en el navegador (categorías en formato de lista simple, banners sin título) al nuevo formato, para que no se rompa nada al entrar.

## Archivos para subir (10 en total, entran en una sola subida)

- `app/data/tenant-demo.ts` *(pesa más de lo normal por las imágenes incrustadas — es esperable)*
- `app/components/tenant/ProductModal.tsx`
- `app/components/tenant/TenantInventory.tsx`
- `app/components/tenant/TenantPortal.tsx`
- `app/components/tenant/TenantSettings.tsx`
- `app/components/store/PublicStore.tsx`
- `app/components/tenant/TenantApp.tsx`
- `app/globals.css`
- `package.json`
- `README.md`

## Commit sugerido

```
Nexo v0.9: categorías con subcategorías, buscador/filtro y banners con enlace
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.
