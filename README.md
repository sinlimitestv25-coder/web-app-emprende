# Nexo v0.3.2

SaaS multitenant para administrar emprendimientos. Esta versión mantiene separada la superadministración e incorpora una demostración funcional del panel privado de Luna Creativa.

## Incluye

- acceso exclusivo del superadministrador;
- modo demostración mientras se vincula el proyecto real;
- creación guiada de emprendimientos;
- ID público automático `NX-000001`;
- administradores, invitaciones y recuperación de acceso;
- planes, límites de usuarios y módulos;
- suspensión y archivado de espacios;
- auditoría administrativa sin contenido comercial;
- PostgreSQL, Supabase Auth, Storage y políticas RLS;
- funciones protegidas para aprovisionar espacios y gestionar accesos;
- exportación estática compatible con Netlify.

## Panel del emprendimiento v0.3

- tablero con ventas, ganancia estimada, pedidos y alertas;
- alta y edición de productos, variantes, costos, precios y stock;
- stock mínimo y publicación u ocultamiento en el portal;
- agenda de clientes y proveedores con acceso a WhatsApp;
- creación y seguimiento de pedidos;
- descuento de stock al comenzar la preparación y reintegro al cancelar;
- edición visual del portal, catálogo y carrito con pedido por WhatsApp;
- persistencia local de los datos de prueba y restablecimiento seguro.

Desde la pantalla de acceso se puede elegir entre la demostración del emprendimiento y la superadministración. Los datos de prueba se guardan solamente en el navegador y todavía no se escriben en Supabase.

### Mejora visual 0.3.1

- banner panorámico propio de Luna Creativa al ingresar al negocio;
- textos, botones, tablas y formularios con mayor tamaño de lectura;
- tarjetas con bordes más definidos y sombras visibles;
- adaptación del banner y la nueva escala tipográfica para celular.

### Navegación e iconos 0.3.2

- sidebar compacto con iconos visibles y expansión al pasar el mouse o navegar con teclado;
- botón para mantener el sidebar abierto;
- módulo activo con borde completo y efecto visual hundido;
- sistema único de iconos para navegación, métricas, resúmenes y acciones;
- tarjetas con sombras más profundas y respuesta al pasar el mouse;
- iconos destacados en inventario, clientes, proveedores, pedidos y superadministración.

## Configuración

1. Crear un proyecto nuevo de Supabase para Nexo.
2. Aplicar `supabase/migrations/20260813074000_platform_foundation.sql`.
3. Crear el primer usuario desde Supabase Auth.
4. Insertar su ID en `public.platform_admins` siguiendo la indicación de `supabase/seed.sql`.
5. Desplegar las funciones `provision-tenant` y `manage-platform-user`.
6. Configurar `SITE_URL` en los secretos de las funciones.
7. Copiar `.env.example` a `.env.local` y completar la URL y clave publicable.
8. Cargar esas dos variables públicas en Netlify.

La clave secreta o `service_role` nunca debe incluirse en Netlify ni usar el prefijo `NEXT_PUBLIC_`.

## Desarrollo

```bash
npm install
npm run dev
```

## Verificación y publicación

```bash
npm test
```

Netlify usa automáticamente `netlify.toml`, ejecuta `npm run build` y publica `dist`.

## Regla de privacidad

El superadministrador puede consultar espacios, usuarios, planes, módulos, estados, consumo y auditoría. No puede consultar productos, clientes, pedidos, ventas, gastos, ganancias ni movimientos internos de un emprendimiento.
