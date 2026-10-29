// Genera las piezas de redes que anuncian Cyber Nekova (post 1080 × 1350 e historia 1080 × 1920) en marca/instagram/cyber/.
// Uso: node scripts/build-cyber-social.mjs
import { writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'marca', 'instagram', 'cyber');
const TMP = join(tmpdir(), 'nekova-cyber-social');
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => existsSync(p));
const asset = (f) => pathToFileURL(join(ROOT, 'assets', f)).href;

const products = [
  ['product-media-cojin-ortopedico-01.jpg', 'Cojín Ergonómico en U'],
  ['product-media-almohada-01.jpg', 'Almohada Nekova Somnia'],
];

const css = (w, h, story) => `
* { box-sizing: border-box; margin: 0; }
html, body { width: ${w}px; height: ${h}px; overflow: hidden; }
body { background: #14161a; color: #fff; font-family: 'Nunito Sans', sans-serif; position: relative; }
.glow { position: absolute; border-radius: 50%; filter: blur(120px); opacity: .55; }
.top { position: relative; padding: ${story ? '210px' : '90px'} 90px 0; }
.logo { height: ${story ? 60 : 54}px; }
.kicker { margin-top: ${story ? 80 : 56}px; display: inline-flex; align-items: center; gap: 14px; background: rgba(255,255,255,.1); border: 2px solid rgba(255,255,255,.22); border-radius: 999px; padding: 12px 26px; font: 800 28px 'Nunito Sans'; letter-spacing: .14em; text-transform: uppercase; }
.kicker i { width: 14px; height: 14px; border-radius: 50%; background: #ff5a3d; box-shadow: 0 0 0 6px rgba(255,90,61,.25); }
h1 { margin-top: 22px; font: 700 ${story ? 168 : 146}px/0.92 Poppins; letter-spacing: -.045em; }
h1 .n { color: #2f5bff; display: block; }
.deal { margin-top: 34px; display: flex; align-items: center; gap: 28px; }
.badge { white-space: nowrap; flex: none; background: #c94430; border-radius: 26px; padding: 14px 30px 18px; font: 700 ${story ? 100 : 90}px/1 Poppins; letter-spacing: -.03em; transform: rotate(-3deg); box-shadow: 0 18px 40px rgba(201,68,48,.45); }
.deal p { font: 700 40px/1.2 'Nunito Sans'; }
.deal p span { display: block; font: 600 30px 'Nunito Sans'; color: rgba(255,255,255,.72); margin-top: 6px; }
.dates { margin-top: ${story ? 70 : 44}px; display: flex; gap: 18px; }
.date { flex: 1; background: rgba(255,255,255,.08); border: 2px solid rgba(255,255,255,.16); border-radius: 24px; padding: 22px 26px; }
.date small { display: block; font: 800 22px 'Nunito Sans'; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.65); }
.date b { display: block; margin-top: 6px; font: 600 44px Poppins; letter-spacing: -.02em; }
.grid { position: absolute; left: 70px; right: 70px; bottom: ${story ? 300 : 70}px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 26px; }
.card { background: #fff; border-radius: 28px; padding: 18px 16px 22px; color: #14161a; text-align: center; }
.card .img { height: ${story ? 300 : 180}px; display: flex; align-items: center; justify-content: center; background: #f3f5f9; border-radius: 18px; overflow: hidden; }
.card img { max-width: 100%; max-height: 100%; mix-blend-mode: multiply; transform: scale(1.12); }
.card b { display: block; margin-top: 16px; font: 600 28px/1.2 Poppins; letter-spacing: -.01em; }
.cta { position: absolute; left: 50%; transform: translateX(-50%); bottom: ${story ? 170 : 0}px; white-space: nowrap; font: 800 30px 'Nunito Sans'; color: rgba(255,255,255,.85); }
`;

const body = (story) => {
  const cards = products.map(([img, title]) => `<div class="card"><div class="img"><img src="${asset(img)}" alt=""></div><b>${title}</b></div>`).join('');
  return `
<div class="glow" style="width:620px;height:620px;background:#2f5bff;left:-160px;top:-180px"></div>
<div class="glow" style="width:520px;height:520px;background:#c94430;right:-200px;top:${story ? 520 : 300}px;opacity:.35"></div>
<div class="top">
  <img class="logo" src="${asset('nekova-logo-white.svg')}" alt="">
  <div><span class="kicker"><i></i>Se viene</span></div>
  <h1><span>CYBER-</span><span class="n">NEKOVA</span></h1>
  <div class="deal"><div class="badge">20% OFF</div><p>en toda la tienda<span>Ya aplicado en los precios, sin códigos</span></p></div>
  <div class="dates"><div class="date"><small>Desde el</small><b>Lunes 2/11</b></div><div class="date"><small>Hasta el</small><b>Viernes 6/11</b></div></div>
</div>
<div class="grid">${cards}</div>
${story ? '<div class="cta">Tocá el link y anotate para el aviso 👇</div>' : ''}`;
};

const pieces = [
  ['cyber-nekova-se-viene-post', 1080, 1350, false],
  ['cyber-nekova-se-viene-historia', 1080, 1920, true],
];
for (const [name, w, h, story] of pieces) {
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@600;700;800&family=Poppins:wght@600;700&display=block" rel="stylesheet"><style>${css(w, h, story)}</style></head><body>${body(story)}</body></html>`;
  const file = join(TMP, `${name}.html`);
  writeFileSync(file, html);
  const png = join(TMP, `${name}.png`);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--force-device-scale-factor=1', `--window-size=${w},${h}`, '--virtual-time-budget=8000', `--screenshot=${png}`, pathToFileURL(file).href], { stdio: 'ignore' });
  copyFileSync(png, join(OUT, `${name}.png`));
  console.log(`${name}.png`);
}
