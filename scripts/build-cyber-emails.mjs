// Genera las imágenes de cabecera de los emails de Cyber Nekova (1200 × 1500) en marca/email/cyber/.
// Uso: node scripts/build-cyber-emails.mjs
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'marca', 'email', 'cyber');
const TMP = join(tmpdir(), 'nekova-cyber');
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find((p) => existsSync(p));
const asset = (f) => pathToFileURL(join(ROOT, 'assets', f)).href;

const products = [
  ['product-media-cojin-ortopedico-01.jpg', 'Cojín Ergonómico en U', '$79.000', '$63.200'],
  ['product-media-almohada-01.jpg', 'Almohada Nekova Somnia', '$82.000', '$65.600'],
];

const css = `
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 1500px; overflow: hidden; }
body { background: #14161a; color: #fff; font-family: 'Nunito Sans', sans-serif; position: relative; }
.glow { position: absolute; border-radius: 50%; filter: blur(120px); opacity: .55; }
.top { position: relative; padding: 80px 80px 0; }
.logo { height: 52px; }
.kicker { margin-top: 56px; display: inline-flex; align-items: center; gap: 14px; background: rgba(255,255,255,.1); border: 2px solid rgba(255,255,255,.22); border-radius: 999px; padding: 12px 26px; font: 800 26px 'Nunito Sans'; letter-spacing: .14em; text-transform: uppercase; }
.kicker i { width: 14px; height: 14px; border-radius: 50%; background: #ff5a3d; box-shadow: 0 0 0 6px rgba(255,90,61,.25); }
h1 { margin-top: 26px; font: 700 168px/0.92 Poppins; letter-spacing: -.045em; }
h1 .c { color: #fff; }
h1 .n { color: #2f5bff; display: block; }
.deal { margin-top: 30px; display: flex; align-items: center; gap: 28px; }
.badge { white-space: nowrap; flex: none; background: #c94430; border-radius: 26px; padding: 14px 30px 18px; font: 700 96px/1 Poppins; letter-spacing: -.03em; transform: rotate(-3deg); box-shadow: 0 18px 40px rgba(201,68,48,.45); }
.deal p { font: 700 40px/1.2 'Nunito Sans'; }
.deal p span { display: block; font: 600 30px 'Nunito Sans'; color: rgba(255,255,255,.72); margin-top: 6px; }
.grid { position: absolute; left: 60px; right: 60px; bottom: 70px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; }
.card { background: #fff; border-radius: 28px; padding: 18px 16px 22px; color: #14161a; text-align: center; }
.card .img { height: 330px; display: flex; align-items: center; justify-content: center; background: #f3f5f9; border-radius: 18px; overflow: hidden; }
.card img { max-width: 100%; max-height: 100%; mix-blend-mode: multiply; transform: scale(1.12); }
.card b { display: block; margin-top: 20px; font: 600 32px/1.2 Poppins; letter-spacing: -.01em; }
.card s { display: inline-block; margin: 10px 14px 0 0; color: #5b6270; font: 600 30px 'Nunito Sans'; }
.card strong { display: inline-block; color: #c94430; font: 700 54px Poppins; letter-spacing: -.02em; }
`;

const variants = {
  'cyber-nekova-1-arranco': { kicker: 'Desde hoy', line: 'en toda la tienda', sub: 'Ya aplicado en los precios · Hasta el viernes 6/11' },
  'cyber-nekova-2-extendido': { kicker: '¡Lo extendimos!', line: 'hasta el viernes 6/11', sub: 'Seguís teniendo el descuento ya aplicado' },
  'cyber-nekova-3-ultimo-dia': { kicker: 'Último día', line: 'termina hoy a las 23:59hs', sub: 'Después vuelven los precios de siempre' },
};

for (const [name, v] of Object.entries(variants)) {
  const cards = products.map(([img, title, was, now]) => `<div class="card"><div class="img"><img src="${asset(img)}" alt=""></div><b>${title}</b><s>${was}</s><strong>${now}</strong></div>`).join('');
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@600;700;800&family=Poppins:wght@600;700&display=block" rel="stylesheet"><style>${css}</style></head><body>
<div class="glow" style="width:620px;height:620px;background:#2f5bff;left:-160px;top:-180px"></div>
<div class="glow" style="width:520px;height:520px;background:#c94430;right:-180px;top:260px;opacity:.35"></div>
<div class="top">
  <img class="logo" src="${asset('nekova-logo-white.svg')}" alt="">
  <div><span class="kicker"><i></i>${v.kicker}</span></div>
  <h1><span class="c">CYBER-</span><span class="n">NEKOVA</span></h1>
  <div class="deal"><div class="badge">20% OFF</div><p>${v.line}<span>${v.sub}</span></p></div>
</div>
<div class="grid">${cards}</div>
</body></html>`;
  const file = join(TMP, `${name}.html`);
  writeFileSync(file, html);
  const png = join(TMP, `${name}.png`);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--force-device-scale-factor=1', '--window-size=1200,1500', '--virtual-time-budget=8000', `--screenshot=${png}`, pathToFileURL(file).href], { stdio: 'ignore' });
  execFileSync('powershell', ['-NoProfile', '-Command', `Copy-Item -LiteralPath '${png}' -Destination '${join(OUT, name + '.png')}' -Force`]);
  console.log(`${name}.png`);
}
