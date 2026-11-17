# Site Origins (17/11/2026)

Le site public, sans framework, d'après les maquettes de `design/site/` (DA « Site Origins », thème Or et ébène).

| Adresse | Fichier | Contenu |
|---|---|---|
| `/` | `index.html` | Accueil |
| `/jeux/tempest/` | `jeux/tempest/index.html` | Tempest (`/jeux/` y renvoie) |
| `/actus/` | `actus/index.html` | Actus de l'API (Tempest) + historique du launcher |
| `/boutique/` | `boutique/index.html` | Vitrine, tout « Bientôt » : rien ne s'achète |
| `/telecharger/` | `telecharger/index.html` | Page de téléchargement (voir son LISEZ-MOI) |
| `/support/` | `support/index.html` | Aide publique : Discord d'Origins / de Tempest, réponses rapides |

- **Commun** : `commun/site.css` (couleurs, boutons, cartes, en-tête, pied) et `commun/site.js` (en-tête, pied,
  langues, actus). Réglages en haut de `site.js` (`SITE`) : liens Discord, Board, API, pages.
- **Langues** : les 5 du launcher. Chaque page déclare `window.TEXTES_PAGE` **avant** `commun/site.js` et marque
  ses textes `data-t="clé"`. Le choix est gardé sous `origins-langue`, comme la page Télécharger.
- **Actus** : `/api/news?game=tempest` (les mêmes que dans le launcher). L'historique du launcher n'est pas copié :
  c'est `src/news.js`, publié en `commun/historique-launcher.js`. Pour une nouvelle version du launcher, on ne met
  à jour que `src/news.js`.
- **Aperçu local** : `node scripts/site-local.js` → http://localhost:8190 (relaie `/api/` et `/launcher/` vers le
  VPS, en lecture seule).
- **Mise en ligne** : `npm.cmd run deploy:site -- --essai` pour vérifier, puis `npm.cmd run deploy:site`.
  Seulement avec l'accord de Yunoow. Ne remplace que les entrées du site dans `/var/www/origins/`, jamais
  `launcher/`, ses sauvegardes ni `tempest/`.
- **Plus tard** : « Se connecter » (`SITE.connexionJoueur`), tickets sur le site, boutique ouverte.
