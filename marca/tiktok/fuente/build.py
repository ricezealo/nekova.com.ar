"""Arma los 10 videos TikTok de Nekova.
Uso: NEKOVA_ROOT=<carpeta del repo nekova.com.ar> python3 build.py [tt01 ...]  (requiere ffmpeg, Pillow y numpy)"""
import subprocess, os, sys, json
import gfx

R = gfx.ROOT
IG = R + "marca/instagram/"
ML = R + "marca/mercadolibre/"
A = R + "assets/"
HERE = os.path.dirname(os.path.abspath(__file__)) + "/"
TMP = os.environ.get("NEKOVA_TMP", HERE + "tmp/")
OUT = os.environ.get("NEKOVA_OUT", HERE + "../")
FPS = 30
COJIN_FOTO = ML + "cojin/01-principal-gris.jpg"
SOMNIA_FOTO = ML + "somnia/01-principal.jpg"
P_COJIN, P_SOMNIA = "$79.000", "$82.000"
ENC = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS)]

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print(" ".join(cmd)); print(r.stderr[-2500:]); raise SystemExit(1)

def dur(f):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).strip())

# ---------- segmentos (todos salen 1080x1920, 30 fps, con pista de audio estéreo) ----------
def seg(spec, out):
    kind = spec["k"]; d = spec["d"]
    a_src = None
    if kind == "v":   # fuente vertical 9:16
        z = spec.get("zoom", 1.0); sp = spec.get("speed", 1.0)
        vf = f"setpts=PTS/{sp},scale={round(1080*z)}:{round(1920*z)},crop=1080:1920,fps={FPS}"
        inp = ["-ss", str(spec["ss"]), "-t", str(d * sp), "-i", spec["src"]]
        if spec.get("audio"):
            af = f"atempo={sp}" if sp != 1 else "anull"
            run(["ffmpeg", "-y", "-v", "error", *inp, "-vf", vf, "-af", af + ",aresample=44100", "-ac", "2", *ENC, "-c:a", "aac", "-b:a", "192k", "-t", str(d), out])
            return
    elif kind == "h":   # fuente horizontal: recorte 4:5 nítido sobre fondo desenfocado
        cx = spec.get("cx", 0.5); sp = spec.get("speed", 1.0)
        fy = spec.get("fy", 430)
        vf = (f"setpts=PTS/{sp},split[a][b];"
              f"[a]scale=-2:1920,crop=1080:1920,boxblur=40:2,eq=brightness=-0.06:saturation=0.9[bg];"
              f"[b]crop=ih*4/5:ih:(iw-ih*4/5)*{cx}:0,scale=1080:1350[fg];"
              f"[bg][fg]overlay=0:{fy},fps={FPS}")
        inp = ["-ss", str(spec["ss"]), "-t", str(d * sp), "-i", spec["src"]]
    elif kind == "img":   # foto con acercamiento lento
        fr = round(d * FPS); fy = spec.get("fy", 430)
        z = spec.get("z", 0.0012)
        vf = (f"split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=40:2,eq=brightness=-0.06[bg];"
              f"[b]scale=2160:2700:force_original_aspect_ratio=increase,crop=2160:2700,"
              f"zoompan=z='1+{z}*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={fr}:s=1080x1350:fps={FPS}[fg];"
              f"[bg][fg]overlay=0:{fy}")
        if spec.get("full"):
            vf = (f"scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,"
                  f"zoompan=z='1+{z}*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={fr}:s=1080x1920:fps={FPS}")
        inp = ["-loop", "1", "-t", str(d), "-i", spec["src"]]
    elif kind == "card":  # placa final con acercamiento leve
        fr = round(d * FPS)
        vf = (f"scale=2160:3840,zoompan=z='1+0.0006*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={fr}:s=1080x1920:fps={FPS}")
        inp = ["-loop", "1", "-t", str(d), "-i", spec["src"]]
    run(["ffmpeg", "-y", "-v", "error", *inp, "-f", "lavfi", "-t", str(d), "-i", "anullsrc=r=44100:cl=stereo",
         "-filter_complex", f"[0:v]{vf}[v]", "-map", "[v]", "-map", "1:a", *ENC, "-c:a", "aac", "-b:a", "192k", "-t", str(d), "-shortest", out])

def build(vid, segs, overlays, mood, orig_audio=False, music_gain=1.0):
    parts = []
    for i, s in enumerate(segs):
        p = f"{TMP}{vid}-s{i:02d}.mp4"; seg(s, p); parts.append(p)
    lst = f"{TMP}{vid}-list.txt"
    open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
    joined = f"{TMP}{vid}-joined.mp4"
    run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", joined])
    total = dur(joined)
    music = f"{TMP}{vid}-music.wav"
    run(["python3", HERE + "music.py", mood, f"{total:.2f}", music])
    # overlays
    inputs = ["-i", joined, "-i", music]
    fc = []; last = "0:v"
    for j, (png, a, b) in enumerate(overlays):
        inputs += ["-loop", "1", "-t", f"{total:.2f}", "-i", png]
        k = j + 2
        fc.append(f"[{k}:v]format=rgba,fade=t=in:st={a}:d=0.18:alpha=1,fade=t=out:st={max(a, b-0.15)}:d=0.15:alpha=1[o{j}]")
        fc.append(f"[{last}][o{j}]overlay=0:0:enable='between(t,{a},{b})'[v{j}]"); last = f"v{j}"
    if orig_audio:
        fc.append(f"[1:a]volume={0.22*music_gain}[m];[0:a]volume=1.0[o];[o][m]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]")
    else:
        fc.append(f"[1:a]volume={music_gain},loudnorm=I=-15:TP=-1.5:LRA=11[a]")
    vmap = f"[{last}]" if overlays else "0:v"
    out = f"{OUT}{vid}.mp4"
    run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", ";".join(fc), "-map", vmap, "-map", "[a]",
         "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-profile:v", "high", "-pix_fmt", "yuv420p", "-r", str(FPS),
         "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-movflags", "+faststart", "-t", f"{total:.2f}", out])
    # portada: primer cuadro con gancho
    run(["ffmpeg", "-y", "-v", "error", "-ss", str(min(1.0, total/3)), "-i", out, "-frames:v", "1", "-q:v", "2", f"{OUT}{vid}-portada.jpg"])
    print(vid, f"{total:.1f}s")

def ov(name, fn, *a, **k):
    p = f"{TMP}ov-{name}.png"; fn(*a, out=p, **k); return p

def card(name, **k):
    p = f"{TMP}card-{name}.png"; gfx.endcard(out=p, **k); return p

CARD_COJIN = dict(kind="product", eyebrow="Cojín ergonómico en U", title="Más cómodo en la silla y en el auto",
                  price=P_COJIN, photo=COJIN_FOTO, sub="Gris o azul marino · funda lavable")
CARD_SOMNIA = dict(kind="product", eyebrow="Almohada Nekova Somnia", title="Dormí cómodo de costado o boca arriba",
                   price=P_SOMNIA, photo=SOMNIA_FOTO, sub="Espuma viscoelástica · funda lavable")
CARD_FOLLOW = dict(kind="follow", eyebrow="Seguinos en TikTok", title="Tips para estar *más cómodo* todos los días",
                   sub="Cojín para el día, almohada para la noche y tips de descanso", cta="Seguí a @nekova_ok", trust=False)
CARD_DUAL = dict(kind="dual", eyebrow="De día y de noche", title="Elegí el tuyo", photo=COJIN_FOTO, photo2=SOMNIA_FOTO,
                 name1="Cojín en U", name2="Almohada Somnia", price=P_COJIN, price2=P_SOMNIA)

def V(src, ss, d, **k): return dict(k="v", src=src, ss=ss, d=d, **k)
def Hz(src, ss, d, **k): return dict(k="h", src=src, ss=ss, d=d, **k)
def I(src, d, **k): return dict(k="img", src=src, d=d, **k)
def C(src, d=3.2): return dict(k="card", src=src, d=d)

COJ_H = A + "cojin-ortopedico.mp4"
ML_COJ = ML + "cojin/12-clip-vertical.mp4"
ML_SOM = ML + "somnia/10-clip-vertical.mp4"

def videos():
    bug = ov("bug", gfx.bug)
    v = {}
    # ---------- ADAPTADOS (los reels que mejor rindieron en Instagram) ----------
    v["tt01-somnia-mira-como-toma-forma"] = dict(
        segs=[V(IG + "reels-prueba/rp1-somnia-toma-forma.mp4", 0, 4.0, audio=True),
              V(IG + "reels-prueba/rp1-somnia-toma-forma.mp4", 7.3, 10.9, audio=True),
              C(card("somnia", **CARD_SOMNIA))],
        overlays=[], mood="calm", orig_audio=True)
    v["tt02-cojin-abrimos-uno"] = dict(
        segs=[V(IG + "reels-prueba/rp4-abrimos-un-cojin.mp4", 0, 7.9), C(card("cojin", **CARD_COJIN))],
        overlays=[], mood="warm")
    v["tt03-cojin-imagina-tu-silla"] = dict(
        segs=[V(IG + "reels-prueba/rp5-imagina-tu-silla.mp4", 0, 10.85), C(card("cojin", **CARD_COJIN))],
        overlays=[], mood="warm")
    v["tt04-cojin-ruta-larga"] = dict(
        segs=[V(IG + "reels-prueba/rp3-ruta-asiento-comodo.mp4", 0, 7.4),
              C(card("cojin-auto", **{**CARD_COJIN, "eyebrow": "Para los que manejan", "title": "Ruta larga, *asiento cómodo*"}))],
        overlays=[], mood="warm")
    v["tt05-cojin-pov-17hs"] = dict(
        segs=[V(IG + "reels-noviembre/r02-pov-17hs.mp4", 0.4, 1.7), V(IG + "reels-noviembre/r02-pov-17hs.mp4", 2.4, 6.9),
              C(card("cojin-pov", **{**CARD_COJIN, "title": "Terminá la jornada *sin pensar en la silla*"}))],
        overlays=[], mood="warm")
    # ---------- NUEVOS ----------
    # 06 · Conocé Nekova (marca + seguidores)
    h06 = ov("h06", gfx.hook, "Somos *Nekova*: cosas para estar más cómodo", "Ergonomía y descanso")
    v["tt06-conoce-nekova"] = dict(
        segs=[V(ML_COJ, 4.0, 2.2), V(ML_COJ, 12.2, 2.4), Hz(COJ_H, 36.0, 2.0, cx=0.45),
              V(ML_SOM, 14.6, 2.6), I(A + "product-media-almohada-vida-01.jpg", 2.2),
              C(card("follow", **CARD_FOLLOW), 3.4)],
        overlays=[(h06, 0, 2.2),
                  (ov("p06a", gfx.hook, "De día: *cojín en U*", None), 2.2, 6.6),
                  (ov("p06b", gfx.hook, "De noche: *almohada Somnia*", None), 6.6, 11.4),
                  (bug, 0, 11.4)],
        mood="bright")
    # 07 · Somnia ¿Dormís de costado? (anuncio)
    v["tt07-somnia-dormis-de-costado"] = dict(
        segs=[I(A + "product-media-almohada-vida-01.jpg", 2.3), I(A + "product-media-almohada-vida-02.jpg", 2.0),
              V(ML_SOM, 14.0, 3.2), I(SOMNIA_FOTO, 2.4, z=0.0018), C(card("somnia", **CARD_SOMNIA))],
        overlays=[(ov("h07", gfx.hook, "¿Dormís *de costado*?", "Almohada Nekova Somnia"), 0, 2.3),
                  (ov("p07a", gfx.hook, "¿O *boca arriba*?", None), 2.3, 4.3),
                  (ov("p07b", gfx.hook, "Espuma que *toma tu forma*", None), 4.3, 7.5),
                  (ov("p07c", gfx.hook, "Una zona *para cada postura*", None), 7.5, 9.9),
                  (bug, 0, 9.9)],
        mood="calm")
    # 08 · Cojín en 10 segundos (anuncio de conversión)
    v["tt08-cojin-8-horas-sentado"] = dict(
        segs=[Hz(COJ_H, 27.0, 1.8, cx=0.42), Hz(COJ_H, 13.6, 2.0, cx=0.6), Hz(COJ_H, 19.6, 1.8, cx=0.75),
              Hz(COJ_H, 22.6, 1.6, cx=0.55), Hz(COJ_H, 36.2, 1.8, cx=0.45), C(card("cojin", **CARD_COJIN))],
        overlays=[(ov("h08", gfx.hook, "¿8 horas *sentado*?", "Cojín ergonómico en U"), 0, 1.8),
                  (ov("p08a", gfx.hook, "Espuma que *vuelve a su forma*", None), 1.8, 3.8),
                  (ov("p08b", gfx.hook, "Funda *lavable* con cierre", None), 3.8, 5.6),
                  (ov("p08c", gfx.hook, "Viscoelástica *por dentro*", None), 5.6, 7.2),
                  (ov("p08d", gfx.hook, "Oficina, auto *o tu casa*", None), 7.2, 9.0),
                  (bug, 0, 9.0)],
        mood="warm")
    # 09 · Día y noche (los dos productos)
    v["tt09-dia-y-noche"] = dict(
        segs=[V(ML_COJ, 12.4, 2.2), Hz(COJ_H, 38.0, 2.0, cx=0.5), V(ML_SOM, 15.4, 2.4),
              I(A + "product-media-almohada-vida-02.jpg", 2.0), C(card("dual", **CARD_DUAL), 3.6)],
        overlays=[(ov("h09", gfx.hook, "Tu día *sentado*. Tu noche *durmiendo*.", "Nekova"), 0, 2.2),
                  (ov("p09a", gfx.hook, "Cojín en U para *la silla y el auto*", None), 2.2, 4.2),
                  (ov("p09b", gfx.hook, "Somnia para *dormir cómodo*", None), 4.2, 8.6),
                  (bug, 0, 8.6)],
        mood="bright")
    # 10 · Escritorio en 5 pasos (valor / seguidores)
    tips = ["Pantalla a la *altura de los ojos*", "Codos en *ángulo recto*", "Pies *bien apoyados*",
            "Sumale *apoyo* al asiento", "Pausa *cada hora*"]
    tsegs = [Hz(COJ_H, 28.6, 1.9, cx=0.5), Hz(COJ_H, 30.3, 1.9, cx=0.3), Hz(COJ_H, 29.0, 1.9, cx=0.7),
             Hz(COJ_H, 26.9, 1.9, cx=0.45), Hz(COJ_H, 31.4, 1.9, cx=0.5)]
    ovs = [(ov("h10", gfx.hook, "Tu escritorio más cómodo en *5 pasos*", "Guardalo"), 0, 1.8)]
    t = 1.8
    for n, tip in enumerate(tips, 1):
        ovs.append((ov(f"n10-{n}", gfx.number, n, tip), t, t + 1.9)); t += 1.9
    ovs.append((bug, 0, t))
    v["tt10-escritorio-5-pasos"] = dict(
        segs=[V(ML_COJ, 12.2, 1.8)] + tsegs + [C(card("follow10", **{**CARD_FOLLOW, "eyebrow": "¿Te sirvió? Seguinos"}), 3.4)],
        overlays=ovs, mood="warm")
    return v

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True); os.makedirs(TMP, exist_ok=True)
    allv = videos()
    want = sys.argv[1:] or list(allv)
    for vid, cfg in allv.items():
        if any(vid.startswith(w) for w in want):
            build(vid, cfg["segs"], cfg["overlays"], cfg["mood"], cfg.get("orig_audio", False))
