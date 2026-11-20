// Tarjeta para el paquete: invita a dejar una reseña de la tienda en Judge.me con un QR.
// Salida en marca/tarjeta-resenas/: PDF A6 (imprenta), PDF A4 con 4 tarjetas y marcas de corte (casa), PNG y el QR en SVG.
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const URL = 'https://nekova.com.ar/pages/opina';
const ROOT = 'g:/Ryzen5/Documentos/GitHub/nekova.com.ar';
const OUT = `${ROOT}/marca/tarjeta-resenas`;
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
mkdirSync(OUT, { recursive: true });

const qrSvg = await QRCode.toString(URL, { type: 'svg', errorCorrectionLevel: 'Q', margin: 0, color: { dark: '#14161a', light: '#ffffff' } });
writeFileSync(`${OUT}/qr-resena-tienda.svg`, qrSvg);
const logo = pathToFileURL(`${ROOT}/assets/nekova-logo.svg`).href;
const mark = pathToFileURL(`${ROOT}/assets/nekova-mark.svg`).href;

const CSS = `
* { box-sizing: border-box; margin: 0; }
body { font-family: 'Nunito Sans', sans-serif; color: #14161a; }
.card { position: relative; width: 100mm; height: 140mm; background: #fff; overflow: hidden; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 9mm 8mm 7mm; }
.card::before { content: ''; position: absolute; left: 0; right: 0; top: 0; height: 2.2mm; background: #2f5bff; }
.mark { position: absolute; right: -16mm; bottom: -16mm; width: 58mm; opacity: .06; }
.logo { height: 7.5mm; }
.thanks { margin-top: 5mm; color: #2f5bff; font-weight: 800; font-size: 8.5pt; letter-spacing: .16em; text-transform: uppercase; }
h1 { margin-top: 2.5mm; font-family: Poppins; font-weight: 600; font-size: 19pt; line-height: 1.12; letter-spacing: -.02em; }
h1 em { font-style: normal; color: #2f5bff; }
p.lead { margin-top: 3mm; font-size: 9.5pt; line-height: 1.45; color: #5b6270; max-width: 78mm; }
.qrbox { margin-top: 5mm; background: #fff; border: .5mm solid #eaf0ff; border-radius: 4mm; padding: 3.5mm; box-shadow: 0 1.5mm 5mm rgba(47,91,255,.12); }
.qrbox svg { display: block; width: 32mm; height: 32mm; }
.scan { margin-top: 3.5mm; display: inline-flex; align-items: center; gap: 2mm; background: #2f5bff; color: #fff; border-radius: 99mm; padding: 1.8mm 5mm; font-weight: 800; font-size: 9.5pt; }
.url { margin-top: 2mm; font-weight: 800; font-size: 9pt; color: #14161a; letter-spacing: .02em; }
.gift { margin-top: 2.5mm; font-weight: 700; font-size: 8.5pt; color: #2f5bff; }
.foot { margin-top: auto; font-size: 7.5pt; line-height: 1.5; color: #5b6270; }
.foot b { color: #14161a; }
`;
const card = `<div class="card">
<img class="mark" src="${mark}" alt="">
<img class="logo" src="${logo}" alt="nekova">
<div class="thanks">¡Gracias por tu compra!</div>
<h1>¿Cómo fue tu experiencia con <em>Nekova</em>?</h1>
<p class="lead">Probalo unos días y contanos qué te pareció la compra, el envío y la atención. Te lleva un minuto y nos ayuda a mejorar.</p>
<div class="qrbox">${qrSvg}</div>
<div class="scan"><span style="letter-spacing:.5mm">★★★★★</span> Escaneá y contanos</div>
<div class="url">nekova.com.ar/pages/opina</div>
<div class="foot">¿Necesitás ayuda? <b>WhatsApp +54 9 11 7812-4323</b><br>nekova.com.ar · @nekova_ok</div>
</div>`;
const page = (body, size) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&family=Poppins:wght@600&display=block" rel="stylesheet"><style>@page { size: ${size}; margin: 0; } html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } ${CSS}</style></head><body>${body}</body></html>`;
const tmp = (name, html) => { const f = `${process.cwd()}/${name}.html`; writeFileSync(f, html); return pathToFileURL(f).href; };
const pdf = (src, out) => execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=8000', `--print-to-pdf=${out}`, src], { stdio: 'ignore' });

// A6 para imprenta: tarjeta de 100 × 140 mm centrada en 105 × 148 mm (margen para el corte)
pdf(tmp('a6', page(`<div style="width:105mm;height:148mm;display:grid;place-items:center">${card}</div>`, '105mm 148mm')), `${OUT}/tarjeta-resena-A6.pdf`);
// A4 con 4 tarjetas y marcas de corte
const crop = (x, y) => `<div style="position:absolute;left:${x}mm;top:${y}mm;width:0;height:0">
<i style="position:absolute;left:-4mm;top:0;width:3mm;border-top:.2mm solid #999"></i><i style="position:absolute;left:1mm;top:0;width:3mm;border-top:.2mm solid #999"></i>
<i style="position:absolute;top:-4mm;left:0;height:3mm;border-left:.2mm solid #999"></i><i style="position:absolute;top:1mm;left:0;height:3mm;border-left:.2mm solid #999"></i></div>`;
const X = [5, 105], Y = [8.5, 148.5];
let a4 = '<div style="position:relative;width:210mm;height:297mm">';
for (const y of Y) for (const x of X) a4 += `<div style="position:absolute;left:${x}mm;top:${y}mm">${card}</div>`;
for (const y of [8.5, 148.5, 288.5]) for (const x of [5, 105, 205]) a4 += crop(x, y);
a4 += '</div>';
pdf(tmp('a4', page(a4, 'A4')), `${OUT}/tarjeta-resena-4-por-A4.pdf`);
// PNG (vista previa / imprenta digital) a ~300 dpi: 100 × 140 mm = 1181 × 1654 px
const png = `${OUT}/tarjeta-resena.png`;
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=3.125', '--window-size=378,530', '--virtual-time-budget=8000', `--screenshot=${png}`, tmp('png', page(card, 'auto'))], { stdio: 'ignore' });

// Comprobación: el QR del PNG se lee y lleva al link correcto
const img = PNG.sync.read(readFileSync(png));
const code = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
console.log('QR leído:', code?.data === URL ? 'OK' : `ERROR (${code?.data})`, img.width, 'x', img.height);
