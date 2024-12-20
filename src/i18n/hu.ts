import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "./types";
import { getHungarianArticle, getHungarianArticleForWord, getHungarianSuffix } from "./utils";
import { createPluralTranslation } from "./plurals";

export default {
  common: {
    close: "Bezárás",
    delete: "Törlés",
    cancel: "Mégse",
    save: "Mentés",
    edit: "Szerkesztés",
    add: "Hozzáadás",
    remove: "Eltávolítás",
    loading: "Betöltés...",
    error: "Hiba",
    success: "Sikeres",
    confirm: "Megerősítés",
    download: "Letöltés",
    path: "Útvonal",
    size: "Méret",
    date: "Dátum",
    name: "Név",
    type: "Típus",
    actions: "Műveletek",
    search: "Keresés",
    filter: "Szűrés",
    apply: "Alkalmaz",
    reset: "Alaphelyzet",
    selected: "Kiválasztva",
    all: "Összes",
    none: "Nincs",
    pathSeparator: getPathSeparator("hu"),
    toggleTheme: "Téma váltása",
    theme: "Téma",
    returnToFrontPage: "Vissza a főoldalra",
    home: "Főoldal",
    openSettings: "Beállítások megnyitása",
    create: "Létrehozás",
    creating: "Létrehozás...",
  },
  settings: {
    title: "Beállítások",
    appearance: "Megjelenés",
    theme: {
      light: "Világos",
      dark: "Sötét",
      gray: "Szürke",
      banana: "Banán",
      strawberry: "Eper",
      peanut: "Mogyoró",
      halloween: "Halloween",
      christmas: "Karácsony",
    },
    disableAnimations: "Animációk kikapcsolása",
    language: "Nyelv",
    disableNonsense: "Japán nyelv kikapcsolása",
    modelSettings: ({ name = "ismeretlen" }) => 
      `${getHungarianArticleForWord(name)} ${name} modell beállításai`,
    jtp2ModelPath: "JTP2 modell útvonala",
    jtp2TagsPath: "JTP2 címkék útvonala",
    downloadModel: "Modell letöltése (1.8GB)",
    downloadTags: "Címkék letöltése (195KB)",
    viewMode: "Nézet mód",
    gridView: "Rács nézet",
    listView: "Lista nézet",
    sortBy: "Rendezés",
    sortByName: "Rendezés név szerint",
    sortByDate: "Rendezés dátum szerint",
    sortBySize: "Rendezés méret szerint",
    experimentalFeatures: "Kísérleti funkciók",
    enableZoom: "Nagyítás engedélyezése",
    enableMinimap: "Minitérkép engedélyezése",
    alwaysShowCaptionEditor: "Feliratszerkesztő állandó megjelenítése",
    instantDelete: "Azonnali törlés (megerősítés nélkül)",
    warning: "Figyelmeztetés",
    gallery: "Galéria",
    preserveLatents: "Megőrizze Latents",
    preserveLatentsTooltip: "Őrizze meg a .npz (latent) fájlokat képek törlésekor.",
    preserveTxt: "Megőrizze .txt",
    preserveTxtTooltip: "Őrizze meg a .txt fájlokat képek törlésekor.",
    thumbnailSize: "Bélyegkép mérete",
    thumbnailSizeDescription: "Bélyegképek mérete pixelben (pl. 250)",
    thumbnailSizeUpdateError: "Nem sikerült frissíteni a bélyegkép méretét",
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
    imageWork: "Képekkel való munka",
    audioWork: "Hanganyagokkal való munka",
    deselectAll: "Kijelölés megszüntetése",
    deleteSelected: "Kijelöltek törlése",
  },
  gallery: {
    addTag: "Címke hozzáadása...",
    addCaption: "Képaláírás hozzáadása...",
    quickJump: "Ugrás mappához...",
    loadingFolders: "Mappák betöltése...",
    noResults: "Nincs találat",
    folderCount: createPluralTranslation({
      one: "1 mappa",
      other: "${count} mappa"
    }, "hu"),
    fileCount: createPluralTranslation({
      one: "1 fájl",
      other: "${count} fájl"
    }, "hu"),
    imageCount: createPluralTranslation({
      one: "1 kép",
      other: "${count} kép"
    }, "hu"),
    foundFolders: createPluralTranslation({
      one: "1 mappa található",
      other: "${count} mappa található"
    }, "hu"),
    deletedCount: createPluralTranslation({
      one: "1 elem törölve",
      other: "${count} elem törölve"
    }, "hu"),
    deleteConfirm: ({ name = "kiválasztott" }) => 
      `Biztosan törölni szeretné ${getHungarianArticleForWord(name)} ${name} képet?`,
    deleteSuccess: "A kép sikeresen törölve",
    deleteError: ({ name = "kiválasztott" }) => 
      `Hiba történt ${getHungarianArticleForWord(name)} ${name} kép törlése közben`,
    savingCaption: ({ name = "kiválasztott" }) => 
      `${getHungarianArticleForWord(name)} ${name} képaláírás mentése...`,
    savedCaption: "Képaláírás mentve",
    errorSavingCaption: ({ name = "kiválasztott" }) => 
      `Hiba történt ${getHungarianArticleForWord(name)} ${name} képaláírás mentése közben`,
    emptyFolder: "Ez a mappa üres",
    dropToUpload: "Húzza ide a fájlokat a feltöltéshez",
    uploadProgress: createPluralTranslation({
      one: "1 fájl feltöltése...",
      other: "${count} fájl feltöltése..."
    }, "hu"),
    processingImage: ({ name = "kiválasztott" }) => 
      `${getHungarianArticleForWord(name)} ${name} kép feldolgozása...`,
    generateTags: "Címkék generálása",
    generatingTags: "Címkék generálása...",
    removeTags: "Címkék eltávolítása",
    createCaption: "Képaláírás létrehozása",
    captionTypes: {
      txt: "Új szövegfájl létrehozása",
      tags: "Új .tags fájl létrehozása",
      caption: "Új .caption fájl létrehozása",
      wd: "Új .wd fájl létrehozása"
    },
    noCaptionFiles: "Még nincsenek képaláírás fájlok!",
    uploadError: "A feltöltés sikertelen",
    dropOverlay: "Húzza ide a fájlokat vagy mappákat",
    selectAll: "Összes kijelölése",
    deselectAll: "Kijelölés megszüntetése",
    deleteSelected: "Kijelöltek törlése",
    confirmMultiDelete: ({ folders = 0, images = 0 }) => {
      if (folders > 0 && images > 0) {
        return `Biztosan törölni szeretné ezt a ${folders} mappát és ${images} képet?`;
      } else if (folders > 0) {
        return `Biztosan törölni szeretné ezt a ${folders} mappát?`;
      } else {
        return `Biztosan törölni szeretné ezt a ${images} képet?`;
      }
    },
    confirmFolderDelete: ({ name = "" }) => 
      `Biztosan törölni szeretné ezt a ${name} mappát?`,
    someFolderDeletesFailed: "Néhány mappát nem sikerült törölni",
    folderDeleteError: "Hiba történt a mappa törlése közben",
    deletingFile: "Fájl törlése...",
    fileDeleteSuccess: "Fájl sikeresen törölve",
    fileDeleteError: "Hiba történt a fájl törlése közben",
    createFolder: "Mappa létrehozása",
    folderNamePlaceholder: "Mappa neve",
    deleteConfirmation: "Törlés megerősítése",
    folderLocation: ({ name = "" }) => 
      `${name}${getHungarianSuffix(name, "ban", "ben")}`,
    moveToFolder: ({ name = "" }) =>
      `Áthelyezés ${name}${getHungarianSuffix(name, "ra", "re")}`,
    workWithFolder: ({ name = "" }) =>
      `Munka ${name}${getHungarianSuffix(name, "val", "vel")}`,
    selectedCount: createPluralTranslation({
      one: "1 elem kiválasztva",
      other: "${count} elem kiválasztva"
    }, "hu"),
    processingImages: createPluralTranslation({
      one: "1 kép feldolgozása...",
      other: "${count} kép feldolgozása..."
    }, "hu"),
  },
  shortcuts: {
    title: "Billentyűparancsok",
    galleryNavigation: "Galéria navigáció",
    quickFolderSwitch: "Gyors mappaváltás",
    aboveImage: "Felső kép",
    belowImage: "Alsó kép",
    previousImage: "Előző kép",
    nextImage: "Következő kép",
    togglePreview: "Előnézet kapcsolása",
    tagNavigation: "Címke navigáció",
    previousTag: "Előző címke",
    nextTag: "Következő címke",
    switchTagBubble: "Váltás címkebuborékra",
    switchTagInput: "Váltás címke bevitelre",
    cycleCaptions: "Képaláírások váltogatása",
    firstTagRow: "Első címke a sorban",
    lastTagRow: "Utolsó címke a sorban",
    doubleShift: "Dupla Shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Címke eltávolítása",
    other: "Egyéb",
    esc: "Esc",
    closePreview: "Előnézet/ablak bezárása",
    deleteImage: "Kép törlése",
    toggleImagePreview: "Kép előnézet kapcsolása",
    copyToClipboard: "Kép másolása a vágólapra",
  },
  imageViewer: {
    zoomIn: "Nagyítás",
    zoomOut: "Kicsinyítés",
    resetZoom: "Nagyítás alaphelyzetbe",
    toggleMinimap: "Minitérkép kapcsolása",
    previousImage: "Előző kép",
    nextImage: "Következő kép",
    copyPath: "Útvonal másolása",
    openInNewTab: "Megnyitás új lapon",
    fitToScreen: "Képernyőhöz igazítás",
    actualSize: "Eredeti méret",
    rotateLeft: "Forgatás balra",
    rotateRight: "Forgatás jobbra",
    downloadImage: "Kép letöltése",
    imageInfo: "Kép információ",
    dimensions: "Méretek",
  },
  tools: {
    removeCommas: "Vesszők eltávolítása",
    replaceNewlinesWithCommas: "Sortörések cseréje vesszőkre",
    replaceUnderscoresWithSpaces: "Aláhúzások cseréje szóközökre",
  },
  notifications: {
    imageCopied: "Kép másolva a vágólapra",
    imageCopyFailed: "Nem sikerült a képet a vágólapra másolni",
    folderCreated: "Mappa létrehozva",
    folderCreateError: "Hiba történt a mappa létrehozása közben",
    generatingCaption: "Képaláírás generálása...",
    captionGenerated: "Képaláírás generálva",
  },
} as const satisfies Translations;
