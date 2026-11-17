#!/usr/bin/env python3
"""Site Origins : planches de la DA de tout le site (Yunoow, 17/11/2026 : « faire la DA de tout le site, le shop… », relié à
la Console de l'équipe).

Décision du 17/11 : tout est relié au **profil Origins**, créé une fois dans le launcher avec le compte Microsoft. On se
connecte au site par le launcher (lien « Ouvrir sur le site », ou une demande à valider dans le launcher, avec un code) ;
la boutique se contente du pseudo Minecraft ; Discord est facultatif pour les joueurs, obligatoire pour le Board (la
Console Tempest, mêmes onglets, même règle des grades).

Même DA que le launcher : Or et ébène, logo œil de dragon, Baloo 2 et Nunito, fond peint de la connexion.
    python3 site_origins.py      # écrit les planches project/Site-*.dc.html
"""
import json
import os

import aventure as av

ICI = os.path.dirname(os.path.abspath(__file__))
T = av.THEMES[0]
OR, OR_FONCE, SUR_OR = T["accent"], T["jouer"], T["surAccent"]
TEXTE, DOUX, EBENE, PANNEAU = T["texte"], T["doux"], T["barre"], T["panneau"]
VERRE = f"linear-gradient(160deg, {T['verre1']}, {T['verre2']})"
VERT = "#8bd99a"
L = 1440

ICONES = dict(av.ICONES)
ICONES.update({
    "fenetre": '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18"/><path d="M6.5 6.5h.01M9 6.5h.01"/>',
    "portable": '<rect x="4.5" y="5" width="15" height="10.5" rx="1.5"/><path d="M2.5 19h19l-1.5-3.5H4z"/>',
    "telephone": '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    "terminal": '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="m7 9.5 3 2.5-3 2.5M12.5 15h4.5"/>',
    "puce": '<rect x="7" y="7" width="10" height="10" rx="1.5"/><rect x="10" y="10" width="4" height="4" rx=".5"/><path d="M9.5 3.5V7M14.5 3.5V7M9.5 17v3.5M14.5 17v3.5M3.5 9.5H7M3.5 14.5H7M17 9.5h3.5M17 14.5h3.5"/>',
    "cube": '<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    "boite": '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v9.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9M10 13h4"/>',
    "coche": '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    "info": '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.2"/>',
    "globe": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.7 3.9 5.7 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.7-3.9-9S9.4 5.7 12 3z"/>',
    "utilisateur": '<circle cx="12" cy="8" r="4"/><path d="M4 20.5a8 8 0 0 1 16 0"/>',
    "bouclier": '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
    "externe": '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    "manette": '<path d="M7 9h10a4 4 0 0 1 3.9 4.9l-.8 3.3a2 2 0 0 1-3.3 1L14.5 16h-5l-2.3 2.2a2 2 0 0 1-3.3-1l-.8-3.3A4 4 0 0 1 7 9z"/><path d="M8 12v2M7 13h2M15.5 12.5h.01M17 14h.01"/>',
    "panier": '<path d="M3 4h2l2.2 10.5a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 8H6"/><circle cx="9.5" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>',
    "horloge": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "serveur": '<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/>',
    "carte": '<path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
    "liste": '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>',
    "parchemin": '<path d="M7 3h11a2 2 0 0 1 2 2v2h-4M7 3a2 2 0 0 0-2 2v12a3 3 0 0 0 3 3h9a2 2 0 0 0 2-2V7M7 3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2M10 9h6M10 13h6"/>',
    "livre": '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5A2.5 2.5 0 0 0 4 19.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    "nuage": '<path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 8a4 4 0 0 1 .5 8"/><path d="M12 12v8M9 15l3-3 3 3"/>',
    "monstre": '<path d="M5 20v-8a7 7 0 0 1 14 0v8l-2.5-2-2.3 2-2.2-2-2.2 2-2.3-2z"/><path d="M9.5 11h.01M14.5 11h.01"/>',
    "redemarrer": '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
    "lien": '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>',
    "menu": '<path d="M4 7h16M4 12h16M4 17h16"/>',
    "partager": '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1"/>',
    "retour": '<path d="M15 5l-7 7 7 7"/>',
    "droite": '<path d="m9 5 7 7-7 7"/>',
})


def ic(nom, taille=22, couleur="currentColor", trait=1.8):
    return (f'<svg aria-hidden="true" width="{taille}" height="{taille}" viewBox="0 0 24 24" fill="none" stroke="{couleur}" '
            f'stroke-width="{trait}" stroke-linecap="round" stroke-linejoin="round" style="flex: none">{ICONES[nom]}</svg>')


def insecables(texte):
    """Typographie française : espace insécable avant : ? ! ; et dans les guillemets."""
    for a, b in ((" :", " :"), (" ?", " ?"), (" !", " !"), (" ;", " ;"), ("« ", "« "), (" »", " »")):
        texte = texte.replace(a, b)
    return texte


BAL = "font-family: 'Baloo 2', sans-serif; font-weight: 800"
NUN = "font-family: Nunito, sans-serif"


def sur_titre(texte, couleur=OR):
    return f'<span style="{NUN}; font-weight: 800; font-size: 12.5px; letter-spacing: 0.24em; color: {couleur}">{texte}</span>'


def titre1(texte, ident, taille=48):
    return f'<h1 id="{ident}" style="margin: 8px 0 0; {BAL}; font-size: {taille}px; line-height: 1.06; color: #fff">{texte}</h1>'


def titre2(texte, ident=None, taille=36):
    att = f' id="{ident}"' if ident else ""
    return f'<h2{att} style="margin: 8px 0 0; {BAL}; font-size: {taille}px; line-height: 1.1; color: #fff">{texte}</h2>'


def texte(contenu, taille=16, couleur=TEXTE, marge="10px 0 0", largeur=None):
    l = f" max-width: {largeur}px;" if largeur else ""
    return f'<p style="margin: {marge};{l} font-size: {taille}px; line-height: 1.55; font-weight: 600; color: {couleur}">{contenu}</p>'


def bouton_blanc(libelle, icone=None, clic=None, hauteur=58, taille=18, largeur=None):
    l = f" width: {largeur};" if largeur else ""
    c = f' onClick="{clic}"' if clic else ""
    return (f'<button class="so-cta"{c} style="height: {hauteur}px;{l} padding: 0 26px; border: 0; border-radius: 15px; background: #ffffff; '
            f'color: {OR_FONCE}; {BAL}; font-size: {taille}px; letter-spacing: 0.05em; display: inline-flex; align-items: center; '
            f'justify-content: center; gap: 10px; box-shadow: 0 5px 0 rgba(0,0,0,0.25); cursor: pointer; white-space: nowrap">'
            f'{ic(icone, taille + 4, trait=2.3) if icone else ""}{libelle}</button>')


def bouton_contour(libelle, icone=None, clic=None, hauteur=58, taille=16, largeur=None):
    l = f" width: {largeur};" if largeur else ""
    c = f' onClick="{clic}"' if clic else ""
    return (f'<button class="so-contour"{c} style="height: {hauteur}px;{l} padding: 0 22px; border-radius: 15px; border: 1.5px solid rgba(201,161,74,0.6); '
            f'background: rgba(15,11,8,0.35); color: #fff; {NUN}; font-weight: 800; font-size: {taille}px; display: inline-flex; '
            f'align-items: center; justify-content: center; gap: 9px; cursor: pointer; white-space: nowrap">{ic(icone, taille + 4, OR) if icone else ""}{libelle}</button>')


def bouton_or(libelle, icone=None, clic=None, hauteur=46, taille=15):
    c = f' onClick="{clic}"' if clic else ""
    return (f'<button class="so-or"{c} style="height: {hauteur}px; padding: 0 18px; border: 0; border-radius: 12px; background: {OR}; color: {SUR_OR}; '
            f'{NUN}; font-weight: 800; font-size: {taille}px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; '
            f'cursor: pointer; white-space: nowrap">{ic(icone, taille + 3, trait=2.2) if icone else ""}{libelle}</button>')


def lien_or(libelle, clic=None):
    c = f' onClick="{clic}"' if clic else ""
    return (f'<button class="so-lien"{c} style="padding: 0; border: 0; background: transparent; color: {OR}; {NUN}; font-weight: 800; '
            f'font-size: 14.5px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer">{libelle}</button>')


def panneau(contenu, padding="24px", extra=""):
    return (f'<section style="padding: {padding}; border-radius: 20px; background: linear-gradient(170deg, #1e160e, #130d08); '
            f'border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 16px 40px rgba(0,0,0,0.35); {extra}">{contenu}</section>')


def pastille(libelle, couleur=OR, fond="rgba(201,161,74,0.16)"):
    return (f'<span style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 99px; background: {fond}; '
            f'color: {couleur}; {NUN}; font-weight: 800; font-size: 11px; letter-spacing: 0.1em; white-space: nowrap">{libelle}</span>')


# ---------------------------------------------------------------- navigation et pied de page, les mêmes partout
LIENS = [("accueil", "Accueil"), ("jeux", "Jeux"), ("actus", "Actus"), ("boutique", "Boutique"), ("telecharger", "Télécharger"), ("support", "Support")]
QUI = {"joueur": ("lyra", "Lyra"), "equipe": ("moi", "Yunoow")}


def nav(actif=None, qui=None, plein=False):
    """En haut de chaque page. qui : None (pas connecté), « joueur » ou « equipe » (le Board apparaît)."""
    liens = "".join(
        f'<a class="so-lien" href="#" aria-current="{"page" if cle == actif else "false"}" style="position: relative; padding: 8px 0; '
        f'color: {"#ffffff" if cle == actif else TEXTE}; text-decoration: none; font-weight: {800 if cle == actif else 700}; font-size: 15px">{nom}'
        + (f'<span aria-hidden="true" style="position: absolute; left: 50%; bottom: -1px; width: 22px; height: 3px; margin-left: -11px; '
           f'border-radius: 2px; background: {OR}"></span>' if cle == actif else "") + "</a>"
        for cle, nom in LIENS)
    langue = f"""<div style="position: relative">
<button class="so-contour" onClick="[[ouvrirLangues]]" aria-haspopup="listbox" aria-expanded="[[languesOuvertes]]" aria-label="Langue" style="height: 40px; padding: 0 11px; border-radius: 12px; border: 1.5px solid rgba(255,255,255,0.2); background: rgba(15,11,8,0.35); color: #fff; display: flex; align-items: center; gap: 7px; {NUN}; font-weight: 800; font-size: 13.5px; cursor: pointer">{ic("globe", 17)}[[langueCode]]{ic("chevron", 14)}</button>
<div role="listbox" aria-label="Langue" style="display: [[affLangues]]; position: absolute; right: 0; top: 48px; width: 220px; padding: 6px; border-radius: 14px; background: {PANNEAU}; border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 18px 40px rgba(0,0,0,0.5); flex-direction: column; gap: 2px; z-index: 5">
<sc-for list="[[langues]]" as="l" hint-placeholder-count="5">
<button role="option" aria-selected="[[l.presse]]" onClick="[[l.choisir]]" style="height: 38px; padding: 0 12px; border: 0; border-radius: 9px; background: [[l.fond]]; color: #fff; display: flex; align-items: center; justify-content: space-between; {NUN}; font-weight: 700; font-size: 14px; cursor: pointer">[[l.nom]]<small style="font-size: 10.5px; font-weight: 800; letter-spacing: 0.08em; color: {DOUX}">[[l.code]]</small></button>
</sc-for></div></div>"""
    discord = (f'<a class="so-contour" href="#" aria-label="Discord d\'Origins" title="Discord d\'Origins" style="width: 40px; height: 40px; border-radius: 12px; '
               f'border: 1.5px solid rgba(255,255,255,0.2); background: rgba(15,11,8,0.35); color: #fff; display: flex; align-items: center; '
               f'justify-content: center">{ic("bulle", 19)}</a>')
    if qui is None:
        compte = (f'<a class="so-cta" href="#" style="height: 40px; padding: 0 16px; border-radius: 12px; background: #ffffff; color: {OR_FONCE}; '
                  f'text-decoration: none; display: flex; align-items: center; gap: 8px; {BAL}; font-size: 15px; letter-spacing: 0.03em">'
                  f'{ic("utilisateur", 18, trait=2.2)}Se connecter</a>')
    else:
        avatar_id, nom = QUI[qui]
        board = ""
        if qui == "equipe":
            actif_t = actif == "tickets"
            board = (f'<a class="so-contour" href="#" aria-current="{"page" if actif_t else "false"}" style="position: relative; height: 40px; padding: 0 14px; '
                     f'border-radius: 12px; border: 1.5px solid {OR if actif_t else "rgba(201,161,74,0.6)"}; background: {"rgba(201,161,74,0.2)" if actif_t else "rgba(15,11,8,0.35)"}; '
                     f'color: #fff; text-decoration: none; display: flex; align-items: center; gap: 7px; {NUN}; font-weight: 800; font-size: 14px">'
                     f'{ic("bulle", 17, OR)}Tickets<span style="min-width: 18px; height: 18px; padding: 0 5px; box-sizing: border-box; border-radius: 9px; background: #e2574c; '
                     f'color: #fff; font-size: 11px; display: flex; align-items: center; justify-content: center">3</span></a>')
            board += (f'<a class="so-or" href="#" aria-current="{"page" if actif == "board" else "false"}" style="height: 40px; padding: 0 14px; '
                     f'border-radius: 12px; background: {OR if actif != "board" else "#ffffff"}; color: {SUR_OR if actif != "board" else OR_FONCE}; '
                     f'text-decoration: none; display: flex; align-items: center; gap: 7px; {NUN}; font-weight: 800; font-size: 14px">'
                     f'{ic("bouclier", 17, trait=2.1)}Board</a>')
        menu_board = (f'<a class="so-entree" href="#" style="height: 40px; padding: 0 12px; border-radius: 9px; color: #fff; text-decoration: none; display: flex; '
                      f'align-items: center; gap: 10px; font-weight: 700; font-size: 14px">{ic("bouclier", 17, OR)}Board de l\'équipe</a>') if qui == "equipe" else ""
        compte = f"""{board}<div style="position: relative">
<button class="so-contour" onClick="[[ouvrirMenu]]" aria-haspopup="menu" aria-expanded="[[menuOuvert]]" style="height: 40px; padding: 0 10px 0 4px; border-radius: 12px; border: 1.5px solid rgba(255,255,255,0.2); background: rgba(15,11,8,0.35); color: #fff; display: flex; align-items: center; gap: 8px; {NUN}; font-weight: 800; font-size: 14px; cursor: pointer">{av.avatar(avatar_id, 30)}{nom}{ic("chevron", 14)}</button>
<div role="menu" style="display: [[affMenu]]; position: absolute; right: 0; top: 48px; width: 240px; padding: 6px; border-radius: 14px; background: {PANNEAU}; border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 18px 40px rgba(0,0,0,0.5); flex-direction: column; gap: 2px; z-index: 5">
<a class="so-entree" href="#" style="height: 40px; padding: 0 12px; border-radius: 9px; color: #fff; text-decoration: none; display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 14px">{ic("utilisateur", 17, OR)}Mon profil</a>
<a class="so-entree" href="#" style="height: 40px; padding: 0 12px; border-radius: 9px; color: #fff; text-decoration: none; display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 14px">{ic("panier", 17, OR)}Mes achats</a>
<a class="so-entree" href="#" style="height: 40px; padding: 0 12px; border-radius: 9px; color: #fff; text-decoration: none; display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 14px">{ic("bulle", 17, OR)}Mes tickets</a>
{menu_board}
<span aria-hidden="true" style="height: 1px; margin: 4px 6px; background: rgba(255,255,255,0.1)"></span>
<a class="so-entree" href="#" style="height: 40px; padding: 0 12px; border-radius: 9px; color: {DOUX}; text-decoration: none; display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 14px">{ic("sortie", 17)}Se déconnecter</a>
</div></div>"""
    fond = f"background: {EBENE}; border-bottom: 1px solid rgba(255,255,255,0.08);" if plein else ""
    position = "position: relative;" if plein else "position: absolute; top: 0; left: 0; right: 0;"
    return f"""<header style="{position} height: 76px; padding: 0 48px; box-sizing: border-box; {fond} display: flex; align-items: center; gap: 40px; z-index: 4">
{av.logo_mot(40, "nav-" + (actif or "x") + "-" + (qui or "x"))}
<nav aria-label="Site Origins" style="display: flex; align-items: center; gap: 26px; flex: 1">{liens}</nav>
<div style="display: flex; align-items: center; gap: 10px">{langue}{discord}{compte}</div>
</header>"""


def pied():
    colonne = lambda titre, liens: (
        f'<div style="display: flex; flex-direction: column; gap: 10px"><span style="{NUN}; font-weight: 800; font-size: 12px; letter-spacing: 0.18em; color: {OR}">{titre}</span>'
        + "".join(f'<a class="so-lien" href="#" style="color: {TEXTE}; text-decoration: none; font-weight: 700; font-size: 14.5px">{l}</a>' for l in liens) + "</div>")
    return f"""<footer style="padding: 48px 96px 36px; box-sizing: border-box; border-top: 1px solid rgba(255,255,255,0.08); background: #0c0906">
<div style="display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr 1fr; gap: 40px">
<div style="display: flex; flex-direction: column; gap: 14px; align-items: flex-start">{av.logo_mot(40, "pied")}
<p style="margin: 0; max-width: 300px; font-size: 14px; line-height: 1.55; font-weight: 600; color: {DOUX}">Nos mondes Minecraft, réunis dans un launcher. Un seul profil Origins pour le jeu, le launcher et le site.</p></div>
{colonne("JEUX", ["Tempest"])}{colonne("ORIGINS", ["Actus", "Boutique", "Télécharger le launcher"])}{colonne("AIDE", ["Support et tickets", "Installer le launcher", "Questions"])}{colonne("ÉQUIPE", ["Tickets du staff", "Board", "Discord"])}
</div>
<div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; gap: 24px">
<p style="margin: 0; font-size: 12px; font-weight: 600; color: rgba(185,168,136,0.7)">Ce n'est pas un produit officiel Minecraft. Non approuvé par Mojang ou Microsoft, ni associé à eux.</p>
<p style="margin: 0; font-size: 12px; font-weight: 600; color: rgba(185,168,136,0.7)">© 2026 Origins</p></div>
</footer>"""


# ---------------------------------------------------------------- page DC
COMMUN = """    const langue = s.langue || 'fr';
    v.langueCode = langue.toUpperCase();
    v.languesOuvertes = s.langues ? 'true' : 'false';
    v.affLangues = s.langues ? 'flex' : 'none';
    v.ouvrirLangues = () => this.setState({ langues: !s.langues, menu: false });
    v.langues = C.langues.map((l) => ({
      nom: l[1], code: l[0].toUpperCase(),
      presse: l[0] === langue ? 'true' : 'false',
      fond: l[0] === langue ? 'rgba(201,161,74,0.18)' : 'transparent',
      choisir: () => this.setState({ langue: l[0], langues: false })
    }));
    v.menuOuvert = s.menu ? 'true' : 'false';
    v.affMenu = s.menu ? 'flex' : 'none';
    v.ouvrirMenu = () => this.setState({ menu: !s.menu, langues: false });
"""
LANGUES = av.LANGUES[1:2] + av.LANGUES[:1] + av.LANGUES[2:]


def logique(corps_js, config=None):
    cfg = dict(config or {})
    cfg["langues"] = LANGUES
    return ("  renderVals() {\n    const s = this.state || {};\n    const C = " + insecables(json.dumps(cfg, ensure_ascii=False)) + ";\n"
            "    const v = {};\n" + COMMUN + corps_js + "\n    return v;\n  }")


def page(titre, corps, logique_js, hauteur, largeur=L):
    props = json.dumps({"$preview": {"width": largeur, "height": hauteur}}).replace("'", "&#39;")
    corps = insecables(corps).replace("[[", "{{").replace("]]", "}}")
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
{av.POLICES}
<style>
body{{margin:0;background:{EBENE}}}
*{{scrollbar-width:none;scroll-behavior:smooth}}*::-webkit-scrollbar{{display:none}}
.so-lien{{transition:color .15s,opacity .15s}}.so-lien:hover{{color:#ffffff !important}}
.so-contour{{transition:background .15s,border-color .15s}}.so-contour:hover{{background:rgba(201,161,74,0.16) !important;border-color:{OR} !important}}
.so-cta{{transition:transform .15s,box-shadow .15s}}.so-cta:hover{{transform:translateY(-2px);box-shadow:0 7px 0 rgba(0,0,0,0.25) !important}}
.so-or{{transition:filter .15s}}.so-or:hover{{filter:brightness(1.1)}}
.so-entree:hover{{background:rgba(255,255,255,0.07) !important}}
.so-carte{{transition:transform .18s,border-color .18s}}.so-carte:hover{{transform:translateY(-4px);border-color:rgba(201,161,74,0.55) !important}}
.so-ligne:hover{{background:rgba(255,255,255,0.035) !important}}
@keyframes so-pulse{{0%,100%{{transform:scale(1);opacity:.55}}50%{{transform:scale(1.12);opacity:1}}}}
.so-pulse{{animation:so-pulse 1.8s ease-in-out infinite}}
</style>
</helmet>
<div style="width: {largeur}px; height: {hauteur}px; position: relative; overflow: hidden; background: {EBENE}; {NUN}; color: {TEXTE}">
{corps}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{props}'>
class Component extends DCLogic {{
{logique_js}
}}
</script>
</body>
</html>
"""


# ---------------------------------------------------------------- connexion : par le launcher (et Discord pour le Board)
def maquette(liste):
    """Petit sélecteur en haut des planches pour voir chaque état (ne fait pas partie du site)."""
    return f"""<div role="radiogroup" aria-label="États de la maquette" style="position: absolute; top: 92px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 4px; padding: 4px 4px 4px 12px; border-radius: 12px; background: rgba(0,0,0,0.55); border: 1px dashed rgba(255,255,255,0.25); z-index: 3">
<span style="font-size: 10.5px; font-weight: 800; letter-spacing: 0.14em; color: {DOUX}; margin-right: 6px">MAQUETTE</span>
<sc-for list="[[{liste}]]" as="m" hint-placeholder-count="4">
<button role="radio" aria-checked="[[m.presse]]" onClick="[[m.choisir]]" style="height: 30px; padding: 0 12px; border: 0; border-radius: 8px; background: [[m.fond]]; color: [[m.couleur]]; {NUN}; font-weight: 800; font-size: 12.5px; cursor: pointer">[[m.nom]]</button>
</sc-for></div>"""


def champ(libelle, valeur, aide=None):
    a = f'<span style="font-size: 12px; font-weight: 600; color: {DOUX}">{aide}</span>' if aide else ""
    return (f'<label style="width: 100%; display: flex; flex-direction: column; gap: 7px"><span style="font-size: 11px; font-weight: 800; letter-spacing: 0.12em; color: {DOUX}">{libelle}</span>'
            f'<input value="{valeur}" style="height: 48px; box-sizing: border-box; padding: 0 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.3); '
            f'background: rgba(0,0,0,0.3); color: #fff; {NUN}; font-size: 16px; font-weight: 700">{a}</label>')


def connexion():
    carte = lambda etat, contenu: (f'<section aria-label="Connexion" style="display: [[aff_{etat}]]; width: 520px; box-sizing: border-box; padding: 30px 38px 32px; border-radius: 24px; '
                                   f'background: {VERRE}; border: 1px solid rgba(255,255,255,0.16); box-shadow: 0 30px 70px rgba(0,0,0,0.55); flex-direction: column; align-items: center; gap: 16px; text-align: center">{contenu}</section>')
    centre = lambda t: f'<h1 style="margin: 0; {BAL}; font-size: 32px; line-height: 1.1; color: #fff">{t}</h1>'
    doux = lambda t: f'<p style="margin: 0; font-size: 14.5px; line-height: 1.55; font-weight: 600; color: {TEXTE}">{t}</p>'
    oeil = av.logo7_oeil if hasattr(av, "logo7_oeil") else None
    import logo7
    petit_oeil = lambda t, uid: f'<span style="width: {t}px; height: {t}px; display: flex">{logo7.logo(("feu", {"regard": 2, "bas": 3, "taille_pupille": 0.9}), t, uid=uid, libelle="")}</span>'
    choix = carte("choix", f"""{sur_titre("TON PROFIL ORIGINS")}{centre("Connecte-toi")}
{doux("Avec le profil créé dans le launcher : pas de mot de passe, c'est ton launcher qui confirme.")}
{champ("PSEUDO MINECRAFT OU ORIGINS ID", "Yunoow")}
{bouton_blanc("ENVOYER AU LAUNCHER", "envoi", "[[envoyer]]", 56, 17, "100%")}
<div style="width: 100%; display: flex; align-items: center; gap: 12px; color: {DOUX}; font-size: 12px; font-weight: 800; letter-spacing: 0.12em"><span style="flex: 1; height: 1px; background: rgba(255,255,255,0.14)"></span>OU<span style="flex: 1; height: 1px; background: rgba(255,255,255,0.14)"></span></div>
<div style="width: 100%; box-sizing: border-box; padding: 14px 16px; border-radius: 14px; background: rgba(0,0,0,0.28); display: flex; align-items: center; gap: 14px; text-align: left">{petit_oeil(40, "cx-astuce")}<span style="font-size: 13.5px; line-height: 1.5; font-weight: 600; color: {TEXTE}">Déjà dans le launcher ? Clique sur ton avatar, puis <b style="color: #fff">« Ouvrir sur le site »</b> : tu arrives ici déjà connecté.</span></div>
<p style="margin: 2px 0 0; font-size: 13px; font-weight: 600; color: {DOUX}">Pas encore de profil ? {lien_or("Télécharge le launcher")}</p>""")
    attente = carte("attente", f"""<span style="position: relative; width: 92px; height: 92px; display: flex; align-items: center; justify-content: center">
<span class="so-pulse" aria-hidden="true" style="position: absolute; inset: 0; border-radius: 50%; border: 2px solid {OR}"></span>{petit_oeil(64, "cx-attente")}</span>
{centre("Regarde ton launcher")}
{doux("On a envoyé une demande au launcher de <b style='color: #fff'>Yunoow</b>. Vérifie que le code est le même, puis accepte.")}
<div style="padding: 14px 26px; border-radius: 16px; background: rgba(0,0,0,0.35); border: 1px solid rgba(201,161,74,0.4); {BAL}; font-size: 40px; letter-spacing: 0.18em; color: {OR}">K7P · 4QX</div>
<p style="margin: 0; display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 700; color: {DOUX}">{ic("horloge", 16)}La demande expire dans 2 minutes.</p>
<div style="display: flex; gap: 10px">{bouton_contour("Annuler", None, "[[annuler]]", 44, 14)}{bouton_or("Maquette : accepter dans le launcher", "coche", "[[accepter]]", 44, 14)}</div>""")
    connecte = carte("connecte", f"""<span style="padding: 5px; border-radius: 50%; background: linear-gradient(150deg, {OR}, #3b2a17)">{av.avatar("moi", 96, False)}</span>
{centre("Bienvenue, Yunoow !")}
{doux("Tu es connecté avec ton profil Origins, le même que dans le launcher.")}
<span style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 10px; background: rgba(0,0,0,0.3); font-size: 13px; font-weight: 700; color: {DOUX}">Origins ID <b style="font-family: ui-monospace, Menlo, monospace; letter-spacing: 0.08em; color: #fff">4F2K-9QXA</b></span>
<div style="width: 100%; display: flex; gap: 10px; margin-top: 4px">{bouton_blanc("MON PROFIL", "utilisateur", "[[annuler]]", 52, 16, "100%")}{bouton_contour("Accueil", None, "[[annuler]]", 52, 15, "100%")}</div>""")
    equipe = carte("equipe", f"""<span style="width: 72px; height: 72px; border-radius: 22px; background: rgba(201,161,74,0.16); color: {OR}; display: flex; align-items: center; justify-content: center">{ic("bouclier", 40, trait=1.7)}</span>
{sur_titre("ÉQUIPE ORIGINS")}{centre("Board de l'équipe")}
{doux("Le Board est réservé à l'équipe : il vérifie ton grade sur le Discord d'Origins, comme la Console aujourd'hui.")}
{bouton_blanc("SE CONNECTER AVEC DISCORD", "bulle", None, 56, 16, "100%")}
<p style="margin: 0; font-size: 12.5px; font-weight: 600; color: {DOUX}">Discord en panne ? Le lien de secours se demande sur le VPS.</p>
{lien_or("← Retour à la connexion joueur", "[[annuler]]")}""")
    corps = f"""<img src="{av.FOND_CONNEXION}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%">
<span aria-hidden="true" style="position: absolute; inset: 0; background: radial-gradient(50% 60% at 50% 55%, rgba(15,11,8,0.55), rgba(15,11,8,0.2))"></span>
{nav(None, None)}
{maquette("etats")}
<div style="position: absolute; inset: 130px 0 0; display: flex; flex-direction: column; align-items: center; justify-content: center; padding-bottom: 40px; gap: 18px">
{choix}{attente}{connecte}{equipe}
<button class="so-lien" onClick="[[versEquipe]]" style="display: [[affLienEquipe]]; padding: 0; border: 0; background: transparent; color: {TEXTE}; {NUN}; font-weight: 700; font-size: 13.5px; align-items: center; gap: 8px; cursor: pointer">{ic("bouclier", 16, OR)}Tu fais partie de l'équipe ? Board avec Discord</button>
</div>"""
    js = """    const etat = s.etat || 'choix';
    ['choix', 'attente', 'connecte', 'equipe'].forEach((e) => { v['aff_' + e] = e === etat ? 'flex' : 'none'; });
    v.affLienEquipe = etat === 'choix' ? 'flex' : 'none';
    v.envoyer = () => this.setState({ etat: 'attente' });
    v.accepter = () => this.setState({ etat: 'connecte' });
    v.annuler = () => this.setState({ etat: 'choix' });
    v.versEquipe = () => this.setState({ etat: 'equipe' });
    v.etats = [['choix', 'Pas connecté'], ['attente', 'Demande envoyée'], ['connecte', 'Connecté'], ['equipe', 'Équipe']].map((e) => ({
      nom: e[1], presse: e[0] === etat ? 'true' : 'false',
      fond: e[0] === etat ? '#ffffff' : 'transparent', couleur: e[0] === etat ? C.orFonce : '#f0e6cf',
      choisir: () => this.setState({ etat: e[0] })
    }));"""
    return corps, logique(js, {"orFonce": OR_FONCE}), 900


# ---------------------------------------------------------------- mon profil : le même que dans le launcher
def ligne_compte(icone, nom, detail, droite, affichage=None):
    aff = f"display: [[{affichage}]];" if affichage else "display: flex;"
    return (f'<div class="so-ligne" style="{aff} align-items: center; gap: 14px; padding: 14px 12px; border-radius: 14px">'
            f'<span style="width: 44px; height: 44px; border-radius: 13px; background: rgba(201,161,74,0.14); color: {OR}; display: flex; align-items: center; justify-content: center; flex: none">{ic(icone, 23)}</span>'
            f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><strong style="font-size: 15.5px; font-weight: 800; color: #fff">{nom}</strong>'
            f'<span style="font-size: 13px; font-weight: 600; color: {DOUX}">{detail}</span></span>{droite}</div>')


def coche_ok(libelle="Lié"):
    return f'<span style="display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 800; color: {VERT}">{ic("coche", 16, VERT, 2.6)}{libelle}</span>'


def profil():
    titre_carte = lambda t, droite="": (f'<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px">'
                                        f'<h2 style="margin: 0; {BAL}; font-size: 22px; color: #fff">{t}</h2>{droite}</div>')
    comptes = panneau(titre_carte("Comptes liés", pastille("UN SEUL PROFIL")) +
                      texte("Tout est relié à ton profil Origins, créé dans le launcher avec ton compte Microsoft.", 14, DOUX, "0 0 8px") +
                      ligne_compte("manette", "Minecraft : Yunoow", "Le compte avec lequel tu joues", coche_ok("Vérifié")) +
                      ligne_compte("fenetre", "Microsoft", "Connecté depuis le launcher, le 28 septembre 2026", coche_ok()) +
                      ligne_compte("bulle", "Discord", "Facultatif : tes grades et les annonces sur le Discord d'Origins",
                                   bouton_or("Lier", "lien", "[[lierDiscord]]", 40, 14), "affDiscordNon") +
                      ligne_compte("bulle", "Discord : yunoow", "Lié le 17 novembre 2026",
                                   f'<span style="display: flex; align-items: center; gap: 12px">{coche_ok()}{lien_or("Délier", "[[delierDiscord]]")}</span>', "affDiscordOui"))
    achats = panneau(titre_carte("Mes achats", lien_or("Voir la boutique →")) +
                     f'<div style="padding: 26px; border-radius: 16px; border: 1.5px dashed rgba(255,255,255,0.14); display: flex; align-items: center; gap: 18px">'
                     f'<span style="width: 56px; height: 56px; border-radius: 16px; background: rgba(255,255,255,0.05); color: {DOUX}; display: flex; align-items: center; justify-content: center">{ic("panier", 28)}</span>'
                     f'<span style="display: flex; flex-direction: column; gap: 4px"><strong style="font-size: 16px; font-weight: 800; color: #fff">Aucun achat pour l\'instant</strong>'
                     f'<span style="font-size: 13.5px; font-weight: 600; color: {DOUX}">Ce que tu achètes arrive en jeu, sur ton compte Minecraft. La boutique ouvre bientôt.</span></span></div>')
    amis_av = "".join(f'<span style="margin-left: -10px; border-radius: 50%; border: 2px solid #19120d; display: flex">{av.avatar(q, 38)}</span>' for q in ["lyra", "tomo", "kaze", "nami", "rui"])
    amis = panneau(titre_carte("Mes amis", pastille("12")) +
                   f'<div style="display: flex; padding-left: 10px; margin: 6px 0 14px">{amis_av}<span style="margin-left: -10px; width: 42px; height: 42px; border-radius: 50%; background: #2a1e14; border: 2px solid #19120d; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: {DOUX}">+7</span></div>' +
                   texte("Tes amis et tes messages se gèrent dans le launcher.", 13.5, DOUX, "0"))
    navigateur = lambda cle, icone, nom, quand, celui: (
        f'<div style="display: [[aff_nav_{cle}]]; align-items: center; gap: 12px; padding: 10px 4px; border-bottom: 1px solid rgba(255,255,255,0.06)">'
        f'<span style="color: {OR}; display: flex">{ic(icone, 22)}</span><span style="flex: 1; display: flex; flex-direction: column; gap: 1px">'
        f'<strong style="font-size: 14px; font-weight: 800; color: #fff">{nom}</strong><span style="font-size: 12.5px; font-weight: 600; color: {DOUX}">{quand}</span></span>'
        + (pastille("CELUI-CI", VERT, "rgba(139,217,154,0.12)") if celui else lien_or("Déconnecter", f"[[retirer_{cle}]]")) + "</div>")
    tickets = panneau(titre_carte("Mes tickets", lien_or("Tout voir →")) +
                      f'<div class="so-ligne" style="display: flex; align-items: center; gap: 12px; padding: 10px 8px; border-radius: 12px">'
                      f'<span style="width: 10px; height: 10px; border-radius: 50%; background: {OR}; flex: none"></span>'
                      f'<span style="flex: 1; display: flex; flex-direction: column; gap: 1px"><strong style="font-size: 14px; font-weight: 800; color: #fff">Les mobs ont l\'apparence d\'animaux</strong>'
                      f'<span style="font-size: 12.5px; font-weight: 600; color: {DOUX}">#1042 · Mity t\'a répondu il y a 5 min</span></span>{pastille("EN COURS")}</div>' +
                      f'<div style="margin-top: 10px">{bouton_contour("Ouvrir un ticket", "plus", None, 42, 14)}</div>')
    securite = panneau(titre_carte("Navigateurs connectés") +
                       navigateur("pc", "fenetre", "Chrome · Windows", "Maintenant", True) +
                       navigateur("tel", "telephone", "Safari · iPhone", "Il y a 2 jours", False) +
                       navigateur("mac", "portable", "Firefox · Mac", "Il y a 3 semaines", False) +
                       f'<div style="margin-top: 14px">{bouton_contour("Se déconnecter partout", "sortie", None, 42, 14)}</div>')
    entete = f"""<section aria-label="Mon profil" style="position: relative; height: 300px; overflow: hidden">
<img src="{av.FOND_CONNEXION}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 62%">
<span aria-hidden="true" style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,11,8,0.25), {EBENE} 96%)"></span>
<div style="position: absolute; left: 96px; right: 96px; bottom: 34px; display: flex; align-items: flex-end; gap: 28px">
<span style="padding: 5px; border-radius: 50%; background: linear-gradient(150deg, {OR}, #3b2a17); box-shadow: 0 16px 40px rgba(0,0,0,0.5)">{av.avatar("moi", 132, False)}</span>
<div style="flex: 1; display: flex; flex-direction: column; gap: 10px; padding-bottom: 8px">
{sur_titre("MON PROFIL ORIGINS")}
<h1 style="margin: 0; {BAL}; font-size: 48px; line-height: 1; color: #fff">Yunoow</h1>
<div style="display: flex; align-items: center; gap: 14px; flex-wrap: wrap">
<button onClick="[[copier]]" style="height: 34px; padding: 0 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.18); background: rgba(0,0,0,0.35); color: #fff; display: inline-flex; align-items: center; gap: 8px; {NUN}; font-size: 13px; font-weight: 700; cursor: pointer">Origins ID <b style="font-family: ui-monospace, Menlo, monospace; letter-spacing: 0.08em">4F2K-9QXA</b>{ic("copie", 15, OR)}<span style="color: {OR}; font-weight: 800">[[copieTexte]]</span></button>
<span style="font-size: 13.5px; font-weight: 700; color: {DOUX}">Membre depuis septembre 2026</span>
{pastille("ÉQUIPE · ORIGINS BOARD")}</div></div>
<div style="display: flex; gap: 10px; padding-bottom: 8px">{bouton_contour("Ouvrir dans le launcher", "externe", None, 46, 14)}</div>
</div></section>"""
    corps = f"""{nav(None, "equipe", True)}
{entete}
<div style="padding: 16px 96px 56px; display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 24px; align-items: start">
<div style="display: flex; flex-direction: column; gap: 24px">{comptes}{achats}</div>
<div style="display: flex; flex-direction: column; gap: 24px">{tickets}{amis}{securite}</div>
</div>
{pied()}"""
    js = """    const lie = !!s.discord;
    v.affDiscordNon = lie ? 'none' : 'flex';
    v.affDiscordOui = lie ? 'flex' : 'none';
    v.lierDiscord = () => this.setState({ discord: true });
    v.delierDiscord = () => this.setState({ discord: false });
    v.copieTexte = s.copie ? 'Copié' : '';
    v.copier = () => this.setState({ copie: true });
    const partis = s.partis || [];
    ['pc', 'tel', 'mac'].forEach((n) => {
      v['aff_nav_' + n] = partis.indexOf(n) >= 0 ? 'none' : 'flex';
      v['retirer_' + n] = () => this.setState({ partis: partis.concat([n]) });
    });"""
    return corps, logique(js), 1420


# ---------------------------------------------------------------- support : tickets (joueurs) et page Tickets (staff)
CATEGORIES = [("connexion", "Connexion", "#7fa8e0"), ("bug", "Bug en jeu", "#e0866c"), ("launcher", "Launcher", OR),
              ("achat", "Achat", VERT), ("signalement", "Signalement", "#d77fb0"), ("question", "Question", "#b9a888")]
COUL_CAT = {nom: coul for _, nom, coul in CATEGORIES}


def avatar_lettre(nom, couleur, taille):
    return (f'<span aria-hidden="true" style="display: flex; flex: none; width: {taille}px; height: {taille}px; border-radius: 50%; background: {couleur}; '
            f'align-items: center; justify-content: center; {BAL}; font-size: {round(taille * 0.45)}px; color: #fff">{nom[0]}</span>')


def puce_cat(nom):
    return (f'<span style="display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 800; color: {TEXTE}; white-space: nowrap">'
            f'<span style="width: 8px; height: 8px; border-radius: 50%; background: {COUL_CAT[nom]}"></span>{nom}</span>')


STATUTS = {"en_cours": ("EN COURS", OR, "rgba(201,161,74,0.16)"), "attente": ("EN ATTENTE DE TOI", "#7fa8e0", "rgba(127,168,224,0.14)"),
           "attente_staff": ("EN ATTENTE DU JOUEUR", "#7fa8e0", "rgba(127,168,224,0.14)"), "nouveau": ("NON ATTRIBUÉ", "#e2574c", "rgba(226,87,76,0.14)"),
           "resolu": ("RÉSOLU", VERT, "rgba(139,217,154,0.12)")}


def statut(cle):
    nom, coul, fond = STATUTS[cle]
    return pastille(nom, coul, fond)


def bulle(qui, texte_html, quand, cote="gauche", role=None, piece=None):
    """Un message de la conversation. qui : (avatar html, nom)."""
    av_html, nom = qui
    badge = f'<span style="padding: 2px 7px; border-radius: 6px; background: rgba(201,161,74,0.18); color: {OR}; font-size: 10px; font-weight: 800; letter-spacing: 0.1em">{role}</span>' if role else ""
    fond = "rgba(201,161,74,0.13)" if cote == "droite" else "#221913"
    bord = "rgba(201,161,74,0.3)" if cote == "droite" else "rgba(255,255,255,0.08)"
    pj = ""
    if piece:
        pj = (f'<div style="margin-top: 10px; display: flex; align-items: center; gap: 10px; padding: 6px; border-radius: 12px; background: rgba(0,0,0,0.25); width: fit-content">'
              f'<span style="width: 92px; height: 56px; border-radius: 8px; background: url(\'{av.gen.FOND_TEMPEST if hasattr(av, "gen") else ""}\') 30% 60% / 320% auto"></span>'
              f'<span style="display: flex; flex-direction: column; gap: 2px; padding-right: 8px"><strong style="font-size: 12.5px; color: #fff">{piece}</strong>'
              f'<span style="font-size: 11.5px; font-weight: 600; color: {DOUX}">Capture · 412 Ko</span></span></div>')
    corps = (f'<div style="max-width: 78%; display: flex; flex-direction: column; gap: 6px; align-items: {"flex-end" if cote == "droite" else "flex-start"}">'
             f'<span style="display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 800; color: #fff">{nom}{badge}'
             f'<span style="font-weight: 600; color: {DOUX}">{quand}</span></span>'
             f'<div style="padding: 12px 15px; border-radius: 16px; border-{"top-right" if cote == "droite" else "top-left"}-radius: 4px; background: {fond}; border: 1px solid {bord}; '
             f'font-size: 14.5px; line-height: 1.55; font-weight: 600; color: {TEXTE}">{texte_html}{pj}</div></div>')
    if cote == "droite":
        return f'<div style="display: flex; justify-content: flex-end; gap: 10px">{corps}{av_html}</div>'
    return f'<div style="display: flex; gap: 10px">{av_html}{corps}</div>'


def note_interne(qui, texte_html, quand):
    av_html, nom = qui
    return (f'<div style="display: flex; gap: 10px">{av_html}<div style="flex: 1; padding: 12px 15px; border-radius: 14px; border: 1.5px dashed rgba(201,161,74,0.55); '
            f'background: rgba(201,161,74,0.06)"><span style="display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 800; color: {OR}">'
            f'{ic("cadenas", 14, OR)}NOTE INTERNE · le joueur ne la voit pas<span style="font-weight: 600; color: {DOUX}">{nom} · {quand}</span></span>'
            f'<p style="margin: 6px 0 0; font-size: 14px; line-height: 1.55; font-weight: 600; color: {TEXTE}">{texte_html}</p></div></div>')


def evenement(texte_html):
    return (f'<div style="display: flex; align-items: center; gap: 12px; color: {DOUX}; font-size: 12px; font-weight: 700">'
            f'<span style="flex: 1; height: 1px; background: rgba(255,255,255,0.08)"></span>{texte_html}<span style="flex: 1; height: 1px; background: rgba(255,255,255,0.08)"></span></div>')


LYRA = (av.avatar("lyra", 36), "Lyra")
MITY = (avatar_lettre("Mity", "#4a6fa5", 36), "Mity")
YUNOOW = (av.avatar("moi", 36), "Yunoow")


def conversation_1042(staff=False):
    m = [bulle(LYRA, "Salut ! Depuis hier, les loups faméliques ressemblent à des loups normaux. J'ai bien accepté les deux packs à la connexion.", "hier, 21:14", "droite" if not staff else "gauche"),
         evenement("Mity a pris le ticket · hier, 21:38"),
         bulle(MITY, "Salut Lyra ! Il faut aussi activer le pack des modèles une fois, dans Options → Packs de ressources. Tu peux essayer ?", "hier, 21:40", "gauche" if not staff else "droite", "STAFF")]
    if staff:
        m.append(note_interne(MITY, "Deuxième joueur cette semaine avec le pack qui se désactive : regarder ce que le launcher écrit dans options.txt.", "ce matin, 08:50"))
    m.append(bulle(LYRA, "C'était ça, merci ! Par contre le pack se désactive quand je relance le jeu.", "il y a 5 min", "droite" if not staff else "gauche", piece="capture-packs.png"))
    return "".join(m)


def entete_ticket(titre, numero, cat, cle_statut, droite="", meta=""):
    return (f'<div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.08)">'
            f'<div style="display: flex; flex-direction: column; gap: 8px"><span style="font-size: 12.5px; font-weight: 800; color: {DOUX}">Ticket {numero}</span>'
            f'<h2 style="margin: 0; {BAL}; font-size: 24px; line-height: 1.15; color: #fff">{titre}</h2>'
            f'<div style="display: flex; align-items: center; gap: 12px">{puce_cat(cat)}{statut(cle_statut)}{meta}</div></div>{droite}</div>')


def compositeur(placeholder, onglets="", outils=""):
    return (f'<div style="padding: 16px 24px 20px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 10px">{onglets}'
            f'<div style="min-height: 76px; box-sizing: border-box; padding: 12px 14px; border-radius: 14px; border: 1px solid [[bordSaisie]]; background: [[fondSaisie]]; '
            f'font-size: 14.5px; font-weight: 600; color: {DOUX}">{placeholder}</div>'
            f'<div style="display: flex; align-items: center; justify-content: space-between"><span style="display: flex; gap: 8px">'
            f'<button class="so-contour" aria-label="Joindre une capture" style="width: 40px; height: 40px; border-radius: 11px; border: 1.5px solid rgba(255,255,255,0.18); background: transparent; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer">{ic("lien", 18)}</button>'
            f'{outils}</span>{bouton_or("Envoyer", "envoi", None, 40, 14)}</div></div>')


def element_ticket(cle, titre, sous, cle_statut, actif=False, non_lu=False, avatar_html=""):
    return (f'<button class="so-ligne" onClick="[[voir_{cle}]]" style="width: 100%; padding: 14px; border: 0; border-radius: 14px; background: [[fondT_{cle}]]; '
            f'border-left: 3px solid [[bordT_{cle}]]; color: #fff; text-align: left; display: flex; gap: 12px; align-items: flex-start; cursor: pointer; {NUN}">{avatar_html}'
            f'<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px"><span style="display: flex; align-items: center; gap: 8px">'
            f'<strong style="flex: 1; min-width: 0; font-size: 14.5px; font-weight: 800; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">{titre}</strong>'
            + (f'<span style="width: 9px; height: 9px; border-radius: 50%; background: #e2574c; flex: none"></span>' if non_lu else "") +
            f'</span><span style="font-size: 12.5px; font-weight: 600; color: {DOUX}">{sous}</span><span style="align-self: flex-start">{statut(cle_statut)}</span></span></button>')


def support():
    liste = f"""<section aria-label="Mes tickets" style="border-radius: 20px; background: linear-gradient(170deg, #1e160e, #130d08); border: 1px solid rgba(255,255,255,0.08); padding: 18px; display: flex; flex-direction: column; gap: 8px">
<div style="display: flex; gap: 4px; padding: 4px; border-radius: 12px; background: rgba(0,0,0,0.3); margin-bottom: 6px">
<button onClick="[[ongletEnCours]]" style="flex: 1; height: 36px; border: 0; border-radius: 9px; background: [[fondEnCours]]; color: [[coulEnCours]]; {NUN}; font-weight: 800; font-size: 13.5px; cursor: pointer">En cours · 1</button>
<button onClick="[[ongletFermes]]" style="flex: 1; height: 36px; border: 0; border-radius: 9px; background: [[fondFermes]]; color: [[coulFermes]]; {NUN}; font-weight: 800; font-size: 13.5px; cursor: pointer">Fermés · 2</button></div>
<div style="display: [[affEnCours]]; flex-direction: column; gap: 6px">{element_ticket("1042", "Les mobs ont l'apparence d'animaux", "#1042 · Bug en jeu · il y a 5 min", "en_cours", non_lu=True)}</div>
<div style="display: [[affFermes]]; flex-direction: column; gap: 6px">{element_ticket("1031", "Mon achat n'est pas arrivé", "#1031 · Achat · 3 novembre", "resolu")}{element_ticket("1007", "Je n'arrive plus à me connecter", "#1007 · Connexion · 28 octobre", "resolu")}</div>
</section>"""
    conv = f"""<section aria-label="Conversation" style="display: [[affConv]]; flex-direction: column; border-radius: 20px; background: linear-gradient(170deg, #1e160e, #130d08); border: 1px solid rgba(255,255,255,0.08); overflow: hidden">
{entete_ticket("Les mobs ont l'apparence d'animaux", "#1042", "Bug en jeu", "en_cours", f'<span style="font-size: 12.5px; font-weight: 700; color: {DOUX}">Pris par <b style="color: #fff">Mity</b></span>')}
<div style="flex: 1; padding: 22px 24px; display: flex; flex-direction: column; gap: 18px">{conversation_1042()}</div>
{compositeur("Écris ta réponse…")}
</section>"""
    categories = "".join(f'<button onClick="[[cat_{c}]]" style="height: 38px; padding: 0 14px; border-radius: 11px; border: 1.5px solid [[catBord_{c}]]; background: [[catFond_{c}]]; color: #fff; {NUN}; font-weight: 800; font-size: 13.5px; display: flex; align-items: center; gap: 8px; cursor: pointer"><span style="width: 9px; height: 9px; border-radius: 50%; background: {coul}"></span>{nom}</button>' for c, nom, coul in CATEGORIES)
    zone = lambda libelle, contenu: f'<label style="display: flex; flex-direction: column; gap: 8px"><span style="font-size: 11px; font-weight: 800; letter-spacing: 0.12em; color: {DOUX}">{libelle}</span>{contenu}</label>'
    saisie = lambda texte_, h=48: f'<div style="min-height: {h}px; box-sizing: border-box; padding: 13px 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.22); background: rgba(0,0,0,0.25); font-size: 15px; font-weight: 600; color: {DOUX}">{texte_}</div>'
    depot = f'<div style="padding: 18px; border-radius: 14px; border: 1.5px dashed rgba(201,161,74,0.45); display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 14px; font-weight: 700; color: {TEXTE}">{ic("lien", 18, OR)}Glisse tes captures ici, ou <span style="color: {OR}; font-weight: 800">choisis-les</span></div>'
    nouveau = f"""<section aria-label="Nouveau ticket" style="display: [[affNouveau]]; flex-direction: column; gap: 18px; padding: 26px 28px; border-radius: 20px; background: linear-gradient(170deg, #1e160e, #130d08); border: 1px solid rgba(255,255,255,0.08)">
<h2 style="margin: 0; {BAL}; font-size: 26px; color: #fff">Nouveau ticket</h2>
{zone("DE QUOI S'AGIT-IL ?", f'<div role="radiogroup" style="display: flex; flex-wrap: wrap; gap: 8px">{categories}</div>')}
{zone("EN UNE PHRASE", saisie("Le pack des modèles se désactive à chaque lancement"))}
{zone("RACONTE-NOUS", saisie("Ce que tu faisais, ce qui s'est passé, ce que tu as déjà essayé…", 120))}
{zone("CAPTURES (FACULTATIF)", depot)}
<div style="display: flex; align-items: center; justify-content: space-between; gap: 16px"><span style="font-size: 13px; font-weight: 600; color: {DOUX}">Le ticket est lié à ton profil Origins : pas besoin de redonner ton pseudo.</span>{bouton_blanc("ENVOYER LE TICKET", "envoi", None, 50, 16)}</div>
</section>"""
    ferme = f"""<section aria-label="Ticket fermé" style="display: [[affFerme]]; flex-direction: column; border-radius: 20px; background: linear-gradient(170deg, #1e160e, #130d08); border: 1px solid rgba(255,255,255,0.08); overflow: hidden">
{entete_ticket("Mon achat n'est pas arrivé", "#1031", "Achat", "resolu", bouton_contour("Télécharger le transcript", "telecharger", None, 42, 14))}
<div style="margin: 18px 24px 0; padding: 12px 16px; border-radius: 12px; background: rgba(139,217,154,0.08); border: 1px solid rgba(139,217,154,0.25); display: flex; align-items: center; gap: 10px; font-size: 13.5px; font-weight: 700; color: {TEXTE}">{ic("coche", 17, VERT, 2.4)}Résolu le 3 novembre par Yunoow. La conversation est gardée ici, en lecture seule.</div>
<div style="flex: 1; padding: 20px 24px; display: flex; flex-direction: column; gap: 18px">
{bulle(LYRA, "J'ai acheté le pack de bienvenue mais je ne l'ai pas reçu en jeu.", "3 nov., 14:02", "droite")}
{bulle(YUNOOW, "Salut Lyra ! L'achat attendait que tu te connectes au serveur. Reconnecte-toi : il arrive tout de suite.", "3 nov., 14:20", "gauche", "STAFF")}
{bulle(LYRA, "Reçu, merci beaucoup !", "3 nov., 14:31", "droite")}
{evenement("Yunoow a fermé le ticket · 3 nov., 14:33")}</div>
<div style="padding: 16px 24px 20px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between"><span style="font-size: 13px; font-weight: 600; color: {DOUX}">Le souci revient ?</span>{bouton_contour("Rouvrir un ticket sur ce sujet", "redemarrer", None, 42, 14)}</div>
</section>"""
    invite = f"""<section aria-label="Ticket sans connexion" style="display: [[affInvite]]; flex-direction: column; gap: 18px; padding: 26px 28px; border-radius: 20px; background: linear-gradient(170deg, #1e160e, #130d08); border: 1px solid rgba(255,255,255,0.08)">
<div style="display: flex; align-items: center; gap: 12px"><h2 style="margin: 0; {BAL}; font-size: 26px; color: #fff">Ticket sans connexion</h2>{pastille("TU N'ARRIVES PAS À TE CONNECTER")}</div>
<p style="margin: 0; font-size: 14.5px; line-height: 1.55; font-weight: 600; color: {TEXTE}">Pas de launcher, pas de profil qui marche ? Donne ton pseudo et une adresse e-mail : on te répond par e-mail, avec un lien pour suivre le ticket.</p>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px">{zone("PSEUDO MINECRAFT", saisie("Lyra"))}{zone("E-MAIL POUR LA RÉPONSE", saisie("lyra@exemple.fr"))}</div>
{zone("EN UNE PHRASE", saisie("Le launcher reste bloqué sur la connexion Microsoft"))}
{zone("RACONTE-NOUS", saisie("Ce que tu faisais, le message d'erreur…", 96))}
<div style="display: flex; align-items: center; justify-content: space-between; gap: 16px"><span style="font-size: 13px; font-weight: 600; color: {DOUX}">L'adresse ne sert qu'à ce ticket.</span>{bouton_blanc("ENVOYER LE TICKET", "envoi", None, 50, 16)}</div>
</section>"""
    corps = f"""{nav("support", "joueur", True)}
<section style="padding: 40px 96px 0; display: flex; align-items: flex-end; justify-content: space-between; gap: 24px">
<div>{sur_titre("SUPPORT")}{titre1("Besoin d'aide ?", "titre-support", 46)}
{texte("Ouvre un ticket : l'équipe te répond ici, et tu es prévenu dans le launcher. Tout reste dans ton historique.", 16, TEXTE, "10px 0 0", 640)}</div>
<div style="display: flex; gap: 10px">{bouton_contour("Sans connexion", None, "[[versInvite]]", 52, 15)}{bouton_blanc("NOUVEAU TICKET", "plus", "[[versNouveau]]", 52, 16)}</div></section>
{maquette("etats").replace("top: 92px", "top: 88px")}
<div style="padding: 28px 96px 64px; display: grid; grid-template-columns: 380px minmax(0, 1fr); gap: 24px; align-items: start">{liste}<div>{conv}{nouveau}{ferme}{invite}</div></div>
{pied()}"""
    js = """    const etat = s.etat || 'conversation';
    const vue = { conversation: 'Conv', nouveau: 'Nouveau', ferme: 'Ferme', invite: 'Invite' };
    Object.keys(vue).forEach((e) => { v['aff' + vue[e]] = e === etat ? 'flex' : 'none'; });
    const fermes = etat === 'ferme' || s.onglet === 'fermes';
    v.affEnCours = fermes ? 'none' : 'flex';
    v.affFermes = fermes ? 'flex' : 'none';
    v.fondEnCours = fermes ? 'transparent' : '#ffffff'; v.coulEnCours = fermes ? '#f0e6cf' : C.orFonce;
    v.fondFermes = fermes ? '#ffffff' : 'transparent'; v.coulFermes = fermes ? C.orFonce : '#f0e6cf';
    v.ongletEnCours = () => this.setState({ onglet: 'en_cours', etat: 'conversation' });
    v.ongletFermes = () => this.setState({ onglet: 'fermes', etat: 'ferme' });
    v.versNouveau = () => this.setState({ etat: 'nouveau' });
    v.versInvite = () => this.setState({ etat: 'invite' });
    v.voir_1042 = () => this.setState({ etat: 'conversation', onglet: 'en_cours' });
    v.voir_1031 = () => this.setState({ etat: 'ferme', onglet: 'fermes' });
    v.voir_1007 = () => this.setState({ etat: 'ferme', onglet: 'fermes' });
    ['1042', '1031', '1007'].forEach((t) => {
      const ici = (t === '1042' && etat === 'conversation') || (t === '1031' && etat === 'ferme');
      v['fondT_' + t] = ici ? 'rgba(201,161,74,0.12)' : 'transparent';
      v['bordT_' + t] = ici ? C.or : 'transparent';
    });
    const cat = s.cat || 'bug';
    C.categories.forEach((c) => {
      v['catFond_' + c] = c === cat ? 'rgba(201,161,74,0.18)' : 'transparent';
      v['catBord_' + c] = c === cat ? C.or : 'rgba(255,255,255,0.16)';
      v['cat_' + c] = () => this.setState({ cat: c });
    });
    v.bordSaisie = 'rgba(255,255,255,0.18)'; v.fondSaisie = 'rgba(0,0,0,0.25)';
    v.etats = [['conversation', 'Conversation'], ['nouveau', 'Nouveau ticket'], ['ferme', 'Ticket fermé'], ['invite', 'Sans connexion']].map((e) => ({
      nom: e[1], presse: e[0] === etat ? 'true' : 'false',
      fond: e[0] === etat ? '#ffffff' : 'transparent', couleur: e[0] === etat ? C.orFonce : '#f0e6cf',
      choisir: () => this.setState({ etat: e[0], onglet: e[0] === 'ferme' ? 'fermes' : 'en_cours' })
    }));"""
    return corps, logique(js, {"orFonce": OR_FONCE, "or": OR, "categories": [c for c, _, _ in CATEGORIES]}), 1350



GRADE_STAFF = "1572106903746642100"   # grade Discord qui ouvre la page Tickets (Yunoow, 17/11)


def tickets_staff():
    vue = lambda cle, icone, nom, n, point=None: (
        f'<button onClick="[[vue_{cle}]]" style="height: 40px; padding: 0 10px; border: 0; border-radius: 10px; background: [[vueFond_{cle}]]; color: [[vueCoul_{cle}]]; '
        f'display: flex; align-items: center; gap: 10px; {NUN}; font-weight: 800; font-size: 14px; cursor: pointer; text-align: left">{ic(icone, 18)}'
        f'<span style="flex: 1">{nom}</span>' + (f'<span style="width: 8px; height: 8px; border-radius: 50%; background: {point}"></span>' if point else "") +
        f'<span style="font-size: 12px; color: {DOUX}">{n}</span></button>')
    cats = "".join(f'<span style="display: flex; align-items: center; gap: 10px; height: 30px; padding: 0 10px; font-size: 13.5px; font-weight: 700; color: {TEXTE}">'
                   f'<span style="width: 8px; height: 8px; border-radius: 50%; background: {coul}"></span>{nom}</span>' for _, nom, coul in CATEGORIES)
    colonne_a = f"""<aside aria-label="Vues" style="padding: 22px 16px; background: #120d09; border-right: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; gap: 4px">
{sur_titre("TICKETS")}<h1 style="margin: 4px 0 14px; {BAL}; font-size: 24px; color: #fff">Boîte du staff</h1>
{vue("nouveaux", "bulle", "Non attribués", 2, "#e2574c")}{vue("miens", "utilisateur", "Les miens", 1)}{vue("attente", "horloge", "En attente du joueur", 2)}{vue("resolus", "coche", "Résolus (7 jours)", 14)}{vue("transcripts", "livre", "Transcripts", 128)}
<span style="margin: 18px 10px 4px; font-size: 11px; font-weight: 800; letter-spacing: 0.16em; color: {DOUX}">CATÉGORIES</span>{cats}
<div style="margin-top: auto; padding: 14px; border-radius: 14px; background: rgba(201,161,74,0.08); border: 1px solid rgba(201,161,74,0.22); display: flex; flex-direction: column; gap: 6px">
<span style="display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 800; color: #fff">{ic("bouclier", 16, OR)}Qui voit cette page</span>
<span style="font-size: 12px; line-height: 1.5; font-weight: 600; color: {DOUX}">Le grade staff du Discord d'Origins <code style="font-family: ui-monospace, Menlo, monospace; font-size: 10.5px; color: {OR}">{GRADE_STAFF}</code>, et Origins board.</span></div>
</aside>"""
    liste = "".join([
        element_ticket("1045", "Un joueur bloque l'entrée de la ville", "Tomo · Signalement · il y a 12 min", "nouveau", avatar_html=av.avatar("tomo", 36)),
        element_ticket("1042", "Les mobs ont l'apparence d'animaux", "Lyra · Bug en jeu · il y a 5 min", "en_cours", non_lu=True, avatar_html=av.avatar("lyra", 36)),
        element_ticket("1044", "Le launcher reste sur « Vérification »", "Kaze · Launcher · il y a 1 h", "nouveau", avatar_html=av.avatar("kaze", 36)),
        element_ticket("1043", "Où trouver la pioche du sanctuaire ?", "Nami · Question · il y a 3 h", "attente_staff", avatar_html=av.avatar("nami", 36)),
        element_ticket("1040", "Remboursement d'un pack", "Rui · Achat · hier", "attente_staff", avatar_html=av.avatar("rui", 36)),
    ])
    colonne_b = f"""<section aria-label="Tickets" style="display: [[affConv]]; flex-direction: column; gap: 6px; padding: 18px 14px; border-right: 1px solid rgba(255,255,255,0.07); overflow: hidden">
<div style="height: 42px; margin-bottom: 8px; padding: 0 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.14); background: rgba(0,0,0,0.25); display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; color: {DOUX}">{ic("cherche", 18)}Chercher un ticket, un pseudo…</div>
{liste}</section>"""
    ligne_fiche = lambda icone, gauche, droite: (f'<div style="display: flex; align-items: center; gap: 10px; padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,0.06)">'
                                                 f'<span style="color: {OR}; display: flex">{ic(icone, 17)}</span><span style="flex: 1; font-size: 13px; font-weight: 700; color: {DOUX}">{gauche}</span>'
                                                 f'<span style="font-size: 13px; font-weight: 800; color: #fff">{droite}</span></div>')
    precedent = lambda num, titre: (f'<div style="display: flex; align-items: center; gap: 8px; padding: 8px 0"><span style="flex: 1; display: flex; flex-direction: column; gap: 1px">'
                                    f'<strong style="font-size: 13px; color: #fff">{titre}</strong><span style="font-size: 11.5px; font-weight: 600; color: {DOUX}">{num} · résolu</span></span>'
                                    f'<button class="so-lien" aria-label="Transcript {num}" style="padding: 0; border: 0; background: transparent; color: {OR}; cursor: pointer; display: flex">{ic("livre", 17)}</button></div>')
    fiche = f"""<aside aria-label="Fiche du joueur" style="width: 270px; flex: none; box-sizing: border-box; padding: 20px 18px; border-left: 1px solid rgba(255,255,255,0.07); background: #120d09; display: flex; flex-direction: column; gap: 4px">
<div style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding-bottom: 12px">{av.avatar("lyra", 68, False)}<strong style="{BAL}; font-size: 22px; color: #fff">Lyra</strong>
<span style="font-size: 12px; font-weight: 700; color: {DOUX}">Origins ID <b style="font-family: ui-monospace, Menlo, monospace; color: #fff">7HQ2-LM4C</b></span></div>
{ligne_fiche("manette", "Minecraft", "Lyra")}{ligne_fiche("serveur", "En jeu", f'<span style="color: {VERT}">● en ligne</span>')}{ligne_fiche("bulle", "Discord", f'<span style="color: {DOUX}">pas lié</span>')}{ligne_fiche("panier", "Achats", "1")}{ligne_fiche("horloge", "Profil créé", "oct.\u00a02026")}
<span style="margin-top: 14px; font-size: 11px; font-weight: 800; letter-spacing: 0.16em; color: {DOUX}">TICKETS PRÉCÉDENTS</span>
{precedent("#1031", "Mon achat n'est pas arrivé")}{precedent("#1007", "Je n'arrive plus à me connecter")}
<div style="margin-top: auto">{bouton_contour("Voir son profil", "utilisateur", None, 40, 13.5, "100%")}</div></aside>"""
    onglets = (f'<div role="tablist" style="display: flex; gap: 6px">'
               f'<button role="tab" aria-selected="[[repPresse]]" onClick="[[modeReponse]]" style="height: 32px; padding: 0 12px; border-radius: 9px; border: 0; background: [[repFond]]; color: [[repCoul]]; {NUN}; font-weight: 800; font-size: 13px; cursor: pointer">Répondre à Lyra</button>'
               f'<button role="tab" aria-selected="[[notePresse]]" onClick="[[modeNote]]" style="height: 32px; padding: 0 12px; border-radius: 9px; border: 0; background: [[noteFond]]; color: [[noteCoul]]; {NUN}; font-weight: 800; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px">{ic("cadenas", 14)}Note interne</button></div>')
    actions = f'<div style="display: flex; align-items: center; gap: 8px; flex: none">{bouton_contour("En attente", "horloge", None, 38, 13)}{bouton_or("Résoudre", "coche", "[[resoudre]]", 38, 13)}</div>'
    pris = f'<span style="font-size: 12.5px; font-weight: 700; color: {DOUX}">Pris par <b style="color: #fff">Mity</b></span>'
    colonne_c = f"""<section aria-label="Conversation" style="display: [[affConv]]; min-width: 0">
<div style="flex: 1; min-width: 0; display: flex; flex-direction: column">
<div style="padding: 16px 24px 18px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 8px">
<div style="display: flex; align-items: center; justify-content: space-between; gap: 12px"><span style="font-size: 12.5px; font-weight: 800; color: {DOUX}">Ticket #1042</span>{actions}</div>
<h2 style="margin: 0; {BAL}; font-size: 24px; line-height: 1.15; color: #fff">Les mobs ont l'apparence d'animaux</h2>
<div style="display: flex; align-items: center; gap: 12px">{puce_cat("Bug en jeu")}{statut("en_cours")}{pris}</div></div>
<div style="display: [[affResolu]]; margin: 14px 24px 0; padding: 11px 14px; border-radius: 12px; background: rgba(139,217,154,0.08); border: 1px solid rgba(139,217,154,0.25); align-items: center; gap: 10px; font-size: 13px; font-weight: 700; color: {TEXTE}">{ic("coche", 16, VERT, 2.4)}Résolu : le transcript est enregistré (notes comprises) et Lyra garde sa copie, sans les notes.</div>
<div style="flex: 1; padding: 20px 24px; display: flex; flex-direction: column; gap: 16px">{conversation_1042(staff=True)}</div>
{compositeur("[[saisieTexte]]", onglets, f'<button class="so-contour" style="height: 40px; padding: 0 12px; border-radius: 11px; border: 1.5px solid rgba(255,255,255,0.18); background: transparent; color: #fff; display: flex; align-items: center; gap: 7px; {NUN}; font-weight: 800; font-size: 13px; cursor: pointer; white-space: nowrap">Réponses toutes faites{ic("chevron", 14)}</button>')}
</div>{fiche}</section>"""
    rang_t = lambda num, sujet, joueur, cat, par, date: (
        f'<tr class="so-ligne"><td style="padding: 13px 12px; font-family: ui-monospace, Menlo, monospace; font-size: 12.5px; color: {DOUX}">{num}</td>'
        f'<td style="padding: 13px 12px; font-size: 14px; font-weight: 800; color: #fff">{sujet}</td><td style="padding: 13px 12px; font-size: 13.5px; font-weight: 700">{joueur}</td>'
        f'<td style="padding: 13px 12px">{puce_cat(cat)}</td><td style="padding: 13px 12px; font-size: 13.5px; font-weight: 700">{par}</td>'
        f'<td style="padding: 13px 12px; font-size: 13px; font-weight: 600; color: {DOUX}">{date}</td>'
        f'<td style="padding: 13px 12px; text-align: right; white-space: nowrap">{lien_or("Lire")}<span style="display: inline-block; width: 16px"></span>{lien_or(ic("telecharger", 16) + "Télécharger")}</td></tr>')
    lignes = "".join([rang_t("#1041", "Pas de son dans le launcher", "Rui", "Launcher", "Yunoow", "16 nov."),
                      rang_t("#1039", "Bloqué dans un mur à Hjalvik", "Kaze", "Bug en jeu", "Mity", "15 nov."),
                      rang_t("#1038", "Insultes dans le chat", "Tomo", "Signalement", "Yunoow", "14 nov."),
                      rang_t("#1031", "Mon achat n'est pas arrivé", "Lyra", "Achat", "Yunoow", "3 nov."),
                      rang_t("#1027", "Changer mon nom Origins", "Nami", "Question", "Mity", "1 nov."),
                      rang_t("#1007", "Je n'arrive plus à me connecter", "Lyra", "Connexion", "Mity", "28 oct.")])
    entete_col = lambda t: f'<th scope="col" style="padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 800; letter-spacing: 0.14em; color: {DOUX}">{t}</th>'
    transcripts = f"""<section aria-label="Transcripts" style="display: [[affTrans]]; grid-column: span 2; flex-direction: column; gap: 18px; padding: 26px 32px; min-width: 0">
<div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 20px"><div>{sur_titre("ARCHIVES")}<h2 style="margin: 6px 0 0; {BAL}; font-size: 30px; color: #fff">Transcripts</h2>
<p style="margin: 8px 0 0; max-width: 620px; font-size: 14.5px; line-height: 1.55; font-weight: 600; color: {TEXTE}">Chaque ticket fermé est enregistré ici, notes internes comprises. Le joueur garde aussi sa copie, sans les notes.</p></div>
{bouton_contour("Tout exporter", "telecharger", None, 44, 14)}</div>
<div style="display: flex; gap: 10px"><div style="flex: 1; height: 44px; padding: 0 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.14); background: rgba(0,0,0,0.25); display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; color: {DOUX}">{ic("cherche", 18)}Chercher un mot, un pseudo, un numéro…</div>
{"".join(f'<span style="height: 44px; padding: 0 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.14); display: flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 800; color: #fff">{f}{ic("chevron", 14)}</span>' for f in ["Catégorie", "Staff", "30 derniers jours"])}</div>
<table style="width: 100%; border-collapse: collapse; border-radius: 16px; overflow: hidden; background: linear-gradient(170deg, #1e160e, #130d08)">
<thead><tr style="border-bottom: 1px solid rgba(255,255,255,0.08)">{entete_col("N°")}{entete_col("SUJET")}{entete_col("JOUEUR")}{entete_col("CATÉGORIE")}{entete_col("FERMÉ PAR")}{entete_col("DATE")}<th></th></tr></thead>
<tbody>{lignes}</tbody></table>
<span style="font-size: 12.5px; font-weight: 600; color: {DOUX}">128 transcripts · gardés tant que le profil existe</span>
</section>"""
    corps = f"""{nav("tickets", "equipe", True)}
<div style="position: absolute; top: 76px; left: 0; right: 0; bottom: 0; display: grid; grid-template-columns: 236px 372px minmax(0, 1fr)">
{colonne_a}{colonne_b}{colonne_c}{transcripts}</div>
{maquette("etats").replace("top: 92px; left: 50%; transform: translateX(-50%)", "bottom: 24px; left: 250px")}"""
    js = """    const etat = s.etat || 'conversation';
    v.affConv = etat === 'conversation' ? 'flex' : 'none';
    v.affTrans = etat === 'transcripts' ? 'flex' : 'none';
    const vues = { nouveaux: 'conversation', miens: 'conversation', attente: 'conversation', resolus: 'conversation', transcripts: 'transcripts' };
    const vueActive = s.vue || 'miens';
    Object.keys(vues).forEach((k) => {
      const ici = (etat === 'transcripts') ? k === 'transcripts' : k === vueActive;
      v['vueFond_' + k] = ici ? 'rgba(201,161,74,0.16)' : 'transparent';
      v['vueCoul_' + k] = ici ? '#ffffff' : '#f0e6cf';
      v['vue_' + k] = () => this.setState({ vue: k, etat: vues[k] });
    });
    ['1045', '1042', '1044', '1043', '1040'].forEach((t) => {
      v['fondT_' + t] = t === '1042' ? 'rgba(201,161,74,0.12)' : 'transparent';
      v['bordT_' + t] = t === '1042' ? C.or : 'transparent';
      v['voir_' + t] = () => this.setState({ etat: 'conversation' });
    });
    const note = s.mode === 'note';
    v.repPresse = note ? 'false' : 'true'; v.notePresse = note ? 'true' : 'false';
    v.repFond = note ? 'transparent' : '#ffffff'; v.repCoul = note ? '#f0e6cf' : C.orFonce;
    v.noteFond = note ? 'rgba(201,161,74,0.2)' : 'transparent'; v.noteCoul = note ? C.or : '#f0e6cf';
    v.modeReponse = () => this.setState({ mode: 'reponse' });
    v.modeNote = () => this.setState({ mode: 'note' });
    v.bordSaisie = note ? 'rgba(201,161,74,0.6)' : 'rgba(255,255,255,0.18)';
    v.fondSaisie = note ? 'rgba(201,161,74,0.06)' : 'rgba(0,0,0,0.25)';
    v.saisieTexte = note ? 'Note pour le staff : Lyra ne la verra pas…' : 'Écris à Lyra…';
    v.affResolu = s.resolu ? 'flex' : 'none';
    v.resoudre = () => this.setState({ resolu: true });
    v.etats = [['conversation', 'Conversation'], ['transcripts', 'Transcripts']].map((e) => ({
      nom: e[1], presse: e[0] === etat ? 'true' : 'false',
      fond: e[0] === etat ? '#ffffff' : 'transparent', couleur: e[0] === etat ? C.orFonce : '#f0e6cf',
      choisir: () => this.setState({ etat: e[0] })
    }));"""
    return corps, logique(js, {"orFonce": OR_FONCE, "or": OR}), 1060



# ---------------------------------------------------------------- Board : la Console Tempest dans la DA du site
ONGLETS_BOARD = [
    ("SERVEUR", [("mel", "Mise en ligne", "nuage", "Récupérer et compiler main, l'aperçu, la mise en ligne de nos mods et plugins."),
                 ("launcher", "Launcher", "fenetre", "Les mods d'autres auteurs (Modrinth : chercher, mettre à jour, retirer), les shaders et les packs."),
                 ("serveur", "Serveur", "serveur", "En marche ou non, les joueurs en ligne, « Redémarrer le serveur » avec le compte à rebours en jeu."),
                 ("copies", "Copies", "copie", "Les 30 dernières opérations, et « Revenir à avant celle-ci »."),
                 ("journal", "Journal", "liste", "Qui a fait quoi, et si ça a marché : les 200 dernières opérations.")]),
    ("ATELIER", [("carte", "Carte & spawners", "carte", "La carte du monde, le sol d'un point, la vue 3D des blocs ; poser et retirer un spawner."),
                 ("mythicmobs", "MythicMobs", "monstre", "Le contenu de main comparé au serveur, les mobs et leur modèle 3D animé, la mise en ligne sans redémarrer."),
                 ("items", "Items", "epee", "Les objets et les panoplies de TempestFX ; modifier, créer, écrire dans main."),
                 ("pnj", "PNJ", "utilisateur", "Les PNJ et leurs quêtes, en lecture."),
                 ("quetes", "Quêtes", "parchemin", "Les quêtes par catégorie ; modifier, créer, mettre en ligne.")]),
    ("AIDE", [("guide", "Guide", "livre", "Comment marche chaque ajout, expliqué pour l'équipe.")]),
]
PROJETS = [("tempest", "Tempest"), ("launcher", "Origins Launcher"), ("site", "Site Origins")]
LIGNES_MEL = [("classes", "OriginsClasses", "PLUGIN", "0.5.11", "0.5.12"), ("fx", "TempestFX", "PLUGIN", "0.4.12", "0.4.13"),
              ("socle", "Socle", "PLUGIN", "0.2.0", "0.2.1"), ("metiers", "MetiersTempest", "PLUGIN", "—", "0.3.0"),
              ("inventaire", "Inventaire", "PLUGIN", "0.3.3", "0.3.3"), ("chat", "Origins Chat", "MOD", "0.7.2", "0.7.3"),
              ("hud", "TempestHud", "MOD", "0.2.0", "0.2.0")]


def board():
    import logo7
    oeil_rail = logo7.logo(("feu", {"regard": 2, "bas": 3, "taille_pupille": 0.9}), 36, uid="rail-l", libelle="")
    tuile = lambda cle, contenu, nom: (f'<button onClick="[[projet_{cle}]]" aria-label="{nom}" title="{nom}" style="width: 52px; height: 52px; border-radius: 15px; border: 2px solid [[projBord_{cle}]]; '
                                       f'background: #19120d; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; overflow: hidden">{contenu}</button>')
    rail = f"""<nav aria-label="Projets" style="padding: 18px 0; background: #0b0806; border-right: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; align-items: center; gap: 12px">
{tuile("tempest", f'<span style="width: 44px; height: 44px; background: url({av.gen.LOGO_TEMPEST}) center / contain no-repeat"></span>', "Tempest")}
{tuile("launcher", f'<span style="width: 36px; height: 36px; display: flex">{oeil_rail}</span>', "Origins Launcher")}
{tuile("site", f'<span style="color: {OR}; display: flex">{ic("globe", 26)}</span>', "Site Origins")}
<span aria-hidden="true" style="width: 28px; height: 1px; background: rgba(255,255,255,0.12)"></span>
<button aria-label="Ajouter un projet" style="width: 52px; height: 52px; border-radius: 15px; border: 1.5px dashed rgba(255,255,255,0.22); background: transparent; color: {DOUX}; display: flex; align-items: center; justify-content: center; cursor: pointer">{ic("plus", 22)}</button></nav>"""
    groupes = ""
    for titre, onglets in ONGLETS_BOARD:
        groupes += f'<span style="margin: 14px 12px 4px; font-size: 11px; font-weight: 800; letter-spacing: 0.16em; color: {DOUX}">{titre}</span>'
        for cle, nom, icone, _ in onglets:
            badge = (f'<span style="min-width: 20px; height: 20px; padding: 0 6px; box-sizing: border-box; border-radius: 10px; background: {OR}; color: {SUR_OR}; '
                     f'font-size: 11px; font-weight: 800; display: [[affBadgeMel]]; align-items: center; justify-content: center">[[nbMel]]</span>') if cle == "mel" else ""
            groupes += (f'<button onClick="[[tab_{cle}]]" aria-current="[[tabCourant_{cle}]]" style="height: 40px; padding: 0 12px; border: 0; border-radius: 11px; '
                        f'background: [[tabFond_{cle}]]; color: [[tabCoul_{cle}]]; display: flex; align-items: center; gap: 11px; {NUN}; font-weight: 800; '
                        f'font-size: 14px; cursor: pointer; text-align: left">{ic(icone, 18)}<span style="flex: 1">{nom}</span>{badge}</button>')
    sidebar = f"""<aside aria-label="Onglets du Board" style="padding: 20px 14px; background: #120d09; border-right: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; gap: 2px">
<div style="padding: 0 10px 6px"><span style="{BAL}; font-size: 24px; color: #fff">[[projetNom]]</span><p style="margin: 2px 0 0; font-size: 12.5px; font-weight: 700; color: {DOUX}">[[projetSous]]</p></div>
{groupes}
<div style="margin-top: auto; padding: 14px; border-radius: 16px; background: rgba(201,161,74,0.07); border: 1px solid rgba(201,161,74,0.2); display: flex; flex-direction: column; gap: 10px">
<div style="display: flex; align-items: center; gap: 10px"><svg aria-hidden="true" width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="{OR}"><circle cx="20" cy="20" r="17" stroke-dasharray="3 3"/><circle cx="20" cy="20" r="11" stroke-width="1.2"/><polygon points="20,9 29.5,25.5 10.5,25.5"/></svg>
<span style="font-size: 13px; line-height: 1.4; font-weight: 700; color: {TEXTE}">[[raphael]]</span></div>
{bouton_contour("Visite guidée", None, None, 36, 13, "100%")}</div></aside>"""
    lignes = ""
    for cle, nom, sorte, enligne, main in LIGNES_MEL:
        lignes += (f'<tr class="so-ligne" style="border-bottom: 1px solid rgba(255,255,255,0.06)">'
                   f'<td style="padding: 13px 16px"><span style="display: flex; flex-direction: column; gap: 2px"><strong style="font-size: 14.5px; color: #fff">{nom}</strong></span></td>'
                   f'<td style="padding: 13px 8px">{pastille(sorte, DOUX, "rgba(255,255,255,0.07)")}</td>'
                   f'<td style="padding: 13px 8px; font-family: ui-monospace, Menlo, monospace; font-size: 13px; color: {TEXTE}">[[enLigne_{cle}]]</td>'
                   f'<td style="padding: 13px 8px; font-family: ui-monospace, Menlo, monospace; font-size: 13px; color: #fff">{main}</td>'
                   f'<td style="padding: 13px 8px"><span style="display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 800; color: [[stCoul_{cle}]]; white-space: nowrap">'
                   f'<span style="width: 8px; height: 8px; border-radius: 50%; background: [[stCoul_{cle}]]"></span>[[st_{cle}]]</span></td>'
                   f'<td style="padding: 13px 16px; text-align: right"><button class="so-contour" onClick="[[apercu_{cle}]]" style="display: [[affApercu_{cle}]]; height: 34px; padding: 0 12px; '
                   f'border-radius: 10px; border: 1.5px solid rgba(201,161,74,0.6); background: transparent; color: #fff; {NUN}; font-weight: 800; font-size: 13px; cursor: pointer; '
                   f'margin-left: auto; align-items: center; gap: 6px; white-space: nowrap">{ic("lecture", 14, OR)}Aperçu</button></td></tr>')
    entete_col = lambda t, pad="10px 8px": f'<th scope="col" style="padding: {pad}; text-align: left; font-size: 11px; font-weight: 800; letter-spacing: 0.14em; color: {DOUX}">{t}</th>'
    tableau = f"""<table style="width: 100%; border-collapse: collapse; border-radius: 18px; overflow: hidden; background: linear-gradient(170deg, #1e160e, #130d08)">
<thead><tr style="border-bottom: 1px solid rgba(255,255,255,0.08)">{entete_col("PROJET", "12px 16px")}{entete_col("SORTE")}{entete_col("EN LIGNE")}{entete_col("DANS MAIN")}{entete_col("STATUT")}<th></th></tr></thead>
<tbody>{lignes}</tbody></table>"""
    journal_l = lambda av_html, qui, quoi, quand: (f'<div style="display: flex; gap: 10px; padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,0.06)">{av_html}'
                                                   f'<span style="display: flex; flex-direction: column; gap: 1px"><span style="font-size: 13px; line-height: 1.4; font-weight: 600; color: {TEXTE}"><b style="color: #fff">{qui}</b> {quoi}</span>'
                                                   f'<span style="font-size: 11.5px; font-weight: 600; color: {DOUX}">{quand}</span></span></div>')
    cote = f"""<div style="display: [[affCote]]; flex-direction: column; gap: 18px">
{panneau(f'<div style="display: flex; align-items: center; justify-content: space-between"><h2 style="margin: 0; {BAL}; font-size: 20px; color: #fff">Serveur</h2><span style="display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 800; color: {VERT}"><span style="width: 9px; height: 9px; border-radius: 50%; background: {VERT}"></span>En marche</span></div>'
         f'<div style="display: flex; align-items: center; gap: 10px; margin: 14px 0"><div style="display: flex; padding-left: 8px">{"".join(f"<span style=\'margin-left: -8px; border-radius: 50%; border: 2px solid #19120d; display: flex\'>{av.avatar(q, 30)}</span>" for q in ["lyra", "tomo", "kaze"])}</div><span style="font-size: 13.5px; font-weight: 700; color: {TEXTE}">3 joueurs en ligne</span></div>'
         f'<div style="display: [[affRedemarrage]]; margin-bottom: 12px; padding: 10px 12px; border-radius: 12px; background: rgba(201,161,74,0.1); border: 1px solid rgba(201,161,74,0.3); align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: {TEXTE}">{ic("horloge", 16, OR)}Redémarrage dans 4:59, annoncé en jeu</div>'
         f'<p style="margin: 0 0 12px; font-size: 12.5px; font-weight: 600; color: {DOUX}">[[attenteRedemarrage]]</p>'
         + bouton_contour("Redémarrer le serveur", "redemarrer", None, 40, 13.5, "100%"), "20px")}
{panneau(f'<h2 style="margin: 0 0 6px; {BAL}; font-size: 20px; color: #fff">Journal</h2><div style="display: [[affNouvelleLigne]]">' + journal_l(av.avatar("moi", 30), "Yunoow", "a mis en ligne OriginsClasses 0.5.12", "à l'instant") + '</div>'
         + journal_l(avatar_lettre("Mity", "#4a6fa5", 30), "Mity", "a mis en ligne TempestFX 0.4.12", "hier, 22:14")
         + journal_l(av.avatar("moi", 30), "Yunoow", "a ajouté le shader Complementary", "hier, 18:02")
         + journal_l(avatar_lettre("Raphaël", "#3f7f6a", 30), "Raphaël", "a redémarré le serveur", "lundi, 21:40")
         + f'<div style="margin-top: 10px">{lien_or("Tout le journal →")}</div>', "20px")}</div>"""
    changements = "".join(f'<li style="display: flex; gap: 10px; font-size: 13.5px; line-height: 1.5; font-weight: 600; color: {TEXTE}"><span style="color: {OR}; display: flex; padding-top: 2px">{ic("coche", 15, OR, 2.4)}</span>{t}</li>'
                          for t in ["Passifs au choix pour toutes les classes : /passif", "Fureur du berserker, seulement si elle est choisie", "sorts.yml passe en version 12"])
    apercu = f"""<section aria-label="Aperçu" style="display: [[affApercu]]; flex-direction: column; gap: 14px; padding: 22px; border-radius: 20px; background: {VERRE}; border: 1px solid rgba(201,161,74,0.4); box-shadow: 0 20px 50px rgba(0,0,0,0.5)">
<div style="display: flex; align-items: center; justify-content: space-between">{sur_titre("APERÇU")}<button onClick="[[fermerApercu]]" aria-label="Fermer l'aperçu" style="width: 32px; height: 32px; border-radius: 50%; border: 0; background: rgba(255,255,255,0.1); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer">{ic("croix", 15)}</button></div>
<h2 style="margin: 0; {BAL}; font-size: 24px; line-height: 1.15; color: #fff">OriginsClasses</h2>
<div style="display: flex; align-items: center; gap: 10px; font-family: ui-monospace, Menlo, monospace; font-size: 15px; color: {DOUX}">0.5.11 <span style="color: {OR}">→</span> <b style="color: #fff">0.5.12</b></div>
<ul style="list-style: none; margin: 4px 0; padding: 0; display: flex; flex-direction: column; gap: 8px">{changements}</ul>
<p style="margin: 0; font-size: 12.5px; line-height: 1.5; font-weight: 600; color: {DOUX}">Une copie datée est faite avant : « Revenir à avant celle-ci » dans Copies. Avec du monde en ligne, le redémarrage attend 5 minutes, annoncé en jeu.</p>
{bouton_or("Mettre en ligne", "nuage", "[[mettreEnLigne]]", 44, 14.5)}
{bouton_contour("Au prochain redémarrage", "horloge", "[[fermerApercu]]", 42, 13.5, "100%")}
</section>"""
    mel = f"""<div style="display: [[affMel]]; flex-direction: column; gap: 22px">
<div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 20px">
<div>{sur_titre("TEMPEST · SERVEUR")}<h1 style="margin: 6px 0 0; {BAL}; font-size: 36px; color: #fff">Mise en ligne</h1>
<p style="margin: 6px 0 0; font-size: 14.5px; font-weight: 600; color: {TEXTE}">Nos mods et plugins, compilés depuis main sur le VPS. Un aperçu avant chaque mise en ligne, une copie pour revenir en arrière.</p></div>
<div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px">{bouton_or("Récupérer et compiler main", "redemarrer", None, 46, 14.5)}
<span style="display: flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 700; color: {DOUX}"><span style="width: 8px; height: 8px; border-radius: 50%; background: {VERT}"></span>main · <code style="font-family: ui-monospace, Menlo, monospace; color: {TEXTE}">ea33000</code> · compilé il y a 12 min</span></div></div>
<div style="display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 22px; align-items: start">
<div style="display: flex; flex-direction: column; gap: 14px">{tableau}
<div style="display: flex; align-items: center; justify-content: space-between"><span style="font-size: 12.5px; font-weight: 600; color: {DOUX}">« Tout mettre à jour » prend aussi le contenu déjà en ligne que main a changé.</span>{bouton_contour("Tout mettre à jour", "nuage", None, 42, 14)}</div></div>
<div>{cote}{apercu}</div></div></div>"""
    autre = f"""<div style="display: [[affAutre]]; flex-direction: column; align-items: flex-start; gap: 14px; padding: 40px; border-radius: 22px; border: 1.5px dashed rgba(201,161,74,0.35); background: rgba(201,161,74,0.04)">
{sur_titre("[[autreGroupe]]")}<h1 style="margin: 0; {BAL}; font-size: 36px; color: #fff">[[autreTitre]]</h1>
<p style="margin: 0; max-width: 640px; font-size: 16px; line-height: 1.6; font-weight: 600; color: {TEXTE}">[[autreTexte]]</p>
<p style="margin: 0; max-width: 640px; font-size: 14px; line-height: 1.6; font-weight: 600; color: {DOUX}">Cet onglet garde tout ce qu'il fait aujourd'hui dans la Console Tempest : seule la DA change (Or et ébène, même navigation que le site).</p></div>"""
    corps = f"""{nav("board", "equipe", True)}
<div style="position: absolute; top: 76px; left: 0; right: 0; bottom: 0; display: grid; grid-template-columns: 84px 250px minmax(0, 1fr)">
{rail}{sidebar}
<main style="padding: 28px 36px; overflow: hidden">{mel}{autre}</main></div>"""
    onglets_js = [[cle, nom, groupe, desc] for groupe, liste in ONGLETS_BOARD for cle, nom, _, desc in liste]
    js = """    const tab = s.tab || 'mel';
    const projet = s.projet || 'tempest';
    C.onglets.forEach((o) => {
      const ici = o[0] === tab;
      v['tabFond_' + o[0]] = ici ? 'rgba(201,161,74,0.16)' : 'transparent';
      v['tabCoul_' + o[0]] = ici ? '#ffffff' : '#f0e6cf';
      v['tabCourant_' + o[0]] = ici ? 'page' : 'false';
      v['tab_' + o[0]] = () => this.setState({ tab: o[0] });
    });
    const P = C.projets[projet];
    C.ids.forEach((p) => {
      v['projBord_' + p] = p === projet ? C.or : 'transparent';
      v['projet_' + p] = () => this.setState({ projet: p, tab: 'mel' });
    });
    v.projetNom = P[0]; v.projetSous = P[1];
    const autre = projet !== 'tempest' || tab !== 'mel';
    v.affMel = autre ? 'none' : 'flex';
    v.affAutre = autre ? 'flex' : 'none';
    const o = C.onglets.find((x) => x[0] === tab);
    v.autreGroupe = projet === 'tempest' ? o[2] + ' · TEMPEST' : P[0].toUpperCase();
    v.autreTitre = projet === 'tempest' ? o[1] : P[0];
    v.autreTexte = projet === 'tempest' ? o[3] : P[2];
    const fait = !!s.fait;
    const apercu = s.apercu && !fait;
    v.affApercu = apercu ? 'flex' : 'none';
    v.affCote = apercu ? 'none' : 'flex';
    v.fermerApercu = () => this.setState({ apercu: false });
    v.mettreEnLigne = () => this.setState({ fait: true, apercu: false });
    v.affNouvelleLigne = fait ? 'block' : 'none';
    v.affRedemarrage = fait ? 'flex' : 'none';
    v.attenteRedemarrage = fait ? 'OriginsClasses 0.5.12 part au redémarrage.' : 'Aucun plugin en attente du prochain redémarrage.';
    let reste = 0;
    C.lignes.forEach((l) => {
      const cle = l[0];
      const aJour = l[3] === l[4] || (cle === 'classes' && fait);
      const pasEnLigne = l[3] === '—';
      if (!aJour) reste += 1;
      v['enLigne_' + cle] = (cle === 'classes' && fait) ? l[4] : l[3];
      v['st_' + cle] = aJour ? 'À jour' : pasEnLigne ? 'Pas encore en ligne' : 'Nouvelle version';
      v['stCoul_' + cle] = aJour ? C.vert : C.or;
      v['affApercu_' + cle] = aJour ? 'none' : 'inline-flex';
      v['apercu_' + cle] = () => this.setState({ apercu: true });
    });
    v.nbMel = String(reste); v.affBadgeMel = reste ? 'flex' : 'none';
    v.raphael = fait ? 'Mise en ligne faite. Le serveur redémarre dans 5 minutes.' : 'Raphaël attend tes ordres.';"""
    cfg = {"or": OR, "vert": VERT, "onglets": onglets_js, "ids": [p for p, _ in PROJETS],
           "projets": {"tempest": ["Tempest", "Paper 1.21.11 · VPS", ""],
                       "launcher": ["Origins Launcher", "Versions Windows, Mac, Linux", "Publier une version du launcher depuis le dépôt : GitHub fabrique les trois systèmes, on vérifie, on publie (la maquette « Console Origins · Publier le launcher »)."],
                       "site": ["Site Origins", "Actus, boutique, tickets", "Ce qui se gère pour le site : les actus (les mêmes que dans le launcher), les produits de la boutique, et l'accès aux tickets du staff."]},
           "lignes": [list(l) for l in LIGNES_MEL]}
    return corps, logique(js, cfg), 960



# ---------------------------------------------------------------- actus (les mêmes que dans le launcher) et boutique
import urllib.parse

FT, FC, CI = av.gen.FOND_TEMPEST, av.FOND_CONNEXION, av.gen.CIEL


def icone_url(nom, couleur="#ffffff"):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="{couleur}" stroke-width="1.6" '
           f'stroke-linecap="round" stroke-linejoin="round">{ICONES.get(nom) or av.ICONES_BOUTIQUE[nom]}</svg>')
    return "data:image/svg+xml;utf8," + urllib.parse.quote(svg)


ACTUS = [
    ("orbe", "4 nov. 2026", "TEMPEST", "L'orbe montre ton XP et ta respiration",
     "L'orbe de vie et de mana affiche maintenant ta progression vers le niveau suivant et ton air sous l'eau, et se place avec une touche.",
     ["Un arc menthe en haut de l'orbe se remplit à mesure que tu gagnes de l'XP ; un « +N XP » s'affiche à chaque gain.",
      "Au passage de niveau, l'anneau s'illumine et « Niveau N » apparaît sous l'orbe.",
      "Sous l'eau, un arc bleu clair en bas de l'orbe montre ton air ; il remplace les bulles."],
     f"linear-gradient(160deg, rgba(40,110,95,0.5), rgba(15,11,8,0.25)), url('{FC}') 72% 22% / 230% auto", "globe"),
    ("l064", "4 nov. 2026", "LAUNCHER", "Launcher 0.6.4 : un seul launcher à la fois",
     "Rouvrir le launcher pendant une partie ne lance plus un deuxième launcher : celui qui tourne déjà revient à l'écran.",
     ["Fini les icônes du launcher en double à côté de l'horloge.",
      "Si le jeu ne se lance pas, le launcher affiche maintenant pourquoi, et le bouton Réessayer marche à nouveau."],
     f"linear-gradient(160deg, rgba(201,161,74,0.5), rgba(15,11,8,0.3)), url('{FC}') 50% 62% / 170% auto", "fenetre"),
    ("armure", "3 nov. 2026", "TEMPEST", "Plus de barre d'armure de Minecraft",
     "Les plastrons qui s'affichaient à l'écran comptaient l'armure de Minecraft, pas celle de Tempest : ils disparaissent.",
     ["La rangée de plastrons n'apparaît plus à l'écran.",
      "Les stats de ton équipement (Vie, Défense, Dégâts…) et les bonus de panoplie se lisent toujours sur l'écran d'équipement, touche E."],
     f"linear-gradient(160deg, rgba(90,40,30,0.45), rgba(15,11,8,0.25)), url('{FT}') 20% 40% / 260% auto", "bouclier"),
    ("redemarrage", "2 nov. 2026", "TEMPEST", "Redémarrages annoncés en jeu",
     "Quand le serveur doit redémarrer pour une mise à jour, tu es prévenu à l'avance, en jeu, au lieu d'être déconnecté sans rien voir venir.",
     ["Une barre en haut de l'écran compte le temps restant avant le redémarrage.",
      "Le chat te prévient à 5 min, 1 min, 30 s et 10 s, puis chaque seconde.",
      "Le message est dans la langue de ton jeu (français, anglais, espagnol, allemand ou portugais)."],
     f"linear-gradient(160deg, rgba(30,60,110,0.45), rgba(15,11,8,0.25)), url('{FT}') 76% 18% / 240% auto", "redemarrer"),
    ("metiers", "28 oct. 2026", "TEMPEST", "Un écran pour tes métiers, et de nouveaux outils",
     "Tes métiers ont leur propre fenêtre, dans le style du journal de quêtes : ton niveau, ce qui te rapporte de l'XP et le classement, au même endroit.",
     ["Tape /metiers : la fenêtre s'ouvre (Échap pour la fermer).",
      "Onglet Métiers : ton niveau, l'XP du niveau en cours et le prochain déblocage.",
      "Pour chaque métier : ce qui rapporte de l'XP, la chance de chaque poisson et les outils acceptés."],
     f"linear-gradient(160deg, rgba(60,90,40,0.45), rgba(15,11,8,0.25)), url('{FT}') 62% 82% / 250% auto", "sac"),
    ("l063", "12 oct. 2026", "LAUNCHER", "Launcher 0.6.3 : tes MP en direct",
     "Tes MP sont reliés en direct entre le jeu et le launcher.",
     ["Un MP envoyé en jeu apparaît aussitôt dans la conversation du launcher.",
      "Un MP reçu arrive en même temps dans le jeu et dans le launcher, sans doublon.",
      "Plus de notification pour tes propres messages envoyés depuis le jeu."],
     f"linear-gradient(160deg, rgba(201,161,74,0.4), rgba(15,11,8,0.3)), url('{CI}') 40% 30% / 210% auto", "lettre"),
    ("mobs", "12 oct. 2026", "TEMPEST", "Les premiers mobs et PNJ de Tempest",
     "Les PNJ de Jura-Tempest et de Hjalvik et les premiers monstres sont sur le serveur, avec leur propre modèle 3D, comme le loup famélique.",
     ["À la connexion, le serveur propose deux packs : les effets de Tempest et les modèles des mobs ; accepte les deux.",
      "Le launcher installe aussi le pack des modèles : active-le une fois dans Options → Packs de ressources.",
      "Sans le pack, un monstre garde l'apparence de l'animal Minecraft d'origine."],
     f"linear-gradient(160deg, rgba(110,40,40,0.45), rgba(15,11,8,0.25)), url('{FT}') 50% 56% / 220% auto", "monstre"),
]


def carte_actu_statique(a, grande=False):
    cle, date, tag, titre, texte_, _, image, icone = a
    return (f'<article class="so-carte" style="border-radius: 18px; overflow: hidden; background: #19120d; border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column">'
            f'<div style="position: relative; height: 190px; background: {image}"><img src="{icone_url(icone)}" alt="" style="position: absolute; right: 18px; bottom: 16px; width: 54px; opacity: 0.9">'
            f'<span style="position: absolute; left: 16px; top: 16px">{pastille(tag, SUR_OR if tag == "TEMPEST" else "#0f0b08", OR if tag == "TEMPEST" else "#e9e1cf")}</span></div>'
            f'<div style="padding: 18px 20px 22px; display: flex; flex-direction: column; gap: 8px"><span style="font-size: 12.5px; font-weight: 800; color: {DOUX}">{date}</span>'
            f'<h3 style="margin: 0; {BAL}; font-size: 21px; line-height: 1.2; color: #fff">{titre}</h3>'
            f'<p style="margin: 0; font-size: 14px; line-height: 1.55; font-weight: 600; color: {TEXTE}">{texte_}</p></div></article>')


PRODUITS = {
    "Tempest": [("aura", "Aura de magicule", "aura", 0), ("eveille", "Titre « Éveillé »", "titre", 2), ("emotes", "Pack d'emotes", "emote", 3),
                ("familier", "Familier lumineux", "patte", 5), ("coffre", "Coffre de la saison", "coffre", 4), ("bienvenue", "Pack de bienvenue", "cadeau", 6)],
    "Origins": [("themes", "Thèmes du launcher", "palette", 5), ("cadre", "Cadre d'avatar", "cadre", 6), ("badge", "Badge de profil", "badge", 7),
                ("fondprofil", "Fond de profil", "fond", 0), ("fondlauncher", "Fond d'écran du launcher", "fond", 1), ("sons", "Sons du launcher", "emote", 2)],
}
TEINTES = [("#3b6fb0", "#1b2d52"), ("#b0703b", "#4f2a12"), ("#8a4ab0", "#36184d"), ("#3f9a7c", "#173d31"), ("#c9a14a", "#5a3d12"),
           ("#b04a5e", "#4a1622"), ("#4a8ab0", "#173548"), ("#9a8a3f", "#3d3417")]


def art_produit(icone, teinte, taille=58, hauteur=150):
    a, b = TEINTES[teinte]
    return (f'<div style="height: {hauteur}px; border-radius: 14px; background: radial-gradient(70% 80% at 50% 40%, {a}, {b}); display: flex; align-items: center; justify-content: center; '
            f'box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1)">{av.icone_boutique(icone, taille)}</div>')


def carte_produit(cle, nom, icone, teinte, univers, clic=True):
    c = f' onClick="[[voirProduit_{cle}]]"' if clic else ""
    return (f'<button class="so-carte"{c} style="padding: 12px 12px 16px; border-radius: 18px; background: #19120d; border: 1px solid rgba(255,255,255,0.08); '
            f'display: flex; flex-direction: column; gap: 12px; text-align: left; cursor: pointer; {NUN}">{art_produit(icone, teinte)}'
            f'<span style="display: flex; flex-direction: column; gap: 6px; padding: 0 4px"><strong style="{BAL}; font-size: 18px; line-height: 1.15; color: #fff">{nom}</strong>'
            f'<span style="display: flex; align-items: center; justify-content: space-between"><span style="font-size: 12.5px; font-weight: 700; color: {DOUX}">{univers}</span>'
            f'{pastille("BIENTÔT")}</span></span></button>')


# ---------------------------------------------------------------- accueil
def mini_launcher():
    """Le launcher en petit, dessiné en HTML pour qu'il ait les vraies polices (aria-hidden : c'est une illustration)."""
    import logo7
    oeil = logo7.logo(("feu", {"regard": 2, "bas": 3, "taille_pupille": 0.9}), 16, uid="mini", libelle="")
    onglet = lambda t, actif=False: f'<span style="position: relative; padding: 0 2px; font-size: 10.5px; font-weight: 800; color: {"#fff" if actif else DOUX}">{t}' + (f'<span style="position: absolute; left: 0; right: 0; bottom: -9px; height: 2px; background: {OR}"></span>' if actif else "") + '</span>'
    actu = lambda img, t: f'<div style="flex: 1; border-radius: 8px; overflow: hidden; background: #19120d; border: 1px solid rgba(255,255,255,0.08)"><div style="height: 46px; background: {img}"></div><div style="padding: 6px 8px; font-size: 9px; font-weight: 800; color: #fff; line-height: 1.25">{t}</div></div>'
    return f"""<div aria-hidden="true" style="position: relative; width: 620px; height: 390px; border-radius: 14px; overflow: hidden; background: {EBENE}; border: 1px solid rgba(255,255,255,0.14); box-shadow: 0 40px 90px rgba(0,0,0,0.6), 0 0 0 8px rgba(201,161,74,0.07)">
<div style="height: 30px; padding: 0 10px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid rgba(255,255,255,0.08)">
<span style="width: 18px; height: 18px; display: flex">{oeil}</span>{onglet("Accueil", True)}{onglet("Jeux")}{onglet("Actus")}{onglet("Boutique")}
<span style="flex: 1"></span><span style="width: 16px; height: 16px; border-radius: 50%; background: url('{FT}') 57% 74% / 700% auto"></span><span style="font-size: 10px; color: {DOUX}; letter-spacing: 4px">– □ ×</span></div>
<div style="position: absolute; top: 30px; left: 0; bottom: 0; width: 42px; border-right: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; align-items: center; gap: 8px; padding-top: 10px">
<span style="width: 28px; height: 28px; border-radius: 8px; border: 1.5px solid {OR}; background: #19120d url('{av.gen.LOGO_TEMPEST}') center / 80% no-repeat"></span>
<span style="width: 28px; height: 28px; border-radius: 8px; border: 1px dashed rgba(255,255,255,0.25); color: {DOUX}; display: flex; align-items: center; justify-content: center; font-size: 14px">+</span></div>
<div style="position: absolute; top: 30px; left: 42px; right: 0; height: 236px; background: url('{FT}') 50% 40% / cover"><span style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,11,8,0) 40%, {EBENE})"></span>
<div style="position: absolute; left: 18px; top: 70px; width: 170px; padding: 12px; border-radius: 12px; background: rgba(15,11,8,0.72); border: 1px solid rgba(255,255,255,0.12); display: flex; flex-direction: column; gap: 8px">
<span style="height: 40px; background: url('{av.gen.LOGO_TEMPEST}') left center / contain no-repeat"></span>
<span style="font-size: 9px; font-weight: 800; color: {VERT}">● Serveur en ligne</span>
<span style="height: 30px; border-radius: 8px; background: #fff; color: {OR_FONCE}; {BAL}; font-size: 13px; display: flex; align-items: center; justify-content: center; letter-spacing: 0.06em">JOUER</span></div></div>
<div style="position: absolute; left: 58px; right: 16px; bottom: 14px; display: flex; gap: 10px">{actu(ACTUS[0][6], ACTUS[0][3])}{actu(ACTUS[1][6], ACTUS[1][3])}{actu(ACTUS[2][6], ACTUS[2][3])}</div>
</div>"""


def accueil():
    hero = f"""<section aria-labelledby="titre-accueil" style="position: relative; height: 880px; overflow: hidden">
<img src="{FC}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%">
<span aria-hidden="true" style="position: absolute; inset: 0; background: radial-gradient(44% 48% at 50% 46%, rgba(15,11,8,0.6), rgba(15,11,8,0))"></span>
<span aria-hidden="true" style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,11,8,0.75) 0%, rgba(15,11,8,0) 16%, rgba(15,11,8,0) 64%, {EBENE} 100%)"></span>
{nav("accueil")}
<div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; padding-top: 150px; text-align: center">
{sur_titre("ORIGINS · NOS MONDES MINECRAFT")}
<div style="margin-top: 18px">{av.logo_mot(118, "accueil-grand")}</div>
<h1 id="titre-accueil" style="margin: 18px 0 0; {BAL}; font-size: 56px; line-height: 1.04; color: #fff; text-shadow: 0 4px 24px rgba(0,0,0,0.65)">Des mondes à part, dans Minecraft</h1>
<p style="margin: 14px 0 0; max-width: 640px; font-size: 18.5px; line-height: 1.55; font-weight: 600; color: {TEXTE}; text-shadow: 0 2px 14px rgba(0,0,0,0.85)">Origins réunit nos serveurs dans un seul launcher : il installe le jeu, le garde à jour, et tu y retrouves tes amis et les actus. Premier monde : Tempest.</p>
<div style="margin-top: 32px; display: flex; gap: 14px">{bouton_blanc("TÉLÉCHARGER LE LAUNCHER", "telecharger", None, 62, 19)}{bouton_contour("Rejoindre le Discord", "bulle", None, 62, 16)}</div>
<p style="margin: 18px 0 0; font-size: 13.5px; font-weight: 700; color: {DOUX}">Gratuit · Windows, macOS et Linux · Il faut Minecraft : Java Edition</p></div>
<span aria-hidden="true" style="position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; color: {DOUX}; font-size: 12px; font-weight: 800; letter-spacing: 0.16em">DÉCOUVRIR{ic("chevron", 18)}</span>
</section>"""
    chips = "".join(f'<span style="padding: 7px 13px; border-radius: 99px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.16); font-size: 13px; font-weight: 800; color: #fff">{c}</span>' for c in ["Quêtes", "Métiers", "Mobs et donjons", "5 langues"])
    tempest = f"""<section aria-labelledby="titre-jeux" style="padding: 40px 96px 0">
<div style="display: flex; align-items: flex-end; justify-content: space-between"><div>{sur_titre("NOS JEUX")}{titre2("Tempest, le premier monde", "titre-jeux")}</div></div>
<article style="position: relative; margin-top: 28px; height: 460px; border-radius: 26px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 30px 70px rgba(0,0,0,0.5)">
<span style="position: absolute; inset: 0; background: url('{FT}') 50% 45% / cover"></span>
<span aria-hidden="true" style="position: absolute; inset: 0; background: linear-gradient(90deg, rgba(15,11,8,0.94) 0%, rgba(15,11,8,0.75) 38%, rgba(15,11,8,0.1) 72%)"></span>
<div style="position: absolute; left: 56px; top: 0; bottom: 0; width: 560px; display: flex; flex-direction: column; justify-content: center; gap: 18px">
<img src="{av.gen.LOGO_TEMPEST}" alt="Tempest" style="width: 250px; filter: drop-shadow(0 8px 20px rgba(0,0,0,0.5))">
<span>{pastille("EN DÉVELOPPEMENT · OUVERT À L'ÉQUIPE ET AUX TESTEURS")}</span>
<p style="margin: 0; font-size: 17px; line-height: 1.6; font-weight: 600; color: {TEXTE}">Un monde fantasy qui se construit avec vous : des quêtes, des métiers, des mobs et des donjons, avec des écrans faits pour lui.</p>
<div style="display: flex; flex-wrap: wrap; gap: 8px">{chips}</div>
<div style="display: flex; gap: 12px; margin-top: 6px">{bouton_blanc("JOUER AVEC LE LAUNCHER", "lecture", None, 54, 17)}{bouton_contour("Voir les actus", None, None, 54, 15)}</div></div>
</article></section>"""
    actus_ = f"""<section aria-labelledby="titre-actus" style="padding: 88px 96px 0">
<div style="display: flex; align-items: flex-end; justify-content: space-between"><div>{sur_titre("ACTUS")}{titre2("Les dernières nouvelles", "titre-actus")}
<p style="margin: 8px 0 0; font-size: 15px; font-weight: 600; color: {DOUX}">Les mêmes que dans le launcher, dans ta langue.</p></div>{lien_or("Toutes les actus →")}</div>
<div style="margin-top: 28px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px">{"".join(carte_actu_statique(a) for a in ACTUS[:3])}</div></section>"""
    atout = lambda icone, titre, texte_: (f'<li style="display: flex; gap: 16px; align-items: flex-start"><span style="width: 48px; height: 48px; border-radius: 15px; background: rgba(201,161,74,0.14); color: {OR}; display: flex; align-items: center; justify-content: center; flex: none">{ic(icone, 24)}</span>'
                                          f'<span style="display: flex; flex-direction: column; gap: 3px"><strong style="font-size: 16.5px; font-weight: 800; color: #fff">{titre}</strong><span style="font-size: 14.5px; line-height: 1.5; font-weight: 600; color: {DOUX}">{texte_}</span></span></li>')
    launcher = f"""<section aria-labelledby="titre-launcher" style="margin-top: 96px; padding: 80px 96px; background: linear-gradient(180deg, #140e09, {EBENE}); border-top: 1px solid rgba(201,161,74,0.14); display: grid; grid-template-columns: minmax(0, 1fr) 620px; gap: 64px; align-items: center">
<div>{sur_titre("LE LAUNCHER")}{titre2("Tout Origins dans une fenêtre", "titre-launcher", 40)}
<ul style="list-style: none; margin: 28px 0 32px; padding: 0; display: flex; flex-direction: column; gap: 20px">
{atout("telecharger", "Installe Tempest et le garde à jour", "Un clic pour jouer ; les mises à jour se font toutes seules.")}
{atout("amis", "Tes amis et tes messages", "Ajoute tes amis par leur Origins ID ; tes MP suivent entre le jeu et le launcher.")}
{atout("actus", "Les actus du serveur", "Ce qui change, dans ta langue, dès que ça sort.")}
{atout("utilisateur", "Ton profil Origins", "Ton nom, ton avatar, tes achats et tes tickets, les mêmes partout.")}</ul>
<div style="display: flex; align-items: center; gap: 18px">{bouton_blanc("TÉLÉCHARGER", "telecharger", None, 56, 17)}<span style="font-size: 13.5px; font-weight: 700; color: {DOUX}">Windows, macOS et Linux</span></div></div>
{mini_launcher()}</section>"""
    boutique_ = f"""<section aria-labelledby="titre-boutique" style="padding: 88px 96px 0">
<div style="display: flex; align-items: flex-end; justify-content: space-between"><div>{sur_titre("BOUTIQUE")}{titre2("Soutiens Origins", "titre-boutique")}
<p style="margin: 8px 0 0; font-size: 15px; font-weight: 600; color: {DOUX}">Des cosmétiques pour te démarquer, rien qui donne un avantage en jeu.</p></div>{lien_or("Voir la boutique →")}</div>
<div style="margin-top: 28px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px">
{carte_produit("aura", "Aura de magicule", "aura", 0, "Tempest", False)}{carte_produit("familier", "Familier lumineux", "patte", 5, "Tempest", False)}{carte_produit("themes", "Thèmes du launcher", "palette", 5, "Origins", False)}{carte_produit("cadre", "Cadre d'avatar", "cadre", 6, "Origins", False)}</div></section>"""
    aide = lambda icone, titre, texte_, bouton: panneau(
        f'<div style="display: flex; align-items: center; gap: 22px"><span style="width: 64px; height: 64px; border-radius: 20px; background: rgba(201,161,74,0.14); color: {OR}; display: flex; align-items: center; justify-content: center; flex: none">{ic(icone, 32)}</span>'
        f'<div style="flex: 1"><h3 style="margin: 0; {BAL}; font-size: 24px; color: #fff">{titre}</h3><p style="margin: 4px 0 0; font-size: 14.5px; line-height: 1.5; font-weight: 600; color: {DOUX}">{texte_}</p></div>{bouton}</div>', "28px 30px")
    bas = f"""<section style="padding: 88px 96px 96px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px">
{aide("bulle", "Un souci ?", "Ouvre un ticket : l'équipe te répond sur le site, et tu es prévenu dans le launcher.", bouton_contour("Support", None, None, 48, 15))}
{aide("amis", "La communauté", "Annonces, entraide et tests en avant-première, sur le Discord d'Origins. Facultatif.", bouton_contour("Discord", None, None, 48, 15))}</section>"""
    return hero + tempest + actus_ + launcher + boutique_ + bas + pied(), logique(""), 3860


def page_actus():
    filtre = lambda cle, nom: (f'<button role="radio" aria-checked="[[filtrePresse_{cle}]]" onClick="[[filtre_{cle}]]" style="height: 40px; padding: 0 18px; border: 0; border-radius: 10px; '
                               f'background: [[filtreFond_{cle}]]; color: [[filtreCoul_{cle}]]; {NUN}; font-weight: 800; font-size: 14px; cursor: pointer">{nom}</button>')
    une = f"""<sc-for list="[[une]]" as="a" hint-placeholder-count="1">
<button class="so-carte" onClick="[[a.ouvrir]]" style="width: 100%; display: grid; grid-template-columns: 640px minmax(0, 1fr); border-radius: 24px; overflow: hidden; background: #19120d; border: 1px solid rgba(255,255,255,0.08); padding: 0; text-align: left; cursor: pointer; {NUN}">
<span style="position: relative; height: 360px; background: [[a.image]]"><img src="[[a.icone]]" alt="" style="position: absolute; right: 28px; bottom: 24px; width: 84px; opacity: 0.9"></span>
<span style="padding: 40px 44px; display: flex; flex-direction: column; justify-content: center; gap: 14px">
<span style="display: flex; align-items: center; gap: 12px"><span style="padding: 4px 10px; border-radius: 99px; background: [[a.tagFond]]; color: [[a.tagCoul]]; font-size: 11px; font-weight: 800; letter-spacing: 0.1em">[[a.tag]]</span><span style="font-size: 13px; font-weight: 800; color: {DOUX}">[[a.date]]</span></span>
<strong style="{BAL}; font-size: 36px; line-height: 1.1; color: #fff">[[a.titre]]</strong>
<span style="font-size: 16px; line-height: 1.6; font-weight: 600; color: {TEXTE}">[[a.texte]]</span>
<span style="color: {OR}; font-weight: 800; font-size: 15px">Lire l'actu →</span></span></button>
</sc-for>"""
    grille = f"""<sc-for list="[[autres]]" as="a" hint-placeholder-count="6">
<button class="so-carte" onClick="[[a.ouvrir]]" style="border-radius: 18px; overflow: hidden; background: #19120d; border: 1px solid rgba(255,255,255,0.08); padding: 0; display: flex; flex-direction: column; text-align: left; cursor: pointer; {NUN}">
<span style="position: relative; height: 180px; background: [[a.image]]"><img src="[[a.icone]]" alt="" style="position: absolute; right: 18px; bottom: 16px; width: 52px; opacity: 0.9">
<span style="position: absolute; left: 16px; top: 16px; padding: 4px 10px; border-radius: 99px; background: [[a.tagFond]]; color: [[a.tagCoul]]; font-size: 11px; font-weight: 800; letter-spacing: 0.1em">[[a.tag]]</span></span>
<span style="padding: 18px 20px 22px; display: flex; flex-direction: column; gap: 8px"><span style="font-size: 12.5px; font-weight: 800; color: {DOUX}">[[a.date]]</span>
<strong style="{BAL}; font-size: 21px; line-height: 1.2; color: #fff">[[a.titre]]</strong>
<span style="font-size: 14px; line-height: 1.55; font-weight: 600; color: {TEXTE}">[[a.texte]]</span></span></button>
</sc-for>"""
    article = f"""<div style="display: [[affArticle]]; position: absolute; inset: 0; z-index: 6; background: rgba(8,6,4,0.72); align-items: flex-start; justify-content: center; padding-top: 110px">
<article aria-label="Actu" style="width: 820px; border-radius: 24px; overflow: hidden; background: #19120d; border: 1px solid rgba(201,161,74,0.3); box-shadow: 0 40px 100px rgba(0,0,0,0.7)">
<div style="position: relative; height: 240px; background: [[artImage]]"><button onClick="[[fermerArticle]]" aria-label="Fermer" style="position: absolute; top: 16px; right: 16px; width: 40px; height: 40px; border-radius: 50%; border: 0; background: rgba(0,0,0,0.55); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer">{ic("croix", 18)}</button></div>
<div style="padding: 30px 40px 36px; display: flex; flex-direction: column; gap: 14px">
<span style="display: flex; align-items: center; gap: 12px"><span style="padding: 4px 10px; border-radius: 99px; background: [[artTagFond]]; color: [[artTagCoul]]; font-size: 11px; font-weight: 800; letter-spacing: 0.1em">[[artTag]]</span><span style="font-size: 13px; font-weight: 800; color: {DOUX}">[[artDate]]</span></span>
<h2 style="margin: 0; {BAL}; font-size: 34px; line-height: 1.1; color: #fff">[[artTitre]]</h2>
<p style="margin: 0; font-size: 16.5px; line-height: 1.65; font-weight: 600; color: {TEXTE}">[[artTexte]]</p>
<span style="margin-top: 8px; font-size: 12px; font-weight: 800; letter-spacing: 0.18em; color: {OR}">CE QUI CHANGE</span>
<ul style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px">
<sc-for list="[[changements]]" as="c" hint-placeholder-count="3"><li style="display: flex; gap: 12px; font-size: 15px; line-height: 1.55; font-weight: 600; color: {TEXTE}"><span style="color: {OR}; padding-top: 3px; display: flex">{ic("coche", 16, OR, 2.4)}</span>[[c.texte]]</li></sc-for></ul>
</div></article></div>"""
    corps = f"""{nav("actus", None, True)}
<section style="padding: 48px 96px 0; display: flex; align-items: flex-end; justify-content: space-between; gap: 24px">
<div>{sur_titre("ACTUS")}{titre1("Les nouvelles d'Origins", "titre-actus-page")}
{texte("Les mêmes que dans le launcher : ce qui change sur Tempest et dans le launcher, dans ta langue.", 16.5, TEXTE, "10px 0 0", 640)}</div>
<div role="radiogroup" aria-label="Filtrer" style="display: flex; gap: 4px; padding: 4px; border-radius: 13px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08)">{filtre("tout", "Tout")}{filtre("tempest", "Tempest")}{filtre("launcher", "Launcher")}</div></section>
<div style="padding: 32px 96px 0">{une}</div>
<div style="padding: 24px 96px 80px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px">{grille}</div>
{pied()}
{article}"""
    js = """    const filtre = s.filtre || 'tout';
    ['tout', 'tempest', 'launcher'].forEach((f) => {
      v['filtreFond_' + f] = f === filtre ? '#ffffff' : 'transparent';
      v['filtreCoul_' + f] = f === filtre ? C.orFonce : '#f0e6cf';
      v['filtrePresse_' + f] = f === filtre ? 'true' : 'false';
      v['filtre_' + f] = () => this.setState({ filtre: f });
    });
    const liste = C.actus.filter((a) => filtre === 'tout' || a[2].toLowerCase() === filtre).map((a) => ({
      titre: a[3], date: a[1], tag: a[2], texte: a[4], image: a[6], icone: a[7],
      tagFond: a[2] === 'TEMPEST' ? C.or : '#e9e1cf', tagCoul: a[2] === 'TEMPEST' ? C.surOr : '#0f0b08',
      ouvrir: () => this.setState({ article: a[0] })
    }));
    v.une = liste.slice(0, 1);
    v.autres = liste.slice(1);
    const art = C.actus.find((a) => a[0] === s.article);
    v.affArticle = art ? 'flex' : 'none';
    v.fermerArticle = () => this.setState({ article: null });
    const A = art || C.actus[0];
    v.artTitre = A[3]; v.artDate = A[1]; v.artTag = A[2]; v.artTexte = A[4]; v.artImage = A[6];
    v.artTagFond = A[2] === 'TEMPEST' ? C.or : '#e9e1cf'; v.artTagCoul = A[2] === 'TEMPEST' ? C.surOr : '#0f0b08';
    v.changements = A[5].map((t) => ({ texte: t }));"""
    cfg = {"or": OR, "orFonce": OR_FONCE, "surOr": SUR_OR,
           "actus": [[a[0], a[1], a[2], a[3], a[4], a[5], a[6], icone_url(a[7])] for a in ACTUS]}
    return corps, logique(js, cfg), 1740


def page_boutique():
    onglet = lambda cle, nom: (f'<button role="radio" aria-checked="[[univPresse_{cle}]]" onClick="[[univ_{cle}]]" style="height: 40px; padding: 0 18px; border: 0; border-radius: 10px; '
                               f'background: [[univFond_{cle}]]; color: [[univCoul_{cle}]]; {NUN}; font-weight: 800; font-size: 14px; cursor: pointer">{nom}</button>')
    banniere_t = (f'<div style="position: relative; height: 150px; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1)"><span style="position: absolute; inset: 0; background: url(\'{FT}\') 50% 40% / cover"></span>'
                  f'<span style="position: absolute; inset: 0; background: linear-gradient(90deg, rgba(15,11,8,0.92), rgba(15,11,8,0.2))"></span>'
                  f'<div style="position: absolute; left: 36px; top: 0; bottom: 0; display: flex; align-items: center; gap: 28px"><img src="{av.gen.LOGO_TEMPEST}" alt="Tempest" style="width: 150px">'
                  f'<span style="font-size: 15px; line-height: 1.5; font-weight: 700; color: {TEXTE}">Pour ton personnage sur Tempest.<br><span style="color: {DOUX}">Arrive en jeu, sur ton compte Minecraft.</span></span></div></div>')
    banniere_o = (f'<div style="position: relative; height: 150px; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1)"><span style="position: absolute; inset: 0; background: url(\'{FC}\') 50% 55% / cover"></span>'
                  f'<span style="position: absolute; inset: 0; background: linear-gradient(90deg, rgba(15,11,8,0.92), rgba(15,11,8,0.2))"></span>'
                  f'<div style="position: absolute; left: 36px; top: 0; bottom: 0; display: flex; align-items: center; gap: 28px">{av.logo_mot(52, "boutique-o")}'
                  f'<span style="font-size: 15px; line-height: 1.5; font-weight: 700; color: {TEXTE}">Pour ton launcher et ton profil Origins.<br><span style="color: {DOUX}">Dans tous les jeux Origins.</span></span></div></div>')
    grille = lambda univers: "".join(carte_produit(cle, nom, icone, teinte, univers) for cle, nom, icone, teinte in PRODUITS[univers])
    fiche = f"""<div style="display: [[affFiche]]; position: absolute; inset: 0; z-index: 6; background: rgba(8,6,4,0.72); align-items: flex-start; justify-content: center; padding-top: 130px">
<section aria-label="Produit" style="width: 860px; display: grid; grid-template-columns: 360px minmax(0, 1fr); gap: 30px; padding: 26px; border-radius: 24px; background: #19120d; border: 1px solid rgba(201,161,74,0.3); box-shadow: 0 40px 100px rgba(0,0,0,0.7)">
<div style="height: 360px; border-radius: 18px; background: [[ficheArt]]; display: flex; align-items: center; justify-content: center"><img src="[[ficheIcone]]" alt="" style="width: 150px"></div>
<div style="display: flex; flex-direction: column; gap: 14px">
<div style="display: flex; align-items: center; justify-content: space-between">{pastille("[[ficheUnivers]]")}<button onClick="[[fermerFiche]]" aria-label="Fermer" style="width: 36px; height: 36px; border-radius: 50%; border: 0; background: rgba(255,255,255,0.1); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer">{ic("croix", 16)}</button></div>
<h2 style="margin: 0; {BAL}; font-size: 32px; line-height: 1.1; color: #fff">[[ficheNom]]</h2>
<p style="margin: 0; font-size: 15px; line-height: 1.6; font-weight: 600; color: {TEXTE}">Un cosmétique, rien qui donne un avantage en jeu. Le prix sera annoncé à l'ouverture de la boutique.</p>
<label style="display: flex; flex-direction: column; gap: 7px; margin-top: 4px"><span style="font-size: 11px; font-weight: 800; letter-spacing: 0.12em; color: {DOUX}">POUR QUI ? TON PSEUDO MINECRAFT</span>
<span style="display: flex; align-items: center; gap: 12px; height: 50px; padding: 0 8px 0 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.28); background: rgba(0,0,0,0.3)">
<span style="flex: 1; font-size: 16px; font-weight: 700; color: #fff">Yunoow</span>{av.avatar("moi", 34)}<span style="display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; font-weight: 800; color: {VERT}">{ic("coche", 15, VERT, 2.6)}C'est bien toi</span></span>
<span style="font-size: 12.5px; font-weight: 600; color: {DOUX}">Pas besoin de compte. Connecté, ton pseudo est déjà rempli.</span></label>
<button disabled style="height: 54px; border: 0; border-radius: 15px; background: rgba(255,255,255,0.12); color: {DOUX}; {BAL}; font-size: 17px; letter-spacing: 0.05em; cursor: not-allowed">BIENTÔT DISPONIBLE</button>
<p style="margin: 0; font-size: 12.5px; line-height: 1.5; font-weight: 600; color: {DOUX}">À l'ouverture, l'achat arrivera en jeu sur ce compte, à ta prochaine connexion au serveur, et restera dans « Mes achats ».</p>
</div></section></div>"""
    corps = f"""{nav("boutique", None, True)}
<section style="padding: 48px 96px 0; display: flex; align-items: flex-end; justify-content: space-between; gap: 24px">
<div>{sur_titre("BOUTIQUE")}<div style="display: flex; align-items: center; gap: 16px">{titre1("Soutiens Origins", "titre-boutique-page")}<span style="margin-top: 10px">{pastille("OUVRE BIENTÔT")}</span></div>
{texte("La même boutique que dans le launcher. Des cosmétiques pour te démarquer, rien qui donne un avantage en jeu.", 16.5, TEXTE, "10px 0 0", 660)}</div>
<div role="radiogroup" aria-label="Univers" style="display: flex; gap: 4px; padding: 4px; border-radius: 13px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08)">{onglet("tout", "Tout")}{onglet("tempest", "Tempest")}{onglet("origins", "Origins")}</div></section>
<section style="display: [[affTempest]]; flex-direction: column; gap: 20px; padding: 36px 96px 0">{banniere_t}
<div style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 18px">{grille("Tempest")}</div></section>
<section style="display: [[affOrigins]]; flex-direction: column; gap: 20px; padding: 44px 96px 0">{banniere_o}
<div style="display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 18px">{grille("Origins")}</div></section>
<div style="height: 88px"></div>
{pied()}
{fiche}"""
    produits = {cle: [nom, univers, f"radial-gradient(70% 80% at 50% 40%, {TEINTES[teinte][0]}, {TEINTES[teinte][1]})", icone_url(icone)]
                for univers, liste in PRODUITS.items() for cle, nom, icone, teinte in liste}
    js = """    const univ = s.univ || 'tout';
    ['tout', 'tempest', 'origins'].forEach((u) => {
      v['univFond_' + u] = u === univ ? '#ffffff' : 'transparent';
      v['univCoul_' + u] = u === univ ? C.orFonce : '#f0e6cf';
      v['univPresse_' + u] = u === univ ? 'true' : 'false';
      v['univ_' + u] = () => this.setState({ univ: u });
    });
    v.affTempest = univ === 'origins' ? 'none' : 'flex';
    v.affOrigins = univ === 'tempest' ? 'none' : 'flex';
    Object.keys(C.produits).forEach((k) => { v['voirProduit_' + k] = () => this.setState({ produit: k }); });
    const P = C.produits[s.produit];
    v.affFiche = P ? 'flex' : 'none';
    v.fermerFiche = () => this.setState({ produit: null });
    const Q = P || C.produits.aura;
    v.ficheNom = Q[0]; v.ficheUnivers = Q[1].toUpperCase(); v.ficheArt = Q[2]; v.ficheIcone = Q[3];"""
    return corps, logique(js, {"orFonce": OR_FONCE, "produits": produits}), 1560



# ---------------------------------------------------------------- page du jeu Tempest (lien « Jeux »)
def page_tempest():
    atout = lambda icone, titre, texte_: (f'<article class="so-carte" style="padding: 26px; border-radius: 20px; background: linear-gradient(170deg, #1e160e, #130d08); border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 12px">'
                                          f'<span style="width: 54px; height: 54px; border-radius: 16px; background: rgba(201,161,74,0.14); color: {OR}; display: flex; align-items: center; justify-content: center">{ic(icone, 28)}</span>'
                                          f'<h3 style="margin: 4px 0 0; {BAL}; font-size: 23px; color: #fff">{titre}</h3><p style="margin: 0; font-size: 15px; line-height: 1.6; font-weight: 600; color: {TEXTE}">{texte_}</p></article>')
    etape = lambda n, titre, texte_: (f'<li style="display: flex; flex-direction: column; gap: 10px; padding: 26px; border-radius: 20px; background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.08)">'
                                      f'<span style="width: 46px; height: 46px; border-radius: 50%; background: {OR}; color: {SUR_OR}; {BAL}; font-size: 23px; display: flex; align-items: center; justify-content: center">{n}</span>'
                                      f'<h3 style="margin: 6px 0 0; {BAL}; font-size: 22px; color: #fff">{titre}</h3><p style="margin: 0; font-size: 14.5px; line-height: 1.55; font-weight: 600; color: {TEXTE}">{texte_}</p></li>')
    info = lambda gauche, droite: f'<div style="display: flex; justify-content: space-between; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 14px; font-weight: 700"><span style="color: {DOUX}">{gauche}</span><span style="color: #fff; text-align: right">{droite}</span></div>'
    serveur = f"""<aside aria-label="Le serveur" style="width: 360px; padding: 24px; border-radius: 22px; background: {VERRE}; border: 1px solid rgba(255,255,255,0.16); box-shadow: 0 30px 70px rgba(0,0,0,0.55); display: flex; flex-direction: column; gap: 6px">
<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px"><span style="{BAL}; font-size: 22px; color: #fff">Le serveur</span><span style="display: inline-flex; align-items: center; gap: 7px; font-size: 13.5px; font-weight: 800; color: {VERT}"><span style="width: 9px; height: 9px; border-radius: 50%; background: {VERT}"></span>En ligne</span></div>
{info("Joueurs connectés", "3")}{info("Accès", "Équipe et testeurs")}{info("Version du jeu", "Gérée par le launcher")}{info("Langues", "FR · EN · ES · DE · PT")}
<p style="margin: 10px 0 0; font-size: 12.5px; line-height: 1.5; font-weight: 600; color: {DOUX}">Le launcher installe les mods et les packs de Tempest : rien à faire à la main.</p></aside>"""
    hero = f"""<section aria-labelledby="titre-tempest" style="position: relative; height: 880px; overflow: hidden">
<span style="position: absolute; inset: 0; background: url('{FT}') 50% 40% / cover"></span>
<span aria-hidden="true" style="position: absolute; inset: 0; background: linear-gradient(90deg, rgba(15,11,8,0.95) 0%, rgba(15,11,8,0.78) 40%, rgba(15,11,8,0.25) 75%, rgba(15,11,8,0.45) 100%)"></span>
<span aria-hidden="true" style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,11,8,0.7) 0%, rgba(15,11,8,0) 18%, rgba(15,11,8,0) 70%, {EBENE} 100%)"></span>
{nav("jeux")}
<div style="position: absolute; left: 96px; right: 96px; top: 150px; display: flex; align-items: center; justify-content: space-between; gap: 48px">
<div style="max-width: 640px; display: flex; flex-direction: column; gap: 20px">
{sur_titre("NOS JEUX · LE PREMIER MONDE")}
<img src="{av.gen.LOGO_TEMPEST}" alt="Tempest" style="width: 300px; filter: drop-shadow(0 10px 26px rgba(0,0,0,0.55))">
<span>{pastille("EN DÉVELOPPEMENT · OUVERT À L'ÉQUIPE ET AUX TESTEURS")}</span>
<h1 id="titre-tempest" style="margin: 0; {BAL}; font-size: 46px; line-height: 1.08; color: #fff">Un monde fantasy qui se construit avec vous</h1>
<p style="margin: 0; font-size: 17.5px; line-height: 1.6; font-weight: 600; color: {TEXTE}">Des quêtes, des métiers, des mobs et des donjons, avec des écrans faits pour lui. L'équipe et les testeurs y jouent déjà ; il ouvrira à tout le monde quand il sera prêt.</p>
<div style="display: flex; gap: 12px; margin-top: 6px">{bouton_blanc("JOUER AVEC LE LAUNCHER", "lecture", None, 58, 18)}{bouton_contour("Rejoindre le Discord", "bulle", None, 58, 15)}</div></div>
{serveur}</div></section>"""
    atouts = f"""<section aria-labelledby="titre-attend" style="padding: 40px 96px 0">
{sur_titre("CE QUI T'ATTEND")}{titre2("Tempest, en quelques mots", "titre-attend")}
<div style="margin-top: 30px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px">
{atout("parchemin", "Quêtes", "Un journal de quêtes au style du Grand Sage : les étapes, les récompenses et les PNJ qui te les confient.")}
{atout("sac", "Métiers", "Mineur, Bûcheron, Agriculteur et Pêcheur : récolte, monte de niveau, débloque de meilleurs outils. Tape /metiers.")}
{atout("monstre", "Mobs et PNJ", "Des monstres avec leur propre modèle 3D, comme le loup famélique, et les PNJ de Jura-Tempest et de Hjalvik.")}
{atout("bouclier", "Équipement", "Armures, artefacts et panoplies : tes stats et tes bonus se lisent sur l'écran d'équipement, touche E.")}
{atout("amis", "En groupe", "Joue avec tes amis : ton groupe et la vie de chacun s'affichent à l'écran, et le butin arrive tout seul.")}
{atout("globe", "Dans ta langue", "Le jeu, ses écrans et ses messages en français, anglais, espagnol, allemand et portugais.")}
</div></section>"""
    rejoindre = f"""<section aria-labelledby="titre-rejoindre" style="margin-top: 96px; padding: 72px 96px; background: linear-gradient(180deg, #140e09, {EBENE}); border-top: 1px solid rgba(201,161,74,0.14)">
<div style="display: flex; align-items: flex-end; justify-content: space-between"><div>{sur_titre("EN 3 ÉTAPES")}{titre2("Rejoindre Tempest", "titre-rejoindre")}</div>{lien_or("Toutes les versions du launcher →")}</div>
<ol style="list-style: none; margin: 30px 0 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 22px">
{etape(1, "Télécharge le launcher", "Pour Windows, macOS ou Linux. Il est gratuit et se met à jour tout seul.")}
{etape(2, "Connecte-toi", "Avec ton compte Microsoft qui possède Minecraft : Java Edition. Ton profil Origins se crée tout seul.")}
{etape(3, "Joue", "Choisis Tempest, puis JOUER : le launcher installe le jeu, les mods et les packs, et te connecte au serveur.")}
</ol></section>"""
    actus_ = f"""<section aria-labelledby="titre-actus-tempest" style="padding: 80px 96px 96px">
<div style="display: flex; align-items: flex-end; justify-content: space-between"><div>{sur_titre("ACTUS DE TEMPEST")}{titre2("Ce qui a changé", "titre-actus-tempest")}</div>{lien_or("Toutes les actus →")}</div>
<div style="margin-top: 28px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px">{"".join(carte_actu_statique(a) for a in [x for x in ACTUS if x[2] == "TEMPEST"][:3])}</div></section>"""
    return hero + atouts + rejoindre + actus_ + pied(), logique(""), 3000



# ---------------------------------------------------------------- versions téléphone (390 px)
LM = 390
JS_MOBILE = """    v.affMenuMobile = s.menuMobile ? 'flex' : 'none';
    v.menuMobileOuvert = s.menuMobile ? 'true' : 'false';
    v.ouvrirMenuMobile = () => this.setState({ menuMobile: true });
    v.fermerMenuMobile = () => this.setState({ menuMobile: false });
"""


def nav_mobile(uid, qui=None, plein=False):
    fond = f"background: {EBENE}; border-bottom: 1px solid rgba(255,255,255,0.08);" if plein else ""
    position = "position: relative;" if plein else "position: absolute; top: 0; left: 0; right: 0;"
    if qui:
        compte = av.avatar(QUI[qui][0], 38)
    else:
        compte = (f'<a href="#" aria-label="Se connecter" style="width: 40px; height: 40px; border-radius: 12px; background: #ffffff; color: {OR_FONCE}; '
                  f'display: flex; align-items: center; justify-content: center">{ic("utilisateur", 20, trait=2.2)}</a>')
    return f"""<header style="{position} height: 64px; padding: 0 16px; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; z-index: 4; {fond}">
{av.logo_mot(30, "m-" + uid)}
<div style="display: flex; align-items: center; gap: 8px">{compte}
<button onClick="[[ouvrirMenuMobile]]" aria-label="Menu" aria-expanded="[[menuMobileOuvert]]" style="width: 40px; height: 40px; border-radius: 12px; border: 1.5px solid rgba(255,255,255,0.22); background: rgba(15,11,8,0.45); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer">{ic("menu", 20)}</button></div></header>"""


def menu_mobile(uid, actif=None):
    liens = "".join(f'<a href="#" style="height: 58px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.08); '
                    f'color: {"#fff" if cle == actif else TEXTE}; text-decoration: none; {BAL}; font-size: 24px">{nom}'
                    f'<span style="color: {OR if cle == actif else DOUX}; display: flex">{ic("droite", 20)}</span></a>' for cle, nom in LIENS)
    return f"""<div style="display: [[affMenuMobile]]; position: absolute; inset: 0; z-index: 9; background: rgba(12,9,6,0.98)">
<div role="dialog" aria-label="Menu" style="width: 100%; height: 844px; box-sizing: border-box; display: flex; flex-direction: column; padding: 0 20px 28px">
<div style="height: 64px; display: flex; align-items: center; justify-content: space-between">{av.logo_mot(30, "menu-" + uid)}
<button onClick="[[fermerMenuMobile]]" aria-label="Fermer le menu" style="width: 40px; height: 40px; border-radius: 12px; border: 0; background: rgba(255,255,255,0.1); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer">{ic("croix", 18)}</button></div>
<nav aria-label="Site Origins" style="margin-top: 14px; display: flex; flex-direction: column">{liens}</nav>
<div style="margin-top: auto; display: flex; flex-direction: column; gap: 10px">
{bouton_blanc("SE CONNECTER", "utilisateur", None, 54, 16, "100%")}{bouton_contour("Discord d'Origins", "bulle", None, 50, 15, "100%")}
<span style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 6px; font-size: 14px; font-weight: 800; color: {TEXTE}">{ic("globe", 17, OR)}Français{ic("chevron", 14)}</span></div></div></div>"""


def pied_mobile(uid):
    lien_ = lambda t: f'<a href="#" style="color: {TEXTE}; text-decoration: none; font-weight: 700; font-size: 14px">{t}</a>'
    return f"""<footer style="padding: 30px 20px 26px; border-top: 1px solid rgba(255,255,255,0.08); background: #0c0906; display: flex; flex-direction: column; gap: 18px">
{av.logo_mot(32, "pied-m-" + uid)}
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 16px">{lien_("Tempest")}{lien_("Actus")}{lien_("Boutique")}{lien_("Télécharger")}{lien_("Support")}{lien_("Discord")}</div>
<p style="margin: 0; font-size: 11.5px; line-height: 1.5; font-weight: 600; color: rgba(185,168,136,0.7)">Ce n'est pas un produit officiel Minecraft. Non approuvé par Mojang ou Microsoft, ni associé à eux. © 2026 Origins</p></footer>"""


def titre_m(kicker, titre, ident=None):
    att = f' id="{ident}"' if ident else ""
    return f'{sur_titre(kicker)}<h2{att} style="margin: 6px 0 0; {BAL}; font-size: 27px; line-height: 1.12; color: #fff">{titre}</h2>'


def produit_mini(cle, nom, icone, teinte, univers, clic=True):
    c = f' onClick="[[voirProduit_{cle}]]"' if clic else ""
    return (f'<button{c} style="padding: 8px 8px 12px; border-radius: 16px; background: #19120d; border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 10px; '
            f'text-align: left; cursor: pointer; {NUN}">{art_produit(icone, teinte, 44, 112)}<span style="display: flex; flex-direction: column; gap: 5px; padding: 0 4px">'
            f'<strong style="{BAL}; font-size: 15.5px; line-height: 1.15; color: #fff">{nom}</strong><span style="display: flex; align-items: center; justify-content: space-between; gap: 6px">'
            f'<span style="font-size: 11.5px; font-weight: 700; color: {DOUX}">{univers}</span>{pastille("BIENTÔT")}</span></span></button>')


def m_accueil():
    actu_l = lambda a: (f'<article style="display: flex; gap: 12px; align-items: center; padding: 10px; border-radius: 16px; background: #19120d; border: 1px solid rgba(255,255,255,0.08)">'
                        f'<span style="width: 84px; height: 84px; flex: none; border-radius: 12px; background: {a[6]}"></span><span style="display: flex; flex-direction: column; gap: 5px; min-width: 0">'
                        f'<span style="display: flex; align-items: center; gap: 8px">{pastille(a[2], SUR_OR if a[2] == "TEMPEST" else "#0f0b08", OR if a[2] == "TEMPEST" else "#e9e1cf")}'
                        f'<span style="font-size: 11.5px; font-weight: 800; color: {DOUX}">{a[1]}</span></span><strong style="{BAL}; font-size: 16.5px; line-height: 1.2; color: #fff">{a[3]}</strong></span></article>')
    corps = f"""<section style="position: relative; height: 660px; overflow: hidden">
<img src="{FC}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 42%">
<span aria-hidden="true" style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,11,8,0.55) 0%, rgba(15,11,8,0.12) 28%, rgba(15,11,8,0.3) 62%, {EBENE} 100%)"></span>
{nav_mobile("accueil")}
<div style="position: absolute; left: 20px; right: 20px; top: 104px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px">
{sur_titre("ORIGINS · NOS MONDES MINECRAFT").replace("12.5px", "11px")}
{av.logo_mot(64, "m-accueil-grand")}
<h1 style="margin: 4px 0 0; {BAL}; font-size: 33px; line-height: 1.08; color: #fff; text-shadow: 0 4px 20px rgba(0,0,0,0.7)">Des mondes à part, dans Minecraft</h1>
<p style="margin: 0; font-size: 15px; line-height: 1.55; font-weight: 600; color: {TEXTE}; text-shadow: 0 2px 12px rgba(0,0,0,0.85)">Nos serveurs réunis dans un launcher. Premier monde : Tempest.</p>
<div style="width: 100%; display: flex; flex-direction: column; gap: 10px; margin-top: 10px">{bouton_blanc("TÉLÉCHARGER LE LAUNCHER", "telecharger", None, 54, 16, "100%")}{bouton_contour("Rejoindre le Discord", "bulle", None, 50, 15, "100%")}</div>
<p style="margin: 0; font-size: 12.5px; font-weight: 700; color: {DOUX}">Gratuit · PC, Mac et Linux · Minecraft : Java Edition</p></div></section>
<section style="padding: 34px 20px 0">{titre_m("NOS JEUX", "Tempest, le premier monde")}
<article style="margin-top: 18px; border-radius: 20px; overflow: hidden; background: #19120d; border: 1px solid rgba(255,255,255,0.1)">
<div style="position: relative; height: 170px; background: url('{FT}') 50% 45% / cover"><span style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,11,8,0) 30%, rgba(25,18,13,1))"></span>
<img src="{av.gen.LOGO_TEMPEST}" alt="Tempest" style="position: absolute; left: 16px; bottom: 6px; width: 130px"></div>
<div style="padding: 14px 18px 20px; display: flex; flex-direction: column; gap: 12px"><span>{pastille("EN DÉVELOPPEMENT")}</span>
<p style="margin: 0; font-size: 14.5px; line-height: 1.55; font-weight: 600; color: {TEXTE}">Des quêtes, des métiers, des mobs et des donjons, avec des écrans faits pour lui.</p>
{bouton_contour("Découvrir Tempest", None, None, 48, 15, "100%")}</div></article></section>
<section style="padding: 40px 20px 0">{titre_m("ACTUS", "Les dernières nouvelles")}
<div style="margin-top: 16px; display: flex; flex-direction: column; gap: 10px">{"".join(actu_l(a) for a in ACTUS[:3])}</div>
<div style="margin-top: 14px">{lien_or("Toutes les actus →")}</div></section>
<section style="padding: 40px 20px 0">{titre_m("BOUTIQUE", "Soutiens Origins")}
<p style="margin: 8px 0 0; font-size: 14px; line-height: 1.5; font-weight: 600; color: {DOUX}">Des cosmétiques, rien qui donne un avantage en jeu.</p>
<div style="margin-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px">{produit_mini("aura", "Aura de magicule", "aura", 0, "Tempest", False)}{produit_mini("familier", "Familier lumineux", "patte", 5, "Tempest", False)}{produit_mini("themes", "Thèmes du launcher", "palette", 5, "Origins", False)}{produit_mini("cadre", "Cadre d'avatar", "cadre", 6, "Origins", False)}</div>
<div style="margin-top: 14px">{lien_or("Voir la boutique →")}</div></section>
<section style="padding: 40px 20px 40px; display: flex; flex-direction: column; gap: 12px">
{panneau(f'<div style="display: flex; align-items: center; gap: 14px"><span style="width: 48px; height: 48px; border-radius: 15px; background: rgba(201,161,74,0.14); color: {OR}; display: flex; align-items: center; justify-content: center; flex: none">{ic("bulle", 24)}</span><div style="flex: 1"><strong style="{BAL}; font-size: 19px; color: #fff">Un souci ?</strong><p style="margin: 2px 0 0; font-size: 13px; line-height: 1.45; font-weight: 600; color: {DOUX}">Ouvre un ticket, même depuis ton téléphone.</p></div></div><div style="margin-top: 12px">' + bouton_contour("Support", None, None, 44, 14, "100%") + '</div>', "18px")}
{panneau(f'<div style="display: flex; align-items: center; gap: 14px"><span style="width: 48px; height: 48px; border-radius: 15px; background: rgba(201,161,74,0.14); color: {OR}; display: flex; align-items: center; justify-content: center; flex: none">{ic("amis", 24)}</span><div style="flex: 1"><strong style="{BAL}; font-size: 19px; color: #fff">La communauté</strong><p style="margin: 2px 0 0; font-size: 13px; line-height: 1.45; font-weight: 600; color: {DOUX}">Annonces et entraide sur Discord. Facultatif.</p></div></div><div style="margin-top: 12px">' + bouton_contour("Discord", None, None, 44, 14, "100%") + '</div>', "18px")}
</section>
{pied_mobile("accueil")}
{menu_mobile("accueil", "accueil")}"""
    return corps, logique(JS_MOBILE), 2790


def m_telecharger():
    systeme = lambda icone, nom, detail: (f'<div style="display: flex; align-items: center; gap: 14px; padding: 14px; border-radius: 16px; background: #19120d; border: 1px solid rgba(255,255,255,0.08)">'
                                          f'<span style="width: 46px; height: 46px; border-radius: 14px; background: rgba(201,161,74,0.14); color: {OR}; display: flex; align-items: center; justify-content: center; flex: none">{ic(icone, 24)}</span>'
                                          f'<span style="display: flex; flex-direction: column; gap: 2px"><strong style="font-size: 15.5px; font-weight: 800; color: #fff">{nom}</strong><span style="font-size: 12.5px; font-weight: 600; color: {DOUX}">{detail}</span></span></div>')
    corps = f"""{nav_mobile("telecharger", None, True)}
<section style="position: relative; height: 190px; overflow: hidden"><img src="{FC}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 40%">
<span aria-hidden="true" style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,11,8,0.3), {EBENE})"></span>
<div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center">{av.logo_mot(56, "m-tel")}</div></section>
<section style="padding: 8px 20px 0; display: flex; flex-direction: column; gap: 14px">
{sur_titre("TÉLÉCHARGER LE LAUNCHER")}
<h1 style="margin: 0; {BAL}; font-size: 29px; line-height: 1.12; color: #fff">Le launcher s'installe sur ton ordinateur</h1>
<p style="margin: 0; font-size: 15px; line-height: 1.55; font-weight: 600; color: {TEXTE}">Ouvre cette page sur ton PC ou ton Mac pour le télécharger. Garde le lien pour plus tard :</p>
{bouton_blanc("[[texteCopie]]", "lien", "[[copierLien]]", 54, 16, "100%")}
{bouton_contour("Partager le lien", "partager", None, 50, 15, "100%")}
<span style="margin-top: 14px; font-size: 11px; font-weight: 800; letter-spacing: 0.16em; color: {DOUX}">POUR QUEL ORDINATEUR ?</span>
{systeme("fenetre", "Windows", "Windows 10 et 11, 64 bits")}{systeme("portable", "macOS", "Puce Apple ou processeur Intel")}{systeme("terminal", "Linux", "AppImage ou paquet .deb")}
<p style="margin: 6px 0 30px; display: flex; gap: 8px; font-size: 13px; line-height: 1.5; font-weight: 600; color: {DOUX}">{ic("info", 17, OR)}<span>Il te faut un compte Microsoft avec Minecraft : Java Edition.</span></p></section>
{pied_mobile("telecharger")}
{menu_mobile("telecharger", "telecharger")}"""
    js = JS_MOBILE + """    v.texteCopie = s.copie ? 'LIEN COPIÉ ✓' : 'COPIER LE LIEN';
    v.copierLien = () => this.setState({ copie: true });"""
    return corps, logique(js), 1170


def m_boutique():
    grille = lambda univers: "".join(produit_mini(cle, nom, icone, teinte, univers) for cle, nom, icone, teinte in PRODUITS[univers])
    onglet = lambda cle, nom: (f'<button role="radio" aria-checked="[[univPresse_{cle}]]" onClick="[[univ_{cle}]]" style="flex: 1; height: 38px; border: 0; border-radius: 10px; '
                               f'background: [[univFond_{cle}]]; color: [[univCoul_{cle}]]; {NUN}; font-weight: 800; font-size: 14px; cursor: pointer">{nom}</button>')
    feuille = f"""<div style="display: [[affFiche]]; position: absolute; inset: 0; z-index: 7; background: rgba(8,6,4,0.75)">
<div style="width: 100%; height: 844px; display: flex; flex-direction: column; justify-content: flex-end">
<section aria-label="Produit" style="padding: 10px 20px 26px; border-radius: 26px 26px 0 0; background: #19120d; border-top: 1px solid rgba(201,161,74,0.35); display: flex; flex-direction: column; gap: 14px">
<span aria-hidden="true" style="align-self: center; width: 44px; height: 5px; border-radius: 3px; background: rgba(255,255,255,0.25)"></span>
<div style="display: flex; gap: 14px; align-items: center"><div style="width: 96px; height: 96px; flex: none; border-radius: 16px; background: [[ficheArt]]; display: flex; align-items: center; justify-content: center"><img src="[[ficheIcone]]" alt="" style="width: 48px"></div>
<div style="display: flex; flex-direction: column; gap: 6px"><span>{pastille("[[ficheUnivers]]")}</span><strong style="{BAL}; font-size: 22px; line-height: 1.1; color: #fff">[[ficheNom]]</strong></div>
<button onClick="[[fermerFiche]]" aria-label="Fermer" style="margin-left: auto; align-self: flex-start; width: 34px; height: 34px; border-radius: 50%; border: 0; background: rgba(255,255,255,0.1); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer">{ic("croix", 15)}</button></div>
<label style="display: flex; flex-direction: column; gap: 7px"><span style="font-size: 10.5px; font-weight: 800; letter-spacing: 0.12em; color: {DOUX}">POUR QUI ? TON PSEUDO MINECRAFT</span>
<span style="display: flex; align-items: center; gap: 10px; height: 50px; padding: 0 8px 0 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.28); background: rgba(0,0,0,0.3)"><span style="flex: 1; font-size: 16px; font-weight: 700; color: #fff">Yunoow</span>{av.avatar("moi", 32)}<span style="display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 800; color: {VERT}">{ic("coche", 14, VERT, 2.6)}C'est toi</span></span></label>
<button disabled style="height: 54px; border: 0; border-radius: 15px; background: rgba(255,255,255,0.12); color: {DOUX}; {BAL}; font-size: 16px; letter-spacing: 0.05em">BIENTÔT DISPONIBLE</button>
<p style="margin: 0; font-size: 12.5px; line-height: 1.5; font-weight: 600; color: {DOUX}">Un cosmétique : il arrivera en jeu sur ce compte, à ta prochaine connexion.</p></section></div></div>"""
    corps = f"""{nav_mobile("boutique", None, True)}
<section style="padding: 26px 20px 0; display: flex; flex-direction: column; gap: 12px">
<div style="display: flex; align-items: center; justify-content: space-between">{sur_titre("BOUTIQUE")}{pastille("OUVRE BIENTÔT")}</div>
<h1 style="margin: 0; {BAL}; font-size: 32px; line-height: 1.1; color: #fff">Soutiens Origins</h1>
<p style="margin: 0; font-size: 14.5px; line-height: 1.55; font-weight: 600; color: {TEXTE}">La même boutique que dans le launcher : des cosmétiques, rien qui donne un avantage en jeu. Pas besoin de compte, ton pseudo suffit.</p>
<div role="radiogroup" aria-label="Univers" style="display: flex; gap: 4px; padding: 4px; border-radius: 13px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08)">{onglet("tout", "Tout")}{onglet("tempest", "Tempest")}{onglet("origins", "Origins")}</div></section>
<section style="display: [[affTempest]]; flex-direction: column; gap: 12px; padding: 24px 20px 0"><span style="{BAL}; font-size: 20px; color: #fff">Tempest</span>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">{grille("Tempest")}</div></section>
<section style="display: [[affOrigins]]; flex-direction: column; gap: 12px; padding: 28px 20px 0"><span style="{BAL}; font-size: 20px; color: #fff">Origins</span>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">{grille("Origins")}</div></section>
<div style="height: 40px"></div>
{pied_mobile("boutique")}
{feuille}
{menu_mobile("boutique", "boutique")}"""
    produits = {cle: [nom, univers, f"radial-gradient(70% 80% at 50% 40%, {TEINTES[teinte][0]}, {TEINTES[teinte][1]})", icone_url(icone)]
                for univers, liste in PRODUITS.items() for cle, nom, icone, teinte in liste}
    js = JS_MOBILE + """    const univ = s.univ || 'tout';
    ['tout', 'tempest', 'origins'].forEach((u) => {
      v['univFond_' + u] = u === univ ? '#ffffff' : 'transparent';
      v['univCoul_' + u] = u === univ ? C.orFonce : '#f0e6cf';
      v['univPresse_' + u] = u === univ ? 'true' : 'false';
      v['univ_' + u] = () => this.setState({ univ: u });
    });
    v.affTempest = univ === 'origins' ? 'none' : 'flex';
    v.affOrigins = univ === 'tempest' ? 'none' : 'flex';
    Object.keys(C.produits).forEach((k) => { v['voirProduit_' + k] = () => this.setState({ produit: k }); });
    const P = C.produits[s.produit];
    v.affFiche = P ? 'flex' : 'none';
    v.fermerFiche = () => this.setState({ produit: null });
    const Q = P || C.produits.aura;
    v.ficheNom = Q[0]; v.ficheUnivers = Q[1].toUpperCase(); v.ficheArt = Q[2]; v.ficheIcone = Q[3];"""
    return corps, logique(js, {"orFonce": OR_FONCE, "produits": produits}), 1830


def m_support():
    corps = f"""{nav_mobile("support", "joueur", True)}
<div style="padding: 12px 16px 14px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 8px">
<a href="#" style="display: inline-flex; align-items: center; gap: 4px; color: {OR}; text-decoration: none; font-size: 13.5px; font-weight: 800">{ic("retour", 16)}Mes tickets</a>
<h1 style="margin: 0; {BAL}; font-size: 21px; line-height: 1.2; color: #fff">Les mobs ont l'apparence d'animaux</h1>
<div style="display: flex; align-items: center; gap: 10px">{puce_cat("Bug en jeu")}{statut("en_cours")}<span style="font-size: 12px; font-weight: 700; color: {DOUX}">#1042</span></div></div>
<div style="padding: 18px 14px; display: flex; flex-direction: column; gap: 16px">{conversation_1042().replace("max-width: 78%", "max-width: 86%")}</div>
<div style="position: absolute; left: 0; right: 0; bottom: 0; padding: 10px 12px 16px; background: {EBENE}; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 8px">
<button aria-label="Joindre une capture" style="width: 42px; height: 42px; flex: none; border-radius: 12px; border: 1.5px solid rgba(255,255,255,0.18); background: transparent; color: #fff; display: flex; align-items: center; justify-content: center">{ic("lien", 18)}</button>
<span style="flex: 1; height: 42px; box-sizing: border-box; padding: 0 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.18); background: rgba(0,0,0,0.25); display: flex; align-items: center; font-size: 14px; font-weight: 600; color: {DOUX}">Écris ta réponse…</span>
<button aria-label="Envoyer" style="width: 42px; height: 42px; flex: none; border-radius: 12px; border: 0; background: {OR}; color: {SUR_OR}; display: flex; align-items: center; justify-content: center">{ic("envoi", 18, trait=2.2)}</button></div>
{menu_mobile("support", "support")}"""
    return corps, logique(JS_MOBILE), 980


# ---------------------------------------------------------------- écriture
PLANCHES = [
    ("Site-Connexion.dc.html", "Site Origins · Connexion par le launcher", connexion),
    ("Site-Profil.dc.html", "Site Origins · Mon profil", profil),
    ("Site-Support.dc.html", "Site Origins · Support", support),
    ("Site-Tickets.dc.html", "Site Origins · Tickets du staff", tickets_staff),
    ("Site-Board.dc.html", "Site Origins · Board", board),
    ("Site-Accueil.dc.html", "Site Origins · Accueil", accueil),
    ("Site-Actus.dc.html", "Site Origins · Actus", page_actus),
    ("Site-Boutique.dc.html", "Site Origins · Boutique", page_boutique),
    ("Site-Tempest.dc.html", "Site Origins · Tempest", page_tempest),
    ("Mobile-Accueil.dc.html", "Site Origins · Accueil sur téléphone", m_accueil),
    ("Mobile-Telecharger.dc.html", "Site Origins · Télécharger sur téléphone", m_telecharger),
    ("Mobile-Boutique.dc.html", "Site Origins · Boutique sur téléphone", m_boutique),
    ("Mobile-Support.dc.html", "Site Origins · Support sur téléphone", m_support),
]


def ecrire(seulement=None):
    for fichier, titre, fabrique in PLANCHES:
        if seulement and fichier not in seulement:
            continue
        corps, js, hauteur = fabrique()
        chemin = os.path.join(ICI, "project", fichier)
        largeur = LM if fichier.startswith("Mobile-") else L
        with open(chemin, "w", encoding="utf-8") as f:
            f.write(page(titre, corps, js, hauteur, largeur))
        print(fichier, largeur, hauteur)


if __name__ == "__main__":
    import sys
    ecrire(sys.argv[1:] or None)
