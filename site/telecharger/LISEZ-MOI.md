# Page de téléchargement du launcher (17/11/2026)

Une seule page, sans framework : `index.html` (styles et script dedans) et `fond.jpg` (le fond peint de la connexion).
Maquette de référence : canvas, planche « Site · Télécharger le launcher ».

- **Version et taille** : lues dans `/launcher/latest.yml` (Windows).
- **Mac et Linux** : la page demande (`HEAD`) si chaque fichier existe ; sinon elle affiche « Bientôt disponible ».
  Noms fixes attendus dans `/launcher/` :
  - `Origins-Launcher-Setup.exe` (existe déjà) ;
  - `Origins-Launcher-mac-arm64.dmg` et `Origins-Launcher-mac-x64.dmg` ;
  - `Origins-Launcher.AppImage` et `origins-launcher_amd64.deb`.
- **Système détecté** : Windows, Mac (puce Apple ou Intel quand le navigateur le dit), Linux (le paquet .deb sur
  Ubuntu, Debian, Mint). Sur téléphone, la page propose de copier le lien.
- **5 langues**, celles du launcher (fr, en, es, de, pt-BR) : choisies d'après le navigateur, gardées si on change.
- **Réglages** en haut du script (`CONFIG`) :
  - `discord` : le lien d'invitation ; vide, les boutons Discord sont cachés ;
  - `dossier` et les noms des fichiers.
- **Polices** : Google Fonts (Baloo 2, Nunito). À héberger nous-mêmes plus tard, si on veut se passer de Google.
- **Menu** : les liens du haut sont ceux du site Origins (Accueil, Jeux, Actus, Boutique, Télécharger, Support) ;
  la page garde son propre style et ses propres textes.
- **Mise en ligne** : avec tout le site, par `npm.cmd run deploy:site` (voir `site/LISEZ-MOI.md`). La page est
  servie sur `/telecharger/`. Seulement avec l'accord de Yunoow.
