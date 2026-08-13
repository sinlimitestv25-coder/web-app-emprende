# Nexo v0.2

SaaS multitenant para administrar emprendimientos. Esta versión separa la superadministración de la operación privada de cada negocio.

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
