import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "../types";
import { createPluralTranslation } from "../plurals";

export default {
  common: {
    close: "Sluiten",
    delete: "Verwijderen",
    cancel: "Annuleren",
    save: "Opslaan",
    edit: "Bewerken",
    add: "Toevoegen",
    remove: "Verwijderen",
    loading: "Laden...",
    error: "Fout",
    success: "Succes",
    confirm: "Bevestigen",
    download: "Downloaden",
    path: "Pad",
    size: "Grootte",
    date: "Datum",
    name: "Naam",
    type: "Type",
    actions: "Acties",
    search: "Zoeken...",
    filter: "Filter",
    apply: "Toepassen",
    reset: "Herstellen",
    selected: "Geselecteerd",
    all: "Alles",
    none: "Geen",
    pathSeparator: getPathSeparator("nl"),
    toggleTheme: "Thema wisselen",
    theme: "Thema",
    returnToFrontPage: "Terug naar startpagina",
    home: "Home",
    openSettings: "Instellingen openen",
    create: "Aanmaken",
    creating: "Aanmaken...",
    language: "Taal",
    description: "Beschrijving",
  },
  settings: {
    title: "Instellingen",
    appearance: "Uiterlijk",
    theme: {
      light: "Licht",
      gray: "Grijs",
      dark: "Donker",
      banana: "Banaan",
      strawberry: "Aardbei",
      peanut: "Pinda",
      christmas: "Kerst",
      halloween: "Halloween",
      "high-contrast-black": "Hoog contrast zwart",
      "high-contrast-inverse": "Hoog contrast omgekeerd",
    },
    disableAnimations: "Animaties uitschakelen",
    disableAnimationsTooltip: "Alle animaties uitschakelen voor betere prestaties",
    language: "Taal",
    languageTooltip: "Verander de taal van de interface",
    disableNonsense: "Japanse tekst uitschakelen",
    disableNonsenseTooltip: "Verberg Japanse tekst en andere zinloze elementen",
    modelSettings: (params: TranslationParams) => "Modelinstellingen",
    jtp2ModelPath: "JTP2 Model Pad",
    jtp2ModelPathTooltip: "Pad naar het JTP2 model bestand",
    jtp2TagsPath: "JTP2 Tags Pad",
    jtp2TagsPathTooltip: "Pad naar het JTP2 tags bestand",
    jtp2Threshold: "JTP2 Drempelwaarde",
    jtp2ThresholdTooltip: "Drempelwaarde voor JTP2 tag detectie",
    jtp2ForceCpu: "JTP2 CPU Forceren",
    jtp2ForceCpuTooltip: "Forceer CPU gebruik voor JTP2",
    downloadModel: "Download Model",
    downloadTags: "Download Tags",
    viewMode: "Weergavemodus",
    gridView: "Rasterweergave",
    listView: "Lijstweergave",
    sortBy: "Sorteren op",
    sortByName: "Sorteren op naam",
    sortByDate: "Sorteren op datum",
    sortBySize: "Sorteren op grootte",
    experimentalFeatures: "Experimentele functies",
    enableZoom: "Zoom inschakelen",
    enableZoomTooltip: "Zoom en verplaatsing in de afbeeldingsviewer inschakelen",
    enableMinimap: "Minimap inschakelen",
    enableMinimapTooltip: "Toon minimap tijdens zoomen voor eenvoudigere navigatie",
    alwaysShowCaptionEditor: "Bijschrifteditor altijd tonen",
    alwaysShowCaptionEditorTooltip: "Houd de bijschrifteditor altijd uitgeklapt",
    instantDelete: "Direct verwijderen",
    instantDeleteTooltip: "Verwijder bestanden zonder bevestigingsdialoog",
    warning: "Waarschuwing",
    gallery: "Galerij",
    preserveLatents: "Latente variabelen behouden",
    preserveLatentsTooltip: "Behoud latente variabelen van afbeeldingsgeneratie voor later hergebruik",
    preserveTxt: "TXT-bestanden behouden",
    preserveTxtTooltip: "Behoud TXT-bestanden met generatie-instellingen",
    thumbnailSize: "Miniatuurgrootte",
    thumbnailSizeDescription: "Grootte van miniaturen in pixels (bijv. 250)",
    thumbnailSizeUpdateError: "Fout bij bijwerken van miniatuurgrootte",
    wdv3ModelName: "WDv3 Model",
    wdv3ModelNameTooltip: "Selecteer het WDv3 model type",
    wdv3GenThreshold: "WDv3 Algemene Drempelwaarde",
    wdv3GenThresholdTooltip: "Drempelwaarde voor algemene tag detectie",
    wdv3CharThreshold: "WDv3 Karakter Drempelwaarde",
    wdv3CharThresholdTooltip: "Drempelwaarde voor karakter tag detectie",
    wdv3ForceCpu: "WDv3 CPU Forceren",
    wdv3ForceCpuTooltip: "Forceer CPU gebruik voor WDv3",
    wdv3ConfigUpdateError: "Fout bij bijwerken van WDv3 configuratie",
  },
  gallery: {
    addTag: "Tag toevoegen",
    addCaption: "Bijschrift toevoegen",
    quickJump: "Snel springen",
    loadingFolders: "Mappen laden...",
    noResults: "Geen resultaten",
    folderCount: createPluralTranslation({
      one: "1 map",
      other: "${count} mappen"
    }, "nl"),
    fileCount: createPluralTranslation({
      one: "1 bestand",
      other: "${count} bestanden"
    }, "nl"),
    imageCount: createPluralTranslation({
      one: "1 afbeelding",
      other: "${count} afbeeldingen"
    }, "nl"),
    foundFolders: createPluralTranslation({
      one: "1 map gevonden",
      other: "${count} mappen gevonden"
    }, "nl"),
    deletedCount: createPluralTranslation({
      one: "1 item verwijderd",
      other: "${count} items verwijderd"
    }, "nl"),
    deleteConfirm: (params: TranslationParams) => {
      const name = params.name ?? "dit item";
      return `Weet je zeker dat je "${name}" wilt verwijderen?`;
    },
    deleteSuccess: "Succesvol verwijderd",
    deleteError: (params: TranslationParams) => {
      const name = params.name ?? "item";
      return `Fout bij verwijderen van "${name}"`;
    },
    savingCaption: (params: TranslationParams) => {
      const name = params.name ?? "item";
      return `Bijschrift opslaan voor "${name}"...`;
    },
    savedCaption: "Bijschrift opgeslagen",
    errorSavingCaption: (params: TranslationParams) => {
      const name = params.name ?? "item";
      return `Fout bij opslaan van bijschrift voor "${name}"`;
    },
    emptyFolder: "Deze map is leeg",
    dropToUpload: "Sleep bestanden hier om te uploaden",
    uploadProgress: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Bestanden uploaden...';
      }
      return createPluralTranslation({
        one: "1 bestand uploaden...",
        other: "${count} bestanden uploaden..."
      }, "nl")(params);
    },
    uploadProgressPercent: "Uploaden... {progress}%",
    filesExceedLimit: "Bestanden te groot: {files}",
    noFilesToUpload: "Geen bestanden om te uploaden",
    processingFiles: "Bestanden verwerken...",
    uploadComplete: "Upload voltooid",
    uploadFailed: "Upload mislukt: {error}",
    deletingFiles: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Bestanden verwijderen...';
      }
      return createPluralTranslation({
        one: "1 bestand verwijderen...",
        other: "${count} bestanden verwijderen..."
      }, "nl")(params);
    },
    deleteComplete: "Verwijderen voltooid",
    deleteFailed: "Verwijderen mislukt",
    processingImage: (params: TranslationParams) => {
      const name = params.name ?? "afbeelding";
      return `Afbeelding "${name}" verwerken...`;
    },
    processingImages: createPluralTranslation({
      one: "1 afbeelding verwerken...",
      other: "${count} afbeeldingen verwerken..."
    }, "nl"),
    generatingCaption: "Bijschrift genereren...",
    captionGenerated: "Bijschrift gegenereerd",
    generateTags: "Tags genereren",
    generatingTags: "Tags genereren...",
    removeTags: "Tags verwijderen",
    createCaption: "Bijschrift maken",
    captionTypes: {
      txt: "Txt",
      tags: "Tags",
      caption: "Bijschrift",
      wd: "WD",
    },
    noCaptionFiles: "Geen bijschriftbestanden",
    uploadError: "Upload fout",
    dropOverlay: "Laat los om te uploaden",
    selectAll: "Alles selecteren",
    deselectAll: "Alles deselecteren",
    deleteSelected: "Selectie verwijderen",
    confirmMultiDelete: (params: TranslationParams | null | undefined = {}) => {
      if (!params || typeof params !== 'object') {
        return 'Weet je zeker dat je deze items wilt verwijderen?';
      }
      const folders = typeof params.folders === 'number' ? params.folders : 0;
      const images = typeof params.images === 'number' ? params.images : 0;
      
      if (folders === 0 && images === 0) {
        return 'Weet je zeker dat je deze items wilt verwijderen?';
      }

      const parts = [];
      if (folders > 0) {
        parts.push(createPluralTranslation({
          one: "1 map",
          other: "${count} mappen"
        }, "nl")({ count: folders }));
      }
      if (images > 0) {
        parts.push(createPluralTranslation({
          one: "1 afbeelding",
          other: "${count} afbeeldingen"
        }, "nl")({ count: images }));
      }
      return `Weet je zeker dat je ${parts.join(" en ")} wilt verwijderen?`;
    },
    confirmFolderDelete: (params: TranslationParams) => {
      const name = params.name ?? "map";
      return `Weet je zeker dat je de map "${name}" en alle inhoud wilt verwijderen?`;
    },
    someFolderDeletesFailed: "Sommige mappen konden niet worden verwijderd",
    folderDeleteError: "Fout bij verwijderen van map",
    deletingFile: "Bestand verwijderen...",
    fileDeleteSuccess: "Bestand verwijderd",
    fileDeleteError: "Fout bij verwijderen van bestand",
    createFolder: "Map maken",
    folderNamePlaceholder: "Mapnaam",
    deleteConfirmation: "Verwijderbevestiging",
    selectedCount: createPluralTranslation({
      one: "1 item geselecteerd",
      other: "${count} items geselecteerd"
    }, "nl"),
    folderLocation: (params: TranslationParams) => {
      const name = params.name ?? "";
      return `Map: ${name}`;
    },
    moveToFolder: (params: TranslationParams) => {
      const name = params.name ?? "map";
      return `Verplaatsen naar "${name}"`;
    },
    workWithFolder: (params: TranslationParams) => {
      const name = params.name ?? "map";
      return `Werken met map "${name}"`;
    },
  },
  shortcuts: {
    title: "Sneltoetsen",
    galleryNavigation: "Galerij navigatie",
    quickFolderSwitch: "Snel van map wisselen",
    aboveImage: "Bovenste afbeelding",
    belowImage: "Onderste afbeelding",
    previousImage: "Vorige afbeelding",
    nextImage: "Volgende afbeelding",
    togglePreview: "Voorvertoning aan/uit",
    tagNavigation: "Tag navigatie",
    previousTag: "Vorige tag",
    nextTag: "Volgende tag",
    switchTagBubble: "Wissel tag bubble",
    switchTagInput: "Wissel tag invoer",
    cycleCaptions: "Door bijschriften bladeren",
    firstTagRow: "Eerste tag rij",
    lastTagRow: "Laatste tag rij",
    doubleShift: "Dubbele shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Tag verwijderen",
    other: "Overig",
    esc: "Esc",
    closePreview: "Voorvertoning sluiten",
    deleteImage: "Afbeelding verwijderen",
    toggleImagePreview: "Afbeeldingsvoorvertoning aan/uit",
    copyToClipboard: "Kopiëren naar klembord",
  },
  imageViewer: {
    zoomIn: "Inzoomen",
    zoomOut: "Uitzoomen",
    resetZoom: "Zoom resetten",
    toggleMinimap: "Minimap aan/uit",
    previousImage: "Vorige afbeelding",
    nextImage: "Volgende afbeelding",
    copyPath: "Pad kopiëren",
    openInNewTab: "Openen in nieuw tabblad",
    fitToScreen: "Passend op scherm",
    actualSize: "Werkelijke grootte",
    rotateLeft: "Linksom draaien",
    rotateRight: "Rechtsom draaien",
    downloadImage: "Afbeelding downloaden",
    imageInfo: "Afbeeldingsinformatie",
    dimensions: "Afmetingen",
  },
  tools: {
    removeCommas: "Komma's verwijderen",
    replaceNewlinesWithCommas: "Nieuwe regels vervangen door komma's",
    replaceUnderscoresWithSpaces: "Underscores vervangen door spaties",
    addTransformation: "Transformatie toevoegen",
    transformations: "Transformaties",
    transformationType: "Transformatietype",
    transformationTypes: {
      searchReplace: "Zoeken en vervangen",
      case: "Hoofdlettergebruik",
      trim: "Trimmen",
      wrap: "Omwikkelen",
      number: "Nummer"
    },
    caseTypes: {
      upper: "Hoofdletters",
      lower: "Kleine letters",
      title: "Titel",
      sentence: "Zin"
    },
    trimTypes: {
      all: "Alles",
      start: "Begin",
      end: "Einde",
      duplicates: "Duplicaten"
    },
    numberActions: {
      remove: "Verwijderen",
      format: "Formatteren",
      extract: "Extraheren"
    },
    numberFormat: "Nummerformaat",
    numberFormatPlaceholder: "Voer nummerformaat in",
    prefix: "Voorvoegsel",
    suffix: "Achtervoegsel",
    prefixPlaceholder: "Voer voorvoegsel in",
    suffixPlaceholder: "Voer achtervoegsel in",
    transformationNamePlaceholder: "Voer transformatienaam in",
    transformationDescriptionPlaceholder: "Voer transformatiebeschrijving in",
    searchPattern: "Zoekpatroon",
    searchPatternPlaceholder: "Voer zoekpatroon in",
    replacement: "Vervanging",
    replacementPlaceholder: "Voer vervanging in",
    selectIcon: "Selecteer icoon"
  },
  notifications: {
    imageCopied: "Afbeelding gekopieerd",
    imageCopyFailed: "Kopiëren mislukt",
    folderCreated: "Map aangemaakt",
    folderCreateError: "Fout bij maken van map",
    generatingCaption: "Bijschrift genereren...",
    captionGenerated: "Bijschrift gegenereerd",
    connectionLost: "Verbinding verbroken",
    connectionRestored: "Verbinding hersteld",
  },
} as const satisfies Translations;
