#!/usr/bin/env python3
"""Site de téléchargement du launcher Origins : planche de la DA (Yunoow, 17/11/2026 : « un site qui peut faire en
sorte qu'on DL directement le launcher, sous Windows, sous Mac ou sous Linux »).

Même DA que le launcher (Or et ébène, logo œil de dragon, fond peint de la connexion). Une page : le gros bouton pour
le système détecté, les trois systèmes (Mac : puce Apple ou Intel ; Linux : AppImage ou .deb, les deux fichiers que
fait electron-builder), l'installation en 3 étapes, les questions. Écrit project/Site-Telechargement.dc.html.
"""
import json
import os

import aventure as av
import site_origins as so

ICI = os.path.dirname(os.path.abspath(__file__))
T = av.THEMES[0]
OR, OR_FONCE, SUR_OR = T["accent"], T["jouer"], T["surAccent"]
TEXTE, DOUX, EBENE = T["texte"], T["doux"], T["barre"]
VERSION = "0.6.4"
L = 1440
HAUTEURS = {"hero": 860, "versions": 600, "installer": 500, "questions": 450, "pied": 296}
H = sum(HAUTEURS.values())

ICONES = dict(av.ICONES)
ICONES.update({
    "fenetre": '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18"/><path d="M6.5 6.5h.01M9 6.5h.01"/>',
    "portable": '<rect x="4.5" y="5" width="15" height="10.5" rx="1.5"/><path d="M2.5 19h19l-1.5-3.5H4z"/>',
    "terminal": '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="m7 9.5 3 2.5-3 2.5M12.5 15h4.5"/>',
    "puce": '<rect x="7" y="7" width="10" height="10" rx="1.5"/><rect x="10" y="10" width="4" height="4" rx=".5"/><path d="M9.5 3.5V7M14.5 3.5V7M9.5 17v3.5M14.5 17v3.5M3.5 9.5H7M3.5 14.5H7M17 9.5h3.5M17 14.5h3.5"/>',
    "cube": '<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
    "boite": '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v9.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9M10 13h4"/>',
    "coche": '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    "info": '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.2"/>',
    "globe": '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.7 3.9 5.7 3.9 9s-1.3 6.3-3.9 9c-2.6-2.7-3.9-5.7-3.9-9S9.4 5.7 12 3z"/>',
})


def ic(nom, taille=22, couleur="currentColor", trait=1.8):
    return (f'<svg aria-hidden="true" width="{taille}" height="{taille}" viewBox="0 0 24 24" fill="none" stroke="{couleur}" '
            f'stroke-width="{trait}" stroke-linecap="round" stroke-linejoin="round" style="flex: none">{ICONES[nom]}</svg>')


def sur_titre(texte):
    return f'<span style="font-family: Nunito, sans-serif; font-weight: 800; font-size: 12.5px; letter-spacing: 0.24em; color: {OR}">{texte}</span>'


def titre2(texte, ident):
    return f'<h2 id="{ident}" style="margin: 8px 0 0; font-family: \'Baloo 2\', sans-serif; font-weight: 800; font-size: 38px; line-height: 1.1; color: #fff">{texte}</h2>'


def bouton_discord(texte):
    return (f'<a class="st-contour" href="#" style="height: 40px; padding: 0 16px; border-radius: 12px; border: 1.5px solid rgba(201,161,74,0.55); '
            f'color: #fff; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-family: Nunito, sans-serif; font-weight: 800; '
            f'font-size: 14px">{ic("bulle", 18, OR)}{texte}</a>')


def insecables(texte):
    """Typographie française : espace insécable avant : ? ! ; et dans les guillemets, pour ne jamais laisser un signe seul en début de ligne."""
    for a, b in ((" :", "\u00a0:"), (" ?", "\u00a0?"), (" !", "\u00a0!"), (" ;", "\u00a0;"), ("« ", "«\u00a0"), (" »", "\u00a0»")):
        texte = texte.replace(a, b)
    return texte


def avantages(textes):
    puces = "".join(f'<li style="display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 700; color: {TEXTE}"><span style="width: 24px; height: 24px; border-radius: 50%; background: rgba(201,161,74,0.16); color: {OR}; display: flex; align-items: center; justify-content: center; flex: none">{ic("coche", 14, trait=2.6)}</span>{t}</li>' for t in textes)
    return f'<ul style="list-style: none; margin: 8px 0 0; padding: 0 4px; display: flex; flex-direction: column; gap: 12px">{puces}</ul>'


def lien(texte, cible):
    return f'<a class="st-lien" href="#{cible}" style="color: {TEXTE}; text-decoration: none; font-weight: 700; font-size: 14.5px">{texte}</a>'


# ---------------------------------------------------------------- en haut : la scène peinte et le gros bouton
def entete():
    return f"""<header style="position: absolute; top: 0; left: 0; right: 0; height: 76px; padding: 0 56px; box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; z-index: 3">
{av.logo_mot(42, "site-haut")}
<nav aria-label="Sur cette page" style="display: flex; align-items: center; gap: 28px">
{lien("Versions", "versions")}{lien("Installer", "installer")}{lien("Questions", "questions")}
<div style="position: relative">
<button class="st-contour" onClick="[[ouvrirLangues]]" aria-haspopup="listbox" aria-expanded="[[languesOuvertes]]" aria-label="Langue" style="height: 40px; padding: 0 12px; border-radius: 12px; border: 1.5px solid rgba(255,255,255,0.22); background: rgba(15,11,8,0.35); color: #fff; display: flex; align-items: center; gap: 8px; font-family: Nunito, sans-serif; font-weight: 800; font-size: 13.5px; cursor: pointer">{ic("globe", 17)}[[langueCode]]{ic("chevron", 14)}</button>
<div role="listbox" aria-label="Langue" style="display: [[affLangues]]; position: absolute; right: 0; top: 48px; width: 220px; padding: 6px; border-radius: 14px; background: #19120d; border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 18px 40px rgba(0,0,0,0.5); flex-direction: column; gap: 2px">
<sc-for list="[[langues]]" as="l" hint-placeholder-count="5">
<button role="option" aria-selected="[[l.presse]]" onClick="[[l.choisir]]" style="height: 38px; padding: 0 12px; border: 0; border-radius: 9px; background: [[l.fond]]; color: #fff; display: flex; align-items: center; justify-content: space-between; font-family: Nunito, sans-serif; font-weight: 700; font-size: 14px; cursor: pointer">[[l.nom]]<small style="font-size: 10.5px; font-weight: 800; letter-spacing: 0.08em; color: {DOUX}">[[l.code]]</small></button>
</sc-for></div></div>
{bouton_discord("Discord")}
</nav></header>"""


def hero():
    return f"""<section aria-labelledby="titre-site" style="position: relative; height: {HAUTEURS["hero"]}px; overflow: hidden">
<img src="{av.FOND_CONNEXION}" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 30%">
<span aria-hidden="true" style="position: absolute; inset: 0; background: radial-gradient(42% 46% at 50% 44%, rgba(15,11,8,0.62) 0%, rgba(15,11,8,0) 100%)"></span>
<span aria-hidden="true" style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(15,11,8,0.78) 0%, rgba(15,11,8,0) 16%, rgba(15,11,8,0) 62%, {EBENE} 100%)"></span>
{so.nav("telecharger")}
<div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; padding-top: 118px; box-sizing: border-box">
{sur_titre("LAUNCHER ORIGINS · VERSION " + VERSION)}
<div style="margin-top: 16px">{av.logo_mot(112, "site-grand")}</div>
<h1 id="titre-site" style="margin: 18px 0 0; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 52px; line-height: 1.05; color: #fff; text-shadow: 0 4px 24px rgba(0,0,0,0.65)">Entre dans Tempest</h1>
<p style="margin: 12px 0 0; max-width: 600px; text-align: center; font-size: 18px; line-height: 1.55; font-weight: 600; color: {TEXTE}; text-shadow: 0 2px 14px rgba(0,0,0,0.85)">Le launcher installe le jeu et le garde à jour. Tes amis, tes messages et les actus du serveur t'y attendent.</p>
<div style="margin-top: 28px; width: 640px; box-sizing: border-box; padding: 22px 26px 20px; border-radius: 22px; background: linear-gradient(160deg, {T["verre1"]}, {T["verre2"]}); border: 1px solid rgba(255,255,255,0.16); box-shadow: 0 24px 60px rgba(0,0,0,0.55); display: flex; flex-direction: column; gap: 12px">
<button class="st-cta" onClick="[[telecharger]]" style="height: 66px; border: 0; border-radius: 16px; background: #ffffff; color: {OR_FONCE}; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 21px; letter-spacing: 0.06em; display: flex; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 5px 0 rgba(0,0,0,0.25); cursor: pointer">{ic("telecharger", 24, trait=2.4)}[[ctaTexte]]</button>
<p style="display: [[affInfo]]; margin: 0; text-align: center; font-size: 13.5px; font-weight: 700; color: {DOUX}">[[ctaInfo]]<button class="st-lien" onClick="[[changerVariante]]" style="display: [[affAlt]]; margin-left: 10px; padding: 0; border: 0; background: transparent; color: {OR}; font-family: Nunito, sans-serif; font-weight: 800; font-size: 13.5px; cursor: pointer">[[altTexte]]</button></p>
<p role="status" style="display: [[affLance]]; margin: 0; align-items: center; justify-content: center; gap: 8px; font-size: 13.5px; font-weight: 700; color: {TEXTE}">{ic("coche", 17, "#8bd99a", 2.4)}<span>Téléchargement de « [[fichierLance]] » lancé.</span><button class="st-lien" onClick="[[telecharger]]" style="padding: 0; border: 0; background: transparent; color: {OR}; font-family: Nunito, sans-serif; font-weight: 800; font-size: 13.5px; cursor: pointer">Réessayer</button></p>
<span aria-hidden="true" style="height: 1px; background: rgba(255,255,255,0.12); margin: 2px 0"></span>
<div style="display: flex; align-items: center; justify-content: space-between; gap: 12px">
<span style="font-size: 11.5px; font-weight: 800; letter-spacing: 0.14em; color: {DOUX}">TON SYSTÈME</span>
<div role="radiogroup" aria-label="Système" style="display: flex; gap: 4px; padding: 4px; border-radius: 12px; background: rgba(0,0,0,0.3)">
<sc-for list="[[systemes]]" as="o" hint-placeholder-count="3">
<button role="radio" aria-checked="[[o.presse]]" onClick="[[o.choisir]]" style="height: 36px; padding: 0 14px; border: 0; border-radius: 9px; background: [[o.fond]]; color: [[o.couleur]]; font-family: Nunito, sans-serif; font-weight: 800; font-size: 13.5px; display: flex; align-items: center; gap: 7px; cursor: pointer">[[o.nom]]<small style="display: [[o.affDetecte]]; font-size: 9.5px; font-weight: 800; letter-spacing: 0.1em; opacity: 0.7">DÉTECTÉ</small></button>
</sc-for></div></div>
<p style="margin: 0; display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 600; color: {DOUX}">{ic("info", 16, OR)}Il te faut un compte Microsoft avec Minecraft : Java Edition.</p>
</div></div>
<a class="st-lien" href="#versions" style="position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 2px; color: {DOUX}; text-decoration: none; font-size: 12px; font-weight: 800; letter-spacing: 0.16em">TOUTES LES VERSIONS{ic("chevron", 18)}</a>
</section>"""


# ---------------------------------------------------------------- les trois systèmes
def rang(cle, icone, titre, detail, etiquette):
    return f"""<button class="st-rang" onClick="[[dl_{cle}]]" aria-label="Télécharger : {titre}" style="width: 100%; min-height: 66px; padding: 10px 12px 10px 14px; box-sizing: border-box; border-radius: 14px; border: 1px solid [[rbord_{cle}]]; background: [[rfond_{cle}]]; color: #fff; display: flex; align-items: center; gap: 12px; text-align: left; cursor: pointer; font-family: Nunito, sans-serif">
<span style="color: {OR}; display: flex">{ic(icone, 22)}</span>
<span style="flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px"><strong style="font-size: 15px; font-weight: 800">{titre}</strong><span style="font-size: 12.5px; font-weight: 600; color: {DOUX}">{detail}</span></span>
<span style="font-size: 10.5px; font-weight: 800; letter-spacing: 0.06em; color: {DOUX}; padding: 3px 7px; border-radius: 6px; background: rgba(255,255,255,0.07)">{etiquette}</span>
<span style="width: 36px; height: 36px; border-radius: 50%; background: {OR}; color: {SUR_OR}; display: flex; align-items: center; justify-content: center; flex: none">{ic("telecharger", 18, trait=2.3)}</span></button>"""


def carte(ident, icone, nom, besoin, rangs, pied):
    return f"""<article aria-label="{nom}" style="position: relative; padding: 24px; border-radius: 20px; background: linear-gradient(170deg, #1e160e, #130d08); border: 1.5px solid [[bord_{ident}]]; box-shadow: [[ombre_{ident}]]; display: flex; flex-direction: column; gap: 18px">
<span style="display: [[badge_{ident}]]; position: absolute; top: -12px; right: 20px; padding: 5px 11px; border-radius: 99px; background: {OR}; color: {SUR_OR}; font-size: 10.5px; font-weight: 800; letter-spacing: 0.12em">TON SYSTÈME</span>
<div style="display: flex; align-items: center; gap: 14px">
<span style="width: 54px; height: 54px; border-radius: 16px; background: rgba(201,161,74,0.14); color: {OR}; display: flex; align-items: center; justify-content: center">{ic(icone, 28)}</span>
<div><h3 style="margin: 0; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 25px; line-height: 1.1; color: #fff">{nom}</h3>
<p style="margin: 3px 0 0; font-size: 13px; font-weight: 600; color: {DOUX}">{besoin}</p></div></div>
<div style="display: flex; flex-direction: column; gap: 10px">{rangs}</div>
<p style="margin: auto 0 0; display: flex; gap: 8px; font-size: 12.5px; line-height: 1.5; font-weight: 600; color: {DOUX}">{ic("info", 16, OR)}<span>{pied}</span></p>
</article>"""


def versions():
    cartes = [
        carte("windows", "fenetre", "Windows", "Windows 10 et 11, 64 bits",
              rang("win", "fenetre", "Installateur Windows", "Windows 10 et 11 · 101 Mo", ".EXE")
              + avantages(["Se met à jour tout seul", "Raccourci sur le bureau et dans le menu Démarrer", "Dossier d'installation au choix"]),
              "Windows peut te mettre en garde au premier lancement : c'est normal, voir l'étape 2 plus bas."),
        carte("mac", "portable", "macOS", "Puce Apple ou processeur Intel",
              rang("mac_apple", "puce", "Puce Apple", "M1, M2, M3, M4 et suivants", ".DMG")
              + rang("mac_intel", "puce", "Processeur Intel", "Les Mac plus anciens", ".DMG"),
              "Pour savoir lequel prendre : menu Pomme > À propos de ce Mac, ligne « Puce » ou « Processeur »."),
        carte("linux", "terminal", "Linux", "64 bits (x86_64)",
              rang("lin_appimage", "cube", "AppImage", "Toutes les distributions", ".APPIMAGE")
              + rang("lin_deb", "boite", "Paquet .deb", "Ubuntu, Debian, Mint, Pop!_OS", ".DEB"),
              "L'AppImage se lance sans rien installer ; le paquet .deb s'installe comme une application."),
    ]
    return f"""<section id="versions" aria-labelledby="titre-versions" style="position: relative; height: {HAUTEURS["versions"]}px; padding: 40px 96px 0; box-sizing: border-box">
<div style="display: flex; flex-direction: column; align-items: center; text-align: center">
{sur_titre("TOUTES LES VERSIONS")}{titre2("Choisis ton système", "titre-versions")}
<p style="margin: 10px 0 0; max-width: 620px; font-size: 16px; line-height: 1.55; font-weight: 600; color: {TEXTE}">Le même launcher partout : ton profil Origins et tes amis te suivent d'un ordinateur à l'autre.</p></div>
<div style="margin-top: 38px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; align-items: stretch">{"".join(cartes)}</div>
</section>"""


# ---------------------------------------------------------------- installer en 3 étapes
def onglet(ident, icone, nom):
    return (f'<button role="tab" aria-selected="[[ong_presse_{ident}]]" onClick="[[ong_{ident}]]" style="height: 40px; padding: 0 16px; border: 0; border-radius: 10px; '
            f'background: [[ong_fond_{ident}]]; color: [[ong_coul_{ident}]]; display: flex; align-items: center; gap: 8px; font-family: Nunito, sans-serif; '
            f'font-weight: 800; font-size: 14px; cursor: pointer">{ic(icone, 18)}{nom}</button>')


def format_linux(ident, nom):
    return (f'<button role="radio" aria-checked="[[fmt_presse_{ident}]]" onClick="[[fmt_{ident}]]" style="height: 34px; padding: 0 12px; border-radius: 9px; '
            f'border: 1.5px solid [[fmt_bord_{ident}]]; background: [[fmt_fond_{ident}]]; color: #fff; font-family: Nunito, sans-serif; font-weight: 800; '
            f'font-size: 13px; cursor: pointer">{nom}</button>')


def installer():
    return f"""<section id="installer" aria-labelledby="titre-installer" style="height: {HAUTEURS["installer"]}px; padding: 56px 96px 0; box-sizing: border-box; background: linear-gradient(180deg, #140e09, {EBENE}); border-top: 1px solid rgba(201,161,74,0.16)">
<div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 24px">
<div>{sur_titre("EN 3 ÉTAPES")}{titre2("Installer le launcher", "titre-installer")}</div>
<div style="display: flex; align-items: center; gap: 12px">
<div role="radiogroup" aria-label="Format Linux" style="display: [[affFormats]]; gap: 6px">{format_linux("appimage", "AppImage")}{format_linux("deb", "Paquet .deb")}</div>
<div role="tablist" aria-label="Système" style="display: flex; gap: 4px; padding: 4px; border-radius: 13px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08)">{onglet("windows", "fenetre", "Windows")}{onglet("mac", "portable", "macOS")}{onglet("linux", "terminal", "Linux")}</div>
</div></div>
<ol style="list-style: none; margin: 36px 0 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px">
<sc-for list="[[etapes]]" as="e" hint-placeholder-count="3">
<li style="padding: 24px; border-radius: 20px; background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 12px">
<span aria-hidden="true" style="width: 46px; height: 46px; border-radius: 50%; background: {OR}; color: {SUR_OR}; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 23px; display: flex; align-items: center; justify-content: center">[[e.num]]</span>
<h3 style="margin: 4px 0 0; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 22px; line-height: 1.15; color: #fff">[[e.titre]]</h3>
<p style="margin: 0; font-size: 14.5px; line-height: 1.55; font-weight: 600; color: {TEXTE}">[[e.texte]]</p>
<div style="display: [[e.affCode]]; align-items: flex-start; gap: 8px; padding: 7px 7px 7px 12px; border-radius: 11px; background: #0a0705; border: 1px solid rgba(255,255,255,0.1)">
<code style="flex: 1; min-width: 0; padding-top: 6px; font-family: ui-monospace, Menlo, Consolas, monospace; font-weight: 600; font-size: 13px; line-height: 1.45; color: #ffd98f; white-space: pre-wrap; overflow-wrap: anywhere">[[e.code]]</code>
<button onClick="[[e.copier]]" style="height: 30px; padding: 0 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.18); background: transparent; color: #fff; font-family: Nunito, sans-serif; font-weight: 800; font-size: 12px; display: flex; align-items: center; gap: 6px; cursor: pointer">{ic("copie", 14)}[[e.copieTexte]]</button></div>
</li>
</sc-for></ol>
</section>"""


# ---------------------------------------------------------------- questions et pied de page
def questions():
    return f"""<section id="questions" aria-labelledby="titre-questions" style="height: {HAUTEURS["questions"]}px; padding: 64px 96px 0; box-sizing: border-box; display: grid; grid-template-columns: 380px minmax(0, 1fr); gap: 64px; align-items: start">
<div style="display: flex; flex-direction: column; align-items: flex-start">
{sur_titre("QUESTIONS")}{titre2("Un souci ?", "titre-questions")}
<p style="margin: 12px 0 22px; font-size: 16px; line-height: 1.55; font-weight: 600; color: {TEXTE}">Les réponses à ce qu'on nous demande le plus. Sinon, viens nous voir sur le Discord.</p>
{bouton_discord("Rejoindre le Discord")}</div>
<div style="display: flex; flex-direction: column; gap: 10px">
<sc-for list="[[questions]]" as="q" hint-placeholder-count="4">
<div style="border-radius: 16px; background: [[q.fond]]; border: 1px solid [[q.bord]]">
<button onClick="[[q.basculer]]" aria-expanded="[[q.presse]]" style="width: 100%; padding: 17px 20px; border: 0; background: transparent; color: #fff; font-family: Nunito, sans-serif; font-weight: 800; font-size: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; text-align: left">[[q.titre]]<span style="display: flex; color: {OR}; transform: rotate([[q.rotation]]); transition: transform 0.2s">{ic("chevron", 18)}</span></button>
<p style="display: [[q.affTexte]]; margin: 0; padding: 0 20px 18px; font-size: 14.5px; line-height: 1.6; font-weight: 600; color: {TEXTE}">[[q.texte]]</p>
</div>
</sc-for></div>
</section>"""


def pied():
    return f"""<footer style="height: {HAUTEURS["pied"]}px; padding: 0 96px; box-sizing: border-box; border-top: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; justify-content: center; gap: 16px">
<div style="display: flex; align-items: center; justify-content: space-between">
<div style="display: flex; align-items: center; gap: 16px">{av.logo_mot(34, "site-pied")}<span style="font-size: 13px; font-weight: 700; color: {DOUX}">Launcher {VERSION}</span></div>
<nav aria-label="Pied de page" style="display: flex; align-items: center; gap: 26px">{lien("Versions", "versions")}{lien("Installer", "installer")}{lien("Questions", "questions")}
<a class="st-lien" href="#" style="color: {TEXTE}; text-decoration: none; font-weight: 700; font-size: 14.5px">Discord</a>
<a class="st-lien" href="#titre-site" style="color: {OR}; text-decoration: none; font-weight: 800; font-size: 14.5px">Haut de page ↑</a></nav></div>
<p style="margin: 0; font-size: 12px; font-weight: 600; color: rgba(185,168,136,0.7)">Ce n'est pas un produit officiel Minecraft. Non approuvé par Mojang ou Microsoft, ni associé à eux. © 2026 Origins.</p>
</footer>"""


# ---------------------------------------------------------------- ce qui change au clic
CONNEXION = "Choisis ta langue, connecte-toi avec Microsoft et crée ton profil Origins. Tempest s'installe ensuite depuis l'accueil."
CONFIG = {
    "detecte": "windows",
    "or": OR, "orFonce": OR_FONCE,
    "systemes": [["windows", "Windows"], ["mac", "macOS"], ["linux", "Linux"]],
    "langues": av.LANGUES[1:2] + av.LANGUES[:1] + av.LANGUES[2:],
    "fichiers": {
        "win": {"cta": "TÉLÉCHARGER POUR WINDOWS", "info": "Windows 10 et 11 · 64 bits · 101 Mo", "fichier": "Origins-Launcher-Setup.exe"},
        "mac_apple": {"cta": "TÉLÉCHARGER POUR MAC", "info": "Puce Apple (M1 et suivants) · .dmg", "fichier": f"Origins Launcher-{VERSION}-arm64.dmg"},
        "mac_intel": {"cta": "TÉLÉCHARGER POUR MAC", "info": "Mac avec processeur Intel · .dmg", "fichier": f"Origins Launcher-{VERSION}.dmg"},
        "lin_appimage": {"cta": "TÉLÉCHARGER POUR LINUX", "info": "AppImage · toutes les distributions", "fichier": f"Origins Launcher-{VERSION}.AppImage"},
        "lin_deb": {"cta": "TÉLÉCHARGER POUR LINUX", "info": "Paquet .deb · Ubuntu, Debian, Mint", "fichier": f"origins-launcher_{VERSION}_amd64.deb"},
    },
    "etapes": {
        "windows": [
            {"titre": "Ouvre le fichier", "texte": "Lance « Origins-Launcher-Setup.exe » depuis tes téléchargements, choisis le dossier d'installation et laisse-toi guider."},
            {"titre": "Si Windows te prévient", "texte": "Le launcher n'est pas encore signé : Windows peut afficher « Windows a protégé votre ordinateur ». Clique sur « Informations complémentaires », puis « Exécuter quand même »."},
            {"titre": "Connecte-toi", "texte": CONNEXION},
        ],
        "mac": [
            {"titre": "Ouvre le .dmg", "texte": "Glisse Origins Launcher dans le dossier Applications, puis lance-le depuis le Launchpad ou le Finder."},
            {"titre": "Autorise-le", "texte": "S'il est bloqué : Réglages Système > Confidentialité et sécurité > « Ouvrir quand même ». Si macOS dit que l'app est endommagée, tape dans le Terminal :",
             "code": 'xattr -cr "/Applications/Origins Launcher.app"'},
            {"titre": "Connecte-toi", "texte": CONNEXION},
        ],
        "linux-appimage": [
            {"titre": "Rends-le exécutable", "texte": "Clic droit sur le fichier > Propriétés > « Autoriser l'exécution », ou dans un terminal, depuis le dossier du fichier :",
             "code": "chmod +x Origins*.AppImage"},
            {"titre": "Lance-le", "texte": "Double-clique dessus : rien à installer. S'il ne s'ouvre pas, installe le paquet libfuse2 (libfuse2t64 sur Ubuntu 24.04 et plus récents)."},
            {"titre": "Connecte-toi", "texte": CONNEXION},
        ],
        "linux-deb": [
            {"titre": "Installe le paquet", "texte": "Double-clique dessus pour l'ouvrir dans ta logithèque, ou dans un terminal, depuis le dossier du fichier :",
             "code": "sudo apt install ./origins-launcher_*.deb"},
            {"titre": "Lance-le", "texte": "Origins Launcher apparaît dans la liste de tes applications, comme les autres."},
            {"titre": "Connecte-toi", "texte": CONNEXION},
        ],
    },
    "questions": [
        ["C'est gratuit ?", "Oui, le launcher est gratuit. Il te faut seulement un compte Microsoft qui possède Minecraft : Java Edition."],
        ["Faut-il le retélécharger à chaque mise à jour ?", "Non. Sur Windows, le launcher cherche les mises à jour à son lancement puis toutes les 10 minutes, et les installe tout seul quand tu as fini de jouer."],
        ["Windows ou mon antivirus bloque le fichier", "Le launcher n'est pas encore signé, alors Windows peut te mettre en garde. Clique sur « Informations complémentaires », puis « Exécuter quand même ». Télécharge-le seulement depuis cette page."],
        ["Je n'arrive pas à me connecter", "Vérifie que ton compte Microsoft possède bien Minecraft : Java Edition. Si ça bloque encore, écris-nous sur le Discord avec une capture de l'erreur."],
    ],
}

LOGIQUE = """  renderVals() {
    const s = this.state || {};
    const C = %s;
    const os = s.os || C.detecte;
    const puce = s.puce || 'apple';
    const format = s.format || 'appimage';
    const question = s.question === undefined ? 0 : s.question;
    const langue = s.langue || 'fr';
    const cle = os === 'windows' ? 'win' : os === 'mac' ? 'mac_' + puce : 'lin_' + format;
    const F = C.fichiers[cle];
    const choisirOs = (id) => () => this.setState({ os: id, lance: false, copie: null });
    const v = {
      ctaTexte: F.cta, ctaInfo: F.info, fichierLance: F.fichier,
      affInfo: s.lance ? 'none' : 'block',
      affLance: s.lance ? 'flex' : 'none',
      affAlt: os === 'windows' ? 'none' : 'inline',
      altTexte: os === 'mac' ? (puce === 'apple' ? 'Mac avec processeur Intel ?' : 'Mac avec puce Apple ?')
        : (format === 'appimage' ? 'Plutôt le paquet .deb ?' : "Plutôt l'AppImage ?"),
      changerVariante: () => this.setState(os === 'mac' ? { puce: puce === 'apple' ? 'intel' : 'apple', lance: false }
        : { format: format === 'appimage' ? 'deb' : 'appimage', lance: false, copie: null }),
      telecharger: () => this.setState({ lance: true }),
      systemes: C.systemes.map((o) => ({
        nom: o[1],
        presse: o[0] === os ? 'true' : 'false',
        fond: o[0] === os ? '#ffffff' : 'transparent',
        couleur: o[0] === os ? C.orFonce : '#f0e6cf',
        affDetecte: o[0] === C.detecte ? 'inline' : 'none',
        choisir: choisirOs(o[0])
      })),
      langueCode: langue.toUpperCase(),
      languesOuvertes: s.langues ? 'true' : 'false',
      affLangues: s.langues ? 'flex' : 'none',
      ouvrirLangues: () => this.setState({ langues: !s.langues }),
      langues: C.langues.map((l) => ({
        nom: l[1],
        code: l[0].toUpperCase(),
        presse: l[0] === langue ? 'true' : 'false',
        fond: l[0] === langue ? 'rgba(201,161,74,0.18)' : 'transparent',
        choisir: () => this.setState({ langue: l[0], langues: false })
      })),
      affFormats: os === 'linux' ? 'flex' : 'none',
      etapes: C.etapes[os === 'linux' ? 'linux-' + format : os].map((e, i) => ({
        num: String(i + 1),
        titre: e.titre,
        texte: e.texte,
        affCode: e.code ? 'flex' : 'none',
        code: e.code || '',
        copieTexte: s.copie === os + format + i ? 'Copié' : 'Copier',
        copier: () => {
          try { const p = navigator.clipboard && navigator.clipboard.writeText(e.code); if (p && p.catch) p.catch(() => {}); } catch (err) {}
          this.setState({ copie: os + format + i });
        }
      })),
      questions: C.questions.map((q, i) => ({
        titre: q[0],
        texte: q[1],
        presse: i === question ? 'true' : 'false',
        affTexte: i === question ? 'block' : 'none',
        rotation: i === question ? '180deg' : '0deg',
        fond: i === question ? 'rgba(201,161,74,0.08)' : 'rgba(255,255,255,0.03)',
        bord: i === question ? 'rgba(201,161,74,0.35)' : 'rgba(255,255,255,0.08)',
        basculer: () => this.setState({ question: i === question ? -1 : i })
      }))
    };
    ['windows', 'mac', 'linux'].forEach((id) => {
      const ici = id === os;
      v['bord_' + id] = ici ? C.or : 'rgba(255,255,255,0.08)';
      v['ombre_' + id] = ici ? '0 0 0 4px rgba(201,161,74,0.12), 0 24px 50px rgba(0,0,0,0.45)' : '0 16px 40px rgba(0,0,0,0.35)';
      v['badge_' + id] = ici ? 'block' : 'none';
      v['ong_fond_' + id] = ici ? '#ffffff' : 'transparent';
      v['ong_coul_' + id] = ici ? C.orFonce : '#f0e6cf';
      v['ong_presse_' + id] = ici ? 'true' : 'false';
      v['ong_' + id] = choisirOs(id);
    });
    [['win', 'windows', {}], ['mac_apple', 'mac', { puce: 'apple' }], ['mac_intel', 'mac', { puce: 'intel' }],
     ['lin_appimage', 'linux', { format: 'appimage' }], ['lin_deb', 'linux', { format: 'deb' }]].forEach((r) => {
      const ici = r[0] === cle;
      v['rbord_' + r[0]] = ici ? C.or : 'rgba(255,255,255,0.10)';
      v['rfond_' + r[0]] = ici ? 'rgba(201,161,74,0.10)' : 'rgba(255,255,255,0.03)';
      v['dl_' + r[0]] = () => this.setState(Object.assign({ os: r[1], lance: true, copie: null }, r[2]));
    });
    ['appimage', 'deb'].forEach((f) => {
      const ici = f === format;
      v['fmt_fond_' + f] = ici ? 'rgba(201,161,74,0.2)' : 'transparent';
      v['fmt_bord_' + f] = ici ? C.or : 'rgba(255,255,255,0.16)';
      v['fmt_presse_' + f] = ici ? 'true' : 'false';
      v['fmt_' + f] = () => this.setState({ format: f, copie: null });
    });
    return v;
  }"""


def page(corps):
    props = json.dumps({"$preview": {"width": L, "height": H}}).replace("'", "&#39;")
    corps = corps.replace("[[", "{{").replace("]]", "}}")
    return f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Télécharger le launcher Origins</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
{av.POLICES}
<style>
body{{margin:0;background:{EBENE}}}
*{{scrollbar-width:none;scroll-behavior:smooth}}*::-webkit-scrollbar{{display:none}}
.st-lien{{transition:color .15s,opacity .15s}}.st-lien:hover{{color:#ffffff !important}}
.st-contour{{transition:background .15s,border-color .15s}}.st-contour:hover{{background:rgba(201,161,74,0.16) !important;border-color:{OR} !important}}
.st-cta{{transition:transform .15s,box-shadow .15s}}.st-cta:hover{{transform:translateY(-2px);box-shadow:0 7px 0 rgba(0,0,0,0.25) !important}}
.st-rang{{transition:transform .15s,border-color .15s,background .15s}}.st-rang:hover{{transform:translateY(-2px);border-color:rgba(201,161,74,0.7) !important}}
</style>
</helmet>
{corps}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{props}'>
class Component extends DCLogic {{
{LOGIQUE % insecables(json.dumps(CONFIG, ensure_ascii=False))}
}}
</script>
</body>
</html>
"""


def ecrire():
    corps = (f'<div style="width: {L}px; height: {H}px; overflow: hidden; background: {EBENE}; font-family: Nunito, system-ui, sans-serif; color: {TEXTE}">'
             + insecables(hero() + versions() + installer() + questions() + so.pied()) + "</div>")
    chemin = os.path.join(ICI, "project", "Site-Telechargement.dc.html")
    with open(chemin, "w", encoding="utf-8") as f:
        f.write(page(corps))
    print(chemin, L, H)


if __name__ == "__main__":
    ecrire()
