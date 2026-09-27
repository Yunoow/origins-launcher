const {

    app,

    BrowserWindow,

    ipcMain,

    Tray,

    Menu,

    nativeImage,

    Notification,

    dialog,

    shell,

    clipboard,
    safeStorage

} = require("electron");



const path = require("path");

const fs = require("fs");

const https = require("https");

const { execFile } = require("child_process");

const { autoUpdater } = require("electron-updater");

const {

    PublicClientApplication

} = require("@azure/msal-node");



const {

    Client

} = require("minecraft-launcher-core");



const {

    checkTempestUpdate,

    syncTempest

} = require("./tempest-updater");





const minecraftLauncher =

    new Client({

        windowsHide: true

    });





let mainWindow;

let tray = null;

let isQuitting = false;

let tempestRunning = false;



/*

 * Launch warm-cache.

 * This only avoids repeating checks whose result cannot normally change

 * during the same launcher session. Tempest synchronization remains enabled

 * on every launch, so the existing cleanup/update rules are preserved.

 */

let cachedJava = null;

let cachedFabric = null;
let cachedMinecraftAuthorization = null;
let cachedMinecraftProfile = null;





/* ==========================================

   ORIGINS PROFILE API + MICROSOFT AUTH

========================================== */



const ORIGINS_API_BASE =

    "http\://146.59.197.230/api";



const MICROSOFT_CLIENT_ID =

    "98bd9028-4590-44ab-aa79-2fd168c4d52d";



const MICROSOFT_TENANT_ID =

    "9188040d-6c67-4c5b-b112-36a304b66dad";



const MICROSOFT_SCOPES = [
    "openid",
    "profile",
    "XboxLive.signin",
    "XboxLive.offline_access"
];

function getMicrosoftCachePath() {
    return path.join(app.getPath("userData"), "microsoft-auth-cache.bin");
}

const microsoftCachePlugin = {
    beforeCacheAccess: async (cacheContext) => {
        try {
            const cachePath = getMicrosoftCachePath();
            if (!safeStorage.isEncryptionAvailable() || !fs.existsSync(cachePath)) return;

            const encrypted = fs.readFileSync(cachePath);
            if (!encrypted.length) return;

            const serialized = safeStorage.decryptString(encrypted);
            if (serialized) cacheContext.tokenCache.deserialize(serialized);
        } catch (error) {
            console.warn("Impossible de restaurer le cache Microsoft :", error?.message || error);
        }
    },

    afterCacheAccess: async (cacheContext) => {
        if (!cacheContext.cacheHasChanged) return;

        try {
            if (!safeStorage.isEncryptionAvailable()) {
                console.warn("Stockage sécurisé indisponible : cache Microsoft non persisté.");
                return;
            }

            const cachePath = getMicrosoftCachePath();
            fs.mkdirSync(path.dirname(cachePath), { recursive: true });

            const serialized = cacheContext.tokenCache.serialize();
            const encrypted = safeStorage.encryptString(serialized);
            fs.writeFileSync(cachePath, encrypted);
        } catch (error) {
            console.warn("Impossible de sauvegarder le cache Microsoft :", error?.message || error);
        }
    }
};

const microsoftAuth =
    new PublicClientApplication({
        auth: {
            clientId: MICROSOFT_CLIENT_ID,
            authority: `https://login.microsoftonline.com/${MICROSOFT_TENANT_ID}`
        },
        cache: {
            cachePlugin: microsoftCachePlugin
        }
    });


async function readJsonResponse(response, label) {
    let data = null;

    try {
        data = await response.json();
    } catch (_) {}

    if (!response.ok) {
        const detail =
            data?.errorMessage ||
            data?.Message ||
            data?.message ||
            data?.error ||
            `HTTP_${response.status}`;

        throw new Error(`${label}:${detail}`);
    }

    return data;
}

async function postJson(url, body, extraHeaders = {}) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            ...extraHeaders
        },
        body: JSON.stringify(body)
    });

    return readJsonResponse(
        response,
        "AUTH_REQUEST_FAILED"
    );
}

async function minecraftAuthorizationFromMicrosoftAccessToken(
    microsoftAccessToken
) {
    if (!microsoftAccessToken) {
        throw new Error(
            "MICROSOFT_XBOX_TOKEN_MISSING"
        );
    }

    const xboxUser = await postJson(
        "https://user.auth.xboxlive.com/user/authenticate",
        {
            Properties: {
                AuthMethod: "RPS",
                SiteName: "user.auth.xboxlive.com",
                RpsTicket:
                    `d=${microsoftAccessToken}`
            },
            RelyingParty:
                "http://auth.xboxlive.com",
            TokenType: "JWT"
        },
        {
            "x-xbl-contract-version": "1"
        }
    );

    const xboxToken = xboxUser?.Token;
    const userHash =
        xboxUser?.DisplayClaims?.xui?.[0]?.uhs;

    if (!xboxToken || !userHash) {
        throw new Error(
            "XBOX_USER_TOKEN_INVALID"
        );
    }

    const xsts = await postJson(
        "https://xsts.auth.xboxlive.com/xsts/authorize",
        {
            Properties: {
                SandboxId: "RETAIL",
                UserTokens: [xboxToken]
            },
            RelyingParty:
                "rp://api.minecraftservices.com/",
            TokenType: "JWT"
        },
        {
            "x-xbl-contract-version": "1"
        }
    );

    const xstsToken = xsts?.Token;

    if (!xstsToken) {
        throw new Error(
            "XSTS_TOKEN_INVALID"
        );
    }

    const minecraftLogin = await postJson(
        "https://api.minecraftservices.com/authentication/login_with_xbox",
        {
            identityToken:
                `XBL3.0 x=${userHash};${xstsToken}`,
            ensureLegacyEnabled: true
        }
    );

    const minecraftAccessToken =
        minecraftLogin?.access_token;

    if (!minecraftAccessToken) {
        throw new Error(
            "MINECRAFT_ACCESS_TOKEN_MISSING"
        );
    }

    const response = await fetch(
        "https://api.minecraftservices.com/minecraft/profile",
        {
            headers: {
                Authorization:
                    `Bearer ${minecraftAccessToken}`,
                Accept: "application/json"
            }
        }
    );

    const minecraftProfile =
        await readJsonResponse(
            response,
            "MINECRAFT_PROFILE_FAILED"
        );

    if (
        !minecraftProfile?.id ||
        !minecraftProfile?.name
    ) {
        throw new Error(
            "MINECRAFT_PROFILE_MISSING"
        );
    }

    cachedMinecraftProfile = {
        id: minecraftProfile.id,
        name: minecraftProfile.name
    };

    cachedMinecraftAuthorization = {
        access_token: minecraftAccessToken,
        client_token: minecraftProfile.id,
        uuid: minecraftProfile.id,
        name: minecraftProfile.name,
        user_properties: "{}",
        meta: {
            type: "msa",
            demo: false,
            xuid: userHash,
            clientId: MICROSOFT_CLIENT_ID
        }
    };

    return cachedMinecraftAuthorization;
}

async function acquireMicrosoftSession() {
    let result = null;

    try {
        const accounts =
            await microsoftAuth
                .getTokenCache()
                .getAllAccounts();

        if (accounts.length > 0) {
            result =
                await microsoftAuth
                    .acquireTokenSilent({
                        account: accounts[0],
                        scopes: MICROSOFT_SCOPES
                    });

            if (result) {
                console.log("Session Microsoft restaurée silencieusement.");
            }
        }
    } catch (error) {
        console.log(
            "Session Microsoft silencieuse indisponible, connexion interactive nécessaire :",
            error?.errorCode || error?.message || error
        );
        result = null;
    }

    if (!result) {
        result =
            await microsoftAuth
                .acquireTokenInteractive({
                    scopes: MICROSOFT_SCOPES,

                    openBrowser:
                        async (url) => {
                            await shell.openExternal(url);
                        },

                    successTemplate:
                        "<h1>Origins Launcher</h1><p>Connexion Microsoft réussie. Tu peux fermer cette fenêtre et revenir dans Origins Launcher.</p>",

                    errorTemplate:
                        "<h1>Origins Launcher</h1><p>La connexion Microsoft a échoué. Tu peux fermer cette fenêtre et revenir dans Origins Launcher.</p>"
                });
    }

    if (!result?.idToken) {
        throw new Error("MICROSOFT_ID_TOKEN_MISSING");
    }

    if (!result?.accessToken) {
        throw new Error("MICROSOFT_ACCESS_TOKEN_MISSING");
    }

    return result;
}

async function ensureMinecraftAuthorization() {
    if (cachedMinecraftAuthorization) {
        return cachedMinecraftAuthorization;
    }

    /*
     * Minecraft authorization is required only when Tempest is launched.
     * Acquire a Microsoft session, then perform the Minecraft-specific
     * Xbox/XSTS/Minecraft Services exchange here.
     */
    const result = await acquireMicrosoftSession();

    await minecraftAuthorizationFromMicrosoftAccessToken(
        result.accessToken
    );

    if (!cachedMinecraftAuthorization) {
        throw new Error(
            "MINECRAFT_AUTH_UNAVAILABLE"
        );
    }

    return cachedMinecraftAuthorization;
}

async function originsApi(pathname, options = {}) {

    const response = await fetch(`${ORIGINS_API_BASE}${pathname}`, options);

    let data = null;

    try { data = await response.json(); } catch (_) {}

    if (!response.ok) {

        throw new Error(data?.error || `HTTP_${response.status}`);

    }

    return data;

}




ipcMain.handle("origins:clipboard-write-text", async (_event, text) => {
    const value = String(text ?? "");
    if (!value) return { ok: false };
    clipboard.writeText(value);
    return { ok: clipboard.readText() === value };
});

ipcMain.handle(
    "origins:microsoft-login",
    async () => {
        const result =
            await acquireMicrosoftSession();

        const origins =
            await originsApi(
                "/auth/microsoft",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body:
                        JSON.stringify({
                            idToken:
                                result.idToken
                        })
                }
            );

        return {
            ...origins,
            minecraft:
                cachedMinecraftProfile
        };
    }
);


ipcMain.handle("origins:profile-get", async (_event, token) => {

    return originsApi("/profile/me", {

        headers: { Authorization: `Bearer ${token}` }

    });

});



ipcMain.handle("origins:profile-create", async (_event, token, displayName) => {

    return originsApi("/profile", {

        method: "POST",

        headers: {

            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            displayName,

            avatarUrl: null

        })

    });

});



ipcMain.handle("origins:profile-update", async (_event, token, displayName) => {

    return originsApi("/profile/me", {

        method: "PATCH",

        headers: {

            Authorization: `Bearer ${token}`,

            "Content-Type": "application/json"

        },

        body: JSON.stringify({ displayName })

    });

});



ipcMain.handle("origins:avatar-pick-upload", async (_event, token) => {

    const result = await dialog.showOpenDialog(mainWindow, {

        title: "Choose an Origins avatar",

        properties: ["openFile"],

        filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp"] }]

    });

    if (result.canceled || !result.filePaths[0]) return { canceled: true };

    const filePath = result.filePaths[0];

    const ext = path.extname(filePath).toLowerCase();

    const types = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

    const mime = types[ext];

    if (!mime) throw new Error("INVALID_AVATAR_TYPE");

    const bytes = fs.readFileSync(filePath);

    const form = new FormData();

    form.append("avatar", new Blob([bytes], { type: mime }), path.basename(filePath));

    return originsApi("/profile/me/avatar", {

        method: "POST",

        headers: { Authorization: `Bearer ${token}` },

        body: form

    });

});





/* ==========================================

   TEMPEST VERSIONS

========================================== */



const MINECRAFT_VERSION =

    "1.21.11";



const FABRIC_LOADER_VERSION =

    "0.19.5";



const FABRIC_VERSION_NAME =

    `fabric-loader-${FABRIC_LOADER_VERSION}-${MINECRAFT_VERSION}`;





/* ==========================================

   PATHS

========================================== */



function getTempestPath() {



    return path.join(

        app.getPath("appData"),

        "OriginsLauncher",

        "games",

        "tempest-origins"

    );

}





function getTempestBundledModsPath() {



    return path.join(

        __dirname,

        "assets",

        "tempest",

        "mods"

    );

}



function getTempestBundledShaderpacksPath() {



    return path.join(

        __dirname,

        "assets",

        "tempest",

        "shaderpacks"

    );

}

function getFabricVersionPath() {



    return path.join(

        getTempestPath(),

        "versions",

        FABRIC_VERSION_NAME

    );

}





function getFabricVersionJsonPath() {



    return path.join(

        getFabricVersionPath(),

        `${FABRIC_VERSION_NAME}.json`

    );

}





/* ==========================================

   HTTP JSON DOWNLOAD

========================================== */



function downloadJson(url) {



    return new Promise(

        (resolve, reject) => {



            const request =

                https.get(

                    url,

                    {

                        headers: {

                            "User-Agent":

                                "OriginsLauncher/0.1.0"

                        }

                    },

                    (response) => {



                        /*

                         * Suivre une redirection HTTP

                         * si l'API en renvoie une.

                         */



                        if (

                            response.statusCode >= 300 &&

                            response.statusCode < 400 &&

                            response.headers.location

                        ) {



                            response.resume();



                            downloadJson(

                                response.headers.location

                            )

                                .then(resolve)

                                .catch(reject);



                            return;

                        }





                        if (

                            response.statusCode !== 200

                        ) {



                            response.resume();



                            reject(

                                new Error(

                                    `Erreur HTTP ${response.statusCode} pendant le téléchargement de ${url}`

                                )

                            );



                            return;

                        }





                        let data = "";





                        response.setEncoding(

                            "utf8"

                        );





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

                                            `JSON Fabric invalide : ${error.message}`

                                        )

                                    );

                                }

                            }

                        );

                    }

                );





            request.on(

                "error",

                reject

            );





            request.setTimeout(

                30000,

                () => {



                    request.destroy(

                        new Error(

                            "Le téléchargement Fabric a expiré."

                        )

                    );

                }

            );

        }

    );

}





/* ==========================================

   FABRIC INSTALLATION

========================================== */



async function ensureFabricProfile() {



    const fabricDirectory =

        getFabricVersionPath();



    const fabricJsonPath =

        getFabricVersionJsonPath();





    /*

     * S'il existe déjà, pas besoin

     * de le télécharger à nouveau.

     */



    if (

        fs.existsSync(

            fabricJsonPath

        )

    ) {



        console.log(

            `Fabric déjà installé : ${FABRIC_VERSION_NAME}`

        );



        return {

            installed: true,

            downloaded: false,

            version: FABRIC_VERSION_NAME,

            jsonPath: fabricJsonPath

        };

    }





    console.log(

        `Installation de Fabric ${FABRIC_LOADER_VERSION} pour Minecraft ${MINECRAFT_VERSION}...`

    );





    fs.mkdirSync(

        fabricDirectory,

        {

            recursive: true

        }

    );





    const profileUrl =

        `https\://meta.fabricmc.net/v2/versions/loader/${MINECRAFT_VERSION}/${FABRIC_LOADER_VERSION}/profile/json`;





    const profile =

        await downloadJson(

            profileUrl

        );





    /*

     * Fabric fournit normalement déjà

     * l'identifiant correct.

     *

     * On le force quand même pour que

     * dossier + JSON + custom correspondent.

     */



    profile.id =

        FABRIC_VERSION_NAME;





    fs.writeFileSync(

        fabricJsonPath,

        JSON.stringify(

            profile,

            null,

            4

        ),

        "utf8"

    );





    console.log(

        `Profil Fabric installé : ${fabricJsonPath}`

    );





    return {

        installed: true,

        downloaded: true,

        version: FABRIC_VERSION_NAME,

        jsonPath: fabricJsonPath

    };

}





/* ==========================================

   JAVA DETECTION

========================================== */



function detectJava() {



    return new Promise(

        (resolve) => {



            execFile(

                "java",

                ["-version"],

                {

                    windowsHide: true

                },

                (

                    error,

                    stdout,

                    stderr

                ) => {



                    if (error) {



                        resolve({

                            found: false,

                            error:

                                error.message

                        });



                        return;

                    }





                    const output =

                        stderr ||

                        stdout;





                    const versionMatch =

                        output.match(

                            /version "([^"]+)"/

                        );





                    resolve({



                        found:

                            true,



                        version:

                            versionMatch

                                ? versionMatch[1]

                                : "unknown",



                        output:

                            output.trim()

                    });

                }

            );

        }

    );

}





/* ==========================================

   JAVA IPC

========================================== */



ipcMain.handle(

    "java:detect",



    async () => {



        try {



            return await detectJava();



        } catch (error) {



            return {



                found:

                    false,



                error:

                    error.message

            };

        }

    }

);





/* ==========================================

   WINDOW / TRAY / LOCAL PRESENCE

========================================== */



function showMainWindow() {



    if (!mainWindow || mainWindow.isDestroyed()) {

        createWindow();

    }



    mainWindow.show();

    mainWindow.restore();

    mainWindow.focus();

}





function getTrayIcon() {



    const candidates = [

        path.join(__dirname, "src", "assets", "logos", "origins-logo.png"),

        path.join(__dirname, "assets", "logos", "origins-logo.png")

    ];



    for (const candidate of candidates) {



        if (fs.existsSync(candidate)) {



            const image = nativeImage.createFromPath(candidate);



            if (!image.isEmpty()) {

                return image.resize({ width: 20, height: 20 });

            }

        }

    }



    return nativeImage.createEmpty();

}





function createTray() {



    if (tray) {

        return;

    }



    tray = new Tray(getTrayIcon());



    tray.setToolTip("Origins Launcher");



    tray.setContextMenu(

        Menu.buildFromTemplate([

            {

                label: "Open Origins Launcher",

                click: showMainWindow

            },

            {

                type: "separator"

            },

            {

                label: "Quit",

                click: () => {



                    isQuitting = true;

                    app.quit();

                }

            }

        ])

    );



    tray.on(

        "double-click",

        showMainWindow

    );

}





function getLocalPresence() {



    // Le jeu a toujours priorité : même dans le tray, on reste vert.

    if (tempestRunning) {

        return {

            status: "playing",

            game: "Tempest"

        };

    }



    // Launcher caché dans le tray et aucun jeu lancé = absent.

    if (

        !mainWindow ||

        mainWindow.isDestroyed() ||

        !mainWindow.isVisible()

    ) {

        return {

            status: "away",

            game: null

        };

    }



    return {

        status: "online",

        game: null

    };

}





function sendPresence() {



    if (

        !mainWindow ||

        mainWindow.isDestroyed()

    ) {

        return;

    }



    mainWindow.webContents.send(

        "presence:changed",

        getLocalPresence()

    );

}





function setTempestRunning(running) {



    tempestRunning =

        Boolean(running);



    sendPresence();

}





function applyMinecraftLanguage(

    gamePath,

    language

) {



    const minecraftLanguage =

        language === "fr"

            ? "fr_fr"

            : "en_us";



    const optionsPath =

        path.join(

            gamePath,

            "options.txt"

        );



    let lines = [];



    if (fs.existsSync(optionsPath)) {



        lines =

            fs.readFileSync(

                optionsPath,

                "utf8"

            )

                .split(/\r?\n/)

                .filter(Boolean);

    }



    const langIndex =

        lines.findIndex(

            (line) =>

                line.startsWith("lang:")

        );



    const langLine =

        `lang:${minecraftLanguage}`;



    if (langIndex >= 0) {

        lines[langIndex] = langLine;

    } else {

        lines.push(langLine);

    }



    fs.writeFileSync(

        optionsPath,

        `${lines.join("\r\n")}\r\n`,

        "utf8"

    );



    return minecraftLanguage;

}





function createWindow() {



    mainWindow =

        new BrowserWindow({



            width:

                1500,



            height:

                900,



            minWidth:

                1100,



            minHeight:

                700,



            center:

                true,



            backgroundColor:

                "#080b09",



            autoHideMenuBar:

                true,



            /*

             * Origins custom frameless window.

             * Native Windows title bar/frame is disabled.

             */

            frame:

                false,



            webPreferences: {



                preload:

                    path.join(

                        __dirname,

                        "src",

                        "preload.js"

                    ),



                contextIsolation:

                    true,



                nodeIntegration:

                    false

            }

        });





    mainWindow.loadFile(

        path.join(

            __dirname,

            "src",

            "index.html"

        )

    );





    mainWindow.on(

        "close",

        (event) => {



            if (!isQuitting) {



                event.preventDefault();



                mainWindow.hide();

                sendPresence();

            }

        }

    );





    mainWindow.on(

        "show",

        () => {



            sendPresence();

        }

    );

}





/* ==========================================

   MINECRAFT LOGS

========================================== */



minecraftLauncher.on(

    "debug",

    (message) => {



        console.log(

            "[MCLC DEBUG]",

            message

        );

    }

);





minecraftLauncher.on(

    "data",

    (message) => {



        console.log(

            "[MINECRAFT]",

            message

        );

    }

);





minecraftLauncher.on(

    "download",

    (file) => {



        console.log(

            "[MCLC DOWNLOAD]",

            file

        );

    }

);





minecraftLauncher.on(

    "progress",

    (progress) => {



        console.log(

            "[MCLC PROGRESS]",

            progress

        );

    }

);





minecraftLauncher.on(

    "close",

    (code) => {



        console.log(

            `[MINECRAFT CLOSED] code=${code}`

        );

    }

);





/* ==========================================

   INSTALL PROGRESS

========================================== */



function sendInstallProgress(

    percent,

    stage,

    detail = ""

) {



    if (

        !mainWindow ||

        mainWindow.isDestroyed()

    ) {



        return;

    }





    mainWindow.webContents.send(

        "tempest:install-progress",

        {

            percent,

            stage,

            detail

        }

    );

}





/* ==========================================

   COPY FILE WITH REAL PROGRESS

========================================== */



function copyFileWithProgress(

    source,

    destination,

    onProgress

) {



    return new Promise(

        (

            resolve,

            reject

        ) => {



            const readStream =

                fs.createReadStream(

                    source

                );



            const writeStream =

                fs.createWriteStream(

                    destination

                );





            readStream.on(

                "data",

                (chunk) => {



                    onProgress(

                        chunk.length

                    );

                }

            );





            readStream.on(

                "error",

                reject

            );





            writeStream.on(

                "error",

                reject

            );





            writeStream.on(

                "finish",

                resolve

            );





            readStream.pipe(

                writeStream

            );

        }

    );

}





/* ==========================================

   TEMPEST — CHECK INSTALLATION

========================================== */



ipcMain.handle(

    "tempest:is-installed",



    async () => {



        try {



            const gamePath =

                getTempestPath();





            const installationFile =

                path.join(

                    gamePath,

                    "installation.json"

                );





            return {



                success:

                    true,



                installed:

                    fs.existsSync(

                        installationFile

                    ),



                path:

                    gamePath

            };





        } catch (error) {



            return {



                success:

                    false,



                installed:

                    false,



                error:

                    error.message

            };

        }

    }

);





/* ==========================================

   TEMPEST — CHECK UPDATE

========================================== */



ipcMain.handle(

    "tempest:check-update",



    async () => {



        try {



            const gamePath =

                getTempestPath();





            const result =

                await checkTempestUpdate(

                    gamePath

                );





            return {



                success:

                    true,



                needsUpdate:

                    result.needsUpdate,



                version:

                    result.version,



                totalFiles:

                    result.totalFiles,



                totalBytes:

                    result.totalBytes,



                mods: {



                    missing:

                        result.mods.missing.length,



                    outdated:

                        result.mods.outdated.length

                },



                shaderpacks: {



                    missing:

                        result.shaderpacks.missing.length,



                    outdated:

                        result.shaderpacks.outdated.length

                }

            };





        } catch (error) {



            console.error(

                "Erreur vérification mise à jour Tempest :",

                error

            );





            return {



                success:

                    false,



                needsUpdate:

                    false,



                error:

                    error.message

            };

        }

    }

);





/* ==========================================

   TEMPEST — INSTALL

========================================== */



ipcMain.handle(

    "tempest:install",



    async (

        _event,

        gameLanguage = "en"

    ) => {



        try {



            const gamePath =

                getTempestPath();





                        const modsDestination =

                path.join(

                    gamePath,

                    "mods"

                );





            const bundledModsPath =

                getTempestBundledModsPath();





            const shaderpacksDestination =

                path.join(

                    gamePath,

                    "shaderpacks"

                );





            const bundledShaderpacksPath =

                getTempestBundledShaderpacksPath();





            /* ------------------------------------------

               1. PREPARATION

            ------------------------------------------ */



            sendInstallProgress(

                2,

                "PREPARING",

                "Préparation de Tempest Origins..."

            );





            if (

                !fs.existsSync(

                    bundledModsPath

                )

            ) {



                throw new Error(

                    `Dossier des mods introuvable : ${bundledModsPath}`

                );

            }





            /* ------------------------------------------

               2. CREATE INSTANCE

            ------------------------------------------ */



            sendInstallProgress(

                5,

                "CREATING_INSTANCE",

                "Création de l'instance Tempest Origins..."

            );





                       const folders = [

                "mods",

                "shaderpacks",

                "config",

                "resourcepacks",

                "saves",

                "logs",

                "versions",

                "libraries",

                "assets"

            ];







            fs.mkdirSync(

                gamePath,

                {

                    recursive:

                        true

                }

            );





            for (

                const folder

                of folders

            ) {



                fs.mkdirSync(

                    path.join(

                        gamePath,

                        folder

                    ),

                    {

                        recursive:

                            true

                    }

                );

            }





            /* ------------------------------------------

               3. FIND MODS

            ------------------------------------------ */



            const modFiles =

                fs.readdirSync(

                    bundledModsPath

                )

                    .filter(

                        (file) =>

                            file

                                .toLowerCase()

                                .endsWith(

                                    ".jar"

                                )

                    );





            if (

                modFiles.length === 0

            ) {



                throw new Error(

                    "Aucun fichier .jar trouvé dans assets/tempest/mods."

                );

            }





            let totalBytes = 0;





            for (

                const file

                of modFiles

            ) {



                const filePath =

                    path.join(

                        bundledModsPath,

                        file

                    );





                const stats =

                    fs.statSync(

                        filePath

                    );





                totalBytes +=

                    stats.size;

            }





            let copiedBytes = 0;





            /* ------------------------------------------

               4. COPY MODS

            ------------------------------------------ */



            for (

                let index = 0;

                index < modFiles.length;

                index++

            ) {



                const file =

                    modFiles[index];





                const source =

                    path.join(

                        bundledModsPath,

                        file

                    );





                const destination =

                    path.join(

                        modsDestination,

                        file

                    );





                sendInstallProgress(



                    Math.round(

                        10 +

                        (

                            copiedBytes /

                            totalBytes

                        ) * 75

                    ),



                    "CREATING_FILES",



                    `Installation du mod ${index + 1}/${modFiles.length} : ${file}`

                );





                await copyFileWithProgress(

                    source,

                    destination,

                    (bytes) => {



                        copiedBytes +=

                            bytes;





                        const progress =

                            Math.round(

                                10 +

                                (

                                    copiedBytes /

                                    totalBytes

                                ) * 75

                            );





                                                sendInstallProgress(

                            Math.min(

                                progress,

                                85

                            ),

                            "CREATING_FILES",

                            `Installation du mod ${index + 1}/${modFiles.length} : ${file}`

                        );

                    }

                );

            }





            /* ------------------------------------------

               5. VERIFY MODS

            ------------------------------------------ */



            sendInstallProgress(

                88,

                "VERIFYING",

                "Vérification des mods..."

            );





            for (

                const file

                of modFiles

            ) {



                const source =

                    path.join(

                        bundledModsPath,

                        file

                    );





                const destination =

                    path.join(

                        modsDestination,

                        file

                    );





                if (

                    !fs.existsSync(

                        destination

                    )

                ) {



                    throw new Error(

                        `Le mod ${file} n'a pas été installé correctement.`

                    );

                }





                const sourceSize =

                    fs.statSync(

                        source

                    ).size;





                const destinationSize =

                    fs.statSync(

                        destination

                    ).size;





                if (

                    sourceSize !==

                    destinationSize

                ) {



                    throw new Error(

                        `La vérification du mod ${file} a échoué.`

                    );

                }

            }



            /* ------------------------------------------

               COPY SHADER PACKS

            ------------------------------------------ */



            let shaderpackFiles = [];





            console.log(

                "SHADERS SOURCE :",

                bundledShaderpacksPath

            );





            console.log(

                "SHADERS DESTINATION :",

                shaderpacksDestination

            );





            if (

                fs.existsSync(

                    bundledShaderpacksPath

                )

            ) {



                shaderpackFiles =

                    fs.readdirSync(

                        bundledShaderpacksPath

                    )

                        .filter(

                            (file) =>

                                file

                                    .toLowerCase()

                                    .endsWith(

                                        ".zip"

                                    )

                        );





                for (

                    const file

                    of shaderpackFiles

                ) {



                    const source =

                        path.join(

                            bundledShaderpacksPath,

                            file

                        );





                    const destination =

                        path.join(

                            shaderpacksDestination,

                            file

                        );





                    fs.copyFileSync(

                        source,

                        destination

                    );





                    console.log(

                        `Shader installé : ${file}`

                    );

                }

            }

            /* ------------------------------------------

               6. INSTALL FABRIC PROFILE

            ------------------------------------------ */



            sendInstallProgress(

                92,

                "WRITING_CONFIGURATION",

                `Installation de Fabric Loader ${FABRIC_LOADER_VERSION}...`

            );





            await ensureFabricProfile();





            /* ------------------------------------------

               7. INSTALLATION INFO

            ------------------------------------------ */



            sendInstallProgress(

                97,

                "WRITING_CONFIGURATION",

                "Finalisation de Tempest Origins..."

            );





            const installationInfo = {



                game:

                    "Tempest Origins",



                installed:

                    true,



                installedAt:

                    new Date()

                        .toISOString(),



                version:

                    "local-dev",



                minecraft:

                    MINECRAFT_VERSION,



                loader:

                    "fabric",



                fabricLoader:

                    FABRIC_LOADER_VERSION,



                fabricProfile:

                    FABRIC_VERSION_NAME,



                mods:

                    modFiles,



                shaderpacks:

                    shaderpackFiles,

            };





            fs.writeFileSync(

                path.join(

                    gamePath,

                    "installation.json"

                ),



                JSON.stringify(

                    installationInfo,

                    null,

                    4

                ),



                "utf8"

            );





            /* ------------------------------------------

               GAME LANGUAGE

            ------------------------------------------ */



            const installedLanguage =

                applyMinecraftLanguage(

                    gamePath,

                    gameLanguage

                );



            console.log(

                `Langue Minecraft appliquée après installation : ${installedLanguage}`

            );





            /* ------------------------------------------

               8. COMPLETE

            ------------------------------------------ */



            sendInstallProgress(

                100,

                "COMPLETE",

                `${modFiles.length} mods installés — Fabric ${FABRIC_LOADER_VERSION} prêt.`

            );





            return {



                success:

                    true,



                installed:

                    true,



                path:

                    gamePath,



                minecraft:

                    MINECRAFT_VERSION,



                fabric:

                    FABRIC_LOADER_VERSION,



                fabricProfile:

                    FABRIC_VERSION_NAME,



                modsInstalled:

                    modFiles.length,



                mods:

                    modFiles

            };





        } catch (error) {



            console.error(

                "Tempest installation failed:",

                error

            );





            sendInstallProgress(

                0,

                "ERROR",

                error.message

            );





            return {



                success:

                    false,



                installed:

                    false,



                error:

                    error.message

            };

        }

    }

);

/* ==========================================

   TEMPEST — UPDATE

========================================== */



ipcMain.handle(

    "tempest:update",



    async () => {



        try {



            const gamePath =

                getTempestPath();





            console.log(

                "Mise à jour de Tempest Origins..."

            );





            sendInstallProgress(

                5,

                "UPDATE",

                "Vérification des fichiers..."

            );





            const result =

                await syncTempest(

                    gamePath

                );





            sendInstallProgress(

                100,

                "COMPLETE",

                "Mise à jour terminée."

            );





            console.log(

                "Mise à jour Tempest terminée."

            );





            return {



                success:

                    true,



                path:

                    gamePath,



                version:

                    result.manifest?.version,



                mods:

                    result.mods,



                shaderpacks:

                    result.shaderpacks

            };





        } catch (error) {



            console.error(

                "Erreur mise à jour Tempest :",

                error

            );





            sendInstallProgress(

                0,

                "ERROR",

                error.message

            );





            return {



                success:

                    false,



                error:

                    error.message

            };

        }

    }

);



/* ==========================================

   TEMPEST — SET GAME LANGUAGE

========================================== */



ipcMain.handle(

    "tempest:set-language",



    async (

        _event,

        gameLanguage = "en"

    ) => {



        try {



            const gamePath =

                getTempestPath();



            fs.mkdirSync(

                gamePath,

                {

                    recursive: true

                }

            );



            const minecraftLanguage =

                applyMinecraftLanguage(

                    gamePath,

                    gameLanguage

                );



            return {

                success: true,

                language: minecraftLanguage,

                path: gamePath

            };



        } catch (error) {



            console.error(

                "Unable to apply Minecraft language:",

                error

            );



            return {

                success: false,

                error: error.message

            };

        }

    }

);





/* ==========================================

   TEMPEST — LAUNCH

========================================== */



ipcMain.handle(

    "tempest:launch",



    async (

        _event,

        gameLanguage = "en"

    ) => {



        try {



            const gamePath =

                getTempestPath();





            const installationFile =

                path.join(

                    gamePath,

                    "installation.json"

                );





            /* ------------------------------------------

               CHECK TEMPEST

            ------------------------------------------ */



            if (

                !fs.existsSync(

                    installationFile

                )

            ) {



                return {



                    success:

                        false,



                    launching:

                        false,



                    error:

                        "Tempest Origins n'est pas installé."

                };

            }





            /* ------------------------------------------

               CHECK JAVA

            ------------------------------------------ */



            const java =

                cachedJava && cachedJava.found

                    ? cachedJava

                    : await detectJava();



            if (java.found) {

                cachedJava = java;

            }





            if (

                !java.found

            ) {



                return {



                    success:

                        false,



                    launching:

                        false,



                    error:

                        "Java est introuvable."

                };

            }





            console.log(

                `Java détecté : ${java.version}`

            );





            /* ------------------------------------------

               CHECK / INSTALL FABRIC PROFILE

            ------------------------------------------ */



            console.log(

                `Vérification de Fabric ${FABRIC_LOADER_VERSION}...`

            );





            const fabric =

                cachedFabric &&

                fs.existsSync(cachedFabric.jsonPath)

                    ? cachedFabric

                    : await ensureFabricProfile();



            cachedFabric = fabric;





            if (

                !fs.existsSync(

                    fabric.jsonPath

                )

            ) {



                throw new Error(

                    "Le profil Fabric n'a pas pu être installé."

                );

            }





            console.log(

                `Fabric prêt : ${FABRIC_VERSION_NAME}`

            );





            /* ------------------------------------------

               MICROSOFT / MINECRAFT AUTH

            ------------------------------------------ */


            const authorization =
                await ensureMinecraftAuthorization();

            console.log(
                `Session Minecraft : ${authorization.name}`
            );



            /* ------------------------------------------

               UPDATE TEMPEST

            ------------------------------------------ */



            console.log(

                "Synchronisation de Tempest..."

            );



            const tempestSyncStartedAt =

                Date.now();



            await syncTempest(

                gamePath

            );





            console.log(

                `Tempest est à jour. Synchronisation terminée en ${Date.now() - tempestSyncStartedAt} ms.`

            );





            /* ------------------------------------------

               GAME LANGUAGE

            ------------------------------------------ */



            const appliedLanguage =

                applyMinecraftLanguage(

                    gamePath,

                    gameLanguage

                );



            console.log(

                `Langue Minecraft appliquée : ${appliedLanguage}`

            );





            /* ------------------------------------------

               MINECRAFT + FABRIC OPTIONS

            ------------------------------------------ */



            const launchOptions = {



                authorization,



                root:

                    gamePath,



                javaPath:

                    "C:\\\Program Files\\\Common Files\\\Oracle\\\Java\\\javapath\\\javaw.exe",



                version: {



                    number:

                        MINECRAFT_VERSION,



                    type:

                        "release",



                    custom:

                        FABRIC_VERSION_NAME

                },



                memory: {



                    max:

                        "4G",



                    min:

                        "2G"

                },



                overrides: {



                    detached:

                        true

                }

            };





            console.log(

                `Lancement de Tempest Origins — Minecraft ${MINECRAFT_VERSION} / Fabric ${FABRIC_LOADER_VERSION}...`

            );





            /*

             * On attend le démarrage du processus

             * au lieu de lancer silencieusement.

             */



            const child =

                await minecraftLauncher.launch(

                    launchOptions

                );





            console.log(

                "Processus Minecraft/Fabric créé."

            );





            setTempestRunning(true);



            if (

                mainWindow &&

                !mainWindow.isDestroyed()

            ) {

                mainWindow.hide();

            }





            if (child) {



                child.on(

                    "error",

                    (error) => {



                        console.error(

                            "[MINECRAFT PROCESS ERROR]",

                            error

                        );

                    }

                );





                child.on(

                    "exit",

                    (

                        code,

                        signal

                    ) => {



                        console.log(

                            `[MINECRAFT PROCESS EXIT] code=${code} signal=${signal}`

                        );



                        setTempestRunning(false);

                    }

                );

            }





            return {



                success:

                    true,



                launching:

                    true,



                minecraft:

                    MINECRAFT_VERSION,



                fabric:

                    FABRIC_LOADER_VERSION,



                fabricProfile:

                    FABRIC_VERSION_NAME,



                javaVersion:

                    java.version,



                path:

                    gamePath

            };





        } catch (error) {



            console.error(

                "Tempest launch failed:",

                error

            );





            return {



                success:

                    false,



                launching:

                    false,



                error:

                    error.message

            };

        }

    }

);





/* ==========================================

   WINDOW CONTROLS

========================================== */



ipcMain.on(

    "window:minimize",

    () => {



        if (mainWindow) {



            mainWindow.minimize();

        }

    }

);





ipcMain.on(

    "window:maximize",

    () => {



        if (

            !mainWindow

        ) {



            return;

        }





        if (

            mainWindow.isMaximized()

        ) {



            mainWindow.unmaximize();



        } else {



            mainWindow.maximize();

        }

    }

);





ipcMain.on(

    "window:close",

    () => {



        if (mainWindow) {



            mainWindow.hide();

            sendPresence();

        }

    }

);





/* ==========================================

   LOCAL PRESENCE / NOTIFICATIONS

========================================== */



ipcMain.handle(

    "presence:get",

    async () => {



        return getLocalPresence();

    }

);





ipcMain.handle(

    "notification:show",

    async (

        _event,

        payload = {}

    ) => {



        if (!Notification.isSupported()) {



            return {

                success: false,

                supported: false

            };

        }



        const title =

            String(

                payload.title ||

                "Origins"

            );



        const body =

            String(

                payload.body ||

                ""

            );



        const notification =

            new Notification({

                title,

                body,

                silent:

                    Boolean(payload.silent)

            });



        notification.on(

            "click",

            showMainWindow

        );



        notification.show();



        return {

            success: true,

            supported: true

        };

    }

);





/* ==========================================

   ORIGINS LAUNCHER — AUTO UPDATE

========================================== */



let launcherUpdateDownloaded = false;



function sendLauncherUpdateStatus(status, payload = {}) {



    if (

        !mainWindow ||

        mainWindow.isDestroyed()

    ) {

        return;

    }



    mainWindow.webContents.send(

        "launcher:update-status",

        {

            status,

            ...payload

        }

    );

}





function setupLauncherAutoUpdater() {



    /*

     * En développement (`npm start`), on ne cherche jamais

     * à mettre à jour l'application. Les mises à jour concernent

     * uniquement le launcher réellement installé/compilé.

     */

    if (!app.isPackaged) {



        console.log(

            "Auto-update launcher désactivé en développement."

        );



        return;

    }





    autoUpdater.autoDownload = true;

    autoUpdater.autoInstallOnAppQuit = true;





    autoUpdater.on(

        "checking-for-update",

        () => {



            console.log(

                "Vérification d'une mise à jour Origins Launcher..."

            );



            sendLauncherUpdateStatus(

                "checking"

            );

        }

    );





    autoUpdater.on(

        "update-available",

        (info) => {



            console.log(

                `Mise à jour Origins Launcher disponible : ${info.version}`

            );



            sendLauncherUpdateStatus(

                "available",

                {

                    version: info.version

                }

            );

        }

    );





    autoUpdater.on(

        "update-not-available",

        (info) => {



            console.log(

                `Origins Launcher est à jour (${info.version}).`

            );



            sendLauncherUpdateStatus(

                "not-available",

                {

                    version: info.version

                }

            );

        }

    );





    autoUpdater.on(

        "download-progress",

        (progress) => {



            const percent =

                Math.round(

                    progress.percent || 0

                );



            console.log(

                `Téléchargement mise à jour launcher : ${percent}%`

            );



            sendLauncherUpdateStatus(

                "downloading",

                {

                    percent,

                    transferred:

                        progress.transferred || 0,

                    total:

                        progress.total || 0

                }

            );

        }

    );





    autoUpdater.on(

        "update-downloaded",

        (info) => {



            launcherUpdateDownloaded = true;



            console.log(

                `Mise à jour Origins Launcher ${info.version} téléchargée.`

            );



            sendLauncherUpdateStatus(

                "downloaded",

                {

                    version: info.version

                }

            );



            if (Notification.isSupported()) {



                const notification =

                    new Notification({

                        title:

                            "Origins Launcher",

                        body:

                            `La version ${info.version} est prête. Elle sera installée à la fermeture du launcher.`

                    });



                notification.on(

                    "click",

                    showMainWindow

                );



                notification.show();

            }

        }

    );





    autoUpdater.on(

        "error",

        (error) => {



            console.error(

                "Erreur auto-update Origins Launcher :",

                error

            );



            sendLauncherUpdateStatus(

                "error",

                {

                    error:

                        error.message

                }

            );

        }

    );





    /*

     * On attend que la fenêtre soit créée avant la vérification,

     * afin que l'interface puisse recevoir les futurs événements.

     */

    setTimeout(

        () => {



            autoUpdater

                .checkForUpdates()

                .catch(

                    (error) => {



                        console.error(

                            "Impossible de vérifier la mise à jour du launcher :",

                            error

                        );

                    }

                );

        },

        1500

    );

}





ipcMain.handle(

    "launcher:update-check",

    async () => {



        if (!app.isPackaged) {



            return {

                success: true,

                development: true,

                message:

                    "Auto-update désactivé en développement."

            };

        }



        try {



            const result =

                await autoUpdater.checkForUpdates();



            return {

                success: true,

                development: false,

                updateInfo:

                    result?.updateInfo || null

            };



        } catch (error) {



            return {

                success: false,

                development: false,

                error:

                    error.message

            };

        }

    }

);





ipcMain.handle(

    "launcher:update-install",

    async () => {



        if (!app.isPackaged) {



            return {

                success: false,

                error:

                    "Installation d'une mise à jour impossible en développement."

            };

        }



        if (!launcherUpdateDownloaded) {



            return {

                success: false,

                error:

                    "Aucune mise à jour du launcher n'est prête à être installée."

            };

        }



        isQuitting = true;



        setImmediate(

            () => {



                autoUpdater.quitAndInstall(

                    false,

                    true

                );

            }

        );



        return {

            success: true

        };

    }

);





/* ==========================================

   APP

========================================== */



app.whenReady().then(

    () => {



        createTray();

        createWindow();

        setupLauncherAutoUpdater();

    }

);





app.on(

    "window-all-closed",

    () => {



        /*

         * Le launcher reste vivant dans le tray.

         * La fermeture réelle passe par "Quit".

         */

    }

);





app.on(

    "activate",

    () => {



        if (

            BrowserWindow

                .getAllWindows()

                .length === 0

        ) {



            createWindow();

        }

    }

);



app.on(

    "before-quit",

    () => {



        isQuitting = true;

    }

);