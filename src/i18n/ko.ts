import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "./types";

export default {
  common: {
    close: "닫기",
    delete: "삭제",
    cancel: "취소",
    save: "저장",
    edit: "편집",
    add: "추가",
    remove: "제거",
    loading: "로딩 중...",
    error: "오류",
    success: "성공",
    confirm: "확인",
    download: "다운로드",
    path: "경로",
    size: "크기",
    date: "날짜",
    name: "이름",
    type: "유형",
    actions: "작업",
    search: "검색...",
    filter: "필터",
    apply: "적용",
    reset: "초기화",
    selected: "선택됨",
    all: "전체",
    none: "없음",
    pathSeparator: getPathSeparator("ko"),
    toggleTheme: "테마 전환",
    theme: "테마",
    returnToFrontPage: "메인 페이지로 돌아가기",
    home: "홈",
    openSettings: "설정 열기",
    create: "생성",
    creating: "생성 중...",
  },
  settings: {
    title: "설정",
    appearance: "외관",
    theme: {
      light: "밝은",
      gray: "회색",
      dark: "어두운",
      banana: "바나나",
      strawberry: "딸기",
      peanut: "땅콩",
      christmas: "크리스마스",
      halloween: "할로윈",
    },
    disableAnimations: "애니메이션 비활성화",
    language: "언어",
    disableNonsense: "일본어 텍스트 비활성화",
    modelSettings: "모델 설정",
    jtp2ModelPath: "JTP2 모델 경로",
    jtp2TagsPath: "JTP2 태그 경로",
    downloadModel: "모델 다운로드 (1.8 GB)",
    downloadTags: "태그 다운로드 (195 KB)",
    viewMode: "보기 모드",
    gridView: "그리드 보기",
    listView: "목록 보기",
    sortBy: "정렬 기준",
    sortByName: "이름순 정렬",
    sortByDate: "날짜순 정렬",
    sortBySize: "크기순 정렬",
    experimentalFeatures: "실험적 기능",
    enableZoom: "확대/축소 활성화",
    enableMinimap: "확대 시 미니맵 활성화",
    alwaysShowCaptionEditor: "항상 캡션 편집기 표시",
    instantDelete: "즉시 삭제 활성화 (확인 생략)",
    warning: "경고",
    gallery: "갤러리",
    preserveLatents: "Latents 보존",
    preserveLatentsTooltip: "이미지를 삭제할 때 .npz (latent) 파일을 보존합니다.",
    preserveTxt: ".txt 보존",
    preserveTxtTooltip: "이미지를 삭제할 때 .txt 파일을 보존합니다.",
    thumbnailSize: "썸네일 크기",
    thumbnailSizeDescription: "썸네일의 픽셀 크기 (예: 250)",
    thumbnailSizeUpdateError: "썸네일 크기 업데이트 실패",
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
    imageWork: "이미지 작업",
    audioWork: "오디오 작업",
    deselectAll: "선택 해제",
    deleteSelected: "선택 항목 삭제",
  },
  gallery: {
    addTag: "태그 추가...",
    addCaption: "캡션 추가...",
    quickJump: "폴더로 이동...",
    loadingFolders: "폴더 로딩 중...",
    noResults: "결과 없음",
    folderCount: (params?: TranslationParams) => `폴더 ${params?.count ?? 0}개`,
    deleteConfirm: "이 이미지를 삭제하시겠습니까?",
    deleteSuccess: "이미지가 성공적으로 삭제되었습니다",
    deleteError: "이미지 삭제 중 오류 발생",
    savingCaption: "캡션 저장 중...",
    savedCaption: "캡션이 저장되었습니다",
    errorSavingCaption: "캡션 저장 중 오류 발생",
    emptyFolder: "이 폴더는 비어 있습니다",
    dropToUpload: "파일을 여기에 드롭하여 업로드",
    uploadProgress: (params?: TranslationParams) => {
      if (!params?.count) return '파일 업로드 중...';
      return `${params.count}개의 파일 업로드 중...`;
    },
    uploadProgressPercent: "업로드 중... {progress}%",
    processingImage: "이미지 처리 중...",
    generateTags: "태그 생성",
    generatingTags: "태그 생성 중...",
    removeTags: "태그 제거",
    createCaption: "캡션 생성",
    captionTypes: {
      txt: "새 텍스트 파일 생성",
      tags: "새 .tags 파일 생성",
      caption: "새 .caption 파일 생성",
      wd: "새 .wd 파일 생성"
    },
    noCaptionFiles: "아직 캡션 파일이 없습니다!",
    fileCount: (params?: TranslationParams) => `${params?.count ?? 0}개 파일`,
    imageCount: (params?: TranslationParams) => `${params?.count ?? 0}개 이미지`,
    foundFolders: (params?: TranslationParams) => `${params?.count ?? 0}개 폴더 찾음`,
    deletedCount: (params?: TranslationParams) => `${params?.count ?? 0}개 항목 삭제됨`,
    selectedCount: (params?: TranslationParams) => {
      if (!params?.count) return '선택됨';
      return `${params.count}개 선택됨`;
    },
    filesExceedLimit: "파일이 너무 큽니다: {files}",
    noFilesToUpload: "업로드할 파일이 없습니다",
    processingFiles: "파일 처리 중...",
    uploadComplete: "업로드 완료",
    uploadFailed: "업로드 실패: {error}",
    deletingFiles: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return '파일 삭제 중...';
      }
      return `${params.count}개의 파일 삭제 중...`;
    },
    deleteComplete: "삭제 완료",
    deleteFailed: "삭제 실패",
    generatingCaption: "캡션 생성 중...",
    captionGenerated: "캡션이 생성되었습니다",
    confirmMultiDelete: (params?: { folders?: number; images?: number }) => {
      if (!params) return '이 항목들을 삭제하시겠습니까?';
      const { folders = 0, images = 0 } = params;
      if (folders === 0 && images === 0) return '이 항목들을 삭제하시겠습니까?';
      if (typeof folders !== 'number' || typeof images !== 'number') return '이 항목들을 삭제하시겠습니까?';
      if (folders > 0 && images > 0) return `${folders}개의 폴더와 ${images}개의 이미지를 삭제하시겠습니까?`;
      if (folders > 0) return `${folders}개의 폴더를 삭제하시겠습니까?`;
      return `${images}개의 이미지를 삭제하시겠습니까?`;
    },
    processingImages: (params?: TranslationParams) => `${params?.count ?? 0}개 이미지 처리 중...`,
    folderLocation: (params?: TranslationParams) => `위치: ${params?.name ?? ''}`,
    moveToFolder: (params?: TranslationParams) => `${params?.name ?? ''}(으)로 이동`,
    workWithFolder: (params?: TranslationParams) => `${params?.name ?? ''} 작업`,
    createFolder: "폴더 생성",
    folderNamePlaceholder: "폴더 이름",
    deleteConfirmation: "삭제 확인",
    selectAll: "모두 선택",
    deselectAll: "선택 해제",
    deleteSelected: "선택 항목 삭제",
    uploadError: "업로드 실패",
    dropOverlay: "파일이나 폴더를 여기에 드롭",
    confirmFolderDelete: ({ name = "" }) => `${name} 폴더를 삭제하시겠습니까?`,
    someFolderDeletesFailed: "일부 폴더를 삭제하지 못했습니다",
    folderDeleteError: "폴더 삭제 중 오류 발생",
    deletingFile: "파일 삭제 중...",
    fileDeleteSuccess: "파일이 삭제되었습니다",
    fileDeleteError: "파일 삭제 중 오류 발생",
  },
  shortcuts: {
    title: "키보드 단축키",
    galleryNavigation: "갤러리 탐색",
    quickFolderSwitch: "빠른 폴더 전환",
    aboveImage: "위 이미지",
    belowImage: "아래 이미지",
    previousImage: "이전 이미지",
    nextImage: "다음 이미지",
    togglePreview: "미리보기 전환",
    tagNavigation: "태그 탐색",
    previousTag: "이전 태그",
    nextTag: "다음 태그",
    switchTagBubble: "태그 버블로 전환",
    switchTagInput: "태그 입력으로 전환",
    cycleCaptions: "캡션 순환",
    firstTagRow: "행의 첫 번째 태그",
    lastTagRow: "행의 마지막 태그",
    doubleShift: "Shift 두 번",
    shift: "Shift",
    del: "Del",
    removeTag: "태그 제거",
    other: "기타",
    esc: "Esc",
    closePreview: "미리보기/모달 닫기",
    deleteImage: "이미지 삭제",
    toggleImagePreview: "이미지 미리보기 전환",
    copyToClipboard: "이미지를 클립보드에 복사",
  },
  imageViewer: {
    zoomIn: "확대",
    zoomOut: "축소",
    resetZoom: "확대/축소 초기화",
    toggleMinimap: "미니맵 전환",
    previousImage: "이전 이미지",
    nextImage: "다음 이미지",
    copyPath: "경로 복사",
    openInNewTab: "새 탭에서 열기",
    fitToScreen: "화면에 맞추기",
    actualSize: "실제 크기",
    rotateLeft: "왼쪽으로 회전",
    rotateRight: "오른쪽으로 회전",
    downloadImage: "이미지 다운로드",
    imageInfo: "이미지 정보",
    dimensions: "크기",
  },
  tools: {
    removeCommas: "쉼표 제거",
    replaceNewlinesWithCommas: "줄바꿈을 쉼표로 바꾸기",
    replaceUnderscoresWithSpaces: "밑줄을 공백으로 바꾸기",
  },
  notifications: {
    imageCopied: "이미지가 클립보드에 복사되었습니다",
    imageCopyFailed: "이미지를 클립보드에 복사하지 못했습니다",
    folderCreated: "폴더가 생성되었습니다",
    folderCreateError: "폴더 생성 중 오류가 발생했습니다",
    generatingCaption: "캡션 생성 중...",
    captionGenerated: "캡션이 생성되었습니다",
    connectionLost: "연결이 끊어졌습니다",
    connectionRestored: "연결이 복원되었습니다",
  },
} as const satisfies Translations;
