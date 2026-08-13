# Nexo

Base v0.1 de un SaaS multitenant para la gestión de emprendimientos de productos personalizados.

## Alcance actual

- dashboard general de la plataforma;
- gestión visual de espacios o emprendimientos;
- inventario con stock físico, reservado y disponible;
- flujo de pedidos;
- vista previa del portal público;
- navegación responsive;
- esquema inicial multitenant con usuarios, membresías, módulos, productos, clientes, pedidos, movimientos de inventario y auditoría.

Los datos que aparecen en la interfaz son demostrativos. La estructura persistente está declarada en `db/schema.ts` y su primera migración en `drizzle/0000_curved_goliath.sql`.

## Ejecución local

Requiere Node.js 22.13 o superior.

```bash
npm install
npm run dev
```

Para validar una entrega:

```bash
npm run build
npm test
```

## Publicación en Netlify

El proyecto incluye `netlify.toml`. Netlify ejecuta `npm run build` y publica `dist`. El último paso del build genera una versión estática navegable de esta v0.1; no depende de que Netlify interprete la salida interna de Cloudflare.

Para generar una nueva migración después de modificar el esquema:

```bash
npm run db:generate
```

## Regla multitenant

Todo registro perteneciente a un emprendimiento incluye `tenant_id`. Las consultas y escrituras futuras deben recibir el espacio desde la sesión validada en el servidor y filtrar siempre por ese identificador; nunca se debe aceptar un `tenant_id` enviado libremente por el navegador.

## Próximas versiones

- v0.2: autenticación, invitaciones, permisos y aprovisionamiento real de espacios;
- v0.3: CRUD de inventario, proveedores y compras;
- v0.4: clientes, pedidos, reservas y movimientos de stock;
- v0.5: portal público, carrito y envío de pedidos;
- v0.6: finanzas, reportes, combos y promociones;
- v1.0: endurecimiento de seguridad, pruebas completas y entrega productiva.
