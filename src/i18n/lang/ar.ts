import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "../types";
import { getArabicPlural } from "../utils";

export default {
  common: {
    close: "إغلاق",
    delete: "حذف",
    cancel: "إلغاء",
    save: "حفظ",
    edit: "تحرير",
    add: "إضافة",
    remove: "إزالة",
    loading: "جارٍ التحميل...",
    error: "خطأ",
    success: "نجاح",
    confirm: "تأكيد",
    download: "تحميل",
    path: "المسار",
    size: "الحجم",
    date: "التاريخ",
    name: "الاسم",
    type: "النوع",
    actions: "إجراءات",
    search: "بحث...",
    filter: "تصفية",
    apply: "تطبيق",
    reset: "إعادة تعيين",
    selected: "محدد",
    all: "الكل",
    none: "لا شيء",
    pathSeparator: getPathSeparator("ar"),
    toggleTheme: "تغيير السمة",
    theme: "السمة",
    returnToFrontPage: "العودة إلى الصفحة الرئيسية",
    home: "الرئيسية",
    openSettings: "فتح الإعدادات",
    create: "إنشاء",
    creating: "جارٍ الإنشاء...",
    language: "اللغة",
    description: "الوصف",
  },
  settings: {
    title: "الإعدادات",
    appearance: "المظهر",
    theme: {
      light: "فاتح",
      gray: "رمادي",
      dark: "داكن",
      banana: "موز",
      strawberry: "فراولة",
      peanut: "فول سوداني",
      christmas: "عيد الميلاد",
      halloween: "هالوين",
      "high-contrast-black": "تباين عالي أسود",
      "high-contrast-inverse": "تباين عالي معكوس",
    },
    disableAnimations: "تعطيل الرسوم المتحركة",
    disableAnimationsTooltip: "تعطيل جميع الرسوم المتحركة لتحسين الأداء",
    language: "اللغة",
    languageTooltip: "تغيير لغة الواجهة",
    disableNonsense: "تعطيل النص الياباني",
    disableNonsenseTooltip: "إخفاء النص الياباني والعناصر غير المنطقية الأخرى",
    modelSettings: "إعدادات النموذج",
    jtp2ModelPath: "مسار نموذج JTP2",
    jtp2ModelPathTooltip: "مسار ملف نموذج JTP2 (.safetensors)",
    jtp2TagsPath: "مسار علامات JTP2",
    jtp2TagsPathTooltip: "مسار ملف علامات JTP2 (.json)",
    downloadModel: "تحميل النموذج (1.8 جيجا)",
    downloadTags: "تحميل العلامات (195 كيلوبايت)",
    viewMode: "وضع العرض",
    gridView: "عرض شبكة",
    listView: "عرض قائمة",
    sortBy: "ترتيب حسب",
    sortByName: "ترتيب حسب الاسم",
    sortByDate: "ترتيب حسب التاريخ",
    sortBySize: "ترتيب حسب الحجم",
    experimentalFeatures: "ميزات تجريبية",
    enableZoom: "تمكين التكبير",
    enableZoomTooltip: "تمكين التكبير والتحريك في عارض الصور",
    enableMinimap: "تمكين الخريطة المصغرة عند التكبير",
    enableMinimapTooltip: "إظهار الخريطة المصغرة عند التكبير للتنقل السهل",
    alwaysShowCaptionEditor: "إظهار محرر التسمية التوضيحية دائمًا",
    alwaysShowCaptionEditorTooltip: "إبقاء محرر التسمية التوضيحية مفتوحًا دائمًا",
    instantDelete: "تمكين الحذف الفوري (تخطي التأكيد)",
    instantDeleteTooltip: "حذف الملفات بدون نافذة تأكيد",
    warning: "تحذير",
    gallery: "معرض",
    preserveLatents: "حفظ الـ Latents",
    preserveLatentsTooltip: "احتفظ بملفات .npz (latent) عند نقل أو حذف الصور.",
    preserveTxt: "حفظ .txt",
    preserveTxtTooltip: "احتفظ بملفات .txt عند نقل أو حذف الصور.",
    thumbnailSize: "حجم الصورة المصغرة",
    thumbnailSizeDescription: "حجم الصور المصغرة في بكسل (مثال: 250)",
    thumbnailSizeUpdateError: "فشل تحديث حجم الصورة المصغرة",
    jtp2Threshold: "حد JTP2",
    jtp2ThresholdTooltip: "حد الثقة لتضمين العلامات",
    jtp2ForceCpu: "فرض استخدام المعالج لـ JTP2",
    jtp2ForceCpuTooltip: "فرض استخدام وحدة المعالجة المركزية بدلاً من GPU",
    wdv3ModelName: "نموذج WDv3",
    wdv3ModelNameTooltip: "اختر نوع نموذج WDv3",
    wdv3GenThreshold: "حد العلامات العامة",
    wdv3GenThresholdTooltip: "حد الثقة للعلامات العامة",
    wdv3CharThreshold: "حد علامات الشخصيات",
    wdv3CharThresholdTooltip: "حد الثقة لعلامات الشخصيات",
    wdv3ForceCpu: "فرض استخدام المعالج لـ WDv3",
    wdv3ForceCpuTooltip: "فرض استخدام وحدة المعالجة المركزية بدلاً من GPU",
    wdv3ConfigUpdateError: "فشل تحديث إعدادات WDv3",
  },
  gallery: {
    addTag: "إضافة وسم...",
    addCaption: "إضافة تعليق...",
    quickJump: "القفز إلى المجلد...",
    loadingFolders: "جارٍ تحميل المجلدات...",
    noResults: "لم يتم العثور على نتائج",
    uploadFiles: "رفع الملفات",
    deleteCurrentFolder: "حذف المجلد الحالي",
    folderCount: ({ count = 0 }) => getArabicPlural(count, {
      singular: "مجلد واحد",
      dual: "مجلدان",
      plural: "مجلدات",
      pluralLarge: "مجلداً"
    }),
    deleteConfirm: "هل أنت متأكد أنك تريد حذف هذه الصورة؟",
    deleteSuccess: "تم حذف الصورة بنجاح",
    deleteError: "خطأ أثناء حذف الصورة",
    savingCaption: "جارٍ حفظ التعليق...",
    savedCaption: "تم حفظ التعليق",
    errorSavingCaption: "خطأ أثناء حفظ التعليق",
    emptyFolder: "هذا المجلد فارغ",
    dropToUpload: "اسحب الملفات هنا للتحميل",
    uploadProgress: (params: TranslationParams) => {
      const count = params.count;
      if (typeof count !== 'number') return 'جاري تحميل الملفات...';
      return `جاري تحميل ${count} ${getArabicPlural(count, {
        singular: "ملف",
        dual: "ملفان",
        plural: "ملفات",
        pluralLarge: "ملفاً"
      })}...`;
    },
    uploadProgressPercent: "جاري التحميل... {progress}%",
    filesExceedLimit: "تجاوز عدد الملفات الحد المسموح به",
    noFilesToUpload: "لا توجد ملفات للتحميل",
    processingFiles: "معالجة الملفات...",
    uploadComplete: "اكتمل التحميل",
    uploadFailed: "فشل التحميل",
    deletingFiles: "جاري حذف الملفات...",
    deleteComplete: "اكتمل الحذف",
    deleteFailed: "فشل الحذف",
    processingImage: "معالجة الصورة...",
    generateTags: "إنشاء وسوم",
    generatingTags: "جارٍ إنشاء الوسوم...",
    generatingCaption: "جاري إنشاء التسمية التوضيحية...",
    captionGenerated: "تم إنشاء التسمية التوضيحية",
    removeTags: "إزالة الوسوم",
    createCaption: "إنشاء تعليق",
    captionTypes: {
      txt: "إنشاء ملف نصي جديد",
      tags: "إنشاء ملف .tags جديد",
      caption: "إنشاء ملف .caption جديد",
      wd: "إنشاء ملف .wd جديد"
    },
    noCaptionFiles: "لا توجد ملفات تعليقات حتى الآن!",
    uploadError: "فشل التحميل",
    dropOverlay: "اسحب الملفات أو المجلدات هنا",
    selectAll: "تحديد الكل",
    deselectAll: "إلغاء تحديد الكل",
    deleteSelected: "حذف المحدد",
    confirmMultiDelete: ({ folders = 0, images = 0 }) => {
      if (folders > 0 && images > 0) {
        return `هل أنت متأكد من حذف ${folders} ${getArabicPlural(folders, {
          singular: "مجلد",
          dual: "مجلدان",
          plural: "مجلدات",
          pluralLarge: "مجلداً"
        })} و ${images} ${getArabicPlural(images, {
          singular: "صورة",
          dual: "صورتان",
          plural: "صور",
          pluralLarge: "صورةً"
        })}؟`;
      } else if (folders > 0) {
        return `هل أنت متأكد من حذف ${folders} ${getArabicPlural(folders, {
          singular: "مجلد",
          dual: "مجلدان",
          plural: "مجلدات",
          pluralLarge: "مجلداً"
        })}؟`;
      }
      return `هل أنت متأكد من حذف ${images} ${getArabicPlural(images, {
        singular: "صورة",
        dual: "صورتان",
        plural: "صور",
        pluralLarge: "صورةً"
      })}؟`;
    },
    confirmFolderDelete: "هل أنت متأكد من حذف المجلد {name}؟",
    someFolderDeletesFailed: "فشل حذف بعض المجلدات",
    folderDeleteError: "خطأ في حذف المجلد",
    deletingFile: "جاري حذف الملف...",
    fileDeleteSuccess: "تم حذف الملف بنجاح",
    fileDeleteError: "خطأ في حذف الملف",
    createFolder: "إنشاء مجلد",
    folderNamePlaceholder: "اسم المجلد",
    deleteConfirmation: "تأكيد الحذف",
    selectedCount: (params: TranslationParams) => {
      const count = params.count ?? 0;
      return `${count} ${getArabicPlural(count, {
        singular: "عنصر محدد",
        dual: "عنصران محددان",
        plural: "عناصر محددة",
        pluralLarge: "عنصراً محدداً"
      })}`;
    },
    processingImages: (params: TranslationParams) => {
      const count = params.count ?? 0;
      return `معالجة ${count} صور...`;
    },
    foundFolders: (params: TranslationParams) => {
      const count = params.count ?? 0;
      return `تم العثور على ${count} مجلدات`;
    },
    deletedCount: (params: TranslationParams) => {
      const count = params.count ?? 0;
      return `تم حذف ${count} عناصر`;
    },
    fileCount: (params: TranslationParams) => {
      const count = params.count ?? 0;
      return getArabicPlural(count, {
        singular: "ملف واحد",
        dual: "ملفان",
        plural: "ملفات",
        pluralLarge: "ملفاً"
      });
    },
    imageCount: (params: TranslationParams) => {
      const count = params.count ?? 0;
      return getArabicPlural(count, {
        singular: "صورة واحدة",
        dual: "صورتان",
        plural: "صور",
        pluralLarge: "صورةً"
      });
    },
    folderLocation: (params: TranslationParams) => {
      const name = params.name ?? "";
      return `في ${name}`;
    },
    moveToFolder: (params: TranslationParams) => {
      const name = params.name ?? "المجلد";
      return `نقل إلى ${name}`;
    },
    workWithFolder: (params: TranslationParams) => `العمل مع المجلد ${params.name}`,
  },
  shortcuts: {
    title: "اختصارات لوحة المفاتيح",
    galleryNavigation: "تنقل المعرض",
    quickFolderSwitch: "تبديل المجلد السريع",
    aboveImage: "الصورة أعلاه",
    belowImage: "الصورة أدناه",
    previousImage: "الصورة السابقة",
    nextImage: "الصورة التالية",
    togglePreview: "تبديل المعاينة",
    tagNavigation: "تنقل الوسوم",
    previousTag: "الوسم السابق",
    nextTag: "الوسم التالي",
    switchTagBubble: "التبديل إلى تحرير فقاعة الوسم",
    switchTagInput: "التبديل إلى إدخال الوسم",
    cycleCaptions: "دورة التعليقات",
    firstTagRow: "أول وسم في الصف",
    lastTagRow: "آخر وسم في الصف",
    doubleShift: "Shift مزدوج",
    shift: "Shift",
    del: "Del",
    removeTag: "إزالة الوسم",
    other: "أخرى",
    esc: "Esc",
    closePreview: "إغلاق المعاينة/الوضع Modal",
    deleteImage: "حذف الصورة",
    toggleImagePreview: "تبديل معاينة الصورة",
    copyToClipboard: "نسخ الصورة إلى الحافظة",
  },
  imageViewer: {
    zoomIn: "تكبير",
    zoomOut: "تصغير",
    resetZoom: "إعادة تعيين التكبير",
    toggleMinimap: "تبديل الخريطة المصغرة",
    previousImage: "الصورة السابقة",
    nextImage: "الصورة التالية",
    copyPath: "نسخ المسار",
    openInNewTab: "فتح في علامة تبويب جديدة",
    fitToScreen: "مناسب للشاشة",
    actualSize: "الحجم الفعلي",
    rotateLeft: "تدوير يسارًا",
    rotateRight: "تدوير يمينًا",
    downloadImage: "تحميل الصورة",
    imageInfo: "معلومات الصورة",
    dimensions: "الأبعاد",
  },
  tools: {
    addTransformation: "إضافة تحويل",
    transformations: "التحويلات",
    transformationType: "نوع التحويل",
    transformationTypes: {
      searchReplace: "بحث واستبدال",
      case: "تحويل الحالة",
      trim: "قص",
      wrap: "تغليف",
      number: "رقم"
    },
    caseTypes: {
      upper: "أحرف كبيرة",
      lower: "أحرف صغيرة",
      title: "حالة العنوان",
      sentence: "حالة الجملة"
    },
    trimTypes: {
      all: "الكل",
      start: "البداية",
      end: "النهاية",
      duplicates: "التكرارات"
    },
    numberActions: {
      remove: "إزالة",
      format: "تنسيق",
      extract: "استخراج"
    },
    numberFormat: "تنسيق الرقم",
    numberFormatPlaceholder: "أدخل تنسيق الرقم...",
    prefix: "بادئة",
    suffix: "لاحقة",
    prefixPlaceholder: "أدخل البادئة...",
    suffixPlaceholder: "أدخل اللاحقة...",
    transformationNamePlaceholder: "أدخل اسم التحويل...",
    transformationDescriptionPlaceholder: "أدخل وصف التحويل...",
    searchPattern: "نمط البحث",
    searchPatternPlaceholder: "أدخل نمط البحث...",
    replacement: "الاستبدال",
    replacementPlaceholder: "أدخل نص الاستبدال...",
    selectIcon: "اختر أيقونة",
    removeCommas: "إزالة الفواصل",
    replaceNewlinesWithCommas: "استبدال الأسطر الجديدة بالفواصل",
    replaceUnderscoresWithSpaces: "استبدال الشرطات السفلية بالمسافات"
  },
  notifications: {
    imageCopied: "تم نسخ الصورة إلى الحافظة",
    imageCopyFailed: "فشل نسخ الصورة إلى الحافظة",
    folderCreated: "تم إنشاء المجلد",
    folderCreateError: "فشل إنشاء المجلد",
    generatingCaption: "جاري إنشاء التسمية التوضيحية...",
    connectionLost: "تم فقد الاتصال بالخادم",
    connectionRestored: "تم استعادة الاتصال بالخادم",
    captionGenerated: "تم إنشاء التسمية التوضيحية",
  },
} as const satisfies Translations;
