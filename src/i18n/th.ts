import { getPathSeparator } from "~/i18n";

export default {
  common: {
    close: "ปิด",
    delete: "ลบ",
    cancel: "ยกเลิก",
    save: "บันทึก",
    edit: "แก้ไข",
    add: "เพิ่ม",
    remove: "ลบออก",
    loading: "กำลังโหลด...",
    error: "ข้อผิดพลาด",
    success: "สำเร็จ",
    confirm: "ยืนยัน",
    download: "ดาวน์โหลด",
    path: "เส้นทาง",
    size: "ขนาด",
    date: "วันที่",
    name: "ชื่อ",
    type: "ประเภท",
    actions: "การดำเนินการ",
    search: "ค้นหา...",
    filter: "กรอง",
    apply: "นำไปใช้",
    reset: "รีเซ็ต",
    selected: "เลือกแล้ว",
    all: "ทั้งหมด",
    none: "ไม่มี",
    pathSeparator: getPathSeparator("th"),
    toggleTheme: "สลับธีม",
    theme: "ธีม",
    returnToFrontPage: "กลับไปหน้าแรก",
    home: "หน้าแรก",
    openSettings: "เปิดการตั้งค่า",
  },
  settings: {
    title: "การตั้งค่า",
    appearance: "รูปลักษณ์",
    theme: {
      light: "สว่าง",
      gray: "เทา",
      dark: "มืด",
      banana: "กล้วย",
      strawberry: "สตรอเบอร์รี่",
      peanut: "ถั่วลิสง",
      christmas: "คริสต์มาส",
      halloween: "ฮาโลวีน",
    },
    disableAnimations: "ปิดการใช้งานแอนิเมชัน",
    language: "ภาษา",
    disableJapanese: "ปิดการใช้งานข้อความภาษาญี่ปุ่น",
    modelSettings: "การตั้งค่าโมเดล",
    jtp2ModelPath: "เส้นทางโมเดล JTP2",
    jtp2TagsPath: "เส้นทางแท็ก JTP2",
    downloadModel: "ดาวน์โหลดโมเดล (1.8 GB)",
    downloadTags: "ดาวน์โหลดแท็ก (195 KB)",
    viewMode: "โหมดมุมมอง",
    gridView: "มุมมองตาราง",
    listView: "มุมมองรายการ",
    sortBy: "เรียงตาม",
    sortByName: "เรียงตามชื่อ",
    sortByDate: "เรียงตามวันที่",
    sortBySize: "เรียงตามขนาด",
    experimentalFeatures: "คุณสมบัติทดลอง",
    enableZoom: "เปิดใช้งานการซูม",
    enableMinimap: "เปิดใช้งานแผนที่ย่อเมื่อซูม",
    instantDelete: "เปิดใช้งานการลบทันที (ข้ามการยืนยัน)",
    warning: "คำเตือน",
    gallery: "แกลเลอรี",
    preserveLatents: "รักษา Latents",
    preserveLatentsTooltip: ".npz (latent) ไฟล์เมื่อทำการลบภาพ",
    preserveTxt: "รักษา .txt",
    preserveTxtTooltip: ".txt ไฟล์เมื่อทำการลบภาพ",
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
    imageWork: "ทำงานกับรูปภาพ",
    audioWork: "ทำงานกับเสียง",
  },
  gallery: {
    addTag: "เพิ่มแท็ก...",
    addCaption: "เพิ่มคำบรรยาย...",
    quickJump: "ข้ามไปยังโฟลเดอร์...",
    loadingFolders: "กำลังโหลดโฟลเดอร์...",
    noResults: "ไม่พบผลลัพธ์",
    folderCount: "{count} โฟลเดอร์",
    deleteConfirm: "คุณแน่ใจหรือไม่ว่าต้องการลบรูปภาพนี้?",
    deleteSuccess: "ลบรูปภาพสำเร็จ",
    deleteError: "เกิดข้อผิดพลาดในการลบรูปภาพ",
    savingCaption: "กำลังบันทึกคำบรรยาย...",
    savedCaption: "บันทึกคำบรรยายแล้ว",
    errorSavingCaption: "เกิดข้อผิดพลาดในการบันทึกคำบรรยาย",
    emptyFolder: "โฟลเดอร์นี้ว่างเปล่า",
    dropToUpload: "วางไฟล์ที่นี่เพื่ออัปโหลด",
    uploadProgress: "กำลังอัปโหลด {count} ไฟล์...",
    processingImage: "กำลังประมวลผลรูปภาพ...",
    generateTags: "สร้างแท็ก",
    generatingTags: "กำลังสร้างแท็ก...",
    removeTags: "ลบแท็ก",
    createCaption: "สร้างคำบรรยาย",
    captionTypes: {
      txt: "สร้างไฟล์ข้อความใหม่",
      tags: "สร้างไฟล์ .tags ใหม่",
      caption: "สร้างไฟล์ .caption ใหม่",
      wd: "สร้างไฟล์ .wd ใหม่"
    },
    noCaptionFiles: "ยังไม่มีไฟล์คำบรรยาย!",
  },
  shortcuts: {
    title: "ปุ่มลัด",
    galleryNavigation: "การนำทางแกลเลอรี",
    quickFolderSwitch: "สลับโฟลเดอร์อย่างรวดเร็ว",
    aboveImage: "รูปภาพด้านบน",
    belowImage: "รูปภาพด้านล่าง",
    previousImage: "รูปภาพก่อนหน้า",
    nextImage: "รูปภาพถัดไป",
    togglePreview: "สลับการแสดงตัวอย่าง",
    tagNavigation: "การนำทางแท็ก",
    previousTag: "แท็กก่อนหน้า",
    nextTag: "แท็กถัดไป",
    switchTagBubble: "สลับไปยังฟองแท็ก",
    switchTagInput: "สลับไปยังการป้อนแท็ก",
    cycleCaptions: "วนคำบรรยาย",
    firstTagRow: "แท็กแรกในแถว",
    lastTagRow: "แท็กสุดท้ายในแถว",
    doubleShift: "Shift สองครั้ง",
    shift: "Shift",
    del: "Del",
    removeTag: "ลบแท็ก",
    other: "อื่นๆ",
    esc: "Esc",
    closePreview: "ปิดการแสดงตัวอย่าง/หน้าต่าง",
    deleteImage: "ลบรูปภาพ",
    toggleImagePreview: "สลับการแสดงตัวอย่างรูปภาพ",
  },
  imageViewer: {
    zoomIn: "ขยายเข้า",
    zoomOut: "ขยายออก",
    resetZoom: "รีเซ็ตการซูม",
    toggleMinimap: "สลับแผนที่ย่อ",
    previousImage: "รูปภาพก่อนหน้า",
    nextImage: "รูปภาพถัดไป",
    copyPath: "คัดลอกเส้นทาง",
    openInNewTab: "เปิดในแท็บใหม่",
    fitToScreen: "พอดีกับหน้าจอ",
    actualSize: "ขนาดจริง",
    rotateLeft: "หมุนซ้าย",
    rotateRight: "หมุนขวา",
    downloadImage: "ดาวน์โหลดรูปภาพ",
    imageInfo: "ข้อมูลรูปภาพ",
    dimensions: "ขนาด",
  },
  tools: {
    removeCommas: "ลบเครื่องหมายจุลภาค",
    replaceNewlinesWithCommas: "แทนที่การขึ้นบรรทัดใหม่ด้วยเครื่องหมายจุลภาค",
    replaceUnderscoresWithSpaces: "แทนที่ขีดล่างด้วยช่องว่าง",
  },
}; 