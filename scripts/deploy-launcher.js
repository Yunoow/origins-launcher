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

async function main() {
    const pkg = readPackage();
    const version = pkg.version;

    parseVersion(version);

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

    console.log("\nBuild du launcher...");
    run("npm.cmd", ["run", "build"]);

    const releaseFiles = getReleaseFiles(version);

    console.log("\nFichiers prêts à publier :");
    for (const file of releaseFiles) {
        const stats = fs.statSync(path.join(RELEASE_ROOT, file));
        console.log(`- ${file} (${stats.size} octets)`);
    }

    const remoteStage = `${VPS_ROOT}.deploy`;
    const remoteBackup = `${VPS_ROOT}.previous`;

    console.log("\nPréparation du VPS...");
    run("ssh", [
        `${VPS_USER}@${VPS_HOST}`,
        `rm -rf '${remoteStage}' && mkdir -p '${remoteStage}'`
    ]);

    console.log("\nEnvoi du launcher...");
    for (const file of releaseFiles) {
        run("scp", [
            path.join(RELEASE_ROOT, file),
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
            `mv '${remoteStage}' '${VPS_ROOT}'`,
            `find '${VPS_ROOT}' -type d -exec chmod 755 {} \\;`,
            `find '${VPS_ROOT}' -type f -exec chmod 644 {} \\;`,
            `rm -rf '${remoteBackup}'`
        ].join(" && ")
    ]);

    console.log("\nPublication Origins Launcher terminée avec succès.");
    console.log(`Version publiée : ${version}`);
    console.log(`Flux public     : ${UPDATE_URL}`);
}

main().catch((error) => {
    console.error("\nÉCHEC DE LA PUBLICATION DU LAUNCHER");
    console.error(error.message);
    process.exit(1);
});
