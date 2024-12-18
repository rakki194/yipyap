import type { LanguageCode } from ".";

// Add support for function-based translations
type TranslationValue = string | ((params: { 
  name?: string;
  count?: number;
}) => string);

export interface CommonTranslations {
  close: string;
  delete: string;
  cancel: string;
  save: string;
  edit: string;
  add: string;
  remove: string;
  loading: string;
  error: string;
  success: string;
  confirm: string;
  download: string;
  path: string;
  size: string;
  date: string;
  name: string;
  type: string;
  actions: string;
  search: string;
  filter: string;
  apply: string;
  reset: string;
  selected: string;
  all: string;
  none: string;
  pathSeparator: string;
  toggleTheme: string;
  theme: string;
  returnToFrontPage: string;
  home: string;
  openSettings: string;
}

export interface ThemeTranslations {
  light: string;
  gray: string;
  dark: string;
  banana: string;
  strawberry: string;
  peanut: string;
  christmas: string;
  halloween: string;
}

export interface SettingsTranslations {
  title: string;
  appearance: string;
  theme: {
    light: string;
    gray: string;
    dark: string;
    banana: string;
    strawberry: string;
    peanut: string;
    christmas: string;
    halloween: string;
  };
  disableAnimations: string;
  language: string;
  disableNonsense: string;
  modelSettings: TranslationValue;
  jtp2ModelPath: string;
  jtp2TagsPath: string;
  downloadModel: string;
  downloadTags: string;
  viewMode: string;
  gridView: string;
  listView: string;
  sortBy: string;
  sortByName: string;
  sortByDate: string;
  sortBySize: string;
  experimentalFeatures: string;
  enableZoom: string;
  enableMinimap: string;
  instantDelete: string;
  warning: string;
  gallery: string;
  preserveLatents: string;
  preserveLatentsTooltip: string;
  preserveTxt: string;
  preserveTxtTooltip: string;
  thumbnailSize: string;
  thumbnailSizeDescription: string;
  thumbnailSizeUpdateError: string;
}

export interface ToolsTranslations {
  removeCommas: string;
  replaceNewlinesWithCommas: string;
  replaceUnderscoresWithSpaces: string;
}

export interface FrontPageSubtitle {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
}

export interface FrontPageTranslations {
  subtitle: FrontPageSubtitle;
  imageWork: string;
  audioWork: string;
}

export interface GalleryTranslations {
  addTag: string;
  addCaption: string;
  quickJump: string;
  loadingFolders: string;
  noResults: string;
  folderCount: string;
  deleteConfirm: TranslationValue;
  deleteSuccess: string;
  deleteError: TranslationValue;
  savingCaption: TranslationValue;
  savedCaption: string;
  errorSavingCaption: TranslationValue;
  emptyFolder: string;
  dropToUpload: string;
  uploadProgress: TranslationValue;
  processingImage: TranslationValue;
  generateTags: string;
  generatingTags: string;
  removeTags: string;
  createCaption: string;
  captionTypes: {
    txt: string;
    tags: string;
    caption: string;
    wd: string;
  };
  noCaptionFiles: string;
  uploadError: string;
  dropOverlay: string;
  selectAll: string;
  deselectAll: string;
  deleteSelected: string;
  confirmMultiDelete: string;
  confirmFolderDelete: TranslationValue;
  someFolderDeletesFailed: string;
  folderDeleteError: string;
  deletingFile: string;
  fileDeleteSuccess: string;
  fileDeleteError: string;
}

export interface ShortcutsTranslations {
  title: string;
  galleryNavigation: string;
  quickFolderSwitch: string;
  aboveImage: string;
  belowImage: string;
  previousImage: string;
  nextImage: string;
  togglePreview: string;
  tagNavigation: string;
  previousTag: string;
  nextTag: string;
  switchTagBubble: string;
  switchTagInput: string;
  cycleCaptions: string;
  firstTagRow: string;
  lastTagRow: string;
  doubleShift: string;
  shift: string;
  del: string;
  removeTag: string;
  other: string;
  esc: string;
  closePreview: string;
  deleteImage: string;
  toggleImagePreview: string;
  copyToClipboard: string;
}

export interface ImageViewerTranslations {
  zoomIn: string;
  zoomOut: string;
  resetZoom: string;
  toggleMinimap: string;
  previousImage: string;
  nextImage: string;
  copyPath: string;
  openInNewTab: string;
  fitToScreen: string;
  actualSize: string;
  rotateLeft: string;
  rotateRight: string;
  downloadImage: string;
  imageInfo: string;
  dimensions: string;
}

export interface NotificationsTranslations {
  imageCopied: string;
  imageCopyFailed: string;
}

export interface Translations {
  common: CommonTranslations;
  settings: SettingsTranslations;
  tools: ToolsTranslations;
  frontPage: FrontPageTranslations;
  gallery: GalleryTranslations;
  shortcuts: ShortcutsTranslations;
  imageViewer: ImageViewerTranslations;
  notifications: NotificationsTranslations;
}

export type { LanguageCode }; 
