# Nexo v1.0

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

### Portal público y catálogo visual 0.4

- vidriera pública real en `/tienda/[slug]`, con dirección propia editable desde el portal;
- enlace del portal grande y visible, con botones para abrir, copiar y enviar por WhatsApp;
- carga de fotos por producto y descripción para el portal, con el mismo modal en Inventario y en Portal;
- catálogo visual del portal con foto, precio y publicación de cada producto;
- banner de portada con carrusel de imágenes propias en vez del bosquejo anterior;
- guardado defendido ante datos de prueba antiguos y ante el límite de almacenamiento del navegador.

### Ajustes visuales 0.4.1

- límite de imagen subido a 2 MB, con compresión automática en el navegador cuando una foto lo supera;
- botones del portal (Abrir, Copiar enlace, Enviar por WhatsApp, Guardar y publicar) con íconos y colores pasteles;
- sistema de íconos del sidebar y de los módulos reemplazado por ilustraciones vectoriales propias.

### Identidad, gráfico y pedidos del portal 0.5

- logo del emprendimiento en el sidebar (chico en modo compacto, grande al expandir), editable desde Ajustes;
- gráfico de venta vs. costo en el inicio, con los últimos pedidos;
- categorías de producto editables desde Ajustes, ya no fijas en el modal;
- clientes y proveedores en formato tabla, con botón directo de WhatsApp por fila;
- los pedidos enviados por WhatsApp desde el portal público quedan cargados automáticamente en Pedidos;
- moneda siempre con el signo `$` de Argentina, sin la sigla ARS;
- ajustes visuales: recuadro para la descripción del producto, aviso emergente con ícono centrado, nombre de la administradora de la demostración actualizado.

### Correcciones de uso en celular 0.5.1

- clientes y proveedores: botones de editar y borrar, además del de WhatsApp;
- tabla de clientes y proveedores con scroll horizontal en celular, igual que pedidos e inventario;
- pedidos: botón "Todos" explícito para volver a ver todo el listado sin adivinar el clic.

### Pedidos con varios productos 0.6

- un pedido ahora puede tener varios productos (antes cada producto generaba un pedido aparte);
- los pedidos que llegan por WhatsApp desde el portal se cargan como un solo pedido con todos los productos del carrito;
- modal "Ver detalle" para pedidos con más de un producto;
- pipeline de estados de Pedidos con ícono propio por estado (nuevo, preparando, listo, entregado, cancelado);
- botón de WhatsApp de Pedidos unificado con el mismo ícono y color que Clientes y Proveedores.

### Corrección urgente 0.6.1

- se arregló una pantalla en blanco al entrar al emprendimiento: los pedidos guardados en versiones anteriores a 0.6 no tenían el nuevo campo `items` y rompían el inicio; ahora se adaptan solos al formato nuevo sin perder datos.

### Corrección visual 0.6.2

- el recuadro para subir el logo en Ajustes quedaba pegado abajo a la izquierda del panel; ahora tiene el mismo margen que el resto de las secciones.

### Sidebar 0.6.3

- botón "Salir" más grande y visible, con ícono, en el panel del emprendimiento y en superadministración;
- se sacó la flechita sin función junto al nombre del emprendimiento;
- el logo del emprendimiento pasa a ocupar todo el ancho del sidebar cuando se expande (antes solo se agrandaba como cuadrado).

### Identidad real y ajuste de botón Salir 0.7

- el emprendimiento de demostración pasó a llamarse "Pensando en ti" (antes "Luna Creativa"), con su logo, dos imágenes de banner y textos de bienvenida propios, ya cargados por defecto;
- logo real de Nexo en el sidebar (superadministración y panel del emprendimiento), en vez de la letra "N";
- corregido el botón "Salir" del sidebar expandido: se cortaba ("Sali") porque el bloque del nombre le dejaba muy poco espacio.

### Correcciones 0.7.1

- en Pedidos, cada tarjeta de estado mostraba dos íconos superpuestos y desalineados (uno viejo de texto, uno nuevo); se sacó el viejo y el nuevo quedó en el margen derecho de cada tarjeta;
- se corrigió el enlace público del portal, que daba error 404 porque la exportación estática todavía apuntaba al nombre de tienda anterior ("luna-creativa") después de renombrar el emprendimiento a "Pensando en ti".

### Ajustes de sidebar 0.7.2

- cuando hay un logo cargado, el sidebar expandido ya no muestra el nombre al lado: el logo ocupa todo el espacio (arriba, con el nombre incluido en la imagen, mostrarlo dos veces era redundante);
- mejor contraste para el texto "Administradora" debajo del logo, sin cambiar el fondo oscuro del sidebar.

### Pantalla de login 0.8

- ícono de Nexo recortado (sin el texto "Nexo" de la imagen) junto al nombre escrito con tipografía propia;
- eslogan corto debajo del logo (texto de referencia, a la espera del definitivo);
- panel izquierdo simplificado: solo el encabezado y el título, sin el párrafo ni el bloque de "Aislamiento por diseño";
- el título del formulario pasó de "Superadministración" a "Ingreso";
- pie de página nuevo con Términos de uso, Privacidad, y "© CIR Soluciones Digitales" con la versión de la app (se actualiza sola desde `package.json`).

### Ajustes de login 0.8.1

- logo de Nexo al doble de tamaño;
- eslogan corregido a "Gestión que conecta", con una tipografía más elegante (serif itálica);
- "PLATAFORMA MULTITENANT" y el título bajaron de posición, más cerca de donde estaban en el diseño original;
- se sacó la segunda línea del título ("Protegé cada negocio"), queda solo "Administrá el crecimiento.";
- colores de acento del login pasaron de naranja a verde/azul, acordes al logo de Nexo (título "Ingreso", botón de acceso, enlace del emprendimiento demo, foco de los campos).
- imagen de fondo propia en el panel izquierdo del login, con velo oscuro para mantener el texto legible.

### Correcciones 0.8.3

- ícono de Nexo en el login con las puntas redondeadas;
- "PLATAFORMA MULTITENANT" y el título subieron a la mitad de la altura del panel (antes quedaban pegados abajo), manteniendo la alineación a la izquierda;
- el logo del emprendimiento en el sidebar expandido ya no se corta: pasó de recortarse para llenar el marco a mostrarse completo siempre, sin importar la forma del logo que se suba.

### Categorías, buscador y banners con enlace 0.9

- categorías con subcategorías (Categoría → Subcategoría), editables desde Ajustes junto con una lista de palabras clave por subcategoría;
- al cargar la descripción de un producto, la subcategoría se sugiere sola si el texto menciona alguna palabra clave configurada (siempre editable a mano);
- portal público: fila de categorías + buscador de texto libre que busca por nombre, descripción, categoría y subcategoría;
- banners del carrusel con título propio por imagen y, opcionalmente, un enlace a una categoría, subcategoría o palabra clave — al hacer clic, el catálogo se filtra solo;
- se sacó el editor de banners duplicado de Ajustes (quedó un solo lugar: Portal de ventas).

### Variantes de producto y demanda de reposición 1.0

- productos con variantes (personaje, talle, color…), cada una con su propia foto, stock, costo y precio — sin variantes, el producto sigue funcionando como antes;
- el descuento y la devolución de stock en Pedidos ahora afectan a la variante puntual pedida, no al producto entero;
- "Armar pedido" permite elegir la variante al cargar una venta manual (por ejemplo, desde una feria);
- interruptor por producto para mostrarlo en el portal aunque se quede sin stock, en vez de ocultarlo automáticamente;
- botón "Avisame cuando haya stock" para productos sin stock visibles, que registra el pedido en un panel nuevo de Inventario ("Interés en productos sin stock") con acceso directo a WhatsApp de cada interesado;
- botón "Consultar por WhatsApp" en cada producto del portal público.

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
