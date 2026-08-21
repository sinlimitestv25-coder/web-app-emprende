# Entrega Nexo v1.3.3

## Qué incluye

- **Administradores, mismo criterio que Espacios**: se sacó el botón "Gestionar" y la ventana que abría. Las tres acciones que tenía adentro ahora son íconos directos en la columna Acciones de la tabla:
  - 🔒 **Restablecer acceso**
  - ✉️ **Reenviar invitación**
  - ⊗ **Bloquear usuario** (se apaga solo si ya está bloqueado)

Un clic y listo, sin pasos intermedios.

## Archivos para subir (5 en total, entran en una sola subida)

- `app/components/modules/Administrators.tsx`
- `app/components/ui/AppIcon.tsx`
- `app/globals.css`
- `package.json`
- `README.md`

## Commit sugerido

```
Nexo v1.3.3: acciones a la vista en Administradores
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.
