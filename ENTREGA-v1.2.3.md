# Entrega Nexo v1.2.3

## Qué incluye

- **Efectivo habilitado**: ya se puede elegir "Efectivo" como medio de pago en el carrito del portal público (antes decía "Próximamente", igual que Mercado Pago y Tarjeta). Al elegirlo, aparece el aviso: "Elegiste efectivo — coordinamos el pago a través de WhatsApp con la vendedora."
- Mercado Pago y Tarjeta se quedan como "Próximamente", porque esos sí necesitan conectar un servicio de pagos real con sus propias claves — efectivo y transferencia no, por eso ya funcionan los dos.

## Archivos para subir (3 en total, entran en una sola subida)

- `app/components/store/PublicStore.tsx`
- `package.json`
- `README.md`

## Commit sugerido

```
Nexo v1.2.3: pago en efectivo habilitado en el portal
```

## Orden

Una sola subida, un solo commit.

Esta versión no requiere ejecutar SQL ni subir ningún `dist/` compilado.
