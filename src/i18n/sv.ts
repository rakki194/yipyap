import { getPathSeparator } from "~/i18n";

export default {
  common: {
    close: "Stäng",
    delete: "Radera",
    cancel: "Avbryt",
    save: "Spara",
    edit: "Redigera",
    add: "Lägg till",
    remove: "Ta bort",
    loading: "Laddar...",
    error: "Fel",
    success: "Klart",
    confirm: "Bekräfta",
    download: "Ladda ner",
    path: "Sökväg",
    size: "Storlek",
    date: "Datum",
    name: "Namn",
    type: "Typ",
    actions: "Åtgärder",
    search: "Sök...",
    filter: "Filtrera",
    apply: "Tillämpa",
    reset: "Återställ",
    selected: "Vald",
    all: "Alla",
    none: "Ingen",
    pathSeparator: getPathSeparator("sv"),
    toggleTheme: "Växla tema",
    theme: "Tema",
    returnToFrontPage: "Återgå till startsidan",
    home: "Hem",
    openSettings: "Öppna inställningar",
  },
  settings: {
    title: "Inställningar",
    appearance: "Utseende",
    theme: {
      light: "Ljust",
      gray: "Grått",
      dark: "Mörkt",
      banana: "Banan",
      strawberry: "Jordgubbe",
      peanut: "Jordnöt",
      christmas: "Jul",
      halloween: "Halloween",
    },
    disableAnimations: "Inaktivera animationer",
    language: "Språk",
    disableNonsense: "Inaktivera japansk text",
    modelSettings: "Modellinställningar",
    jtp2ModelPath: "JTP2-modellsökväg",
    jtp2TagsPath: "JTP2-taggsökväg",
    downloadModel: "Ladda ner modell (1,8 GB)",
    downloadTags: "Ladda ner taggar (195 KB)",
    viewMode: "Visningsläge",
    gridView: "Rutnätsvy",
    listView: "Listvy",
    sortBy: "Sortera efter",
    sortByName: "Sortera efter namn",
    sortByDate: "Sortera efter datum",
    sortBySize: "Sortera efter storlek",
    experimentalFeatures: "Experimentella funktioner",
    enableZoom: "Aktivera bildzoom",
    enableMinimap: "Aktivera minikarta vid zoom",
    instantDelete: "Aktivera direktradering (hoppar över bekräftelse)",
    warning: "Varning",
    gallery: "Galleri",
    preserveLatents: "Bevara Latents",
    preserveLatentsTooltip: "Bevara .npz (latent) filer när du tar bort bilder.",
    preserveTxt: "Bevara .txt",
    preserveTxtTooltip: "Bevara .txt-filer när du tar bort bilder.",
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
    imageWork: "Arbeta med bilder",
    audioWork: "Arbeta med ljud",
  },
  gallery: {
    addTag: "Lägg till tagg...",
    addCaption: "Lägg till bildtext...",
    quickJump: "Hoppa till mapp...",
    loadingFolders: "Laddar mappar...",
    noResults: "Inga resultat hittades",
    folderCount: "{count} mappar",
    deleteConfirm: "Är du säker på att du vill radera denna bild?",
    deleteSuccess: "Bilden har raderats",
    deleteError: "Fel vid radering av bild",
    savingCaption: "Sparar bildtext...",
    savedCaption: "Bildtext sparad",
    errorSavingCaption: "Fel vid sparande av bildtext",
    emptyFolder: "Denna mapp är tom",
    dropToUpload: "Släpp filer här för att ladda upp",
    uploadProgress: "Laddar upp {count} filer...",
    processingImage: "Bearbetar bild...",
    generateTags: "Generera taggar",
    generatingTags: "Genererar taggar...",
    removeTags: "Ta bort taggar",
    createCaption: "Skapa bildtext",
    captionTypes: {
      txt: "Skapa ny textfil",
      tags: "Skapa ny .tags-fil",
      caption: "Skapa ny .caption-fil",
      wd: "Skapa ny .wd-fil"
    },
    noCaptionFiles: "Inga bildtextfiler än!",
  },
  shortcuts: {
    title: "Kortkommandon",
    galleryNavigation: "Gallerinavigering",
    quickFolderSwitch: "Snabb mappväxling",
    aboveImage: "Bilden ovanför",
    belowImage: "Bilden nedanför",
    previousImage: "Föregående bild",
    nextImage: "Nästa bild",
    togglePreview: "Växla förhandsvisning",
    tagNavigation: "Taggnavigering",
    previousTag: "Föregående tagg",
    nextTag: "Nästa tagg",
    switchTagBubble: "Växla till taggbubbelredigering",
    switchTagInput: "Växla till tagginmatning",
    cycleCaptions: "Bläddra genom bildtexter",
    firstTagRow: "Första taggen i raden",
    lastTagRow: "Sista taggen i raden",
    doubleShift: "Dubbel Shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Ta bort tagg",
    other: "Övrigt",
    esc: "Esc",
    closePreview: "Stäng förhandsvisning/modal",
    deleteImage: "Radera bild",
    toggleImagePreview: "Växla bildförhandsvisning",
    copyToClipboard: "Kopiera bild till urklipp",
  },
  imageViewer: {
    zoomIn: "Zooma in",
    zoomOut: "Zooma ut",
    resetZoom: "Återställ zoom",
    toggleMinimap: "Växla minikarta",
    previousImage: "Föregående bild",
    nextImage: "Nästa bild",
    copyPath: "Kopiera sökväg",
    openInNewTab: "Öppna i ny flik",
    fitToScreen: "Anpassa till skärm",
    actualSize: "Verklig storlek",
    rotateLeft: "Rotera vänster",
    rotateRight: "Rotera höger",
    downloadImage: "Ladda ner bild",
    imageInfo: "Bildinformation",
    dimensions: "Dimensioner",
  },
  tools: {
    removeCommas: "Ta bort kommatecken",
    replaceNewlinesWithCommas: "Ersätt radbrytningar med kommatecken",
    replaceUnderscoresWithSpaces: "Ersätt understreck med mellanslag",
  },
  notifications: {
    imageCopied: "Bild kopierad till urklipp",
    imageCopyFailed: "Kunde inte kopiera bild till urklipp",
  },
};
