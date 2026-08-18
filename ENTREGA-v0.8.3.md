# Entrega Nexo v0.8.3

## Qué incluye

- **Ícono de Nexo con puntas redondeadas** en el login.
- **"PLATAFORMA MULTITENANT" y el título** subieron a la mitad de la altura del panel izquierdo (antes quedaban pegados abajo, con el degradé), manteniendo la alineación a la izquierda igual que antes.
- **Logo del emprendimiento en el sidebar expandido**: se corregió el recorte. Antes usaba "recortar para llenar el marco" (`object-fit: cover`), y como tu logo es circular pero el marco es un rectángulo ancho, le cortaba los costados. Ahora usa "mostrar completo siempre" (`object-fit: contain`) — se ve el logo entero, con un fondo oscuro sutil alrededor si sobra espacio. Esto además va a funcionar bien para cualquier forma de logo que subas en el futuro (cuadrado, circular, rectangular), no solo para este.

## Archivos para subir (3 en total, entran en una sola subida)

- `app/globals.css`
- `package.json`
- `README.md`

## Commit sugerido

```
Nexo v0.8.3: puntas redondeadas, reacomodo del texto del login y logo del sidebar sin recortar
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.
