# Entrega Nexo v1.3.0

## Qué incluye

- **Interruptor en la tabla**: el estado Activo/Suspendido de cada espacio ahora tiene el mismo interruptor que ya usás en Inventario — clic y cambia, sin tener que abrir el detalle. (Para "Configurando" y "Archivado" el interruptor queda apagado/deshabilitado, porque esos estados no se manejan con un simple on/off.)
- **"Administrar" pasó a llamarse "Editar"** en la fila de la tabla.
- **Dentro del detalle de cada espacio**, en el orden que armamos juntos:
  1. 🔒 **Restablecer contraseña** — antes decía "Restablecer acceso" y no hacía nada al tocarlo; ahora confirma la acción (mandar el correo real a la administradora va a funcionar cuando conectemos Supabase Auth).
  2. ✏️ **Editar** — nuevo: se puede cambiar el nombre del emprendimiento, el plan y el máximo de usuarios, sin tener que recrear el espacio.
  3. **Suspender / Reactivar** — igual que antes, ahora también reflejado en el interruptor de la tabla.
  4. **Archivar** — se mantiene igual (reversible).
  5. **Eliminar espacio** — nuevo, como pediste. Es definitivo: antes de borrar, pide una confirmación aparte para evitar que se toque sin querer.

## Archivos para subir (5 en total, entran en una sola subida)

- `app/components/modules/Spaces.tsx`
- `app/components/ui/AppIcon.tsx`
- `app/globals.css`
- `package.json`
- `README.md`

## Commit sugerido

```
Nexo v1.3.0: interruptor, editar y eliminar en Espacios
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.
