const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const { spawnSync } = require("child_process");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const RELEASE_ROOT = path.join(PROJECT_ROOT, "release");
const PACKAGE_PATH = path.join(PROJECT_ROOT, "package.json");

const VPS_HOST = "146.59.197.230";
const VPS_USER = "ubuntu";
const VPS_ROOT = "/var/www/origins/launcher";
const UPDATE_URL = `http://${VPS_HOST}/launcher/latest.yml`;
const LIEN_FIXE = "Origins-Launcher-Setup.exe";

/*
 * Mac et Linux : fabriqués par GitHub Actions (.github/workflows/build-launcher.yml),
 * dans des artefacts nommés avec la version (Origins-Launcher-Linux-0.6.5…).
 * On les récupère avec gh pour les mettre en ligne avec Windows, plus ces noms fixes
 * lus par la page de téléchargement (site/telecharger/). S'il n'y a pas de build
 * pour cette version, on prévient et on continue : la page affiche « Bientôt ».
 */
const GITHUB_REPO = "Yunoow/origins-launcher-src";
const DESKTOP_ARTIFACTS = ["Origins-Launcher-Linux", "Origins-Launcher-macOS"];
const FIXED_NAMES = [
    { fixed: "Origins-Launcher.AppImage", match: (name) => /\.AppImage$/.test(name) },
    { fixed: "origins-launcher_amd64.deb", match: (name) => /_amd64\.deb$/.test(name) },
    { fixed: "Origins-Launcher-mac-arm64.dmg", match: (name) => /arm64.*\.dmg$/.test(name) },
    { fixed: "Origins-Launcher-mac-x64.dmg", match: (name) => /\.dmg$/.test(name) && !/arm64/.test(name) }
];
// Fichiers des artefacts à mettre en ligne (la mise à jour de l'AppImage lit latest-linux.yml).
const DESKTOP_FILE = /\.(AppImage|deb|dmg|blockmap)$|^latest-linux\.yml$/;

function run(command, args, options = {}) {
    const isWindows = process.platform === "win32";

    const result = isWindows
        ? spawnSync(
            process.env.ComSpec || "cmd.exe",
            ["/d", "/s", "/c", command, ...args],
            {
                stdio: "inherit",
                cwd: options.cwd || PROJECT_ROOT
            }
        )
        : spawnSync(command, args, {
            stdio: "inherit",
            shell: false,
            cwd: options.cwd || PROJECT_ROOT
        });

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        throw new Error(
            `${command} a échoué avec le code ${result.status}.`
        );
    }
}

/*
 * Garde-fou : chaque version publiée doit avoir son récap joueurs
 * EN PREMIER dans src/news.js, pour toutes les langues du launcher.
 * Sinon les actus affichées ont une version de retard.
 */
function checkNewsForVersion(version) {
    const vm = require("vm");
    const context = { navigator: {} };
    vm.createContext(context);

    const read = (file) => fs.readFileSync(path.join(PROJECT_ROOT, "src", file), "utf8");
    vm.runInContext(`${read("i18n.js")}\n;this.__languages = ORIGINS_LANGUAGES;`, context);
    vm.runInContext(`${read("news.js")}\n;this.__history = updateHistoryI18n; this.__news = newsContent;`, context);

    const missing = [];

    for (const { code } of context.__languages) {
        const history = context.__history[code] || [];
        const cards = context.__news[code] || [];

        if (history[0]?.version !== version) {
            missing.push(`${code} : historique (en tête : ${history[0]?.version || "rien"})`);
        }
        if (cards[0]?.version !== version) {
            missing.push(`${code} : carte d'accueil (en tête : ${cards[0]?.version || "rien"})`);
        }
    }

    if (missing.length) {
        throw new Error(
            `Les actus de la version ${version} manquent dans src/news.js :\n` +
            missing.map((line) => `  - ${line}`).join("\n") +
            `\nAjoute le récap ${version} en haut de chaque langue avant de publier.`
        );
    }
}

function readPackage() {
    if (!fs.existsSync(PACKAGE_PATH)) {
        throw new Error(`package.json introuvable : ${PACKAGE_PATH}`);
    }

    try {
        return JSON.parse(fs.readFileSync(PACKAGE_PATH, "utf8"));
    } catch (error) {
        throw new Error(`package.json invalide : ${error.message}`);
    }
}

function parseVersion(version) {
    const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version || "");

    if (!match) {
        throw new Error(
            `Version invalide "${version}". Format attendu : X.Y.Z`
        );
    }

    return match.slice(1).map(Number);
}

function compareVersions(a, b) {
    const av = parseVersion(a);
    const bv = parseVersion(b);

    for (let i = 0; i < 3; i += 1) {
        if (av[i] > bv[i]) return 1;
        if (av[i] < bv[i]) return -1;
    }

    return 0;
}

function downloadText(url, redirectsLeft = 5) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith("https:") ? https : http;

        const request = client.get(
            url,
            {
                headers: {
                    "Cache-Control": "no-cache",
                    "User-Agent": "Origins-Launcher-Deploy"
                }
            },
            (response) => {
                const status = response.statusCode || 0;

                if (
                    status >= 300 &&
                    status < 400 &&
                    response.headers.location
                ) {
                    response.resume();

                    if (redirectsLeft <= 0) {
                        reject(new Error("Trop de redirections HTTP."));
                        return;
                    }

                    const redirectedUrl = new URL(
                        response.headers.location,
                        url
                    ).toString();

                    downloadText(redirectedUrl, redirectsLeft - 1)
                        .then(resolve)
                        .catch(reject);

                    return;
                }

                if (status === 404) {
                    response.resume();
                    resolve(null);
                    return;
                }

                if (status !== 200) {
                    response.resume();
                    reject(
                        new Error(
                            `Impossible de lire ${url} : HTTP ${status}`
                        )
                    );
                    return;
                }

                response.setEncoding("utf8");

                let body = "";

                response.on("data", (chunk) => {
                    body += chunk;
                });

                response.on("end", () => {
                    resolve(body);
                });
            }
        );

        request.setTimeout(10000, () => {
            request.destroy(
                new Error("Délai dépassé pendant la vérification du VPS.")
            );
        });

        request.on("error", reject);
    });
}

async function getPublishedVersion() {
    const text = await downloadText(
        `${UPDATE_URL}?t=${Date.now()}`
    );

    if (text === null) {
        return null;
    }

    const match = text.match(
        /^version:\s*["']?([^"' \r\n]+)["']?\s*$/m
    );

    if (!match) {
        throw new Error(
            "latest.yml public est accessible, mais sa version est introuvable."
        );
    }

    const version = match[1].trim();
    parseVersion(version);

    return version;
}

function getReleaseFiles(version) {
    const installerName = `Origins Launcher Setup ${version}.exe`;
    const blockmapName = `${installerName}.blockmap`;

    const files = [
        "latest.yml",
        installerName,
        blockmapName
    ];

    for (const file of files) {
        const absolutePath = path.join(RELEASE_ROOT, file);

        if (!fs.existsSync(absolutePath)) {
            throw new Error(
                `Fichier de publication introuvable : ${absolutePath}`
            );
        }
    }

    return files;
}

/** Lance une commande et rend sa sortie (sans passer par cmd.exe : gh est un vrai .exe). */
function capture(command, args) {
    const result = spawnSync(command, args, { encoding: "utf8", cwd: PROJECT_ROOT, maxBuffer: 1024 * 1024 * 32 });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error((result.stderr || result.stdout || `${command} a échoué`).trim());
    return result.stdout;
}

/**
 * Télécharge les fichiers Mac et Linux de `version` depuis GitHub Actions.
 * Rend { files: [chemins absolus à envoyer], fixed: [{ source, fixed }] }.
 * Ne lève jamais d'erreur : en cas de souci, prévient et rend ce qui a pu être récupéré.
 */
/** Le zip « <base>-<version>.zip » de la Release « build-<version> », décompressé dans dir/base. Rend true si c'est fait. */
function downloadFromRelease(base, version, dir) {
    const zip = `${base}-${version}.zip`;
    try {
        capture("gh", ["release", "download", `build-${version}`, "-R", GITHUB_REPO, "-p", zip, "-D", dir, "--clobber"]);
        const cible = path.join(dir, base);
        fs.mkdirSync(cible, { recursive: true });
        capture("tar", ["-xf", path.join(dir, zip), "-C", cible]);
        fs.rmSync(path.join(dir, zip), { force: true });
        console.log(`Récupéré : ${zip} (Release build-${version}).`);
        return true;
    } catch (_) {
        return false;
    }
}

function fetchDesktopBuilds(version) {
    const empty = { files: [], fixed: [] };
    const dir = path.join(RELEASE_ROOT, `mac-linux-${version}`);

    let artifacts;
    try {
        const json = capture("gh", ["api", `repos/${GITHUB_REPO}/actions/artifacts?per_page=100`]);
        artifacts = JSON.parse(json).artifacts || [];
    } catch (error) {
        console.warn(`ATTENTION : impossible de lister les artefacts GitHub (${error.message}) ; on essaie la Release.`);
        artifacts = [];
    }

    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });

    for (const base of DESKTOP_ARTIFACTS) {
        // D'abord la Release « build-<version> » (un zip par système) ; sinon, les anciens artefacts.
        if (downloadFromRelease(base, version, dir)) continue;
        const name = `${base}-${version}`;
        const artifact = artifacts
            .filter((item) => item.name === name && !item.expired)
            .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))[0];

        if (!artifact) {
            console.warn(`ATTENTION : aucun build « ${name} » sur GitHub (lancer le workflow « Build Origins Launcher » pour la ${version}).`);
            continue;
        }

        try {
            console.log(`Téléchargement de ${name} (build du ${artifact.created_at.slice(0, 10)})...`);
            capture("gh", ["run", "download", String(artifact.workflow_run.id), "-R", GITHUB_REPO, "-n", name, "-D", path.join(dir, base)]);
        } catch (error) {
            console.warn(`ATTENTION : téléchargement de ${name} impossible (${error.message}).`);
        }
    }

    const files = [];
    const walk = (folder) => {
        for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
            const full = path.join(folder, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (DESKTOP_FILE.test(entry.name)) files.push(full);
        }
    };
    walk(dir);

    // Garde-fou : les paquets doivent être de la même version que Windows.
    const wrongVersion = files.filter((file) => /\.(AppImage|deb|dmg)$/.test(file) && !path.basename(file).includes(version));
    if (wrongVersion.length) {
        console.warn(`ATTENTION : fichiers d'une autre version ignorés : ${wrongVersion.map((f) => path.basename(f)).join(", ")}`);
    }
    const kept = files.filter((file) => !wrongVersion.includes(file));

    const fixed = [];
    for (const { fixed: fixedName, match } of FIXED_NAMES) {
        const source = kept.find((file) => /\.(AppImage|deb|dmg)$/.test(file) && match(path.basename(file)));
        if (source) fixed.push({ source: path.basename(source), fixed: fixedName });
        else console.warn(`ATTENTION : pas de fichier pour ${fixedName} : la page affichera « Bientôt ».`);
    }

    // Deux fichiers du même nom (Mac et Linux) écraseraient l'un l'autre sur le VPS.
    const names = kept.map((file) => path.basename(file));
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length) {
        console.warn(`ATTENTION : fichiers en double ignorés : ${[...new Set(duplicates)].join(", ")}`);
    }

    return {
        files: kept.filter((file, index) => names.indexOf(path.basename(file)) === index),
        fixed
    };
}

async function main() {
    const pkg = readPackage();
    const version = pkg.version;

    parseVersion(version);

    /*
     * Essai sans rien mettre en ligne : récupère seulement les fichiers Mac et Linux.
     *   npm.cmd run deploy:launcher -- --essai-mac-linux [version]
     */
    const essai = process.argv.indexOf("--essai-mac-linux");
    if (essai !== -1) {
        const wanted = process.argv[essai + 1] && !process.argv[essai + 1].startsWith("--") ? process.argv[essai + 1] : version;
        console.log(`=== Essai : fichiers Mac et Linux de la ${wanted} (rien n'est envoyé) ===`);
        const desktop = fetchDesktopBuilds(wanted);
        console.log("\nFichiers qui seraient envoyés :");
        desktop.files.forEach((file) => console.log(`- ${path.basename(file)} (${fs.statSync(file).size} octets)`));
        if (!desktop.files.length) console.log("- aucun");
        console.log("\nNoms fixes qui seraient créés :");
        desktop.fixed.forEach(({ source, fixed }) => console.log(`- ${fixed}  ←  ${source}`));
        if (!desktop.fixed.length) console.log("- aucun");
        return;
    }

    console.log("=== Publication Origins Launcher vers OVH ===");
    console.log(`Version locale : ${version}`);
    console.log(`Cible          : ${VPS_USER}@${VPS_HOST}:${VPS_ROOT}`);
    console.log("");

    console.log("Vérification de la version déjà publiée...");
    const publishedVersion = await getPublishedVersion();

    if (publishedVersion) {
        console.log(`Version VPS    : ${publishedVersion}`);

        const comparison = compareVersions(version, publishedVersion);

        if (comparison === 0) {
            throw new Error(
                `La version ${version} est déjà publiée. ` +
                "Augmente la version du launcher avant de redéployer."
            );
        }

        if (comparison < 0) {
            throw new Error(
                `La version locale ${version} est plus ancienne que ` +
                `la version publiée ${publishedVersion}.`
            );
        }
    } else {
        console.log("Version VPS    : aucune version détectée.");
    }

    console.log("\nVérification des actus (src/news.js)...");
    checkNewsForVersion(version);
    console.log(`Actus ${version} présentes dans toutes les langues.`);

    console.log("\nBuild du launcher...");
    run("npm.cmd", ["run", "build"]);

    const releaseFiles = getReleaseFiles(version);

    console.log("\nFichiers Mac et Linux (GitHub Actions)...");
    const desktop = fetchDesktopBuilds(version);

    // Tout ce qui part : Windows (release/) puis Mac et Linux (release/mac-linux-<version>/).
    const uploads = [
        ...releaseFiles.map((file) => path.join(RELEASE_ROOT, file)),
        ...desktop.files
    ];

    console.log("\nFichiers prêts à publier :");
    for (const file of uploads) {
        const stats = fs.statSync(file);
        console.log(`- ${path.basename(file)} (${stats.size} octets)`);
    }

    const remoteStage = `${VPS_ROOT}.deploy`;
    const remoteBackup = `${VPS_ROOT}.previous`;

    console.log("\nPréparation du VPS...");
    run("ssh", [
        `${VPS_USER}@${VPS_HOST}`,
        `rm -rf '${remoteStage}' && mkdir -p '${remoteStage}'`
    ]);

    console.log("\nEnvoi du launcher...");
    for (const file of uploads) {
        run("scp", [
            file,
            `${VPS_USER}@${VPS_HOST}:${remoteStage}/`
        ]);
    }

    console.log("\nActivation de la nouvelle version...");
    run("ssh", [
        `${VPS_USER}@${VPS_HOST}`,
        [
            "set -e",
            `rm -rf '${remoteBackup}'`,
            `if [ -d '${VPS_ROOT}' ]; then mv '${VPS_ROOT}' '${remoteBackup}'; fi`,
            // Lien de téléchargement fixe pour les joueurs : il pointe
            // toujours sur la dernière version (le nom de l'installeur,
            // lui, change à chaque version et l'ancien disparaît).
            `cp '${remoteStage}/${releaseFiles[1]}' '${remoteStage}/${LIEN_FIXE}'`,
            // Mêmes liens fixes pour Mac et Linux (lus par la page de téléchargement).
            ...desktop.fixed.map(({ source, fixed }) => `cp '${remoteStage}/${source}' '${remoteStage}/${fixed}'`),
            `mv '${remoteStage}' '${VPS_ROOT}'`,
            `find '${VPS_ROOT}' -type d -exec chmod 755 {} \\;`,
            `find '${VPS_ROOT}' -type f -exec chmod 644 {} \\;`,
            `rm -rf '${remoteBackup}'`
        ].join(" && ")
    ]);

    console.log("\nPublication Origins Launcher terminée avec succès.");
    console.log(`Version publiée : ${version}`);
    console.log(`Flux public     : ${UPDATE_URL}`);
    console.log(`Lien joueurs    : http://${VPS_HOST}/launcher/${LIEN_FIXE}`);
}

main().catch((error) => {
    console.error("\nÉCHEC DE LA PUBLICATION DU LAUNCHER");
    console.error(error.message);
    process.exit(1);
});
