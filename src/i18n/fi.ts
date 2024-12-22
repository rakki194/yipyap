import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "./types";
import { createPluralTranslation } from "./plurals";

export default {
  common: {
    close: "Sulje",
    delete: "Poista",
    cancel: "Peruuta",
    save: "Tallenna",
    edit: "Muokkaa",
    add: "Lisää",
    remove: "Poista",
    loading: "Ladataan...",
    error: "Virhe",
    success: "Onnistui",
    confirm: "Vahvista",
    download: "Lataa",
    path: "Polku",
    size: "Koko",
    date: "Päivämäärä",
    name: "Nimi",
    type: "Tyyppi",
    actions: "Toiminnot",
    search: "Hae...",
    filter: "Suodata",
    apply: "Käytä",
    reset: "Nollaa",
    selected: "Valittu",
    all: "Kaikki",
    none: "Ei mitään",
    pathSeparator: getPathSeparator("fi"),
    toggleTheme: "Vaihda teemaa",
    theme: "Teema",
    returnToFrontPage: "Palaa etusivulle",
    home: "Etusivu",
    openSettings: "Avaa asetukset",
    create: "Luo",
    creating: "Luodaan...",
  },
  settings: {
    title: "Asetukset",
    appearance: "Ulkoasu",
    theme: {
      light: "Vaalea",
      gray: "Harmaa",
      dark: "Tumma",
      banana: "Banaani",
      strawberry: "Mansikka",
      peanut: "Maapähkinä",
      christmas: "Joulu",
      halloween: "Halloween",
    },
    disableAnimations: "Poista animaatiot käytöstä",
    language: "Kieli",
    disableNonsense: "Poista japaninkielinen teksti käytöstä",
    modelSettings: (params: TranslationParams) => "Malliasetukset",
    jtp2ModelPath: "JTP2-mallin polku",
    jtp2TagsPath: "JTP2-tagien polku",
    downloadModel: "Lataa malli (1,8 Gt)",
    downloadTags: "Lataa tagit (195 kt)",
    viewMode: "Näkymätila",
    gridView: "Ruudukkonäkymä",
    listView: "Listanäkymä",
    sortBy: "Järjestä",
    sortByName: "Järjestä nimen mukaan",
    sortByDate: "Järjestä päivämäärän mukaan",
    sortBySize: "Järjestä koon mukaan",
    experimentalFeatures: "Kokeelliset ominaisuudet",
    enableZoom: "Ota zoomaus käyttöön",
    enableMinimap: "Ota pienoiskartta käyttöön zoomattaessa",
    alwaysShowCaptionEditor: "Näytä aina kuvatekstin muokkain",
    instantDelete: "Ota välitön poisto käyttöön (ohita vahvistus)",
    warning: "Varoitus",
    gallery: "Galleria",
    preserveLatents: "Säilytä Latents",
    preserveLatentsTooltip: "Säilytä .npz (latent) tiedostot kuvia poistaessa.",
    preserveTxt: "Säilytä .txt",
    preserveTxtTooltip: "Säilytä .txt-tiedostot kuvia poistaessa.",
    thumbnailSize: "Pikkukuvien koko",
    thumbnailSizeDescription: "Säädä gallerian pikkukuvien kokoa",
    thumbnailSizeUpdateError: "Virhe pikkukuvien koon päivityksessä",
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
    imageWork: "Työskentele kuvien kanssa",
    audioWork: "Työskentele äänen kanssa",
    deselectAll: "Poista kaikki valinnat",
    deleteSelected: "Poista valitut",
  },
  gallery: {
    addTag: "Lisää tagi...",
    addCaption: "Lisää kuvateksti...",
    quickJump: "Siirry kansioon...",
    loadingFolders: "Ladataan kansioita...",
    noResults: "Ei tuloksia",
    folderCount: (params?: TranslationParams) => `${params?.count ?? 0} kansiota`,
    deleteConfirm: (params: TranslationParams) => {
      const name = params.name ?? "tämä kohde";
      return `Haluatko varmasti poistaa kohteen "${name}"?`;
    },
    deleteSuccess: "Kuva poistettu onnistuneesti",
    deleteError: (params: TranslationParams) => {
      const name = params.name ?? "kohde";
      return `Virhe poistettaessa kohdetta "${name}"`;
    },
    savingCaption: (params: TranslationParams) => {
      const name = params.name ?? "kohde";
      return `Tallennetaan kuvatekstiä kohteelle "${name}"...`;
    },
    savedCaption: "Kuvateksti tallennettu",
    errorSavingCaption: (params: TranslationParams) => {
      const name = params.name ?? "kohde";
      return `Virhe tallennettaessa kuvatekstiä kohteelle "${name}"`;
    },
    emptyFolder: "Tämä kansio on tyhjä",
    dropToUpload: "Pudota tiedostot tähän ladataksesi",
    uploadProgress: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Ladataan tiedostoja...';
      }
      return createPluralTranslation({
        one: "Ladataan 1 tiedosto...",
        other: "Ladataan ${count} tiedostoa..."
      }, "fi")(params);
    },
    uploadProgressPercent: "Ladataan... {progress}%",
    processingImage: (params: TranslationParams) => {
      const name = params.name ?? "kuva";
      return `Käsitellään kuvaa "${name}"...`;
    },
    generateTags: "Luo tagit",
    generatingTags: "Luodaan tageja...",
    removeTags: "Poista tagit",
    createCaption: "Luo kuvateksti",
    captionTypes: {
      txt: "Luo uusi tekstitiedosto",
      tags: "Luo uusi .tags-tiedosto",
      caption: "Luo uusi .caption-tiedosto",
      wd: "Luo uusi .wd-tiedosto"
    },
    noCaptionFiles: "Ei vielä kuvatekstitiedostoja!",
    uploadError: "Lataus epäonnistui",
    dropOverlay: "Pudota tiedostot tai kansiot tähän",
    fileCount: (params?: TranslationParams) => `${params?.count ?? 0} tiedostoa`,
    imageCount: (params?: TranslationParams) => `${params?.count ?? 0} kuvaa`,
    foundFolders: (params?: TranslationParams) => `${params?.count ?? 0} kansiota löydetty`,
    deletedCount: (params?: TranslationParams) => `${params?.count ?? 0} kohdetta poistettu`,
    selectAll: "Valitse kaikki",
    deselectAll: "Poista kaikki valinnat",
    deleteSelected: "Poista valitut",
    confirmMultiDelete: (params: TranslationParams | null | undefined = {}) => {
      if (!params || typeof params !== 'object') {
        return 'Haluatko varmasti poistaa nämä kohteet?';
      }
      const folders = typeof params.folders === 'number' ? params.folders : 0;
      const images = typeof params.images === 'number' ? params.images : 0;
      
      if (folders === 0 && images === 0) {
        return 'Haluatko varmasti poistaa nämä kohteet?';
      }

      const parts = [];
      if (folders > 0) {
        parts.push(createPluralTranslation({
          one: "1 kansio",
          other: "${count} kansiota"
        }, "fi")({ count: folders }));
      }
      if (images > 0) {
        parts.push(createPluralTranslation({
          one: "1 kuva",
          other: "${count} kuvaa"
        }, "fi")({ count: images }));
      }
      return `Haluatko varmasti poistaa ${parts.join(" ja ")}?`;
    },
    confirmFolderDelete: (params: TranslationParams) => {
      const name = params.name ?? "kansio";
      return `Haluatko varmasti poistaa kansion "${name}" ja kaiken sen sisällön?`;
    },
    someFolderDeletesFailed: "Joidenkin kansioiden poisto epäonnistui",
    folderDeleteError: "Virhe kansion poistossa",
    deletingFile: "Poistetaan tiedostoa...",
    fileDeleteSuccess: "Tiedosto poistettu onnistuneesti",
    fileDeleteError: "Virhe tiedoston poistossa",
    createFolder: "Luo kansio",
    folderNamePlaceholder: "Kansion nimi",
    deleteConfirmation: "Poiston vahvistus",
    selectedCount: (params?: TranslationParams) => `${params?.count ?? 0} valittu`,
    processingImages: (params?: TranslationParams) => `Käsitellään ${params?.count ?? 0} kuvaa...`,
    folderLocation: (params?: TranslationParams) => `Sijainti: ${params?.name ?? ''}`,
    moveToFolder: (params?: TranslationParams) => `Siirrä kansioon ${params?.name ?? ''}`,
    workWithFolder: (params?: TranslationParams) => `Työskentele kansion ${params?.name ?? ''} kanssa`,
    deletingFiles: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Poistetaan tiedostoja...';
      }
      return createPluralTranslation({
        one: "Poistetaan 1 tiedosto...",
        other: "Poistetaan ${count} tiedostoa..."
      }, "fi")(params);
    },
    processingFiles: "Käsitellään tiedostoja...",
    uploadComplete: "Lataus valmis",
    uploadFailed: "Lataus epäonnistui: {error}",
    deleteComplete: "Poisto valmis",
    deleteFailed: "Poisto epäonnistui",
    generatingCaption: "Luodaan kuvatekstiä...",
    captionGenerated: "Kuvateksti luotu",
    filesExceedLimit: "Tiedostot liian suuria: {files}",
    noFilesToUpload: "Ei tiedostoja ladattavaksi",
  },
  shortcuts: {
    title: "Pikanäppäimet",
    galleryNavigation: "Gallerian navigointi",
    quickFolderSwitch: "Nopea kansionvaihto",
    aboveImage: "Ylempi kuva",
    belowImage: "Alempi kuva",
    previousImage: "Edellinen kuva",
    nextImage: "Seuraava kuva",
    togglePreview: "Vaihda esikatselu",
    tagNavigation: "Tagien navigointi",
    previousTag: "Edellinen tagi",
    nextTag: "Seuraava tagi",
    switchTagBubble: "Vaihda tagikuplien muokkaukseen",
    switchTagInput: "Vaihda tagien syöttöön",
    cycleCaptions: "Selaa kuvatekstejä",
    firstTagRow: "Ensimmäinen tagi riviltä",
    lastTagRow: "Viimeinen tagi riviltä",
    doubleShift: "Tupla-Shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Poista tagi",
    other: "Muut",
    esc: "Esc",
    closePreview: "Sulje esikatselu/ikkuna",
    deleteImage: "Poista kuva",
    toggleImagePreview: "Vaihda kuvan esikatselu",
    copyToClipboard: "Kopioi kuva leikepöydälle",
  },
  imageViewer: {
    zoomIn: "Lähennä",
    zoomOut: "Loitonna",
    resetZoom: "Nollaa zoomaus",
    toggleMinimap: "Vaihda pienoiskartta",
    previousImage: "Edellinen kuva",
    nextImage: "Seuraava kuva",
    copyPath: "Kopioi polku",
    openInNewTab: "Avaa uudessa välilehdessä",
    fitToScreen: "Sovita näytölle",
    actualSize: "Todellinen koko",
    rotateLeft: "Käännä vasemmalle",
    rotateRight: "Käännä oikealle",
    downloadImage: "Lataa kuva",
    imageInfo: "Kuvan tiedot",
    dimensions: "Mitat",
  },
  tools: {
    removeCommas: "Poista pilkut",
    replaceNewlinesWithCommas: "Korvaa rivinvaihdot pilkuilla",
    replaceUnderscoresWithSpaces: "Korvaa alaviivat välilyönneillä",
  },
  notifications: {
    imageCopied: "Kuva kopioitu leikepöydälle",
    imageCopyFailed: "Kuvan kopiointi leikepöydälle epäonnistui",
    folderCreated: "Kansio luotu",
    folderCreateError: "Virhe kansion luonnissa",
    generatingCaption: "Kuvatekstiä luodaan...",
    captionGenerated: "Kuvateksti luotu",
    connectionLost: "Yhteys palvelimeen katkesi",
    connectionRestored: "Yhteys palvelimeen palautettu",
  },
} as const satisfies Translations;
 