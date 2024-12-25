import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "./types";
import { createPluralTranslation } from "./plurals";

export default {
  common: {
    close: "Luk",
    delete: "Slet",
    cancel: "Annuller",
    save: "Gem",
    edit: "Rediger",
    add: "Tilføj",
    remove: "Fjern",
    loading: "Indlæser...",
    error: "Fejl",
    success: "Succes",
    confirm: "Bekræft",
    download: "Download",
    path: "Sti",
    size: "Størrelse",
    date: "Dato",
    name: "Navn",
    type: "Type",
    actions: "Handlinger",
    search: "Søg...",
    filter: "Filter",
    apply: "Anvend",
    reset: "Nulstil",
    selected: "Valgt",
    all: "Alle",
    none: "Ingen",
    pathSeparator: getPathSeparator("da"),
    toggleTheme: "Skift tema",
    theme: "Tema",
    returnToFrontPage: "Tilbage til forsiden",
    home: "Hjem",
    openSettings: "Åbn indstillinger",
    create: "Opret",
    creating: "Opretter...",
    language: "Sprog",
    description: "Beskrivelse",
  },
  settings: {
    title: "Indstillinger",
    appearance: "Udseende",
    theme: {
      light: "Lys",
      gray: "Grå",
      dark: "Mørk",
      banana: "Banan",
      strawberry: "Jordbær",
      peanut: "Peanut",
      christmas: "Jul",
      halloween: "Halloween",
      "high-contrast-black": "Høj kontrast sort",
      "high-contrast-inverse": "Høj kontrast omvendt",
    },
    disableAnimations: "Deaktiver animationer",
    disableAnimationsTooltip: "Deaktiver alle animationer for bedre ydeevne",
    language: "Sprog",
    languageTooltip: "Skift grænsefladens sprog",
    disableNonsense: "Deaktiver japansk tekst",
    disableNonsenseTooltip: "Skjul japansk tekst og andre meningsløse elementer",
    modelSettings: "Model indstillinger",
    jtp2ModelPath: "JTP2 model sti",
    jtp2ModelPathTooltip: "Sti til JTP2 model fil (.safetensors)",
    jtp2TagsPath: "JTP2 tags sti",
    jtp2TagsPathTooltip: "Sti til JTP2 tags fil (.json)",
    downloadModel: "Download model (1,8 GB)",
    downloadTags: "Download tags (195 KB)",
    viewMode: "Visningstype",
    gridView: "Gittervisning",
    listView: "Listevisning",
    sortBy: "Sortér efter",
    sortByName: "Sortér efter navn",
    sortByDate: "Sortér efter dato",
    sortBySize: "Sortér efter størrelse",
    experimentalFeatures: "Eksperimentelle funktioner",
    enableZoom: "Aktivér zoom",
    enableZoomTooltip: "Aktivér zoom og panorering i billedfremviseren",
    enableMinimap: "Aktivér minikort ved zoom",
    enableMinimapTooltip: "Vis minikort ved zoom for nemmere navigation",
    alwaysShowCaptionEditor: "Vis altid billedtekst redigering",
    alwaysShowCaptionEditorTooltip: "Hold billedtekst redigering altid åben",
    instantDelete: "Aktivér øjeblikkelig sletning (springer bekræftelse over)",
    instantDeleteTooltip: "Slet filer uden bekræftelsesdialog",
    warning: "Advarsel",
    gallery: "Galleri",
    preserveLatents: "Bevar Latents",
    preserveLatentsTooltip: "Bevar .npz (latent) filer ved flytning eller sletning af billeder.",
    preserveTxt: "Bevar .txt",
    preserveTxtTooltip: "Bevar .txt-filer ved flytning eller sletning af billeder.",
    thumbnailSize: "Miniaturestørrelse",
    thumbnailSizeDescription: "Størrelse af miniaturer i pixels (f.eks. 250)",
    thumbnailSizeUpdateError: "Kunne ikke opdatere miniaturestørrelse",
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
    imageWork: "Arbejd med billeder",
    audioWork: "Arbejd med lyd",
    deselectAll: "Fravælg alle",
    deleteSelected: "Slet valgte",
  },
  gallery: {
    addTag: "Tilføj tag...",
    addCaption: "Tilføj billedtekst...",
    quickJump: "Hop til mappe...",
    loadingFolders: "Indlæser mapper...",
    noResults: "Ingen resultater fundet",
    folderCount: createPluralTranslation({
      one: "1 mappe",
      other: "${count} mapper"
    }, "da"),
    deleteConfirm: "Er du sikker på, at du vil slette dette billede?",
    deleteSuccess: "Billede slettet med succes",
    deleteError: "Fejl ved sletning af billede",
    savingCaption: "Gemmer billedtekst...",
    savedCaption: "Billedtekst gemt",
    errorSavingCaption: "Fejl ved gemning af billedtekst",
    emptyFolder: "Denne mappe er tom",
    dropToUpload: "Slip filer her for at uploade",
    uploadProgress: createPluralTranslation({
      one: "Uploader 1 fil...",
      other: "Uploader ${count} filer..."
    }, "da"),
    uploadProgressPercent: "Uploader {progress}%",
    processingImage: "Behandler billede...",
    generateTags: "Generer tags",
    generatingTags: "Genererer tags...",
    removeTags: "Fjern tags",
    createCaption: "Opret billedtekst",
    captionTypes: {
      txt: "Opret ny tekstfil",
      tags: "Opret ny .tags fil",
      caption: "Opret ny .caption fil",
      wd: "Opret ny .wd fil"
    },
    noCaptionFiles: "Ingen billedtekstfiler endnu!",
    selectAll: "Vælg alle",
    deselectAll: "Fravælg alle",
    deleteSelected: "Slet valgte",
    confirmMultiDelete: ({ folders = 0, images = 0 }) => {
      if (folders > 0 && images > 0) {
        return `Er du sikker på, at du vil slette ${folders} mapper og ${images} billeder?`;
      } else if (folders > 0) {
        return `Er du sikker på, at du vil slette ${folders} mapper?`;
      }
      return `Er du sikker på, at du vil slette ${images} billeder?`;
    },
    confirmFolderDelete: "Er du sikker på, at du vil slette mappen {name}?",
    someFolderDeletesFailed: "Nogle mapper kunne ikke slettes",
    folderDeleteError: "Fejl ved sletning af mappe",
    deletingFile: "Sletter fil...",
    fileDeleteSuccess: "Fil slettet",
    fileDeleteError: "Fejl ved sletning af fil",
    uploadError: "Upload fejlede",
    dropOverlay: "Slip filer eller mapper her",
    fileCount: createPluralTranslation({
      one: "1 fil",
      other: "${count} filer"
    }, "da"),
    imageCount: createPluralTranslation({
      one: "1 billede",
      other: "${count} billeder"
    }, "da"),
    foundFolders: createPluralTranslation({
      one: "Fandt 1 mappe",
      other: "Fandt ${count} mapper"
    }, "da"),
    deletedCount: createPluralTranslation({
      one: "Slettede 1 element",
      other: "Slettede ${count} elementer"
    }, "da"),
    selectedCount: createPluralTranslation({
      one: "1 valgt",
      other: "${count} valgt"
    }, "da"),
    processingImages: createPluralTranslation({
      one: "Behandler 1 billede...",
      other: "Behandler ${count} billeder..."
    }, "da"),
    folderLocation: (params: TranslationParams) => `i ${params.name ?? ""}`,
    moveToFolder: (params: TranslationParams) => `Flyt til ${params.name ?? ""}`,
    workWithFolder: (params: TranslationParams) => `Arbejd med ${params.name ?? ""}`,
    createFolder: "Opret mappe",
    folderNamePlaceholder: "Mappenavn",
    deleteConfirmation: "Bekræft sletning",
    filesExceedLimit: "Filer er for store: {files}",
    noFilesToUpload: "Ingen filer at uploade",
    processingFiles: "Behandler filer...",
    uploadComplete: "Upload fuldført",
    uploadFailed: "Upload fejlede: {error}",
    deletingFiles: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Sletter filer...';
      }
      return createPluralTranslation({
        one: "Sletter 1 fil...",
        other: "Sletter ${count} filer..."
      }, "da")(params);
    },
    deleteComplete: "Sletning fuldført",
    deleteFailed: "Sletning fejlede",
    generatingCaption: "Genererer billedtekst...",
    captionGenerated: "Billedtekst genereret",
  },
  shortcuts: {
    title: "Tastaturgenveje",
    galleryNavigation: "Gallerinavigation",
    quickFolderSwitch: "Hurtig mappeskift",
    aboveImage: "Billede ovenfor",
    belowImage: "Billede nedenfor",
    previousImage: "Forrige billede",
    nextImage: "Næste billede",
    togglePreview: "Skift forhåndsvisning",
    tagNavigation: "Tag navigation",
    previousTag: "Forrige tag",
    nextTag: "Næste tag",
    switchTagBubble: "Skift til tag bobler",
    switchTagInput: "Skift til tag input",
    cycleCaptions: "Gennemgå billedtekster",
    firstTagRow: "Første tag i rækken",
    lastTagRow: "Sidste tag i rækken",
    doubleShift: "Dobbelt Shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Fjern tag",
    other: "Andet",
    esc: "Esc",
    closePreview: "Luk forhåndsvisning/modal",
    deleteImage: "Slet billede",
    toggleImagePreview: "Skift billedforhåndsvisning",
    copyToClipboard: "Kopiér billede til udklipsholder",
  },
  imageViewer: {
    zoomIn: "Zoom ind",
    zoomOut: "Zoom ud",
    resetZoom: "Nulstil zoom",
    toggleMinimap: "Skift minikort",
    previousImage: "Forrige billede",
    nextImage: "Næste billede",
    copyPath: "Kopiér sti",
    openInNewTab: "Åbn i ny fane",
    fitToScreen: "Tilpas til skærm",
    actualSize: "Faktisk størrelse",
    rotateLeft: "Rotér venstre",
    rotateRight: "Rotér højre",
    downloadImage: "Download billede",
    imageInfo: "Billedinformation",
    dimensions: "Dimensioner",
  },
  tools: {
    removeCommas: "Fjern kommaer",
    replaceNewlinesWithCommas: "Erstat linjeskift med kommaer",
    replaceUnderscoresWithSpaces: "Erstat understreger med mellemrum",
    transformationType: "Transformationstype",
    transformations: "Transformationer",
    prefix: "Præfiks",
    suffix: "Suffiks",
    prefixPlaceholder: "Indtast præfiks...",
    suffixPlaceholder: "Indtast suffiks...",
    numberFormat: "Nummerformat",
    numberFormatPlaceholder: "Indtast nummerformat...",
    transformationNamePlaceholder: "Indtast transformationsnavn...",
    transformationDescriptionPlaceholder: "Indtast transformationsbeskrivelse...",
    searchPattern: "Søgemønster",
    searchPatternPlaceholder: "Indtast søgemønster...",
    replacement: "Erstatning",
    replacementPlaceholder: "Indtast erstatning...",
    selectIcon: "Vælg ikon",
    addTransformation: "Tilføj transformation",
    transformationTypes: {
      searchReplace: "Søg og erstat",
      case: "Bogstavtype",
      trim: "Fjern mellemrum",
      wrap: "Ombryd",
      number: "Nummer"
    },
    caseTypes: {
      upper: "Store bogstaver",
      lower: "Små bogstaver",
      title: "Titelformat",
      sentence: "Sætningsformat"
    },
    trimTypes: {
      all: "Fjern alle mellemrum",
      start: "Fjern mellemrum start",
      end: "Fjern mellemrum slut",
      duplicates: "Fjern duplikerede mellemrum"
    },
    numberActions: {
      remove: "Fjern",
      format: "Formater",
      extract: "Udtræk"
    }
  },
  notifications: {
    imageCopied: "Billede kopieret til udklipsholder",
    imageCopyFailed: "Kunne ikke kopiere billede til udklipsholder",
    folderCreated: "Mappe oprettet",
    folderCreateError: "Kunne ikke oprette mappe",
    generatingCaption: "Genererer billedtekst...",
    captionGenerated: "Billedtekst genereret",
    connectionLost: "Forbindelse tabt",
    connectionRestored: "Forbindelse genoprettet"
  },
} as const satisfies Translations;
