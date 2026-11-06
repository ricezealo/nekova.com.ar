// Arma reels verticales (1080 × 1920) a partir de las grabaciones de marca/instagram/Reel humano/
// (no están en el repo: pesan 830 MB). Salida en marca/instagram/reels-humano/.
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
const OUT = join(ROOT, 'marca', 'instagram', 'reels-humano');
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
    end: { title: 'Cojín Ergonómico<br>en U', photo: 'product-media-cojin-ortopedico-01.jpg', dur: 3 },
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
};

const reel = REELS[process.argv[2] || '01'];
if (!reel) throw new Error('Reel no definido');
const TMP = join(tmpdir(), `nekova-reel-${reel.name}`);
rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

// ---------- Video de cada tramo ----------
let t = 0;
const voiceClips = [], whooshes = [], timed = [], parts = [];
reel.segments.forEach((seg, i) => {
  const voiceDur = seg.voice.to - seg.voice.from;
  const dur = voiceDur + (seg.hold || 0);
  const n = Math.round(dur * FPS);
  const z = seg.move === 'pull' ? MOVE.pull() : MOVE[seg.move](n);
  const fade = seg.flash ? `,fade=in:st=0:d=0.14:c=white` : '';
  const out = join(TMP, `seg${i}.mp4`);
  ff(['-ss', String(seg.at), '-t', String(dur + 0.2), '-i', seg.video, '-vf',
    `fps=${FPS},scale=1620:2880,eq=saturation=1.06:contrast=1.04,zoompan=z='${z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps=${FPS}${fade},format=yuv420p`,
    '-frames:v', String(n), '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', out]);
  parts.push(out);
  const dt = n / FPS;
  voiceClips.push({ ...seg.voice, start: t, dur: Math.min(voiceDur, dt) });
  if (seg.whoosh) whooshes.push(t);
  // Palabras de este tramo, en tiempo de salida.
  for (const w of WORDS[KEY[seg.voice.src]].chunks) {
    const [a, b] = w.timestamp;
    if (a >= seg.voice.from - 0.02 && a < seg.voice.to - 0.02) timed.push({ text: w.text.trim(), start: t + a - seg.voice.from, end: t + Math.min(b ?? a + 0.3, seg.voice.to) - seg.voice.from });
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
const endCta = shot('endcta', 1080, 1920, `<div style="position:absolute;left:90px;right:90px;top:1180px;height:140px;background:#fff;border-radius:999px;display:flex;align-items:center;justify-content:center;font:700 74px Poppins;letter-spacing:-.025em;color:#1f45d9;box-shadow:0 20px 50px rgba(0,0,0,.35)">nekova.com.ar</div>
<div style="position:absolute;left:0;right:0;top:1356px;display:flex;align-items:center;justify-content:center;gap:16px;font:800 46px 'Nunito Sans';color:#fff">${ICON.instagram}${ICON.tiktok}<span>@nekova_ok</span><span style="width:30px"></span>${ICON.facebook}<span>Nekova</span></div>`);
const cutPng = join(TMP, 'producto.png');
cutout(asset(E.photo), cutPng);
const shadowed = shot('prodshadow', 1080, 700, `<img src="${url(cutPng)}" style="position:absolute;left:40px;top:30px;width:1000px;filter:drop-shadow(0 34px 44px rgba(0,0,0,.45))">`);
const endMp4 = join(TMP, 'end.mp4');
ff(['-loop', '1', '-t', String(E.dur), '-i', endBg, '-loop', '1', '-t', String(E.dur), '-i', shadowed, '-loop', '1', '-t', String(E.dur), '-i', endCta, '-filter_complex',
  `[0:v]fps=${FPS},scale=1080:1920,setsar=1[bg];[1:v]fps=${FPS},format=rgba,scale=w='trunc(1080*(1-0.3*exp(-6*t)*cos(11*t))/2)*2':h=-2:eval=frame[p];[2:v]fps=${FPS},format=rgba,fade=in:st=0.4:d=0.25:alpha=1[c];[bg][p]overlay=x='(W-w)/2':y='920-h/2':eval=frame[a];[a][c]overlay=x=0:y='max(0,50*(1-(t-0.4)/0.25))':eval=frame,format=yuv420p[v]`,
  '-map', '[v]', '-t', String(E.dur), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', endMp4]);
parts.push(endMp4);
const total = bodyDur + E.dur;

const list = join(TMP, 'list.txt');
writeFileSync(list, parts.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
const silent = join(TMP, 'silent.mp4');
ff(['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent]);

// ---------- Subtítulos palabra por palabra ----------
const CAP_W = 1080, CAP_H = 420, CAP_Y = 1150;
const capPng = (group, active, id) => shot(`cap${id}`, CAP_W, CAP_H, `<div style="position:absolute;left:70px;right:70px;top:0;height:${CAP_H}px;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;gap:6px 18px;font:700 76px/1.18 Poppins;letter-spacing:-.02em;color:#fff;text-align:center;paint-order:stroke fill;-webkit-text-stroke:10px #14161a">
${group.map((w, i) => `<span style="${i === active ? 'background:#2f5bff;-webkit-text-stroke:0;border-radius:18px;padding:0 16px;' : ''}">${w}</span>`).join('')}</div>`);
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
let prev = 0, idx = 0;
const conc = ['ffconcat version 1.0'];
const add = (png, dur) => { if (dur > 0.001) { conc.push(`file '${png.replace(/\\/g, '/')}'`, `duration ${dur.toFixed(3)}`); } };
events.forEach((e, k) => {
  if (e.start > prev + 0.02) add(blank, e.start - prev);
  const next = events[k + 1];
  // Se mantiene hasta la palabra siguiente si la pausa es corta.
  const until = next && next.start - e.end < 0.45 ? next.start : e.end + 0.15;
  const png = capPng(e.group, e.i, idx++);
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
const voices = voiceClips.map((c, i) => {
  const out = join(TMP, `v${i}.wav`);
  ff(['-i', c.src, '-vn', '-af', `atrim=${c.from}:${c.from + c.dur},asetpts=PTS-STARTPTS,highpass=f=80,loudnorm=I=-16:TP=-2:LRA=9,afade=t=in:d=0.02,afade=t=out:st=${Math.max(c.dur - 0.05, 0)}:d=0.05,aresample=44100,aformat=channel_layouts=stereo`, out]);
  return { file: out, start: c.start };
});
const voiceInputs = voices.flatMap((v) => ['-i', v.file]);
const delays = voices.map((v, i) => `[${i}:a]adelay=${Math.round(v.start * 1000)}|${Math.round(v.start * 1000)}[v${i}]`).join(';');
const voiceMix = join(TMP, 'voice.wav');
ff([...voiceInputs, '-filter_complex', `${delays};${voices.map((_, i) => `[v${i}]`).join('')}amix=inputs=${voices.length}:normalize=0:duration=longest,apad=whole_dur=${total}[a]`, '-map', '[a]', voiceMix]);

// Golpes de transición (ruido filtrado) y una base musical sintetizada, original y sin licencias de terceros.
const whooshFile = join(TMP, 'whoosh.wav');
ff(['-f', 'lavfi', '-t', '0.3', '-i', 'anoisesrc=c=pink:a=0.6:r=44100', '-af', 'highpass=f=700,lowpass=f=6000,afade=t=in:d=0.08,afade=t=out:st=0.1:d=0.2,aformat=channel_layouts=stereo', whooshFile]);
const wMix = join(TMP, 'whooshes.wav');
ff([...whooshes.flatMap(() => ['-i', whooshFile]), '-filter_complex', `${whooshes.map((w, i) => `[${i}:a]adelay=${Math.max(Math.round((w - 0.12) * 1000), 0)}|${Math.max(Math.round((w - 0.12) * 1000), 0)}[w${i}]`).join(';')};${whooshes.map((_, i) => `[w${i}]`).join('')}amix=inputs=${whooshes.length}:normalize=0,apad=whole_dur=${total},volume=0.32[a]`, '-map', '[a]', wMix]);
const music = join(TMP, 'music.wav');
const chord = (f1, f2, f3) => `(sin(2*PI*${f1}*t)+0.7*sin(2*PI*${f2}*t)+0.5*sin(2*PI*${f3}*t))`;
const pad = `if(lt(mod(t,8),4),${chord(110, 164.81, 220)},${chord(87.31, 130.81, 174.61)})*(0.7+0.3*sin(2*PI*0.25*t))*0.09`;
const kick = 'sin(2*PI*58*t)*exp(-9*mod(t,0.6))*0.22';
ff(['-f', 'lavfi', '-i', `aevalsrc='${pad}+${kick}':d=${total}:s=44100`, '-af', `lowpass=f=1100,afade=t=in:d=0.6,afade=t=out:st=${Math.max(total - 1.2, 0)}:d=1.2,aformat=channel_layouts=stereo`, music]);

const mixes = {
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
ff(['-ss', String(c.at), '-i', c.video, '-i', coverTitle, '-filter_complex', '[0:v]scale=1080:1920,eq=saturation=1.06:contrast=1.04[b];[b][1:v]overlay', '-frames:v', '1', '-q:v', '2', join(OUT, `${reel.name}-portada.jpg`)]);
console.log(`total ${total.toFixed(2)} s`);
