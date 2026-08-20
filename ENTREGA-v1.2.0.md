# Entrega Nexo v1.2.0

## Qué incluye

### 1. Vista de catálogo (lista / mosaico grande / mosaico chico)
Al costado derecho de los filtros del catálogo (enfrente de las categorías) hay tres botones nuevos para elegir cómo ver los productos: como lista, como mosaico grande (la vista de siempre) o como mosaico chico (más productos por fila, tarjetas más chicas).

### 2. Envío por código postal
Como hablamos: no se puede traer una tarifa real de un correo en vivo sin conectar un servidor propio, pero sí armé la base para que ustedes carguen sus propios precios por zona:

- Desde **Ajustes → Zonas de envío** se carga cada zona con un nombre, los prefijos de código postal que le corresponden (separados por coma) y un costo.
- En el carrito del portal, el comprador elige **Retiro en el local** o **Envío a domicilio**. Si elige envío, ingresa su código postal:
  - si coincide con una zona cargada, el costo se suma solo al total del pedido;
  - si no coincide con ninguna, se le avisa que el costo de envío se coordina por WhatsApp (no se inventa un precio).
- **Importante**: la zona que viene cargada de ejemplo ("CABA y GBA", prefijo "1", $4.000) es solo para mostrar el formato — no es una tarifa real de ningún correo. Hay que reemplazarla por las zonas, prefijos y costos que ustedes decidan antes de usarlo con clientas de verdad.

### 3. Medios de pago
En el carrito, debajo de retiro/envío, se puede elegir el medio de pago:
- **Transferencia bancaria**: funciona ya — al elegirla, aparece el aviso de que se coordina el alias por WhatsApp.
- **Mercado Pago, Efectivo y Tarjeta**: se ven marcados como "Próximamente" (no se pueden elegir). Activar cualquiera de estos de verdad requiere conectar cada uno por separado con sus propias claves, ya lo hablamos.

El pedido que llega por WhatsApp ahora incluye si es envío o retiro (y a qué zona), el medio de pago elegido, y el total ya con el envío sumado.

## Archivos para subir (9 en total, entran en una sola subida)

- `app/data/tenant-demo.ts`
- `app/components/tenant/TenantApp.tsx`
- `app/components/tenant/TenantSettings.tsx`
- `app/components/tenant/TenantOrders.tsx`
- `app/components/store/PublicStore.tsx`
- `app/components/ui/AppIcon.tsx`
- `app/globals.css`
- `package.json`
- `README.md`

## Commit sugerido

```
Nexo v1.2.0: vista de catálogo, envío por código postal y medios de pago
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.

## Pendiente / para tener en cuenta

- La tabla de Pedidos (panel del emprendimiento) todavía no muestra si un pedido es envío o retiro, ni el medio de pago elegido — se ve en el mensaje de WhatsApp, pero no quedó reflejado ahí todavía. Si lo quieren, lo agrego en la próxima.
- Las zonas de envío son un cálculo simple por prefijo de código postal, no una tarifa real de ningún correo.
