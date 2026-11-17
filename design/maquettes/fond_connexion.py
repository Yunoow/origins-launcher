#!/usr/bin/env python3
"""Fond de l'écran de connexion du launcher Origins, thème Or et ébène (Yunoow, 17/11/2026 : « on n'a pas d'image »).

Tout est calculé ici, sans image venue d'ailleurs : ciel, lueur dorée à l'horizon, lune, dragon au loin, nuages,
montagnes dans la brume, château sur la falaise de gauche, sapins, braises. Le milieu reste calme : la carte de
connexion s'y pose, la lueur fait un halo autour.

    python3 fond_connexion.py          # 2560 × 1440 : fond-connexion.png et fond-connexion.jpg
    python3 fond_connexion.py 0.5      # aperçu en 1280 × 720 : apercu-fond.jpg
"""
import random
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy.ndimage import gaussian_filter

S = float(sys.argv[1]) if len(sys.argv) > 1 else 1.0
W, H = int(2560 * S), int(1440 * S)
YY, XX = np.mgrid[0:H, 0:W].astype(np.float32)
X, Y = XX / W, YY / H


def c(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32) / 255


def lisse(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def flou(a, sigma):
    """Flou gaussien ; les grands rayons passent par une image réduite (beaucoup plus rapide)."""
    if a.ndim == 3:
        return np.stack([flou(a[..., k], sigma) for k in range(a.shape[2])], -1)
    if sigma < 12:
        return gaussian_filter(a, sigma)
    f = sigma / 6
    h, w = a.shape
    petit = np.asarray(Image.fromarray(a.astype(np.float32)).resize((max(2, int(w / f)), max(2, int(h / f))), Image.BOX))
    return np.asarray(Image.fromarray(gaussian_filter(petit, 6.0)).resize((w, h), Image.BICUBIC))


def bruit(cx, cy, graine):
    r = np.random.default_rng(graine)
    gw, gh = int(W / cx) + 4, int(H / cy) + 4
    g = r.random((gh, gw), dtype=np.float32)
    grand = np.asarray(Image.fromarray(g).resize((int(gw * cx), int(gh * cy)), Image.BICUBIC))
    return grand[int(cy):int(cy) + H, int(cx):int(cx) + W]


def fbm(cx, cy, octaves, graine, persistance=0.5):
    """Bruit fractal 0..1 ; cx, cy : taille de la plus grosse cellule, en pixels de l'image finale à 2560."""
    total, amp, somme = np.zeros((H, W), np.float32), 1.0, 0.0
    for o in range(octaves):
        a, b = cx * S / 2 ** o, cy * S / 2 ** o
        if min(a, b) < 1.5:
            break
        total += amp * bruit(a, b, graine * 31 + o)
        somme += amp
        amp *= persistance
    total /= somme
    lo, hi = np.percentile(total, 0.5), np.percentile(total, 99.5)
    return np.clip((total - lo) / (hi - lo), 0, 1)


def detail(graine, echelles=(260, 130, 64, 32, 16, 8, 4), persistance=0.55):
    """Ligne de crête fractale, -1..1 : des segments droits à toutes les échelles, comme de la roche."""
    r = np.random.default_rng(graine)
    x = np.arange(W) / S
    total, amp, somme = np.zeros(W), 1.0, 0.0
    for e in echelles:
        n = int(2560 / e) + 3
        total += amp * np.interp(x / e, np.arange(n), r.uniform(-1, 1, n))
        somme += amp
        amp *= persistance
    return total / somme


def crete(points, amplitude, graine, calme=None):
    xs, ys = zip(*points)
    base = np.interp(np.arange(W) / W, xs, ys) * H
    d = detail(graine) * amplitude * S
    if calme is not None:
        d *= calme
    return base + d


def masque_sous(crete_y):
    return np.clip(YY + 0.5 - crete_y[None, :], 0, 1)


def polygones(listes, echelle=1.0, decalage=(0, 0), sur=4):
    """Masque anti-crénelé de polygones donnés en pixels de l'image à 2560 (dessinés 4 fois plus grands puis réduits)."""
    im = Image.new("L", (W * sur, H * sur), 0)
    d = ImageDraw.Draw(im)
    for pts in listes:
        d.polygon([((decalage[0] + x * echelle) * S * sur, (decalage[1] + y * echelle) * S * sur) for x, y in pts], fill=255)
    return np.asarray(im.resize((W, H), Image.BOX), np.float32) / 255


def poser(fond, couleur, alpha):
    return fond * (1 - alpha[..., None]) + couleur * alpha[..., None]


# ------------------------------------------------------------------ formes : dragon, château, sapins
def catmull(points, par_segment=24):
    P = np.array(points, float)
    P = np.vstack([P[0] * 2 - P[1], P, P[-1] * 2 - P[-2]])
    morceaux = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        t = np.linspace(0, 1, par_segment, endpoint=False)[:, None]
        morceaux.append(0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t ** 2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3))
    morceaux.append(P[-2][None])
    return np.vstack(morceaux)


def effile(points, largeurs, par_segment=24):
    """Contour d'un trait qui s'affine : ligne lissée par les points, demi-largeur donnée à chaque point."""
    ligne = catmull(points, par_segment)
    k = np.arange(len(ligne)) / par_segment
    w = np.interp(k, np.arange(len(points)), largeurs)
    t = np.gradient(ligne, axis=0)
    t /= np.linalg.norm(t, axis=1, keepdims=True) + 1e-9
    n = np.stack([-t[:, 1], t[:, 0]], 1)
    return [tuple(p) for p in ligne + n * w[:, None]] + [tuple(p) for p in (ligne - n * w[:, None])[::-1]], ligne, n, w


def bezier(a, b, ctrl, n=10):
    t = np.linspace(0, 1, n)[1:-1, None]
    a, b, ctrl = map(np.array, (a, b, ctrl))
    return [tuple(p) for p in (1 - t) ** 2 * a + 2 * (1 - t) * t * ctrl + t ** 2 * b]


def aile(epaule, coude, poignet, bouts, hanche, tirage=0.3):
    """Aile de chauve-souris : bord d'attaque épaule → coude → poignet, doigts jusqu'aux bouts, membrane festonnée."""
    contour = [epaule, coude, poignet, bouts[0]]
    for a, b in zip(bouts, bouts[1:] + [hanche]):
        m = (np.array(a) + np.array(b)) / 2
        cible = np.array(poignet) if b != hanche else np.array([(poignet[0] + hanche[0]) / 2, (poignet[1] + hanche[1]) / 2])
        contour += bezier(a, b, m + (cible - m) * tirage) + [b]
    formes = [contour]
    formes.append(effile([epaule, coude, poignet], [5.5, 4.5, 4])[0])
    for bout in bouts:
        formes.append(effile([poignet, bout], [3.2, 0.8], 12)[0])
    formes.append([poignet, (poignet[0] - 11, poignet[1] - 7), (poignet[0] - 3, poignet[1] + 2)])  # griffe du pouce
    return formes


def dragon():
    """Dragon en vol vers la gauche, ailes levées. Repère : x vers la droite, y vers le bas, unités ~ pixels."""
    corps_pts = [(-118, -30), (-100, -20), (-78, -8), (-50, 2), (-15, 8), (20, 6), (55, -4), (95, -14), (135, -8), (170, 8), (200, 12), (228, 2)]
    corps_l = [8, 9.5, 12, 16, 18, 15, 11, 8, 6, 4.5, 3, 1.2]
    corps, ligne, normales, larg = effile(corps_pts, corps_l)
    pres = [corps]
    pres.append([(-112, -38), (-124, -44), (-140, -43), (-156, -38), (-170, -33), (-179, -29), (-177, -25), (-166, -22), (-150, -21), (-134, -19), (-118, -20)])
    pres.append([(-128, -42), (-120, -60), (-104, -75), (-112, -58), (-119, -41)])  # cornes
    pres.append([(-139, -43), (-135, -57), (-126, -66), (-130, -54), (-132, -42)])
    pres.append([(218, 2), (231, -9), (247, 1), (231, 12)])  # pointe de la queue
    for i in range(len(ligne) // 24 * 2, len(ligne) - 40, 9):  # piques le long du dos
        p, n, w = ligne[i], normales[i], larg[i]
        if n[1] > 0:
            n = -n
        t = np.array([-n[1], n[0]])
        if t[0] < 0:
            t = -t
        h = 4 + w * 0.45
        pres.append([tuple(p + n * w * 0.8 - t * h * 0.6), tuple(p + n * (w + h) + t * h * 0.5), tuple(p + n * w * 0.8 + t * h * 0.7)])
    pres.append(effile([(-40, 10), (-33, 25), (-43, 35), (-54, 37)], [7, 5, 3.5, 1.4])[0])  # pattes repliées
    pres.append(effile([(28, 8), (41, 25), (31, 37), (19, 40)], [9, 6, 4, 1.4])[0])
    pres += aile((-46, -6), (-66, -66), (-30, -128), [(-6, -205), (52, -192), (104, -152), (132, -98)], (44, 0), 0.36)
    loin = aile((-62, -14), (-104, -58), (-96, -118), [(-158, -166), (-122, -198), (-72, -202), (-34, -176)], (-4, -10), 0.36)
    return pres, loin


def chateau():
    """Château sur le plateau de la falaise de gauche (pixels de l'image à 2560). Renvoie silhouettes et fenêtres."""
    formes = [[(112, 515), (288, 515), (288, 600), (112, 600)]]
    formes += [[(x, 503), (x + 9, 503), (x + 9, 516), (x, 516)] for x in range(112, 282, 17)]
    formes += [[(118, 445), (146, 445), (146, 600), (118, 600)], [(113, 436), (151, 436), (151, 448), (113, 448)],
               [(110, 438), (132, 384), (154, 438)]]
    formes += [[(168, 372), (214, 372), (214, 600), (168, 600)], [(159, 378), (191, 288), (223, 378)],
               [(190, 262), (192.5, 262), (192.5, 292), (190, 292)], [(192, 264), (214, 271), (192, 278)]]
    formes += [[(244, 420), (268, 420), (268, 600), (244, 600)], [(238, 424), (256, 366), (274, 424)]]
    formes += [[(214, 402), (227, 402), (227, 440), (214, 440)], [(211, 404), (220.5, 376), (230, 404)],
               [(214, 440), (227, 440), (214, 454)]]
    fenetres = [(186, 395, 192, 407), (186, 425, 192, 437), (199, 470, 204, 481), (180, 500, 186, 511), (129, 470, 134, 479),
                (129, 505, 134, 514), (253, 450, 258, 459), (253, 490, 258, 499), (231, 535, 236, 545), (150, 535, 156, 545)]
    return formes, [[(a, b), (c_, b), (c_, d), (a, d)] for a, b, c_, d in fenetres]


def sapin(cx, base, h, graine):
    r = random.Random(graine)
    etages = r.randint(5, 7)
    droite, gauche = [], []
    for k in range(etages):
        t = (k + 1) / etages
        y = base - h + h * 0.9 * t
        w = h * 0.27 * t ** 0.85 * r.uniform(0.85, 1.12)
        droite += [(cx + w, y)] + ([(cx + w * 0.38, y - h * 0.035)] if k < etages - 1 else [])
        gauche += [(cx - w * r.uniform(0.9, 1.1), y)] + ([(cx - w * 0.38, y - h * 0.035)] if k < etages - 1 else [])
    tronc = h * 0.035
    yb = base - h + h * 0.9
    return [(cx, base - h)] + droite + [(cx + tronc, yb), (cx + tronc, base + 8), (cx - tronc, base + 8), (cx - tronc, yb)] + gauche[::-1]


# ------------------------------------------------------------------ le tableau, du fond vers l'avant
LUEUR_X, LUEUR_Y = 0.5, 0.665
d_lueur = np.sqrt(((X - LUEUR_X) / 0.46) ** 2 + ((Y - LUEUR_Y) / 0.30) ** 2)
pres_lueur = np.exp(-((X - LUEUR_X) / 0.33) ** 2)                      # proximité horizontale de la lueur

# Ciel : ébène en haut, brun chaud vers l'horizon, lueur dorée au centre.
t = np.clip(Y / 0.68, 0, 1)[..., None]
haut_ = np.clip(t / 0.55, 0, 1) ** 1.2
bas_ = np.clip((t - 0.55) / 0.45, 0, 1) ** 1.6
img = np.where(t < 0.55, c("#050302") + (c("#140c06") - c("#050302")) * haut_,
               c("#140c06") + (c("#4d2a0e") - c("#140c06")) * bas_)
coeur = np.exp(-d_lueur ** 2 * 2.6)
large = np.exp(-d_lueur * 1.5)
img = img + c("#f3c26a")[None, None] * (coeur * 0.85)[..., None] + c("#a85a22")[None, None] * (large * 0.28)[..., None]

# Rayons qui montent de la lueur.
angle = np.arctan2(YY - LUEUR_Y * H, XX - LUEUR_X * W)
ray = 0.5 + 0.22 * np.sin(angle * 13 + 0.7) + 0.18 * np.sin(angle * 29 + 2.1) + 0.12 * np.sin(angle * 53 + 4.0)
rayons = lisse(0.6, 0.95, ray) * np.exp(-np.hypot(XX - LUEUR_X * W, YY - LUEUR_Y * H) / (620 * S)) * (Y < LUEUR_Y)
img += c("#f0b860")[None, None] * (flou(rayons.astype(np.float32), 3 * S) * 0.09)[..., None]

# Étoiles, plus nombreuses en haut, effacées par la lueur.
r = np.random.default_rng(3)
n = int(1100 * S * S) + 250
ex, ey = r.uniform(0, W - 1, n), H * 0.62 * r.random(n) ** 1.6
eclat = r.random(n) ** 7 * 1.5 + 0.06
etoiles = np.zeros((H, W), np.float32)
np.add.at(etoiles, (ey.astype(int), ex.astype(int)), eclat)
etoiles = flou(etoiles, 0.6 * S + 0.25) * 5 * (1 - np.clip(coeur * 1.6, 0, 1))
img += c("#fff1d6")[None, None] * etoiles[..., None]

# Lune et son halo.
LX, LY, LR = 0.8 * W, 0.235 * H, 150 * S
d_lune = np.hypot(XX - LX, YY - LY)
disque = np.clip(LR - d_lune + 0.5, 0, 1)
mers = lisse(0.5, 0.75, fbm(70, 70, 5, 21)) * 0.32
bord = 0.82 + 0.18 * np.sqrt(np.clip(1 - (d_lune / LR) ** 2, 0, 1))
lune = (c("#f6e6bd")[None, None] * (1 - mers)[..., None] + c("#c9ad7b")[None, None] * mers[..., None]) * bord[..., None]
img = poser(img, lune, disque)
halo = np.exp(-np.clip(d_lune - LR, 0, None) / (34 * S)) * 0.30 + np.exp(-np.clip(d_lune - LR, 0, None) / (260 * S)) * 0.16
img += c("#f2c879")[None, None] * (halo * (1 - disque))[..., None]
pres_lune = np.exp(-np.clip(d_lune - LR, 0, None) / (180 * S))

# Nuages hauts, en traînées : sombres, bords inférieurs éclairés par la lueur et la lune.
def nuages(cx, cy, graine, y0, y1, y2, y3, seuil, opacite, teinte_sombre, force_lumiere):
    nn = fbm(cx, cy, 6, graine)
    dens = lisse(seuil, seuil + 0.28, nn) * lisse(y0, y1, Y) * (1 - lisse(y2, y3, Y))
    k = max(1, int(12 * S))
    dessous = np.clip((nn - np.roll(nn, -k, axis=0)) * 7, 0, 1)
    lumiere = dessous * (pres_lueur * lisse(0.1, 0.6, Y) * 0.9 + pres_lune * 0.8) * force_lumiere
    return dens * opacite, lumiere * dens


dens, lum = nuages(560, 70, 11, 0.05, 0.16, 0.40, 0.52, 0.5, 0.88, "#1b120b", 1.0)
img = poser(img, c("#1b120b"), dens)
img += c("#e9b562")[None, None] * (lum * 0.75)[..., None]

# Dragon au loin, devant la lune.
pres, loin = dragon()
OX, OY, ECH = 2004, 402, 0.8
m_loin = polygones(loin, ECH, (OX, OY))
m_pres = polygones(pres, ECH, (OX, OY))
img = poser(img, c("#24160b"), m_loin * 0.95)
img = poser(img, c("#0a0705"), m_pres)
liseré = np.clip(m_pres - flou(m_pres, 1.6 * S), 0, 1) * np.clip(disque * 1.0 + pres_lune * 0.5, 0, 1)
img += c("#ffd98f")[None, None] * (liseré * 0.55)[..., None]

# Nuages bas derrière les montagnes, dorés par la lueur.
dens, lum = nuages(420, 64, 17, 0.36, 0.48, 0.62, 0.70, 0.46, 0.75, "#3a2414", 1.4)
couleur_bas = c("#3a2414")[None, None] * (1 - pres_lueur[..., None] * 0.2) + c("#b77a35")[None, None] * (pres_lueur * 0.55)[..., None]
img = img * (1 - dens[..., None]) + couleur_bas * dens[..., None]
img += c("#f5c46e")[None, None] * (lum * 0.9)[..., None]


def montagnes(y_crete, sombre, brume, force_brume, liseré_force, liseré_px, texture_graine):
    m = masque_sous(y_crete)
    dessous = np.clip((YY - y_crete[None, :]) / (H * 0.16), 0, 1)
    tex = (fbm(90, 140, 5, texture_graine) - 0.5) * 0.10
    couleur = sombre[None, None] * (1 + tex[..., None]) * (1 + 0.25 * pres_lueur[..., None])
    couleur = couleur + (brume[None, None] - couleur) * (force_brume * dessous ** 0.8 * (0.25 + 0.75 * pres_lueur))[..., None]
    lis = np.exp(-np.clip(YY - y_crete[None, :], 0, None) / (liseré_px * S)) * (0.25 + 0.75 * pres_lueur) * liseré_force
    couleur = couleur + c("#f7c977")[None, None] * lis[..., None]
    return m, couleur


def brume(y0, y1, y2, y3, teinte_bord, teinte_centre, opacite, graine):
    voile = fbm(700, 90, 5, graine)
    a = lisse(y0, y1, Y) * (1 - lisse(y2, y3, Y)) * (0.12 + 0.88 * voile ** 1.6) * opacite
    teinte = c(teinte_bord)[None, None] * (1 - pres_lueur[..., None]) + c(teinte_centre)[None, None] * pres_lueur[..., None]
    return a, teinte


loin_y = crete([(0, 0.585), (0.06, 0.545), (0.14, 0.58), (0.22, 0.525), (0.3, 0.6), (0.38, 0.585), (0.45, 0.635),
                (0.5, 0.648), (0.56, 0.625), (0.63, 0.585), (0.7, 0.55), (0.78, 0.6), (0.86, 0.56), (0.93, 0.595), (1, 0.57)], 16, 41)
m, col = montagnes(loin_y, c("#2b190b"), c("#b97f36"), 0.7, 0.85, 3.0, 42)
img = poser(img, flou(col, 0.8 * S), flou(m, 0.6 * S))
a, teinte = brume(0.6, 0.67, 0.72, 0.8, "#2e1b0c", "#c3893d", 0.62, 43)
img = poser(img, teinte, a)

milieu_y = crete([(0, 0.56), (0.05, 0.505), (0.12, 0.6), (0.2, 0.655), (0.28, 0.63), (0.36, 0.695), (0.44, 0.715),
                  (0.5, 0.73), (0.58, 0.71), (0.66, 0.675), (0.72, 0.615), (0.8, 0.655), (0.88, 0.6), (0.95, 0.635), (1, 0.6)], 24, 51)
m, col = montagnes(milieu_y, c("#140b05"), c("#6a4019"), 0.6, 0.6, 2.2, 52)
img = poser(img, col, m)
a, teinte = brume(0.71, 0.79, 0.86, 0.95, "#1d1108", "#8a5823", 0.55, 53)
img = poser(img, teinte, a)

# Premier plan : falaise à gauche (le château dessus), pente à droite (les sapins), sombres.
calme = 1 - 0.85 * np.exp(-((np.arange(W) / W - 0.15) / 0.04) ** 4)
pres_y = crete([(0, 0.56), (0.03, 0.52), (0.06, 0.49), (0.085, 0.45), (0.105, 0.41), (0.118, 0.398), (0.183, 0.398),
                (0.198, 0.412), (0.212, 0.455), (0.225, 0.5), (0.236, 0.53), (0.25, 0.54), (0.262, 0.56), (0.272, 0.62),
                (0.282, 0.7), (0.295, 0.8), (0.31, 0.9), (0.33, 1.0), (0.36, 1.08), (0.5, 1.1), (0.6, 1.06), (0.64, 0.98), (0.68, 0.9),
                (0.72, 0.83), (0.745, 0.802), (0.77, 0.796), (0.8, 0.75), (0.84, 0.69), (0.88, 0.655), (0.92, 0.63),
                (0.97, 0.61), (1, 0.6)], 18, 61, calme)
formes_chateau, fenetres = chateau()
formes_chateau = [[(x + 200, y) for x, y in f] for f in formes_chateau]   # loin du bord : jamais coupé, même fenêtre étroite
fenetres = [[(x + 200, y) for x, y in f] for f in fenetres]
r = random.Random(8)
arbres = []
for _ in range(24):
    x = r.uniform(0.665, 1.0) * 2560
    arbres.append(sapin(x, np.interp(x / 2560, np.arange(W) / W, pres_y) / S + 6, r.uniform(55, 150) * (0.8 + 0.5 * (x / 2560 - 0.66)), r.random()))
for _ in range(11):
    x = r.uniform(0.2, 0.29) * 2560
    arbres.append(sapin(x, np.interp(x / 2560, np.arange(W) / W, pres_y) / S + 5, r.uniform(45, 105), r.random()))
silhouettes = np.maximum(masque_sous(pres_y), polygones(formes_chateau + arbres))
pres_couleur = c("#080503")[None, None] * (1 + 0.5 * pres_lueur[..., None] * (1 - Y[..., None]))
lis = np.clip(silhouettes - flou(silhouettes, 2.2 * S), 0, 1) * (0.2 + 0.8 * pres_lueur) * 0.45
img = poser(img, pres_couleur, silhouettes)
img += c("#e7ad5a")[None, None] * lis[..., None]

fen = polygones(fenetres)
img += c("#ffd27a")[None, None] * fen[..., None] * 1.1 + c("#ff9a3c")[None, None] * flou(fen, 5 * S)[..., None] * 2.2

# Brume au ras du sol, devant.
a, teinte = brume(0.86, 0.98, 1.2, 1.3, "#120b05", "#3a220d", 0.4, 71)
img = poser(img, teinte, a)

# Braises qui montent, poussées un peu vers la droite : traînées étirées avec leur lueur, quelques grosses floues devant.
r = np.random.default_rng(5)
braises = np.zeros((H, W), np.float32)
grosses = np.zeros((H, W), np.float32)
n = 130
bx = r.uniform(0, W, n)
by = H * (0.34 + 0.66 * r.beta(2.0, 1.0, n))
for i in range(n):
    if bx[i] < 0.23 * W and by[i] < 0.5 * H:          # pas sur le château : on les prendrait pour des fenêtres
        continue
    if r.random() < 0.92:
        sx, sy, force, couche = r.uniform(1.1, 2.4) * S, 0, r.uniform(0.45, 1.0), braises
        sy = sx * r.uniform(1.8, 3.6)
    else:
        sx = sy = r.uniform(7, 16) * S
        force, couche = r.uniform(0.07, 0.16), grosses
    angle = np.radians(r.uniform(-8, 26))
    e = 3 * max(sx, sy)
    x0, x1 = int(max(0, bx[i] - e - 1)), int(min(W, bx[i] + e + 2))
    y0, y1 = int(max(0, by[i] - e - 1)), int(min(H, by[i] + e + 2))
    if x1 <= x0 or y1 <= y0:
        continue
    gy, gx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
    dx, dy = gx - bx[i], gy - by[i]
    u = (dx * np.cos(angle) + dy * np.sin(angle)) / sx
    v = (-dx * np.sin(angle) + dy * np.cos(angle)) / sy
    if couche is braises:
        tache = np.exp(-(u ** 2 + v ** 2) / 2)
    else:
        tache = lisse(1.0, 0.65, np.sqrt(u ** 2 + v ** 2))
    couche[y0:y1, x0:x1] += tache * force
img += c("#ffc777")[None, None] * np.clip(braises, 0, 1.2)[..., None] * 0.85
img += c("#ff6f14")[None, None] * (flou(braises, 3.5 * S) * 3.2 + flou(braises, 10 * S) * 2.2)[..., None]
img += c("#ff9a3a")[None, None] * flou(grosses, 2.5 * S)[..., None]

# Halo sur les parties claires, étalonnage chaud, vignette, grain.
lum = img.mean(axis=2)
eclat_ = np.clip(lum - 0.5, 0, None)
img += c("#ffc46e")[None, None] * flou(eclat_, 26 * S)[..., None] * 0.45
img = np.clip(img, 0, None)
img = img / (1 + img * 0.18) * 1.12                                    # écrase doucement les blancs
img = img + (lisse(0, 1, np.clip(img, 0, 1)) - img) * 0.3               # du contraste
gris = img.mean(axis=2, keepdims=True)
img = gris + (img - gris) * 1.22                                        # et de la couleur
vignette = 1 - 0.62 * np.clip(((X - 0.5) / 0.78) ** 2 + ((Y - 0.47) / 0.82) ** 2, 0, 1) ** 1.25
img *= vignette[..., None]
img += np.random.default_rng(9).normal(0, 0.011, img.shape).astype(np.float32)
img = np.clip(img, 0, 1)

sortie = Image.fromarray((img * 255 + 0.5).astype(np.uint8))
if S == 1.0:
    sortie.save("fond-connexion.png", optimize=True)
    sortie.save("fond-connexion.jpg", quality=90, optimize=True, progressive=True, subsampling=0)
else:
    sortie.save("apercu-fond.jpg", quality=88)
print(W, H, "ok")
