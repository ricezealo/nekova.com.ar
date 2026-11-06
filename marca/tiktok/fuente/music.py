"""Música original (sin derechos de terceros) para los videos de Nekova.
Uso: python3 music.py <mood: warm|calm|bright> <segundos> <salida.wav>"""
import sys, numpy as np, wave

SR = 44100
rng = np.random.default_rng(7)

def note(f, dur, kind="keys"):
    t = np.arange(int(SR * dur)) / SR
    if kind == "keys":   # piano eléctrico suave
        w = np.sin(2*np.pi*f*t) + 0.35*np.sin(2*np.pi*2*f*t)*np.exp(-t*6) + 0.12*np.sin(2*np.pi*3*f*t)*np.exp(-t*9)
        env = np.exp(-t*2.2) * (1 - np.exp(-t*400))
    elif kind == "pad":
        w = sum(np.sin(2*np.pi*f*(1+d)*t) for d in (-0.003, 0, 0.004)) / 3
        a = min(0.6, dur/3)
        env = np.clip(t/a, 0, 1) * np.clip((dur-t)/a, 0, 1)
    elif kind == "bass":
        w = np.sin(2*np.pi*f*t) + 0.2*np.sin(2*np.pi*2*f*t)
        env = np.exp(-t*3) * (1 - np.exp(-t*300))
    elif kind == "pluck":
        w = np.sign(np.sin(2*np.pi*f*t)) * 0.3 + np.sin(2*np.pi*f*t)
        env = np.exp(-t*9) * (1 - np.exp(-t*500))
    return w * env

def kick(dur=0.35):
    t = np.arange(int(SR*dur))/SR
    f = 50 + 90*np.exp(-t*30)
    return np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t*9)

def hat(dur=0.06):
    t = np.arange(int(SR*dur))/SR
    n = rng.standard_normal(len(t))
    n = np.diff(n, prepend=0)  # brillo
    return n * np.exp(-t*70) * 0.25

def snap(dur=0.18):
    t = np.arange(int(SR*dur))/SR
    return rng.standard_normal(len(t)) * np.exp(-t*28) * 0.35

def hz(m): return 440 * 2**((m-69)/12)

def add(buf, x, at, g=1.0):
    i = int(at*SR)
    if i >= len(buf): return
    x = x[:len(buf)-i]
    buf[i:i+len(x)] += x*g

def song(mood, secs):
    n = int(SR*(secs+1.5))
    L = np.zeros(n); R = np.zeros(n)
    if mood == "calm":
        bpm = 76
        prog = [[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59]]  # Fmaj7 Em7 Dm7 Cmaj7
    elif mood == "bright":
        bpm = 112
        prog = [[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,65]]  # Cmaj7 Am7 Fmaj7 G7
    else:
        bpm = 98
        prog = [[57,60,64,67],[53,57,60,64],[48,52,55,59],[55,59,62,65]]  # Am7 Fmaj7 Cmaj7 G7
    beat = 60/bpm; bar = beat*4
    t = 0.0; b = 0
    while t < secs + 1:
        ch = prog[b % 4]
        # pad / acordes
        for k, m in enumerate(ch):
            x = note(hz(m), bar*1.05, "pad")
            add(L, x, t, 0.10 if k % 2 else 0.08); add(R, x, t, 0.08 if k % 2 else 0.10)
        add(L, note(hz(ch[0]-12), bar, "pad"), t, 0.05); add(R, note(hz(ch[0]-12), bar, "pad"), t, 0.05)
        if mood != "calm":
            # teclas sincopadas
            for off in (0, 1.5, 2.5, 3.5):
                for m in ch[1:]:
                    x = note(hz(m), beat*1.2, "keys")
                    add(L, x, t+off*beat, 0.06); add(R, x, t+off*beat+0.004, 0.06)
            # bajo
            for off in (0, 2, 2.75):
                x = note(hz(ch[0]-24), beat*1.4, "bass"); add(L, x, t+off*beat, 0.30); add(R, x, t+off*beat, 0.30)
            # batería
            for q in range(4):
                if q in (0, 2): k = kick(); add(L, k, t+q*beat, 0.55); add(R, k, t+q*beat, 0.55)
                if q in (1, 3): s = snap(); add(L, s, t+q*beat, 0.16); add(R, s, t+q*beat+0.003, 0.16)
                for e in (0, 0.5):
                    h = hat(); add(L, h, t+(q+e)*beat, 0.16 if e else 0.09); add(R, h, t+(q+e)*beat+0.002, 0.09 if e else 0.16)
            if mood == "bright":
                arp = ch + [ch[0]+12]
                for i in range(8):
                    x = note(hz(arp[i % 5]+12), beat*0.6, "pluck")
                    add(L if i % 2 else R, x, t+i*beat/2, 0.035)
        else:
            # teclas lentas y espaciadas
            for i, off in enumerate((0, 1, 2, 3)):
                m = ch[(i*2) % 4] + 12
                x = note(hz(m), beat*2.5, "keys")
                add(L, x, t+off*beat, 0.05); add(R, x, t+off*beat+0.01, 0.05)
        t += bar; b += 1
    # eco simple
    d = int(0.28*SR)
    L[d:] += 0.22*R[:-d]; R[d:] += 0.22*L[:-d]
    st = np.stack([L, R], 1)[:int(SR*secs)]
    # fundidos
    fi = int(0.05*SR); fo = int(1.2*SR)
    st[:fi] *= np.linspace(0, 1, fi)[:, None]
    st[-fo:] *= np.linspace(1, 0, fo)[:, None]
    st = np.tanh(st*1.3)
    st = st / (np.abs(st).max()+1e-9) * 0.7
    return st

if __name__ == "__main__":
    mood, secs, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
    st = song(mood, secs)
    with wave.open(out, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st*32767).astype(np.int16).tobytes())
