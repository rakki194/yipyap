import type { LanguageCode } from ".";

// First, define the translation parameter types
export type TranslationParams = {
  count?: number;
  folders?: number;
  images?: number;
  name?: string;
  [key: string]: string | number | undefined;  // Allow any string/number parameter
};

// Then define the translation value type
type TranslationValue = string | ((params: TranslationParams) => string);

// Finally define the translation function type
export type TranslationFunction = {
  (key: string): string;
  (key: string, params: TranslationParams): string;
};

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
  notFound: string;
  pathSeparator: string;
  toggleTheme: string;
  theme: string;
  returnToFrontPage: string;
  home: string;
  openSettings: string;
  create: string;
  creating: string;
  language: string;
  description: string;
}

export interface ThemeTranslations {
  light: string;
  gray: string;
  dark: string;
  banana: string;
  strawberry: string;
  peanut: string;
  "high-contrast-black": string;
  "high-contrast-inverse": string;
}

export interface SettingsTranslations {
  title: string;
  appearance: string;
  theme: ThemeTranslations;
  disableAnimations: string;
  disableAnimationsTooltip: string;
  language: string;
  languageTooltip: string;
  disableNonsense: string;
  disableNonsenseTooltip: string;
  modelSettings: string | ((params: TranslationParams) => string);
  jtp2ModelPath: string;
  jtp2ModelPathTooltip: string;
  jtp2TagsPath: string;
  jtp2TagsPathTooltip: string;
  jtp2Threshold: string;
  jtp2ThresholdTooltip: string;
  jtp2ForceCpu: string;
  jtp2ForceCpuTooltip: string;
  downloadModel: string;
  downloadTags: string;
  wdv3ModelName: string;
  wdv3ModelNameTooltip: string;
  wdv3GenThreshold: string;
  wdv3GenThresholdTooltip: string;
  wdv3CharThreshold: string;
  wdv3CharThresholdTooltip: string;
  wdv3ForceCpu: string;
  wdv3ForceCpuTooltip: string;
  wdv3ConfigUpdateError: string;
  viewMode: string;
  gridView: string;
  listView: string;
  sortBy: string;
  sortByName: string;
  sortByDate: string;
  sortBySize: string;
  experimentalFeatures: string;
  enableZoom: string;
  enableZoomTooltip: string;
  enableMinimap: string;
  enableMinimapTooltip: string;
  alwaysShowCaptionEditor: string;
  alwaysShowCaptionEditorTooltip: string;
  instantDelete: string;
  instantDeleteTooltip: string;
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
  transformations: string;
  transformationType: string;
  transformationTypes: {
    searchReplace: string;
    case: string;
    trim: string;
    wrap: string;
    number: string;
  };
  caseTypes: {
    upper: string;
    lower: string;
    title: string;
    sentence: string;
  };
  trimTypes: {
    all: string;
    start: string;
    end: string;
    duplicates: string;
  };
  numberActions: {
    remove: string;
    format: string;
    extract: string;
  };
  prefix: string;
  suffix: string;
  prefixPlaceholder: string;
  suffixPlaceholder: string;
  numberFormat: string;
  numberFormatPlaceholder: string;
  addTransformation: string;
  transformationNamePlaceholder: string;
  transformationDescriptionPlaceholder: string;
  searchPattern: string;
  searchPatternPlaceholder: string;
  replacement: string;
  replacementPlaceholder: string;
  selectIcon: string;
}

export interface GalleryTranslations {
  addTag: string;
  addCaption: string;
  quickJump: string;
  loadingFolders: string;
  noResults: string;
  pathNotFound: string;
  uploadFiles?: string;
  deleteCurrentFolder?: string;
  moveNotImplemented?: string;
  folderCount: TranslationValue;
  fileCount: TranslationValue;
  imageCount: TranslationValue;
  foundFolders: TranslationValue;
  deletedCount: TranslationValue;
  deleteConfirm: TranslationValue;
  deleteSuccess: string;
  deleteError: TranslationValue;
  savingCaption: TranslationValue;
  savedCaption: string;
  errorSavingCaption: TranslationValue;
  emptyFolder: string;
  dropToUpload: string;
  uploadProgress: TranslationValue;
  uploadProgressPercent?: string | ((params: TranslationParams) => string);
  filesExceedLimit?: string;
  noFilesToUpload?: string;
  processingFiles?: string;
  uploadComplete?: string;
  uploadFailed?: string;
  deletingFiles: TranslationValue;
  deleteComplete?: string;
  deleteFailed?: string;
  processingImage: TranslationValue;
  processingImages?: TranslationValue;
  generateTags?: string;
  generatingTags?: string;
  removeTags?: string;
  createCaption?: string;
  captionTypes?: {
    txt: string;
    tags: string;
    caption: string;
    wd: string;
  };
  noCaptionFiles?: string;
  uploadError?: string;
  dropOverlay: string;
  selectAll?: string;
  deselectAll?: string;
  deleteSelected?: string;
  confirmMultiDelete?: TranslationValue;
  confirmFolderDelete?: TranslationValue;
  someFolderDeletesFailed?: string;
  folderDeleteError?: string;
  deletingFile?: string;
  fileDeleteSuccess?: string;
  fileDeleteError?: string;
  createFolder?: string;
  folderNamePlaceholder?: string;
  deleteConfirmation?: string;
  selectedCount?: TranslationValue;
  folderLocation?: TranslationValue;
  moveToFolder?: TranslationValue;
  workWithFolder?: TranslationValue;
  generatingCaption?: string;
  captionGenerated?: string;
  batchTransformTitle?: string;
  batchTransformDescription?: string;
  selectedFiles?: string;
  selectedFilesCount?: TranslationValue;
  enabledTransformations?: string;
  applyBatchTransform?: string;
  applyTransformations?: string;
  moveComplete?: TranslationValue;
  moveFailed?: string;
  moveFailedExists?: string;
  moveFailedMissing?: string;
  moveError?: string;
  sameDirectoryMove?: string;
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
  folderCreated: string;
  folderCreateError: string;
  generatingCaption: string;
  captionGenerated: string;
  connectionLost: string;
  connectionRestored: string;
  batchTransformSuccess?: string;
  batchTransformError?: string;
}

export interface Translations {
  common: CommonTranslations;
  settings: SettingsTranslations;
  tools: ToolsTranslations;
  gallery: GalleryTranslations;
  shortcuts: ShortcutsTranslations;
  imageViewer: ImageViewerTranslations;
  notifications: NotificationsTranslations;
}

export type { LanguageCode };
