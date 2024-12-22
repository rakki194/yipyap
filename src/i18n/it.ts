import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "./types";
import { createPluralTranslation } from "./plurals";

export default {
  common: {
    close: "Chiudi",
    delete: "Elimina",
    cancel: "Annulla",
    save: "Salva",
    edit: "Modifica",
    add: "Aggiungi",
    remove: "Rimuovi",
    loading: "Caricamento...",
    error: "Errore",
    success: "Successo",
    confirm: "Conferma",
    download: "Scarica",
    path: "Percorso",
    size: "Dimensione",
    date: "Data",
    name: "Nome",
    type: "Tipo",
    actions: "Azioni",
    search: "Cerca...",
    filter: "Filtra",
    apply: "Applica",
    reset: "Reimposta",
    selected: "Selezionato",
    all: "Tutto",
    none: "Nessuno",
    pathSeparator: getPathSeparator("it"),
    toggleTheme: "Cambia tema",
    theme: "Tema",
    returnToFrontPage: "Torna alla pagina iniziale",
    home: "Home",
    openSettings: "Apri impostazioni",
    create: "Crea",
    creating: "Creazione...",
  },
  settings: {
    title: "Impostazioni",
    appearance: "Aspetto",
    theme: {
      light: "Chiaro",
      gray: "Grigio",
      dark: "Scuro",
      banana: "Banana",
      strawberry: "Fragola",
      peanut: "Arachide",
      christmas: "Natale",
      halloween: "Halloween",
    },
    disableAnimations: "Disattiva animazioni",
    language: "Lingua",
    disableNonsense: "Disattiva testo giapponese",
    modelSettings: "Impostazioni modello",
    jtp2ModelPath: "Percorso modello JTP2",
    jtp2TagsPath: "Percorso tag JTP2",
    downloadModel: "Scarica modello (1,8 GB)",
    downloadTags: "Scarica tag (195 KB)",
    viewMode: "Modalità visualizzazione",
    gridView: "Vista griglia",
    listView: "Vista lista",
    sortBy: "Ordina per",
    sortByName: "Ordina per nome",
    sortByDate: "Ordina per data",
    sortBySize: "Ordina per dimensione",
    experimentalFeatures: "Funzionalità sperimentali",
    enableZoom: "Attiva zoom",
    enableMinimap: "Attiva minimappa durante lo zoom",
    alwaysShowCaptionEditor: "Mostra sempre l'editor delle didascalie",
    instantDelete: "Attiva eliminazione istantanea (senza conferma)",
    warning: "Avviso",
    gallery: "Galleria",
    preserveLatents: "Preserva Latents",
    preserveLatentsTooltip: "Mantieni i file .npz (latent) durante l'eliminazione delle immagini.",
    preserveTxt: "Preserva .txt",
    preserveTxtTooltip: "Mantieni i file .txt durante l'eliminazione delle immagini.",
    thumbnailSize: "Dimensione miniature",
    thumbnailSizeDescription: "Regola la dimensione delle miniature nella galleria",
    thumbnailSizeUpdateError: "Errore durante l'aggiornamento della dimensione delle miniature",
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
    imageWork: "Lavora con le immagini",
    audioWork: "Lavora con l'audio",
    deselectAll: "Deseleziona tutto",
    deleteSelected: "Elimina selezionati",
  },
  gallery: {
    addTag: "Aggiungi tag",
    addCaption: "Aggiungi didascalia",
    quickJump: "Salto rapido",
    loadingFolders: "Caricamento cartelle...",
    noResults: "Nessun risultato",
    folderCount: createPluralTranslation({
      one: "1 cartella",
      other: "${count} cartelle"
    }, "it"),
    fileCount: createPluralTranslation({
      one: "1 file",
      other: "${count} file"
    }, "it"),
    imageCount: createPluralTranslation({
      one: "1 immagine",
      other: "${count} immagini"
    }, "it"),
    foundFolders: createPluralTranslation({
      one: "1 cartella trovata",
      other: "${count} cartelle trovate"
    }, "it"),
    deletedCount: createPluralTranslation({
      one: "1 elemento eliminato",
      other: "${count} elementi eliminati"
    }, "it"),
    deleteConfirm: (params: TranslationParams) => {
      const name = params.name ?? "questo elemento";
      return `Sei sicuro di voler eliminare "${name}"?`;
    },
    deleteSuccess: "Eliminazione completata",
    deleteError: (params: TranslationParams) => {
      const name = params.name ?? "elemento";
      return `Errore durante l'eliminazione di "${name}"`;
    },
    savingCaption: (params: TranslationParams) => {
      const name = params.name ?? "elemento";
      return `Salvataggio didascalia per "${name}"...`;
    },
    savedCaption: "Didascalia salvata",
    errorSavingCaption: (params: TranslationParams) => {
      const name = params.name ?? "elemento";
      return `Errore durante il salvataggio della didascalia per "${name}"`;
    },
    emptyFolder: "Questa cartella è vuota",
    dropToUpload: "Trascina qui i file per caricarli",
    uploadProgress: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Caricamento file...';
      }
      return createPluralTranslation({
        one: "Caricamento di 1 file...",
        other: "Caricamento di ${count} file..."
      }, "it")(params);
    },
    uploadProgressPercent: "Caricamento... {progress}%",
    filesExceedLimit: "File troppo grandi: {files}",
    noFilesToUpload: "Nessun file da caricare",
    processingFiles: "Elaborazione file...",
    uploadComplete: "Caricamento completato",
    uploadFailed: "Caricamento fallito: {error}",
    deletingFiles: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Eliminazione file...';
      }
      return createPluralTranslation({
        one: "Eliminazione di 1 file...",
        other: "Eliminazione di ${count} file..."
      }, "it")(params);
    },
    deleteComplete: "Eliminazione completata",
    deleteFailed: "Eliminazione fallita",
    processingImage: (params: TranslationParams) => {
      const name = params.name ?? "immagine";
      return `Elaborazione immagine "${name}"...`;
    },
    processingImages: createPluralTranslation({
      one: "Elaborazione di 1 immagine...",
      other: "Elaborazione di ${count} immagini..."
    }, "it"),
    generatingCaption: "Generazione didascalia...",
    captionGenerated: "Didascalia generata",
    generateTags: "Genera tag",
    generatingTags: "Generazione tag...",
    removeTags: "Rimuovi tag",
    createCaption: "Crea didascalia",
    captionTypes: {
      txt: "Txt",
      tags: "Tag",
      caption: "Didascalia",
      wd: "WD",
    },
    noCaptionFiles: "Nessun file didascalia",
    uploadError: "Errore di caricamento",
    dropOverlay: "Rilascia per caricare",
    selectAll: "Seleziona tutto",
    deselectAll: "Deseleziona tutto",
    deleteSelected: "Elimina selezionati",
    confirmMultiDelete: (params: TranslationParams | null | undefined = {}) => {
      if (!params || typeof params !== 'object') {
        return 'Sei sicuro di voler eliminare questi elementi?';
      }
      const folders = typeof params.folders === 'number' ? params.folders : 0;
      const images = typeof params.images === 'number' ? params.images : 0;
      
      if (folders === 0 && images === 0) {
        return 'Sei sicuro di voler eliminare questi elementi?';
      }

      const parts = [];
      if (folders > 0) {
        parts.push(createPluralTranslation({
          one: "1 cartella",
          other: "${count} cartelle"
        }, "it")({ count: folders }));
      }
      if (images > 0) {
        parts.push(createPluralTranslation({
          one: "1 immagine",
          other: "${count} immagini"
        }, "it")({ count: images }));
      }
      return `Sei sicuro di voler eliminare ${parts.join(" e ")}?`;
    },
    confirmFolderDelete: (params: TranslationParams) => {
      const name = params.name ?? "cartella";
      return `Sei sicuro di voler eliminare la cartella "${name}" e tutto il suo contenuto?`;
    },
    someFolderDeletesFailed: "Alcune cartelle non possono essere eliminate",
    folderDeleteError: "Errore durante l'eliminazione di una o più cartelle",
    deletingFile: "Eliminazione file...",
    fileDeleteSuccess: "File eliminato con successo",
    fileDeleteError: "Errore durante l'eliminazione di uno o più file",
    createFolder: "Crea cartella",
    folderNamePlaceholder: "Nome cartella",
    deleteConfirmation: "Conferma eliminazione",
    selectedCount: createPluralTranslation({
      one: "1 elemento selezionato",
      other: "${count} elementi selezionati"
    }, "it"),
    folderLocation: (params: TranslationParams) => {
      const name = params.name ?? "";
      return `Posizione: ${name}`;
    },
    moveToFolder: (params: TranslationParams) => {
      const name = params.name ?? "cartella";
      return `Sposta in "${name}"`;
    },
    workWithFolder: (params: TranslationParams) => {
      const name = params.name ?? "cartella";
      return `Lavora con la cartella "${name}"`;
    },
  },
  shortcuts: {
    title: "Scorciatoie",
    galleryNavigation: "Navigazione galleria",
    quickFolderSwitch: "Cambio rapido cartella",
    aboveImage: "Immagine sopra",
    belowImage: "Immagine sotto",
    previousImage: "Immagine precedente",
    nextImage: "Immagine successiva",
    togglePreview: "Attiva/disattiva anteprima",
    tagNavigation: "Navigazione tag",
    previousTag: "Tag precedente",
    nextTag: "Tag successivo",
    switchTagBubble: "Cambia bolla tag",
    switchTagInput: "Cambia input tag",
    cycleCaptions: "Cicla didascalie",
    firstTagRow: "Prima riga tag",
    lastTagRow: "Ultima riga tag",
    doubleShift: "Doppio Shift",
    shift: "Shift",
    del: "Canc",
    removeTag: "Rimuovi tag",
    other: "Altro",
    esc: "Esc",
    closePreview: "Chiudi anteprima",
    deleteImage: "Elimina immagine",
    toggleImagePreview: "Attiva/disattiva anteprima immagine",
    copyToClipboard: "Copia negli appunti",
  },
  imageViewer: {
    zoomIn: "Ingrandisci",
    zoomOut: "Riduci",
    resetZoom: "Reimposta zoom",
    toggleMinimap: "Attiva/disattiva minimappa",
    previousImage: "Immagine precedente",
    nextImage: "Immagine successiva",
    copyPath: "Copia percorso",
    openInNewTab: "Apri in nuova scheda",
    fitToScreen: "Adatta allo schermo",
    actualSize: "Dimensione reale",
    rotateLeft: "Ruota a sinistra",
    rotateRight: "Ruota a destra",
    downloadImage: "Scarica immagine",
    imageInfo: "Informazioni immagine",
    dimensions: "Dimensioni",
  },
  notifications: {
    imageCopied: "Immagine copiata",
    imageCopyFailed: "Errore durante la copia dell'immagine",
    folderCreated: "Cartella creata",
    folderCreateError: "Errore durante la creazione della cartella",
    generatingCaption: "Generazione didascalia...",
    captionGenerated: "Didascalia generata",
    connectionLost: "Connessione persa",
    connectionRestored: "Connessione ripristinata",
  },
  tools: {
    removeCommas: "Rimuovi virgole",
    replaceNewlinesWithCommas: "Sostituisci ritorni a capo con virgole",
    replaceUnderscoresWithSpaces: "Sostituisci underscore con spazi",
  },
} as const satisfies Translations;
