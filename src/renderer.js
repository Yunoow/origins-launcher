// ==========================================

// ORIGINS LAUNCHER

// Renderer - Prototype 0.4

// ==========================================





/* ==========================================

   TRANSLATIONS

========================================== */



const translations = {



    en: {



        home: "HOME",



        originsProject: "ORIGINS PROJECT",



        welcomeTitle: "WELCOME TO ORIGINS",



        welcomeText:

            "Follow the development of Tempest Origins, discover project news and read the latest patch notes.",



        discoverTempest:

            "DISCOVER TEMPEST ORIGINS",



        newsEyebrow:

            "ORIGINS NETWORK",



        latestNews:

            "LATEST NEWS",



        localFeed:

            "",



        signIn:

            "SIGN IN",



        install:

            "INSTALL",



        account:

            "ACCOUNT",



        accountDescription:

            "Sign in to your account to access Tempest Origins and your friends.",



        openFriends:

            "OPEN FRIENDS",



        notSignedIn:

            "Not signed in",



        offline:

            "Offline",



        friends:

            "FRIENDS",



        signInFriends:

            "Sign in to see your friends",



        friendsDescription:

            "Your Origins friends will appear here.",



        friendsOnline:

            "FRIENDS ONLINE",



        onlineShort:

            "online",



        presenceOnline:

            "Online",



        presenceAway:

            "Away",



        presencePlayingTempest:

            "Playing Tempest",



        privateMessages:

            "PRIVATE MESSAGES",



        privateMessagesDescription:

            "Chat directly with your friends from the launcher.",



        comingSoon:

            "COMING SOON",



        conversationEmpty:

            "Start a conversation from the launcher.",



        messagePlaceholder:

            "Write a message...",



        settings:

            "SETTINGS",



        launcherLanguage:

            "LAUNCHER LANGUAGE",



        launcherLanguageDescription:

            "Choose the language used by Origins Launcher.",



        gameLanguage:

            "TEMPEST ORIGINS LANGUAGE",



        gameLanguageDescription:

            "Choose the language used when Tempest Origins starts.",



        updatesTitle: "NEWS",

        updatesLead: "Find the history of launcher and Origins project updates here.",

        shopLead: "The Origins shop is ready for future project content.",

        shopTempestTitle: "Tempest Content",

        shopTempestText: "Future Tempest Origins content will appear here.",

        shopOriginsTitle: "Origins Collection",

        shopOriginsText: "A section planned for future Origins items and content.",

        shopComingTitle: "Coming Soon",

        shopComingText: "More categories can be added without changing navigation.",

        originsLibrary: "ORIGINS LIBRARY",

        displayName: "Display name",

        saveName: "SAVE NAME",

        changeAvatar: "CHANGE AVATAR",

        originsLanguage: "ORIGINS LANGUAGE",

        originsLanguageDescription: "One language for Origins Launcher and Tempest / Minecraft.",

        preparingTempest: "PREPARING TEMPEST ORIGINS",

        preparingInstallation: "Preparing installation...",

        latestUpdate: "LATEST UPDATE",

        versionLabel: "VERSION",

        signOut: "SIGN OUT",

        devSignIn: "DEV SIGN IN",



        languageNoteTitle:

            "Game language",



        languageNote:

            "This setting will be applied when Tempest Origins is installed or launched."

    },





    fr: {



        home:

            "ACCUEIL",



        originsProject:

            "PROJET ORIGINS",



        welcomeTitle:

            "BIENVENUE DANS ORIGINS",



        welcomeText:

            "Suis le développement de Tempest Origins, découvre les actualités du projet et consulte les dernières notes de mise à jour.",



        discoverTempest:

            "DÉCOUVRIR TEMPEST ORIGINS",



        newsEyebrow:

            "RÉSEAU ORIGINS",



        latestNews:

            "DERNIÈRES ACTUALITÉS",



        localFeed:

            "FLUX LOCAL • PROTOTYPE",



        signIn:

            "SE CONNECTER",



        install:

            "INSTALLER",



        account:

            "COMPTE",



        accountDescription:

            "Connecte-toi à ton compte pour accéder à Tempest Origins et à tes amis.",



        openFriends:

            "OUVRIR LES AMIS",



        notSignedIn:

            "Non connecté",



        offline:

            "Hors ligne",



        friends:

            "AMIS",



        signInFriends:

            "Connecte-toi pour voir tes amis",



        friendsDescription:

            "Tes amis Origins apparaîtront ici.",



        friendsOnline:

            "AMIS EN LIGNE",



        onlineShort:

            "en ligne",



        presenceOnline:

            "En ligne",



        presenceAway:

            "Absent",



        presencePlayingTempest:

            "Joue à Tempest",



        privateMessages:

            "MESSAGES PRIVÉS",



        privateMessagesDescription:

            "Discute directement avec tes amis depuis le launcher.",



        comingSoon:

            "BIENTÔT",



        conversationEmpty:

            "Commence une conversation depuis le launcher.",



        messagePlaceholder:

            "Écrire un message...",



        settings:

            "PARAMÈTRES",



        launcherLanguage:

            "LANGUE DU LAUNCHER",



        launcherLanguageDescription:

            "Choisis la langue utilisée par Origins Launcher.",



        gameLanguage:

            "LANGUE DE TEMPEST ORIGINS",



        gameLanguageDescription:

            "Choisis la langue utilisée au lancement de Tempest Origins.",



        updatesTitle: "ACTUALITÉS",

        updatesLead: "Retrouve ici l'historique des mises à jour du launcher et des projets Origins.",

        shopLead: "La boutique Origins est prête à accueillir les futurs contenus du projet.",

        shopTempestTitle: "Contenus Tempest",

        shopTempestText: "Les futurs contenus liés à Tempest Origins apparaîtront ici.",

        shopOriginsTitle: "Collection Origins",

        shopOriginsText: "Une section prévue pour les futurs objets et contenus Origins.",

        shopComingTitle: "Prochainement",

        shopComingText: "D'autres catégories pourront être ajoutées sans modifier la navigation.",

        originsLibrary: "BIBLIOTHÈQUE ORIGINS",

        displayName: "Nom d'affichage",

        saveName: "ENREGISTRER LE NOM",

        changeAvatar: "CHANGER L'AVATAR",

        originsLanguage: "LANGUE ORIGINS",

        originsLanguageDescription: "Une seule langue pour Origins Launcher et Tempest / Minecraft.",

        preparingTempest: "PRÉPARATION DE TEMPEST ORIGINS",

        preparingInstallation: "Préparation de l'installation...",

        latestUpdate: "DERNIÈRE MISE À JOUR",

        versionLabel: "VERSION",

        signOut: "DÉCONNEXION",

        devSignIn: "CONNEXION DEV",



        languageNoteTitle:

            "Langue du jeu",



        languageNote:

            "Ce réglage sera appliqué lors de l'installation ou du lancement de Tempest Origins."

    }



};







/* ==========================================

   UPDATE HISTORY

   Pour une future MAJ : ajoute simplement une entrée

   tout en haut de cette liste.

========================================== */



const updateHistory = [

    {

        version: "0.4",

        date: "22 SEPTEMBRE 2026",

        type: "LAUNCHER",

        title: "Launcher Update 0.4",

        text: "Nouvelle direction visuelle Origins, navigation améliorée et premières fonctions sociales.",

        changes: [

            "Nouvelle identité visuelle bleue Origins",

            "Nouvelle barre latérale et navigation",

            "Fenêtre Amis et messages privés",

            "Présence en ligne et état de jeu",

            "Détection de Tempest en cours d'exécution"

        ]

    },

    {

        version: "0.3",

        date: "DÉVELOPPEMENT",

        type: "TEMPEST ORIGINS",

        title: "Point sur le développement",

        text: "Première intégration de Tempest Origins au launcher et évolution du flux de lancement.",

        changes: [

            "Page dédiée à Tempest Origins",

            "Installation et lancement depuis le launcher",

            "Gestion de la langue du jeu"

        ]

    },

    {

        version: "0.2",

        date: "PROTOTYPE",

        type: "ORIGINS",

        title: "Arrivée du réseau Origins",

        text: "Mise en place des premières bases de l'écosystème Origins.",

        changes: [

            "Accueil Origins",

            "Structure multi-pages",

            "Premiers panneaux du launcher"

        ]

    },

    {

        version: "0.1",

        date: "PREMIER PROTOTYPE",

        type: "ORIGINS",

        title: "Naissance du launcher",

        text: "Première version locale du launcher Origins.",

        changes: [

            "Fenêtre Electron",

            "Navigation initiale",

            "Base du lancement de jeu"

        ]

    }

];



const updateHistoryI18n = {

    fr: updateHistory,

    en: [

        { version:"0.4", date:"22 SEPTEMBER 2026", type:"LAUNCHER", title:"Launcher Update 0.4", text:"A new Origins visual direction, improved navigation and the first social features.", changes:["New blue Origins visual identity","New navigation dock","Friends and private messages interface","Online presence and game status","Detection of Tempest while running"] },

        { version:"0.3", date:"DEVELOPMENT", type:"TEMPEST ORIGINS", title:"Development Update", text:"First integration of Tempest Origins into the launcher and improvements to the launch flow.", changes:["Dedicated Tempest Origins page","Install and launch from the launcher","Game language management"] },

        { version:"0.2", date:"PROTOTYPE", type:"ORIGINS", title:"Origins Network Arrives", text:"The first foundations of the Origins ecosystem are now in place.", changes:["Origins home","Multi-page structure","First launcher panels"] },

        { version:"0.1", date:"FIRST PROTOTYPE", type:"ORIGINS", title:"The Launcher Begins", text:"First local version of Origins Launcher.", changes:["Electron window","Initial navigation","Game launch foundation"] }

    ]

};



/* ==========================================

   NEWS CONTENT

========================================== */



const newsContent = {



    en: [



        {

            type: "TEMPEST ORIGINS",



            title:

                "Development Update",



            text:

                "Follow the first steps of Tempest Origins and the evolution of the project.",



            date:

                "DEVELOPMENT"

        },



        {

            type:

                "PATCH NOTES",



            title:

                "Launcher Update 0.4",



            text:

                "A new Origins home page, page navigation and a first local news feed.",



            date:

                "VERSION 0.4"

        },



        {

            type:

                "ORIGINS",



            title:

                "Welcome to Origins",



            text:

                "This space will later receive announcements, project news and server information.",



            date:

                "COMING SOON"

        }



    ],





    fr: [



        {

            type:

                "TEMPEST ORIGINS",



            title:

                "Point sur le développement",



            text:

                "Suis les premières étapes de Tempest Origins et l'évolution du projet.",



            date:

                "DÉVELOPPEMENT"

        },



        {

            type:

                "NOTES DE MISE À JOUR",



            title:

                "Launcher Update 0.4",



            text:

                "Nouvel accueil Origins, navigation entre les pages et premier flux d'actualités local.",



            date:

                "VERSION 0.4"

        },



        {

            type:

                "ORIGINS",



            title:

                "Bienvenue dans Origins",



            text:

                "Cet espace accueillera plus tard les annonces, actualités des projets et informations serveurs.",



            date:

                "BIENTÔT"

        }



    ]



};





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



    const t =

        translations[currentLauncherLanguage] ||

        translations.en;



    localProfileStatus.classList.remove(

        "playing",

        "away"

    );



    if (away) {



        localProfileStatus.classList.add(

            "away"

        );



        localProfileStatus.textContent =

            t.presenceAway;



        return;

    }



    // Online et Playing restent tous les deux verts.

    localProfileStatus.textContent =

        playing

            ? t.presencePlayingTempest

            : t.presenceOnline;

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



        window.origins.presence.onChanged(

            renderLocalPresence

        );

    }

}





/* ==========================================

   FRIENDS — PRIVATE MESSAGE UI

   Local interface only. No network/backend yet.

========================================== */



function openFriendsConversation() {



    if (!friendsConversationView) {



        return;

    }



    friendsConversationView.classList.add(

        "open"

    );



    setTimeout(

        () => {



            friendsMessageInput?.focus();

        },

        100

    );

}





function closeFriendsConversation() {



    if (!friendsConversationView) {



        return;

    }



    friendsConversationView.classList.remove(

        "open"

    );

}





function addLocalPrivateMessage(

    text

) {



    if (

        !friendsConversationMessages

    ) {



        return;

    }



    const emptyState =

        friendsConversationMessages.querySelector(

            ".friends-conversation-empty"

        );



    if (emptyState) {



        emptyState.remove();

    }





    const bubble =

        document.createElement(

            "div"

        );



    bubble.className =

        "friends-message-bubble sent";



    bubble.textContent =

        text;





    friendsConversationMessages.appendChild(

        bubble

    );





    friendsConversationMessages.scrollTop =

        friendsConversationMessages.scrollHeight;

}





originsTestFriend?.addEventListener(

    "click",

    openFriendsConversation

);





friendsConversationBack?.addEventListener(

    "click",

    closeFriendsConversation

);





friendsMessageComposer?.addEventListener(

    "submit",

    (event) => {



        event.preventDefault();





        const message =

            friendsMessageInput

                ? friendsMessageInput.value.trim()

                : "";





        if (!message) {



            return;

        }





        /*

         * UI locale uniquement pour cette étape.

         * Aucun envoi réseau n'est effectué.

         */



        addLocalPrivateMessage(

            message

        );





        friendsMessageInput.value =

            "";



        friendsMessageInput.focus();

    }

);





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



if (!translations[currentLauncherLanguage]) {



    currentLauncherLanguage = "en";

}



if (

    currentGameLanguage !== "en" &&

    currentGameLanguage !== "fr"

) {



    currentGameLanguage = "en";

}





/* ==========================================

   NEWS

========================================== */



function renderNews(language) {



    const items = (newsContent[language] || newsContent.en).slice(0, 3);



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



    const t = translations[currentLauncherLanguage] || translations.en;

    const history = updateHistoryI18n[currentLauncherLanguage] || updateHistoryI18n.en;



    updatesHistory.innerHTML =

        history.map((item, index) => `

            <article class="update-history-card ${index === 0 ? "latest" : ""}">

                <div class="update-history-top">

                    <div>

                        <span class="news-type">${item.type}</span>

                        <h2>${item.title}</h2>

                    </div>

                    <span class="update-version">v${item.version}</span>

                </div>

                <p>${item.text}</p>

                <ul>${item.changes.map((change) => `<li>${change}</li>`).join("")}</ul>

                <div class="update-history-meta">

                    <span>${item.date}</span>

                    ${index === 0 ? `<strong>${t.latestUpdate}</strong>` : ""}

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

            currentLauncherLanguage === "fr"

                ? "EN COURS"

                : "RUNNING";



        return;

    }





    playButton.disabled = false;





    if (

        tempestInstalled &&

        tempestUpdateAvailable

    ) {



        playButton.textContent =

            currentLauncherLanguage === "fr"

                ? "METTRE À JOUR"

                : "UPDATE";



        return;

    }





    if (tempestInstalled) {



        playButton.textContent =

            currentLauncherLanguage === "fr"

                ? "JOUER"

                : "PLAY";



        return;

    }





    playButton.textContent =

        currentLauncherLanguage === "fr"

            ? "INSTALLER"

            : "INSTALL";

}





/* ==========================================

   LANGUAGE

========================================== */



function applyLanguage(language) {



    const t =

        translations[language] ||

        translations.en;



    document

        .querySelectorAll("[data-i18n]")

        .forEach((element) => {



            const key =

                element.getAttribute(

                    "data-i18n"

                );



            if (t[key]) {



                element.textContent =

                    t[key];

            }



        });



    document

        .querySelectorAll(

            "[data-i18n-placeholder]"

        )

        .forEach(

            (element) => {



                const key =

                    element.getAttribute(

                        "data-i18n-placeholder"

                    );



                if (t[key]) {



                    element.placeholder =

                        t[key];

                }

            }

        );





    document.documentElement.lang =

        language;



    renderNews(language);

    renderUpdateHistory();

    renderOriginsProfile(originsProfile);

    refreshOrigins052Labels();



    updateTempestButton();



    const french =

        language === "fr";



    settingsButton.title =

        french

            ? "Paramètres"

            : "Settings";



    accountButton.title =

        french

            ? "Compte"

            : "Account";



    homeButton.title =

        french

            ? "Accueil"

            : "Home";



    tempestButton.title =

        "Tempest Origins";



    gamesButton.title =

        french

            ? "Jeux"

            : "Games";



    settingsClose.setAttribute(

        "aria-label",



        french

            ? "Fermer les paramètres"

            : "Close settings"

    );



    accountClose.setAttribute(

        "aria-label",



        french

            ? "Fermer le compte"

            : "Close account"

    );



    socialClose.setAttribute(

        "aria-label",



        french

            ? "Fermer les contacts"

            : "Close contacts"

    );



    const socialWords = {

        contacts: french ? "CONTACTS" : "CONTACTS",

        notifications: french ? "NOTIFICATIONS" : "NOTIFICATIONS",

        noNotifications: french ? "AUCUNE NOTIFICATION" : "NO NOTIFICATIONS",

        noNotificationsText: french ? "Les demandes d’ami apparaîtront ici." : "Friend requests will appear here.",

        addContact: french ? "AJOUTER UN CONTACT" : "ADD A CONTACT",

        originsId: "ORIGINS ID",

        search: french ? "RECHERCHER" : "SEARCH",

        socialBackendPending: french ? "La recherche par Origins ID sera connectée au serveur social." : "Origins ID search will be connected to the social server."

    };

    Object.entries(socialWords).forEach(([key, value]) => {

        document.querySelectorAll(`[data-i18n="${key}"]`).forEach((node) => { node.textContent = value; });

    });

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



function showMicrosoftOnboarding() {

    if (!originsOnboarding) return;

    originsOnboarding.classList.add("is-visible");
    originsMicrosoftStep.hidden = false;
    originsProfileStep.hidden = true;
    setOnboardingStatus("");

}



function showProfileOnboarding() {

    if (!originsOnboarding) return;

    originsOnboarding.classList.add("is-visible");
    originsMicrosoftStep.hidden = true;
    originsProfileStep.hidden = false;
    setOnboardingStatus("");

    window.setTimeout(() => originsFirstProfileName?.focus(), 50);

}



function hideOriginsOnboarding() {

    originsOnboarding?.classList.remove("is-visible");
    setOnboardingStatus("");

}



async function signInWithMicrosoft() {

    if (!window.origins?.profile?.microsoftLogin) {

        setOnboardingStatus("Microsoft sign-in is unavailable.", true);
        return;

    }

    originsMicrosoftButton.disabled = true;
    setOnboardingStatus("Waiting for Microsoft sign-in...");

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
        setOnboardingStatus("Microsoft sign-in failed. Please try again.", true);
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

        setOnboardingStatus("Display name must contain 3 to 32 characters.", true);
        originsFirstProfileName?.focus();
        return;

    }

    originsCreateProfileButton.disabled = true;
    setOnboardingStatus("Creating your Origins profile...");

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
                ? "This Microsoft account already has an Origins profile."
                : "Unable to create the profile. Please try again.",
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
                currentLauncherLanguage === "fr"
                    ? "COPIÉ"
                    : "COPIED";

            window.setTimeout(() => {
                label.textContent =
                    currentLauncherLanguage === "fr"
                        ? "COPIER"
                        : "COPY";
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

    const name = profile?.displayName || (currentLauncherLanguage === "fr" ? "Non connecté" : "Not signed in");

    document.querySelectorAll("#localProfileName, #accountProfileName").forEach(el => el.textContent = name);

    document.querySelectorAll(".account-icon, .account-avatar-large, .avatar").forEach(el => {

        const src = avatarSrc(profile);

        el.style.backgroundImage = src ? `url("${src}")` : "";

        el.classList.toggle("has-profile-avatar", Boolean(src));

        if (src) el.textContent = "";

    });

    if (profileNameInput) profileNameInput.value = profile?.displayName || "";

    if (accountButton) {

        accountButton.title = profile ? name : "Origins profile";

        accountButton.setAttribute("aria-label", profile ? name : "Origins profile");

    }

    if (profile) {

        loginButton.textContent = (translations[currentLauncherLanguage] || translations.en).signOut;

    } else {

        loginButton.textContent = (translations[currentLauncherLanguage] || translations.en).signIn;

    }

    renderAccountOriginsId(profile);

    if (profile) {

        refreshFriendsSocial();

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



    const french =

        currentLauncherLanguage === "fr";



    const labels = {



        PREPARING:

            french

                ? "PRÉPARATION DE TEMPEST ORIGINS"

                : "PREPARING TEMPEST ORIGINS",



        CREATING_INSTANCE:

            french

                ? "CRÉATION DE L'INSTANCE"

                : "CREATING GAME INSTANCE",



        CREATING_FILES:

            french

                ? "PRÉPARATION DES FICHIERS"

                : "PREPARING FILES",



        WRITING_CONFIGURATION:

            french

                ? "CONFIGURATION"

                : "CONFIGURING",



        VERIFYING:

            french

                ? "VÉRIFICATION DES FICHIERS"

                : "VERIFYING FILES",



        COMPLETE:

            french

                ? "INSTALLATION TERMINÉE"

                : "INSTALLATION COMPLETE",



        ERROR:

            french

                ? "ERREUR D'INSTALLATION"

                : "INSTALLATION ERROR"



    };



    return labels[stage] || stage;

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



    installProgressDetail.textContent =

        data.detail || "";

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

                    currentLauncherLanguage === "fr"

                        ? "MISE À JOUR..."

                        : "UPDATING...";



                updateInstallProgress({

                    percent: 10,

                    stage: "UPDATE",

                    detail:

                        currentLauncherLanguage === "fr"

                            ? "Téléchargement de la mise à jour..."

                            : "Downloading update..."

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

                        currentLauncherLanguage === "fr"

                            ? "Mise à jour terminée."

                            : "Update complete."

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

                    currentLauncherLanguage === "fr"

                        ? "RÉESSAYER"

                        : "RETRY";



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

                    currentLauncherLanguage === "fr"

                        ? "LANCEMENT..."

                        : "LAUNCHING...";



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

                    await window.origins.tempest.launch(currentLauncherLanguage);



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

                    currentLauncherLanguage === "fr"

                        ? "RÉESSAYER"

                        : "RETRY";



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

                    currentLauncherLanguage === "fr"

                        ? "PRÉPARATION DE TEMPEST ORIGINS"

                        : "PREPARING TEMPEST ORIGINS";

            }



            if (installProgressDetail) {



                installProgressDetail.textContent =

                    currentLauncherLanguage === "fr"

                        ? "Initialisation..."

                        : "Initializing...";

            }



            playButton.textContent =

                currentLauncherLanguage === "fr"

                    ? "INSTALLATION..."

                    : "INSTALLING...";



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

                    currentLauncherLanguage === "fr"

                        ? "Tempest Origins est prêt."

                        : "Tempest Origins is ready."

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

                currentLauncherLanguage === "fr"

                    ? "RÉESSAYER"

                    : "RETRY";



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
        renderFriendsList(friendsData?.friends || []);
        renderFriendRequests(receivedData?.requests || []);
    } catch (error) {
        console.error("Unable to refresh friends:", error);
    }
}

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
        empty.innerHTML = `<strong>${currentLauncherLanguage === "fr" ? "AUCUN CONTACT" : "NO CONTACTS"}</strong><span>${currentLauncherLanguage === "fr" ? "Ajoutez un contact avec son Origins ID." : "Add a contact with their Origins ID."}</span>`;
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
        id.textContent = profile.originsId || "";
        info.append(name, id);
        row.appendChild(info);

        const arrow = document.createElement("span");
        arrow.className = "friends-contact-arrow";
        arrow.textContent = "›";
        row.appendChild(arrow);
        row.addEventListener("click", openFriendsConversation);
        friendsListView.appendChild(row);
    });
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
        empty.innerHTML = `<strong>${currentLauncherLanguage === "fr" ? "AUCUNE NOTIFICATION" : "NO NOTIFICATIONS"}</strong><span>${currentLauncherLanguage === "fr" ? "Les demandes d’ami apparaîtront ici." : "Friend requests will appear here."}</span>`;
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
            socialActionButton(currentLauncherLanguage === "fr" ? "ACCEPTER" : "ACCEPT", async () => {
                const token = localStorage.getItem("origins-token");
                await window.origins.friends.accept(token, request.id);
                await refreshFriendsSocial();
            }),
            socialActionButton(currentLauncherLanguage === "fr" ? "REFUSER" : "REFUSE", async () => {
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

    if (hint) hint.textContent = currentLauncherLanguage === "fr" ? "Recherche…" : "Searching…";
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
            action.textContent = currentLauncherLanguage === "fr" ? "DÉJÀ AMI" : "ALREADY FRIENDS";
        } else if (data.relation === "pending" && data.direction === "sent") {
            action.textContent = currentLauncherLanguage === "fr" ? "DEMANDE ENVOYÉE" : "REQUEST SENT";
        } else if (data.relation === "pending" && data.direction === "received") {
            action.appendChild(socialActionButton(currentLauncherLanguage === "fr" ? "ACCEPTER" : "ACCEPT", async () => {
                await window.origins.friends.accept(token, data.requestId);
                await refreshFriendsSocial();
                await searchOriginsContact();
            }));
        } else {
            action.appendChild(socialActionButton(currentLauncherLanguage === "fr" ? "AJOUTER" : "SEND REQUEST", async () => {
                await window.origins.friends.send(token, profile.originsId);
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
                ? (currentLauncherLanguage === "fr" ? "Aucun profil trouvé avec cet Origins ID." : "No profile found with this Origins ID.")
                : (currentLauncherLanguage === "fr" ? "Impossible d’effectuer la recherche." : "Unable to search right now.");
        }
    }
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

    const fr = currentLauncherLanguage === "fr";

    const map = [

      ["[data-origins-games-title]", fr ? "JEUX" : "GAMES"],

      ["[data-origins-games-lead]", fr ? "Vos mondes, au même endroit." : "Your worlds, in one place."],

      ["[data-origins-available]", fr ? "DISPONIBLE" : "AVAILABLE"],

      ["[data-origins-coming]", fr ? "JEU À VENIR" : "UPCOMING GAME"],

      ["[data-origins-coming-sub]", fr ? "Bientôt" : "Coming later"],

      ["#gamesPanel .games-popover-header h2", fr ? "JEUX" : "GAMES"],

      ["#tempestButton small", fr ? "Disponible" : "Available"],

      ["#gamesPanel .game-card-coming strong", fr ? "PROCHAIN JEU" : "UPCOMING GAME"],

      ["#gamesPanel .game-card-coming small", fr ? "Bientôt disponible" : "Coming soon"],

      [".settings-section label[for='launcherLanguage']", fr ? "LANGUE ORIGINS" : "ORIGINS LANGUAGE"]

    ];

    map.forEach(([sel, text]) => document.querySelectorAll(sel).forEach(el => el.textContent = text));

}

refreshOrigins052Labels();

launcherLanguage?.addEventListener("change", () => setTimeout(refreshOrigins052Labels, 0));