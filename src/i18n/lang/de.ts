import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "../types";
import { createPluralTranslation } from "../plurals";

export default {
  common: {
    close: "Schließen",
    delete: "Löschen",
    cancel: "Abbrechen",
    save: "Speichern",
    edit: "Bearbeiten",
    add: "Hinzufügen",
    remove: "Entfernen",
    loading: "Lädt...",
    error: "Fehler",
    success: "Erfolg",
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
    notFound: "404 - Seite nicht gefunden",
    pathSeparator: getPathSeparator("de"),
    toggleTheme: "Theme umschalten",
    theme: "Theme",
    returnToFrontPage: "Zurück zur Startseite",
    home: "Startseite",
    openSettings: "Einstellungen öffnen",
    create: "Erstellen",
    creating: "Wird erstellt...",
    language: "Sprache",
    description: "Beschreibung",
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
      "high-contrast-black": "Hoher Kontrast Schwarz",
      "high-contrast-inverse": "Hoher Kontrast Invertiert",
    },
    disableAnimations: "Animationen deaktivieren",
    disableAnimationsTooltip: "Alle Animationen für bessere Leistung deaktivieren",
    language: "Sprache",
    languageTooltip: "Sprache der Benutzeroberfläche ändern",
    disableNonsense: "Japanischen Text deaktivieren",
    disableNonsenseTooltip: "Japanischen Text und andere unsinnige Elemente ausblenden",
    modelSettings: (params: TranslationParams) => "Modelleinstellungen",
    jtp2ModelPath: "JTP2 Modellpfad",
    jtp2ModelPathTooltip: "Pfad zur JTP2 Modelldatei",
    jtp2TagsPath: "JTP2 Tags-Pfad",
    jtp2TagsPathTooltip: "Pfad zur JTP2 Tags-Datei",
    jtp2Threshold: "JTP2 Tag-Schwellenwert",
    jtp2ThresholdTooltip: "Konfidenzschwellenwert für Tags (0.0 bis 1.0)",
    jtp2ForceCpu: "CPU für JTP2 erzwingen",
    jtp2ForceCpuTooltip: "JTP2 zur CPU-Nutzung statt GPU zwingen",
    wdv3ModelName: "WDv3 Modell",
    wdv3ModelNameTooltip: "WDv3 Modellarchitektur auswählen (ViT, SwinV2 oder ConvNext)",
    wdv3GenThreshold: "Allgemeiner Tag-Schwellenwert",
    wdv3GenThresholdTooltip: "Konfidenzschwellenwert für allgemeine Tags (Standard: 0.35)",
    wdv3CharThreshold: "Charakter-Tag-Schwellenwert",
    wdv3CharThresholdTooltip: "Konfidenzschwellenwert für Charakter-Tags (Standard: 0.75)",
    wdv3ConfigUpdateError: "WDv3-Einstellungen konnten nicht aktualisiert werden",
    wdv3ForceCpu: "WDv3 auf CPU erzwingen",
    wdv3ForceCpuTooltip: "WDv3 zwingen, CPU statt GPU zu verwenden",
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
    enableZoomTooltip: "Zoomen und Verschieben im Bildbetrachter aktivieren",
    enableMinimap: "Minimap beim Zoomen aktivieren",
    enableMinimapTooltip: "Minimap beim Zoomen für einfachere Navigation anzeigen",
    alwaysShowCaptionEditor: "Beschriftungseditor immer anzeigen",
    alwaysShowCaptionEditorTooltip: "Beschriftungseditor immer ausgeklappt lassen",
    instantDelete: "Sofortiges Löschen aktivieren (ohne Bestätigung)",
    instantDeleteTooltip: "Dateien ohne Bestätigungsdialog löschen",
    warning: "Warnung",
    gallery: "Galerie",
    preserveLatents: "Latents beibehalten",
    preserveLatentsTooltip: "Latent-Variablen der Bildgenerierung für spätere Wiederverwendung beibehalten",
    preserveTxt: "TXT-Dateien beibehalten",
    preserveTxtTooltip: "TXT-Dateien mit Generierungseinstellungen beibehalten",
    thumbnailSize: "Vorschaubildgröße",
    thumbnailSizeDescription: "Größe der Vorschaubilder in Pixeln (z.B. 250)",
    thumbnailSizeUpdateError: "Fehler beim Aktualisieren der Vorschaubildgröße",
  },
  gallery: {
    addTag: "Tag hinzufügen",
    addCaption: "Beschriftung hinzufügen",
    quickJump: "Schnellsprung",
    loadingFolders: "Ordner werden geladen...",
    uploadFiles: "Dateien hochladen",
    deleteCurrentFolder: "Aktuellen Ordner löschen",
    noResults: "Keine Ergebnisse",
    pathNotFound: "Pfad nicht gefunden",
    folderCount: createPluralTranslation({
      one: "1 Ordner",
      other: "${count} Ordner"
    }, "de"),
    fileCount: createPluralTranslation({
      one: "1 Datei",
      other: "${count} Dateien"
    }, "de"),
    imageCount: createPluralTranslation({
      one: "1 Bild",
      other: "${count} Bilder"
    }, "de"),
    foundFolders: createPluralTranslation({
      one: "1 Ordner gefunden",
      other: "${count} Ordner gefunden"
    }, "de"),
    deletedCount: createPluralTranslation({
      one: "1 Element gelöscht",
      other: "${count} Elemente gelöscht"
    }, "de"),
    deleteConfirm: (params: TranslationParams) => {
      const name = params.name ?? "dieses Element";
      return `Möchten Sie "${name}" wirklich löschen?`;
    },
    deleteSuccess: "Erfolgreich gelöscht",
    deleteError: (params: TranslationParams) => {
      const name = params.name ?? "Element";
      return `Fehler beim Löschen von "${name}"`;
    },
    savingCaption: (params: TranslationParams) => {
      const name = params.name ?? "Element";
      return `Beschriftung für "${name}" wird gespeichert...`;
    },
    savedCaption: "Beschriftung gespeichert",
    errorSavingCaption: (params: TranslationParams) => {
      const name = params.name ?? "Element";
      return `Fehler beim Speichern der Beschriftung für "${name}"`;
    },
    emptyFolder: "Dieser Ordner ist leer",
    dropToUpload: "Dateien hier ablegen zum Hochladen",
    uploadProgress: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Dateien werden hochgeladen...';
      }
      return createPluralTranslation({
        one: "1 Datei wird hochgeladen...",
        other: "${count} Dateien werden hochgeladen..."
      }, "de")(params);
    },
    uploadProgressPercent: "Upload... {progress}%",
    filesExceedLimit: "Dateien zu groß: {files}",
    noFilesToUpload: "Keine Dateien zum Hochladen",
    processingFiles: "Dateien werden verarbeitet...",
    uploadComplete: "Upload abgeschlossen",
    uploadFailed: "Upload fehlgeschlagen: {error}",
    deletingFiles: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Dateien werden gelöscht...';
      }
      return createPluralTranslation({
        one: "1 Datei wird gelöscht...",
        other: "${count} Dateien werden gelöscht..."
      }, "de")(params);
    },
    deleteComplete: "Löschen abgeschlossen",
    deleteFailed: "Löschen fehlgeschlagen",
    processingImage: (params: TranslationParams) => {
      const name = params.name ?? "Bild";
      return `Bild "${name}" wird verarbeitet...`;
    },
    processingImages: createPluralTranslation({
      one: "1 Bild wird verarbeitet...",
      other: "${count} Bilder werden verarbeitet..."
    }, "de"),
    generatingCaption: "Beschriftung wird generiert...",
    captionGenerated: "Beschriftung generiert",
    generateTags: "Tags generieren",
    generatingTags: "Tags werden generiert...",
    removeTags: "Tags entfernen",
    createCaption: "Beschriftung erstellen",
    captionTypes: {
      txt: "Txt",
      tags: "Tags",
      caption: "Beschriftung",
      wd: "WD",
    },
    noCaptionFiles: "Keine Beschriftungsdateien",
    uploadError: "Upload-Fehler",
    dropOverlay: "Zum Hochladen loslassen",
    selectAll: "Alle auswählen",
    deselectAll: "Alle abwählen",
    deleteSelected: "Ausgewählte löschen",
    confirmMultiDelete: (params: TranslationParams | null | undefined = {}) => {
      if (!params || typeof params !== 'object') {
        return 'Möchten Sie diese Elemente wirklich löschen?';
      }
      const folders = typeof params.folders === 'number' ? params.folders : 0;
      const images = typeof params.images === 'number' ? params.images : 0;

      if (folders === 0 && images === 0) {
        return 'Möchten Sie diese Elemente wirklich löschen?';
      }

      const parts = [];
      if (folders > 0) {
        parts.push(createPluralTranslation({
          one: "1 Ordner",
          other: "${count} Ordner"
        }, "de")({ count: folders }));
      }
      if (images > 0) {
        parts.push(createPluralTranslation({
          one: "1 Bild",
          other: "${count} Bilder"
        }, "de")({ count: images }));
      }
      return `Möchten Sie ${parts.join(" und ")} wirklich löschen?`;
    },
    confirmFolderDelete: (params: TranslationParams) => {
      const name = params.name ?? "Ordner";
      return `Möchten Sie den Ordner "${name}" und seinen gesamten Inhalt wirklich löschen?`;
    },
    someFolderDeletesFailed: "Einige Ordner konnten nicht gelöscht werden",
    folderDeleteError: "Fehler beim Löschen eines oder mehrerer Ordner",
    deletingFile: "Datei wird gelöscht...",
    fileDeleteSuccess: "Datei erfolgreich gelöscht",
    fileDeleteError: "Fehler beim Löschen einer oder mehrerer Dateien",
    createFolder: "Ordner erstellen",
    folderNamePlaceholder: "Ordnername",
    deleteConfirmation: "Löschbestätigung",
    selectedCount: createPluralTranslation({
      one: "1 Element ausgewählt",
      other: "${count} Elemente ausgewählt"
    }, "de"),
    folderLocation: (params: TranslationParams) => {
      const name = params.name ?? "";
      return `Ort: ${name}`;
    },
    moveToFolder: (params: TranslationParams) => {
      const name = params.name ?? "Ordner";
      return `Nach "${name}" verschieben`;
    },
    workWithFolder: (params: TranslationParams) => {
      const name = params.name ?? "Ordner";
      return `Mit "${name}" arbeiten`;
    },
  },
  shortcuts: {
    title: "Tastenkürzel",
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
    switchTagBubble: "Tag-Blase umschalten",
    switchTagInput: "Tag-Eingabe umschalten",
    cycleCaptions: "Beschriftungen durchlaufen",
    firstTagRow: "Erste Tag-Zeile",
    lastTagRow: "Letzte Tag-Zeile",
    doubleShift: "Doppel-Shift",
    shift: "Shift",
    del: "Entf",
    removeTag: "Tag entfernen",
    other: "Sonstiges",
    esc: "Esc",
    closePreview: "Vorschau schließen",
    deleteImage: "Bild löschen",
    toggleImagePreview: "Bildvorschau umschalten",
    copyToClipboard: "In Zwischenablage kopieren",
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
    actualSize: "Originalgröße",
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
    transformations: "Transformationen",
    addTransformation: "Transformation hinzufügen",
    transformationType: "Transformationstyp",
    transformationTypes: {
      searchReplace: "Suchen und Ersetzen",
      case: "Groß-/Kleinschreibung",
      trim: "Kürzen",
      wrap: "Umschließen",
      number: "Nummer"
    },
    caseTypes: {
      upper: "GROSSBUCHSTABEN",
      lower: "kleinbuchstaben",
      title: "Titel Schreibweise",
      sentence: "Satz schreibweise"
    },
    trimTypes: {
      all: "Alle",
      start: "Anfang",
      end: "Ende",
      duplicates: "Duplikate"
    },
    numberActions: {
      remove: "Entfernen",
      format: "Formatieren",
      extract: "Extrahieren"
    },
    numberFormat: "Zahlenformat",
    numberFormatPlaceholder: "Zahlenformat eingeben...",
    prefix: "Präfix",
    suffix: "Suffix",
    prefixPlaceholder: "Präfix eingeben...",
    suffixPlaceholder: "Suffix eingeben...",
    transformationNamePlaceholder: "Name der Transformation",
    transformationDescriptionPlaceholder: "Beschreibung der Transformation",
    searchPattern: "Suchmuster",
    searchPatternPlaceholder: "Suchmuster eingeben...",
    replacement: "Ersetzung",
    replacementPlaceholder: "Ersetzung eingeben...",
    selectIcon: "Symbol auswählen"
  },
  notifications: {
    imageCopied: "Bild kopiert",
    imageCopyFailed: "Kopieren des Bildes fehlgeschlagen",
    folderCreated: "Ordner erstellt",
    folderCreateError: "Fehler beim Erstellen des Ordners",
    generatingCaption: "Beschriftung wird generiert...",
    captionGenerated: "Beschriftung generiert",
    connectionLost: "Verbindung verloren",
    connectionRestored: "Verbindung wiederhergestellt",
  },
} as const satisfies Translations;
