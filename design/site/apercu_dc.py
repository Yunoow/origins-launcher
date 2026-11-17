#!/usr/bin/env python3
"""Aperçu local d'une planche .dc.html, sans le canvas : calcule renderVals() avec node, remplit les trous, déroule les
<sc-for>, puis fait une capture avec Chrome sans fenêtre.

    python3 apercu_dc.py project/Site-Telechargement.dc.html /tmp/site.png '{"os": "linux"}'

Les polices du site (Baloo 2, Nunito) ne sont pas sur cette machine : l'aperçu prend une police de secours plus large,
donc ce qui tient ici tient aussi en vrai.
"""
import json
import os
import re
import subprocess
import sys

ICI = os.path.dirname(os.path.abspath(__file__))
IMAGES = {"/_blob/f9f0a3965d73b365e92d5a13ea88de62": "file://" + os.path.join(ICI, "fond-connexion.jpg"),
          "/_blob/042a0a49c4fca2e655379024bfcf4a7f": "file://" + os.path.join(ICI, "assets", "tempest-fond.jpg"),
          "/_blob/76ae4d6407e13276f98121296beded3f": "file://" + os.path.join(ICI, "assets", "origins-ciel.jpg"),
          "/_blob/d2b7d04f93e1d5af31ba692eea95f5ea": "file://" + os.path.join(ICI, "assets", "tempest-logo.png")}

source, sortie = sys.argv[1], sys.argv[2]
etat = sys.argv[3] if len(sys.argv) > 3 else "{}"
html = open(source, encoding="utf-8").read()
helmet = re.search(r"<helmet>(.*?)</helmet>", html, re.S).group(1)
corps = re.search(r"</helmet>(.*?)</x-dc>", html, re.S).group(1)
script = re.search(r'<script type="text/x-dc"[^>]*>(.*?)</script>', html, re.S).group(1)
props = json.loads(re.search(r"data-props='([^']*)'", html).group(1).replace("&#39;", "'"))
largeur, hauteur = props["$preview"]["width"], props["$preview"]["height"]

js = ("class DCLogic {}\n" + script +
      "\nconst c = new Component(); c.props = {}; c.state = " + etat + ";"
      "\nc.setState = function (o) { this.state = Object.assign({}, this.state, o); };"
      "\nconsole.log(JSON.stringify(c.renderVals(), (k, x) => typeof x === 'function' ? 'fn' : x));")
with open("/tmp/apercu-dc.js", "w", encoding="utf-8") as f:
    f.write(js)
vals = json.loads(subprocess.check_output(["node", "/tmp/apercu-dc.js"]))


def valeur(nom, depuis):
    if nom not in depuis:
        raise SystemExit(f"trou sans valeur : {nom}")
    return str(depuis[nom])


def deroule(m):
    liste, nom, gabarit = m.group(1), m.group(2), m.group(3)
    return "".join(re.sub(r"\{\{\s*" + nom + r"\.(\w+)\s*\}\}", lambda t: valeur(t.group(1), element), gabarit)
                   for element in vals[liste])


corps = re.sub(r'<sc-for list="\{\{(\w+)\}\}" as="(\w+)"[^>]*>(.*?)</sc-for>', deroule, corps, flags=re.S)
corps = re.sub(r"\{\{\s*(\w+)\s*\}\}", lambda m: valeur(m.group(1), vals), corps)
for blob, fichier in IMAGES.items():
    corps = corps.replace(blob, fichier)
page = f'<!doctype html><html lang="fr"><head><meta charset="utf-8">{helmet}</head><body>{corps}</body></html>'
with open("/tmp/apercu-dc.html", "w", encoding="utf-8") as f:
    f.write(page)
subprocess.run(["google-chrome", "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
                f"--window-size={largeur},{hauteur}", "--virtual-time-budget=3000", "--allow-file-access-from-files",
                f"--screenshot={os.path.abspath(sortie)}", "file:///tmp/apercu-dc.html"],
               check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)
print(sortie, largeur, hauteur)
