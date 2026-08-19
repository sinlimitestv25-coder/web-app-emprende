# Entrega Nexo v1.0.2

## Qué incluye

- **Cliente opcional al armar pedido**: en Pedidos → Armar pedido, el selector de cliente ya no es obligatorio. Arriba de la lista aparece la opción "Venta directa (sin cliente)" — pensada para cuando estás en una feria y cargás la venta vos misma, sin pedirle el nombre a la persona. El pedido queda registrado a nombre de "Vendedora".
- **Botón de WhatsApp corregido**: en la tabla de Pedidos, si el pedido no tiene cliente (o el cliente no tiene teléfono cargado), el ícono de WhatsApp de esa fila aparece apagado en vez de abrir un enlace roto.

## Archivos para subir (4 en total, entran en una sola subida)

- `app/components/tenant/TenantOrders.tsx`
- `app/globals.css`
- `package.json`
- `README.md`

## Commit sugerido

```
Nexo v1.0.2: cliente opcional en venta directa
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.
