import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "../types";

export default {
  common: {
    close: "Lukk",
    delete: "Slett",
    cancel: "Avbryt",
    save: "Lagre",
    edit: "Rediger",
    add: "Legg til",
    remove: "Fjern",
    loading: "Laster...",
    error: "Feil",
    success: "Vellykket",
    confirm: "Bekreft",
    download: "Last ned",
    path: "Sti",
    size: "Størrelse",
    date: "Dato",
    name: "Navn",
    type: "Type",
    actions: "Handlinger",
    search: "Søk...",
    filter: "Filter",
    apply: "Bruk",
    reset: "Tilbakestill",
    selected: "Valgt",
    all: "Alle",
    none: "Ingen",
    notFound: "404 - Siden ble ikke funnet",
    pathSeparator: getPathSeparator("nb"),
    toggleTheme: "Bytt tema",
    theme: "Tema",
    returnToFrontPage: "Tilbake til forsiden",
    home: "Hjem",
    openSettings: "Åpne innstillinger",
    create: "Opprett",
    creating: "Oppretter...",
    language: "Norsk",
    description: "Norsk bokmål",
  },
  settings: {
    title: "Innstillinger",
    appearance: "Utseende",
    theme: {
      light: "Lys",
      gray: "Grå",
      dark: "Mørk",
      banana: "Banan",
      strawberry: "Jordbær",
      peanut: "Peanøtt",
      "high-contrast-black": "Høy kontrast svart",
      "high-contrast-inverse": "Høy kontrast invertert",
    },
    disableAnimations: "Deaktiver animasjoner",
    disableAnimationsTooltip: "Deaktiver alle animasjoner i applikasjonen",
    language: "Språk",
    languageTooltip: "Velg språk for brukergrensesnittet",
    disableNonsense: "Deaktiver japansk tekst",
    disableNonsenseTooltip: "Deaktiver japansk tekst i applikasjonen",
    modelSettings: "Modellinnstillinger",
    jtp2ModelPath: "JTP2 modellsti",
    jtp2ModelPathTooltip: "Sti til JTP2 modellfil (.safetensors)",
    jtp2TagsPath: "JTP2 taggsti",
    jtp2TagsPathTooltip: "Sti til JTP2 taggfil (.json)",
    jtp2Threshold: "JTP2 terskel",
    jtp2ThresholdTooltip: "Tillitsterskel for å inkludere tagger (0.0 til 1.0)",
    jtp2ForceCpu: "Tving JTP2 CPU",
    jtp2ForceCpuTooltip: "Tving JTP2 til å bruke CPU i stedet for GPU",
    wdv3ModelName: "WDv3 modell",
    wdv3ModelNameTooltip: "Velg WDv3 modellarkitektur (ViT, SwinV2 eller ConvNext)",
    wdv3GenThreshold: "Generell taggterskel",
    wdv3GenThresholdTooltip: "Tillitsterskel for generelle tagger (standard: 0.35)",
    wdv3CharThreshold: "Karaktertaggterskel",
    wdv3CharThresholdTooltip: "Tillitsterskel for karaktertagger (standard: 0.75)",
    wdv3ForceCpu: "Tving WDv3 CPU",
    wdv3ForceCpuTooltip: "Tving WDv3 til å bruke CPU i stedet for GPU",
    wdv3ConfigUpdateError: "Feil ved oppdatering av WDv3-konfigurasjon",
    downloadModel: "Last ned modell (1,8 GB)",
    downloadTags: "Last ned tagger (195 KB)",
    viewMode: "Visningsmodus",
    gridView: "Rutenettvisning",
    listView: "Listevisning",
    sortBy: "Sorter etter",
    sortByName: "Sorter etter navn",
    sortByDate: "Sorter etter dato",
    sortBySize: "Sorter etter størrelse",
    experimentalFeatures: "Eksperimentelle funksjoner",
    enableZoom: "Aktiver zoom",
    enableZoomTooltip: "Aktiver zoom-funksjonalitet for bilder",
    enableMinimap: "Aktiver minikart ved zoom",
    enableMinimapTooltip: "Vis minikart når du zoomer inn på bilder",
    alwaysShowCaptionEditor: "Vis alltid bildetekstredigering",
    alwaysShowCaptionEditorTooltip: "Vis alltid bildetekstredigering i galleriet",
    instantDelete: "Aktiver øyeblikkelig sletting (hopper over bekreftelse)",
    instantDeleteTooltip: "Slett filer umiddelbart uten bekreftelsesdialog",
    warning: "Advarsel",
    gallery: "Galleri",
    preserveLatents: "Bevar Latents",
    preserveLatentsTooltip: "Bevar .npz (latent) filer ved flytting eller sletting av bilder.",
    preserveTxt: "Bevar .txt",
    preserveTxtTooltip: "Bevar .txt-filer ved flytting eller sletting av bilder.",
    thumbnailSize: "Miniatyrstørrelse",
    thumbnailSizeDescription: "Størrelse på miniatyrbilder i piksler (f.eks. 250)",
    thumbnailSizeUpdateError: "Kunne ikke oppdatere miniatyrstørrelse",
  },
  gallery: {
    addTag: "Legg til tagg",
    addCaption: "Legg til bildetekst",
    quickJump: "Hopp til mappe...",
    loadingFolders: "Laster mapper...",
    noResults: "Ingen resultater funnet",
    pathNotFound: "Sti ikke funnet",
    folderCount: (params?: TranslationParams) => `${params?.count ?? 0} mapper`,
    deleteConfirm: "Er du sikker på at du vil slette dette bildet?",
    deleteSuccess: "Bildet ble slettet",
    deleteError: "Feil ved sletting av bilde",
    savingCaption: "Lagrer bildetekst...",
    savedCaption: "Bildetekst lagret",
    errorSavingCaption: "Feil ved lagring av bildetekst",
    emptyFolder: "Denne mappen er tom",
    dropToUpload: "Slipp filer her for å laste opp",
    uploadProgress: (params?: TranslationParams) => {
      if (!params?.count) return 'Laster opp noen filer...';
      return `Laster opp ${params.count} filer...`;
    },
    uploadProgressPercent: (params?: TranslationParams) => {
      return `Laster opp... ${params?.progress}%`;
    },
    processingImage: "Behandler bilde...",
    generateTags: "Generer tagger",
    generatingTags: "Genererer tagger...",
    removeTags: "Fjern tagger",
    createCaption: "Opprett bildetekst",
    captionTypes: {
      txt: "Opprett ny tekstfil",
      tags: "Opprett ny .tags-fil",
      caption: "Opprett ny .caption-fil",
      wd: "Opprett ny .wd-fil"
    },
    noCaptionFiles: "Ingen bildetekstfiler ennå!",
    uploadError: "Opplasting mislyktes",
    dropOverlay: "Slipp filer eller mapper her",
    selectAll: "Velg alle",
    deselectAll: "Velg ingen",
    deleteSelected: "Slett valgte",
    filesExceedLimit: "For mange filer",
    noFilesToUpload: "Ingen filer å laste opp",
    processingFiles: "Behandler filer...",
    uploadComplete: "Opplasting fullført",
    uploadFailed: "Opplasting mislyktes",
    confirmMultiDelete: ({ folders = 0, images = 0 }) => {
      if (folders && images) {
        return `Er du sikker på at du vil slette ${folders} mapper og ${images} bilder?`;
      } else if (folders) {
        return `Er du sikker på at du vil slette ${folders} mapper?`;
      }
      return `Er du sikker på at du vil slette ${images} bilder?`;
    },
    confirmFolderDelete: ({ name = "" }) => `Er du sikker på at du vil slette mappen ${name}?`,
    someFolderDeletesFailed: "Noen mapper kunne ikke slettes",
    folderDeleteError: "Feil ved sletting av mappe",
    deletingFile: "Sletter fil...",
    fileDeleteSuccess: "Fil slettet",
    fileDeleteError: "Feil ved sletting av fil",
    fileCount: (params?: TranslationParams) => `${params?.count ?? 0} filer`,
    imageCount: (params?: TranslationParams) => `${params?.count ?? 0} bilder`,
    foundFolders: (params?: TranslationParams) => `${params?.count ?? 0} mapper funnet`,
    deletedCount: (params?: TranslationParams) => `${params?.count ?? 0} elementer slettet`,
    selectedCount: (params?: TranslationParams) => `${params?.count ?? 0} valgt`,
    processingImages: (params?: TranslationParams) => `Behandler ${params?.count ?? 0} bilder...`,
    folderLocation: (params?: TranslationParams) => `i ${params?.name ?? ''}`,
    moveToFolder: (params?: TranslationParams) => `Flytt til ${params?.name ?? ''}`,
    workWithFolder: (params?: TranslationParams) => `Arbeid med ${params?.name ?? ''}`,
    createFolder: "Opprett mappe",
    folderNamePlaceholder: "Mappenavn",
    deleteConfirmation: "Bekreft sletting",
    deletingFiles: (params?: TranslationParams) => {
      if (!params?.count) return 'Sletter filer...';
      return `Sletter ${params.count} filer...`;
    },
    deleteComplete: "Sletting fullført",
    deleteFailed: "Sletting mislyktes",
    generatingCaption: "Genererer bildetekst...",
    captionGenerated: "Bildetekst generert",
  },
  shortcuts: {
    title: "Hurtigtaster",
    galleryNavigation: "Gallerinavigasjon",
    quickFolderSwitch: "Rask mappebytting",
    aboveImage: "Bildet over",
    belowImage: "Bildet under",
    previousImage: "Forrige bilde",
    nextImage: "Neste bilde",
    togglePreview: "Vis/skjul forhåndsvisning (Enter/Space)",
    multiSelect: "Veksle flervalg (Shift+Enter/Shift+Space)",
    tagNavigation: "Taggnavigasjon",
    previousTag: "Forrige tagg",
    nextTag: "Neste tagg",
    switchTagBubble: "Bytt til taggbobler",
    switchTagInput: "Bytt til tagginput",
    cycleCaptions: "Bla gjennom bildetekster",
    firstTagRow: "Første tagg i raden",
    lastTagRow: "Siste tagg i raden",
    doubleShift: "Dobbel Shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Fjern tagg",
    other: "Annet",
    esc: "Esc",
    closePreview: "Lukk forhåndsvisning/modal",
    deleteImage: "Slett bilde",
    toggleImagePreview: "Vis/skjul bildeforhåndsvisning",
    copyToClipboard: "Kopier bilde til utklippstavle",
  },
  imageViewer: {
    zoomIn: "Zoom inn",
    zoomOut: "Zoom ut",
    resetZoom: "Tilbakestill zoom",
    toggleMinimap: "Vis/skjul minikart",
    previousImage: "Forrige bilde",
    nextImage: "Neste bilde",
    copyPath: "Kopier sti",
    openInNewTab: "Åpne i ny fane",
    fitToScreen: "Tilpass til skjerm",
    actualSize: "Faktisk størrelse",
    rotateLeft: "Roter til venstre",
    rotateRight: "Roter til høyre",
    downloadImage: "Last ned bilde",
    imageInfo: "Bildeinformasjon",
    dimensions: "Dimensjoner",
  },
  tools: {
    addTransformation: "Legg til transformasjon",
    transformations: "Transformasjoner",
    transformationType: "Transformasjonstype",
    transformationTypes: {
      searchReplace: "Søk og erstatt",
      case: "Bokstavtype",
      trim: "Trim",
      wrap: "Omslag",
      number: "Nummer"
    },
    caseTypes: {
      upper: "Store bokstaver",
      lower: "Små bokstaver",
      title: "Stor forbokstav",
      sentence: "Setning"
    },
    trimTypes: {
      all: "Alle",
      start: "Start",
      end: "Slutt",
      duplicates: "Duplikater"
    },
    numberActions: {
      remove: "Fjern",
      format: "Format",
      extract: "Trekk ut"
    },
    numberFormat: "Nummerformat",
    numberFormatPlaceholder: "F.eks. 001, 01, 1",
    prefix: "Prefiks",
    suffix: "Suffiks",
    prefixPlaceholder: "Skriv inn prefiks...",
    suffixPlaceholder: "Skriv inn suffiks...",
    transformationNamePlaceholder: "Transformasjonsnavn...",
    transformationDescriptionPlaceholder: "Transformasjonsbeskrivelse...",
    searchPattern: "Søkemønster",
    searchPatternPlaceholder: "Tekst å søke etter...",
    replacement: "Erstatning",
    replacementPlaceholder: "Tekst å erstatte med...",
    selectIcon: "Velg ikon",
    removeCommas: "Fjern komma",
    replaceNewlinesWithCommas: "Erstatt linjeskift med komma",
    replaceUnderscoresWithSpaces: "Erstatt understrek med mellomrom"
  },
  notifications: {
    imageCopied: "Bilde kopiert til utklippstavle",
    imageCopyFailed: "Kunne ikke kopiere bilde til utklippstavle",
    folderCreated: "Mappe opprettet",
    folderCreateError: "Kunne ikke opprette mappe",
    generatingCaption: "Genererer bildetekst...",
    captionGenerated: "Bildetekst generert",
    connectionLost: "Mistet tilkobling til serveren",
    connectionRestored: "Tilkobling gjenopprettet"
  },
} as const satisfies Translations;
