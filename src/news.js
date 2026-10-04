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
            version: "0.6.2", date: "4 OCTOBRE 2026", type: "LAUNCHER", title: "Launcher Update 0.6.2",
            text: "Choisis la mémoire du jeu, et laisse les mises à jour et les actus arriver toutes seules.",
            changes: [
                "Nouveau réglage « Mémoire du jeu » dans les Paramètres",
                "Les mises à jour de Tempest s'installent toutes seules, sans redémarrer le launcher",
                "Les nouvelles versions du launcher s'installent et redémarrent toutes seules (jamais pendant une partie)",
                "Les actus du projet arrivent en direct sur l'accueil"
            ]
        },
        {
            version: "0.6.1", date: "29 SEPTEMBRE 2026", type: "LAUNCHER", title: "Launcher Update 0.6.1",
            text: "Nouveau chat en jeu avec tes messages privés, Tempest se lance avec le Java 21 installé sur ton PC, et le launcher arrive sur Linux et Mac.",
            changes: [
                "Nouveau chat en jeu : onglets par conversation, look moderne et heure des messages",
                "Messages privés avec tes amis du launcher directement en jeu, dans les deux sens",
                "Tempest utilise maintenant le Java installé sur ton PC, quelle que soit sa marque (Oracle, Temurin…)",
                "Correction du lancement du jeu pour les joueurs dont Java n’était pas trouvé",
                "Correction de la première installation de Tempest (erreur « Dossier des mods introuvable »)",
                "Premières versions Linux (AppImage, .deb) et Mac (.dmg) du launcher"
            ]
        },
        {
            version: "0.6.0", date: "28 SEPTEMBRE 2026", type: "LAUNCHER", title: "Launcher Update 0.6.0",
            text: "Récap de rattrapage : tout ce qui a changé depuis la v0.5.7 (versions 0.5.8 et 0.6.0).",
            changes: [
                "v0.5.8 — Page Actus remise à jour avec les dernières nouveautés",
                "v0.6.0 — Nouvelle fenêtre « Quoi de neuf ? » au premier lancement après une mise à jour",
                "v0.6.0 — Si tu as raté plusieurs versions, tous les changements sont regroupés au même endroit",
                "v0.6.0 — Les actus sont maintenant toujours à jour à chaque nouvelle version"
            ]
        },
        {
            version: "0.5.7", date: "28 SEPTEMBRE 2026", type: "LAUNCHER", title: "Launcher Update 0.5.7",
            text: "Petites finitions pour une interface plus propre.",
            changes: [
                "Barres de défilement invisibles dans tout le launcher (le défilement fonctionne toujours)",
                "Premières mises à jour livrées avec le nouveau bouton Redémarrer"
            ]
        },
        {
            version: "0.5.5", date: "28 SEPTEMBRE 2026", type: "LAUNCHER", title: "Launcher Update 0.5.5",
            text: "Les mises à jour du launcher arrivent maintenant toutes seules, même s’il reste ouvert.",
            changes: [
                "Le launcher est prévenu dès qu’une nouvelle version sort, même réduit dans la barre des tâches",
                "Un bandeau montre le téléchargement de la mise à jour",
                "Bouton « Redémarrer » pour installer la nouvelle version en un clic",
                "Notification de mise à jour traduite dans ta langue"
            ]
        },
        {
            version: "0.5.4", date: "28 SEPTEMBRE 2026", type: "LAUNCHER", title: "Launcher Update 0.5.4",
            text: "Le launcher parle maintenant 5 langues et t’accueille avec un tutoriel.",
            changes: [
                "Launcher disponible en français, anglais, espagnol, allemand et portugais",
                "Choix de la langue dès la première ouverture, avant la connexion",
                "Tutoriel de découverte à la première connexion (et à revoir dans les Paramètres)",
                "Minecraft se lance dans la même langue que le launcher"
            ]
        },
        {
            version: "0.5.3", date: "28 SEPTEMBRE 2026", type: "LAUNCHER", title: "Launcher Update 0.5.3",
            text: "Le social devient vraiment en direct : messages, statuts et demandes d’amis arrivent instantanément.",
            changes: [
                "Messages privés reçus instantanément, sans recharger",
                "Statut de tes amis en direct : En ligne, Joue à Tempest, Hors ligne",
                "La bulle Contacts affiche le nombre d’amis connectés (et disparaît s’il n’y en a aucun)",
                "Notifications Windows pour les nouveaux messages et demandes d’amis",
                "Clic droit sur un contact : envoyer un message, copier son Origins ID ou le retirer de tes amis"
            ]
        },
        {
            version: "0.5",
            date: "27 SEPTEMBRE 2026",
            type: "LAUNCHER",
            title: "Launcher Update 0.5",
            text: "Les profils Origins et les fonctionnalités sociales arrivent dans le launcher, avec une connexion plus fluide et une meilleure intégration avec Minecraft.",
            changes: [
                "Profils Origins avec pseudo et avatar personnalisables",
                "Origins ID unique affiché sur le profil et copiable facilement",
                "Connexion Microsoft conservée après la première connexion",
                "Contacts et demandes d’amis grâce à la recherche par Origins ID",
                "Messages privés avec fenêtres de conversation déplaçables",
                "Notifications pour les demandes d’amis avec accepter/refuser et compteur",
                "Langue Origins synchronisée avec Minecraft au lancement"
            ]
        },
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
            changes: ["Accueil Origins", "Structure multi-pages", "Premiers panneaux du launcher"]
        },
        {
            version: "0.1",
            date: "PREMIER PROTOTYPE",
            type: "ORIGINS",
            title: "Naissance du launcher",
            text: "Première version locale du launcher Origins.",
            changes: ["Fenêtre Electron", "Navigation initiale", "Base du lancement de jeu"]
        }
    ],

    en: [
        {
            version: "0.6.2", date: "OCTOBER 4, 2026", type: "LAUNCHER", title: "Launcher Update 0.6.2",
            text: "Choose the game memory, and let updates and news arrive on their own.",
            changes: [
                "New “Game memory” setting in Settings",
                "Tempest updates install on their own, no launcher restart needed",
                "New launcher versions install and restart on their own (never during a game)",
                "Project news arrives live on the home page"
            ]
        },
        {
            version: "0.6.1", date: "29 SEPTEMBER 2026", type: "LAUNCHER", title: "Launcher Update 0.6.1",
            text: "A new in-game chat with your private messages, Tempest starts with the Java 21 installed on your computer, and the launcher comes to Linux and Mac.",
            changes: [
                "New in-game chat: a tab per conversation, a modern look and message times",
                "Private messages with your launcher friends right in the game, both ways",
                "Tempest now uses the Java installed on your computer, whatever its vendor (Oracle, Temurin…)",
                "Fixed game launch for players whose Java was not found",
                "Fixed the first installation of Tempest (\"Mods folder not found\" error)",
                "First Linux (AppImage, .deb) and Mac (.dmg) versions of the launcher"
            ]
        },
        {
            version: "0.6.0", date: "28 SEPTEMBER 2026", type: "LAUNCHER", title: "Launcher Update 0.6.0",
            text: "Catch-up recap: everything that changed since v0.5.7 (versions 0.5.8 and 0.6.0).",
            changes: [
                "v0.5.8 — News page updated with the latest changes",
                "v0.6.0 — New “What’s new?” window on the first launch after an update",
                "v0.6.0 — Missed a few versions? All the changes are grouped in one place",
                "v0.6.0 — News is now always up to date with every new version"
            ]
        },
        {
            version: "0.5.7", date: "28 SEPTEMBER 2026", type: "LAUNCHER", title: "Launcher Update 0.5.7",
            text: "Small touches for a cleaner interface.",
            changes: [
                "Invisible scrollbars across the launcher (scrolling still works)",
                "First updates delivered with the new Restart button"
            ]
        },
        {
            version: "0.5.5", date: "28 SEPTEMBER 2026", type: "LAUNCHER", title: "Launcher Update 0.5.5",
            text: "Launcher updates now arrive on their own, even when it stays open.",
            changes: [
                "The launcher is notified as soon as a new version is released, even when minimized to the tray",
                "A banner shows the update download",
                "“Restart” button to install the new version in one click",
                "Update notification translated into your language"
            ]
        },
        {
            version: "0.5.4", date: "28 SEPTEMBER 2026", type: "LAUNCHER", title: "Launcher Update 0.5.4",
            text: "The launcher now speaks 5 languages and welcomes you with a tutorial.",
            changes: [
                "Launcher available in English, French, Spanish, German and Portuguese",
                "Choose your language on first launch, before signing in",
                "Discovery tutorial on first sign-in (replayable from Settings)",
                "Minecraft starts in the same language as the launcher"
            ]
        },
        {
            version: "0.5.3", date: "28 SEPTEMBER 2026", type: "LAUNCHER", title: "Launcher Update 0.5.3",
            text: "Social features are now truly live: messages, statuses and friend requests arrive instantly.",
            changes: [
                "Private messages received instantly, no reload needed",
                "Live friend status: Online, Playing Tempest, Offline",
                "The Contacts bubble shows how many friends are online (and hides when none are)",
                "Windows notifications for new messages and friend requests",
                "Right-click a contact to message them, copy their Origins ID or remove them"
            ]
        },
        {
            version: "0.5", date: "27 SEPTEMBER 2026", type: "LAUNCHER", title: "Launcher Update 0.5",
            text: "Origins profiles and social features arrive in the launcher, with a smoother sign-in experience and better Minecraft integration.",
            changes: ["Origins profiles with customizable display name and avatar", "Unique Origins ID displayed on the profile and easy to copy", "Microsoft sign-in kept after the first connection", "Contacts and friend requests through Origins ID search", "Private messages with movable conversation windows", "Friend-request notifications with accept/decline actions and a counter", "Origins language synchronized with Minecraft at launch"]
        },
        {
            version: "0.4", date: "22 SEPTEMBER 2026", type: "LAUNCHER", title: "Launcher Update 0.4",
            text: "A new Origins visual direction, improved navigation and the first social features.",
            changes: ["New blue Origins visual identity", "New navigation dock", "Friends and private messages interface", "Online presence and game status", "Detection of Tempest while running"]
        },
        {
            version: "0.3", date: "DEVELOPMENT", type: "TEMPEST ORIGINS", title: "Development Update",
            text: "First integration of Tempest Origins into the launcher and improvements to the launch flow.",
            changes: ["Dedicated Tempest Origins page", "Install and launch from the launcher", "Game language management"]
        },
        {
            version: "0.2", date: "PROTOTYPE", type: "ORIGINS", title: "Origins Network Arrives",
            text: "The first foundations of the Origins ecosystem are now in place.",
            changes: ["Origins home", "Multi-page structure", "First launcher panels"]
        },
        {
            version: "0.1", date: "FIRST PROTOTYPE", type: "ORIGINS", title: "The Launcher Begins",
            text: "First local version of Origins Launcher.",
            changes: ["Electron window", "Initial navigation", "Game launch foundation"]
        }
    ],

    es: [
        {
            version: "0.6.2", date: "4 DE OCTUBRE DE 2026", type: "LAUNCHER", title: "Launcher Update 0.6.2",
            text: "Elige la memoria del juego y deja que las actualizaciones y las noticias lleguen solas.",
            changes: [
                "Nuevo ajuste «Memoria del juego» en los Ajustes",
                "Las actualizaciones de Tempest se instalan solas, sin reiniciar el launcher",
                "Las nuevas versiones del launcher se instalan y se reinician solas (nunca durante una partida)",
                "Las noticias del proyecto llegan en directo a la página de inicio"
            ]
        },
        {
            version: "0.6.1", date: "29 DE SEPTIEMBRE DE 2026", type: "LAUNCHER", title: "Launcher Update 0.6.1",
            text: "Nuevo chat en el juego con tus mensajes privados, Tempest se inicia con el Java 21 instalado en tu equipo, y el launcher llega a Linux y Mac.",
            changes: [
                "Nuevo chat en el juego: una pestaña por conversación, aspecto moderno y hora de los mensajes",
                "Mensajes privados con tus amigos del launcher directamente en el juego, en ambos sentidos",
                "Tempest ahora usa el Java instalado en tu equipo, sea cual sea su marca (Oracle, Temurin…)",
                "Corregido el inicio del juego para los jugadores cuyo Java no se encontraba",
                "Corregida la primera instalación de Tempest (error «Carpeta de mods no encontrada»)",
                "Primeras versiones del launcher para Linux (AppImage, .deb) y Mac (.dmg)"
            ]
        },
        {
            version: "0.6.0", date: "28 DE SEPTIEMBRE DE 2026", type: "LAUNCHER", title: "Launcher Update 0.6.0",
            text: "Resumen para ponerse al día: todo lo que ha cambiado desde la v0.5.7 (versiones 0.5.8 y 0.6.0).",
            changes: [
                "v0.5.8 — Página de noticias actualizada con las últimas novedades",
                "v0.6.0 — Nueva ventana «¿Qué hay de nuevo?» al abrirlo tras una actualización",
                "v0.6.0 — ¿Te perdiste varias versiones? Todos los cambios aparecen juntos",
                "v0.6.0 — Las noticias ahora están siempre al día con cada nueva versión"
            ]
        },
        {
            version: "0.5.7", date: "28 DE SEPTIEMBRE DE 2026", type: "LAUNCHER", title: "Launcher Update 0.5.7",
            text: "Pequeños retoques para una interfaz más limpia.",
            changes: [
                "Barras de desplazamiento invisibles en todo el launcher (el desplazamiento sigue funcionando)",
                "Primeras actualizaciones entregadas con el nuevo botón Reiniciar"
            ]
        },
        {
            version: "0.5.5", date: "28 DE SEPTIEMBRE DE 2026", type: "LAUNCHER", title: "Launcher Update 0.5.5",
            text: "Las actualizaciones del launcher llegan solas, aunque se quede abierto.",
            changes: [
                "El launcher recibe un aviso en cuanto sale una nueva versión, incluso minimizado en la bandeja",
                "Un aviso muestra la descarga de la actualización",
                "Botón «Reiniciar» para instalar la nueva versión con un clic",
                "Notificación de actualización traducida a tu idioma"
            ]
        },
        {
            version: "0.5.4", date: "28 DE SEPTIEMBRE DE 2026", type: "LAUNCHER", title: "Launcher Update 0.5.4",
            text: "El launcher ahora habla 5 idiomas y te recibe con un tutorial.",
            changes: [
                "Launcher disponible en español, inglés, francés, alemán y portugués",
                "Elige tu idioma al abrirlo por primera vez, antes de iniciar sesión",
                "Tutorial de bienvenida en el primer inicio de sesión (se puede repetir desde Ajustes)",
                "Minecraft se inicia en el mismo idioma que el launcher"
            ]
        },
        {
            version: "0.5.3", date: "28 DE SEPTIEMBRE DE 2026", type: "LAUNCHER", title: "Launcher Update 0.5.3",
            text: "Las funciones sociales ahora son realmente en directo: mensajes, estados y solicitudes de amistad llegan al instante.",
            changes: [
                "Mensajes privados recibidos al instante, sin recargar",
                "Estado de tus amigos en directo: En línea, Jugando a Tempest, Desconectado",
                "La burbuja de Contactos muestra cuántos amigos están conectados (y desaparece si no hay ninguno)",
                "Notificaciones de Windows para nuevos mensajes y solicitudes de amistad",
                "Clic derecho en un contacto: enviarle un mensaje, copiar su Origins ID o eliminarlo de tus amigos"
            ]
        },
        {
            version: "0.5", date: "27 DE SEPTIEMBRE DE 2026", type: "LAUNCHER", title: "Launcher Update 0.5",
            text: "Los perfiles Origins y las funciones sociales llegan al launcher, con un inicio de sesión más fluido y mejor integración con Minecraft.",
            changes: ["Perfiles Origins con nombre y avatar personalizables", "Origins ID único visible en el perfil y fácil de copiar", "Sesión de Microsoft conservada tras el primer inicio", "Contactos y solicitudes de amistad mediante búsqueda por Origins ID", "Mensajes privados con ventanas de conversación movibles", "Notificaciones de solicitudes de amistad con aceptar/rechazar y contador", "Idioma de Origins sincronizado con Minecraft al iniciar"]
        },
        {
            version: "0.4", date: "22 DE SEPTIEMBRE DE 2026", type: "LAUNCHER", title: "Launcher Update 0.4",
            text: "Nueva dirección visual de Origins, navegación mejorada y primeras funciones sociales.",
            changes: ["Nueva identidad visual azul de Origins", "Nueva barra de navegación", "Ventana de amigos y mensajes privados", "Presencia en línea y estado de juego", "Detección de Tempest en ejecución"]
        },
        {
            version: "0.3", date: "DESARROLLO", type: "TEMPEST ORIGINS", title: "Estado del desarrollo",
            text: "Primera integración de Tempest Origins en el launcher y mejoras en el inicio del juego.",
            changes: ["Página dedicada a Tempest Origins", "Instalación e inicio desde el launcher", "Gestión del idioma del juego"]
        },
        {
            version: "0.2", date: "PROTOTIPO", type: "ORIGINS", title: "Llega la red Origins",
            text: "Las primeras bases del ecosistema Origins ya están listas.",
            changes: ["Inicio de Origins", "Estructura de varias páginas", "Primeros paneles del launcher"]
        },
        {
            version: "0.1", date: "PRIMER PROTOTIPO", type: "ORIGINS", title: "Nace el launcher",
            text: "Primera versión local de Origins Launcher.",
            changes: ["Ventana Electron", "Navegación inicial", "Base para iniciar el juego"]
        }
    ],

    de: [
        {
            version: "0.6.2", date: "4. OKTOBER 2026", type: "LAUNCHER", title: "Launcher Update 0.6.2",
            text: "Wähle den Spielspeicher und lass Updates und News von selbst kommen.",
            changes: [
                "Neue Einstellung „Spielspeicher“ in den Einstellungen",
                "Tempest-Updates installieren sich selbst, ohne Neustart des Launchers",
                "Neue Launcher-Versionen installieren sich und starten selbst neu (nie während eines Spiels)",
                "Projekt-News kommen live auf die Startseite"
            ]
        },
        {
            version: "0.6.1", date: "29. SEPTEMBER 2026", type: "LAUNCHER", title: "Launcher Update 0.6.1",
            text: "Neuer Chat im Spiel mit deinen privaten Nachrichten, Tempest startet mit dem auf deinem Computer installierten Java 21, und der Launcher kommt auf Linux und Mac.",
            changes: [
                "Neuer Chat im Spiel: ein Tab pro Unterhaltung, modernes Aussehen und Uhrzeit der Nachrichten",
                "Private Nachrichten mit deinen Launcher-Freunden direkt im Spiel, in beide Richtungen",
                "Tempest nutzt jetzt das auf deinem Computer installierte Java, egal von welchem Anbieter (Oracle, Temurin…)",
                "Spielstart für Spieler behoben, deren Java nicht gefunden wurde",
                "Erste Installation von Tempest behoben (Fehler „Mod-Ordner nicht gefunden“)",
                "Erste Linux- (AppImage, .deb) und Mac-Versionen (.dmg) des Launchers"
            ]
        },
        {
            version: "0.6.0", date: "28. SEPTEMBER 2026", type: "LAUNCHER", title: "Launcher Update 0.6.0",
            text: "Nachhol-Zusammenfassung: alles, was sich seit v0.5.7 geändert hat (Versionen 0.5.8 und 0.6.0).",
            changes: [
                "v0.5.8 — News-Seite mit den neuesten Änderungen aktualisiert",
                "v0.6.0 — Neues Fenster „Was ist neu?“ beim ersten Start nach einem Update",
                "v0.6.0 — Mehrere Versionen verpasst? Alle Änderungen stehen gesammelt an einem Ort",
                "v0.6.0 — Die News sind jetzt bei jeder neuen Version aktuell"
            ]
        },
        {
            version: "0.5.7", date: "28. SEPTEMBER 2026", type: "LAUNCHER", title: "Launcher Update 0.5.7",
            text: "Kleine Verbesserungen für eine aufgeräumtere Oberfläche.",
            changes: [
                "Unsichtbare Scrollleisten im ganzen Launcher (Scrollen funktioniert weiterhin)",
                "Erste Updates mit dem neuen Neustart-Button ausgeliefert"
            ]
        },
        {
            version: "0.5.5", date: "28. SEPTEMBER 2026", type: "LAUNCHER", title: "Launcher Update 0.5.5",
            text: "Launcher-Updates kommen jetzt von selbst, auch wenn er geöffnet bleibt.",
            changes: [
                "Der Launcher wird benachrichtigt, sobald eine neue Version erscheint, auch minimiert in der Taskleiste",
                "Ein Banner zeigt den Download des Updates",
                "„Neu starten“-Button, um die neue Version mit einem Klick zu installieren",
                "Update-Benachrichtigung in deiner Sprache"
            ]
        },
        {
            version: "0.5.4", date: "28. SEPTEMBER 2026", type: "LAUNCHER", title: "Launcher Update 0.5.4",
            text: "Der Launcher spricht jetzt 5 Sprachen und begrüßt dich mit einem Tutorial.",
            changes: [
                "Launcher auf Deutsch, Englisch, Französisch, Spanisch und Portugiesisch verfügbar",
                "Sprachauswahl beim ersten Start, noch vor der Anmeldung",
                "Einführungs-Tutorial bei der ersten Anmeldung (in den Einstellungen wiederholbar)",
                "Minecraft startet in derselben Sprache wie der Launcher"
            ]
        },
        {
            version: "0.5.3", date: "28. SEPTEMBER 2026", type: "LAUNCHER", title: "Launcher Update 0.5.3",
            text: "Die sozialen Funktionen sind jetzt wirklich live: Nachrichten, Status und Freundschaftsanfragen kommen sofort an.",
            changes: [
                "Private Nachrichten kommen sofort an, ohne Neuladen",
                "Live-Status deiner Freunde: Online, Spielt Tempest, Offline",
                "Die Kontakte-Blase zeigt, wie viele Freunde online sind (und verschwindet, wenn keiner online ist)",
                "Windows-Benachrichtigungen für neue Nachrichten und Freundschaftsanfragen",
                "Rechtsklick auf einen Kontakt: Nachricht senden, Origins ID kopieren oder aus den Freunden entfernen"
            ]
        },
        {
            version: "0.5", date: "27. SEPTEMBER 2026", type: "LAUNCHER", title: "Launcher Update 0.5",
            text: "Origins-Profile und soziale Funktionen kommen in den Launcher, mit einer einfacheren Anmeldung und besserer Minecraft-Integration.",
            changes: ["Origins-Profile mit anpassbarem Namen und Avatar", "Eindeutige Origins ID im Profil, einfach zu kopieren", "Microsoft-Anmeldung bleibt nach dem ersten Mal erhalten", "Kontakte und Freundschaftsanfragen über die Suche per Origins ID", "Private Nachrichten in verschiebbaren Fenstern", "Benachrichtigungen für Freundschaftsanfragen mit Annehmen/Ablehnen und Zähler", "Origins-Sprache beim Start mit Minecraft synchronisiert"]
        },
        {
            version: "0.4", date: "22. SEPTEMBER 2026", type: "LAUNCHER", title: "Launcher Update 0.4",
            text: "Neuer Origins-Look, verbesserte Navigation und die ersten sozialen Funktionen.",
            changes: ["Neue blaue Origins-Optik", "Neue Navigationsleiste", "Freunde- und Nachrichtenfenster", "Online-Status und Spielstatus", "Erkennung von laufendem Tempest"]
        },
        {
            version: "0.3", date: "ENTWICKLUNG", type: "TEMPEST ORIGINS", title: "Entwicklungs-Update",
            text: "Erste Integration von Tempest Origins in den Launcher und ein verbesserter Spielstart.",
            changes: ["Eigene Seite für Tempest Origins", "Installation und Start aus dem Launcher", "Verwaltung der Spielsprache"]
        },
        {
            version: "0.2", date: "PROTOTYP", type: "ORIGINS", title: "Das Origins-Netzwerk kommt",
            text: "Die ersten Grundlagen des Origins-Ökosystems stehen.",
            changes: ["Origins-Startseite", "Mehrseitige Struktur", "Erste Launcher-Fenster"]
        },
        {
            version: "0.1", date: "ERSTER PROTOTYP", type: "ORIGINS", title: "Der Launcher entsteht",
            text: "Erste lokale Version von Origins Launcher.",
            changes: ["Electron-Fenster", "Erste Navigation", "Grundlage für den Spielstart"]
        }
    ],

    pt: [
        {
            version: "0.6.2", date: "4 DE OUTUBRO DE 2026", type: "LAUNCHER", title: "Launcher Update 0.6.2",
            text: "Escolha a memória do jogo e deixe as atualizações e as novidades chegarem sozinhas.",
            changes: [
                "Nova opção “Memória do jogo” nas Configurações",
                "As atualizações do Tempest se instalam sozinhas, sem reiniciar o launcher",
                "Novas versões do launcher se instalam e reiniciam sozinhas (nunca durante uma partida)",
                "As novidades do projeto chegam ao vivo na página inicial"
            ]
        },
        {
            version: "0.6.1", date: "29 DE SETEMBRO DE 2026", type: "LAUNCHER", title: "Launcher Update 0.6.1",
            text: "Novo chat no jogo com suas mensagens privadas, Tempest inicia com o Java 21 instalado no seu computador, e o launcher chega ao Linux e Mac.",
            changes: [
                "Novo chat no jogo: uma aba por conversa, visual moderno e horário das mensagens",
                "Mensagens privadas com seus amigos do launcher direto no jogo, nos dois sentidos",
                "Tempest agora usa o Java instalado no seu computador, seja qual for a marca (Oracle, Temurin…)",
                "Corrigida a inicialização do jogo para jogadores cujo Java não era encontrado",
                "Corrigida a primeira instalação do Tempest (erro “Pasta de mods não encontrada”)",
                "Primeiras versões do launcher para Linux (AppImage, .deb) e Mac (.dmg)"
            ]
        },
        {
            version: "0.6.0", date: "28 DE SETEMBRO DE 2026", type: "LAUNCHER", title: "Launcher Update 0.6.0",
            text: "Resumo para colocar em dia: tudo o que mudou desde a v0.5.7 (versões 0.5.8 e 0.6.0).",
            changes: [
                "v0.5.8 — Página de notícias atualizada com as últimas novidades",
                "v0.6.0 — Nova janela “O que há de novo?” na primeira abertura após uma atualização",
                "v0.6.0 — Perdeu algumas versões? Todas as mudanças aparecem juntas",
                "v0.6.0 — As notícias agora ficam sempre em dia a cada nova versão"
            ]
        },
        {
            version: "0.5.7", date: "28 DE SETEMBRO DE 2026", type: "LAUNCHER", title: "Launcher Update 0.5.7",
            text: "Pequenos ajustes para uma interface mais limpa.",
            changes: [
                "Barras de rolagem invisíveis em todo o launcher (a rolagem continua funcionando)",
                "Primeiras atualizações entregues com o novo botão Reiniciar"
            ]
        },
        {
            version: "0.5.5", date: "28 DE SETEMBRO DE 2026", type: "LAUNCHER", title: "Launcher Update 0.5.5",
            text: "As atualizações do launcher agora chegam sozinhas, mesmo com ele aberto.",
            changes: [
                "O launcher é avisado assim que sai uma nova versão, mesmo minimizado na bandeja",
                "Um aviso mostra o download da atualização",
                "Botão “Reiniciar” para instalar a nova versão com um clique",
                "Notificação de atualização traduzida para o seu idioma"
            ]
        },
        {
            version: "0.5.4", date: "28 DE SETEMBRO DE 2026", type: "LAUNCHER", title: "Launcher Update 0.5.4",
            text: "O launcher agora fala 5 idiomas e recebe você com um tutorial.",
            changes: [
                "Launcher disponível em português, inglês, francês, espanhol e alemão",
                "Escolha do idioma na primeira abertura, antes de entrar",
                "Tutorial de boas-vindas no primeiro login (pode ser revisto nas Configurações)",
                "O Minecraft inicia no mesmo idioma do launcher"
            ]
        },
        {
            version: "0.5.3", date: "28 DE SETEMBRO DE 2026", type: "LAUNCHER", title: "Launcher Update 0.5.3",
            text: "As funções sociais agora são realmente ao vivo: mensagens, status e pedidos de amizade chegam na hora.",
            changes: [
                "Mensagens privadas recebidas na hora, sem recarregar",
                "Status dos amigos ao vivo: Online, Jogando Tempest, Offline",
                "A bolha de Contatos mostra quantos amigos estão online (e some quando não há nenhum)",
                "Notificações do Windows para novas mensagens e pedidos de amizade",
                "Clique direito em um contato: enviar mensagem, copiar o Origins ID ou remover dos amigos"
            ]
        },
        {
            version: "0.5", date: "27 DE SETEMBRO DE 2026", type: "LAUNCHER", title: "Launcher Update 0.5",
            text: "Os perfis Origins e as funções sociais chegam ao launcher, com um login mais simples e melhor integração com o Minecraft.",
            changes: ["Perfis Origins com nome e avatar personalizáveis", "Origins ID único exibido no perfil e fácil de copiar", "Login da Microsoft mantido após a primeira conexão", "Contatos e pedidos de amizade pela busca por Origins ID", "Mensagens privadas em janelas de conversa móveis", "Notificações de pedidos de amizade com aceitar/recusar e contador", "Idioma do Origins sincronizado com o Minecraft ao iniciar"]
        },
        {
            version: "0.4", date: "22 DE SETEMBRO DE 2026", type: "LAUNCHER", title: "Launcher Update 0.4",
            text: "Novo visual Origins, navegação melhorada e as primeiras funções sociais.",
            changes: ["Nova identidade visual azul do Origins", "Nova barra de navegação", "Janela de amigos e mensagens privadas", "Presença online e status de jogo", "Detecção do Tempest em execução"]
        },
        {
            version: "0.3", date: "DESENVOLVIMENTO", type: "TEMPEST ORIGINS", title: "Atualização do desenvolvimento",
            text: "Primeira integração de Tempest Origins ao launcher e melhorias na inicialização do jogo.",
            changes: ["Página dedicada a Tempest Origins", "Instalação e inicialização pelo launcher", "Gerenciamento do idioma do jogo"]
        },
        {
            version: "0.2", date: "PROTÓTIPO", type: "ORIGINS", title: "Chega a rede Origins",
            text: "As primeiras bases do ecossistema Origins estão prontas.",
            changes: ["Início do Origins", "Estrutura com várias páginas", "Primeiros painéis do launcher"]
        },
        {
            version: "0.1", date: "PRIMEIRO PROTÓTIPO", type: "ORIGINS", title: "Nasce o launcher",
            text: "Primeira versão local do Origins Launcher.",
            changes: ["Janela Electron", "Navegação inicial", "Base para iniciar o jogo"]
        }
    ]
};

// Kept for older code that reads the French history directly.
const updateHistory = updateHistoryI18n.fr;

const newsContent = {

    fr: [
        { version: "0.6.2", type: "NOTES DE MISE À JOUR", title: "Launcher Update 0.6.2", text: "Mémoire du jeu réglable, mises à jour et actus qui arrivent toutes seules.", date: "VERSION 0.6.2" },
        { version: "0.6.1", type: "NOTES DE MISE À JOUR", title: "Launcher Update 0.6.1", text: "Nouveau chat en jeu et MP avec tes amis du launcher, directement en jeu.", date: "VERSION 0.6.1" },
        { version: "0.6.0", type: "NOTES DE MISE À JOUR", title: "Launcher Update 0.6.0", text: "Rattrapage depuis la v0.5.7 : actus à jour et fenêtre « Quoi de neuf ? ».", date: "VERSION 0.6.0" },
        { version: "0.5.7", type: "NOTES DE MISE À JOUR", title: "Launcher Update 0.5.7", text: "Interface plus épurée : barres de défilement invisibles.", date: "VERSION 0.5.7" },
        { version: "0.5.5", type: "NOTES DE MISE À JOUR", title: "Launcher Update 0.5.5", text: "Mises à jour automatiques plus fiables, avec un bouton Redémarrer.", date: "VERSION 0.5.5" },
        { version: "0.5.4", type: "NOTES DE MISE À JOUR", title: "Launcher Update 0.5.4", text: "5 langues au choix et un tutoriel pour bien démarrer.", date: "VERSION 0.5.4" },
        { version: "0.5.3", type: "NOTES DE MISE À JOUR", title: "Launcher Update 0.5.3", text: "Messages et statuts d’amis en direct, notifications Windows, retrait d’amis.", date: "VERSION 0.5.3" },
        { version: "0.5", type: "NOTES DE MISE À JOUR", title: "Launcher Update 0.5", text: "Les profils Origins et les fonctionnalités sociales arrivent dans le launcher : Origins ID, contacts, messages privés et notifications.", date: "VERSION 0.5" },
        { type: "TEMPEST ORIGINS", title: "Point sur le développement", text: "Suis les premières étapes de Tempest Origins et l'évolution du projet.", date: "DÉVELOPPEMENT" },
        { type: "NOTES DE MISE À JOUR", title: "Launcher Update 0.4", text: "Nouvel accueil Origins, navigation entre les pages et premier flux d'actualités local.", date: "VERSION 0.4" }
    ],

    en: [
        { version: "0.6.2", type: "PATCH NOTES", title: "Launcher Update 0.6.2", text: "Adjustable game memory, updates and news that arrive on their own.", date: "VERSION 0.6.2" },
        { version: "0.6.1", type: "PATCH NOTES", title: "Launcher Update 0.6.1", text: "New in-game chat, and private messages with your launcher friends right in the game.", date: "VERSION 0.6.1" },
        { version: "0.6.0", type: "PATCH NOTES", title: "Launcher Update 0.6.0", text: "Catch-up since v0.5.7: up-to-date news and a “What’s new?” window.", date: "VERSION 0.6.0" },
        { version: "0.5.7", type: "PATCH NOTES", title: "Launcher Update 0.5.7", text: "Cleaner interface: invisible scrollbars.", date: "VERSION 0.5.7" },
        { version: "0.5.5", type: "PATCH NOTES", title: "Launcher Update 0.5.5", text: "More reliable automatic updates, with a Restart button.", date: "VERSION 0.5.5" },
        { version: "0.5.4", type: "PATCH NOTES", title: "Launcher Update 0.5.4", text: "5 languages to choose from and a tutorial to get started.", date: "VERSION 0.5.4" },
        { version: "0.5.3", type: "PATCH NOTES", title: "Launcher Update 0.5.3", text: "Live messages and friend status, Windows notifications, friend removal.", date: "VERSION 0.5.3" },
        { version: "0.5", type: "PATCH NOTES", title: "Launcher Update 0.5", text: "Origins profiles and social features arrive in the launcher: Origins ID, contacts, private messages and notifications.", date: "VERSION 0.5" },
        { type: "TEMPEST ORIGINS", title: "Development Update", text: "Follow the first steps of Tempest Origins and the evolution of the project.", date: "DEVELOPMENT" },
        { type: "PATCH NOTES", title: "Launcher Update 0.4", text: "A new Origins home page, page navigation and a first local news feed.", date: "VERSION 0.4" }
    ],

    es: [
        { version: "0.6.2", type: "NOTAS DEL PARCHE", title: "Launcher Update 0.6.2", text: "Memoria del juego ajustable, actualizaciones y noticias que llegan solas.", date: "VERSION 0.6.2" },
        { version: "0.6.1", type: "NOTAS DEL PARCHE", title: "Launcher Update 0.6.1", text: "Nuevo chat en el juego y mensajes privados con tus amigos del launcher, directamente en el juego.", date: "VERSIÓN 0.6.1" },
        { version: "0.6.0", type: "NOTAS DEL PARCHE", title: "Launcher Update 0.6.0", text: "Al día desde la v0.5.7: noticias actualizadas y ventana «¿Qué hay de nuevo?».", date: "VERSIÓN 0.6.0" },
        { version: "0.5.7", type: "NOTAS DEL PARCHE", title: "Launcher Update 0.5.7", text: "Interfaz más limpia: barras de desplazamiento invisibles.", date: "VERSIÓN 0.5.7" },
        { version: "0.5.5", type: "NOTAS DEL PARCHE", title: "Launcher Update 0.5.5", text: "Actualizaciones automáticas más fiables, con un botón Reiniciar.", date: "VERSIÓN 0.5.5" },
        { version: "0.5.4", type: "NOTAS DEL PARCHE", title: "Launcher Update 0.5.4", text: "5 idiomas a elegir y un tutorial para empezar.", date: "VERSIÓN 0.5.4" },
        { version: "0.5.3", type: "NOTAS DEL PARCHE", title: "Launcher Update 0.5.3", text: "Mensajes y estado de amigos en directo, notificaciones de Windows, eliminar amigos.", date: "VERSIÓN 0.5.3" },
        { version: "0.5", type: "NOTAS DEL PARCHE", title: "Launcher Update 0.5", text: "Los perfiles Origins y las funciones sociales llegan al launcher: Origins ID, contactos, mensajes privados y notificaciones.", date: "VERSIÓN 0.5" },
        { type: "TEMPEST ORIGINS", title: "Estado del desarrollo", text: "Sigue los primeros pasos de Tempest Origins y la evolución del proyecto.", date: "DESARROLLO" },
        { type: "NOTAS DEL PARCHE", title: "Launcher Update 0.4", text: "Nuevo inicio de Origins, navegación entre páginas y primer feed de noticias.", date: "VERSIÓN 0.4" }
    ],

    de: [
        { version: "0.6.2", type: "PATCH-NOTIZEN", title: "Launcher Update 0.6.2", text: "Einstellbarer Spielspeicher, Updates und News, die von selbst kommen.", date: "VERSION 0.6.2" },
        { version: "0.6.1", type: "PATCHNOTES", title: "Launcher Update 0.6.1", text: "Neuer Chat im Spiel und private Nachrichten mit deinen Launcher-Freunden direkt im Spiel.", date: "VERSION 0.6.1" },
        { version: "0.6.0", type: "PATCHNOTES", title: "Launcher Update 0.6.0", text: "Nachgeholt seit v0.5.7: aktuelle News und Fenster „Was ist neu?“.", date: "VERSION 0.6.0" },
        { version: "0.5.7", type: "PATCHNOTES", title: "Launcher Update 0.5.7", text: "Aufgeräumtere Oberfläche: unsichtbare Scrollleisten.", date: "VERSION 0.5.7" },
        { version: "0.5.5", type: "PATCHNOTES", title: "Launcher Update 0.5.5", text: "Zuverlässigere automatische Updates mit Neustart-Button.", date: "VERSION 0.5.5" },
        { version: "0.5.4", type: "PATCHNOTES", title: "Launcher Update 0.5.4", text: "5 Sprachen zur Auswahl und ein Tutorial für den Einstieg.", date: "VERSION 0.5.4" },
        { version: "0.5.3", type: "PATCHNOTES", title: "Launcher Update 0.5.3", text: "Live-Nachrichten und Freundesstatus, Windows-Benachrichtigungen, Freunde entfernen.", date: "VERSION 0.5.3" },
        { version: "0.5", type: "PATCHNOTES", title: "Launcher Update 0.5", text: "Origins-Profile und soziale Funktionen kommen in den Launcher: Origins ID, Kontakte, private Nachrichten und Benachrichtigungen.", date: "VERSION 0.5" },
        { type: "TEMPEST ORIGINS", title: "Entwicklungs-Update", text: "Verfolge die ersten Schritte von Tempest Origins und die Entwicklung des Projekts.", date: "ENTWICKLUNG" },
        { type: "PATCHNOTES", title: "Launcher Update 0.4", text: "Neue Origins-Startseite, Navigation zwischen den Seiten und ein erster News-Feed.", date: "VERSION 0.4" }
    ],

    pt: [
        { version: "0.6.2", type: "NOTAS DA ATUALIZAÇÃO", title: "Launcher Update 0.6.2", text: "Memória do jogo ajustável, atualizações e novidades que chegam sozinhas.", date: "VERSION 0.6.2" },
        { version: "0.6.1", type: "NOTAS DE ATUALIZAÇÃO", title: "Launcher Update 0.6.1", text: "Novo chat no jogo e mensagens privadas com seus amigos do launcher, direto no jogo.", date: "VERSÃO 0.6.1" },
        { version: "0.6.0", type: "NOTAS DE ATUALIZAÇÃO", title: "Launcher Update 0.6.0", text: "Em dia desde a v0.5.7: notícias atualizadas e janela “O que há de novo?”.", date: "VERSÃO 0.6.0" },
        { version: "0.5.7", type: "NOTAS DE ATUALIZAÇÃO", title: "Launcher Update 0.5.7", text: "Interface mais limpa: barras de rolagem invisíveis.", date: "VERSÃO 0.5.7" },
        { version: "0.5.5", type: "NOTAS DE ATUALIZAÇÃO", title: "Launcher Update 0.5.5", text: "Atualizações automáticas mais confiáveis, com um botão Reiniciar.", date: "VERSÃO 0.5.5" },
        { version: "0.5.4", type: "NOTAS DE ATUALIZAÇÃO", title: "Launcher Update 0.5.4", text: "5 idiomas para escolher e um tutorial para começar.", date: "VERSÃO 0.5.4" },
        { version: "0.5.3", type: "NOTAS DE ATUALIZAÇÃO", title: "Launcher Update 0.5.3", text: "Mensagens e status dos amigos ao vivo, notificações do Windows, remover amigos.", date: "VERSÃO 0.5.3" },
        { version: "0.5", type: "NOTAS DE ATUALIZAÇÃO", title: "Launcher Update 0.5", text: "Os perfis Origins e as funções sociais chegam ao launcher: Origins ID, contatos, mensagens privadas e notificações.", date: "VERSÃO 0.5" },
        { type: "TEMPEST ORIGINS", title: "Atualização do desenvolvimento", text: "Acompanhe os primeiros passos de Tempest Origins e a evolução do projeto.", date: "DESENVOLVIMENTO" },
        { type: "NOTAS DE ATUALIZAÇÃO", title: "Launcher Update 0.4", text: "Novo início do Origins, navegação entre páginas e um primeiro feed de notícias.", date: "VERSÃO 0.4" }
    ]
};
