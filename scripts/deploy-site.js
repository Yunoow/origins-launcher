/*
 * Publication du site Origins (dossier site/) sur le VPS.
 *
 *   npm.cmd run deploy:site            → publie tout le site dans /var/www/origins/
 *   npm.cmd run deploy:site -- --essai → vérifie et prépare l'archive, sans rien envoyer
 *
 * Seulement avec l'accord de Yunoow.
 *
 * Ce qui part : tout site/ (pages, commun/, images), sauf les notes (.md), plus l'historique du launcher
 * (src/news.js, publié en commun/historique-launcher.js pour la page Actus : une seule source).
 *
 * Ce qui n'est JAMAIS touché sur le VPS : launcher/, launcher.sauvegarde-*, tempest/, et tout ce qui n'est pas
 * au site. Le script ne remplace que ses propres entrées (index.html et les dossiers de site/), une par une :
 * la nouvelle version est d'abord déposée à côté, puis échangée avec l'ancienne, qui est supprimée ensuite.
 * nginx (site « origins », port 80) a pour racine /var/www/origins : le site est servi sur http://146.59.197.230/.
 */

const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const { spawnSync } = require("child_process");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const SITE_ROOT = path.join(PROJECT_ROOT, "site");
const HISTORIQUE = { source: path.join(PROJECT_ROOT, "src", "news.js"), cible: "commun/historique-launcher.js" };

const VPS_HOST = "146.59.197.230";
const VPS_USER = "ubuntu";
const VPS_ROOT = "/var/www/origins";
const PUBLIC_URL = `http://${VPS_HOST}/`;

/** Entrées du VPS que le site ne doit jamais remplacer. */
const INTOUCHABLES = [/^launcher$/, /^launcher\.sauvegarde/, /^tempest$/, /^api$/];
/** Fichiers de site/ qui ne partent pas en ligne. */
const IGNORES = [/\.md$/i, /(^|\/)\./];

/** Pages vérifiées en ligne après la mise en place (et qu'on attend dans site/). */
const PAGES = ["", "jeux/tempest/", "actus/", "boutique/", "telecharger/", "support/", "commun/site.js", "commun/site.css", HISTORIQUE.cible];

const ESSAI = process.argv.includes("--essai");

/** Même façon de lancer ssh / scp que scripts/deploy-launcher.js. */
function run(command, args, options = {}) {
    const isWindows = process.platform === "win32";
    const result = isWindows
        ? spawnSync(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", command, ...args], { stdio: "inherit", cwd: PROJECT_ROOT, ...options })
        : spawnSync(command, args, { stdio: "inherit", shell: false, cwd: PROJECT_ROOT, ...options });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`${command} a échoué avec le code ${result.status}.`);
}

function getStatus(url) {
    return new Promise((resolve, reject) => {
        const request = http.get(url, { headers: { "Cache-Control": "no-cache", "User-Agent": "Origins-Site-Deploy" } }, (response) => {
            response.resume();
            response.on("end", () => resolve(response.statusCode));
        });
        request.setTimeout(10000, () => request.destroy(new Error("Délai dépassé.")));
        request.on("error", reject);
    });
}

/** Tous les fichiers de site/ à publier, en chemins relatifs avec des « / ». */
function listerFichiers(dossier, prefixe = "") {
    const fichiers = [];
    for (const entree of fs.readdirSync(dossier, { withFileTypes: true })) {
        const relatif = prefixe + entree.name;
        if (IGNORES.some((re) => re.test(relatif))) continue;
        if (entree.isDirectory()) fichiers.push(...listerFichiers(path.join(dossier, entree.name), relatif + "/"));
        else if (entree.isFile()) fichiers.push(relatif);
    }
    return fichiers;
}

/** Copie le site dans un dossier temporaire, tel qu'il sera sur le VPS. Rend { dossier, entrees, total }. */
function preparer() {
    if (!fs.existsSync(HISTORIQUE.source)) throw new Error(`Historique du launcher introuvable : ${HISTORIQUE.source}`);
    const fichiers = listerFichiers(SITE_ROOT);
    if (fichiers.includes(HISTORIQUE.cible)) throw new Error(`site/${HISTORIQUE.cible} ne doit pas exister : il vient de src/news.js.`);

    const entrees = [...new Set(fichiers.map((f) => f.split("/")[0]))].sort();
    for (const entree of entrees) {
        if (INTOUCHABLES.some((re) => re.test(entree))) throw new Error(`site/${entree} porte le nom d'un dossier du VPS qu'on ne touche pas.`);
        if (!/^[\w.-]+$/.test(entree)) throw new Error(`Nom d'entrée inattendu dans site/ : « ${entree} ».`);
    }
    for (const page of PAGES) {
        const attendu = page === HISTORIQUE.cible ? null : (page === "" || page.endsWith("/") ? page + "index.html" : page);
        if (attendu && !fichiers.includes(attendu)) throw new Error(`Fichier attendu absent : site/${attendu}`);
    }

    const dossier = fs.mkdtempSync(path.join(os.tmpdir(), "origins-site-"));
    let total = 0;
    const copier = (source, relatif) => {
        const taille = fs.statSync(source).size;
        if (!taille) throw new Error(`Fichier vide : ${source}`);
        const cible = path.join(dossier, ...relatif.split("/"));
        fs.mkdirSync(path.dirname(cible), { recursive: true });
        fs.copyFileSync(source, cible);
        total += taille;
        console.log(`- ${relatif} (${taille} octets)`);
    };
    for (const f of fichiers) copier(path.join(SITE_ROOT, ...f.split("/")), f);
    copier(HISTORIQUE.source, HISTORIQUE.cible);

    for (const f of fichiers.filter((x) => x.endsWith(".html"))) {
        if (!/<html[\s>]/i.test(fs.readFileSync(path.join(SITE_ROOT, ...f.split("/")), "utf8"))) throw new Error(`${f} ne ressemble pas à une page HTML.`);
    }
    return { dossier, entrees, total, nombre: fichiers.length + 1 };
}

async function main() {
    console.log("=== Publication du site Origins ===");
    console.log(`Source : ${SITE_ROOT} (+ src/news.js → ${HISTORIQUE.cible})`);
    console.log(`Cible  : ${VPS_USER}@${VPS_HOST}:${VPS_ROOT}/`);
    console.log("");

    console.log("Fichiers à envoyer :");
    const { dossier, entrees, total, nombre } = preparer();
    console.log(`\n${nombre} fichiers, ${(total / 1024 / 1024).toFixed(2)} Mo.`);
    console.log(`Entrées remplacées sur le VPS : ${entrees.join(", ")}`);
    console.log("Jamais touchées : launcher/, launcher.sauvegarde-*, tempest/, et le reste.");

    const archive = path.join(os.tmpdir(), `origins-site-${Date.now()}.tar.gz`);
    try {
        run("tar", ["-czf", archive, "-C", dossier, "."]);
        console.log(`Archive prête : ${(fs.statSync(archive).size / 1024 / 1024).toFixed(2)} Mo.`);

        if (ESSAI) {
            console.log("\nMode essai : rien n'a été envoyé.");
            return;
        }

        const stage = `${VPS_ROOT}/.site-deploy`;
        const ssh = (commandes) => run("ssh", [`${VPS_USER}@${VPS_HOST}`, commandes.join(" && ")]);

        console.log("\nPréparation du VPS...");
        ssh([`rm -rf '${stage}'`, `mkdir -p '${stage}/neuf'`]);

        console.log("\nEnvoi du site...");
        run("scp", [archive, `${VPS_USER}@${VPS_HOST}:${stage}/site.tar.gz`]);

        console.log("\nMise en place...");
        const echanges = entrees.map((e) =>
            // l'ancienne version (si elle existe) passe dans .site-deploy/ancien, la nouvelle prend sa place
            `( [ ! -e '${VPS_ROOT}/${e}' ] || mv '${VPS_ROOT}/${e}' '${stage}/ancien/${e}' ) && mv '${stage}/neuf/${e}' '${VPS_ROOT}/${e}'`);
        ssh([
            "set -e",
            `tar -xzf '${stage}/site.tar.gz' -C '${stage}/neuf'`,
            `find '${stage}/neuf' -type d -exec chmod 755 {} +`,
            `find '${stage}/neuf' -type f -exec chmod 644 {} +`,
            `mkdir -p '${stage}/ancien'`,
            // les dossiers d'abord, index.html (l'Accueil) en dernier : quand il arrive, tout ce qu'il charge est là
            ...echanges.filter((_, i) => entrees[i] !== "index.html"),
            ...echanges.filter((_, i) => entrees[i] === "index.html"),
            `rm -rf '${stage}'`
        ]);

        console.log("\nVérification en ligne...");
        for (const page of PAGES) {
            const statut = await getStatus(`${PUBLIC_URL}${page}?t=${Date.now()}`);
            console.log(`- /${page} : ${statut}`);
            if (statut !== 200) throw new Error(`${PUBLIC_URL}${page} répond ${statut} au lieu de 200.`);
        }
        const launcher = await getStatus(`${PUBLIC_URL}launcher/latest.yml?t=${Date.now()}`);
        console.log(`- /launcher/latest.yml (pas touché) : ${launcher}`);

        console.log("\nSite Origins en ligne.");
        console.log(`Adresse : ${PUBLIC_URL}`);
    } finally {
        fs.rmSync(dossier, { recursive: true, force: true });
        fs.rmSync(archive, { force: true });
    }
}

main().catch((error) => {
    console.error("\nÉCHEC DE LA PUBLICATION DU SITE");
    console.error(error.message);
    process.exit(1);
});
