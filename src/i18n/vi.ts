import { getPathSeparator } from "~/i18n";

export default {
  common: {
    close: "Đóng",
    delete: "Xóa",
    cancel: "Hủy",
    save: "Lưu",
    edit: "Sửa",
    add: "Thêm",
    remove: "Xóa",
    loading: "Đang tải...",
    error: "Lỗi",
    success: "Thành công",
    confirm: "Xác nhận",
    download: "Tải xuống",
    path: "Đường dẫn",
    size: "Kích thước",
    date: "Ngày",
    name: "Tên",
    type: "Loại",
    actions: "Thao tác",
    search: "Tìm kiếm...",
    filter: "Lọc",
    apply: "Áp dụng",
    reset: "Đặt lại",
    selected: "Đã chọn",
    all: "Tất cả",
    none: "Không có",
    pathSeparator: getPathSeparator("vi"),
    toggleTheme: "Chuyển đổi giao diện",
    theme: "Giao diện",
    returnToFrontPage: "Quay lại trang chủ",
    home: "Trang chủ",
    openSettings: "Mở cài đặt",
  },
  settings: {
    title: "Cài đặt",
    appearance: "Giao diện",
    theme: {
      light: "Sáng",
      gray: "Xám",
      dark: "Tối",
      banana: "Chuối",
      strawberry: "Dâu tây",
      peanut: "Đậu phộng",
      christmas: "Giáng sinh",
      halloween: "Halloween",
    },
    disableAnimations: "Tắt hiệu ứng",
    language: "Ngôn ngữ",
    disableNonsense: "Tắt văn bản tiếng Nhật",
    modelSettings: "Cài đặt mô hình",
    jtp2ModelPath: "Đường dẫn mô hình JTP2",
    jtp2TagsPath: "Đường dẫn thẻ JTP2",
    downloadModel: "Tải mô hình (1.8GB)",
    downloadTags: "Tải thẻ (195KB)",
    viewMode: "Chế độ xem",
    gridView: "Xem dạng lưới",
    listView: "Xem dạng danh sách",
    sortBy: "Sắp xếp theo",
    sortByName: "Sắp xếp theo tên",
    sortByDate: "Sắp xếp theo ngày",
    sortBySize: "Sắp xếp theo kích thước",
    experimentalFeatures: "Tính năng thử nghiệm",
    enableZoom: "Bật phóng to",
    enableMinimap: "Bật bản đồ thu nhỏ khi phóng to",
    instantDelete: "Bật xóa ngay lập tức (không cần xác nhận)",
    warning: "Cảnh báo",
    gallery: "Thư viện",
    preserveLatents: "Bảo vệ Latents",
    preserveLatentsTooltip: "Giữ các tệp .npz (latent) khi xóa hình ảnh.",
    preserveTxt: "Bảo vệ .txt",
    preserveTxtTooltip: "Giữ các tệp .txt khi xóa hình ảnh.",
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
    imageWork: "Làm việc với hình ảnh",
    audioWork: "Làm việc với âm thanh",
  },
  gallery: {
    addTag: "Thêm thẻ...",
    addCaption: "Thêm chú thích...",
    quickJump: "Chuyển đến thư mục...",
    loadingFolders: "Đang tải thư mục...",
    noResults: "Không tìm thấy kết quả",
    folderCount: "{count} thư mục",
    deleteConfirm: "Bạn có chắc chắn muốn xóa hình ảnh này?",
    deleteSuccess: "Đã xóa hình ảnh thành công",
    deleteError: "Lỗi khi xóa hình ảnh",
    savingCaption: "Đang lưu chú thích...",
    savedCaption: "Đã lưu chú thích",
    errorSavingCaption: "Lỗi khi lưu chú thích",
    emptyFolder: "Thư mục này trống",
    dropToUpload: "Kéo thả tệp vào đây để tải lên",
    uploadProgress: "Đang tải lên {count} tệp...",
    processingImage: "Đang xử lý hình ảnh...",
    generateTags: "Tạo thẻ",
    generatingTags: "Đang tạo thẻ...",
    removeTags: "Xóa thẻ",
    createCaption: "Tạo chú thích",
    captionTypes: {
      txt: "Tạo tệp văn bản mới",
      tags: "Tạo tệp .tags mới",
      caption: "Tạo tệp .caption mới",
      wd: "Tạo tệp .wd mới"
    },
    noCaptionFiles: "Chưa có tệp chú thích!",
    uploadError: "Tải lên thất bại",
    dropOverlay: "Thả tệp hoặc thư mục vào đây",
  },
  shortcuts: {
    title: "Phím tắt",
    galleryNavigation: "Điều hướng thư viện",
    quickFolderSwitch: "Chuyển thư mục nhanh",
    aboveImage: "Hình ảnh phía trên",
    belowImage: "Hình ảnh phía dưới",
    previousImage: "Hình ảnh trước",
    nextImage: "Hình ảnh sau",
    togglePreview: "Bật/tắt xem trước",
    tagNavigation: "Điều hướng thẻ",
    previousTag: "Thẻ trước",
    nextTag: "Thẻ sau",
    switchTagBubble: "Chuyển sang bong bóng thẻ",
    switchTagInput: "Chuyển sang nhập thẻ",
    cycleCaptions: "Xoay vòng chú thích",
    firstTagRow: "Thẻ đầu tiên trong hàng",
    lastTagRow: "Thẻ cuối cùng trong hàng",
    doubleShift: "Shift kép",
    shift: "Shift",
    del: "Del",
    removeTag: "Xóa thẻ",
    other: "Khác",
    esc: "Esc",
    closePreview: "Đóng xem trước/cửa sổ",
    deleteImage: "Xóa hình ảnh",
    toggleImagePreview: "Bật/tắt xem trước hình ảnh",
    copyToClipboard: "Sao chép ảnh vào clipboard",
  },
  imageViewer: {
    zoomIn: "Phóng to",
    zoomOut: "Thu nhỏ",
    resetZoom: "Đặt lại thu phóng",
    toggleMinimap: "Bật/tắt bản đồ thu nhỏ",
    previousImage: "Hình ảnh trước",
    nextImage: "Hình ảnh sau",
    copyPath: "Sao chép đường dẫn",
    openInNewTab: "Mở trong tab mới",
    fitToScreen: "Vừa màn hình",
    actualSize: "Kích thước thực",
    rotateLeft: "Xoay trái",
    rotateRight: "Xoay phải",
    downloadImage: "Tải xuống hình ảnh",
    imageInfo: "Thông tin hình ảnh",
    dimensions: "Kích thước",
  },
  tools: {
    removeCommas: "Xóa dấu phẩy",
    replaceNewlinesWithCommas: "Thay thế xuống dòng bằng dấu phẩy",
    replaceUnderscoresWithSpaces: "Thay thế gạch dưới bằng khoảng trắng",
  },
  notifications: {
    imageCopied: "Đã sao chép ảnh vào clipboard",
    imageCopyFailed: "Không thể sao chép ảnh vào clipboard",
  },
}; 