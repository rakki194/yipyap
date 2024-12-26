import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "../types";

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
    create: "Skapa",
    creating: "Skapar...",
    language: "Språk",
    description: "Beskrivning",
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
      "high-contrast-black": "Hög kontrast svart",
      "high-contrast-inverse": "Hög kontrast inverterad",
    },
    disableAnimations: "Inaktivera animationer",
    disableAnimationsTooltip: "Inaktivera alla animationer i applikationen",
    language: "Språk",
    languageTooltip: "Välj gränssnittsspråk",
    disableNonsense: "Inaktivera japansk text",
    disableNonsenseTooltip: "Inaktivera japansk text i applikationen",
    modelSettings: "Modellinställningar",
    jtp2ModelPath: "JTP2-modellsökväg",
    jtp2ModelPathTooltip: "Sökväg till JTP2-modellen",
    jtp2TagsPath: "JTP2-taggsökväg",
    jtp2TagsPathTooltip: "Sökväg till JTP2-taggar",
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
    enableZoomTooltip: "Aktivera zoomfunktionen för bilder",
    enableMinimap: "Aktivera minikarta vid zoom",
    enableMinimapTooltip: "Visa minikarta när du zoomar in på bilder",
    alwaysShowCaptionEditor: "Visa alltid bildtextredigeraren",
    alwaysShowCaptionEditorTooltip: "Visa alltid bildtextredigeraren i galleriet",
    instantDelete: "Aktivera direktradering (hoppar över bekräftelse)",
    instantDeleteTooltip: "Radera filer direkt utan bekräftelsedialog",
    warning: "Varning",
    gallery: "Galleri",
    preserveLatents: "Bevara Latents",
    preserveLatentsTooltip: "Bevara .npz (latent) filer när du flyttar eller raderar bilder.",
    preserveTxt: "Bevara .txt",
    preserveTxtTooltip: "Bevara .txt-filer när du flyttar eller raderar bilder.",
    thumbnailSize: "Miniatyrstorlek",
    thumbnailSizeDescription: "Justera storleken på miniatyrbilder i rutnätsvyn",
    thumbnailSizeUpdateError: "Kunde inte uppdatera miniatyrstorlek",
  },
  gallery: {
    addTag: "Lägg till tagg...",
    addCaption: "Lägg till bildtext...",
    quickJump: "Hoppa till mapp...",
    loadingFolders: "Laddar mappar...",
    noResults: "Inga resultat hittades",
    folderCount: (params?: TranslationParams) => `${params?.count ?? 0} mappar`,
    deleteConfirm: "Är du säker på att du vill radera denna bild?",
    deleteSuccess: "Bilden har raderats",
    deleteError: "Fel vid radering av bild",
    savingCaption: "Sparar bildtext...",
    savedCaption: "Bildtext sparad",
    errorSavingCaption: "Fel vid sparande av bildtext",
    emptyFolder: "Denna mapp är tom",
    dropToUpload: "Släpp filer här för att ladda upp",
    uploadProgress: (params?: TranslationParams) => {
      if (!params?.count) return 'Laddar upp filer...';
      return `Laddar upp ${params.count} filer...`;
    },
    uploadProgressPercent: (params?: TranslationParams) => `Laddar upp... ${params?.progress}%`,
    processingImage: "Bearbetar bild...",
    generateTags: "Generera taggar",
    generatingTags: "Genererar taggar...",
    removeTags: "Ta bort taggar",
    createCaption: "Skapa bildtext",
    captionTypes: {
      txt: "Skapa ny textfil",
      tags: "Skapa ny .tags-fil",
      caption: "Skapa ny .caption-fil",
      wd: "Skapa ny .wd-fil",
      e621: "Skapa ny .e621-fil"
    },
    noCaptionFiles: "Inga bildtextfiler än!",
    fileCount: (params?: TranslationParams) => `${params?.count ?? 0} filer`,
    imageCount: (params?: TranslationParams) => `${params?.count ?? 0} bilder`,
    foundFolders: (params?: TranslationParams) => `${params?.count ?? 0} mappar hittades`,
    selectedCount: (params?: TranslationParams) => `${params?.count ?? 0} valda`,
    selectAll: "Markera alla",
    createFolder: "Skapa mapp",
    moveToFolder: (params?: TranslationParams) => `Flytta till mapp "${params?.name ?? ''}"`,
    deletedCount: (params?: TranslationParams) => `${params?.count ?? 0} objekt raderade`,
    uploadError: "Kunde inte ladda upp fil",
    dropOverlay: "Släpp filer här",
    deselectAll: "Avmarkera alla",
    deleteSelected: "Radera markerade",
    confirmMultiDelete: ({ folders = 0, images = 0 }) => {
        if (folders && images) {
            return `Är du säker på att du vill radera ${folders} mappar och ${images} bilder?`;
        } else if (folders) {
            return `Är du säker på att du vill radera ${folders} mappar?`;
        }
        return `Är du säker på att du vill radera ${images} bilder?`;
    },
    confirmFolderDelete: ({ name = "" }) => `Är du säker på att du vill radera mappen ${name}?`,
    someFolderDeletesFailed: "Vissa mappar kunde inte raderas",
    folderDeleteError: "Kunde inte radera mapp",
    deletingFile: "Raderar fil...",
    fileDeleteSuccess: "Fil raderad",
    fileDeleteError: "Kunde inte radera fil",
    folderLocation: (params?: TranslationParams) => `i ${params?.name ?? ''}`,
    workWithFolder: (params?: TranslationParams) => `Arbeta med ${params?.name ?? ''}`,
    folderNamePlaceholder: "Mappnamn",
    deleteConfirmation: "Bekräfta radering",
    processingImages: (params?: TranslationParams) => `Bearbetar ${params?.count ?? 0} bilder...`,
    filesExceedLimit: "För många filer",
    noFilesToUpload: "Inga filer att ladda upp",
    processingFiles: "Bearbetar filer...",
    uploadComplete: "Uppladdning klar",
    uploadFailed: "Uppladdning misslyckades",
    deletingFiles: (params?: TranslationParams) => {
      if (!params?.count) return 'Raderar filer...';
      return `Raderar ${params.count} filer...`;
    },
    deleteComplete: "Radering klar",
    deleteFailed: "Radering misslyckades",
    generatingCaption: "Genererar bildtext...",
    captionGenerated: "Bildtext genererad",
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
    transformations: "Transformationer",
    transformationType: "Transformationstyp",
    transformationTypes: {
      searchReplace: "Sök och ersätt",
      case: "Skiftläge",
      trim: "Trimma",
      wrap: "Omslut",
      number: "Nummer"
    },
    caseTypes: {
      upper: "VERSALER",
      lower: "gemener",
      title: "Titel Format",
      sentence: "Meningsformat"
    },
    trimTypes: {
      all: "Alla",
      start: "Början",
      end: "Slutet",
      duplicates: "Dubletter"
    },
    numberActions: {
      remove: "Ta bort",
      format: "Formatera",
      extract: "Extrahera"
    },
    numberFormat: "Nummerformat",
    numberFormatPlaceholder: "Ange nummerformat...",
    prefix: "Prefix",
    suffix: "Suffix",
    prefixPlaceholder: "Ange prefix...",
    suffixPlaceholder: "Ange suffix...",
    transformationNamePlaceholder: "Transformationsnamn",
    transformationDescriptionPlaceholder: "Transformationsbeskrivning",
    searchPattern: "Sökmönster",
    searchPatternPlaceholder: "Ange sökmönster...",
    replacement: "Ersättning",
    replacementPlaceholder: "Ange ersättningstext...",
    selectIcon: "Välj ikon",
    removeCommas: "Ta bort kommatecken",
    replaceNewlinesWithCommas: "Ersätt radbrytningar med kommatecken",
    replaceUnderscoresWithSpaces: "Ersätt understreck med mellanslag",
    addTransformation: "Lägg till transformation"
  },
  notifications: {
    imageCopied: "Bild kopierad till urklipp",
    imageCopyFailed: "Kunde inte kopiera bild till urklipp",
    folderCreated: "Mapp skapad",
    folderCreateError: "Kunde inte skapa mapp",
    generatingCaption: "Genererar bildtext...",
    captionGenerated: "Bildtext genererad",
    connectionLost: "Anslutningen förlorad",
    connectionRestored: "Anslutningen återställd"
  },
} as const satisfies Translations;
