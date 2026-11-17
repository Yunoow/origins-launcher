/* Support, côté joueur : ses tickets (en cours, fermés), la conversation, et « Nouveau ticket ». */
"use strict";
(function () {
  const $ = (id) => document.getElementById(id);
  const e = (x) => Site.echapper(x);
  const t = (cle, v) => Site.t(cle, v);
  let tickets = [];
  let onglet = "cours";
  let courant = null;      // numéro du ticket ouvert, ou "nouveau"
  let detail = null;       // { ticket, messages }
  let brouillon = null;    // pré-remplissage du formulaire (« Rouvrir un ticket sur ce sujet »)
  let captures = null;
  let minuterie = null;

  function avis(texte) {
    let p = $("avis-tickets");
    if (!p) { p = document.createElement("p"); p.id = "avis-tickets"; p.className = "avis-tickets"; p.setAttribute("role", "status"); document.body.appendChild(p); }
    p.textContent = texte; p.hidden = false;
    clearTimeout(avis.m); avis.m = setTimeout(() => { p.hidden = true; }, 4500);
  }
  function erreur(r) { return t(r && r.json && r.json.error && Site.t("err_" + r.json.error) !== "err_" + r.json.error ? "err_" + r.json.error : "err"); }
  const etat = (x) => `<span class="etat etat-${e(x)}">${e(t("etat_" + x))}</span>`;
  const cat = (x) => `<span class="cat cat-${e(x)}">${e(t("cat_" + x))}</span>`;

  /* ---------- liste ---------- */
  async function chargerListe() {
    const r = await Site.appel("/site/tickets").catch(() => ({ ok: false }));
    tickets = r.ok ? r.json.tickets : [];
    dessinerListe();
  }
  function dessinerListe() {
    const cours = tickets.filter((x) => x.etat !== "resolu");
    const fermes = tickets.filter((x) => x.etat === "resolu");
    $("nb-cours").textContent = cours.length;
    $("nb-fermes").textContent = fermes.length;
    document.querySelectorAll("[data-onglet]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.onglet === onglet)));
    const liste = onglet === "cours" ? cours : fermes;
    $("liste").innerHTML = liste.length ? liste.map((x) => `
      <button type="button" class="ticket-item" data-ticket="${x.id}" aria-current="${courant === x.id}">
        <span class="contenu"><strong>${e(x.sujet)}</strong>
          <span class="meta">#${x.id} · ${e(t("cat_" + x.categorie))} · ${e(Tickets.ilYa(x.majLe))}</span>${etat(x.etat)}</span>
        ${x.nonLu ? '<span class="point-non-lu" aria-hidden="true"></span>' : ""}
      </button>`).join("") : `<p class="liste-vide">${e(t(onglet === "cours" ? "aucunTicketCours" : "aucunTicketFerme"))}</p>`;
  }

  /* ---------- un ticket ---------- */
  function texteSysteme(m) { return t("sys_" + m.texte, { nom: m.auteur ? m.auteur.nom : "?" }); }

  async function ouvrir(id, silencieux) {
    const r = await Site.appel(`/site/tickets/${id}`).catch(() => ({ ok: false }));
    if (!r.ok) { if (!silencieux) { courant = null; dessinerVide(); } return; }
    const avant = detail && detail.ticket.id === id ? detail.messages.length : -1;
    detail = r.json;
    courant = id;
    if (silencieux && avant === detail.messages.length) return;
    const ta = $("reponse");
    const garde = ta ? ta.value : "";
    dessinerTicket();
    if (garde && $("reponse")) $("reponse").value = garde;
    const x = tickets.find((y) => y.id === id);
    if (x && x.nonLu) { x.nonLu = false; dessinerListe(); }
  }

  function dessinerTicket() {
    const { ticket: tk, messages } = detail;
    const moi = Site.moi ? Site.moi.profil.id : null;
    const ferme = tk.etat === "resolu";
    const resolu = [...messages].reverse().find((m) => m.role === "systeme" && m.texte === "resolu");
    $("panneau").innerHTML = `
      <div class="conv-tete">
        <div>
          <div class="numero">${e(t("ticketNo", { n: tk.id }))}</div>
          <h2>${e(tk.sujet)}</h2>
          <div class="lignes">${cat(tk.categorie)}${etat(tk.etat)}</div>
        </div>
        ${tk.prisPar ? `<div class="lignes">${e(t("prisPar"))} <b>${e(tk.prisPar.nom)}</b></div>` : ""}
      </div>
      <div class="fil" id="fil">${Tickets.fil(messages, { moi, texteSysteme, etiquetteStaff: t("staff"), etiquetteNote: "", nomMoi: Site.moi ? Site.moi.profil.nom : null })}</div>
      ${ferme ? `<div class="ferme-bandeau">${e(t("resoluTexte", { date: new Date(tk.resoluLe || tk.majLe).toLocaleDateString(), par: resolu && resolu.auteur ? t("resoluPar", { nom: resolu.auteur.nom }) : "" }))}
          <br><button type="button" class="lien-or" id="rouvrir-sujet">${e(t("revient"))} ${e(t("rouvrirSujet"))} →</button></div>`
        : `<form class="composer" id="form-reponse">
          <label class="sr" for="reponse">${e(t("ecrisReponse"))}</label>
          <textarea id="reponse" maxlength="4000" placeholder="${e(t("ecrisReponse"))}"></textarea>
          <div class="composer-bas">
            <label class="bouton-joindre">${Site.icone("plus")}${e(t("joindre"))}<input type="file" id="fichiers-reponse" accept="image/png,image/jpeg,image/gif,image/webp" multiple hidden></label>
            <span class="joints" id="joints-reponse"></span><span class="espace"></span>
            <button class="bouton bouton-blanc bouton-petit" type="submit" id="envoyer-reponse">${Site.icone("envoyer")}${e(t("envoyer"))}</button>
          </div>
          <p class="erreur-form" id="erreur-reponse" hidden></p>
        </form>`}`;
    const fil = $("fil"); fil.scrollTop = fil.scrollHeight;
    dessinerListe();
    if (ferme) {
      $("rouvrir-sujet").addEventListener("click", () => { brouillon = { categorie: tk.categorie, sujet: tk.sujet }; aller("nouveau"); });
    } else {
      captures = Tickets.captures({ input: $("fichiers-reponse"), rendu: $("joints-reponse"), onErreur: (c) => montrerErreur("erreur-reponse", t(c)), texteRetirer: t("retirer") });
      $("form-reponse").addEventListener("submit", repondre);
    }
  }

  function montrerErreur(id, texte) { const p = $(id); if (p) { p.textContent = texte; p.hidden = !texte; } }

  async function repondre(ev) {
    ev.preventDefault();
    const texte = $("reponse").value.trim();
    if (!texte && !captures.liste().length) return;
    $("envoyer-reponse").disabled = true;
    const r = await Tickets.envoyer(`/site/tickets/${courant}/messages`, { texte }, captures.liste()).catch(() => ({ ok: false }));
    $("envoyer-reponse").disabled = false;
    if (!r.ok) { montrerErreur("erreur-reponse", erreur(r)); return; }
    $("reponse").value = "";
    captures.vider();
    await ouvrir(courant);
    chargerListe();
  }

  function dessinerVide() {
    $("panneau").innerHTML = `<div class="vide-conv">${Site.icone("courrier")}<p>${e(t("choisis"))}</p>
      <button type="button" class="bouton bouton-blanc bouton-petit" data-aller="nouveau">${Site.icone("plus")}${e(t("nouveauTicket"))}</button></div>`;
    dessinerListe();
  }

  /* ---------- nouveau ticket ---------- */
  function dessinerFormulaire() {
    courant = "nouveau";
    detail = null;
    const b = brouillon || {};
    $("panneau").innerHTML = `
      <form class="form-ticket" id="form-ticket" novalidate>
        <h2>${e(t("nouveauTitre"))}</h2>
        <div><span class="etiquette">${e(t("deQuoi"))}</span>
          <div class="puces-cat" role="group">${Tickets.CATEGORIES.map((c) => `<button type="button" class="cat-${c}" data-cat="${c}" aria-pressed="${b.categorie === c}">${e(t("cat_" + c))}</button>`).join("")}</div></div>
        <div><label for="sujet">${e(t("enUnePhrase"))}</label><input type="text" id="sujet" maxlength="120" placeholder="${e(t("phraseExemple"))}" value="${e(b.sujet || "")}"></div>
        <div><label for="message">${e(t("raconte"))}</label><textarea id="message" maxlength="4000" rows="6" placeholder="${e(t("raconteExemple"))}"></textarea></div>
        <div><span class="etiquette">${e(t("captures"))}</span>
          <div class="depot" id="depot">${e(t("glisse"))} <label><button type="button" onclick="this.nextElementSibling.click()">${e(t("choisisLes"))}</button><input type="file" id="fichiers-ticket" accept="image/png,image/jpeg,image/gif,image/webp" multiple hidden></label>
            <div class="petit discret" style="margin-top: 6px">${e(t("capturesAide"))}</div><div class="joints" id="joints-ticket" style="justify-content: center; margin-top: 8px"></div></div></div>
        <p class="erreur-form" id="erreur-ticket" hidden></p>
        <div class="form-bas"><span>${e(t("lieProfil"))}</span>
          <span style="display: flex; gap: 10px"><button type="button" class="bouton bouton-contour bouton-petit" data-aller="">${e(t("annuler"))}</button>
          <button type="submit" class="bouton bouton-blanc" id="envoyer-ticket">${Site.icone("envoyer")}${e(t("envoyerTicket"))}</button></span></div>
      </form>`;
    brouillon = null;
    captures = Tickets.captures({ input: $("fichiers-ticket"), zone: $("depot"), rendu: $("joints-ticket"), onErreur: (c) => montrerErreur("erreur-ticket", t(c)), texteRetirer: t("retirer") });
    $("form-ticket").addEventListener("click", (ev) => {
      const p = ev.target.closest("[data-cat]");
      if (p) document.querySelectorAll("[data-cat]").forEach((x) => x.setAttribute("aria-pressed", String(x === p)));
    });
    $("form-ticket").addEventListener("submit", creer);
    dessinerListe();
  }

  async function creer(ev) {
    ev.preventDefault();
    const choisie = document.querySelector("[data-cat][aria-pressed='true']");
    const sujet = $("sujet").value.trim();
    const message = $("message").value.trim();
    if (!choisie) return montrerErreur("erreur-ticket", t("err_INVALID_CATEGORY"));
    if (sujet.length < 3) return montrerErreur("erreur-ticket", t("err_SUBJECT_REQUIRED"));
    if (message.length < 3) return montrerErreur("erreur-ticket", t("err_MESSAGE_REQUIRED"));
    $("envoyer-ticket").disabled = true;
    const r = await Tickets.envoyer("/site/tickets", { categorie: choisie.dataset.cat, sujet, message }, captures.liste()).catch(() => ({ ok: false }));
    $("envoyer-ticket").disabled = false;
    if (!r.ok) return montrerErreur("erreur-ticket", erreur(r));
    avis(t("envoye"));
    onglet = "cours";
    await chargerListe();
    aller("ticket-" + r.json.id);
  }

  /* ---------- navigation (#ticket-1042, #nouveau) ---------- */
  function aller(cible) { location.hash = cible ? "#" + cible : ""; if (!cible) router(); }
  function router() {
    const h = location.hash.slice(1);
    if (h === "nouveau") return dessinerFormulaire();
    const m = /^ticket-(\d+)$/.exec(h);
    if (m) {
      const x = tickets.find((y) => y.id === Number(m[1]));
      if (x) onglet = x.etat === "resolu" ? "fermes" : "cours";
      return ouvrir(Number(m[1]));
    }
    const premier = tickets.find((x) => x.etat !== "resolu");
    if (premier) return aller("ticket-" + premier.id);
    courant = null;
    dessinerVide();
  }

  function demarrer() {
    document.body.classList.add("support-connecte");
    $("zone-tickets").hidden = false;
    $("nouveau-ticket").hidden = false;
    $("contacts").hidden = true;
    $("chapo").textContent = t("chapoConnecte");
    $("zone-tickets").addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-ticket]");
      if (b) return aller("ticket-" + b.dataset.ticket);
      const o = ev.target.closest("[data-onglet]");
      if (o) { onglet = o.dataset.onglet; dessinerListe(); }
      const a = ev.target.closest("[data-aller]");
      if (a) aller(a.dataset.aller);
    });
    $("nouveau-ticket").addEventListener("click", () => aller("nouveau"));
    window.addEventListener("hashchange", router);
    // Retour sur l’onglet : on rafraîchit tout de suite (sans attendre les 20 s).
    document.addEventListener("visibilitychange", () => { if (!document.hidden) { chargerListe(); if (typeof courant === "number") ouvrir(courant, true); } });
    chargerListe().then(router);
    // Les réponses de l'équipe arrivent sans recharger (toutes les 20 s, page visible).
    minuterie = setInterval(() => {
      if (document.hidden) return;
      chargerListe();
      if (typeof courant === "number") ouvrir(courant, true);
    }, 20000);
  }

  const rendreAvant = window.rendrePage;
  window.rendrePage = function (langue) {
    if (typeof rendreAvant === "function") rendreAvant(langue);
    if (!$("zone-tickets") || $("zone-tickets").hidden) return;
    $("chapo").textContent = t("chapoConnecte");
    if (courant === "nouveau") return;
    if (detail) dessinerTicket(); else dessinerVide();
  };

  Site.moiPret.then(async (moi) => {
    if (!moi && !window.CONNEXION) {
      const r = await Site.appel("/site/moi").catch(() => ({ ok: false }));
      if (r.ok) { Site.moi = moi = r.json; }
    }
    if (moi) demarrer();
    else $("carte-connexion-ticket").hidden = false;
  });
})();
