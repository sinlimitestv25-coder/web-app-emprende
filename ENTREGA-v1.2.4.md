# Entrega Nexo v1.2.4

## Qué incluye

Le agregué tres animaciones chiquitas al catálogo del portal, pensadas para que se sientan prolijas sin ser molestas:

- **Aparición en fundido**: cuando entrás al portal o cambiás de filtro, las tarjetas de producto aparecen con un fundido suave, una apenas después de la otra (no todas de golpe).
- **Al pasar el mouse**: la tarjeta se levanta un poquito con más sombra, como si "flotara".
- **Zoom en la foto**: al pasar el mouse sobre una tarjeta, la foto del producto hace un acercamiento muy leve.

Nada de esto afecta la velocidad de carga ni cambia ningún dato — es solo estética. Además, si alguien tiene activada la opción "reducir movimiento" en su celular o computadora (para mareos o accesibilidad), las animaciones se desactivan solas.

## Archivos para subir (4 en total, entran en una sola subida)

- `app/components/store/PublicStore.tsx`
- `app/globals.css`
- `package.json`
- `README.md`

## Commit sugerido

```
Nexo v1.2.4: animaciones sutiles en el catálogo del portal
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.
