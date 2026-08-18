# Entrega Nexo v0.6.1 — corrección urgente

## Qué pasó

La v0.6 cambió el formato de los pedidos (de un producto suelto a una lista `items`), pero no adapté los pedidos que ya estaban guardados en tu navegador desde antes de esa versión. Al entrar al emprendimiento, el inicio intentaba leer la lista de productos de un pedido viejo que no la tenía, y la app se rompía apenas cargaba — por eso la pantalla de error y el ciclo de "recargar → login → no entra".

## Qué arreglé

Agregué una función que revisa los pedidos guardados al cargar la app y, si encuentra alguno con el formato viejo, lo adapta automáticamente al nuevo formato (sin perder ningún dato: cliente, producto, cantidad, precio, estado). Se aplica en los tres lugares donde la app lee esos datos guardados:

- al abrir el panel del emprendimiento;
- al abrir el portal público;
- al enviar un pedido nuevo desde el portal.

## Archivos para subir (3 en total, entran en una sola subida)

- `app/data/tenant-demo.ts`
- `app/components/tenant/TenantApp.tsx`
- `app/components/store/PublicStore.tsx`

## Commit sugerido

```
Nexo v0.6.1: corrige pantalla en blanco por pedidos guardados en formato anterior
```

## Orden

Una sola subida, un solo commit. Subilo ni bien puedas — es el que soluciona lo que no te dejaba entrar.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.
