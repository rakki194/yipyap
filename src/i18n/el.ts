import { getPathSeparator } from "~/i18n";
import type { Translations } from "./types";

const translations: Translations = {
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
    pathSeparator: getPathSeparator("el"),
    toggleTheme: "Εναλλαγή θέματος",
    theme: "Θέμα",
    returnToFrontPage: "Επιστροφή στην αρχική σελίδα",
    home: "Αρχική",
    openSettings: "Άνοιγμα ρυθμίσεων",
  },
  settings: {
    title: "Ρυθμίσεις",
    appearance: "Εμφάνιση",
    gallery: "Συλλογή",
    language: "Γλώσσα",
    modelSettings: "Ρυθμίσεις μοντέλου",
    experimentalFeatures: "Πειραματικές λειτουργίες",
    disableAnimations: "Απενεργοποίηση κινήσεων",
    disableJapanese: "Απενεργοποίηση Ιαπωνικών",
    instantDelete: "Άμεση διαγραφή (χωρίς επιβεβαίωση)",
    enableZoom: "Ενεργοποίηση μεγέθυνσης",
    enableMinimap: "Ενεργοποίηση μικρογραφίας",
    theme: {
      light: "Φωτεινό",
      gray: "Γκρι",
      dark: "Σκοτεινό",
      banana: "Μπανάνα",
      strawberry: "Φράουλα",
      peanut: "Φιστίκι",
      halloween: "Halloween",
      christmas: "Χριστούγεννα",
    },
    gridView: "Προβολή πλέγματος",
    listView: "Προβολή λίστας",
    sortBy: "Ταξινόμηση κατά",
    sortByName: "Ταξινόμηση κατά όνομα",
    sortByDate: "Ταξινόμηση κατά ημερομηνία",
    sortBySize: "Ταξινόμηση κατά μέγεθος",
    jtp2ModelPath: "Διαδρομή μοντέλου JTP2",
    jtp2TagsPath: "Διαδρομή ετικετών JTP2",
    downloadModel: "Λήψη μοντέλου (1.8GB)",
    downloadTags: "Λήψη ετικετών (195KB)",
    viewMode: "Τρόπος προβολής",
    warning: "Προειδοποίηση"
  },
  frontPage: {
    subtitle: {
      1: "Τα μεγάλα γλωσσικά μοντέλα εξαπατούν, ψεύδονται και παραισθάνονται. Όπως κι εγώ!",
      2: "Βρήκαμε έναν διαφορετικό τρόπο προσευχής",
      3: "Το άπειρο σύμπαν αντανακλάται σε άδεια μάτια",
      4: "Σκουριασμένη καρδιά, νέος βλαστός",
      5: "Μαγικό μέρος όπου το όνειρο και η πραγματικότητα διασταυρώνονται",
      6: "Άγνωστη περιοχή, άπειρες δυνατότητες",
      7: "Αιώνια αγάπη που υπερβαίνει τη ροή του χρόνου",
      8: "Αυτό θα σας διώξει!",
    },
    imageWork: "Εργασία με εικόνες",
    audioWork: "Εργασία με ήχο",
  },
  gallery: {
    addTag: "Προσθήκη ετικέτας...",
    addCaption: "Προσθήκη λεζάντας...",
    quickJump: "Μετάβαση σε φάκελο...",
    loadingFolders: "Φόρτωση φακέλων...",
    noResults: "Δεν βρέθηκαν αποτελέσματα",
    folderCount: "{count} φάκελοι",
    deleteConfirm: "Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτήν την εικόνα;",
    deleteSuccess: "Η εικόνα διαγράφηκε με επιτυχία",
    deleteError: "Σφάλμα κατά τη διαγραφή της εικόνας",
    savingCaption: "Αποθήκευση λεζάντας...",
    savedCaption: "Η λεζάντα αποθηκεύτηκε",
    errorSavingCaption: "Σφάλμα κατά την αποθήκευση της λεζάντας",
    emptyFolder: "Αυτός ο φάκελος είναι κενός",
    dropToUpload: "Σύρετε αρχεία εδώ για μεταφόρτωση",
    uploadProgress: "Μεταφόρτωση {count} αρχείων...",
    processingImage: "Επεξεργασία εικόνας...",
    generateTags: "Δημιουργία ετικετών",
    generatingTags: "Δημιουργία ετικετών...",
    removeTags: "Αφαίρεση ετικετών",
    createCaption: "Δημιουργία λεζάντας",
    captionTypes: {
      txt: "Δημιουργία νέου αρχείου κειμένου",
      tags: "Δημιουργία νέου αρχείου .tags",
      caption: "Δημιουργία νέου αρχείου .caption",
      wd: "Δημιουργία νέου αρχείου .wd"
    },
    noCaptionFiles: "Δεν υπάρχουν ακόμη αρχεία λεζάντας!",
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
    removeCommas: "Αφαίρεση κομμάτων",
    replaceNewlinesWithCommas: "Αντικατάσταση αλλαγών γραμμής με κόμματα",
    replaceUnderscoresWithSpaces: "Αντικατάσταση κάτω παύλων με κενά",
  },
}; 