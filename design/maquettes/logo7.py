"""Logo Origins : le O est un œil de dragon, en cartoon (Yunoow, 17/11 : « un œil de dragon … en mode cartoon »)."""
from logo4 import ELLIPSE, etincelle

COULEURS = {
    # nom : (clair, base, ombre, contour, pupille, lueur)
    "feu": ("#ffe066", "#ff9b1f", "#e0441b", "#1e0a05", "#1e0a05", "#ff7a2a"),
    "aurore": ("#c9f2ff", "#7aa8ff", "#5a3cd6", "#0c0f2e", "#0c0f2e", "#8a9dff"),
    "jade": ("#d7ff8a", "#46d36b", "#1b8a52", "#062014", "#062014", "#5be08a"),
}
ROT = 'transform="rotate(-14 50 50)"'


def oeil(sorte, uid, crete=False, regard=0, bas=0, penche=0, taille_pupille=1.0, etincelles=True):
    """regard : décalage de la pupille vers la droite (l'œil regarde le mot RIGINS)."""
    clair, base, ombre, trait, pup, lueur = COULEURS[sorte]
    px, py = 48 + regard, 49 + bas
    ext, inn = ELLIPSE(50, 52, 36, 40), ELLIPSE(px, py, 14 * taille_pupille, 19 * taille_pupille)
    anneau = ext + " " + inn
    s = (f'<defs><clipPath id="c{uid}"><path d="{anneau}" clip-rule="evenodd"/></clipPath>'
         f'<filter id="f{uid}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter></defs>')
    s += f'<g {ROT} filter="url(#f{uid})" opacity="0.6"><path d="{ext}" fill="{lueur}"/></g>'
    if crete:
        # Une crête d'écailles au-dessus de l'œil, comme un sourcil de dragon.
        s += (f'<path d="M4 44 L8 4 L26 22 L34 -12 L50 14 L66 -12 L72 16 L94 0 L86 36 Q50 12 4 44 Z" fill="{ombre}" '
              f'stroke="{trait}" stroke-width="5" stroke-linejoin="round"/>')
    s += f'<g {ROT}>'
    s += f'<path d="{ext}" fill="{trait}" stroke="{trait}" stroke-width="10" stroke-linejoin="round"/>'
    # Iris en aplats : base, ombre franche en haut, lumière en bas à droite (dessin animé).
    s += f'<path d="{anneau}" fill="{base}" fill-rule="evenodd"/>'
    s += (f'<g clip-path="url(#c{uid})"><path d="M10 50 C14 18 40 6 64 10 C84 14 92 30 92 40 C80 26 60 20 44 24 C30 28 20 38 10 50 Z" fill="{ombre}"/>'
          f'<path d="M30 92 C50 96 78 86 86 60 C88 78 74 98 50 98 Z" fill="{clair}"/>'
          f'<path d="M58 80 C68 76 76 68 80 58" fill="none" stroke="{clair}" stroke-width="6" stroke-linecap="round"/></g>')
    # Pupille : le creux du O, avec une grosse fente.
    s += f'<path d="{inn}" fill="{pup}"/>'
    s += f'<g transform="rotate({penche} {px} {py})">'
    lf, lc = 17 * taille_pupille, 12 * taille_pupille
    s += f'<path d="M{px} {py-lf} Q{px+5} {py} {px} {py+lf} Q{px-5} {py} {px} {py-lf} Z" fill="{base}" opacity="0.45"/>'
    s += f'<path d="M{px} {py-lc} Q{px+2.5} {py} {px} {py+lc} Q{px-2.5} {py} {px} {py-lc} Z" fill="{pup}"/></g>'
    s += f'<path d="{ext}" fill="none" stroke="{trait}" stroke-width="5"/><path d="{inn}" fill="none" stroke="{trait}" stroke-width="3"/>'
    # Reflets cartoon : une grosse tache blanche, une petite.
    s += (f'<ellipse cx="38" cy="32" rx="8" ry="5.5" fill="#ffffff" transform="rotate(-35 38 32)"/>'
          f'<circle cx="28" cy="44" r="3" fill="#ffffff"/><circle cx="{px+8}" cy="{py+13}" r="3.2" fill="#ffffff" opacity="0.9"/></g>')
    if etincelles:
        s += etincelle(86, 16, 9) + etincelle(14, 86, 5)
    return s


def logo(variante, taille, uid, libelle="Origins"):
    sorte, opts = variante
    attr = f'role="img" aria-label="{libelle}"' if libelle else 'aria-hidden="true"'
    return f'<svg {attr} width="{taille}" height="{taille}" viewBox="-8 -10 116 118" overflow="visible">{oeil(sorte, uid, **opts)}</svg>'


def icone(variante, taille, uid, libelle=""):
    sorte, opts = variante
    attr = f'role="img" aria-label="{libelle}"' if libelle else 'aria-hidden="true"'
    lueur = COULEURS[sorte][5]
    return (f'<svg {attr} width="{taille}" height="{taille}" viewBox="0 0 100 100"><defs>'
            f'<radialGradient id="t{uid}" cx="0.35" cy="0.25" r="0.9"><stop offset="0" stop-color="#26305c"/><stop offset="0.55" stop-color="#121735"/>'
            f'<stop offset="1" stop-color="#070914"/></radialGradient><filter id="h{uid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter></defs>'
            f'<rect x="1" y="1" width="98" height="98" rx="22" fill="url(#t{uid})"/>'
            f'<rect x="1.5" y="1.5" width="97" height="97" rx="21.5" fill="none" stroke="{lueur}" stroke-opacity="0.45" stroke-width="1.5"/>'
            f'<circle cx="50" cy="51" r="40" fill="{lueur}" opacity="0.28" filter="url(#h{uid})"/>'
            f'<g transform="translate(8.5 7) scale(0.84)">{oeil(sorte, uid, etincelles=False, **opts)}</g></svg>')


CHOIX = [(("feu", {}), "Œil de dragon", "Iris de feu en aplats, grosse pupille fendue, reflets blancs."),
         (("feu", {"crete": True}), "Œil de dragon à crête", "Le même, avec une crête d'écailles au-dessus, comme un sourcil."),
         (("aurore", {}), "Dragon d'aurore", "Le dragon dans les couleurs de l'aurore : bleu et violet."),
         (("jade", {"crete": True}), "Dragon de jade", "Une autre couleur pour comparer : vert jade, avec la crête.")]
