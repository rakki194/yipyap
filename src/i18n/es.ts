import { getPathSeparator } from "~/i18n";
import { getSpanishPlural } from "./utils";
import type { Translations, TranslationParams } from "./types";

export default {
  common: {
    close: "Cerrar",
    delete: "Eliminar",
    cancel: "Cancelar",
    save: "Guardar",
    edit: "Editar",
    add: "Añadir",
    remove: "Eliminar",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    confirm: "Confirmar",
    download: "Descargar",
    path: "Ruta",
    size: "Tamaño",
    date: "Fecha",
    name: "Nombre",
    type: "Tipo",
    actions: "Acciones",
    search: "Buscar...",
    filter: "Filtrar",
    apply: "Aplicar",
    reset: "Restablecer",
    selected: "Seleccionado",
    all: "Todo",
    none: "Ninguno",
    pathSeparator: getPathSeparator("es"),
    toggleTheme: "Cambiar tema",
    theme: "Tema",
    returnToFrontPage: "Volver a la página principal",
    home: "Inicio",
    openSettings: "Abrir ajustes",
    create: "Crear",
    creating: "Creando...",
  },
  settings: {
    title: "Ajustes",
    appearance: "Apariencia",
    theme: {
      light: "Claro",
      gray: "Gris",
      dark: "Oscuro",
      banana: "Plátano",
      strawberry: "Fresa",
      peanut: "Cacahuete",
      christmas: "Navidad",
      halloween: "Halloween",
    },
    disableAnimations: "Desactivar animaciones",
    language: "Idioma",
    disableNonsense: "Desactivar texto japonés",
    modelSettings: "Ajustes del modelo",
    jtp2ModelPath: "Ruta del modelo JTP2",
    jtp2TagsPath: "Ruta de etiquetas JTP2",
    downloadModel: "Descargar modelo (1,8 GB)",
    downloadTags: "Descargar etiquetas (195 KB)",
    viewMode: "Modo de vista",
    gridView: "Vista en cuadrícula",
    listView: "Vista en lista",
    sortBy: "Ordenar por",
    sortByName: "Ordenar por nombre",
    sortByDate: "Ordenar por fecha",
    sortBySize: "Ordenar por tamaño",
    experimentalFeatures: "Funciones experimentales",
    enableZoom: "Activar zoom",
    enableMinimap: "Activar minimapa al hacer zoom",
    instantDelete: "Activar eliminación instantánea (sin confirmación)",
    warning: "Advertencia",
    gallery: "Galería",
    preserveLatents: "Preservar Latents",
    preserveLatentsTooltip: "Mantén los archivos .npz (latent) al eliminar imágenes.",
    preserveTxt: "Preservar .txt",
    preserveTxtTooltip: "Mantén los archivos .txt al eliminar imágenes.",
    thumbnailSize: "Tamaño de miniaturas",
    thumbnailSizeDescription: "Ajustar el tamaño de las miniaturas en la galería",
    thumbnailSizeUpdateError: "Error al actualizar el tamaño de las miniaturas",
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
    imageWork: "Trabajar con imágenes",
    audioWork: "Trabajar con audio",
    deselectAll: "Deseleccionar todo",
    deleteSelected: "Eliminar seleccionados",
  },
  gallery: {
    selectedCount: (params?: TranslationParams) => 
      `${params?.count ?? 0} ${getSpanishPlural(params?.count ?? 0, {
        singular: "elemento seleccionado",
        plural: "elementos seleccionados"
      })}`,
    processingImages: (params?: TranslationParams) => 
      `Procesando ${params?.count ?? 0} ${getSpanishPlural(params?.count ?? 0, {
        singular: "imagen",
        plural: "imágenes"
      })}...`,
    deletedCount: (params?: TranslationParams) => 
      `${params?.count ?? 0} ${getSpanishPlural(params?.count ?? 0, {
        singular: "elemento eliminado",
        plural: "elementos eliminados"
      })}`,
    fileCount: (params?: TranslationParams) => 
      getSpanishPlural(params?.count ?? 0, {
        singular: "archivo",
        plural: "archivos"
      }),
    imageCount: (params?: TranslationParams) => 
      getSpanishPlural(params?.count ?? 0, {
        singular: "imagen",
        plural: "imágenes"
      }),
    foundFolders: (params?: TranslationParams) => 
      `${params?.count ?? 0} ${getSpanishPlural(params?.count ?? 0, {
        singular: "carpeta encontrada",
        plural: "carpetas encontradas"
      })}`,
    selectAll: "Seleccionar todo",
    deselectAll: "Deseleccionar todo",
    deleteSelected: "Eliminar seleccionados",
    addTag: "Añadir etiqueta...",
    addCaption: "Añadir título...",
    quickJump: "Ir a carpeta...",
    loadingFolders: "Cargando carpetas...",
    noResults: "No se encontraron resultados",
    folderCount: (params?: TranslationParams) => `${params?.count ?? 0} carpetas`,
    deleteConfirm: "¿Estás seguro de que quieres eliminar esta imagen?",
    deleteSuccess: "Imagen eliminada con éxito",
    deleteError: "Error al eliminar la imagen",
    savingCaption: "Guardando título...",
    savedCaption: "Título guardado",
    errorSavingCaption: "Error al guardar el título",
    emptyFolder: "Esta carpeta está vacía",
    dropToUpload: "Suelta archivos aquí para subir",
    uploadProgress: (params?: TranslationParams) => {
      if (!params?.count) return 'Subiendo archivos...';
      return `Subiendo ${params.count} ${getSpanishPlural(params.count, {
        singular: "archivo",
        plural: "archivos"
      })}...`;
    },
    processingImage: "Procesando imagen...",
    generateTags: "Generar etiquetas",
    generatingTags: "Generando etiquetas...",
    removeTags: "Eliminar etiquetas",
    createCaption: "Crear título",
    captionTypes: {
      txt: "Crear nuevo archivo de texto",
      tags: "Crear nuevo archivo .tags",
      caption: "Crear nuevo archivo .caption",
      wd: "Crear nuevo archivo .wd"
    },
    noCaptionFiles: "¡Aún no hay archivos de título!",
    confirmMultiDelete: ({ folders = 0, images = 0 }) => {
      if (folders > 0 && images > 0) {
        return `¿Estás seguro de que quieres eliminar ${folders} ${getSpanishPlural(folders, {
          singular: "carpeta",
          plural: "carpetas"
        })} y ${images} ${getSpanishPlural(images, {
          singular: "imagen",
          plural: "imágenes"
        })}?`;
      } else if (folders > 0) {
        return `¿Estás seguro de que quieres eliminar ${folders} ${getSpanishPlural(folders, {
          singular: "carpeta",
          plural: "carpetas"
        })}?`;
      }
      return `¿Estás seguro de que quieres eliminar ${images} ${getSpanishPlural(images, {
        singular: "imagen",
        plural: "imágenes"
      })}?`;
    },
    confirmFolderDelete: "¿Estás seguro de que quieres eliminar esta carpeta? ¡Esto eliminará todo su contenido!",
    someFolderDeletesFailed: "No se pudieron eliminar algunas carpetas",
    folderDeleteError: "Error al eliminar la carpeta",
    deletingFile: "Eliminando archivo...",
    fileDeleteSuccess: "Archivo eliminado correctamente",
    fileDeleteError: "Error al eliminar el archivo",
    createFolder: "Crear carpeta",
    folderNamePlaceholder: "Nombre de la carpeta",
    deleteConfirmation: "Confirmar eliminación",
    folderLocation: (params?: TranslationParams) => `Ubicación: ${params?.name ?? ''}`,
    moveToFolder: (params?: TranslationParams) => `Mover a ${params?.name ?? ''}`,
    workWithFolder: (params?: TranslationParams) => `Trabajar con ${params?.name ?? ''}`,
    uploadError: "Error al subir el archivo",
    dropOverlay: "Suelta archivos o carpetas aquí",
  },
  shortcuts: {
    title: "Atajos de teclado",
    galleryNavigation: "Navegación de galería",
    quickFolderSwitch: "Cambio rápido de carpeta",
    aboveImage: "Imagen superior",
    belowImage: "Imagen inferior",
    previousImage: "Imagen anterior",
    nextImage: "Imagen siguiente",
    togglePreview: "Alternar vista previa",
    tagNavigation: "Navegación de etiquetas",
    previousTag: "Etiqueta anterior",
    nextTag: "Etiqueta siguiente",
    switchTagBubble: "Cambiar a burbujas de etiquetas",
    switchTagInput: "Cambiar a entrada de etiquetas",
    cycleCaptions: "Ciclar títulos",
    firstTagRow: "Primera etiqueta de la fila",
    lastTagRow: "Última etiqueta de la fila",
    doubleShift: "Doble Shift",
    shift: "Shift",
    del: "Supr",
    removeTag: "Eliminar etiqueta",
    other: "Otros",
    esc: "Esc",
    closePreview: "Cerrar vista previa/modal",
    deleteImage: "Eliminar imagen",
    toggleImagePreview: "Alternar vista previa de imagen",
    copyToClipboard: "Copiar imagen al portapapeles",
  },
  imageViewer: {
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    resetZoom: "Restablecer zoom",
    toggleMinimap: "Alternar minimapa",
    previousImage: "Imagen anterior",
    nextImage: "Imagen siguiente",
    copyPath: "Copiar ruta",
    openInNewTab: "Abrir en nueva pestaña",
    fitToScreen: "Ajustar a pantalla",
    actualSize: "Tamaño real",
    rotateLeft: "Rotar a la izquierda",
    rotateRight: "Rotar a la derecha",
    downloadImage: "Descargar imagen",
    imageInfo: "Información de la imagen",
    dimensions: "Dimensiones",
  },
  tools: {
    removeCommas: "Eliminar comas",
    replaceNewlinesWithCommas: "Reemplazar saltos de línea por comas",
    replaceUnderscoresWithSpaces: "Reemplazar guiones bajos por espacios",
  },
  notifications: {
    imageCopied: "Imagen copiada al portapapeles",
    imageCopyFailed: "Error al copiar la imagen al portapapeles",
    folderCreated: "Carpeta creada correctamente",
    folderCreateError: "Error al crear la carpeta",
  },
} as const satisfies Translations;
