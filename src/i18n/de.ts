import { getPathSeparator } from "~/i18n";

export default {
  common: {
    close: "Schließen",
    delete: "Löschen",
    cancel: "Abbrechen",
    save: "Speichern",
    edit: "Bearbeiten",
    add: "Hinzufügen",
    remove: "Entfernen",
    loading: "Wird geladen...",
    error: "Fehler",
    success: "Erfolgreich",
    confirm: "Bestätigen",
    download: "Herunterladen",
    path: "Pfad",
    size: "Größe",
    date: "Datum",
    name: "Name",
    type: "Typ",
    actions: "Aktionen",
    search: "Suchen...",
    filter: "Filter",
    apply: "Anwenden",
    reset: "Zurücksetzen",
    selected: "Ausgewählt",
    all: "Alle",
    none: "Keine",
    pathSeparator: getPathSeparator("de"),
    toggleTheme: "Theme umschalten",
    theme: "Theme",
    returnToFrontPage: "Zurück zur Startseite",
    home: "Startseite",
    openSettings: "Einstellungen öffnen",
  },
  settings: {
    title: "Einstellungen",
    appearance: "Erscheinungsbild",
    theme: {
      light: "Hell",
      gray: "Grau",
      dark: "Dunkel",
      banana: "Banane",
      strawberry: "Erdbeere",
      peanut: "Erdnuss",
      christmas: "Weihnachten",
      halloween: "Halloween",
    },
    disableAnimations: "Animationen deaktivieren",
    language: "Sprache",
    disableJapanese: "Japanischen Text deaktivieren",
    modelSettings: "Modell-Einstellungen",
    jtp2ModelPath: "JTP2-Modell-Pfad",
    jtp2TagsPath: "JTP2-Tags-Pfad",
    downloadModel: "Modell herunterladen (1.8GB)",
    downloadTags: "Tags herunterladen (195KB)",
    viewMode: "Ansichtsmodus",
    gridView: "Rasteransicht",
    listView: "Listenansicht",
    sortBy: "Sortieren nach",
    sortByName: "Nach Name sortieren",
    sortByDate: "Nach Datum sortieren",
    sortBySize: "Nach Größe sortieren",
    experimentalFeatures: "Experimentelle Funktionen",
    enableZoom: "Zoom aktivieren",
    enableMinimap: "Minimap beim Zoomen aktivieren",
    instantDelete: "Sofortiges Löschen aktivieren (ohne Bestätigung)",
    warning: "Warnung",
    gallery: "Galerie",
  },
  frontPage: {
    subtitle: {
      1: "大規模言語モデルは不正行為をし、嘘をつき、幻覚を見ます。まるで私のように！",
      2: "私たちは別の祈り方を見つけました",
      3: "虚ろな瞳に映る、無限の宇宙",
      4: "錆びた心、新たな芽吹き",
      5: "夢と現実が交錯する、不思議な境地",
      6: "未知の領域、無限の可能性",
      7: "時の流れを超えた、永遠の愛",
      8: "これで追い出されますよ！",
    },
    imageWork: "Mit Bildern arbeiten",
    audioWork: "Mit Audio arbeiten",
  },
  gallery: {
    addTag: "Tag hinzufügen...",
    addCaption: "Beschriftung hinzufügen...",
    quickJump: "Zum Ordner springen...",
    loadingFolders: "Ordner werden geladen...",
    noResults: "Keine Ergebnisse gefunden",
    folderCount: "{count} Ordner",
    deleteConfirm: "Möchten Sie dieses Bild wirklich löschen?",
    deleteSuccess: "Bild erfolgreich gelöscht",
    deleteError: "Fehler beim Löschen des Bildes",
    savingCaption: "Beschriftung wird gespeichert...",
    savedCaption: "Beschriftung gespeichert",
    errorSavingCaption: "Fehler beim Speichern der Beschriftung",
    emptyFolder: "Dieser Ordner ist leer",
    dropToUpload: "Dateien zum Hochladen hier ablegen",
    uploadProgress: "Lade {count} Dateien hoch...",
    processingImage: "Bild wird verarbeitet...",
    generateTags: "Tags generieren",
    generatingTags: "Tags werden generiert...",
    removeTags: "Tags entfernen",
    createCaption: "Beschriftung erstellen",
    captionTypes: {
      txt: "Neue Textdatei erstellen",
      tags: "Neue .tags-Datei erstellen",
      caption: "Neue .caption-Datei erstellen",
      wd: "Neue .wd-Datei erstellen"
    },
    noCaptionFiles: "Noch keine Beschriftungsdateien!",
  },
  shortcuts: {
    title: "Tastenkombinationen",
    galleryNavigation: "Galerie-Navigation",
    quickFolderSwitch: "Schneller Ordnerwechsel",
    aboveImage: "Bild darüber",
    belowImage: "Bild darunter",
    previousImage: "Vorheriges Bild",
    nextImage: "Nächstes Bild",
    togglePreview: "Vorschau umschalten",
    tagNavigation: "Tag-Navigation",
    previousTag: "Vorheriger Tag",
    nextTag: "Nächster Tag",
    switchTagBubble: "Zu Tag-Blasen wechseln",
    switchTagInput: "Zu Tag-Eingabe wechseln",
    cycleCaptions: "Durch Beschriftungen blättern",
    firstTagRow: "Erster Tag in der Reihe",
    lastTagRow: "Letzter Tag in der Reihe",
    doubleShift: "Doppel-Shift",
    shift: "Shift",
    del: "Entf",
    removeTag: "Tag entfernen",
    other: "Sonstiges",
    esc: "Esc",
    closePreview: "Vorschau/Modal schließen",
    deleteImage: "Bild löschen",
    toggleImagePreview: "Bildvorschau umschalten",
  },
  imageViewer: {
    zoomIn: "Vergrößern",
    zoomOut: "Verkleinern",
    resetZoom: "Zoom zurücksetzen",
    toggleMinimap: "Minimap umschalten",
    previousImage: "Vorheriges Bild",
    nextImage: "Nächstes Bild",
    copyPath: "Pfad kopieren",
    openInNewTab: "In neuem Tab öffnen",
    fitToScreen: "An Bildschirm anpassen",
    actualSize: "Tatsächliche Größe",
    rotateLeft: "Nach links drehen",
    rotateRight: "Nach rechts drehen",
    downloadImage: "Bild herunterladen",
    imageInfo: "Bildinformationen",
    dimensions: "Abmessungen",
  },
  tools: {
    removeCommas: "Kommas entfernen",
    replaceNewlinesWithCommas: "Zeilenumbrüche durch Kommas ersetzen",
    replaceUnderscoresWithSpaces: "Unterstriche durch Leerzeichen ersetzen",
  },
}; 