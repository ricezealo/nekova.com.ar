// Edición del material propio de las plantillas (grabado el 19/11/2026 sobre fondo blanco).
// Salida en marca/instagram/plantillas-propias/:
//   reels/   5 reels 9:16 con textos animados, música propia (scripts/lib/nekova-music.mjs) y placa negra final,
//            cada uno también en versión muda (para usar un audio en tendencia de Instagram) y con portada.
//   tienda/  clips 4:5 mudos y livianos para la página de producto, y fotos 1200×1200 / 900×1125.
//   fotos/   las dos fotos corregidas a resolución completa.
// El audio original (voces, tele) se descarta siempre.
// Uso: SRC="carpeta con VID_*.mp4 e IMG_*.jpg" FFMPEG=ruta/ffmpeg.exe node scripts/build-plantillas-propias.mjs [reels|tienda|fotos|nombre-del-reel]
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { makeTrack } from './lib/nekova-music.mjs';

const ROOT = resolve(import.meta.dirname, '..');
const SRC = process.env.SRC || 'G:/Ryzen5/Descargas/drive-download-20261119T200656Z-1-001';
const BASE = join(ROOT, 'marca', 'instagram', 'plantillas-propias');
const OUT = { reels: join(BASE, 'reels'), tienda: join(BASE, 'tienda'), fotos: join(BASE, 'fotos') };
const TMP = join(tmpdir(), 'nekova-plantillas-propias');
const FF = process.env.FFMPEG || 'ffmpeg';
const FPS = 30, W = 1080, H = 1920;
const ONLY = process.argv[2];
for (const d of [...Object.values(OUT), TMP]) mkdirSync(d, { recursive: true });
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome'].find((p) => existsSync(p));
const ff = (args) => execFileSync(FF, ['-y', '-loglevel', 'error', ...args], { stdio: ['ignore', 'ignore', 'inherit'], maxBuffer: 1 << 26 });
const asset = (f) => pathToFileURL(join(ROOT, 'assets', f)).href;
const log = (f) => console.log(f.replace(ROOT, '.'));

// ---------- Material ----------
// wall = color medido de la pared en cada toma (RGB); la corrección lo lleva a blanco frío.
// land = grabado horizontal (se recorta a vertical).
const CLIP = {
  pan: { file: 'VID_20261119_162422597.mp4', wall: [185, 182, 169] },   // paneo: negra parada, gris acostada y gris parada
  cenital: { file: 'VID_20261119_162438340.mp4', wall: [189, 181, 172], land: true },
  macro: { file: 'VID_20261119_162458073.mp4', wall: [176, 169, 164], land: true }, // logo en macro que abre a las tres
  gris: { file: 'VID_20261119_163016773.mp4', wall: [196, 190, 187] },  // gris en mano: flexión, base perforada, logo de cerca
  negra: { file: 'VID_20261119_163831038.mp4', wall: [182, 179, 176] }, // negras con la base de espuma: flexiones y torsiones
};
const PHOTO = { trio: { file: 'IMG_20261119_162004267_AE.jpg', wall: [185, 186, 186] }, par: { file: 'IMG_20261119_163632066_AE.jpg', wall: [184, 184, 185] } };

// Curvas por canal: la pared va a `to` (blanco con un toque frío, como el gris de la marca), negros intactos,
// medios un poco más luminosos y una rodilla suave en las altas para no quemar la textura de la espuma.
const grade = (wall, to = [238, 240, 245]) => {
  const c = (i) => { const a = wall[i] / 255, b = to[i] / 255; return `0/0 0.06/0.045 ${(a * 0.5).toFixed(3)}/${(b * 0.47).toFixed(3)} ${a.toFixed(3)}/${b.toFixed(3)} ${((a + 1) / 2).toFixed(3)}/${Math.min(0.998, (b + 1) / 2 + 0.012).toFixed(3)} 1/1`; };
  return `curves=r='${c(0)}':g='${c(1)}':b='${c(2)}',eq=saturation=1.05:contrast=1.02,unsharp=5:5:0.35`;
};

// ---------- Placas (HTML → PNG transparente) ----------
const CSS = `
* { box-sizing: border-box; margin: 0; }
body { font-family: 'Nunito Sans', sans-serif; color: #14161a; background: transparent; overflow: hidden; position: relative; }
.top { position: absolute; left: 80px; right: 80px; top: 230px; }
.eyebrow { display: inline-flex; align-items: center; gap: 18px; color: #2f5bff; font-weight: 800; font-size: 32px; letter-spacing: .14em; text-transform: uppercase; background: rgba(255,255,255,.92); padding: 14px 26px; border-radius: 999px; box-shadow: 0 10px 30px rgba(20,22,26,.10); }
.eyebrow::before { content: ''; width: 40px; height: 4px; background: currentColor; border-radius: 2px; }
.h { margin-top: 22px; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 100px; line-height: 1.04; letter-spacing: -.03em; }
.h em { font-style: normal; color: #2f5bff; }
.h span { background: rgba(255,255,255,.94); box-decoration-break: clone; -webkit-box-decoration-break: clone; padding: 2px 22px; border-radius: 22px; box-shadow: 0 12px 36px rgba(20,22,26,.10); }
.center { position: absolute; left: 70px; right: 70px; text-align: center; }
.tag { position: absolute; display: inline-flex; align-items: center; gap: 18px; background: #fff; border-radius: 999px; padding: 22px 34px 22px 24px; font: 800 46px 'Nunito Sans'; box-shadow: 0 16px 40px rgba(20,22,26,.18); white-space: nowrap; }
.tag i { width: 26px; height: 26px; border-radius: 50%; background: #2f5bff; box-shadow: 0 0 0 9px rgba(47,91,255,.18); }
.blue { background: #2f5bff; color: #fff; }
.blue i { background: #fff; box-shadow: 0 0 0 9px rgba(255,255,255,.25); }
.bottom { position: absolute; left: 80px; right: 80px; bottom: 360px; }
.pill { display: inline-block; background: #2f5bff; color: #fff; border-radius: 999px; padding: 24px 50px; font: 700 52px Poppins; letter-spacing: -.02em; box-shadow: 0 18px 40px rgba(47,91,255,.35); }
`;
let shots = 0;
const png = (name, body, w = W, h = H) => {
  const file = join(TMP, `${name}.html`);
  writeFileSync(file, `<!doctype html><html lang="es"><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@600;700;800&family=Poppins:wght@600;700&display=block" rel="stylesheet"><style>${CSS}</style></head><body style="width:${w}px;height:${h}px">${body}</body></html>`);
  const out = join(TMP, `${name}.png`);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--force-device-scale-factor=1', '--default-background-color=00000000', `--window-size=${w},${h}`, '--virtual-time-budget=8000', `--screenshot=${out}`, pathToFileURL(file).href], { stdio: 'ignore' });
  shots++;
  return out;
};
const T = {
  // título arriba: antetítulo + frase (cada línea con su fondo blanco)
  title: (eyebrow, h) => `<div class="top">${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}<div class="h">${h.split('<br>').map((l) => `<span>${l}</span>`).join('<br>')}</div></div>`,
  // etiqueta con punto en (x, y)
  tag: (text, x, y, blue) => `<div class="tag${blue ? ' blue' : ''}" style="left:${x}px;top:${y}px"><i></i>${text}</div>`,
  bigCenter: (h, y = 760) => `<div class="center" style="top:${y}px"><div class="h" style="font-size:104px">${h.split('<br>').map((l) => `<span>${l}</span>`).join('<br>')}</div></div>`,
  cta: (h, pill) => `<div class="bottom"><div class="h" style="font-size:80px">${h.split('<br>').map((l) => `<span>${l}</span>`).join('<br>')}</div>${pill ? `<div style="margin-top:34px"><span class="pill">${pill}</span></div>` : ''}</div>`,
};

// ---------- Tomas ----------
// s = segundo de inicio en el original, d = duración final, v = velocidad (<1 = cámara lenta con interpolación),
// x/y = encuadre del recorte (0 a 1), z = [zoom inicial, zoom final].
function renderShot(name, { c, s, d, v = 1, x = 0.5, y = 0.5, z = [1, 1.06], fmt = [W, H] }) {
  const out = join(TMP, `${name}.mp4`);
  const clip = CLIP[c];
  const [ow, oh] = fmt, big = [Math.round(ow * 1.2 / 2) * 2, Math.round(oh * 1.2 / 2) * 2];
  const crop = clip.land ? `crop=ih*${ow}/${oh}:ih:(iw-ih*${ow}/${oh})*${x}:0` : (ow / oh > 9 / 16 ? `crop=iw:iw*${oh}/${ow}:0:(ih-iw*${oh}/${ow})*${y}` : 'null');
  const slow = v < 0.85 ? `,minterpolate=fps=${FPS}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1` : '';
  const zf = `(${z[0]}+(${z[1] - z[0]})*min(t/${d},1))`;
  const vf = [crop, `scale=${big[0]}:${big[1]}:flags=lanczos`, `setpts=(PTS-STARTPTS)/${v}`, `fps=${v < 0.85 ? Math.round(FPS * v) : FPS}${slow}`,
    `scale=w='trunc(${ow}*${zf}/2)*2':h=-2:eval=frame:flags=bicubic`, `crop=${ow}:${oh}:(iw-${ow})*${x}:(ih-${oh})*${y}`, grade(clip.wall), `fps=${FPS}`, 'format=yuv420p'].join(',');
  ff(['-ss', String(s), '-t', String(d * v + 0.2), '-i', join(SRC, clip.file), '-an', '-vf', vf, '-t', String(d), '-c:v', 'libx264', '-preset', 'fast', '-crf', '14', out]);
  return out;
}

// Placa negra final (como la del almohadón): logo, nombre, foto propia, nekova.com.ar y redes. 3 s, con rebote.
const ICON = {
  instagram: '<svg viewBox="0 0 24 24" width="52" height="52"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="12" cy="12" r="4.1" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.2" fill="#fff"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" width="52" height="52"><path d="M16.8 3.5c.3 2.1 1.5 3.8 3.7 4.5v3.4a9 9 0 0 1-3.7-1.2v5.5a6.3 6.3 0 1 1-6.3-6.3c.4 0 .8 0 1.2.1v3.6a2.8 2.8 0 1 0 1.6 2.6V3.5h3.5Z" fill="#fff"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" width="52" height="52"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4Z" fill="#fff"/></svg>',
};
let endCardFile;
function endCard() {
  if (endCardFile) return endCardFile;
  const photo = pathToFileURL(join(OUT.tienda, 'product-media-plantillas-real-01.jpg')).href;
  const bg = png('end-bg', `<div style="position:absolute;inset:0;background:linear-gradient(165deg,#14161a 0%,#141c3f 55%,#14161a 100%)"></div>
<div style="position:absolute;left:50%;top:930px;width:1300px;height:900px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(47,91,255,.8),rgba(47,91,255,.25) 55%,rgba(47,91,255,0));filter:blur(60px)"></div>
<img src="${asset('nekova-logo-white.svg')}" style="position:absolute;left:50%;transform:translateX(-50%);top:235px;height:78px">
<div style="position:absolute;left:40px;right:40px;top:360px;text-align:center;font:700 84px/1.05 Poppins;letter-spacing:-.035em;color:#fff">Plantillas<br>Nekova Confort</div>`);
  const card = png('end-card', `<div style="position:absolute;left:170px;top:20px;width:740px;height:740px;border-radius:48px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.45);background:#fff"><img src="${photo}" style="width:100%;height:100%;object-fit:cover"></div>`, W, 800);
  const cta = png('end-cta', `<div style="position:absolute;left:150px;right:150px;top:1380px;height:130px;background:#fff;border-radius:999px;display:flex;align-items:center;justify-content:center;font:700 70px Poppins;letter-spacing:-.025em;color:#1f45d9;box-shadow:0 20px 50px rgba(0,0,0,.35)">nekova.com.ar</div>
<div style="position:absolute;left:0;right:0;top:1545px;display:flex;justify-content:center"><div style="display:grid;grid-template-columns:52px auto;align-items:center;gap:4px 16px;font:800 42px/1.2 'Nunito Sans';color:#fff">${ICON.facebook}<span>Nekova</span>${ICON.instagram}<span>@nekova_ok</span>${ICON.tiktok}<span>@nekova_ok</span></div></div>`);
  endCardFile = join(TMP, 'end.mp4');
  ff(['-loop', '1', '-t', '3', '-i', bg, '-loop', '1', '-t', '3', '-i', card, '-loop', '1', '-t', '3', '-i', cta, '-filter_complex',
    `[0:v]fps=${FPS},format=rgba[bg];[1:v]fps=${FPS},format=rgba,scale=w='trunc(${W}*(1-0.25*exp(-6*t)*cos(11*t))/2)*2':h=-2:eval=frame,fade=in:st=0:d=0.2:alpha=1[p];[2:v]fps=${FPS},format=rgba,fade=in:st=0.45:d=0.25:alpha=1[c];` +
    `[bg][p]overlay=x='(W-w)/2':y='960-h/2':eval=frame[a];[a][c]overlay=x=0:y='max(0,50*(1-(t-0.45)/0.25))':eval=frame,format=yuv420p[v]`,
    '-map', '[v]', '-t', '3', '-c:v', 'libx264', '-preset', 'fast', '-crf', '14', '-r', String(FPS), endCardFile]);
  return endCardFile;
}

// Arma un reel: tomas con transiciones, textos con entrada animada, placa final y música.
// shots: [{...toma, tr: tipo de transición hacia la siguiente}]
// texts: [{png, at: [primera toma, última toma], d: [demora al entrar, adelanto al salir], anim: 'up'|'fade'}]
function buildReel(name, { music, shots: list, texts, end = true }) {
  const parts = list.map((sh, i) => ({ ...sh, file: renderShot(`${name}-${i}`, sh) }));
  // cadena de xfade
  const TR = 0.3;
  const inputs = parts.flatMap((p) => ['-i', p.file]);
  let chain = '', last = '[0:v]', offset = 0;
  const win = [];
  parts.forEach((p, i) => {
    if (i === 0) { offset = p.d; win.push([0, p.d]); return; }
    const tr = parts[i - 1].tr || 'fade', dur = tr === 'cut' ? 0.04 : TR;
    offset -= dur;
    win[i - 1][1] = offset + dur / 2;
    win.push([offset + dur / 2, offset + p.d]);
    chain += `${last}[${i}:v]xfade=transition=${tr === 'cut' ? 'fade' : tr}:duration=${dur}:offset=${offset.toFixed(3)}[x${i}];`;
    last = `[x${i}]`;
    offset += p.d;
  });
  const bodyDur = offset;
  // textos
  let ti = parts.length;
  const tin = [];
  texts.forEach((t) => {
    tin.push('-loop', '1', '-t', String(bodyDur), '-i', t.png);
    const [i0, i1 = i0] = t.at, [d0 = 0.2, d1 = 0.15] = t.d || [];
    const k = ti++, a = +(win[i0][0] + d0).toFixed(2), b = +Math.min(win[i1][1] - d1, bodyDur - 0.05).toFixed(2);
    const yx = t.anim === 'fade' ? '0' : `'if(lt(t,${a}+0.4),70*pow(1-max(t-${a},0)/0.4,3),0)'`;
    chain += `[${k}:v]format=rgba,fade=in:st=${a}:d=0.3:alpha=1,fade=out:st=${b - 0.25}:d=0.25:alpha=1[t${k}];${last}[t${k}]overlay=x=0:y=${yx}:enable='between(t,${a},${b})':eval=frame[o${k}];`;
    last = `[o${k}]`;
  });
  const body = join(TMP, `${name}-body.mp4`);
  ff([...inputs, ...tin, '-filter_complex', chain + `${last}format=yuv420p[v]`, '-map', '[v]', '-t', String(bodyDur), '-c:v', 'libx264', '-preset', 'fast', '-crf', '15', '-r', String(FPS), body]);
  const total = bodyDur + (end ? 3 : 0);
  const mute = join(OUT.reels, `${name}-sin-musica.mp4`), withMusic = join(OUT.reels, `${name}.mp4`);
  const vIn = end ? ['-i', body, '-i', endCard()] : ['-i', body];
  const vChain = end ? `[0:v][1:v]xfade=transition=fade:duration=0.25:offset=${(bodyDur - 0.25).toFixed(3)},format=yuv420p[v]` : '[0:v]format=yuv420p[v]';
  const enc = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-movflags', '+faststart'];
  ff([...vIn, '-filter_complex', vChain, '-map', '[v]', ...enc, mute]);
  const wav = makeTrack(music, total + 1, join(TMP, `${name}.wav`));
  ff(['-i', mute, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', `afade=t=in:d=0.15,afade=t=out:st=${(total - 1.4).toFixed(2)}:d=1.4,volume=0.9`, '-c:a', 'aac', '-b:a', '192k', '-t', total.toFixed(2), '-movflags', '+faststart', withMusic]);
  // portada (primer cuadro con el título) y hoja de control
  ff(['-ss', String(Math.min(1.2, bodyDur / 3)), '-i', mute, '-frames:v', '1', '-q:v', '2', join(OUT.reels, `${name}-portada.jpg`)]);
  ff(['-i', mute, '-vf', `fps=1,scale=180:-2,tile=${Math.ceil(total)}x1`, '-frames:v', '1', join(TMP, `${name}-control.jpg`)]);
  log(withMusic);
}

// ---------- Reels ----------
const REELS = {
  // 1. Presentación: del logo en macro a las plantillas en acción.
  '01-presentacion': () => buildReel('01-presentacion', {
    music: 'ritmo',
    shots: [
      { c: 'macro', s: 0, d: 2.2, x: 0.25, z: [1.15, 1], tr: 'fadewhite' },
      { c: 'pan', s: 0.3, d: 3, v: 1.4, z: [1, 1.08], tr: 'smoothleft' },
      { c: 'negra', s: 37.5, d: 2.4, v: 1.3, z: [1.04, 1.1], tr: 'zoomin' },
      { c: 'gris', s: 7.6, d: 2.2, z: [1, 1.08], tr: 'fade' },
      { c: 'gris', s: 13.8, d: 2.2, z: [1, 1.1], tr: 'fadewhite' },
      { c: 'pan', s: 6, d: 2.6, z: [1.08, 1], tr: 'fade' },
    ],
    texts: [
      { png: png('r1-t1', T.title('Ya disponibles', 'Plantillas<br><em>Nekova Confort</em>')), at: [0, 1], d: [0.3] },
      { png: png('r1-t2', T.tag('Flexibles', 120, 1180, true)), at: [2], d: [0.5] },
      { png: png('r1-t3', T.tag('Espuma que amortigua', 90, 1260)), at: [3] },
      { png: png('r1-t4', T.tag('Transpirables', 330, 1240, true)), at: [4] },
      { png: png('r1-t5', T.cta('Comodidad<br>en <em>cada paso</em>.')), at: [5] },
    ],
  }),
  // 2. Flexibles: cortes al ritmo (116 BPM, 4 tiempos ≈ 2,07 s por toma).
  '02-flexibles': () => buildReel('02-flexibles', {
    music: 'ritmo',
    shots: [
      { c: 'negra', s: 37, d: 2.07, v: 1.5, z: [1.08, 1], tr: 'cut' },
      { c: 'negra', s: 61.5, d: 2.07, v: 1.5, z: [1, 1.08], tr: 'cut' },
      { c: 'gris', s: 4.8, d: 2.07, v: 1.2, z: [1.06, 1], tr: 'cut' },
      { c: 'negra', s: 87, d: 2.07, v: 1.7, z: [1, 1.08], tr: 'cut' },
      { c: 'gris', s: 9.2, d: 2.07, v: 1.2, z: [1.06, 1], tr: 'fadewhite' },
      { c: 'negra', s: 99.5, d: 2.6, z: [1, 1.05], tr: 'fade' },
    ],
    texts: [
      { png: png('r2-t1', T.title('Plantillas Nekova Confort', 'Doblalas.<br><em>Retorcelas.</em>')), at: [0, 2], d: [0.1] },
      { png: png('r2-t2', T.title('', 'Y vuelven<br><em>a su forma.</em>')), at: [3, 4], d: [0.1] },
      { png: png('r2-t3', T.cta('Elegí las tuyas', 'nekova.com.ar')), at: [5], d: [0.3] },
    ],
  }),
  // 3. Por dentro: etiquetas sobre cada parte.
  '03-por-dentro': () => buildReel('03-por-dentro', {
    music: 'calma',
    shots: [
      { c: 'negra', s: 9.5, d: 3, z: [1, 1.08], tr: 'fade' },
      { c: 'negra', s: 5.2, d: 3, z: [1.08, 1.14], y: 0.6, tr: 'smoothup' },
      { c: 'negra', s: 39, d: 3, v: 0.9, z: [1, 1.06], tr: 'fade' },
      { c: 'gris', s: 0, d: 2.6, z: [1, 1.06], tr: 'fadewhite' },
      { c: 'gris', s: 14.2, d: 3, v: 0.7, z: [1, 1.1], tr: 'fade' },
    ],
    texts: [
      { png: png('r3-t1', T.title('Por dentro', '¿Qué tienen<br><em>estas plantillas?</em>')), at: [0] },
      { png: png('r3-t2', T.tag('Capa textil transpirable', 90, 1300, true)), at: [0], d: [0.9] },
      { png: png('r3-t3', T.tag('Zonas perforadas', 260, 640, true)), at: [1], d: [0.4] },
      { png: png('r3-t4', T.tag('Espuma que amortigua', 90, 1380)), at: [2], d: [0.3] },
      { png: png('r3-t5', T.tag('…y vuelve a su forma', 300, 1500, true)), at: [2], d: [1.3] },
      { png: png('r3-t6', T.tag('Talón en U', 120, 1350, true)), at: [3], d: [0.4] },
      { png: png('r3-t7', T.cta('Plantillas<br><em>Nekova Confort</em>')), at: [4], d: [0.8] },
    ],
  }),
  // 4. Detalles: cámara lenta, primeros planos y el slogan de la marca.
  '04-detalles': () => buildReel('04-detalles', {
    music: 'calma',
    shots: [
      { c: 'gris', s: 14.0, d: 3.6, v: 0.6, z: [1, 1.14], tr: 'fadewhite' },
      { c: 'macro', s: 0, d: 3.4, v: 0.6, x: 0.25, z: [1.12, 1], tr: 'fade' },
      { c: 'pan', s: 2.5, d: 3.6, v: 0.75, z: [1, 1.06], tr: 'fadewhite' },
      { c: 'gris', s: 19.2, d: 3, z: [1.02, 1.1], tr: 'fade' },
    ],
    texts: [
      { png: png('r4-t1', T.bigCenter('Tu bienestar,', 300)), at: [0, 1], d: [0.5, 0.6], anim: 'fade' },
      { png: png('r4-t2', T.bigCenter('<em>en los detalles.</em>', 430)), at: [0, 1], d: [1.6, 0.6], anim: 'fade' },
      { png: png('r4-t3', T.cta('Plantillas<br><em>Nekova Confort</em>')), at: [3], d: [0.6], anim: 'fade' },
    ],
  }),
  // 5. ¿Negro o gris? Pieza para comentarios.
  '05-negro-o-gris': () => buildReel('05-negro-o-gris', {
    music: 'ritmo',
    shots: [
      { c: 'pan', s: 0, d: 2.6, z: [1.05, 1], tr: 'smoothleft' },
      { c: 'negra', s: 12, d: 2.07, z: [1, 1.08], tr: 'cut' },
      { c: 'gris', s: 1.2, d: 2.07, z: [1, 1.08], tr: 'fadewhite' },
      { c: 'pan', s: 6.2, d: 2.6, z: [1.06, 1], tr: 'fade' },
    ],
    texts: [
      { png: png('r5-t1', T.title('Vos elegís', '¿Negro<br>o <em>gris</em>?')), at: [0] },
      { png: png('r5-t2', T.tag('Negro 🖤', 330, 1300, true)), at: [1] },
      { png: png('r5-t3', T.tag('Gris 🩶', 360, 1300, true)), at: [2] },
      { png: png('r5-t4', T.title('También en naranja 🧡', 'Contanos cuál<br><em>elegís</em> 👇')), at: [3] },
    ],
  }),
};

// ---------- Tienda: clips 4:5 mudos (720 × 900, < 3 MB) y fotos ----------
function storeClips() {
  const clips = {
    'plantillas-real-flex': { c: 'negra', s: 37.5, d: 4.5, z: [1, 1.06] },
    'plantillas-real-base': { c: 'gris', s: 7.5, d: 4.5, z: [1, 1.05] },
    'plantillas-real-logo': { c: 'gris', s: 14.0, d: 4.5, v: 0.75, z: [1, 1.1] },
    'plantillas-real-paneo': { c: 'pan', s: 0.5, d: 5, v: 1.3, z: [1, 1.05] },
  };
  for (const [name, sh] of Object.entries(clips)) {
    const tmp = renderShot(`tienda-${name}`, { ...sh, fmt: [1080, 1350] });
    const out = join(OUT.tienda, `${name}.mp4`);
    ff(['-i', tmp, '-vf', 'scale=720:900:flags=lanczos', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
    log(out);
  }
}
// Fotos 1200×1200 (galería) y 900×1125 (fotos de uso), desde las fotos y cuadros de los videos.
// La pared se lleva casi a blanco puro (para el gris de la galería con mix-blend-mode: multiply).
function storePhotos() {
  const still = (name, input, ss, wall, vf, size) => {
    const out = join(OUT.tienda, `${name}.jpg`);
    ff([...(ss != null ? ['-ss', String(ss)] : []), '-i', input, '-frames:v', '1', '-vf', `${vf},scale=${size}:flags=lanczos,${grade(wall, [250, 251, 253])}`, '-q:v', '2', out]);
    log(out);
  };
  const V = (c) => join(SRC, CLIP[c].file), P = (p) => join(SRC, PHOTO[p].file);
  // 01: el par gris (foto vertical) en cuadrado
  still('product-media-plantillas-real-01', P('par'), null, PHOTO.par.wall, 'crop=iw:iw:0:ih*0.15', '1200:1200');
  // 02: negra, gris acostada y gris parada (foto horizontal)
  still('product-media-plantillas-real-02', P('trio'), null, PHOTO.trio.wall, 'crop=iw*0.94:ih*0.94:iw*0.06:ih*0.03', '1500:-2');
  still('product-media-plantillas-real-03', V('gris'), 15, CLIP.gris.wall, 'crop=iw:iw:0:ih*0.22', '1200:1200');   // logo de cerca
  still('product-media-plantillas-real-04', V('negra'), 6, CLIP.negra.wall, 'crop=iw:iw:0:ih*0.33', '1200:1200');  // base perforada
  still('product-media-plantillas-real-05', V('negra'), 40, CLIP.negra.wall, 'crop=iw:iw:0:ih*0.25', '1200:1200'); // flexión
  still('product-media-plantillas-real-06', V('macro'), 5.5, CLIP.macro.wall, 'crop=ih:ih:iw*0.5:0', '1200:1200'); // las tres
  still('product-media-plantillas-real-uso-01', V('gris'), 8.5, CLIP.gris.wall, 'crop=iw:iw*1.25:0:ih*0.2', '900:1125');
  still('product-media-plantillas-real-uso-02', V('negra'), 63, CLIP.negra.wall, 'crop=iw:iw*1.25:0:ih*0.22', '900:1125');
  still('product-media-plantillas-real-uso-03', V('pan'), 7, CLIP.pan.wall, 'crop=iw:iw*1.25:0:ih*0.25', '900:1125');
  still('product-media-plantillas-real-uso-04', V('negra'), 13, CLIP.negra.wall, 'crop=iw:iw*1.25:0:ih*0.22', '900:1125'); // negra: tela de arriba con logo
  still('product-media-plantillas-real-uso-05', V('gris'), 15, CLIP.gris.wall, 'crop=iw:iw*1.25:0:ih*0.1', '900:1125');  // logo de cerca
}
function fullPhotos() {
  for (const [k, p] of Object.entries(PHOTO)) {
    const out = join(OUT.fotos, `plantillas-${k}.jpg`);
    ff(['-i', join(SRC, p.file), '-vf', grade(p.wall, [248, 249, 252]), '-q:v', '1', out]);
    log(out);
  }
}

if (!ONLY || ONLY === 'tienda' || ONLY === 'fotos-tienda') storePhotos();
if (!ONLY || ONLY === 'tienda') storeClips();
if (!ONLY || ONLY === 'fotos') fullPhotos();
if (!ONLY || ONLY === 'reels') for (const f of Object.values(REELS)) f();
else if (REELS[ONLY]) REELS[ONLY]();
console.log('placas', shots);
