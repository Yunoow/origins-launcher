"""Maquettes du launcher Origins, style « fantasy sombre et or » (Yunoow, 17/11). Écrit les artboards du canvas."""
import json
import math
import os

ICI = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(ICI, "project")
FOND_TEMPEST = "/_blob/042a0a49c4fca2e655379024bfcf4a7f"
CIEL = "/_blob/76ae4d6407e13276f98121296beded3f"
LOGO_TEMPEST = "/_blob/d2b7d04f93e1d5af31ba692eea95f5ea"

NOIR = "#0f0b08"
BOIS = "#19120d"
BOIS2 = "#221913"
LIGNE = "#5c4524"
OR = "#c9a14a"
OR_CLAIR = "#ecd08a"
PARCH = "#f0e6cf"
GRIS = "#b9a888"
VERT = "#74d08f"

POLICES = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&amp;family=Alegreya+Sans:wght@400;500;700&amp;display=swap">'

I = {
    "accueil": '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    "jeux": '<path d="M6 9h12a4 4 0 0 1 3.9 4.9l-.8 3.4a2.2 2.2 0 0 1-3.9.8L15.5 16h-7l-1.7 2.1a2.2 2.2 0 0 1-3.9-.8l-.8-3.4A4 4 0 0 1 6 9z"/><path d="M8 11.5v3M6.5 13h3"/><circle cx="16" cy="12.5" r=".6"/><circle cx="17.8" cy="14.2" r=".6"/>',
    "actus": '<path d="M7 4h11a2 2 0 0 1 2 2v1H9"/><path d="M7 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7"/><path d="M9 10h7M9 13h7M9 16h4"/>',
    "boutique": '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    "reglages": '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
    "amis": '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2a5 5 0 0 1 5.5 5.8"/>',
    "cloche": '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    "moins": '<path d="M6 12h12"/>',
    "carre": '<rect x="6" y="6" width="12" height="12"/>',
    "croix": '<path d="M6 6l12 12M18 6 6 18"/>',
    "cherche": '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>',
    "plus": '<path d="M12 5v14M5 12h14"/>',
    "envoi": '<path d="M4 12 20 4l-4 16-4-7z"/><path d="m12 13 8-9"/>',
    "copie": '<rect x="8" y="8" width="12" height="12" rx="1"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    "cadenas": '<rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    "dossier": '<path d="M3 7a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>',
    "fleche": '<path d="m9 6 6 6-6 6"/>',
    "discord": '<path d="M8 8.5c2.6-1 5.4-1 8 0M7.5 15.5c2.9 1.3 6.1 1.3 9 0"/><path d="M8.5 6 7 6.5C5.5 9 4.8 11.8 5 15c1 1.2 2.3 2 3.8 2.5l.9-1.6M15.5 6l1.5.5c1.5 2.5 2.2 5.3 2 8.5-1 1.2-2.3 2-3.8 2.5l-.9-1.6"/><circle cx="9.5" cy="12.3" r="1"/><circle cx="14.5" cy="12.3" r="1"/>',
}


def icone(nom, taille=22, couleur="currentColor", trait=1.6):
    return (f'<svg aria-hidden="true" width="{taille}" height="{taille}" viewBox="0 0 24 24" fill="none" stroke="{couleur}" '
            f'stroke-width="{trait}" stroke-linecap="round" stroke-linejoin="round">{I[nom]}</svg>')


def etoile(cx, cy, h, l, couleur):
    """Étoile à quatre branches, haute de 2h et large de 2l."""
    m = min(h, l) * 0.16
    return (f'<path d="M{cx} {cy - h} L{cx + m} {cy - m} L{cx + l} {cy} L{cx + m} {cy + m} L{cx} {cy + h} '
            f'L{cx - m} {cy + m} L{cx - l} {cy} L{cx - m} {cy - m} Z" fill="{couleur}"/>')


def logo(taille, uid, fond=True, monochrome=None):
    """Le nouvel emblème Origins : anneau d'or ciselé, croissant de lune, étoile à quatre branches qui le traverse, orbite."""
    o = monochrome or f"url(#or{uid})"
    o2 = monochrome or f"url(#orb{uid})"
    graduations = "".join(
        f'<path d="M{100 + 84 * math.cos(a):.2f} {100 + 84 * math.sin(a):.2f} L{100 + (90 if k % 3 else 92) * math.cos(a):.2f} '
        f'{100 + (90 if k % 3 else 92) * math.sin(a):.2f}" stroke="{o}" stroke-width="{1.6 if k % 3 else 2.6}"/>'
        for k in range(48) for a in [k * 2 * math.pi / 48])
    defs = "" if monochrome else (
        f'<defs><linearGradient id="or{uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7e6a8"/>'
        f'<stop offset=".45" stop-color="#d4a84c"/><stop offset="1" stop-color="#8c6222"/></linearGradient>'
        f'<linearGradient id="orb{uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff4cf"/>'
        f'<stop offset="1" stop-color="#e2b65a"/></linearGradient>'
        f'<radialGradient id="ciel{uid}" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="#2a1d12"/>'
        f'<stop offset="1" stop-color="#100b07"/></radialGradient>'
        f'<mask id="lune{uid}"><rect width="200" height="200" fill="#fff"/><circle cx="118" cy="92" r="45" fill="#000"/></mask></defs>')
    if monochrome:
        defs = (f'<defs><mask id="lune{uid}"><rect width="200" height="200" fill="#fff"/>'
                f'<circle cx="118" cy="92" r="45" fill="#000"/></mask></defs>')
    disque = (f'<circle cx="100" cy="100" r="82" fill="url(#ciel{uid})"/>' if fond and not monochrome else "")
    return (
        f'<svg role="img" aria-label="Origins" width="{taille}" height="{taille}" viewBox="0 0 200 200">{defs}{disque}'
        f'<circle cx="100" cy="100" r="95" fill="none" stroke="{o}" stroke-width="3"/>'
        f'<circle cx="100" cy="100" r="82" fill="none" stroke="{o}" stroke-width="1.4" opacity=".8"/>{graduations}'
        f'<ellipse cx="100" cy="104" rx="74" ry="19" fill="none" stroke="{o}" stroke-width="2" opacity=".75" transform="rotate(-18 100 104)"/>'
        f'<circle cx="100" cy="104" r="50" fill="{o}" mask="url(#lune{uid})"/>'
        f'{etoile(100, 100, 70, 26, o2)}{etoile(146, 62, 9, 9, o2)}{etoile(58, 142, 6, 6, o2)}{etoile(150, 138, 4, 4, o2)}'
        f'</svg>')


def _pt(cx, cy, r, deg):
    a = math.radians(deg)
    return cx + r * math.cos(a), cy + r * math.sin(a)


def _etoile_franche(cx, cy, h, l, couleur, epaisseur=0.3):
    """Étoile à quatre branches plus épaisse que celle de l'ancien emblème, pour rester lisible en 16 pixels."""
    m = min(h, l) * epaisseur
    pts = [(cx, cy - h), (cx + m, cy - m), (cx + l, cy), (cx + m, cy + m), (cx, cy + h), (cx - m, cy + m), (cx - l, cy), (cx - m, cy - m)]
    return '<path d="M' + " L".join(f"{x:.2f} {y:.2f}" for x, y in pts) + f' Z" fill="{couleur}"/>'


def _croissant():
    """Croissant : le disque (50,50) r40 moins le disque (63,39) r33, en un seul tracé (pas de masque, pas d'id)."""
    x1, y1, r1, x2, y2, r2 = 50, 50, 40, 63, 39, 33
    d = math.hypot(x2 - x1, y2 - y1)
    a = (r1 * r1 - r2 * r2 + d * d) / (2 * d)
    h = math.sqrt(r1 * r1 - a * a)
    mx, my = x1 + a * (x2 - x1) / d, y1 + a * (y2 - y1) / d
    px, py = -(y2 - y1) / d * h, (x2 - x1) / d * h
    p1, p2 = (mx + px, my + py), (mx - px, my - py)
    return (f"M{p1[0]:.2f} {p1[1]:.2f} A{r1} {r1} 0 1 1 {p2[0]:.2f} {p2[1]:.2f} "
            f"A{r2} {r2} 0 0 0 {p1[0]:.2f} {p1[1]:.2f} Z")


def logo_sobre(sorte, taille, couleur, libelle="Origins"):
    """Les nouveaux logos sobres d'Origins (Yunoow, 17/11 : « refaire un logo complet … un logo sobre pour la plateforme
    Origins »). Une seule couleur, des formes pleines, lisibles en 16 pixels comme en grand."""
    c = couleur
    if sorte == "sceau":
        # Un disque plein, comme un sceau ; l'étoile y est découpée.
        etoile_d = _etoile_franche(50, 50, 33, 23, c, 0.32).split('d="')[1].split('"')[0]
        corps = (f'<path fill-rule="evenodd" fill="{c}" d="M50 6 A44 44 0 1 1 49.99 6 Z {etoile_d}"/>')
    elif sorte == "seuil":
        # Un anneau, une porte ; l'étoile la traverse de haut en bas.
        corps = (f'<circle cx="50" cy="50" r="33" fill="none" stroke="{c}" stroke-width="8"/>'
                 f'{_etoile_franche(50, 50, 47, 19, c, 0.34)}')
    elif sorte == "croissant":
        # La lune de l'ancien emblème, seule, et l'étoile dans son creux.
        corps = f'<path d="{_croissant()}" fill="{c}"/>{_etoile_franche(64, 40, 15, 11, c)}'
    else:  # "losange"
        corps = (f'<path d="M50 7 L93 50 L50 93 L7 50 Z" fill="none" stroke="{c}" stroke-width="8"/>'
                 f'{_etoile_franche(50, 50, 25, 18, c, 0.32)}')
    return f'<svg role="img" aria-label="{libelle}" width="{taille}" height="{taille}" viewBox="0 0 100 100">{corps}</svg>'


LOGO_DEFAUT = "seuil"


def page(titre, corps, props=None, l=1280, h=760, logique=""):
    props = props or {}
    props["$preview"] = {"width": l, "height": h}
    p = json.dumps(props, ensure_ascii=False).replace("&", "&amp;").replace("'", "&#39;")
    return f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>{titre}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
{POLICES}
<style>
body{{margin:0;background:{NOIR}}}
a{{color:{OR_CLAIR}}}a:hover{{color:#fff1c4}}
.nav-lien{{color:{GRIS};text-decoration:none}}.nav-lien:hover{{color:{OR_CLAIR}}}
.bouton-or:hover{{filter:brightness(1.08)}}
.carte:hover{{border-color:{OR} !important}}
</style>
</helmet>
{corps}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{p}'>
class Component extends DCLogic {{
{logique or "  renderVals() { return {}; }"}
}}
</script>
</body>
</html>
"""


def fenetre(contenu, fond=NOIR):
    """Le cadre de la fenêtre : barre de titre fine et contrôles."""
    return f"""<div style="width: 1280px; height: 760px; box-sizing: border-box; background: {fond}; font-family: 'Alegreya Sans', system-ui, sans-serif; color: {PARCH}; position: relative; overflow: hidden; border: 1px solid {LIGNE}">
<div style="position: absolute; top: 0; left: 0; right: 0; height: 34px; display: flex; align-items: center; justify-content: space-between; padding: 0 6px 0 14px; z-index: 5; background: rgba(15,11,8,0.82); border-bottom: 1px solid #2c2116">
<div style="display: flex; align-items: center; gap: 8px">{logo_sobre(LOGO_DEFAUT, 20, OR_CLAIR)}<span style="font-family: Cinzel, serif; font-size: 12px; letter-spacing: 0.32em; color: {OR_CLAIR}; font-weight: 600">ORIGINS</span></div>
<div style="display: flex; gap: 2px">
<button aria-label="Réduire" style="width: 40px; height: 30px; border: 0; background: transparent; color: {GRIS}; display: flex; align-items: center; justify-content: center">{icone("moins", 16)}</button>
<button aria-label="Agrandir" style="width: 40px; height: 30px; border: 0; background: transparent; color: {GRIS}; display: flex; align-items: center; justify-content: center">{icone("carre", 14)}</button>
<button aria-label="Fermer" style="width: 40px; height: 30px; border: 0; background: transparent; color: {GRIS}; display: flex; align-items: center; justify-content: center">{icone("croix", 16)}</button>
</div>
</div>
{contenu}
</div>"""


def barre_laterale(actif):
    liens = [("accueil", "Accueil", "Main.dc.html"), ("jeux", "Jeux", "Bibliotheque.dc.html"), ("actus", "Actus", "Main.dc.html"),
             ("boutique", "Boutique", "Main.dc.html"), ("reglages", "Réglages", "Parametres.dc.html")]
    items = ""
    for ic, nom, cible in liens:
        on = ic == actif
        couleur = OR_CLAIR if on else GRIS
        marque = (f'<span aria-hidden="true" style="position: absolute; left: 0; top: 10px; bottom: 10px; width: 3px; background: {OR}; '
                  f'box-shadow: 0 0 10px {OR}"></span>') if on else ""
        fond = "background: linear-gradient(90deg, rgba(201,161,74,0.16), rgba(201,161,74,0))" if on else ""
        items += (f'<a href="{cible}" class="nav-lien" aria-current="{"page" if on else "false"}" style="position: relative; display: flex; '
                  f'flex-direction: column; align-items: center; gap: 4px; padding: 11px 0; color: {couleur}; {fond}">{marque}'
                  f'{icone(ic, 24)}<span style="font-size: 12px; letter-spacing: 0.04em">{nom}</span></a>')
    return f"""<nav aria-label="Navigation" style="position: absolute; top: 34px; left: 0; bottom: 0; width: 86px; display: flex; flex-direction: column; justify-content: space-between; background: linear-gradient(180deg, {BOIS2}, {BOIS}); border-right: 1px solid {LIGNE}; z-index: 4">
<div style="display: flex; flex-direction: column; padding-top: 14px">{items}</div>
<div style="display: flex; flex-direction: column; align-items: center; gap: 14px; padding-bottom: 18px">
<a href="Amis.dc.html" class="nav-lien" aria-label="Amis, 3 en ligne" style="position: relative; display: flex; flex-direction: column; align-items: center; gap: 4px; color: {GRIS}">{icone("amis", 24)}<span style="font-size: 12px">Amis</span><span style="position: absolute; top: -4px; right: -8px; min-width: 18px; height: 18px; border-radius: 9px; background: {VERT}; color: #0b1a10; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center">3</span></a>
<a href="Parametres.dc.html" aria-label="Mon compte" style="width: 44px; height: 44px; border-radius: 50%; border: 2px solid {OR}; background: {BOIS2}; display: flex; align-items: center; justify-content: center; text-decoration: none; font-family: Cinzel, serif; font-weight: 700; color: {OR_CLAIR}; font-size: 17px">Y</a>
</div>
</nav>"""


def bouton_or(texte, l=260, h=62, taille=22, icone_nom=None, href=None):
    ic = icone(icone_nom, 20, "#1a1208", 2.2) if icone_nom else ""
    style = (f"display: inline-flex; align-items: center; justify-content: center; gap: 12px; width: {l}px; height: {h}px; "
             f"box-sizing: border-box; border: 1px solid #fff0bd; outline: 2px solid {OR}; outline-offset: 3px; "
             f"background: linear-gradient(180deg, #f6dc8e 0%, #d6a94b 55%, #b0812f 100%); color: #1a1208; "
             f"font-family: Cinzel, serif; font-weight: 700; font-size: {taille}px; letter-spacing: 0.22em; text-decoration: none; "
             f"box-shadow: 0 8px 30px rgba(214,169,75,0.25), inset 0 1px 0 rgba(255,255,255,0.6)")
    if href:
        return f'<a href="{href}" class="bouton-or" style="{style}">{ic}{texte}</a>'
    return f'<button class="bouton-or" style="{style}">{ic}{texte}</button>'


def titre_section(sur, titre, taille=26):
    return (f'<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-size: 12px; letter-spacing: 0.3em; '
            f'color: {OR}; font-weight: 700">{sur}</span><h2 style="margin: 0; font-family: Cinzel, serif; font-weight: 600; '
            f'font-size: {taille}px; color: {PARCH}; letter-spacing: 0.04em">{titre}</h2></div>')


def filet(largeur="100%"):
    return (f'<div aria-hidden="true" style="width: {largeur}; height: 1px; background: linear-gradient(90deg, rgba(201,161,74,0), '
            f'{OR}, rgba(201,161,74,0))"></div>')


# ---------------------------------------------------------------- Accueil
ACTUS = [
    ("06/11", "Nouvelle barre de sorts : 6 sorts, placée où tu veux",
     "Compose ta barre dans le Grimoire (touche K), chaque sort a son image et sa recharge en horloge.", "Classes"),
    ("04/11", "L'orbe montre ton XP et ta respiration",
     "L'orbe de vie et de mana affiche ta progression vers le niveau suivant et ton air sous l'eau.", "Interface"),
    ("02/11", "Redémarrages annoncés en jeu",
     "Quand le serveur redémarre pour une mise à jour, tu es prévenu à l'avance, en jeu.", "Serveur"),
]


def accueil(tiroir=""):
    cartes = ""
    for date, titre, texte, tag in ACTUS:
        cartes += f"""<article class="carte" style="display: flex; flex-direction: column; gap: 8px; padding: 18px 18px 16px; background: linear-gradient(180deg, {BOIS2}, {BOIS}); border: 1px solid {LIGNE}; min-width: 0">
<div style="display: flex; justify-content: space-between; align-items: center"><span style="font-size: 12px; letter-spacing: 0.16em; color: {OR}; font-weight: 700">{tag.upper()}</span><span style="font-size: 13px; color: {GRIS}">{date}</span></div>
<h3 style="margin: 0; font-family: Cinzel, serif; font-weight: 600; font-size: 16px; line-height: 1.3; color: {PARCH}">{titre}</h3>
<p style="margin: 0; font-size: 14px; line-height: 1.45; color: {GRIS}">{texte}</p>
<a href="#" style="margin-top: auto; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-decoration: none">LIRE LA SUITE →</a>
</article>"""
    contenu = f"""{barre_laterale("accueil")}
<main style="position: absolute; top: 34px; left: 86px; right: 0; bottom: 0; display: flex; flex-direction: column">
<section aria-label="Tempest Origins" style="position: relative; height: 410px; flex: none; overflow: hidden; border-bottom: 1px solid {LIGNE}">
<img src="{FOND_TEMPEST}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 40%">
<div aria-hidden="true" style="position: absolute; inset: 0; background: linear-gradient(90deg, rgba(15,11,8,0.94) 0%, rgba(15,11,8,0.7) 38%, rgba(15,11,8,0.15) 70%, rgba(15,11,8,0.35) 100%)"></div>
<div aria-hidden="true" style="position: absolute; left: 0; right: 0; bottom: 0; height: 120px; background: linear-gradient(0deg, {NOIR}, rgba(15,11,8,0))"></div>
<button aria-label="Notifications" style="position: absolute; top: 18px; right: 22px; width: 44px; height: 44px; border-radius: 50%; border: 1px solid {LIGNE}; background: rgba(15,11,8,0.7); color: {OR_CLAIR}; display: flex; align-items: center; justify-content: center">{icone("cloche", 20)}</button>
<div style="position: absolute; left: 48px; top: 40px; bottom: 40px; width: 520px; display: flex; flex-direction: column; justify-content: center; gap: 14px">
<img src="{LOGO_TEMPEST}" alt="Tempest" style="width: 150px; height: 120px; object-fit: contain; object-position: left center">
<span style="font-size: 13px; letter-spacing: 0.34em; color: {OR}; font-weight: 700">UN SERVEUR ORIGINS</span>
<h1 style="margin: 0; font-family: Cinzel, serif; font-weight: 700; font-size: 50px; line-height: 1.05; color: {PARCH}; letter-spacing: 0.03em">Tempest Origins</h1>
<p style="margin: 0; font-size: 17px; line-height: 1.5; color: #d9cdb2; max-width: 440px">L'univers de Tensura sur un serveur Minecraft : classes, sorts, quêtes et métiers.</p>
</div>
<div style="position: absolute; right: 44px; bottom: 34px; display: flex; flex-direction: column; align-items: flex-end; gap: 14px">
<div style="display: flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(15,11,8,0.78); border: 1px solid {LIGNE}; font-size: 14px; color: {PARCH}"><span aria-hidden="true" style="width: 8px; height: 8px; border-radius: 50%; background: {VERT}; box-shadow: 0 0 8px {VERT}"></span>Serveur en ligne · [N] joueurs</div>
{bouton_or("JOUER", 280, 66, 24, href="Bibliotheque.dc.html")}
<span style="font-size: 13px; color: {GRIS}">Tout est à jour · Minecraft 1.21.11</span>
</div>
</section>
<section aria-label="Dernières nouvelles" style="flex: 1; display: flex; flex-direction: column; gap: 16px; padding: 22px 44px 26px">
<div style="display: flex; justify-content: space-between; align-items: flex-end">{titre_section("CHRONIQUES D'ORIGINS", "Dernières nouvelles", 24)}<a href="#" style="font-size: 14px; font-weight: 700; letter-spacing: 0.08em; text-decoration: none">TOUTES LES ACTUS</a></div>
<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; flex: 1">{cartes}</div>
</section>
</main>
{tiroir}"""
    return fenetre(contenu)


# ---------------------------------------------------------------- Connexion
def connexion():
    langues = "".join(
        f'<button aria-pressed="{"true" if c == "FR" else "false"}" style="min-width: 44px; height: 32px; padding: 0 10px; border: 1px solid {OR if c == "FR" else LIGNE}; '
        f'background: {"rgba(201,161,74,0.18)" if c == "FR" else "transparent"}; color: {OR_CLAIR if c == "FR" else GRIS}; font-family: inherit; '
        f'font-size: 13px; font-weight: 700; letter-spacing: 0.1em">{c}</button>' for c in ("FR", "EN", "ES", "DE", "PT"))
    coin = lambda pos: (f'<span aria-hidden="true" style="position: absolute; {pos}; width: 22px; height: 22px; '
                        f'border-color: {OR_CLAIR}; border-style: solid; border-width: 0"></span>')
    contenu = f"""<img src="{CIEL}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: sepia(0.35) saturate(0.8) brightness(0.55)">
<div aria-hidden="true" style="position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(15,11,8,0.2) 0%, rgba(15,11,8,0.85) 75%)"></div>
<main style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -46%); width: 460px; box-sizing: border-box; padding: 80px 48px 34px; background: linear-gradient(180deg, rgba(34,25,19,0.96), rgba(20,14,10,0.97)); border: 1px solid {OR}; box-shadow: 0 0 0 6px rgba(15,11,8,0.9), 0 0 0 7px {LIGNE}, 0 30px 80px rgba(0,0,0,0.6); display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center">
<div style="position: absolute; top: -62px; left: 50%; transform: translateX(-50%); width: 120px; height: 120px; border-radius: 50%; background: {BOIS2}; border: 1px solid {OR}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 6px rgba(15,11,8,0.9)">{logo_sobre(LOGO_DEFAUT, 76, OR_CLAIR)}</div>
<span style="font-size: 12px; letter-spacing: 0.4em; color: {OR}; font-weight: 700">ORIGINS LAUNCHER</span>
<h1 style="margin: 0; font-family: Cinzel, serif; font-weight: 700; font-size: 34px; line-height: 1.15; color: {PARCH}; letter-spacing: 0.04em">Bienvenue, voyageur</h1>
<p style="margin: 0; font-size: 16px; line-height: 1.5; color: #d9cdb2">Connecte-toi avec ton compte Microsoft pour lier ton profil Origins à ce launcher.</p>
{filet("70%")}
<button class="bouton-or" style="display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; height: 56px; border: 1px solid #fff0bd; outline: 2px solid {OR}; outline-offset: 3px; background: linear-gradient(180deg, #f6dc8e 0%, #d6a94b 55%, #b0812f 100%); color: #1a1208; font-family: Cinzel, serif; font-weight: 700; font-size: 16px; letter-spacing: 0.14em">
<svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18"><rect width="8" height="8" fill="#1a1208"/><rect x="10" width="8" height="8" fill="#1a1208"/><rect y="10" width="8" height="8" fill="#1a1208"/><rect x="10" y="10" width="8" height="8" fill="#1a1208"/></svg>SE CONNECTER AVEC MICROSOFT</button>
<span style="font-size: 13px; color: {GRIS}; display: flex; align-items: center; gap: 6px">{icone("cadenas", 14, GRIS)}Connexion sécurisée par Microsoft</span>
<div style="display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 6px"><span style="font-size: 12px; letter-spacing: 0.22em; color: {GRIS}">LANGUE</span><div style="display: flex; gap: 6px">{langues}</div></div>
</main>
<p style="position: absolute; left: 0; right: 0; bottom: 18px; margin: 0; text-align: center; font-size: 12px; color: #8e7f63">Origins Launcher 0.6.4 · projet indépendant, sans lien avec Mojang ou Microsoft</p>"""
    return fenetre(contenu)


# ---------------------------------------------------------------- Bibliothèque
def bibliotheque():
    contenu = f"""{barre_laterale("jeux")}
<main style="position: absolute; top: 34px; left: 86px; right: 0; bottom: 0; padding: 32px 44px; box-sizing: border-box; display: flex; flex-direction: column; gap: 22px">
<div style="display: flex; justify-content: space-between; align-items: flex-end">{titre_section("BIBLIOTHÈQUE", "Tes mondes")}
<label style="display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 12px; width: 260px; border: 1px solid {LIGNE}; background: {BOIS}; color: {GRIS}">{icone("cherche", 18)}<span style="position: absolute; width: 1px; height: 1px; overflow: hidden">Chercher un jeu</span><input type="search" placeholder="Chercher un jeu" style="flex: 1; min-width: 0; border: 0; background: transparent; color: {PARCH}; font-family: inherit; font-size: 15px"></label></div>
{filet()}
<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px">
<article style="grid-column: span 2; position: relative; height: 420px; overflow: hidden; border: 1px solid {OR}; box-shadow: 0 0 0 4px rgba(15,11,8,0.9), 0 0 0 5px {LIGNE}">
<img src="{FOND_TEMPEST}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover">
<div aria-hidden="true" style="position: absolute; inset: 0; background: linear-gradient(0deg, rgba(15,11,8,0.97) 0%, rgba(15,11,8,0.55) 45%, rgba(15,11,8,0.05) 100%)"></div>
<span style="position: absolute; top: 16px; left: 16px; padding: 4px 12px; background: rgba(15,11,8,0.85); border: 1px solid {VERT}; color: {VERT}; font-size: 12px; font-weight: 700; letter-spacing: 0.16em">INSTALLÉ</span>
<div style="position: absolute; left: 28px; right: 28px; bottom: 26px; display: flex; flex-direction: column; gap: 14px">
<div style="display: flex; align-items: center; gap: 16px"><img src="{LOGO_TEMPEST}" alt="" style="width: 86px; height: 70px; object-fit: contain"><div style="display: flex; flex-direction: column; gap: 2px"><h2 style="margin: 0; font-family: Cinzel, serif; font-size: 30px; font-weight: 700; color: {PARCH}">Tempest Origins</h2><span style="font-size: 14px; color: {GRIS}">Minecraft 1.21.11 · Fabric · 15 mods · 4 Go de mémoire</span></div></div>
<div style="display: flex; flex-direction: column; gap: 6px"><div style="display: flex; justify-content: space-between; font-size: 13px; color: {GRIS}"><span>Mise à jour des mods… Origins Chat 0.7.3</span><span style="color: {OR_CLAIR}; font-weight: 700">64 %</span></div><div role="progressbar" aria-label="Mise à jour" aria-valuenow="64" aria-valuemin="0" aria-valuemax="100" style="height: 8px; background: #2a1f15; border: 1px solid {LIGNE}"><div style="width: 64%; height: 100%; background: linear-gradient(90deg, #b0812f, #f6dc8e); box-shadow: 0 0 10px rgba(246,220,142,0.5)"></div></div></div>
<div style="display: flex; align-items: center; gap: 14px">{bouton_or("JOUER", 220, 56, 20)}
<button aria-label="Ouvrir le dossier du jeu" style="width: 56px; height: 56px; border: 1px solid {LIGNE}; background: rgba(15,11,8,0.8); color: {OR_CLAIR}; display: flex; align-items: center; justify-content: center">{icone("dossier", 22)}</button>
<a href="Parametres.dc.html" aria-label="Réglages du jeu" style="width: 56px; height: 56px; box-sizing: border-box; border: 1px solid {LIGNE}; background: rgba(15,11,8,0.8); color: {OR_CLAIR}; display: flex; align-items: center; justify-content: center">{icone("reglages", 22)}</a></div>
</div>
</article>
<article style="position: relative; height: 420px; box-sizing: border-box; border: 1px dashed {LIGNE}; background: repeating-linear-gradient(135deg, {BOIS}, {BOIS} 14px, #1c150f 14px, #1c150f 28px); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; text-align: center; padding: 28px">
<div style="width: 76px; height: 76px; border-radius: 50%; border: 1px solid {LIGNE}; display: flex; align-items: center; justify-content: center; color: {GRIS}">{icone("cadenas", 30)}</div>
<span style="font-size: 12px; letter-spacing: 0.3em; color: {OR}; font-weight: 700">PROCHAIN MONDE</span>
<h3 style="margin: 0; font-family: Cinzel, serif; font-size: 22px; font-weight: 600; color: {PARCH}">Bientôt</h3>
<p style="margin: 0; font-size: 15px; line-height: 1.5; color: {GRIS}">D'autres mondes Origins arriveront ici, avec leur propre installation.</p>
</article>
</div>
</main>"""
    return fenetre(contenu)


# ---------------------------------------------------------------- Paramètres
def parametres():
    import themes
    donnees = []
    for ident, nom, texte, pal in themes.PALETTES:
        donnees.append({"id": ident, "nom": nom, "fond": themes.rgb_texte(themes.couleur(pal, "fond")),
                        "bois": themes.rgb_texte(themes.couleur(pal, "bois2")), "metal": themes.rgb_texte(themes.couleur(pal, "metal")),
                        "texte": themes.rgb_texte(themes.couleur(pal, "texte"))})
    theme_choix = f"""<div style="display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 10px">
<sc-for list="{{{{themes}}}}" as="t" hint-placeholder-count="8">
<button aria-pressed="{{{{t.presse}}}}" aria-label="Thème {{{{t.nom}}}}" onClick="{{{{t.choisir}}}}" style="display: flex; flex-direction: column; gap: 6px; padding: 6px; border: 1px solid {{{{t.bord}}}}; background: {{{{t.caseFond}}}}; font-family: inherit; text-align: left; cursor: pointer">
<span aria-hidden="true" style="position: relative; display: block; height: 46px; background: {{{{t.fond}}}}; border: 1px solid rgba(255,255,255,0.08)"><span style="position: absolute; left: 0; top: 0; bottom: 0; width: 14px; background: {{{{t.bois}}}}"></span><span style="position: absolute; left: 22px; right: 8px; top: 10px; height: 4px; background: {{{{t.texte}}}}; opacity: 0.8"></span><span style="position: absolute; right: 8px; bottom: 8px; width: 34px; height: 12px; background: {{{{t.metal}}}}"></span></span>
<span style="font-size: 12px; line-height: 1.2; color: {PARCH}">{{{{t.nom}}}}</span>
</button>
</sc-for>
</div>"""
    logique_theme = (
        "  renderVals() {\n"
        f"    const liste = {json.dumps(donnees, ensure_ascii=False)};\n"
        "    const choisi = (this.state && this.state.theme) || 'or-ebene';\n"
        "    const themes = liste.map((t) => Object.assign({}, t, {\n"
        "      presse: t.id === choisi ? 'true' : 'false',\n"
        "      bord: t.id === choisi ? t.metal : 'rgba(255,255,255,0.12)',\n"
        "      caseFond: t.id === choisi ? 'rgba(255,255,255,0.07)' : 'transparent',\n"
        "      choisir: () => this.setState({ theme: t.id })\n"
        "    }));\n"
        "    return { themes: themes };\n"
        "  }")
    langues = "".join(
        f'<button aria-pressed="{"true" if c == "Français" else "false"}" style="height: 40px; padding: 0 16px; border: 1px solid {OR if c == "Français" else LIGNE}; '
        f'background: {"rgba(201,161,74,0.18)" if c == "Français" else BOIS}; color: {OR_CLAIR if c == "Français" else GRIS}; font-family: inherit; font-size: 15px">{c}</button>'
        for c in ("Français", "English", "Español", "Deutsch", "Português"))
    bloc = lambda titre, aide, corps, large=False: f"""<section style="{'grid-column: span 2; ' if large else ''}display: flex; flex-direction: column; gap: 10px; padding: 16px 20px; background: linear-gradient(180deg, {BOIS2}, {BOIS}); border: 1px solid {LIGNE}">
<div style="display: flex; flex-direction: column; gap: 4px"><h3 style="margin: 0; font-family: Cinzel, serif; font-size: 17px; font-weight: 600; color: {OR_CLAIR}; letter-spacing: 0.06em">{titre}</h3><p style="margin: 0; font-size: 14px; line-height: 1.45; color: {GRIS}">{aide}</p></div>{corps}</section>"""
    memoire = f"""<div style="display: flex; flex-direction: column; gap: 8px"><div style="display: flex; justify-content: space-between; align-items: baseline"><label for="ram" style="font-size: 15px; color: {PARCH}">Mémoire donnée au jeu</label><span style="font-family: Cinzel, serif; font-size: 22px; font-weight: 700; color: {OR_CLAIR}">4 Go</span></div>
<input id="ram" type="range" min="2" max="16" value="4" style="width: 100%; accent-color: {OR}">
<div style="display: flex; justify-content: space-between; font-size: 12px; color: #8e7f63"><span>2 Go</span><span>Conseillé : 4 à 6 Go</span><span>16 Go</span></div></div>"""
    compte = f"""<div style="display: flex; align-items: center; gap: 16px"><div style="width: 64px; height: 64px; border-radius: 50%; border: 2px solid {OR}; background: {BOIS2}; display: flex; align-items: center; justify-content: center; font-family: Cinzel, serif; font-size: 26px; font-weight: 700; color: {OR_CLAIR}">Y</div>
<div style="flex: 1; display: flex; flex-direction: column; gap: 4px"><span style="font-family: Cinzel, serif; font-size: 18px; color: {PARCH}">Yunoow</span><span style="font-size: 13px; color: {GRIS}">Origins ID · [ID-0000]</span></div>
<button style="height: 40px; padding: 0 14px; border: 1px solid {LIGNE}; background: transparent; color: {OR_CLAIR}; font-family: inherit; font-size: 14px; display: flex; align-items: center; gap: 8px">{icone("copie", 16)}Copier l'ID</button></div>
<div style="display: flex; gap: 10px"><button style="height: 40px; padding: 0 16px; border: 1px solid {LIGNE}; background: transparent; color: {PARCH}; font-family: inherit; font-size: 14px">Changer d'avatar</button><button style="height: 40px; padding: 0 16px; border: 1px solid {LIGNE}; background: transparent; color: {PARCH}; font-family: inherit; font-size: 14px">Changer de nom</button><button style="margin-left: auto; height: 40px; padding: 0 16px; border: 1px solid #7a3a2e; background: transparent; color: #f0a593; font-family: inherit; font-size: 14px">Se déconnecter</button></div>"""
    contenu = f"""{barre_laterale("reglages")}
<main style="position: absolute; top: 34px; left: 86px; right: 0; bottom: 0; padding: 22px 44px; box-sizing: border-box; display: flex; flex-direction: column; gap: 14px">
{titre_section("ORIGINS", "Réglages", 24)}
{filet()}
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px">
{bloc("Thème", "Les couleurs du launcher, rien que pour toi. Le changement est immédiat.", theme_choix, True)}
{bloc("Langue", "Une seule langue pour le launcher et pour Tempest.", f'<div style="display: flex; flex-wrap: wrap; gap: 8px">{langues}</div>')}
{bloc("Compte", "Ton profil Origins, lié à ton compte Microsoft.", compte)}
{bloc("Mémoire du jeu", "Plus de mémoire aide avec les shaders et les grandes zones ; trop ralentit le reste du PC.", memoire)}
{bloc("Launcher", "Version 0.6.4 · tout est à jour.", f'<div style="display: flex; gap: 10px; flex-wrap: wrap"><button style="height: 40px; padding: 0 16px; border: 1px solid {LIGNE}; background: transparent; color: {PARCH}; font-family: inherit; font-size: 14px">Revoir le tutoriel</button><button style="height: 40px; padding: 0 16px; border: 1px solid {LIGNE}; background: transparent; color: {PARCH}; font-family: inherit; font-size: 14px">Quoi de neuf ?</button><button style="height: 40px; padding: 0 16px; border: 1px solid {LIGNE}; background: transparent; color: {PARCH}; font-family: inherit; font-size: 14px">Ouvrir le dossier du jeu</button></div>')}
</div>
</main>"""
    return fenetre(contenu), logique_theme


# ---------------------------------------------------------------- Amis
def amis():
    contacts = [("Mity", "En jeu · Tempest Origins", VERT, True), ("Raphael", "En ligne", VERT, False), ("Aki", "En ligne", VERT, False),
                ("Lune", "Hors ligne · il y a 2 h", "#6d604a", False)]
    lignes = ""
    for nom, etat, c, sel in contacts:
        fond = "rgba(201,161,74,0.14)" if sel else "transparent"
        bord = OR if sel else "transparent"
        lignes += f"""<button style="display: flex; align-items: center; gap: 12px; width: 100%; padding: 10px 12px; border: 1px solid {bord}; background: {fond}; text-align: left; font-family: inherit; color: {PARCH}">
<span style="position: relative; width: 40px; height: 40px; flex: none; border-radius: 50%; border: 1px solid {LIGNE}; background: {BOIS2}; display: flex; align-items: center; justify-content: center; font-family: Cinzel, serif; font-weight: 700; color: {OR_CLAIR}">{nom[0]}<span aria-hidden="true" style="position: absolute; right: -1px; bottom: -1px; width: 11px; height: 11px; border-radius: 50%; background: {c}; border: 2px solid {BOIS}"></span></span>
<span style="display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1"><span style="font-size: 15px; font-weight: 700">{nom}</span><span style="font-size: 13px; color: {GRIS}">{etat}</span></span>{icone("fleche", 16, GRIS)}</button>"""
    tiroir = f"""<div aria-hidden="true" style="position: absolute; top: 34px; left: 86px; right: 0; bottom: 0; background: rgba(8,6,4,0.6); z-index: 6"></div>
<aside aria-label="Amis et messages" style="position: absolute; top: 34px; right: 0; bottom: 0; width: 720px; display: flex; z-index: 7; border-left: 1px solid {OR}; box-shadow: -20px 0 60px rgba(0,0,0,0.6)">
<div style="width: 300px; display: flex; flex-direction: column; gap: 14px; padding: 22px 18px; box-sizing: border-box; background: linear-gradient(180deg, {BOIS2}, {BOIS}); border-right: 1px solid {LIGNE}">
<div style="display: flex; justify-content: space-between; align-items: flex-start">{titre_section("3 EN LIGNE", "Amis", 22)}<a href="Main.dc.html" aria-label="Fermer" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; color: {GRIS}">{icone("croix", 18)}</a></div>
<div style="display: flex; gap: 8px"><label style="flex: 1; display: flex; align-items: center; gap: 8px; height: 40px; padding: 0 10px; border: 1px solid {LIGNE}; background: {NOIR}; color: {GRIS}">{icone("cherche", 16)}<span style="position: absolute; width: 1px; height: 1px; overflow: hidden">Ajouter par Origins ID</span><input placeholder="Ajouter par Origins ID" style="flex: 1; min-width: 0; border: 0; background: transparent; color: {PARCH}; font-family: inherit; font-size: 14px"></label><button aria-label="Ajouter" style="width: 40px; height: 40px; border: 1px solid {OR}; background: rgba(201,161,74,0.16); color: {OR_CLAIR}; display: flex; align-items: center; justify-content: center">{icone("plus", 18)}</button></div>
{filet()}
<div style="display: flex; flex-direction: column; gap: 4px">{lignes}</div>
</div>
<div style="flex: 1; display: flex; flex-direction: column; background: {NOIR}">
<div style="display: flex; align-items: center; gap: 12px; padding: 18px 20px; border-bottom: 1px solid {LIGNE}"><span style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid {OR}; background: {BOIS2}; display: flex; align-items: center; justify-content: center; font-family: Cinzel, serif; font-weight: 700; color: {OR_CLAIR}">M</span><span style="display: flex; flex-direction: column"><span style="font-family: Cinzel, serif; font-size: 17px; color: {PARCH}">Mity</span><span style="font-size: 13px; color: {VERT}">En jeu · Tempest Origins</span></span></div>
<div style="flex: 1; display: flex; flex-direction: column; gap: 12px; padding: 20px">
<span style="align-self: center; font-size: 12px; letter-spacing: 0.2em; color: #8e7f63">AUJOURD'HUI</span>
<p style="margin: 0; align-self: flex-start; max-width: 300px; padding: 10px 14px; background: {BOIS2}; border: 1px solid {LIGNE}; font-size: 15px; line-height: 1.4; color: {PARCH}">Tu as vu les nouveaux sorts du Guerrier ?</p>
<p style="margin: 0; align-self: flex-end; max-width: 300px; padding: 10px 14px; background: rgba(201,161,74,0.18); border: 1px solid {OR}; font-size: 15px; line-height: 1.4; color: {PARCH}">Oui, je les teste ce soir, rejoins-moi en jeu.</p>
</div>
<div style="display: flex; gap: 10px; padding: 16px 20px; border-top: 1px solid {LIGNE}"><label style="flex: 1; display: flex; align-items: center; height: 44px; padding: 0 12px; border: 1px solid {LIGNE}; background: {BOIS}"><span style="position: absolute; width: 1px; height: 1px; overflow: hidden">Message à Mity</span><input placeholder="Écris à Mity…" style="flex: 1; border: 0; background: transparent; color: {PARCH}; font-family: inherit; font-size: 15px"></label><button aria-label="Envoyer" style="width: 44px; height: 44px; border: 1px solid #fff0bd; background: linear-gradient(180deg, #f6dc8e, #b0812f); color: #1a1208; display: flex; align-items: center; justify-content: center">{icone("envoi", 18, "#1a1208", 2)}</button></div>
</div>
</aside>"""
    return accueil(tiroir)


# ---------------------------------------------------------------- Logo
def planche_logo():
    sortes = [("seuil", "Seuil", "Le O d'Origins, une porte vers d'autres mondes, traversée par l'étoile du départ."),
              ("sceau", "Sceau", "Un disque plein comme un sceau, l'étoile découpée dedans."),
              ("croissant", "Croissant", "La lune de l'ancien emblème, seule, l'étoile dans son creux."),
              ("losange", "Losange", "Un blason simple, l'étoile au centre.")]
    cartes = ""
    for i, (sorte, nom, texte) in enumerate(sortes):
        cartes += f"""<figure style="margin: 0; display: flex; flex-direction: column; gap: 14px; padding: 26px 20px 20px; background: linear-gradient(180deg, {BOIS2}, {BOIS}); border: 1px solid {OR if i == 0 else LIGNE}">
<div style="display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 10px 0 6px">{logo_sobre(sorte, 120, OR_CLAIR)}<span style="font-family: Cinzel, serif; font-weight: 600; font-size: 24px; letter-spacing: 0.34em; margin-right: -0.34em; color: {PARCH}">ORIGINS</span></div>
<div style="display: flex; justify-content: center; gap: 12px; align-items: center">
<span style="width: 52px; height: 52px; border-radius: 12px; background: {OR_CLAIR}; display: flex; align-items: center; justify-content: center">{logo_sobre(sorte, 34, NOIR, nom + ", icône")}</span>
<span style="width: 52px; height: 52px; border-radius: 12px; background: #f3efe6; display: flex; align-items: center; justify-content: center">{logo_sobre(sorte, 34, "#1b1612", nom + ", sur fond clair")}</span>
<span style="width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; border: 1px solid {LIGNE}">{logo_sobre(sorte, 18, OR_CLAIR, nom + ", en petit")}</span></div>
<figcaption style="display: flex; flex-direction: column; gap: 4px"><span style="font-family: Cinzel, serif; font-size: 17px; color: {OR_CLAIR}">{i + 1} · {nom}{" (dans les maquettes)" if i == 0 else ""}</span><span style="font-size: 14px; line-height: 1.4; color: {GRIS}">{texte}</span></figcaption>
</figure>"""
    return f"""<div style="width: 1280px; height: 760px; box-sizing: border-box; padding: 40px 48px; background: {NOIR}; font-family: 'Alegreya Sans', system-ui, sans-serif; color: {PARCH}; display: flex; flex-direction: column; gap: 22px">
<div style="display: flex; flex-direction: column; gap: 6px"><span style="font-size: 13px; letter-spacing: 0.34em; color: {OR}; font-weight: 700">NOUVEAU LOGO · PLATEFORME ORIGINS</span><h1 style="margin: 0; font-family: Cinzel, serif; font-weight: 700; font-size: 34px; color: {PARCH}">Quatre logos sobres, une seule couleur</h1><p style="margin: 0; font-size: 16px; color: {GRIS}">Chacun en grand avec le nom, puis en icône d'application, sur fond clair et en tout petit (barre de titre).</p></div>
{filet()}
<div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px">{cartes}</div>
</div>"""


def ecrire():
    os.makedirs(P, exist_ok=True)
    fichiers = {
        "Connexion.dc.html": page("Connexion", connexion()),
        "Main.dc.html": page("Accueil", accueil()),
        "Bibliotheque.dc.html": page("Bibliothèque de jeux", bibliotheque()),
        "Parametres.dc.html": (lambda c, l: page("Réglages", c, logique=l))(*parametres()),
        "Amis.dc.html": page("Amis et messages", amis()),
        "Logo.dc.html": page("Logo Origins", planche_logo()),
    }
    import themes
    defaut = {i: pal for i, _, _, pal in themes.PALETTES}["or-ebene"]   # thème par défaut : or et ébène (Yunoow, 17/11)
    for nom, txt in fichiers.items():
        open(os.path.join(P, nom), "w", encoding="utf-8").write(themes.repeindre(txt, defaut))
    open(os.path.join(ICI, "accueil-or.source.html"), "w", encoding="utf-8").write(fichiers["Main.dc.html"])
    places = [("Connexion.dc.html", 0, 0, "Connexion"), ("Main.dc.html", 1360, 0, "Accueil"),
              ("Bibliotheque.dc.html", 2720, 0, "Bibliothèque"), ("Parametres.dc.html", 0, 880, "Réglages"),
              ("Amis.dc.html", 1360, 880, "Amis et messages"), ("Logo.dc.html", 2720, 880, "Logo Origins")]
    canvas = {"v": 3, "createdOnFiles": {"v": 1, "at": "2026-11-17T01:20:00Z"}, "title": "Launcher Origins — fantasy sombre et or",
              "launch": {"view": "canvas"}, "pages": [],
              "boards": {n: {"x": x, "y": y, "w": 1280, "h": 760, "title": t, "is_interactive": True} for n, x, y, t in places},
              "order": [n for n, *_ in places],
              "notes": {"titre": {"x": 0, "y": -260, "text": "Launcher Origins — fantasy sombre et or", "kind": "title1", "maxW": 4000}},
              "designSystems": []}
    canvas["boards"]["Logo.dc.html"]["is_interactive"] = False
    open(os.path.join(P, "canvas.json"), "w", encoding="utf-8").write(json.dumps(canvas, ensure_ascii=False, indent=1))
    print({n: len(t) for n, t in fichiers.items()})


if __name__ == "__main__":
    ecrire()
