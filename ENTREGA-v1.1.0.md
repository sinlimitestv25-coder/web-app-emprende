# Entrega Nexo v1.1.0

## Qué incluye

- **Franja de botones a la derecha**: la moví al costado derecho (queda alineada con el botón "Carrito" de arriba, y deja el resto de la página más despejada).
- **Preguntas frecuentes**: nuevo botón junto a "Quiénes somos". Al abrirse muestra la lista de preguntas — cada una se despliega al tocarla para ver la respuesta — y termina con un botón para escribir por WhatsApp si no encontraron lo que buscaban.
- **Editable desde Ajustes**: nueva sección "Preguntas frecuentes" donde se cargan, editan y quitan preguntas y respuestas, igual de simple que categorías. Vienen 4 de ejemplo ya cargadas (medios de pago, envíos, retiro en persona y personalizados) para que veas el formato — las podés editar o borrar. Si en algún momento no queda ninguna pregunta cargada, el botón del portal se oculta solo.

## Archivos para subir (7 en total, entran en una sola subida)

- `app/data/tenant-demo.ts`
- `app/components/tenant/TenantSettings.tsx`
- `app/components/tenant/TenantApp.tsx`
- `app/components/store/PublicStore.tsx`
- `app/components/ui/AppIcon.tsx`
- `app/globals.css`
- `package.json`
- `README.md`

(8 en total contando los dos últimos.)

## Commit sugerido

```
Nexo v1.1.0: preguntas frecuentes editables y franja de botones a la derecha
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.
