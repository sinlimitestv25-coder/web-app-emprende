# Entrega Nexo v0.5

## Qué incluye

- Nombre de la administradora de demostración actualizado a Natalia Martínez (sidebar, saludo del inicio y superadministración).
- Logo del emprendimiento: se sube desde Ajustes, se ve chico en el sidebar compacto y grande al expandirlo.
- Gráfico "Venta vs. costo" en Inicio, con los últimos pedidos.
- Categorías de producto editables desde Ajustes (ya no fijas en el modal de producto).
- Clientes y Proveedores pasaron de tarjetas a tabla, con botón de WhatsApp por fila.
- Los pedidos enviados por WhatsApp desde la tienda pública ahora se cargan solos en Pedidos (con el cliente asociado).
- Moneda: siempre `$` de Argentina, nunca la sigla "ARS".
- Recuadro agregado a la descripción del producto en el modal (antes no tenía borde).
- Aviso emergente (toast) con el ícono bien centrado con el texto.
- Revisión completa de los íconos SVG del sidebar y módulos: sin errores de sintaxis, todos distinguibles entre sí.

## Archivos para subir (12 en total, entran en una sola subida)

Archivo nuevo:
- `app/components/tenant/TenantSettings.tsx`

Archivos modificados:
- `app/data/demo.ts`
- `app/data/tenant-demo.ts`
- `app/components/tenant/TenantApp.tsx`
- `app/components/tenant/TenantDashboard.tsx`
- `app/components/tenant/TenantPortal.tsx`
- `app/components/tenant/TenantInventory.tsx`
- `app/components/tenant/TenantOrders.tsx`
- `app/components/tenant/TenantContacts.tsx`
- `app/components/tenant/ProductModal.tsx`
- `app/components/store/PublicStore.tsx`
- `app/globals.css`

(13 en total contando `package.json` y `README.md`.)

## Commit sugerido

```
Nexo v0.5: logo e identidad, gráfico de ventas, categorías editables, tablas de contactos y pedidos desde el portal
```

## Orden

Una sola subida, un solo commit. No hace falta dividir.

## Nota sobre "pedidos desde el portal"

Como todavía no hay base de datos real, esto funciona guardando el pedido en el mismo `localStorage` del navegador que ya usa toda la demo. Es decir: **funciona de punta a punta si el cliente que compra y el panel de administración están en el mismo navegador/dispositivo** (ideal para probarlo vos misma). En un dispositivo distinto, el pedido igual se envía por WhatsApp, pero no va a aparecer solo en Pedidos hasta que conectemos Supabase.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.
