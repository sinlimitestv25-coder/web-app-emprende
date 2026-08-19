# Entrega Nexo v1.0.3

## Qué incluye

- **Pie de página legal en toda la web**: "Términos de uso" y "Privacidad" ya no viven solo en la pantalla de login — ahora aparecen bien abajo de todo, tanto en el panel del emprendimiento como en la superadministración. Al hacer clic en cualquiera de los dos, se abre una ventana con el texto correspondiente.
- **Enlaces del login ahora funcionan**: los mismos textos en el pie del login (que antes eran decorativos) abren esa misma ventana con el contenido.
- **Logo del emprendimiento redondo**: en el sidebar, el logo cargado por el emprendimiento ahora se muestra siempre en un círculo completo (chico cuando el sidebar está compacto, más grande y centrado cuando se expande), recortando la imagen para llenar el círculo. Esto saca el fondo oscuro que se asomaba alrededor del logo como un "contorno negro" cuando el sidebar se expandía, y se adapta sola a cualquier imagen que se suba (no hace falta que sea cuadrada ni redonda de antemano).

## Archivos para subir (6 en total, entran en una sola subida)

- `app/components/ui/LegalFooter.tsx` *(archivo nuevo)*
- `app/components/auth/LoginScreen.tsx`
- `app/components/AppShell.tsx`
- `app/components/tenant/TenantApp.tsx`
- `app/globals.css`
- `package.json`
- `README.md`

(7 en total contando `package.json` y `README.md`.)

## Commit sugerido

```
Nexo v1.0.3: pie de página legal y logo del emprendimiento redondo
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.

## Nota

El texto de Términos y Privacidad que se ve al hacer clic es un texto genérico razonable para esta etapa de demostración (aclara que los datos se guardan en el navegador, etc.). Cuando definan el texto legal definitivo, se reemplaza fácil en un solo archivo (`app/components/ui/LegalFooter.tsx`).
