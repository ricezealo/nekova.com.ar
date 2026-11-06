"""Placas y textos de los videos TikTok de Nekova (PIL). Zona segura TikTok 1080x1920:
arriba quedan libres ~200 px (pestañas), abajo ~480 px (descripción/usuario), a la derecha ~150 px (botones)."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import re

W, H = 1080, 1920
BLUE = (47, 91, 255); INK = (20, 22, 26); GREY = (91, 98, 112); SOFT = (234, 240, 255); WHITE = (255, 255, 255)
FD = "/usr/share/fonts/truetype/google-fonts/"
def F(size, w="Bold"): return ImageFont.truetype(FD + f"Poppins-{w}.ttf", size)
import os
ROOT = os.environ.get("NEKOVA_ROOT", "/mnt/user-data/uploads/nekova.com.ar/").rstrip("/") + "/"
LOGO_W = ROOT + "marca/plantillas/nekova-texto-blanco.png"
LOGO_C = ROOT + "marca/plantillas/nekova-texto-carbon.png"

def logo(path, width):
    im = Image.open(path).convert("RGBA")
    bb = im.getbbox(); im = im.crop(bb)
    return im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)

def runs(text):
    """'Texto *resaltado*' -> [(texto, resaltado?)]"""
    out = []
    for i, part in enumerate(re.split(r"\*", text)):
        if part: out.append((part, i % 2 == 1))
    return out

def wrap(text, font, maxw, d):
    """Cada palabra es una lista de segmentos (texto, resaltado); '*' alterna el resaltado."""
    words, hl = [], False
    for raw in text.split(" "):
        segs, buf = [], ""
        for ch in raw:
            if ch == "*":
                if buf: segs.append((buf, hl)); buf = ""
                hl = not hl
            else: buf += ch
        if buf: segs.append((buf, hl))
        if segs: words.append(segs)
    def txt(ws): return " ".join("".join(t for t, _ in w) for w in ws)
    lines, cur = [], []
    for w in words:
        if cur and d.textlength(txt(cur + [w]), font=font) > maxw:
            lines.append(cur); cur = [w]
        else: cur.append(w)
    if cur: lines.append(cur)
    return lines

def line_text(ln): return " ".join("".join(t for t, _ in w) for w in ln)

def draw_lines(d, lines, font, x, y, color, hl_color, lh, align="left", cx=None):
    for ln in lines:
        lw = d.textlength(line_text(ln), font=font)
        xx = (cx - lw / 2) if align == "center" else x
        for i, w in enumerate(ln):
            for t, hl in w:
                d.text((xx, y), t, font=font, fill=hl_color if hl else color)
                xx += d.textlength(t, font=font)
            if i < len(ln) - 1: xx += d.textlength(" ", font=font)
        y += lh
    return y

def shadow_card(base, box, radius, fill=WHITE, blur=26, alpha=70):
    x0, y0, x1, y1 = box
    sh = Image.new("RGBA", base.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle((x0, y0 + 14, x1, y1 + 14), radius, fill=(0, 0, 0, alpha))
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(sh)
    ImageDraw.Draw(base).rounded_rectangle(box, radius, fill=fill)

def hook(text, eyebrow=None, y=320, size=74, out=None, maxw=820):
    """Tarjeta blanca grande arriba (gancho de los primeros segundos)."""
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    f = F(size); fe = F(26)
    lines = wrap(text, f, maxw, d); lh = round(size * 1.18)
    pad = 46; eh = 52 if eyebrow else 0
    widest = max(d.textlength(line_text(ln), font=f) for ln in lines)
    if eyebrow: widest = max(widest, d.textlength("— " + eyebrow.upper(), font=fe) * 1.12)
    cw = min(maxw, widest) + pad * 2; ch = eh + lh * len(lines) + pad * 2 - (lh - size) + 8
    x0 = (W - cw) / 2 - 20; box = (x0, y, x0 + cw, y + ch)
    shadow_card(im, box, 38)
    d = ImageDraw.Draw(im)
    ty = y + pad - 6
    if eyebrow:
        d.text((x0 + pad, ty), "— " + " ".join(eyebrow.upper()), font=fe, fill=BLUE); ty += eh
    draw_lines(d, lines, f, x0 + pad, ty, INK, BLUE, lh)
    if out: im.save(out)
    return im

def pill(text, y=1150, size=50, out=None, dark=False):
    """Subtítulo tipo píldora en el medio de la pantalla."""
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    f = F(size); lines = wrap(text, f, 800, d); lh = round(size * 1.25)
    widest = max(d.textlength(line_text(ln), font=f) for ln in lines)
    pw, ph = widest + 84, lh * len(lines) + 44
    x0 = (W - pw) / 2 - 20
    shadow_card(im, (x0, y, x0 + pw, y + ph), 34, fill=INK if dark else WHITE, alpha=60)
    d = ImageDraw.Draw(im)
    draw_lines(d, lines, f, 0, y + 18, WHITE if dark else INK, (140, 170, 255) if dark else BLUE, lh, "center", x0 + pw / 2)
    if out: im.save(out)
    return im

def number(n, text, out=None):
    """Tip numerado grande (para el video educativo)."""
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    f = F(70); lines = wrap(text, f, 720, d); lh = 84
    ch = 230 + lh * len(lines) + 40
    box = (70, 260, 930, 260 + ch)
    shadow_card(im, box, 40)
    d = ImageDraw.Draw(im)
    d.text((118, 268), str(n), font=F(180), fill=BLUE)
    draw_lines(d, lines, f, 118, 490, INK, BLUE, lh)
    if out: im.save(out)
    return im

def bug(out=None):
    """Logo chico arriba a la derecha (con margen, fuera de los íconos de TikTok)."""
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    lg = logo(LOGO_C, 170)
    pw, ph = lg.width + 48, lg.height + 30
    x0 = W - 70 - pw; y0 = 205
    shadow_card(im, (x0, y0, x0 + pw, y0 + ph), ph // 2, alpha=45, blur=14)
    im.alpha_composite(lg, (x0 + 24, y0 + 15))
    if out: im.save(out)
    return im

def product_photo(path, size):
    from PIL import ImageOps
    im = Image.open(path).convert("RGB")
    inv = ImageOps.invert(im).convert("L").point(lambda v: 255 if v > 18 else 0)
    bb = inv.getbbox()
    if bb: im = im.crop((max(0, bb[0]-20), max(0, bb[1]-20), min(im.width, bb[2]+20), min(im.height, bb[3]+20)))
    im.thumbnail((size, size), Image.LANCZOS)
    return im

def _bg_blue():
    im = Image.new("RGBA", (W, H), BLUE + (255,))
    d = ImageDraw.Draw(im)
    # forma de marca suave abajo a la derecha (como en las placas existentes)
    d.rounded_rectangle((640, 1460, 1260, 2300), 300, fill=(70, 110, 255, 255))
    d.rounded_rectangle((820, 1640, 900, 2300), 40, fill=BLUE + (255,))
    return im

def endcard(kind, out, eyebrow="", title="", sub="", price=None, photo=None, cta="Comprá en nekova.com.ar",
            photo2=None, price2=None, name1="", name2="", trust=True):
    bg = _bg_blue()
    im = Image.new("RGBA", (W, 2600), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    lg = logo(LOGO_W, 300); im.alpha_composite(lg, ((W - lg.width) // 2 - 20, 0))
    cx = W // 2 - 20
    y = 150
    if kind in ("product", "dual"):
        # tarjeta blanca con la foto del producto
        cw, chh = (720, 370) if kind == "product" else (760, 450)
        box = (cx - cw // 2, y, cx + cw // 2, y + chh)
        shadow_card(im, box, 44, alpha=60)
        if kind == "product":
            ph = product_photo(photo, 520)
            im.alpha_composite(ph.convert("RGBA"), (cx - ph.width // 2, y + (chh - ph.height) // 2))
        else:
            for i, (p, nm, pr) in enumerate(((photo, name1, price), (photo2, name2, price2))):
                ph = product_photo(p, 310)
                px = cx - cw // 2 + 40 + i * 350
                im.alpha_composite(ph.convert("RGBA"), (px + 165 - ph.width // 2, y + 30 + (290 - ph.height) // 2))
                d = ImageDraw.Draw(im)
                tw = d.textlength(nm, font=F(30)); d.text((px + 165 - tw / 2, y + 340), nm, font=F(30), fill=INK)
                if pr:
                    tw = d.textlength(pr, font=F(40)); d.text((px + 165 - tw / 2, y + 384), pr, font=F(40), fill=BLUE)
        y += chh + 40
    d = ImageDraw.Draw(im)
    if eyebrow:
        t = "— " + " ".join(eyebrow.upper()); fe = F(26)
        d.text((cx - d.textlength(t, font=fe) / 2, y), t, font=fe, fill=(205, 218, 255)); y += 56
    if title:
        ft = F(64 if kind != "follow" else 86); lh = 78 if kind != "follow" else 104
        lines = wrap(title, ft, 860, d)
        y = draw_lines(d, lines, ft, 0, y, WHITE, (205, 222, 255), lh, "center", cx) + 24
    if price and kind == "product":
        fp = F(78); tw = d.textlength(price, font=fp); d.text((cx - tw / 2, y - 4), price, font=fp, fill=WHITE); y += 104
    if sub:
        fs = F(34, "Medium"); lines = wrap(sub, fs, 820, d)
        y = draw_lines(d, lines, fs, 0, y + 6, (225, 232, 255), WHITE, 46, "center", cx) + 22
    if cta:
        fc = F(42); tw = d.textlength(cta, font=fc); pw = tw + 100
        d.rounded_rectangle((cx - pw / 2, y, cx + pw / 2, y + 104), 52, fill=WHITE)
        d.text((cx - tw / 2, y + 24), cta, font=fc, fill=BLUE); y += 134
    if trust:
        ft2 = F(28, "Medium"); t = "Envío a todo el país  ·  10 días para devolverlo"
        tw = d.textlength(t, font=ft2); d.text((cx - tw / 2, y), t, font=ft2, fill=(225, 232, 255)); y += 40
    top = 215 + max(0, (1215 - y) // 2)   # centrado dentro de la zona segura (250..1430)
    bg.alpha_composite(im.crop((0, 0, W, H - top)), (0, top))
    bg.convert("RGB").save(out)
    return top + y
