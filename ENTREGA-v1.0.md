# Entrega Nexo v1.0

## Qué incluye

Segunda tanda del feedback de la clienta (punto 2 completo, más algunas cosas del audio):

1. **Variantes de producto.** Un producto puede tener variantes (ej. "Llavero Dragon Ball" con Goku, Krillin y Maestro Roshi), cada una con su propia foto, precio, costo y stock. Sin variantes cargadas, el producto sigue funcionando exactamente como antes — no se rompe nada de lo que ya había.
2. **Stock por variante.** El descuento de stock al preparar un pedido, y su devolución al cancelarlo, ahora afectan a la variante puntual pedida (ej. se descuenta "Goku", no todo "Llavero Dragon Ball").
3. **"Armar pedido" con variantes.** Al cargar una venta manual desde Pedidos (por ejemplo, una venta de feria) se puede elegir la variante puntual, igual que en el portal.
4. **Mostrar sin stock, ahora es una decisión por producto.** Cada producto tiene un interruptor: ocultarlo automáticamente al llegar a cero (como era antes) o dejarlo visible con la etiqueta "Sin stock".
5. **Botón "Avisame cuando haya stock".** Cuando un producto sin stock queda visible, el cliente puede dejar su nombre y WhatsApp. Eso queda **registrado en un panel nuevo dentro de Inventario** ("Interés en productos sin stock"), con un botón para escribirle por WhatsApp directo a cada interesado — así podés medir qué se busca más, tal como pediste.
6. **Botón "Consultar por WhatsApp"** en cada producto del portal público, para quien tiene una duda puntual antes de comprar.

## Lo que quedó afuera de esta tanda (a pedido tuyo, ya charlado)

Calculadora de envío por código postal, coordinación de puntos de encuentro, Mercado Pago/tarjetas, preguntas frecuentes, sugerencias de venta cruzada en el carrito, y la sincronización de stock en tiempo real entre dispositivos (esto último depende de conectar Supabase de verdad).

## Datos de ejemplo cargados

Para que se vea todo funcionando: "Llavero Dragon Ball" con 3 variantes (Goku, Krillin y Maestro Roshi, este último sin stock), y "Taza mágica personalizada" configurada para quedar visible sin stock con el botón "Avisame". Ya hay 2 solicitudes de aviso cargadas de ejemplo en el panel de Inventario.

## Archivos para subir (11 en total, entran en una sola subida)

- `app/data/tenant-demo.ts` *(pesa más de lo normal por las imágenes incrustadas, es esperable)*
- `app/components/tenant/ProductModal.tsx`
- `app/components/tenant/TenantInventory.tsx`
- `app/components/tenant/TenantPortal.tsx`
- `app/components/tenant/TenantApp.tsx`
- `app/components/tenant/TenantDashboard.tsx`
- `app/components/tenant/TenantOrders.tsx`
- `app/components/store/PublicStore.tsx`
- `app/globals.css`
- `package.json`
- `README.md`

## Commit sugerido

```
Nexo v1.0: variantes de producto, stock por variante y aviso de reposición
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.
