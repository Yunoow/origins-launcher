"""Les thèmes du launcher : palettes et repeinte des maquettes (couleurs d'or et d'ébène remplacées par rôle)."""
import re

# Rôle de chaque couleur d'origine → clé de palette.
ROLES = {
    "#c9a14a": "metal", "#ecd08a": "metal_clair", "#fff1c4": "metal_survol",
    "#f7e6a8": "grad1", "#d4a84c": "grad2", "#8c6222": "grad3", "#fff4cf": "etoile1", "#e2b65a": "etoile2",
    "#fff0bd": "bouton_bord", "#f6dc8e": "bouton1", "#d6a94b": "bouton2", "#b0812f": "bouton3", "#1a1208": "sur_bouton",
    "#0f0b08": "fond", "#19120d": "bois", "#221913": "bois2", "#2a1d12": "profond", "#100b07": "fond2",
    "#241a12": "lueur_fond", "#120c08": "fond2", "#2c2116": "bord_barre", "#5c4524": "ligne",
    "#f0e6cf": "texte", "#d9cdb2": "texte2", "#b9a888": "gris", "#8e7f63": "pale",
}
RGBA = {"rgba(201,161,74": "metal", "rgba(214,169,75": "metal", "rgba(15,11,8": "fond", "rgba(34,25,19": "bois2", "rgba(20,14,10": "bois"}

PALETTES = [
    ("argent-nuit", "Argent et nuit", "Argent froid sur bleu nuit : le thème par défaut.", {
        "metal": "#a9b8d4", "metal_clair": "#dbe4f4", "metal_survol": "#f2f6ff", "grad1": "#f4f7ff", "grad2": "#a8b8d6",
        "grad3": "#56668a", "etoile1": "#ffffff", "etoile2": "#bccbe6", "bouton_bord": "#f4f7ff", "bouton1": "#e8eefb",
        "bouton2": "#bccae4", "bouton3": "#8797b8", "sur_bouton": "#0c111c", "fond": "#090c13", "bois": "#10151f",
        "bois2": "#171e2c", "profond": "#1b2333", "fond2": "#0a0e17", "lueur_fond": "#1a2132", "bord_barre": "#1f2738",
        "ligne": "#36435e", "texte": "#e9eef7", "texte2": "#c9d1df", "gris": "#a7b1c3", "pale": "#7d879c"}),
    ("or-ebene", "Or et ébène", "Or chaud sur bois sombre.", {}),
    ("emeraude-or", "Émeraude et or", "Or sur vert profond, les couleurs du logo de Tempest.", {
        "metal": "#cfa94e", "metal_clair": "#ecd38e", "fond": "#08100c", "bois": "#0e1a14", "bois2": "#15251c",
        "profond": "#14271c", "fond2": "#07100b", "lueur_fond": "#13241a", "bord_barre": "#17291f", "ligne": "#3c5d43",
        "texte": "#eef0de", "texte2": "#d3d8c0", "gris": "#acb9a2", "pale": "#7f8c76"}),
    ("pourpre-or", "Pourpre et or", "Or sur pourpre royal, plus mystique.", {
        "metal": "#d0a852", "metal_clair": "#efd391", "fond": "#0e0911", "bois": "#170f1c", "bois2": "#211626",
        "profond": "#2a1a31", "fond2": "#0d0810", "lueur_fond": "#25172b", "bord_barre": "#2a1c30", "ligne": "#5b3d64",
        "texte": "#f2e7f0", "texte2": "#d8c9d6", "gris": "#bba9bb", "pale": "#8b7a8c"}),
    ("cuivre-braise", "Cuivre et braise", "Cuivre et braises sur charbon, plus chaud et plus brut.", {
        "metal": "#d08650", "metal_clair": "#f3bd8e", "metal_survol": "#ffe0c4", "grad1": "#ffdcbc", "grad2": "#d88b50",
        "grad3": "#84401c", "etoile1": "#fff1e2", "etoile2": "#eea56c", "bouton_bord": "#ffe0c4", "bouton1": "#ffcfa6",
        "bouton2": "#e6965a", "bouton3": "#b8642f", "sur_bouton": "#1e0d05", "fond": "#0e0b0a", "bois": "#171211",
        "bois2": "#211918", "profond": "#2a1d17", "fond2": "#0d0a09", "lueur_fond": "#261b16", "bord_barre": "#2a1f1b",
        "ligne": "#5d3c2c", "texte": "#f4e8df", "texte2": "#dccbbf", "gris": "#bea898", "pale": "#8f7b6e"}),
    ("sang-onyx", "Sang et onyx", "Rouge sang sur onyx, pour les plus sombres.", {
        "metal": "#d0574d", "metal_clair": "#f0a199", "metal_survol": "#ffd3ce", "grad1": "#ffd0c9", "grad2": "#d0574d",
        "grad3": "#7a1f1a", "etoile1": "#fff0ee", "etoile2": "#ea8a80", "bouton_bord": "#ffd3ce", "bouton1": "#f7b2aa",
        "bouton2": "#db6a5f", "bouton3": "#a8392f", "sur_bouton": "#1c0605", "fond": "#0c0909", "bois": "#151010",
        "bois2": "#1e1615", "profond": "#2a1716", "fond2": "#0b0808", "lueur_fond": "#241413", "bord_barre": "#251a19",
        "ligne": "#5c2f2b", "texte": "#f3e8e6", "texte2": "#dccac7", "gris": "#bda7a3", "pale": "#8e7b78"}),
    ("sakura", "Sakura", "Rose des pétales du logo de Tempest, sur prune sombre.", {
        "metal": "#e79ab9", "metal_clair": "#f7c9db", "metal_survol": "#ffe6f0", "grad1": "#ffe3ee", "grad2": "#e79ab9",
        "grad3": "#8f4466", "etoile1": "#fff5f9", "etoile2": "#f2b6cd", "bouton_bord": "#ffe6f0", "bouton1": "#fbd2e2",
        "bouton2": "#eea3c1", "bouton3": "#c56f93", "sur_bouton": "#20080f", "fond": "#110b0e", "bois": "#1a1116",
        "bois2": "#24171e", "profond": "#2c1a24", "fond2": "#0f0a0d", "lueur_fond": "#27171f", "bord_barre": "#2a1c23",
        "ligne": "#613b4f", "texte": "#f6eaf0", "texte2": "#e0cbd5", "gris": "#c3a9b6", "pale": "#927b86"}),
    ("tempete", "Tempête", "Bleu de slime et cyan, l'esprit de Tempest.", {
        "metal": "#6cc8e0", "metal_clair": "#b5e8f5", "metal_survol": "#e2f8ff", "grad1": "#e8fbff", "grad2": "#6cc8e0",
        "grad3": "#22647a", "etoile1": "#ffffff", "etoile2": "#9fdcef", "bouton_bord": "#e2f8ff", "bouton1": "#c9f1fb",
        "bouton2": "#7fd2e8", "bouton3": "#3f9fbd", "sur_bouton": "#04131a", "fond": "#061117", "bois": "#0a1a22",
        "bois2": "#10242e", "profond": "#102a35", "fond2": "#05101a", "lueur_fond": "#0f2630", "bord_barre": "#11262f",
        "ligne": "#2a5868", "texte": "#e6f6fa", "texte2": "#c4dee6", "gris": "#9cbcc6", "pale": "#72919b"}),
]


def rgb(h):
    h = h.lstrip("#")
    return f"rgba({int(h[0:2], 16)},{int(h[2:4], 16)},{int(h[4:6], 16)}"


def repeindre(html, palette):
    if not palette:
        return html
    def hexa(m):
        role = ROLES.get(m.group(0).lower())
        return palette.get(role, m.group(0)) if role else m.group(0)
    html = re.sub(r"#[0-9a-fA-F]{6}\b", hexa, html)
    for ancien, role in RGBA.items():
        if role in palette:
            html = html.replace(ancien, rgb(palette[role]))
    return html




GRIS_OR = {"metal": "#c9a14a", "fond": "#0f0b08", "bois2": "#221913", "texte": "#f0e6cf", "ligne": "#5c4524"}


def couleur(palette, role):
    return palette.get(role, GRIS_OR.get(role))


def rgb_texte(h):
    h = h.lstrip("#")
    return f"rgb({int(h[0:2], 16)},{int(h[2:4], 16)},{int(h[4:6], 16)})"
