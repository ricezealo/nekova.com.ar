# Nekova — tema Shopify

Tienda de objetos para casa, trabajo y confort (Argentina, ARS). Tema basado en **Dawn 16.0.0** (`upstream` = Shopify/dawn) con una capa propia "Nekova" encima. Todo el texto visible está en español rioplatense.

## Vista local

`npm run preview:offline` → http://localhost:4173 (`scripts/offline-preview.mjs`, renderiza con liquidjs, datos de ejemplo, sin Shopify). Productos de ejemplo definidos en el script: `atril-madera-giratorio-360`, `lampara-video-portatil-k25-rgb`, `cojin-ergonomico-doble-capa`, `cojin-ortopedico-u` (variantes Gris / Azul marino), `lampara-escritorio-nordica-demo` (no disponible → "Próximamente"). Al agregar filtros/tags de Liquid nuevos, puede hacer falta implementarlos en el script.

## Qué es propio vs. Dawn

Propio (editar con libertad):
- `sections/home-product-showcase.liquid` + `assets/home-product-showcase.js` — **toda la home** es esta única sección (hero, franja de confianza, grilla con filtros y carrusel por tarjeta, "Tu espacio", journal, FAQ, CTA contacto).
- `sections/premium-product-landing.liquid` + `assets/premium-product-landing.js` — **toda la página de producto** (hero con compra, galería + lightbox, story, fotos con caption, video K25, beneficios, ficha técnica, FAQ, reseñas vía app blocks, CTA final, formulario "avisarme" si no hay stock).
- `sections/nekova-contact-intro.liquid`, `snippets/nekova-social-icons.liquid`, `assets/nekova-social-icons.css`, `assets/nekova-logo.svg`.

Dawn modificado (cambios mínimos, mantenerlos acotados): `announcement-bar.liquid` (estilo crema fijo), `header.liquid` (logo SVG si no hay logo en Shopify), `header-drawer.liquid`, `footer.liquid` (íconos sociales), `card-product.liquid` + `component-card.css` (ratio 4:5 fijo, `object-fit: contain`, cinta "Próximamente").

El resto es Dawn sin tocar; las secciones Nekova traen su propio CSS en `{% style %}` y **no dependen de los estilos de Dawn**.

## Sistema visual

**Tokens globales** en `assets/nekova-base.css` (cargado en `layout/theme.liquid` después de `base.css`): `--nekova-black`, `--nekova-panel`, `--nekova-panel-soft`, `--nekova-ink`, `--nekova-muted`, `--nekova-gold`, `--nekova-on-gold` (texto sobre dorado), `--nekova-line`, `--nekova-line-strong`; crema: `--nekova-cream`, `--nekova-cream-light`, `--nekova-cream-panel(-soft)`, `--nekova-media` (fondo de fotos de producto), `--nekova-charcoal`, `--nekova-charcoal-muted`, `--nekova-bronze` (acento sobre crema), `--nekova-bronze-soft`, `--nekova-line-dark`; `--nekova-black-rgb` para `rgba(var(--nekova-black-rgb), .4)`; fuentes `--nekova-serif` / `--nekova-sans`. **No usar hex sueltos**: usar estos tokens (solo se permiten sombras neutras blanco/negro con alpha).

Cada sección mapea los tokens a variables semánticas `--premium-*` que es lo que usan las reglas:
| Variable | Oscuro (default) | Claro (`.premium-landing--comfort`) |
|---|---|---|
| `--premium-bg` | black `#111310` | cream-light `#f5f1e9` |
| `--premium-panel` | panel `#191b17` | cream-panel `#ebe5da` |
| `--premium-panel-soft` | panel-soft `#20221d` | cream-panel-soft `#e3dccf` |
| `--premium-ink` | ink `#f1eee6` | charcoal `#292a25` |
| `--premium-muted` | muted `#aaa99f` | charcoal-muted `#5f6059` |
| `--premium-accent` | gold `#c9a878` | bronze `#765f42` |
| `--premium-line` | line | line-dark |

Para un bloque crema dentro de una sección oscura, redefinir `--premium-accent: var(--nekova-bronze)` en el bloque (ver `.nekova-home-spaces`). En fondo claro, los botones bronce llevan texto `--nekova-cream-light`. Los color schemes de Dawn en `config/settings_data.json` replican esta paleta (scheme-1 oscuro, scheme-4 dorado, scheme-6 crema).

Tipografía (hardcodeada, ignora la fuente del editor):
- Títulos: `var(--nekova-serif)` (Georgia), peso 400, `letter-spacing: -.045em`, `line-height` ~1, tamaños con `clamp()`.
- Cuerpo/UI: `var(--nekova-sans)` (Arial).
- Patrón de título: dos líneas con `<br>`, la última frase en `<em>` coloreada con accent → `Comprar con<br><em>tranquilidad.</em>`.
- Eyebrow: `<p class="premium-eyebrow"><span></span> TEXTO EN MAYÚSCULAS</p>` y `.premium-edition` (subtítulo muted): estilos compartidos en `nekova-base.css`, toman `--premium-accent`/`--premium-muted` del contenedor. No redefinirlos por sección.
- Etiquetas/números: mayúsculas, tracking .1–.2em, numeración `01`, `02`… o `01 / CATEGORÍA`.
- `1rem = 10px` (Dawn usa `html { font-size: 62.5% }`). Escala mínima: etiquetas en mayúsculas 1.1–1.2rem; texto UI/meta 1.25–1.4rem; párrafos 1.5–1.6rem; lead 1.6–1.7rem; títulos serif de ítem 1.9–2.1rem. No bajar de 1.1rem.

Formas y detalles: esquinas rectas (radius 0) salvo pills de filtro (`999px`) y botones circulares. Bordes de 1px con `--premium-line`. Divisores de grilla: `gap: 1px` + `box-shadow: 1px 0 0 line, 0 1px 0 line` en cada ítem y `overflow: hidden` en la grilla (así filas incompletas no dejan celdas grises). Flechas tipográficas `→ ↗ ↓ ← ×` (no íconos SVG). Botón primario: fondo accent, texto oscuro, texto a la izquierda y `↗` a la derecha, hover invierte a transparente. Badge de descuento `NN% OFF`. Producto sin stock: cinta diagonal dorada "Próximamente" (−32°).

Layout: contenedor `max-width: 1440px; padding: 0 5.5%`; secciones internas con `padding: 7–8rem 7%` y `border-top: 1px solid var(--premium-line)`; grillas asimétricas (`.75fr 1.25fr`, `.7fr 1.3fr`). Breakpoints: home 800/540px, producto 900/600px.

## Convenciones de código

- Prefijos de clase: `nekova-home-*` (home), `premium-*` (producto, y eyebrow compartido), `nekova-*` (resto). BEM-ish solo en social icons.
- CSS dentro de la sección en `{% style %}`, una regla por línea, propiedades en orden alfabético aproximado.
- JS: IIFE / `querySelectorAll(...).forEach`, hooks por `data-*` (`data-home-*`, `data-premium-*`, `data-carousel-*`), guardas `dataset.*Initialized`, re-init en `shopify:section:load`. Sin dependencias.
- Accesibilidad: `aria-label` en español en todos los controles, `aria-pressed` en toggles, `aria-hidden` en flechas decorativas, `:focus-visible` con outline accent.
- Schemas: nombres "Nekova · …", labels en español.
- Texto: voseo (Elegí, Tenés, Conocé, Escribinos). Precios con `money_without_trailing_zeros` + `<small>ARS</small>`.

## Contenido por producto (importante)

Los 4 productos reales tienen contenido **hardcodeado por handle** en ambas secciones (imágenes desde `assets/product-media-*.jpg`, textos, beneficios, ficha técnica, captions). Variables: `is_reading_stand`, `is_k25_light`, `is_ergonomic_cushion`, `is_orthopedic_cushion`. Cualquier otro producto usa el fallback genérico (media, descripción y metafield `custom.specifications` de Shopify). Agregar un producto con landing a medida = nueva rama `elsif` en cada bloque (frase, intro, assurances, imagen principal, contador de imágenes, thumbs, story, fotos con caption, beneficios, ficha, FAQ opcional, botón y nota del CTA final) + rama en la home (imagen, 3 imágenes del carrusel, descripción) + producto de muestra en `scripts/offline-preview.mjs` (agregarlo a `products` y sus variantes a `cartLines`). Imágenes: JPG 1200×1200 sobre blanco, `assets/product-media-<slug>-NN.jpg`, sin marcas del proveedor. Video opcional: asignar `product_video` y `product_video_poster` (1280×720) al inicio de la sección; el bloque de video se muestra solo.

Variantes: si el producto tiene más de una variante, el hero muestra un selector (`.premium-variant-picker`, radios `name="id"`) y el CTA final pasa a "Elegí tu <opción>" con ancla al selector. Si la opción se llama Color, cada variante es un círculo de color con el nombre en tooltip (hover/foco); el color sale del swatch de Shopify o, si no hay, de un mapa por nombre (`case variant_color_handle` en la sección: gris, azul-marino, negro, beige…; agregar ahí colores nuevos). Nombre desconocido = pill de texto. Al cambiar de variante, `premium-product-landing.js` muestra su imagen en la galería (evento `premium:show-image`), actualiza el nombre en la leyenda y `?variant=`. Imagen por variante: `variant.featured_media` en Shopify; en productos hardcodeados se asigna en el `liquid` del selector (ej. cojín ortopédico: azul → 02, resto → 01).

Liquid: para inicializar variables vacías usar `assign x = ''` (no `= blank`, que la vista previa no trata como vacío).

Categoría "confort" (tema claro + filtro de la home): handle/tipo contiene `cojin`/`almohada`/`descanso` o tags `confort`/`cojines`/`almohadas`. La lógica está duplicada en las dos secciones; mantenerlas sincronizadas.
