# Entrega Nexo v1.2.1

## Qué incluye

- **Tarjetas parejas en el catálogo**: encontré la causa — cuando el nombre de un producto ocupa dos líneas (como "Vinilo nombre personalizado"), esa tarjeta se volvía más alta y el precio y el botón quedaban más abajo que en las tarjetas vecinas de la misma fila. Ahora todas las tarjetas de una fila quedan con la misma altura y el precio/botón siempre alineados abajo, sin importar cuántas líneas ocupe el nombre.
- **Botón de WhatsApp compacto**: "Consultar por WhatsApp" pasó de ser un texto largo abajo de la tarjeta a un botón redondo con el ícono de WhatsApp, del mismo tamaño que "Agregar", ubicado justo al lado. Ya no se estira ni queda distinto al cambiar entre lista, mosaico grande o mosaico chico.

## Archivos para subir (4 en total, entran en una sola subida)

- `app/components/store/PublicStore.tsx`
- `app/globals.css`
- `package.json`
- `README.md`

## Commit sugerido

```
Nexo v1.2.1: tarjetas parejas y botón de WhatsApp compacto en el catálogo
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.
