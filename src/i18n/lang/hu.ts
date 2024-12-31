import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "../types";
import { getHungarianArticle, getHungarianArticleForWord, getHungarianSuffix } from "../utils";
import { createPluralTranslation } from "../plurals";

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
    language: "Magyar",
    description: "Magyar nyelv",
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
      "high-contrast-black": "Magas kontraszt (fekete)",
      "high-contrast-inverse": "Magas kontraszt (inverz)",
    },
    disableAnimations: "Animációk kikapcsolása",
    disableAnimationsTooltip: "Minden animáció kikapcsolása a jobb teljesítmény érdekében",
    language: "Nyelv",
    languageTooltip: "A felület nyelvének módosítása",
    disableNonsense: "Japán nyelv kikapcsolása",
    disableNonsenseTooltip: "Japán szövegek és egyéb értelmetlen elemek elrejtése",
    modelSettings: ({ name = "ismeretlen" }) => 
      `${getHungarianArticleForWord(name)} ${name} modell beállításai`,
    jtp2ModelPath: "JTP2 modell útvonala",
    jtp2ModelPathTooltip: "JTP2 modell fájl (.safetensors) útvonala",
    jtp2TagsPath: "JTP2 címkék útvonala",
    jtp2TagsPathTooltip: "JTP2 címke fájl (.json) útvonala",
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
    enableZoomTooltip: "Nagyítás és mozgatás engedélyezése a képnézegetőben",
    enableMinimap: "Minitérkép engedélyezése",
    enableMinimapTooltip: "Minitérkép megjelenítése nagyításkor a könnyebb navigációhoz",
    alwaysShowCaptionEditor: "Feliratszerkesztő állandó megjelenítése",
    alwaysShowCaptionEditorTooltip: "Feliratszerkesztő folyamatos nyitva tartása",
    instantDelete: "Azonnali törlés (megerősítés nélkül)",
    instantDeleteTooltip: "Fájlok törlése megerősítő ablak nélkül",
    warning: "Figyelmeztetés",
    gallery: "Galéria",
    preserveLatents: "Megőrizze Latents",
    preserveLatentsTooltip: "Őrizze meg a .npz (latent) fájlokat képek mozgatásakor vagy törlésekor.",
    preserveTxt: "Megőrizze .txt",
    preserveTxtTooltip: "Őrizze meg a .txt fájlokat képek mozgatásakor vagy törlésekor.",
    thumbnailSize: "Bélyegkép mérete",
    thumbnailSizeDescription: "Bélyegképek mérete pixelben (pl. 250)",
    thumbnailSizeUpdateError: "Nem sikerült frissíteni a bélyegkép méretét",
    wdv3ForceCpu: "WDv3 CPU kényszerítése",
    wdv3ForceCpuTooltip: "WDv3 modell futtatása CPU-n GPU helyett",
    jtp2Threshold: "JTP2 küszöbérték",
    jtp2ThresholdTooltip: "Címkegenerálás megbízhatósági küszöbértéke JTP2-höz",
    jtp2ForceCpu: "JTP2 CPU kényszerítése",
    jtp2ForceCpuTooltip: "JTP2 modell futtatása CPU-n GPU helyett",
    wdv3ModelName: "WDv3 modell neve",
    wdv3ModelNameTooltip: "Használandó WDv3 modell neve",
    wdv3GenThreshold: "WDv3 generálási küszöb",
    wdv3GenThresholdTooltip: "Címkegenerálás megbízhatósági küszöbértéke WDv3-hoz",
    wdv3CharThreshold: "WDv3 karakter küszöb",
    wdv3CharThresholdTooltip: "Karakterek küszöbértéke WDv3 címkegeneráláshoz",
    wdv3ConfigUpdateError: "Hiba történt a WDv3 konfiguráció frissítésekor",
  },
  gallery: {
    addTag: "Címke hozzáadása",
    addCaption: "Felirat hozzáadása",
    quickJump: "Gyors ugrás",
    loadingFolders: "Mappák betöltése...",
    noResults: "Nincs találat",
    pathNotFound: "Útvonal nem található",
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
    deleteConfirm: (params: TranslationParams) => {
      const name = params.name ?? "ezt az elemet";
      return `Biztosan törli ${getHungarianArticle(name)} "${name}"?`;
    },
    deleteSuccess: "Törlés sikeres",
    deleteError: (params: TranslationParams) => {
      const name = params.name ?? "elem";
      return `Hiba történt ${getHungarianArticle(name)} "${name}" törlésekor`;
    },
    savingCaption: (params: TranslationParams) => {
      const name = params.name ?? "elem";
      return `Felirat mentése ${getHungarianArticle(name)} "${name}" elemhez...`;
    },
    savedCaption: "Felirat mentve",
    errorSavingCaption: (params: TranslationParams) => {
      const name = params.name ?? "elem";
      return `Hiba történt a felirat mentésekor ${getHungarianArticle(name)} "${name}" elemhez`;
    },
    emptyFolder: "Ez a mappa üres",
    dropToUpload: "Húzza ide a fájlokat a feltöltéshez",
    uploadProgress: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Fájlok feltöltése...';
      }
      return createPluralTranslation({
        one: "1 fájl feltöltése...",
        other: "${count} fájl feltöltése..."
      }, "hu")(params);
    },
    uploadProgressPercent: "Feltöltés... {progress}%",
    filesExceedLimit: "A fájlok túl nagyok: {files}",
    noFilesToUpload: "Nincsenek feltöltendő fájlok",
    processingFiles: "Fájlok feldolgozása...",
    uploadComplete: "Feltöltés kész",
    uploadFailed: "Feltöltés sikertelen: {error}",
    deletingFiles: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Fájlok törlése...';
      }
      return createPluralTranslation({
        one: "1 fájl törlése...",
        other: "${count} fájl törlése..."
      }, "hu")(params);
    },
    deleteComplete: "Törlés kész",
    deleteFailed: "Törlés sikertelen",
    processingImage: (params: TranslationParams) => {
      const name = params.name ?? "kép";
      return `"${name}" feldolgozása...`;
    },
    processingImages: createPluralTranslation({
      one: "1 kép feldolgozása...",
      other: "${count} kép feldolgozása..."
    }, "hu"),
    generatingCaption: "Felirat generálása...",
    captionGenerated: "Felirat generálva",
    generateTags: "Címkék generálása",
    generatingTags: "Címkék generálása...",
    removeTags: "Címkék eltávolítása",
    createCaption: "Felirat létrehozása",
    captionTypes: {
      txt: "Txt",
      tags: "Címkék",
      caption: "Felirat",
      wd: "WD",
    },
    noCaptionFiles: "Nincsenek felirat fájlok",
    uploadError: "Feltöltési hiba",
    dropOverlay: "Engedje el a feltöltéshez",
    selectAll: "Összes kijelölése",
    deselectAll: "Kijelölés megszüntetése",
    deleteSelected: "Kijelöltek törlése",
    confirmMultiDelete: (params: TranslationParams | null | undefined = {}) => {
      if (!params || typeof params !== 'object') {
        return 'Biztosan törli ezeket az elemeket?';
      }
      const folders = typeof params.folders === 'number' ? params.folders : 0;
      const images = typeof params.images === 'number' ? params.images : 0;
      
      if (folders === 0 && images === 0) {
        return 'Biztosan törli ezeket az elemeket?';
      }

      const parts = [];
      if (folders > 0) {
        parts.push(createPluralTranslation({
          one: "1 mappát",
          other: "${count} mappát"
        }, "hu")({ count: folders }));
      }
      if (images > 0) {
        parts.push(createPluralTranslation({
          one: "1 képet",
          other: "${count} képet"
        }, "hu")({ count: images }));
      }
      return `Biztosan törli ${parts.join(" és ")}?`;
    },
    confirmFolderDelete: (params: TranslationParams) => {
      const name = params.name ?? "mappa";
      return `Biztosan törli ${getHungarianArticle(name)} "${name}" mappát és annak teljes tartalmát?`;
    },
    someFolderDeletesFailed: "Néhány mappát nem sikerült törölni",
    folderDeleteError: "Hiba történt egy vagy több mappa törlésekor",
    deletingFile: "Fájl törlése...",
    fileDeleteSuccess: "Fájl sikeresen törölve",
    fileDeleteError: "Hiba történt egy vagy több fájl törlésekor",
    createFolder: "Mappa létrehozása",
    folderNamePlaceholder: "Mappa neve",
    deleteConfirmation: "Törlés megerősítése",
    selectedCount: createPluralTranslation({
      one: "1 elem kiválasztva",
      other: "${count} elem kiválasztva"
    }, "hu"),
    folderLocation: (params: TranslationParams) => {
      const name = params.name ?? "";
      return `Hely: ${name}`;
    },
    moveToFolder: (params: TranslationParams) => {
      const name = params.name ?? "mappa";
      return `Áthelyezés ${name}${getHungarianSuffix(name, "ra", "re")}`;
    },
    workWithFolder: (params: TranslationParams) => {
      const name = params.name ?? "mappa";
      return `Munka ${name}${getHungarianSuffix(name, "val", "vel")}`;
    },
  },
  shortcuts: {
    title: "Gyorsbillentyűk",
    galleryNavigation: "Galéria navigáció",
    quickFolderSwitch: "Gyors mappaváltás",
    aboveImage: "Felső kép",
    belowImage: "Alsó kép",
    previousImage: "Előző kép",
    nextImage: "Következő kép",
    togglePreview: "Előnézet be/ki",
    tagNavigation: "Címke navigáció",
    previousTag: "Előző címke",
    nextTag: "Következő címke",
    switchTagBubble: "Címke buborék váltás",
    switchTagInput: "Címke bevitel váltás",
    cycleCaptions: "Feliratok váltogatása",
    firstTagRow: "Első címke sor",
    lastTagRow: "Utolsó címke sor",
    doubleShift: "Dupla Shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Címke törlése",
    other: "Egyéb",
    esc: "Esc",
    closePreview: "Előnézet bezárása",
    deleteImage: "Kép törlése",
    toggleImagePreview: "Kép előnézet be/ki",
    copyToClipboard: "Vágólapra másolás",
  },
  imageViewer: {
    zoomIn: "Nagyítás",
    zoomOut: "Kicsinyítés",
    resetZoom: "Nagyítás alaphelyzetbe",
    toggleMinimap: "Minitérkép be/ki",
    previousImage: "Előző kép",
    nextImage: "Következő kép",
    copyPath: "Útvonal másolása",
    openInNewTab: "Megnyitás új lapon",
    fitToScreen: "Képernyőhöz igazítás",
    actualSize: "Eredeti méret",
    rotateLeft: "Forgatás balra",
    rotateRight: "Forgatás jobbra",
    downloadImage: "Kép letöltése",
    imageInfo: "Kép információk",
    dimensions: "Méretek",
  },
  tools: {
    prefix: "Előtag",
    suffix: "Utótag",
    prefixPlaceholder: "Előtag hozzáadása...",
    suffixPlaceholder: "Utótag hozzáadása...",
    transformationNamePlaceholder: "Átalakítás neve...",
    transformationDescriptionPlaceholder: "Átalakítás leírása...",
    searchPattern: "Keresési minta",
    searchPatternPlaceholder: "Keresendő szöveg...",
    replacement: "Csere",
    replacementPlaceholder: "Cserélendő szövegre...",
    addTransformation: "Átalakítás hozzáadása",
    transformations: "Átalakítások",
    transformationType: "Átalakítás típusa",
    transformationTypes: {
      searchReplace: "Keresés és csere",
      case: "Betűméret",
      trim: "Vágás",
      wrap: "Burkolás",
      number: "Szám"
    },
    caseTypes: {
      upper: "Nagybetű",
      lower: "Kisbetű", 
      title: "Címszerű",
      sentence: "Mondat"
    },
    trimTypes: {
      all: "Minden",
      start: "Eleje",
      end: "Vége",
      duplicates: "Duplikátumok"
    },
    numberActions: {
      remove: "Eltávolítás",
      format: "Formázás",
      extract: "Kinyerés"
    },
    numberFormat: "Szám formátum",
    numberFormatPlaceholder: "Szám formátum...",
    selectIcon: "Ikon kiválasztása",
    removeCommas: "Vesszők eltávolítása",
    replaceNewlinesWithCommas: "Sortörések cseréje vesszőkre",
    replaceUnderscoresWithSpaces: "Aláhúzások cseréje szóközökre"
  },
  notifications: {
    imageCopied: "Kép másolva",
    imageCopyFailed: "Nem sikerült másolni a képet",
    folderCreated: "Mappa létrehozva",
    folderCreateError: "Nem sikerült létrehozni a mappát",
    generatingCaption: "Felirat generálása...",
    captionGenerated: "Felirat generálva",
    connectionLost: "Megszakadt a kapcsolat",
    connectionRestored: "Helyreállt a kapcsolat",
  },
} as const satisfies Translations;
