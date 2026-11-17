/*
 * ORIGINS LAUNCHER — DIAGNOSTIC DE LANCEMENT
 *
 * Quand Tempest ne se lance pas ou plante au démarrage, on cherche la cause
 * (erreur du launcher, sortie du jeu, logs/latest.log, crash-reports/) pour
 * montrer au joueur un message clair, dans sa langue, avec la bonne action.
 *
 * Codes rendus (traduits dans src/i18n.js, clés problem<Code>Title / Text) :
 *   JAVA_DOWNLOAD_FAILED, JAVA_CHECKSUM, JAVA_EXTRACT_FAILED, JAVA_TOO_OLD,
 *   NETWORK, DISK_SPACE, AUTH, MEMORY_TOO_HIGH, MEMORY_TOO_LOW, GPU_DRIVER,
 *   MODS_CONFLICT, FILES_CORRUPTED, UNKNOWN
 */

const fs = require("fs");
const path = require("path");

/** Motifs reconnus dans la sortie du jeu et ses rapports, du plus précis au plus général. */
const CRASH_PATTERNS = [
    ["JAVA_TOO_OLD", /UnsupportedClassVersionError|has been compiled by a more recent version of the Java Runtime|requires (?:at least )?Java 2\d|Minecraft \d[\d.]* requires Java/i],
    ["MEMORY_TOO_HIGH", /Could not reserve enough space for (?:object heap|\d+KB object heap)|Invalid maximum heap size|Initial heap size set to a larger value than the maximum|Error occurred during initialization of VM[\s\S]{0,200}heap|insufficient memory for the Java Runtime Environment|Native memory allocation \(mmap\) failed|os::commit_memory\([^)]*\) failed|errno=1455/i],
    ["MEMORY_TOO_LOW", /java\.lang\.OutOfMemoryError|GC overhead limit exceeded/i],
    ["GPU_DRIVER", /GLFW error 6554[23]|WGL: The driver does not appear to support OpenGL|Pixel format not accelerated|No OpenGL context|failed to create (?:the )?(?:window|OpenGL context)|EXCEPTION_ACCESS_VIOLATION[\s\S]{0,400}(?:ig[0-9a-z]+icd|nvoglv|atio6axx|amdxx)/i],
    ["MODS_CONFLICT", /Incompatible mods? (?:set|found)|Mod resolution failed|net\.fabricmc\.loader\.impl\.FormattedException|requires (?:version|any version) .* of mod|is incompatible with|Mixin apply (?:failed|for mod)|MixinApplyError|Could not execute entrypoint stage/i],
    // Les messages de Java suivent la langue de Windows : on reconnaît les 5 langues du launcher.
    ["FILES_CORRUPTED", /ZipException|invalid LOC header|zip END header not found|Could not find or load main class|impossible de trouver ou de charger la classe principale|no se ha encontrado o cargado la clase principal|Hauptklasse .{0,80}nicht gefunden|n[ãa]o foi poss[íi]vel (?:localizar|encontrar) nem carregar a classe principal|NoClassDefFoundError|ClassNotFoundException: net\.minecraft|NoSuchFileException.*\.jar/i]
];

/** Classe un texte (sortie du jeu, rapport de plantage, message d'erreur). */
function classifyText(text) {
    const value = String(text || "");
    for (const [code, pattern] of CRASH_PATTERNS) {
        if (pattern.test(value)) return code;
    }
    return null;
}

/** Classe une erreur levée pendant la préparation du lancement. */
function classifyError(error) {
    if (!error) return "UNKNOWN";
    if (typeof error.code === "string" && /^(JAVA_|DISK_SPACE|NETWORK|AUTH)/.test(error.code)) return error.code;
    const text = `${error.code || ""} ${error.message || ""} ${error.cause?.message || ""}`;
    if (/ENOSPC|no space left|espace disque/i.test(text)) return "DISK_SPACE";
    if (/ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ECONNRESET|ETIMEDOUT|socket hang up|fetch failed|network|HTTP_5\d\d/i.test(text)) return "NETWORK";
    if (/xbox|microsoft|minecraft (?:account|profile)|token|auth|n'a pas de compte|does not own/i.test(text)) return "AUTH";
    return classifyText(text) || "UNKNOWN";
}

/** Espace libre (octets) sur le disque du dossier donné, ou null si illisible. */
function freeSpace(dir) {
    try {
        let current = path.resolve(dir);
        while (!fs.existsSync(current)) {
            const parent = path.dirname(current);
            if (parent === current) return null;
            current = parent;
        }
        const stats = fs.statfsSync(current);
        return stats.bavail * stats.bsize;
    } catch (_) {
        return null;
    }
}

/** Erreur DISK_SPACE si moins de `minBytes` sont libres. */
function assertDiskSpace(dir, minBytes) {
    const free = freeSpace(dir);
    if (free !== null && free < minBytes) {
        const error = new Error(`Plus assez d'espace disque : ${(free / 1024 ** 3).toFixed(1)} Go libres.`);
        error.code = "DISK_SPACE";
        throw error;
    }
}

function tail(text, maxLines) {
    const lines = String(text || "").split(/\r?\n/);
    return lines.slice(-maxLines).join("\n");
}

/** Rapport de plantage le plus récent (crash-reports/) écrit après `since`. */
function latestCrashReport(gamePath, since) {
    try {
        const dir = path.join(gamePath, "crash-reports");
        const files = fs.readdirSync(dir)
            .filter((name) => name.endsWith(".txt"))
            .map((name) => ({ file: path.join(dir, name), time: fs.statSync(path.join(dir, name)).mtimeMs }))
            .filter((entry) => entry.time >= since)
            .sort((a, b) => b.time - a.time);
        return files[0] ? { file: files[0].file, text: fs.readFileSync(files[0].file, "utf8") } : null;
    } catch (_) {
        return null;
    }
}

/** Rapport de plantage grave de Java (hs_err_pid*.log), écrit dans le dossier du jeu. */
function latestJvmCrash(gamePath, since) {
    try {
        const files = fs.readdirSync(gamePath)
            .filter((name) => /^hs_err_pid\d+\.log$/.test(name))
            .map((name) => ({ file: path.join(gamePath, name), time: fs.statSync(path.join(gamePath, name)).mtimeMs }))
            .filter((entry) => entry.time >= since)
            .sort((a, b) => b.time - a.time);
        return files[0] ? { file: files[0].file, text: fs.readFileSync(files[0].file, "utf8").slice(0, 20000) } : null;
    } catch (_) {
        return null;
    }
}

function latestLog(gamePath) {
    try {
        return fs.readFileSync(path.join(gamePath, "logs", "latest.log"), "utf8");
    } catch (_) {
        return "";
    }
}

/**
 * Après un arrêt anormal du jeu : rassemble ce qu'on sait et trouve la cause.
 *   output : dernières lignes écrites par le jeu (stdout + stderr)
 * Rend { code, report, crashReportFile }.
 */
function diagnoseCrash({ gamePath, output, startedAt, exitCode, javaVersion }) {
    const crash = latestCrashReport(gamePath, startedAt) || latestJvmCrash(gamePath, startedAt);
    const log = latestLog(gamePath);
    const code = classifyText(crash?.text) || classifyText(output) || classifyText(tail(log, 400)) || "UNKNOWN";
    const report = [
        `Origins Launcher — rapport de lancement de Tempest`,
        `Date : ${new Date().toISOString()}`,
        `Cause trouvée : ${code}`,
        `Code de sortie du jeu : ${exitCode}`,
        `Java : ${javaVersion || "?"}`,
        `Système : ${process.platform} ${process.arch}`,
        crash ? `Rapport de plantage : ${crash.file}` : "Rapport de plantage : aucun",
        "",
        "----- Sortie du jeu (fin) -----",
        tail(output, 80),
        "",
        "----- logs/latest.log (fin) -----",
        tail(log, 80),
        crash ? `\n----- ${path.basename(crash.file)} (début) -----\n${crash.text.split(/\r?\n/).slice(0, 60).join("\n")}` : ""
    ].join("\n");
    return { code, report, crashReportFile: crash?.file || null };
}

/** Garde les dernières lignes d'un flux (sortie du jeu). */
function createOutputBuffer(maxLines = 400) {
    let lines = [];
    let partial = "";
    return {
        push(chunk) {
            const text = partial + String(chunk);
            const parts = text.split(/\r?\n/);
            partial = parts.pop();
            lines.push(...parts);
            if (lines.length > maxLines) lines = lines.slice(-maxLines);
        },
        text() {
            return [...lines, partial].join("\n");
        }
    };
}

module.exports = { classifyText, classifyError, assertDiskSpace, diagnoseCrash, createOutputBuffer, freeSpace };
