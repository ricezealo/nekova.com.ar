// Guía de talles de las plantillas (1200 × 1200, fondo blanco), igual a la de Mercado Libre:
// dos rangos y los pasos para recortarlas usando de molde la plantilla del calzado actual.
// Uso: node scripts/build-plantillas-guia-talles.mjs → assets/product-media-plantillas-10.jpg
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const TMP = join(tmpdir(), 'nekova-guia-talles');
mkdirSync(TMP, { recursive: true });
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].find((p) => existsSync(p));

// silueta de plantilla (talón abajo) y dos contornos internos punteados
const sole = (s, dash) => `<path transform="translate(${120 - 120 * s} ${330 - 330 * s}) scale(${s})" d="M120 14c58 0 92 46 92 118 0 58-22 98-30 142-8 44 14 92 14 160 0 90-34 150-76 150S44 524 44 434c0-68 20-112 12-160-8-44-28-84-28-142C28 60 62 14 120 14Z" fill="none" stroke="${dash ? '#14161a' : '#14161a'}" stroke-width="${dash ? 2.6 / s : 5 / s}" ${dash ? `stroke-dasharray="${10 / s} ${8 / s}"` : ''}/>`;
const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@600;700;800&family=Poppins:wght@600;700&display=block" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 1200px; background: #fff; font-family: 'Nunito Sans', sans-serif; color: #14161a; padding: 70px 70px 0; }
.eyebrow { display: flex; align-items: center; gap: 22px; color: #2f5bff; font-weight: 800; font-size: 26px; letter-spacing: .16em; }
.eyebrow::before { content: ''; width: 50px; height: 4px; background: currentColor; border-radius: 2px; }
h1 { font-family: Poppins; font-weight: 600; font-size: 84px; letter-spacing: -.03em; line-height: 1.1; margin-top: 18px; }
h1 em { font-style: normal; color: #2f5bff; }
.lead { font-size: 30px; color: #5b6270; margin-top: 10px; }
.ranges { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 40px; }
.range { background: #2f5bff; color: #fff; border-radius: 28px; padding: 30px 36px; }
.range small { display: block; font-weight: 800; font-size: 22px; letter-spacing: .14em; opacity: .9; }
.range b { display: block; font-family: Poppins; font-weight: 600; font-size: 70px; letter-spacing: -.03em; line-height: 1.1; margin: 6px 0 8px; }
.range span { font-weight: 700; font-size: 23px; }
.body { display: grid; grid-template-columns: 280px 1fr; gap: 50px; margin-top: 40px; align-items: center; }
.sole { background: #f3f5f9; border-radius: 36px; height: 560px; display: grid; place-items: center; position: relative; }
.steps { display: grid; gap: 26px; }
.step { display: grid; grid-template-columns: 56px 1fr; gap: 22px; align-items: start; }
.num { width: 56px; height: 56px; border-radius: 50%; background: #eaf0ff; color: #14161a; display: grid; place-items: center; font-family: Poppins; font-weight: 600; font-size: 26px; }
.step b { display: block; font-family: Poppins; font-weight: 600; font-size: 36px; letter-spacing: -.01em; line-height: 1.2; }
.step p { font-size: 25px; color: #3a404b; margin-top: 4px; line-height: 1.35; }
.note { background: #eaf0ff; border-radius: 24px; padding: 24px 30px; font-size: 25px; line-height: 1.45; font-weight: 600; }
.note strong { font-weight: 800; }
.note em { font-style: normal; color: #2f5bff; font-weight: 800; }
</style></head><body>
<div class="eyebrow">GUÍA DE TALLES</div>
<h1>Tu talle, <em>a tu medida</em></h1>
<p class="lead">Dos rangos que se recortan a tu número.</p>
<div class="ranges">
  <div class="range"><small>RANGO 1</small><b>35 al 40</b><span>Para talles 35, 36, 37, 38, 39 y 40</span></div>
  <div class="range"><small>RANGO 2</small><b>41 al 46</b><span>Para talles 41, 42, 43, 44, 45 y 46</span></div>
</div>
<div class="body">
  <div class="sole">
    <svg viewBox="0 0 240 660" width="200" height="520">${sole(1, false)}${sole(0.94, true)}${sole(0.88, true)}</svg>
    <svg viewBox="0 0 24 24" width="62" height="62" style="position:absolute;right:34px;top:30px" fill="none" stroke="#2f5bff" stroke-width="1.9" stroke-linecap="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.1 8.1 20 20M8.1 15.9 20 4"/></svg>
  </div>
  <div class="steps">
    <div class="step"><div class="num">1</div><div><b>Elegí tu rango</b><p>35 al 40 o 41 al 46, según tu número.</p></div></div>
    <div class="step"><div class="num">2</div><div><b>Usá una plantilla de referencia</b><p>Apoyá la plantilla de tu calzado actual sobre la nueva. Las medidas cambian según la marca.</p></div></div>
    <div class="step"><div class="num">3</div><div><b>Recortá por el borde</b><p>Con una tijera, seguí la forma de tu plantilla para que queden iguales.</p></div></div>
    <div class="note"><strong>Ejemplo:</strong> si calzás 42, elegí <em>41 al 46</em>, apoyá la plantilla de tu calzado actual y recortá siguiendo su borde.</div>
  </div>
</div>
</body></html>`;
const file = join(TMP, 'guia.html');
writeFileSync(file, html);
const png = join(TMP, 'guia.png');
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1200,1200', '--virtual-time-budget=8000', `--screenshot=${png}`, pathToFileURL(file).href], { stdio: 'ignore' });
const FF = process.env.FFMPEG || 'ffmpeg';
execFileSync(FF, ['-y', '-loglevel', 'error', '-i', png, '-q:v', '2', join(ROOT, 'assets', 'product-media-plantillas-10.jpg')]);
console.log('ok assets/product-media-plantillas-10.jpg');
