/* Page « Se connecter » (design/site/Site-Connexion.dc.html) : choix → attente → connecté, et l'accès équipe.
   La demande part au launcher (POST /api/site/demandes) ; le site regarde son état toutes les 2 secondes.
   Le cookie de session est posé par l'API (HttpOnly) : cette page ne voit jamais le jeton. */
"use strict";
(function () {
  const ETATS = ["choix", "attente", "connecte", "equipe"];
  const $ = (id) => document.getElementById(id);
  const parametres = new URLSearchParams(location.search);
  const suite = sure(parametres.get("suite"));
  let demande = null;      // { id, code, expire, qui }
  let minuterie = null;
  let messageCle = parametres.get("lien") === "expire" ? "lienExpire" : null;

  /** Un chemin du site seulement (jamais un autre site). */
  function sure(valeur) {
    const s = String(valeur || "");
    return s.startsWith("/") && !s.startsWith("//") && !s.includes("\\") && !s.startsWith("/connexion/") ? s : "";
  }

  function montrer(etat) {
    for (const e of ETATS) $("etat-" + e).hidden = e !== etat;
    $("lien-equipe").hidden = etat !== "choix";
    document.body.dataset.etat = etat;
  }

  function message(cle) {
    messageCle = cle;
    const p = $("message");
    p.hidden = !cle;
    p.textContent = cle ? Site.t(cle) : "";
  }

  function dessinerConnecte() {
    const moi = Site.moi;
    if (!moi) return;
    $("connecte-avatar").innerHTML = Site.avatar(moi.profil.nom, moi.profil.avatar, "avatar-xl");
    $("titre-connecte").textContent = Site.t("bienvenue", { nom: moi.profil.nom });
    $("connecte-id").textContent = moi.profil.originsId || "—";
    const bouton = $("connecte-suite");
    bouton.href = suite || "/profil/";
    bouton.textContent = Site.t(suite && suite !== "/profil/" ? "continuer" : "monProfilMaj");
  }

  function decompte() {
    if (!demande) return;
    const reste = Math.max(0, Math.round((Date.parse(demande.expire) - Date.now()) / 1000));
    const m = Math.floor(reste / 60), s = reste % 60;
    const t = m ? Site.t("minutes", { m, s: String(s).padStart(2, "0") }) : Site.t("secondes", { s });
    $("decompte").textContent = Site.t("expireDans", { t });
  }

  function arreter() {
    clearInterval(minuterie);
    minuterie = null;
  }

  async function regarder() {
    if (!demande) return;
    decompte();
    // L'état n'est demandé que toutes les 2 s (le décompte, lui, avance chaque seconde).
    if ((Date.now() - (demande.vu || 0)) < 1900) return;
    demande.vu = Date.now();
    let r;
    try { r = await Site.appel(`/site/demandes/${encodeURIComponent(demande.id)}`); } catch (_) { return; }
    const etat = r.json?.etat;
    if (etat === "attente") return;
    arreter();
    demande = null;
    if (etat === "acceptee") {
      await chargerMoi();
      if (Site.moi) { dessinerConnecte(); montrer("connecte"); return; }
    }
    message(etat === "refusee" ? "refusee" : etat === "annulee" ? "annulee" : "expiree");
    montrer("choix");
  }

  async function chargerMoi() {
    const r = await Site.appel("/site/moi").catch(() => ({ ok: false }));
    Site.moi = r.ok ? r.json : null;
    // Connecté ici : l'en-tête affiche le compte dans ce navigateur, même en mode essai.
    if (Site.moi) { try { localStorage.setItem("origins-connexion-essai", "1"); } catch (_) { /* rien */ } }
    if (typeof window.dessinerCompte === "function") window.dessinerCompte();
  }

  async function envoyer(e) {
    e.preventDefault();
    const identifiant = $("identifiant").value.trim();
    if (!identifiant) { message("vide"); $("identifiant").focus(); return; }
    const bouton = $("envoyer");
    bouton.disabled = true;
    try {
      const r = await Site.appel("/site/demandes", { methode: "POST", corps: { identifiant } });
      if (r.statut === 429) { message("tropDeDemandes"); return; }
      if (!r.ok) { message("erreur"); return; }
      message(null);
      demande = { id: r.json.id, code: r.json.code, expire: r.json.expire, vu: Date.now() };
      $("attente-qui").textContent = identifiant;
      $("code").textContent = r.json.code;
      $("code").setAttribute("aria-label", r.json.code.replace(/\s·\s/, " "));
      decompte();
      montrer("attente");
      minuterie = setInterval(regarder, 1000);
    } catch (_) {
      message("erreur");
    } finally {
      bouton.disabled = false;
    }
  }

  async function annuler() {
    if (demande) await Site.appel(`/site/demandes/${encodeURIComponent(demande.id)}`, { methode: "DELETE" }).catch(() => null);
    arreter();
    demande = null;
    message(null);
    montrer("choix");
    $("identifiant").focus();
  }

  function equipe(ouvrir) {
    if (ouvrir) { montrer("equipe"); history.replaceState(null, "", "#equipe"); }
    else { montrer("choix"); history.replaceState(null, "", location.pathname + location.search); }
  }

  // Textes qui changent avec la langue.
  const rendreAvant = window.rendrePage;
  window.rendrePage = function (langue) {
    if (typeof rendreAvant === "function") rendreAvant(langue);
    if (messageCle) message(messageCle);
    decompte();
    dessinerConnecte();
  };

  // Le bouton Discord du Board : la connexion de la Console (/connexion sur l'adresse du Board).
  $("board-discord").href = new URL("/connexion", SITE.board).href;
  $("formulaire").addEventListener("submit", envoyer);
  $("annuler").addEventListener("click", annuler);
  $("lien-equipe").addEventListener("click", (e) => { e.preventDefault(); equipe(true); });
  $("retour-choix").addEventListener("click", (e) => { e.preventDefault(); equipe(false); });
  window.addEventListener("beforeunload", () => {
    // Quitter la page annule la demande en cours (le launcher la retire de la cloche).
    if (demande) fetch(`${SITE.api}/site/demandes/${encodeURIComponent(demande.id)}`, { method: "DELETE", headers: { "X-Origins-Site": "1" }, keepalive: true }).catch(() => null);
  });

  // Départ : déjà connecté ? sinon le choix (ou l'équipe avec #equipe).
  Site.moiPret.then(async (moi) => {
    if (!moi && !window.CONNEXION) { await chargerMoi(); moi = Site.moi; }
    if (moi) { dessinerConnecte(); montrer("connecte"); return; }
    if (location.hash === "#equipe") { montrer("equipe"); return; }
    if (messageCle) message(messageCle);
    montrer("choix");
  });
})();
