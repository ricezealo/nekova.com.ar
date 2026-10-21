// Genera las placas de Instagram/Facebook de las plantillas (1080 × 1350) en marca/instagram/.
// Uso: node scripts/build-instagram-plantillas.mjs [prefijo]   (ej. "20" para regenerar solo la publicación 20)
// Renderiza cada placa como HTML con Chrome sin ventana (Poppins + Nunito Sans desde Google Fonts).
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'marca', 'instagram');
const TMP = join(tmpdir(), 'nekova-ig');
mkdirSync(TMP, { recursive: true });

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => existsSync(p));

const asset = (f) => pathToFileURL(join(ROOT, 'assets', f)).href;
const img = (slug) => asset(`product-media-plantillas-${slug}.jpg`);

const CSS = `
:root { --accent: #2f5bff; --ink: #14161a; --muted: #5b6270; --panel: #f3f5f9; --soft: #eaf0ff; --line: rgba(20,22,26,.1); }
* { box-sizing: border-box; margin: 0; }
html, body { width: 1080px; height: 1350px; overflow: hidden; }
body { font-family: 'Nunito Sans', sans-serif; color: var(--ink); background: #fff; }
.slide { position: relative; width: 1080px; height: 1350px; padding: 100px; display: flex; flex-direction: column; }
.panel { background: var(--panel); }
.soft { background: var(--soft); }
.blue { background: var(--accent); color: #fff; }
.eyebrow { display: flex; align-items: center; gap: 20px; color: var(--accent); font-weight: 800; font-size: 30px; letter-spacing: .14em; text-transform: uppercase; }
.eyebrow::before { content: ''; width: 46px; height: 4px; background: currentColor; border-radius: 2px; }
.blue .eyebrow { color: #fff; }
h1 { font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: -.02em; line-height: 1.08; font-size: 84px; margin-top: 26px; }
h1 em { font-style: normal; color: var(--accent); }
.blue h1 em { color: #fff; text-decoration: underline; text-decoration-thickness: 6px; text-underline-offset: 12px; }
.sub { font-size: 40px; color: var(--muted); line-height: 1.4; margin-top: 24px; }
.blue .sub { color: rgba(255,255,255,.88); }
.card { flex: 1; margin-top: 50px; background: #fff; border-radius: 40px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.card img { max-width: 92%; max-height: 92%; object-fit: contain; }
.card.fill img { width: 100%; height: 100%; max-width: none; max-height: none; object-fit: cover; }
.foot { margin-top: auto; padding-top: 44px; display: flex; align-items: center; justify-content: space-between; }
.foot img { height: 46px; }
.foot span { font-weight: 700; font-size: 26px; color: var(--muted); }
.blue .foot span { color: rgba(255,255,255,.85); }
.center { justify-content: center; }
.num { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 200px; line-height: 1; color: var(--accent); }
.list { list-style: none; padding: 0; margin-top: 60px; display: grid; gap: 34px; }
.list li { display: grid; grid-template-columns: 64px 1fr; gap: 26px; align-items: start; font-size: 40px; line-height: 1.35; }
.list li b { display: block; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 44px; letter-spacing: -.01em; }
.list li span { color: var(--muted); font-size: 34px; }
.tick { width: 64px; height: 64px; border-radius: 50%; background: var(--soft); color: var(--accent); display: grid; place-items: center; font-family: 'Poppins'; font-weight: 700; font-size: 32px; }
.square { position: absolute; left: 0; top: 135px; width: 1080px; height: 1080px; object-fit: cover; }
.square-slide .foot { position: absolute; left: 100px; right: 100px; bottom: 40px; padding: 0; }
.square-slide .eyebrow { position: absolute; left: 100px; top: 50px; }
.table { margin-top: 70px; border-top: 2px solid var(--line); }
.row { display: grid; grid-template-columns: 1fr 170px 170px; align-items: center; padding: 30px 0; border-bottom: 2px solid var(--line); font-size: 36px; }
.row.head { font-weight: 800; font-size: 28px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.row.head .nk { color: var(--accent); }
.row > :not(:first-child) { text-align: center; }
.yes { color: var(--accent); font-weight: 800; font-size: 44px; }
.no { color: #b3b8c2; font-weight: 700; font-size: 30px; }
.tiers { margin-top: 64px; display: grid; gap: 22px; }
.tier { display: flex; justify-content: space-between; align-items: center; background: #fff; border-radius: 28px; padding: 36px 44px; font-size: 40px; font-weight: 700; }
.tier strong { font-family: 'Poppins'; font-weight: 600; font-size: 52px; }
.tier small { font-size: 28px; color: var(--muted); font-weight: 600; margin-left: 8px; }
.tier.best { background: var(--accent); color: #fff; }
.tier.best small { color: rgba(255,255,255,.85); }
.note { margin-top: 36px; font-size: 32px; color: var(--muted); line-height: 1.4; }
`;

const foot = (white) => `<div class="foot"><img src="${asset(white ? 'nekova-logo-white.svg' : 'nekova-logo.svg')}" alt=""><span>@nekova_ok</span></div>`;

const T = {
  cover: ({ eyebrow, title, sub, photo, fill, bg = 'panel' }) =>
    `<div class="slide ${bg}"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}<div class="card${fill ? ' fill' : ''}"><img src="${photo}" alt=""></div>${foot()}</div>`,
  text: ({ eyebrow, title, sub, bg = '' }) =>
    `<div class="slide ${bg}"><div style="flex:1;display:flex;flex-direction:column;justify-content:center">${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}<h1 style="font-size:96px">${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ''}</div>${foot(bg === 'blue')}</div>`,
  step: ({ n, title, sub }) =>
    `<div class="slide"><div style="flex:1;display:flex;flex-direction:column;justify-content:center"><div class="num">${n}</div><h1 style="margin-top:50px">${title}</h1><p class="sub">${sub}</p></div>${foot()}</div>`,
  list: ({ eyebrow, title, items, bg = '' }) =>
    `<div class="slide ${bg}"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><ul class="list">${items.map(([t, d]) => `<li><div class="tick">✓</div><div><b>${t}</b>${d ? `<span>${d}</span>` : ''}</div></li>`).join('')}</ul>${foot()}</div>`,
  square: ({ eyebrow, photo }) =>
    `<div class="slide square-slide" style="padding:0">${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}<img class="square" src="${photo}" alt="">${foot()}</div>`,
  compare: ({ eyebrow, title, rows }) =>
    `<div class="slide"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><div class="table"><div class="row head"><span></span><span>Común</span><span class="nk">Nekova</span></div>${rows.map(([t, c]) => `<div class="row"><span>${t}</span><span class="no">${c}</span><span class="yes">✓</span></div>`).join('')}</div>${foot()}</div>`,
  tiers: ({ eyebrow, title, tiers, note }) =>
    `<div class="slide panel"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><div class="tiers">${tiers.map(([q, p, best]) => `<div class="tier${best ? ' best' : ''}"><span>${q}</span><span><strong>${p}</strong><small>${q.startsWith('1 ') ? '' : 'c/u'}</small></span></div>`).join('')}</div><p class="note">${note}</p>${foot()}</div>`,
};

const SLIDES = {
  // 18 · Presentación
  '18-plantillas-1': T.cover({ eyebrow: 'Muy pronto', title: 'Plantillas Nekova Confort', sub: 'Comodidad en cada paso.', photo: img('00') }),
  '18-plantillas-2': T.list({ eyebrow: 'Lo que tienen', title: 'Pensadas para <em>tu día</em>', items: [['Espuma PU', 'Amortigua y vuelve a su forma.'], ['Talón en U', 'Contiene el talón al pisar.'], ['Transpirables', 'Capa textil con zonas perforadas.'], ['Multi-talle', 'Se recortan a tu número.']] }),
  '18-plantillas-3': T.square({ photo: img('01') }),
  '18-plantillas-4': T.text({ bg: 'blue', eyebrow: 'Muy pronto', title: 'En <em>nekova.com.ar</em>', sub: 'Tocá "Avisarme" y te escribimos apenas estén.' }),
  // 19 · Encuesta de color
  '19-negro-gris-naranja': T.cover({ eyebrow: 'Elegí uno', title: '¿Negro, gris o <em>naranja</em>?', sub: 'Contanos cuál elegirías.', photo: img('00') }),
  // 20 · Multi-talle
  '20-multitalle-1': T.text({ bg: 'soft', eyebrow: 'Multi-talle', title: '¿Cómo elijo <em>mi talle</em>?', sub: 'Dos rangos que se recortan a tu número. Deslizá 👉' }),
  '20-multitalle-2': T.square({ photo: img('10') }),
  '20-multitalle-3': T.step({ n: '💡', title: 'Probalas antes de recortar todo', sub: 'Recortá un poco, probalas en el calzado y ajustá. Si tu calzado trae plantilla, sacala primero.' }),
  // 21 · Valor: cuándo cambiarlas
  '21-cambiar-plantillas-1': T.text({ eyebrow: 'Tip', title: '3 señales de que tus plantillas <em>ya cumplieron</em>', sub: 'Deslizá 👉' }),
  '21-cambiar-plantillas-2': T.step({ n: '1', title: 'Están aplastadas', sub: 'Las apretás y no vuelven a su forma: ya no amortiguan como antes.' }),
  '21-cambiar-plantillas-3': T.step({ n: '2', title: 'Se deformaron', sub: 'Bordes doblados, el talón hundido o la tela gastada.' }),
  '21-cambiar-plantillas-4': T.step({ n: '3', title: 'El olor no se va', sub: 'Aunque las laves y las dejes secar, vuelve enseguida.' }),
  // 22 · Por dentro
  '22-por-dentro-1': T.square({ eyebrow: 'Por dentro', photo: img('06') }),
  '22-por-dentro-2': T.square({ eyebrow: 'Por dentro', photo: img('07') }),
  '22-por-dentro-3': T.square({ eyebrow: 'Por dentro', photo: img('05') }),
  // 23 · Común vs. Nekova
  '23-comun-vs-nekova-1': T.cover({ eyebrow: 'Comparación', title: 'No todas las plantillas <em>son iguales</em>', photo: img('11'), fill: true }),
  '23-comun-vs-nekova-2': T.compare({ eyebrow: 'Comparación', title: 'Común vs. <em>Nekova</em>', rows: [['Espuma que vuelve a su forma', 'a veces'], ['Talón en U', 'no'], ['Zonas perforadas', 'a veces'], ['Multi-talle recortable', 'no']] }),
  // 24 · Usos
  '24-tu-dia-1': T.cover({ eyebrow: 'Para tu día a día', title: 'Caminar, entrenar o <em>estar de pie</em>', photo: img('08'), fill: true }),
  '24-tu-dia-2': T.list({ eyebrow: '¿Dónde las usás?', title: 'Una plantilla, <em>muchos pasos</em>', items: [['Para caminar', 'Trámites, paseos, la ciudad.'], ['Para trabajar de pie', 'Locales, cocinas, depósitos.'], ['Para entrenar', 'Gimnasio, pádel, tenis.']] }),
  // 25 · Dudas
  '25-dudas-plantillas-1': T.cover({ eyebrow: 'Preguntas frecuentes', title: '3 dudas, <em>resueltas</em>', photo: img('negro') }),
  '25-dudas-plantillas-2': T.list({ eyebrow: 'Preguntas frecuentes', title: 'Lo que más <em>nos preguntan</em>', items: [['¿Cómo se limpian?', 'A mano, con agua tibia y jabón neutro. Secado a la sombra.'], ['¿Sirven para mi calzado?', 'Para zapatillas y calzado de uso diario. Si trae plantilla, sacala antes.'], ['¿Puedo devolverlas?', 'Sí, dentro de los 10 días, sin usar ni recortar.']] }),
  // 26 · Precios por cantidad + lista de espera
  '26-mas-pares': T.tiers({ eyebrow: 'Muy pronto', title: 'Más pares, <em>mejor precio</em>', tiers: [['1 par', '$17.000'], ['2 pares', '$15.000'], ['3 o más', '$12.000', true]], note: 'Combiná colores y talles. Tocá "Avisarme" en nekova.com.ar y te escribimos apenas estén.' }),
};

const only = process.argv[2];
for (const [name, body] of Object.entries(SLIDES)) {
  if (only && !name.startsWith(only)) continue;
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&family=Poppins:wght@600;700&display=block" rel="stylesheet"><style>${CSS}</style></head><body>${body}</body></html>`;
  const file = join(TMP, `${name}.html`);
  writeFileSync(file, html);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--force-device-scale-factor=1', '--window-size=1080,1350', '--virtual-time-budget=8000', `--screenshot=${join(OUT, `${name}.png`)}`, pathToFileURL(file).href], { stdio: 'ignore' });
  console.log(`${name}.png`);
}
