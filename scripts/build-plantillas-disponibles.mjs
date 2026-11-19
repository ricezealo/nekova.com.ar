// Piezas de "ya disponibles" de las plantillas (sin precios): carrusel 4:5, historias 9:16, anuncios de Meta
// (4:5 y 9:16) y 3 reels mudos 9:16 con placa final. Salida en marca/instagram/plantillas-disponibles/.
// Uso: FFMPEG=ruta/ffmpeg.exe node scripts/build-plantillas-disponibles.mjs [solo-imagenes]
// Renderiza cada placa como HTML con Chrome sin ventana (Poppins + Nunito Sans desde Google Fonts).
import { writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'marca', 'instagram', 'plantillas-disponibles');
const TMP = join(tmpdir(), 'nekova-plantillas-disponibles');
const FF = process.env.FFMPEG || 'ffmpeg';
const FPS = 30;
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => existsSync(p));
const ff = (args) => execFileSync(FF, ['-y', '-loglevel', 'error', ...args], { stdio: ['ignore', 'ignore', 'inherit'] });
const asset = (f) => pathToFileURL(join(ROOT, 'assets', f)).href;
const img = (slug) => asset(`product-media-plantillas-${slug}.jpg`);

const CSS = `
:root { --accent: #2f5bff; --ink: #14161a; --muted: #5b6270; --panel: #f3f5f9; --soft: #eaf0ff; }
* { box-sizing: border-box; margin: 0; }
body { font-family: 'Nunito Sans', sans-serif; color: var(--ink); background: #fff; overflow: hidden; }
.slide { position: relative; display: flex; flex-direction: column; }
.panel { background: var(--panel); }
.soft { background: var(--soft); }
.blue { background: var(--accent); color: #fff; }
.dark { background: linear-gradient(165deg, #14161a 0%, #141c3f 55%, #14161a 100%); color: #fff; }
.eyebrow { display: flex; align-items: center; gap: 20px; color: var(--accent); font-weight: 800; font-size: 30px; letter-spacing: .14em; text-transform: uppercase; }
.eyebrow::before { content: ''; width: 46px; height: 4px; background: currentColor; border-radius: 2px; }
.blue .eyebrow, .dark .eyebrow { color: #fff; }
h1 { font-family: 'Poppins', sans-serif; font-weight: 600; letter-spacing: -.02em; line-height: 1.08; font-size: 84px; margin-top: 26px; }
h1 em { font-style: normal; color: var(--accent); }
.blue h1 em { color: #fff; text-decoration: underline; text-decoration-thickness: 6px; text-underline-offset: 12px; }
.dark h1 em { color: #8fa8ff; }
.sub { font-size: 40px; color: var(--muted); line-height: 1.4; margin-top: 24px; }
.blue .sub, .dark .sub { color: rgba(255,255,255,.88); }
.card { flex: 1; min-height: 0; margin-top: 50px; background: #fff; border-radius: 40px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.card img { max-width: 92%; max-height: 92%; object-fit: contain; }
.card.full img { max-width: 100%; max-height: 100%; }
.foot { margin-top: 44px; display: flex; align-items: center; justify-content: space-between; }
.foot img { height: 46px; }
.foot span { font-weight: 700; font-size: 26px; color: var(--muted); }
.blue .foot span, .dark .foot span { color: rgba(255,255,255,.85); }
.cta { align-self: flex-start; margin-top: 36px; background: var(--accent); color: #fff; border-radius: 999px; padding: 22px 44px; font-family: 'Poppins'; font-weight: 600; font-size: 38px; letter-spacing: -.01em; }
.blue .cta { background: #fff; color: var(--accent); }
.checks { list-style: none; padding: 0; margin-top: 34px; display: grid; gap: 18px; }
.checks li { display: flex; gap: 18px; align-items: center; font-size: 36px; font-weight: 700; }
.checks li::before { content: '✓'; flex: none; width: 52px; height: 52px; border-radius: 50%; background: var(--soft); color: var(--accent); display: grid; place-items: center; font-family: 'Poppins'; font-size: 28px; }
.list { list-style: none; padding: 0; margin-top: 60px; display: grid; gap: 34px; }
.list li { display: grid; grid-template-columns: 64px 1fr; gap: 26px; align-items: start; }
.list li b { display: block; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 44px; letter-spacing: -.01em; }
.list li span { color: var(--muted); font-size: 34px; line-height: 1.35; }
.tick { width: 64px; height: 64px; border-radius: 50%; background: var(--soft); color: var(--accent); display: grid; place-items: center; font-family: 'Poppins'; font-weight: 700; font-size: 32px; }
.pill { align-self: center; background: #fff; color: #1f45d9; border-radius: 999px; padding: 26px 70px; font-family: 'Poppins'; font-weight: 700; font-size: 64px; letter-spacing: -.025em; box-shadow: 0 20px 50px rgba(0,0,0,.35); }
`;
const foot = (white) => `<div class="foot"><img src="${asset(white ? 'nekova-logo-white.svg' : 'nekova-logo.svg')}" alt=""><span>@nekova_ok</span></div>`;
const head = ({ eyebrow, title, sub }) => `${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}${title ? `<h1>${title}</h1>` : ''}${sub ? `<p class="sub">${sub}</p>` : ''}`;
const isDark = (bg) => bg === 'blue' || bg === 'dark';

// 4:5 (1080 × 1350). Feed, carrusel y anuncios de feed.
const feed = ({ bg = 'panel', photo, full, checks, cta, ...h }) =>
  `<div class="slide ${bg}" style="width:1080px;height:1350px;padding:100px">${head(h)}${checks ? `<ul class="checks">${checks.map((c) => `<li>${c}</li>`).join('')}</ul>` : ''}${photo ? `<div class="card${full ? ' full' : ''}"><img src="${photo}" alt=""></div>` : '<div style="flex:1"></div>'}${cta ? `<div class="cta">${cta}</div>` : ''}${foot(isDark(bg))}</div>`;
const feedList = ({ bg = '', items, ...h }) =>
  `<div class="slide ${bg}" style="width:1080px;height:1350px;padding:100px">${head(h)}<ul class="list">${items.map(([t, d]) => `<li><div class="tick">✓</div><div><b>${t}</b><span>${d}</span></div></li>`).join('')}</ul><div style="flex:1"></div>${foot()}</div>`;
const feedText = ({ bg = 'blue', cta, ...h }) =>
  `<div class="slide ${bg}" style="width:1080px;height:1350px;padding:100px"><div style="flex:1;display:flex;flex-direction:column;justify-content:center">${head(h).replace('<h1>', '<h1 style="font-size:96px">')}${cta ? `<div class="cta">${cta}</div>` : ''}</div>${foot(isDark(bg))}</div>`;
// 9:16 (1080 × 1920) con márgenes seguros de historias y reels: 250 px libres arriba y 340 abajo.
const vert = ({ bg = 'panel', photo, full, checks, cta, ...h }) =>
  `<div class="slide ${bg}" style="width:1080px;height:1920px;padding:250px 90px 340px">${head(h)}${checks ? `<ul class="checks">${checks.map((c) => `<li>${c}</li>`).join('')}</ul>` : ''}${photo ? `<div class="card${full ? ' full' : ''}"><img src="${photo}" alt=""></div>` : '<div style="flex:1"></div>'}${cta ? `<div class="cta">${cta}</div>` : ''}${foot(isDark(bg))}</div>`;
const vertText = ({ bg = 'blue', pill, ...h }) =>
  `<div class="slide ${bg}" style="width:1080px;height:1920px;padding:250px 90px 340px"><div style="flex:1;display:flex;flex-direction:column;justify-content:center">${head(h).replace('<h1>', '<h1 style="font-size:100px">')}${pill ? `<div class="pill" style="margin-top:80px">${pill}</div>` : ''}</div>${foot(isDark(bg))}</div>`;
// Placa final de los reels (mismo diseño oscuro que la del almohadón).
const ICON = {
  instagram: '<svg viewBox="0 0 24 24" width="52" height="52"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.2" fill="#fff"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" width="52" height="52"><path d="M16.8 3.5c.3 2.1 1.5 3.8 3.7 4.5v3.4a9 9 0 0 1-3.7-1.2v5.5a6.3 6.3 0 1 1-6.3-6.3c.4 0 .8 0 1.2.1v3.6a2.8 2.8 0 1 0 1.6 2.6V3.5h3.5Z" fill="#fff"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" width="52" height="52"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4Z" fill="#fff"/></svg>',
};
const endCard = () => `<div class="slide dark" style="width:1080px;height:1920px;align-items:center;padding-top:235px">
<img src="${asset('nekova-logo-white.svg')}" style="height:78px">
<div style="margin-top:50px;text-align:center;font:700 84px/1.05 Poppins;letter-spacing:-.035em">Plantillas<br>Nekova Confort</div>
<div style="margin-top:60px;width:760px;height:760px;background:#fff;border-radius:48px;display:flex;align-items:center;justify-content:center;box-shadow:0 30px 60px rgba(0,0,0,.45)"><img src="${img('00')}" style="max-width:94%;max-height:94%"></div>
<div class="pill" style="margin-top:70px">nekova.com.ar</div>
<div style="margin-top:40px;display:grid;grid-template-columns:52px auto;align-items:center;gap:4px 16px;font:800 44px/1.2 'Nunito Sans'">${ICON.facebook}<span>Nekova</span>${ICON.instagram}<span>@nekova_ok</span>${ICON.tiktok}<span>@nekova_ok</span></div></div>`;
// Marco del reel 3: textos arriba y abajo, hueco de 1080 × 1080 para el video en y = 470.
const videoFrame = () => `<div class="slide soft" style="width:1080px;height:1920px;padding:250px 90px 0">${head({ eyebrow: 'Ya disponibles', title: 'Miralas <em>de cerca</em>' }).replace('<h1>', '<h1 style="font-size:76px;margin-top:14px">')}
<div style="position:absolute;left:0;top:470px;width:1080px;height:1080px;background:#000"></div>
<div style="position:absolute;left:90px;right:90px;top:1590px">${foot()}</div></div>`;

const shot = (name, w, h, body, dir = OUT) => {
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&family=Poppins:wght@600;700&display=block" rel="stylesheet"><style>${CSS}</style></head><body style="width:${w}px;height:${h}px">${body}</body></html>`;
  const file = join(TMP, `${name}.html`);
  writeFileSync(file, html);
  const png = join(dir, `${name}.png`);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--force-device-scale-factor=1', `--window-size=${w},${h}`, '--virtual-time-budget=8000', `--screenshot=${png}`, pathToFileURL(file).href], { stdio: 'ignore' });
  console.log(png.replace(ROOT, '.'));
  return png;
};

// ---------- Carrusel (feed, 4:5) ----------
const CARRUSEL = {
  'carrusel-1': feed({ eyebrow: 'Ya disponibles', title: 'Plantillas <em>Nekova Confort</em>', sub: 'Comodidad en cada paso. Deslizá 👉', photo: img('00') }),
  'carrusel-2': feed({ bg: 'soft', photo: img('01'), full: true }),
  'carrusel-3': feedList({ eyebrow: 'Lo que tienen', title: 'Pensadas para <em>tu día</em>', items: [['Espuma que amortigua', 'Y vuelve a su forma después de cada paso.'], ['Talón en U', 'Contiene el talón al pisar.'], ['Transpirables', 'Capa textil con zonas perforadas.'], ['Multi-talle', 'Dos rangos que se recortan a tu número.']] }),
  'carrusel-4': feed({ bg: 'soft', photo: img('10'), full: true }),
  'carrusel-5': feedText({ eyebrow: 'Ya disponibles', title: 'Elegí las tuyas en <em>nekova.com.ar</em>', sub: 'Combiná colores y talles en el mismo pedido.', cta: 'Link en la bio' }),
};
// ---------- Historias (9:16) ----------
const HISTORIAS = {
  'historia-1-llegaron': vert({ eyebrow: 'Novedad', title: '¡Ya llegaron las <em>plantillas</em>!', sub: 'Plantillas Nekova Confort', photo: img('00') }),
  'historia-2-colores': vert({ bg: 'soft', eyebrow: 'Tres colores', title: '¿Con cuál te <em>quedás</em>?', sub: 'Respondé con 🖤, 🩶 o 🧡', photo: img('01'), full: true }),
  'historia-3-talle': vert({ eyebrow: 'Multi-talle', title: 'Recortalas a <em>tu número</em>', photo: img('10'), full: true }),
  'historia-4-link': vertText({ eyebrow: 'Ya disponibles', title: 'Elegí las tuyas', sub: 'Combiná colores y talles en el mismo pedido.', pill: 'nekova.com.ar' }),
};
// ---------- Anuncios de Meta (sin precios): 3 ideas, cada una en 4:5 y 9:16 ----------
const AD_IDEAS = {
  'anuncio-1-cada-paso': { eyebrow: 'Ya disponibles', title: 'Comodidad en <em>cada paso</em>', checks: ['Espuma que amortigua', 'Talón en U', 'Transpirables'], photo: img('00'), cta: 'Comprá en nekova.com.ar' },
  'anuncio-2-colores': { bg: 'soft', eyebrow: 'Plantillas Nekova Confort', title: 'Combiná colores <em>y talles</em>', sub: 'Negro, gris o naranja. Armá tu pack.', photo: img('01'), full: true, cta: 'Elegí las tuyas' },
  'anuncio-3-talle': { eyebrow: 'Multi-talle', title: 'Una plantilla, <em>tu número</em>', sub: 'Dos rangos que se recortan a tu medida.', photo: img('10'), full: true, cta: 'Comprá en nekova.com.ar' },
};
const ANUNCIOS = {};
for (const [name, idea] of Object.entries(AD_IDEAS)) {
  ANUNCIOS[`${name}-4x5`] = feed(idea);
  ANUNCIOS[`${name}-9x16`] = vert(idea);
}

for (const [name, body] of Object.entries(CARRUSEL)) shot(name, 1080, 1350, body);
for (const [name, body] of Object.entries(HISTORIAS)) shot(name, 1080, 1920, body);
for (const [name, body] of Object.entries(ANUNCIOS)) shot(name, 1080, body.includes('height:1920px') ? 1920 : 1350, body);
if (process.argv[2] === 'solo-imagenes') process.exit(0);

// ---------- Reels (9:16, mudos: el audio se elige en Instagram) ----------
// Cada escena es una placa con un acercamiento lento; entre escenas, un fundido corto.
const clip = (png, dur, out) => {
  const n = Math.round(dur * FPS);
  ff(['-i', png, '-f', 'lavfi', '-t', String(dur), '-i', 'anullsrc=r=48000:cl=stereo', '-filter_complex',
    `[0:v]scale=2160:3840,zoompan=z='1+0.05*on/${n}':d=${n}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=${FPS},fade=t=in:st=0:d=0.18,fade=t=out:st=${(dur - 0.18).toFixed(2)}:d=0.18,format=yuv420p[v]`,
    '-map', '[v]', '-map', '1:a', '-t', String(dur), '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-c:a', 'aac', '-b:a', '128k', out]);
  return out;
};
const join_ = (parts, out) => {
  const list = join(TMP, 'list.txt');
  writeFileSync(list, parts.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
  ff(['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', out]);
  console.log(out.replace(ROOT, '.'));
};
const end = clip(shot('end', 1080, 1920, endCard(), TMP), 3.2, join(TMP, 'end.mp4'));
const REELS = {
  'reel-1-ya-llegaron': [
    [vert({ eyebrow: 'Ya disponibles', title: 'Llegaron las <em>plantillas</em> Nekova Confort', photo: img('00') }), 2.6],
    [vert({ eyebrow: '3 colores', title: 'Negro', photo: img('negro') }), 1.3],
    [vert({ eyebrow: '3 colores', title: 'Gris', photo: img('gris') }), 1.3],
    [vert({ eyebrow: '3 colores', title: '<em>Naranja</em>', photo: img('naranja') }), 1.3],
    [vert({ bg: 'soft', eyebrow: 'Multi-talle', title: 'Recortalas a <em>tu número</em>', photo: img('10'), full: true }), 2.6],
    [vert({ bg: 'blue', eyebrow: 'Armá tu pack', title: 'Combiná colores <em>y talles</em>', photo: img('01'), full: true }), 2.4],
  ],
  'reel-2-por-dentro': [
    [vert({ eyebrow: 'Plantillas Nekova Confort', title: '¿Qué tienen <em>adentro</em>?', photo: img('06'), full: true }), 2.8],
    [vert({ eyebrow: 'Diseño', title: 'Talón <em>en U</em>', photo: img('07'), full: true }), 2.6],
    [vert({ eyebrow: 'Espuma', title: 'Amortiguan y <em>vuelven a su forma</em>', photo: img('05'), full: true }), 2.8],
    [vert({ bg: 'blue', eyebrow: 'Ya disponibles', title: 'En <em>nekova.com.ar</em>', photo: img('00') }), 2.2],
  ],
};
for (const [name, scenes] of Object.entries(REELS)) {
  const parts = scenes.map(([body, dur], i) => clip(shot(`${name}-${i}`, 1080, 1920, body, TMP), dur, join(TMP, `${name}-${i}.mp4`)));
  join_([...parts, end], join(OUT, `${name}.mp4`));
  shot(`${name}-portada`, 1080, 1920, scenes[0][0]);
}
// Reel 3: los primeros 13 s del video de producto (con sus placas en español) dentro de un marco 9:16.
{
  const frame = shot('reel-3-marco', 1080, 1920, videoFrame(), TMP);
  const body = join(TMP, 'reel-3-body.mp4');
  ff(['-loop', '1', '-i', frame, '-ss', '0', '-t', '13', '-i', join(ROOT, 'assets', 'plantillas.mp4'), '-f', 'lavfi', '-t', '13', '-i', 'anullsrc=r=48000:cl=stereo', '-filter_complex',
    `[1:v]scale=1080:1080,setsar=1[v1];[0:v][v1]overlay=0:470:shortest=1,fps=${FPS},fade=t=out:st=12.8:d=0.2,format=yuv420p[v]`,
    '-map', '[v]', '-map', '2:a', '-t', '13', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-c:a', 'aac', '-b:a', '128k', body]);
  join_([body, end], join(OUT, 'reel-3-de-cerca.mp4'));
  ff(['-ss', '1', '-i', body, '-frames:v', '1', join(OUT, 'reel-3-de-cerca-portada.png')]);
}
rmSync(TMP, { recursive: true, force: true });
