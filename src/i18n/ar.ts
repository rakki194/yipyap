import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "./types";
import { getArabicPlural } from "./utils";

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
    },
    disableAnimations: "تعطيل الرسوم المتحركة",
    language: "اللغة",
    disableNonsense: "تعطيل النص الياباني",
    modelSettings: "إعدادات النموذج",
    jtp2ModelPath: "مسار نموذج JTP2",
    jtp2TagsPath: "مسار علامات JTP2",
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
    enableMinimap: "تمكين الخريطة المصغرة عند التكبير",
    instantDelete: "تمكين الحذف الفوري (تخطي التأكيد)",
    warning: "تحذير",
    gallery: "معرض",
    preserveLatents: "حفظ الـ Latents",
    preserveLatentsTooltip: "احتفظ بملفات .npz (latent) عند حذف الصور.",
    preserveTxt: "حفظ .txt",
    preserveTxtTooltip: "احتفظ بملفات .txt عند حذف الصور.",
    thumbnailSize: "حجم الصورة المصغرة",
    thumbnailSizeDescription: "حجم الصور المصغرة في بكسل (مثال: 250)",
    thumbnailSizeUpdateError: "فشل تحديث حجم الصورة المصغرة",
  },
  frontPage: {
    subtitle: {
      1: "نماذج اللغة الكبيرة تقوم بالغش، والكذب، والتخيُّل. تمامًا مثلي!",
      2: "لقد وجدنا طريقة أخرى للصلاة",
      3: "الكون اللامتناهي ينعكس في عيون فارغة",
      4: "قلب صدئ، براعم جديدة",
      5: "مكان سحري حيث يتقاطع الحلم والواقع",
      6: "إقليم مجهول، إمكانيات لا حصر لها",
      7: "حب أبدي يتجاوز تدفق الزمن",
      8: "هذا سيجعلك تُطرد!",
    },
    imageWork: "العمل مع الصور",
    audioWork: "العمل مع الصوت",
    deselectAll: "إلغاء تحديد الكل",
    deleteSelected: "حذف المحدد",
  },
  gallery: {
    addTag: "إضافة وسم...",
    addCaption: "إضافة تعليق...",
    quickJump: "القفز إلى المجلد...",
    loadingFolders: "جارٍ تحميل المجلدات...",
    noResults: "لم يتم العثور على نتائج",
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
    processingImage: "جارٍ معالجة الصورة...",
    generateTags: "إنشاء وسوم",
    generatingTags: "جارٍ إنشاء الوسوم...",
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
    workWithFolder: (params: TranslationParams) => {
      const name = params.name ?? "المجلد";
      return `العمل مع ${name}`;
    },
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
    removeCommas: "إزالة الفواصل",
    replaceNewlinesWithCommas: "استبدال الأسطر الجديدة بالفواصل",
    replaceUnderscoresWithSpaces: "استبدال الشرطات السفلية بالمسافات",
  },
  notifications: {
    imageCopied: "تم نسخ الصورة إلى الحافظة",
    imageCopyFailed: "فشل نسخ الصورة إلى الحافظة",
    folderCreated: "تم إنشاء المجلد",
    folderCreateError: "فشل إنشاء المجلد",
  },
} as const satisfies Translations;
