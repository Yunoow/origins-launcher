/* Tickets : ce qui sert au joueur (Support) et à la Boîte du staff. Après commun/site.js. */
"use strict";
window.Tickets = (function () {
  const e = (x) => Site.echapper(x);
  const MAX_FICHIERS = 3;
  const MAX_OCTETS = 5 * 1024 * 1024;

  /** Envoi avec captures (multipart) : même origine, cookie de session, en-tête du site. */
  async function envoyer(chemin, champs, fichiers) {
    const f = new FormData();
    for (const [k, v] of Object.entries(champs)) if (v !== undefined && v !== null) f.append(k, v);
    for (const fichier of fichiers || []) f.append("fichiers", fichier, fichier.name);
    const r = await fetch(`${SITE.api}${chemin}`, { method: "POST", credentials: "same-origin", headers: { "X-Origins-Site": "1" }, body: f });
    let json = null;
    try { json = await r.json(); } catch (_) { /* rien */ }
    return { ok: r.ok, statut: r.status, json };
  }

  function locale() { return { fr: "fr-FR", en: "en-GB", es: "es-ES", de: "de-DE", pt: "pt-BR" }[Site.langue] || "fr-FR"; }

  function ilYa(iso) {
    const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
    if (s < 60) return Site.t("maintenant");
    const rtf = new Intl.RelativeTimeFormat(locale(), { numeric: "auto" });
    if (s < 3600) return rtf.format(-Math.round(s / 60), "minute");
    if (s < 86400) return rtf.format(-Math.round(s / 3600), "hour");
    if (s < 86400 * 7) return rtf.format(-Math.round(s / 86400), "day");
    return new Date(iso).toLocaleDateString(locale(), { day: "numeric", month: "short" });
  }

  function heure(iso) {
    const d = new Date(iso);
    const jour = (Date.now() - d) < 86400000 && new Date().getDate() === d.getDate();
    return jour ? d.toLocaleTimeString(locale(), { hour: "2-digit", minute: "2-digit" })
      : d.toLocaleString(locale(), { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  function taille(o) { return o >= 1048576 ? `${(o / 1048576).toFixed(1)} Mo` : `${Math.max(1, Math.round(o / 1024))} Ko`; }

  function fichiersHtml(fichiers) {
    if (!fichiers || !fichiers.length) return "";
    return `<div class="fichiers">${fichiers.map((f) => `
      <a class="fichier" href="${SITE.api}/site/tickets/fichiers/${e(f.id)}" target="_blank" rel="noopener">
        <img src="${SITE.api}/site/tickets/fichiers/${e(f.id)}" alt="" loading="lazy">
        <span><b>${e(f.nom)}</b><span>${e(taille(f.taille))}</span></span></a>`).join("")}</div>`;
  }

  /**
   * Le fil d'un ticket. options : { moi (id du profil), texteSysteme(m), etiquetteStaff, etiquetteNote, nomMoi }.
   * Les messages du joueur et du staff sont des bulles ; les changements d'état, une ligne au milieu.
   */
  function fil(messages, options) {
    return messages.map((m) => {
      if (m.role === "systeme") return `<div class="systeme"><span>${e(options.texteSysteme(m))} · ${e(heure(m.le))}</span></div>`;
      const moi = m.auteur && m.auteur.id === options.moi;
      const nom = m.auteur ? m.auteur.nom : "?";
      return `<div class="msg${moi ? " moi" : ""}${m.interne ? " interne" : ""}">
        ${Site.avatar(nom, m.auteur && m.auteur.avatar)}
        <div class="msg-corps">
          <div class="msg-tete">${m.interne ? `<span class="note">${e(options.etiquetteNote)}</span>` : ""}<b>${e(moi && options.nomMoi ? options.nomMoi : nom)}</b>${m.role === "staff" ? `<span class="badge-staff">${e(options.etiquetteStaff)}</span>` : ""}<span>${e(heure(m.le))}</span></div>
          ${m.texte ? `<div class="bulle">${e(m.texte)}${fichiersHtml(m.fichiers)}</div>` : `<div class="bulle">${fichiersHtml(m.fichiers)}</div>`}
        </div></div>`;
    }).join("");
  }

  /** Gère une liste de captures choisies (bouton, glisser-déposer) ; rend { liste(), vider(), dessiner }. */
  function captures({ input, zone, rendu, onErreur, texteRetirer }) {
    let liste = [];
    function ajouter(fichiers) {
      for (const f of fichiers) {
        if (!/^image\/(png|jpeg|gif|webp)$/.test(f.type)) { onErreur("err_IMAGES_ONLY"); continue; }
        if (f.size > MAX_OCTETS) { onErreur("err_FILE_TOO_LARGE"); continue; }
        if (liste.length >= MAX_FICHIERS) { onErreur("err_TOO_MANY_FILES"); break; }
        liste.push(f);
      }
      dessiner();
    }
    function dessiner() {
      rendu.innerHTML = liste.map((f, i) => `<span class="joint">${e(f.name)}<button type="button" data-retirer="${i}" aria-label="${e(texteRetirer)}">×</button></span>`).join("");
    }
    input.addEventListener("change", () => { ajouter([...input.files]); input.value = ""; });
    rendu.addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-retirer]");
      if (b) { liste.splice(Number(b.dataset.retirer), 1); dessiner(); }
    });
    if (zone) {
      zone.addEventListener("dragover", (ev) => { ev.preventDefault(); zone.classList.add("survol"); });
      zone.addEventListener("dragleave", () => zone.classList.remove("survol"));
      zone.addEventListener("drop", (ev) => { ev.preventDefault(); zone.classList.remove("survol"); ajouter([...ev.dataTransfer.files]); });
    }
    return { liste: () => liste, vider: () => { liste = []; dessiner(); } };
  }

  return { envoyer, ilYa, heure, taille, fil, captures, CATEGORIES: ["connexion", "bug", "launcher", "achat", "signalement", "question"] };
})();
