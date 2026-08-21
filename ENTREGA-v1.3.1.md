# Entrega Nexo v1.3.1

## Qué incluye

- **Acciones a la vista**: en la tabla de Espacios, el botón único "Editar" se reemplazó por dos íconos directos — el candado (Restablecer contraseña) y el lápiz (Editar) — para no tener que entrar al detalle primero solo para restablecer una contraseña. El lápiz sigue abriendo el mismo panel de detalle de antes.
- **Alineación del Estado corregida**: el interruptor de Activo/Suspendido se corría de posición según el largo de la palabra del estado (por ejemplo "Configurando" es más largo que "Activo" y empujaba el interruptor hacia la derecha). Ahora el interruptor queda siempre pegado al mismo borde, en línea recta en todas las filas.

## Archivos para subir (4 en total, entran en una sola subida)

- `app/components/modules/Spaces.tsx`
- `app/globals.css`
- `package.json`
- `README.md`

## Commit sugerido

```
Nexo v1.3.1: acciones a la vista y alineación en Espacios
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.
