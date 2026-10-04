const { contextBridge, ipcRenderer } = require("electron");

const ORIGINS_API_BASE = "http://146.59.197.230/api";

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
    minimize: () => ipcRenderer.send("window:minimize"),
    maximize: () => ipcRenderer.send("window:maximize"),
    close: () => ipcRenderer.send("window:close"),

    clipboard: {
        writeText: (text) =>
            ipcRenderer.invoke("origins:clipboard-write-text", String(text || ""))
    },

    java: { detect: () => ipcRenderer.invoke("java:detect") },

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
        microsoftLogin: () => ipcRenderer.invoke("origins:microsoft-login"),
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
        }
    }
});