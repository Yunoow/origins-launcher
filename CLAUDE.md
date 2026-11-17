# Origins Launcher

Launcher Electron du projet Origins (jeu : Tempest, serveur Minecraft). Réponds en français.

## Chantier en cours : le nouveau design (branche `nouveau-design`)

**Lis d'abord `NOUVEAU-DESIGN.md`** : toutes les décisions de Yunoow (mise en page façon launcher d'Ankama, thèmes,
téléchargement, contacts, paramètres, profil, ce qu'on ne fait pas).

La référence visuelle est dans `design/maquettes/` :
- `Aventure-*.dc.html` : les maquettes validées (Accueil, Paramètres, Profil, Jeux, Actus, Boutique, Installation,
  Connexion). Ouvre-les pour reprendre les couleurs, tailles, espacements et textes exacts. Les images `/_blob/...`
  sont nos images : `src/assets/games/tempest-background.png` (fond), `src/assets/backgrounds/origins-home.png`
  (ciel de nuit), `src/assets/logos/tempest-logo.png`.
- `aventure.py`, `gen.py`, `themes.py` : le code qui a produit ces maquettes (palettes des 8 thèmes dans `themes.py`,
  dérivées dans `aventure.py` ; logo « Seuil » dans `gen.py`, fonction `logo_sobre`).
- Canvas en ligne (si tu y as accès) : https://claude.ai/artifact/MfWpuZA2Jkxbkhjs3J4YKZ

## Règles

- Garder les mêmes systèmes et **tous les `id`** de `src/index.html` (utilisés par `src/renderer.js`) ; on change la
  mise en page et le style, pas le fonctionnement.
- Avancer par étapes (barre du haut et accueil d'abord), lancer `npm.cmd start` pour vérifier, montrer à Yunoow.
- Dans PowerShell : `npm.cmd`, pas `npm`.
- Ne jamais publier : la publication (`npm.cmd run deploy:launcher`) est décidée et faite par Yunoow. Jamais
  `deploy:tempest` tout court.
- Commits en français, qui disent pourquoi ; ne rien pousser sans l'accord de Yunoow.
