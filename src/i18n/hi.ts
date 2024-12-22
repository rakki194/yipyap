import type { Translations, TranslationParams } from "./types";
import { getPathSeparator } from "~/i18n";
import { createPluralTranslation } from "./plurals";

export default {
  common: {
    search: "खोजें",
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    success: "सफल",
    cancel: "रद्द करें",
    save: "सहेजें",
    delete: "हटाएं",
    edit: "संपादित करें",
    close: "बंद करें",
    confirm: "पुष्टि करें",
    pathSeparator: getPathSeparator("hi"),
    add: "जोड़ें",
    remove: "हटाएं",
    download: "डाउनलोड करें",
    path: "पथ",
    size: "आकार",
    date: "दिनांक",
    name: "नाम",
    type: "प्रकार",
    actions: "कार्रवाइयां",
    filter: "फ़िल्टर",
    apply: "लागू करें",
    reset: "रीसेट करें",
    selected: "चयनित",
    all: "सभी",
    none: "कोई नहीं",
    toggleTheme: "थीम टॉगल करें",
    returnToFrontPage: "मुख्य पृष्ठ पर वापस जाएं",
    home: "होम",
    openSettings: "सेटिंग्स खोलें",
    create: "बनाएं",
    creating: "बना रहे हैं...",
    theme: "थीम"
  },
  settings: {
    appearance: "दिखावट",
    theme: {
      light: "लाइट",
      dark: "डार्क",
      gray: "ग्रे",
      banana: "केला",
      strawberry: "स्ट्रॉबेरी",
      peanut: "मूंगफली",
      christmas: "क्रिसमस",
      halloween: "हैलोवीन"
    },
    enableZoom: "ज़ूम सक्षम करें",
    enableMinimap: "मिनीमैप सक्षम करें",
    alwaysShowCaptionEditor: "कैप्शन एडिटर हमेशा दिखाएं",
    instantDelete: "तुरंत हटाएं",
    disableAnimations: "एनिमेशन बंद करें",
    disableNonsense: "जापानी बंद करें",
    modelSettings: (params: TranslationParams) => "मॉडल सेटिंग्स",
    jtp2ModelPath: "JTP2 मॉडल पथ",
    gallery: "गैलरी",
    title: "सेटिंग्स",
    experimentalFeatures: "प्रायोगिक सुविधाएं",
    language: "भाषा",
    jtp2TagsPath: "JTP2 टैग पथ",
    downloadModel: "मॉडल डाउनलोड करें (1.8 GB)",
    downloadTags: "टैग डाउनलोड करें (195 KB)",
    viewMode: "व्यू मोड",
    gridView: "ग्रिड व्यू",
    listView: "लिस्ट व्यू",
    sortBy: "इसके अनुसार क्रमबद्ध करें",
    sortByName: "नाम के अनुसार क्रमबद्ध करें",
    sortByDate: "दिनांक के अनुसार क्रमबद्ध करें",
    sortBySize: "आकार के अनुसार क्रमबद्ध करें",
    warning: "चेतावनी",
    preserveLatents: "लेटेंट्स संरक्षित रखें",
    preserveLatentsTooltip: "छवियां हटाते समय .npz (latent) फ़ाइलें रखें।",
    preserveTxt: ".txt संरक्षित रखें",
    preserveTxtTooltip: "छवियां हटाते समय .txt फ़ाइलें रखें।",
    thumbnailSize: "थंबनेल आकार",
    thumbnailSizeDescription: "पिक्सेल में थंबनेल का आकार (उदाहरण: 250)",
    thumbnailSizeUpdateError: "थंबनेल आकार अपडेट करने में विफल"
  },
  frontPage: {
    subtitle: {
      1: "बड़े भाषा मॉडल धोखा करते हैं, झूठ बोलते हैं, और भ्रम में रहते हैं। बिल्कुल मेरी तरह!",
      2: "हमने प्रार्थना का एक नया तरीका खोजा है",
      3: "खाली आंखों में परिलक्षित अनंत ब्रह्मांड",
      4: "जंग लगे दिल में नई उम्मीद",
      5: "सपने और वास्तविकता का अद्भुत मिश्रण",
      6: "अज्ञात क्षेत्र, असीमित संभावनाएं",
      7: "समय से परे, अनंत प्रेम",
      8: "इससे तो निकाल दिए जाएंगे!"
    },
    imageWork: "छवियों के साथ काम करें",
    audioWork: "ऑडियो के साथ काम करें",
    deselectAll: "सभी अचयनित करें",
    deleteSelected: "चयनित हटाएं"
  },
  gallery: {
    addTag: "टैग जोड़ें...",
    addCaption: "कैप्शन जोड़ें...",
    quickJump: "फ़ोल्डर में जाएं...",
    loadingFolders: "फ़ोल्डर लोड हो रहे हैं...",
    noResults: "कोई परिणाम नहीं मिला",
    folderCount: (params?: TranslationParams) => `${params?.count ?? 0} फ़ोल्डर`,
    deleteConfirm: (params: TranslationParams) => {
      const name = params.name ?? "यह आइटम";
      return `क्या आप वाकई "${name}" को हटाना चाहते हैं?`;
    },
    deleteSuccess: "छवि सफलतापूर्वक हटा दी गई",
    deleteError: (params: TranslationParams) => {
      const name = params.name ?? "आइटम";
      return `"${name}" को हटाने में त्रुटि`;
    },
    savingCaption: (params: TranslationParams) => {
      const name = params.name ?? "आइटम";
      return `"${name}" का कैप्शन सहेजा जा रहा है...`;
    },
    savedCaption: "कैप्शन सहेजा गया",
    errorSavingCaption: (params: TranslationParams) => {
      const name = params.name ?? "आइटम";
      return `"${name}" का कैप्शन सहेजने में त्रुटि`;
    },
    emptyFolder: "यह फ़ोल्डर खाली है",
    dropToUpload: "अपलोड करने के लिए फ़ाइलें यहां छोड़ें",
    uploadProgress: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'फ़ाइलें अपलोड हो रही हैं...';
      }
      return createPluralTranslation({
        one: "1 फ़ाइल अपलोड हो रही है...",
        other: "${count} फ़ाइलें अपलोड हो रही हैं..."
      }, "hi")(params);
    },
    uploadProgressPercent: "अपलोड हो रहा है... {progress}%",
    processingImage: (params: TranslationParams) => {
      const name = params.name ?? "छवि";
      return `"${name}" प्रोसेस हो रही है...`;
    },
    generateTags: "टैग जनरेट करें",
    generatingTags: "टैग जनरेट हो रहे हैं...",
    uploadError: "अपलोड विफल रहा",
    dropOverlay: "फ़ाइलें या फ़ोल्डर यहां छोड़ें",
    confirmMultiDelete: (params: TranslationParams | null | undefined = {}) => {
      if (!params || typeof params !== 'object') {
        return 'क्या आप वाकई इन आइटम्स को हटाना चाहते हैं?';
      }
      const folders = typeof params.folders === 'number' ? params.folders : 0;
      const images = typeof params.images === 'number' ? params.images : 0;
      
      if (folders === 0 && images === 0) {
        return 'क्या आप वाकई इन आइटम्स को हटाना चाहते हैं?';
      }

      const parts = [];
      if (folders > 0) {
        parts.push(createPluralTranslation({
          one: "1 फ़ोल्डर",
          other: "${count} फ़ोल्डर"
        }, "hi")({ count: folders }));
      }
      if (images > 0) {
        parts.push(createPluralTranslation({
          one: "1 छवि",
          other: "${count} छवियां"
        }, "hi")({ count: images }));
      }
      return `क्या आप वाकई ${parts.join(" और ")} को हटाना चाहते हैं?`;
    },
    confirmFolderDelete: (params: TranslationParams) => {
      const name = params.name ?? "फ़ोल्डर";
      return `क्या आप वाकई फ़ोल्डर "${name}" और इसकी सभी सामग्री को हटाना चाहते हैं?`;
    },
    someFolderDeletesFailed: "कुछ फ़ोल्डर हटाए नहीं जा सके",
    folderDeleteError: "फ़ोल्डर हटाने में त्रुटि",
    filesExceedLimit: "फ़ाइलें बहुत बड़ी हैं: {files}",
    noFilesToUpload: "अपलोड करने के लिए कोई फ़ाइल नहीं है",
    processingFiles: "फ़ाइलें प्रोसेस हो रही हैं...",
    uploadComplete: "अपलोड पूरा हुआ",
    uploadFailed: "अपलोड विफल रहा: {error}",
    deleteComplete: "हटाना पूरा हुआ",
    deleteFailed: "हटाना विफल रहा",
    generatingCaption: "कैप्शन जनरेट किया जा रहा है...",
    captionGenerated: "कैप्शन जनरेट किया गया",
    workWithFolder: (params: TranslationParams) => {
      const name = params.name ?? "फ़ोल्डर";
      return `"${name}" के साथ काम करें`;
    },
    deletingFiles: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'फ़ाइलें हटाई जा रही हैं...';
      }
      return createPluralTranslation({
        one: "1 फ़ाइल हटाई जा रही है...",
        other: "${count} फ़ाइलें हटाई जा रही हैं..."
      }, "hi")(params);
    },
    deleteSelected: "चयनित हटाएं",
    removeTags: "टैग हटाएं",
    createCaption: "कैप्शन बनाएं",
    captionTypes: {
      txt: "नई टेक्स्ट फ़ाइल बनाएं",
      tags: "नई .tags फ़ाइल बनाएं",
      caption: "नई .caption फ़ाइल बनाएं",
      wd: "नई .wd फ़ाइल बनाएं"
    },
    noCaptionFiles: "अभी तक कोई कैप्शन फ़ाइल नहीं है!",
    deletingFile: "फ़ाइल हटा रहा है...",
    fileDeleteSuccess: "फ़ाइल सफलतापूर्वक हटा दी गई",
    fileDeleteError: "फ़ाइल हटाने में त्रुटि",
    fileCount: (params?: TranslationParams) => `${params?.count ?? 0} फ़ाइलें`,
    imageCount: (params?: TranslationParams) => `${params?.count ?? 0} छवियां`,
    foundFolders: (params?: TranslationParams) => `${params?.count ?? 0} फ़ोल्डर मिले`,
    deletedCount: (params?: TranslationParams) => `${params?.count ?? 0} आइटम हटाए गए`,
    selectedCount: (params?: TranslationParams) => `${params?.count ?? 0} चयनित`,
    processingImages: (params?: TranslationParams) => `${params?.count ?? 0} छवियां प्रोसेस हो रही हैं...`,
    folderLocation: (params?: TranslationParams) => `स्थान: ${params?.name ?? ''}`,
    moveToFolder: (params?: TranslationParams) => `${params?.name ?? ''} में ले जाएं`,
    createFolder: "फ़ोल्डर बनाएं",
    folderNamePlaceholder: "फ़ोल्डर का नाम",
    deleteConfirmation: "हटाने की पुष्टि",
    selectAll: "सभी चुनें",
    deselectAll: "सभी अचयनित करें"
  },
  shortcuts: {
    title: "कीबोर्ड शॉर्टकट",
    galleryNavigation: "गैलरी नेविगेशन",
    quickFolderSwitch: "त्वरित फ़ोल्डर स्विच",
    aboveImage: "ऊपर की छवि",
    belowImage: "नीचे की छवि",
    previousImage: "पिछली छवि",
    nextImage: "अगली छवि",
    togglePreview: "प्रीव्यू टॉगल करें",
    tagNavigation: "टैग नेविगेशन",
    previousTag: "पिछला टैग",
    nextTag: "अगला टैग",
    switchTagBubble: "टैग बबल पर स्विच करें",
    switchTagInput: "टैग इनपुट पर स्विच करें",
    cycleCaptions: "कैप्शन चक्र",
    firstTagRow: "पहली पंक्ति का टैग",
    lastTagRow: "अंतिम पंक्ति का टैग",
    doubleShift: "डबल शिफ्ट",
    shift: "शिफ्ट",
    del: "डिलीट",
    removeTag: "टैग हटाएं",
    other: "अन्य",
    esc: "एस्केप",
    closePreview: "प्रीव्यू/मोडल बंद करें",
    deleteImage: "छवि हटाएं",
    toggleImagePreview: "छवि प्रीव्यू टॉगल करें",
    copyToClipboard: "छवि को क्लिपबोर्ड में कॉपी करें"
  },
  imageViewer: {
    zoomIn: "ज़ूम इन",
    zoomOut: "ज़ूम आउट",
    resetZoom: "ज़ूम रीसेट करें",
    toggleMinimap: "मिनीमैप टॉगल करें",
    previousImage: "पिछली छवि",
    nextImage: "अगली छवि",
    copyPath: "पथ कॉपी करें",
    openInNewTab: "नए टैब में खोलें",
    fitToScreen: "स्क्रीन के अनुसार फिट करें",
    actualSize: "वास्तविक आकार",
    rotateLeft: "बाएं घुमाएं",
    rotateRight: "दाएं घुमाएं",
    downloadImage: "छवि डाउनलोड करें",
    imageInfo: "छवि की जानकारी",
    dimensions: "आयाम"
  },
  tools: {
    removeCommas: "कॉमा हटाएं",
    replaceNewlinesWithCommas: "नई लाइनों को कॉमा से बदलें",
    replaceUnderscoresWithSpaces: "अंडरस्कोर को स्पेस से बदलें"
  },
  notifications: {
    imageCopied: "छवि क्लिपबोर्ड में कॉपी की गई",
    imageCopyFailed: "छवि को क्लिपबोर्ड में कॉपी करने में विफल",
    folderCreated: "फ़ोल्डर सफलतापूर्वक बनाया गया",
    folderCreateError: "फ़ोल्डर बनाने में त्रुटि",
    generatingCaption: "कैप्शन जनरेट किया जा रहा है...",
    captionGenerated: "कैप्शन सफलतापूर्वक जनरेट किया गया",
    connectionLost: "कनेक्शन खो गया है",
    connectionRestored: "कनेक्शन बहाल हो गया है"
  }
} as const satisfies Translations;
