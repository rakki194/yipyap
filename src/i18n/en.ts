import { getPathSeparator } from "~/i18n";
import type { Translations } from "./types";

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
    pathSeparator: getPathSeparator("en"),
    toggleTheme: "Toggle theme",
    theme: "Theme",
    returnToFrontPage: "Return to the front page",
    home: "Home",
    openSettings: "Open settings",
    create: "Create",
    creating: "Creating...",
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
    },
    disableAnimations: "Disable Animations",
    language: "Language",
    disableNonsense: "Disable Japanese Text",
    modelSettings: "Model Settings",
    jtp2ModelPath: "JTP2 Model Path",
    jtp2TagsPath: "JTP2 Tags Path",
    downloadModel: "Download Model (1.8GB)",
    downloadTags: "Download Tags (195KB)",
    viewMode: "View Mode",
    gridView: "Grid View",
    listView: "List View",
    sortBy: "Sort By",
    sortByName: "Sort by Name",
    sortByDate: "Sort by Date",
    sortBySize: "Sort by Size",
    experimentalFeatures: "Experimental Features",
    enableZoom: "Enable image zooming",
    enableMinimap: "Enable minimap when zoomed",
    instantDelete: "Enable instant delete (skips confirmation)",
    warning: "Warning",
    gallery: "Gallery",
    preserveLatents: "Preserve Latents",
    preserveLatentsTooltip: "Keep .npz (latent) files when deleting images.",
    preserveTxt: "Preserve .txt",
    preserveTxtTooltip: "Keep .txt files when deleting images.",
    thumbnailSize: "Thumbnail Size",
    thumbnailSizeDescription: "Adjust the size of image thumbnails in the gallery view",
    thumbnailSizeUpdateError: "Failed to update thumbnail size",
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
    imageWork: "Work with Images",
    audioWork: "Work with Audio",
    deselectAll: "Deselect All",
    deleteSelected: "Delete Selected",
  },
  gallery: {
    fileCount: ({ count }: { count: number }) => 
      `${count} files`,
    imageCount: ({ count }: { count: number }) => 
      `${count} images`,
    foundFolders: ({ count }: { count: number }) => 
      `Found ${count} folders`,
    addTag: "Add a tag...",
    addCaption: "Add a caption...",
    quickJump: "Jump to folder...",
    loadingFolders: "Loading folders...",
    noResults: "No results found",
    folderCount: ({ count }: { count: number }) => `${count} folders`,
    deleteConfirm: "Are you sure you want to delete this image?",
    deleteSuccess: "Image deleted successfully",
    deleteError: "Error deleting image",
    savingCaption: "Saving caption...",
    savedCaption: "Caption saved",
    errorSavingCaption: "Error saving caption",
    emptyFolder: "This folder is empty",
    dropToUpload: "Drop files here to upload",
    uploadProgress: ({ count }: { count: number }) => `Uploading ${count} files...`,
    processingImage: "Processing image...",
    generateTags: "Generate Tags",
    generatingTags: "Generating tags...",
    removeTags: "Remove Tags",
    createCaption: "Create Caption",
    captionTypes: {
      txt: "Create new Text file",
      tags: "Create new .tags file", 
      caption: "Create new .caption file",
      wd: "Create new .wd file"
    },
    noCaptionFiles: "No caption files yet!",
    uploadError: "Upload failed",
    dropOverlay: "Drop files or folders here",
    selectAll: "Select all images",
    deselectAll: "Deselect all",
    deleteSelected: "Delete {{count}} selected items",
    confirmMultiDelete: ({ folders = 0, images = 0 }: { folders?: number; images?: number }) => {
      if (folders && images) {
        return `Are you sure you want to delete ${folders} folder${folders > 1 ? 's' : ''} and ${images} image${images > 1 ? 's' : ''}?`;
      } else if (folders) {
        return `Are you sure you want to delete ${folders} folder${folders > 1 ? 's' : ''}?`;
      } else if (images) {
        return `Are you sure you want to delete ${images} image${images > 1 ? 's' : ''}?`;
      } else {
        return 'Are you sure you want to delete these items?'; // fallback message
      }
    },
    confirmFolderDelete: "Are you sure you want to delete {{count}} folders? This will delete all contents!",
    someFolderDeletesFailed: "Failed to delete {{count}} folders",
    folderDeleteError: "Error deleting folders",
    deletingFile: "Deleting file...",
    fileDeleteSuccess: "File deleted successfully",
    fileDeleteError: "Error deleting file",
    createFolder: "Create Folder",
    folderNamePlaceholder: "Enter folder name",
    deleteConfirmation: "Confirm Deletion",
    deletedCount: ({ count }: { count: number }) => `Deleted ${count} items`,
    selectedCount: ({ count }: { count: number }) => `${count} selected`,
    processingImages: ({ count }: { count: number }) => `Processing ${count} images...`,
    folderLocation: ({ name }: { name: string }) => `in ${name}`,
    moveToFolder: ({ name }: { name: string }) => `Move to ${name}`,
    workWithFolder: ({ name }: { name: string }) => `Work with ${name}`,
  },
  shortcuts: {
    title: "Keyboard Shortcuts",
    galleryNavigation: "Gallery Navigation",
    quickFolderSwitch: "Quick folder switch",
    aboveImage: "Above image",
    belowImage: "Below image",
    previousImage: "Previous image",
    nextImage: "Next image",
    togglePreview: "Toggle image preview",
    tagNavigation: "Tag Navigation",
    previousTag: "Previous tag",
    nextTag: "Next tag",
    switchTagBubble: "Switch to tag bubble editing",
    switchTagInput: "Switch to tag input",
    cycleCaptions: "Cycle through caption inputs",
    firstTagRow: "First tag in row",
    lastTagRow: "Last tag in row",
    doubleShift: "Double Shift",
    shift: "Shift",
    del: "Del",
    removeTag: "Remove tag",
    other: "Other",
    esc: "Esc",
    closePreview: "Close preview/modal",
    deleteImage: "Delete image",
    toggleImagePreview: "Toggle image preview",
    copyToClipboard: "Copy image to clipboard",
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
    imageInfo: "Image information",
    dimensions: "Dimensions",
  },
  tools: {
    removeCommas: "Remove commas",
    replaceNewlinesWithCommas: "Replace newlines with commas",
    replaceUnderscoresWithSpaces: "Replace underscores with spaces",
  },
  notifications: {
    imageCopied: "Image copied to clipboard",
    imageCopyFailed: "Failed to copy image to clipboard",
    folderCreated: "Folder created successfully",
    folderCreateError: "Error creating folder",
  },
} as const satisfies Translations;
