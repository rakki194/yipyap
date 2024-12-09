import { getPathSeparator } from "~/i18n";

export default {
  common: {
    close: "Zamknij",
    delete: "Usuń",
    cancel: "Anuluj",
    save: "Zapisz",
    edit: "Edytuj",
    add: "Dodaj",
    remove: "Usuń",
    loading: "Ładowanie...",
    error: "Błąd",
    success: "Sukces",
    confirm: "Potwierdź",
    download: "Pobierz",
    path: "Ścieżka",
    size: "Rozmiar",
    date: "Data",
    name: "Nazwa",
    type: "Typ",
    actions: "Akcje",
    search: "Szukaj...",
    filter: "Filtruj",
    apply: "Zastosuj",
    reset: "Reset",
    selected: "Wybrane",
    all: "Wszystkie",
    none: "Żadne",
    pathSeparator: getPathSeparator("pl"),
    toggleTheme: "Przełącz motyw",
    theme: "Motyw",
    returnToFrontPage: "Powrót do strony głównej",
    home: "Strona główna",
    openSettings: "Otwórz ustawienia",
  },
  settings: {
    title: "Ustawienia",
    appearance: "Wygląd",
    theme: {
      light: "Jasny",
      gray: "Szary",
      dark: "Ciemny",
      banana: "Bananowy",
      strawberry: "Truskawkowy",
      peanut: "Orzechowy",
      christmas: "Świąteczny",
      halloween: "Halloween",
    },
    layoutOptions: "Opcje układu",
    disableAnimations: "Wyłącz animacje",
    language: "Język",
    disableJapanese: "Wyłącz tekst japoński",
    modelSettings: "Ustawienia modelu",
    jtp2ModelPath: "Ścieżka modelu JTP2",
    jtp2TagsPath: "Ścieżka tagów JTP2",
    downloadModel: "Pobierz model (1.8GB)",
    downloadTags: "Pobierz tagi (195KB)",
    viewMode: "Tryb widoku",
    gridView: "Widok siatki",
    listView: "Widok listy",
    sortBy: "Sortuj według",
    sortByName: "Sortuj według nazwy",
    sortByDate: "Sortuj według daty",
    sortBySize: "Sortuj według rozmiaru",
    experimentalFeatures: "Funkcje eksperymentalne",
    enableZoom: "Włącz przybliżanie obrazów",
    enableMinimap: "Włącz minimapę podczas przybliżania",
    instantDelete: "Włącz natychmiastowe usuwanie (bez potwierdzenia)",
    warning: "Ostrzeżenie",
    gallery: "Galeria",
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
    imageWork: "Praca z obrazami",
    audioWork: "Praca z dźwiękiem",
  },
  gallery: {
    addTag: "Dodaj tag...",
    addCaption: "Dodaj podpis...",
    quickJump: "Przejdź do folderu...",
    loadingFolders: "Ładowanie folderów...",
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
    createCaption: "Utwórz podpis",
    captionTypes: {
      txt: "Utwórz nowy plik tekstowy",
      tags: "Utwórz nowy plik .tags",
      caption: "Utwórz nowy plik .caption",
      wd: "Utwórz nowy plik .wd"
    },
    noCaptionFiles: "Brak plików podpisów!",
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
};
