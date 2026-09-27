const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const TEMPEST_ROOT = path.join(PROJECT_ROOT, "dev-server", "tempest");

const VPS_HOST = "146.59.197.230";
const VPS_USER = "ubuntu";
const VPS_ROOT = "/var/www/origins/tempest";

const CATEGORIES = [
    { name: "mods", extension: ".jar" },
    { name: "shaderpacks", extension: ".zip" },
    { name: "resourcepacks", extension: ".zip" }
];

function sha256(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash("sha256");
        const stream = fs.createReadStream(filePath);

        stream.on("error", reject);
        stream.on("data", (chunk) => hash.update(chunk));
        stream.on("end", () => resolve(hash.digest("hex")));
    });
}

async function buildCategory(category, extension) {
    const folder = path.join(TEMPEST_ROOT, category);
    fs.mkdirSync(folder, { recursive: true });

    const entries = fs.readdirSync(folder, { withFileTypes: true })
        .filter((entry) =>
            entry.isFile() &&
            path.extname(entry.name).toLowerCase() === extension
        )
        .sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        );

    const files = [];

    for (const entry of entries) {
        const absolutePath = path.join(folder, entry.name);
        const stats = fs.statSync(absolutePath);

        files.push({
            file: entry.name,
            path: `${category}/${entry.name}`,
            size: stats.size,
            sha256: await sha256(absolutePath)
        });
    }

    return files;
}

async function regenerateManifest() {
    const manifestPath = path.join(TEMPEST_ROOT, "manifest.json");

    let previous = {};

    if (fs.existsSync(manifestPath)) {
        try {
            previous = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
        } catch (error) {
            throw new Error(`manifest.json invalide : ${error.message}`);
        }
    }

    const [mods, shaderpacks, resourcepacks] = await Promise.all(
        CATEGORIES.map((category) =>
            buildCategory(category.name, category.extension)
        )
    );

    const manifest = {
        game: previous.game || "Tempest Origins",
        version: previous.version || "0.1.0",
        minecraft: previous.minecraft || "1.21.11",
        fabric: previous.fabric || "0.19.5",
        generatedAt: new Date().toISOString(),
        mods,
        shaderpacks,
        resourcepacks
    };

    fs.writeFileSync(
        manifestPath,
        JSON.stringify(manifest, null, 4) + "\n",
        "utf8"
    );

    console.log(
        `Manifest généré : ${mods.length} mod(s), ` +
        `${shaderpacks.length} shader(s), ` +
        `${resourcepacks.length} resource pack(s).`
    );
}

function run(command, args) {
    const result = spawnSync(command, args, {
        stdio: "inherit",
        shell: false
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

async function main() {
    if (!fs.existsSync(TEMPEST_ROOT)) {
        throw new Error(`Dossier Tempest introuvable : ${TEMPEST_ROOT}`);
    }

    console.log("=== Publication Tempest vers OVH ===");
    console.log(`Source : ${TEMPEST_ROOT}`);
    console.log(`Cible  : ${VPS_USER}@${VPS_HOST}:${VPS_ROOT}`);
    console.log("");

    await regenerateManifest();

    /*
     * On prépare un dossier temporaire sur le VPS.
     * La version actuellement publiée reste donc intacte
     * tant que l'envoi n'est pas terminé.
     */
    const remoteStage = `${VPS_ROOT}.deploy`;

    console.log("\nPréparation du VPS...");
    run("ssh", [
        `${VPS_USER}@${VPS_HOST}`,
        `rm -rf '${remoteStage}' && mkdir -p '${remoteStage}'`
    ]);

    console.log("\nEnvoi de Tempest...");
    run("scp", [
        "-r",
        `${TEMPEST_ROOT}/.`,
        `${VPS_USER}@${VPS_HOST}:${remoteStage}/`
    ]);

    /*
     * Publication atomique-ish :
     * - l'ancien dossier est conservé brièvement en backup ;
     * - le nouveau prend sa place ;
     * - permissions lisibles par Nginx ;
     * - le backup est supprimé après succès.
     */
    console.log("\nActivation de la nouvelle version...");
    const remoteBackup = `${VPS_ROOT}.previous`;

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

    console.log("\nPublication Tempest terminée avec succès.");
    console.log(
        `Manifest public : http://${VPS_HOST}/tempest/manifest.json`
    );
}

main().catch((error) => {
    console.error("\nÉCHEC DE LA PUBLICATION TEMPEST");
    console.error(error.message);
    process.exit(1);
});
