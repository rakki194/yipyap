import { getPathSeparator } from "~/i18n";
import type { Translations } from "./types";

const translations: Translations = {
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
    },
    disableAnimations: "Deaktiver animationer",
    language: "Sprog",
    disableNonsense: "Deaktiver japansk tekst",
    modelSettings: "Model indstillinger",
    jtp2ModelPath: "JTP2 model sti",
    jtp2TagsPath: "JTP2 tags sti",
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
    enableMinimap: "Aktivér minikort ved zoom",
    instantDelete: "Aktivér øjeblikkelig sletning (springer bekræftelse over)",
    warning: "Advarsel",
    gallery: "Galleri",
    preserveLatents: "Bevar Latents",
    preserveLatentsTooltip: "Bevar .npz (latent) filer ved sletning af billeder.",
    preserveTxt: "Bevar .txt",
    preserveTxtTooltip: "Bevar .txt-filer ved sletning af billeder.",
  },
  frontPage: {
    subtitle: {
      1: "Store sprogmodeller snyder, lyver og hallucinerer. Ligesom mig!",
      2: "Vi fandt en anden måde at bede på",
      3: "Det uendelige univers reflekteres i tomme øjne",
      4: "Rustent hjerte, nyt skud",
      5: "Et magisk sted hvor drøm og virkelighed krydser",
      6: "Ukendt territorium, uendelige muligheder",
      7: "Evig kærlighed ud over tidens strøm",
      8: "Dette vil få dig smidt ud!",
    },
    imageWork: "Arbejd med billeder",
    audioWork: "Arbejd med lyd",
  },
  gallery: {
    addTag: "Tilføj tag...",
    addCaption: "Tilføj billedtekst...",
    quickJump: "Hop til mappe...",
    loadingFolders: "Indlæser mapper...",
    noResults: "Ingen resultater fundet",
    folderCount: "{count} mapper",
    deleteConfirm: "Er du sikker på, at du vil slette dette billede?",
    deleteSuccess: "Billede slettet med succes",
    deleteError: "Fejl ved sletning af billede",
    savingCaption: "Gemmer billedtekst...",
    savedCaption: "Billedtekst gemt",
    errorSavingCaption: "Fejl ved gemning af billedtekst",
    emptyFolder: "Denne mappe er tom",
    dropToUpload: "Slip filer her for at uploade",
    uploadProgress: "Uploader {count} filer...",
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
  },
};

export default translations; 