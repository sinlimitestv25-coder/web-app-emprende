# Entrega Nexo v1.0.7

## Qué incluye

- **Favicon de Nexo**: el ícono de la pestaña del navegador ahora es el ícono de Nexo (`/nexo-icon.png`) en el login, el panel del emprendimiento y la superadministración.
- **Favicon del emprendimiento en su tienda**: al entrar a `/tienda/[slug]`, el ícono de la pestaña pasa a ser el logo propio de ese emprendimiento (el que suben en Ajustes → Logo del emprendimiento). Si todavía no cargaron un logo, se ve el ícono de Nexo como respaldo.

## Archivos para subir (4 en total, entran en una sola subida)

- `app/layout.tsx`
- `app/components/store/PublicStore.tsx`
- `package.json`
- `README.md`

## Commit sugerido

```
Nexo v1.0.7: favicon de Nexo y del emprendimiento en su tienda
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.

## Nota

El favicon de la tienda se actualiza automáticamente apenas carga la página, tomando el logo que la clienta tenga guardado en ese momento — no hace falta ningún paso extra al subir o cambiar el logo.
