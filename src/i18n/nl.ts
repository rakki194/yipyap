import { getPathSeparator } from "~/i18n";

export default {
  common: {
    close: "Sluiten",
    delete: "Verwijderen",
    cancel: "Annuleren",
    save: "Opslaan",
    edit: "Bewerken",
    add: "Toevoegen",
    remove: "Verwijderen",
    loading: "Laden...",
    error: "Fout",
    success: "Succes",
    confirm: "Bevestigen",
    download: "Downloaden",
    path: "Pad",
    size: "Grootte",
    date: "Datum",
    name: "Naam",
    type: "Type",
    actions: "Acties",
    search: "Zoeken...",
    filter: "Filter",
    apply: "Toepassen",
    reset: "Herstellen",
    selected: "Geselecteerd",
    all: "Alles",
    none: "Geen",
    pathSeparator: getPathSeparator("nl"),
    toggleTheme: "Thema wisselen",
    theme: "Thema",
    returnToFrontPage: "Terug naar startpagina",
    home: "Home",
    openSettings: "Instellingen openen",
  },
  settings: {
    title: "Instellingen",
    appearance: "Uiterlijk",
    theme: {
      light: "Licht",
      gray: "Grijs",
      dark: "Donker",
      banana: "Banaan",
      strawberry: "Aardbei",
      peanut: "Pinda",
      christmas: "Kerst",
      halloween: "Halloween",
    },
    layoutOptions: "Layout-opties",
    disableAnimations: "Animaties uitschakelen",
    language: "Taal",
    disableJapanese: "Japanse tekst uitschakelen",
    modelSettings: "Modelinstellingen",
    jtp2ModelPath: "JTP2-modelpad",
    jtp2TagsPath: "JTP2-tagpad",
    downloadModel: "Model downloaden (1.8GB)",
    downloadTags: "Tags downloaden (195KB)",
    viewMode: "Weergavemodus",
    gridView: "Rasterweergave",
    listView: "Lijstweergave",
    sortBy: "Sorteren op",
    sortByName: "Sorteren op naam",
    sortByDate: "Sorteren op datum",
    sortBySize: "Sorteren op grootte",
    experimentalFeatures: "Experimentele functies",
    enableZoom: "Zoom inschakelen",
    enableMinimap: "Minimap inschakelen bij zoom",
    instantDelete: "Direct verwijderen inschakelen (zonder bevestiging)",
    warning: "Waarschuwing",
    gallery: "Galerij",
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
    imageWork: "Werken met afbeeldingen",
    audioWork: "Werken met audio",
  },
  gallery: {
    addTag: "Tag toevoegen...",
    addCaption: "Bijschrift toevoegen...",
    quickJump: "Naar map springen...",
    loadingFolders: "Mappen laden...",
    noResults: "Geen resultaten gevonden",
    folderCount: "{count} mappen",
    deleteConfirm: "Weet je zeker dat je deze afbeelding wilt verwijderen?",
    deleteSuccess: "Afbeelding succesvol verwijderd",
    deleteError: "Fout bij verwijderen van afbeelding",
    savingCaption: "Bijschrift opslaan...",
    savedCaption: "Bijschrift opgeslagen",
    errorSavingCaption: "Fout bij opslaan van bijschrift",
    emptyFolder: "Deze map is leeg",
    dropToUpload: "Sleep bestanden hier om te uploaden",
    uploadProgress: "{count} bestanden uploaden...",
    processingImage: "Afbeelding verwerken...",
    generateTags: "Tags genereren",
    generatingTags: "Tags genereren...",
    removeTags: "Tags verwijderen",
    createCaption: "Bijschrift maken",
    captionTypes: {
      txt: "Nieuw tekstbestand maken",
      tags: "Nieuw .tags-bestand maken",
      caption: "Nieuw .caption-bestand maken",
      wd: "Nieuw .wd-bestand maken"
    },
    noCaptionFiles: "Nog geen bijschriftbestanden!",
  },
  shortcuts: {
    title: "Sneltoetsen",
    galleryNavigation: "Galerijnavigatie",
    quickFolderSwitch: "Snel van map wisselen",
    aboveImage: "Afbeelding erboven",
    belowImage: "Afbeelding eronder",
    previousImage: "Vorige afbeelding",
    nextImage: "Volgende afbeelding",
    togglePreview: "Voorvertoning wisselen",
    tagNavigation: "Tagnavigatie",
    previousTag: "Vorige tag",
    nextTag: "Volgende tag",
    switchTagBubble: "Naar tagbubbels wisselen",
    switchTagInput: "Naar taginvoer wisselen",
    cycleCaptions: "Door bijschriften bladeren",
    firstTagRow: "Eerste tag in rij",
    lastTagRow: "Laatste tag in rij",
    doubleShift: "Dubbele Shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Tag verwijderen",
    other: "Overig",
    esc: "Esc",
    closePreview: "Voorvertoning/modal sluiten",
    deleteImage: "Afbeelding verwijderen",
    toggleImagePreview: "Afbeeldingsvoorvertoning wisselen",
  },
  imageViewer: {
    zoomIn: "Inzoomen",
    zoomOut: "Uitzoomen",
    resetZoom: "Zoom herstellen",
    toggleMinimap: "Minimap wisselen",
    previousImage: "Vorige afbeelding",
    nextImage: "Volgende afbeelding",
    copyPath: "Pad kopiëren",
    openInNewTab: "In nieuw tabblad openen",
    fitToScreen: "Aan scherm aanpassen",
    actualSize: "Werkelijke grootte",
    rotateLeft: "Naar links draaien",
    rotateRight: "Naar rechts draaien",
    downloadImage: "Afbeelding downloaden",
    imageInfo: "Afbeeldingsinformatie",
    dimensions: "Afmetingen",
  },
}; 