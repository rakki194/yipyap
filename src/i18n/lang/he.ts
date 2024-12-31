import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "../types";
import { createPluralTranslation } from "../plurals";

export default {
  common: {
    close: "סגור",
    delete: "מחק",
    cancel: "ביטול",
    save: "שמור",
    edit: "ערוך",
    add: "הוסף",
    remove: "הסר",
    loading: "טוען...",
    error: "שגיאה",
    success: "הצלחה",
    confirm: "אישור",
    download: "הורדה",
    path: "נתיב",
    size: "גודל",
    date: "תאריך",
    name: "שם",
    type: "סוג",
    actions: "פעולות",
    search: "חיפוש...",
    filter: "סינון",
    apply: "החל",
    reset: "איפוס",
    selected: "נבחר",
    all: "הכל",
    none: "ללא",
    notFound: "404 - הדף לא נמצא",
    pathSeparator: getPathSeparator("he"),
    toggleTheme: "החלף ערכת נושא",
    theme: "ערכת נושא",
    returnToFrontPage: "חזור לדף הראשי",
    home: "דף הבית",
    openSettings: "פתח הגדרות",
    create: "צור",
    creating: "יוצר...",
    language: "שפה",
    description: "תיאור",
  },
  settings: {
    title: "הגדרות",
    appearance: "מראה",
    theme: {
      light: "בהיר",
      gray: "אפור",
      dark: "כהה",
      banana: "בננה",
      strawberry: "תות",
      peanut: "בוטנים",
      halloween: "ליל כל הקדושים",
      christmas: "חג המולד",
      "high-contrast-black": "ניגודיות גבוהה - שחור",
      "high-contrast-inverse": "ניגודיות גבוהה - הפוך",
    },
    disableAnimations: "בטל אנימציות",
    disableAnimationsTooltip: "בטל את כל האנימציות לביצועים טובים יותר",
    language: "שפה",
    languageTooltip: "שנה את שפת הממשק",
    disableNonsense: "בטל טקסט ביפנית",
    disableNonsenseTooltip: "הסתר טקסט ביפנית ואלמנטים חסרי משמעות אחרים",
    modelSettings: (params: TranslationParams) => "הגדרות מודל",
    jtp2ModelPath: "נתיב מודל JTP2",
    jtp2TagsPath: "נתיב תגיות JTP2",
    downloadModel: "הורד מודל (1.8GB)",
    downloadTags: "הורד תגיות (195KB)",
    viewMode: "מצב תצוגה",
    gridView: "תצוגת רשת",
    listView: "תצוגת רשימה",
    sortBy: "מיין לפי",
    sortByName: "מיין לפי שם",
    sortByDate: "מיין לפי תאריך",
    sortBySize: "מיין לפי גודל",
    experimentalFeatures: "תכונות ניסיוניות",
    enableZoom: "אפשר הגדלה",
    enableZoomTooltip: "אפשר הגדלה והזזה בתצוגת התמונות",
    enableMinimap: "אפשר מפה מוקטנת בהגדלה",
    enableMinimapTooltip: "הצג מפה מוקטנת בעת הגדלה לניווט קל יותר",
    alwaysShowCaptionEditor: "הצג תמיד את עורך הכיתוב",
    alwaysShowCaptionEditorTooltip: "השאר את עורך הכיתוב פתוח תמיד",
    instantDelete: "מחיקה מיידית (ללא אישור)",
    instantDeleteTooltip: "מחק קבצים ללא חלון אישור",
    warning: "אזהרה",
    gallery: "גלריה",
    preserveLatents: "שמור את ה-Latents",
    preserveLatentsTooltip: "שמור את קבצי .npz (latent) בעת העברת או מחיקת תמונות.",
    preserveTxt: "שמור את .txt",
    preserveTxtTooltip: "שמור את קבצי .txt בעת העברת או מחיקת תמונות.",
    thumbnailSize: "גודל תמונות ממוזערות",
    thumbnailSizeDescription: "גודל תמונות ממוזערות בפיקסלים (למשל 250)",
    thumbnailSizeUpdateError: "נכשל בעדכון גודל תמונות ממוזערות",
    jtp2ModelPathTooltip: "הנתיב למודל JTP2 המותקן",
    jtp2TagsPathTooltip: "הנתיב לקובץ התגיות של JTP2",
    jtp2Threshold: "סף JTP2",
    jtp2ThresholdTooltip: "סף ביטחון עבור תגיות JTP2 (ברירת מחדל: 0.35)",
    jtp2ForceCpu: "כפה שימוש ב-CPU עבור JTP2",
    jtp2ForceCpuTooltip: "כפה על JTP2 להשתמש ב-CPU במקום ב-GPU",
    wdv3GenThreshold: "סף תגיות כללי",
    wdv3GenThresholdTooltip: "סף ביטחון עבור תגיות כלליות (ברירת מחדל: 0.35)",
    wdv3CharThreshold: "סף תגיות דמויות",
    wdv3CharThresholdTooltip: "סף ביטחון עבור תגיות דמויות (ברירת מחדל: 0.75)",
    wdv3ConfigUpdateError: "שגיאה בעדכון הגדרות WDv3",
    wdv3ForceCpu: "כפה שימוש ב-CPU עבור WDv3",
    wdv3ForceCpuTooltip: "כפה על WDv3 להשתמש ב-CPU במקום ב-GPU",
    wdv3ModelName: "שם מודל WDv3",
    wdv3ModelNameTooltip: "שם המודל של WDv3 לשימוש",
  },
  gallery: {
    addTag: "הוסף תגית...",
    addCaption: "הוסף כיתוב...",
    quickJump: "קפיצה לתיקייה...",
    loadingFolders: "טוען תיקיות...",
    noResults: "לא נמצאו תוצאות",
    pathNotFound: "נתיב לא נמצא",
    folderCount: (params?: TranslationParams) => `${params?.count ?? 0} תיקיות`,
    deleteConfirm: (params: TranslationParams) => {
      const name = params.name ?? "פריט זה";
      return `האם אתה בטוח שברצונך למחוק את "${name}"?`;
    },
    deleteSuccess: "התמונה נמחקה בהצלחה",
    deleteError: (params: TranslationParams) => {
      const name = params.name ?? "פריט";
      return `שגיאה במחיקת "${name}"`;
    },
    savingCaption: (params: TranslationParams) => {
      const name = params.name ?? "פריט";
      return `שומר כיתוב עבור "${name}"...`;
    },
    savedCaption: "הכיתוב נשמר",
    errorSavingCaption: (params: TranslationParams) => {
      const name = params.name ?? "פריט";
      return `שגיאה בשמירת הכיתוב עבור "${name}"`;
    },
    emptyFolder: "תיקייה זו ריקה",
    dropToUpload: "גרור קבצים לכאן להעלאה",
    uploadProgress: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'מעלה קבצים...';
      }
      return createPluralTranslation({
        one: "מעלה קובץ אחד...",
        other: "מעלה ${count} קבצים..."
      }, "he")(params);
    },
    uploadProgressPercent: "מעלה... {progress}%",
    processingImage: (params: TranslationParams) => {
      const name = params.name ?? "תמונה";
      return `מעבד את "${name}"...`;
    },
    generateTags: "צור תגיות",
    generatingTags: "יוצר תגיות...",
    removeTags: "הסר תגיות",
    createCaption: "צור כיתוב",
    captionTypes: {
      txt: "צור קובץ טקסט חדש",
      tags: "צור קובץ .tags חדש",
      caption: "צור קובץ .caption חדש",
      wd: "צור קובץ .wd חדש",
    },
    noCaptionFiles: "אין עדיין קבצי כיתוב!",
    selectAll: "בחר הכל",
    deselectAll: "בטל בחירת הכל",
    deleteSelected: "מחק נבחרים",
    confirmMultiDelete: (params: TranslationParams | null | undefined = {}) => {
      if (!params || typeof params !== 'object') {
        return 'האם אתה בטוח שברצונך למחוק פריטים אלה?';
      }
      const folders = typeof params.folders === 'number' ? params.folders : 0;
      const images = typeof params.images === 'number' ? params.images : 0;
      
      if (folders === 0 && images === 0) {
        return 'האם אתה בטוח שברצונך למחוק פריטים אלה?';
      }

      const parts = [];
      if (folders > 0) {
        parts.push(createPluralTranslation({
          one: "תיקייה אחת",
          other: "${count} תיקיות"
        }, "he")({ count: folders }));
      }
      if (images > 0) {
        parts.push(createPluralTranslation({
          one: "תמונה אחת",
          other: "${count} תמונות"
        }, "he")({ count: images }));
      }
      return `האם אתה בטוח שברצונך למחוק ${parts.join(" ו-")}?`;
    },
    confirmFolderDelete: (params: TranslationParams) => {
      const name = params.name ?? "תיקייה";
      return `האם אתה בטוח שברצונך למחוק את התיקייה "${name}" ואת כל תוכנה?`;
    },
    someFolderDeletesFailed: "חלק מהתיקיות לא נמחקו",
    folderDeleteError: "שגיאה במחיקת תיקייה",
    deletingFile: "מוחק קובץ...",
    fileDeleteSuccess: "הקובץ נמחק בהצלחה",
    fileDeleteError: "שגיאה במחיקת קובץ",
    uploadError: "ההעלאה נכשלה",
    dropOverlay: "שחרר קבצים או תיקיות כאן",
    fileCount: (params?: TranslationParams) => `${params?.count ?? 0} קבצים`,
    imageCount: (params?: TranslationParams) => `${params?.count ?? 0} תמונות`,
    foundFolders: (params?: TranslationParams) => `נמצאו ${params?.count ?? 0} תיקיות`,
    deletedCount: (params?: TranslationParams) => `נמחקו ${params?.count ?? 0} פריטים`,
    selectedCount: (params?: TranslationParams) => `${params?.count ?? 0} נבחרו`,
    processingImages: (params?: TranslationParams) => `מעבד ${params?.count ?? 0} תמונות...`,
    folderLocation: (params?: TranslationParams) => `מיקום: ${params?.name ?? ''}`,
    moveToFolder: (params?: TranslationParams) => `העבר ל${params?.name ?? ''}`,
    workWithFolder: (params?: TranslationParams) => `עבוד עם ${params?.name ?? ''}`,
    createFolder: "צור תיקייה",
    folderNamePlaceholder: "שם התיקייה",
    deleteConfirmation: "אישור מחיקה",
    filesExceedLimit: "קבצים גדולים מדי: {files}",
    noFilesToUpload: "אין קבצים להעלאה",
    processingFiles: "מעבד קבצים...",
    uploadComplete: "ההעלאה הושלמה",
    uploadFailed: "ההעלאה נכשלה: {error}",
    deleteComplete: "המחיקה הושלמה",
    deleteFailed: "המחיקה נכשלה",
    generatingCaption: "מייצר כיתוב...",
    captionGenerated: "הכיתוב נוצר",
    deletingFiles: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'מוחק קבצים...';
      }
      return createPluralTranslation({
        one: "מוחק קובץ אחד...",
        other: "מוחק ${count} קבצים..."
      }, "he")(params);
    },
  },
  shortcuts: {
    title: "קיצורי מקלדת",
    galleryNavigation: "ניווט בגלריה",
    quickFolderSwitch: "החלפת תיקייה מהירה",
    aboveImage: "תמונה למעלה",
    belowImage: "תמונה למטה",
    previousImage: "תמונה קודמת",
    nextImage: "תמונה הבאה",
    togglePreview: "הצג/הסתר תצוגה מקדימה",
    tagNavigation: "ניווט תגיות",
    previousTag: "תגית קודמת",
    nextTag: "תגית הבאה",
    switchTagBubble: "עבור לעריכת בועות תגיות",
    switchTagInput: "עבור להזנת תגיות",
    cycleCaptions: "מחזור כיתובים",
    firstTagRow: "תגית ראשונה בשורה",
    lastTagRow: "תגית אחרונה בשורה",
    doubleShift: "Shift כפול",
    shift: "Shift",
    del: "Del",
    removeTag: "הסר תגית",
    other: "אחר",
    esc: "Esc",
    closePreview: "סגור תצוגה מקדימה/חלון",
    deleteImage: "מחק תמונה",
    toggleImagePreview: "הצג/הסתר תצוגה מקדימה של תמונה",
    copyToClipboard: "העתק תמונה ללוח",
  },
  imageViewer: {
    zoomIn: "הגדל",
    zoomOut: "הקטן",
    resetZoom: "אפס הגדלה",
    toggleMinimap: "הצג/הסתר מפה מוקטנת",
    previousImage: "תמונה קודמת",
    nextImage: "תמונה הבאה",
    copyPath: "העתק נתיב",
    openInNewTab: "פתח בכרטיסייה חדשה",
    fitToScreen: "התאם למסך",
    actualSize: "גודל מקורי",
    rotateLeft: "סובב שמאלה",
    rotateRight: "סובב ימינה",
    downloadImage: "הורד תמונה",
    imageInfo: "מידע על התמונה",
    dimensions: "מידות",
  },
  tools: {
    transformations: "טרנספורמציות",
    transformationType: "סוג טרנספורמציה",
    addTransformation: "הוסף טרנספורמציה",
    transformationTypes: {
      searchReplace: "חיפוש והחלפה",
      case: "המרת אותיות",
      trim: "חיתוך רווחים",
      wrap: "עטיפת טקסט",
      number: "פעולות מספריות"
    },
    searchPattern: "תבנית חיפוש",
    searchPatternPlaceholder: "הכנס תבנית חיפוש...",
    replacement: "החלפה",
    replacementPlaceholder: "הכנס טקסט להחלפה...",
    selectIcon: "בחר סמל",
    caseTypes: {
      upper: "אותיות גדולות",
      lower: "אותיות קטנות",
      title: "אות ראשונה גדולה",
      sentence: "משפט"
    },
    trimTypes: {
      all: "הכל",
      start: "מתחילה",
      end: "מסוף",
      duplicates: "כפילויות"
    },
    numberActions: {
      remove: "הסר",
      format: "פורמט",
      extract: "חילוץ"
    },
    numberFormat: "פורמט מספר",
    numberFormatPlaceholder: "הכנס פורמט מספר...",
    transformationNamePlaceholder: "הכנס שם טרנספורמציה...",
    transformationDescriptionPlaceholder: "הכנס תיאור טרנספורמציה...",
    prefix: "קידומת",
    suffix: "סיומת",
    prefixPlaceholder: "הכנס קידומת...",
    suffixPlaceholder: "הכנס סיומת...",
    removeCommas: "הסר פסיקים",
    replaceNewlinesWithCommas: "החלף שורות חדשות בפסיקים",
    replaceUnderscoresWithSpaces: "החלף קווים תחתונים ברווחים"
  },
  notifications: {
    imageCopied: "התמונה הועתקה ללוח",
    imageCopyFailed: "נכשל להעתיק את התמונה ללוח",
    folderCreated: "התיקייה נוצרה בהצלחה",
    folderCreateError: "שגיאה ביצירת התיקייה",
    generatingCaption: "מייצר כיתוב...",
    captionGenerated: "הכיתוב נוצר בהצלחה",
    connectionLost: "החיבור לשרת אבד",
    connectionRestored: "החיבור לשרת שוחזר",
  },
} as const satisfies Translations;
