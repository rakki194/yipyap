import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "../types";
import { createPluralTranslation } from "../plurals";

export default {
  common: {
    close: "Κλείσιμο",
    delete: "Διαγραφή",
    cancel: "Ακύρωση",
    save: "Αποθήκευση",
    edit: "Επεξεργασία",
    add: "Προσθήκη",
    remove: "Αφαίρεση",
    loading: "Φόρτωση...",
    error: "Σφάλμα",
    success: "Επιτυχία",
    confirm: "Επιβεβαίωση",
    download: "Λήψη",
    path: "Διαδρομή",
    size: "Μέγεθος",
    date: "Ημερομηνία",
    name: "Όνομα",
    type: "Τύπος",
    actions: "Ενέργειες",
    search: "Αναζήτηση",
    filter: "Φίλτρο",
    apply: "Εφαρμογή",
    reset: "Επαναφορά",
    selected: "Επιλεγμένο",
    all: "Όλα",
    none: "Κανένα",
    notFound: "404 - Η σελίδα δεν βρέθηκε",
    pathSeparator: getPathSeparator("el"),
    toggleTheme: "Εναλλαγή θέματος",
    theme: "Θέμα",
    returnToFrontPage: "Επιστροφή στην αρχική σελίδα",
    home: "Αρχική",
    openSettings: "Άνοιγμα ρυθμίσεων",
    create: "Δημιουργία",
    creating: "Δημιουργία...",
    language: "Γλώσσα",
    description: "Περιγραφή",
  },
  settings: {
    title: "Ρυθμίσεις",
    appearance: "Εμφάνιση",
    theme: {
      light: "Φωτεινό",
      gray: "Γκρι",
      dark: "Σκοτεινό",
      banana: "Μπανάνα",
      strawberry: "Φράουλα",
      peanut: "Φιστίκι",
      "high-contrast-black": "Υψηλή αντίθεση (Μαύρο)",
      "high-contrast-inverse": "Υψηλή αντίθεση (Αντίστροφο)",
    },
    disableAnimations: "Απενεργοποίηση κινήσεων",
    disableAnimationsTooltip: "Απενεργοποίηση όλων των κινήσεων για καλύτερη απόδοση",
    language: "Γλώσσα",
    languageTooltip: "Αλλαγή γλώσσας διεπαφής",
    disableNonsense: "Απενεργοποίηση Ιαπωνικών",
    disableNonsenseTooltip: "Απόκρυψη ιαπωνικού κειμένου και άλλων άσχετων στοιχείων",
    modelSettings: (params: TranslationParams) => "Ρυθμίσεις μοντέλου",
    jtp2ModelPath: "Διαδρομή μοντέλου JTP2",
    jtp2ModelPathTooltip: "Διαδρομή για το αρχείο μοντέλου JTP2 (.safetensors)",
    jtp2TagsPath: "Διαδρομή ετικετών JTP2",
    jtp2TagsPathTooltip: "Διαδρομή για το αρχείο ετικετών JTP2 (.json)",
    downloadModel: "Λήψη μοντέλου (1.8GB)",
    downloadTags: "Λήψη ετικετών (195KB)",
    viewMode: "Τρόπος προβολής",
    gridView: "Προβολή πλέγματος",
    listView: "Προβολή λίστας",
    sortBy: "Ταξινόμηση κατά",
    sortByName: "Ταξινόμηση κατά όνομα",
    sortByDate: "Ταξινόμηση κατά ημερομηνία",
    sortBySize: "Ταξινόμηση κατά μέγεθος",
    experimentalFeatures: "Πειραματικές λειτουργίες",
    enableZoom: "Ενεργοποίηση μεγέθυνσης",
    enableZoomTooltip: "Ενεργοποίηση μεγέθυνσης και μετακίνησης στον προβολέα εικόνων",
    enableMinimap: "Ενεργοποίηση μικρογραφίας",
    enableMinimapTooltip: "Εμφάνιση μικρογραφίας κατά τη μεγέθυνση για ευκολότερη πλοήγηση",
    alwaysShowCaptionEditor: "Εμφάνιση επεξεργαστή λεζάντας πάντα",
    alwaysShowCaptionEditorTooltip: "Διατήρηση του επεξεργαστή λεζάντας πάντα ανοιχτού",
    instantDelete: "Άμεση διαγραφή (χωρίς επιβεβαίωση)",
    instantDeleteTooltip: "Διαγραφή αρχείων χωρίς παράθυρο επιβεβαίωσης",
    warning: "Προειδοποίηση",
    gallery: "Συλλογή",
    preserveLatents: "Διατήρηση Latents",
    preserveLatentsTooltip: "Διατηρήστε τα αρχεία .npz (latent) κατά τη μετακίνηση ή τη διαγραφή εικόνων.",
    preserveTxt: "Διατήρηση .txt",
    preserveTxtTooltip: "Διατηρήστε τα αρχεία .txt κατά τη μετακίνηση ή τη διαγραφή εικόνων.",
    thumbnailSize: "Μέγεθος μικρογραφιών",
    thumbnailSizeDescription: "Μέγεθος μικρογραφιών σε pixels (π.χ. 250)",
    thumbnailSizeUpdateError: "Αποτυχία ενημέρωσης μεγέθους μικρογραφιών",
    jtp2Threshold: "Όριο JTP2",
    jtp2ThresholdTooltip: "Όριο εμπιστοσύνης για ετικέτες JTP2 (προεπιλογή: 0.35)",
    jtp2ForceCpu: "Εξαναγκασμός JTP2 σε CPU",
    jtp2ForceCpuTooltip: "Εξαναγκασμός JTP2 να χρησιμοποιεί CPU αντί για GPU",
    wdv3GenThreshold: "Γενικό όριο ετικετών",
    wdv3GenThresholdTooltip: "Όριο εμπιστοσύνης για γενικές ετικέτες (προεπιλογή: 0.35)",
    wdv3CharThreshold: "Όριο ετικετών χαρακτήρων",
    wdv3CharThresholdTooltip: "Όριο εμπιστοσύνης για ετικέτες χαρακτήρων (προεπιλογή: 0.75)",
    wdv3ConfigUpdateError: "Αποτυχία ενημέρωσης ρυθμίσεων WDv3",
    wdv3ForceCpu: "Εξαναγκασμός WDv3 σε CPU",
    wdv3ForceCpuTooltip: "Εξαναγκασμός WDv3 να χρησιμοποιεί CPU αντί για GPU",
    wdv3ModelName: "Όνομα μοντέλου WDv3",
    wdv3ModelNameTooltip: "Το όνομα του μοντέλου WDv3 που θα χρησιμοποιηθεί",
  },
  gallery: {
    addTag: "Προσθήκη ετικέτας...",
    addCaption: "Προσθήκη λεζάντας...",
    quickJump: "Μετάβαση σε φάκελο...",
    loadingFolders: "Φόρτωση φακέλων...",
    pathNotFound: "Η διαδρομή δεν βρέθηκε",
    uploadFiles: "Μεταφόρτωση αρχείων",
    deleteCurrentFolder: "Διαγραφή τρέχοντος φακέλου",
    noResults: "Δεν βρέθηκαν αποτελέσματα",
    folderCount: createPluralTranslation({
      one: "1 φάκελος",
      other: "${count} φάκελοι"
    }, "el"),
    deleteConfirm: (params: TranslationParams) => {
      const name = params.name ?? "αυτό το στοιχείο";
      return `Είστε βέβαιοι ότι θέλετε να διαγράψετε "${name}";`;
    },
    deleteSuccess: "Η εικόνα διαγράφηκε με επιτυχία",
    deleteError: (params: TranslationParams) => {
      const name = params.name ?? "στοιχείο";
      return `Σφάλμα κατά τη διαγραφή του "${name}"`;
    },
    savingCaption: (params: TranslationParams) => {
      const name = params.name ?? "στοιχείο";
      return `Αποθήκευση λεζάντας για "${name}"...`;
    },
    savedCaption: "Η λεζάντα αποθηκεύτηκε",
    errorSavingCaption: (params: TranslationParams) => {
      const name = params.name ?? "στοιχείο";
      return `Σφάλμα κατά την αποθήκευση της λεζάντας για "${name}"`;
    },
    emptyFolder: "Αυτός ο φάκελος είναι κενός",
    dropToUpload: "Σύρετε αρχεία εδώ για μεταφόρτωση",
    uploadProgress: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Μεταφόρτωση αρχείων...';
      }
      return createPluralTranslation({
        one: "Μεταφόρτωση 1 αρχείου...",
        other: "Μεταφόρτωση ${count} αρχείων..."
      }, "el")(params);
    },
    uploadProgressPercent: "Μεταφόρτωση... {progress}%",
    processingImage: (params: TranslationParams) => {
      const name = params.name ?? "εικόνα";
      return `Επεξεργασία "${name}"...`;
    },
    generateTags: "Δημιουργία ετικετών",
    generatingTags: "Δημιουργία ετικετών...",
    removeTags: "Αφαίρεση ετικετών",
    createCaption: "Δημιουργία λεζάντας",
    captionTypes: {
      txt: "Δημιουργία νέου αρχείου κειμένου",
      tags: "Δημιουργία νέου αρχείου .tags",
      caption: "Δημιουργία νέου αρχείου .caption",
      wd: "Δημιουργία νέου αρχείου .wd",
      florence: "Δημιουργία νέου αρχείου .florence"
    },
    noCaptionFiles: "Δεν υπάρχουν ακόμη αρχεία λεζάντας!",
    selectAll: "Επιλογή όλων",
    deselectAll: "Αποεπιλογή όλων",
    deleteSelected: "Διαγραφή επιλεγμένων",
    confirmMultiDelete: (params: TranslationParams | null | undefined = {}) => {
      if (!params || typeof params !== 'object') {
        return 'Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτά τα στοιχεία;';
      }
      const folders = typeof params.folders === 'number' ? params.folders : 0;
      const images = typeof params.images === 'number' ? params.images : 0;

      if (folders === 0 && images === 0) {
        return 'Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτά τα στοιχεία;';
      }

      const parts = [];
      if (folders > 0) {
        parts.push(createPluralTranslation({
          one: "1 φάκελο",
          other: "${count} φακέλους"
        }, "el")({ count: folders }));
      }
      if (images > 0) {
        parts.push(createPluralTranslation({
          one: "1 εικόνα",
          other: "${count} εικόνες"
        }, "el")({ count: images }));
      }
      return `Είστε βέβαιοι ότι θέλετε να διαγράψετε ${parts.join(" και ")};`;
    },
    confirmFolderDelete: (params: TranslationParams) => {
      const name = params.name ?? "φάκελο";
      return `Είστε βέβαιοι ότι θέλετε να διαγράψετε τον φάκελο "${name}" και όλα τα περιεχόμενά του;`;
    },
    someFolderDeletesFailed: "Ορισμένοι φάκελοι δεν μπόρεσαν να διαγραφούν",
    folderDeleteError: "Σφάλμα κατά τη διαγραφή του φακέλου",
    deletingFiles: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Διαγραφή αρχείων...';
      }
      return createPluralTranslation({
        one: "Διαγραφή 1 αρχείου...",
        other: "Διαγραφή ${count} αρχείων..."
      }, "el")(params);
    },
    fileDeleteSuccess: "Το αρχείο διαγράφηκε με επιτυχία",
    fileDeleteError: "Σφάλμα κατά τη διαγραφή του αρχείου",
    uploadError: "Η μεταφόρτωση απέτυχε",
    dropOverlay: "Αποθέστε αρχεία ή φακέλους εδώ",
    fileCount: createPluralTranslation({
      one: "1 αρχείο",
      other: "${count} αρχεία"
    }, "el"),
    imageCount: createPluralTranslation({
      one: "1 εικόνα",
      other: "${count} εικόνες"
    }, "el"),
    foundFolders: createPluralTranslation({
      one: "Βρέθηκε 1 φάκελος",
      other: "Βρέθηκαν ${count} φάκελοι"
    }, "el"),
    deletedCount: createPluralTranslation({
      one: "Διαγράφηκε 1 στοιχείο",
      other: "Διαγράφηκαν ${count} στοιχεία"
    }, "el"),
    selectedCount: createPluralTranslation({
      one: "1 επιλεγμένο",
      other: "${count} επιλεγμένα"
    }, "el"),
    processingImages: createPluralTranslation({
      one: "Επεξεργασία 1 εικόνας...",
      other: "Επεξεργασία ${count} εικόνων..."
    }, "el"),
    folderLocation: (params: TranslationParams) => `στο ${params.name ?? ""}`,
    moveToFolder: (params: TranslationParams) => `Μετακίνηση στο ${params.name ?? ""}`,
    workWithFolder: (params: TranslationParams) => `Εργασία με ${params.name ?? ""}`,
    createFolder: "Δημιουργία φακέλου",
    folderNamePlaceholder: "Όνομα φακέλου",
    deleteConfirmation: "Επιβεβαίωση διαγραφής",
    filesExceedLimit: "Αρχεία πολύ μεγάλα: {files}",
    noFilesToUpload: "Δεν υπάρχουν αρχεία για μεταφόρτωση",
    processingFiles: "Επεξεργασία αρχείων...",
    uploadComplete: "Η μεταφόρτωση ολοκληρώθηκε",
    uploadFailed: "Η μεταφόρτωση απέτυχε: {error}",
    deleteComplete: "Η διαγραφή ολοκληρώθηκε",
    deleteFailed: "Η διαγραφή απέτυχε",
    deletingFile: "Διαγραφή αρχείου...",
    generatingCaption: "Δημιουργία λεζάντας...",
    captionGenerated: "Η λεζάντα δημιουργήθηκε",
  },
  shortcuts: {
    title: "Συντομεύσεις πληκτρολογίου",
    galleryNavigation: "Πλοήγηση συλλογής",
    quickFolderSwitch: "Γρήγορη εναλλαγή φακέλων",
    aboveImage: "Εικόνα πάνω",
    belowImage: "Εικόνα κάτω",
    previousImage: "Προηγούμενη εικόνα",
    nextImage: "Επόμενη εικόνα",
    togglePreview: "Εναλλαγή προεπισκόπησης",
    tagNavigation: "Πλοήγηση ετικετών",
    previousTag: "Προηγούμενη ετικέτα",
    nextTag: "Επόμενη ετικέτα",
    switchTagBubble: "Εναλλαγή σε φυσαλίδες ετικετών",
    switchTagInput: "Εναλλαγή σε εισαγωγή ετικετών",
    cycleCaptions: "Κυκλική εναλλαγή λεζαντών",
    firstTagRow: "Πρώτη ετικέτα στη σειρά",
    lastTagRow: "Τελευταία ετικέτα στη σειρά",
    doubleShift: "Διπλό Shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Αφαίρεση ετικέτας",
    other: "Άλλα",
    esc: "Esc",
    closePreview: "Κλείσιμο προεπισκόπησης/παραθύρου",
    deleteImage: "Διαγραφή εικόνας",
    toggleImagePreview: "Εναλλαγή προεπισκόπησης εικόνας",
    copyToClipboard: "Αντιγραφή εικόνας στο πρόχειρο",
  },
  imageViewer: {
    zoomIn: "Μεγέθυνση",
    zoomOut: "Σμίκρυνση",
    resetZoom: "Επαναφορά μεγέθυνσης",
    toggleMinimap: "Εναλλαγή μικρογραφίας",
    previousImage: "Προηγούμενη εικόνα",
    nextImage: "Επόμενη εικόνα",
    copyPath: "Αντιγραφή διαδρομής",
    openInNewTab: "Άνοιγμα σε νέα καρτέλα",
    fitToScreen: "Προσαρμογή στην οθόνη",
    actualSize: "Πραγματικό μέγεθος",
    rotateLeft: "Περιστροφή αριστερά",
    rotateRight: "Περιστροφή δεξιά",
    downloadImage: "Λήψη εικόνας",
    imageInfo: "Πληροφορίες εικόνας",
    dimensions: "Διαστάσεις",
  },
  tools: {
    addTransformation: "Προσθήκη μετασχηματισμού",
    removeCommas: "Αφαίρεση κομμάτων",
    replaceNewlinesWithCommas: "Αντικατάσταση αλλαγών γραμμής με κόμματα",
    replaceUnderscoresWithSpaces: "Αντικατάσταση κάτω παύλων με κενά",
    transformations: "Μετασχηματισμοί",
    transformationType: "Τύπος μετασχηματισμού",
    transformationTypes: {
      searchReplace: "Αναζήτηση και αντικατάσταση",
      case: "Μετατροπή πεζών/κεφαλαίων",
      trim: "Αφαίρεση κενών",
      wrap: "Περιτύλιξη κειμένου",
      number: "Αρίθμηση"
    },
    caseTypes: {
      upper: "Κεφαλαία",
      lower: "Πεζά",
      title: "Τίτλος",
      sentence: "Πρόταση"
    },
    trimTypes: {
      all: "Όλα τα κενά",
      start: "Κενά στην αρχή",
      end: "Κενά στο τέλος",
      duplicates: "Διπλά κενά"
    },
    numberActions: {
      remove: "Αφαίρεση αριθμών",
      format: "Μορφοποίηση αριθμών",
      extract: "Εξαγωγή αριθμών"
    },
    numberFormat: "Μορφή αριθμού",
    numberFormatPlaceholder: "Εισάγετε μορφή αριθμού...",
    prefix: "Πρόθεμα",
    suffix: "Επίθεμα",
    prefixPlaceholder: "Εισάγετε πρόθεμα...",
    suffixPlaceholder: "Εισάγετε επίθεμα...",
    transformationNamePlaceholder: "Όνομα μετασχηματισμού...",
    transformationDescriptionPlaceholder: "Περιγραφή μετασχηματισμού...",
    searchPattern: "Μοτίβο αναζήτησης",
    searchPatternPlaceholder: "Εισάγετε μοτίβο αναζήτησης...",
    replacement: "Αντικατάσταση",
    replacementPlaceholder: "Εισάγετε κείμενο αντικατάστασης...",
    selectIcon: "Επιλογή εικονιδίου"
  },
  notifications: {
    imageCopied: "Η εικόνα αντιγράφηκε στο πρόχειρο",
    imageCopyFailed: "Αποτυχία αντιγραφής εικόνας στο πρόχειρο",
    folderCreated: "Ο φάκελος δημιουργήθηκε",
    folderCreateError: "Σφάλμα κατά τη δημιουργία του φακέλου",
    generatingCaption: "Δημιουργία λεζάντας...",
    captionGenerated: "Η λεζάντα δημιουργήθηκε",
    connectionLost: "Η σύνδεση χάθηκε",
    connectionRestored: "Η σύνδεση αποκαταστάθηκε",
  },
} as const satisfies Translations;