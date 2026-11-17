# Nouveau design du launcher (branche `nouveau-design`)

Passation pour la session Claude Code qui code le design. Décisions de Yunoow du 17/11/2026.

## La maquette validée

Canvas : https://claude.ai/artifact/MfWpuZA2Jkxbkhjs3J4YKZ — rangée « Piste Aventure » (Accueil, Paramètres, Profil,
Connexion, Jeux, Actus, Boutique, Installation). Tout y est cliquable. C'est la référence visuelle.

## Règle n°1 : garder les mêmes systèmes, améliorer leur fonctionnement

On ne réinvente rien côté fonctions : profil Origins (nom et avatar à soi, Origins ID copiable), contacts par Origins ID,
messages privés, demandes d'ami (notifications), langue unique launcher + jeu, mémoire du jeu (de 2 Go à ce que permet le PC, 16 Go au plus), tutoriel,
fenêtre « Quoi de neuf ? », bandeau de mise à jour, installation de Tempest.

- Garder **tous les `id`** de `src/index.html` : `src/renderer.js` s'en sert (pages via la classe `active`, panneaux via
  `open`, `showPage("home"|"games"|"tempest"|"updates"|"shop")`). Déplacer les éléments, oui ; les renommer, non.
- Le tutoriel vise des éléments de la page : le revérifier après chaque déplacement.
- Garder les mêmes emplacements de sauvegarde (réglages, profil, connexion), pour que la mise à jour automatique ne
  fasse rien perdre aux joueurs.

## La mise en page (façon launcher d'Ankama, avec nos images)

- **Barre du haut** (46 px) : tuile logo Origins à gauche ; onglets Accueil, Jeux, Actus, Boutique (les boutons
  `homeButton`, `gamesButton`, `updatesButton`, `shopButton`) ; au centre un bandeau d'actu mis en avant ; à droite
  cloche (`notificationsQuickAccess`), contacts (`friendsQuickAccess`), paramètres (`settingsButton`), avatar
  (`accountButton`), puis réduire / agrandir / fermer.
- **Barre de gauche** : seulement les jeux installés (Tempest, comme un favori) puis un « + » qui ouvre l'onglet Jeux.
  Pas de cadenas, pas de « Prochain jeu ».
- **Accueil** : grande illustration de Tempest, carte du jeu flottante (logo, état du serveur, gros bouton JOUER /
  INSTALLER blanc, puis deux boutons ronds : Boutique et Paramètres du jeu, qui ouvre les Paramètres sur la catégorie
  Jeu), actus en cartes **sombres** dessous, « Quoi de neuf ? » en bas à droite.
- **Installation** : avant, INSTALLER + taille ; pendant, bloc avec pourcentage en grand, barre animée, Go faits / total,
  vitesse, temps restant, élément en cours, Pause et Annuler ; puis vérification ; puis JOUER. Tempest apparaît dans la
  barre de gauche dès le début, avec un anneau de progression. Sur les autres onglets, un petit bandeau en bas suit le
  téléchargement.
- **Contacts** (panneau à droite, 220 px) : en tête, ma tête, mon nom, mon statut ; onglets Contacts (ajout par Origins
  ID, « Seulement en ligne », liste), Messages, Demandes (Accepter / Refuser).
- **Paramètres** : grand panneau depuis la droite (catégories à gauche : Général, Jeu, Compte, Aide, À propos ; une ligne
  par réglage : titre, explication, contrôle à droite), reste de l'écran assombri avec une croix ronde au milieu.
- **Profil** : panneau à droite, grand avatar (crayon pour le changer), nom modifiable sur place, Origins ID qui se copie,
  « Connecté avec Microsoft », puis Mes contacts, Paramètres, Déconnexion.
- **Jeux** : « JEUX ORIGINS », affiche de Tempest (nom, genre, état : Installé / À installer / Téléchargement).
- **Actus** : filtres Tout / Tempest / Launcher, cartes sombres, la plus récente en grand.
- **Boutique** : une rangée par univers (bannière à gauche, sections, cartes produits « Bientôt »), qui coulisse.
- **Connexion** : les 3 étapes existantes (langue, Microsoft, profil) dans une carte au centre, avec les étapes en haut,
  sur le nouveau fond peint (voir « Fond de l'écran de connexion » plus bas).

## Style

- Thème par défaut **Or et ébène**, dans la DA du logo œil de dragon (fond #0f0b08, panneaux #19120d / #221913,
  accent or #c9a14a, texte #f0e6cf, gris #b9a888) ; changé le 17/11/2026, avant c'était Argent et nuit. Le thème
  n'est enregistré que si le joueur en choisit un : sinon il suit le thème de base.
  **Pas de vert par défaut.** 8 thèmes au choix dans Paramètres > Général (palettes dans
  `design/maquettes/themes.py`, et liste `THEMES` de `design/maquettes/aventure.py`, Or et ébène en premier : or-ebene, argent-nuit, emeraude-or, pourpre-or, cuivre-braise, sang-onyx,
  sakura, tempete). Les faire en variables CSS + `data-theme` sur `<body>`, choix enregistré.
- Polices : Baloo 2 (titres, boutons) et Nunito (texte). Coins arrondis, cartes en verre sombre.
- **Aucune barre de défilement visible**, défilement doux.
- Logo : l'**œil de dragon** (voir « Logo et icône » plus bas). L'ancien logo, le Seuil, n'est plus utilisé.

## Ce qu'on ne fait pas

- Rien sur les classes, les sorts ou les passifs dans les actus du launcher (pour plus tard).
- Pas de Console pour l'instant (mise de côté).

## Publier

- Rien ne part chez les joueurs sans Yunoow. Version qui monte dans `package.json` + actus de la version en tête de
  `src/news.js` dans toutes les langues, puis `npm.cmd run deploy:launcher` (jamais `deploy:tempest` tout court).
- Les launchers installés se mettent à jour seuls (vérification au lancement puis toutes les 10 min).
- Dans PowerShell, taper `npm.cmd` au lieu de `npm`.

## Logo et icône (validés par Yunoow le 17/11/2026)

Le logo Origins est un **O en œil de dragon**, style cartoon (aplats orange et rouge, gros contour sombre, pupille
fendue, reflets blancs, étincelles). Il remplace l'ancien logo partout. Planche de référence : « Logo retenu · œil de
dragon » sur le canvas.

- `src/assets/logos/origins-oeil-regard.svg` : l'œil pour le **logo avec le mot** (en haut à gauche du launcher, écran
  de connexion…). L'œil **regarde le R** : il remplace le O du mot ORIGINS. Le reste du mot est du texte « RIGINS » en
  Baloo 2 (800), blanc, contour sombre (`-webkit-text-stroke` ≈ taille/28 px, couleur #0a1024), collé à l'œil
  (marge gauche du texte ≈ −11 % de la taille de l'œil).
- `src/assets/logos/origins-oeil.svg` : l'œil seul, **pupille au centre** (quand il n'y a pas de mot à côté : tuile
  du haut à gauche, chargement, profil…).
- `build/icon.ico` (Windows, 16 à 256 px) et `build/icon.png` (1024 px, Linux et Mac ; electron-builder en tire
  l'icône Mac) : l'icône de l'application, **pupille au centre**, sur une tuile bleu nuit arrondie. Les anciennes
  icônes sont remplacées (sur la branche `nouveau-design` seulement).
- `design/logo/` : la même icône en SVG et en PNG de 16 à 1024 px, si une autre taille est utile (barre des tâches,
  favicon, notifications).

## Curseur de mémoire du jeu (corrigé le 17/11/2026)

Le curseur va de `min` à `max`, tels que les fixe `systemMemory()` dans `index.js` : de 2 Go à la RAM du PC moins 2 Go,
**16 Go au plus** (16 sur un PC de 31 Go, 6 sur un PC de 8 Go). Les chiffres fixes de 2 à 8 sous le curseur étaient
faux : sur un PC de 31 Go, 4 Go tombait sous le « 3 ». On n'écrit donc **que le minimum à gauche et le maximum à
droite**, lus sur `gameMemoryInput.min` et `gameMemoryInput.max`, avec la valeur en grand à côté (« 4 Go »). Le rond,
la partie remplie (`--fill`) et la valeur doivent tomber au même endroit. Maquette : Paramètres, catégorie Jeu.

## Fond de l'écran de connexion (17/11/2026)

- `src/assets/backgrounds/origins-connexion.jpg` (2560 × 1440, 580 Ko) : fond peint en Or et ébène (montagnes dans la
  brume, lueur dorée au milieu, château à gauche, lune et dragon en haut à droite, braises). Il remplace le ciel bleu
  `origins-home.png` **pour l'écran de connexion** : `background: url("assets/backgrounds/origins-connexion.jpg")
  center 30% / cover no-repeat;`. Avant de supprimer `origins-home.png`, vérifier qu'il ne sert plus ailleurs.
- Le milieu est calme exprès : la carte s'y pose et la lueur fait un halo autour. Rien d'important à moins de 6 % des
  bords, pour que la fenêtre la plus étroite (1100 × 700) ne coupe ni le château ni la lune.
- `.origins-onboarding-shade` et `.origins-onboarding-card` ont encore des reflets **verts** (`rgba(75, 255, 186, …)`,
  `rgba(128, 255, 207, …)`) : les passer aux couleurs du thème, comme sur la maquette « Piste Aventure · Connexion ».
- Le fond est fait par `design/maquettes/fond_connexion.py` (Python avec numpy, Pillow, scipy ; rien de téléchargé) :
  `python fond_connexion.py` le refait en 2560 × 1440, `python fond_connexion.py 0.5` donne un aperçu.

## Site Origins et profil (17/11/2026 : maquettes seulement, rien à coder pour l'instant)

Décision de Yunoow : tout est relié au **profil Origins**, créé une fois dans le launcher avec Microsoft. Le site Origins
(rangée « Site Origins » du canvas ; fichiers dans `design/site/`) se connecte **par le launcher**, pas par Discord.
Discord reste facultatif pour les joueurs ; seule l'équipe en a besoin (Board : grade Origins board ; Tickets du staff :
grade `1572106903746642100`).

Côté launcher, **quand le site et l'API seront prêts, pas avant** (maquettes déjà à jour) :
- Profil : « Ouvrir sur le site » (le navigateur s'ouvre déjà connecté, lien à usage unique) et une ligne
  « Discord : facultatif · Lier ».
- Notifications, onglet Demandes : « Connexion au site », avec le même code que sur le site, Accepter / Refuser.
- La Boutique et les actus du site sont les mêmes que celles du launcher (même source).
