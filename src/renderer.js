// ==========================================

// ORIGINS LAUNCHER

// Renderer - Prototype 0.5

// ==========================================





/* ==========================================

   ELEMENTS — NAVIGATION

========================================== */



const homeButton =

    document.getElementById("homeButton");



const originsHomeButton =

    document.getElementById("originsHomeButton");



const tempestButton =

    document.getElementById("tempestButton");



const gamesButton =

    document.getElementById("gamesButton");



const updatesButton =

    document.getElementById("updatesButton");



const shopButton =

    document.getElementById("shopButton");



const gamesPanel =

    document.getElementById("gamesPanel");



const gamesClose =

    document.getElementById("gamesClose");



const discoverTempestButton =

    document.getElementById("discoverTempestButton");



const homePage =

    document.getElementById("homePage");



const gamesLibraryPage =

    document.getElementById("gamesLibraryPage");



const libraryTempestButton =

    document.getElementById("libraryTempestButton");



const tempestPage =

    document.getElementById("tempestPage");



const updatesPage =

    document.getElementById("updatesPage");



const shopPage =

    document.getElementById("shopPage");



const updatesHistory =

    document.getElementById("updatesHistory");



const newsGrid =

    document.getElementById("newsGrid");





/* ==========================================

   ELEMENTS — SETTINGS

========================================== */



const settingsButton =

    document.getElementById("settingsButton");



const settingsOverlay =

    document.getElementById("settingsOverlay");



const settingsClose =

    document.getElementById("settingsClose");



const launcherLanguage =

    document.getElementById("launcherLanguage");



const gameLanguage =

    document.getElementById("gameLanguage");





/* ==========================================

   ELEMENTS — ACCOUNT

========================================== */



const accountButton =

    document.getElementById("accountButton");



const accountOverlay =

    document.getElementById("accountOverlay");



const accountClose =

    document.getElementById("accountClose");



const loginButton =

    document.getElementById("loginButton");





/* ==========================================

   ELEMENTS — FRIENDS

========================================== */



const socialPanel =

    document.getElementById("socialPanel");



const socialClose =

    document.getElementById("socialClose");



const drawerBackdrop =

    document.getElementById("drawerBackdrop");



const addFriendButton =

    document.getElementById("addFriendButton");



const friendsQuickAccess =

    document.getElementById("friendsQuickAccess");



const friendsListView =

    document.getElementById("friendsListView");



const friendsConversationView =

    document.getElementById("friendsConversationView");



const originsTestFriend =

    document.getElementById("originsTestFriend");



const friendsConversationBack =

    document.getElementById("friendsConversationBack");



const friendsConversationMessages =

    document.getElementById("friendsConversationMessages");



const friendsMessageComposer =

    document.getElementById("friendsMessageComposer");



const friendsMessageInput =

    document.getElementById("friendsMessageInput");



const localProfileStatus =

    document.getElementById("localProfileStatus");



const localProfileName =

    document.getElementById("localProfileName");





/* ==========================================

   LOCAL PRESENCE

========================================== */



let tempestCurrentlyRunning = false;





function renderLocalPresence(data) {



    if (!localProfileStatus) {

        return;

    }



    const status =

        data && data.status

            ? data.status

            : "online";



    const playing =

        status === "playing";



    const away =

        status === "away";



    tempestCurrentlyRunning =

        Boolean(playing);



    updateTempestButton();



    localProfileStatus.classList.remove(

        "playing",

        "away"

    );



    if (away) {



        localProfileStatus.classList.add(

            "away"

        );



        localProfileStatus.textContent =

            t("presenceAway");



        return;

    }



    // Online et Playing restent tous les deux verts.

    localProfileStatus.textContent =

        playing

            ? t("presencePlayingTempest")

            : t("presenceOnline");

}



async function initializeLocalPresence() {



    if (

        !window.origins ||

        !window.origins.presence

    ) {

        return;

    }



    try {



        const presence =

            await window.origins.presence.get();



        renderLocalPresence(

            presence

        );



    } catch (error) {



        console.error(

            "Unable to read local presence:",

            error

        );

    }





    if (

        window.origins.presence.onChanged

    ) {



        window.origins.presence.onChanged((presence) => {
            renderLocalPresence(presence);
            sendLocalRealtimePresence(presence);
        });

    }

}





/* ==========================================
   FRIENDS — PRIVATE MESSAGES
========================================== */

let activeFriendsConversationProfile = null;
let activeFriendsConversationRequest = 0;

function normalizePrivateMessages(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.messages)) return data.messages;
    return [];
}

function privateMessageText(message) {
    return String(message?.content ?? message?.text ?? message?.message ?? "");
}

function privateMessageIsSent(message, profile) {
    if (typeof message?.sent === "boolean") return message.sent;
    if (typeof message?.isMine === "boolean") return message.isMine;

    if (message?.direction) {
        return String(message.direction).toLowerCase() === "sent";
    }

    const myProfileId = String(originsProfile?.id || "");
    const otherProfileId = String(profile?.id || "");

    const senderId = String(
        message?.sender_profile_id ??
        message?.senderProfileId ??
        message?.senderId ??
        message?.fromProfileId ??
        message?.from?.id ??
        message?.sender?.id ??
        ""
    );

    const receiverId = String(
        message?.receiver_profile_id ??
        message?.receiverProfileId ??
        message?.receiverId ??
        message?.recipientId ??
        message?.toProfileId ??
        message?.to?.id ??
        message?.recipient?.id ??
        ""
    );

    // Priorité : comparer directement avec NOTRE profil Origins.
    if (myProfileId && senderId) {
        return senderId === myProfileId;
    }

    // Secours : dans cette conversation, si le destinataire est l'ami,
    // alors le message a été envoyé par nous.
    if (otherProfileId && receiverId) {
        return receiverId === otherProfileId;
    }

    // Si l'expéditeur est l'ami, c'est un message reçu.
    if (otherProfileId && senderId) {
        return senderId !== otherProfileId;
    }

    return false;
}

function setConversationHeader(profile) {
    if (!friendsConversationView || !profile) return;
    const header = friendsConversationView.querySelector(".friends-conversation-header");
    const name = friendsConversationView.querySelector("[data-friend-name]");
    const activity = friendsConversationView.querySelector("[data-friend-activity]");
    const avatar = friendsConversationView.querySelector("[data-friend-avatar]");
    const initial = friendsConversationView.querySelector("[data-friend-initial]");

    if (name) name.textContent = profile.displayName || profile.originsId || "Origins";

    // Same avatar and presence sources as the contacts list.
    if (avatar) {
        const src = avatarSrc(profile);
        avatar.style.backgroundImage = src ? `url("${src}")` : "";
        avatar.classList.toggle("has-profile-avatar", Boolean(src));
        if (initial) initial.textContent = src ? "" : (profile.displayName || "?").slice(0, 1).toUpperCase();
    }

    const { status, label } = friendPresenceInfo(profile.id);
    if (activity) activity.textContent = label;
    if (header) header.dataset.presence = status;
}

function createPrivateMessageBubble(message, profile) {
    const text = privateMessageText(message);
    if (!text) return null;
    const bubble = document.createElement("div");
    bubble.className = `friends-message-bubble ${privateMessageIsSent(message, profile) ? "sent" : "received"}`;
    if (message?.id != null) bubble.dataset.messageId = String(message.id);
    bubble.textContent = text;
    return bubble;
}

// Appends one message (from POST response or message:new) without reloading
// the whole history. The id check prevents duplicates.
function appendPrivateMessage(message, profile) {
    if (!friendsConversationMessages || !message) return;
    if (message.id != null) {
        const existing = friendsConversationMessages.querySelector(`[data-message-id="${CSS.escape(String(message.id))}"]`);
        if (existing) return;
    }
    const bubble = createPrivateMessageBubble(message, profile);
    if (!bubble) return;
    friendsConversationMessages.querySelector(".friends-conversation-empty")?.remove();
    friendsConversationMessages.appendChild(bubble);
    friendsConversationMessages.scrollTop = friendsConversationMessages.scrollHeight;
}

function renderPrivateMessages(messages, profile) {
    if (!friendsConversationMessages) return;
    friendsConversationMessages.innerHTML = "";

    if (!messages.length) {
        const empty = document.createElement("div");
        empty.className = "friends-conversation-empty";
        empty.textContent = t("conversationStart");
        friendsConversationMessages.appendChild(empty);
        return;
    }

    messages.forEach((message) => {
        const bubble = createPrivateMessageBubble(message, profile);
        if (bubble) friendsConversationMessages.appendChild(bubble);
    });

    friendsConversationMessages.scrollTop = friendsConversationMessages.scrollHeight;
}

async function loadFriendsConversation(profile = activeFriendsConversationProfile) {
    const token = localStorage.getItem("origins-token");
    if (!token || !profile?.id || !window.origins?.messages) return;

    const requestId = ++activeFriendsConversationRequest;

    try {
        const data = await window.origins.messages.list(token, profile.id);
        if (requestId !== activeFriendsConversationRequest || activeFriendsConversationProfile?.id !== profile.id) return;
        renderPrivateMessages(normalizePrivateMessages(data), profile);
    } catch (error) {
        console.error("Unable to load private messages:", error);
        if (requestId !== activeFriendsConversationRequest || !friendsConversationMessages) return;
        friendsConversationMessages.innerHTML = "";
        const failed = document.createElement("div");
        failed.className = "friends-conversation-empty";
        failed.textContent = t("messagesLoadFailed");
        friendsConversationMessages.appendChild(failed);
    }
}

async function openFriendsConversation(eventOrProfile) {
    const profile =
        eventOrProfile?.currentTarget?.__originsProfile ||
        eventOrProfile?.__originsProfile ||
        (eventOrProfile?.id ? eventOrProfile : null);

    if (profile) activeFriendsConversationProfile = profile;
    if (!friendsConversationView || !activeFriendsConversationProfile) return;

    setConversationHeader(activeFriendsConversationProfile);
    if (typeof openFloatingWindow === "function") openFloatingWindow(friendsConversationView);
    else friendsConversationView.classList.add("open");

    await loadFriendsConversation(activeFriendsConversationProfile);
    setTimeout(() => friendsMessageInput?.focus(), 100);
}

function closeFriendsConversation() {
    activeFriendsConversationRequest += 1;
    if (!friendsConversationView) return;
    if (typeof closeFloatingWindow === "function") closeFloatingWindow(friendsConversationView);
    else friendsConversationView.classList.remove("open");
}

friendsConversationBack?.addEventListener("click", closeFriendsConversation);

friendsMessageComposer?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("origins-token");
    const profile = activeFriendsConversationProfile;
    const message = friendsMessageInput ? friendsMessageInput.value.trim() : "";

    if (!token || !profile?.id || !message || !window.origins?.messages) return;

    friendsMessageInput.disabled = true;
    try {
        const data = await window.origins.messages.send(token, profile.id, message);
        friendsMessageInput.value = "";
        // POST /messages returns the stored row: show it now, no full reload.
        if (data?.message && activeFriendsConversationProfile?.id === profile.id) {
            appendPrivateMessage(data.message, profile);
        } else {
            await loadFriendsConversation(profile);
        }
    } catch (error) {
        console.error("Unable to send private message:", error);
    } finally {
        friendsMessageInput.disabled = false;
        friendsMessageInput.focus();
    }
});


/* ==========================================

   ELEMENTS — TEMPEST

========================================== */



const playButton =

    document.getElementById("playButton");



const installProgress =

    document.getElementById("installProgress");



const installProgressBar =

    document.getElementById("installProgressBar");



const installProgressPercent =

    document.getElementById("installProgressPercent");



const installProgressStatus =

    document.getElementById("installProgressStatus");



const installProgressDetail =

    document.getElementById("installProgressDetail");





/* ==========================================

   SAVED SETTINGS

========================================== */



let currentLauncherLanguage =

    localStorage.getItem("origins-language") ||

    localStorage.getItem("origins-launcher-language") ||

    "en";



let currentGameLanguage = currentLauncherLanguage;



let currentPage = "home";



let tempestInstalled = false;



let tempestUpdateAvailable = false;



let tempestUpdateInfo = null;



/* ==========================================

   SAFETY CHECK

========================================== */



if (!isSupportedLanguage(currentLauncherLanguage)) {



    currentLauncherLanguage = "en";

}



if (!isSupportedLanguage(currentGameLanguage)) {



    currentGameLanguage = "en";

}





/* ==========================================

   NEWS

========================================== */



function renderNews(language) {



    // Actus en direct (une par push) d'abord, puis celles livrées avec le launcher.
    const items = [...liveNewsItems(language), ...(newsContent[language] || newsContent.en)].slice(0, 3);



    newsGrid.innerHTML =

        items.map((item) => `

            <article class="news-card update-preview-card" data-update-version="${item.version}">

                <span class="news-type">${item.type}</span>

                <h3>${item.title}</h3>

                <p>${item.text}</p>

                <span class="news-date">${item.date}</span>

            </article>

        `).join("");

}





function renderUpdateHistory() {



    if (!updatesHistory) {

        return;

    }




    const history = [
        ...liveNewsItems(currentLauncherLanguage),
        ...(updateHistoryI18n[currentLauncherLanguage] || updateHistoryI18n.en)
    ];



    updatesHistory.innerHTML =

        history.map((item, index) => `

            <article class="update-history-card ${index === 0 ? "latest" : ""}">

                <div class="update-history-top">

                    <div>

                        <span class="news-type">${item.type}</span>

                        <h2>${item.title}</h2>

                    </div>

                    ${item.version ? `<span class="update-version">v${item.version}</span>` : ""}

                </div>

                <p>${item.text}</p>

                <ul>${item.changes.map((change) => `<li>${change}</li>`).join("")}</ul>

                <div class="update-history-meta">

                    <span>${item.date}</span>

                    ${index === 0 ? `<strong>${t("latestUpdate")}</strong>` : ""}

                </div>

            </article>

        `).join("");

}





/* ==========================================

   TEMPEST BUTTON TEXT

========================================== */



function updateTempestButton() {



    if (!playButton) {

        return;

    }





    if (tempestCurrentlyRunning) {



        playButton.disabled = true;



        playButton.textContent =

            t("running");



        return;

    }





    playButton.disabled = false;





    if (

        tempestInstalled &&

        tempestUpdateAvailable

    ) {



        playButton.textContent =

            t("update");



        return;

    }





    if (tempestInstalled) {



        playButton.textContent =

            t("play");



        return;

    }





    playButton.textContent =

        t("install");

}





/* ==========================================

   LANGUAGE

========================================== */



function applyLanguage(language) {

    if (isSupportedLanguage(language)) {
        currentLauncherLanguage = language;
    }

    // Static texts, placeholders, tooltips and accessibility labels.
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        element.textContent = t(element.getAttribute("data-i18n"));
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
        element.placeholder = t(element.getAttribute("data-i18n-placeholder"));
    });

    document.querySelectorAll("[data-i18n-title]").forEach((element) => {
        element.title = t(element.getAttribute("data-i18n-title"));
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
        element.setAttribute("aria-label", t(element.getAttribute("data-i18n-aria")));
    });

    document.documentElement.lang = currentLauncherLanguage;

    if (launcherLanguage) launcherLanguage.value = currentLauncherLanguage;
    if (gameLanguage) gameLanguage.value = currentLauncherLanguage;

    renderNews(currentLauncherLanguage);
    renderUpdateHistory();
    renderOriginsProfile(originsProfile);
    refreshOrigins052Labels();
    updateTempestButton();
    renderFriendsList(originsFriendsCache);
    renderLauncherUpdate();
    window.originsRenderGameMemory?.();

    settingsButton.title = t("titleSettings");
    accountButton.title = t("titleAccount");
    homeButton.title = t("titleHome");
    tempestButton.title = "Tempest Origins";
    gamesButton.title = t("titleGames");

    settingsClose.setAttribute("aria-label", t("closeSettings"));
    accountClose.setAttribute("aria-label", t("closeAccount"));
    socialClose.setAttribute("aria-label", t("closeContacts"));

    // Main process texts (tray menu, Microsoft sign-in page).
    window.origins?.launcher?.setLanguage?.(currentLauncherLanguage);
}





/* ==========================================

   CLOSE SETTINGS

========================================== */



function closeSettings() {



    settingsOverlay.classList.remove(

        "open"

    );



    settingsOverlay.setAttribute(

        "aria-hidden",

        "true"

    );

}





/* ==========================================

   CLOSE ACCOUNT

========================================== */



function closeAccount() {



    accountOverlay.classList.remove(

        "open"

    );



    accountOverlay.setAttribute(

        "aria-hidden",

        "true"

    );

}





/* ==========================================

   CLOSE FRIENDS

========================================== */



function closeFriends() {



    socialPanel.classList.remove(

        "open"

    );



    drawerBackdrop.classList.remove(

        "open"

    );



    if (friendsQuickAccess) {



        friendsQuickAccess.setAttribute(

            "aria-expanded",

            "false"

        );

    }

}





/* ==========================================

   CLOSE GAMES

========================================== */



function closeGames() {



    gamesPanel.classList.remove(

        "open"

    );



    gamesButton.classList.remove(

        "active"

    );



    gamesButton.setAttribute(

        "aria-expanded",

        "false"

    );



    gamesPanel.setAttribute(

        "aria-hidden",

        "true"

    );

}





function toggleGames() {



    const willOpen =

        !gamesPanel.classList.contains(

            "open"

        );



    closeSettings();

    closeAccount();

    closeFriends();



    gamesPanel.classList.toggle(

        "open",

        willOpen

    );



    gamesButton.classList.toggle(

        "active",

        willOpen

    );



    gamesButton.setAttribute(

        "aria-expanded",

        String(willOpen)

    );



    gamesPanel.setAttribute(

        "aria-hidden",

        String(!willOpen)

    );

}





/* ==========================================

   CLOSE EVERYTHING

========================================== */



function closeAllPanels() {



    closeSettings();

    closeAccount();

    closeFriends();

    closeGames();

}





/* ==========================================

   PAGE NAVIGATION

========================================== */



function showPage(pageName) {



    currentPage = pageName;



    document.body.classList.toggle("on-home", pageName === "home");

    if (gamesLibraryPage) gamesLibraryPage.classList.toggle("active", pageName === "games");

    if (gamesButton) gamesButton.classList.toggle("active", pageName === "games" || pageName === "tempest");



    const pages = {

        home: homePage,

        games: gamesLibraryPage,

        tempest: tempestPage,

        updates: updatesPage,

        shop: shopPage

    };



    Object.entries(pages).forEach(([name, page]) => {

        if (page) {

            page.classList.toggle("active", name === pageName);

        }

    });



    homeButton.classList.toggle("active", pageName === "home");

    updatesButton.classList.toggle("active", pageName === "updates");

    shopButton.classList.toggle("active", pageName === "shop");

    tempestButton.classList.toggle("selected", pageName === "tempest");



}





/* ==========================================

   OPEN SETTINGS

========================================== */



function openSettings() {



    settingsOverlay.classList.add(

        "open"

    );



    settingsOverlay.setAttribute(

        "aria-hidden",

        "false"

    );

}





/* ==========================================

   OPEN ACCOUNT

========================================== */



function openAccount() {



    accountOverlay.classList.add(

        "open"

    );



    accountOverlay.setAttribute(

        "aria-hidden",

        "false"

    );

}





/* ==========================================

   OPEN FRIENDS

========================================== */



function openFriends() {



    socialPanel.classList.add(

        "open"

    );



    drawerBackdrop.classList.add(

        "open"

    );



    if (friendsQuickAccess) {



        friendsQuickAccess.setAttribute(

            "aria-expanded",

            "true"

        );

    }

}





renderUpdateHistory();



newsGrid.addEventListener(

    "click",

    (event) => {

        const card = event.target.closest(".update-preview-card");

        if (card) {

            showPage("updates");

        }

    }

);





/* ==========================================

   NAVIGATION EVENTS

   ========================================== */



homeButton.addEventListener(

    "click",

    () => {



        showPage("home");

    }

);





updatesButton.addEventListener(

    "click",

    () => {

        showPage("updates");

    }

);



shopButton.addEventListener(

    "click",

    () => {

        showPage("shop");

    }

);



originsHomeButton.addEventListener(

    "click",

    () => {



        showPage("home");

    }

);



gamesButton.addEventListener(

    "click",

    () => {

        showPage("games");

    }

);



gamesClose.addEventListener(

    "click",

    () => {



        closeGames();

    }

);



tempestButton.addEventListener(

    "click",

    () => {



        showPage("tempest");

    }

);



if (libraryTempestButton) {

    libraryTempestButton.addEventListener("click", () => showPage("tempest"));

}



discoverTempestButton.addEventListener(

    "click",

    () => {



        showPage("tempest");

    }

);





/* ==========================================

   SETTINGS EVENTS

========================================== */



settingsButton.addEventListener(

    "click",

    () => {



        openSettings();

    }

);



settingsClose.addEventListener(

    "click",

    () => {



        closeSettings();

    }

);







/* ==========================================

   ACCOUNT EVENTS

========================================== */



accountButton.addEventListener(

    "click",

    () => {



        openAccount();

    }

);



accountClose.addEventListener(

    "click",

    () => {



        closeAccount();

    }

);







/* ==========================================

   FRIENDS EVENTS

========================================== */



if (friendsQuickAccess) {



    friendsQuickAccess.addEventListener(

        "click",

        () => {



            openFriends();

        }

    );

}





socialClose.addEventListener(

    "click",

    () => {



        closeFriends();

    }

);











/* ==========================================

   LAUNCHER LANGUAGE

========================================== */



// Language options come from ORIGINS_LANGUAGES (i18n.js).
[launcherLanguage, gameLanguage].forEach((select) => {
    if (!select) return;
    select.innerHTML = "";
    ORIGINS_LANGUAGES.forEach(({ code, name }) => select.add(new Option(name, code)));
    select.value = currentLauncherLanguage;
});

launcherLanguage.addEventListener(

    "change",

    (event) => {



        currentLauncherLanguage =

            event.target.value;



        currentGameLanguage = currentLauncherLanguage;



        localStorage.setItem(

            "origins-language",

            currentLauncherLanguage

        );



        applyLanguage(

            currentLauncherLanguage

        );



        if (gameLanguage) {

            gameLanguage.value =

                currentGameLanguage;

        }



        if (

            window.origins &&

            window.origins.tempest &&

            window.origins.tempest.setLanguage

        ) {

            window.origins.tempest

                .setLanguage(

                    currentGameLanguage

                )

                .then((result) => {

                    if (

                        result &&

                        !result.success

                    ) {

                        console.warn(

                            "Unable to apply Minecraft language:",

                            result.error

                        );

                    }

                })

                .catch((error) => {

                    console.warn(

                        "Unable to apply Minecraft language:",

                        error

                    );

                });

        }



        if (

            window.origins &&

            window.origins.presence

        ) {



            window.origins.presence

                .get()

                .then(renderLocalPresence)

                .catch(() => {});

        }



    }

);





/* ==========================================

   GAME LANGUAGE

========================================== */



if (gameLanguage) {

    gameLanguage.addEventListener("change", () => {});

}





/* ==========================================

   LOGIN / FIRST RUN ONBOARDING

========================================== */



const originsOnboarding = document.getElementById("originsOnboarding");
const originsMicrosoftStep = document.getElementById("originsMicrosoftStep");
const originsProfileStep = document.getElementById("originsProfileStep");
const originsMicrosoftButton = document.getElementById("originsMicrosoftButton");
const originsFirstProfileName = document.getElementById("originsFirstProfileName");
const originsCreateProfileButton = document.getElementById("originsCreateProfileButton");
const originsOnboardingStatus = document.getElementById("originsOnboardingStatus");



function setOnboardingStatus(message = "", isError = false) {

    if (!originsOnboardingStatus) return;

    originsOnboardingStatus.textContent = message;
    originsOnboardingStatus.classList.toggle("is-error", Boolean(isError));

}



/* ---------- Step 1: language (first launch) ---------- */

const originsLanguageStep = document.getElementById("originsLanguageStep");
const originsLanguageGrid = document.getElementById("originsLanguageGrid");
const originsLanguageContinue = document.getElementById("originsLanguageContinue");
const originsChangeLanguage = document.getElementById("originsChangeLanguage");

// The language step is shown until a language has been saved once.
function hasChosenLanguage() {
    return Boolean(localStorage.getItem("origins-language"));
}

// Same path as the Settings selector: saves, applies and syncs Minecraft.
function chooseLauncherLanguage(code) {
    if (!isSupportedLanguage(code) || !launcherLanguage) return;
    launcherLanguage.value = code;
    launcherLanguage.dispatchEvent(new Event("change"));
}

function renderOnboardingLanguages() {
    if (!originsLanguageGrid) return;
    originsLanguageGrid.innerHTML = "";

    ORIGINS_LANGUAGES.forEach(({ code, name }) => {
        const selected = code === currentLauncherLanguage;
        const option = document.createElement("button");
        option.type = "button";
        option.className = "origins-language-option";
        option.classList.toggle("selected", selected);
        option.setAttribute("role", "radio");
        option.setAttribute("aria-checked", String(selected));

        const label = document.createElement("strong");
        label.textContent = name;
        const tag = document.createElement("small");
        tag.textContent = code.toUpperCase();
        option.append(label, tag);

        // Preview instantly; saved when the player continues.
        option.addEventListener("click", () => {
            applyLanguage(code);
            renderOnboardingLanguages();
        });
        originsLanguageGrid.appendChild(option);
    });
}

function showLanguageOnboarding() {
    if (!originsOnboarding) return;

    originsOnboarding.classList.add("is-visible");
    if (originsLanguageStep) originsLanguageStep.hidden = false;
    originsMicrosoftStep.hidden = true;
    originsProfileStep.hidden = true;
    setOnboardingStatus("");
    renderOnboardingLanguages();
}

originsLanguageContinue?.addEventListener("click", () => {
    chooseLauncherLanguage(currentLauncherLanguage);
    showMicrosoftOnboarding();
});

originsChangeLanguage?.addEventListener("click", showLanguageOnboarding);


/* ---------- Step 2: Microsoft ---------- */

function showMicrosoftOnboarding() {

    if (!originsOnboarding) return;

    // New player: pick the language before anything else,
    // pre-selected from the Windows language.
    if (!hasChosenLanguage()) {
        applyLanguage(detectSystemLanguage());
        showLanguageOnboarding();
        return;
    }

    originsOnboarding.classList.add("is-visible");
    if (originsLanguageStep) originsLanguageStep.hidden = true;
    originsMicrosoftStep.hidden = false;
    originsProfileStep.hidden = true;
    setOnboardingStatus("");

}


/* ---------- Step 3: profile ---------- */

function showProfileOnboarding() {

    if (!originsOnboarding) return;

    originsOnboarding.classList.add("is-visible");
    if (originsLanguageStep) originsLanguageStep.hidden = true;
    originsMicrosoftStep.hidden = true;
    originsProfileStep.hidden = false;
    setOnboardingStatus("");

    window.setTimeout(() => originsFirstProfileName?.focus(), 50);

}



function hideOriginsOnboarding() {

    originsOnboarding?.classList.remove("is-visible");
    setOnboardingStatus("");

    // Every successful sign-in path ends here: first time -> guided tour,
    // after an update -> "What's new".
    maybeStartTutorial();
    maybeShowWhatsNew();

}



async function signInWithMicrosoft() {

    if (!window.origins?.profile?.microsoftLogin) {

        setOnboardingStatus(t("onbMicrosoftUnavailable"), true);
        return;

    }

    originsMicrosoftButton.disabled = true;
    setOnboardingStatus(t("onbWaitingMicrosoft"));

    try {

        const auth = await window.origins.profile.microsoftLogin();

        if (!auth?.token) {

            throw new Error("ORIGINS_TOKEN_MISSING");

        }

        localStorage.setItem("origins-token", auth.token);

        const data = await window.origins.profile.get(auth.token);

        if (data?.profile) {

            renderOriginsProfile(data.profile);
            hideOriginsOnboarding();

        } else {

            renderOriginsProfile(null);
            showProfileOnboarding();

        }

    } catch (error) {

        localStorage.removeItem("origins-token");
        renderOriginsProfile(null);
        showMicrosoftOnboarding();
        setOnboardingStatus(t("onbMicrosoftFailed"), true);
        console.error("Origins Microsoft login failed:", error);

    } finally {

        originsMicrosoftButton.disabled = false;

    }

}



async function createFirstOriginsProfile() {

    const token = localStorage.getItem("origins-token");
    const displayName = originsFirstProfileName?.value.trim() || "";

    if (!token) {

        showMicrosoftOnboarding();
        return;

    }

    if (displayName.length < 3 || displayName.length > 32) {

        setOnboardingStatus(t("onbNameLength"), true);
        originsFirstProfileName?.focus();
        return;

    }

    originsCreateProfileButton.disabled = true;
    setOnboardingStatus(t("onbCreatingProfile"));

    try {

        const data = await window.origins.profile.create(token, displayName);

        if (!data?.profile) {

            throw new Error("PROFILE_CREATION_FAILED");

        }

        renderOriginsProfile(data.profile);
        hideOriginsOnboarding();

    } catch (error) {

        setOnboardingStatus(
            error?.message === "PROFILE_ALREADY_EXISTS"
                ? t("onbProfileExists")
                : t("onbProfileFailed"),
            true
        );

        console.error("Origins profile creation failed:", error);

    } finally {

        originsCreateProfileButton.disabled = false;

    }

}



originsMicrosoftButton?.addEventListener("click", signInWithMicrosoft);

originsCreateProfileButton?.addEventListener("click", createFirstOriginsProfile);

originsFirstProfileName?.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        createFirstOriginsProfile();

    }

});



loginButton.addEventListener("click", async () => {

    const existing = localStorage.getItem("origins-token");

    if (existing) {

        localStorage.removeItem("origins-token");
        renderOriginsProfile(null);
        closeAccount();
        showMicrosoftOnboarding();
        return;

    }

    await signInWithMicrosoft();

});



const ORIGINS_PUBLIC_BASE = "http://146.59.197.230";

let originsProfile = null;

/*
 * Origins ID copy action.
 * Delegated from document so the action remains active even if the Account
 * panel is refreshed/re-rendered later.
 */
document.addEventListener("click", async (event) => {
    const button = event.target?.closest?.("#copyOriginsIdButton");
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();

    const value =
        String(
            originsProfile?.originsId ||
            document.getElementById("accountOriginsId")?.textContent ||
            ""
        ).trim();

    if (!value || value === "----") return;

    try {
        if (!window.origins?.clipboard?.writeText) {
            throw new Error("ORIGINS_CLIPBOARD_UNAVAILABLE");
        }

        const copyResult = await window.origins.clipboard.writeText(value);
        if (copyResult?.ok === false) {
            throw new Error("ORIGINS_CLIPBOARD_WRITE_FAILED");
        }

        const label = document.getElementById("originsIdCopyLabel");
        if (label) {
            label.textContent =
                t("copied");

            window.setTimeout(() => {
                label.textContent =
                    t("copy");
            }, 1200);
        }
    } catch (error) {
        console.error("Unable to copy Origins ID:", error);
    }
});




function avatarSrc(profile) {

    return profile?.avatarUrl ? `${ORIGINS_PUBLIC_BASE}${profile.avatarUrl}` : "";

}



function renderOriginsProfile(profile) {

    originsProfile = profile || null;

    const name = profile?.displayName || (t("notSignedIn"));

    document.querySelectorAll("#localProfileName, #accountProfileName").forEach(el => el.textContent = name);

    document.querySelectorAll(".account-icon, .account-avatar-large, .avatar").forEach(el => {

        const src = avatarSrc(profile);

        el.style.backgroundImage = src ? `url("${src}")` : "";

        el.classList.toggle("has-profile-avatar", Boolean(src));

        if (src) el.textContent = "";

    });

    if (profileNameInput) profileNameInput.value = profile?.displayName || "";

    if (accountButton) {

        accountButton.title = profile ? name : t("originsProfileTitle");

        accountButton.setAttribute("aria-label", profile ? name : t("originsProfileTitle"));

    }

    if (profile) {

        loginButton.textContent = (translations[currentLauncherLanguage] || translations.en).signOut;

    } else {

        loginButton.textContent = (translations[currentLauncherLanguage] || translations.en).signIn;

    }

    renderAccountOriginsId(profile);

    if (profile) {

        refreshFriendsSocial();
        connectOriginsRealtime();

    } else {
        disconnectOriginsRealtime();
    }

}



async function loadOriginsProfile() {

    const token = localStorage.getItem("origins-token");

    if (!token || !window.origins?.profile) {

        renderOriginsProfile(null);
        showMicrosoftOnboarding();
        return null;

    }

    try {

        const data = await window.origins.profile.get(token);

        if (data?.profile) {

            renderOriginsProfile(data.profile);
            hideOriginsOnboarding();
            return data.profile;

        }

        renderOriginsProfile(null);
        showProfileOnboarding();
        return null;

    } catch (_) {

        localStorage.removeItem("origins-token");
        renderOriginsProfile(null);
        showMicrosoftOnboarding();
        return null;

    }

}



const profileNameInput = document.getElementById("profileNameInput");

const saveProfileButton = document.getElementById("saveProfileButton");

const changeAvatarButton = document.getElementById("changeAvatarButton");



if (saveProfileButton) saveProfileButton.addEventListener("click", async () => {

    const token = localStorage.getItem("origins-token");

    if (!token) return;

    const data = await window.origins.profile.updateName(token, profileNameInput.value);

    renderOriginsProfile(data.profile);

});



if (changeAvatarButton) changeAvatarButton.addEventListener("click", async () => {

    const token = localStorage.getItem("origins-token");

    if (!token) return;

    const data = await window.origins.profile.pickAndUploadAvatar(token);

    if (!data?.canceled) renderOriginsProfile(data.profile);

});







/* ==========================================

   INSTALL PROGRESS

========================================== */



function getInstallStageText(stage) {
    const keys = {
        PREPARING: "stagePreparing",
        CREATING_INSTANCE: "stageCreatingInstance",
        CREATING_FILES: "stageCreatingFiles",
        WRITING_CONFIGURATION: "stageConfiguring",
        VERIFYING: "stageVerifying",
        UPDATE: "stageUpdate",
        COMPLETE: "stageComplete",
        ERROR: "stageError"
    };
    return keys[stage] ? t(keys[stage]) : stage;
}





function updateInstallProgress(data) {



    if (

        !data ||

        !installProgress

    ) {



        return;

    }



    const percent =

        Math.max(

            0,

            Math.min(

                100,

                Number(data.percent) || 0

            )

        );



    installProgress.classList.add(

        "visible"

    );



    installProgress.setAttribute(

        "aria-hidden",

        "false"

    );



    installProgress.classList.toggle(

        "complete",

        data.stage === "COMPLETE"

    );



    installProgress.classList.toggle(

        "error",

        data.stage === "ERROR"

    );



    installProgressBar.style.width =

        `${percent}%`;



    installProgressPercent.textContent =

        `${percent}%`;



    installProgressStatus.textContent =

        getInstallStageText(

            data.stage

        );



    // index.js sends detailKey/detailParams so the detail follows the launcher language.
    installProgressDetail.textContent =

        data.detailKey ? t(data.detailKey, data.detailParams) : (data.detail || "");

}





if (

    window.origins &&

    window.origins.tempest &&

    window.origins.tempest.onInstallProgress

) {



    window.origins.tempest.onInstallProgress(

        updateInstallProgress

    );

}





/* ==========================================

   TEMPEST INSTALL / UPDATE / LAUNCH

========================================== */



playButton.addEventListener(

    "click",

    async () => {



        /* ==================================

           UPDATE

        ================================== */



        if (

            tempestInstalled &&

            tempestUpdateAvailable

        ) {



            try {



                playButton.disabled = true;



                playButton.textContent =

                    t("updating");



                updateInstallProgress({

                    percent: 10,

                    stage: "UPDATE",

                    detail:

                        t("detailDownloadingUpdate")

                });



                if (

                    !window.origins ||

                    !window.origins.tempest ||

                    !window.origins.tempest.update

                ) {



                    throw new Error(

                        "Origins update API is unavailable."

                    );

                }



                const result =

                    await window.origins.tempest.update();



                if (

                    !result ||

                    !result.success

                ) {



                    throw new Error(

                        result?.error ||

                        "Tempest update failed."

                    );

                }



                tempestUpdateAvailable = false;

                tempestUpdateInfo = null;



                updateInstallProgress({

                    percent: 100,

                    stage: "COMPLETE",

                    detail:

                        t("detailUpdateComplete")

                });



                updateTempestButton();



                setTimeout(

                    () => {



                        if (installProgress) {



                            installProgress.classList.remove(

                                "visible"

                            );



                            installProgress.setAttribute(

                                "aria-hidden",

                                "true"

                            );

                        }



                    },

                    1800

                );



            } catch (error) {



                console.error(

                    "Tempest update error:",

                    error

                );



                updateInstallProgress({

                    percent: 0,

                    stage: "ERROR",

                    detail: error.message

                });



                playButton.textContent =

                    t("retry");



            } finally {



                playButton.disabled = false;

            }



            return;

        }





        /* ==================================

           LAUNCH

        ================================== */



        if (tempestInstalled) {



            if (tempestCurrentlyRunning) {



                updateTempestButton();



                return;

            }



            try {



                playButton.disabled = true;



                playButton.textContent =

                    t("launching");



                if (

                    !window.origins ||

                    !window.origins.tempest ||

                    !window.origins.tempest.launch

                ) {



                    throw new Error(

                        "Origins launch API is unavailable."

                    );

                }



                const result =

                    await window.origins.tempest.launch(currentLauncherLanguage, savedGameMemory());



                if (

                    !result ||

                    !result.success

                ) {



                    throw new Error(

                        result?.error ||

                        "Minecraft launch failed."

                    );

                }



                console.log(

                    "Tempest Origins launch requested:",

                    result.path

                );



            } catch (error) {



                console.error(

                    "Tempest launch error:",

                    error

                );



                playButton.textContent =

                    t("retry");



                return;



            } finally {



                /*

                 * updateTempestButton() decides whether the button

                 * must stay disabled while Tempest is running.

                 */

            }



            updateTempestButton();



            return;

        }





        /* ==================================

           FIRST INSTALL

        ================================== */



        try {



            playButton.disabled = true;



            playButton.classList.add(

                "installing"

            );



            if (installProgress) {



                installProgress.classList.remove(

                    "complete",

                    "error"

                );



                installProgress.classList.add(

                    "visible"

                );



                installProgress.setAttribute(

                    "aria-hidden",

                    "false"

                );

            }



            if (installProgressBar) {



                installProgressBar.style.width =

                    "0%";

            }



            if (installProgressPercent) {



                installProgressPercent.textContent =

                    "0%";

            }



            if (installProgressStatus) {



                installProgressStatus.textContent =

                    t("preparingTempest");

            }



            if (installProgressDetail) {



                installProgressDetail.textContent =

                    t("detailInitializing");

            }



            playButton.textContent =

                t("installing");



            if (

                !window.origins ||

                !window.origins.tempest ||

                !window.origins.tempest.install

            ) {



                throw new Error(

                    "Origins installation API is unavailable."

                );

            }



            const result =

                await window.origins.tempest.install(currentGameLanguage);



            if (

                !result ||

                !result.success

            ) {



                throw new Error(

                    result?.error ||

                    "Installation failed."

                );

            }



            tempestInstalled = true;



            console.log(

                "Tempest Origins installed:",

                result.path

            );



            updateInstallProgress({

                percent: 100,

                stage: "COMPLETE",

                detail:

                    t("detailTempestReady")

            });



            await new Promise(

                (resolve) => {



                    setTimeout(

                        resolve,

                        650

                    );

                }

            );



            updateTempestButton();



            setTimeout(

                () => {



                    if (

                        tempestInstalled &&

                        installProgress

                    ) {



                        installProgress.classList.remove(

                            "visible"

                        );



                        installProgress.setAttribute(

                            "aria-hidden",

                            "true"

                        );

                    }



                },

                1800

            );



        } catch (error) {



            console.error(

                "Tempest installation error:",

                error

            );



            updateInstallProgress({

                percent: 0,

                stage: "ERROR",

                detail: error.message

            });



            playButton.textContent =

                t("retry");



        } finally {



            playButton.disabled = false;



            playButton.classList.remove(

                "installing"

            );

        }



    }

);





/* ==========================================

   ADD FRIEND

========================================== */



addFriendButton.addEventListener(

    "click",

    () => {

        openFloatingWindow(addContactPanel);

        addContactId?.focus();

    }

);





/* ==========================================

   ORIGINS FLOATING WINDOWS — SOCIAL V1 UI

   Windows close only from their × button.

========================================== */



const notificationsQuickAccess = document.getElementById("notificationsQuickAccess");

const notificationsPanel = document.getElementById("notificationsPanel");

const notificationsClose = document.getElementById("notificationsClose");

const notificationsBadge = document.getElementById("notificationsBadge");

const addContactPanel = document.getElementById("addContactPanel");

const addContactClose = document.getElementById("addContactClose");

const addContactId = document.getElementById("addContactId");

const addContactSearch = document.getElementById("addContactSearch");


/* =========================================================
   ORIGINS ID + FRIENDS BACKEND
   Keep the existing UI/DA; this only wires data/actions.
========================================================= */

const originsIdCard = document.getElementById("originsIdCard");
const accountOriginsId = document.getElementById("accountOriginsId");
const copyOriginsIdButton = document.getElementById("copyOriginsIdButton");
const originsIdCopyLabel = document.getElementById("originsIdCopyLabel");
const notificationsContent = document.getElementById("notificationsContent");

// Realtime social state. The existing UI remains unchanged; these values only
// keep contacts, presence and private messages synchronized.
let originsFriendsCache = [];
const originsFriendPresence = new Map();
let originsRealtimeToken = null;
let originsRealtimeUnsubscribeEvent = null;
let originsRealtimeUnsubscribeStatus = null;

function renderAccountOriginsId(profile) {
    const originsId = profile?.originsId || "";
    if (originsIdCard) originsIdCard.hidden = !originsId;
    if (accountOriginsId) accountOriginsId.textContent = originsId || "----";
}

function friendAvatar(profile) {
    const avatar = document.createElement("span");
    avatar.className = "friends-contact-avatar";
    const src = avatarSrc(profile);
    if (src) {
        avatar.style.backgroundImage = `url("${src}")`;
        avatar.classList.add("has-profile-avatar");
    } else {
        avatar.textContent = (profile?.displayName || "?").slice(0, 1).toUpperCase();
    }
    return avatar;
}

function socialActionButton(label, onClick, secondary = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = secondary ? "add-contact-search secondary" : "add-contact-search";
    button.textContent = label;
    button.addEventListener("click", onClick);
    return button;
}

function ensureAddContactResult() {
    let result = document.getElementById("addContactResult");
    if (!result && addContactPanel) {
        result = document.createElement("div");
        result.id = "addContactResult";
        result.className = "add-contact-result";
        addContactPanel.querySelector(".add-contact-content")?.appendChild(result);
    }
    return result;
}

async function refreshFriendsSocial() {
    const token = localStorage.getItem("origins-token");
    if (!token || !window.origins?.friends) return;
    try {
        const [friendsData, receivedData] = await Promise.all([
            window.origins.friends.list(token),
            window.origins.friends.received(token)
        ]);
        originsFriendsCache = friendsData?.friends || [];
        renderFriendsList(originsFriendsCache);
        renderFriendRequests(receivedData?.requests || []);
        return receivedData?.requests || [];
    } catch (error) {
        console.error("Unable to refresh friends:", error);
        return [];
    }
}

// Windows notification (toast) through the main process.
function showSocialNotification(title, body) {
    if (!window.origins?.notifications?.show) return;
    window.origins.notifications.show(title, body).catch?.(() => {});
}

// Requests accepted from this launcher: no "accepted" toast for our own click.
const locallyAcceptedRequestIds = new Set();

function renderFriendsList(friends) {
    if (!friendsListView) return;
    const heading = friendsListView.querySelector(".friends-list-heading");
    const count = heading?.querySelector(".friends-list-count");
    if (count) count.textContent = String(friends.length);

    friendsListView.querySelectorAll(".friends-contact-row").forEach(node => node.remove());

    if (!friends.length) {
        let empty = friendsListView.querySelector(".friends-empty-state");
        if (!empty) {
            empty = document.createElement("div");
            empty.className = "social-empty-state friends-empty-state";
            friendsListView.appendChild(empty);
        }
        empty.innerHTML = `<strong>${t("noContacts")}</strong><span>${t("noContactsText")}</span>`;
        updateFriendsOnlineBadge();
        return;
    }

    friendsListView.querySelector(".friends-empty-state")?.remove();
    friends.forEach(profile => {
        const row = document.createElement("button");
        row.type = "button";
        row.className = "friends-contact-row";
        row.dataset.profileId = profile.id;
        row.appendChild(friendAvatar(profile));

        const info = document.createElement("span");
        info.className = "friends-contact-info";
        const name = document.createElement("strong");
        name.textContent = profile.displayName;
        const id = document.createElement("small");
        const { status, label } = friendPresenceInfo(profile.id);
        id.textContent = label;

        row.dataset.presence = status;
        row.classList.toggle("is-online", status !== "offline");
        row.classList.toggle("is-playing", status === "playing");
        info.append(name, id);
        row.appendChild(info);

        const arrow = document.createElement("span");
        arrow.className = "friends-contact-arrow";
        arrow.textContent = "›";
        row.appendChild(arrow);
        row.__originsProfile = profile;
        row.addEventListener("click", openFriendsConversation);
        row.addEventListener("contextmenu", (event) => openFriendContextMenu(event, profile));
        friendsListView.appendChild(row);
    });

    updateFriendsOnlineBadge();

    // Keep the open conversation header in sync with the contact row.
    if (activeFriendsConversationProfile) {
        const fresh = friends.find(p => String(p.id) === String(activeFriendsConversationProfile.id));
        if (fresh) activeFriendsConversationProfile = fresh;
        setConversationHeader(activeFriendsConversationProfile);
    }
}

/* ---------- Contact context menu (right click) ---------- */

let friendContextMenu = null;

function closeFriendContextMenu() {
    friendContextMenu?.remove();
    friendContextMenu = null;
}

function positionFriendContextMenu(menu, x, y) {
    const margin = 8;
    const rect = menu.getBoundingClientRect();
    const left = Math.min(x, window.innerWidth - rect.width - margin);
    const top = Math.min(y, window.innerHeight - rect.height - margin);
    menu.style.left = `${Math.max(margin, left)}px`;
    menu.style.top = `${Math.max(margin, top)}px`;
}

function friendMenuItem(label, onClick, danger = false) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = danger ? "friend-context-item danger" : "friend-context-item";
    item.textContent = label;
    item.addEventListener("click", onClick);
    return item;
}

function openFriendContextMenu(event, profile) {
    event.preventDefault();
    event.stopPropagation();
    closeFriendContextMenu();

    const x = event.clientX;
    const y = event.clientY;
    const menu = document.createElement("div");
    menu.className = "friend-context-menu";
    menu.setAttribute("role", "menu");
    menu.addEventListener("click", (e) => e.stopPropagation());
    menu.addEventListener("contextmenu", (e) => e.preventDefault());

    const renderActions = () => {
        menu.innerHTML = "";
        const title = document.createElement("div");
        title.className = "friend-context-title";
        title.textContent = profile.displayName || profile.originsId || "Origins";

        const separator = document.createElement("div");
        separator.className = "friend-context-separator";

        menu.append(
            title,
            friendMenuItem(t("menuSendMessage"), () => {
                closeFriendContextMenu();
                openFriendsConversation(profile);
            }),
            friendMenuItem(t("copyOriginsId"), () => {
                window.origins?.clipboard?.writeText(profile.originsId || "");
                closeFriendContextMenu();
            }),
            separator,
            friendMenuItem(t("menuRemoveFriend"), renderConfirm, true)
        );
    };

    const renderConfirm = () => {
        menu.innerHTML = "";
        menu.classList.add("confirming");

        const text = document.createElement("p");
        text.className = "friend-context-confirm";
        const name = document.createElement("strong");
        name.textContent = profile.displayName || "Origins";
        // "{name}" in the sentence is replaced by the bold name element.
        const [before, after = ""] = t("removeConfirm").split("{name}");
        text.append(before, name, after);

        const error = document.createElement("small");
        error.className = "friend-context-error";

        const actions = document.createElement("div");
        actions.className = "friend-context-actions";
        const cancel = friendMenuItem(t("cancel"), closeFriendContextMenu);
        const confirm = friendMenuItem(t("remove"), async () => {
            const token = localStorage.getItem("origins-token");
            if (!token || !window.origins?.friends?.remove) return;
            confirm.disabled = true;
            cancel.disabled = true;
            try {
                await window.origins.friends.remove(token, profile.id);
                if (String(activeFriendsConversationProfile?.id) === String(profile.id)) {
                    closeFriendsConversation();
                    activeFriendsConversationProfile = null;
                }
                originsFriendPresence.delete(String(profile.id));
                closeFriendContextMenu();
                await refreshFriendsSocial();
            } catch (err) {
                console.error("Unable to remove friend:", err);
                error.textContent = t("removeFailed");
                confirm.disabled = false;
                cancel.disabled = false;
            }
        }, true);
        actions.append(cancel, confirm);

        menu.append(text, error, actions);
        positionFriendContextMenu(menu, x, y);
        cancel.focus();
    };

    renderActions();
    document.body.appendChild(menu);
    friendContextMenu = menu;
    positionFriendContextMenu(menu, x, y);
}

document.addEventListener("click", closeFriendContextMenu);
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeFriendContextMenu();
});
window.addEventListener("blur", closeFriendContextMenu);
window.addEventListener("resize", closeFriendContextMenu);

// Single source for a contact's presence: the realtime map fed by server.js.
// Used by the contacts list and the private message header.
function friendPresenceInfo(profileId) {
    const presence = originsFriendPresence.get(String(profileId || ""));
    const status = String(presence?.status || "offline").toLowerCase();
    const game = presence?.game ? String(presence.game) : "";
    let label;

    if (status === "playing") {
        label = game && game.toLowerCase() !== "tempest"
            ? t("playingGame", { game })
            : t("presencePlayingTempest");
    } else if (status === "away") {
        label = t("presenceAway");
    } else if (status === "online") {
        label = t("presenceOnline");
    } else {
        label = t("presenceOffline");
    }

    return { status, label };
}

function updateFriendsOnlineBadge() {
    const onlineCount = originsFriendsCache.reduce((total, profile) => {
        const { status } = friendPresenceInfo(profile.id);
        return total + (status !== "offline" ? 1 : 0);
    }, 0);

    const badge = document.getElementById("friendsMessageBadge");
    if (badge) badge.textContent = String(onlineCount);
    // Green dot only when at least one friend is online.
    friendsQuickAccess?.classList.toggle("has-online-friends", onlineCount > 0);
}

function renderFriendRequests(requests) {
    if (!notificationsContent) return;
    if (notificationsBadge) {
        notificationsBadge.hidden = requests.length === 0;
        notificationsBadge.textContent = String(requests.length);
    }
    notificationsContent.innerHTML = "";

    if (!requests.length) {
        const empty = document.createElement("div");
        empty.className = "social-empty-state";
        empty.innerHTML = `<strong>${t("noNotifications")}</strong><span>${t("noNotificationsText")}</span>`;
        notificationsContent.appendChild(empty);
        return;
    }

    requests.forEach(request => {
        const row = document.createElement("div");
        row.className = "friend-request-row";
        row.appendChild(friendAvatar(request.profile));

        const info = document.createElement("div");
        info.className = "friend-request-info";
        const name = document.createElement("strong");
        name.textContent = request.profile.displayName;
        const id = document.createElement("small");
        id.textContent = request.profile.originsId || "";
        info.append(name, id);
        row.appendChild(info);

        const actions = document.createElement("div");
        actions.className = "friend-request-actions";
        actions.append(
            socialActionButton(t("accept"), async () => {
                const token = localStorage.getItem("origins-token");
                locallyAcceptedRequestIds.add(String(request.id));
                await window.origins.friends.accept(token, request.id);
                await refreshFriendsSocial();
            }),
            socialActionButton(t("refuse"), async () => {
                const token = localStorage.getItem("origins-token");
                await window.origins.friends.refuse(token, request.id);
                await refreshFriendsSocial();
            }, true)
        );
        row.appendChild(actions);
        notificationsContent.appendChild(row);
    });
}

async function searchOriginsContact() {
    const token = localStorage.getItem("origins-token");
    const value = addContactId?.value.trim().toUpperCase();
    const result = ensureAddContactResult();
    const hint = addContactPanel?.querySelector(".add-contact-hint");
    if (!token || !value || !result || !window.origins?.friends) return;

    if (hint) hint.textContent = t("searching");
    result.innerHTML = "";

    try {
        const data = await window.origins.friends.search(token, value);
        const profile = data.profile;
        const row = document.createElement("div");
        row.className = "friend-request-row add-contact-profile-result";
        row.appendChild(friendAvatar(profile));

        const info = document.createElement("div");
        info.className = "friend-request-info";
        const name = document.createElement("strong");
        name.textContent = profile.displayName;
        const id = document.createElement("small");
        id.textContent = profile.originsId;
        info.append(name, id);
        row.appendChild(info);

        const action = document.createElement("div");
        action.className = "friend-request-actions";
        if (data.relation === "accepted") {
            action.textContent = t("alreadyFriends");
        } else if (data.relation === "pending" && data.direction === "sent") {
            action.textContent = t("requestSent");
        } else if (data.relation === "pending" && data.direction === "received") {
            action.appendChild(socialActionButton(t("accept"), async () => {
                locallyAcceptedRequestIds.add(String(data.requestId));
                await window.origins.friends.accept(token, data.requestId);
                await refreshFriendsSocial();
                await searchOriginsContact();
            }));
        } else {
            action.appendChild(socialActionButton(t("sendRequest"), async () => {
                const sent = await window.origins.friends.send(token, profile.originsId);
                if (sent?.accepted && sent.requestId) locallyAcceptedRequestIds.add(String(sent.requestId));
                await refreshFriendsSocial();
                await searchOriginsContact();
            }));
        }
        row.appendChild(action);
        result.appendChild(row);
        if (hint) hint.textContent = "";
    } catch (error) {
        if (hint) {
            hint.textContent = error?.code === "PROFILE_NOT_FOUND"
                ? (t("profileNotFound"))
                : (t("searchFailed"));
        }
    }
}


/* =========================================================
   ORIGINS REALTIME — FRIENDS / PRESENCE / PRIVATE MESSAGES
   Uses the WebSocket bridge exposed by preload.js.
========================================================= */

function realtimePayload(event) {
    return event?.payload ?? event?.data ?? event ?? {};
}

function applyFriendPresence(profileId, presence) {
    if (!profileId) return;
    originsFriendPresence.set(String(profileId), {
        status: String(presence?.status || "offline").toLowerCase(),
        game: presence?.game || null
    });
    renderFriendsList(originsFriendsCache);
}

function applyPresenceSnapshot(snapshot) {
    const entries = Array.isArray(snapshot)
        ? snapshot
        : (Array.isArray(snapshot?.presences) ? snapshot.presences : []);

    entries.forEach((entry) => {
        const profileId = entry?.profileId ?? entry?.profile_id ?? entry?.id;
        if (!profileId) return;
        originsFriendPresence.set(String(profileId), {
            status: String(entry?.status || "offline").toLowerCase(),
            game: entry?.game || null
        });
    });

    renderFriendsList(originsFriendsCache);
}

async function sendLocalRealtimePresence(presence = null) {
    if (!window.origins?.realtime?.sendPresence) return;

    try {
        const current = presence || await window.origins?.presence?.get?.();
        if (!current) return;
        window.origins.realtime.sendPresence(
            current.status || "online",
            current.game || (current.status === "playing" ? "Tempest" : null)
        );
    } catch (error) {
        console.warn("Unable to synchronize realtime presence:", error);
    }
}

async function handleOriginsRealtimeEvent(event) {
    const type = String(event?.type || event?.event || "");
    const payload = realtimePayload(event);
    console.log("[Realtime] event:", type, payload);

    if (type === "presence:snapshot") {
        applyPresenceSnapshot(payload);
        return;
    }

    if (type === "presence:update" || type === "presence:changed") {
        const profileId = payload?.profileId ?? payload?.profile_id ?? payload?.id;
        applyFriendPresence(profileId, payload);
        return;
    }

    if (type === "message:new") {
        const message = payload?.message ?? payload;
        const senderId = String(message?.senderProfileId ?? message?.sender_profile_id ?? "");
        const receiverId = String(message?.receiverProfileId ?? message?.receiver_profile_id ?? "");
        const activeId = String(activeFriendsConversationProfile?.id || "");
        const conversationOpen = Boolean(friendsConversationView?.classList.contains("open"));

        if (activeId && (senderId === activeId || receiverId === activeId)) {
            appendPrivateMessage(message, activeFriendsConversationProfile);
        }

        // My own message sent from the game (or another launcher): shown above, no notification.
        const myProfileId = String(originsProfile?.id || "");
        if (myProfileId && senderId === myProfileId) return;

        // Conversation not visible: notify so the message is not missed.
        if (!(conversationOpen && activeId === senderId && document.hasFocus())) {
            const sender = originsFriendsCache.find(p => String(p.id) === senderId);
            showSocialNotification(
                sender?.displayName || "Origins",
                privateMessageText(message).slice(0, 140)
            );
        }
        return;
    }

    if (type === "friend:request") {
        const requests = await refreshFriendsSocial();
        const request = requests.find(r => String(r.id) === String(payload?.requestId));
        const name = request?.profile?.displayName || "Origins";
        showSocialNotification(
            t("notifFriendRequestTitle"),
            t("notifFriendRequestBody", { name })
        );
        return;
    }

    if (type === "friend:accepted") {
        await refreshFriendsSocial();
        const requestId = String(payload?.requestId || "");
        if (locallyAcceptedRequestIds.has(requestId)) {
            locallyAcceptedRequestIds.delete(requestId);
            return;
        }
        const friend = originsFriendsCache.find(p => String(p.id) === String(payload?.profileId));
        const name = friend?.displayName || "Origins";
        showSocialNotification(
            t("notifAcceptedTitle"),
            t("notifAcceptedBody", { name })
        );
        return;
    }

    if (type === "friend:removed") {
        const removedId = String(payload?.profileId || "");
        originsFriendPresence.delete(removedId);
        if (removedId && String(activeFriendsConversationProfile?.id) === removedId) {
            closeFriendsConversation();
            activeFriendsConversationProfile = null;
        }
        await refreshFriendsSocial();
        return;
    }

    if (type === "friend:request-removed") {
        await refreshFriendsSocial();
    }
}

function connectOriginsRealtime() {
    const token = localStorage.getItem("origins-token");
    if (!token || !window.origins?.realtime?.connect) return;

    if (!originsRealtimeUnsubscribeEvent && window.origins.realtime.onEvent) {
        originsRealtimeUnsubscribeEvent = window.origins.realtime.onEvent((event) => {
            handleOriginsRealtimeEvent(event).catch((error) => {
                console.error("Origins realtime event failed:", error);
            });
        });
    }

    if (!originsRealtimeUnsubscribeStatus && window.origins.realtime.onStatus) {
        originsRealtimeUnsubscribeStatus = window.origins.realtime.onStatus((status) => {
            const value = String(status?.status ?? status ?? "").toLowerCase();
            console.log("[Realtime] status:", value);
            if (value === "connected" || value === "open") {
                sendLocalRealtimePresence();
                refreshFriendsSocial();
            } else if (value === "disconnected" || value === "error") {
                // Connection lost: presences are unknown until the next
                // presence:snapshot, so do not keep friends shown as online.
                originsFriendPresence.clear();
                renderFriendsList(originsFriendsCache);
            }
        });
    }

    if (originsRealtimeToken !== token) {
        originsRealtimeToken = token;
        window.origins.realtime.connect(token);
    }
}

function disconnectOriginsRealtime() {
    originsRealtimeToken = null;
    originsFriendPresence.clear();
    window.origins?.realtime?.disconnect?.();
    updateFriendsOnlineBadge();
}


let floatingZ = 400;



function bringFloatingWindowToFront(panel) {

    if (!panel) return;

    floatingZ += 1;

    panel.style.zIndex = String(floatingZ);

}



function openFloatingWindow(panel) {

    if (!panel) return;

    panel.classList.add("open");

    panel.setAttribute("aria-hidden", "false");

    bringFloatingWindowToFront(panel);

}



function closeFloatingWindow(panel) {

    if (!panel) return;

    panel.classList.remove("open");

    panel.setAttribute("aria-hidden", "true");

}



function restoreFloatingPosition(panel, key) {

    try {

        const saved = JSON.parse(localStorage.getItem(key) || "null");

        if (!saved || !Number.isFinite(saved.left) || !Number.isFinite(saved.top)) return;

        const maxLeft = Math.max(8, window.innerWidth - panel.offsetWidth - 8);

        const maxTop = Math.max(42, window.innerHeight - panel.offsetHeight - 8);

        panel.style.left = `${Math.min(Math.max(8, saved.left), maxLeft)}px`;

        panel.style.top = `${Math.min(Math.max(42, saved.top), maxTop)}px`;

        panel.style.right = "auto";

        panel.style.bottom = "auto";

        panel.style.transform = "none";

    } catch (_) {}

}



function makeFloatingDraggable(panel, key, handleSelector) {

    if (!panel) return;

    const handle = panel.querySelector(handleSelector) || panel;

    panel.addEventListener("pointerdown", () => bringFloatingWindowToFront(panel));

    handle.classList.add("floating-drag-handle");



    handle.addEventListener("pointerdown", (event) => {

        if (event.button !== 0 || event.target.closest("button, input, select, textarea, a")) return;

        event.preventDefault();

        bringFloatingWindowToFront(panel);



        const rect = panel.getBoundingClientRect();

        const offsetX = event.clientX - rect.left;

        const offsetY = event.clientY - rect.top;

        panel.style.left = `${rect.left}px`;

        panel.style.top = `${rect.top}px`;

        panel.style.right = "auto";

        panel.style.bottom = "auto";

        panel.style.transform = "none";

        handle.setPointerCapture?.(event.pointerId);



        const move = (moveEvent) => {

            const maxLeft = Math.max(8, window.innerWidth - panel.offsetWidth - 8);

            const maxTop = Math.max(42, window.innerHeight - panel.offsetHeight - 8);

            const left = Math.min(Math.max(8, moveEvent.clientX - offsetX), maxLeft);

            const top = Math.min(Math.max(42, moveEvent.clientY - offsetY), maxTop);

            panel.style.left = `${left}px`;

            panel.style.top = `${top}px`;

        };



        const end = () => {

            handle.removeEventListener("pointermove", move);

            handle.removeEventListener("pointerup", end);

            handle.removeEventListener("pointercancel", end);

            const finalRect = panel.getBoundingClientRect();

            localStorage.setItem(key, JSON.stringify({ left: finalRect.left, top: finalRect.top }));

        };



        handle.addEventListener("pointermove", move);

        handle.addEventListener("pointerup", end);

        handle.addEventListener("pointercancel", end);

    });



    requestAnimationFrame(() => restoreFloatingPosition(panel, key));

}



const accountPanel = accountOverlay?.querySelector(".account-panel");

const settingsPanel = settingsOverlay?.querySelector(".settings-panel");



makeFloatingDraggable(accountPanel, "origins-window-account", ".account-panel-header");

makeFloatingDraggable(settingsPanel, "origins-window-settings", ".settings-header, [data-drag-handle]");

makeFloatingDraggable(socialPanel, "origins-window-contacts", ".social-header");

makeFloatingDraggable(friendsConversationView, "origins-window-chat-test", ".friends-conversation-header");

makeFloatingDraggable(notificationsPanel, "origins-window-notifications", "[data-drag-handle]");

makeFloatingDraggable(addContactPanel, "origins-window-add-contact", "[data-drag-handle]");



notificationsQuickAccess?.addEventListener("click", () => openFloatingWindow(notificationsPanel));

notificationsClose?.addEventListener("click", () => closeFloatingWindow(notificationsPanel));

addContactClose?.addEventListener("click", () => closeFloatingWindow(addContactPanel));



addContactSearch?.addEventListener("click", searchOriginsContact);

addContactId?.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        searchOriginsContact();

    }

});



// Contacts can close while an already opened conversation remains on screen.

// Backdrops are intentionally passive: only explicit × buttons close floating windows.

if (drawerBackdrop) drawerBackdrop.style.pointerEvents = "none";



/* ==========================================

   CHECK TEMPEST INSTALLATION

========================================== */



async function checkTempestInstallation() {



    try {



        if (

            !window.origins ||

            !window.origins.tempest

        ) {



            console.error(

                "Origins preload API is unavailable."

            );



            return;

        }





        const result =

            await window.origins.tempest.isInstalled();





        tempestInstalled =

            Boolean(

                result.success &&

                result.installed

            );





        tempestUpdateAvailable =

            false;



        tempestUpdateInfo =

            null;





        if (

            tempestInstalled &&

            window.origins.tempest.checkUpdate

        ) {



            console.log(

                "Vérification des mises à jour Tempest..."

            );





            const updateResult =

                await window.origins.tempest.checkUpdate();





            if (

                updateResult &&

                updateResult.success

            ) {



                tempestUpdateAvailable =

                    Boolean(

                        updateResult.needsUpdate

                    );





                tempestUpdateInfo =

                    updateResult;





                if (tempestUpdateAvailable) {



                    console.log(

                        `Mise à jour Tempest disponible — version ${updateResult.version} — ${updateResult.totalFiles} fichier(s).`

                    );



                } else {



                    console.log(

                        "Tempest Origins est à jour."

                    );

                }



            } else {



                console.error(

                    "Impossible de vérifier les mises à jour Tempest :",

                    updateResult?.error ||

                    "Erreur inconnue"

                );

            }

        }





        updateTempestButton();





        if (tempestInstalled) {



            console.log(

                "Tempest Origins detected:",

                result.path

            );

        }





    } catch (error) {



        console.error(

            "Unable to check Tempest installation:",

            error

        );

    }

}





/* ==========================================
   FIRST-LOGIN TUTORIAL
   Spotlight on the real launcher buttons, one step at a time.
   Shown once (origins-tutorial-done), replayable from Settings.
========================================== */

const TUTORIAL_DONE_KEY = "origins-tutorial-done";

const originsTutorial = document.getElementById("originsTutorial");
const originsTutorialSpotlight = document.getElementById("originsTutorialSpotlight");
const originsTutorialBubble = document.getElementById("originsTutorialBubble");
const originsTutorialStep = document.getElementById("originsTutorialStep");
const originsTutorialTitle = document.getElementById("originsTutorialTitle");
const originsTutorialText = document.getElementById("originsTutorialText");
const originsTutorialSkip = document.getElementById("originsTutorialSkip");
const originsTutorialPrev = document.getElementById("originsTutorialPrev");
const originsTutorialNext = document.getElementById("originsTutorialNext");
const replayTutorialButton = document.getElementById("replayTutorialButton");

// target = element to highlight (null = centered bubble).
const TUTORIAL_STEPS = [
    { target: null, title: "tutWelcomeTitle", text: "tutWelcomeText" },
    { target: "#gamesButton", title: "tutGamesTitle", text: "tutGamesText" },
    { target: "#updatesButton", title: "tutNewsTitle", text: "tutNewsText" },
    { target: "#accountButton", title: "tutAccountTitle", text: "tutAccountText" },
    { target: "#friendsQuickAccess", title: "tutContactsTitle", text: "tutContactsText" },
    { target: "#notificationsQuickAccess", title: "tutNotificationsTitle", text: "tutNotificationsText" },
    { target: "#settingsButton", title: "tutSettingsTitle", text: "tutSettingsText" },
    // Ouvre les Paramètres le temps de l'étape, pour montrer le réglage lui-même.
    { target: "#gameMemorySection", title: "tutMemoryTitle", text: "tutMemoryText", panel: "settings" },
    { target: null, title: "tutDoneTitle", text: "tutDoneText" }
];

let tutorialIndex = 0;
// Paramètres ouverts par une étape du tutoriel (refermés en la quittant).
let tutorialOpenedSettings = false;

function tutorialIsDone() {
    try {
        return localStorage.getItem(TUTORIAL_DONE_KEY) === "1";
    } catch (_) {
        return false;
    }
}

function maybeStartTutorial() {
    if (tutorialIsDone() || !originsTutorial || !originsTutorial.hidden) return;
    // Let the onboarding fade out first.
    window.setTimeout(startTutorial, 450);
}

function startTutorial() {
    if (!originsTutorial) return;
    if (typeof closeAllPanels === "function") closeAllPanels();
    tutorialIndex = 0;
    originsTutorial.hidden = false;
    document.addEventListener("keydown", onTutorialKeydown);
    window.addEventListener("resize", renderTutorialStep);
    renderTutorialStep();
    originsTutorialNext?.focus();
}

function endTutorial() {
    if (!originsTutorial) return;
    originsTutorial.hidden = true;
    if (tutorialOpenedSettings) {
        tutorialOpenedSettings = false;
        closeSettings();
    }
    document.removeEventListener("keydown", onTutorialKeydown);
    window.removeEventListener("resize", renderTutorialStep);
    try {
        localStorage.setItem(TUTORIAL_DONE_KEY, "1");
    } catch (_) {}
}

function goToTutorialStep(index) {
    if (index < 0) return;
    if (index >= TUTORIAL_STEPS.length) {
        endTutorial();
        return;
    }
    tutorialIndex = index;
    renderTutorialStep();
}

function onTutorialKeydown(event) {
    if (event.key === "Escape") endTutorial();
    else if (event.key === "ArrowRight") goToTutorialStep(tutorialIndex + 1);
    else if (event.key === "ArrowLeft") goToTutorialStep(tutorialIndex - 1);
}

function renderTutorialStep() {
    if (!originsTutorial || originsTutorial.hidden) return;

    const step = TUTORIAL_STEPS[tutorialIndex];
    const isLast = tutorialIndex === TUTORIAL_STEPS.length - 1;
    const name = originsProfile?.displayName || "Origins";

    originsTutorialStep.textContent = `${tutorialIndex + 1} / ${TUTORIAL_STEPS.length}`;
    originsTutorialTitle.textContent = t(step.title, { name });
    originsTutorialText.textContent = t(step.text, { name });
    originsTutorialPrev.hidden = tutorialIndex === 0;
    originsTutorialSkip.hidden = isLast;
    originsTutorialNext.textContent = isLast ? t("tutFinish") : t("tutNext");

    // Étape dans les Paramètres : on les ouvre, puis on attend la fin de leur animation pour viser le réglage.
    if (step.panel === "settings" && !tutorialOpenedSettings) {
        tutorialOpenedSettings = true;
        openSettings();
        window.setTimeout(renderTutorialStep, 350);
    } else if (step.panel !== "settings" && tutorialOpenedSettings) {
        tutorialOpenedSettings = false;
        closeSettings();
        window.setTimeout(renderTutorialStep, 350);
    }

    const target = step.target ? document.querySelector(step.target) : null;
    const rect = target?.getBoundingClientRect();
    const visible = rect && rect.width > 0 && rect.height > 0;

    originsTutorial.classList.toggle("centered", !visible);

    if (!visible) {
        originsTutorialBubble.style.left = "";
        originsTutorialBubble.style.top = "";
        return;
    }

    const pad = 8;
    Object.assign(originsTutorialSpotlight.style, {
        left: `${rect.left - pad}px`,
        top: `${rect.top - pad}px`,
        width: `${rect.width + pad * 2}px`,
        height: `${rect.height + pad * 2}px`
    });

    // Bubble on the side of the target with the most room, kept on screen.
    const bubble = originsTutorialBubble.getBoundingClientRect();
    const margin = 16;
    const gap = 18;
    const below = rect.top + rect.height / 2 < window.innerHeight / 2;
    let top = below ? rect.bottom + gap : rect.top - bubble.height - gap;
    let left = rect.left + rect.width / 2 - bubble.width / 2;
    top = Math.max(margin, Math.min(top, window.innerHeight - bubble.height - margin));
    left = Math.max(margin, Math.min(left, window.innerWidth - bubble.width - margin));
    originsTutorialBubble.style.left = `${left}px`;
    originsTutorialBubble.style.top = `${top}px`;
}

originsTutorialNext?.addEventListener("click", () => goToTutorialStep(tutorialIndex + 1));
originsTutorialPrev?.addEventListener("click", () => goToTutorialStep(tutorialIndex - 1));
originsTutorialSkip?.addEventListener("click", endTutorial);

replayTutorialButton?.addEventListener("click", () => {
    if (typeof closeSettings === "function") closeSettings();
    window.setTimeout(startTutorial, 250);
});



/* ==========================================
   LAUNCHER UPDATE BANNER
   Shows the download, then a RESTART button once the new
   version is ready (instead of waiting for a real quit,
   which never happens when the launcher lives in the tray).
========================================== */

const launcherUpdateBanner = document.getElementById("launcherUpdateBanner");
const launcherUpdateText = document.getElementById("launcherUpdateText");
const launcherUpdateRestart = document.getElementById("launcherUpdateRestart");

let launcherUpdateStatus = { status: "idle" };

function renderLauncherUpdate(state = launcherUpdateStatus) {
    launcherUpdateStatus = state || { status: "idle" };
    if (!launcherUpdateBanner) return;

    const { status } = launcherUpdateStatus;
    const downloading = status === "available" || status === "downloading";
    const ready = status === "downloaded";
    // Installation automatique (deploy:launcher) : le launcher se relance seul dans quelques secondes.
    const installing = status === "installing";

    launcherUpdateBanner.hidden = !(downloading || ready || installing);
    launcherUpdateBanner.classList.toggle("ready", ready);
    launcherUpdateRestart.hidden = !ready;

    if (downloading) {
        launcherUpdateText.textContent = t("updateDownloading", {
            percent: Math.max(0, Math.min(100, Number(launcherUpdateStatus.percent) || 0))
        });
    } else if (installing) {
        launcherUpdateText.textContent = t("updateRestarting");
        launcherUpdateRestart.hidden = true;
    } else if (ready) {
        launcherUpdateText.textContent = t("updateReady", { version: launcherUpdateStatus.version || "" });
        launcherUpdateRestart.textContent = t("updateRestart");
        launcherUpdateRestart.disabled = false;
    }
}

launcherUpdateRestart?.addEventListener("click", async () => {
    launcherUpdateRestart.disabled = true;
    launcherUpdateRestart.textContent = t("updateRestarting");
    try {
        const result = await window.origins?.launcher?.installUpdate?.();
        if (!result?.success) throw new Error(result?.error || "UPDATE_INSTALL_FAILED");
    } catch (error) {
        console.error("Launcher update install failed:", error);
        launcherUpdateText.textContent = t("updateFailed");
        launcherUpdateRestart.disabled = false;
        launcherUpdateRestart.textContent = t("updateRestart");
    }
});

if (window.origins?.launcher?.onUpdateStatus) {
    window.origins.launcher.onUpdateStatus(renderLauncherUpdate);
    window.origins.launcher.getUpdateStatus?.()
        .then(renderLauncherUpdate)
        .catch(() => {});
}



/* ==========================================
   WHAT'S NEW
   After an update, lists every change between the last version
   this player saw and the installed one (e.g. 0.5.5 -> 0.5.8).
   The installed version is the first entry of news.js: the deploy
   script refuses to publish a version without its recap.
========================================== */

const LAST_SEEN_VERSION_KEY = "origins-last-seen-version";

const originsWhatsNew = document.getElementById("originsWhatsNew");
const originsWhatsNewVersions = document.getElementById("originsWhatsNewVersions");
const originsWhatsNewList = document.getElementById("originsWhatsNewList");
const originsWhatsNewAll = document.getElementById("originsWhatsNewAll");
const originsWhatsNewClose = document.getElementById("originsWhatsNewClose");

function compareLauncherVersions(a, b) {
    const pa = String(a || "0").split(".").map(Number);
    const pb = String(b || "0").split(".").map(Number);
    for (let i = 0; i < 3; i++) {
        const diff = (pa[i] || 0) - (pb[i] || 0);
        if (diff) return diff;
    }
    return 0;
}

function installedLauncherVersion() {
    return updateHistoryI18n.en?.[0]?.version || null;
}

function rememberSeenVersion(version) {
    try {
        localStorage.setItem(LAST_SEEN_VERSION_KEY, version);
    } catch (_) {}
}

function maybeShowWhatsNew() {
    const current = installedLauncherVersion();
    if (!current || !originsWhatsNew || !originsWhatsNew.hidden) return;

    let lastSeen = null;
    try {
        lastSeen = localStorage.getItem(LAST_SEEN_VERSION_KEY);
    } catch (_) {}

    // New player: the tutorial already presents the launcher.
    if (!tutorialIsDone()) {
        rememberSeenVersion(current);
        return;
    }

    // Player from before this window existed: show the current version only.
    if (!lastSeen) {
        lastSeen = updateHistoryI18n.en?.[1]?.version || current;
    }

    if (compareLauncherVersions(current, lastSeen) <= 0) return;

    const history = updateHistoryI18n[currentLauncherLanguage] || updateHistoryI18n.en;
    const entries = history.filter((entry) =>
        compareLauncherVersions(entry.version, lastSeen) > 0 &&
        compareLauncherVersions(entry.version, current) <= 0
    );
    if (!entries.length) {
        rememberSeenVersion(current);
        return;
    }

    originsWhatsNewVersions.textContent = `v${lastSeen}  →  v${current}`;
    originsWhatsNewList.innerHTML = "";
    entries.forEach((entry) => {
        const block = document.createElement("section");
        const title = document.createElement("h3");
        title.textContent = entry.title;
        const list = document.createElement("ul");
        entry.changes.forEach((change) => {
            const item = document.createElement("li");
            item.textContent = change;
            list.appendChild(item);
        });
        block.append(title, list);
        originsWhatsNewList.appendChild(block);
    });

    rememberSeenVersion(current);
    window.setTimeout(() => {
        originsWhatsNew.hidden = false;
        originsWhatsNewClose?.focus();
    }, 600);
}

function closeWhatsNew() {
    if (originsWhatsNew) originsWhatsNew.hidden = true;
}

originsWhatsNewClose?.addEventListener("click", closeWhatsNew);
originsWhatsNewAll?.addEventListener("click", () => {
    closeWhatsNew();
    showPage("updates");
});
originsWhatsNew?.addEventListener("click", (event) => {
    if (event.target === originsWhatsNew) closeWhatsNew();
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && originsWhatsNew && !originsWhatsNew.hidden) closeWhatsNew();
});



/* ==========================================

   INITIALIZE LAUNCHER

========================================== */



async function initializeLauncher() {



    launcherLanguage.value =

        currentLauncherLanguage;



    if (gameLanguage) {

        gameLanguage.value = currentLauncherLanguage;

    }





    applyLanguage(

        currentLauncherLanguage

    );





    showPage(

        "home"

    );





    await checkTempestInstallation();



    await initializeLocalPresence();

    // Restore an existing Origins session only.

    // Microsoft sign-in is started exclusively by the user's click on the login button.

    await loadOriginsProfile();

}





/* ==========================================

   START

========================================== */



initializeLauncher();



/* ==========================================

   ORIGINS CUSTOM WINDOW CONTROLS

========================================== */



document

    .getElementById("windowMinimize")

    ?.addEventListener(

        "click",

        () => window.origins.minimize()

    );



document

    .getElementById("windowMaximize")

    ?.addEventListener(

        "click",

        () => window.origins.maximize()

    );



document

    .getElementById("windowClose")

    ?.addEventListener(

        "click",

        () => window.origins.close()

    );





/* Origins 0.5.2 UI labels */

function refreshOrigins052Labels() {


    const map = [

      ["[data-origins-games-title]", t("games")],

      ["[data-origins-games-lead]", t("gamesLead")],

      ["[data-origins-available]", t("available")],

      ["[data-origins-coming]", t("upcomingGame")],

      ["[data-origins-coming-sub]", t("comingLater")],

      ["#gamesPanel .games-popover-header h2", t("games")],

      ["#tempestButton small", t("availableShort")],

      ["#gamesPanel .game-card-coming strong", t("upcomingGame")],

      ["#gamesPanel .game-card-coming small", t("comingSoonShort")],

      [".settings-section label[for='launcherLanguage']", t("originsLanguage")]

    ];

    map.forEach(([sel, text]) => document.querySelectorAll(sel).forEach(el => el.textContent = text));

}

refreshOrigins052Labels();

launcherLanguage?.addEventListener("change", () => setTimeout(refreshOrigins052Labels, 0));

/* ==========================================
   OPTIONS — MÉMOIRE DU JEU
   Curseur en Go, borné par la RAM du PC (lue par le processus principal).
   Le choix reste dans ce launcher et part avec chaque lancement (-Xmx).
========================================== */

const GAME_MEMORY_KEY = "origins-game-memory";
const gameMemoryInput = document.getElementById("gameMemory");
const gameMemoryValue = document.getElementById("gameMemoryValue");
const gameMemoryHint = document.getElementById("gameMemoryHint");
let gameMemoryInfo = null;

function savedGameMemory() {
    try {
        const value = Number.parseInt(localStorage.getItem(GAME_MEMORY_KEY), 10);
        return Number.isFinite(value) ? value : null;
    } catch (error) {
        return null;
    }
}

function renderGameMemory() {
    if (!gameMemoryInput) return;
    const min = Number(gameMemoryInput.min), max = Number(gameMemoryInput.max);
    const value = Number(gameMemoryInput.value);
    gameMemoryInput.style.setProperty("--fill", `${max > min ? ((value - min) / (max - min)) * 100 : 100}%`);
    gameMemoryValue.textContent = t("gameMemoryValue", { gb: value });
    if (gameMemoryInfo) {
        gameMemoryHint.textContent = t("gameMemoryHint", { total: gameMemoryInfo.totalGb, recommended: gameMemoryInfo.defaultGb });
    }
}

async function initGameMemory() {
    if (!gameMemoryInput || !window.origins?.tempest?.systemMemory) return;
    try {
        gameMemoryInfo = await window.origins.tempest.systemMemory();
    } catch (error) {
        console.error("Mémoire du PC illisible :", error);
        return;
    }
    gameMemoryInput.min = String(gameMemoryInfo.minGb);
    gameMemoryInput.max = String(gameMemoryInfo.maxGb);
    const saved = savedGameMemory();
    const value = saved === null ? gameMemoryInfo.defaultGb : Math.min(gameMemoryInfo.maxGb, Math.max(gameMemoryInfo.minGb, saved));
    gameMemoryInput.value = String(value);
    renderGameMemory();
}

gameMemoryInput?.addEventListener("input", () => {
    renderGameMemory();
    try {
        localStorage.setItem(GAME_MEMORY_KEY, gameMemoryInput.value);
    } catch (error) {
        console.error("Impossible d'enregistrer la mémoire du jeu :", error);
    }
});

// Appelé par applyLanguage (défini plus haut, avant ces constantes).
window.originsRenderGameMemory = renderGameMemory;
initGameMemory();


/* ==========================================
   TEMPEST — MISE À JOUR AUTOMATIQUE
   L'API prévient dès qu'un deploy:tempest publie de nouveaux fichiers (et on
   revérifie toutes les 10 minutes au cas où le temps réel serait coupé) : si
   rien n'est en cours, la mise à jour se fait seule, sans redémarrer le launcher.
========================================== */

const TEMPEST_UPDATE_RECHECK_MS = 10 * 60 * 1000;
let tempestAutoUpdateRetry = null;

async function applyTempestUpdateNow() {
    clearTimeout(tempestAutoUpdateRetry);
    // Installation, mise à jour ou lancement en cours : on réessaie un peu plus tard.
    if (!playButton || playButton.disabled) {
        tempestAutoUpdateRetry = setTimeout(applyTempestUpdateNow, 30 * 1000);
        return;
    }
    try {
        await checkTempestInstallation();
    } catch (error) {
        console.error("Vérification Tempest impossible :", error);
        return;
    }
    // Même chemin que le bouton « Mettre à jour ».
    if (tempestInstalled && tempestUpdateAvailable && !playButton.disabled) playButton.click();
}

window.origins?.tempest?.onRemoteUpdate?.(() => applyTempestUpdateNow());
setInterval(applyTempestUpdateNow, TEMPEST_UPDATE_RECHECK_MS);


/* ==========================================
   ACTUS EN DIRECT
   Chaque push qui change quelque chose pour les joueurs publie une actu courte
   (5 langues) : lue au démarrage, puis reçue en direct (news:new). Elles passent
   devant les actus livrées avec le launcher, sur l'accueil et dans les Actus.
   Le texte vient de l'API : il est échappé avant d'aller dans la page.
========================================== */

window.originsLiveNews = window.originsLiveNews || [];

function escapeNewsHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function liveNewsDate(iso, language) {
    try {
        const locale = { fr: "fr-FR", en: "en-GB", es: "es-ES", de: "de-DE", pt: "pt-BR" }[language] || "en-GB";
        return new Date(iso).toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }).toUpperCase();
    } catch (error) {
        return "";
    }
}

/** Actus en direct au format des actus du launcher, dans la langue voulue (anglais, puis français à défaut). */
function liveNewsItems(language) {
    return (window.originsLiveNews || []).map((news) => {
        const text = news.content?.[language] || news.content?.en || news.content?.fr;
        if (!text) return null;
        return {
            version: news.version ? escapeNewsHtml(news.version) : "",
            date: escapeNewsHtml(liveNewsDate(news.createdAt, language)),
            type: escapeNewsHtml(news.type || "TEMPEST"),
            title: escapeNewsHtml(text.title),
            text: escapeNewsHtml(text.text),
            changes: (text.changes || []).map(escapeNewsHtml)
        };
    }).filter(Boolean);
}

function setLiveNews(list) {
    window.originsLiveNews = (Array.isArray(list) ? list : []).slice(0, 15);
    renderNews(currentLauncherLanguage);
    renderUpdateHistory();
}

async function loadLiveNews() {
    try {
        const data = await window.origins?.news?.list?.();
        if (data?.news) setLiveNews(data.news);
    } catch (error) {
        console.error("Actus en direct indisponibles :", error);
    }
}

window.origins?.realtime?.onEvent?.((event) => {
    const news = event?.data?.news;
    if (event?.type !== "news:new" || !news) return;
    setLiveNews([news, ...window.originsLiveNews.filter((item) => item.slug !== news.slug)]);
});

loadLiveNews();
