# Nekova — tema Shopify

Tienda de **ergonomía, bienestar, confort y accesorios** (Argentina, ARS): cojines (producto estrella), almohadas, antifaces, reposamuñecas, auriculares con cancelación de ruido, etc. Tema basado en **Dawn 16.0.0** (`upstream` = Shopify/dawn) con una capa propia "Nekova" encima. Todo el texto visible está en español rioplatense (voseo).

## Estado actual: lanzamiento con un solo producto

Solo se vende el **cojín ergonómico en U** (handle `cojin-ortopedico-u`, variantes Gris / Azul marino). La home (`templates/index.json`) y la página de producto (`templates/product.json`) usan la sección **`nekova-product`**; en la home se fija el producto por setting y se agrega una frase destacada (`launch_heading`). La sección de catálogo `home-product-showcase` queda en `index.json` **deshabilitada** (`"disabled": true`) para cuando haya más productos; su diseño y contenido están desactualizados (estética anterior) y hay que rehacerla al reactivarla, con categorías por necesidad: Postura, Descanso, Escritorio, Silencio.

## Vista local

`npm run preview:offline` → http://localhost:4173 (`scripts/offline-preview.mjs`, renderiza con liquidjs, datos de ejemplo, sin Shopify). El catálogo de muestra (`launchProducts`) tiene solo el cojín en U; los demás productos de muestra siguen accesibles por URL. La vista previa carga Poppins + Nunito Sans desde Google Fonts (en Shopify las sirve el CDN de Shopify), lee la configuración del tema de `config/settings_data.json` y respeta `"disabled": true`. La vista previa expone `settings`, `shop` y `routes` como globales de Liquid (como Shopify) para que los `{% render %}` puedan leerlos, y enruta `/pages/sobre-nekova` a `page.about`. Si se usa un filtro o tag de Liquid nuevo, puede faltar en el script (ej. `handleize` se agregó a mano).

## Qué es propio vs. Dawn

Propio (editar con libertad):
- `sections/nekova-product.liquid`: **sección actual de producto y home**. Estructura "mixta": ficha compacta arriba (galería + columna de compra fija al hacer scroll con frase, nombre, precio, selector de color, botón, 3 checks y acordeones Detalles / Medidas y materiales / Envío, garantía y devoluciones), y debajo secciones que alternan fondo y diagramación (ritmo: blanco → gris → negro → blanco → celeste → blanco → gris → blanco → azul → footer negro): "Pensado para las horas que pasás sentado" (3 fotos de uso con número), "Cómo funciona" sobre negro (imagen de zonas + A/B/C), beneficios (6 tarjetas con ícono), video en dos columnas con fotos de detalle, comparación "Un cojín común vs. Nekova", ficha técnica visible, reseñas (solo si hay app blocks), preguntas frecuentes en dos columnas y banda final de compra. Sistema de títulos: antetítulo azul en mayúsculas con rayita (`.nk-eyebrow`), h2 con una palabra destacada en acento (`.nk-hl`), encabezado dividido (título a la izquierda, bajada a la derecha, `.nk-head--split`) o centrado. Fotos de uso y de detalle: `product-media-cojin-ortopedico-vida-NN.jpg` y `-detalle-*.jpg` (recortes sin texto de fotos del proveedor y cuadros del video).
- `sections/nekova-trust-bar.liquid`: franja de beneficios con íconos debajo del header (en `header-group.json`, bloques editables). En pantallas < 1200px se desplaza en loop (sin animación si el usuario pide movimiento reducido). La barra de anuncios de Dawn (arriba del logo) está deshabilitada porque repetía estos mensajes; se puede reactivar para promociones.
- `sections/nekova-footer.liquid`: footer propio en `footer-group.json` (el footer de Dawn queda deshabilitado). 3 columnas iguales sobre negro: marca (logo en blanco con `filter`, texto, redes), Ayuda (menú elegido en el editor o, si no hay, links por defecto: preguntas frecuentes `/#preguntas-frecuentes`, envíos y devoluciones, contacto y las políticas de Shopify que existan; más email de la tienda `shop.email`, WhatsApp y horario si se cargan en el editor) y Novedades (formulario de newsletter con tag `newsletter`). Abajo: copyright e íconos de medios de pago activos. Los textos están en los settings de la sección.
- **Contacto centralizado**: grupo de configuración del tema "Nekova · contacto" (`settings_schema.json`): `nekova_whatsapp` (+54 9 11 4945-7398), `nekova_whatsapp_message`, `nekova_whatsapp_float` y `nekova_email` (info@nekova.com.ar). Lo usan el botón flotante (`snippets/nekova-whatsapp-float.liquid`, renderizado desde el footer, verde WhatsApp oscuro `#0f7d70` por contraste), el footer, la página de contacto, la FAQ "¿Cómo me comunico con ustedes?" y los íconos de redes. Redes: settings estándar de Dawn `social_instagram_link`, `social_facebook_link`, `social_tiktok_link`; `snippets/nekova-social-icons.liquid` muestra solo las que tienen link.
- `sections/nekova-about.liquid` + `templates/page.about.json`: página "Sobre Nekova" (en Shopify: crear la página con handle `sobre-nekova` y plantilla "about"; el footer ya la enlaza). Texto sin historia inventada: misión, 3 pilares, compromiso (despacho, 10 días, 60 días de garantía) y contacto.
- Confianza en la compra (`nekova-product`): íconos reales de medios de pago (`shop.enabled_payment_types`) y "Nota de pago" opcional bajo el precio; bloque "Probalo tranquilo" (10 días para devolverlo, 60 días de garantía, atención por WhatsApp) y "Nota de envío" opcional junto al botón. No escribir cuotas, envío gratis ni zonas sin que el dueño lo confirme: van en esas notas. Pendientes por decisión del dueño: reseñas, datos legales (CUIT, Data Fiscal, botón de arrepentimiento), descuento de bienvenida, fotos propias.
- : íconos de línea (arrow-left/right, close, check, truck, shield, return, card). Agregar íconos nuevos ahí, mismo estilo (24px, trazo 1.8, `currentColor`).
- `assets/premium-product-landing.js`: JS de galería, lightbox y selector de variantes; lo usa `nekova-product` (los hooks son `data-premium-*`; las clases `premium-gallery-main` y `premium-lightbox-content` son necesarias en el markup).
- `assets/nekova-base.css` (tokens), `sections/nekova-contact-intro.liquid`, `snippets/nekova-social-icons.liquid`, `assets/nekova-social-icons.css`, kit de logos `assets/nekova-logo*.svg` y `assets/nekova-mark*.svg` (ver "Marca y logo").
- Heredadas, sin uso actual: `sections/premium-product-landing.liquid` (landing larga anterior, con contenido de productos previos: atril, lámpara K25, cojín doble capa) y `sections/home-product-showcase.liquid`. Sirven de referencia de contenido; no reflejan la estética actual.

Dawn modificado (cambios mínimos): `announcement-bar.liquid` (barra de acento), `header.liquid` (logo SVG si no hay logo en Shopify; setting `show_search` "Mostrar buscador", desactivado mientras haya un solo producto; header fijo arriba con `sticky_header_type: always`), `header-drawer.liquid`, `footer.liquid` (íconos sociales), `card-product.liquid` + `component-card.css` (ratio 4:5, `object-fit: contain`, cinta "Próximamente"), `layout/theme.liquid` (carga `nekova-base.css`; favicon `nekova-mark.svg` si no hay uno cargado en Shopify).

## Sistema visual: "fresco y luminoso"

Blanco, limpio y moderno, tipo marcas DTC: mucho aire, foco en el producto, un solo color vivo para acciones y detalles. Poco texto; beneficios en frases cortas.

**Tokens globales** en `assets/nekova-base.css`. **No usar hex sueltos** en secciones; solo tokens (salvo blanco/negro con alpha en sombras y el mapa de colores de variantes).

| Token | Valor | Uso |
|---|---|---|
| `--nekova-bg` (+ `-rgb`) | `#ffffff` | fondo de página |
| `--nekova-surface` | `#ffffff` | tarjetas sobre bandas grises |
| `--nekova-panel` | `#f3f5f9` gris frío muy claro | fondo de galería, bandas |
| `--nekova-ink` (+ `-rgb`) | `#14161a` | texto y títulos |
| `--nekova-muted` | `#5b6270` | texto secundario |
| `--nekova-line` / `-line-strong` | 10% / 22% | divisores, bordes |
| `--nekova-accent` | `#2f5bff` azul cobalto | botones, frase destacada, íconos, links, selección |
| `--nekova-accent-strong` / `-accent-soft` | `#1f45d9` / `#eaf0ff` | hover / fondos suaves |
| `--nekova-on-accent` | `#ffffff` | texto sobre acento |
| `--nekova-warm` / `-warm-soft` | `#c94430` / `#fdeeea` | descuentos (badge, % OFF) |
| `--nekova-radius-sm` / `radius` / `radius-lg` / `radius-pill` | 1 / 1.6 / 2.4rem / 999px | esquinas |

**Cambiar el acento** (ej. coral o violeta, valores en el comentario del archivo): `--nekova-accent`, `-accent-strong`, `-accent-soft` en `nekova-base.css`, el `ACCENT` de `scripts/build-logo-kit.mjs` (y regenerar el kit) y los color schemes de `config/settings_data.json` que usan `#2F5BFF`/`#1F45D9`/`#EAF0FF`.

Color schemes de Dawn (header, footer, carrito, formularios): scheme-1 blanco, scheme-2 gris claro (footer), scheme-3 blanco (tarjetas), scheme-4 acento (barra de anuncios), scheme-5 acento suave, scheme-6 descuento, scheme-7 negro (no usado por el footer propio, que toma `--nekova-ink`). Ancho de página 1280px (`page_width`), igual que `.nk-shell` y la franja de beneficios, para que logo, franja y contenido arranquen en la misma línea. Radios: botones 40, inputs 10, tarjetas/medios 16.

Tipografía (editor de Shopify → Configuración del tema → Tipografía; las secciones la leen vía `--font-heading-family`/`--font-body-family` y `--font-heading-weight`):
- Títulos: **Poppins 600** (`poppins_n6`), `letter-spacing: -.02em`, sin cursivas.
- Cuerpo/UI: **Nunito Sans** (`nunito_sans_n4`); énfasis 700–800.
- `1rem = 10px`. Escala: etiquetas 1.25–1.4rem; texto 1.45–1.6rem; títulos de sección `clamp(2.8rem, 3.4vw, 4.2rem)`; nombre de producto `clamp(2.8rem, 3vw, 3.6rem)`. No bajar de 1.2rem.

Formas y componentes: botón primario rectángulo suave (`border-radius: 1.2rem`, peso 700, sin sombra); compra = selector de cantidad (`[data-nk-qty]`, 1 a 10, JS en `premium-product-landing.js`) + botón "Agregar al carrito" con ícono de carrito a la izquierda del texto (`.nk-button--cart`); el botón de la banda final es rectangular sin redondeo;  fotos de producto sobre `--nekova-panel` con `mix-blend-mode: multiply` (las fotos deben tener fondo blanco puro); tarjetas blancas `radius-lg` sobre banda gris; acordeones con línea divisoria y `+` de acento que rota; secciones a todo el ancho (`.nk-section` + `--panel` gris, `--soft` celeste, `--dark` negro) con diagramación variada (dividida, centrada, imagen + texto) para que la página no sea monótona. Layout: contenedor 1280px con 5rem de margen; breakpoints 990px y 600px; en móvil las miniaturas son una fila deslizable, las fotos de uso son un carrusel que avanza solo cada 3 s (`data-nk-autoplay`, se pausa al tocarlo, solo cuando está a la vista y sin movimiento si el usuario lo pide), junto a los colores aparece una miniatura del color elegido que lleva a la galería, y la tabla comparativa muestra solo la N en la columna de Nekova.

## Marca y logo

Logo elegido: **"Ranuras"**. Isotipo = cuadrado blando (esquinas redondeadas) con dos cortes en U, uno desde abajo y otro desde arriba, que dibujan la N; los cortes repiten la ranura en U del cojín. Logotipo = "nekova" en minúsculas, trazo redondeado de grosor parejo. Pensado para bordarse (etiqueta en los cojines): formas llenas, sin líneas finas, funciona en un color. Los cortes son transparentes (`fill-rule: evenodd`), así el fondo o la tela se ve a través.

Kit en `assets/` (generado con `node scripts/build-logo-kit.mjs`; para ajustar formas o colores, editar el script y regenerar, no los SVG a mano):

| Archivo | Versión | Usar en |
|---|---|---|
| `nekova-logo.svg` | isotipo azul + texto carbón | header y fondos claros (es el principal) |
| `nekova-logo-white.svg` | todo blanco | footer, fondos negros o azules, fotos oscuras |
| `nekova-logo-ink.svg` | todo carbón | impresión a una tinta, empaque, documentos |
| `nekova-mark.svg` | isotipo azul | favicon (si no hay uno cargado en Shopify), avatar de redes, íconos |
| `nekova-mark-white.svg` | isotipo blanco | bordado sobre la tela gris o azul marino de los cojines, sobre azul o negro |
| `nekova-mark-ink.svg` | isotipo carbón | etiqueta tejida clara, sellos, una tinta |

Reglas: el isotipo va siempre a la izquierda del texto; no deformar ni rotar; en fondos de color usar la versión blanca, nunca el azul sobre azul. Antes de registrar la marca, buscar en el INPI marcas similares en la clase de productos y hacer el ajuste fino con un diseñador.

## Textos y afirmaciones de salud

Hablar de **comodidad, apoyo y descanso**; no prometer resultados de salud ("alivia el dolor", "corrige la postura", "ortopédico"), porque en Argentina pueden caer bajo la regulación de productos médicos (ANMAT). El título visible del producto es "Cojín Ergonómico en U de Espuma Viscoelástica"; el handle `cojin-ortopedico-u` y los nombres de archivo quedan así por compatibilidad (no son visibles).

## Convenciones de código

- Prefijos de clase: `nk-*` (sección actual de producto), `premium-*`/`nekova-home-*` (secciones heredadas), `nekova-*` (resto).
- CSS dentro de la sección en `{% style %}`, una regla por línea.
- JS: `querySelectorAll(...).forEach`, hooks por `data-*`, guardas `dataset.*Initialized`. Sin dependencias.
- Accesibilidad: `aria-label` en español en controles, `aria-hidden` en íconos, `:focus-visible` con outline de acento.
- Schemas: nombres "Nekova · …", labels en español.
- Precios con `money_without_trailing_zeros`.
- Liquid: para inicializar variables vacías usar `assign x = ''` (no `= blank`, que la vista previa no trata como vacío).
- Archivos con CRLF (`core.autocrlf=true`): al editar con scripts, respetar los finales de línea.

## Contenido por producto

En `nekova-product.liquid` el contenido propio del cojín está bajo `is_u_cushion` (handle `cojin-ortopedico-u`): galería desde `assets/product-media-cojin-ortopedico-NN.jpg`, frase corta, checks, acordeones, tarjetas, video y preguntas propias. Cualquier otro producto usa la versión genérica (media, descripción y metafield `custom.specifications` de Shopify; sin tarjetas ni video). Para un producto nuevo con contenido a medida: agregar una variable `is_<producto>` y ramas en esos mismos puntos, más el producto de muestra en `scripts/offline-preview.mjs` (`products`/`launchProducts` y sus variantes en `cartLines`). Imágenes: JPG 1200×1200 con fondo **blanco puro** (si no, se ve un recuadro sobre el gris: pasar por un umbral de blancos), `assets/product-media-<slug>-NN.jpg`, sin marcas del proveedor; en las tarjetas, solo fotos sin texto en inglés. Video opcional: `product_video` y `product_video_poster` (1280×720).

Variantes: con más de una variante se muestra el selector (`[data-premium-variant-picker]`, radios `name="id"`). Si la opción se llama Color, cada variante es un círculo de color con el nombre en tooltip (hover/foco) y el nombre elegido junto a la etiqueta; el color sale del swatch de Shopify o, si no hay, de un mapa por nombre (`case variant_color_handle`: gris, azul-marino, negro, beige…; agregar ahí colores nuevos). Nombre desconocido = pill de texto. Al cambiar de variante, el JS muestra su imagen (evento `premium:show-image`), actualiza la etiqueta y `?variant=`. Imagen por variante: `variant.featured_media` en Shopify; en el cojín en U se asigna en el selector (azul → 02, resto → 01).
