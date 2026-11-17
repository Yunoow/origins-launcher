/* Mon profil : construit depuis /api/site/moi et /api/site/sessions (pas connecté → /connexion/). */
"use strict";
(function () {
  const main = document.getElementById("profil");
  let sessions = [];
  let tickets = [];
  const AVIS_DISCORD = { lie: "discordLie", "deja-lie": "discordDejaLie", annule: "discordAnnule", expire: "discordExpire", erreur: "discordErreur", indisponible: "discordIndisponible" };
  const e = Site.echapper;
  const t = (cle, v) => e(Site.t(cle, v));

  function avis(cle) {
    const p = document.getElementById("avis");
    p.textContent = Site.t(cle);
    p.hidden = false;
    clearTimeout(avis.minuterie);
    avis.minuterie = setTimeout(() => { p.hidden = true; }, 4500);
  }

  function dateLongue(iso) {
    const locale = { fr: "fr-FR", en: "en-GB", es: "es-ES", de: "de-DE", pt: "pt-BR" }[Site.langue] || "fr-FR";
    const d = new Date(iso);
    return isNaN(d) ? "" : d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
  }
  function moisAnnee(iso) {
    const locale = { fr: "fr-FR", en: "en-GB", es: "es-ES", de: "de-DE", pt: "pt-BR" }[Site.langue] || "fr-FR";
    const d = new Date(iso);
    return isNaN(d) ? "" : d.toLocaleDateString(locale, { month: "long", year: "numeric" });
  }
  function ilYa(iso) {
    const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
    if (s < 120) return Site.t("maintenant");
    const rtf = new Intl.RelativeTimeFormat({ pt: "pt-BR" }[Site.langue] || Site.langue, { numeric: "auto" });
    if (s < 3600) return rtf.format(-Math.round(s / 60), "minute");
    if (s < 86400) return rtf.format(-Math.round(s / 3600), "hour");
    if (s < 86400 * 14) return rtf.format(-Math.round(s / 86400), "day");
    return rtf.format(-Math.round(s / (86400 * 7)), "week");
  }
  function iconeNavigateur(nom) {
    return /iPhone|Android/.test(nom || "") ? "portable" : "ecran";
  }

  function dessiner() {
    const moi = Site.moi;
    if (!moi) return;
    const p = moi.profil, c = moi.comptes;
    const equipe = moi.equipe.includes("board") ? "equipeBoard" : moi.equipe.includes("staff") ? "equipeStaff" : null;
    const amis = moi.apercuAmis || [];
    main.removeAttribute("aria-busy");
    main.innerHTML = `
    <section class="banniere-profil">
      <div class="contenant">
        ${Site.avatar(p.nom, p.avatar, "avatar-xl")}
        <div class="identite">
          <div class="kicker">${t("kicker")}</div>
          <h1>${e(p.nom)}</h1>
          <div class="lignes-identite">
            ${p.originsId ? `<button class="puce-id" type="button" id="copier-id" title="${t("originsId")}">${t("originsId")} <code>${e(p.originsId)}</code>${Site.icone("copie")}</button>` : ""}
            <span>${t("membreDepuis", { date: moisAnnee(p.creeLe) })}</span>
            ${equipe ? `<span class="pastille">${t(equipe)}</span>` : ""}
          </div>
        </div>
      </div>
    </section>
    <div class="contenant grille-profil">
      <div class="colonne-profil">
        <section class="carte bloc" aria-labelledby="titre-comptes">
          <div class="bloc-tete"><h2 id="titre-comptes">${t("comptesLies")}</h2><span class="pastille">${t("unSeulProfil")}</span></div>
          <p>${t("comptesTexte")}</p>
          <ul class="comptes">
            <li><span class="rond">${Site.icone("manette")}</span>
              <div><strong>${p.minecraft ? t("minecraft", { nom: p.minecraft }) : t("minecraftAucun")}</strong><span class="sous">${t(p.minecraft ? "minecraftSous" : "minecraftAttente")}</span></div>
              ${p.minecraftVerifie ? `<span class="etat-ok">${Site.icone("coche")}${t("verifie")}</span>` : "<span></span>"}</li>
            <li><span class="rond">${Site.icone("ecran")}</span>
              <div><strong>${t("microsoft")}</strong><span class="sous">${c.microsoft.lie ? t("microsoftSous", { date: dateLongue(c.microsoft.depuis) }) : ""}</span></div>
              ${c.microsoft.lie ? `<span class="etat-ok">${Site.icone("coche")}${t("lie")}</span>` : "<span></span>"}</li>
            <li id="discord"><span class="rond">${Site.icone("bulle")}</span>
              <div><strong>${t("discord")}</strong><span class="sous">${c.discord.lie ? t("discordLieSous", { date: dateLongue(c.discord.depuis) }) : t("discordSous")}</span></div>
              <div class="actions-compte">${c.discord.lie
                ? `<span class="etat-ok">${Site.icone("coche")}${t("lie")}</span><button class="bouton-texte" type="button" id="delier">${t("delier")}</button>`
                : `<a class="bouton bouton-or bouton-petit" href="${SITE.api}/site/discord/lier">${Site.icone("lien")}${t("lier")}</a>`}</div></li>
          </ul>
        </section>
        <section class="carte bloc" id="achats" aria-labelledby="titre-achats">
          <div class="bloc-tete"><h2 id="titre-achats">${t("achats")}</h2><a class="lien-or" href="/boutique/">${t("voirBoutique")} →</a></div>
          <div class="vide"><span class="rond">${Site.icone("panier")}</span><div><strong>${t("aucunAchat")}</strong><span>${t("aucunAchatTexte")}</span></div></div>
        </section>
      </div>
      <div class="colonne-profil">
        <section class="carte bloc" id="tickets" aria-labelledby="titre-tickets">
          <div class="bloc-tete"><h2 id="titre-tickets">${t("tickets")}</h2><a class="lien-or" href="/support/">${t("toutVoir")} →</a></div>
          ${tickets.length ? `<ul class="mes-tickets">${tickets.slice(0, 3).map((x) => `<li><a href="/support/#ticket-${x.id}">
              <span class="point${x.nonLu ? " non-lu" : ""}" aria-hidden="true"></span>
              <span class="quoi"><strong>${e(x.sujet)}</strong><span>#${x.id}</span></span>
              <span class="etat etat-${e(x.etat)}">${t("etat_" + x.etat)}</span></a></li>`).join("")}</ul>`
            : `<div class="vide"><span class="rond">${Site.icone("courrier")}</span><div><strong>${t("aucunTicket")}</strong><span>${t("aucunTicketTexte")}</span></div></div>`}
          <a class="bouton bouton-contour bouton-petit" style="margin-top: 14px" href="/support/#nouveau">${Site.icone("plus")}${t("ouvrirTicket")}</a>
        </section>
        <section class="carte bloc" aria-labelledby="titre-amis">
          <div class="bloc-tete"><h2 id="titre-amis">${t("amis")}</h2><span class="nombre">${moi.amis}</span></div>
          ${amis.length ? `<div class="amis-apercu">${amis.map((a) => Site.avatar(a.nom, a.avatar)).join("")}${moi.amis > amis.length ? `<span class="plus-amis">+${moi.amis - amis.length}</span>` : ""}</div>` : ""}
          <p>${t(moi.amis ? "amisTexte" : "aucunAmi")}</p>
        </section>
        <section class="carte bloc" aria-labelledby="titre-sessions">
          <div class="bloc-tete"><h2 id="titre-sessions">${t("navigateurs")}</h2></div>
          <ul class="sessions">${sessions.map((s) => `
            <li>${Site.icone(iconeNavigateur(s.navigateur))}
              <div><strong>${e(s.navigateur || "?")}</strong><span class="sous">${e(s.actuelle ? Site.t("maintenant") : ilYa(s.vuLe))}</span></div>
              ${s.actuelle ? `<span class="celui-ci">${t("celuiCi")}</span>` : `<button class="bouton-texte" type="button" data-session="${e(s.id)}">${t("deconnecter")}</button>`}</li>`).join("")}
          </ul>
          <button class="bouton bouton-contour bouton-petit" type="button" id="partout">${Site.icone("sortie")}${t("partout")}</button>
        </section>
      </div>
    </div>`;
    if (location.hash && !dessiner.defile) {
      dessiner.defile = true;
      document.querySelector(location.hash)?.scrollIntoView();
    }
  }

  async function chargerSessions() {
    const [r, rt] = await Promise.all([
      Site.appel("/site/sessions").catch(() => ({ ok: false })),
      Site.appel("/site/tickets").catch(() => ({ ok: false }))
    ]);
    sessions = r.ok ? r.json.sessions : [];
    tickets = rt.ok ? rt.json.tickets : [];
  }

  main.addEventListener("click", async (ev) => {
    const cible = ev.target.closest("button");
    if (!cible) return;
    if (cible.id === "copier-id") {
      try { await navigator.clipboard.writeText(Site.moi.profil.originsId); avis("copie"); } catch (_) { /* presse-papiers refusé */ }
    } else if (cible.id === "delier") {
      if (!confirm(Site.t("delierConfirme"))) return;
      const r = await Site.appel("/site/discord", { methode: "DELETE" });
      if (!r.ok) return avis("erreur");
      Site.moi.comptes.discord = { lie: false };
      Site.moi.equipe = [];
      window.dessinerCompte?.();
      dessiner();
      avis("discordDelie");
    } else if (cible.dataset.session) {
      const r = await Site.appel(`/site/sessions/${encodeURIComponent(cible.dataset.session)}`, { methode: "DELETE" });
      if (!r.ok) return avis("erreur");
      sessions = sessions.filter((s) => s.id !== cible.dataset.session);
      dessiner();
    } else if (cible.id === "partout") {
      await Site.appel("/site/sessions", { methode: "DELETE" }).catch(() => null);
      location.href = "/";
    }
  });

  const rendreAvant = window.rendrePage;
  window.rendrePage = function (langue) {
    if (typeof rendreAvant === "function") rendreAvant(langue);
    dessiner();
  };

  Site.moiPret.then(async (moi) => {
    if (!moi && !window.CONNEXION) {
      // Mode essai pas encore actif dans ce navigateur : on regarde quand même la session.
      const r = await Site.appel("/site/moi").catch(() => ({ ok: false }));
      if (r.ok) {
        Site.moi = moi = r.json;
        try { localStorage.setItem("origins-connexion-essai", "1"); } catch (_) { /* rien */ }
      }
    }
    if (!moi) { location.replace("/connexion/?suite=" + encodeURIComponent("/profil/")); return; }
    await chargerSessions();
    dessiner();
    const q = new URLSearchParams(location.search).get("discord");
    if (q && AVIS_DISCORD[q]) {
      avis(AVIS_DISCORD[q]);
      history.replaceState(null, "", location.pathname + location.hash);
    }
  });
})();
