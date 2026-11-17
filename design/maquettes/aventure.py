"""Piste « Aventure » du launcher Origins : l'organisation du launcher d'Ankama (Yunoow, 17/11 : « un truc du style
vraiment à la Ankama … je veux qu'on se démarque des autres serveurs Minecraft »), sur les systèmes qui existent déjà
dans le launcher (Yunoow, 17/11 : « garder les mêmes systèmes qu'on avait, mais on améliore comment ça fonctionne ») :
profil Origins (nom et avatar à soi, Origins ID), contacts par Origins ID, messages privés, demandes d'ami, langue,
mémoire du jeu, tutoriel, fenêtre des nouveautés. Les 8 thèmes du launcher, Argent et nuit par défaut (pas de vert).

Écrit project/Aventure-*.dc.html et les ajoute au canvas (à lancer après gen.py et coloris.py).
Dans les gabarits, [[nom]] est une liaison du canvas (devient {{nom}} à l'écriture)."""
import json, os

import gen
import themes as th

ICI = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(ICI, "project")

POLICES = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" '
           'href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&amp;family=Nunito:wght@400;600;700;800&amp;display=swap">')

ICONES = dict(gen.I)
ICONES.update({
    "bulle": '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V17A2.5 2.5 0 0 1 4 14.5z"/>',
    "lettre": '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
    "curseurs": '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    "chevron": '<path d="m6 9 6 6 6-6"/>',
    "epee": '<path d="M14.5 3.5H20v5.5L9.5 19.5l-5-5z"/><path d="m7 15-3 3 2 2 3-3M12 9.5l2.5 2.5"/>',
    "sortie": '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10"/>',
    "crayon": '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
    "ajout": '<circle cx="10" cy="8" r="4"/><path d="M3 20a7 7 0 0 1 12.5-4.3M18 14v6M15 17h6"/>',
    "sac": '<path d="M8 7V5.5a4 4 0 0 1 8 0V7"/><rect x="4" y="7" width="16" height="14" rx="3"/><path d="M4 13h16M10 13v2h4v-2"/>',
    "inventaire": '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>',
    "course": '<circle cx="14" cy="4.5" r="2"/><path d="m8 21 3-6 3 2v4M6 12l3-4h5l3 4 3 1M11 15l-1-4"/>',
    "telecharger": '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    "pause": '<path d="M9 5v14M15 5v14"/>',
    "lecture": '<path d="M8 5v14l11-7z"/>',
    "globe": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.7 3.9 5.7 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.7-3.9-9S9.4 5.7 12 3z"/>',
    "externe": '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
})


def ic(nom, taille=22, couleur="currentColor", trait=1.8):
    return (f'<svg aria-hidden="true" width="{taille}" height="{taille}" viewBox="0 0 24 24" fill="none" stroke="{couleur}" '
            f'stroke-width="{trait}" stroke-linecap="round" stroke-linejoin="round">{ICONES[nom]}</svg>')


def deco(svg):
    """Un logo posé pour décorer : caché aux lecteurs d'écran."""
    return svg.replace('role="img" aria-label=""', 'aria-hidden="true"')


# ---------------------------------------------------------------- thèmes : les 8 du launcher
ORIGINE = {}
for _hexa, _role in th.ROLES.items():
    ORIGINE.setdefault(_role, _hexa)


def _c(pal, role):
    return pal.get(role) or ORIGINE[role]


def _rgb(h):
    h = h.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def _melange(a, b, t):
    return tuple(round(x * t + y * (1 - t)) for x, y in zip(_rgb(a), _rgb(b)))


def _rgba(t, alpha):
    return f"rgba({t[0]},{t[1]},{t[2]},{alpha})"


THEMES = []
for _id, _nom, _texte, _pal in th.PALETTES:
    _metal, _profond, _fond = _c(_pal, "metal"), _c(_pal, "profond"), _c(_pal, "fond")
    THEMES.append({
        "id": _id, "nom": _nom,
        "verre1": _rgba(_melange(_metal, _profond, 0.34), 0.93), "verre2": _rgba(_melange(_profond, _fond, 0.8), 0.96),
        "accent": _metal, "surAccent": _c(_pal, "sur_bouton"), "jouer": _c(_pal, "grad3"), "titre": _c(_pal, "grad3"),
        "teinte": _rgba(_rgb(_fond), 0.28), "barre": _fond, "panneau": _c(_pal, "bois"), "reglages": _c(_pal, "bois2"),
        "nav": _c(_pal, "bois"), "navTitre": _c(_pal, "fond2"), "doux": _c(_pal, "gris"), "texte": _c(_pal, "texte"),
    })


THEMES.sort(key=lambda t: t["id"] != "or-ebene")

# Fond de l'écran de connexion, peint par fond_connexion.py (Yunoow, 17/11 : le ciel bleu ne va plus avec l'or).
FOND_CONNEXION = "/_blob/f9f0a3965d73b365e92d5a13ea88de62"   # Or et ébène d'abord : c'est le thème par défaut (Yunoow, 17/11).


# ---------------------------------------------------------------- avatars (les images que les joueurs ont mises)
AVATARS = {
    "moi": ("Yunoow", f"url('{gen.FOND_TEMPEST}') 57% 74% / 700% auto"),
    "lyra": ("Lyra", f"url('{gen.CIEL}') 40% 6% / 400% auto"),
    "tomo": ("Tomo", f"url('{gen.FOND_TEMPEST}') 80% 0% / 500% auto"),
    "kaze": ("Kaze", "#4a6fa5"),
    "nami": ("Nami", "#7a4a8a"),
    "rui": ("Rui", "#3f7f6a"),
}


def avatar(qui, taille, decor=True):
    nom, fond = AVATARS[qui]
    lettre = "" if fond.startswith("url(") else nom[0]
    attr = 'aria-hidden="true"' if decor else f'role="img" aria-label="Avatar de {nom}"'
    return (f'<span {attr} style="display: flex; flex: none; width: {taille}px; height: {taille}px; border-radius: 50%; background: {fond}; '
            f'align-items: center; justify-content: center; font-family: \'Baloo 2\', sans-serif; font-weight: 800; '
            f'font-size: {round(taille * 0.45)}px; color: #fff">{lettre}</span>')


# ---------------------------------------------------------------- barre du haut, rail
PAGES = ["accueil", "jeux", "actus", "boutique"]


def bouton_barre(icone, libelle, cle):
    return (f'<button class="av-onglet" aria-label="{libelle}" title="{libelle}" aria-current="[[pa_{cle}]]" onClick="[[aller_{cle}]]" '
            f'style="width: 50px; height: 46px; border: 0; background: [[pf_{cle}]]; color: [[pc_{cle}]]; display: flex; align-items: center; '
            f'justify-content: center; cursor: pointer">{ic(icone, 21)}</button>')


def pastille(valeur, affichage):
    return (f'<span aria-hidden="true" style="position: absolute; top: 7px; right: 8px; min-width: 16px; height: 16px; padding: 0 4px; '
            f'box-sizing: border-box; border-radius: 8px; background: #e2574c; color: #fff; font-size: 10px; font-weight: 800; '
            f'display: {affichage}; align-items: center; justify-content: center">{valeur}</span>')


def barre_haut():
    onglets = (bouton_barre("accueil", "Accueil", "accueil") + bouton_barre("jeux", "Jeux", "jeux") + bouton_barre("actus", "Actus", "actus")
               + bouton_barre("boutique", "Boutique", "boutique"))
    return f"""<header style="position: absolute; top: 0; left: 0; right: 0; height: 46px; display: flex; align-items: stretch; background: [[cBarre]]; z-index: 6; border-bottom: 1px solid rgba(255,255,255,0.06)">
<button aria-label="Origins, accueil" onClick="[[aller_accueil]]" style="width: 56px; border: 0; display: flex; align-items: center; justify-content: center; background: linear-gradient(140deg, [[cVerre1]], [[cVerre2]]); cursor: pointer">{gen.logo_sobre(gen.LOGO_DEFAUT, 28, "#ffffff")}</button>
<nav aria-label="Sections" style="display: flex">{onglets}</nav>
<div style="flex: 1; display: flex; align-items: center; justify-content: center">
<a href="#" class="av-onglet" onClick="[[aller_actus]]" style="height: 46px; display: flex; align-items: center; gap: 10px; padding: 0 18px; background: linear-gradient(120deg, [[cVerre2]], [[cVerre1]]); font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 15px; letter-spacing: 0.04em; color: #fff; text-decoration: none; text-transform: uppercase"><span style="padding: 1px 7px; border-radius: 6px; background: [[cAccent]]; color: [[cSurAccent]]; font-size: 11px; letter-spacing: 0.08em">Nouveau</span>Le launcher fait peau neuve</a>
</div>
<button class="av-onglet" aria-label="Notifications" onClick="[[voirDemandes]]" style="position: relative; width: 50px; border: 0; background: transparent; color: [[cDoux]]; display: flex; align-items: center; justify-content: center; cursor: pointer">{ic("cloche", 20)}{pastille("[[nbDemandes]]", "[[pastilleDemandes]]")}</button>
<button class="av-onglet" aria-label="Contacts et messages" aria-pressed="[[tiroirPresse]]" onClick="[[basculerTiroir]]" style="position: relative; width: 52px; border: 0; background: [[fondMessagerie]]; color: [[couleurMessagerie]]; display: flex; align-items: center; justify-content: center; cursor: pointer">{ic("bulle", 21)}{pastille("2", "flex")}</button>
<button class="av-onglet" aria-label="Paramètres" aria-expanded="[[menuReglagesOuvert]]" onClick="[[ouvrirReglages]]" style="width: 50px; border: 0; background: [[fondReglages]]; color: [[couleurReglages]]; display: flex; align-items: center; justify-content: center; cursor: pointer">{ic("curseurs", 21)}</button>
<button aria-label="Mon profil" aria-expanded="[[menuProfilOuvert]]" onClick="[[ouvrirProfil]]" style="width: 54px; border: 0; background: [[fondProfil]]; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative">
{avatar("moi", 30)}<span aria-hidden="true" style="position: absolute; right: 10px; bottom: 8px; width: 9px; height: 9px; border-radius: 50%; background: [[couleurStatut]]; border: 2px solid [[cBarre]]"></span></button>
<div style="display: flex; align-items: flex-start">
<button aria-label="Réduire" style="width: 30px; height: 24px; border: 0; background: transparent; color: [[cDoux]]; display: flex; align-items: center; justify-content: center">{ic("moins", 13)}</button>
<button aria-label="Agrandir" style="width: 30px; height: 24px; border: 0; background: transparent; color: [[cDoux]]; display: flex; align-items: center; justify-content: center">{ic("carre", 11)}</button>
<button aria-label="Fermer" style="width: 30px; height: 24px; border: 0; background: transparent; color: [[cDoux]]; display: flex; align-items: center; justify-content: center">{ic("croix", 13)}</button>
</div>
</header>"""


def rail():
    """Les jeux installés, comme des favoris (Yunoow, 17/11 : « quand tu télécharges un des jeux, ça se met dans la barre
    à gauche »), puis un « + » qui ouvre l'onglet Jeux, rien d'autre (« tu mets juste un plus »)."""
    return f"""<nav aria-label="Mes jeux" style="position: absolute; top: 46px; left: 0; bottom: 0; width: 56px; background: [[cBarre]]; display: flex; flex-direction: column; align-items: center; gap: 10px; padding-top: 12px; z-index: 5">
<span style="display: [[railTempestAff]]; flex-direction: column; align-items: center; gap: 10px"><span style="padding: 3px; border-radius: 14px; background: [[railAnneau]]; display: flex"><a href="#" aria-label="Tempest" title="Tempest" aria-current="[[railTempest]]" onClick="[[aller_accueil]]" style="width: 40px; height: 40px; border-radius: 11px; background: [[cPanneau]]; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 2px [[railBord]]"><img src="{gen.LOGO_TEMPEST}" alt="" style="width: 34px; height: 34px; object-fit: contain"></a></span>
<span aria-hidden="true" style="width: 26px; height: 1px; background: rgba(255,255,255,0.14)"></span></span>
<button aria-label="Tous les jeux" title="Tous les jeux" onClick="[[aller_jeux]]" style="width: 40px; height: 40px; border: 0; border-radius: 11px; background: transparent; color: [[cDoux]]; display: flex; align-items: center; justify-content: center; cursor: pointer">{ic("plus", 22)}</button>
</nav>"""


# ---------------------------------------------------------------- page d'accueil
def carte_jeu():
    def rond(icone, libelle, clic=""):
        sur_clic = f' onClick="{clic}"' if clic else ""
        return (f'<button class="av-rond" aria-label="{libelle}" title="{libelle}"{sur_clic} style="width: 42px; height: 42px; border-radius: 50%; '
                f'border: 1px solid rgba(255,255,255,0.4); background: rgba(255,255,255,0.14); color: #fff; display: flex; '
                f'align-items: center; justify-content: center; cursor: pointer">{ic(icone, 19)}</button>')
    return f"""<section aria-label="Tempest" style="position: absolute; left: 24px; top: 20px; width: 300px; box-sizing: border-box; padding: 14px 20px 16px; border-radius: 22px; background: linear-gradient(160deg, [[cVerre1]], [[cVerre2]]); border: 1px solid rgba(255,255,255,0.18); box-shadow: 0 18px 40px rgba(0,0,0,0.4); display: flex; flex-direction: column; gap: 10px">
<div style="display: flex; justify-content: flex-end"><button aria-label="Choisir le jeu" style="display: flex; align-items: center; gap: 4px; padding: 3px 8px 3px 12px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.55); background: rgba(0,0,0,0.15); color: #fff; font-family: Nunito, sans-serif; font-weight: 800; font-size: 12px; cursor: pointer">Tempest {ic("chevron", 14)}</button></div>
<img src="{gen.LOGO_TEMPEST}" alt="Tempest" style="width: 210px; height: 168px; object-fit: contain; align-self: center; margin-top: -8px; filter: drop-shadow(0 6px 14px rgba(0,0,0,0.35))">
<p style="margin: 0; display: flex; align-items: center; justify-content: flex-end; gap: 6px; font-size: 12px; font-weight: 800; color: #fff"><span aria-hidden="true" style="width: 8px; height: 8px; border-radius: 50%; background: #4cd38a; box-shadow: 0 0 8px #4cd38a"></span>Serveur en ligne · 42 joueurs</p>
<div style="display: [[affInstaller]]; flex-direction: column; gap: 6px">
<button class="av-jouer" onClick="[[installer]]" style="height: 56px; border: 0; border-radius: 16px; background: #ffffff; color: [[cJouer]]; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 21px; letter-spacing: 0.08em; cursor: pointer; box-shadow: 0 5px 0 rgba(0,0,0,0.18); display: flex; align-items: center; justify-content: center; gap: 10px">{ic("telecharger", 22, "currentColor", 2.2)}INSTALLER</button>
<p style="margin: 0; text-align: center; font-size: 11.5px; font-weight: 700; color: rgba(255,255,255,0.85)">2,4 Go · Minecraft 1.21.11, mods et pack de Tempest</p></div>
<div role="status" aria-label="Téléchargement de Tempest" style="display: [[affTelech]]; flex-direction: column; gap: 7px; padding: 12px 14px; border-radius: 16px; background: rgba(0,0,0,0.28); border: 1px solid rgba(255,255,255,0.14)">
<div style="display: flex; align-items: baseline; justify-content: space-between"><span style="font-size: 11px; font-weight: 800; letter-spacing: 0.12em; color: rgba(255,255,255,0.85)">[[titreTelech]]</span><span style="font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 22px; line-height: 1; color: #fff">[[pctTexte]]</span></div>
<div aria-hidden="true" style="position: relative; height: 8px; border-radius: 4px; background: rgba(255,255,255,0.16); overflow: hidden"><span class="av-rayures" style="position: absolute; left: 0; top: 0; bottom: 0; width: [[pctLargeur]]; border-radius: 4px; background-color: [[cAccent]]"></span></div>
<div style="display: flex; justify-content: space-between; font-size: 11.5px; font-weight: 700; color: #fff"><span>[[tailleTexte]]</span><span>[[vitesseTexte]]</span></div>
<div style="display: flex; align-items: center; justify-content: space-between; gap: 8px"><span style="min-width: 0; font-size: 11.5px; color: rgba(255,255,255,0.8); white-space: nowrap; overflow: hidden; text-overflow: ellipsis">[[etapeTexte]]</span>
<span style="display: [[affBoutonsTelech]]; gap: 6px; flex: none"><button aria-label="[[libellePause]]" title="[[libellePause]]" onClick="[[basculerPause]]" style="width: 30px; height: 30px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.4); background: rgba(255,255,255,0.12); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer"><span style="display: [[affIconePause]]">{ic("pause", 14, "currentColor", 2.4)}</span><span style="display: [[affIconeLecture]]">{ic("lecture", 14, "currentColor", 2)}</span></button>
<button aria-label="Annuler le téléchargement" title="Annuler" onClick="[[annuler]]" style="width: 30px; height: 30px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.4); background: rgba(255,255,255,0.12); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer">{ic("croix", 14)}</button></span></div>
</div>
<button class="av-jouer" onClick="[[lancer]]" style="display: [[affJouer]]; height: 56px; border: 0; border-radius: 16px; background: #ffffff; color: [[cJouer]]; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 23px; letter-spacing: 0.08em; cursor: pointer; box-shadow: 0 5px 0 rgba(0,0,0,0.18); position: relative; overflow: hidden">[[libelleJouer]]<span aria-hidden="true" style="position: absolute; left: 0; bottom: 0; height: 5px; width: [[progression]]; background: [[cAccent]]"></span></button>
<p role="status" style="margin: -4px 0 0; display: [[affPreparation]]; justify-content: space-between; font-size: 11.5px; font-weight: 700; color: #fff"><span>Lancement de Tempest…</span><span>62 %</span></p>
<div style="display: flex; justify-content: center; gap: 22px">{rond("boutique", "Boutique", "[[aller_boutique]]")}{rond("reglages", "Paramètres du jeu", "[[ouvrirJeu]]")}</div>
</section>"""


ACTUS = [
    ("Le launcher fait peau neuve", "Nouveau look, thèmes au choix et un logo Origins tout neuf.", "Info", "17/11/2026",
     f"url('{gen.FOND_TEMPEST}') 78% 18% / 300% auto", "rgba(10,20,50,0.35)", deco(gen.logo_sobre("seuil", 50, "#ffffff", ""))),
    ("Partez en groupe", "Monte un groupe avec tes amis : vous voyez la vie de chacun et vous partagez l'aventure.", "Nouveauté", "11/10/2026",
     f"url('{gen.FOND_TEMPEST}') 60% 70% / 300% auto", "rgba(20,60,40,0.35)", ic("amis", 46, "#fff", 1.6)),
    ("Le butin va droit dans ton sac", "Plus besoin de ramasser : le butin des monstres arrive tout seul.", "Nouveauté", "09/10/2026",
     f"url('{gen.FOND_TEMPEST}') 10% 80% / 300% auto", "rgba(90,60,10,0.35)", ic("sac", 46, "#fff", 1.6)),
]


def actus():
    cartes = ""
    for titre, texte, sorte, date, fond, voile_carte, icone_carte in ACTUS:
        cartes += f"""<article class="av-actu" style="width: 196px; height: 236px; border-radius: 12px; overflow: hidden; background: [[cPanneau]]; border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; box-shadow: 0 6px 16px rgba(0,0,0,0.3); cursor: pointer">
<div style="padding: 10px 12px 8px; display: flex; flex-direction: column; gap: 4px; height: 98px; box-sizing: border-box">
<h3 style="margin: 0; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 14px; line-height: 1.08; text-transform: uppercase; color: [[cAccent]]">{titre}</h3>
<p style="margin: 0; font-size: 11.5px; line-height: 1.32; color: [[cDoux]]; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden">{texte}</p></div>
<div style="position: relative; flex: 1; background: {fond}; display: flex; align-items: center; justify-content: center"><span aria-hidden="true" style="position: absolute; inset: 0; background: {voile_carte}"></span><span style="position: relative; filter: drop-shadow(0 3px 8px rgba(0,0,0,0.45))">{icone_carte}</span></div>
<p style="margin: 0; height: 26px; display: flex; align-items: center; padding: 0 12px; background: [[cBarre]]; color: #fff; font-size: 10.5px; font-weight: 800; letter-spacing: 0.02em"><span style="text-transform: uppercase">{sorte}</span>&nbsp;<span style="font-weight: 600; color: [[cDoux]]">{date}</span></p>
</article>"""
    return f"""<section aria-label="Actus Tempest" style="position: absolute; left: 24px; top: 404px; width: 648px; box-sizing: border-box; padding: 12px 18px 18px; border-radius: 18px; background: rgba(5,8,14,0.62); backdrop-filter: blur(8px); display: flex; flex-direction: column; gap: 10px">
<div style="display: flex; align-items: center; justify-content: space-between"><h2 style="margin: 0; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 17px; letter-spacing: 0.04em; color: #fff">ACTUS TEMPEST</h2>
<a href="#" onClick="[[aller_actus]]" style="display: flex; align-items: center; gap: 8px; font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 15px; color: #fff; text-decoration: none">+ D'ACTUS <span style="width: 20px; height: 20px; border-radius: 6px; background: #fff; color: #111; display: flex; align-items: center; justify-content: center">{ic("chevron", 14, "#111", 2.4)}</span></a></div>
<div style="display: flex; gap: 12px">{cartes}</div>
</section>"""


def nouveautes():
    """La fenêtre « Quoi de neuf ? » qui existe déjà après une mise à jour, en petit, en bas à droite."""
    point = lambda texte: f'<li style="display: flex; gap: 8px; align-items: baseline"><span aria-hidden="true" style="color: [[cAccent]]">✦</span>{texte}</li>'
    return f"""<div role="dialog" aria-label="Quoi de neuf ?" style="position: absolute; right: 22px; bottom: 22px; width: 300px; box-sizing: border-box; padding: 16px 20px 16px; border-radius: 18px; background: linear-gradient(150deg, [[cVerre1]], [[cVerre2]]); border: 1px solid rgba(255,255,255,0.16); box-shadow: 0 14px 34px rgba(0,0,0,0.4); display: [[toastAff]]; z-index: 3">
<button aria-label="Fermer" onClick="[[fermerToast]]" style="position: absolute; top: 10px; right: 10px; width: 28px; height: 28px; border: 0; background: transparent; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer">{ic("croix", 17)}</button>
<span style="font-size: 10.5px; font-weight: 800; letter-spacing: 0.12em; color: [[cAccent]]">MISE À JOUR INSTALLÉE</span>
<h2 style="margin: 2px 0 8px; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 19px; color: #fff">Quoi de neuf dans la 0.6.4 ?</h2>
<ul style="margin: 0 0 12px; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: #fff">{point("Nouveau look et 8 thèmes au choix")}{point("Un nouveau logo Origins")}{point("Contacts et messages plus simples")}</ul>
<div style="display: flex; gap: 8px"><button onClick="[[aller_actus]]" style="flex: 1; height: 34px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.5); background: transparent; color: #fff; font-family: Nunito, sans-serif; font-weight: 800; font-size: 12px; cursor: pointer">TOUTES LES ACTUS</button><button onClick="[[fermerToast]]" style="flex: 1; height: 34px; border-radius: 10px; border: 0; background: #fff; color: [[cJouer]]; font-family: Nunito, sans-serif; font-weight: 800; font-size: 12px; cursor: pointer">COMPRIS !</button></div>
</div>"""



# ---------------------------------------------------------------- onglet Jeux (mosaïque d'affiches, comme chez Ankama)
def page_jeux():
    """Les jeux disponibles (Yunoow, 17/11 : « on mettra directement les jeux dispo dans le truc des jeux ») : Tempest
    pour l'instant. Un jeu installé est aussi dans la barre de gauche."""
    return f"""<section aria-label="Jeux Origins" style="position: absolute; inset: 0; display: [[aff_page_jeux]]; flex-direction: column; gap: 12px; padding: 14px 18px 18px; box-sizing: border-box; background: [[cBarre]]">
<h1 style="margin: 0; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 17px; letter-spacing: 0.04em; color: #fff">JEUX ORIGINS</h1>
<div style="flex: 1; min-height: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px">
<button class="av-affiche" onClick="[[aller_accueil]]" aria-label="Tempest : ouvrir" style="grid-column: span 3; position: relative; border: 0; padding: 0; border-radius: 12px; overflow: hidden; background: url('{gen.FOND_TEMPEST}') 50% 40% / cover; cursor: pointer; text-align: left; font-family: Nunito, sans-serif">
<span aria-hidden="true" style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.78)), [[cTeinte]]"></span>
<img src="{gen.LOGO_TEMPEST}" alt="" style="position: absolute; left: 50%; top: 46%; transform: translate(-50%, -50%); width: 300px; filter: drop-shadow(0 10px 24px rgba(0,0,0,0.5))">
<span style="position: absolute; left: 18px; bottom: 16px; display: flex; flex-direction: column; gap: 2px">
<span style="font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 24px; letter-spacing: 0.03em; color: #fff">TEMPEST</span>
<span style="font-size: 12.5px; font-weight: 700; letter-spacing: 0.05em; color: #e6eaf2; text-transform: uppercase">MMORPG, fantasy · Minecraft 1.21.11</span></span>
<span style="position: absolute; right: 16px; bottom: 18px; display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; background: rgba(0,0,0,0.5); color: #fff; font-size: 11.5px; font-weight: 800; letter-spacing: 0.04em"><span aria-hidden="true" style="width: 8px; height: 8px; border-radius: 50%; background: [[etatJeuCouleur]]"></span>[[etatJeu]]</span>
</button>
</div>
</section>"""


# ---------------------------------------------------------------- onglet Actus
ACTUS_PAGE = [
    ("launcher", "Le launcher fait peau neuve", "Nouveau look, 8 thèmes au choix, un logo Origins tout neuf, et des contacts et des messages plus simples à utiliser.",
     "Info", "17/11/2026", f"url('{gen.FOND_TEMPEST}') 78% 18% / 220% auto", "rgba(10,20,50,0.35)", deco(gen.logo_sobre("seuil", 70, "#ffffff", ""))),
    ("tempest", "Partez en groupe", "Monte un groupe avec tes amis : vous voyez la vie de chacun et vous partagez l'aventure.", "Nouveauté", "11/10/2026",
     f"url('{gen.FOND_TEMPEST}') 60% 70% / 300% auto", "rgba(20,60,40,0.35)", ic("amis", 50, "#fff", 1.6)),
    ("tempest", "Le butin va droit dans ton sac", "Plus besoin de ramasser : le butin des monstres arrive tout seul, avec une petite fenêtre.", "Nouveauté", "09/10/2026",
     f"url('{gen.FOND_TEMPEST}') 10% 80% / 300% auto", "rgba(90,60,10,0.35)", ic("sac", 50, "#fff", 1.6)),
    ("tempest", "Ton inventaire en deux écrans", "E pour ton équipement et tes artefacts, I pour tes poches et tes sacs.", "Nouveauté", "Octobre 2026",
     f"url('{gen.CIEL}') 40% 30% / 260% auto", "rgba(20,40,120,0.2)", ic("inventaire", 50, "#fff", 1.6)),
    ("tempest", "Un nouvel écran de chargement", "Limule court pendant que le pack de textures se charge.", "Nouveauté", "Octobre 2026",
     f"url('{gen.FOND_TEMPEST}') 56% 72% / 260% auto", "rgba(20,50,90,0.3)", ic("course", 50, "#fff", 1.6)),
    ("launcher", "Mises à jour sans redémarrer", "Un launcher déjà ouvert applique les mises à jour tout seul.", "Launcher", "0.6.2",
     f"url('{gen.CIEL}') 70% 60% / 260% auto", "rgba(10,20,60,0.25)", ic("fleche", 50, "#fff", 1.6)),
]
FILTRES = [("tout", "Tout"), ("tempest", "Tempest"), ("launcher", "Launcher")]


def page_actus():
    puces = "".join(
        f'<button aria-pressed="[[fp_{i}]]" onClick="[[filtrer_{i}]]" style="height: 30px; padding: 0 14px; border-radius: 999px; border: 1px solid [[fb_{i}]]; '
        f'background: [[ff_{i}]]; color: [[fc_{i}]]; font-family: Nunito, sans-serif; font-weight: 800; font-size: 12.5px; cursor: pointer">{nom}</button>'
        for i, nom in FILTRES)
    cartes = ""
    for n, (cat, titre, texte, sorte, date, fond, voile_carte, icone_carte) in enumerate(ACTUS_PAGE):
        large = n == 0
        cartes += f"""<article class="av-actu" style="display: [[aff_actu_{n}]]; {'grid-column: span 2; ' if large else ''}flex-direction: column; border-radius: 12px; overflow: hidden; background: [[cPanneau]]; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 6px 16px rgba(0,0,0,0.3); cursor: pointer">
<div style="padding: 12px 14px 10px; display: flex; flex-direction: column; gap: 5px; height: {112 if large else 108}px; box-sizing: border-box">
<h3 style="margin: 0; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: {20 if large else 15}px; line-height: 1.08; text-transform: uppercase; color: [[cAccent]]">{titre}</h3>
<p style="margin: 0; font-size: 12px; line-height: 1.35; color: [[cDoux]]; display: -webkit-box; -webkit-line-clamp: {3 if large else 2}; -webkit-box-orient: vertical; overflow: hidden">{texte}</p></div>
<div style="position: relative; flex: 1; background: {fond}; display: flex; align-items: center; justify-content: center"><span aria-hidden="true" style="position: absolute; inset: 0; background: {voile_carte}"></span><span style="position: relative; filter: drop-shadow(0 3px 8px rgba(0,0,0,0.45))">{icone_carte}</span></div>
<p style="margin: 0; height: 26px; flex: none; display: flex; align-items: center; padding: 0 12px; background: [[cBarre]]; color: #fff; font-size: 10.5px; font-weight: 800; letter-spacing: 0.02em"><span style="text-transform: uppercase">{sorte}</span>&nbsp;<span style="font-weight: 600; color: [[cDoux]]">{date}</span></p>
</article>"""
    return f"""<section aria-label="Actus Origins" style="position: absolute; inset: 0; display: [[aff_page_actus]]; flex-direction: column; gap: 12px; padding: 14px 18px 0; box-sizing: border-box; background: [[cBarre]]">
<div style="display: flex; align-items: center; justify-content: space-between"><h1 style="margin: 0; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 17px; letter-spacing: 0.04em; color: #fff">ACTUS ORIGINS</h1>
<div role="group" aria-label="Filtrer les actus" style="display: flex; gap: 8px">{puces}</div></div>
<div style="flex: 1; min-height: 0; overflow-y: auto; padding-bottom: 18px"><div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: 300px; gap: 14px">{cartes}</div></div>
</section>"""


# ---------------------------------------------------------------- onglet Boutique (une rangée par univers, comme chez Ankama)
ICONES_BOUTIQUE = {
    "cape": '<path d="M8 3h8l1.5 3L20 21H4L6.5 6z"/><path d="M8 3c1 2 3 3 4 3s3-1 4-3"/>',
    "aura": '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m12 8 1.2 2.8L16 12l-2.8 1.2L12 16l-1.2-2.8L8 12l2.8-1.2z"/>',
    "titre": '<path d="M4 7h16v8H4z"/><path d="M4 15l-2 3h5M20 15l2 3h-5"/><path d="M8 11h8"/>',
    "emote": '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14.5c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2M9 9.5h.01M15 9.5h.01"/>',
    "coffre": '<rect x="3" y="9" width="18" height="11" rx="1.5"/><path d="M3 9a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5M3 13h18"/><rect x="10.5" y="11.5" width="3" height="4" rx=".8"/>',
    "cadre": '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><path d="M12 1.5v2M12 20.5v2M1.5 12h2M20.5 12h2"/>',
    "badge": '<path d="M12 3 19 6v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="m9 12 2 2 4-4"/>',
    "fond": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 16 5-5 4 4 3-3 6 6"/>',
    "patte": '<circle cx="7" cy="9" r="2"/><circle cx="11" cy="5.5" r="2"/><circle cx="16" cy="6.5" r="2"/><circle cx="18.5" cy="11" r="2"/><path d="M8 16.5c0-2.5 2-4.5 4.5-4.5s4 2 4 4.5c0 2-1.5 3-3 3-1 0-1.5-.5-2.5-.5s-1.5.5-2.5.5c-1.5 0-.5-1-.5-3z"/>',
    "cadeau": '<rect x="3" y="9" width="18" height="12" rx="1.5"/><path d="M3 13h18M12 9v12M12 9c-1.5-3-5-4-6-2s3 2 6 2zM12 9c1.5-3 5-4 6-2s-3 2-6 2z"/>',
    "palette": '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.6-.9 1.2-1.8-.5-1-.1-2.2 1.2-2.2H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="14.5" cy="7" r="1"/>',
}


def icone_boutique(nom, taille=58):
    return (f'<svg aria-hidden="true" width="{taille}" height="{taille}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" '
            f'stroke-linecap="round" stroke-linejoin="round">{ICONES_BOUTIQUE[nom]}</svg>')


RANGEES = [
    ("Tempest", f"url('{gen.FOND_TEMPEST}') 50% 40% / cover", f'<img src="{gen.LOGO_TEMPEST}" alt="Tempest" style="width: 210px; filter: drop-shadow(0 8px 20px rgba(0,0,0,0.5))">', [
        ("COSMÉTIQUES", [("Cape de Tempest", "cape", 0), ("Aura de magicule", "aura", 1), ("Titre « Éveillé »", "titre", 2), ("Pack d'emotes", "emote", 3), ("Familier lumineux", "patte", 5)]),
        ("OFFRES DU MOMENT", [("Coffre de la saison", "coffre", 4), ("Pack de bienvenue", "cadeau", 6)]),
    ]),
    ("Origins", f"url('{gen.CIEL}') 40% 30% / cover", f'<span style="display: flex; flex-direction: column; align-items: center; gap: 10px">{gen.logo_sobre("seuil", 92, "#ffffff", "Origins")}<span style="font-family: \'Baloo 2\', sans-serif; font-weight: 800; font-size: 22px; letter-spacing: 0.3em; margin-right: -0.3em; color: #fff">ORIGINS</span></span>', [
        ("COLLECTION ORIGINS", [("Thèmes du launcher", "palette", 5), ("Cadre d'avatar", "cadre", 6), ("Badge de profil", "badge", 7), ("Fond de profil", "fond", 0), ("Fond d'écran du launcher", "fond", 1), ("Sons du launcher", "emote", 2)]),
    ]),
]
TEINTES_BOUTIQUE = ["rgba(150,40,40,0.55)", "rgba(40,90,170,0.5)", "rgba(150,110,30,0.5)", "rgba(40,130,110,0.5)", "rgba(110,50,150,0.55)",
                    "rgba(60,80,140,0.5)", "rgba(140,70,110,0.5)", "rgba(40,110,150,0.5)"]


def page_boutique():
    def carte(nom, icone, teinte):
        return (f'<article class="av-produit" style="width: 150px; flex: none; display: flex; flex-direction: column; border-radius: 8px; overflow: hidden; background: [[cPanneau]]; cursor: pointer">'
                f'<div style="position: relative; height: 150px; background: linear-gradient(160deg, {TEINTES_BOUTIQUE[teinte]}, rgba(0,0,0,0.35)), [[cVerre2]]; display: flex; align-items: center; justify-content: center">'
                f'{icone_boutique(icone)}</div>'
                f'<p style="margin: 0; padding: 8px 10px 0; height: 40px; box-sizing: border-box; font-size: 12.5px; font-weight: 700; color: #fff; line-height: 1.25">{nom}</p>'
                f'<p style="margin: 0; padding: 0 10px 9px; display: flex; justify-content: flex-end"><span style="padding: 2px 8px; border-radius: 6px; background: rgba(255,255,255,0.08); '
                f'font-size: 10.5px; font-weight: 800; letter-spacing: 0.08em; color: [[cDoux]]">BIENTÔT</span></p></article>')

    rangees = ""
    for r, (nom, fond, logo, groupes) in enumerate(RANGEES):
        blocs = ""
        for titre, produits in groupes:
            blocs += (f'<div style="flex: none; display: flex; flex-direction: column; background: rgba(255,255,255,0.03); border-radius: 8px; scroll-snap-align: start">'
                      f'<h2 style="margin: 0; height: 36px; display: flex; align-items: center; padding: 0 12px; font-family: \'Baloo 2\', sans-serif; font-weight: 800; '
                      f'font-size: 14px; letter-spacing: 0.05em; color: #fff">{titre}</h2>'
                      f'<div style="display: flex; gap: 8px; padding: 0 8px 8px">{"".join(carte(*p) for p in produits)}</div></div>')
        rangees += f"""<div style="display: flex; gap: 10px; height: 290px; flex: none">
<div aria-label="{nom}" style="position: relative; width: 300px; flex: none; border-radius: 10px; overflow: hidden; background: {fond}; display: flex; align-items: center; justify-content: center; clip-path: polygon(0 0, 100% 0, 100% 90%, 0 100%)">
<span aria-hidden="true" style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.45)), [[cTeinte]]"></span><span style="position: relative">{logo}</span></div>
<div style="position: relative; flex: 1; min-width: 0">
<div style="height: 100%; display: flex; gap: 10px; overflow-x: auto; scroll-snap-type: x proximity">{blocs}<span id="fin-rangee-{r}" aria-hidden="true" style="flex: none; width: 1px"></span></div>
<a href="#fin-rangee-{r}" aria-label="Voir la suite" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; background: #ffffff; color: #111; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.4)">{ic("fleche", 18, "#111", 2.2)}</a></div>
</div>"""
    return f"""<section aria-label="Boutique" style="position: absolute; inset: 0; display: [[aff_page_boutique]]; flex-direction: column; gap: 14px; padding: 14px 14px 18px; box-sizing: border-box; background: [[cBarre]]; overflow: hidden">
<div style="display: flex; align-items: baseline; justify-content: space-between"><h1 style="margin: 0; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 17px; letter-spacing: 0.04em; color: #fff">BOUTIQUE</h1>
<span style="font-size: 12.5px; color: [[cDoux]]">La boutique ouvrira bientôt : voici comment elle sera rangée.</span></div>
{rangees}
</section>"""


# ---------------------------------------------------------------- contacts et messages (panneau de droite)
def tiroir():
    def onglet(icone, libelle, cle, pastille_valeur="", pastille_aff="none"):
        badge = (f'<span aria-hidden="true" style="position: absolute; top: 6px; right: 14px; min-width: 15px; height: 15px; padding: 0 4px; box-sizing: border-box; '
                 f'border-radius: 8px; background: #e2574c; color: #fff; font-size: 9.5px; font-weight: 800; display: {pastille_aff}; align-items: center; '
                 f'justify-content: center">{pastille_valeur}</span>') if pastille_valeur else ""
        return (f'<button role="tab" aria-selected="[[sel_{cle}]]" onClick="[[voir_{cle}]]" style="position: relative; flex: 1; height: 50px; border: 0; '
                f'border-bottom: 2px solid [[bord_{cle}]]; background: [[fond_{cle}]]; color: [[cTexte]]; display: flex; flex-direction: column; '
                f'align-items: center; justify-content: center; gap: 2px; cursor: pointer; font-family: Nunito, sans-serif">{ic(icone, 18)}'
                f'<span style="font-size: 9.5px; font-weight: 800; letter-spacing: 0.06em">{libelle.upper()}</span>{badge}</button>')

    def contact(qui, statut, couleur, cache=False):
        nom = AVATARS[qui][0]
        aff = " display: [[hors]];" if cache else ""
        return (f'<li style="display: flex; align-items: center; gap: 10px; padding: 6px 2px;{aff}">'
                f'<span style="position: relative; flex: none">{avatar(qui, 32)}<span aria-hidden="true" style="position: absolute; right: -2px; bottom: -2px; '
                f'width: 10px; height: 10px; border-radius: 50%; background: {couleur}; border: 2px solid [[cPanneau]]"></span></span>'
                f'<span style="display: flex; flex-direction: column; min-width: 0"><span style="font-weight: 800; font-size: 13px; color: [[cTexte]]">{nom}</span>'
                f'<span style="font-size: 11.5px; color: [[cDoux]]">{statut}</span></span></li>')

    def conversation(qui, extrait, non_lus):
        nom = AVATARS[qui][0]
        badge = (f'<span style="min-width: 18px; height: 18px; padding: 0 5px; box-sizing: border-box; border-radius: 9px; background: #e2574c; '
                 f'color: #fff; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center">{non_lus}</span>') if non_lus else ""
        return (f'<li><button class="av-entree" style="width: 100%; display: flex; align-items: center; gap: 10px; padding: 9px 4px; border: 0; '
                f'border-bottom: 1px solid rgba(255,255,255,0.06); background: transparent; text-align: left; cursor: pointer; font-family: Nunito, sans-serif">'
                f'{avatar(qui, 32)}<span style="flex: 1; min-width: 0; display: flex; flex-direction: column"><span style="font-weight: 800; font-size: 13px; '
                f'color: [[cTexte]]">{nom}</span><span style="font-size: 11.5px; color: [[cDoux]]; white-space: nowrap; overflow: hidden; '
                f'text-overflow: ellipsis">{extrait}</span></span>{badge}</button></li>')

    contacts = (contact("kaze", "Joue à Tempest", "#4cd38a") + contact("lyra", "Joue à Tempest", "#4cd38a")
                + contact("tomo", "En ligne", "#4cd38a") + contact("rui", "Hors ligne", "#5d6763", True)
                + f'<li style="display: [[affNamiContact]]; align-items: center; gap: 10px; padding: 6px 2px">{avatar("nami", 32)}'
                  f'<span style="display: flex; flex-direction: column"><span style="font-weight: 800; font-size: 13px; color: [[cTexte]]">Nami</span>'
                  f'<span style="font-size: 11.5px; color: [[cDoux]]">Nouveau contact · hors ligne</span></span></li>')
    messages = conversation("kaze", "On fait le donjon ce soir ?", 2) + conversation("lyra", "Merci pour le coup de main !", 0)
    bouton = lambda texte, clic, fond, couleur: (f'<button onClick="{clic}" style="flex: 1; height: 30px; border-radius: 9px; border: 0; background: {fond}; '
                                                f'color: {couleur}; font-family: Nunito, sans-serif; font-weight: 800; font-size: 12px; cursor: pointer">{texte}</button>')
    demandes = f"""<div style="display: [[affDemandeSite]]; flex-direction: column; gap: 8px; margin-bottom: 10px; padding: 12px; border-radius: 12px; background: rgba(201,161,74,0.1); border: 1px solid rgba(201,161,74,0.35)">
<span style="display: flex; align-items: center; gap: 7px; font-weight: 800; font-size: 13px; color: [[cTexte]]">{ic("globe", 16)}Connexion au site</span>
<span style="font-size: 11.5px; line-height: 1.45; color: [[cDoux]]">Chrome · Windows veut se connecter avec ton profil Origins. Le site affiche le même code ?</span>
<span style="font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: 0.14em; color: [[cAccent]]; text-align: center">K7P · 4QX</span>
<div style="display: flex; gap: 8px">{bouton("Accepter", "[[accepterSite]]", "[[cAccent]]", "[[cSurAccent]]")}{bouton("Refuser", "[[refuserSite]]", "rgba(255,255,255,0.1)", "[[cTexte]]")}</div></div>
<p role="status" style="margin: 0 0 10px; display: [[affSiteOk]]; font-size: 12px; color: [[cDoux]]; text-align: center">[[texteSite]]</p>
<div style="display: [[affDemande]]; flex-direction: column; gap: 10px; padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.05)">
<div style="display: flex; align-items: center; gap: 10px">{avatar("nami", 36)}<span style="display: flex; flex-direction: column"><span style="font-weight: 800; font-size: 13.5px; color: [[cTexte]]">Nami</span><span style="font-size: 11px; color: [[cDoux]]">7KQ2-M4XD · veut t'ajouter</span></span></div>
<div style="display: flex; gap: 8px">{bouton("Accepter", "[[accepter]]", "[[cAccent]]", "[[cSurAccent]]")}{bouton("Refuser", "[[refuser]]", "rgba(255,255,255,0.1)", "[[cTexte]]")}</div></div>
<p role="status" style="margin: 0; display: [[affReponse]]; font-size: 12.5px; color: [[cDoux]]; text-align: center; padding: 16px 6px">[[texteReponse]]</p>"""

    return f"""<aside aria-label="Contacts et messages" style="position: absolute; top: 46px; right: 0; bottom: 0; width: 220px; background: [[cPanneau]]; border-left: 1px solid rgba(255,255,255,0.06); display: [[tiroirAff]]; flex-direction: column; z-index: 4">
<div style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06)">{avatar("moi", 34)}
<span style="display: flex; flex-direction: column; min-width: 0"><span style="font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 14px; color: [[cTexte]]">[[nom]]</span>
<span style="display: flex; align-items: center; gap: 5px; font-size: 11.5px; color: [[cDoux]]"><span aria-hidden="true" style="width: 8px; height: 8px; border-radius: 50%; background: [[couleurStatut]]"></span>[[statut]]</span></span></div>
<div role="tablist" aria-label="Contacts et messages" style="display: flex">{onglet("amis", "Contacts", "contacts")}{onglet("lettre", "Messages", "messages", "2", "flex")}{onglet("cloche", "Demandes", "demandes", "[[nbDemandes]]", "[[pastilleDemandes]]")}</div>
<div style="padding: 12px; display: [[aff_contacts]]; flex-direction: column; gap: 10px">
<div style="display: flex; flex-direction: column; gap: 5px"><label for="ajoutId" style="font-size: 10.5px; font-weight: 800; letter-spacing: 0.08em; color: [[cDoux]]">AJOUTER AVEC UN ORIGINS ID</label>
<div style="display: flex; gap: 6px"><input id="ajoutId" placeholder="XXXX-XXXX" autocomplete="off" style="flex: 1; min-width: 0; height: 32px; box-sizing: border-box; padding: 0 10px; border-radius: 9px; border: 1px solid rgba(255,255,255,0.14); background: [[cBarre]]; color: #fff; font-family: ui-monospace, monospace; font-size: 12.5px; letter-spacing: 0.06em">
<button aria-label="Ajouter ce contact" style="width: 32px; height: 32px; border-radius: 9px; border: 0; background: [[cAccent]]; color: [[cSurAccent]]; display: flex; align-items: center; justify-content: center; cursor: pointer">{ic("ajout", 17)}</button></div></div>
<button role="switch" aria-checked="[[seulPresse]]" onClick="[[basculerSeul]]" style="display: flex; align-items: center; gap: 10px; border: 0; background: transparent; padding: 0; cursor: pointer; color: [[cTexte]]; font-family: Nunito, sans-serif; font-size: 12.5px; font-weight: 700">
<span aria-hidden="true" style="position: relative; width: 32px; height: 18px; border-radius: 9px; background: [[fondSwitch]]; flex: none"><span style="position: absolute; top: 2px; left: [[posSwitch]]; width: 14px; height: 14px; border-radius: 50%; background: [[boutonSwitch]]"></span></span>
Seulement en ligne ([[compteContacts]])</button>
<ul style="list-style: none; margin: 0; padding: 0">{contacts}</ul>
</div>
<ul style="list-style: none; margin: 0; padding: 6px 12px; display: [[aff_messages]]; flex-direction: column">{messages}</ul>
<div style="padding: 12px; display: [[aff_demandes]]; flex-direction: column">{demandes}</div>
</aside>"""


# ---------------------------------------------------------------- paramètres (grand panneau, comme chez Ankama)
CATEGORIES = [
    ("general", "Général", [
        ("Langue d'Origins", "Une seule langue pour le launcher et pour Tempest / Minecraft.", ("liste", "Français")),
        ("Thème", "Les couleurs du launcher, rien que pour toi. Le changement est immédiat.", ("themes",)),
    ]),
    ("jeu", "Jeu", [
        ("Mémoire du jeu", "La mémoire donnée à Minecraft. Plus aide avec les shaders et les grandes zones ; trop ralentit le reste du PC.", ("memoire",)),
    ]),
    ("compte", "Compte", [
        ("Compte Microsoft", "Connecté en tant que Yunoow.", ("bouton", "Changer de compte", "")),
        ("Profil Origins", "Ton nom, ton avatar et ton Origins ID.", ("bouton", "Modifier mon profil", "[[ouvrirProfil]]")),
        ("Se déconnecter", "Il faudra te reconnecter avec Microsoft au prochain lancement.", ("danger", "Se déconnecter")),
    ]),
    ("aide", "Aide", [
        ("Tutoriel", "Refais la visite guidée du launcher.", ("bouton", "Revoir le tutoriel", "")),
        ("Nouveautés", "Ce qui a changé dans la dernière mise à jour.", ("bouton", "Voir les nouveautés", "[[revoirNouveautes]]")),
    ]),
    ("apropos", "À propos", [
        ("Version", "Origins Launcher 0.6.4.", ("texte", "À jour")),
        ("Mises à jour", "Le launcher se met à jour tout seul ; un bandeau te prévient quand il faut redémarrer.", ("texte", "Automatiques")),
        ("Toutes les actus", "L'historique des mises à jour du launcher et du projet Origins.", ("lien", "Voir")),
    ]),
]


def controle(c, titre):
    sorte = c[0]
    if sorte == "liste":
        return (f'<button aria-haspopup="listbox" aria-label="{titre} : {c[1]}" style="flex: none; width: 230px; height: 34px; border-radius: 10px; '
                f'border: 1px solid rgba(255,255,255,0.5); background: transparent; color: #fff; display: flex; align-items: center; '
                f'justify-content: space-between; padding: 0 12px; font-family: Nunito, sans-serif; font-weight: 700; font-size: 13px; cursor: pointer">'
                f'{c[1]}{ic("chevron", 16)}</button>')
    if sorte == "bouton":
        clic = f' onClick="{c[2]}"' if c[2] else ""
        return (f'<button class="av-entree"{clic} style="flex: none; height: 34px; padding: 0 16px; border-radius: 10px; border: 0; '
                f'background: rgba(255,255,255,0.1); color: #fff; font-family: Nunito, sans-serif; font-weight: 800; font-size: 13px; cursor: pointer">{c[1]}</button>')
    if sorte == "danger":
        return (f'<button class="av-entree" style="flex: none; height: 34px; padding: 0 16px; border-radius: 10px; border: 0; background: rgba(226,87,76,0.16); '
                f'color: #ff9a8f; font-family: Nunito, sans-serif; font-weight: 800; font-size: 13px; cursor: pointer">{c[1]}</button>')
    if sorte == "texte":
        return f'<span style="flex: none; padding: 6px 12px; border-radius: 10px; background: rgba(255,255,255,0.06); color: [[cDoux]]; font-weight: 800; font-size: 13px">{c[1]}</span>'
    if sorte == "lien":
        return f'<a href="#" onClick="[[aller_actus]]" style="flex: none; color: [[cAccent]]; font-weight: 800; font-size: 13px; text-decoration: none">{c[1]} →</a>'
    return ""


def bloc_themes():
    return """<div role="radiogroup" aria-label="Thème" style="display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 8px">
<sc-for list="[[themes]]" as="t" hint-placeholder-count="8">
<button role="radio" aria-checked="[[t.presse]]" aria-label="Thème [[t.nom]]" onClick="[[t.choisir]]" style="display: flex; flex-direction: column; align-items: center; gap: 5px; padding: 8px 2px 6px; border-radius: 10px; border: 1.5px solid [[t.bord]]; background: [[t.caseFond]]; cursor: pointer; font-family: Nunito, sans-serif">
<span aria-hidden="true" style="position: relative; width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(150deg, [[t.verre1]], [[t.barre]])"><span style="position: absolute; right: -2px; bottom: -2px; width: 12px; height: 12px; border-radius: 50%; background: [[t.accent]]; border: 2px solid [[t.reglages]]"></span></span>
<span style="font-size: 10.5px; font-weight: 700; line-height: 1.15; text-align: center; color: #f2f4f8">[[t.nom]]</span></button>
</sc-for></div>"""


def bloc_memoire():
    """Le curseur va de 2 Go à ce que permet le PC (16 Go au plus) : seulement le minimum et le maximum écrits aux deux
    bouts (Yunoow, 17/11 : les chiffres fixes de 2 à 8 ne tombaient pas sous le rond)."""
    return """<div style="display: flex; align-items: center; gap: 18px">
<div style="flex: 1; display: flex; flex-direction: column; gap: 8px">
<div style="position: relative; height: 22px">
<span aria-hidden="true" style="position: absolute; left: 10px; right: 10px; top: 9px; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.18)"></span>
<span aria-hidden="true" style="position: absolute; left: 10px; top: 9px; height: 4px; width: [[memoireRemplissage]]; border-radius: 2px; background: [[cAccent]]"></span>
<span aria-hidden="true" style="position: absolute; top: 1px; left: [[memoirePouce]]; width: 20px; height: 20px; border-radius: 50%; background: #ffffff; box-shadow: 0 1px 4px rgba(0,0,0,0.45)"></span>
<div role="radiogroup" aria-label="Mémoire du jeu" style="position: absolute; inset: 0; display: flex">
<sc-for list="[[memoires]]" as="m" hint-placeholder-count="15">
<button role="radio" aria-checked="[[m.presse]]" aria-label="[[m.val]] Go" onClick="[[m.choisir]]" style="flex: 1; height: 22px; padding: 0; border: 0; background: transparent; cursor: pointer"></button>
</sc-for></div></div>
<div style="display: flex; justify-content: space-between; font-size: 11.5px; font-weight: 700; color: [[cDoux]]"><span>2 Go</span><span>16 Go</span></div>
</div>
<span style="width: 70px; text-align: right; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 22px; color: #fff">[[memoireTexte]]</span></div>
<p role="status" style="margin: 2px 0 0; font-size: 12.5px; font-weight: 700; color: [[memoireConseilCouleur]]">[[memoireConseil]]</p>"""


def ligne(titre, aide, c):
    if c[0] in ("themes", "memoire"):
        corps = bloc_themes() if c[0] == "themes" else bloc_memoire()
        return (f'<div style="padding: 14px 0 16px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 12px">'
                f'<div><div style="font-size: 14.5px; font-weight: 700; color: #f2f4f8">{titre}</div><div style="font-size: 12px; color: [[cDoux]]; '
                f'margin-top: 2px">{aide}</div></div>{corps}</div>')
    return (f'<div style="display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 14px 0; '
            f'border-top: 1px solid rgba(255,255,255,0.08)"><div style="min-width: 0"><div style="font-size: 14.5px; font-weight: 700; '
            f'color: #f2f4f8">{titre}</div><div style="font-size: 12px; color: [[cDoux]]; margin-top: 2px">{aide}</div></div>{controle(c, titre)}</div>')


def voile(ouvert, largeur_panneau, libelle):
    """Le fond assombri et la grande croix ronde au milieu, comme chez Ankama."""
    return (f'<button aria-label="{libelle}" onClick="[[fermerMenu]]" style="position: absolute; top: 46px; bottom: 0; left: 0; right: {largeur_panneau}; '
            f'border: 0; padding: 0; background: rgba(0,0,0,0.64); cursor: pointer; display: [[{ouvert}]]; z-index: 7">'
            f'<span style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 62px; height: 62px; border-radius: 50%; '
            f'border: 2px solid rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; color: #fff">{ic("croix", 28, "#fff", 1.4)}</span></button>')


def parametres():
    menu = "".join(
        f'<button role="tab" aria-selected="[[cs_{i}]]" onClick="[[cv_{i}]]" style="width: 100%; height: 42px; flex: none; text-align: left; '
        f'padding: 0 22px; border: 0; border-left: 3px solid [[cb_{i}]]; background: [[cf_{i}]]; color: [[cc_{i}]]; '
        f'font-family: Nunito, sans-serif; font-size: 14px; font-weight: [[cw_{i}]]; letter-spacing: 0.03em; text-transform: uppercase; cursor: pointer">{nom}</button>'
        for i, nom, _ in CATEGORIES)
    pages = "".join(
        f'<div role="tabpanel" aria-label="{nom}" style="display: [[aff_cat_{i}]]; flex-direction: column">{"".join(ligne(*l) for l in lignes)}</div>'
        for i, nom, lignes in CATEGORIES)
    return f"""{voile("affParametres", "896px", "Fermer les paramètres")}
<section role="dialog" aria-label="Paramètres" style="position: absolute; top: 46px; right: 0; bottom: 0; width: 896px; display: [[affParametresFlex]]; background: [[cReglages]]; z-index: 7; font-family: Nunito, sans-serif">
<nav style="width: 190px; flex: none; background: [[cNav]]; display: flex; flex-direction: column">
<h2 style="margin: 0; height: 52px; flex: none; display: flex; align-items: center; gap: 10px; padding: 0 22px; background: [[cNavTitre]]; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 16px; letter-spacing: 0.04em; color: #fff">{ic("curseurs", 18)}PARAMÈTRES</h2>
<div role="tablist" aria-orientation="vertical" style="display: flex; flex-direction: column">{menu}</div>
<p style="margin: auto 0 0; padding: 14px 22px; font-size: 11.5px; color: [[cDoux]]">Origins Launcher v0.6.4</p>
</nav>
<div style="flex: 1; min-width: 0; padding: 18px 34px">{pages}</div>
</section>"""


# ---------------------------------------------------------------- profil Origins (panneau de droite, comme chez Ankama)
def entree(icone, texte, clic="", couleur="#f2f4f8"):
    sur_clic = f' onClick="{clic}"' if clic else ""
    return (f'<button class="av-entree"{sur_clic} style="display: flex; align-items: center; gap: 10px; width: 100%; height: 40px; '
            f'padding: 0 22px; border: 0; background: transparent; color: {couleur}; font-family: Nunito, sans-serif; font-size: 13.5px; font-weight: 700; '
            f'letter-spacing: 0.03em; text-transform: uppercase; text-align: left; cursor: pointer">{ic(icone, 17)}{texte}</button>')


def profil():
    return f"""{voile("affProfil", "240px", "Fermer le profil")}
<section role="dialog" aria-label="Mon profil Origins" style="position: absolute; top: 46px; right: 0; bottom: 0; width: 240px; background: [[cReglages]]; display: [[affProfilFlex]]; flex-direction: column; z-index: 7; font-family: Nunito, sans-serif">
<div style="display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 24px 18px 16px; position: relative">
<span style="position: relative; padding: 4px; border-radius: 50%; background: linear-gradient(150deg, [[cAccent]], [[cVerre2]])">{avatar("moi", 88, False)}
<button aria-label="Changer d'avatar" title="Changer d'avatar" style="position: absolute; right: 0; bottom: 0; width: 30px; height: 30px; border-radius: 50%; border: 2px solid [[cReglages]]; background: [[cAccent]]; color: [[cSurAccent]]; display: flex; align-items: center; justify-content: center; cursor: pointer">{ic("crayon", 15)}</button></span>
<button aria-label="Statut : [[statut]], changer" onClick="[[changerStatut]]" style="position: absolute; top: 14px; right: 12px; display: flex; align-items: center; gap: 4px; padding: 3px 7px 3px 5px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.35); background: [[cNav]]; color: #fff; font-family: Nunito, sans-serif; font-size: 11px; font-weight: 800; cursor: pointer"><span aria-hidden="true" style="width: 10px; height: 10px; border-radius: 50%; background: [[couleurStatut]]"></span>[[statut]]</button>
<div style="display: [[nomAff]]; align-items: center; gap: 6px"><span style="font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 19px; color: #fff">[[nom]]</span>
<button aria-label="Modifier mon nom" onClick="[[editerNom]]" style="width: 26px; height: 26px; border-radius: 8px; border: 0; background: rgba(255,255,255,0.08); color: [[cDoux]]; display: flex; align-items: center; justify-content: center; cursor: pointer">{ic("crayon", 14)}</button></div>
<div style="display: [[nomEdition]]; gap: 6px; width: 100%"><input aria-label="Nom affiché" maxlength="32" value="Yunoow" style="flex: 1; min-width: 0; height: 32px; box-sizing: border-box; padding: 0 10px; border-radius: 9px; border: 1px solid [[cAccent]]; background: [[cNav]]; color: #fff; font-family: Nunito, sans-serif; font-size: 13.5px; font-weight: 700">
<button onClick="[[enregistrerNom]]" style="height: 32px; padding: 0 12px; border-radius: 9px; border: 0; background: [[cAccent]]; color: [[cSurAccent]]; font-family: Nunito, sans-serif; font-weight: 800; font-size: 12px; cursor: pointer">OK</button></div>
<button aria-label="Copier mon Origins ID" onClick="[[copierId]]" style="width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 8px 12px; border-radius: 12px; border: 1px dashed rgba(255,255,255,0.3); background: rgba(255,255,255,0.04); cursor: pointer; font-family: Nunito, sans-serif">
<span style="display: flex; flex-direction: column; align-items: flex-start"><span style="font-size: 9.5px; font-weight: 800; letter-spacing: 0.12em; color: [[cDoux]]">ORIGINS ID</span><span style="font-family: ui-monospace, monospace; font-size: 14px; font-weight: 700; letter-spacing: 0.08em; color: #fff">4F2K-9QXA</span></span>
<span style="font-size: 11px; font-weight: 800; color: [[cAccent]]">[[texteCopie]]</span></button>
<span style="font-size: 11.5px; color: [[cDoux]]">Connecté avec Microsoft</span>
<button onClick="[[lierDiscord]]" style="border: 0; background: transparent; padding: 0; color: [[cAccent]]; font-family: Nunito, sans-serif; font-size: 11.5px; font-weight: 800; cursor: pointer">[[discordTexte]]</button>
</div>
<div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 6px; display: flex; flex-direction: column">
{entree("externe", "Ouvrir sur le site", "")}{entree("amis", "Mes contacts", "[[voirContacts]]")}{entree("curseurs", "Paramètres", "[[ouvrirReglages]]")}{entree("sortie", "Déconnexion", "", "#ff9a8f")}
</div>
</section>"""


# ---------------------------------------------------------------- logique (état du canvas)
LOGIQUE = """  config() { return %s; }
  componentDidMount() { this.minuteur = setInterval(() => this.avancer(), 150); }
  componentWillUnmount() { clearInterval(this.minuteur); }
  avancer() {
    const s = this.state || {};
    const inst = s.inst || this.config().instDefaut;
    if (inst === 'telechargement' && !s.pause) {
      const p = Math.min(100, (s.p || 0) + 0.8);
      if (p >= 100) this.setState({ p: 100, inst: 'verification', tv: Date.now() });
      else this.setState({ p: p });
    } else if (inst === 'verification' && Date.now() - (s.tv || 0) > 1800) {
      this.setState({ inst: 'pret' });
    }
  }
  renderVals() {
    const s = this.state || {};
    const C = this.config();
    const id = s.theme || C.themes[0].id;
    const T = C.themes.find((t) => t.id === id) || C.themes[0];
    const onglet = s.onglet || 'contacts';
    const tiroir = s.tiroir !== undefined ? s.tiroir : C.tiroirDefaut;
    const pg = s.page || C.pageDefaut;
    const filtre = s.filtre || 'tout';
    const menu = s.menu !== undefined ? s.menu : C.menuDefaut;
    const cat = s.cat || 'general';
    const lance = !!s.lance;
    const seul = s.seul !== false;
    const toast = s.toast !== undefined ? s.toast : C.toastDefaut;
    const inst = s.inst || C.instDefaut;
    const p = s.p || 0;
    const pause = !!s.pause;
    const enCours = inst === 'telechargement' || inst === 'verification';
    const installe = inst === 'installe' || inst === 'pret';
    const go = (2.4 * p / 100).toFixed(1).replace('.', ',');
    const resteS = Math.round((2.4 - 2.4 * p / 100) * 1024 / 18);
    const reste = resteS >= 60 ? 'encore ' + Math.floor(resteS / 60) + ' min ' + (resteS %% 60) + ' s' : 'encore ' + resteS + ' s';
    const etape = p < 20 ? 'Minecraft 1.21.11' : p < 55 ? 'Mods de Tempest (' + Math.max(1, Math.round((p - 20) / 35 * 52)) + '/52)' : p < 85 ? 'Pack de textures de Tempest' : 'Shaders et réglages';
    const memoire = s.memoire || 4;
    const demande = s.demande || 'attente';
    const statuts = [['En ligne', '#4cd38a'], ['Absent', '#f1c04a'], ['Invisible', '#7d879c']];
    const st = statuts[(s.statut || 0) %% 3];
    const v = {};
    ['contacts', 'messages', 'demandes'].forEach((cle) => {
      const on = onglet === cle;
      v['sel_' + cle] = on ? 'true' : 'false';
      v['bord_' + cle] = on ? T.accent : 'transparent';
      v['fond_' + cle] = on ? 'rgba(255,255,255,0.06)' : 'transparent';
      v['aff_' + cle] = on ? 'flex' : 'none';
      v['voir_' + cle] = () => this.setState({ onglet: cle });
    });
    C.categories.forEach((i) => {
      const on = cat === i;
      v['cs_' + i] = on ? 'true' : 'false';
      v['cb_' + i] = on ? T.accent : 'transparent';
      v['cf_' + i] = on ? T.reglages : 'transparent';
      v['cc_' + i] = on ? '#ffffff' : T.doux;
      v['cw_' + i] = on ? '800' : '600';
      v['aff_cat_' + i] = on ? 'flex' : 'none';
      v['cv_' + i] = () => this.setState({ cat: i });
    });
    C.pages.forEach((p) => {
      const on = pg === p;
      v['pa_' + p] = on ? 'page' : 'false';
      v['pf_' + p] = on ? T.accent : 'transparent';
      v['pc_' + p] = on ? T.surAccent : T.doux;
      v['aff_page_' + p] = on ? (p === 'accueil' ? 'block' : 'flex') : 'none';
      v['aller_' + p] = () => this.setState({ page: p, menu: '' });
    });
    C.filtres.forEach((f) => {
      const on = filtre === f;
      v['fp_' + f] = on ? 'true' : 'false';
      v['fb_' + f] = on ? T.accent : 'rgba(255,255,255,0.25)';
      v['ff_' + f] = on ? T.accent : 'transparent';
      v['fc_' + f] = on ? T.surAccent : T.texte;
      v['filtrer_' + f] = () => this.setState({ filtre: f });
    });
    C.actus.forEach((cat, n) => { v['aff_actu_' + n] = (filtre === 'tout' || filtre === cat) ? 'flex' : 'none'; });
    const conseil = memoire < 4 ? ['Un peu juste avec les shaders.', T.doux]
      : memoire <= 10 ? ['Ton PC a 31 Go. Conseillé : 4 Go.', '#4cd38a']
      : ["C'est beaucoup : Minecraft en profite rarement, et le reste du PC en a besoin.", '#f1c04a'];
    const fraction = (memoire - 2) / 14;
    return Object.assign(v, {
      cVerre1: T.verre1, cVerre2: T.verre2, cAccent: T.accent, cSurAccent: T.surAccent, cJouer: T.jouer, cTitre: T.titre,
      cTeinte: T.teinte, cBarre: T.barre, cPanneau: T.panneau, cReglages: T.reglages, cNav: T.nav, cNavTitre: T.navTitre,
      cDoux: T.doux, cTexte: T.texte,
      themes: C.themes.map((t) => Object.assign({}, t, {
        presse: t.id === id ? 'true' : 'false',
        bord: t.id === id ? T.accent : 'rgba(255,255,255,0.1)',
        caseFond: t.id === id ? 'rgba(255,255,255,0.07)' : 'transparent',
        choisir: () => this.setState({ theme: t.id })
      })),
      memoires: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((m) => ({
        val: String(m),
        presse: m === memoire ? 'true' : 'false',
        choisir: () => this.setState({ memoire: m })
      })),
      memoireRemplissage: 'calc((100%% - 20px) * ' + fraction + ')',
      memoirePouce: 'calc((100%% - 20px) * ' + fraction + ')',
      memoireTexte: memoire + ' Go',
      memoireConseil: conseil[0],
      memoireConseilCouleur: conseil[1],
      affInstaller: inst === 'a_installer' ? 'flex' : 'none',
      affTelech: enCours ? 'flex' : 'none',
      affJouer: installe ? 'block' : 'none',
      installer: () => this.setState({ inst: 'telechargement', p: 0, pause: false }),
      annuler: () => this.setState({ inst: 'a_installer', p: 0, pause: false }),
      basculerPause: () => this.setState({ pause: !pause }),
      libellePause: pause ? 'Reprendre' : 'Mettre en pause',
      affIconePause: pause ? 'none' : 'flex',
      affIconeLecture: pause ? 'flex' : 'none',
      affBoutonsTelech: inst === 'telechargement' ? 'flex' : 'none',
      titreTelech: inst === 'verification' ? 'VÉRIFICATION DES FICHIERS' : pause ? 'EN PAUSE' : 'TÉLÉCHARGEMENT',
      titreBande: inst === 'verification' ? 'Vérification de Tempest' : pause ? 'Tempest · en pause' : 'Téléchargement de Tempest',
      pctTexte: Math.floor(p) + ' %%',
      pctLargeur: p + '%%',
      tailleTexte: go + ' Go / 2,4 Go',
      vitesseTexte: inst === 'verification' ? 'presque fini' : pause ? 'en pause' : (17 + Math.round(p) %% 3) + ' Mo/s · ' + reste,
      vitesseCourte: inst === 'verification' ? '' : pause ? 'pause' : (17 + Math.round(p) %% 3) + ' Mo/s',
      etapeTexte: inst === 'verification' ? 'On vérifie que rien ne manque…' : etape,
      affBande: enCours && pg !== 'accueil' ? 'flex' : 'none',
      railTempestAff: inst === 'a_installer' ? 'none' : 'flex',
      railAnneau: enCours ? 'conic-gradient(' + T.accent + ' ' + p + '%%, rgba(255,255,255,0.14) 0)' : 'transparent',
      etatJeu: installe ? 'INSTALLÉ' : inst === 'a_installer' ? 'À INSTALLER · 2,4 GO' : inst === 'verification' ? 'VÉRIFICATION…' : 'TÉLÉCHARGEMENT · ' + Math.floor(p) + ' %%',
      etatJeuCouleur: installe ? '#4cd38a' : enCours ? T.accent : T.doux,
      railTempest: pg === 'accueil' ? 'page' : 'false',
      railBord: pg === 'accueil' ? T.accent : 'transparent',
      tiroirAff: tiroir ? 'flex' : 'none',
      tiroirPresse: tiroir ? 'true' : 'false',
      fondMessagerie: tiroir ? T.accent : 'transparent',
      couleurMessagerie: tiroir ? T.surAccent : T.doux,
      mainDroite: tiroir ? '220px' : '0px',
      basculerTiroir: () => this.setState({ tiroir: !tiroir }),
      voirDemandes: () => this.setState({ tiroir: true, onglet: 'demandes', menu: '' }),
      voirContacts: () => this.setState({ tiroir: true, onglet: 'contacts', menu: '' }),
      menuReglagesOuvert: menu === 'reglages' ? 'true' : 'false',
      menuProfilOuvert: menu === 'profil' ? 'true' : 'false',
      affParametres: menu === 'reglages' ? 'block' : 'none',
      affParametresFlex: menu === 'reglages' ? 'flex' : 'none',
      affProfil: menu === 'profil' ? 'block' : 'none',
      affProfilFlex: menu === 'profil' ? 'flex' : 'none',
      fondReglages: menu === 'reglages' ? T.accent : 'transparent',
      couleurReglages: menu === 'reglages' ? T.surAccent : T.doux,
      fondProfil: menu === 'profil' ? T.accent : 'transparent',
      ouvrirReglages: () => this.setState({ menu: menu === 'reglages' ? '' : 'reglages' }),
      ouvrirJeu: () => this.setState({ menu: 'reglages', cat: 'jeu' }),
      ouvrirProfil: () => this.setState({ menu: menu === 'profil' ? '' : 'profil' }),
      fermerMenu: () => this.setState({ menu: '' }),
      revoirNouveautes: () => this.setState({ toast: true, menu: '' }),
      libelleJouer: lance ? 'ANNULER' : 'JOUER',
      progression: lance ? '62%%' : '0%%',
      affPreparation: lance ? 'flex' : 'none',
      lancer: () => this.setState({ lance: !lance }),
      seulPresse: seul ? 'true' : 'false',
      fondSwitch: seul ? T.accent : 'rgba(255,255,255,0.18)',
      boutonSwitch: seul ? T.surAccent : '#ffffff',
      posSwitch: seul ? '16px' : '2px',
      hors: seul ? 'none' : 'flex',
      compteContacts: demande === 'acceptee' ? '3/5' : '3/4',
      affNamiContact: demande === 'acceptee' && !seul ? 'flex' : 'none',
      basculerSeul: () => this.setState({ seul: !seul }),
      nbDemandes: String((demande === 'attente' ? 1 : 0) + (s.site ? 0 : 1)),
      pastilleDemandes: demande === 'attente' || !s.site ? 'flex' : 'none',
      affDemandeSite: s.site ? 'none' : 'flex',
      affSiteOk: s.site ? 'block' : 'none',
      texteSite: s.site === 'ok' ? 'Navigateur connecté au site avec ton profil.' : 'Connexion au site refusée.',
      accepterSite: () => this.setState({ site: 'ok' }),
      refuserSite: () => this.setState({ site: 'non' }),
      discordTexte: s.discord ? 'Discord lié : yunoow' : 'Discord : facultatif · Lier',
      lierDiscord: () => this.setState({ discord: !s.discord }),
      affDemande: demande === 'attente' ? 'flex' : 'none',
      affReponse: demande === 'attente' ? 'none' : 'block',
      texteReponse: demande === 'acceptee' ? 'Nami est maintenant dans tes contacts.' : 'Demande refusée. Aucune autre demande.',
      accepter: () => this.setState({ demande: 'acceptee' }),
      refuser: () => this.setState({ demande: 'refusee' }),
      statut: st[0],
      couleurStatut: st[1],
      changerStatut: () => this.setState({ statut: (s.statut || 0) + 1 }),
      nom: 'Yunoow',
      nomAff: s.editNom ? 'none' : 'flex',
      nomEdition: s.editNom ? 'flex' : 'none',
      editerNom: () => this.setState({ editNom: true }),
      enregistrerNom: () => this.setState({ editNom: false }),
      texteCopie: s.copie ? 'COPIÉ ✓' : 'COPIER',
      copierId: () => this.setState({ copie: true }),
      toastAff: toast ? 'block' : 'none',
      fermerToast: () => this.setState({ toast: false })
    });
  }"""


def accueil():
    return f"""<div style="width: 1280px; height: 760px; position: relative; overflow: hidden; background: [[cBarre]]; font-family: Nunito, system-ui, sans-serif; color: #fff">
{barre_haut()}
{rail()}
<main style="position: absolute; top: 46px; left: 56px; right: [[mainDroite]]; bottom: 0; overflow: hidden; background: [[cBarre]]">
<div style="position: absolute; inset: 0; display: [[aff_page_accueil]]">
<img src="{gen.FOND_TEMPEST}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; filter: saturate(1.15)">
<span aria-hidden="true" style="position: absolute; inset: 0; background: [[cTeinte]]"></span>
<span aria-hidden="true" style="position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,0.32), rgba(0,0,0,0) 60%)"></span>
{carte_jeu()}
{actus()}
{nouveautes()}
</div>
{page_jeux()}
{page_actus()}
{page_boutique()}
<button onClick="[[aller_accueil]]" aria-label="Téléchargement de Tempest : [[pctTexte]]" style="position: absolute; left: 50%; bottom: 16px; transform: translateX(-50%); width: 420px; display: [[affBande]]; align-items: center; gap: 12px; padding: 9px 14px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.14); background: [[cVerre2]]; box-shadow: 0 12px 30px rgba(0,0,0,0.5); color: #fff; cursor: pointer; font-family: Nunito, sans-serif; z-index: 3">
<img src="{gen.LOGO_TEMPEST}" alt="" style="width: 30px; height: 30px; object-fit: contain">
<span style="flex: 1; display: flex; flex-direction: column; gap: 5px; text-align: left"><span style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 800"><span>[[titreBande]]</span><span>[[pctTexte]]</span></span>
<span aria-hidden="true" style="position: relative; height: 5px; border-radius: 3px; background: rgba(255,255,255,0.16); overflow: hidden"><span class="av-rayures" style="position: absolute; left: 0; top: 0; bottom: 0; width: [[pctLargeur]]; background-color: [[cAccent]]"></span></span></span>
<span style="font-size: 11.5px; font-weight: 700; color: [[cDoux]]; flex: none">[[vitesseCourte]]</span>
</button>
</main>
{tiroir()}
{parametres()}
{profil()}
</div>"""



# ---------------------------------------------------------------- connexion (les 3 étapes qui existent déjà : langue, Microsoft, profil)
LANGUES = [("en", "English"), ("fr", "Français"), ("es", "Español"), ("de", "Deutsch"), ("pt", "Português (Brasil)")]


def logo_mot(taille, uid):
    """Le logo avec le mot : l'œil de dragon qui regarde le R, puis « RIGINS » (logo validé le 17/11)."""
    import logo7
    oeil = logo7.logo(("feu", {"regard": 14, "bas": 3, "penche": -8, "taille_pupille": 0.85}), taille, uid=uid, libelle="")
    return (f'<div role="img" aria-label="Origins" style="display: flex; align-items: center"><span style="width: {taille}px; height: {taille}px; flex: none">{oeil}</span>'
            f'<span aria-hidden="true" style="margin-left: -{taille * 0.11:.0f}px; font-family: \'Baloo 2\', sans-serif; font-weight: 800; font-size: {taille * 0.69:.0f}px; '
            f'line-height: 1; color: #fff; -webkit-text-stroke: {max(1.5, taille * 0.69 / 28):.1f}px #0a1024; paint-order: stroke fill">RIGINS</span></div>')


def connexion():
    bouton_blanc = lambda texte, clic, icone="": (
        f'<button class="av-jouer" onClick="{clic}" style="width: 100%; height: 50px; border: 0; border-radius: 14px; background: #ffffff; color: [[cJouer]]; '
        f'font-family: \'Baloo 2\', sans-serif; font-weight: 800; font-size: 17px; letter-spacing: 0.06em; cursor: pointer; display: flex; align-items: center; '
        f'justify-content: center; gap: 10px; box-shadow: 0 4px 0 rgba(0,0,0,0.18)">{ic(icone, 18) if icone else ""}{texte}</button>')
    titre = lambda t: f'<h1 style="margin: 0; font-family: \'Baloo 2\', sans-serif; font-weight: 800; font-size: 24px; letter-spacing: 0.03em; color: #fff; text-align: center">{t}</h1>'
    texte = lambda t: f'<p style="margin: 0; font-size: 13.5px; line-height: 1.45; color: [[cTexte]]; text-align: center">{t}</p>'
    etapes = "".join(
        f'<li style="display: flex; align-items: center; gap: 8px"><span aria-hidden="true" style="width: 24px; height: 24px; border-radius: 50%; background: [[sn_{k}]]; '
        f'color: [[sc_{k}]]; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800">[[st_{k}]]</span>'
        f'<span style="font-size: 12.5px; font-weight: 800; color: [[sl_{k}]]">{nom}</span></li>'
        + ('<li aria-hidden="true" style="width: 24px; height: 1px; background: rgba(255,255,255,0.25)"></li>' if k < 3 else "")
        for k, nom in [(1, "Langue"), (2, "Compte"), (3, "Profil")])
    return f"""<div style="width: 1280px; height: 760px; position: relative; overflow: hidden; background: [[cBarre]]; font-family: Nunito, system-ui, sans-serif; color: #fff">
<img src="{FOND_CONNEXION}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%">
<span aria-hidden="true" style="position: absolute; inset: 0; background: radial-gradient(60% 60% at 50% 50%, rgba(0,0,0,0) 0%, [[cTeinte]] 100%)"></span>
<header style="position: absolute; top: 0; left: 0; right: 0; height: 46px; display: flex; align-items: center; justify-content: space-between; padding: 0 0 0 18px">
<span></span>
<span style="display: flex; align-self: flex-start">
<button aria-label="Réduire" style="width: 30px; height: 24px; border: 0; background: transparent; color: #fff; display: flex; align-items: center; justify-content: center">{ic("moins", 13)}</button>
<button aria-label="Fermer" style="width: 30px; height: 24px; border: 0; background: transparent; color: #fff; display: flex; align-items: center; justify-content: center">{ic("croix", 13)}</button></span>
</header>
<div style="position: absolute; inset: 46px 0 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; padding-bottom: 30px">
{logo_mot(96, "connexion")}
<section aria-label="Connexion à Origins" style="width: 460px; box-sizing: border-box; padding: 26px 36px 30px; border-radius: 22px; background: linear-gradient(160deg, [[cVerre1]], [[cVerre2]]); border: 1px solid rgba(255,255,255,0.18); box-shadow: 0 24px 60px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 18px">
<ol aria-label="Étapes" style="list-style: none; margin: 0; padding: 0; display: [[affEtapes]]; align-items: center; justify-content: center; gap: 10px">{etapes}</ol>
<div style="display: [[aff_e1]]; flex-direction: column; gap: 14px">
{titre("CHOISIS TA LANGUE")}{texte("Tu pourras la changer à tout moment dans les Paramètres.")}
<div role="radiogroup" aria-label="Langue" style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px">
<sc-for list="[[langues]]" as="l" hint-placeholder-count="5">
<button role="radio" aria-checked="[[l.presse]]" onClick="[[l.choisir]]" style="height: 44px; padding: 0 14px; border-radius: 12px; border: 1.5px solid [[l.bord]]; background: [[l.fond]]; color: #fff; font-family: Nunito, sans-serif; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 8px"><strong style="font-weight: 800; font-size: 14px">[[l.nom]]</strong><small style="font-size: 10.5px; font-weight: 800; letter-spacing: 0.08em; color: [[cDoux]]">[[l.code]]</small></button>
</sc-for></div>
{bouton_blanc("CONTINUER", "[[suivant]]")}
</div>
<div style="display: [[aff_e2]]; flex-direction: column; gap: 14px; align-items: center">
{titre("BIENVENUE DANS ORIGINS")}{texte("Connecte-toi avec Microsoft pour continuer et relier ton profil Origins à ce launcher.")}
{bouton_blanc("CONTINUER AVEC MICROSOFT", "[[suivant]]", "cadenas")}
<span style="font-size: 11px; font-weight: 800; letter-spacing: 0.1em; color: [[cDoux]]">CONNEXION MICROSOFT SÉCURISÉE</span>
<button onClick="[[retour]]" style="border: 0; background: transparent; color: [[cAccent]]; font-family: Nunito, sans-serif; font-weight: 800; font-size: 12.5px; cursor: pointer">Changer de langue</button>
</div>
<div style="display: [[aff_e3]]; flex-direction: column; gap: 14px; align-items: center">
{titre("CRÉE TON PROFIL")}{texte("Microsoft est connecté. Choisis le nom qui sera affiché sur Origins. Tu pourras le changer plus tard et ajouter ton avatar depuis ton profil.")}
<label style="width: 100%; display: flex; flex-direction: column; gap: 6px"><span style="font-size: 11px; font-weight: 800; letter-spacing: 0.1em; color: [[cDoux]]">NOM AFFICHÉ</span>
<input minlength="3" maxlength="32" value="Yunoow" placeholder="Ton nom Origins" style="height: 44px; box-sizing: border-box; padding: 0 14px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.35); background: rgba(0,0,0,0.25); color: #fff; font-family: Nunito, sans-serif; font-size: 15px; font-weight: 700"></label>
{bouton_blanc("CRÉER MON PROFIL", "[[suivant]]")}
<span style="font-size: 12px; color: [[cDoux]]">Ton Origins ID sera créé tout seul.</span>
</div>
<div style="display: [[aff_e4]]; flex-direction: column; gap: 14px; align-items: center">
<span style="padding: 4px; border-radius: 50%; background: linear-gradient(150deg, [[cAccent]], [[cVerre2]])">{avatar("moi", 84, False)}</span>
{titre("BIENVENUE, YUNOOW !")}{texte("Ton Origins ID : <b style='font-family: ui-monospace, monospace; letter-spacing: 0.08em'>4F2K-9QXA</b>. Donne-le à tes amis pour qu'ils t'ajoutent.")}
<a href="Aventure-Accueil.dc.html" class="av-jouer" style="width: 100%; height: 50px; border-radius: 14px; background: #ffffff; color: [[cJouer]]; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 17px; letter-spacing: 0.06em; display: flex; align-items: center; justify-content: center; text-decoration: none; box-shadow: 0 4px 0 rgba(0,0,0,0.18)">ALLER À L'ACCUEIL</a>
</div>
<p role="status" style="margin: -6px 0 0; min-height: 16px; font-size: 12px; text-align: center; color: [[cDoux]]"></p>
</section>
</div>
</div>"""


LOGIQUE_CONNEXION = """  renderVals() {
    const s = this.state || {};
    const C = %s;
    const T = C.theme;
    const etape = s.etape || 1;
    const langue = s.langue || 'fr';
    const v = {
      cVerre1: T.verre1, cVerre2: T.verre2, cAccent: T.accent, cJouer: T.jouer, cTeinte: T.teinte, cBarre: T.barre, cDoux: T.doux, cTexte: T.texte,
      affEtapes: etape < 4 ? 'flex' : 'none',
      langues: C.langues.map((l) => ({
        nom: l[1],
        code: l[0].toUpperCase(),
        presse: l[0] === langue ? 'true' : 'false',
        bord: l[0] === langue ? T.accent : 'rgba(255,255,255,0.25)',
        fond: l[0] === langue ? 'rgba(255,255,255,0.12)' : 'transparent',
        choisir: () => this.setState({ langue: l[0] })
      })),
      suivant: () => this.setState({ etape: etape + 1 }),
      retour: () => this.setState({ etape: 1 })
    };
    [1, 2, 3, 4].forEach((k) => { v['aff_e' + k] = etape === k ? 'flex' : 'none'; });
    [1, 2, 3].forEach((k) => {
      const fait = etape > k, ici = etape === k;
      v['sn_' + k] = fait || ici ? T.accent : 'rgba(255,255,255,0.15)';
      v['sc_' + k] = fait || ici ? T.surAccent : '#ffffff';
      v['st_' + k] = fait ? '✓' : String(k);
      v['sl_' + k] = ici ? '#ffffff' : T.doux;
    });
    return v;
  }"""


def page(titre, corps, logique):
    props = json.dumps({"$preview": {"width": 1280, "height": 760}}).replace("'", "&#39;")
    corps = corps.replace("[[", "{{").replace("]]", "}}")
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
body{{margin:0;background:{THEMES[0]['barre']}}}
.av-onglet:hover{{filter:brightness(1.25)}}
.av-rond:hover{{background:rgba(255,255,255,0.28) !important}}
.av-jouer:hover{{transform:translateY(-1px);box-shadow:0 7px 0 rgba(0,0,0,0.18) !important}}
.av-actu{{transition:transform .15s}}.av-actu:hover{{transform:translateY(-3px)}}
.av-entree:hover{{background:rgba(255,255,255,0.08) !important}}
.av-affiche{{transition:filter .15s}}.av-affiche:hover{{filter:brightness(1.12)}}
.av-produit{{transition:transform .15s}}.av-produit:hover{{transform:translateY(-3px)}}
*{{scrollbar-width:none;scroll-behavior:smooth}}*::-webkit-scrollbar{{display:none}}
.av-rayures{{background-image:linear-gradient(135deg,rgba(255,255,255,.28) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.28) 50%,rgba(255,255,255,.28) 75%,transparent 75%,transparent);background-size:16px 16px;animation:av-defile 0.8s linear infinite;transition:width .2s linear}}
@keyframes av-defile{{from{{background-position:0 0}}to{{background-position:16px 0}}}}
</style>
</helmet>
{corps}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{props}'>
class Component extends DCLogic {{
{logique}
}}
</script>
</body>
</html>
"""


def ecrire():
    planches = [("Aventure-Accueil.dc.html", "Accueil, piste Aventure", "", "accueil", True, 0, 4160, "Piste Aventure · Accueil"),
                ("Aventure-Parametres.dc.html", "Paramètres, piste Aventure", "reglages", "accueil", True, 1360, 4160, "Piste Aventure · Paramètres"),
                ("Aventure-Profil.dc.html", "Profil Origins, piste Aventure", "profil", "accueil", True, 2720, 4160, "Piste Aventure · Profil Origins"),
                ("Aventure-Jeux.dc.html", "Jeux, piste Aventure", "", "jeux", False, 1360, 5040, "Piste Aventure · Jeux"),
                ("Aventure-Actus.dc.html", "Actus, piste Aventure", "", "actus", False, 2720, 5040, "Piste Aventure · Actus"),
                ("Aventure-Boutique.dc.html", "Boutique, piste Aventure", "", "boutique", False, 4080, 5040, "Piste Aventure · Boutique"),
                ("Aventure-Telechargement.dc.html", "Installation de Tempest, piste Aventure", "", "accueil", True, 5440, 5040, "Piste Aventure · Installation (cliquer INSTALLER)")]
    chemin = os.path.join(P, "canvas.json")
    c = json.load(open(chemin, encoding="utf-8"))
    for fichier, titre, menu, page_defaut, tiroir, x, y, nom in planches:
        telech = fichier == "Aventure-Telechargement.dc.html"
        config = {"themes": THEMES, "menuDefaut": menu, "pageDefaut": page_defaut, "tiroirDefaut": tiroir, "pages": PAGES,
                  "instDefaut": "a_installer" if telech else "installe", "toastDefaut": not telech,
                  "filtres": [i for i, _ in FILTRES], "actus": [a[0] for a in ACTUS_PAGE], "categories": [i for i, _, _ in CATEGORIES]}
        logique = LOGIQUE % json.dumps(config, ensure_ascii=False)
        open(os.path.join(P, fichier), "w", encoding="utf-8").write(page(titre, accueil(), logique))
        c["boards"][fichier] = {"x": x, "y": y, "w": 1280, "h": 760, "title": nom, "is_interactive": True}
        if fichier not in c["order"]:
            c["order"].append(fichier)
    config = {"theme": THEMES[0], "langues": LANGUES}
    open(os.path.join(P, "Aventure-Connexion.dc.html"), "w", encoding="utf-8").write(
        page("Connexion, piste Aventure", connexion(), LOGIQUE_CONNEXION % json.dumps(config, ensure_ascii=False)))
    c["boards"]["Aventure-Connexion.dc.html"] = {"x": 0, "y": 5040, "w": 1280, "h": 760, "title": "Piste Aventure · Connexion", "is_interactive": True}
    if "Aventure-Connexion.dc.html" not in c["order"]:
        c["order"].append("Aventure-Connexion.dc.html")
    c["notes"]["aventure"] = {"x": 0, "y": 3900, "text": "Piste « Aventure » : l'organisation du launcher d'Ankama, sur nos systèmes (thème Argent et nuit)",
                              "kind": "title1", "maxW": 4000}
    json.dump(c, open(chemin, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    ecrire()
