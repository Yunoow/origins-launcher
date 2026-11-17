const { contextBridge, ipcRenderer } = require("electron");

// Essais locaux : index.js passe --origins-api-dev=http://localhost:… quand ORIGINS_API_DEV est réglé.
const ORIGINS_API_DEV = (process.argv || []).find((a) => a.startsWith("--origins-api-dev="))?.split("=")[1] || null;
const ORIGINS_API_BASE = ORIGINS_API_DEV || "http://146.59.197.230/api";

async function originsApi(path, token, options = {}) {
    const response = await fetch(`${ORIGINS_API_BASE}${path}`, {
        method: options.method || "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            ...(options.body ? { "Content-Type": "application/json" } : {})
        },
        body: options.body ? JSON.stringify(options.body) : undefined
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(data.error || `HTTP_${response.status}`);
        error.code = data.error || null;
        error.status = response.status;
        throw error;
    }
    return data;
}

contextBridge.exposeInMainWorld("origins", {
    // Actus publiées à chaque push (annonces du dépôt Tempest), lecture publique.
    news: {
        list: async () => {
            const response = await fetch(`${ORIGINS_API_BASE}/news?game=tempest`);
            if (!response.ok) throw new Error(`HTTP_${response.status}`);
            return response.json();
        }
    },

    minimize: () => ipcRenderer.send("window:minimize"),
    maximize: () => ipcRenderer.send("window:maximize"),
    close: () => ipcRenderer.send("window:close"),

    clipboard: {
        writeText: (text) =>
            ipcRenderer.invoke("origins:clipboard-write-text", String(text || ""))
    },

    java: { detect: () => ipcRenderer.invoke("java:detect") },
    // Liens : "origins" (Discord du projet), "tempest" (Discord du jeu), "support" (tickets). Adresses fixées dans index.js.
    community: { openDiscord: (server = "origins") => ipcRenderer.invoke("origins:open-discord", ["origins", "tempest", "support"].includes(server) ? server : "origins") },

    launcher: {
        // Tray menu and Microsoft sign-in page follow the launcher language.
        setLanguage: (language) => ipcRenderer.send("origins:launcher-language", String(language || "en")),

        // Launcher self-update (electron-updater in index.js).
        getUpdateStatus: () => ipcRenderer.invoke("launcher:update-get-status"),
        installUpdate: () => ipcRenderer.invoke("launcher:update-install"),
        onUpdateStatus: (callback) => {
            const listener = (_event, data) => callback(data);
            ipcRenderer.on("launcher:update-status", listener);
            return () => ipcRenderer.removeListener("launcher:update-status", listener);
        }
    },

    presence: {
        get: () => ipcRenderer.invoke("presence:get"),
        onChanged: (callback) => {
            const listener = (_event, data) => callback(data);
            ipcRenderer.on("presence:changed", listener);
            return () => ipcRenderer.removeListener("presence:changed", listener);
        }
    },

    notifications: {
        show: (title, body, options = {}) => ipcRenderer.invoke("notification:show", {
            title,
            body,
            silent: Boolean(options.silent)
        })
    },

    profile: {
        microsoftLogin: (choix) => ipcRenderer.invoke("origins:microsoft-login", choix),
        microsoftAccounts: () => ipcRenderer.invoke("origins:microsoft-accounts"),
        microsoftForget: (id) => ipcRenderer.invoke("origins:microsoft-forget", id),
        microsoftSignOut: () => ipcRenderer.invoke("origins:microsoft-signout"),
        get: (token) => ipcRenderer.invoke("origins:profile-get", token),
        create: (token, displayName) => ipcRenderer.invoke("origins:profile-create", token, displayName),
        updateName: (token, displayName) => ipcRenderer.invoke("origins:profile-update", token, displayName),
        pickAndUploadAvatar: (token) => ipcRenderer.invoke("origins:avatar-pick-upload", token)
    },

    friends: {
        search: (token, originsId) => originsApi(`/friends/search/${encodeURIComponent(originsId)}`, token),
        list: (token) => originsApi("/friends", token),
        received: (token) => originsApi("/friends/requests/received", token),
        sent: (token) => originsApi("/friends/requests/sent", token),
        send: (token, originsId) => originsApi("/friends/requests", token, {
            method: "POST",
            body: { originsId }
        }),
        accept: (token, requestId) => originsApi(`/friends/requests/${encodeURIComponent(requestId)}/accept`, token, { method: "POST" }),
        refuse: (token, requestId) => originsApi(`/friends/requests/${encodeURIComponent(requestId)}`, token, { method: "DELETE" }),
        remove: (token, profileId) => originsApi(`/friends/${encodeURIComponent(profileId)}`, token, { method: "DELETE" })
    },

    // Site Origins : « Ouvrir sur le site », les demandes de connexion du site (cloche), et Discord facultatif.
    site: {
        lien: (token, suite = "/profil/") => originsApi("/site/lien", token, { method: "POST", body: { suite } }),
        demandes: (token) => originsApi("/site/demandes", token),
        accepter: (token, id) => originsApi(`/site/demandes/${encodeURIComponent(id)}/accepter`, token, { method: "POST" }),
        refuser: (token, id) => originsApi(`/site/demandes/${encodeURIComponent(id)}/refuser`, token, { method: "POST" }),
        discord: (token) => originsApi("/site/discord", token),
        ouvrir: (adresse) => ipcRenderer.invoke("origins:open-site", String(adresse || ""))
    },

    messages: {
        list: (token, profileId) =>
            originsApi(`/messages/${encodeURIComponent(profileId)}`, token),
        send: (token, profileId, content) =>
            originsApi(`/messages/${encodeURIComponent(profileId)}`, token, {
                method: "POST",
                body: { content }
            })
    },

    realtime: {
        connect: (token) => ipcRenderer.send("origins:realtime-connect", token),
        disconnect: () => ipcRenderer.send("origins:realtime-disconnect"),

        sendPresence: (status, game = null) => {
            ipcRenderer.send("origins:realtime-presence", { status, game });
        },

        onEvent: (callback) => {
            const listener = (_event, data) => callback(data);
            ipcRenderer.on("origins:realtime-event", listener);
            return () => ipcRenderer.removeListener("origins:realtime-event", listener);
        },

        onStatus: (callback) => {
            const listener = (_event, status) => callback(status);
            ipcRenderer.on("origins:realtime-status", listener);
            return () => ipcRenderer.removeListener("origins:realtime-status", listener);
        }
    },

    tempest: {
        isInstalled: () => ipcRenderer.invoke("tempest:is-installed"),
        checkUpdate: () => ipcRenderer.invoke("tempest:check-update"),
        update: () => ipcRenderer.invoke("tempest:update"),
        install: (gameLanguage = "en") => ipcRenderer.invoke("tempest:install", gameLanguage),
        setLanguage: (gameLanguage = "en") => ipcRenderer.invoke("tempest:set-language", gameLanguage),
        launch: (gameLanguage = "en", memoryGb = null) => ipcRenderer.invoke("tempest:launch", gameLanguage, memoryGb),
        systemMemory: () => ipcRenderer.invoke("tempest:system-memory"),
        onRemoteUpdate: (callback) => {
            const listener = () => callback();
            ipcRenderer.on("tempest:remote-update", listener);
            return () => ipcRenderer.removeListener("tempest:remote-update", listener);
        },
        onInstallProgress: (callback) => {
            const listener = (_event, data) => callback(data);
            ipcRenderer.on("tempest:install-progress", listener);
            return () => ipcRenderer.removeListener("tempest:install-progress", listener);
        },
        // Diagnostic de lancement : réparations et plantages au démarrage du jeu.
        repairJava: () => ipcRenderer.invoke("tempest:repair-java"),
        repairFiles: () => ipcRenderer.invoke("tempest:repair-files"),
        onLaunchProblem: (callback) => {
            const listener = (_event, data) => callback(data);
            ipcRenderer.on("tempest:launch-problem", listener);
            return () => ipcRenderer.removeListener("tempest:launch-problem", listener);
        }
    }
});