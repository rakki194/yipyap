import { getPathSeparator } from "~/i18n";

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
    actions: "操作",
    search: "検索...",
    filter: "フィルター",
    apply: "適用",
    reset: "リセット",
    selected: "選択済み",
    all: "すべて",
    none: "なし",
    pathSeparator: getPathSeparator("ja"),
    toggleTheme: "テーマを切り替え",
    theme: "テーマ",
    returnToFrontPage: "フロントページに戻る",
    home: "ホーム",
    openSettings: "設定を開く",
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
      christmas: "クリスマス",
      halloween: "ハロウィン",
    },
    layoutOptions: "レイアウト設定",
    disableAnimations: "アニメーションを無効化",
    language: "言語設定",
    disableJapanese: "日本語テキストを無効化",
    modelSettings: "モデル設定",
    jtp2ModelPath: "JTP2モデルのパス",
    jtp2TagsPath: "JTP2タグのパス",
    downloadModel: "モデルをダウンロード（1.8GB）",
    downloadTags: "タグをダウンロード（195KB）",
    viewMode: "表示モード",
    gridView: "グリッド表示",
    listView: "リスト表示",
    sortBy: "並び替え",
    sortByName: "名前で並び替え",
    sortByDate: "日付で並び替え",
    sortBySize: "サイズで並び替え",
    experimentalFeatures: "実験的機能",
    enableZoom: "画像ズームを有効化",
    enableMinimap: "ズーム時のミニマップを有効化",
    instantDelete: "即時削除を有効化（確認をスキップ）",
    warning: "警告",
    gallery: "ギャラリー",
  },
  frontPage: {
    subtitle: {
      1: "大規模言語モデルは不正行為をし、嘘をつき、幻覚を見ます。まるで私のように！",
      2: "私たちは別の祈り方を見けました",
      3: "虚ろな瞳に映る、無限の宇宙",
      4: "錆びた心、新たな芽吹き",
      5: "夢と現実が交錯する、不思議な境地",
      6: "未知の領域、無限の可能性",
      7: "時の流れを超えた、永遠の愛",
      8: "これで追い出されますよ！",
    },
    imageWork: "画像を扱う",
    audioWork: "音声を扱う",
  },
  gallery: {
    addTag: "タグを追加...",
    addCaption: "キャプションを追加...",
    quickJump: "フォルダーへジャンプ...",
    loadingFolders: "フォルダーを読み込み中...",
    noResults: "結果が見つかりません",
    folderCount: "フォルダー数：{count}",
    deleteConfirm: "この画像を削除してもよろしいですか？",
    deleteSuccess: "画像を削除しました",
    deleteError: "画像の削除中にエラーが発生しました",
    savingCaption: "キャプションを保存中...",
    savedCaption: "キャプションを保存しました",
    errorSavingCaption: "キャプションの保存中にエラーが発生しました",
    emptyFolder: "このフォルダは空です",
    dropToUpload: "ファイルをドロップしてアップロード",
    uploadProgress: "{count}個のファイルをアップロード中...",
    processingImage: "画像を処理中...",
    generateTags: "タグを生成",
    generatingTags: "タグを生成中...",
    removeTags: "タグを削除",
    createCaption: "キャプションを作成",
    captionTypes: {
      txt: "新規テキストファイルを作成",
      tags: "新規.tagsファイルを作成",
      caption: "新規.captionファイルを作成",
      wd: "新規.wdファイルを作成"
    },
    noCaptionFiles: "キャプションファイルがまだありません！",
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
};
