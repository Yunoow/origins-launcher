"""Logo Origins, quatrième tour : un O stylisé, fantasy brillante (Yunoow, 17/11 : « une lettre O stylisée »,
« fantasy brillante »), à la manière du K d'Ankama : lettre épaisse, dégradé vif, contour sombre, reflets, lueur."""

ELLIPSE = lambda cx, cy, rx, ry: f"M{cx-rx} {cy} A{rx} {ry} 0 1 0 {cx+rx} {cy} A{rx} {ry} 0 1 0 {cx-rx} {cy} Z"


def etincelle(x, y, r, c="#ffffff"):
    k = r * 0.22
    return (f'<path d="M{x} {y-r} Q{x+k} {y-k} {x+r} {y} Q{x+k} {y+k} {x} {y+r} Q{x-k} {y+k} {x-r} {y} Q{x-k} {y-k} {x} {y-r} Z" fill="{c}"/>')


STYLES = {
    # nom : (dégradé haut, milieu, bas, contour, lueur, extras)
    "cristal": ("#e8fbff", "#4fc3ff", "#1d4fd6", "#08163a", "#43b8ff"),
    "or": ("#fff6c8", "#ffc93c", "#d4720f", "#3a1a04", "#ffb02e"),
    "flamme": ("#fff2b0", "#ff9a2e", "#d8261b", "#3b0905", "#ff6a2a"),
    "arcane": ("#ffe0ff", "#c66bff", "#5a2ad6", "#1c0838", "#b25cff"),
    "gelee": ("#e6fffb", "#5ee6d0", "#1a8fa8", "#062a33", "#3fe0d0"),
    "aurore": ("#ffffff", "#9fd8ff", "#7a5cff", "#0d1240", "#7fb6ff"),
}


def o_lettre(sorte, uid, contour=True, glow=True, flamme=None, voiles=False):
    """flamme : None, "grande" ou "petite" ; voiles : bandes de couleur d'aurore dans l'anneau."""
    h, m, b, trait, lueur = STYLES[sorte]
    if sorte == "flamme" and flamme is None:
        flamme = "grande"
    forme = ELLIPSE(50, 52, 36, 40) + " " + ELLIPSE(47, 47, 17, 23)
    defs = (f'<defs><linearGradient id="g{uid}" x1="0.2" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="{h}"/>'
            f'<stop offset="0.45" stop-color="{m}"/><stop offset="1" stop-color="{b}"/></linearGradient>'
            f'<filter id="f{uid}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter></defs>')
    rot = 'transform="rotate(-14 50 50)"'
    s = defs
    if glow:
        s += f'<g {rot} filter="url(#f{uid})" opacity="0.75"><path d="{forme}" fill="{lueur}" fill-rule="evenodd"/></g>'
    extra_derriere, extra_devant = "", ""
    if flamme == "petite":
        extra_derriere = (f'<path d="M58 14 Q60 0 72 -6 Q68 6 76 10 Q82 2 90 2 Q84 12 84 26 Z" '
                          f'fill="url(#g{uid})" stroke="{trait}" stroke-width="4" stroke-linejoin="round"/>')
    if flamme == "grande":
        extra_derriere = (f'<path d="M20 40 Q10 18 26 4 Q24 18 34 20 Q32 -2 50 -8 Q44 10 56 16 Q62 0 78 -2 Q70 14 74 30 Z" '
                          f'fill="url(#g{uid})" stroke="{trait}" stroke-width="4" stroke-linejoin="round"/>')
    if sorte == "arcane":
        extra_derriere = (f'<path d="M80 74 C96 90 92 104 74 100 C62 97 64 86 74 88" fill="none" stroke="{trait}" stroke-width="9" stroke-linecap="round"/>'
                          f'<path d="M80 74 C96 90 92 104 74 100 C62 97 64 86 74 88" fill="none" stroke="url(#g{uid})" stroke-width="5" stroke-linecap="round"/>')
    if sorte == "gelee":
        extra_devant = (f'<path d="M58 86 Q62 98 66 92 Q70 86 68 80" fill="url(#g{uid})" stroke="{trait}" stroke-width="3.5"/>'
                        f'<ellipse cx="34" cy="38" rx="6" ry="4" fill="#ffffff" opacity="0.85" transform="rotate(-30 34 38)"/>')
    s += extra_derriere
    s += f'<g {rot}>'
    if contour:
        s += f'<path d="{forme}" fill="none" stroke="{trait}" stroke-width="8" stroke-linejoin="round"/>'
    s += f'<path d="{forme}" fill="url(#g{uid})" fill-rule="evenodd"/>'
    if voiles:
        s += (f'<path d="M24 66 A28 30 0 0 0 64 82" fill="none" stroke="#7ff5d8" stroke-width="5" stroke-linecap="round" opacity="0.55"/>'
              f'<path d="M78 40 A30 34 0 0 0 66 22" fill="none" stroke="#ff9ad5" stroke-width="4" stroke-linecap="round" opacity="0.5"/>')
    # Reflets : un trait clair en haut à gauche du O, un filet clair dans le creux.
    s += (f'<path d="M20 44 A31 35 0 0 1 44 15" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.85"/>'
          f'<path d="M62 62 A16 22 0 0 1 50 69" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.5"/></g>')
    s += extra_devant
    s += etincelle(82, 18, 9) + etincelle(16, 84, 5)
    if sorte == "or":
        s += f'<path d="M44 74 L50 81 L44 88 L38 81 Z" fill="#ff3b5c" stroke="{trait}" stroke-width="2.5"/><path d="M42 78 L44 76" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>'
    if sorte == "cristal":
        s += etincelle(72, 82, 4)
    return s


def logo(sorte, taille, uid, libelle="Origins", **opts):
    attr = f'role="img" aria-label="{libelle}"' if libelle else 'aria-hidden="true"'
    return f'<svg {attr} width="{taille}" height="{taille}" viewBox="-8 -8 116 116" overflow="visible">{o_lettre(sorte, uid, **opts)}</svg>'


def icone(sorte, taille, uid, libelle="", **opts):
    attr = f'role="img" aria-label="{libelle}"' if libelle else 'aria-hidden="true"'
    lueur = STYLES[sorte][4]
    return (f'<svg {attr} width="{taille}" height="{taille}" viewBox="0 0 100 100"><defs>'
            f'<radialGradient id="t{uid}" cx="0.35" cy="0.25" r="0.9"><stop offset="0" stop-color="#26305c"/><stop offset="0.55" stop-color="#121735"/>'
            f'<stop offset="1" stop-color="#070914"/></radialGradient></defs>'
            f'<rect x="1" y="1" width="98" height="98" rx="22" fill="url(#t{uid})"/>'
            f'<rect x="1.5" y="1.5" width="97" height="97" rx="21.5" fill="none" stroke="{lueur}" stroke-opacity="0.45" stroke-width="1.5"/>'
            f'<g transform="translate(14 15) scale(0.62)">{o_lettre(sorte, uid, **opts)}</g></svg>')


SORTES = [("cristal", "O de cristal", "Bleu glacier, facettes et étincelles : le plus proche du K d'Ankama."),
          ("aurore", "O d'aurore", "Blanc, bleu et violet, comme un ciel magique."),
          ("arcane", "O arcane", "Violet magique, avec une boucle de sort qui s'échappe."),
          ("or", "O d'or", "Or vif et gemme rouge : trésor et aventure."),
          ("flamme", "O de flamme", "Le O qui prend feu : énergie et combat."),
          ("gelee", "O de gelée", "Turquoise brillant, une goutte qui coule : plus mignon.")]


# Cinquième tour : l'aurore et la flamme (Yunoow, 17/11 : « l'aurore est pas mal … et la flamme »).
STYLES["flamme-aurore"] = ("#ffffff", "#8fd0ff", "#6a3cff", "#0d1240", "#8a7dff")
CHOIX = [("aurore", {"voiles": True}, "O d'aurore", "Blanc, bleu et violet, des voiles d'aurore dans l'anneau."),
         ("flamme", {}, "O de flamme", "Le O qui prend feu : énergie et combat."),
         ("flamme-aurore", {"flamme": "grande", "voiles": True}, "Flamme d'aurore", "Le mélange : les couleurs de l'aurore, qui brûlent en flammes magiques."),
         ("aurore", {"flamme": "petite", "voiles": True}, "Aurore ardente", "Le O d'aurore, avec une petite flamme qui s'allume en haut.")]
