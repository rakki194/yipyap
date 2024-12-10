import { getPathSeparator } from "~/i18n";

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
    disableJapanese: "Japonca metni devre dışı bırak",
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
  },
  gallery: {
    addTag: "Etiket ekle...",
    addCaption: "Altyazı ekle...",
    quickJump: "Klasöre git...",
    loadingFolders: "Klasörler yükleniyor...",
    noResults: "Sonuç bulunamadı",
    folderCount: "{count} klasör",
    deleteConfirm: "Bu görseli silmek istediğinizden emin misiniz?",
    deleteSuccess: "Görsel başarıyla silindi",
    deleteError: "Görsel silinirken hata oluştu",
    savingCaption: "Altyazı kaydediliyor...",
    savedCaption: "Altyazı kaydedildi",
    errorSavingCaption: "Altyazı kaydedilirken hata oluştu",
    emptyFolder: "Bu klasör boş",
    dropToUpload: "Yüklemek için dosyaları buraya sürükleyin",
    uploadProgress: "{count} dosya yükleniyor...",
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
}; 