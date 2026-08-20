# Nexo v1.2.1

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

### Ventas directas por lugar 1.0.1

- los pedidos ahora tienen un canal: "Portal / WhatsApp" (automático) o "Venta directa" (al cargarlos desde Pedidos, por ejemplo en una feria);
- al armar una venta directa se puede anotar el lugar (feria, puesto, etc.), visible como etiqueta en la tabla de Pedidos — la base para más adelante poder comparar qué lugar conviene más;
- corregido un detalle de la entrega anterior: los pedidos de ejemplo no tenían los campos de variante que se habían agregado.

### Cliente opcional en venta directa 1.0.2

- "Armar pedido" ya no exige elegir un cliente: hay una opción "Venta directa (sin cliente)" arriba de la lista, pensada para cuando cargás una venta de feria sin pedirle el nombre a la persona — el pedido queda a nombre de "Vendedora";
- si el pedido no tiene cliente (o el cliente no tiene teléfono cargado), el botón de WhatsApp de esa fila en Pedidos aparece apagado en vez de abrir un enlace roto.

### Pie de página legal y logo redondo 1.0.3

- pie de página con "Términos de uso" y "Privacidad" agregado al final del panel del emprendimiento y de la superadministración (antes solo estaba en el login); al hacer clic se abre una ventana con el texto correspondiente;
- los enlaces de Términos y Privacidad del login ahora también abren esa misma ventana con el contenido, en vez de ser texto decorativo;
- el logo del emprendimiento en el sidebar pasó a mostrarse siempre redondo (círculo completo), recortando la imagen para llenar el marco en vez de dejar un fondo oscuro asomando alrededor cuando el sidebar se expande.

### Ajustes del pie de página 1.0.4

- corregido el nombre del desarrollador: "C&R Soluciones Digitales" (antes decía "CIR" por error);
- en las tres pantallas (login, emprendimiento y superadministración) el pie de página ahora queda separado en dos columnas: "C&R Soluciones Digitales · versión" a la izquierda, "Términos de uso" y "Privacidad" a la derecha;
- texto del pie de página un poco más grande para que se lea mejor.

### Pie de página también en el portal público 1.0.5

- el portal público (`/tienda/[slug]`) ahora también tiene, bien abajo, "C&R Soluciones Digitales · versión" y los enlaces de Términos de uso y Privacidad (antes solo estaban en el login y en los paneles internos);
- letra del pie de página un poco más grande en las cuatro pantallas (login, emprendimiento, superadministración y portal público).

### "Quiénes somos" en el portal 1.0.6

- botón "Quiénes somos" agregado junto a Términos de uso y Privacidad, en el pie del portal público;
- desde Portal de ventas, nueva sección "Acerca de nosotros" para escribir el texto de presentación, subir una foto y anotar la ubicación o zona de envíos — todo editable por la clienta;
- al hacer clic en "Quiénes somos" en la tienda pública, se abre una ventana con esa foto, el texto y un botón directo para escribir por WhatsApp.

### Ícono de pestaña (favicon) 1.0.7

- el ícono que se ve en la pestaña del navegador ahora es el ícono de Nexo, tanto en el login como en el panel del emprendimiento y la superadministración;
- en cada tienda pública (`/tienda/[slug]`) el ícono de la pestaña pasa a ser el logo propio del emprendimiento (el mismo que se sube en Ajustes); si todavía no subieron uno, se ve el ícono de Nexo.

### Aviso de medios de pago 1.0.8

- en el carrito del portal público, antes de enviar el pedido por WhatsApp, se agregó el aviso "Aceptamos todos los medios de pago — a convenir y confirmar con la vendedora."

### Barra de botones sobre el banner 1.0.9

- nueva franja entre el encabezado (nombre de la tienda) y el banner, con botones grandes tipo píldora — por ahora solo "Quiénes somos" (se sacó del pie de página, donde quedaban chicos);
- pensada para sumar más botones ahí mismo (por ejemplo "Preguntas frecuentes") a medida que se agreguen.

### Preguntas frecuentes 1.1.0

- la franja de botones sobre el banner del portal ahora queda alineada a la derecha (antes centrada);
- nuevo botón "Preguntas frecuentes" junto a "Quiénes somos", que abre una lista desplegable de preguntas y respuestas;
- desde Ajustes → Preguntas frecuentes, se cargan, editan y quitan las preguntas — vienen 4 de ejemplo (medios de pago, envíos, retiro y personalizados) para que se vea el formato; el botón del portal se oculta solo si no hay ninguna cargada.

### Acerca de nosotros pasó a Ajustes 1.1.1

- "Acerca de nosotros" (texto, foto y ubicación) se movió de Portal de ventas a Ajustes, justo arriba de Preguntas frecuentes, para que quede todo junto;
- en Ajustes, los cambios de "Acerca de nosotros" se guardan al toque (como el logo y las categorías), sin necesidad de tocar "Guardar y publicar".

### Vista de catálogo, envío por código postal y medios de pago 1.2.0

- en el catálogo del portal, tres botones nuevos junto al buscador para ver los productos como lista, mosaico grande (como estaba) o mosaico chico;
- **envío por código postal**: desde Ajustes → Zonas de envío se cargan zonas (nombre, prefijos de código postal y costo). En el carrito del portal, el comprador elige "Retiro" o "Envío", y si es envío, ingresa su código postal — si coincide con una zona cargada, el costo se suma solo al total; si no coincide, se le avisa que el envío se coordina por WhatsApp. **Importante**: viene una zona de ejemplo nada más, para mostrar el formato — hay que reemplazarla por las zonas y costos reales antes de usarla en serio, esto no calcula tarifas reales de ningún correo;
- **medio de pago** en el carrito: "Transferencia" ya funciona (al elegirla, avisa que se coordina el alias por WhatsApp); Mercado Pago, efectivo y tarjeta se ven marcados "Próximamente" — activarlos de verdad necesita conectar cada uno por separado más adelante;
- el pedido que llega por WhatsApp ahora incluye si es envío o retiro, el medio de pago elegido, y el total con envío incluido;
- la ventana del carrito se agrandó un poco para que entre todo cómodo.

### Corrección de alineación en el catálogo 1.2.1

- cuando un producto tiene un nombre más largo (por ejemplo, se va a dos líneas), la tarjeta ya no queda más alta que las demás ni desalinea el precio y el botón de las tarjetas vecinas — todas las tarjetas de una fila quedan parejas;
- "Consultar por WhatsApp" pasó a ser un botón redondo con el ícono de WhatsApp, del mismo tamaño que "Agregar", pegado al lado — ya no se estira ni cambia de forma al cambiar entre lista, mosaico grande o mosaico chico.

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
