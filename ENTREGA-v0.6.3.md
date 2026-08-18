# Entrega Nexo v0.6.3

## Qué incluye

- **Botón "Salir" más grande**: tenía letra de 8px y quedaba invisible en el sidebar compacto. Ahora tiene un ícono de salida siempre visible (igual que el resto de los íconos del menú) y el texto "Salir" aparece grande al lado cuando el sidebar se expande. Corregido tanto en el panel del emprendimiento como en superadministración.
- **Flechita sin función eliminada**: la flechita hacia abajo junto al nombre del emprendimiento no tenía ninguna acción asociada, así que se sacó.
- **Logo en banner completo**: cuando el sidebar está expandido, el logo del emprendimiento ahora ocupa todo el ancho disponible (como un banner), en vez de agrandarse como un cuadrado. En modo compacto se sigue viendo chico, como ícono. Los módulos de navegación se acomodan automáticamente debajo.

## Archivos para subir (5 en total, entran en una sola subida)

- `app/components/ui/AppIcon.tsx`
- `app/components/tenant/TenantApp.tsx`
- `app/components/AppShell.tsx`
- `app/globals.css`
- `package.json`
- `README.md`

(6 en total contando los dos últimos.)

## Commit sugerido

```
Nexo v0.6.3: botón Salir visible, se saca la flechita sin uso y logo en banner al expandir
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.
