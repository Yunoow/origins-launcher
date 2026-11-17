/*
 * ORIGINS LAUNCHER — JAVA EMBARQUÉ
 *
 * Minecraft (donc Tempest) a besoin de Java 21. Plutôt que de demander au joueur
 * de l'installer, le launcher télécharge une seule fois un Java 21 (Eclipse Temurin,
 * via l'API officielle d'Adoptium) dans son propre dossier :
 *
 *   %APPDATA%/OriginsLauncher/runtime/java-21-<système>-<processeur>/
 *
 * Rien n'est installé sur le PC : pas de droits administrateur, pas de PATH, aucun
 * conflit avec un autre Java. Le fichier est vérifié (SHA-256) avant d'être utilisé.
 * Si le téléchargement échoue, on se rabat sur un Java 21 déjà installé sur le PC.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFile } = require("child_process");

const JAVA_MAJOR = 21;
const ADOPTIUM_API = "https://api.adoptium.net/v3/assets/latest";
const MARKER = "origins-java.json";

/** Système et processeur au format d'Adoptium. */
function platformIds() {
    const os = { win32: "windows", darwin: "mac", linux: "linux" }[process.platform];
    const arch = { x64: "x64", arm64: "aarch64" }[process.arch];
    if (!os || !arch) {
        const error = new Error(`Système non pris en charge : ${process.platform}/${process.arch}`);
        error.code = "JAVA_UNSUPPORTED_PLATFORM";
        throw error;
    }
    return { os, arch };
}

/** Numéro principal d'une version Java : "1.8.0_391" → 8, "21.0.5" → 21. */
function javaMajor(versionText) {
    const match = String(versionText || "").match(/(\d+)(?:\.(\d+))?/);
    if (!match) return 0;
    const first = Number(match[1]);
    return first === 1 && match[2] ? Number(match[2]) : first;
}

/** Lance `<java> -version` et rend la version lue (ou null). */
function readJavaVersion(javaExe) {
    return new Promise((resolve) => {
        execFile(javaExe, ["-version"], { windowsHide: true, timeout: 15000 }, (error, stdout, stderr) => {
            if (error) return resolve(null);
            const text = `${stderr || ""}\n${stdout || ""}`;
            const match = text.match(/version "([^"]+)"/) || text.match(/(?:openjdk|java) (\d[\w.+-]*)/i);
            resolve(match ? match[1] : null);
        });
    });
}

/** Cherche bin/java(.exe) dans le dossier extrait (Mac : Contents/Home/bin/java). */
function findJavaBinary(dir, depth = 0) {
    const exe = process.platform === "win32" ? "java.exe" : "java";
    const direct = path.join(dir, "bin", exe);
    if (fs.existsSync(direct)) return direct;
    if (depth >= 4) return null;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const found = findJavaBinary(path.join(dir, entry.name), depth + 1);
        if (found) return found;
    }
    return null;
}

/** javaw.exe sous Windows (pas de fenêtre de console en plus), java ailleurs. */
function launchBinary(javaExe) {
    if (process.platform !== "win32") return javaExe;
    const javaw = path.join(path.dirname(javaExe), "javaw.exe");
    return fs.existsSync(javaw) ? javaw : javaExe;
}

function runTar(args) {
    // Windows 10+ fournit tar.exe (bsdtar), qui sait aussi ouvrir les .zip.
    const tar = process.platform === "win32"
        ? path.join(process.env.SystemRoot || "C:\\Windows", "System32", "tar.exe")
        : "tar";
    return new Promise((resolve, reject) => {
        execFile(tar, args, { windowsHide: true, maxBuffer: 1024 * 1024 * 16 }, (error, _out, stderr) => {
            if (error) {
                const failure = new Error(`Extraction de Java impossible : ${stderr || error.message}`);
                failure.code = "JAVA_EXTRACT_FAILED";
                return reject(failure);
            }
            resolve();
        });
    });
}

async function fetchJson(url) {
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`HTTP_${response.status}`);
    return response.json();
}

/** Télécharge `url` dans `file` en vérifiant le SHA-256. onBytes(reçus, total). */
async function download(url, file, expectedSha256, onBytes) {
    const response = await fetch(url);
    if (!response.ok || !response.body) throw new Error(`HTTP_${response.status}`);
    const total = Number(response.headers.get("content-length")) || 0;
    const hash = crypto.createHash("sha256");
    const out = fs.createWriteStream(file);
    let received = 0;
    try {
        for await (const chunk of response.body) {
            hash.update(chunk);
            received += chunk.length;
            if (!out.write(chunk)) await new Promise((r) => out.once("drain", r));
            onBytes?.(received, total);
        }
    } finally {
        await new Promise((r) => out.end(r));
    }
    const digest = hash.digest("hex");
    if (expectedSha256 && digest.toLowerCase() !== String(expectedSha256).toLowerCase()) {
        const error = new Error("Le fichier Java téléchargé est abîmé (somme de contrôle différente).");
        error.code = "JAVA_CHECKSUM";
        throw error;
    }
}

/**
 * Rend un Java 21 prêt à lancer Tempest.
 *   baseDir    : dossier des runtimes (…/OriginsLauncher/runtime)
 *   onProgress : (pourcentage 0–100, étape) pendant le téléchargement
 *   detectSystemJava : () => Promise<{found, version}> (Java du PC, en secours)
 * Rend { javaPath, version, source: "embedded" | "system" }.
 */
async function ensureJavaRuntime({ baseDir, onProgress, detectSystemJava } = {}) {
    const { os, arch } = platformIds();
    const targetDir = path.join(baseDir, `java-${JAVA_MAJOR}-${os}-${arch}`);
    const markerFile = path.join(targetDir, MARKER);

    // 1. Déjà téléchargé et en état de marche ?
    if (fs.existsSync(markerFile)) {
        try {
            const marker = JSON.parse(fs.readFileSync(markerFile, "utf8"));
            const javaExe = marker.javaExe && path.join(targetDir, marker.javaExe);
            if (javaExe && fs.existsSync(javaExe)) {
                const version = await readJavaVersion(javaExe);
                if (javaMajor(version) >= JAVA_MAJOR) {
                    return { javaPath: launchBinary(javaExe), version, source: "embedded" };
                }
            }
        } catch (_) {
            // Marqueur illisible : on retélécharge.
        }
    }

    // 2. Téléchargement de Temurin 21 (JRE) pour ce système.
    let downloadError = null;
    try {
        onProgress?.(0, "lookup");
        const query = `?architecture=${arch}&image_type=jre&os=${os}&vendor=eclipse`;
        const releases = await fetchJson(`${ADOPTIUM_API}/${JAVA_MAJOR}/hotspot${query}`);
        const release = Array.isArray(releases) ? releases.find((item) => item?.binary?.package?.link) : null;
        if (!release) throw new Error("Aucun Java 21 disponible pour ce système.");
        const pkg = release.binary.package;

        fs.mkdirSync(baseDir, { recursive: true });
        const archive = path.join(baseDir, pkg.name);
        const tempDir = path.join(baseDir, `java-${JAVA_MAJOR}-${os}-${arch}.tmp`);
        fs.rmSync(tempDir, { recursive: true, force: true });

        await download(pkg.link, archive, pkg.checksum, (got, total) => {
            const size = total || pkg.size || 0;
            onProgress?.(size ? Math.min(99, Math.round((got / size) * 100)) : 0, "download");
        });

        onProgress?.(99, "extract");
        fs.mkdirSync(tempDir, { recursive: true });
        await runTar(["-xf", archive, "-C", tempDir]);
        fs.rmSync(archive, { force: true });

        const javaExe = findJavaBinary(tempDir);
        if (!javaExe) throw new Error("Java introuvable dans l'archive téléchargée.");
        if (process.platform !== "win32") fs.chmodSync(javaExe, 0o755);

        fs.rmSync(targetDir, { recursive: true, force: true });
        fs.renameSync(tempDir, targetDir);
        const finalExe = path.join(targetDir, path.relative(tempDir, javaExe));
        const version = await readJavaVersion(finalExe);
        if (javaMajor(version) < JAVA_MAJOR) throw new Error("Le Java téléchargé ne démarre pas.");

        fs.writeFileSync(markerFile, JSON.stringify({
            vendor: "Eclipse Temurin",
            release: release.release_name,
            sha256: pkg.checksum,
            javaExe: path.relative(targetDir, finalExe),
            installedAt: new Date().toISOString()
        }, null, 2));
        onProgress?.(100, "done");
        return { javaPath: launchBinary(finalExe), version, source: "embedded" };
    } catch (error) {
        downloadError = error;
        console.error("Java embarqué indisponible :", error);
    }

    // 3. Secours : un Java 21 déjà installé sur le PC.
    if (detectSystemJava) {
        const system = await detectSystemJava();
        if (system?.found && javaMajor(system.version) >= JAVA_MAJOR) {
            return {
                javaPath: process.platform === "win32" ? "javaw" : "java",
                version: system.version,
                source: "system"
            };
        }
        if (system?.found) {
            const error = new Error(`Java ${system.version} est trop ancien : Tempest a besoin de Java ${JAVA_MAJOR}.`);
            error.code = "JAVA_TOO_OLD";
            error.cause = downloadError;
            throw error;
        }
    }

    const error = new Error(`Java ${JAVA_MAJOR} n'a pas pu être préparé : ${downloadError?.message || "erreur inconnue"}`);
    error.code = downloadError?.code === "JAVA_CHECKSUM" ? "JAVA_CHECKSUM" : "JAVA_DOWNLOAD_FAILED";
    error.cause = downloadError;
    throw error;
}

/** Supprime le Java embarqué (bouton « Réparer Java ») : il sera retéléchargé au prochain lancement. */
function removeJavaRuntime(baseDir) {
    const { os, arch } = platformIds();
    fs.rmSync(path.join(baseDir, `java-${JAVA_MAJOR}-${os}-${arch}`), { recursive: true, force: true });
}

module.exports = { ensureJavaRuntime, removeJavaRuntime, javaMajor, JAVA_MAJOR };
