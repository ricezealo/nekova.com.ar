// Arma reels verticales (1080 × 1920) a partir de las grabaciones de marca/instagram/Reel humano/
// (no están en el repo: pesan 830 MB). Salida en marca/instagram/reels-joaco-edicion/.
// Uso: FFMPEG=ruta/ffmpeg.exe node scripts/build-reel-humano.mjs 01
// transcripcion.json (en la carpeta de salida) tiene las palabras con sus tiempos (Whisper). Los bordes no son exactos:
// conviene cortar mirando la energía del audio y volver a transcribir el video final. Ver REELS para definir un video nuevo.
import { writeFileSync, mkdirSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const RAW = join(ROOT, 'marca', 'instagram', 'Reel humano');
const OUT = join(ROOT, 'marca', 'instagram', 'reels-joaco-edicion');
const FF = process.env.FFMPEG || 'ffmpeg';
const WORDS = JSON.parse(readFileSync(process.env.WORDS || join(OUT, 'transcripcion.json'), 'utf8'));
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((p) => existsSync(p));
const FPS = 30;
mkdirSync(OUT, { recursive: true });

const ff = (args) => execFileSync(FF, ['-y', '-loglevel', 'error', ...args], { stdio: ['ignore', 'ignore', 'inherit'], maxBuffer: 1 << 28 });
const url = (p) => pathToFileURL(p).href;
const asset = (f) => join(ROOT, 'assets', f);
const V = {
  producto: join(RAW, 'VID_20261105_213706275~2.mp4'),
  trabajando: join(RAW, 'VID_20261105_214519099~2.mp4'),
  camara1: join(RAW, 'VID_20261105_222712248.mp4'),
  camara2: join(RAW, 'VID_20261105_222950315~2.mp4'),
  taburete: join(RAW, 'VID_20261105_223519636~2.mp4'),
};
const OLD = (n) => join(process.env.NEKOVA_VIDEOS || 'G:/Ryzen5/Descargas/Photos-1-001', `20261028_${n}.mp4`);
const TM = 'zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p';
const A = { problema: join(RAW, 'jueves, 10 h 54 min p.m..m4a'), solucion: join(RAW, 'jueves, 10 h 59 min p.m. (1).m4a') };
// Clave de cada fuente de voz en la transcripción.
const KEY = { [V.camara1]: 'a2', [V.camara2]: 'a3', [A.problema]: 'a0', [A.solucion]: 'a1' };

// Movimientos de cámara (zoompan por cuadro, n = cuadros del tramo).
const MOVE = {
  push: (n, r = 0.0007) => `1.04+${r}*on+if(gt(on,${n - 6}),pow(on-${n - 6},2)*0.012,0)`, // acercamiento lento y golpe de zoom al salir
  pull: () => '1.05+0.28*exp(-on/7)', // revelación: arranca cerca y se abre
  still: (n) => `1.03+0.0004*on+if(gt(on,${n - 6}),pow(on-${n - 6},2)*0.012,0)`,
};

const REELS = {
  '01': {
    name: '01-que-preferis',
    // Cada tramo: video {src, at}, voz {src, from, to} (si no se indica, usa el audio del propio video), movimiento.
    segments: [
      { video: V.camara1, at: 1.85, voice: { src: V.camara1, from: 1.85, to: 8.55 }, move: 'push' },
      { video: V.camara1, at: 9.7, voice: { src: V.camara1, from: 9.7, to: 12.3 }, move: 'pull', whoosh: true },
      { video: V.trabajando, at: 12.0, voice: { src: A.problema, from: 0.4, to: 3.5 }, move: 'push', whoosh: true },
      { video: V.trabajando, at: 21.0, voice: { src: A.problema, from: 3.6, to: 6.1 }, move: 'push', whoosh: true },
      { video: V.producto, at: 3.5, voice: { src: A.problema, from: 6.1, to: 9.15 }, move: 'push', whoosh: true },
      { video: V.taburete, at: 2.0, voice: { src: A.solucion, from: 0.55, to: 2.72 }, move: 'still', whoosh: true, flash: true },
      { video: V.trabajando, at: 56.0, voice: { src: A.solucion, from: 7.7, to: 8.68 }, move: 'push', whoosh: true },
      { video: V.producto, at: 35.2, voice: { src: A.solucion, from: 10.06, to: 11.95 }, move: 'push', whoosh: true },
    ],
    // Grupos de palabras de los subtítulos, en orden; deben coincidir con las palabras dentro de los tramos.
    captions: [
      '¿Qué preferís?', 'Gastarte cientos y cientos', 'de miles de pesos', 'en una silla como esta,', 'o por muchísimo menos,',
      'convertir cualquiera en una.',
      'La mayoría piensa que', 'necesita una silla nueva,', 'pero muchas veces', 'el problema no es la silla,', 'es pasar horas sentados', 'sin el soporte adecuado.',
      'Por eso, este nuevo', 'producto de Nekova',
      'Más comodidad,',
      'y sin gastar una fortuna.',
    ],
    end: { title: 'Cojín Ergonómico<br>en U', photo: 'product-media-cojin-ortopedico-01.jpg', dur: 3, theme: 'dark' },
    cover: { at: 10.4, video: V.camara1, title: '¿Qué <em>preferís</em>?' },
  },
  '02': {
    name: '02-el-problema-no-es-la-silla',
    segments: [
      { video: V.trabajando, at: 0.5, voice: { src: A.problema, from: 0.4, to: 3.5 }, move: 'push' },
      { video: V.trabajando, at: 39.3, voice: { src: A.problema, from: 3.6, to: 6.1 }, move: 'push', whoosh: true },
      { video: V.producto, at: 22.2, voice: { src: A.problema, from: 6.1, to: 9.15 }, move: 'push', whoosh: true },
      { video: V.trabajando, at: 42.5, voice: { src: A.solucion, from: 7.7, to: 8.68 }, hold: 0.9, move: 'still', whoosh: true },
      { video: V.trabajando, at: 46.0, voice: { src: A.solucion, from: 10.06, to: 11.95 }, move: 'push', whoosh: true },
    ],
    captions: [
      'La mayoría piensa que', 'necesita una silla nueva,', 'pero muchas veces', 'el problema no es la silla,', 'es pasar horas sentados', 'sin el soporte adecuado.',
      'Más comodidad,',
      'y sin gastar una fortuna.',
    ],
    end: { title: 'Cojín Ergonómico<br>en U', photo: 'product-media-cojin-ortopedico-01.jpg', dur: 3, theme: 'dark' },
    cover: { at: 40.2, video: V.trabajando, title: 'El problema no es <em>la silla</em>' },
  },
  '03': {
    name: '03-que-tiene-adentro',
    segments: [
      { video: V.producto, at: 1.0, dur: 2.4, text: '¿Qué tiene <b>adentro</b>?', move: 'push' },
      { video: V.producto, at: 6.5, dur: 2.0, text: 'Malla <b>transpirable</b>', move: 'push', whoosh: true },
      { video: V.producto, at: 11.5, dur: 2.2, text: 'Ranura <b>en U</b>', move: 'push', whoosh: true },
      { video: V.producto, at: 18.0, dur: 2.2, text: 'Funda con <b>cierre</b>', move: 'push', whoosh: true },
      { video: V.producto, at: 21.6, dur: 3.0, text: '<b>Espuma</b> viscoelástica', textHigh: true, move: 'pull', whoosh: true, flash: true },
      { video: V.producto, at: 30.0, dur: 1.8, text: 'Laterales <b>elevados</b>', move: 'push', whoosh: true },
      { video: V.producto, at: 35.6, dur: 2.6, text: 'Para <b>tu silla</b>', move: 'still', whoosh: true },
    ],
    captions: [],
    end: { title: 'Cojín Ergonómico<br>en U', photo: 'product-media-cojin-ortopedico-01.jpg', dur: 3, theme: 'dark' },
    cover: { at: 23.5, video: V.producto, title: '¿Qué tiene <em>adentro</em>?' },
  },
  '04': {
    name: '04-pasas-horas-sentado',
    segments: [
      { video: V.trabajando, at: 56.0, voice: { src: A.problema, from: 6.19, to: 9.15, wordsFrom: 6.4 }, move: 'push' },
      { video: V.trabajando, at: 5.0, dur: 0.75, text: '<b>Trabajando</b>', focus: { x: 0.95, y: 0.5, z: 2 }, move: 'still', whoosh: true },
      { video: V.trabajando, at: 8.0, dur: 0.75, text: '<b>Estudiando</b>', focus: { x: 0.98, y: 0.3, z: 2.2 }, move: 'still', whoosh: true },
      { video: V.trabajando, at: 10.0, dur: 0.75, text: '<b>Jugando</b>', focus: { x: 0.95, y: 0.72, z: 2.4 }, move: 'still', whoosh: true },
      { video: V.trabajando, at: 63.0, dur: 0.85, text: '<b>Home office</b>', move: 'still', whoosh: true },
      { video: V.taburete, at: 2.0, voice: { src: A.solucion, from: 0.55, to: 2.72 }, move: 'still', whoosh: true, flash: true },
      { video: V.producto, at: 38.2, voice: { src: A.solucion, from: 7.7, to: 8.68 }, move: 'still', whoosh: true },
      { video: V.camara2, at: 8.4, voice: { src: A.solucion, from: 10.06, to: 11.95 }, move: 'push', whoosh: true },
    ],
    captions: ['Pasar horas sentados', 'sin el soporte adecuado.', 'Por eso, este nuevo', 'producto de Nekova', 'Más comodidad,', 'y sin gastar una fortuna.'],
    end: { title: 'Cojín Ergonómico<br>en U', photo: 'product-media-cojin-ortopedico-01.jpg', dur: 3, theme: 'dark' },
    cover: { at: 60.0, video: V.trabajando, title: '¿Pasás <em>horas sentado</em>?' },
  },
  '05': {
    name: '05-silla-cara-vs-cojin',
    segments: [
      { video: V.camara2, at: 0.95, voice: { src: V.camara2, from: 0.95, to: 1.75 }, move: 'push' },
      { video: V.camara2, at: 2.45, voice: { src: V.camara2, from: 2.45, to: 4.9 }, move: 'push', whoosh: true },
      { video: V.trabajando, at: 39.3, voice: { src: V.camara2, from: 4.9, to: 6.18 }, focus: { x: 0.1, y: 0.75, z: 1.25 }, move: 'push', whoosh: true, badge: [{ text: 'Opción 1: silla nueva', y: 300 }] },
      { video: V.camara2, at: 6.28, voice: { src: V.camara2, from: 6.28, to: 7.62 }, move: 'push', whoosh: true },
      { video: V.taburete, at: 2.0, voice: { src: V.camara2, from: 8.5, to: 10.0 }, move: 'still', whoosh: true, flash: true, badge: [{ text: 'Opción 2: cojín', y: 300, warm: true }] },
      { dur: 2.4, move: 'still', text: '¿Cuál <b>elegís</b>?', textHigh: true, whoosh: true, flash: true, split: [{ video: V.trabajando, at: 39.6, w: 1500, y: 0.72 }, { video: V.taburete, at: 3.0, y: 0.72 }], badge: [{ text: 'Silla nueva', y: 300 }, { text: 'Cojín', y: 990, warm: true }] },
    ],
    captions: ['¿Qué preferís?', 'Gastarte cientos y cientos', 'de miles de pesos', 'en una silla como esta,', 'o por muchísimo menos,', 'convertir cualquiera en una.'],
    end: { title: 'Cojín Ergonómico<br>en U', photo: 'product-media-cojin-ortopedico-01.jpg', dur: 3, theme: 'dark' },
    cover: { at: 4.4, video: V.taburete, title: '¿Silla nueva<br>o <em>cojín</em>?' },
  },
  '06': {
    name: '06-del-paquete-a-tu-silla',
    segments: [
      { video: OLD('153220'), hdr: true, natural: true, at: 5.2, dur: 2.4, text: 'Llegó <b>el cojín</b>', focus: { x: 0.95, y: 0.5, z: 1.5 }, move: 'push' },
      { video: OLD('153220'), hdr: true, natural: true, at: 14.0, dur: 3.0, text: 'Lo sacás <b>de la bolsa</b>', focus: { x: 0.95, y: 0.5, z: 1.5 }, move: 'still', whoosh: true },
      { video: OLD('153220'), hdr: true, natural: true, at: 24.6, dur: 1.8, text: 'Y toma <b>su forma</b>', focus: { x: 0.95, y: 0.5, z: 1.25 }, move: 'push', whoosh: true, flash: true },
      { video: OLD('153624'), hdr: true, at: 4.6, dur: 1.5, text: 'Malla <b>transpirable</b>', move: 'push', whoosh: true },
      { video: OLD('154107'), hdr: true, at: 5.6, dur: 1.9, text: 'Funda <b>con cierre</b>', move: 'push', whoosh: true },
      { video: OLD('154152'), hdr: true, at: 25.2, dur: 1.5, text: 'Espuma <b>viscoelástica</b>', move: 'still', whoosh: true },
      { video: OLD('154152'), hdr: true, at: 36.6, dur: 1.9, text: 'Se adapta <b>a tu forma</b>', move: 'push', whoosh: true },
      { video: OLD('155819'), hdr: true, at: 3.4, dur: 1.7, text: 'A <b>tu silla</b>', move: 'still', whoosh: true },
      { video: OLD('160119'), hdr: true, at: 10.5, dur: 2.2, text: 'Listo. <b>A trabajar.</b>', move: 'push', whoosh: true },
    ],
    captions: [],
    end: { title: 'Cojín Ergonómico<br>en U', photo: 'product-media-cojin-ortopedico-01.jpg', dur: 3, theme: 'dark' },
    cover: { at: 15.5, video: OLD('153220'), hdr: true, title: 'Del paquete<br>a <em>tu silla</em>' },
  },
  '07': {
    name: '07-tu-silla-antes-y-despues',
    segments: [
      { video: OLD('155819'), hdr: true, at: 0, dur: 1.1, text: '<b>Antes</b>', move: 'push' },
      { video: OLD('155819'), hdr: true, at: 1.1, dur: 2.0, text: 'Sumale <b>el cojín</b>', move: 'push', whoosh: true },
      { video: OLD('155819'), hdr: true, at: 4.9, dur: 1.4, text: '<b>Después</b>', move: 'still', whoosh: true, flash: true },
      { video: OLD('160119'), hdr: true, at: 4.2, dur: 2.2, text: 'Misma <b>silla.</b>', move: 'push', whoosh: true },
      { video: OLD('160119'), hdr: true, at: 11.0, dur: 2.4, text: 'Más <b>cómoda.</b>', move: 'push', whoosh: true },
    ],
    captions: [],
    end: { title: 'Cojín Ergonómico<br>en U', photo: 'product-media-cojin-ortopedico-01.jpg', dur: 3, theme: 'dark' },
    cover: { at: 5.2, video: OLD('155819'), hdr: true, title: 'Tu silla,<br><em>antes y después</em>' },
  },
};

const reel = REELS[process.argv[2] || '01'];
if (!reel) throw new Error('Reel no definido');
const TMP = join(tmpdir(), `nekova-reel-${reel.name}`);
rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

// ---------- Video de cada tramo ----------
let t = 0;
const naturalClips = [], voiceClips = [], whooshes = [], timed = [], parts = [], textEvents = [];
reel.segments.forEach((seg, i) => {
  const voiceDur = seg.voice ? seg.voice.to - seg.voice.from : 0;
  const dur = seg.voice ? voiceDur + (seg.hold || 0) : seg.dur;
  const n = Math.round(dur * FPS);
  const k = seg.focus?.z || 1;
  const z = `(${seg.move === 'pull' ? MOVE.pull() : MOVE[seg.move](n)})*${k}`;
  const fx = seg.focus?.x ?? 0.5, fy = seg.focus?.y ?? 0.5;
  const fade = seg.flash ? `,fade=in:st=0:d=0.14:c=white` : '';
  const out = join(TMP, `seg${i}.mp4`);
  if (seg.split) {
    const half = (o, label) => `[${label}:v]fps=${FPS},scale=${o.w || 1080}:-2,eq=saturation=1.06:contrast=1.04,crop=1080:958:0:'(ih-958)*${o.y}'[h${label}]`;
    ff(['-ss', String(seg.split[0].at), '-t', String(dur + 0.2), '-i', seg.split[0].video, '-ss', String(seg.split[1].at), '-t', String(dur + 0.2), '-i', seg.split[1].video, '-filter_complex',
      `${half(seg.split[0], 0)};${half(seg.split[1], 1)};[h0]pad=1080:962:0:0:white[top];[top][h1]vstack,format=yuv420p[v]`,
      '-map', '[v]', '-frames:v', String(n), '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', out]);
  } else ff(['-ss', String(seg.at), '-t', String(dur + 0.2), '-i', seg.video, '-vf',
    `fps=${FPS},${seg.hdr ? TM + ',' : ''}scale=${seg.focus ? '2160:3840' : '1620:2880'}:force_original_aspect_ratio=increase,crop=${seg.focus ? '2160:3840' : '1620:2880'},${seg.hdr ? '' : 'eq=saturation=1.06:contrast=1.04,'}zoompan=z='${z}':x='(iw-iw/zoom)*${fx}':y='(ih-ih/zoom)*${fy}':d=1:s=1080x1920:fps=${FPS}${fade},format=yuv420p`,
    '-frames:v', String(n), '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', out]);
  parts.push(out);
  const dt = n / FPS;
  if (seg.voice) voiceClips.push({ ...seg.voice, start: t, dur: Math.min(voiceDur, dt) });
  if (seg.text) textEvents.push({ text: seg.text, high: seg.textHigh, start: t + 0.01, end: t + dt - 0.02 });
  if (seg.whoosh) whooshes.push(t);
  if (seg.natural) naturalClips.push({ src: seg.video, from: seg.at, start: t, dur: dt });
  // Palabras de este tramo, en tiempo de salida.
  for (const w of seg.voice ? WORDS[KEY[seg.voice.src]].chunks : []) {
    const [a, b] = w.timestamp;
    if (a >= (seg.voice.wordsFrom ?? seg.voice.from - 0.02) && a < seg.voice.to - 0.02) timed.push({ text: w.text.trim(), start: t + a - seg.voice.from, end: t + Math.min(b ?? a + 0.3, seg.voice.to) - seg.voice.from });
  }
  t += dt;
});
const bodyDur = t;
console.log(`cuerpo: ${bodyDur.toFixed(2)} s, ${timed.length} palabras`);

// ---------- Placa final ----------
const FONTS = '<link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@700;800&family=Poppins:wght@600;700&display=block" rel="stylesheet">';
const shot = (name, w, h, html, transparent = true) => {
  const f = join(TMP, `${name}.html`);
  writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>*{box-sizing:border-box;margin:0}html,body{width:${w}px;height:${h}px;overflow:hidden;background:${transparent ? 'transparent' : '#fff'}}</style></head><body>${html}</body></html>`);
  const png = join(TMP, `${name}.png`);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', ...(transparent ? ['--default-background-color=00000000'] : []), `--window-size=${w},${h}`, '--virtual-time-budget=5000', `--screenshot=${png}`, url(f)], { stdio: 'ignore' });
  return png;
};
const E = reel.end;
// Recorta el producto: el fondo blanco conectado a los bordes pasa a transparente.
const cutout = (src, out) => {
  const w = 1200, h = 1200;
  const raw = execFileSync(FF, ['-loglevel', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1 << 26 });
  const bg = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) stack.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) stack.push(y * w, y * w + w - 1);
  while (stack.length) {
    const p = stack.pop();
    if (bg[p] || Math.min(raw[p * 3], raw[p * 3 + 1], raw[p * 3 + 2]) <= 232) continue;
    bg[p] = 1;
    const x = p % w;
    if (x > 0) stack.push(p - 1);
    if (x < w - 1) stack.push(p + 1);
    if (p >= w) stack.push(p - w);
    if (p < w * (h - 1)) stack.push(p + w);
  }
  const rgba = Buffer.alloc(w * h * 4);
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let p = 0; p < w * h; p++) {
    const x = p % w, y = (p - x) / w;
    let a = bg[p] ? 0 : 255;
    if (a && [p - 1, p + 1, p - w, p + w].some((q) => q >= 0 && q < w * h && bg[q])) a = 110; // borde suavizado
    rgba[p * 4] = raw[p * 3]; rgba[p * 4 + 1] = raw[p * 3 + 1]; rgba[p * 4 + 2] = raw[p * 3 + 2]; rgba[p * 4 + 3] = a;
    if (a) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  }
  const rawFile = join(TMP, 'cut.rgba');
  writeFileSync(rawFile, rgba);
  ff(['-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', w + 'x' + h, '-i', rawFile, '-vf', 'crop=' + ((x1 - x0 + 1) & ~1) + ':' + ((y1 - y0 + 1) & ~1) + ':' + x0 + ':' + y0, '-frames:v', '1', out]);
};
// Cierre sin precio (cambia con las promos): azul de marca con brillo, producto recortado que entra con rebote,
// la web como llamado principal y las redes de apoyo. Por capas, para animarlas.
const ICON = {
  instagram: '<svg viewBox="0 0 24 24" width="52" height="52"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.2" fill="#fff"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" width="52" height="52"><path d="M16.8 3.5c.3 2.1 1.5 3.8 3.7 4.5v3.4a9 9 0 0 1-3.7-1.2v5.5a6.3 6.3 0 1 1-6.3-6.3c.4 0 .8 0 1.2.1v3.6a2.8 2.8 0 1 0 1.6 2.6V3.5h3.5Z" fill="#fff"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" width="52" height="52"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4Z" fill="#fff"/></svg>',
};
const THEMES = {
  blue: { bg: 'linear-gradient(160deg,#1f45d9 0%,#2f5bff 55%,#1a36b8 100%)', glow: 'radial-gradient(closest-side,rgba(255,255,255,.75),rgba(143,168,255,.35) 55%,rgba(47,91,255,0))' },
  dark: { bg: 'linear-gradient(165deg,#14161a 0%,#141c3f 55%,#14161a 100%)', glow: 'radial-gradient(closest-side,rgba(47,91,255,.95),rgba(47,91,255,.35) 55%,rgba(47,91,255,0))' },
};
const theme = THEMES[E.theme || 'blue'];
const mark = readFileSync(asset('nekova-mark-white.svg'), 'utf8').replace('<svg', '<svg width="1500" height="1500"');
const endBg = shot('endbg', 1080, 1920, `<div style="position:absolute;inset:0;background:${theme.bg}"></div>
<div style="position:absolute;left:-260px;top:-140px;width:1500px;height:1500px;opacity:.09">${mark}</div>
<div style="position:absolute;left:50%;top:790px;width:1300px;height:900px;transform:translate(-50%,-50%);border-radius:50%;background:${theme.glow};filter:blur(60px)"></div>
<img src="${url(asset('nekova-logo-white.svg'))}" style="position:absolute;left:50%;transform:translateX(-50%);top:235px;height:78px">
<div style="position:absolute;left:50px;right:50px;top:360px;text-align:center;font:700 92px/1.05 Poppins;letter-spacing:-.035em;color:#fff">${E.title}</div>`, false);
const endCta = shot('endcta', 1080, 1920, `<div style="position:absolute;left:90px;right:90px;top:1110px;height:136px;background:#fff;border-radius:999px;display:flex;align-items:center;justify-content:center;font:700 74px Poppins;letter-spacing:-.025em;color:#1f45d9;box-shadow:0 20px 50px rgba(0,0,0,.35)">nekova.com.ar</div>
<div style="position:absolute;left:0;right:0;top:1272px;display:flex;justify-content:center"><div style="display:grid;grid-template-columns:52px auto;align-items:center;gap:4px 16px;font:800 44px/1.2 'Nunito Sans';color:#fff">${ICON.facebook}<span>Nekova</span>${ICON.instagram}<span>@nekova_ok</span>${ICON.tiktok}<span>@nekova_ok</span></div></div>`);
const cutPng = join(TMP, 'producto.png');
cutout(asset(E.photo), cutPng);
const shadowed = shot('prodshadow', 1080, 700, `<img src="${url(cutPng)}" style="position:absolute;left:40px;top:30px;width:1000px;filter:drop-shadow(0 34px 44px rgba(0,0,0,.45))">`);
const endMp4 = join(TMP, 'end.mp4');
ff(['-loop', '1', '-t', String(E.dur), '-i', endBg, '-loop', '1', '-t', String(E.dur), '-i', shadowed, '-loop', '1', '-t', String(E.dur), '-i', endCta, '-filter_complex',
  `[0:v]fps=${FPS},scale=1080:1920,setsar=1[bg];[1:v]fps=${FPS},format=rgba,scale=w='trunc(1080*(1-0.3*exp(-6*t)*cos(11*t))/2)*2':h=-2:eval=frame[p];[2:v]fps=${FPS},format=rgba,fade=in:st=0.4:d=0.25:alpha=1[c];[bg][p]overlay=x='(W-w)/2':y='860-h/2':eval=frame[a];[a][c]overlay=x=0:y='max(0,50*(1-(t-0.4)/0.25))':eval=frame,format=yuv420p[v]`,
  '-map', '[v]', '-t', String(E.dur), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', endMp4]);
parts.push(endMp4);
const total = bodyDur + E.dur;

reel.segments.forEach((seg, i) => {
  if (!seg.badge) return;
  const png = shot(`badge${i}`, 1080, 1920, seg.badge.map((b) => `<div style="position:absolute;left:50%;transform:translateX(-50%);top:${b.y}px;white-space:nowrap;background:${b.warm ? '#c94430' : '#fff'};color:${b.warm ? '#fff' : '#14161a'};border-radius:18px;padding:14px 30px;font:700 50px Poppins;letter-spacing:-.02em;box-shadow:0 10px 30px rgba(0,0,0,.35)">${b.text}</div>`).join(''));
  const out = join(TMP, `seg${i}b.mp4`);
  ff(['-i', parts[i], '-i', png, '-filter_complex', '[0:v][1:v]overlay,format=yuv420p', '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', out]);
  parts[i] = out;
});
const list = join(TMP, 'list.txt');
writeFileSync(list, parts.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
const silent = join(TMP, 'silent.mp4');
ff(['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent]);

// ---------- Subtítulos palabra por palabra ----------
const CAP_W = 1080, CAP_H = 950, CAP_Y = 620, BOX_H = 420, BOX_LOW = 530, BOX_HIGH = 60;
const capPng = (group, active, id) => shot(`cap${id}`, CAP_W, CAP_H, `<div style="position:absolute;left:70px;right:70px;top:${BOX_LOW}px;height:${BOX_H}px;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;gap:6px 18px;font:700 76px/1.18 Poppins;letter-spacing:-.02em;color:#fff;text-align:center;paint-order:stroke fill;-webkit-text-stroke:10px #14161a">
${group.map((w, i) => `<span style="${i === active ? 'background:#2f5bff;-webkit-text-stroke:0;border-radius:18px;padding:0 16px;' : ''}">${w}</span>`).join('')}</div>`);
const textPng = (text, id, high) => shot(`txt${id}`, CAP_W, CAP_H, `<div style="position:absolute;left:60px;right:60px;top:${high ? BOX_HIGH : BOX_LOW}px;height:${BOX_H}px;display:flex;align-items:center;justify-content:center;text-align:center;font:700 92px/1.15 Poppins;letter-spacing:-.025em;color:#fff;paint-order:stroke fill;-webkit-text-stroke:12px #14161a">
<span>${text.replace(/<b>/g, '<b style="font-weight:700;background:#2f5bff;-webkit-text-stroke:0;border-radius:20px;padding:0 20px;-webkit-box-decoration-break:clone;box-decoration-break:clone">')}</span></div>`);
const blank = shot('blank', CAP_W, CAP_H, '');
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[^a-zñ]/g, '').replace(/necova/, 'nekova');
const groups = reel.captions.map((g) => g.split(' '));
let wi = 0;
const events = [];
groups.forEach((g) => {
  g.forEach((word, i) => {
    let tw = timed[wi];
    // Tolera diferencias de la transcripción (por ejemplo, NECOVA → Nekova, comartir → convertir).
    if (!tw) throw new Error(`Falta la palabra "${word}" en los tramos`);
    if (norm(tw.text) !== norm(word) && !['convertir', 'Nekova'].includes(word)) console.warn(`Palabra distinta: "${tw.text}" vs "${word}"`);
    events.push({ group: g, i, start: tw.start, end: tw.end });
    wi++;
  });
});
if (wi !== timed.length) console.warn(`Sobran palabras: ${timed.slice(wi).map((x) => x.text).join(' ')}`);
textEvents.forEach((e, i) => events.push({ ...e, png: textPng(e.text, i, e.high) }));
events.sort((a, b) => a.start - b.start);
let prev = 0, idx = 0;
const conc = ['ffconcat version 1.0'];
const add = (png, dur) => { if (dur > 0.001) { conc.push(`file '${png.replace(/\\/g, '/')}'`, `duration ${dur.toFixed(3)}`); } };
events.forEach((e, k) => {
  if (e.start > prev + 0.02) add(blank, e.start - prev);
  const next = events[k + 1];
  // Se mantiene hasta la palabra siguiente si la pausa es corta.
  const until = next && next.start - e.end < 0.45 ? next.start : e.end + 0.15;
  const png = e.png || capPng(e.group, e.i, idx++);
  add(png, until - Math.max(e.start, prev));
  prev = until;
});
add(blank, total - prev);
conc.push(`file '${blank.replace(/\\/g, '/')}'`);
const capList = join(TMP, 'caps.ffconcat');
writeFileSync(capList, conc.join('\n'));
const capsMov = join(TMP, 'caps.mov');
ff(['-f', 'concat', '-safe', '0', '-i', capList, '-vf', `fps=${FPS},format=rgba`, '-c:v', 'png', capsMov]);

// ---------- Audio ----------
const hasVoice = voiceClips.length > 0;
const merged = [];
for (const c of voiceClips) {
  const last = merged[merged.length - 1];
  if (last && last.src === c.src && Math.abs(last.from + last.dur - c.from) < 0.03 && Math.abs(last.start + last.dur - c.start) < 0.08) last.dur = c.from + c.dur - last.from;
  else merged.push({ ...c });
}
const voices = merged.map((c, i) => {
  const out = join(TMP, `v${i}.wav`);
  ff(['-i', c.src, '-vn', '-af', `atrim=${c.from}:${c.from + c.dur},asetpts=PTS-STARTPTS,highpass=f=80,loudnorm=I=-16:TP=-2:LRA=9,afade=t=in:d=0.008,afade=t=out:st=${Math.max(c.dur - 0.05, 0)}:d=0.05,aresample=44100,aformat=channel_layouts=stereo`, out]);
  return { file: out, start: c.start };
});
const voiceInputs = voices.flatMap((v) => ['-i', v.file]);
const delays = voices.map((v, i) => `[${i}:a]adelay=${Math.round(v.start * 1000)}|${Math.round(v.start * 1000)}[v${i}]`).join(';');
const voiceMix = join(TMP, 'voice.wav');
if (hasVoice) ff([...voiceInputs, '-filter_complex', `${delays};${voices.map((_, i) => `[v${i}]`).join('')}amix=inputs=${voices.length}:normalize=0:duration=longest,apad=whole_dur=${total}[a]`, '-map', '[a]', voiceMix]);

// Golpes de transición (ruido filtrado) y una base musical sintetizada, original y sin licencias de terceros.
const whooshFile = join(TMP, 'whoosh.wav');
ff(['-f', 'lavfi', '-t', '0.3', '-i', 'anoisesrc=c=pink:a=0.6:r=44100', '-af', 'highpass=f=700,lowpass=f=6000,afade=t=in:d=0.08,afade=t=out:st=0.1:d=0.2,aformat=channel_layouts=stereo', whooshFile]);
const wMix = join(TMP, 'whooshes.wav');
ff([...whooshes.flatMap(() => ['-i', whooshFile]), '-filter_complex', `${whooshes.map((w, i) => `[${i}:a]adelay=${Math.max(Math.round((w - 0.12) * 1000), 0)}|${Math.max(Math.round((w - 0.12) * 1000), 0)}[w${i}]`).join(';')};${whooshes.map((_, i) => `[w${i}]`).join('')}amix=inputs=${whooshes.length}:normalize=0,apad=whole_dur=${total},volume=0.32[a]`, '-map', '[a]', wMix]);
const music = join(TMP, 'music.wav');
const chord = (f1, f2, f3) => `(sin(2*PI*${f1}*t)+0.7*sin(2*PI*${f2}*t)+0.5*sin(2*PI*${f3}*t))`;
const pad = `if(lt(mod(t,8),4),${chord(110, 164.81, 220)},${chord(87.31, 130.81, 174.61)})*(0.7+0.3*sin(2*PI*0.25*t))*0.09`;
const kick = 'sin(2*PI*58*t)*exp(-9*mod(t,0.6))*0.22';
// Sin voz, la música lleva el ritmo: se suma un arpegio suave.
const pluck = hasVoice ? '' : '+sin(2*PI*(220+110*mod(floor(t/0.3),3))*t)*exp(-10*mod(t,0.3))*0.14';
ff(['-f', 'lavfi', '-i', `aevalsrc='${pad}+${kick}${pluck}':d=${total}:s=44100`, '-af', `lowpass=f=${hasVoice ? 1100 : 2600},afade=t=in:d=0.6,afade=t=out:st=${Math.max(total - 1.2, 0)}:d=1.2,aformat=channel_layouts=stereo`, music]);

// Sonido real de las tomas: limpio, más fuerte (son tomas muy bajas) y sin voces (elegir tramos sin voz).
let naturalMix = null;
if (naturalClips.length) {
  const clips = naturalClips.map((c, i) => {
    const out = join(TMP, `n${i}.wav`);
    ff(['-i', c.src, '-vn', '-af', `atrim=${c.from}:${c.from + c.dur},asetpts=PTS-STARTPTS,highpass=f=150,afftdn=nr=14:nf=-48,volume=16dB,alimiter=limit=0.7,afade=t=in:d=0.04,afade=t=out:st=${Math.max(c.dur - 0.08, 0)}:d=0.08,aresample=44100,aformat=channel_layouts=stereo`, out]);
    return out;
  });
  naturalMix = join(TMP, 'natural.wav');
  ff([...clips.flatMap((c) => ['-i', c]), '-filter_complex', `${naturalClips.map((c, i) => `[${i}:a]adelay=${Math.round(c.start * 1000)}|${Math.round(c.start * 1000)}[n${i}]`).join(';')};${clips.map((_, i) => `[n${i}]`).join('')}amix=inputs=${clips.length}:normalize=0,apad=whole_dur=${total}[a]`, '-map', '[a]', naturalMix]);
}
const musicOnly = ['-i', music, '-i', wMix, '-filter_complex', '[0:a]volume=1.3[m];[m][1:a]amix=inputs=2:normalize=0,alimiter=limit=0.89[a]', '-map', '[a]'];
const mixes = !hasVoice ? (naturalMix ? {
  '': ['-i', naturalMix, '-i', music, '-i', wMix, '-filter_complex', '[1:a]volume=0.55[m];[0:a][m][2:a]amix=inputs=3:normalize=0,alimiter=limit=0.89[a]', '-map', '[a]'],
  '-solo-musica': musicOnly,
} : { '': musicOnly }) : {
  '': ['-i', voiceMix, '-i', wMix, '-i', music, '-filter_complex', '[2:a]volume=0.5[m];[m][0:a]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=300[md];[0:a][1:a][md]amix=inputs=3:normalize=0,alimiter=limit=0.89[a]', '-map', '[a]'],
  '-solo-voz': ['-i', voiceMix, '-i', wMix, '-filter_complex', '[0:a][1:a]amix=inputs=2:normalize=0,alimiter=limit=0.89[a]', '-map', '[a]'],
};
const logo = join(TMP, 'logo.png');
shot('logo', 1080, 1920, `<img src="${url(asset('nekova-logo-white.svg'))}" style="position:absolute;left:90px;top:230px;height:60px;filter:drop-shadow(0 3px 10px rgba(0,0,0,.55))">`);

// ---------- Video final ----------
const master = join(TMP, 'master.mp4');
ff(['-i', silent, '-i', capsMov, '-loop', '1', '-t', '3', '-i', logo, '-filter_complex', `[0:v][1:v]overlay=0:${CAP_Y}:eof_action=pass:enable='lt(t,${bodyDur.toFixed(2)})'[a];[a][2:v]overlay=enable='lt(t,3)':eof_action=pass,format=yuv420p[v]`, '-map', '[v]', '-t', String(total), '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', master]);
for (const [suffix, args] of Object.entries(mixes)) {
  const wav = join(TMP, `mix${suffix}.wav`);
  ff([...args, wav]);
  const final = join(OUT, `${reel.name}${suffix}.mp4`);
  ff(['-i', master, '-i', wav, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-ar', '44100', '-shortest', '-movflags', '+faststart', final]);
  console.log(final);
}

// ---------- Portada ----------
const c = reel.cover;
const coverTitle = shot('covertxt', 1080, 1920, `<img src="${url(asset('nekova-logo-white.svg'))}" style="position:absolute;left:90px;top:230px;height:60px;filter:drop-shadow(0 3px 10px rgba(0,0,0,.55))"><div style="position:absolute;left:70px;right:70px;top:340px;text-align:center;font:700 130px/1.05 Poppins;letter-spacing:-.03em;color:#fff;paint-order:stroke fill;-webkit-text-stroke:14px #14161a">${c.title.replace('<em>', '<em style="font-style:normal;color:#8fa8ff">')}</div>`);
ff(['-ss', String(c.at), '-i', c.video, '-i', coverTitle, '-filter_complex', `[0:v]${c.hdr ? TM + ',' : ''}scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920${c.hdr ? '' : ',eq=saturation=1.06:contrast=1.04'}[b];[b][1:v]overlay`, '-frames:v', '1', '-q:v', '2', join(OUT, `${reel.name}-portada.jpg`)]);
console.log(`total ${total.toFixed(2)} s`);
