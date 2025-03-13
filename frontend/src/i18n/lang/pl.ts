import { getPathSeparator } from "~/i18n";
import { getPolishPlural } from "../utils";
import type { Translations, TranslationParams } from "../types";

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
    notFound: "404 - Strona nie znaleziona",
    pathSeparator: getPathSeparator("pl"),
    toggleTheme: "Przełącz motyw",
    theme: "Motyw",
    returnToFrontPage: "Powrót do strony głównej",
    home: "Strona główna",
    openSettings: "Otwórz ustawienia",
    create: "Utwórz",
    creating: "Tworzenie...",
    language: "Język",
    description: "Opis",
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
      "high-contrast-black": "Wysoki kontrast czarny",
      "high-contrast-inverse": "Wysoki kontrast odwrócony",
    },
    disableAnimations: "Wyłącz animacje",
    disableAnimationsTooltip: "Wyłącz wszystkie animacje w aplikacji",
    language: "Język",
    languageTooltip: "Wybierz język interfejsu",
    disableNonsense: "Wyłącz tekst japoński",
    disableNonsenseTooltip: "Wyłącz tekst japoński w aplikacji",
    modelSettings: "Ustawienia modelu",
    jtp2ModelPath: "Ścieżka modelu JTP2",
    jtp2ModelPathTooltip: "Ścieżka do pliku modelu JTP2",
    jtp2TagsPath: "Ścieżka tagów JTP2",
    jtp2TagsPathTooltip: "Ścieżka do pliku tagów JTP2",
    jtp2Threshold: "Próg tagów JTP2",
    jtp2ThresholdTooltip: "Próg pewności dla włączenia tagów (od 0.0 do 1.0)",
    jtp2ForceCpu: "Wymuś CPU dla JTP2",
    jtp2ForceCpuTooltip: "Wymuś użycie CPU zamiast GPU dla JTP2",
    wdv3ModelName: "Model WDv3",
    wdv3ModelNameTooltip: "Wybierz architekturę modelu WDv3 (ViT, SwinV2 lub ConvNext)",
    wdv3GenThreshold: "Próg tagów ogólnych",
    wdv3GenThresholdTooltip: "Próg pewności dla tagów ogólnych (domyślnie 0.35)",
    wdv3CharThreshold: "Próg tagów postaci",
    wdv3CharThresholdTooltip: "Próg pewności dla tagów postaci (domyślnie 0.75)",
    wdv3ConfigUpdateError: "Nie udało się zaktualizować ustawień WDv3",
    wdv3ForceCpu: "Wymuś CPU dla WDv3",
    wdv3ForceCpuTooltip: "Wymuś użycie CPU zamiast GPU dla WDv3",
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
    enableZoomTooltip: "Włącz funkcję przybliżania dla obrazów",
    enableMinimap: "Włącz minimapę podczas przybliżania",
    enableMinimapTooltip: "Pokaż minimapę podczas przybliżania obrazów",
    alwaysShowCaptionEditor: "Zawsze pokazuj edytor podpisów",
    alwaysShowCaptionEditorTooltip: "Zawsze pokazuj edytor podpisów w galerii",
    instantDelete: "Włącz natychmiastowe usuwanie (bez potwierdzenia)",
    instantDeleteTooltip: "Usuń pliki natychmiast bez dialogu potwierdzenia",
    warning: "Ostrzeżenie",
    gallery: "Galeria",
    preserveLatents: "Preservuj Latents",
    preserveLatentsTooltip: "Zachowaj pliki .npz (latent) podczas przenoszenia lub usuwania obrazów.",
    preserveTxt: "Zachowaj .txt",
    preserveTxtTooltip: "Zachowaj pliki .txt podczas przenoszenia lub usuwania obrazów.",
    thumbnailSize: "Rozmiar miniatur",
    thumbnailSizeDescription: "Rozmiar miniatur w pikselach (np. 250)",
    thumbnailSizeUpdateError: "Nie udało się zaktualizować rozmiaru miniatur",
  },
  tools: {
    addTransformation: "Dodaj transformację",
    transformations: "Transformacje",
    transformationType: "Typ transformacji",
    transformationTypes: {
      searchReplace: "Wyszukaj i zamień",
      case: "Wielkość liter",
      trim: "Przycinanie",
      wrap: "Zawijanie",
      number: "Liczba"
    },
    caseTypes: {
      upper: "WIELKIE LITERY",
      lower: "małe litery",
      title: "Pierwsza Wielka",
      sentence: "Jak w zdaniu"
    },
    trimTypes: {
      all: "Wszystko",
      start: "Początek",
      end: "Koniec",
      duplicates: "Duplikaty"
    },
    numberActions: {
      remove: "Usuń",
      format: "Formatuj",
      extract: "Wyodrębnij"
    },
    numberFormat: "Format liczby",
    numberFormatPlaceholder: "Wprowadź format liczby...",
    prefix: "Prefiks",
    suffix: "Sufiks",
    prefixPlaceholder: "Wprowadź prefiks...",
    suffixPlaceholder: "Wprowadź sufiks...",
    transformationNamePlaceholder: "Nazwa transformacji...",
    transformationDescriptionPlaceholder: "Opis transformacji...",
    searchPattern: "Wzorzec wyszukiwania",
    searchPatternPlaceholder: "Wprowadź wzorzec wyszukiwania...",
    replacement: "Zamiana",
    replacementPlaceholder: "Wprowadź tekst zamiany...",
    selectIcon: "Wybierz ikonę",
    removeCommas: "Usuń przecinki",
    replaceNewlinesWithCommas: "Zamień nowe linie na przecinki",
    replaceUnderscoresWithSpaces: "Zamień podkreślenia na spacje"
  },
  gallery: {
    addTag: "Dodaj tag...",
    addCaption: "Dodaj podpis...",
    quickJump: "Przejdź do folderu...",
    loadingFolders: "Ładowanie folderów...",
    noResults: "Nie znaleziono wyników",
    pathNotFound: "Ścieżka nie znaleziona",
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
    uploadProgressPercent: (params?: TranslationParams) => `Przesyłanie... ${params?.progress}%`,
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
    filesExceedLimit: "Przekroczono limit plików",
    noFilesToUpload: "Brak plików do przesłania",
    processingFiles: "Przetwarzanie plików...",
    uploadComplete: "Przesyłanie zakończone",
    uploadFailed: "Przesyłanie nie powiodło się",
    deletingFiles: (params?: TranslationParams) => {
      if (!params?.count) return 'Usuwanie plików...';
      return `Usuwanie ${params.count} plików...`;
    },
    deleteComplete: "Usuwanie zakończone",
    deleteFailed: "Usuwanie nie powiodło się",
    generatingCaption: "Generowanie podpisu...",
    captionGenerated: "Podpis wygenerowany",
  },
  shortcuts: {
    title: "Skróty klawiszowe",
    galleryNavigation: "Nawigacja galerii",
    quickFolderSwitch: "Szybka zmiana folderu",
    aboveImage: "Obraz powyżej",
    belowImage: "Obraz poniżej",
    previousImage: "Poprzedni obraz",
    nextImage: "Następny obraz",
    togglePreview: "Przełącz podgląd (Enter/Space)",
    multiSelect: "Przełącz wybór wielokrotny (Shift+Enter/Shift+Space)",
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
    generatingCaption: "Generowanie podpisu...",
    captionGenerated: "Podpis został wygenerowany",
    connectionLost: "Utracono połączenie z serwerem",
    connectionRestored: "Połączenie z serwerem zostało przywrócone"
  }
} as const satisfies Translations;
