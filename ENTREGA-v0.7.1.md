# Entrega Nexo v0.7.1

## Qué incluye

- **Íconos duplicados en Pedidos**: cada tarjeta de estado (Todos, Nuevo, Preparando, Listo, Entregado, Cancelado) mostraba dos íconos superpuestos: el nuevo (SVG) que agregué en su momento, y uno viejo hecho con texto plano que había quedado sin sacar de una versión anterior — y que además, al agregar la tarjeta "Todos", quedó corrido y mostrando el ícono equivocado en cada tarjeta. Se sacó el viejo por completo y el nuevo pasó a ocupar ese mismo lugar, en el margen derecho de la tarjeta.
- **404 al abrir el portal público**: al renombrar el emprendimiento a "Pensando en ti" cambió también la dirección de la tienda (`/tienda/pensando-en-ti`), pero el script que genera la página estática para Vercel todavía tenía escrita la dirección anterior (`/tienda/luna-creativa`), así que la página nueva nunca se generó y daba error 404. Ya corregido, y dejé un comentario en el código para no repetir el error si el nombre vuelve a cambiar.

## Archivos para subir (3 en total, entran en una sola subida)

- `app/globals.css`
- `scripts/netlify-export.mjs`
- `package.json`
- `README.md`

(4 en total contando los dos últimos.)

## Commit sugerido

```
Nexo v0.7.1: corrige íconos duplicados en Pedidos y el 404 del portal público
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado — Vercel lo genera solo al recibir el push.
