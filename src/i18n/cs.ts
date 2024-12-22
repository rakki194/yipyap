import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "./types";
import { createPluralTranslation } from "./plurals";

export default {
  common: {
    close: "Zavřít",
    delete: "Smazat",
    cancel: "Zrušit",
    save: "Uložit",
    edit: "Upravit",
    add: "Přidat",
    remove: "Odstranit",
    loading: "Načítání...",
    error: "Chyba",
    success: "Úspěch",
    confirm: "Potvrdit",
    download: "Stáhnout",
    path: "Cesta",
    size: "Velikost",
    date: "Datum",
    name: "Název",
    type: "Typ",
    actions: "Akce",
    search: "Hledat...",
    filter: "Filtr",
    apply: "Použít",
    reset: "Reset",
    selected: "Vybráno",
    all: "Vše",
    none: "Nic",
    pathSeparator: getPathSeparator("cs"),
    toggleTheme: "Přepnout motiv",
    theme: "Motiv",
    returnToFrontPage: "Zpět na hlavní stránku",
    home: "Domů",
    openSettings: "Otevřít nastavení",
    create: "Vytvořit",
    creating: "Vytváření...",
  },
  settings: {
    title: "Nastavení",
    appearance: "Vzhled",
    theme: {
      light: "Světlý",
      gray: "Šedý",
      dark: "Tmavý",
      banana: "Banánový",
      strawberry: "Jahodový",
      peanut: "Arašídový",
      christmas: "Vánoční",
      halloween: "Halloween",
    },
    disableAnimations: "Vypnout animace",
    language: "Jazyk",
    disableNonsense: "Vypnout japonský text",
    modelSettings: "Nastavení modelu",
    jtp2ModelPath: "Cesta k JTP2 modelu",
    jtp2TagsPath: "Cesta k JTP2 tagům",
    downloadModel: "Stáhnout model (1.8GB)",
    downloadTags: "Stáhnout tagy (195KB)",
    viewMode: "Režim zobrazení",
    gridView: "Mřížka",
    listView: "Seznam",
    sortBy: "Seřadit podle",
    sortByName: "Seřadit podle názvu",
    sortByDate: "Seřadit podle data",
    sortBySize: "Seřadit podle velikosti",
    experimentalFeatures: "Experimentální funkce",
    enableZoom: "Povolit přiblížení",
    enableMinimap: "Povolit minimapu při přiblížení",
    alwaysShowCaptionEditor: "Vždy zobrazit editor popisků",
    instantDelete: "Povolit okamžité mazání (bez potvrzení)",
    warning: "Varování",
    gallery: "Galerie",
    preserveLatents: "Uchovat Latents",
    preserveLatentsTooltip: "Uchovejte soubory .npz (latent) při mazání obrázků.",
    preserveTxt: "Uchovat .txt",
    preserveTxtTooltip: "Uchovejte soubory .txt při mazání obrázků.",
    thumbnailSize: "Velikost náhledů",
    thumbnailSizeDescription: "Velikost náhledů v pixelech (např. 250)",
    thumbnailSizeUpdateError: "Nepodařilo se aktualizovat velikost náhledů",
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
    imageWork: "Práce s obrázky",
    audioWork: "Práce se zvukem",
    deselectAll: "Zrušit výběr",
    deleteSelected: "Smazat vybrané",
  },
  gallery: {
    addTag: "Přidat štítek",
    addCaption: "Přidat popisek",
    quickJump: "Rychlý skok",
    loadingFolders: "Načítání složek...",
    noResults: "Žádné výsledky",
    folderCount: createPluralTranslation({
      one: "1 složka",
      other: "${count} složek"
    }, "cs"),
    fileCount: createPluralTranslation({
      one: "1 soubor",
      other: "${count} souborů"
    }, "cs"),
    imageCount: createPluralTranslation({
      one: "1 obrázek",
      other: "${count} obrázků"
    }, "cs"),
    foundFolders: createPluralTranslation({
      one: "Nalezena 1 složka",
      other: "Nalezeno ${count} složek"
    }, "cs"),
    deletedCount: createPluralTranslation({
      one: "Smazána 1 položka",
      other: "Smazáno ${count} položek"
    }, "cs"),
    deleteConfirm: (params: TranslationParams) => {
      const name = params.name ?? "tuto položku";
      return `Opravdu chcete smazat "${name}"?`;
    },
    deleteSuccess: "Úspěšně smazáno",
    deleteError: (params: TranslationParams) => {
      const name = params.name ?? "položku";
      return `Chyba při mazání "${name}"`;
    },
    savingCaption: (params: TranslationParams) => {
      const name = params.name ?? "položku";
      return `Ukládání popisku pro "${name}"...`;
    },
    savedCaption: "Popisek uložen",
    errorSavingCaption: (params: TranslationParams) => {
      const name = params.name ?? "položku";
      return `Chyba při ukládání popisku pro "${name}"`;
    },
    emptyFolder: "Tato složka je prázdná",
    dropToUpload: "Přetáhněte soubory pro nahrání",
    uploadProgress: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Nahrávání souborů...';
      }
      return createPluralTranslation({
        one: "Nahrávání 1 souboru...",
        other: "Nahrávání ${count} souborů..."
      }, "cs")(params);
    },
    uploadProgressPercent: "Nahrávání... {progress}%",
    filesExceedLimit: "Soubory jsou příliš velké: {files}",
    noFilesToUpload: "Žádné soubory k nahrání",
    processingFiles: "Zpracování souborů...",
    uploadComplete: "Nahrávání dokončeno",
    uploadFailed: "Nahrávání selhalo: {error}",
    deletingFiles: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Mazání souborů...';
      }
      return createPluralTranslation({
        one: "Mazání 1 souboru...",
        other: "Mazání ${count} souborů..."
      }, "cs")(params);
    },
    deleteComplete: "Mazání dokončeno",
    deleteFailed: "Mazání selhalo",
    processingImage: (params: TranslationParams) => {
      const name = params.name ?? "obrázek";
      return `Zpracování "${name}"...`;
    },
    processingImages: createPluralTranslation({
      one: "Zpracování 1 obrázku...",
      other: "Zpracování ${count} obrázků..."
    }, "cs"),
    generatingCaption: "Generování popisku...",
    captionGenerated: "Popisek vygenerován",
    generateTags: "Generovat štítky",
    generatingTags: "Generování štítků...",
    removeTags: "Odstranit štítky",
    createCaption: "Vytvořit popisek",
    captionTypes: {
      txt: "Txt",
      tags: "Štítky",
      caption: "Popisek",
      wd: "WD",
    },
    noCaptionFiles: "Žádné soubory s popisky",
    uploadError: "Chyba nahrávání",
    dropOverlay: "Pusťte pro nahrání",
    selectAll: "Vybrat vše",
    deselectAll: "Zrušit výběr",
    deleteSelected: "Smazat vybrané",
    confirmMultiDelete: (params: TranslationParams | null | undefined = {}) => {
      if (!params || typeof params !== 'object') {
        return 'Opravdu chcete smazat tyto položky?';
      }
      const folders = typeof params.folders === 'number' ? params.folders : 0;
      const images = typeof params.images === 'number' ? params.images : 0;
      
      if (folders === 0 && images === 0) {
        return 'Opravdu chcete smazat tyto položky?';
      }

      const parts = [];
      if (folders > 0) {
        parts.push(createPluralTranslation({
          one: "1 složku",
          other: "${count} složek"
        }, "cs")({ count: folders }));
      }
      if (images > 0) {
        parts.push(createPluralTranslation({
          one: "1 obrázek",
          other: "${count} obrázků"
        }, "cs")({ count: images }));
      }
      return `Opravdu chcete smazat ${parts.join(" a ")}?`;
    },
    confirmFolderDelete: (params: TranslationParams) => {
      const name = params.name ?? "složku";
      return `Opravdu chcete smazat složku "${name}" a celý její obsah?`;
    },
    someFolderDeletesFailed: "Některé složky se nepodařilo smazat",
    folderDeleteError: "Chyba při mazání jedné nebo více složek",
    deletingFile: "Mazání souboru...",
    fileDeleteSuccess: "Soubor úspěšně smazán",
    fileDeleteError: "Chyba při mazání jednoho nebo více souborů",
    createFolder: "Vytvořit složku",
    folderNamePlaceholder: "Název složky",
    deleteConfirmation: "Potvrzení smazání",
    selectedCount: createPluralTranslation({
      one: "Vybrána 1 položka",
      other: "Vybráno ${count} položek"
    }, "cs"),
    folderLocation: (params: TranslationParams) => {
      const name = params.name ?? "";
      return `Umístění: ${name}`;
    },
    moveToFolder: (params: TranslationParams) => {
      const name = params.name ?? "složka";
      return `Přesunout do "${name}"`;
    },
    workWithFolder: (params: TranslationParams) => {
      const name = params.name ?? "složka";
      return `Pracovat se složkou "${name}"`;
    },
  },
  shortcuts: {
    title: "Klávesové zkratky",
    galleryNavigation: "Navigace v galerii",
    quickFolderSwitch: "Rychlé přepínání složek",
    aboveImage: "Obrázek nahoře",
    belowImage: "Obrázek dole",
    previousImage: "Předchozí obrázek",
    nextImage: "Další obrázek",
    togglePreview: "Přepnout náhled",
    tagNavigation: "Navigace štítků",
    previousTag: "Předchozí štítek",
    nextTag: "Další štítek",
    switchTagBubble: "Přepnout bublinu štítku",
    switchTagInput: "Přepnout vstup štítku",
    cycleCaptions: "Procházet popisky",
    firstTagRow: "První řádek štítků",
    lastTagRow: "Poslední řádek štítků",
    doubleShift: "Dvojitý Shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Odstranit štítek",
    other: "Ostatní",
    esc: "Esc",
    closePreview: "Zavřít náhled",
    deleteImage: "Smazat obrázek",
    toggleImagePreview: "Přepnout náhled obrázku",
    copyToClipboard: "Kopírovat do schránky",
  },
  imageViewer: {
    zoomIn: "Přiblížit",
    zoomOut: "Oddálit",
    resetZoom: "Resetovat přiblížení",
    toggleMinimap: "Přepnout minimapu",
    previousImage: "Předchozí obrázek",
    nextImage: "Další obrázek",
    copyPath: "Kopírovat cestu",
    openInNewTab: "Otevřít v nové záložce",
    fitToScreen: "Přizpůsobit obrazovce",
    actualSize: "Skutečná velikost",
    rotateLeft: "Otočit doleva",
    rotateRight: "Otočit doprava",
    downloadImage: "Stáhnout obrázek",
    imageInfo: "Informace o obrázku",
    dimensions: "Rozměry",
  },
  tools: {
    removeCommas: "Odstranit čárky",
    replaceNewlinesWithCommas: "Nahradit nové řádky čárkami",
    replaceUnderscoresWithSpaces: "Nahradit podtržítka mezerami",
  },
  notifications: {
    imageCopied: "Obrázek zkopírován",
    imageCopyFailed: "Nepodařilo se zkopírovat obrázek",
    folderCreated: "Složka vytvořena",
    folderCreateError: "Nepodařilo se vytvořit složku",
    generatingCaption: "Generování popisku...",
    captionGenerated: "Popisek vygenerován",
    connectionLost: "Ztráta připojení",
    connectionRestored: "Připojení obnoveno",
  },
} as const satisfies Translations;
