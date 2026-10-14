import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Builds the Nekova "Ranuras" logo kit as standalone SVG files: node scripts/build-logo-kit.mjs [outDir]
// Also writes the social media pieces to marca/redes/ (SVG; the PNGs to upload are exported at the same size).
const out = process.argv[2] || 'assets';
const ACCENT = '#2F5BFF';
const INK = '#14161A';
const WHITE = '#FFFFFF';

// Isotipo: soft square with two U-shaped slots (transparent cut-outs via evenodd).
const MARK = 'M21 7H43A14 14 0 0 1 57 21V43A14 14 0 0 1 43 57H21A14 14 0 0 1 7 43V21A14 14 0 0 1 21 7Z'
  + 'M21.5 57V25A3.5 3.5 0 0 1 28.5 25V57Z'
  + 'M35.5 7V39A3.5 3.5 0 0 0 42.5 39V7Z';

// Logotipo "nekova": monoline lowercase strokes (baseline y=50, x-height y=28).
const x0 = 86;
const e = x0 + 38;
const o = x0 + 90;
const a = x0 + 146;
const WORD = [
  `M${x0} 28V50M${x0} 39a10 10 0 0 1 20 0V50`,
  `M${e - 11} 39H${e + 11}A11 11 0 1 0 ${e + 7.8} 46.8`,
  `M${x0 + 56} 16V50M${x0 + 72} 28L${x0 + 59} 40.5L${x0 + 72} 50`,
  `M${o + 11} 39a11 11 0 1 1 -22 0a11 11 0 1 1 22 0`,
  `M${x0 + 108} 28L${x0 + 118} 50L${x0 + 128} 28`,
  `M${a + 11} 39a11 11 0 1 1 -22 0a11 11 0 1 1 22 0M${a + 11} 28V50`,
].join('');

const mark = (fill) => `<path fill="${fill}" fill-rule="evenodd" d="${MARK}"/>`;
const word = (color) => `<path fill="none" stroke="${color}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" d="${WORD}"/>`;
const svg = (viewBox, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;

const LOGO_BOX = '7 7 240 50';
const MARK_BOX = '7 7 50 50';
const files = {
  'nekova-logo.svg': svg(LOGO_BOX, 'Nekova', mark(ACCENT) + word(INK)),
  'nekova-logo-white.svg': svg(LOGO_BOX, 'Nekova', mark(WHITE) + word(WHITE)),
  'nekova-logo-ink.svg': svg(LOGO_BOX, 'Nekova', mark(INK) + word(INK)),
  'nekova-mark.svg': svg(MARK_BOX, 'Nekova', mark(ACCENT)),
  'nekova-mark-white.svg': svg(MARK_BOX, 'Nekova', mark(WHITE)),
  'nekova-mark-ink.svg': svg(MARK_BOX, 'Nekova', mark(INK)),
};
for (const [name, content] of Object.entries(files)) {
  writeFileSync(join(out, name), content);
  console.log(name);
}

// Social media: one profile picture for every network (white isotipo on accent, at half the width so it
// survives the circular crop). The Facebook cover uses fonts and photos, so it lives in marca/redes/portada-facebook.html.
const social = 'marca/redes';
const place = (x, y, scale, body) => `<g transform="translate(${x} ${y}) scale(${scale}) translate(-7 -7)">${body}</g>`;
const canvas = (width, height, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${ACCENT}"/>${body}</svg>\n`;
const socialFiles = {
  'nekova-perfil.svg': canvas(1080, 1080, place(270, 270, 10.8, mark(WHITE))),
};
mkdirSync(social, { recursive: true });
for (const [name, content] of Object.entries(socialFiles)) {
  writeFileSync(join(social, name), content);
  console.log(join(social, name));
}
