; Origins Launcher : scripts ajoutés à l'installeur NSIS (electron-builder inclut
; build/installer.nsh tout seul).

; Après l'installation ou une mise à jour, on prévient Windows que les icônes ont changé.
; Sans ça, Windows garde l'ancienne icône en cache sur les raccourcis (bureau, menu Démarrer,
; barre des tâches) même quand Origins Launcher.exe a la nouvelle.
; SHCNE_ASSOCCHANGED (0x08000000) + SHCNF_IDLIST (0) : rafraîchit les icônes du shell.
!macro customInstall
  System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0, p 0, p 0)'
!macroend
