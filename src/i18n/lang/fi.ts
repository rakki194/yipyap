import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "../types";
import { createPluralTranslation } from "../plurals";

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
    notFound: "404 - Sivua ei löytynyt",
    pathSeparator: getPathSeparator("fi"),
    toggleTheme: "Vaihda teemaa",
    theme: "Teema",
    returnToFrontPage: "Palaa etusivulle",
    home: "Etusivu",
    openSettings: "Avaa asetukset",
    create: "Luo",
    creating: "Luodaan...",
    language: "Kieli",
    description: "Kuvaus",
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
      "high-contrast-black": "Korkea kontrasti (musta)",
      "high-contrast-inverse": "Korkea kontrasti (käänteinen)",
    },
    disableAnimations: "Poista animaatiot käytöstä",
    disableAnimationsTooltip: "Poista kaikki animaatiot käytöstä paremman suorituskyvyn saavuttamiseksi",
    language: "Kieli",
    languageTooltip: "Vaihda käyttöliittymän kieltä",
    disableNonsense: "Poista japaninkielinen teksti käytöstä",
    disableNonsenseTooltip: "Piilota japaninkielinen teksti ja muut merkityksettömät elementit",
    modelSettings: (params: TranslationParams) => "Malliasetukset",
    jtp2ModelPath: "JTP2-mallin polku",
    jtp2ModelPathTooltip: "Polku JTP2-mallitiedostoon (.safetensors)",
    jtp2TagsPath: "JTP2-tagien polku",
    jtp2TagsPathTooltip: "Polku JTP2-tagitiedostoon (.json)",
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
    enableZoomTooltip: "Ota käyttöön zoomaus ja panorointi kuvankatselussa",
    enableMinimap: "Ota pienoiskartta käyttöön zoomattaessa",
    enableMinimapTooltip: "Näytä pienoiskartta zoomattaessa helpompaa navigointia varten",
    alwaysShowCaptionEditor: "Näytä aina kuvatekstin muokkain",
    alwaysShowCaptionEditorTooltip: "Pidä kuvatekstin muokkain aina auki",
    instantDelete: "Ota välitön poisto käyttöön (ohita vahvistus)",
    instantDeleteTooltip: "Poista tiedostot ilman vahvistusikkunaa",
    warning: "Varoitus",
    gallery: "Galleria",
    preserveLatents: "Säilytä Latents",
    preserveLatentsTooltip: "Säilytä .npz (latent) tiedostot kuvia siirrettäessä tai poistettaessa.",
    preserveTxt: "Säilytä .txt",
    preserveTxtTooltip: "Säilytä .txt-tiedostot kuvia siirrettäessä tai poistettaessa.",
    thumbnailSize: "Pikkukuvien koko",
    thumbnailSizeDescription: "Säädä gallerian pikkukuvien kokoa",
    thumbnailSizeUpdateError: "Virhe pikkukuvien koon päivityksessä",
    jtp2Threshold: "JTP2-kynnysarvo",
    jtp2ThresholdTooltip: "Luottamuskynnys JTP2-tageille (oletus: 0.35)",
    jtp2ForceCpu: "Pakota JTP2 käyttämään CPU:ta",
    jtp2ForceCpuTooltip: "Pakota JTP2 käyttämään CPU:ta GPU:n sijaan",
    wdv3GenThreshold: "Yleinen tagikynnys",
    wdv3GenThresholdTooltip: "Luottamuskynnys yleisille tageille (oletus: 0.35)",
    wdv3CharThreshold: "Hahmotagikynnys",
    wdv3CharThresholdTooltip: "Luottamuskynnys hahmojen tageille (oletus: 0.75)",
    wdv3ConfigUpdateError: "WDv3-asetusten päivitys epäonnistui",
    wdv3ForceCpu: "Pakota WDv3 käyttämään CPU:ta",
    wdv3ForceCpuTooltip: "Pakota WDv3 käyttämään CPU:ta GPU:n sijaan",
    wdv3ModelName: "WDv3-mallin nimi",
    wdv3ModelNameTooltip: "Käytettävän WDv3-mallin nimi",
  },
  gallery: {
    addTag: "Lisää tagi...",
    addCaption: "Lisää kuvateksti...",
    quickJump: "Siirry kansioon...",
    loadingFolders: "Ladataan kansioita...",
    uploadFiles: "Lataa tiedostoja",
    deleteCurrentFolder: "Poista nykyinen kansio",
    noResults: "Ei tuloksia",
    pathNotFound: "Polkua ei löydy",
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
    transformations: "Muunnokset",
    addTransformation: "Lisää muunnos",
    transformationType: "Muunnostyyppi",
    transformationTypes: {
      searchReplace: "Etsi ja korvaa",
      case: "Kirjainkoko",
      trim: "Leikkaus",
      wrap: "Kääri",
      number: "Numero"
    },
    transformationNamePlaceholder: "Syötä muunnoksen nimi...",
    transformationDescriptionPlaceholder: "Syötä muunnoksen kuvaus...",
    searchPattern: "Haettava teksti",
    searchPatternPlaceholder: "Syötä haettava teksti...",
    replacement: "Korvaava teksti",
    replacementPlaceholder: "Syötä korvaava teksti...",
    selectIcon: "Valitse kuvake",
    caseTypes: {
      upper: "ISOT KIRJAIMET",
      lower: "pienet kirjaimet",
      title: "Otsikon Kirjainkoko",
      sentence: "Lauseen kirjainkoko"
    },
    prefix: "Etuliite",
    suffix: "Jälkiliite",
    prefixPlaceholder: "Syötä etuliite...",
    suffixPlaceholder: "Syötä jälkiliite...",
    trimTypes: {
      all: "Kaikki",
      start: "Alusta",
      end: "Lopusta",
      duplicates: "Kaksoiskappaleet"
    },
    numberActions: {
      remove: "Poista numerot",
      format: "Muotoile numerot",
      extract: "Poimi numerot"
    },
    numberFormat: "Numeromuoto",
    numberFormatPlaceholder: "Syötä numeromuoto...",
    removeCommas: "Poista pilkut",
    replaceNewlinesWithCommas: "Korvaa rivinvaihdot pilkuilla",
    replaceUnderscoresWithSpaces: "Korvaa alaviivat välilyönneillä"
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
 