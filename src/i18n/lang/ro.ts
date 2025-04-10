import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "../types";

export default {
  common: {
    close: "Închide",
    delete: "Șterge",
    cancel: "Anulează",
    save: "Salvează",
    edit: "Editează",
    add: "Adaugă",
    remove: "Elimină",
    loading: "Se încarcă...",
    error: "Eroare",
    success: "Succes",
    confirm: "Confirmă",
    download: "Descarcă",
    path: "Cale",
    size: "Dimensiune",
    date: "Dată",
    name: "Nume",
    type: "Tip",
    actions: "Acțiuni",
    search: "Căutare",
    filter: "Filtrare",
    apply: "Aplică",
    reset: "Resetează",
    selected: "Selectat",
    all: "Toate",
    none: "Niciunul",
    notFound: "404 - Pagina nu a fost găsită",
    pathSeparator: getPathSeparator("ro"),
    toggleTheme: "Comutare temă",
    theme: "Temă",
    returnToFrontPage: "Înapoi la pagina principală",
    home: "Acasă",
    openSettings: "Deschide setările",
    create: "Creează",
    creating: "Se creează...",
    language: "Română",
    description: "Romanian",
  },
  settings: {
    title: "Setări",
    appearance: "Aspect",
    gallery: "Galerie",
    language: "Limbă",
    languageTooltip: "Alege limba interfeței",
    modelSettings: "Setări model",
    experimentalFeatures: "Funcții experimentale",
    disableAnimations: "Dezactivare animații",
    disableAnimationsTooltip: "Dezactivează toate animațiile din aplicație",
    disableNonsense: "Dezactivare japoneză",
    disableNonsenseTooltip: "Dezactivează textul japonez din aplicație",
    enableZoom: "Activare zoom",
    enableZoomTooltip: "Activează funcția de zoom pentru imagini",
    enableMinimap: "Activare minimapă",
    enableMinimapTooltip: "Afișează minimapa când faci zoom pe imagini",
    alwaysShowCaptionEditor: "Afișează întotdeauna editorul de descriere",
    alwaysShowCaptionEditorTooltip: "Afișează întotdeauna editorul de descriere în galerie",
    instantDelete: "Ștergere instantanee",
    instantDeleteTooltip: "Șterge fișierele instant fără dialog de confirmare",
    theme: {
      light: "Luminos",
      gray: "Gri",
      dark: "Întunecat",
      banana: "Banană",
      strawberry: "Căpșună",
      peanut: "Arahidă",
      "high-contrast-black": "Contrast ridicat negru",
      "high-contrast-inverse": "Contrast ridicat inversat",
    },
    gridView: "Vizualizare grilă",
    listView: "Vizualizare listă",
    sortBy: "Sortare după",
    sortByName: "Sortare după nume",
    sortByDate: "Sortare după dată",
    sortBySize: "Sortare după mărime",
    jtp2ModelPath: "Cale model JTP2",
    jtp2ModelPathTooltip: "Calea către modelul JTP2",
    jtp2TagsPath: "Cale etichete JTP2",
    jtp2TagsPathTooltip: "Calea către etichetele JTP2",
    downloadModel: "Descărcare model",
    downloadTags: "Descărcare etichete",
    viewMode: "Mod vizualizare",
    warning: "Avertisment",
    preserveLatents: "Păstrează Latents",
    preserveLatentsTooltip: "Păstrează fișierele .npz (latent) atunci când muți sau ștergi imagini.",
    preserveTxt: "Păstrează .txt",
    preserveTxtTooltip: "Păstrează fișierele .txt atunci când muți sau ștergi imagini.",
    thumbnailSize: "Dimensiune miniaturi",
    thumbnailSizeDescription: "Dimensiunea miniaturilor în pixeli (ex. 250)",
    thumbnailSizeUpdateError: "Nu s-a putut actualiza dimensiunea miniaturilor",
    wdv3ForceCpu: "Forțează CPU pentru WDv3",
    wdv3ForceCpuTooltip: "Forțează utilizarea CPU în loc de GPU pentru procesarea WDv3",
    jtp2Threshold: "Prag JTP2",
    jtp2ThresholdTooltip: "Pragul de încredere pentru generarea etichetelor JTP2",
    jtp2ForceCpu: "Forțează CPU pentru JTP2",
    jtp2ForceCpuTooltip: "Forțează utilizarea CPU în loc de GPU pentru procesarea JTP2",
    wdv3ModelName: "Nume model WDv3",
    wdv3ModelNameTooltip: "Numele modelului WDv3 de utilizat",
    wdv3GenThreshold: "Prag generare WDv3",
    wdv3GenThresholdTooltip: "Pragul de încredere pentru generarea etichetelor WDv3",
    wdv3CharThreshold: "Prag caractere WDv3",
    wdv3CharThresholdTooltip: "Pragul de caractere pentru generarea etichetelor WDv3",
    wdv3ConfigUpdateError: "Eroare la actualizarea configurației WDv3",
  },
  gallery: {
    addTag: "Adaugă etichetă...",
    addCaption: "Adaugă descriere...",
    quickJump: "Salt la folder...",
    loadingFolders: "Se încarcă folderele...",
    noResults: "Nu s-au găsit rezultate",
    pathNotFound: "Calea nu a fost găsită",
    folderCount: (params?: TranslationParams) => `${params?.count ?? 0} foldere`,
    deleteConfirm: "Sigur doriți să ștergeți această imagine?",
    deleteSuccess: "Imagine ștearsă cu succes",
    deleteError: "Eroare la ștergerea imaginii",
    savingCaption: "Se salvează descrierea...",
    savedCaption: "Descriere salvată",
    errorSavingCaption: "Eroare la salvarea descrierii",
    emptyFolder: "Acest folder este gol",
    dropToUpload: "Trageți fișiere aici pentru încărcare",
    uploadProgress: (params?: TranslationParams) => {
      if (!params?.count) return 'Se încarcă fișiere...';
      return `Se încarcă ${params.count} fișiere...`;
    },
    uploadProgressPercent: (params?: TranslationParams) => `Se încarcă... ${params?.progress}%`,
    processingImage: "Se procesează imaginea...",
    generateTags: "Generare etichete",
    generatingTags: "Se generează etichete...",
    removeTags: "Eliminare etichete",
    createCaption: "Creare descriere",
    captionTypes: {
      txt: "Creare fișier text nou",
      tags: "Creare fișier .tags nou",
      caption: "Creare fișier .caption nou",
      wd: "Creare fișier .wd nou"
    },
    noCaptionFiles: "Nu există încă fișiere de descriere!",
    uploadError: "Încărcare eșuată",
    dropOverlay: "Trageți fișiere sau foldere aici",
    selectAll: "Selectează tot",
    deselectAll: "Deselectează tot",
    deleteSelected: "Șterge selectate",
    confirmMultiDelete: ({ folders = 0, images = 0 }) => {
      if (folders && images) {
        return `Sigur doriți să ștergeți ${folders} foldere și ${images} imagini?`;
      } else if (folders) {
        return `Sigur doriți să ștergeți ${folders} foldere?`;
      }
      return `Sigur doriți să ștergeți ${images} imagini?`;
    },
    confirmFolderDelete: ({ name = "" }) => `Sigur doriți să ștergeți folderul ${name}?`,
    someFolderDeletesFailed: "Unele foldere nu au putut fi șterse",
    folderDeleteError: "Eroare la ștergerea folderului",
    deletingFile: "Se șterge fișierul...",
    fileDeleteSuccess: "Fișier șters cu succes",
    fileDeleteError: "Eroare la ștergerea fișierului",
    fileCount: (params?: TranslationParams) => `${params?.count ?? 0} fișiere`,
    imageCount: (params?: TranslationParams) => `${params?.count ?? 0} imagini`,
    foundFolders: (params?: TranslationParams) => `${params?.count ?? 0} foldere găsite`,
    deletedCount: (params?: TranslationParams) => `${params?.count ?? 0} elemente șterse`,
    selectedCount: (params?: TranslationParams) => `${params?.count ?? 0} selectate`,
    processingImages: (params?: TranslationParams) => `Se procesează ${params?.count ?? 0} imagini...`,
    folderLocation: (params?: TranslationParams) => `în ${params?.name ?? ''}`,
    moveToFolder: (params?: TranslationParams) => `Mută în ${params?.name ?? ''}`,
    workWithFolder: (params?: TranslationParams) => `Lucrează cu ${params?.name ?? ''}`,
    createFolder: "Creare folder",
    folderNamePlaceholder: "Nume folder",
    deleteConfirmation: "Confirmare ștergere",
    filesExceedLimit: "Prea multe fișiere",
    noFilesToUpload: "Nu există fișiere de încărcat",
    processingFiles: "Se procesează fișierele...",
    uploadComplete: "Încărcare finalizată",
    uploadFailed: "Încărcare eșuată",
    deletingFiles: (params?: TranslationParams) => {
      if (!params?.count) return 'Se șterg fișierele...';
      return `Se șterg ${params.count} fișiere...`;
    },
    deleteComplete: "Ștergere finalizată",
    deleteFailed: "Ștergere eșuată",
    generatingCaption: "Se generează descrierea...",
    captionGenerated: "Descriere generată",
  },
  shortcuts: {
    title: "Scurtături tastatură",
    galleryNavigation: "Navigare galerie",
    quickFolderSwitch: "Comutare rapidă folder",
    aboveImage: "Imaginea de sus",
    belowImage: "Imaginea de jos",
    previousImage: "Imaginea anterioară",
    nextImage: "Imaginea următoare",
    togglePreview: "Comutare previzualizare",
    tagNavigation: "Navigare etichete",
    previousTag: "Eticheta anterioară",
    nextTag: "Eticheta următoare",
    switchTagBubble: "Comutare la bule etichete",
    switchTagInput: "Comutare la introducere etichete",
    cycleCaptions: "Ciclare descrieri",
    firstTagRow: "Prima etichetă din rând",
    lastTagRow: "Ultima etichetă din rând",
    doubleShift: "Shift dublu",
    shift: "Shift",
    del: "Del",
    removeTag: "Eliminare etichetă",
    other: "Altele",
    esc: "Esc",
    closePreview: "Închidere previzualizare/modal",
    deleteImage: "Ștergere imagine",
    toggleImagePreview: "Comutare previzualizare imagine",
    copyToClipboard: "Copiază imaginea în clipboard",
  },
  imageViewer: {
    zoomIn: "Mărire",
    zoomOut: "Micșorare",
    resetZoom: "Resetare zoom",
    toggleMinimap: "Comutare minimapă",
    previousImage: "Imaginea anterioară",
    nextImage: "Imaginea următoare",
    copyPath: "Copiere cale",
    openInNewTab: "Deschidere în tab nou",
    fitToScreen: "Potrivire la ecran",
    actualSize: "Dimensiune reală",
    rotateLeft: "Rotire stânga",
    rotateRight: "Rotire dreapta",
    downloadImage: "Descărcare imagine",
    imageInfo: "Informații imagine",
    dimensions: "Dimensiuni",
  },
  tools: {
    transformations: "Transformări",
    addTransformation: "Adaugă transformare",
    transformationType: "Tip transformare",
    transformationTypes: {
      searchReplace: "Căutare și înlocuire",
      case: "Modificare litere",
      trim: "Tăiere spații",
      wrap: "Încadrare",
      number: "Numere"
    },
    caseTypes: {
      upper: "LITERE MARI",
      lower: "litere mici",
      title: "Prima Literă Mare",
      sentence: "Prima literă mare la propoziție"
    },
    trimTypes: {
      all: "Toate spațiile",
      start: "Început",
      end: "Sfârșit",
      duplicates: "Duplicate"
    },
    numberActions: {
      remove: "Elimină numerele",
      format: "Formatează numerele",
      extract: "Extrage numerele"
    },
    removeCommas: "Elimină virgulele",
    replaceNewlinesWithCommas: "Înlocuiește liniile noi cu virgule",
    replaceUnderscoresWithSpaces: "Înlocuiește liniile de subliniere cu spații",
    prefix: "Prefix",
    suffix: "Sufix",
    prefixPlaceholder: "Adaugă prefix...",
    suffixPlaceholder: "Adaugă sufix...",
    numberFormat: "Format număr",
    numberFormatPlaceholder: "Introduceți formatul numărului...",
    transformationNamePlaceholder: "Introduceți numele transformării...",
    transformationDescriptionPlaceholder: "Introduceți descrierea transformării...",
    searchPattern: "Model căutare",
    searchPatternPlaceholder: "Introduceți textul de căutat...",
    replacement: "Înlocuire",
    replacementPlaceholder: "Introduceți textul de înlocuire...",
    selectIcon: "Selectează pictogramă"
  },
  notifications: {
    imageCopied: "Imaginea a fost copiată în clipboard",
    imageCopyFailed: "Nu s-a putut copia imaginea în clipboard",
    folderCreated: "Folder creat cu succes",
    folderCreateError: "Eroare la crearea folderului",
    generatingCaption: "Se generează descrierea...",
    captionGenerated: "Descriere generată cu succes",
    connectionLost: "Conexiune pierdută",
    connectionRestored: "Conexiune restabilită"
  },
} as const satisfies Translations;
