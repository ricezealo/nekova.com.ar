// Genera las imágenes (1200 × 1200) y los clips (9:16) para publicar en Mercado Libre, en marca/mercadolibre/.
// Uso: FFMPEG="ruta/a/ffmpeg.exe" node scripts/build-mercadolibre.mjs
// Necesita ffmpeg con zscale/tonemap (los videos propios del celular son HDR) y Chrome para las infografías.
import { writeFileSync, mkdirSync, existsSync, copyFileSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'marca', 'mercadolibre');
const TMP = join(tmpdir(), 'nekova-ml');
const FF = process.env.FFMPEG || 'ffmpeg';
const VIDEOS = process.env.NEKOVA_VIDEOS || 'G:/Ryzen5/Descargas/Photos-1-001';
const PILLOW_PHOTOS = process.env.NEKOVA_PILLOW_PHOTOS || 'G:/Ryzen5/Descargas/almohada-mariposa-photos';
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((p) => existsSync(p));
for (const d of [OUT, join(OUT, 'cojin'), join(OUT, 'somnia'), TMP]) mkdirSync(d, { recursive: true });

const A = (f) => join(ROOT, 'assets', f);
const url = (p) => pathToFileURL(p).href;
const TM = 'zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p';
const ff = (args) => execFileSync(FF, ['-y', '-loglevel', 'error', ...args], { stdio: ['ignore', 'ignore', 'inherit'] });
const frame = (src, t, vf, out) => ff(['-ss', String(t), '-i', src, '-frames:v', '1', '-vf', vf, '-q:v', '2', out]);

// ---------- Cuadros de video (fotos de uso reales) ----------
const own = (name) => join(VIDEOS, `20261028_${name}.mp4`);
const sq = (y) => `${TM},crop=1080:1080:0:${y},scale=1200:1200:flags=lanczos`;
frame(own('160119'), 4, sq(420), join(TMP, 'coj-silla-sola.jpg'));
frame(own('155325'), 5, sq(260), join(TMP, 'coj-persona-sentada.jpg'));
frame(own('160119'), 11, sq(240), join(TMP, 'coj-persona-escritorio.jpg'));
frame(A('cojin-ortopedico.mp4'), 34, 'crop=720:720:200:0,scale=1200:1200:flags=lanczos', join(TMP, 'coj-auto-solo.jpg'));
frame(A('cojin-ortopedico.mp4'), 37, 'crop=720:720:420:0,scale=1200:1200:flags=lanczos', join(TMP, 'coj-auto-persona.jpg'));
frame(own('160314'), 10, `${TM},crop=1080:1080:0:380,scale=1200:1200:flags=lanczos`, join(TMP, 'som-enrollada.jpg'));

// Portada de la Somnia sin gráficos: la foto de medidas del proveedor, con las líneas y cotas borradas.
{
  const src = join(PILLOW_PHOTOS, 'H50f2f24cf2b748ce9dae113ec4f5b8d1x.avif');
  const w = 790, h = 330;
  const raw = execFileSync(FF, ['-loglevel', 'error', '-i', src, '-vf', `crop=${w}:${h}:0:890,format=rgb24`, '-f', 'rawvideo', '-'], { maxBuffer: 1 << 26 });
  const px = Buffer.from(raw);
  const lineY = (x) => 300 + (x - 190) * (214 - 300) / (662 - 190); // cota inferior (diagonal)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (x < 152 || x > 662 || y >= lineY(x) - (x < 280 ? 30 : 16)) { const i = (y * w + x) * 3; px[i] = px[i + 1] = px[i + 2] = 255; }
  }
  const rawFile = join(TMP, 'som-clean.raw');
  writeFileSync(rawFile, px);
  ff(['-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${w}x${h}`, '-i', rawFile, '-vf', "crop=530:300:138:0,lutrgb=r='min(255\\,val*255/238)':g='min(255\\,val*255/238)':b='min(255\\,val*255/238)',scale=1140:-1:flags=lanczos,pad=1200:1200:(ow-iw)/2:(oh-ih)/2:white", '-q:v', '2', join(TMP, 'som-principal.jpg')]);
}

// ---------- Infografías (Chrome) ----------
const CSS = `
* { box-sizing: border-box; margin: 0; }
html, body { width: 1200px; height: 1200px; overflow: hidden; background: #fff; color: #14161a; font-family: 'Nunito Sans', sans-serif; }
.wrap { position: relative; width: 1200px; height: 1200px; }
.eb { position: absolute; left: 70px; top: 64px; display: flex; align-items: center; gap: 14px; color: #2f5bff; font: 800 24px 'Nunito Sans'; letter-spacing: .14em; text-transform: uppercase; }
.eb::before { content: ''; width: 34px; height: 4px; background: currentColor; border-radius: 2px; }
h1 { position: absolute; left: 70px; top: 104px; right: 70px; font: 600 60px/1.1 Poppins; letter-spacing: -.02em; }
h1 em { font-style: normal; color: #2f5bff; }
.photo { position: absolute; object-fit: contain; mix-blend-mode: multiply; }
.eb, h1, .call, .legend, .dim, .cap { z-index: 2; }
.call { position: absolute; width: 310px; }
.call .dot { width: 58px; height: 58px; border-radius: 50%; background: #eaf0ff; color: #2f5bff; display: grid; place-items: center; font: 700 26px Poppins; margin-bottom: 14px; }
.call b { display: block; font: 600 29px/1.15 Poppins; letter-spacing: -.01em; }
.call span { display: block; margin-top: 6px; font: 600 23px/1.35 'Nunito Sans'; color: #5b6270; }
.right { text-align: right; }
.right .dot { margin-left: auto; }
.cap { position: absolute; left: 50%; transform: translateX(-50%); bottom: 54px; background: #fff; color: #14161a; border-radius: 999px; padding: 22px 42px; font: 600 38px Poppins; letter-spacing: -.01em; white-space: nowrap; box-shadow: 0 12px 34px rgba(0,0,0,.25); }
.cap em { font-style: normal; color: #2f5bff; }
.dim { position: absolute; display: flex; align-items: center; justify-content: center; }
.dim i { position: absolute; background: #2f5bff; }
.dim span { position: relative; background: #fff; padding: 4px 18px; font: 700 44px Poppins; color: #14161a; letter-spacing: -.02em; }
.legend { position: absolute; left: 70px; right: 70px; bottom: 70px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.legend div { background: #f3f5f9; border-radius: 26px; padding: 26px 24px; }
.legend .dot { width: 54px; height: 54px; border-radius: 50%; background: #2f5bff; color: #fff; display: grid; place-items: center; font: 700 26px Poppins; margin-bottom: 14px; }
.legend b { display: block; font: 600 29px/1.15 Poppins; }
.legend span { display: block; margin-top: 8px; font: 600 23px/1.35 'Nunito Sans'; color: #5b6270; }
`;
const shot = (out, body) => {
  const html = join(TMP, 'shot.html');
  writeFileSync(html, `<!doctype html><html lang="es"><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@600;700;800&family=Poppins:wght@600;700&display=block" rel="stylesheet"><style>${CSS}</style></head><body><div class="wrap">${body}</div></body></html>`);
  const png = join(TMP, 'shot.png');
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--force-device-scale-factor=1', '--window-size=1200,1200', '--virtual-time-budget=8000', `--screenshot=${png}`, url(html)], { stdio: 'ignore' });
  ff(['-i', png, '-q:v', '2', out]);
  console.log(out.replace(ROOT, '').replace(/\\/g, '/'));
};
const call = (x, y, n, t, s, right = false) => `<div class="call${right ? ' right' : ''}" style="left:${x}px;top:${y}px"><div class="dot">${n}</div><b>${t}</b><span>${s}</span></div>`;
const photoCap = (src, cap) => `<img class="photo" src="${url(src)}" style="left:0;top:0;width:1200px;height:1200px;object-fit:cover"><div class="cap">${cap}</div>`;
const dimH = (x, y, w, label) => `<div class="dim" style="left:${x}px;top:${y}px;width:${w}px;height:60px"><i style="left:0;right:0;top:29px;height:3px"></i><i style="left:0;top:14px;width:3px;height:32px"></i><i style="right:0;top:14px;width:3px;height:32px"></i><span>${label}</span></div>`;
const dimV = (x, y, h, label) => `<div class="dim" style="left:${x}px;top:${y}px;width:60px;height:${h}px"><i style="top:0;bottom:0;left:29px;width:3px"></i><i style="top:0;left:14px;height:3px;width:32px"></i><i style="bottom:0;left:14px;height:3px;width:32px"></i><span style="transform:rotate(-90deg);white-space:nowrap">${label}</span></div>`;

const C = join(OUT, 'cojin'), SO = join(OUT, 'somnia');

// ---------- Cojín ----------
ff(['-i', A('product-media-cojin-ortopedico-01.jpg'), '-vf', 'scale=1200:1200', '-q:v', '2', join(C, '01-principal-gris.jpg')]);
ff(['-i', A('product-media-cojin-ortopedico-02.jpg'), '-vf', 'scale=1200:1200', '-q:v', '2', join(C, '01-principal-azul-marino.jpg')]);
shot(join(C, '02-caracteristicas.jpg'), `<div class="eb">Cojín ergonómico en U</div><h1>Todo lo que <em>tiene</em></h1>
<img class="photo" src="${url(A('product-media-cojin-ortopedico-01.jpg'))}" style="left:150px;top:190px;width:900px;height:560px;transform:scale(1.5)">
${call(70, 770, 1, 'Espuma viscoelástica', 'Se adapta a tu forma y la recupera en 3 a 5 s')}
${call(445, 770, 2, 'Ranura en U', 'Deja libre la zona del coxis')}
${call(820, 770, 3, 'Laterales elevados', 'Envuelven la cadera y los muslos')}
${call(70, 985, 4, 'Funda transpirable', 'Extraíble, con cierre y lavable')}
${call(445, 985, 5, 'Frente en arco', 'Acompaña la base de los muslos')}
${call(820, 985, 6, 'Oficina, auto o casa', 'Para las sillas y asientos de todos los días')}`);
shot(join(C, '03-medidas.jpg'), `<div class="eb">Medidas</div><h1>Medí tu silla: <em>48 × 38 cm</em></h1>
<img class="photo" src="${url(A('product-media-cojin-ortopedico-02.jpg'))}" style="left:200px;top:250px;width:700px;height:700px;transform:scale(1.25)">
${dimH(255, 950, 590, '48 cm')}${dimV(905, 330, 540, '38 cm')}
<div class="cap" style="bottom:46px;box-shadow:none;background:#f3f5f9">Alto: <em>12 cm</em> · el asiento tiene que medir al menos 48 × 38 cm</div>`);
shot(join(C, '04-zonas-de-apoyo.jpg'), `<div class="eb">Cómo funciona</div><h1>Tres zonas, <em>un solo apoyo</em></h1>
<img class="photo" src="${url(A('product-media-cojin-ortopedico-04.jpg'))}" style="left:190px;top:190px;width:820px;height:640px">
<div class="legend"><div><div class="dot">A</div><b>Laterales elevados</b><span>Envuelven la cadera y los muslos</span></div><div><div class="dot">B</div><b>Zona trasera</b><span>Más alta, acompaña la espalda baja</span></div><div><div class="dot">C</div><b>Ranura en U</b><span>Deja libre la zona del coxis</span></div></div>`);
shot(join(C, '05-silla-de-oficina.jpg'), photoCap(join(TMP, 'coj-silla-sola.jpg'), 'En tu silla <em>de oficina</em>'));
shot(join(C, '06-persona-sentada.jpg'), photoCap(join(TMP, 'coj-persona-sentada.jpg'), 'Te sentás <em>y se adapta</em>'));
shot(join(C, '07-persona-escritorio.jpg'), photoCap(join(TMP, 'coj-persona-escritorio.jpg'), 'Más cómodo en <em>las horas de escritorio</em>'));
shot(join(C, '08-auto.jpg'), photoCap(join(TMP, 'coj-auto-solo.jpg'), 'También <em>en el auto</em>'));
shot(join(C, '09-auto-persona.jpg'), photoCap(join(TMP, 'coj-auto-persona.jpg'), 'Para los <em>viajes largos</em>'));
shot(join(C, '10-funda.jpg'), photoCap(A('product-media-cojin-ortopedico-detalle-funda.jpg'), 'Funda con cierre: <em>se saca y se lava</em>'));
shot(join(C, '11-colores.jpg'), `<div class="eb">Colores</div><h1>Elegí <em>tu color</em></h1>
<img class="photo" src="${url(A('product-media-cojin-ortopedico-03.jpg'))}" style="left:60px;top:300px;width:1080px;height:700px;transform:scale(1.7)">
<div class="cap" style="box-shadow:none;background:#f3f5f9">Gris · Azul marino</div>`);

// ---------- Almohada Nekova Somnia ----------
copyFileSync(join(TMP, 'som-principal.jpg'), join(SO, '01-principal.jpg'));
shot(join(SO, '02-caracteristicas.jpg'), `<div class="eb">Almohada Nekova Somnia</div><h1>Todo lo que <em>tiene</em></h1>
<img class="photo" src="${url(join(TMP, 'som-principal.jpg'))}" style="left:150px;top:190px;width:900px;height:560px;transform:scale(1.35)">
${call(70, 770, 1, 'Espuma viscoelástica', 'Se adapta a tu forma y la recupera')}
${call(445, 770, 2, 'Contorno mariposa', 'Una zona para cada postura')}
${call(820, 770, 3, 'Hueco central', 'Recibe la cabeza')}
${call(70, 985, 4, 'De costado o boca arriba', 'Te acompaña aunque cambies de posición')}
${call(445, 985, 5, 'Lugar para el brazo', 'Recortes en los costados')}
${call(820, 985, 6, 'Funda transpirable', 'Extraíble, con cierre y lavable')}`);
ff(['-i', A('product-media-almohada-03.jpg'), '-q:v', '2', join(SO, '03-medidas.jpg')]);
ff(['-i', A('product-media-almohada-02.jpg'), '-q:v', '2', join(SO, '04-zonas-de-apoyo.jpg')]);
shot(join(SO, '05-de-costado.jpg'), photoCap(A('product-media-almohada-05.jpg'), 'Para dormir <em>de costado</em>'));
shot(join(SO, '06-boca-arriba.jpg'), photoCap(A('product-media-almohada-vida-02.jpg'), 'Para dormir <em>boca arriba</em>'));
shot(join(SO, '07-abrazada.jpg'), photoCap(A('product-media-almohada-06.jpg'), 'Te acompaña <em>toda la noche</em>'));
shot(join(SO, '08-nucleo-espuma.jpg'), `<div class="eb">Por dentro</div><h1>Espuma <em>viscoelástica</em></h1>
<img class="photo" src="${url(A('product-media-almohada-04.jpg'))}" style="left:100px;top:240px;width:1000px;height:780px;transform:scale(1.12)">
<div class="cap" style="box-shadow:none;background:#f3f5f9">Funda transpirable con cierre, <em>lavable</em></div>`);
shot(join(SO, '09-llega-al-vacio.jpg'), photoCap(join(TMP, 'som-enrollada.jpg'), 'Llega <em>enrollada y al vacío</em>'));

if (process.env.SKIP_VIDEO) process.exit(0);
// ---------- Clips verticales (9:16) ----------
const card = (name, text) => {
  const html = join(TMP, `${name}.html`);
  writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=block" rel="stylesheet"><style>html,body{margin:0;width:1080px;height:1920px;background:transparent;overflow:hidden}.c{position:absolute;left:50%;top:1340px;transform:translateX(-50%);background:#fff;border-radius:28px;box-shadow:0 14px 40px rgba(0,0,0,.28);padding:26px 42px;font:600 50px/1.12 Poppins;letter-spacing:-.02em;color:#14161a;white-space:nowrap;text-align:center}em{font-style:normal;color:#2f5bff}</style></head><body><div class="c">${text}</div></body></html>`);
  const png = join(TMP, `${name}.png`);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--default-background-color=00000000', '--window-size=1080,1920', '--virtual-time-budget=6000', `--screenshot=${png}`, url(html)], { stdio: 'ignore' });
  return png;
};
const endCard = (name, title, sub, photo) => {
  const html = join(TMP, `${name}.html`);
  writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@600&family=Poppins:wght@600&display=block" rel="stylesheet"><style>html,body{margin:0;width:1080px;height:1920px;background:#fff;overflow:hidden;font-family:'Nunito Sans'}h1{position:absolute;left:90px;right:90px;top:330px;font:600 92px/1.05 Poppins;letter-spacing:-.03em;color:#14161a}h1 em{font-style:normal;color:#2f5bff}p{position:absolute;left:90px;right:90px;top:560px;font:600 40px/1.4 'Nunito Sans';color:#5b6270}img{position:absolute;left:60px;width:960px;top:760px;height:960px;object-fit:contain}</style></head><body><h1>${title}</h1><p>${sub}</p><img src="${url(photo)}"></body></html>`);
  const png = join(TMP, `${name}.png`);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--window-size=1080,1920', '--virtual-time-budget=6000', `--screenshot=${png}`, url(html)], { stdio: 'ignore' });
  return png;
};
const seg = (src, ss, dur, out, extra = '') => ff(['-ss', String(ss), '-t', String(dur), '-i', src, '-vf', `fps=30,${TM},scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920${extra}`, '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', out]);
const still = (png, dur, out) => ff(['-loop', '1', '-t', String(dur), '-i', png, '-vf', 'scale=1080:1920,fps=30,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', out]);
const overlayCard = (inp, png, out) => ff(['-i', inp, '-i', png, '-filter_complex', '[0:v][1:v]overlay,format=yuv420p', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', out]);
const concat = (parts, out) => {
  const list = join(TMP, 'list.txt');
  writeFileSync(list, parts.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
  ff(['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', out]);
};

// Cojín: tomas propias (silla de oficina) + auto del video del proveedor, sin audio (las tomas propias tienen ruido y voces).
{
  const parts = [];
  const add = (src, ss, dur, text, hdr = true) => {
    const raw = join(TMP, `cs${parts.length}.mp4`), out = join(TMP, `cs${parts.length}c.mp4`);
    if (hdr) seg(src, ss, dur, raw);
    else ff(['-ss', String(ss), '-t', String(dur), '-i', src, '-vf', 'fps=30,crop=405:720:40:0,scale=1080:1920:flags=lanczos,format=yuv420p', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', raw]);
    overlayCard(raw, card(`cc${parts.length}`, text), out);
    parts.push(out);
  };
  add(own('155230'), 0.5, 3.5, 'Cojín ergonómico <em>en U</em>');
  add(own('155819'), 1.5, 4, 'Lo apoyás <em>en tu silla</em>');
  add(own('155325'), 2, 4, 'Te sentás <em>y se adapta</em>');
  add(own('160119'), 8, 4, 'Más cómodo <em>en el escritorio</em>');
  add(A('cojin-ortopedico.mp4'), 38.3, 3, 'También <em>en el auto</em>', false);
  const end = join(TMP, 'cend.mp4');
  still(endCard('cendc', 'Cojín Ergonómico <em>en U</em>', 'Espuma viscoelástica · funda con cierre lavable · gris o azul marino', A('product-media-cojin-ortopedico-03.jpg')), 3, end);
  parts.push(end);
  concat(parts, join(C, '12-clip-vertical.mp4'));
  console.log('/marca/mercadolibre/cojin/12-clip-vertical.mp4');
}

// Somnia: el reel del unboxing con sonido, con un cierre sin precio ni llamados a comentar (Mercado Libre no permite derivar a otros canales).
{
  const reel = join(ROOT, 'marca', 'instagram', 'somnia', 'somnia-r1-unboxing.mp4');
  const body = join(TMP, 'sbody.mp4');
  ff(['-t', '21.6', '-i', reel, '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-c:a', 'aac', '-b:a', '128k', body]);
  const endPng = endCard('sendc', 'Almohada Nekova <em>Somnia</em>', 'Espuma viscoelástica · contorno mariposa · funda con cierre lavable', join(TMP, 'som-principal.jpg'));
  const end = join(TMP, 'send.mp4');
  ff(['-loop', '1', '-t', '3', '-i', endPng, '-f', 'lavfi', '-t', '3', '-i', 'anullsrc=r=44100:cl=stereo', '-vf', 'scale=1080:1920,fps=30,format=yuv420p', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-c:a', 'aac', '-b:a', '128k', '-shortest', end]);
  concat([body, end], join(SO, '10-clip-vertical.mp4'));
  console.log('/marca/mercadolibre/somnia/10-clip-vertical.mp4');
}
