// Tarjeta chica (9 × 5 cm, de presentación) para abrochar en el paquete. Papel kraft + láser negro: todo en negro puro,
// sin fondos ni grises. 12 por hoja oficio (216 × 340 mm), frente y dorso en PDFs separados; la grilla es simétrica
// para que el dorso coincida al darla vuelta (por el borde largo o el corto).
// Salida en marca/tarjeta-resenas/.
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
const PW = 216, PH = 340, CW = 90, CH = 50, COLS = 2, ROWS = 6;
const MX = (PW - COLS * CW) / 2, MY = (PH - ROWS * CH) / 2; // 18 mm y 20 mm

const qrSvg = (await QRCode.toString(URL, { type: 'svg', errorCorrectionLevel: 'M', margin: 0, color: { dark: '#000000', light: '#0000' } }));
const svgInk = (file) => readFileSync(`${ROOT}/assets/${file}`, 'utf8').replace(/fill="#[0-9a-fA-F]{3,6}"/g, 'fill="#000"').replace(/<svg/, '<svg style="display:block;height:100%;width:auto"');
const logo = svgInk('nekova-logo-ink.svg');
const mark = svgInk('nekova-mark-ink.svg');

const CSS = `
* { box-sizing: border-box; margin: 0; }
html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: 'Nunito Sans', sans-serif; color: #000; }
.sheet { position: relative; width: ${PW}mm; height: ${PH}mm; }
.card { position: absolute; width: ${CW}mm; height: ${CH}mm; overflow: hidden; }
/* frente */
.front { display: grid; grid-template-columns: 1fr 27mm; gap: 3.5mm; align-items: center; padding: 4.5mm 5mm 4.5mm 5.5mm; }
.front .logo { height: 4.6mm; }
.front h1 { margin-top: 2.6mm; font-family: Poppins; font-weight: 700; font-size: 10.5pt; line-height: 1.12; letter-spacing: -.02em; }
.front p { margin-top: 1.6mm; font-size: 7pt; line-height: 1.3; font-weight: 600; }
.front .gift { margin-top: 1.8mm; display: inline-block; border: .35mm solid #000; border-radius: 1.6mm; padding: .7mm 1.8mm; font-size: 7pt; font-weight: 800; line-height: 1.25; }
.front .qr { text-align: center; }
.front .qr svg { display: block; width: 25mm; height: 25mm; margin: 0 auto; }
.front .qr span { display: block; margin-top: 1.4mm; font-size: 7pt; font-weight: 800; letter-spacing: .02em; }
.front .qr small { display: block; font-size: 7pt; font-weight: 700; }
/* dorso */
.back { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.back .mark { height: 13mm; }
.back .logo { height: 11mm; }
.back p { margin-top: 4mm; font-family: Poppins; font-weight: 600; font-size: 8.5pt; letter-spacing: -.01em; }
.back small { margin-top: 1mm; font-size: 7pt; font-weight: 700; letter-spacing: .04em; }
/* marcas de corte (solo en el frente, fuera de las tarjetas) */
.cut { position: absolute; background: #000; }
`;
const front = `<div class="card front">
<div><div class="logo">${logo}</div>
<h1>¿Cómo fue tu experiencia con Nekova?</h1>
<p>Contanos qué te pareció la compra, el envío y la atención. Podés hacerlo por WhatsApp.</p>
<div class="gift">Te regalamos un descuento para tu próxima compra</div></div>
<div class="qr">${qrSvg}<span>Escaneá y contanos</span><small>nekova.com.ar<br>/pages/opina</small></div>
</div>`;
const back = `<div class="card back"><div class="logo">${logo}</div><p>Tu bienestar, en los detalles.</p><small>nekova.com.ar · @nekova_ok</small></div>`;

const sheet = (card, marks, bg = '') => {
  let h = `<div class="sheet" style="${bg}">`;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) h += card.replace('class="card', `style="left:${MX + c * CW}mm;top:${MY + r * CH}mm" class="card`);
  if (marks) {
    const L = 4, G = 1.5; // largo y separación de las marcas
    for (let c = 0; c <= COLS; c++) { const x = MX + c * CW; h += `<i class="cut" style="left:${x - .1}mm;top:${MY - G - L}mm;width:.2mm;height:${L}mm"></i><i class="cut" style="left:${x - .1}mm;top:${PH - MY + G}mm;width:.2mm;height:${L}mm"></i>`; }
    for (let r = 0; r <= ROWS; r++) { const y = MY + r * CH; h += `<i class="cut" style="top:${y - .1}mm;left:${MX - G - L}mm;height:.2mm;width:${L}mm"></i><i class="cut" style="top:${y - .1}mm;left:${PW - MX + G}mm;height:.2mm;width:${L}mm"></i>`; }
  }
  return h + '</div>';
};
const page = (body, size) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@600;700;800&family=Poppins:wght@600;700&display=block" rel="stylesheet"><style>@page { size: ${size}; margin: 0; } ${CSS}</style></head><body>${body}</body></html>`;
const tmp = (name, html) => { const f = `${process.cwd()}/${name}.html`; writeFileSync(f, html); return pathToFileURL(f).href; };
const pdf = (src, out) => execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=8000', `--print-to-pdf=${out}`, src], { stdio: 'ignore' });
pdf(tmp('chica-frente', page(sheet(front, true), `${PW}mm ${PH}mm`)), `${OUT}/tarjeta-chica-frente-oficio.pdf`);
pdf(tmp('chica-dorso', page(sheet(back, false), `${PW}mm ${PH}mm`)), `${OUT}/tarjeta-chica-dorso-oficio.pdf`);

// Vista previa sobre color kraft (solo para ver cómo queda; no se imprime)
const KRAFT = 'background:#c8a27a';
const shot = (name, html) => { const out = `${OUT}/${name}.png`; execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=4', '--window-size=341,190', '--virtual-time-budget=8000', `--screenshot=${out}`, tmp(name, html)], { stdio: 'ignore' }); return out; };
const one = (card) => page(`<div style="position:relative;width:90mm;height:50mm;${KRAFT}">${card.replace('class="card', 'style="left:0;top:0" class="card')}</div>`, 'auto');
const pf = shot('tarjeta-chica-frente-vista', one(front));
shot('tarjeta-chica-dorso-vista', one(back));
const img = PNG.sync.read(readFileSync(pf));
const code = jsQR(new Uint8ClampedArray(img.data), img.width, img.height);
console.log('QR sobre kraft:', code?.data === URL ? 'OK' : `ERROR (${code?.data})`, img.width, 'x', img.height);
