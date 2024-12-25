import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "./types";
import { createPluralTranslation } from "./plurals";

export default {
  common: {
    close: "Close",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    edit: "Edit",
    add: "Add",
    remove: "Remove",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    confirm: "Confirm",
    download: "Download",
    path: "Path",
    size: "Size",
    date: "Date",
    name: "Name",
    type: "Type",
    actions: "Actions",
    search: "Search...",
    filter: "Filter",
    apply: "Apply",
    reset: "Reset",
    selected: "Selected",
    all: "All",
    none: "None",
    // The character used to separate parts of a file path (e.g., "/" on Unix, "\" on Windows)
    pathSeparator: getPathSeparator("en"),
    toggleTheme: "Toggle theme",
    theme: "Theme",
    returnToFrontPage: "Return to the front page",
    home: "Home",
    openSettings: "Open settings",
    create: "Create",
    creating: "Creating...",
    language: "Interface language",
    description: "Description",
  },
  settings: {
    title: "Settings",
    appearance: "Appearance",
    theme: {
      light: "Light",
      gray: "Gray",
      dark: "Dark",
      banana: "Banana",
      strawberry: "Strawberry",
      peanut: "Peanut",
      christmas: "Christmas",
      halloween: "Halloween",
      "high-contrast-black": "High Contrast Dark",
      "high-contrast-inverse": "High Contrast Light",
    },
    disableAnimations: "Disable animations",
    disableAnimationsTooltip: "Turn off all animations for improved performance",
    language: "Language",
    languageTooltip: "Change the interface language",
    // Controls whether to show Japanese text and other playful UI elements
    disableNonsense: "Disable nonsense",
    disableNonsenseTooltip: "Hide Japanese text and other nonsensical elements",
    modelSettings: "Model settings",
    // Path to the JTP2 machine learning model file used for image analysis
    jtp2ModelPath: "JTP2 model path",
    jtp2ModelPathTooltip: "Path to the JTP2 model file (.safetensors)",
    // Path to the tags file containing vocabulary for the JTP2 model
    jtp2TagsPath: "JTP2 tags path",
    jtp2TagsPathTooltip: "Path to the JTP2 tags file (.json)",
    downloadModel: "Download model",
    downloadTags: "Download tags",
    viewMode: "View mode",
    gridView: "Grid view",
    listView: "List view",
    sortBy: "Sort by",
    sortByName: "Sort by name",
    sortByDate: "Sort by date",
    sortBySize: "Sort by size",
    experimentalFeatures: "Experimental features",
    enableZoom: "Enable zoom",
    enableZoomTooltip: "Enable zooming and panning in the image viewer",
    enableMinimap: "Enable minimap",
    enableMinimapTooltip: "Show a minimap when zoomed in for easier navigation",
    alwaysShowCaptionEditor: "Always show caption editor",
    alwaysShowCaptionEditorTooltip: "Keep the caption editor expanded at all times",
    instantDelete: "Instant delete",
    instantDeleteTooltip: "Delete files without confirmation dialog",
    warning: "Warning",
    gallery: "Gallery",
    // When enabled, keeps latent vector files when moving/deleting images
    preserveLatents: "Preserve latents",
    preserveLatentsTooltip: "Preserve latents when moving or deleting files",
    preserveTxt: "Preserve txt",
    preserveTxtTooltip: "Preserve txt files when moving or deleting files",
    thumbnailSize: "Thumbnail size",
    thumbnailSizeDescription: "The size of thumbnails in the gallery",
    thumbnailSizeUpdateError: "Failed to update thumbnail size",
  },
  tools: {
    removeCommas: "Remove commas",
    replaceNewlinesWithCommas: "Replace newlines with commas",
    replaceUnderscoresWithSpaces: "Replace underscores with spaces",
    transformations: "Text Transformations",
    transformationType: "Transformation Type",
    transformationTypes: {
      searchReplace: "Search and Replace",
      case: "Case Transformation",
      trim: "Trim Operations",
      wrap: "Text Wrapping",
      number: "Number Operations",
    },
    caseTypes: {
      upper: "UPPERCASE",
      lower: "lowercase",
      title: "Title Case",
      sentence: "Sentence case",
    },
    trimTypes: {
      all: "Trim All Spaces",
      start: "Trim Start",
      end: "Trim End",
      duplicates: "Remove Duplicate Spaces",
    },
    numberActions: {
      remove: "Remove Numbers",
      format: "Format Numbers",
      extract: "Extract Numbers",
    },
    prefix: "Prefix",
    suffix: "Suffix",
    prefixPlaceholder: "Text to add before",
    suffixPlaceholder: "Text to add after",
    numberFormat: "Number Format",
    numberFormatPlaceholder: "Minimum digits (e.g., 2 for 01, 02, etc.)",
    addTransformation: "Add Transformation",
    transformationNamePlaceholder: "Enter transformation name",
    transformationDescriptionPlaceholder: "Enter transformation description (optional)",
    searchPattern: "Search Pattern",
    searchPatternPlaceholder: "Enter regex pattern (e.g., [0-9]+)",
    replacement: "Replacement",
    replacementPlaceholder: "Enter replacement text",
    selectIcon: "Select Icon",
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
    imageWork: "Image work",
    audioWork: "Audio work",
    deselectAll: "Deselect all",
    deleteSelected: "Delete selected",
  },
  gallery: {
    addTag: "Add tag",
    addCaption: "Add caption",
    quickJump: "Quick jump",
    loadingFolders: "Loading folders...",
    noResults: "No results found",
    uploadFiles: "Upload files",
    deleteCurrentFolder: "Delete current folder",
    folderCount: createPluralTranslation({
      one: "1 folder",
      other: "${count} folders"
    }, "en"),
    fileCount: createPluralTranslation({
      one: "1 file",
      other: "${count} files"
    }, "en"),
    imageCount: createPluralTranslation({
      one: "1 image",
      other: "${count} images"
    }, "en"),
    foundFolders: createPluralTranslation({
      one: "Found 1 folder",
      other: "Found ${count} folders"
    }, "en"),
    deletedCount: createPluralTranslation({
      one: "Deleted 1 file",
      other: "Deleted ${count} files"
    }, "en"),
    deleteConfirm: (params: TranslationParams) => {
      const name = params.name ?? "this item";
      return `Are you sure you want to delete "${name}"?`;
    },
    deleteSuccess: "Successfully deleted",
    deleteError: (params: TranslationParams) => {
      const name = params.name ?? "item";
      return `Failed to delete "${name}"`;
    },
    savingCaption: (params: TranslationParams) => {
      const name = params.name ?? "item";
      return `Saving caption for "${name}"...`;
    },
    savedCaption: "Caption saved",
    errorSavingCaption: (params: TranslationParams) => {
      const name = params.name ?? "item";
      return `Failed to save caption for "${name}"`;
    },
    emptyFolder: "This folder is empty",
    dropToUpload: "Drop files here to upload",
    uploadProgress: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Uploading some files...';
      }
      return createPluralTranslation({
        one: "Uploading 1 file...",
        other: "Uploading ${count} files..."
      }, "en")(params);
    },
    uploadProgressPercent: "Uploading... {progress}%",
    filesExceedLimit: "Files too large: {files}",
    noFilesToUpload: "No files to upload",
    processingFiles: "Processing files...",
    uploadComplete: "Upload complete",
    uploadFailed: "Upload failed: {error}",
    deletingFiles: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Deleting files...';
      }
      return createPluralTranslation({
        one: "Deleting 1 file...",
        other: "Deleting ${count} files..."
      }, "en")(params);
    },
    deleteComplete: "Deleted {count} files",
    deleteFailed: "Delete failed: {error}",
    processingImage: (params: TranslationParams) => {
      const name = params.name ?? "image";
      return `Processing "${name}"...`;
    },
    generateTags: "Generate tags",
    generatingTags: "Generating tags...",
    removeTags: "Remove tags",
    createCaption: "Create caption",
    captionTypes: {
      // Plain text file containing usually the concatenated tags and caption.
      txt: "Text file",
      // Comma-separated tags describing the image in the e621 format.
      tags: "JTP2 generated tags file",
      // Natural language description of the image
      caption: "Caption file",
      // Comma-separated tags describing the image in the danbooru format.
      wd: "WDv3 generated tags file",
    },
    noCaptionFiles: "No caption files found",
    uploadError: "Failed to upload file",
    dropOverlay: "Drop files here",
    selectAll: "Select all",
    deselectAll: "Deselect all",
    deleteSelected: "Delete selected",
    confirmMultiDelete: (params: TranslationParams | null | undefined = {}) => {
      if (!params || typeof params !== 'object') {
        return 'Are you sure you want to delete these items?';
      }
      const folders = typeof params.folders === 'number' ? params.folders : 0;
      const images = typeof params.images === 'number' ? params.images : 0;
      
      if (folders === 0 && images === 0) {
        return 'Are you sure you want to delete these items?';
      }

      const parts = [];
      if (folders > 0) {
        parts.push(createPluralTranslation({
          one: "1 folder",
          other: "${count} folders"
        }, "en")({ count: folders }));
      }
      if (images > 0) {
        parts.push(createPluralTranslation({
          one: "1 image",
          other: "${count} images"
        }, "en")({ count: images }));
      }
      return `Are you sure you want to delete ${parts.join(" and ")}?`;
    },
    confirmFolderDelete: (params: TranslationParams) => {
      const name = params.name ?? "folder";
      return `Are you sure you want to delete the folder "${name}" and all its contents?`;
    },
    someFolderDeletesFailed: "Some folders could not be deleted",
    folderDeleteError: "Failed to delete one or more folders",
    deletingFile: "Deleting file...",
    fileDeleteSuccess: "File deleted successfully",
    fileDeleteError: "Failed to delete one or more files",
    createFolder: "Create folder",
    folderNamePlaceholder: "Folder name",
    deleteConfirmation: "Delete confirmation",
    selectedCount: createPluralTranslation({
      one: "1 item selected",
      other: "${count} items selected"
    }, "en"),
    processingImages: createPluralTranslation({
      one: "Processing 1 image...",
      other: "Processing ${count} images..."
    }, "en"),
    folderLocation: (params: TranslationParams) => {
      const name = params.name ?? "";
      return `Location: ${name}`;
    },
    moveToFolder: (params: TranslationParams) => {
      const name = params.name ?? "folder";
      return `Move to "${name}"`;
    },
    workWithFolder: (params: TranslationParams) => {
      const name = params.name ?? "folder";
      return `Work with "${name}"`;
    },
    generatingCaption: "Generating caption with {generator}...",
    captionGenerated: "Caption generated with {generator}",
  },
  shortcuts: {
    title: "Keyboard shortcuts",
    galleryNavigation: "Gallery navigation",
    quickFolderSwitch: "Quick folder switch",
    aboveImage: "Above image",
    belowImage: "Below image",
    previousImage: "Previous image",
    nextImage: "Next image",
    togglePreview: "Toggle preview",
    tagNavigation: "Tag navigation",
    previousTag: "Previous tag",
    nextTag: "Next tag",
    switchTagBubble: "Switch tag bubble",
    switchTagInput: "Switch tag input",
    cycleCaptions: "Cycle captions",
    firstTagRow: "First tag row",
    lastTagRow: "Last tag row",
    doubleShift: "Double shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Remove tag",
    other: "Other",
    esc: "Esc",
    closePreview: "Close preview",
    deleteImage: "Delete image",
    toggleImagePreview: "Toggle image preview",
    copyToClipboard: "Copy to clipboard",
  },
  imageViewer: {
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    resetZoom: "Reset zoom",
    toggleMinimap: "Toggle minimap",
    previousImage: "Previous image",
    nextImage: "Next image",
    copyPath: "Copy path",
    openInNewTab: "Open in new tab",
    fitToScreen: "Fit to screen",
    actualSize: "Actual size",
    rotateLeft: "Rotate left",
    rotateRight: "Rotate right",
    downloadImage: "Download image",
    imageInfo: "Image info",
    dimensions: "Dimensions",
  },
  notifications: {
    imageCopied: "Image path copied to clipboard",
    imageCopyFailed: "Failed to copy image path",
    folderCreated: "Folder created successfully",
    folderCreateError: "Failed to create folder",
    generatingCaption: "Generating caption...",
    captionGenerated: "Caption generated successfully",
    connectionLost: "Connection lost. Please check your internet connection.",
    connectionRestored: "Connection restored.",
  },
} as const satisfies Translations;
