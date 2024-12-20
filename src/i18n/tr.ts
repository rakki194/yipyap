import { getPathSeparator } from "~/i18n";
import { getTurkishPlural } from "./utils";
import type { Translations, TranslationParams } from "./types";

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
    pathSeparator: getPathSeparator("tr"),
    toggleTheme: "Temayı değiştir",
    theme: "Tema",
    returnToFrontPage: "Ana sayfaya dön",
    home: "Ana Sayfa",
    openSettings: "Ayarları aç",
    create: "Oluştur",
    creating: "Oluşturuluyor...",
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
      christmas: "Noel",
      halloween: "Cadılar Bayramı",
    },
    disableAnimations: "Animasyonları devre dışı bırak",
    language: "Dil",
    disableNonsense: "Japonca metni devre dışı bırak",
    modelSettings: "Model ayarları",
    jtp2ModelPath: "JTP2 model yolu",
    jtp2TagsPath: "JTP2 etiket yolu",
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
    enableMinimap: "Yakınlaştırmada mini haritayı etkinleştir",
    instantDelete: "Anında silmeyi etkinleştir (onay olmadan)",
    warning: "Uyarı",
    gallery: "Galeri",
    preserveLatents: "Latents'i Koruyun",
    preserveLatentsTooltip: "Resimleri silerken .npz (latent) dosyalarını koruyun.",
    preserveTxt: ".txt'yi Koruyun",
    preserveTxtTooltip: "Resimleri silerken .txt dosyalarını koruyun.",
    thumbnailSize: "Küçük resim boyutu",
    thumbnailSizeDescription: "Izgara görünümündeki küçük resimlerin boyutunu ayarlayın",
    thumbnailSizeUpdateError: "Küçük resim boyutu güncellenirken hata oluştu",
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
    imageWork: "Görsellerle çalış",
    audioWork: "Sesle çalış",
    deselectAll: "Seçimi kaldır",
    deleteSelected: "Seçilenleri sil",
  },
  gallery: {
    addTag: "Etiket ekle...",
    addCaption: "Altyazı ekle...",
    quickJump: "Klasöre git...",
    loadingFolders: "Klasörler yükleniyor...",
    noResults: "Sonuç bulunamadı",
    folderCount: (params?: TranslationParams) => `${params?.count ?? 0} klasör`,
    deleteConfirm: "Bu görseli silmek istediğinizden emin misiniz?",
    deleteSuccess: "Görsel başarıyla silindi",
    deleteError: "Görsel silinirken hata oluştu",
    savingCaption: "Altyazı kaydediliyor...",
    savedCaption: "Altyazı kaydedildi",
    errorSavingCaption: "Altyazı kaydedilirken hata oluştu",
    emptyFolder: "Bu klasör boş",
    dropToUpload: "Yüklemek için dosyaları buraya sürükleyin",
    uploadProgress: (params?: TranslationParams) => {
      if (!params?.count) return 'Dosyalar yükleniyor...';
      return `${params.count} ${getTurkishPlural(`${params.count} dosya`, {
        singular: "dosya",
        pluralLar: "dosya",
        pluralLer: "dosya"
      })} yükleniyor...`;
    },
    processingImage: "Görsel işleniyor...",
    generateTags: "Etiket oluştur",
    generatingTags: "Etiketler oluşturuluyor...",
    removeTags: "Etiketleri kaldır",
    createCaption: "Altyazı oluştur",
    captionTypes: {
      txt: "Yeni metin dosyası oluştur",
      tags: "Yeni .tags dosyası oluştur",
      caption: "Yeni .caption dosyası oluştur",
      wd: "Yeni .wd dosyası oluştur"
    },
    noCaptionFiles: "Henüz altyazı dosyası yok!",
    selectedCount: (params?: TranslationParams) => {
      const count = params?.count ?? 0;
      return getTurkishPlural(`${count} öğe`, {
        singular: "1 öğe seçildi",
        pluralLar: `${count} öğe seçildi`,
        pluralLer: `${count} öğe seçildi`
      });
    },
    foundFolders: (params?: TranslationParams) => {
      const count = params?.count ?? 0;
      return getTurkishPlural(`${count} klasör`, {
        singular: "1 klasör bulundu",
        pluralLar: `${count} klasör bulundu`,
        pluralLer: `${count} klasör bulundu`
      });
    },
    deletedCount: (params?: TranslationParams) => {
      const count = params?.count ?? 0;
      return getTurkishPlural(`${count} öğe`, {
        singular: "1 öğe silindi",
        pluralLar: `${count} öğe silindi`,
        pluralLer: `${count} öğe silindi`
      });
    },
    processingImages: (params?: TranslationParams) => {
      const count = params?.count ?? 0;
      return getTurkishPlural(`${count} görsel`, {
        singular: "1 görsel işleniyor...",
        pluralLar: `${count} görsel işleniyor...`,
        pluralLer: `${count} görsel işleniyor...`
      });
    },
    confirmMultiDelete: ({ folders = 0, images = 0 }) => {
      if (folders > 0 && images > 0) {
        const folderText = getTurkishPlural(`${folders} klasör`, {
          singular: "1 klasör",
          pluralLar: `${folders} klasör`,
          pluralLer: `${folders} klasör`
        });
        const imageText = getTurkishPlural(`${images} görsel`, {
          singular: "1 görsel",
          pluralLar: `${images} görsel`,
          pluralLer: `${images} görsel`
        });
        return `${folderText} ve ${imageText} silmek istediğinizden emin misiniz?`;
      } else if (folders > 0) {
        return getTurkishPlural(`${folders} klasör`, {
          singular: "1 klasörü silmek istediğinizden emin misiniz?",
          pluralLar: `${folders} klasörü silmek istediğinizden emin misiniz?`,
          pluralLer: `${folders} klasörü silmek istediğinizden emin misiniz?`
        });
      }
      return getTurkishPlural(`${images} görsel`, {
        singular: "1 görseli silmek istediğinizden emin misiniz?",
        pluralLar: `${images} görseli silmek istediğinizden emin misiniz?`,
        pluralLer: `${images} görseli silmek istediğinizden emin misiniz?`
      });
    },
    selectAll: "Tümünü seç",
    createFolder: "Klasör oluştur",
    moveToFolder: (params?: TranslationParams) => `"${params?.name ?? ''}" klasörüne taşı`,
    uploadError: "Dosya yüklenirken hata oluştu",
    dropOverlay: "Dosyaları buraya bırakın",
    deselectAll: "Seçimi kaldır",
    deleteSelected: "Seçilenleri sil",
    confirmFolderDelete: ({ name = "" }) => `"${name}" klasörünü silmek istediğinizden emin misiniz?`,
    someFolderDeletesFailed: "Bazı klasörler silinemedi",
    folderDeleteError: "Klasör silinirken hata oluştu",
    deletingFile: "Dosya siliniyor...",
    fileDeleteSuccess: "Dosya silindi",
    fileDeleteError: "Dosya silinirken hata oluştu",
    folderLocation: (params?: TranslationParams) => `${params?.name ?? ''} içinde`,
    workWithFolder: (params?: TranslationParams) => `${params?.name ?? ''} ile çalış`,
    folderNamePlaceholder: "Klasör adı",
    deleteConfirmation: "Silmeyi onayla",
    fileCount: (params?: TranslationParams) => {
      const count = params?.count ?? 0;
      return getTurkishPlural(`${count} dosya`, {
        singular: "1 dosya",
        pluralLar: `${count} dosya`,
        pluralLer: `${count} dosya`
      });
    },
    imageCount: (params?: TranslationParams) => {
      const count = params?.count ?? 0;
      return getTurkishPlural(`${count} görsel`, {
        singular: "1 görsel",
        pluralLar: `${count} görsel`,
        pluralLer: `${count} görsel`
      });
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
    removeCommas: "Virülleri kaldır",
    replaceNewlinesWithCommas: "Satır sonlarını virgülle değiştir",
    replaceUnderscoresWithSpaces: "Alt çizgileri boşlukla değiştir",
  },
  notifications: {
    imageCopied: "Resim panoya kopyalandı",
    imageCopyFailed: "Resim panoya kopyalanamadı",
    folderCreated: "Klasör başarıyla oluşturuldu",
    folderCreateError: "Klasör oluşturulurken hata oluştu"
  },
} as const satisfies Translations;
