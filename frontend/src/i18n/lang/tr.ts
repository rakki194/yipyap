import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "../types";
import { createPluralTranslation } from "../plurals";

export default {
  common: {
    close: "Kapat",
    delete: "Sil",
    cancel: "İptal",
    save: "Kaydet",
    edit: "Düzenle",
    add: "Ekle",
    remove: "Kaldır",
    loading: "Yükleniyor...",
    error: "Hata",
    success: "Başarılı",
    confirm: "Onayla",
    download: "İndir",
    path: "Yol",
    size: "Boyut",
    date: "Tarih",
    name: "İsim",
    type: "Tür",
    actions: "İşlemler",
    search: "Ara...",
    filter: "Filtrele",
    apply: "Uygula",
    reset: "Sıfırla",
    selected: "Seçili",
    all: "Tümü",
    none: "Hiçbiri",
    notFound: "404 - Sayfa bulunamadı",
    pathSeparator: getPathSeparator("tr"),
    toggleTheme: "Temayı değiştir",
    theme: "Tema",
    returnToFrontPage: "Ana sayfaya dön",
    home: "Ana Sayfa",
    openSettings: "Ayarları aç",
    create: "Oluştur",
    creating: "Oluşturuluyor...",
    language: "Dil",
    description: "Açıklama",
  },
  settings: {
    title: "Ayarlar",
    appearance: "Görünüm",
    theme: {
      light: "Açık",
      gray: "Gri",
      dark: "Koyu",
      banana: "Muz",
      strawberry: "Çilek",
      peanut: "Fıstık",
      "high-contrast-black": "Yüksek Kontrast Siyah",
      "high-contrast-inverse": "Yüksek Kontrast Ters",
    },
    disableAnimations: "Animasyonları devre dışı bırak",
    disableAnimationsTooltip: "Performans için tüm animasyonları devre dışı bırakın",
    language: "Dil",
    languageTooltip: "Arayüz dilini seçin",
    disableNonsense: "Japonca metni devre dışı bırak",
    disableNonsenseTooltip: "Gereksiz Japonca metinleri gizle",
    modelSettings: "Model ayarları",
    jtp2ModelPath: "JTP2 Model Yolu",
    jtp2ModelPathTooltip: "JTP2 model dosyası yolu (.safetensors)",
    jtp2TagsPath: "JTP2 Etiket Yolu",
    jtp2TagsPathTooltip: "JTP2 etiket dosyası yolu (.json)",
    jtp2Threshold: "JTP2 Eşiği",
    jtp2ThresholdTooltip: "Etiketleri dahil etmek için güven eşiği (0.0 - 1.0)",
    jtp2ForceCpu: "JTP2 CPU Zorla",
    jtp2ForceCpuTooltip: "JTP2'yi GPU yerine CPU kullanmaya zorla",
    wdv3ModelName: "WDv3 Modeli",
    wdv3ModelNameTooltip: "WDv3 model mimarisini seç (ViT, SwinV2 veya ConvNext)",
    wdv3GenThreshold: "Genel Etiket Eşiği",
    wdv3GenThresholdTooltip: "Genel etiketler için güven eşiği (varsayılan: 0.35)",
    wdv3CharThreshold: "Karakter Etiket Eşiği",
    wdv3CharThresholdTooltip: "Karakter etiketleri için güven eşiği (varsayılan: 0.75)",
    wdv3ForceCpu: "WDv3 CPU Zorla",
    wdv3ForceCpuTooltip: "WDv3'ü GPU yerine CPU kullanmaya zorla",
    wdv3ConfigUpdateError: "WDv3 yapılandırması güncellenirken hata oluştu",
    downloadModel: "Modeli indir (1.8GB)",
    downloadTags: "Etiketleri indir (195KB)",
    viewMode: "Görünüm modu",
    gridView: "Izgara görünümü",
    listView: "Liste görünümü",
    sortBy: "Sıralama",
    sortByName: "İsme göre sırala",
    sortByDate: "Tarihe göre sırala",
    sortBySize: "Boyuta göre sırala",
    experimentalFeatures: "Deneysel özellikler",
    enableZoom: "Yakınlaştırmayı etkinleştir",
    enableZoomTooltip: "Galeride yakınlaştırmayı etkinleştir",
    enableMinimap: "Yakınlaştırmada mini haritayı etkinleştir",
    enableMinimapTooltip: "Yakınlaştırırken mini haritayı göster",
    alwaysShowCaptionEditor: "Başlık düzenleyiciyi her zaman göster",
    alwaysShowCaptionEditorTooltip: "Başlık düzenleyiciyi sürekli görünür tut",
    instantDelete: "Anında silmeyi etkinleştir (onay olmadan)",
    instantDeleteTooltip: "Dosyaları onay istemeden sil",
    warning: "Uyarı",
    gallery: "Galeri",
    preserveLatents: "Latents'i Koruyun",
    preserveLatentsTooltip: "Resimleri taşırken veya silerken .npz (latent) dosyalarını koruyun.",
    preserveTxt: ".txt'yi Koruyun",
    preserveTxtTooltip: "Resimleri taşırken veya silerken .txt dosyalarını koruyun.",
    thumbnailSize: "Küçük resim boyutu",
    thumbnailSizeDescription: "Izgara görünümündeki küçük resimlerin boyutunu ayarlayın",
    thumbnailSizeUpdateError: "Küçük resim boyutu güncellenirken hata oluştu",
  },
  gallery: {
    addTag: "Etiket ekle",
    addCaption: "Başlık ekle",
    quickJump: "Hızlı geçiş",
    loadingFolders: "Klasörler yükleniyor...",
    noResults: "Sonuç yok",
    pathNotFound: "Yol bulunamadı",
    folderCount: createPluralTranslation({
      one: "1 klasör",
      other: "${count} klasör"
    }, "tr"),
    fileCount: createPluralTranslation({
      one: "1 dosya",
      other: "${count} dosya"
    }, "tr"),
    imageCount: createPluralTranslation({
      one: "1 resim",
      other: "${count} resim"
    }, "tr"),
    foundFolders: createPluralTranslation({
      one: "1 klasör bulundu",
      other: "${count} klasör bulundu"
    }, "tr"),
    deletedCount: createPluralTranslation({
      one: "1 öğe silindi",
      other: "${count} öğe silindi"
    }, "tr"),
    deleteConfirm: (params: TranslationParams) => {
      const name = params.name ?? "bu öğe";
      return `"${name}" öğesini silmek istediğinizden emin misiniz?`;
    },
    deleteSuccess: "Silme tamamlandı",
    deleteError: (params: TranslationParams) => {
      const name = params.name ?? "öğe";
      return `"${name}" silinirken hata oluştu`;
    },
    savingCaption: (params: TranslationParams) => {
      const name = params.name ?? "öğe";
      return `"${name}" için başlık kaydediliyor...`;
    },
    savedCaption: "Başlık kaydedildi",
    errorSavingCaption: (params: TranslationParams) => {
      const name = params.name ?? "öğe";
      return `"${name}" için başlık kaydedilirken hata oluştu`;
    },
    emptyFolder: "Bu klasör boş",
    dropToUpload: "Yüklemek için dosyaları buraya bırakın",
    uploadProgress: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Dosyalar yükleniyor...';
      }
      return createPluralTranslation({
        one: "1 dosya yükleniyor...",
        other: "${count} dosya yükleniyor..."
      }, "tr")(params);
    },
    uploadProgressPercent: "Yükleniyor... {progress}%",
    filesExceedLimit: "Dosyalar çok büyük: {files}",
    noFilesToUpload: "Yüklenecek dosya yok",
    processingFiles: "Dosyalar işleniyor...",
    uploadComplete: "Yükleme tamamlandı",
    uploadFailed: "Yükleme başarısız: {error}",
    deletingFiles: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Dosyalar siliniyor...';
      }
      return createPluralTranslation({
        one: "1 dosya siliniyor...",
        other: "${count} dosya siliniyor..."
      }, "tr")(params);
    },
    deleteComplete: "Silme tamamlandı",
    deleteFailed: "Silme başarısız",
    processingImage: (params: TranslationParams) => {
      const name = params.name ?? "resim";
      return `"${name}" işleniyor...`;
    },
    processingImages: createPluralTranslation({
      one: "1 resim işleniyor...",
      other: "${count} resim işleniyor..."
    }, "tr"),
    generatingCaption: "Başlık oluşturuluyor...",
    captionGenerated: "Başlık oluşturuldu",
    generateTags: "Etiket oluştur",
    generatingTags: "Etiketler oluşturuluyor...",
    removeTags: "Etiketleri kaldır",
    createCaption: "Başlık oluştur",
    captionTypes: {
      txt: "Txt",
      tags: "Etiketler",
      caption: "Başlık",
      wd: "WD",
    },
    noCaptionFiles: "Başlık dosyası yok",
    uploadError: "Yükleme hatası",
    dropOverlay: "Yüklemek için bırakın",
    selectAll: "Tümünü seç",
    deselectAll: "Seçimi kaldır",
    deleteSelected: "Seçilenleri sil",
    confirmMultiDelete: (params: TranslationParams | null | undefined = {}) => {
      if (!params || typeof params !== 'object') {
        return 'Bu öğeleri silmek istediğinizden emin misiniz?';
      }
      const folders = typeof params.folders === 'number' ? params.folders : 0;
      const images = typeof params.images === 'number' ? params.images : 0;
      
      if (folders === 0 && images === 0) {
        return 'Bu öğeleri silmek istediğinizden emin misiniz?';
      }

      const parts = [];
      if (folders > 0) {
        parts.push(createPluralTranslation({
          one: "1 klasör",
          other: "${count} klasör"
        }, "tr")({ count: folders }));
      }
      if (images > 0) {
        parts.push(createPluralTranslation({
          one: "1 resim",
          other: "${count} resim"
        }, "tr")({ count: images }));
      }
      return `${parts.join(" ve ")} silmek istediğinizden emin misiniz?`;
    },
    confirmFolderDelete: (params: TranslationParams) => {
      const name = params.name ?? "klasör";
      return `"${name}" klasörünü ve tüm içeriğini silmek istediğinizden emin misiniz?`;
    },
    someFolderDeletesFailed: "Bazı klasörler silinemedi",
    folderDeleteError: "Bir veya daha fazla klasör silinirken hata oluştu",
    deletingFile: "Dosya siliniyor...",
    fileDeleteSuccess: "Dosya başarıyla silindi",
    fileDeleteError: "Bir veya daha fazla dosya silinirken hata oluştu",
    createFolder: "Klasör oluştur",
    folderNamePlaceholder: "Klasör adı",
    deleteConfirmation: "Silme onayı",
    selectedCount: createPluralTranslation({
      one: "1 öğe seçildi",
      other: "${count} öğe seçildi"
    }, "tr"),
    folderLocation: (params: TranslationParams) => {
      const name = params.name ?? "";
      return `Konum: ${name}`;
    },
    moveToFolder: (params: TranslationParams) => {
      const name = params.name ?? "klasör";
      return `"${name}" klasörüne taşı`;
    },
    workWithFolder: (params: TranslationParams) => {
      const name = params.name ?? "klasör";
      return `"${name}" klasörü ile çalış`;
    },
  },
  shortcuts: {
    title: "Klavye kısayolları",
    galleryNavigation: "Galeri gezinme",
    quickFolderSwitch: "Hızlı klasör değiştirme",
    aboveImage: "Üstteki görsel",
    belowImage: "Alttaki görsel",
    previousImage: "Önceki görsel",
    nextImage: "Sonraki görsel",
    togglePreview: "Önizlemeyi aç/kapat",
    tagNavigation: "Etiket gezinme",
    previousTag: "Önceki etiket",
    nextTag: "Sonraki etiket",
    switchTagBubble: "Etiket balonlarına geç",
    switchTagInput: "Etiket girişine geç",
    cycleCaptions: "Altyazılar arasında geçiş yap",
    firstTagRow: "Satırdaki ilk etiket",
    lastTagRow: "Satırdaki son etiket",
    doubleShift: "Çift Shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Etiketi kaldır",
    other: "Diğer",
    esc: "Esc",
    closePreview: "Önizleme/modalı kapat",
    deleteImage: "Görseli sil",
    toggleImagePreview: "Görsel önizlemeyi aç/kapat",
    copyToClipboard: "Resmi panoya kopyala",
  },
  imageViewer: {
    zoomIn: "Yakınlaştır",
    zoomOut: "Uzaklaştır",
    resetZoom: "Yakınlaştırmayı sıfırla",
    toggleMinimap: "Mini haritayı aç/kapat",
    previousImage: "Önceki görsel",
    nextImage: "Sonraki görsel",
    copyPath: "Yolu kopyala",
    openInNewTab: "Yeni sekmede aç",
    fitToScreen: "Ekrana sığdır",
    actualSize: "Gerçek boyut",
    rotateLeft: "Sola döndür",
    rotateRight: "Sağa döndür",
    downloadImage: "Görseli indir",
    imageInfo: "Görsel bilgisi",
    dimensions: "Boyutlar",
  },
  tools: {
    transformations: "Dönüşümler",
    addTransformation: "Dönüşüm Ekle",
    transformationType: "Dönüşüm Türü",
    transformationTypes: {
      searchReplace: "Ara ve Değiştir",
      case: "Büyük/Küçük Harf",
      trim: "Kırpma",
      wrap: "Sarmalama",
      number: "Sayı"
    },
    caseTypes: {
      upper: "Büyük Harf",
      lower: "Küçük Harf",
      title: "Başlık Stili",
      sentence: "Cümle Stili"
    },
    trimTypes: {
      all: "Tümü",
      start: "Başlangıç",
      end: "Son",
      duplicates: "Tekrarlar"
    },
    numberActions: {
      remove: "Kaldır",
      format: "Biçimlendir",
      extract: "Çıkar"
    },
    numberFormat: "Sayı Formatı",
    numberFormatPlaceholder: "Sayı formatını girin",
    prefix: "Önek",
    suffix: "Sonek",
    prefixPlaceholder: "Önek girin",
    suffixPlaceholder: "Sonek girin",
    transformationNamePlaceholder: "Dönüşüm adını girin",
    transformationDescriptionPlaceholder: "Dönüşüm açıklamasını girin",
    searchPattern: "Arama Deseni",
    searchPatternPlaceholder: "Aranacak metni girin",
    replacement: "Değiştirme",
    replacementPlaceholder: "Değiştirilecek metni girin",
    selectIcon: "Simge Seç",
    removeCommas: "Virülleri Kaldır",
    replaceNewlinesWithCommas: "Yeni Satırları Virgülle Değiştir",
    replaceUnderscoresWithSpaces: "Alt Çizgileri Boşlukla Değiştir"
  },
  notifications: {
    imageCopied: "Resim kopyalandı",
    imageCopyFailed: "Kopyalama başarısız",
    folderCreated: "Klasör oluşturuldu",
    folderCreateError: "Klasör oluşturulurken hata oluştu",
    generatingCaption: "Başlık oluşturuluyor...",
    captionGenerated: "Başlık oluşturuldu",
    connectionLost: "Bağlantı kesildi",
    connectionRestored: "Bağlantı yeniden kuruldu",
  },
} as const satisfies Translations;
