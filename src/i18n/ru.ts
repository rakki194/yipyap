import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "./types";
import { createPluralTranslation } from "./plurals";

export default {
  common: {
    close: "Закрыть",
    delete: "Удалить",
    cancel: "Отмена",
    save: "Сохранить",
    edit: "Редактировать",
    add: "Добавить",
    remove: "Удалить",
    loading: "Загрузка...",
    error: "Ошибка",
    success: "Успешно",
    confirm: "Подтвердить",
    download: "Скачать",
    path: "Путь",
    size: "Размер",
    date: "Дата",
    name: "Имя",
    type: "Тип",
    actions: "Действия",
    search: "Поиск...",
    filter: "Фильтр",
    apply: "Применить",
    reset: "Сбросить",
    selected: "Выбрано",
    all: "Все",
    none: "Ничего",
    pathSeparator: getPathSeparator("ru"),
    toggleTheme: "Переключить тему",
    theme: "Тема",
    returnToFrontPage: "Вернуться на главную",
    home: "Главная",
    openSettings: "Открыть настройки",
    create: "Создать",
    creating: "Создание...",
  },
  settings: {
    title: "Настройки",
    appearance: "Внешний вид",
    theme: {
      light: "Светлая",
      gray: "Серая",
      dark: "Тёмная",
      banana: "Банановая",
      strawberry: "Клубничная",
      peanut: "Арахисовая",
      christmas: "Рождественская",
      halloween: "Хэллоуинская",
    },
    disableAnimations: "Отключить анимации",
    language: "Язык",
    disableNonsense: "Отключить японский текст",
    modelSettings: "Настройки модели",
    jtp2ModelPath: "Путь к модели JTP2",
    jtp2TagsPath: "Путь к тегам JTP2",
    downloadModel: "Скачать модель (1.8GB)",
    downloadTags: "Скачать теги (195KB)",
    viewMode: "Режим просмотра",
    gridView: "Сетка",
    listView: "Список",
    sortBy: "Сортировать по",
    sortByName: "По имени",
    sortByDate: "По дате",
    sortBySize: "По размеру",
    experimentalFeatures: "Экспериментальные функции",
    enableZoom: "Включить масштабирование",
    enableMinimap: "Включить миникарту при масштабировании",
    alwaysShowCaptionEditor: "Всегда показывать редактор подписей",
    instantDelete: "Мгновенное удаление (без подтверждения)",
    warning: "Предупреждение",
    gallery: "Галерея",
    preserveLatents: "Сохранить Latents",
    preserveLatentsTooltip: "Сохраните файлы .npz (latent) при удалении изображений.",
    preserveTxt: "Сохранить .txt",
    preserveTxtTooltip: "Сохраните файлы .txt при удалении изображений.",
    thumbnailSize: "Размер миниатюр",
    thumbnailSizeDescription: "Размер миниатюр в галерее",
    thumbnailSizeUpdateError: "Ошибка обновления размера миниатюр",
  },
  frontPage: {
    subtitle: {
      1: "Большие языковые модели обманывают, лгут и галлюцинируют. Как и я!",
      2: "Мы нашли другой способ молиться",
      3: "Пустые глаза отражают бесконечные вселенные",
      4: "Ржавое сердце, новые ростки",
      5: "Странный мир, где пересекаются сны и реальность",
      6: "Неизведанная территория, бесконечные возможности",
      7: "Вечная любовь за пределами времени",
      8: "За это вас выгонят!",
    },
    imageWork: "Работа с изображениями",
    audioWork: "Работа с аудио",
    deselectAll: "Отменить выбор",
    deleteSelected: "Удалить выбранные",
  },
  gallery: {
    addTag: "Добавить тег",
    addCaption: "Добавить подпись",
    quickJump: "Быстрый переход",
    loadingFolders: "Загрузка папок...",
    noResults: "Нет результатов",
    folderCount: createPluralTranslation({
      one: "1 папка",
      few: "${count} папки",
      many: "${count} папок",
      other: "${count} папок"
    }, "ru"),
    fileCount: createPluralTranslation({
      one: "1 файл",
      few: "${count} файла",
      many: "${count} файлов",
      other: "${count} файлов"
    }, "ru"),
    imageCount: createPluralTranslation({
      one: "1 изображение",
      few: "${count} изображения",
      many: "${count} изображений",
      other: "${count} изображений"
    }, "ru"),
    foundFolders: createPluralTranslation({
      one: "Найдена 1 папка",
      few: "Найдено ${count} папки",
      many: "Найдено ${count} папок",
      other: "Найдено ${count} папок"
    }, "ru"),
    deletedCount: createPluralTranslation({
      one: "Удален 1 элемент",
      few: "Удалено ${count} элемента",
      many: "Удалено ${count} элементов",
      other: "Удалено ${count} элементов"
    }, "ru"),
    deleteConfirm: (params: TranslationParams) => {
      const name = params.name ?? "этот элемент";
      return `Вы уверены, что хотите удалить "${name}"?`;
    },
    deleteSuccess: "Удаление завершено",
    deleteError: (params: TranslationParams) => {
      const name = params.name ?? "элемент";
      return `Ошибка при удалении "${name}"`;
    },
    savingCaption: (params: TranslationParams) => {
      const name = params.name ?? "элемент";
      return `Сохранение подписи для "${name}"...`;
    },
    savedCaption: "Подпись сохранена",
    errorSavingCaption: (params: TranslationParams) => {
      const name = params.name ?? "элемент";
      return `Ошибка при сохранении подписи для "${name}"`;
    },
    emptyFolder: "Эта папка пуста",
    dropToUpload: "Перетащите файлы для загрузки",
    uploadProgress: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Загрузка файлов...';
      }
      return createPluralTranslation({
        one: "Загрузка 1 файла...",
        few: "Загрузка ${count} файлов...",
        many: "Загрузка ${count} файлов...",
        other: "Загрузка ${count} файлов..."
      }, "ru")(params);
    },
    uploadProgressPercent: "Загрузка... {progress}%",
    filesExceedLimit: "Файлы слишком большие: {files}",
    noFilesToUpload: "Нет файлов для загрузки",
    processingFiles: "Обработка файлов...",
    uploadComplete: "Загрузка завершена",
    uploadFailed: "Ошибка загрузки: {error}",
    deletingFiles: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Удаление файлов...';
      }
      return createPluralTranslation({
        one: "Удаление 1 файла...",
        few: "Удаление ${count} файлов...",
        many: "Удаление ${count} файлов...",
        other: "Удаление ${count} файлов..."
      }, "ru")(params);
    },
    deleteComplete: "Удаление завершено",
    deleteFailed: "Ошибка удаления",
    processingImage: (params: TranslationParams) => {
      const name = params.name ?? "изображение";
      return `Обработка изображения "${name}"...`;
    },
    processingImages: createPluralTranslation({
      one: "Обработка 1 изображения...",
      few: "Обработка ${count} изображений...",
      many: "Обработка ${count} изображений...",
      other: "Обработка ${count} изображений..."
    }, "ru"),
    generatingCaption: "Генерация подписи...",
    captionGenerated: "Подпись сгенерирована",
    generateTags: "Сгенерировать теги",
    generatingTags: "Генерация тегов...",
    removeTags: "Удалить теги",
    createCaption: "Создать подпись",
    captionTypes: {
      txt: "Txt",
      tags: "Теги",
      caption: "Подпись",
      wd: "WD",
    },
    noCaptionFiles: "Нет файлов подписей",
    uploadError: "Ошибка загрузки",
    dropOverlay: "Отпустите для загрузки",
    selectAll: "Выбрать все",
    deselectAll: "Отменить выбор",
    deleteSelected: "Удалить выбранное",
    confirmMultiDelete: (params: TranslationParams | null | undefined = {}) => {
      if (!params || typeof params !== 'object') {
        return 'Вы уверены, что хотите удалить эти элементы?';
      }
      const folders = typeof params.folders === 'number' ? params.folders : 0;
      const images = typeof params.images === 'number' ? params.images : 0;
      
      if (folders === 0 && images === 0) {
        return 'Вы уверены, что хотите удалить эти элементы?';
      }

      const parts = [];
      if (folders > 0) {
        parts.push(createPluralTranslation({
          one: "1 папку",
          few: "${count} папки",
          many: "${count} папок",
          other: "${count} папок"
        }, "ru")({ count: folders }));
      }
      if (images > 0) {
        parts.push(createPluralTranslation({
          one: "1 изображение",
          few: "${count} изображения",
          many: "${count} изображений",
          other: "${count} изображений"
        }, "ru")({ count: images }));
      }
      return `Вы уверены, что хотите удалить ${parts.join(" и ")}?`;
    },
    confirmFolderDelete: (params: TranslationParams) => {
      const name = params.name ?? "папка";
      return `Вы уверены, что хотите удалить папку "${name}" и все её содержимое?`;
    },
    someFolderDeletesFailed: "Некоторые папки не удалось удалить",
    folderDeleteError: "Ошибка при удалении одной или нескольких папок",
    deletingFile: "Удаление файла...",
    fileDeleteSuccess: "Файл успешно удален",
    fileDeleteError: "Ошибка при удалении одного или нескольких файлов",
    createFolder: "Создать папку",
    folderNamePlaceholder: "Имя папки",
    deleteConfirmation: "Подтверждение удаления",
    selectedCount: createPluralTranslation({
      one: "Выбран 1 элемент",
      few: "Выбрано ${count} элемента",
      many: "Выбрано ${count} элементов",
      other: "Выбрано ${count} элементов"
    }, "ru"),
    folderLocation: (params: TranslationParams) => {
      const name = params.name ?? "";
      return `Расположение: ${name}`;
    },
    moveToFolder: (params: TranslationParams) => {
      const name = params.name ?? "папка";
      return `Переместить в "${name}"`;
    },
    workWithFolder: (params: TranslationParams) => {
      const name = params.name ?? "папка";
      return `Работать с папкой "${name}"`;
    },
  },
  shortcuts: {
    title: "Горячие клавиши",
    galleryNavigation: "Навигация по галерее",
    quickFolderSwitch: "Быстрое переключение папок",
    aboveImage: "Изображение выше",
    belowImage: "Изображение ниже",
    previousImage: "Предыдущее изображение",
    nextImage: "Следующее изображение",
    togglePreview: "Переключить предпросмотр",
    tagNavigation: "Навигация по тегам",
    previousTag: "Предыдущий тег",
    nextTag: "Следующий тег",
    switchTagBubble: "Переключить на пузырьки тегов",
    switchTagInput: "Переключить на ввод тегов",
    cycleCaptions: "Циклический просмотр подписей",
    firstTagRow: "Первый тег в строке",
    lastTagRow: "Последний тег в строке",
    doubleShift: "Двойной Shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Удалить тег",
    other: "Прочее",
    esc: "Esc",
    closePreview: "Закрыть предпросмотр/окно",
    deleteImage: "Удалить изображение",
    toggleImagePreview: "Переключить предпросмотр",
    copyToClipboard: "Копировать изображение в буфер обмена",
  },
  imageViewer: {
    zoomIn: "Приблизить",
    zoomOut: "Отдалить",
    resetZoom: "Сбросить масштаб",
    toggleMinimap: "Переключить миникарту",
    previousImage: "Предыдущее изображение",
    nextImage: "Следующее изображение",
    copyPath: "Копировать путь",
    openInNewTab: "Открыть в новой вкладке",
    fitToScreen: "По размеру экрана",
    actualSize: "Реальный размер",
    rotateLeft: "Повернуть влево",
    rotateRight: "Повернуть вправо",
    downloadImage: "Скачать изображение",
    imageInfo: "Информация об изображении",
    dimensions: "Размеры",
  },
  tools: {
    removeCommas: "Удалить запятые",
    replaceNewlinesWithCommas: "Заменить переносы строк запятыми",
    replaceUnderscoresWithSpaces: "Заменить подчеркивания пробелами",
  },
  notifications: {
    imageCopied: "Изображение скопировано в буфер обмена",
    imageCopyFailed: "Не удалось скопировать изображение в буфер обмена",
    folderCreated: "Папка создана",
    folderCreateError: "Ошибка создания папки",
    generatingCaption: "Генерация подписи...",
    captionGenerated: "Подпись сгенерирована",
    connectionLost: "Соединение потеряно",
    connectionRestored: "Соединение восстановлено",
  },
} as const satisfies Translations;
