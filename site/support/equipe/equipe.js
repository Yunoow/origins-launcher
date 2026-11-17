/* Boîte du staff : files de tickets, conversation (réponse ou note interne), actions, fiche du joueur. */
"use strict";
(function () {
  const $ = (id) => document.getElementById(id);
  const e = (x) => Site.echapper(x);
  const main = $("equipe");
  const VUES = [
    { id: "non_attribues", nom: "Non attribués", icone: "bulle", compteur: "non_attribues", rouge: true },
    { id: "miens", nom: "Les miens", icone: "profil", compteur: "miens" },
    { id: "attente", nom: "En attente du joueur", icone: "fleche", compteur: "attente" },
    { id: "resolus", nom: "Résolus (7 jours)", icone: "coche", compteur: "resolus" },
    { id: "transcripts", nom: "Transcripts", icone: "livre", compteur: "transcripts" }
  ];
  const CAT = { connexion: "Connexion", bug: "Bug en jeu", launcher: "Launcher", achat: "Achat", signalement: "Signalement", question: "Question" };
  const SYS = { prend: "a pris le ticket", attente: "a mis le ticket en attente du joueur", resolu: "a résolu le ticket", rouvre: "a rouvert le ticket" };
  let vue = "non_attribues", categorie = "", recherche = "", liste = [], compteurs = {}, courant = null, detail = null, mode = "reponse", captures = null;

  function etatHtml(t) {
    const nom = t.etat === "resolu" ? "RÉSOLU" : t.etat === "attente" ? "EN ATTENTE DU JOUEUR" : t.prisPar ? "EN COURS" : "NON ATTRIBUÉ";
    const classe = t.etat === "resolu" ? "resolu" : t.etat === "attente" ? "attente" : t.prisPar ? "en_cours" : "ouvert";
    return `<span class="etat etat-${classe}">${nom}</span>`;
  }
  function avis(texte) {
    let p = $("avis-tickets");
    if (!p) { p = document.createElement("p"); p.id = "avis-tickets"; p.className = "avis-tickets"; p.setAttribute("role", "status"); document.body.appendChild(p); }
    p.textContent = texte; p.hidden = false; clearTimeout(avis.m); avis.m = setTimeout(() => { p.hidden = true; }, 3500);
  }

  function squelette() {
    main.removeAttribute("aria-busy");
    main.innerHTML = `<div class="boite">
      <nav class="cote" aria-label="Files de tickets">
        <div class="kicker">TICKETS</div><h1>Boîte du staff</h1>
        <div class="vues" id="vues"></div>
        <div class="cats"><span class="kicker">CATÉGORIES</span><div id="cats"></div></div>
      </nav>
      <section class="colonne-liste" aria-label="Tickets">
        <div class="recherche">${Site.icone("aide")}<input id="recherche" type="search" placeholder="Chercher un ticket, un pseudo…" aria-label="Chercher un ticket, un pseudo"></div>
        <div id="liste"></div>
      </section>
      <section class="centre"><div class="conversation" id="panneau" aria-live="polite"></div></section>
      <aside class="fiche" id="fiche" aria-label="Joueur"></aside>
    </div>`;
    $("recherche").addEventListener("input", () => { clearTimeout(squelette.m); squelette.m = setTimeout(() => { recherche = $("recherche").value.trim(); charger(); }, 250); });
    main.addEventListener("click", clic);
  }

  function dessinerCote() {
    $("vues").innerHTML = VUES.map((v) => `<button type="button" data-vue="${v.id}" aria-pressed="${vue === v.id}">${Site.icone(v.icone)}${e(v.nom)}
      ${v.rouge && compteurs[v.compteur] ? '<span class="rouge" aria-hidden="true"></span>' : ""}<span class="n" style="${v.rouge && compteurs[v.compteur] ? "margin-left: 8px" : ""}">${compteurs[v.compteur] ?? ""}</span></button>`).join("");
    $("cats").innerHTML = Object.entries(CAT).map(([c, n]) => `<button type="button" class="cat-${c}" data-categorie="${c}" aria-pressed="${categorie === c}">${e(n)}</button>`).join("");
  }

  async function charger() {
    const q = new URLSearchParams({ vue, ...(categorie ? { categorie } : {}), ...(recherche ? { q: recherche } : {}) });
    const r = await Site.appel(`/site/equipe/tickets?${q}`).catch(() => ({ ok: false }));
    if (r.statut === 403 || r.statut === 401) return refuser();
    if (!r.ok) return;
    liste = r.json.tickets; compteurs = r.json.compteurs;
    dessinerCote();
    $("liste").innerHTML = liste.length ? liste.map((t) => `
      <button type="button" class="ticket-item" data-ticket="${t.id}" aria-current="${courant === t.id}">
        ${Site.avatar(t.joueur.nom, t.joueur.avatar)}
        <span class="contenu"><strong>${e(t.sujet)}</strong>
          <span class="meta">${e(t.joueur.nom)} · ${e(CAT[t.categorie])} · ${e(Tickets.ilYa(t.majLe))}</span>${etatHtml(t)}</span>
        ${t.nonLu ? '<span class="point-non-lu" aria-hidden="true"></span>' : ""}
      </button>`).join("") : `<p class="liste-vide">Rien ici pour l'instant.</p>`;
    if (courant === null && liste[0] && !location.hash) ouvrir(liste[0].id);
  }

  async function ouvrir(id, silencieux) {
    const r = await Site.appel(`/site/tickets/${id}?vue=staff`).catch(() => ({ ok: false }));
    if (!r.ok) return;
    const avant = detail && detail.ticket.id === id ? detail.messages.length : -1;
    detail = r.json; courant = id;
    if (silencieux && avant === detail.messages.length) return;
    const garde = $("reponse") ? $("reponse").value : "";
    dessinerTicket();
    if (garde && $("reponse")) $("reponse").value = garde;
    document.querySelectorAll("[data-ticket]").forEach((b) => b.setAttribute("aria-current", String(Number(b.dataset.ticket) === id)));
    history.replaceState(null, "", "#ticket-" + id);
  }

  function dessinerTicket() {
    const { ticket: t, messages, joueur } = detail;
    const moi = Site.moi ? Site.moi.profil.id : null;
    const ferme = t.etat === "resolu";
    const nomJoueur = joueur ? joueur.nom : "le joueur";
    $("panneau").innerHTML = `
      <div class="conv-tete">
        <div>
          <div class="numero">Ticket #${t.id}</div>
          <h2>${e(t.sujet)}</h2>
          <div class="lignes"><span class="cat cat-${e(t.categorie)}">${e(CAT[t.categorie])}</span>${etatHtml(t)}${t.prisPar ? `<span>Pris par <b>${e(t.prisPar.nom)}</b></span>` : ""}</div>
        </div>
        <div class="actions">
          ${ferme ? `<button class="bouton bouton-contour bouton-petit" data-action="rouvrir">Rouvrir</button>`
            : `${!t.prisPar || t.prisPar.id !== moi ? `<button class="bouton bouton-contour bouton-petit" data-action="prendre">${Site.icone("profil")}Prendre</button>` : ""}
               ${t.etat !== "attente" ? `<button class="bouton bouton-contour bouton-petit" data-action="attente">${Site.icone("fleche")}En attente</button>` : ""}
               <button class="bouton bouton-or bouton-petit" data-action="resoudre">${Site.icone("coche")}Résoudre</button>`}
          <a class="bouton bouton-contour bouton-petit" href="${SITE.api}/site/equipe/tickets/${t.id}/transcript">${Site.icone("telecharger")}Transcript</a>
        </div>
      </div>
      ${ferme ? `<div class="ferme-bandeau" style="margin-top: 16px">Résolu : le transcript est enregistré (notes comprises) et ${e(nomJoueur)} garde sa copie, sans les notes.</div>` : ""}
      <div class="fil" id="fil">${Tickets.fil(messages, { moi, texteSysteme: (m) => `${m.auteur ? m.auteur.nom : "?"} ${SYS[m.texte] || m.texte}`, etiquetteStaff: "STAFF", etiquetteNote: "NOTE INTERNE · le joueur ne la voit pas" })}</div>
      <form class="composer${mode === "note" ? " note" : ""}" id="form-reponse">
        <div class="onglets-composer">
          <button type="button" data-mode="reponse" aria-pressed="${mode === "reponse"}">Répondre à ${e(nomJoueur)}</button>
          <button type="button" data-mode="note" aria-pressed="${mode === "note"}">${Site.icone("cle")}Note interne</button>
        </div>
        <textarea id="reponse" maxlength="4000" aria-label="${mode === "note" ? "Note interne" : "Réponse"}" placeholder="${mode === "note" ? "Une note pour l'équipe : le joueur ne la voit pas…" : `Écris à ${e(nomJoueur)}…`}"></textarea>
        <div class="composer-bas">
          <label class="bouton-joindre">${Site.icone("plus")}Capture<input type="file" id="fichiers-reponse" accept="image/png,image/jpeg,image/gif,image/webp" multiple hidden></label>
          <span class="joints" id="joints-reponse"></span><span class="espace"></span>
          <button class="bouton bouton-blanc bouton-petit" type="submit" id="envoyer-reponse">${Site.icone("envoyer")}${mode === "note" ? "Ajouter la note" : "Envoyer"}</button>
        </div>
        <p class="erreur-form" id="erreur-reponse" hidden></p>
      </form>`;
    const fil = $("fil"); fil.scrollTop = fil.scrollHeight;
    captures = Tickets.captures({ input: $("fichiers-reponse"), rendu: $("joints-reponse"), onErreur: (c) => { const p = $("erreur-reponse"); p.textContent = c === "err_FILE_TOO_LARGE" ? "Une capture dépasse 5 Mo." : c === "err_TOO_MANY_FILES" ? "3 captures au plus." : "Seulement des images."; p.hidden = false; }, texteRetirer: "Retirer" });
    $("form-reponse").addEventListener("submit", repondre);
    dessinerFiche(joueur);
  }

  function dessinerFiche(j) {
    if (!j) { $("fiche").innerHTML = ""; return; }
    $("fiche").innerHTML = `
      ${Site.avatar(j.nom, j.avatar, "grand")}
      <h2>${e(j.nom)}</h2>
      <div class="id">Origins ID <code>${e(j.originsId || "—")}</code></div>
      <dl>
        <div class="ligne"><dt>Minecraft</dt><dd>${e(j.minecraft || "—")}</dd></div>
        <div class="ligne"><dt>En jeu</dt><dd class="${j.enLigne ? "vert" : ""}">${j.enLigne ? "● en ligne" : "hors ligne"}</dd></div>
        <div class="ligne"><dt>Discord</dt><dd>${j.discordLie ? "lié" : "pas lié"}</dd></div>
        <div class="ligne"><dt>Profil créé</dt><dd>${e(new Date(j.creeLe).toLocaleDateString("fr-FR", { month: "short", year: "numeric" }))}</dd></div>
      </dl>
      <h3>TICKETS DU JOUEUR</h3>
      ${j.tickets.map((x) => `<a class="precedent" href="#ticket-${x.id}">${e(x.sujet)}<span>#${x.id} · ${x.etat === "resolu" ? "résolu" : "en cours"}</span></a>`).join("")}`;
  }

  async function repondre(ev) {
    ev.preventDefault();
    const texte = $("reponse").value.trim();
    if (!texte && !captures.liste().length) return;
    $("envoyer-reponse").disabled = true;
    const r = await Tickets.envoyer(`/site/tickets/${courant}/messages`, { texte, commeStaff: "1", interne: mode === "note" ? "1" : undefined }, captures.liste()).catch(() => ({ ok: false }));
    $("envoyer-reponse").disabled = false;
    if (!r.ok) { const p = $("erreur-reponse"); p.textContent = r.json && r.json.error === "TOO_MANY_MESSAGES" ? "Trop de messages d'un coup : attends un peu." : "L'envoi n'a pas marché."; p.hidden = false; return; }
    $("reponse").value = ""; captures.vider();
    await ouvrir(courant); charger();
  }

  async function action(nom) {
    const r = await Site.appel(`/site/equipe/tickets/${courant}/${nom}`, { methode: "POST" }).catch(() => ({ ok: false }));
    if (!r.ok) return avis("Ça n'a pas marché.");
    avis({ prendre: "Ticket pris.", attente: "En attente du joueur.", resoudre: "Ticket résolu.", rouvrir: "Ticket rouvert." }[nom]);
    await ouvrir(courant); charger();
  }

  function clic(ev) {
    const v = ev.target.closest("[data-vue]");
    if (v) { vue = v.dataset.vue; courant = null; return charger(); }
    const c = ev.target.closest("[data-categorie]");
    if (c) { categorie = categorie === c.dataset.categorie ? "" : c.dataset.categorie; return charger(); }
    const t = ev.target.closest("[data-ticket]");
    if (t) return ouvrir(Number(t.dataset.ticket));
    const a = ev.target.closest("[data-action]");
    if (a) return action(a.dataset.action);
    const m = ev.target.closest("[data-mode]");
    if (m) { mode = m.dataset.mode; const garde = $("reponse").value; dessinerTicket(); $("reponse").value = garde; $("reponse").focus(); }
  }

  function refuser() {
    main.removeAttribute("aria-busy");
    const connecte = Boolean(Site.moi);
    main.innerHTML = `<section class="carte acces">
      <div class="kicker">ÉQUIPE ORIGINS</div><h1>Réservé à l'équipe</h1>
      <p>La Boîte du staff s'ouvre avec le grade staff ou board du Discord d'Origins. ${connecte ? "Lie (ou relie) ton Discord à ton profil : tes grades sont relus à ce moment-là, puis toutes les 15 minutes." : "Connecte-toi d'abord avec ton profil Origins."}</p>
      <p style="margin-top: 22px">${connecte ? `<a class="bouton bouton-blanc" href="${SITE.api}/site/discord/lier">${Site.icone("bulle")}VÉRIFIER AVEC DISCORD</a>` : `<a class="bouton bouton-blanc" href="/connexion/?suite=%2Fsupport%2Fequipe%2F">SE CONNECTER</a>`}</p>
    </section>`;
  }

  window.addEventListener("hashchange", () => { const m = /^#ticket-(\d+)$/.exec(location.hash); if (m && Number(m[1]) !== courant) ouvrir(Number(m[1])); });

  Site.moiPret.then(async (moi) => {
    if (!moi) { const r = await Site.appel("/site/moi").catch(() => ({ ok: false })); if (r.ok) Site.moi = moi = r.json; }
    if (!moi || !moi.equipe.includes("staff")) return refuser();
    squelette();
    await charger();
    const m = /^#ticket-(\d+)$/.exec(location.hash);
    if (m) ouvrir(Number(m[1]));
    setInterval(() => { if (document.hidden) return; charger(); if (courant) ouvrir(courant, true); }, 15000);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) { charger(); if (courant) ouvrir(courant, true); } });
  });
})();
