import { getPathSeparator } from "~/i18n";
import type { Translations } from "./types";

const translations: Translations = {
  common: {
    close: "Затвори",
    delete: "Изтрий",
    cancel: "Отказ",
    save: "Запази",
    edit: "Редактирай",
    add: "Добави",
    remove: "Премахни",
    loading: "Зареждане...",
    error: "Грешка",
    success: "Успешно",
    confirm: "Потвърди",
    download: "Изтегли",
    path: "Път",
    size: "Размер",
    date: "Дата",
    name: "Име",
    type: "Тип",
    actions: "Действия",
    search: "Търсене...",
    filter: "Филтър",
    apply: "Приложи",
    reset: "Нулиране",
    selected: "Избрано",
    all: "Всички",
    none: "Нищо",
    pathSeparator: getPathSeparator("bg"),
    toggleTheme: "Превключи тема",
    theme: "Тема",
    returnToFrontPage: "Обратно към началната страница",
    home: "Начало",
    openSettings: "Отвори настройки",
  },
  settings: {
    title: "Настройки",
    appearance: "Външен вид",
    theme: {
      light: "Светла",
      gray: "Сива",
      dark: "Тъмна",
      banana: "Бананова",
      strawberry: "Ягодова",
      peanut: "Фъстъчена",
      christmas: "Коледна",
      halloween: "Хелоуин",
    },
    disableAnimations: "Изключи анимациите",
    language: "Език",
    disableNonsense: "Изключи японския текст",
    modelSettings: "Настройки на модела",
    jtp2ModelPath: "Път до JTP2 модел",
    jtp2TagsPath: "Път до JTP2 тагове",
    downloadModel: "Изтегли модел (1.8GB)",
    downloadTags: "Изтегли тагове (195KB)",
    viewMode: "Режим на преглед",
    gridView: "Решетка",
    listView: "Списък",
    sortBy: "Сортирай по",
    sortByName: "Сортирай по име",
    sortByDate: "Сортирай по дата",
    sortBySize: "Сортирай по размер",
    experimentalFeatures: "Експериментални функции",
    enableZoom: "Активирай мащабиране",
    enableMinimap: "Активирай минимапа при мащабиране",
    instantDelete: "Активирай моментално изтриване (без потвърждение)",
    warning: "Предупреждение",
    gallery: "Галерия",
    preserveLatents: "Запази Latents",
    preserveLatentsTooltip: "Запазете .npz (latent) файловете при изтриване на изображения.",
    preserveTxt: "Запази .txt",
    preserveTxtTooltip: "Запазете .txt файловете при изтриване на изображения.",
    thumbnailSize: "Размер на миниатюрите",
    thumbnailSizeDescription: "Размер на миниатюрите в пиксели (напр. 250)",
    thumbnailSizeUpdateError: "Грешка при обновяване на размера на миниатюрите",
  },
  frontPage: {
    subtitle: {
      1: "Големите езикови модели мамят, лъжат и халюцинират. Точно като мен!",
      2: "Намерихме друг начин да се молим",
      3: "Безкрайната вселена се отразява в празните очи",
      4: "Ръждясало сърце, нов кълн",
      5: "Магично място, където сънят и реалността се пресичат",
      6: "Непозната територия, безкрайни възможности",
      7: "Вечна любов отвъд потока на времето",
      8: "Това ще ви изгони!",
    },
    imageWork: "Работа с изображения",
    audioWork: "Работа със звук",
  },
  gallery: {
    addTag: "Добави таг...",
    addCaption: "Добави надпис...",
    quickJump: "Бърз преход към папка...",
    loadingFolders: "Зареждане на папки...",
    noResults: "Няма намерени резултати",
    folderCount: "{count} папки",
    deleteConfirm: "Сигурни ли сте, че искате да изтриете това изображение?",
    deleteSuccess: "Изображението е изтрито успешно",
    deleteError: "Грешка при изтриване на изображението",
    savingCaption: "Запазване на надпис...",
    savedCaption: "Надписът е запазен",
    errorSavingCaption: "Грешка при запазване на надписа",
    emptyFolder: "Тази папка е празна",
    dropToUpload: "Пуснете файлове тук за качване",
    uploadProgress: "Качване на {count} файла...",
    processingImage: "Обработка на изображение...",
    generateTags: "Генерирай тагове",
    generatingTags: "Генериране на тагове...",
    removeTags: "Премахни тагове",
    createCaption: "Създай надпис",
    captionTypes: {
      txt: "Създай нов текстов файл",
      tags: "Създай нов .tags файл",
      caption: "Създай нов .caption файл",
      wd: "Създай нов .wd файл"
    },
    noCaptionFiles: "Все още няма файлове с надписи!",
    uploadError: "Качването се провали",
    dropOverlay: "Пуснете файлове или папки тук",
    selectAll: "Избери всички",
    deselectAll: "Отмени избора на всички",
    deleteSelected: "Изтрий избраните",
    confirmMultiDelete: "Сигурни ли сте, че искате да изтриете {count} изображения?",
    confirmFolderDelete: "Сигурни ли сте, че искате да изтриете папката {name}?",
    someFolderDeletesFailed: "Някои папки не можаха да бъдат изтрити",
    folderDeleteError: "Грешка при изтриване на папката",
    deletingFile: "Изтриване на файл...",
    fileDeleteSuccess: "Файлът е изтрит успешно",
    fileDeleteError: "Грешка при изтриване на файла",
  },
  shortcuts: {
    title: "Клавишни комбинации",
    galleryNavigation: "Навигация в галерията",
    quickFolderSwitch: "Бързо превключване на папки",
    aboveImage: "Изображение отгоре",
    belowImage: "Изображение отдолу",
    previousImage: "Предишно изображение",
    nextImage: "Следващо изображение",
    togglePreview: "Превключи преглед",
    tagNavigation: "Навигация на тагове",
    previousTag: "Предишен таг",
    nextTag: "Следващ таг",
    switchTagBubble: "Превключи към балони с тагове",
    switchTagInput: "Превключи към въвеждане на тагове",
    cycleCaptions: "Превърти надписите",
    firstTagRow: "Първи таг в реда",
    lastTagRow: "Последен таг в реда",
    doubleShift: "Двоен Shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Премахни таг",
    other: "Други",
    esc: "Esc",
    closePreview: "Затвори преглед/прозорец",
    deleteImage: "Изтрий изображение",
    toggleImagePreview: "Превключи преглед на изображение",
    copyToClipboard: "Копирай изображението в клипборда",
  },
  imageViewer: {
    zoomIn: "Увеличи",
    zoomOut: "Намали",
    resetZoom: "Нулирай мащаба",
    toggleMinimap: "Превключи минимапа",
    previousImage: "Предишно изображение",
    nextImage: "Следващо изображение",
    copyPath: "Копирай път",
    openInNewTab: "Отвори в нов раздел",
    fitToScreen: "Побери в екрана",
    actualSize: "Реален размер",
    rotateLeft: "Завърти наляво",
    rotateRight: "Завърти надясно",
    downloadImage: "Изтегли изображение",
    imageInfo: "Информация за изображението",
    dimensions: "Размери",
  },
  tools: {
    removeCommas: "Премахни запетаите",
    replaceNewlinesWithCommas: "Замени новите редове със запетаи",
    replaceUnderscoresWithSpaces: "Замени долните черти с интервали",
  },
  notifications: {
    imageCopied: "Изображението е копирано в клипборда",
    imageCopyFailed: "Неуспешно копиране на изображението в клипборда",
  },
};

export default translations; 