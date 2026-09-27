const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const http = require("http");
const https = require("https");


const TEMPEST_SERVER_URL =
    "http://146.59.197.230/tempest";


/*
 * =========================================================
 * LOCAL DEV SERVER — SOURCE OF TRUTH
 * =========================================================
 *
 * En développement local, le contenu réel de :
 *
 *   dev-server/tempest/mods
 *   dev-server/tempest/shaderpacks
 *   dev-server/tempest/resourcepacks
 *
 * devient la source de vérité.
 *
 * Le manifest.json est régénéré automatiquement à partir
 * de ces dossiers avant chaque lecture du manifest.
 *
 * En production (URL distante), cette partie ne fait rien.
 */

const LOCAL_DEV_TEMPEST_ROOT =
    path.join(
        __dirname,
        "dev-server",
        "tempest"
    );


function isLocalDevServer() {

    return (
        TEMPEST_SERVER_URL.startsWith(
            "http://localhost:"
        ) ||
        TEMPEST_SERVER_URL.startsWith(
            "http://127.0.0.1:"
        )
    );
}


async function buildManifestCategory(
    category
) {

    const folder =
        path.join(
            LOCAL_DEV_TEMPEST_ROOT,
            category
        );


    fs.mkdirSync(
        folder,
        {
            recursive: true
        }
    );


    const expectedExtension =
        category === "mods"
            ? ".jar"
            : ".zip";


    const entries =
        fs.readdirSync(
            folder,
            {
                withFileTypes: true
            }
        )
        .filter(
            (entry) =>
                entry.isFile() &&
                path.extname(
                    entry.name
                ).toLowerCase() ===
                    expectedExtension
        )
        .sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name,
                    undefined,
                    {
                        sensitivity: "base"
                    }
                )
        );


    const files = [];


    for (const entry of entries) {

        const absolutePath =
            path.join(
                folder,
                entry.name
            );


        const stats =
            fs.statSync(
                absolutePath
            );


        files.push({
            file:
                entry.name,

            path:
                `${category}/${entry.name}`,

            size:
                stats.size,

            sha256:
                await sha256(
                    absolutePath
                )
        });
    }


    return files;
}


async function refreshLocalDevManifest() {

    if (
        !isLocalDevServer()
    ) {

        return;
    }


    if (
        !fs.existsSync(
            LOCAL_DEV_TEMPEST_ROOT
        )
    ) {

        return;
    }


    const manifestPath =
        path.join(
            LOCAL_DEV_TEMPEST_ROOT,
            "manifest.json"
        );


    let previousManifest = {};


    if (
        fs.existsSync(
            manifestPath
        )
    ) {

        try {

            previousManifest =
                JSON.parse(
                    fs.readFileSync(
                        manifestPath,
                        "utf8"
                    )
                );

        } catch (_error) {

            /*
             * Un ancien manifest cassé ne doit plus bloquer
             * le développement local : on le reconstruit.
             */
            previousManifest = {};
        }
    }


    const [
        mods,
        shaderpacks,
        resourcepacks
    ] =
        await Promise.all([
            buildManifestCategory(
                "mods"
            ),

            buildManifestCategory(
                "shaderpacks"
            ),

            buildManifestCategory(
                "resourcepacks"
            )
        ]);


    const manifest = {
        game:
            previousManifest.game ||
            "Tempest Origins",

        version:
            previousManifest.version ||
            "0.1.0",

        minecraft:
            previousManifest.minecraft ||
            "1.21.11",

        fabric:
            previousManifest.fabric ||
            "0.19.5",

        generatedAt:
            new Date().toISOString(),

        mods,
        shaderpacks,
        resourcepacks
    };


    fs.writeFileSync(
        manifestPath,
        JSON.stringify(
            manifest,
            null,
            4
        ) + "\n",
        "utf8"
    );


    console.log(
        `Manifest local régénéré — ${mods.length} mod(s), ${shaderpacks.length} shader(s), ${resourcepacks.length} resource pack(s).`
    );
}


function sha256(filePath) {

    return new Promise(
        (resolve, reject) => {

            const hash =
                crypto.createHash("sha256");

            const stream =
                fs.createReadStream(filePath);


            stream.on(
                "error",
                reject
            );


            stream.on(
                "data",
                (chunk) => {

                    hash.update(chunk);
                }
            );


            stream.on(
                "end",
                () => {

                    resolve(
                        hash.digest("hex")
                    );
                }
            );
        }
    );
}


function request(url) {

    return new Promise(
        (resolve, reject) => {

            const client =
                url.startsWith("https:")
                    ? https
                    : http;


            client
                .get(
                    url,
                    (response) => {

                        if (
                            response.statusCode >= 300 &&
                            response.statusCode < 400 &&
                            response.headers.location
                        ) {

                            response.resume();

                            resolve(
                                request(
                                    new URL(
                                        response.headers.location,
                                        url
                                    ).toString()
                                )
                            );

                            return;
                        }


                        if (
                            response.statusCode !== 200
                        ) {

                            response.resume();

                            reject(
                                new Error(
                                    `HTTP ${response.statusCode} : ${url}`
                                )
                            );

                            return;
                        }


                        resolve(response);
                    }
                )
                .on(
                    "error",
                    reject
                );
        }
    );
}


async function getManifest() {

    await refreshLocalDevManifest();


    const response =
        await request(
            `${TEMPEST_SERVER_URL}/manifest.json`
        );


    return new Promise(
        (resolve, reject) => {

            let data = "";


            response.setEncoding("utf8");


            response.on(
                "data",
                (chunk) => {

                    data += chunk;
                }
            );


            response.on(
                "end",
                () => {

                    try {

                        resolve(
                            JSON.parse(data)
                        );

                    } catch (error) {

                        reject(
                            new Error(
                                `Manifest invalide : ${error.message}`
                            )
                        );
                    }
                }
            );


            response.on(
                "error",
                reject
            );
        }
    );
}


async function fileIsValid(
    filePath,
    expectedSize,
    expectedHash
) {

    if (
        !fs.existsSync(filePath)
    ) {

        return false;
    }


    const stats =
        fs.statSync(filePath);


    if (
        stats.size !== expectedSize
    ) {

        return false;
    }


    const currentHash =
        await sha256(filePath);


    return (
        currentHash.toLowerCase() ===
        expectedHash.toLowerCase()
    );
}


async function downloadFile(
    relativePath,
    destination,
    expectedSize,
    expectedHash
) {

    const encodedPath =
        relativePath
            .split("/")
            .map(encodeURIComponent)
            .join("/");


    const url =
        `${TEMPEST_SERVER_URL}/${encodedPath}`;


    fs.mkdirSync(
        path.dirname(destination),
        {
            recursive: true
        }
    );


    const temporaryFile =
        `${destination}.download`;


    if (
        fs.existsSync(temporaryFile)
    ) {

        fs.unlinkSync(temporaryFile);
    }


    const response =
        await request(url);


    await new Promise(
        (resolve, reject) => {

            const output =
                fs.createWriteStream(
                    temporaryFile
                );


            response.pipe(output);


            output.on(
                "finish",
                () => {

                    output.close(resolve);
                }
            );


            output.on(
                "error",
                reject
            );


            response.on(
                "error",
                reject
            );
        }
    );


    const valid =
        await fileIsValid(
            temporaryFile,
            expectedSize,
            expectedHash
        );


    if (!valid) {

        fs.unlinkSync(
            temporaryFile
        );

        throw new Error(
            `Vérification SHA-256 échouée : ${relativePath}`
        );
    }


    fs.renameSync(
        temporaryFile,
        destination
    );
}


async function syncCategory(
    gamePath,
    category,
    files
) {

    const destinationFolder =
        path.join(
            gamePath,
            category
        );


    fs.mkdirSync(
        destinationFolder,
        {
            recursive: true
        }
    );


    let downloaded = 0;
    let unchanged = 0;
    let removed = 0;


    /*
       MODS / SHADERPACKS / RESOURCEPACKS =
       miroirs stricts du manifeste serveur.

       Tout fichier géré local absent du manifeste est supprimé.
    */
    if (
        category === "mods" ||
        category === "shaderpacks" ||
        category === "resourcepacks"
    ) {

        const allowedFiles =
            new Set(
                files.map(
                    (file) =>
                        String(file.file).toLowerCase()
                )
            );


        const localEntries =
            fs.readdirSync(
                destinationFolder,
                {
                    withFileTypes: true
                }
            );


        for (const entry of localEntries) {

            const managedExtension =
                category === "mods"
                    ? ".jar"
                    : ".zip";


            if (
                !entry.isFile() ||
                path.extname(entry.name).toLowerCase() !== managedExtension
            ) {

                continue;
            }


            if (
                allowedFiles.has(
                    entry.name.toLowerCase()
                )
            ) {

                continue;
            }


            const unwantedFile =
                path.join(
                    destinationFolder,
                    entry.name
                );


            console.log(
                `Suppression du fichier non autorisé [${category}] : ${entry.name}`
            );


            fs.unlinkSync(unwantedFile);
            removed++;
        }
    }


    for (
        const file
        of files
    ) {

        const destination =
            path.join(
                destinationFolder,
                file.file
            );


        const valid =
            await fileIsValid(
                destination,
                file.size,
                file.sha256
            );


        if (valid) {

            unchanged++;

            continue;
        }


        console.log(
            `Téléchargement : ${file.path}`
        );


        await downloadFile(
            file.path,
            destination,
            file.size,
            file.sha256
        );


        downloaded++;
    }


    return {
        downloaded,
        unchanged,
        removed
    };
}


async function checkCategory(
    gamePath,
    category,
    files
) {

    const destinationFolder =
        path.join(
            gamePath,
            category
        );


    const missing = [];
    const outdated = [];
    const unauthorized = [];
    let totalBytes = 0;


    for (
        const file
        of files
    ) {

        const destination =
            path.join(
                destinationFolder,
                file.file
            );


        if (
            !fs.existsSync(destination)
        ) {

            missing.push(file);
            totalBytes += file.size;

            continue;
        }


        const valid =
            await fileIsValid(
                destination,
                file.size,
                file.sha256
            );


        if (!valid) {

            outdated.push(file);
            totalBytes += file.size;
        }
    }


    if (
        (
            category === "mods" ||
            category === "shaderpacks" ||
            category === "resourcepacks"
        ) &&
        fs.existsSync(destinationFolder)
    ) {

        const allowedFiles =
            new Set(
                files.map(
                    (file) =>
                        String(file.file).toLowerCase()
                )
            );


        const localEntries =
            fs.readdirSync(
                destinationFolder,
                {
                    withFileTypes: true
                }
            );


        for (const entry of localEntries) {

            const managedExtension =
                category === "mods"
                    ? ".jar"
                    : ".zip";


            if (
                !entry.isFile() ||
                path.extname(entry.name).toLowerCase() !== managedExtension
            ) {

                continue;
            }


            if (
                !allowedFiles.has(
                    entry.name.toLowerCase()
                )
            ) {

                unauthorized.push({
                    file: entry.name,
                    path: `${category}/${entry.name}`
                });
            }
        }
    }


    return {
        missing,
        outdated,
        unauthorized,
        totalBytes,
        needsUpdate:
            missing.length > 0 ||
            outdated.length > 0 ||
            unauthorized.length > 0
    };
}


async function checkTempestUpdate(gamePath) {

    console.log(
        "Vérification des mises à jour Tempest..."
    );


    const manifest =
        await getManifest();


    const mods =
        await checkCategory(
            gamePath,
            "mods",
            manifest.mods || []
        );


    const shaderpacks =
        await checkCategory(
            gamePath,
            "shaderpacks",
            manifest.shaderpacks || []
        );


    const resourcepacks =
        await checkCategory(
            gamePath,
            "resourcepacks",
            manifest.resourcepacks || []
        );


    const needsUpdate =
        mods.needsUpdate ||
        shaderpacks.needsUpdate ||
        resourcepacks.needsUpdate;


    const totalFiles =
        mods.missing.length +
        mods.outdated.length +
        mods.unauthorized.length +
        shaderpacks.missing.length +
        shaderpacks.outdated.length +
        shaderpacks.unauthorized.length +
        resourcepacks.missing.length +
        resourcepacks.outdated.length +
        resourcepacks.unauthorized.length;


    const totalBytes =
        mods.totalBytes +
        shaderpacks.totalBytes +
        resourcepacks.totalBytes;


    console.log(
        needsUpdate
            ? `Mise à jour disponible : ${totalFiles} fichier(s).`
            : "Tempest est déjà à jour."
    );


    return {
        needsUpdate,
        totalFiles,
        totalBytes,
        version:
            manifest.version,
        manifest,
        mods,
        shaderpacks,
        resourcepacks
    };
}


async function syncTempest(gamePath) {

    console.log(
        "Recherche des mises à jour Tempest..."
    );


    const manifest =
        await getManifest();


    const mods =
        await syncCategory(
            gamePath,
            "mods",
            manifest.mods || []
        );


    const shaderpacks =
        await syncCategory(
            gamePath,
            "shaderpacks",
            manifest.shaderpacks || []
        );


    const resourcepacks =
        await syncCategory(
            gamePath,
            "resourcepacks",
            manifest.resourcepacks || []
        );


    console.log(
        `Mise à jour terminée — mods: ${mods.downloaded} téléchargé(s), ${mods.removed} supprimé(s) ; shaders: ${shaderpacks.downloaded} téléchargé(s), ${shaderpacks.removed} supprimé(s) ; resource packs: ${resourcepacks.downloaded} téléchargé(s), ${resourcepacks.removed} supprimé(s).`
    );


    return {
        manifest,
        mods,
        shaderpacks,
        resourcepacks
    };
}


module.exports = {
    checkTempestUpdate,
    syncTempest
};