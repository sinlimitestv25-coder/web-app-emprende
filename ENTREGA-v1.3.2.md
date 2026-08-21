# Entrega Nexo v1.3.2

## Qué incluye

- **Sin duplicados**: "Restablecer contraseña" ya no aparece dos veces — vive solo como el candado en la tabla.
- **Todo en Acciones**: la tabla de Espacios ahora tiene tres íconos por fila — 🔒 Restablecer contraseña, ✏️ Editar, 🗑️ Eliminar. Suspender/Reactivar sigue siendo el interruptor de la columna Estado (ese ya estaba "afuera" desde la entrega anterior).
- **Editar es directo**: al tocar el lápiz se abre un modal con los campos para editar (nombre, plan, máximo de usuarios) ya activos — no hay que pasar primero por una vista de solo lectura y tocar "Editar" de nuevo adentro.
- **Nota**: saqué "Archivar" de la pantalla porque no lo mencionaste en esta vuelta y ya no había un lugar claro para ponerlo sin volver a mezclar cosas. Si lo querés de vuelta, lo agrego como un cuarto ícono en Acciones.

## Archivos para subir (4 en total, entran en una sola subida)

- `app/components/modules/Spaces.tsx`
- `app/globals.css`
- `package.json`
- `README.md`

## Commit sugerido

```
Nexo v1.3.2: acciones de Espacios simplificadas, edición directa
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.
