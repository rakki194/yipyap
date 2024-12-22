import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "./types";
import { createPluralTranslation } from "./plurals";

export default {
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
    create: "Създай",
    creating: "Създаване...",
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
    alwaysShowCaptionEditor: "Винаги показвай редактора на надписи",
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
      1: "大規模言語モデルは不正行為をし、嘘をつき、幻覚を見ます。まるで私のように！",
      2: "私たちは別の祈り方を見つけました",
      3: "虚ろな瞳に映る、無限の宇宙",
      4: "錆びた心、新たな芽吹き",
      5: "夢と現実が交錯する、不思議な境地",
      6: "未知の領域、無限の可能性",
      7: "時の流れを超えた、永遠の愛",
      8: "これで追い出されますよ！",
    },
    imageWork: "Работа с изображения",
    audioWork: "Работа с аудио",
    deselectAll: "Отмени избора на всички",
    deleteSelected: "Изтрий избраните",
  },
  gallery: {
    addTag: "Добави етикет",
    addCaption: "Добави надпис",
    quickJump: "Бързо прескачане",
    loadingFolders: "Зареждане на папки...",
    noResults: "Няма резултати",
    folderCount: createPluralTranslation({
      one: "1 папка",
      other: "${count} папки"
    }, "bg"),
    fileCount: createPluralTranslation({
      one: "1 файл",
      other: "${count} файла"
    }, "bg"),
    imageCount: createPluralTranslation({
      one: "1 изображение",
      other: "${count} изображения"
    }, "bg"),
    foundFolders: createPluralTranslation({
      one: "Намерена 1 папка",
      other: "Намерени ${count} папки"
    }, "bg"),
    deletedCount: createPluralTranslation({
      one: "Изтрит 1 елемент",
      other: "Изтрити ${count} елемента"
    }, "bg"),
    deleteConfirm: (params: TranslationParams) => {
      const name = params.name ?? "този елемент";
      return `Сигурни ли сте, че искате да изтриете "${name}"?`;
    },
    deleteSuccess: "Успешно изтриване",
    deleteError: (params: TranslationParams) => {
      const name = params.name ?? "елемент";
      return `Грешка при изтриване на "${name}"`;
    },
    savingCaption: (params: TranslationParams) => {
      const name = params.name ?? "елемент";
      return `Запазване на надпис за "${name}"...`;
    },
    savedCaption: "Надписът е запазен",
    errorSavingCaption: (params: TranslationParams) => {
      const name = params.name ?? "елемент";
      return `Грешка при запазване на надпис за "${name}"`;
    },
    emptyFolder: "Тази папка е празна",
    dropToUpload: "Пуснете файлове тук за качване",
    uploadProgress: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Качване на файлове...';
      }
      return createPluralTranslation({
        one: "Качване на 1 файл...",
        other: "Качване на ${count} файла..."
      }, "bg")(params);
    },
    uploadProgressPercent: "Качване... {progress}%",
    filesExceedLimit: "Файловете са твърде големи: {files}",
    noFilesToUpload: "Няма файлове за качване",
    processingFiles: "Обработка на файлове...",
    uploadComplete: "Качването завърши",
    uploadFailed: "Качването се провали: {error}",
    deletingFiles: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Изтриване на файлове...';
      }
      return createPluralTranslation({
        one: "Изтриване на 1 файл...",
        other: "Изтриване на ${count} файла..."
      }, "bg")(params);
    },
    deleteComplete: "Изтриването завърши",
    deleteFailed: "Изтриването се провали",
    processingImage: (params: TranslationParams) => {
      const name = params.name ?? "изображение";
      return `Обработка на "${name}"...`;
    },
    processingImages: createPluralTranslation({
      one: "Обработка на 1 изображение...",
      other: "Обработка на ${count} изображения..."
    }, "bg"),
    generatingCaption: "Генериране на надпис...",
    captionGenerated: "Надписът е генериран",
    generateTags: "Генерирай етикети",
    generatingTags: "Генериране на етикети...",
    removeTags: "Премахни етикети",
    createCaption: "Създай надпис",
    captionTypes: {
      txt: "Txt",
      tags: "Етикети",
      caption: "Надпис",
      wd: "WD",
    },
    noCaptionFiles: "Няма файлове с надписи",
    uploadError: "Грешка при качване",
    dropOverlay: "Пуснете за качване",
    selectAll: "Избери всички",
    deselectAll: "Отмени избора",
    deleteSelected: "Изтрий избраните",
    confirmMultiDelete: (params: TranslationParams | null | undefined = {}) => {
      if (!params || typeof params !== 'object') {
        return 'Сигурни ли сте, че искате да изтриете тези елементи?';
      }
      const folders = typeof params.folders === 'number' ? params.folders : 0;
      const images = typeof params.images === 'number' ? params.images : 0;
      
      if (folders === 0 && images === 0) {
        return 'Сигурни ли сте, че искате да изтриете тези елементи?';
      }

      const parts = [];
      if (folders > 0) {
        parts.push(createPluralTranslation({
          one: "1 папка",
          other: "${count} папки"
        }, "bg")({ count: folders }));
      }
      if (images > 0) {
        parts.push(createPluralTranslation({
          one: "1 изображение",
          other: "${count} изображения"
        }, "bg")({ count: images }));
      }
      return `Сигурни ли сте, че искате да изтриете ${parts.join(" и ")}?`;
    },
    confirmFolderDelete: (params: TranslationParams) => {
      const name = params.name ?? "папка";
      return `Сигурни ли сте, че искате да изтриете папката "${name}" и цялото ѝ съдържание?`;
    },
    someFolderDeletesFailed: "Някои папки не можаха да бъдат изтрити",
    folderDeleteError: "Грешка при изтриване на една или повече папки",
    deletingFile: "Изтриване на файл...",
    fileDeleteSuccess: "Файлът е изтрит успешно",
    fileDeleteError: "Грешка при изтриване на един или повече файла",
    createFolder: "Създай папка",
    folderNamePlaceholder: "Име на папка",
    deleteConfirmation: "Потвърждение за изтриване",
    selectedCount: createPluralTranslation({
      one: "Избран 1 елемент",
      other: "Избрани ${count} елемента"
    }, "bg"),
    folderLocation: (params: TranslationParams) => {
      const name = params.name ?? "";
      return `Местоположение: ${name}`;
    },
    moveToFolder: (params: TranslationParams) => {
      const name = params.name ?? "папка";
      return `Премести в "${name}"`;
    },
    workWithFolder: (params: TranslationParams) => {
      const name = params.name ?? "папка";
      return `Работа с "${name}"`;
    },
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
    tagNavigation: "Навигация на етикети",
    previousTag: "Предишен етикет",
    nextTag: "Следващ етикет",
    switchTagBubble: "Превключи етикет балон",
    switchTagInput: "Превключи въвеждане на етикет",
    cycleCaptions: "Превърти надписите",
    firstTagRow: "Първи ред етикети",
    lastTagRow: "Последен ред етикети",
    doubleShift: "Двоен Shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Премахни етикет",
    other: "Други",
    esc: "Esc",
    closePreview: "Затвори преглед",
    deleteImage: "Изтрий изображение",
    toggleImagePreview: "Превключи преглед на изображение",
    copyToClipboard: "Копирай в клипборда",
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
    imageCopied: "Изображението е копирано",
    imageCopyFailed: "Грешка при копиране на изображението",
    folderCreated: "Папката е създадена",
    folderCreateError: "Грешка при създаване на папката",
    generatingCaption: "Генериране на надпис...",
    captionGenerated: "Надписът е генериран",
    connectionLost: "Връзката е изгубена",
    connectionRestored: "Връзката е възстановена",
  },
} as const satisfies Translations;
