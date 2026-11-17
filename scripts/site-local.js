/*
 * Aperçu local du site Origins (dossier site/), comme sur le VPS :
 *   node scripts/site-local.js [port]   → http://localhost:8190
 * Sert site/ et relaie /api/ et /launcher/ vers le VPS (lecture seule : seulement GET et HEAD),
 * pour voir les vraies actus et les vrais fichiers du launcher. Rien n'est envoyé au VPS.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const RACINE = path.resolve(__dirname, "..", "site");
const HISTORIQUE = path.resolve(__dirname, "..", "src", "news.js");
const VPS = "http://146.59.197.230";
const PORT = Number(process.argv[2] || 8190);
const TYPES = {
  html: "text/html; charset=utf-8", css: "text/css; charset=utf-8", js: "text/javascript; charset=utf-8",
  svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", json: "application/json", yml: "text/yaml"
};

function relayer(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405); res.end("Aperçu local : lecture seule."); return;
  }
  const proxy = http.request(VPS + req.url, { method: req.method, headers: { Accept: req.headers.accept || "*/*" } }, (r) => {
    res.writeHead(r.statusCode, { "Content-Type": r.headers["content-type"] || "application/octet-stream", "Content-Length": r.headers["content-length"] || undefined });
    r.pipe(res);
  });
  proxy.on("error", () => { res.writeHead(502); res.end("VPS injoignable"); });
  proxy.end();
}

/*
 * API locale (essais de la connexion, sur une base de test) : ORIGINS_API_LOCALE=http://localhost:3100.
 * Comme nginx sur le VPS : /api/… → API/…, toutes les méthodes, cookies et redirections compris.
 * Les actus restent celles du VPS (la base de test n'en a pas).
 */
const API_LOCALE = process.env.ORIGINS_API_LOCALE ? new URL(process.env.ORIGINS_API_LOCALE) : null;

function relayerApiLocale(req, res) {
  const entetes = { ...req.headers, host: API_LOCALE.host, "x-real-ip": req.socket.remoteAddress || "127.0.0.1" };
  const proxy = http.request({
    hostname: API_LOCALE.hostname, port: API_LOCALE.port, method: req.method,
    path: req.url.replace(/^\/api/, "") || "/", headers: entetes
  }, (r) => {
    res.writeHead(r.statusCode, r.headers);
    r.pipe(res);
  });
  proxy.on("error", () => { res.writeHead(502); res.end("API locale injoignable"); });
  req.pipe(proxy);
}

http.createServer((req, res) => {
  const chemin = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (API_LOCALE && chemin.startsWith("/api/") && !chemin.startsWith("/api/news")) return relayerApiLocale(req, res);
  if (chemin.startsWith("/api/") || chemin.startsWith("/launcher/")) return relayer(req, res);
  // L'historique du launcher n'est pas copié dans site/ : c'est src/news.js, publié à cette adresse.
  let fichier = chemin === "/commun/historique-launcher.js" ? HISTORIQUE : path.join(RACINE, chemin);
  if (fichier !== HISTORIQUE && !fichier.startsWith(RACINE)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(fichier) && fs.statSync(fichier).isDirectory()) fichier = path.join(fichier, "index.html");
  fs.readFile(fichier, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); return res.end("Introuvable"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(fichier).slice(1)] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Site Origins (aperçu) : http://localhost:${PORT}${API_LOCALE ? ` · API locale ${API_LOCALE.origin}` : ""}`));
