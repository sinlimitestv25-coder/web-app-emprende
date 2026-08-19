# Entrega Nexo v1.0.1

## Qué incluye

- **Canal del pedido**: cada pedido ahora queda marcado como "Portal / WhatsApp" (cuando llega solo, automático) o "Venta directa" (cuando lo cargás vos desde Pedidos → Armar pedido).
- **Lugar de la venta**: al armar una venta directa, hay un campo opcional para anotar dónde fue (ej. "Feria de Avellaneda", "Feria del Ferro"). Se ve como una etiqueta chica debajo del número de pedido en la tabla.
- Esto deja la base cargada para, más adelante, poder armar un resumen de "cuánto vendiste/ganaste por lugar" — ese resumen en sí queda pendiente para cuando lo pidas puntualmente, como hablamos.
- **Corrección**: encontré que los 4 pedidos de ejemplo de la entrega anterior (v1.0) se habían quedado sin los campos de variante que agregamos — ya está corregido.

## Archivos para subir (4 en total, entran en una sola subida)

- `app/data/tenant-demo.ts`
- `app/components/tenant/TenantOrders.tsx`
- `app/components/store/PublicStore.tsx`
- `app/globals.css`
- `package.json`
- `README.md`

(6 en total contando los dos últimos.)

## Commit sugerido

```
Nexo v1.0.1: canal y lugar de venta directa en Pedidos
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.
