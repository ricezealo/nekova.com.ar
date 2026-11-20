// Música propia para los reels (sin derechos de terceros): se sintetiza nota por nota y se guarda como WAV.
// makeTrack('ritmo' | 'calma', segundos, archivo.wav)
//  - ritmo: pop luminoso, 116 BPM, F–G–Em–Am, bombo en negras con "pumping", arpegio con eco.
//  - calma: lo-fi suave, 84 BPM, Fmaj7–Em7–Dm7–Cmaj7, piano eléctrico, batería con swing.
import { writeFileSync } from 'node:fs';

const SR = 44100;
const midi = (n) => 440 * 2 ** ((n - 69) / 12);
let seed = 7;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

function schroeder(buf, mix, room = 1) {
  // reverb simple: 4 peines en paralelo + 2 pasa-todo
  const combs = [1557, 1617, 1491, 1422].map((d) => ({ d: Math.round(d * room), b: new Float32Array(Math.round(d * room)), i: 0 }));
  const aps = [225, 556].map((d) => ({ d, b: new Float32Array(d), i: 0 }));
  const out = new Float32Array(buf.length);
  for (let n = 0; n < buf.length; n++) {
    let s = 0;
    for (const c of combs) { const y = c.b[c.i]; c.b[c.i] = buf[n] * 0.5 + y * 0.8; c.i = (c.i + 1) % c.d; s += y; }
    s /= 4;
    for (const a of aps) { const y = a.b[a.i]; const v = s + y * 0.5; a.b[a.i] = v; a.i = (a.i + 1) % a.d; s = y - v * 0.5; }
    out[n] = buf[n] + s * mix;
  }
  return out;
}
const lowpass = (buf, hz) => { const a = 1 - Math.exp((-2 * Math.PI * hz) / SR); let y = 0; for (let n = 0; n < buf.length; n++) { y += a * (buf[n] - y); buf[n] = y; } return buf; };

export function makeTrack(kind, seconds, file) {
  seed = kind === 'ritmo' ? 7 : 11;
  const N = Math.ceil(seconds * SR);
  const L = new Float32Array(N), R = new Float32Array(N);
  const drums = new Float32Array(N), bass = new Float32Array(N), pad = new Float32Array(N), lead = new Float32Array(N), duck = new Float32Array(N).fill(1);
  const bpm = kind === 'ritmo' ? 116 : 84;
  const beat = 60 / bpm, bar = beat * 4;
  // acordes (MIDI) y raíz del bajo
  const prog = kind === 'ritmo'
    ? [[53, 57, 60, 65], [55, 59, 62, 67], [52, 55, 59, 64], [57, 60, 64, 69]]
    : [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]];
  const add = (buf, t0, len, fn) => { const s0 = Math.floor(t0 * SR), n1 = Math.min(N, s0 + Math.floor(len * SR)); for (let n = Math.max(0, s0); n < n1; n++) buf[n] += fn((n - s0) / SR); };
  const bars = Math.ceil(seconds / bar);
  for (let b = 0; b < bars; b++) {
    const t = b * bar, ch = prog[b % 4];
    const intro = b === 0; // el primer compás arranca más liviano
    // ---- batería ----
    for (let k = 0; k < 4; k++) {
      const tb = t + k * beat;
      if (kind === 'ritmo') {
        if (!intro) {
          add(drums, tb, 0.35, (x) => Math.sin(2 * Math.PI * (45 * x + (75 / 18) * (1 - Math.exp(-18 * x)))) * Math.exp(-9 * x) * 0.9);
          add(duck, tb, beat, (x) => -0.55 * Math.exp(-7 * x)); // pumping del pad con el bombo
        }
        if (k % 2 === 1) add(drums, tb, 0.2, (x) => rnd() * Math.exp(-22 * x) * 0.32 + Math.sin(2 * Math.PI * 190 * x) * Math.exp(-30 * x) * 0.2);
        for (const h of [0, 0.5]) add(drums, tb + h * beat, 0.05, (x) => rnd() * Math.exp(-90 * x) * (h ? 0.16 : 0.08));
      } else {
        const sw = beat * 0.58; // swing
        if (k === 0 || k === 2.5) add(drums, tb, 0.3, (x) => Math.sin(2 * Math.PI * (50 * x + 3 * (1 - Math.exp(-20 * x)))) * Math.exp(-10 * x) * 0.6);
        if (k === 2) add(drums, tb + beat * 0.5, 0.3, (x) => Math.sin(2 * Math.PI * (50 * x + 3 * (1 - Math.exp(-20 * x)))) * Math.exp(-10 * x) * 0.4);
        if (k % 2 === 1) add(drums, tb, 0.25, (x) => rnd() * Math.exp(-16 * x) * 0.16);
        for (const h of [0, sw]) add(drums, tb + h, 0.04, (x) => rnd() * Math.exp(-110 * x) * 0.07);
      }
    }
    // ---- bajo ----
    const root = ch[0] - 12;
    if (kind === 'ritmo') {
      for (let e = 0; e < 8; e++) if (!intro || e >= 4) add(bass, t + e * beat / 2, beat / 2 * 0.9, (x) => { const f = midi(root); const env = Math.min(1, x * 200) * Math.exp(-3 * x); return Math.tanh(1.6 * Math.sin(2 * Math.PI * f * x)) * env * 0.42; });
    } else {
      for (const [p, d] of [[0, 1.5], [2, 1.2], [3.5, 0.5]]) add(bass, t + p * beat, d * beat, (x) => Math.sin(2 * Math.PI * midi(root) * x) * Math.min(1, x * 60) * Math.exp(-1.6 * x) * 0.5);
    }
    // ---- pad / piano ----
    if (kind === 'ritmo') {
      for (const n of ch) for (const det of [-0.08, 0, 0.08]) add(pad, t, bar, (x) => { const f = midi(n + det); const ph = (f * x) % 1; return (2 * ph - 1) * Math.min(1, x / 0.25) * Math.min(1, (bar - x) / 0.1) * 0.045; });
    } else {
      for (const [p, d] of [[0, 2.5], [2.5, 1.5]]) for (const n of ch) add(pad, t + p * beat, d * beat, (x) => { const f = midi(n + 12); const m = Math.sin(2 * Math.PI * f * x) * 1.2 * Math.exp(-4 * x); return Math.sin(2 * Math.PI * f * x + m) * Math.exp(-2.2 * x) * Math.min(1, x * 300) * 0.11; });
    }
    // ---- arpegio / melodía ----
    if (kind === 'ritmo' && !intro) {
      const order = [0, 1, 2, 3, 2, 1, 2, 3, 0, 1, 2, 3, 2, 3, 2, 1];
      order.forEach((o, s) => add(lead, t + s * beat / 4, 0.3, (x) => { const f = midi(ch[o] + 12); const tri = 2 * Math.abs(2 * ((f * x) % 1) - 1) - 1; return tri * Math.exp(-11 * x) * Math.min(1, x * 400) * 0.16; }));
    }
    if (kind === 'calma' && b % 2 === 1) {
      [[0, 3], [1, 2], [1.5, 1], [3, 2]].forEach(([p, o]) => add(lead, t + p * beat, 0.8, (x) => Math.sin(2 * Math.PI * midi(ch[o] + 24) * x) * Math.exp(-4 * x) * Math.min(1, x * 300) * 0.08));
    }
  }
  lowpass(pad, kind === 'ritmo' ? 1400 : 2200);
  for (let n = 0; n < N; n++) pad[n] *= duck[n];
  // eco (corchea con puntillo) en el arpegio
  const dl = Math.round(beat * 0.75 * SR);
  for (let n = dl; n < N; n++) lead[n] += lead[n - dl] * 0.35;
  const space = schroeder(Float32Array.from(pad, (v, n) => v + lead[n] * 0.8), kind === 'ritmo' ? 0.35 : 0.5, kind === 'ritmo' ? 1 : 1.25);
  if (kind === 'calma') lowpass(drums, 6000);
  // mezcla estéreo (arpegio un poco a la derecha, eco a la izquierda)
  for (let n = 0; n < N; n++) {
    const c = drums[n] + bass[n];
    const noise = kind === 'calma' ? rnd() * 0.004 + (Math.abs(rnd()) > 0.9996 ? rnd() * 0.05 : 0) : 0; // crujido de vinilo
    L[n] = c + space[n] * 0.95 + lead[n] * 0.25 + noise;
    R[n] = c + space[n] * 1.05 + lead[n] * 0.45 + noise;
  }
  // normaliza a -1 dBFS con un limitador suave
  let peak = 0;
  for (let n = 0; n < N; n++) peak = Math.max(peak, Math.abs(L[n]), Math.abs(R[n]));
  const g = 0.89 / peak;
  const pcm = Buffer.alloc(44 + N * 4);
  pcm.write('RIFF', 0); pcm.writeUInt32LE(36 + N * 4, 4); pcm.write('WAVEfmt ', 8); pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(2, 22);
  pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 4, 28); pcm.writeUInt16LE(4, 32); pcm.writeUInt16LE(16, 34); pcm.write('data', 36); pcm.writeUInt32LE(N * 4, 40);
  for (let n = 0; n < N; n++) {
    pcm.writeInt16LE(Math.round(Math.tanh(L[n] * g * 1.1) * 32000), 44 + n * 4);
    pcm.writeInt16LE(Math.round(Math.tanh(R[n] * g * 1.1) * 32000), 46 + n * 4);
  }
  writeFileSync(file, pcm);
  return file;
}
