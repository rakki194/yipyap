import { getPathSeparator } from "~/i18n";

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
    disableJapanese: "Отключить японский текст",
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
    instantDelete: "Мгновенное удаление (без подтверждения)",
    warning: "Предупреждение",
    gallery: "Галерея",
    preserveLatents: "Сохранить Latents",
    preserveLatentsTooltip: "Сохраните файлы .npz (latent) при удалении изображений.",
    preserveTxt: "Сохранить .txt",
    preserveTxtTooltip: "Сохраните файлы .txt при удалении изображений.",
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
  },
  gallery: {
    addTag: "Добавить тег...",
    addCaption: "Добавить подпись...",
    quickJump: "Перейти к папке...",
    loadingFolders: "Загрузка папок...",
    noResults: "Ничего не найдено",
    folderCount: "{count} папок",
    deleteConfirm: "Вы уверены, что хотите удалить это изображение?",
    deleteSuccess: "Изображение успешно удалено",
    deleteError: "Ошибка при удалении",
    savingCaption: "Сохранение подписи...",
    savedCaption: "Подпись сохранена",
    errorSavingCaption: "Ошибка при сохранении подписи",
    emptyFolder: "Эта папка пуста",
    dropToUpload: "Перетащите файлы для загрузки",
    uploadProgress: "Загрузка {count} файлов...",
    processingImage: "Обработка изображения...",
    generateTags: "Сгенерировать теги",
    generatingTags: "Генерация тегов...",
    removeTags: "Удалить теги",
    noCaptionFiles: "Пока нет файлов подписей!",
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
};
