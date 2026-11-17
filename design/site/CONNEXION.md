# « Se connecter » sur le site Origins (décisions de Yunoow, 17/11/2026)

Le site public est fait (`site/`). Ce qui manque : la connexion, Mon profil, puis les tickets. Ce fichier dit quoi
faire et où sont les maquettes. **Rien en ligne sans l'accord de Yunoow.**

## La règle : tout passe par le profil Origins

- Le profil Origins est créé une seule fois dans le launcher, avec la connexion Microsoft (obligatoire pour jouer).
- Le site s'y connecte **par le launcher**. Il n'y a ni mot de passe ni compte à créer.
- **Discord est facultatif pour les joueurs**, parce que beaucoup n'en ont pas et qu'il est interdit aux moins de
  13 ans. Il est **obligatoire pour l'équipe** :
  - Board : grade Origins board (comme la Console aujourd'hui) ;
  - Tickets du staff : grade `1572106903746642100`. Garde les ID Discord en texte : ils ne tiennent pas dans un
    nombre JavaScript.
- Boutique : le pseudo Minecraft suffit, sans compte (plus tard, à l'ouverture de la boutique).

## Les maquettes à suivre

Ce sont des planches du canvas (`.dc.html`). Lis leur HTML (mise en page, styles) et leur classe `Component` (états,
textes). Elles ne s'ouvrent pas seules dans un navigateur.

- `design/site/Site-Connexion.dc.html` : la connexion, en 4 états.
  - `choix` : « Pseudo Minecraft ou Origins ID », « Envoyer au launcher », et l'astuce « Ouvrir sur le site ».
  - `attente` : « Regarde ton launcher », le code `K7P · 4QX`, « La demande expire dans 2 minutes », Annuler.
  - `connecte` : « Bienvenue », l'Origins ID, Mon profil, Accueil.
  - `equipe` : « Board de l'équipe » et « Se connecter avec Discord ». On y arrive par le lien « Tu fais partie de
    l'équipe ? ».
- `design/site/Site-Profil.dc.html` : Mon profil.
  - Comptes liés : Minecraft, Microsoft, et Discord facultatif avec Lier / Délier.
  - Mes achats (vide), Mes tickets, Mes amis.
  - Navigateurs connectés, avec Déconnecter et « Se déconnecter partout ».
- `design/site/Site-Support.dc.html` et `Site-Tickets.dc.html` : les tickets, à faire après la connexion.
- `design/site/Mobile-*.dc.html` : les versions téléphone.
- Launcher :
  - `design/maquettes/Aventure-Profil.dc.html` : « Ouvrir sur le site » et la ligne « Discord : facultatif · Lier » ;
  - `design/maquettes/Aventure-Accueil.dc.html` : cloche → onglet Demandes → « Connexion au site », avec le code,
    le navigateur, Accepter / Refuser.

## Ce qui existe déjà

- **Site** : `SITE.connexionJoueur` (dans `site/commun/site.js`) affiche « Se connecter » → `/connexion/`.
- **API Origins** : dépôt Tempest, `origins-api/server.vps.fixed.js`, copie exacte du VPS.
  - Express, PostgreSQL et `ws`, port 3000, derrière nginx sous `/api/`.
  - Le launcher se connecte par `POST /auth/microsoft` et reçoit un JWT. La fonction `authenticate` vérifie ce JWT
    dans l'en-tête `Bearer`.
  - Les tables `users`, `identities` (`provider`, `provider_user_id`, `UNIQUE(provider, provider_user_id)`) et
    `profiles` : `schema.sql` n'a que le départ, c'est la base du VPS qui fait foi.
  - `sendRealtime(profileId, type, data)` pousse un événement au launcher par `/api/realtime` (déjà écouté pour les
    MP et la présence).

## À faire

### 1. Sessions du site (API)

- Une table `site_sessions` : id, `profile_id`, jeton haché (sha256), navigateur (court : « Chrome · Windows »),
  création, dernière visite, expiration (30 jours, prolongée à chaque visite), révoquée.
- Le navigateur garde un cookie `origins_session`, avec ces réglages : `HttpOnly`, `Secure`, `SameSite=Lax`,
  `Path=/`. Le JavaScript de la page ne voit jamais le jeton.
- Les routes qui changent quelque chose exigent l'en-tête `X-Origins-Site: 1`, pour bloquer les formulaires d'autres
  sites.
- Les routes :
  - `GET /api/site/moi` : le profil (nom, avatar, Origins ID, pseudo Minecraft, Discord lié ou non, grades
    d'équipe), ou une erreur 401 ;
  - `POST /api/site/deconnexion` ;
  - `GET /api/site/sessions`, `DELETE /api/site/sessions/:id` et `DELETE /api/site/sessions`
    (« Se déconnecter partout »).

### 2. « Ouvrir sur le site », depuis le launcher

1. Le launcher, déjà connecté avec son JWT, appelle `POST /api/site/lien`.
2. L'API crée un jeton aléatoire de 32 octets, gardé haché, à usage unique, valable 2 minutes. Elle répond par une
   adresse `https://<site>/connexion/lien?jeton=…`.
3. Le launcher l'ouvre dans le navigateur (`shell.openExternal`).
4. La page `/connexion/lien` appelle `POST /api/site/lien/echanger`, qui pose la session et efface le jeton.
5. La page renvoie vers `/profil/`, ou vers la page demandée.

### 3. Demande au launcher, depuis le site

1. Sur `/connexion/`, le joueur tape son pseudo ou son Origins ID. Le site appelle `POST /api/site/demandes`.
2. L'API crée une demande :
   - un code de 6 caractères lisibles, sans 0, O, 1 ni I, affiché « K7P · 4QX » ;
   - le navigateur, et une expiration à 2 minutes ;
   - un état : en attente, acceptée, refusée ou expirée.
3. L'API prévient le launcher : `sendRealtime(profileId, "site:demande-connexion", { id, code, navigateur, expire })`.
4. Elle donne **la même réponse que le pseudo existe ou non** : `{ id, code, expire }`. Pour un pseudo inconnu, la
   demande n'arrive nulle part et expire. Ainsi, le site ne dit jamais qui a un profil.
5. Le launcher affiche la demande dans la cloche, onglet Demandes, et l'enlève quand elle expire. Accepter ou
   Refuser appelle `POST /api/site/demandes/:id/accepter` ou `/refuser`, avec le JWT. L'API vérifie que la demande
   est bien pour ce profil.
6. Pendant ce temps, le site interroge `GET /api/site/demandes/:id` toutes les 2 secondes.
   - Acceptée : la réponse pose le cookie de session, une seule fois, et le site passe à l'état « Connecté ».
   - Refusée ou expirée : retour au choix, avec un message.
7. Limites :
   - 5 demandes par adresse IP toutes les 10 minutes ;
   - 3 demandes en attente au plus par profil ;
   - chaque code ne sert qu'une fois.

### 4. Discord, facultatif pour les joueurs

- On le lie depuis le launcher (« Discord : facultatif · Lier ») ou depuis Mon profil. C'est un OAuth Discord
  (scope `identify`) dans le navigateur.
- L'API ajoute une ligne `identities` sur le profil : `provider = "discord"`, `provider_user_id` = l'ID Discord. La
  contrainte UNIQUE garde un Discord pour un seul profil. Délier supprime la ligne.
- On garde la même application Discord que la Console : il suffit d'y ajouter l'adresse de retour du site.

### 5. L'équipe

- Le Board ne bouge pas. Il reste la Console (`SITE.board`), avec sa connexion Discord et le grade Origins board.
  Le site montre seulement le bouton « Board » à l'équipe.
- Les tickets du staff viendront avec les tickets. Connexion Discord, grade `1572106903746642100` ou Origins board,
  vérifiés comme dans la Console (scope `guilds.members.read`).
- Si le Discord de la personne est lié à un profil Origins, le site affiche ce profil.

### 6. Le site

- Les pages :
  - `/connexion/` : les 4 états de la maquette ;
  - `/connexion/lien` : l'échange du jeton ;
  - `/profil/` : Mon profil. Les achats et les tickets sont vides pour l'instant.
- L'en-tête :
  - pas connecté : « Se connecter » ;
  - connecté : l'avatar et son menu (Mon profil, Mes achats, Mes tickets, Se déconnecter) ;
  - équipe : en plus, le bouton « Board ».
- Passer `SITE.connexionJoueur` à `true` quand tout marche.
- Les textes en 5 langues, comme le reste du site.

### 7. Le launcher

- Profil : « Ouvrir sur le site », et la ligne Discord.
- Cloche, onglet Demandes : écouter `site:demande-connexion`, compter la demande dans la pastille, et la retirer
  quand elle expire.

## État au 17/11 : fait et essayé en local (rien en ligne)

- **API** (dépôt Tempest) : `origins-api/site-connexion.js`, branché dans `server.vps.fixed.js` ; `ws` ajouté à
  `package.json` (il était déjà sur le VPS). Essai `origins-api/essais/site-connexion.essai.js` : 41/41 sur une base
  de test (schéma du VPS sans données).
  - Écarts avec ce fichier : Discord lit aussi `guilds.members.read`, pour savoir si la personne est de l'équipe
    (bouton Board) ; le jeton Discord n'est pas gardé. La demande est liée au navigateur qui l'a faite (cookie
    `origins_demande`), pour que personne d'autre ne récupère la session. `GET /site/demandes` (launcher) liste les
    demandes en attente, `GET /site/discord` dit au launcher si Discord est lié.
- **Site** : `/connexion/` (4 états), `/connexion/lien`, `/profil/`, l'en-tête (Se connecter, avatar et menu, Board).
  `SITE.connexionJoueur` reste à `false` : en ligne, la connexion ne s'affiche qu'avec lui à `true` **et** en
  HTTPS ; en local (localhost), elle est toujours active.
- **Launcher** : « Ouvrir sur le site » et « Discord : facultatif · Lier » dans le profil, la demande dans la cloche
  (onglet Demandes). Pour les essais : `ORIGINS_API_DEV=http://localhost:3100` fait parler le launcher à une API
  locale.
- **Essai local de bout en bout** : `ORIGINS_API_LOCALE=http://localhost:3100 node scripts/site-local.js`, puis le
  vrai launcher (page et préchargement) sur l'API locale : demande → cloche → Accepter → site connecté ; « Ouvrir sur
  le site » → /profil/ connecté ; Discord (faux Discord) → lié, grade board → bouton Board.

### Mise en ligne, avec Yunoow (dans cet ordre)

1. **Application Discord de la Console** : ajouter l'adresse de retour
   `https://tempest-console.duckdns.org/api/site/discord/retour`.
2. **API** : sauvegarde `server.js.backup-before-site-connexion`, copier `server.vps.fixed.js` (→ `server.js`) et
   `site-connexion.js` dans `/opt/origins/api/`. Ajouter au `.env` : `SITE_URL=https://tempest-console.duckdns.org`,
   `DISCORD_CLIENT_ID` et `DISCORD_CLIENT_SECRET` (ceux de la Console), `DISCORD_SERVEUR=1553448432100843731`,
   `DISCORD_GRADES_BOARD=1556280777967271936`, `DISCORD_GRADES_STAFF=1572106903746642100`. Puis
   `sudo systemctl restart origins-api` (les tables se créent au démarrage).
3. **nginx du domaine du Board** (`console-tempest`) : la Console garde `/connexion` et `/connexion/retour`.
   Ajouter, avec `proxy_set_header X-Real-IP $remote_addr;` (la limite par adresse IP en dépend) :
   `location /api/site/ { proxy_pass http://127.0.0.1:3000/site/; }`, `location /api/avatars/ { proxy_pass
   http://127.0.0.1:3000/avatars/; }`, et en fichiers du site : `location = /connexion/`, `location ^~
   /connexion/lien`, `location ^~ /profil/`. Tester avec `nginx -t`, garder la sauvegarde.
4. **Site** : `SITE.connexionJoueur = true`, puis `npm.cmd run deploy:site`.
5. **Launcher** : nouvelle version publiée par Yunoow (`deploy:launcher`) ; sans elle, les joueurs n'ont ni la
   demande dans la cloche ni « Ouvrir sur le site ».

## Ordre et vérifications

1. **API** : les tables, les routes et le temps réel. Essai sur une base de test, jamais sur la base du VPS.
2. **Site** : `/connexion/`, `/connexion/lien`, `/profil/` et l'en-tête.
3. **Launcher** : « Ouvrir sur le site », les demandes et Discord.
4. **Essai de bout en bout en local.** `scripts/site-local.js` relaie `/api/` vers le VPS : pour ces nouvelles
   routes, il faut une API locale.
5. **Mise en ligne, seulement avec Yunoow** :
   - le site doit d'abord avoir **un nom de domaine et HTTPS**, comme la Console (duckdns + certbot). Sans HTTPS,
     pas de connexion : le cookie de session circulerait en clair ;
   - API : sauvegarde `.backup-before-…` comme d'habitude, puis redémarrage du service. Regarde d'abord comment il
     tourne sur le VPS ;
   - puis `deploy:site` et `deploy:launcher`.
