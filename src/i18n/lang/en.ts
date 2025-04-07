import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "../types";
import { createPluralTranslation } from "../plurals";

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
    notFound: "404 - Not Found",
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
    jtp2ModelPath: "JTP2 Model Path",
    jtp2ModelPathTooltip: "Path to the JTP2 model file",
    // Path to the tags file containing vocabulary for the JTP2 model
    jtp2TagsPath: "JTP2 Tags Path",
    jtp2TagsPathTooltip: "Path to the JTP2 tags file",
    jtp2Threshold: "JTP2 Tag Threshold",
    jtp2ThresholdTooltip: "Confidence threshold for including tags (0.0 to 1.0)",
    jtp2ForceCpu: "Force CPU for JTP2",
    jtp2ForceCpuTooltip: "Force JTP2 to use CPU instead of GPU",
    downloadModel: "Download Model (1.8GB)",
    downloadTags: "Download Tags (195KB)",
    wdv3ModelName: "WDv3 Model",
    wdv3ModelNameTooltip: "Select the WDv3 model architecture (ViT, SwinV2, or ConvNext)",
    wdv3GenThreshold: "General Tag Threshold",
    wdv3GenThresholdTooltip: "Confidence threshold for general tags (0.35 default)",
    wdv3CharThreshold: "Character Tag Threshold",
    wdv3CharThresholdTooltip: "Confidence threshold for character tags (0.75 default)",
    wdv3ForceCpu: "Force CPU for WDv3",
    wdv3ForceCpuTooltip: "Force WDv3 to use CPU instead of GPU",
    wdv3ConfigUpdateError: "Failed to update WDv3 settings",
    viewMode: "View Mode",
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
    transformations: "Transformations",
    transformationType: "Transformation Type",
    example: "Example",
    original: "Original",
    caseType: "Case Type",
    trimType: "Trim Type",
    numberAction: "Number Action",
    transformed: "Transformed",
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
    editTransformation: "Edit Transformation",
    transformationNamePlaceholder: "Enter transformation name",
    transformationDescriptionPlaceholder: "Enter transformation description (optional)",
    searchPattern: "Search Pattern",
    searchPatternPlaceholder: "Enter regex pattern (e.g., [0-9]+)",
    replacement: "Replacement",
    replacementPlaceholder: "Enter replacement text",
    selectIcon: "Select Icon",
  },
  gallery: {
    addTag: "Add tag",
    addCaption: "Add caption",
    // Quick navigation between folders and actions using keyboard shortcuts
    quickJump: "Quick jump",
    loadingFolders: "Loading folders...",
    noResults: "No results",
    pathNotFound: "Path not found",
    uploadFiles: "Upload files",
    uploadFolder: "Upload folder",
    deleteCurrentFolder: "Delete current folder",
    moveNotImplemented: "Moving items is not yet implemented",
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
      txt: "Create new text file",
      tags: "Create new .tags file",
      caption: "Create new .caption file",
      wd: "Create new .wd file",
      florence: "Generate with Florence2"
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
    batchTransformTitle: "Batch Transform",
    batchTransformDescription: "Apply enabled text transformations to all selected files. This will modify captions and tags for each selected file.",
    selectedFiles: "Selected Files",
    selectedFilesCount: createPluralTranslation({
      one: "1 file selected",
      other: "${count} files selected"
    }, "en"),
    enabledTransformations: "Enabled Transformations",
    applyBatchTransform: "Apply batch transformations",
    applyTransformations: "Apply Transformations",
    moveComplete: createPluralTranslation({
      one: "Moved 1 item",
      other: "Moved ${count} items"
    }, "en"),
    moveFailed: "Failed to move: {files}",
    moveFailedExists: "Cannot move {files} because they already exist in the target folder",
    moveFailedMissing: "Cannot move {files} because they no longer exist",
    moveError: "Move failed: {error}",
    sameDirectoryMove: "Cannot move items to the same directory they are already in",
    moveItems: "Move Items",
    moveItemsDescription: (params: TranslationParams) => {
      const imageCount = Number(params?.imageCount ?? 0);
      const folderCount = Number(params?.folderCount ?? 0);
      const total = imageCount + folderCount;
      return `Move ${total} items (${folderCount} folders, ${imageCount} images)`;
    },
    selectTargetFolder: "Select Target Folder",
    searchFolders: "Search folders...",
    noFoldersFound: "No folders found",
    noFoldersAvailable: "No folders available",
    moveSuccess: "Items moved successfully",
    moveSelected: "Move Selected",
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
    multiSelect: "Toggle multiselect",
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
    batchTransformSuccess: "Successfully applied transformations to selected files",
    batchTransformError: "Failed to apply transformations to some files",
  },
} as const satisfies Translations;
