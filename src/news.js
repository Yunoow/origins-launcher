// ==========================================
// ORIGINS LAUNCHER — NEWS & UPDATE HISTORY
// Loaded after i18n.js and before renderer.js (see index.html).
//
// For every new update: add an entry at the TOP of each language
// in updateHistoryI18n (full recap in the News tab) and a short card
// at the TOP of each language in newsContent (home shows the first 3).
// Missing languages fall back to English.
// ==========================================

const updateHistoryI18n = {

    fr: [
        {
            version: "0.7.2", date: "17 NOVEMBRE 2026", type: "LAUNCHER", title: "Launcher Update 0.7.2",
            text: "Tout le launcher en un seul endroit : un nouveau look, Mac et Linux, et ton profil Origins jusque sur le site.",
            changes: [
                "Nouveau design Or et ébène (les autres thèmes restent dans les Paramètres), nouveau logo et nouvelle icône",
                "Windows, Mac et Linux : tout est sur la page Télécharger du site",
                "Tempest s'installe, se met à jour et se lance en un clic ; Java 21 s'installe tout seul s'il manque, et si le jeu ne se lance pas, le launcher te dit pourquoi",
                "Le launcher se met à jour tout seul (jamais pendant une partie), et un seul launcher s'ouvre à la fois",
                "Ton profil Origins, créé avec ton compte Microsoft : nom, avatar et Origins ID",
                "Tes amis en direct (en ligne, joue à Tempest) et tes MP, reliés au chat du jeu",
                "« Ouvrir sur le site » et la connexion au site depuis la cloche ; Discord facultatif",
                "Tickets : ouvre un ticket sur la page Support du site ; quand l'équipe répond, tu es prévenu dans la cloche",
                "Ta photo de profil est bien ronde en haut du panneau Contacts",
                "Mémoire du jeu réglable, 5 langues (le jeu suit la langue du launcher), tutoriel à revoir dans les Paramètres",
                "Les actus de Tempest en direct sur l'accueil, et « Quoi de neuf ? » après chaque mise à jour"
            ]
        }
    ],

    en: [
        {
            version: "0.7.2", date: "NOVEMBER 17, 2026", type: "LAUNCHER", title: "Launcher Update 0.7.2",
            text: "The whole launcher in one place: a new look, Mac and Linux, and your Origins profile all the way to the website.",
            changes: [
                "New Gold and ebony design (the other themes are still in Settings), new logo and new icon",
                "Windows, Mac and Linux: everything is on the website's Download page",
                "Tempest installs, updates and launches in one click; Java 21 installs itself if it's missing, and if the game won't start, the launcher tells you why",
                "The launcher updates itself (never during a game), and only one launcher opens at a time",
                "Your Origins profile, created with your Microsoft account: name, avatar and Origins ID",
                "Your friends live (online, playing Tempest) and your DMs, linked to the in-game chat",
                "“Open on the website” and website sign-in from the bell; Discord is optional",
                "Tickets: open a ticket on the website's Support page; when the team answers, you're notified under the bell",
                "Your profile picture is perfectly round at the top of the Contacts panel",
                "Adjustable game memory, 5 languages (the game follows the launcher's language), tutorial to replay in Settings",
                "Tempest news live on the home page, and “What's new?” after every update"
            ]
        }
    ],

    es: [
        {
            version: "0.7.2", date: "17 DE NOVIEMBRE DE 2026", type: "LAUNCHER", title: "Launcher Update 0.7.2",
            text: "Todo el launcher en un solo lugar: un aspecto nuevo, Mac y Linux, y tu perfil de Origins hasta en la web.",
            changes: [
                "Nuevo diseño Oro y ébano (los demás temas siguen en Ajustes), nuevo logo y nuevo icono",
                "Windows, Mac y Linux: todo está en la página Descargar de la web",
                "Tempest se instala, se actualiza y se inicia en un clic; Java 21 se instala solo si falta, y si el juego no se inicia, el launcher te dice por qué",
                "El launcher se actualiza solo (nunca durante una partida), y solo se abre un launcher a la vez",
                "Tu perfil de Origins, creado con tu cuenta de Microsoft: nombre, avatar y Origins ID",
                "Tus amigos en directo (en línea, jugando a Tempest) y tus MD, conectados al chat del juego",
                "«Abrir en la web» e inicio de sesión en la web desde la campana; Discord es opcional",
                "Tickets: abre un ticket en la página Soporte de la web; cuando el equipo responde, recibes un aviso en la campana",
                "Tu foto de perfil es bien redonda arriba del panel Contactos",
                "Memoria del juego ajustable, 5 idiomas (el juego sigue el idioma del launcher), tutorial para volver a ver en Ajustes",
                "Las noticias de Tempest en directo en el inicio, y «¿Qué hay de nuevo?» tras cada actualización"
            ]
        }
    ],

    de: [
        {
            version: "0.7.2", date: "17. NOVEMBER 2026", type: "LAUNCHER", title: "Launcher Update 0.7.2",
            text: "Der ganze Launcher an einem Ort: ein neuer Look, Mac und Linux und dein Origins-Profil bis auf die Website.",
            changes: [
                "Neues Design Gold und Ebenholz (die anderen Designs bleiben in den Einstellungen), neues Logo und neues Symbol",
                "Windows, Mac und Linux: alles auf der Download-Seite der Website",
                "Tempest installiert, aktualisiert und startet mit einem Klick; Java 21 installiert sich selbst, wenn es fehlt, und startet das Spiel nicht, sagt dir der Launcher warum",
                "Der Launcher aktualisiert sich selbst (nie während einer Partie), und es öffnet sich nur ein Launcher gleichzeitig",
                "Dein Origins-Profil, mit deinem Microsoft-Konto erstellt: Name, Avatar und Origins-ID",
                "Deine Freunde live (online, spielt Tempest) und deine PNs, verbunden mit dem Chat im Spiel",
                "„Auf der Website öffnen“ und die Website-Anmeldung über die Glocke; Discord ist freiwillig",
                "Tickets: Öffne ein Ticket auf der Support-Seite der Website; antwortet das Team, wirst du unter der Glocke benachrichtigt",
                "Dein Profilbild ist oben im Kontakte-Bereich jetzt richtig rund",
                "Einstellbarer Spielspeicher, 5 Sprachen (das Spiel folgt der Sprache des Launchers), Tutorial in den Einstellungen erneut ansehen",
                "Die Tempest-News live auf der Startseite und „Was ist neu?“ nach jedem Update"
            ]
        }
    ],

    pt: [
        {
            version: "0.7.2", date: "17 DE NOVEMBRO DE 2026", type: "LAUNCHER", title: "Launcher Update 0.7.2",
            text: "Todo o launcher num só lugar: um visual novo, Mac e Linux, e o seu perfil Origins até no site.",
            changes: [
                "Novo design Ouro e ébano (os outros temas continuam nas Configurações), novo logo e novo ícone",
                "Windows, Mac e Linux: tudo está na página Baixar do site",
                "O Tempest instala, atualiza e abre com um clique; o Java 21 se instala sozinho se faltar, e se o jogo não abrir, o launcher diz por quê",
                "O launcher se atualiza sozinho (nunca durante uma partida), e só um launcher abre de cada vez",
                "O seu perfil Origins, criado com a sua conta Microsoft: nome, avatar e Origins ID",
                "Seus amigos ao vivo (online, jogando Tempest) e suas DMs, ligados ao chat do jogo",
                "“Abrir no site” e o login no site pelo sino; o Discord é opcional",
                "Tickets: abra um ticket na página Suporte do site; quando a equipe responde, você é avisado no sino",
                "Sua foto de perfil está bem redonda no topo do painel Contatos",
                "Memória do jogo ajustável, 5 idiomas (o jogo segue o idioma do launcher), tutorial para rever nas Configurações",
                "As notícias do Tempest ao vivo no início, e “O que há de novo?” depois de cada atualização"
            ]
        }
    ]
};

// Kept for older code that reads the French history directly.
const updateHistory = updateHistoryI18n.fr;

const newsContent = {

    fr: [
        { version: "0.7.2", type: "NOTES DE MISE À JOUR", title: "Launcher Update 0.7.2", text: "Nouveau look, Mac et Linux, et ton profil Origins jusque sur le site.", date: "VERSION 0.7.2" }
    ],

    en: [
        { version: "0.7.2", type: "PATCH NOTES", title: "Launcher Update 0.7.2", text: "New look, Mac and Linux, and your Origins profile all the way to the website.", date: "VERSION 0.7.2" }
    ],

    es: [
        { version: "0.7.2", type: "NOTAS DEL PARCHE", title: "Launcher Update 0.7.2", text: "Aspecto nuevo, Mac y Linux, y tu perfil de Origins hasta en la web.", date: "VERSIÓN 0.7.2" }
    ],

    de: [
        { version: "0.7.2", type: "PATCH-NOTIZEN", title: "Launcher Update 0.7.2", text: "Neuer Look, Mac und Linux und dein Origins-Profil bis auf die Website.", date: "VERSION 0.7.2" }
    ],

    pt: [
        { version: "0.7.2", type: "NOTAS DA ATUALIZAÇÃO", title: "Launcher Update 0.7.2", text: "Visual novo, Mac e Linux, e o seu perfil Origins até no site.", date: "VERSÃO 0.7.2" }
    ]
};
