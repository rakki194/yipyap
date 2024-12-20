import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "./types";

export default {
  common: {
    close: "Закрити",
    delete: "Видалити",
    cancel: "Скасувати",
    save: "Зберегти",
    edit: "Редагувати",
    add: "Додати",
    remove: "Видалити",
    loading: "Завантаження...",
    error: "Помилка",
    success: "Успішно",
    confirm: "Підтвердити",
    download: "Завантажити",
    path: "Шлях",
    size: "Розмір",
    date: "Дата",
    name: "Ім'я",
    type: "Тип",
    actions: "Дії",
    search: "Пошук...",
    filter: "Фільтр",
    apply: "Застосувати",
    reset: "Скинути",
    selected: "Вибрано",
    all: "Всі",
    none: "Жодного",
    pathSeparator: getPathSeparator("uk"),
    toggleTheme: "Перемкнути тему",
    theme: "Тема",
    returnToFrontPage: "Повернутися на головну",
    home: "Головна",
    openSettings: "Відкрити налаштування",
    create: "Створити",
    creating: "Створення...",
  },
  settings: {
    title: "Налаштування",
    appearance: "Зовнішній вигляд",
    theme: {
      light: "Світла",
      gray: "Сіра",
      dark: "Темна",
      banana: "Бананова",
      strawberry: "Полунична",
      peanut: "Арахісова",
      christmas: "Різдвяна",
      halloween: "Хеловінська",
    },
    disableAnimations: "Вимкнути анімації",
    language: "Мова",
    disableNonsense: "Вимкнути японський текст",
    modelSettings: "Налаштування моделі",
    jtp2ModelPath: "Шлях до моделі JTP2",
    jtp2TagsPath: "Шлях до тегів JTP2",
    downloadModel: "Завантажити модель (1,8 ГБ)",
    downloadTags: "Завантажити теги (195 КБ)",
    viewMode: "Режим перегляду",
    gridView: "Сітка",
    listView: "Список",
    sortBy: "Сортувати за",
    sortByName: "За ім'ям",
    sortByDate: "За датою",
    sortBySize: "За розміром",
    experimentalFeatures: "Експериментальні функції",
    enableZoom: "Увімкнути масштабування",
    enableMinimap: "Увімкнути мінікарту при масштабуванні",
    alwaysShowCaptionEditor: "Завжди показувати редактор підписів",
    instantDelete: "Миттєве видалення (без підтвердження)",
    warning: "Попередження",
    gallery: "Галерея",
    preserveLatents: "Зберегти Latents",
    preserveLatentsTooltip: "Зберігайте файли .npz (latent) при видаленні зображень.",
    preserveTxt: "Зберегти .txt",
    preserveTxtTooltip: "Зберігайте файли .txt при видаленні зображень.",
    thumbnailSize: "Розмір мініатюр",
    thumbnailSizeDescription: "Налаштувати розмір мініатюр у режимі сітки",
    thumbnailSizeUpdateError: "Помилка оновлення розміру мініатюр",
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
    imageWork: "Робота з зображеннями",
    audioWork: "Робота з аудіо",
    deselectAll: "Скасувати вибір",
    deleteSelected: "Видалити вибране",
  },
  gallery: {
    addTag: "Додати тег...",
    addCaption: "Додати підпис...",
    quickJump: "Перейти до папки...",
    loadingFolders: "Завантаження папок...",
    noResults: "Нічого не знайдено",
    folderCount: (params?: TranslationParams) => `${params?.count ?? 0} папок`,
    deleteConfirm: "Ви впевнені, що хочете видалити це зображення?",
    deleteSuccess: "Зображення успішно видалено",
    deleteError: "Помилка при видаленні",
    savingCaption: "Збереження підпису...",
    savedCaption: "Підпис збережено",
    errorSavingCaption: "Помилка при збереженні підпису",
    emptyFolder: "Ця папка порожня",
    dropToUpload: "Перетягніть файли для завантаження",
    uploadProgress: (params?: TranslationParams) => {
      if (!params?.count) return 'Завантаження файлів...';
      return `Завантаження ${params.count} файлів...`;
    },
    processingImage: "Обробка зображення...",
    generateTags: "Згенерувати теги",
    generatingTags: "Генерація тегів...",
    removeTags: "Видалити теги",
    createCaption: "Створити підпис",
    captionTypes: {
      txt: "Створити новий текстовий файл",
      tags: "Створити новий файл .tags",
      caption: "Створити новий файл .caption",
      wd: "Створити новий файл .wd"
    },
    noCaptionFiles: "Поки немає файлів підписів!",
    fileCount: (params?: TranslationParams) => `${params?.count ?? 0} файлів`,
    imageCount: (params?: TranslationParams) => `${params?.count ?? 0} зображень`,
    foundFolders: (params?: TranslationParams) => `Знайдено ${params?.count ?? 0} папок`,
    selectedCount: (params?: TranslationParams) => `Вибрано ${params?.count ?? 0}`,
    selectAll: "Вибрати все",
    createFolder: "Створити папку",
    moveToFolder: (params?: TranslationParams) => `Перемістити в папку "${params?.name ?? ''}"`,
    deletedCount: (params?: TranslationParams) => `Видалено ${params?.count ?? 0} елементів`,
    uploadError: "Помилка завантаження",
    dropOverlay: "Перетягніть файли сюди",
    deselectAll: "Скасувати вибір",
    deleteSelected: "Видалити вибране",
    confirmMultiDelete: ({ folders = 0, images = 0 }) => {
        if (folders && images) {
            return `Ви впевнені, що хочете видалити ${folders} папок та ${images} зображень?`;
        } else if (folders) {
            return `Ви впевнені, що хочете видалити ${folders} папок?`;
        }
        return `Ви впевнені, що хочете видалити ${images} зображень?`;
    },
    confirmFolderDelete: ({ name = "" }) => `Ви впевнені, що хочете видалити папку "${name}"?`,
    someFolderDeletesFailed: "Деякі папки не вдалося видалити",
    folderDeleteError: "Помилка видалення папки",
    deletingFile: "Видалення файлу...",
    fileDeleteSuccess: "Файл видалено",
    fileDeleteError: "Помилка видалення файлу",
    folderLocation: (params?: TranslationParams) => `в ${params?.name ?? ''}`,
    workWithFolder: (params?: TranslationParams) => `Працювати з ${params?.name ?? ''}`,
    folderNamePlaceholder: "Назва папки",
    deleteConfirmation: "Підтвердження видалення",
    processingImages: (params?: TranslationParams) => `Обробка ${params?.count ?? 0} зображень...`,
  },
  shortcuts: {
    title: "Гарячі клавіші",
    galleryNavigation: "Навігація по галереї",
    quickFolderSwitch: "Швидке перемикання папок",
    aboveImage: "Зображення вище",
    belowImage: "Зображення нижче",
    previousImage: "Попереднє зображення",
    nextImage: "Наступне зображення",
    togglePreview: "Перемкнути перегляд",
    tagNavigation: "Навігація по тегах",
    previousTag: "Попередній тег",
    nextTag: "Наступний тег",
    switchTagBubble: "Перемкнути на бульбашки тегів",
    switchTagInput: "Перемкнути на введення тегів",
    cycleCaptions: "Циклічний перегляд підписів",
    firstTagRow: "Перший тег у рядку",
    lastTagRow: "Останній тег у рядку",
    doubleShift: "Подвійний Shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Видалити тег",
    other: "Інше",
    esc: "Esc",
    closePreview: "Закрити перегляд/вікно",
    deleteImage: "Видалити зображення",
    toggleImagePreview: "Перемкнути перегляд",
    copyToClipboard: "Копіювати зображення в буфер обміну",
  },
  imageViewer: {
    zoomIn: "Наблизити",
    zoomOut: "Віддалити",
    resetZoom: "Скинути масштаб",
    toggleMinimap: "Перемкнути мінікарту",
    previousImage: "Попереднє зображення",
    nextImage: "Наступне зображення",
    copyPath: "Копіювати шлях",
    openInNewTab: "Відкрити в новій вкладці",
    fitToScreen: "За розміром екрану",
    actualSize: "Реальний розмір",
    rotateLeft: "Повернути вліво",
    rotateRight: "Повернути вправо",
    downloadImage: "Завантажити зображення",
    imageInfo: "Інформація про зображення",
    dimensions: "Розміри",
  },
  tools: {
    removeCommas: "Видалити коми",
    replaceNewlinesWithCommas: "Замінити переноси рядків комами",
    replaceUnderscoresWithSpaces: "Замінити підкреслення пробілами",
  },
  notifications: {
    imageCopied: "Зображення скопійовано в буфер обміну",
    imageCopyFailed: "Не вдалося скопіювати зображення в буфер обміну",
    folderCreated: "Папку створено",
    folderCreateError: "Не вдалося створити папку",
    generatingCaption: "Генерування підпису...",
    captionGenerated: "Підпис згенеровано"
  },
} as const satisfies Translations;
