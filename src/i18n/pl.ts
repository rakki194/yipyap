import { getPathSeparator } from "~/i18n";
import { getPolishPlural } from "./utils";
import type { Translations, TranslationParams } from "./types";

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
    create: "Utwórz",
    creating: "Tworzenie...",
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
    disableAnimations: "Wyłącz animacje",
    language: "Język",
    disableNonsense: "Wyłącz tekst japoński",
    modelSettings: "Ustawienia modelu",
    jtp2ModelPath: "Ścieżka modelu JTP2",
    jtp2TagsPath: "Ścieżka tagów JTP2",
    downloadModel: "Pobierz model (1,8 GB)",
    downloadTags: "Pobierz tagi (195 KB)",
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
    preserveLatents: "Preservuj Latents",
    preserveLatentsTooltip: "Zachowaj pliki .npz (latent) podczas usuwania obrazów.",
    preserveTxt: "Zachowaj .txt",
    preserveTxtTooltip: "Zachowaj pliki .txt podczas usuwania obrazów.",
    thumbnailSize: "Rozmiar miniatur",
    thumbnailSizeDescription: "Rozmiar miniatur w pikselach (np. 250)",
    thumbnailSizeUpdateError: "Nie udało się zaktualizować rozmiaru miniatur",
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
    deselectAll: "Odznacz wszystkie",
    deleteSelected: "Usuń zaznaczone",
  },
  gallery: {
    addTag: "Dodaj tag...",
    addCaption: "Dodaj podpis...",
    quickJump: "Przejdź do folderu...",
    loadingFolders: "Ładowanie folderów...",
    noResults: "Nie znaleziono wyników",
    folderCount: (params?: TranslationParams) => `${params?.count ?? 0} folderów`,
    deleteConfirm: "Czy na pewno chcesz usunąć ten obraz?",
    deleteSuccess: "Obraz został usunięty",
    deleteError: "Błąd podczas usuwania obrazu",
    savingCaption: "Zapisywanie podpisu...",
    savedCaption: "Podpis zapisany",
    errorSavingCaption: "Błąd podczas zapisywania podpisu",
    emptyFolder: "Ten folder jest pusty",
    dropToUpload: "Upuść pliki tutaj, aby przesłać",
    uploadProgress: (params?: TranslationParams) => {
      if (!params?.count) return 'Przesyłanie plików...';
      return `Przesyłanie ${params.count} ${getPolishPlural(params.count, {
        singular: "plik",
        plural2_4: "pliki",
        plural5_: "plików"
      })}...`;
    },
    processingImage: "Przetwarzanie obrazu...",
    generateTags: "Generuj tagi",
    generatingTags: "Generowanie tagów...",
    removeTags: "Usuń tagi",
    createCaption: "Utwórz podpis",
    captionTypes: {
      txt: "Utwórz nowy plik tekstowy",
      tags: "Utwórz nowy plik .tags",
      caption: "Utwórz nowy plik .caption",
      wd: "Utwórz nowy plik .wd"
    },
    noCaptionFiles: "Brak plików podpisów!",
    foundFolders: (params?: TranslationParams) => `Znaleziono ${params?.count ?? 0} folderów`,
    deletedCount: (params?: TranslationParams) => `Usunięto ${params?.count ?? 0} elementów`,
    selectedCount: (params?: TranslationParams) => {
      if (!params?.count) return 'Nic nie wybrano';
      return `${params.count} ${getPolishPlural(params.count, {
        singular: "element wybrany",
        plural2_4: "elementy wybrane",
        plural5_: "elementów wybranych"
      })}`;
    },
    processingImages: (params?: TranslationParams) => `Przetwarzanie ${params?.count ?? 0} obrazów...`,
    folderLocation: (params?: TranslationParams) => `w ${params?.name ?? ''}`,
    moveToFolder: (params?: TranslationParams) => `Przenieś do ${params?.name ?? ''}`,
    workWithFolder: (params?: TranslationParams) => `Pracuj z ${params?.name ?? ''}`,
    createFolder: "Utwórz folder",
    folderNamePlaceholder: "Nazwa folderu",
    deleteConfirmation: "Potwierdź usunięcie",
    selectAll: "Zaznacz wszystkie",
    deselectAll: "Odznacz wszystkie",
    deleteSelected: "Usuń zaznaczone",
    uploadError: "Błąd przesyłania",
    dropOverlay: "Upuść pliki lub foldery tutaj",
    confirmMultiDelete: ({ folders = 0, images = 0 }) => {
      if (folders > 0 && images > 0) {
        return `Czy na pewno chcesz usunąć ${folders} ${getPolishPlural(folders, {
          singular: "folder",
          plural2_4: "foldery",
          plural5_: "folderów"
        })} i ${images} ${getPolishPlural(images, {
          singular: "obraz",
          plural2_4: "obrazy",
          plural5_: "obrazów"
        })}?`;
      } else if (folders > 0) {
        return `Czy na pewno chcesz usunąć ${folders} ${getPolishPlural(folders, {
          singular: "folder",
          plural2_4: "foldery",
          plural5_: "folderów"
        })}?`;
      }
      return `Czy na pewno chcesz usunąć ${images} ${getPolishPlural(images, {
        singular: "obraz",
        plural2_4: "obrazy",
        plural5_: "obrazów"
      })}?`;
    },
    confirmFolderDelete: ({ name = "" }) => `Czy na pewno chcesz usunąć folder ${name}?`,
    someFolderDeletesFailed: "Nie udało się usunąć niektórych folderów",
    folderDeleteError: "Błąd podczas usuwania folderu",
    deletingFile: "Usuwanie pliku...",
    fileDeleteSuccess: "Plik został usunięty",
    fileDeleteError: "Błąd podczas usuwania pliku",
    fileCount: (params?: TranslationParams) => {
      const count = params?.count ?? 0;
      return getPolishPlural(count, {
        singular: "plik",
        plural2_4: "pliki",
        plural5_: "plików"
      });
    },
    imageCount: (params?: TranslationParams) => {
      const count = params?.count ?? 0;
      return getPolishPlural(count, {
        singular: "obraz",
        plural2_4: "obrazy",
        plural5_: "obrazów"
      });
    },
  },
  shortcuts: {
    title: "Skróty klawiszowe",
    galleryNavigation: "Nawigacja galerii",
    quickFolderSwitch: "Szybka zmiana folderu",
    aboveImage: "Obraz powyżej",
    belowImage: "Obraz poniżej",
    previousImage: "Poprzedni obraz",
    nextImage: "Następny obraz",
    togglePreview: "Przełącz podgląd",
    tagNavigation: "Nawigacja tagów",
    previousTag: "Poprzedni tag",
    nextTag: "Następny tag",
    switchTagBubble: "Przełącz na bańki tagów",
    switchTagInput: "Przełącz na wprowadzanie tagów",
    cycleCaptions: "Przełączaj podpisy",
    firstTagRow: "Pierwszy tag w wierszu",
    lastTagRow: "Ostatni tag w wierszu",
    doubleShift: "Podwójny Shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Usuń tag",
    other: "Inne",
    esc: "Esc",
    closePreview: "Zamknij podgląd/modal",
    deleteImage: "Usuń obraz",
    toggleImagePreview: "Przełącz podgląd obrazu",
    copyToClipboard: "Kopiuj obraz do schowka",
  },
  imageViewer: {
    zoomIn: "Przybliż",
    zoomOut: "Oddal",
    resetZoom: "Resetuj przybliżenie",
    toggleMinimap: "Przełącz minimapę",
    previousImage: "Poprzedni obraz",
    nextImage: "Następny obraz",
    copyPath: "Kopiuj ścieżkę",
    openInNewTab: "Otwórz w nowej karcie",
    fitToScreen: "Dopasuj do ekranu",
    actualSize: "Rzeczywisty rozmiar",
    rotateLeft: "Obróć w lewo",
    rotateRight: "Obróć w prawo",
    downloadImage: "Pobierz obraz",
    imageInfo: "Informacje o obrazie",
    dimensions: "Wymiary",
  },
  notifications: {
    imageCopied: "Obraz skopiowany do schowka",
    imageCopyFailed: "Nie udało się skopiować obrazu do schowka",
    folderCreated: "Folder został utworzony",
    folderCreateError: "Nie udało się utworzyć folderu",
  },
  tools: {
    removeCommas: "Usuń przecinki",
    replaceNewlinesWithCommas: "Zamień nowe linie na przecinki",
    replaceUnderscoresWithSpaces: "Zamień podkreślenia na spacje",
  },
} as const satisfies Translations;
