/*
 * Mise en ligne ciblée d'un seul mod Tempest.
 *
 *   npm.cmd run deploy:tempest:ajout -- <chemin\Mod-1.2.3.jar> [--essai]
 *   npm.cmd run deploy:tempest:ajout -- --retirer <Mod> [--essai]
 *
 * Contrairement à deploy:tempest (qui remplace tout le dossier en ligne par
 * dev-server/tempest), ce script part du manifest EN LIGNE : il garde toutes
 * ses entrées, remplace seulement celle du même mod (même nom avant la
 * version : TempestHud-0.1.0.jar et TempestHud-0.2.0.jar sont le même mod)
 * ou l'ajoute, et n'envoie que ce jar et le nouveau manifest.
 * Il ne lit jamais dev-server : n'importe quel développeur peut s'en servir.
 *
 * --essai : affiche ce qui changerait, sans rien envoyer.
 */
const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");

const VPS_HOST = "146.59.197.230";
const VPS_USER = "ubuntu";
const VPS_ROOT = "/var/www/origins/tempest";
const MANIFEST_URL = `http://${VPS_HOST}/tempest/manifest.json`;

/** Nom du mod sans sa version : « TempestHud-0.1.0.jar » → « tempesthud ». */
function nomDuMod(fichier) {
    const base = fichier.replace(/\.jar$/i, "");
    const match = base.match(/^(.*?)[-_+]v?\d/);
    return (match ? match[1] : base).toLowerCase();
}

function sha256Texte(texte) {
    return crypto.createHash("sha256").update(texte).digest("hex");
}

function sha256Fichier(chemin) {
    return crypto.createHash("sha256").update(fs.readFileSync(chemin)).digest("hex");
}

function lireArguments(argv) {
    const args = { essai: false, retirer: null, jar: null };

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === "--essai") args.essai = true;
        else if (arg === "--retirer") args.retirer = argv[++i];
        else if (arg.startsWith("--")) throw new Error(`Option inconnue : ${arg}`);
        else if (!args.jar) args.jar = arg;
        else throw new Error(`Argument en trop : ${arg}`);
    }

    if (!!args.jar === !!args.retirer) {
        throw new Error(
            "Usage : deploy:tempest:ajout -- <chemin.jar> [--essai]\n" +
            "     ou deploy:tempest:ajout -- --retirer <Mod> [--essai]"
        );
    }
    return args;
}

function run(command, args) {
    const result = spawnSync(command, args, { stdio: "inherit", shell: false });
    if (result.error) throw result.error;
    if (result.status !== 0) {
        throw new Error(`${command} a échoué avec le code ${result.status}.`);
    }
}

async function main() {
    const args = lireArguments(process.argv.slice(2));

    console.log(`Manifest en ligne : ${MANIFEST_URL}`);
    const reponse = await fetch(MANIFEST_URL, { cache: "no-store" });
    if (!reponse.ok) throw new Error(`Manifest en ligne illisible (HTTP ${reponse.status}).`);
    const texteEnLigne = await reponse.text();
    const enLigne = JSON.parse(texteEnLigne);
    if (!Array.isArray(enLigne.mods)) throw new Error("Manifest en ligne sans liste de mods.");

    const vise = nomDuMod(args.jar ? path.basename(args.jar) : args.retirer);
    const anciens = enLigne.mods.filter((m) => nomDuMod(m.file) === vise);
    if (anciens.length > 1) {
        throw new Error(
            `Plusieurs mods en ligne s'appellent « ${vise} » : ` +
            anciens.map((m) => m.file).join(", ") + ". Rien n'est fait."
        );
    }
    const ancien = anciens[0] || null;

    let nouveau = null;
    if (args.jar) {
        const chemin = path.resolve(args.jar);
        if (!fs.existsSync(chemin) || path.extname(chemin).toLowerCase() !== ".jar") {
            throw new Error(`Jar introuvable : ${chemin}`);
        }
        const fichier = path.basename(chemin);
        if (/[^\w.+-]/.test(fichier)) throw new Error(`Nom de jar refusé (espaces ou caractères spéciaux) : ${fichier}`);
        nouveau = {
            file: fichier,
            path: `mods/${fichier}`,
            size: fs.statSync(chemin).size,
            sha256: sha256Fichier(chemin),
            source: chemin
        };
        if (ancien && ancien.file === nouveau.file && ancien.sha256 === nouveau.sha256) {
            console.log(`\n${fichier} est déjà en ligne, identique. Rien à faire.`);
            return;
        }
    } else if (!ancien) {
        throw new Error(`Aucun mod « ${vise} » en ligne. Rien à retirer.`);
    }

    const mods = enLigne.mods.filter((m) => m !== ancien);
    if (nouveau) {
        const { source, ...entree } = nouveau;
        mods.push(entree);
    }
    mods.sort((a, b) => a.file.localeCompare(b.file, undefined, { sensitivity: "base" }));
    const manifest = { ...enLigne, generatedAt: new Date().toISOString(), mods };
    const texteManifest = JSON.stringify(manifest, null, 4) + "\n";

    console.log("");
    console.log(`Mod visé : ${vise}`);
    console.log(`  en ligne : ${ancien ? `${ancien.file} (${ancien.size} o)` : "absent"}`);
    console.log(`  après    : ${nouveau ? `${nouveau.file} (${nouveau.size} o, sha256 ${nouveau.sha256})` : "retiré"}`);
    console.log(`Mods : ${enLigne.mods.length} → ${mods.length} ; shaders et resource packs inchangés.`);

    if (args.essai) {
        console.log("\n--essai : rien n'est envoyé. Manifest qui serait publié :\n");
        process.stdout.write(texteManifest);
        return;
    }

    /*
     * Envoi : le jar et le manifest arrivent sous des noms temporaires, puis
     * un seul ssh vérifie que le manifest en ligne n'a pas changé entre-temps
     * et les met en place (jar d'abord, manifest ensuite, ancien jar en dernier).
     */
    const temporaire = fs.mkdtempSync(path.join(os.tmpdir(), "tempest-ajout-"));
    const manifestLocal = path.join(temporaire, "manifest.json");
    fs.writeFileSync(manifestLocal, texteManifest, "utf8");

    const cible = `${VPS_USER}@${VPS_HOST}`;
    const etapes = ["set -e", `cd '${VPS_ROOT}'`];

    try {
        if (nouveau) {
            console.log(`\nEnvoi de ${nouveau.file}...`);
            run("scp", [nouveau.source, `${cible}:${VPS_ROOT}/mods/.${nouveau.file}.envoi`]);
        }
        console.log("\nEnvoi du manifest...");
        run("scp", [manifestLocal, `${cible}:${VPS_ROOT}/.manifest.json.envoi`]);

        etapes.push(
            `test "$(sha256sum manifest.json | cut -d' ' -f1)" = '${sha256Texte(texteEnLigne)}' ` +
            `|| { echo 'Le manifest en ligne a changé pendant l envoi : rien n est remplacé.' >&2; ` +
            `rm -f .manifest.json.envoi mods/.*.envoi; exit 1; }`
        );
        if (nouveau) {
            etapes.push(
                `chmod 644 'mods/.${nouveau.file}.envoi'`,
                `mv 'mods/.${nouveau.file}.envoi' 'mods/${nouveau.file}'`
            );
        }
        etapes.push(
            "chmod 644 .manifest.json.envoi",
            "mv .manifest.json.envoi manifest.json"
        );
        if (ancien && (!nouveau || ancien.file !== nouveau.file)) {
            etapes.push(`rm -f 'mods/${ancien.file}'`);
        }

        console.log("\nActivation...");
        run("ssh", [cible, etapes.join(" && ")]);
    } finally {
        fs.rmSync(temporaire, { recursive: true, force: true });
    }

    console.log("\nMise en ligne ciblée terminée.");
    console.log(`Manifest public : ${MANIFEST_URL}`);
}

main().catch((error) => {
    console.error("\nÉCHEC DE LA MISE EN LIGNE CIBLÉE");
    console.error(error.message);
    process.exit(1);
});
