/* =====================================================================================================
   SITE ORIGINS : script commun à toutes les pages.
   - pose l'en-tête et le pied (dans #site-tete et #site-pied) ;
   - gère les 5 langues du launcher (fr, en, es, de, pt), gardées sous « origins-langue » comme la page Télécharger ;
   - traduit les éléments [data-t="clé"] (texte) et [data-t-aria="clé"] (aria-label) avec les textes de la page
     (window.TEXTES_PAGE = { fr: {...}, en: {...}, ... }) puis ceux du site (TEXTES_SITE ci-dessous) ;
   - appelle window.rendrePage(langue) à chaque changement de langue, pour ce que la page construit elle-même.
   La page déclare : <body data-page="accueil|jeux|actus|boutique|telecharger|support">.
   ===================================================================================================== */
"use strict";

const SITE = {
  // Réglages du site. Tout ce qui pointe ailleurs est ici.
  discord: "https://discord.gg/kHStbdtuxz",          // Discord d'Origins (actus, communauté, tickets pour l'instant)
  discordTempest: "https://discord.gg/9YGPreUdQ7",   // Discord de Tempest
  board: "https://tempest-console.duckdns.org/board/", // Board de l'équipe (connexion Discord, grade Origins board)
  api: "/api",                                       // API Origins, sur le même serveur (nginx : /api/ → port 3000)
  connexionJoueur: false,                            // « Se connecter » en ligne : seulement avec HTTPS et l'API à jour
                                                     // (en local, sur localhost, il est toujours actif pour les essais)
  pages: {
    accueil: "/", jeux: "/jeux/tempest/", actus: "/actus/", boutique: "/boutique/",
    telecharger: "/telecharger/", support: "/support/"
  }
};

/** La connexion des joueurs est-elle active ici ? En ligne : SITE.connexionJoueur ; en local : toujours. */
// Jamais sans HTTPS : le cookie de session circulerait en clair (et le navigateur le refuse, il est « Secure »).
const CONNEXION = (SITE.connexionJoueur && location.protocol === "https:") || ["localhost", "127.0.0.1"].includes(location.hostname);

const LANGUES = [
  { code: "fr", nom: "Français" },
  { code: "en", nom: "English" },
  { code: "es", nom: "Español" },
  { code: "de", nom: "Deutsch" },
  { code: "pt", nom: "Português (Brasil)" }
];

/* Textes de l'en-tête et du pied, dans les 5 langues. */
const TEXTES_SITE = {
  fr: {
    menuAccueil: "Accueil", menuJeux: "Jeux", menuActus: "Actus", menuBoutique: "Boutique", menuTelecharger: "Télécharger", menuSupport: "Support",
    langue: "Langue", menu: "Menu", seConnecter: "Se connecter", discordOrigins: "Discord d'Origins",
    monProfil: "Mon profil", mesAchats: "Mes achats", mesTickets: "Mes tickets", boardEquipe: "Board de l'équipe", seDeconnecter: "Se déconnecter", compte: "Mon compte",
    piedPresentation: "Nos mondes Minecraft, réunis dans un launcher. Un seul profil Origins pour le jeu, le launcher et le site.",
    piedJeux: "JEUX", piedOrigins: "ORIGINS", piedAide: "AIDE", piedEquipe: "ÉQUIPE",
    piedActus: "Actus", piedBoutique: "Boutique", piedTelecharger: "Télécharger le launcher",
    piedSupport: "Support", piedInstaller: "Installer le launcher", piedQuestions: "Questions",
    piedBoard: "Board", piedDiscord: "Discord",
    mentions: "Ce n'est pas un produit officiel Minecraft. Non approuvé par Mojang ou Microsoft, ni associé à eux."
  },
  en: {
    menuAccueil: "Home", menuJeux: "Games", menuActus: "News", menuBoutique: "Shop", menuTelecharger: "Download", menuSupport: "Support",
    langue: "Language", menu: "Menu", seConnecter: "Sign in", discordOrigins: "Origins Discord",
    monProfil: "My profile", mesAchats: "My purchases", mesTickets: "My tickets", boardEquipe: "Team board", seDeconnecter: "Sign out", compte: "My account",
    piedPresentation: "Our Minecraft worlds, together in one launcher. One Origins profile for the game, the launcher and the website.",
    piedJeux: "GAMES", piedOrigins: "ORIGINS", piedAide: "HELP", piedEquipe: "TEAM",
    piedActus: "News", piedBoutique: "Shop", piedTelecharger: "Download the launcher",
    piedSupport: "Support", piedInstaller: "Install the launcher", piedQuestions: "Questions",
    piedBoard: "Board", piedDiscord: "Discord",
    mentions: "Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft."
  },
  es: {
    menuAccueil: "Inicio", menuJeux: "Juegos", menuActus: "Noticias", menuBoutique: "Tienda", menuTelecharger: "Descargar", menuSupport: "Soporte",
    langue: "Idioma", menu: "Menú", seConnecter: "Iniciar sesión", discordOrigins: "Discord de Origins",
    monProfil: "Mi perfil", mesAchats: "Mis compras", mesTickets: "Mis tickets", boardEquipe: "Board del equipo", seDeconnecter: "Cerrar sesión", compte: "Mi cuenta",
    piedPresentation: "Nuestros mundos de Minecraft, reunidos en un launcher. Un solo perfil de Origins para el juego, el launcher y la web.",
    piedJeux: "JUEGOS", piedOrigins: "ORIGINS", piedAide: "AYUDA", piedEquipe: "EQUIPO",
    piedActus: "Noticias", piedBoutique: "Tienda", piedTelecharger: "Descargar el launcher",
    piedSupport: "Soporte", piedInstaller: "Instalar el launcher", piedQuestions: "Preguntas",
    piedBoard: "Board", piedDiscord: "Discord",
    mentions: "No es un producto oficial de Minecraft. No está aprobado por Mojang ni Microsoft, ni asociado con ellos."
  },
  de: {
    menuAccueil: "Start", menuJeux: "Spiele", menuActus: "News", menuBoutique: "Shop", menuTelecharger: "Herunterladen", menuSupport: "Support",
    langue: "Sprache", menu: "Menü", seConnecter: "Anmelden", discordOrigins: "Origins-Discord",
    monProfil: "Mein Profil", mesAchats: "Meine Käufe", mesTickets: "Meine Tickets", boardEquipe: "Team-Board", seDeconnecter: "Abmelden", compte: "Mein Konto",
    piedPresentation: "Unsere Minecraft-Welten, vereint in einem Launcher. Ein Origins-Profil für Spiel, Launcher und Website.",
    piedJeux: "SPIELE", piedOrigins: "ORIGINS", piedAide: "HILFE", piedEquipe: "TEAM",
    piedActus: "News", piedBoutique: "Shop", piedTelecharger: "Launcher herunterladen",
    piedSupport: "Support", piedInstaller: "Launcher installieren", piedQuestions: "Fragen",
    piedBoard: "Board", piedDiscord: "Discord",
    mentions: "Kein offizielles Minecraft-Produkt. Nicht von Mojang oder Microsoft genehmigt oder mit ihnen verbunden."
  },
  pt: {
    menuAccueil: "Início", menuJeux: "Jogos", menuActus: "Notícias", menuBoutique: "Loja", menuTelecharger: "Baixar", menuSupport: "Suporte",
    langue: "Idioma", menu: "Menu", seConnecter: "Entrar", discordOrigins: "Discord do Origins",
    monProfil: "Meu perfil", mesAchats: "Minhas compras", mesTickets: "Meus tickets", boardEquipe: "Board da equipe", seDeconnecter: "Sair", compte: "Minha conta",
    piedPresentation: "Nossos mundos de Minecraft, reunidos em um launcher. Um só perfil Origins para o jogo, o launcher e o site.",
    piedJeux: "JOGOS", piedOrigins: "ORIGINS", piedAide: "AJUDA", piedEquipe: "EQUIPE",
    piedActus: "Notícias", piedBoutique: "Loja", piedTelecharger: "Baixar o launcher",
    piedSupport: "Suporte", piedInstaller: "Instalar o launcher", piedQuestions: "Perguntas",
    piedBoard: "Board", piedDiscord: "Discord",
    mentions: "Não é um produto oficial do Minecraft. Não aprovado pela Mojang ou Microsoft, nem associado a elas."
  }
};

/* ------------------------------------------------------------ petits outils */
const Site = {
  langue: "fr",

  lire(cle) { try { return localStorage.getItem(cle); } catch (_) { return null; } },
  ecrire(cle, v) { try { localStorage.setItem(cle, v); } catch (_) { /* stockage indisponible */ } },

  /** Le texte d'une clé dans la langue choisie : page, puis site, puis français. */
  t(cle, valeurs) {
    const page = window.TEXTES_PAGE || {};
    const brut = (page[Site.langue] && page[Site.langue][cle]) ?? (TEXTES_SITE[Site.langue] && TEXTES_SITE[Site.langue][cle])
      ?? (page.fr && page.fr[cle]) ?? TEXTES_SITE.fr[cle] ?? cle;
    return valeurs ? String(brut).replace(/\{(\w+)\}/g, (m, k) => (valeurs[k] !== undefined ? valeurs[k] : "")) : brut;
  },

  echapper(s) { return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); },

  /** Une icône du sprite commun (#i-nom). */
  icone(nom, classe) { return `<svg class="icone ${classe || ""}" aria-hidden="true"><use href="#i-${nom}"/></svg>`; },

  /** Une date dans la langue choisie : « 4 nov. 2026 ». */
  date(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return iso || "";
    const locale = { fr: "fr-FR", en: "en-GB", es: "es-ES", de: "de-DE", pt: "pt-BR" }[Site.langue] || "fr-FR";
    return d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
  },

  /** Les actus de l'API Origins (les mêmes que dans le launcher). Rend [] si l'API ne répond pas. */
  async actus(jeu = "tempest") {
    try {
      const r = await fetch(`${SITE.api}/news?game=${encodeURIComponent(jeu)}`, { headers: { Accept: "application/json" } });
      if (!r.ok) return [];
      const donnees = await r.json();
      return Array.isArray(donnees.news) ? donnees.news : [];
    } catch (_) {
      return [];
    }
  },

  /** Le contenu d'une actu dans la langue choisie (ou en anglais, puis en français). */
  contenu(actu) {
    const c = actu && actu.content ? actu.content : {};
    return c[Site.langue] || c.en || c.fr || Object.values(c)[0] || { title: "", text: "", changes: [] };
  },

  /** Le profil connecté sur le site (null si personne), une fois l'en-tête prêt. */
  moi: null,
  moiPret: Promise.resolve(null),

  /** Appel à l'API du site : même origine, cookie de session, en-tête X-Origins-Site pour ce qui change quelque chose. */
  async appel(chemin, { methode = "GET", corps } = {}) {
    const r = await fetch(`${SITE.api}${chemin}`, {
      method: methode, credentials: "same-origin",
      headers: { Accept: "application/json", "X-Origins-Site": "1", ...(corps ? { "Content-Type": "application/json" } : {}) },
      body: corps ? JSON.stringify(corps) : undefined
    });
    let json = null;
    try { json = await r.json(); } catch (_) { /* pas de JSON */ }
    return { ok: r.ok, statut: r.status, json };
  },

  /** L'avatar d'un profil : son image (chemin /api/avatars/… de l'API), sinon son initiale. */
  avatar(nom, url, classe) {
    const propre = typeof url === "string" && /^(\/api\/avatars\/|https:\/\/)/.test(url) ? url : "";
    return propre
      ? `<img class="avatar ${classe || ""}" src="${Site.echapper(propre)}" alt="">`
      : `<span class="avatar avatar-lettre ${classe || ""}" aria-hidden="true">${Site.echapper(String(nom || "?").slice(0, 1).toUpperCase())}</span>`;
  },

  /** Une carte d'actu de l'API (Accueil, Tempest) : renvoie vers la page Actus, ouverte sur cette actu. */
  carteActu(a) {
    const c = Site.contenu(a);
    const type = String(a.type || "TEMPEST").toUpperCase();
    const fond = type.includes("LAUNCHER") ? " launcher" : "";
    return `<a class="carte actu" href="${SITE.pages.actus}#${encodeURIComponent(a.slug || a.id || "")}">
      <div class="actu-image${fond}"></div>
      <div class="actu-corps">
        <div class="actu-meta"><span class="actu-type">${Site.echapper(type)}</span><span>${Site.echapper(Site.date(a.createdAt || a.created_at))}</span></div>
        <h3>${Site.echapper(c.title)}</h3>
        <p>${Site.echapper(c.text)}</p>
      </div></a>`;
  },

  /** Remplit une grille avec les actus (null = encore en chargement, [] = aucune). */
  grilleActus(grille, actus, cleVide) {
    if (!grille || actus === null) return;
    grille.innerHTML = actus.length
      ? actus.map(Site.carteActu).join("")
      : `<div class="carte actus-vide" style="grid-column: 1 / -1">${Site.echapper(Site.t(cleVide || "actusVide"))}</div>`;
  }
};

/* ------------------------------------------------------------ sprite d'icônes commun */
const SPRITE = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<symbol id="i-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></symbol>
<symbol id="i-chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></symbol>
<symbol id="i-bulle" viewBox="0 0 24 24"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V17A2.5 2.5 0 0 1 4 14.5z"/></symbol>
<symbol id="i-profil" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></symbol>
<symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
<symbol id="i-telecharger" viewBox="0 0 24 24"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></symbol>
<symbol id="i-fleche" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
<symbol id="i-epee" viewBox="0 0 24 24"><path d="M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2"/></symbol>
<symbol id="i-pioche" viewBox="0 0 24 24"><path d="M14 4c3 0 6 2 7 5-3-1-6-1-9 1M10 10 3 21"/><path d="M14 4c-3 1-5 3-6 6"/></symbol>
<symbol id="i-crane" viewBox="0 0 24 24"><path d="M5 20v-2a7 7 0 0 1 14 0v2"/><path d="M6 11a6 6 0 1 1 12 0"/><path d="M9 11h.01M15 11h.01"/></symbol>
<symbol id="i-langues" viewBox="0 0 24 24"><path d="M4 5h9M8 3v2M6 5c0 4 3 7 6 8M11 5c0 3-3 7-7 9"/><path d="m13 21 4-9 4 9M14.5 18h5"/></symbol>
<symbol id="i-boutique" viewBox="0 0 24 24"><path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></symbol>
<symbol id="i-aide" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/></symbol>
<symbol id="i-fermer" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></symbol>
<symbol id="i-jouer" viewBox="0 0 24 24"><path d="M7 4.5v15l12-7.5z"/></symbol>
<symbol id="i-livre" viewBox="0 0 24 24"><path d="M6 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M8 3v18M11 8h4M11 12h4"/></symbol>
<symbol id="i-sac" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="12" rx="3"/><path d="M9 8V6a3 3 0 0 1 6 0v2M4 13h16M11 13v2h2v-2"/></symbol>
<symbol id="i-fantome" viewBox="0 0 24 24"><path d="M5 20V11a7 7 0 0 1 14 0v9l-2.5-1.8L14 20l-2-1.6L10 20l-2.5-1.8z"/><path d="M9.5 11h.01M14.5 11h.01"/></symbol>
<symbol id="i-bouclier" viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/></symbol>
<symbol id="i-groupe" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.2a5 5 0 0 1 5.5 4.8"/></symbol>
<symbol id="i-courrier" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/></symbol>
<symbol id="i-cle" viewBox="0 0 24 24"><circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3M14 9l2 2"/></symbol>
<symbol id="i-sortie" viewBox="0 0 24 24"><path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M15 8l-4 4 4 4M11 12h10"/></symbol>
<symbol id="i-lien" viewBox="0 0 24 24"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/></symbol>
<symbol id="i-copie" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></symbol>
<symbol id="i-envoyer" viewBox="0 0 24 24"><path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/></symbol>
<symbol id="i-coche" viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></symbol>
<symbol id="i-manette" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3M15 12h.01M17.5 13.5h.01"/></symbol>
<symbol id="i-panier" viewBox="0 0 24 24"><path d="M3 4h2l2.5 11h11L21 8H6.5"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/></symbol>
<symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>
<symbol id="i-portable" viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/></symbol>
<symbol id="i-ecran" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/></symbol>
</defs></svg>`;

/* ------------------------------------------------------------ en-tête et pied */
function lienMenu(page, cle) {
  const actuelle = document.body.dataset.page === page;
  return `<a href="${SITE.pages[page]}" data-t="${cle}"${actuelle ? ' aria-current="page"' : ""}>${Site.t(cle)}</a>`;
}

function poserEntete() {
  const place = document.getElementById("site-tete");
  if (!place) return;
  const plein = place.dataset.style === "plein";
  place.outerHTML = `
<header class="site-tete${plein ? " plein" : ""}" id="site-tete">
  <a class="logo" href="/" aria-label="Origins"><img src="/commun/images/oeil-regard.svg" alt="" width="40" height="40"><span aria-hidden="true">RIGINS</span></a>
  <nav class="site-menu" id="site-menu" aria-label="Site Origins">
    ${lienMenu("accueil", "menuAccueil")}${lienMenu("jeux", "menuJeux")}${lienMenu("actus", "menuActus")}${lienMenu("boutique", "menuBoutique")}${lienMenu("telecharger", "menuTelecharger")}${lienMenu("support", "menuSupport")}
  </nav>
  <div class="site-actions">
    <div class="langue">
      <button class="contour-carre" id="bouton-langue" type="button" aria-haspopup="listbox" aria-expanded="false" data-t-aria="langue">${Site.icone("globe")}<span id="code-langue">FR</span>${Site.icone("chevron")}</button>
      <ul id="liste-langues" role="listbox" hidden></ul>
    </div>
    <a class="contour-carre" href="${SITE.discord}" target="_blank" rel="noopener" data-t-aria="discordOrigins" title="Discord">${Site.icone("bulle")}</a>
    <div class="zone-compte" id="zone-compte"></div>
    <button class="contour-carre bouton-menu" id="bouton-menu" type="button" aria-expanded="false" aria-controls="site-menu" data-t-aria="menu">${Site.icone("menu")}</button>
  </div>
</header>`;
}

function poserPied() {
  const place = document.getElementById("site-pied");
  if (!place) return;
  place.outerHTML = `
<footer class="site-pied" id="site-pied">
  <div class="contenant">
    <div class="grille">
      <div class="presentation">
        <a class="logo" href="/" aria-label="Origins"><img src="/commun/images/oeil-regard.svg" alt="" width="40" height="40"><span aria-hidden="true">RIGINS</span></a>
        <p data-t="piedPresentation">${Site.t("piedPresentation")}</p>
      </div>
      <div class="colonne"><span data-t="piedJeux">${Site.t("piedJeux")}</span><a href="${SITE.pages.jeux}">Tempest</a></div>
      <div class="colonne"><span data-t="piedOrigins">${Site.t("piedOrigins")}</span>
        <a href="${SITE.pages.actus}" data-t="piedActus">${Site.t("piedActus")}</a>
        <a href="${SITE.pages.boutique}" data-t="piedBoutique">${Site.t("piedBoutique")}</a>
        <a href="${SITE.pages.telecharger}" data-t="piedTelecharger">${Site.t("piedTelecharger")}</a></div>
      <div class="colonne"><span data-t="piedAide">${Site.t("piedAide")}</span>
        <a href="${SITE.pages.support}" data-t="piedSupport">${Site.t("piedSupport")}</a>
        <a href="${SITE.pages.telecharger}#installer" data-t="piedInstaller">${Site.t("piedInstaller")}</a>
        <a href="${SITE.pages.telecharger}#questions" data-t="piedQuestions">${Site.t("piedQuestions")}</a></div>
      <div class="colonne"><span data-t="piedEquipe">${Site.t("piedEquipe")}</span>
        <a href="${SITE.board}" data-t="piedBoard">${Site.t("piedBoard")}</a>
        <a href="${SITE.discord}" target="_blank" rel="noopener" data-t="piedDiscord">${Site.t("piedDiscord")}</a></div>
    </div>
    <div class="bas"><p data-t="mentions">${Site.t("mentions")}</p><p>© 2026 Origins</p></div>
  </div>
</footer>`;
}

/* ------------------------------------------------------------ compte (connexion par le launcher) */
let compteCharge = false;   // zone vide tant que /site/moi n'a pas répondu : pas de « Se connecter » qui clignote

function fermerMenuCompte() {
  const menu = document.getElementById("menu-compte");
  const bouton = document.getElementById("bouton-compte");
  if (menu) menu.hidden = true;
  if (bouton) bouton.setAttribute("aria-expanded", "false");
}

function dessinerCompte() {
  const zone = document.getElementById("zone-compte");
  if (!zone) return;
  if (!CONNEXION || !compteCharge) { zone.innerHTML = ""; return; }
  const moi = Site.moi;
  if (!moi) {
    const ici = location.pathname + location.search;
    const suite = location.pathname.startsWith("/connexion/") || ici === "/" ? "" : "?suite=" + encodeURIComponent(ici);
    zone.innerHTML = `<a class="bouton-connexion" href="/connexion/${suite}">${Site.icone("profil")}<span>${Site.echapper(Site.t("seConnecter"))}</span></a>`;
    return;
  }
  const board = moi.equipe.includes("board");
  zone.innerHTML = `
    ${board ? `<a class="bouton-board" href="${SITE.board}">${Site.icone("bouclier")}<span>Board</span></a>` : ""}
    <div class="compte">
      <button class="contour-carre bouton-compte" id="bouton-compte" type="button" aria-haspopup="menu" aria-expanded="false" aria-controls="menu-compte" aria-label="${Site.echapper(Site.t("compte"))}">
        ${Site.avatar(moi.profil.nom, moi.profil.avatar)}<span class="nom-compte">${Site.echapper(moi.profil.nom)}</span>${Site.icone("chevron")}</button>
      <ul class="menu-compte" id="menu-compte" role="menu" hidden>
        <li role="none"><a role="menuitem" href="/profil/">${Site.echapper(Site.t("monProfil"))}</a></li>
        <li role="none"><a role="menuitem" href="/profil/#achats">${Site.echapper(Site.t("mesAchats"))}</a></li>
        <li role="none"><a role="menuitem" href="/profil/#tickets">${Site.echapper(Site.t("mesTickets"))}</a></li>
        ${board ? `<li role="none"><a role="menuitem" href="${SITE.board}">${Site.echapper(Site.t("boardEquipe"))}</a></li>` : ""}
        <li role="none"><button role="menuitem" type="button" id="se-deconnecter">${Site.icone("sortie")}${Site.echapper(Site.t("seDeconnecter"))}</button></li>
      </ul>
    </div>`;
  const bouton = document.getElementById("bouton-compte");
  const menu = document.getElementById("menu-compte");
  bouton.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.hidden = !menu.hidden;
    bouton.setAttribute("aria-expanded", String(!menu.hidden));
  });
  document.getElementById("se-deconnecter").addEventListener("click", async () => {
    await Site.appel("/site/deconnexion", { methode: "POST" }).catch(() => null);
    Site.moi = null;
    location.href = "/";
  });
}

async function chargerCompte() {
  if (!CONNEXION) return null;
  const r = await Site.appel("/site/moi").catch(() => ({ ok: false }));
  Site.moi = r.ok ? r.json : null;
  compteCharge = true;
  dessinerCompte();
  return Site.moi;
}

/* ------------------------------------------------------------ langues */
function detecterLangue() {
  const gardee = Site.lire("origins-langue");
  if (gardee && TEXTES_SITE[gardee]) return gardee;
  for (const l of navigator.languages || [navigator.language || "fr"]) {
    const court = String(l).slice(0, 2).toLowerCase();
    if (TEXTES_SITE[court]) return court;
  }
  return "fr";
}

function traduire() {
  document.documentElement.lang = Site.langue === "pt" ? "pt-BR" : Site.langue;
  document.querySelectorAll("[data-t]").forEach((el) => { el.textContent = Site.t(el.dataset.t); });
  document.querySelectorAll("[data-t-aria]").forEach((el) => { el.setAttribute("aria-label", Site.t(el.dataset.tAria)); });
  document.querySelectorAll("[data-t-placeholder]").forEach((el) => { el.setAttribute("placeholder", Site.t(el.dataset.tPlaceholder)); });
  const titre = document.body.dataset.titre;
  if (titre) document.title = Site.t(titre) + " · Origins";
  const code = document.getElementById("code-langue");
  if (code) code.textContent = Site.langue.toUpperCase();
  const liste = document.getElementById("liste-langues");
  if (liste) {
    liste.innerHTML = LANGUES.map((l) => `<li><button type="button" role="option" data-langue="${l.code}" aria-selected="${l.code === Site.langue}">${l.nom}<small>${l.code.toUpperCase()}</small></button></li>`).join("");
  }
  dessinerCompte();
  if (typeof window.rendrePage === "function") window.rendrePage(Site.langue);
}

function choisirLangue(code) {
  if (!TEXTES_SITE[code]) return;
  Site.langue = code;
  Site.ecrire("origins-langue", code);
  traduire();
}

function brancherEntete() {
  const bouton = document.getElementById("bouton-langue");
  const liste = document.getElementById("liste-langues");
  if (bouton && liste) {
    const fermer = () => { liste.hidden = true; bouton.setAttribute("aria-expanded", "false"); };
    bouton.addEventListener("click", (e) => {
      e.stopPropagation();
      const ouvrir = liste.hidden;
      liste.hidden = !ouvrir;
      bouton.setAttribute("aria-expanded", String(ouvrir));
    });
    liste.addEventListener("click", (e) => {
      const choix = e.target.closest("[data-langue]");
      if (!choix) return;
      choisirLangue(choix.dataset.langue);
      fermer();
      bouton.focus();
    });
    document.addEventListener("click", (e) => { if (!e.target.closest(".langue")) fermer(); if (!e.target.closest(".compte")) fermerMenuCompte(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { fermer(); fermerMenuCompte(); } });
  }
  const menu = document.getElementById("site-menu");
  const boutonMenu = document.getElementById("bouton-menu");
  if (menu && boutonMenu) {
    boutonMenu.addEventListener("click", () => {
      const ouvert = menu.classList.toggle("ouvert");
      boutonMenu.setAttribute("aria-expanded", String(ouvert));
    });
  }
}

/* ------------------------------------------------------------ démarrage */
document.body.insertAdjacentHTML("afterbegin", SPRITE);
poserEntete();
poserPied();
Site.langue = detecterLangue();
brancherEntete();
traduire();
window.Site = Site;
window.SITE = SITE;
window.CONNEXION = CONNEXION;
window.dessinerCompte = dessinerCompte;
Site.moiPret = chargerCompte();
