import { getPathSeparator } from "~/i18n";
import type { Translations } from "./types";

export default {
  common: {
    close: "Tutup",
    delete: "Hapus",
    cancel: "Batal",
    save: "Simpan",
    edit: "Edit",
    add: "Tambah",
    remove: "Hapus",
    loading: "Memuat...",
    error: "Kesalahan",
    success: "Berhasil",
    confirm: "Konfirmasi",
    download: "Unduh",
    path: "Jalur",
    size: "Ukuran",
    date: "Tanggal",
    name: "Nama",
    type: "Tipe",
    actions: "Aksi",
    search: "Cari",
    filter: "Filter",
    apply: "Terapkan",
    reset: "Reset",
    selected: "Dipilih",
    all: "Semua",
    none: "Tidak ada",
    pathSeparator: getPathSeparator("id"),
    toggleTheme: "Ubah Tema",
    theme: "Tema",
    returnToFrontPage: "Kembali ke Halaman Utama",
    home: "Beranda",
    openSettings: "Buka Pengaturan",
    create: "Buat",
    creating: "Membuat...",
  },
  settings: {
    title: "Pengaturan",
    warning: "Peringatan",
    appearance: "Tampilan",
    theme: {
      light: "Terang",
      gray: "Abu-abu",
      dark: "Gelap",
      banana: "Pisang",
      strawberry: "Stroberi",
      peanut: "Kacang",
      halloween: "Halloween",
      christmas: "Natal",
    },
    gallery: "Galeri",
    language: "Bahasa",
    modelSettings: "Pengaturan Model",
    experimentalFeatures: "Fitur Eksperimental",
    disableAnimations: "Nonaktifkan Animasi",
    disableNonsense: "Nonaktifkan Bahasa Jepang",
    instantDelete: "Hapus Instan (tanpa konfirmasi)",
    enableZoom: "Aktifkan Zoom",
    enableMinimap: "Aktifkan Minimap",
    gridView: "Tampilan Grid",
    listView: "Tampilan Daftar",
    sortBy: "Urutkan Berdasarkan",
    sortByName: "Urutkan berdasarkan Nama",
    sortByDate: "Urutkan berdasarkan Tanggal",
    sortBySize: "Urutkan berdasarkan Ukuran",
    jtp2ModelPath: "Path Model JTP2",
    jtp2TagsPath: "Path Tag JTP2",
    downloadModel: "Unduh Model (1.8GB)",
    downloadTags: "Unduh Tag (195KB)",
    viewMode: "Mode Tampilan",
    preserveLatents: "Pertahankan Latents",
    preserveLatentsTooltip: "Pertahankan file .npz (latent) saat menghapus gambar.",
    preserveTxt: "Pertahankan .txt",
    preserveTxtTooltip: "Pertahankan file .txt saat menghapus gambar.",
    thumbnailSize: "Ukuran thumbnail",
    thumbnailSizeDescription: "Ukuran thumbnail dalam piksel (mis. 250)",
    thumbnailSizeUpdateError: "Gagal memperbarui ukuran thumbnail",
  },
  frontPage: {
    subtitle: {
      1: "Model bahasa besar berbuat curang, berbohong, dan berhalusinasi. Seperti saya!",
      2: "Kami telah menemukan cara berdoa yang berbeda",
      3: "Alam semesta tak terbatas terpantul di mata yang kosong",
      4: "Hati yang berkarat, tunas yang baru",
      5: "Tempat ajaib di mana mimpi dan kenyataan bersilangan",
      6: "Wilayah yang tidak diketahui, kemungkinan tak terbatas",
      7: "Cinta abadi yang melampaui aliran waktu",
      8: "Ini akan membuat Anda diusir!",
    },
    imageWork: "Bekerja dengan Gambar",
    audioWork: "Bekerja dengan Audio",
    deselectAll: "Batalkan Pilihan",
    deleteSelected: "Hapus yang Dipilih",
  },
  gallery: {
    addTag: "Tambah tag...",
    addCaption: "Tambah keterangan...",
    quickJump: "Lompat ke folder...",
    loadingFolders: "Memuat folder...",
    noResults: "Tidak ada hasil",
    folderCount: ({ count }: { count: number }) => `${count} folder`,
    deleteConfirm: "Anda yakin ingin menghapus gambar ini?",
    deleteSuccess: "Gambar berhasil dihapus",
    deleteError: "Kesalahan saat menghapus gambar",
    savingCaption: "Menyimpan keterangan...",
    savedCaption: "Keterangan tersimpan",
    errorSavingCaption: "Kesalahan saat menyimpan keterangan",
    emptyFolder: "Folder ini kosong",
    dropToUpload: "Jatuhkan file di sini untuk mengunggah",
    uploadProgress: ({ count }: { count: number }) => `Mengunggah ${count} file...`,
    processingImage: "Memproses gambar...",
    generateTags: "Buat Tag",
    generatingTags: "Membuat tag...",
    removeTags: "Hapus Tag",
    createCaption: "Buat Keterangan",
    captionTypes: {
      txt: "Buat file Teks baru",
      tags: "Buat file .tags baru",
      caption: "Buat file .caption baru",
      wd: "Buat file .wd baru"
    },
    noCaptionFiles: "Belum ada file keterangan!",
    uploadError: "Gagal mengunggah",
    dropOverlay: "Jatuhkan file atau folder di sini",
    selectAll: "Pilih Semua",
    deselectAll: "Batalkan Pilihan",
    deleteSelected: "Hapus yang Dipilih",
    confirmMultiDelete: ({ folders = 0, images = 0 }) => {
      if (folders && images) {
        return `Anda yakin ingin menghapus ${folders} folder dan ${images} gambar?`;
      } else if (folders) {
        return `Anda yakin ingin menghapus ${folders} folder?`;
      }
      return `Anda yakin ingin menghapus ${images} gambar?`;
    },
    confirmFolderDelete: "Anda yakin ingin menghapus folder {name}?",
    someFolderDeletesFailed: "Beberapa folder gagal dihapus",
    folderDeleteError: "Gagal menghapus folder",
    deletingFile: "Menghapus file...",
    fileDeleteSuccess: "File berhasil dihapus",
    fileDeleteError: "Gagal menghapus file",
    fileCount: ({ count }: { count: number }) => `${count} file`,
    imageCount: ({ count }: { count: number }) => `${count} gambar`,
    foundFolders: ({ count }: { count: number }) => `${count} folder ditemukan`,
    deletedCount: ({ count }: { count: number }) => `${count} item dihapus`,
    selectedCount: ({ count }: { count: number }) => `${count} dipilih`,
    processingImages: ({ count }: { count: number }) => `Memproses ${count} gambar...`,
    folderLocation: ({ name }: { name: string }) => `di ${name}`,
    moveToFolder: ({ name }: { name: string }) => `Pindah ke ${name}`,
    workWithFolder: ({ name }: { name: string }) => `Bekerja dengan ${name}`,
    createFolder: "Buat Folder",
    folderNamePlaceholder: "Masukkan nama folder",
    deleteConfirmation: "Konfirmasi Penghapusan",
  },
  shortcuts: {
    title: "Pintasan Keyboard",
    galleryNavigation: "Navigasi Galeri",
    quickFolderSwitch: "Beralih Folder Cepat",
    aboveImage: "Gambar di atas",
    belowImage: "Gambar di bawah",
    previousImage: "Gambar sebelumnya",
    nextImage: "Gambar berikutnya",
    togglePreview: "Alihkan Pratinjau",
    tagNavigation: "Navigasi Tag",
    previousTag: "Tag sebelumnya",
    nextTag: "Tag berikutnya",
    switchTagBubble: "Beralih ke Gelembung Tag",
    switchTagInput: "Beralih ke Input Tag",
    cycleCaptions: "Putar Keterangan",
    firstTagRow: "Tag Pertama di Baris",
    lastTagRow: "Tag Terakhir di Baris",
    doubleShift: "Shift Ganda",
    shift: "Shift",
    del: "Del",
    removeTag: "Hapus Tag",
    other: "Lainnya",
    esc: "Esc",
    closePreview: "Tutup Pratinjau/Modal",
    deleteImage: "Hapus Gambar",
    toggleImagePreview: "Alihkan Pratinjau Gambar",
    copyToClipboard: "Salin gambar ke clipboard",
  },
  imageViewer: {
    zoomIn: "Perbesar",
    zoomOut: "Perkecil",
    resetZoom: "Reset Zoom",
    toggleMinimap: "Alihkan Minimap",
    previousImage: "Gambar Sebelumnya",
    nextImage: "Gambar Berikutnya",
    copyPath: "Salin Path",
    openInNewTab: "Buka di Tab Baru",
    fitToScreen: "Sesuaikan ke Layar",
    actualSize: "Ukuran Sebenarnya",
    rotateLeft: "Putar ke Kiri",
    rotateRight: "Putar ke Kanan",
    downloadImage: "Unduh Gambar",
    imageInfo: "Informasi Gambar",
    dimensions: "Dimensi",
  },
  tools: {
    removeCommas: "Hapus koma",
    replaceNewlinesWithCommas: "Ganti baris baru dengan koma",
    replaceUnderscoresWithSpaces: "Ganti garis bawah dengan spasi",
  },
  notifications: {
    imageCopied: "Gambar disalin ke clipboard",
    imageCopyFailed: "Gagal menyalin gambar ke clipboard",
    folderCreated: "Folder berhasil dibuat",
    folderCreateError: "Gagal membuat folder",
  },
} as const satisfies Translations;
