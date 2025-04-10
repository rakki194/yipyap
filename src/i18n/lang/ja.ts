import { getPathSeparator } from "~/i18n";
import { Translations, TranslationParams } from "../types";

export default {
  common: {
    close: "閉じる",
    delete: "削除",
    cancel: "キャンセル",
    save: "保存",
    edit: "編集",
    add: "追加",
    remove: "削除",
    loading: "読み込み中...",
    error: "エラー",
    success: "成功",
    confirm: "確認",
    download: "ダウンロード",
    path: "パス",
    size: "サイズ",
    date: "日付",
    name: "名前",
    type: "種類",
    actions: "アクション",
    search: "検索...",
    filter: "フィルター",
    apply: "適用",
    reset: "リセット",
    selected: "選択済み",
    all: "すべて",
    none: "なし",
    notFound: "404 - ページが見つかりません",
    pathSeparator: getPathSeparator("ja"),
    toggleTheme: "テーマを切り替え",
    theme: "テーマ",
    returnToFrontPage: "フロントページに戻る",
    home: "ホーム",
    openSettings: "設定を開く",
    create: "作成",
    creating: "作成中...",
    language: "言語",
    description: "説明",
  },
  settings: {
    title: "設定",
    appearance: "外観",
    theme: {
      light: "ライト",
      gray: "グレー",
      dark: "ダーク",
      banana: "バナナ",
      strawberry: "ストロベリー",
      peanut: "ピーナッツ",
      "high-contrast-black": "ハイコントラストブラック",
      "high-contrast-inverse": "ハイコントラストインバース",
    },
    disableAnimations: "アニメーションを無効化",
    disableAnimationsTooltip: "パフォーマンス向上のためすべてのアニメーションを無効化",
    language: "言語",
    languageTooltip: "インターフェースの言語を変更",
    disableNonsense: "日本語テキストを無効化",
    disableNonsenseTooltip: "日本語テキストとその他の無意味な要素を非表示",
    modelSettings: (params: TranslationParams) => "モデル設定",
    jtp2ModelPath: "JTP2モデルのパス",
    jtp2ModelPathTooltip: "JTP2モデルファイルへのパス",
    jtp2TagsPath: "JTP2タグのパス",
    jtp2TagsPathTooltip: "JTP2タグファイルへのパス",
    jtp2Threshold: "JTP2タグの閾値",
    jtp2ThresholdTooltip: "タグを含めるための信頼度閾値（0.0から1.0）",
    jtp2ForceCpu: "JTP2でCPUを強制使用",
    jtp2ForceCpuTooltip: "JTP2でGPUの代わりにCPUを使用するように強制",
    wdv3ModelName: "WDv3モデル",
    wdv3ModelNameTooltip: "WDv3モデルのアーキテクチャを選択（ViT、SwinV2、またはConvNext）",
    wdv3GenThreshold: "一般タグの閾値",
    wdv3GenThresholdTooltip: "一般タグの信頼度閾値（デフォルト：0.35）",
    wdv3CharThreshold: "キャラクタータグの閾値",
    wdv3CharThresholdTooltip: "キャラクタータグの信頼度閾値（デフォルト：0.75）",
    wdv3ForceCpu: "WDv3でCPUを強制使用",
    wdv3ForceCpuTooltip: "WDv3でGPUの代わりにCPUを使用するように強制",
    wdv3ConfigUpdateError: "WDv3設定の更新に失敗しました",
    downloadModel: "モデルをダウンロード (1.8 GB)",
    downloadTags: "タグをダウンロード (195 KB)",
    viewMode: "表示モード",
    gridView: "グリッド表示",
    listView: "リスト表示",
    sortBy: "並び替え",
    sortByName: "名前で並び替え",
    sortByDate: "日付で並び替え",
    sortBySize: "サイズで並び替え",
    experimentalFeatures: "実験的機能",
    enableZoom: "画像ズームを有効化",
    enableZoomTooltip: "画像ビューアーでズームと移動を有効化",
    enableMinimap: "ズーム時のミニマップを有効化",
    enableMinimapTooltip: "ズーム時にナビゲーション用のミニマップを表示",
    alwaysShowCaptionEditor: "常にキャプションエディターを表示",
    alwaysShowCaptionEditorTooltip: "キャプションエディターを常に展開したままにする",
    instantDelete: "即時削除を有効化（確認をスキップ）",
    instantDeleteTooltip: "確認ダイアログなしでファイルを削除",
    warning: "警告",
    gallery: "ギャラリー",
    preserveLatents: "潜在変数を保持",
    preserveLatentsTooltip: "画像生成の潜在変数を保持して後で再利用できるようにする",
    preserveTxt: "TXTファイルを保持",
    preserveTxtTooltip: "生成設定を含むTXTファイルを保持する",
    thumbnailSize: "サムネイルサイズ",
    thumbnailSizeDescription: "サムネイルのピクセルサイズ (例: 250)",
    thumbnailSizeUpdateError: "サムネイルサイズの更新に失敗しました",
  },
  gallery: {
    addTag: "タグを追加...",
    addCaption: "キャプションを追加...",
    quickJump: "フォルダーへジャンプ...",
    loadingFolders: "フォルダーを読み込み中...",
    noResults: "結果が見つかりません",
    pathNotFound: "パスが見つかりません",
    folderCount: (params?: TranslationParams) => `${params?.count ?? 0}個のフォルダー`,
    deleteConfirm: "この画像を削除してもよろしいですか？",
    deleteSuccess: "画像を削除しました",
    deleteError: "画像の削除中にエラーが発生しました",
    savingCaption: "キャプションを保存中...",
    savedCaption: "キャプションを保存しました",
    errorSavingCaption: "キャプションの保存中にエラーが発生しました",
    emptyFolder: "このフォルダは空です",
    dropToUpload: "ファイルをドロップしてアップロード",
    uploadProgress: (params?: TranslationParams) => {
      if (!params?.count) return 'ファイルをアップロード中...';
      return `${params.count}個のファイルをアップロード中...`;
    },
    uploadProgressPercent: "アップロード中... {progress}%",
    filesExceedLimit: "ファイル数が制限を超えています",
    noFilesToUpload: "アップロードするファイルがありません",
    processingFiles: "ファイルを処理中...",
    uploadComplete: "アップロードが完了しました",
    uploadFailed: "アップロードに失敗しました",
    deletingFiles: "ファイルを削除中...",
    deleteComplete: "削除が完了しました",
    deleteFailed: "削除に失敗しました",
    processingImage: "画像を処理中...",
    generateTags: "タグを生成",
    generatingTags: "タグを生成中...",
    generatingCaption: "キャプションを生成中...",
    captionGenerated: "キャプションを生成しました",
    removeTags: "タグを削除",
    createCaption: "キャプションを作成",
    captionTypes: {
      txt: "新規テキストファイルを作成",
      tags: "新規.tagsファイルを作成",
      caption: "新規.captionファイルを作成",
      wd: "新規.wdファイルを作成"
    },
    noCaptionFiles: "キャプションファイルがまだありません！",
    fileCount: (params?: TranslationParams) => `${params?.count ?? 0}個のファイル`,
    imageCount: (params?: TranslationParams) => `${params?.count ?? 0}個の画像`,
    foundFolders: (params?: TranslationParams) => `${params?.count ?? 0}個のフォルダーが見つかりました`,
    deletedCount: (params?: TranslationParams) => `${params?.count ?? 0}個のアイテムを削除しました`,
    selectedCount: (params?: TranslationParams) => {
      if (!params?.count) return '選択済み';
      return `${params.count}個選択済み`;
    },
    processingImages: (params?: TranslationParams) => `${params?.count ?? 0}個の画像を処理中...`,
    folderLocation: (params?: TranslationParams) => `場所: ${params?.name ?? ''}`,
    moveToFolder: (params?: TranslationParams) => `${params?.name ?? ''}に移動`,
    workWithFolder: (params?: TranslationParams) => `${params?.name ?? ''}を操作`,
    createFolder: "フォルダーを作成",
    folderNamePlaceholder: "フォルダー名",
    deleteConfirmation: "削除の確認",
    selectAll: "すべて選択",
    deselectAll: "選択解除",
    deleteSelected: "選択項目を削除",
    confirmMultiDelete: (params?: { folders?: number; images?: number }) => {
      if (!params) return 'これらのアイテムを削除してもよろしいですか？';
      const { folders = 0, images = 0 } = params;
      if (folders === 0 && images === 0) return 'これらのアイテムを削除してもよろしいですか？';
      if (typeof folders !== 'number' || typeof images !== 'number') return 'これらのアイテムを削除してもよろしいですか？';
      if (folders > 0 && images > 0) return `${folders}個のフォルダと${images}個の画像を削除してもよろしいですか？`;
      if (folders > 0) return `${folders}個のフォルダを削除してもよろしいですか？`;
      return `${images}個の画像を削除してもよろしいですか？`;
    },
    confirmFolderDelete: ({ name = "" }) => `フォルダー「${name}」を削除してもよろしいですか？`,
    someFolderDeletesFailed: "一部のフォルダーを削除できませんでした",
    folderDeleteError: "フォルダーの削除中にエラーが発生しました",
    deletingFile: "ファイルを削除中...",
    fileDeleteSuccess: "ファイルを削除しました",
    fileDeleteError: "ファイルの削除中にエラーが発生しました",
    uploadError: "アップロードに失敗しました",
    dropOverlay: "ファイルやフォルダをここにドロップ",
  },
  shortcuts: {
    title: "キーボードショートカット",
    galleryNavigation: "ギャラリーの操作",
    quickFolderSwitch: "フォルダーの切り替え",
    aboveImage: "上の画像へ",
    belowImage: "下の画像へ",
    previousImage: "前の画像へ",
    nextImage: "次の画像へ",
    togglePreview: "プレビューの切り替え",
    tagNavigation: "タグの操作",
    previousTag: "前のタグへ",
    nextTag: "次のタグへ",
    switchTagBubble: "タグバブル編集モードへ",
    switchTagInput: "タグ入力モードへ切り替え",
    cycleCaptions: "キャプション入力を循環",
    firstTagRow: "行の最初のタグへ",
    lastTagRow: "行の最後のタグへ",
    doubleShift: "Shiftキーを2回",
    shift: "Shiftキー",
    del: "Deleteキー",
    removeTag: "タグを削除",
    other: "その他",
    esc: "Escキー",
    closePreview: "プレビュー/モーダルを閉じる",
    deleteImage: "画像を削除",
    toggleImagePreview: "プレビューの切り替え",
    copyToClipboard: "画像をクリップボードにコピー",
  },
  imageViewer: {
    zoomIn: "拡大",
    zoomOut: "縮小",
    resetZoom: "ズームをリセット",
    toggleMinimap: "ミニマップの切り替え",
    previousImage: "前の画像",
    nextImage: "次の画像",
    copyPath: "パスをコピー",
    openInNewTab: "新しいタブで開く",
    fitToScreen: "画面に合わせる",
    actualSize: "実際のサイズ",
    rotateLeft: "左に回転",
    rotateRight: "右に回転",
    downloadImage: "画像をダウンロード",
    imageInfo: "画像情報",
    dimensions: "寸法",
  },
  tools: {
    transformations: "変換",
    addTransformation: "変換を追加",
    transformationType: "変換タイプ",
    transformationTypes: {
      searchReplace: "検索と置換",
      case: "大文字小文字",
      trim: "トリム",
      wrap: "ラップ",
      number: "数値"
    },
    searchPattern: "検索パターン",
    searchPatternPlaceholder: "検索パターンを入力...",
    replacement: "置換",
    replacementPlaceholder: "置換テキストを入力...",
    selectIcon: "アイコンを選択",
    caseTypes: {
      upper: "大文字",
      lower: "小文字",
      title: "タイトルケース",
      sentence: "文章ケース"
    },
    trimTypes: {
      all: "すべて",
      start: "先頭",
      end: "末尾",
      duplicates: "重複"
    },
    numberActions: {
      remove: "削除",
      format: "フォーマット",
      extract: "抽出"
    },
    prefix: "接頭辞",
    suffix: "接尾辞",
    prefixPlaceholder: "接頭辞を入力...",
    suffixPlaceholder: "接尾辞を入力...",
    transformationNamePlaceholder: "変換名を入力...",
    transformationDescriptionPlaceholder: "変換の説明を入力...",
    numberFormat: "数値フォーマット",
    numberFormatPlaceholder: "数値フォーマットを入力...",
    removeCommas: "コンマを削除",
    replaceNewlinesWithCommas: "改行をコンマに置換",
    replaceUnderscoresWithSpaces: "アンダースコアをスペースに置換"
  },
  notifications: {
    imageCopied: "画像をクリップボードにコピーしました",
    imageCopyFailed: "画像のクリップボードへのコピーに失敗しました",
    folderCreated: "フォルダーを作成しました",
    folderCreateError: "フォルダーの作成に失敗しました",
    generatingCaption: "キャプションを生成中...",
    captionGenerated: "キャプションを生成しました",
    connectionLost: "接続が切断されました",
    connectionRestored: "接続が復旧しました"
  },
} as const satisfies Translations;
