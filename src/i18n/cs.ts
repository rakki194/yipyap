import { getPathSeparator } from "~/i18n";
import type { Translations } from "./types";

const translations: Translations = {
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
    layoutOptions: "Možnosti rozložení",
    disableAnimations: "Vypnout animace",
    language: "Jazyk",
    disableJapanese: "Vypnout japonský text",
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
    instantDelete: "Povolit okamžité mazání (bez potvrzení)",
    warning: "Varování",
    gallery: "Galerie",
  },
  frontPage: {
    subtitle: {
      1: "Velké jazykové modely podvádějí, lžou a halucinují. Stejně jako já!",
      2: "Našli jsme jiný způsob modlitby",
      3: "Nekonečný vesmír se odráží v prázdných očích",
      4: "Rezavé srdce, nový výhonek",
      5: "Kouzelné místo, kde se sen a realita protínají",
      6: "Neznámé území, nekonečné možnosti",
      7: "Věčná láska přesahující tok času",
      8: "Za tohle mě vyhodí!",
    },
    imageWork: "Práce s obrázky",
    audioWork: "Práce se zvukem",
  },
  gallery: {
    addTag: "Přidat tag...",
    addCaption: "Přidat popisek...",
    quickJump: "Přejít do složky...",
    loadingFolders: "Načítání složek...",
    noResults: "Žádné výsledky",
    folderCount: "{count} složek",
    deleteConfirm: "Opravdu chcete smazat tento obrázek?",
    deleteSuccess: "Obrázek byl úspěšně smazán",
    deleteError: "Chyba při mazání obrázku",
    savingCaption: "Ukládání popisku...",
    savedCaption: "Popisek uložen",
    errorSavingCaption: "Chyba při ukládání popisku",
    emptyFolder: "Tato složka je prázdná",
    dropToUpload: "Přetáhněte soubory pro nahrání",
    uploadProgress: "Nahrávání {count} souborů...",
    processingImage: "Zpracování obrázku...",
    generateTags: "Generovat tagy",
    generatingTags: "Generování tagů...",
    removeTags: "Odstranit tagy",
    createCaption: "Vytvořit popisek",
    captionTypes: {
      txt: "Vytvořit nový textový soubor",
      tags: "Vytvořit nový .tags soubor",
      caption: "Vytvořit nový .caption soubor",
      wd: "Vytvořit nový .wd soubor",
    },
    noCaptionFiles: "Zatím žádné soubory s popisky!",
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
    tagNavigation: "Navigace tagů",
    previousTag: "Předchozí tag",
    nextTag: "Další tag",
    switchTagBubble: "Přepnout na editaci tagů",
    switchTagInput: "Přepnout na vstup tagů",
    cycleCaptions: "Procházet popisky",
    firstTagRow: "První tag v řádku",
    lastTagRow: "Poslední tag v řádku",
    doubleShift: "Dvojitý Shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Odstranit tag",
    other: "Ostatní",
    esc: "Esc",
    closePreview: "Zavřít náhled/modální okno",
    deleteImage: "Smazat obrázek",
    toggleImagePreview: "Přepnout náhled obrázku",
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
};

export default translations; 