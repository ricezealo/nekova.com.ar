import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { networkInterfaces } from 'node:os';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { Liquid } from 'liquidjs';

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const locale = JSON.parse(readFileSync(join(root, 'locales/es.json'), 'utf8'));
const settingsData = JSON.parse(readFileSync(join(root, 'config/settings_data.json'), 'utf8'));
const settingsSchema = JSON.parse(readFileSync(join(root, 'config/settings_schema.json'), 'utf8'));
const settingDefaults = Object.fromEntries(settingsSchema.flatMap((group) => group.settings || [])
  .filter((setting) => Object.hasOwn(setting, 'default'))
  .map((setting) => [setting.id, setting.default]));
const themeSettings = { ...settingDefaults, ...(settingsData.presets?.[settingsData.current]?.settings || {}) };
const previewFont = {
  family: 'Arial',
  fallback_families: 'sans-serif',
  style: 'normal',
  weight: 400,
  'system?': true,
  toString: () => 'Arial, sans-serif',
};
themeSettings.type_body_font = previewFont;
themeSettings.type_header_font = previewFont;
const schemes = settingsData.presets?.[settingsData.current]?.color_schemes || {};
const colors = Object.entries(schemes).map(([id, value]) => ({
  id,
  settings: Object.fromEntries(Object.entries(value.settings).map(([key, color]) => [key, colorValue(color)])),
}));
const previewImage = '/assets/offline-preview.svg';
const image = { src: previewImage, url: previewImage, alt: 'Imagen de muestra local', width: 1200, height: 1200 };
const upcomingProductImage = {
  src: '/assets/preview-coming-soon.svg',
  url: '/assets/preview-coming-soon.svg',
  alt: 'Ilustración de una lámpara de escritorio Nekova de muestra',
  width: 900,
  height: 1125,
};

const productImageFiles = [
  'Hb5f1ee0a42944e8da27b90df6e3ed1877.jpg',
  'Hfa9cf59005624810920467ea450cbfb5o.jpg',
  'H028aa62769ca4ad9b54aca33682d19ec0.jpg',
  'H2b4cc26ef0d8449ba2492fe241016991o.jpg',
  'H43efb61d5f9348f1b53da0d6bc37cba9y.jpg',
  'H5ba6a17b211f44a7aa2103ffaa26e290v.jpg',
  'Hb24d8690081143bdac982e5102f33c18C.jpg',
  'He1c69a86185942a6b7db4bcdd258049el.jpg',
];
const productImages = productImageFiles.map((filename, index) => ({
  src: `/assets/product-media-${filename}`,
  url: `/assets/product-media-${filename}`,
  alt: `Soporte de madera giratorio, vista ${index + 1}`,
  width: 1200,
  height: 1500,
}));
const productMedia = productImages.map((preview, index) => ({
  id: 100 + index,
  media_type: 'image',
  preview_image: preview,
  alt: preview.alt,
}));
const lightImageFiles = [
  'k25-video-light-02.jpg',
  'k25-video-light-03.jpg',
  'k25-video-light-04.jpg',
  'k25-video-light-05.jpg',
  'k25-video-light-main.jpg',
  'k25-video-light-07.jpg',
  'k25-video-light-08.jpg',
  'k25-video-light-09.jpg',
  'k25-video-light-10.jpg',
  'k25-video-light-11.jpg',
  'k25-video-light-12.jpg',
  'k25-video-light-13.jpg',
  'k25-video-light-14.jpg',
  'k25-video-light-15.jpg',
  'k25-video-light-16.jpg',
];
const lightImages = lightImageFiles.map((filename, index) => ({
  src: `/assets/product-media-${filename}`,
  url: `/assets/product-media-${filename}`,
  alt: `Lámpara de video K25 RGB, imagen ${index + 1}`,
  width: 1200,
  height: 1500,
}));
const lightMedia = lightImages.map((preview, index) => ({
  id: 200 + index,
  media_type: 'image',
  preview_image: preview,
  alt: preview.alt,
}));
const cushionImageFiles = [
  'cojin-ergonomico-07.jpg',
  'cojin-ergonomico-01.jpg',
  'cojin-ergonomico-02.jpg',
  'cojin-ergonomico-03.jpg',
  'cojin-ergonomico-04.jpg',
  'cojin-ergonomico-05.jpg',
  'cojin-ergonomico-06.jpg',
  'cojin-ergonomico-08.jpg',
];
const cushionImages = cushionImageFiles.map((filename, index) => ({
  src: `/assets/product-media-${filename}`,
  url: `/assets/product-media-${filename}`,
  alt: `Cojín ergonómico de doble capa, imagen ${index + 1}`,
  width: 1200,
  height: 1200,
}));
const cushionMedia = cushionImages.map((preview, index) => ({
  id: 300 + index,
  media_type: 'image',
  preview_image: preview,
  alt: preview.alt,
}));
const productVariant = {
  id: 51001,
  title: 'Default Title',
  price: 12000000,
  compare_at_price: 15000000,
  available: true,
  featured_image: productImages[0],
  featured_media: productMedia[0],
  options: ['Default Title'],
  inventory_quantity: 24,
};
const featuredProduct = {
  id: 5100,
  handle: 'atril-madera-giratorio-360',
  title: 'Soporte de Madera Giratorio 360°',
  vendor: 'NEKOVA',
  price: 12000000,
  compare_at_price: 15000000,
  available: true,
  featured_image: productImages[0],
  featured_media: productMedia[0],
  media: productMedia,
  images: productImages,
  options: ['Title'],
  options_with_values: [],
  variants: [productVariant],
  selected_or_first_available_variant: productVariant,
  description: '<p>Soporte de madera MDF con rotación de 360°, altura ajustable, ranura de almacenamiento y clip elevable. Plegable y portátil para laptop, libros y tabletas.</p>',
  url: '/products/atril-madera-giratorio-360',
  type: 'Hogar y oficina',
  has_only_default_variant: true,
};
const lightVariant = {
  id: 52001,
  title: 'Default Title',
  price: 9900000,
  compare_at_price: null,
  available: true,
  featured_image: lightImages[0],
  featured_media: lightMedia[0],
  options: ['Default Title'],
  inventory_quantity: 24,
};
const lightProduct = {
  id: 5200,
  handle: 'lampara-video-portatil-k25-rgb',
  title: 'Mini Lámpara de Video Portátil K25 RGB, 25 W',
  vendor: 'NEKOVA',
  price: 9900000,
  compare_at_price: null,
  available: true,
  featured_image: lightImages[0],
  featured_media: lightMedia[0],
  media: lightMedia,
  images: lightImages,
  options: ['Title'],
  options_with_values: [],
  variants: [lightVariant],
  selected_or_first_available_variant: lightVariant,
  description: '<p>Luz RGB portátil de 25 W con batería de 3300 mAh, 20 efectos dinámicos, temperatura de color de 1800 a 9000 K y CRI 95+. Compacta para fotografía, video y streaming.</p>',
  url: '/products/lampara-video-portatil-k25-rgb',
  type: 'Fotografía y video',
  has_only_default_variant: true,
};
const cushionVariant = {
  id: 54001,
  title: 'Default Title',
  price: 7200000,
  compare_at_price: 9000000,
  available: true,
  featured_image: cushionImages[0],
  featured_media: cushionMedia[0],
  options: ['Default Title'],
  inventory_quantity: 24,
};
const cushionProduct = {
  id: 5400,
  handle: 'cojin-ergonomico-doble-capa',
  title: 'Cojín Ergonómico de Doble Capa',
  vendor: 'NEKOVA',
  price: 7200000,
  compare_at_price: 9000000,
  available: true,
  featured_image: cushionImages[0],
  featured_media: cushionMedia[0],
  media: cushionMedia,
  images: cushionImages,
  options: ['Title'],
  options_with_values: [],
  variants: [cushionVariant],
  selected_or_first_available_variant: cushionVariant,
  description: '<h2>Confort para tus espacios</h2><p>Su relleno compuesto de dos capas combina espuma viscoelástica y una base de esponja elástica de alta densidad.</p><p><strong>Capa superior:</strong> espuma viscoelástica de recuperación lenta, suave al tacto y adaptable a la forma del asiento.</p><p><strong>Capa inferior:</strong> esponja elástica de alta densidad para un apoyo firme en el uso diario.</p><p>El diseño ergonómico con ranura hueca en forma de U deja libre la zona central al sentarte. Una alternativa práctica para el escritorio, el automóvil o los momentos de lectura.</p><p>La cubierta de malla transpirable con patrón de panal se siente liviana y la funda es extraíble para facilitar su limpieza.</p><p>Puede usarse en sillas de escritorio, asientos de automóvil, sillas de ruedas, sofás, sillas gamer y asientos de viaje.</p>',
  url: '/products/cojin-ergonomico-doble-capa',
  type: 'Hogar y oficina',
  has_only_default_variant: true,
};
const upcomingVariant = {
  id: 53001,
  title: 'Default Title',
  price: 8900000,
  compare_at_price: null,
  available: false,
  featured_image: upcomingProductImage,
  featured_media: {
    id: 300,
    media_type: 'image',
    preview_image: upcomingProductImage,
    alt: upcomingProductImage.alt,
  },
  options: ['Default Title'],
  inventory_quantity: 0,
};
const upcomingProduct = {
  id: 5300,
  handle: 'lampara-escritorio-nordica-demo',
  title: 'Lámpara de Escritorio Nórdica · Muestra',
  vendor: 'NEKOVA',
  price: 8900000,
  compare_at_price: null,
  available: false,
  featured_image: upcomingProductImage,
  featured_media: upcomingVariant.featured_media,
  media: [upcomingVariant.featured_media],
  images: [upcomingProductImage],
  options: ['Title'],
  options_with_values: [],
  variants: [upcomingVariant],
  selected_or_first_available_variant: upcomingVariant,
  description: '<p>Una lámpara de escritorio de líneas simples, luz cálida y una silueta serena para acompañar tus espacios de lectura y trabajo. Producto ficticio de muestra, próximamente disponible.</p>',
  url: '/products/lampara-escritorio-nordica-demo',
  type: 'Iluminación',
  has_only_default_variant: true,
};
const products = [featuredProduct, lightProduct, cushionProduct, upcomingProduct];
const collection = { id: 1, handle: 'all', title: 'Todos los productos', description: '<p>Productos de ejemplo para la vista local.</p>', products, all_products_count: products.length, products_count: products.length, url: '/collections/all', image };
const menuItems = [
  { title: 'Inicio', url: '/' },
  { title: 'Casa y trabajo', url: '/collections/all', links: [{ title: 'Todos los objetos', url: '/collections/all', links: [] }] },
  { title: 'Contacto', url: '/pages/contact' },
];
const menu = { links: menuItems };
const emptyCart = { items: [], item_count: 0, total_price: 0, cart_level_discount_applications: [], note: '', empty: true };
const shop = { name: 'Nekova (vista local)', currency: 'ARS', money_format: '${{amount}}' };
const routes = { root_url: '/', cart_url: '/cart', cart_add_url: '/cart/add', cart_change_url: '/cart/change', cart_update_url: '/cart/update', search_url: '/search', account_login_url: '/account/login', account_register_url: '/account/register', all_products_collection_url: '/collections/all' };

function createCart(standCount, lightCount = 0, cushionCount = 0) {
  const items = [
    [featuredProduct, productVariant, productImages[0], standCount],
    [lightProduct, lightVariant, lightImages[0], lightCount],
    [cushionProduct, cushionVariant, cushionImages[0], cushionCount],
  ].filter(([, , , quantity]) => quantity > 0).map(([itemProduct, variant, itemImage, quantity], index) => ({
    ...itemProduct,
    product: itemProduct,
    image: itemImage,
    quantity,
    final_price: itemProduct.price,
    original_price: variant.compare_at_price || itemProduct.price,
    final_line_price: itemProduct.price * quantity,
    original_line_price: (variant.compare_at_price || itemProduct.price) * quantity,
    discounts: [],
    options_with_values: [],
    properties: {},
    url: itemProduct.url,
    key: String(variant.id),
    index,
  }));
  const itemCount = standCount + lightCount + cushionCount;
  if (!itemCount) return emptyCart;
  return {
    items,
    item_count: itemCount,
    total_price: items.reduce((total, item) => total + item.final_line_price, 0),
    cart_level_discount_applications: [],
    note: '',
    empty: false,
  };
}

function colorValue(hex) {
  const match = /^#?([\da-f]{6})$/i.exec(String(hex));
  if (!match) return hex;
  const value = match[1];
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return {
    red, green, blue, rgb: `${red},${green},${blue}`,
    toString: () => `#${value}`,
  };
}

const engine = new Liquid({
  root: [join(root, 'snippets'), join(root, 'sections'), join(root, 'layout')],
  extname: '.liquid',
  strictFilters: false,
  strictVariables: false,
  relativeReference: false,
  fs: {
    resolve: (directory, file, extension) => resolve(directory, extname(file) ? file : `${file}${extension}`),
    dirname,
    exists: async (file) => existsSync(file),
    existsSync,
    readFile: async (file) => normalizeLiquid(readFileSync(file, 'utf8')),
    readFileSync: (file) => normalizeLiquid(readFileSync(file, 'utf8')),
  },
});

const resolveTranslation = (key) => key.split('.').reduce((value, part) => value?.[part], locale);
engine.registerFilter('t', (key, options = {}) => {
  if (String(key) === 'sections.header.cart_count') return '__OFFLINE_CART_COUNT__';
  let text = resolveTranslation(String(key));
  if (text && typeof text === 'object') {
    text = text[Number(options.count) === 1 ? 'one' : 'other'] || text.other || text.one;
  }
  text ??= ({ 'sections.header.cart_count': 'items' }[String(key)] || String(key).split('.').at(-1).replaceAll('_', ' '));
  if (typeof text !== 'string') return String(key);
  for (const [name, value] of Object.entries(options || {})) {
    text = text.replaceAll(`{{ ${name} }}`, String(value)).replaceAll(`{{${name}}}`, String(value));
  }
  return text;
});
engine.registerFilter('asset_url', (name) => `/assets/${String(name).replace(/^\/+/, '')}`);
engine.registerFilter('shopify_asset_url', (name) => `/assets/${String(name).replace(/^\/+/, '')}`);
engine.registerFilter('image_url', (value) => (
  typeof value === 'string'
    ? value
    : value?.src || value?.url || value?.preview_image?.src || value?.preview_image?.url || previewImage
));
engine.registerFilter('image_tag', (src, options = {}) => `<img src="${src || previewImage}" alt="${options.alt || ''}" loading="${options.loading || 'lazy'}">`);
engine.registerFilter('inline_asset_content', (name) => {
  const path = join(root, 'assets', String(name));
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
});
engine.registerFilter('stylesheet_tag', (href) => `<link rel="stylesheet" href="${href}">`);
engine.registerFilter('script_tag', (src) => `<script src="${src}" defer></script>`);
engine.registerFilter('font_face', () => '');
engine.registerFilter('font_url', () => '');
engine.registerFilter('font_modify', (font) => font);
engine.registerFilter('money', (value) => money(value));
engine.registerFilter('money_with_currency', (value) => `${money(value)} ARS`);
engine.registerFilter('money_without_currency', (value) => money(value).replace(' ARS', ''));
engine.registerFilter('money_without_trailing_zeros', (value) => money(value));
engine.registerFilter('link_to', (text, url) => `<a href="${url || '#'}">${text}</a>`);

function money(value) {
  const numeric = Number(value || 0) / 100;
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(numeric);
}

function normalizeLiquid(source) {
  return source
    .replace(/\{%[-\s]*schema[-\s]*%\}[\s\S]*?\{%[-\s]*endschema[-\s]*%\}/g, '')
    .replace(/\{%[-\s]*doc[-\s]*%\}[\s\S]*?\{%[-\s]*enddoc[-\s]*%\}/g, '')
    .replace(/\{%[-\s]*style[-\s]*%\}/g, '<style>')
    .replace(/\{%[-\s]*endstyle[-\s]*%\}/g, '</style>')
    .replace(/\{%[-\s]*javascript[-\s]*%\}/g, '<script>')
    .replace(/\{%[-\s]*endjavascript[-\s]*%\}/g, '</script>')
    .replace(/\{%[-\s]*stylesheet[-\s]*%\}/g, '<style>')
    .replace(/\{%[-\s]*endstylesheet[-\s]*%\}/g, '</style>')
    .replace(/\{%[-\s]*form\s+['"]product['"][^%]*%\}/g, '<form action="/cart/add" method="post">')
    .replace(/\{%[-\s]*form\s+['"]customer['"][^%]*class:\s*['"]premium-stock-form['"][^%]*%\}/g, '<form action="/back-in-stock" method="post" class="premium-stock-form">')
    .replace(/\{%[-\s]*form\b[^%]*%\}/g, '<form action="#" method="post">')
    .replace(/\{%[-\s]*endform[-\s]*%\}/g, '</form>')
    .replace(/\{%[-\s]*paginate\b[^%]*%\}/g, '{% if true %}')
    .replace(/\{%[-\s]*endpaginate[-\s]*%\}/g, '{% endif %}')
    .replace(/\{%[-\s]*sections\s+['"][^'"]+['"][-\s]*%\}/g, '{{ preview_section_group }}')
    .replace(/\{%[-\s]*content_for_header[-\s]*%\}/g, '')
    .replace(/<link\b[^>]*fonts\.shopifycdn\.com[^>]*>/g, '')
    .replace(/<link\b[^>]*cdn\.shopify\.com[^>]*>/g, '')
    .replace(/<script type="module">[\s\S]*?<\/script>/g, '');
}

function sectionContext(id, definition, context) {
  const blocks = Object.entries(definition.blocks || {}).map(([blockId, block]) => ({ ...block, id: blockId }));
  const settings = { ...(definition.settings || {}) };
  if (typeof settings.collection === 'string') settings.collection = context.collections?.[settings.collection] || null;
  if (typeof settings.menu === 'string') settings.menu = context.menus?.[settings.menu] || context.linklists?.[settings.menu] || null;
  if (definition.type === 'premium-product-landing') {
    settings.product = (typeof settings.product === 'string' && context.products.find((item) => item.handle === settings.product))
      || context.products[0];
  }
  if (['image-banner', 'featured-product', 'image-with-text', 'slideshow', 'collage'].includes(definition.type)) {
    if (!settings.image) settings.image = image;
    if (!settings.image_2) settings.image_2 = image;
  }
  const section = {
    id,
    type: definition.type,
    settings,
    blocks,
    block_order: definition.block_order || blocks.map((block) => block.id),
    index: 1,
  };
  return section;
}

async function renderSection(id, definition, context) {
  const file = join(root, 'sections', `${definition.type}.liquid`);
  if (!existsSync(file)) return `<aside class="offline-preview-note">Seccion no disponible localmente: ${definition.type}</aside>`;
  const section = sectionContext(id, definition, context);
  const globals = { ...context, section, block: section.blocks[0] || {}, section_id: id };
  for (const [key, value] of Object.entries(section.settings)) {
    if (typeof value === 'string' && /{{|{%/.test(value)) {
      section.settings[key] = await engine.parseAndRender(value, globals);
    }
  }
  for (const block of section.blocks) {
    globals.block = block;
    for (const [key, value] of Object.entries(block.settings || {})) {
      if (typeof value === 'string' && /{{|{%/.test(value)) {
        block.settings[key] = await engine.parseAndRender(value, globals);
      }
    }
  }
  globals.block = section.blocks[0] || {};
  const source = normalizeLiquid(readFileSync(file, 'utf8'));
  let html = await engine.parseAndRender(source, globals);
  if (definition.type === 'main-product' && !html.includes('<img')) {
    html = html.replace('<div class="grid__item product__media-wrapper">', `<div class="grid__item product__media-wrapper"><img src="${previewImage}" alt="${image.alt}" style="width:100%;height:auto">`);
  }
  return `<div id="shopify-section-${id}" class="shopify-section">${html}</div>`;
}

async function renderGroup(fileName, context) {
  const file = join(root, 'sections', `${fileName}.json`);
  if (!existsSync(file)) return '';
  const group = JSON.parse(readFileSync(file, 'utf8'));
  const output = [];
  for (const id of group.order || []) {
    if (group.sections?.[id]) output.push(await renderSection(id, group.sections[id], context));
  }
  const contents = output.join('\n');
  const groupClass = group.class || (group.type === 'header' ? 'section-header' : '');
  const shopifyGroupClass = group.type ? `shopify-section-group-${group.type}-group` : '';
  const wrapperClasses = [shopifyGroupClass, groupClass].filter(Boolean).join(' ');
  return wrapperClasses ? `<div class="${wrapperClasses}">${contents}</div>` : contents;
}

function templateFor(pathname) {
  if (pathname === '/') return ['index', null];
  if (pathname.startsWith('/products/')) return ['product', products.find((item) => item.handle === pathname.split('/')[2]) || products[0]];
  if (pathname === '/collections') return ['list-collections', null];
  if (pathname.startsWith('/collections/')) return ['collection', collection];
  if (pathname === '/cart') return ['cart', null];
  if (pathname.startsWith('/pages/')) return [pathname === '/pages/contact' ? 'page.contact' : 'page', { title: pathname.endsWith('/contact') ? 'Contacto' : 'Pagina de ejemplo', content: '<p>Contenido de pagina de ejemplo para la vista offline.</p>' }];
  if (pathname.startsWith('/blogs/')) return ['blog', { title: 'Novedades', articles: [] }];
  if (pathname.startsWith('/articles/')) return ['article', { title: 'Articulo de ejemplo', content: '<p>Contenido de articulo.</p>', image }];
  if (pathname === '/search') return ['search', { terms: '', results: { products } }];
  if (pathname === '/404') return ['404', null];
  if (pathname === '/password') return ['password', null];
  return ['index', null];
}

async function renderLayout(context) {
  context.preview_section_group = await renderGroup('header-group', context);
  const header = context.preview_section_group;
  context.preview_section_group = await renderGroup('footer-group', context);
  const footer = context.preview_section_group;
  const layoutFile = context.template?.layout === 'password' ? 'password.liquid' : 'theme.liquid';
  let source = readFileSync(join(root, 'layout', layoutFile), 'utf8');
  let passwordHeader = '';
  let passwordFooter = '';
  if (layoutFile === 'password.liquid') {
    passwordHeader = await renderSection('main-password-header', { type: 'main-password-header', settings: {} }, context);
    passwordFooter = await renderSection('main-password-footer', { type: 'main-password-footer', settings: {} }, context);
    source = source
      .replace(/\{%[-\s]*section\s+['"]main-password-header['"][-\s]*%\}/, '{{ preview_password_header }}')
      .replace(/\{%[-\s]*section\s+['"]main-password-footer['"][-\s]*%\}/, '{{ preview_password_footer }}');
  }
  const layout = normalizeLiquid(source)
    .replace(
      '<head>',
      '<head>\n    <script>window.Shopify = { designMode: false }; window.StandardEvents = { createViewEventElement: (Base = HTMLElement) => class extends Base { connectedCallback() {} } };</script>',
    )
    .replace('{{ preview_section_group }}', '{{ preview_header }}')
    .replace('{{ preview_section_group }}', '{{ preview_footer }}');
  const html = await engine.parseAndRender(layout, {
    ...context,
    preview_header: header,
    preview_footer: footer,
    preview_password_header: passwordHeader,
    preview_password_footer: passwordFooter,
  });
  return html
    .replace(/<link\b(?=[^>]*\brel="preload")(?=[^>]*\bhref="")[^>]*>/g, '')
    .replace(/\s+srcset="[^"]*"/g, '')
    .replaceAll('__OFFLINE_CART_COUNT__', `${context.cart?.item_count || 0} ${(context.cart?.item_count || 0) === 1 ? 'item' : 'items'}`)
    .replaceAll('{{ product }}', context.product?.title || '')
    .replaceAll('{{ quantity }}', '1')
    .replace(/shopify:\/\/collections\/([^"' ]+)/g, '/collections/$1')
    .replace(/shopify:\/\/products\/([^"' ]+)/g, '/products/$1')
    .replace(/shopify:\/\/pages\/([^"' ]+)/g, '/pages/$1');
}

function accountPreview(pathname) {
  const pages = {
    '/account/login': ['Iniciar sesion', '<label>Email<input type="email" name="email"></label><label>Contrasena<input type="password" name="password"></label><button class="button" type="button">Iniciar sesion (demo)</button><p><a href="/account/register">Crear una cuenta</a></p>'],
    '/account/register': ['Crear cuenta', '<label>Nombre<input name="first_name"></label><label>Apellido<input name="last_name"></label><label>Email<input type="email" name="email"></label><label>Contrasena<input type="password" name="password"></label><button class="button" type="button">Crear cuenta (demo)</button><p><a href="/account/login">Ya tengo una cuenta</a></p>'],
    '/account/addresses': ['Direcciones', '<p>En Shopify, las direcciones se administran desde la cuenta del cliente.</p><a href="/account">Volver a mi cuenta</a>'],
    '/account/orders': ['Pedidos', '<p>No hay pedidos de muestra.</p><a href="/account">Volver a mi cuenta</a>'],
    '/account': ['Mi cuenta', '<p>Esta es una cuenta ficticia para la vista local.</p><nav><a href="/account/orders">Pedidos</a> · <a href="/account/addresses">Direcciones</a> · <a href="/account/login">Cerrar sesion</a></nav>'],
  };
  const [title, content] = pages[pathname] || pages['/account'];
  return `<section class="customer account page-width"><h1>${title}</h1>${content}</section>`;
}

async function renderPage(pathname, cartCount = 0, lightCount = 0, cushionCount = 0, stockNotificationRegistered = false) {
  if (pathname.startsWith('/account')) {
    const settings = { ...themeSettings, color_schemes: colors };
    const context = {
      settings, shop, routes, cart: createCart(cartCount, lightCount, cushionCount), products, collections: { all: collection, frontpage: collection },
      stock_notification_registered: stockNotificationRegistered,
      customer: null, localization: { available_countries: [], available_languages: [] },
      request: { locale: { iso_code: 'es-AR' }, origin: `http://localhost:${port}`, path: pathname },
      template: { name: 'customers' }, page_title: 'Cuenta de cliente', page_description: '',
      current_page: 1, current_tags: [], canonical_url: `http://localhost:${port}${pathname}`,
      content_for_header: '', content_for_layout: accountPreview(pathname), preview_section_group: '',
      linklists: { 'main-menu': menu, 'footer': menu, 'footer-menu': menu },
      menus: { 'main-menu': menu, 'footer': menu, 'footer-menu': menu },
      shopify: { designMode: false },
    };
    return renderLayout(context);
  }
  const [templateName, resource] = templateFor(pathname);
  const templatePath = join(root, 'templates', `${templateName}.json`);
  if (!existsSync(templatePath)) {
    return `<!doctype html><meta charset="utf-8"><h1>Plantilla no disponible</h1><p>No existe templates/${templateName}.json en este tema.</p><a href="/">Volver al inicio</a>`;
  }
  const template = JSON.parse(readFileSync(templatePath, 'utf8'));
  const settings = { ...themeSettings, color_schemes: colors };
  const context = {
    settings, shop, routes, cart: createCart(cartCount, lightCount, cushionCount), products, collections: { all: collection, frontpage: collection },
    stock_notification_registered: stockNotificationRegistered,
    collection: templateName === 'collection' ? collection : undefined,
    product: templateName === 'product' ? resource : undefined,
    page: templateName.startsWith('page') ? resource : undefined,
    blog: templateName === 'blog' ? resource : undefined,
    article: templateName === 'article' ? resource : undefined,
    search: templateName === 'search' ? resource : undefined,
    customer: null, localization: { available_countries: [], available_languages: [] },
    request: { locale: { iso_code: 'es-AR' }, origin: `http://localhost:${port}`, path: pathname, page_type: pathname === '/' ? 'index' : pathname.startsWith('/products/') ? 'product' : '' },
    template: { name: templateName.split('.')[0], suffix: templateName.includes('.') ? templateName.split('.')[1] : null, layout: template.layout },
    page_title: resource?.title || shop.name,
    page_description: resource?.description || '',
    current_page: 1, current_tags: [], canonical_url: `http://localhost:${port}${pathname}`,
    content_for_header: '', content_for_layout: '', preview_section_group: '',
    linklists: { 'main-menu': menu, 'footer': menu, 'footer-menu': menu },
    menus: { 'main-menu': menu, 'footer': menu, 'footer-menu': menu },
    shopify: { designMode: false },
  };
  const sections = [];
  for (const id of template.order || []) {
    const definition = template.sections?.[id];
    if (definition) sections.push(await renderSection(id, definition, context));
  }
  context.content_for_layout = sections.join('\n');
  return renderLayout(context);
}

const types = { '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://localhost:${port}`);
    const cookieCount = Number.parseInt(request.headers.cookie?.match(/(?:^|;\s*)nekova_cart=(\d+)/)?.[1] || '0', 10);
    const lightCookieCount = Number.parseInt(request.headers.cookie?.match(/(?:^|;\s*)nekova_cart_k25=(\d+)/)?.[1] || '0', 10);
    const cushionCookieCount = Number.parseInt(request.headers.cookie?.match(/(?:^|;\s*)nekova_cart_cushion=(\d+)/)?.[1] || '0', 10);
    if (request.method === 'POST' && url.pathname === '/cart/add') {
      let body = '';
      for await (const chunk of request) {
        body += chunk;
        if (body.length > 8192) {
          response.writeHead(413).end('Form data too large');
          return;
        }
      }
      const form = new URLSearchParams(body);
      const quantity = Number(form.get('quantity') || 1);
      const variantId = form.get('id');
      const isLight = variantId === String(lightVariant.id);
      const isStand = variantId === String(productVariant.id);
      const isCushion = variantId === String(cushionVariant.id);
      if ((!isStand && !isLight && !isCushion) || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 10) {
        response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end('No se pudo agregar el producto. Verifica la variante y la cantidad.');
        return;
      }
      const currentCount = isLight ? lightCookieCount : isCushion ? cushionCookieCount : cookieCount;
      const nextCount = Math.min(currentCount + quantity, 99);
      response.writeHead(303, {
        location: '/cart',
        'set-cookie': `${isLight ? 'nekova_cart_k25' : isCushion ? 'nekova_cart_cushion' : 'nekova_cart'}=${nextCount}; Path=/; Max-Age=604800; SameSite=Lax; HttpOnly`,
      }).end();
      return;
    }
    if (request.method === 'POST' && url.pathname === '/back-in-stock') {
      let body = '';
      for await (const chunk of request) {
        body += chunk;
        if (body.length > 8192) {
          response.writeHead(413).end('Form data too large');
          return;
        }
      }
      const form = new URLSearchParams(body);
      const email = form.get('contact[email]')?.trim().toLowerCase();
      const tagValue = form.get('contact[tags]') || '';
      const taggedProduct = products.find((item) => !item.available && tagValue.split(',').map((tag) => tag.trim()).includes(`back-in-stock-${item.handle}`));
      const acceptedNotification = form.get('contact[accepts_marketing]') === 'true';
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !taggedProduct || !acceptedNotification) {
        response.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' }).end('Ingresá un email válido y aceptá recibir el aviso de disponibilidad.');
        return;
      }
      const referer = request.headers.referer ? new URL(request.headers.referer) : null;
      const returnPath = referer?.origin === `http://localhost:${port}` && referer.pathname === taggedProduct.url
        ? referer.pathname
        : taggedProduct.url;
      response.writeHead(303, { location: `${returnPath}?stock-notification=registered` }).end();
      return;
    }
    if (url.pathname.startsWith('/assets/')) {
      const assetPath = resolve(root, normalize(url.pathname.slice(1)));
      if (!assetPath.startsWith(resolve(root, 'assets') + '/') || !existsSync(assetPath) || !statSync(assetPath).isFile()) {
        response.writeHead(404).end('Asset not found');
        return;
      }
      response.writeHead(200, { 'content-type': extname(assetPath) === '.avif' ? 'image/avif' : types[extname(assetPath)] || 'application/octet-stream', 'cache-control': 'no-cache' });
      createReadStream(assetPath).pipe(response);
      return;
    }
    const html = await renderPage(
      url.pathname,
      Math.min(Math.max(cookieCount, 0), 99),
      Math.min(Math.max(lightCookieCount, 0), 99),
      Math.min(Math.max(cushionCookieCount, 0), 99),
      url.searchParams.get('stock-notification') === 'registered',
    );
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-cache' });
    response.end(html);
  } catch (error) {
    console.error(`No se pudo renderizar ${request.url}:`, error);
    response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    response.end(`Error renderizando la vista offline: ${error.message}`);
  }
}).listen(port, '0.0.0.0', () => {
  console.log(`Vista offline de Shopify disponible en http://localhost:${port}`);
  const lanAddresses = Object.values(networkInterfaces()).flat()
    .filter((address) => address?.family === 'IPv4' && !address.internal)
    .map((address) => address.address);
  for (const address of lanAddresses) {
    console.log(`Acceso desde la red local: http://${address}:${port}`);
  }
  console.log('Datos y checkout simulados; no requiere Shopify CLI ni conexion a Shopify.');
});
