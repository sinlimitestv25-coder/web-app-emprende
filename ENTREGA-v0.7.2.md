# Entrega Nexo v0.7.2

## Qué incluye

- **Logo a pantalla completa en el sidebar expandido**: cuando hay un logo cargado, ya no se muestra el nombre del emprendimiento al lado — el logo ocupa todo el espacio (donde antes estaban la miniatura y el nombre juntos), porque el nombre ya viene escrito dentro del logo y mostrarlo dos veces era redundante. Si todavía no cargaste un logo, se sigue viendo el ícono con iniciales + nombre como hasta ahora.
- **Mejor contraste en "Administradora"**: el texto se veía muy apagado contra el fondo oscuro del sidebar. Mi recomendación (charlada en el chat) fue no meter un color pastel ahí — rompería la consistencia del sidebar, que es todo oscuro — así que en cambio aclaré un poco el color del texto y le sumé algo más de peso tipográfico, manteniendo el fondo como está.
- Confirmado (sin cambios de código): las fotos de producto en el catálogo del portal, la tienda pública y la vista previa de carga ya tienen un recuadro de tamaño fijo con recorte automático, no deberían desbordarse sobre el texto en ninguna de esas tres pantallas.

## Archivos para subir (4 en total, entran en una sola subida)

- `app/components/tenant/TenantApp.tsx`
- `app/globals.css`
- `package.json`
- `README.md`

## Commit sugerido

```
Nexo v0.7.2: logo a pantalla completa en el sidebar y mejor contraste en Administradora
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.
