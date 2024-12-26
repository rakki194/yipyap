import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "../types";
import { createPluralTranslation } from "../plurals";

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
    language: "Idioma",
    description: "Descripción",
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
      "high-contrast-black": "Alto contraste negro",
      "high-contrast-inverse": "Alto contraste inverso",
    },
    disableAnimations: "Desactivar animaciones",
    disableAnimationsTooltip: "Desactivar todas las animaciones para mejorar el rendimiento",
    language: "Idioma",
    languageTooltip: "Cambiar el idioma de la interfaz",
    disableNonsense: "Desactivar texto japonés",
    disableNonsenseTooltip: "Ocultar texto japonés y otros elementos sin sentido",
    modelSettings: (params: TranslationParams) => "Configuración del modelo",
    jtp2ModelPath: "Ruta del modelo JTP2",
    jtp2ModelPathTooltip: "Ruta al archivo del modelo JTP2 (.safetensors)",
    jtp2TagsPath: "Ruta de etiquetas JTP2",
    jtp2TagsPathTooltip: "Ruta al archivo de etiquetas JTP2 (.json)",
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
    enableZoomTooltip: "Activar zoom y desplazamiento en el visor de imágenes",
    enableMinimap: "Activar minimapa al hacer zoom",
    enableMinimapTooltip: "Mostrar minimapa al hacer zoom para facilitar la navegación",
    alwaysShowCaptionEditor: "Mostrar siempre el editor de subtítulos",
    alwaysShowCaptionEditorTooltip: "Mantener el editor de subtítulos siempre desplegado",
    instantDelete: "Activar eliminación instantánea (sin confirmación)",
    instantDeleteTooltip: "Eliminar archivos sin diálogo de confirmación",
    warning: "Advertencia",
    gallery: "Galería",
    preserveLatents: "Conservar latentes",
    preserveLatentsTooltip: "Conservar variables latentes de generación de imágenes para reutilización posterior",
    preserveTxt: "Conservar archivos TXT",
    preserveTxtTooltip: "Conservar archivos TXT que contienen configuración de generación",
    thumbnailSize: "Tamaño de miniaturas",
    thumbnailSizeDescription: "Tamaño de miniaturas en píxeles (ej: 250)",
    thumbnailSizeUpdateError: "Error al actualizar el tamaño de miniaturas",
  },
  gallery: {
    addTag: "Añadir etiqueta",
    addCaption: "Añadir título",
    quickJump: "Salto rápido",
    loadingFolders: "Cargando carpetas...",
    uploadFiles: "Subir archivos",
    deleteCurrentFolder: "Eliminar carpeta actual",
    noResults: "Sin resultados",
    folderCount: createPluralTranslation({
      one: "1 carpeta",
      other: "${count} carpetas"
    }, "es"),
    fileCount: createPluralTranslation({
      one: "1 archivo",
      other: "${count} archivos"
    }, "es"),
    imageCount: createPluralTranslation({
      one: "1 imagen",
      other: "${count} imágenes"
    }, "es"),
    foundFolders: createPluralTranslation({
      one: "1 carpeta encontrada",
      other: "${count} carpetas encontradas"
    }, "es"),
    deletedCount: createPluralTranslation({
      one: "1 elemento eliminado",
      other: "${count} elementos eliminados"
    }, "es"),
    deleteConfirm: (params: TranslationParams) => {
      const name = params.name ?? "este elemento";
      return `¿Estás seguro de que quieres eliminar "${name}"?`;
    },
    deleteSuccess: "Eliminación completada",
    deleteError: (params: TranslationParams) => {
      const name = params.name ?? "elemento";
      return `Error al eliminar "${name}"`;
    },
    savingCaption: (params: TranslationParams) => {
      const name = params.name ?? "elemento";
      return `Guardando título para "${name}"...`;
    },
    savedCaption: "Título guardado",
    errorSavingCaption: (params: TranslationParams) => {
      const name = params.name ?? "elemento";
      return `Error al guardar el título para "${name}"`;
    },
    emptyFolder: "Esta carpeta está vacía",
    dropToUpload: "Suelta archivos aquí para subirlos",
    uploadProgress: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Subiendo archivos...';
      }
      return createPluralTranslation({
        one: "Subiendo 1 archivo...",
        other: "Subiendo ${count} archivos..."
      }, "es")(params);
    },
    uploadProgressPercent: "Subiendo... {progress}%",
    filesExceedLimit: "Archivos demasiado grandes: {files}",
    noFilesToUpload: "No hay archivos para subir",
    processingFiles: "Procesando archivos...",
    uploadComplete: "Subida completada",
    uploadFailed: "Error en la subida: {error}",
    deletingFiles: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Eliminando archivos...';
      }
      return createPluralTranslation({
        one: "Eliminando 1 archivo...",
        other: "Eliminando ${count} archivos..."
      }, "es")(params);
    },
    deleteComplete: "Eliminación completada",
    deleteFailed: "Error al eliminar",
    processingImage: (params: TranslationParams) => {
      const name = params.name ?? "imagen";
      return `Procesando imagen "${name}"...`;
    },
    processingImages: createPluralTranslation({
      one: "Procesando 1 imagen...",
      other: "Procesando ${count} imágenes..."
    }, "es"),
    generatingCaption: "Generando título...",
    captionGenerated: "Título generado",
    generateTags: "Generar etiquetas",
    generatingTags: "Generando etiquetas...",
    removeTags: "Eliminar etiquetas",
    createCaption: "Crear título",
    captionTypes: {
      txt: "Txt",
      tags: "Etiquetas",
      caption: "Título",
      wd: "WD",
    },
    noCaptionFiles: "No hay archivos de título",
    uploadError: "Error de subida",
    dropOverlay: "Suelta para subir",
    selectAll: "Seleccionar todo",
    deselectAll: "Deseleccionar todo",
    deleteSelected: "Eliminar seleccionados",
    confirmMultiDelete: (params: TranslationParams | null | undefined = {}) => {
      if (!params || typeof params !== 'object') {
        return '¿Estás seguro de que quieres eliminar estos elementos?';
      }
      const folders = typeof params.folders === 'number' ? params.folders : 0;
      const images = typeof params.images === 'number' ? params.images : 0;
      
      if (folders === 0 && images === 0) {
        return '¿Estás seguro de que quieres eliminar estos elementos?';
      }

      const parts = [];
      if (folders > 0) {
        parts.push(createPluralTranslation({
          one: "1 carpeta",
          other: "${count} carpetas"
        }, "es")({ count: folders }));
      }
      if (images > 0) {
        parts.push(createPluralTranslation({
          one: "1 imagen",
          other: "${count} imágenes"
        }, "es")({ count: images }));
      }
      return `¿Estás seguro de que quieres eliminar ${parts.join(" y ")}?`;
    },
    confirmFolderDelete: (params: TranslationParams) => {
      const name = params.name ?? "carpeta";
      return `¿Estás seguro de que quieres eliminar la carpeta "${name}" y todo su contenido?`;
    },
    someFolderDeletesFailed: "Algunas carpetas no se pueden eliminar",
    folderDeleteError: "Error al eliminar una o más carpetas",
    deletingFile: "Eliminando archivo...",
    fileDeleteSuccess: "Archivo eliminado con éxito",
    fileDeleteError: "Error al eliminar uno o más archivos",
    createFolder: "Crear carpeta",
    folderNamePlaceholder: "Nombre de la carpeta",
    deleteConfirmation: "Confirmar eliminación",
    selectedCount: createPluralTranslation({
      one: "1 elemento seleccionado",
      other: "${count} elementos seleccionados"
    }, "es"),
    folderLocation: (params: TranslationParams) => {
      const name = params.name ?? "";
      return `Ubicación: ${name}`;
    },
    moveToFolder: (params: TranslationParams) => {
      const name = params.name ?? "carpeta";
      return `Mover a "${name}"`;
    },
    workWithFolder: (params: TranslationParams) => {
      const name = params.name ?? "carpeta";
      return `Trabajar con la carpeta "${name}"`;
    },
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
    addTransformation: "Añadir transformación",
    transformations: "Transformaciones",
    transformationType: "Tipo de transformación",
    transformationTypes: {
      searchReplace: "Buscar y reemplazar",
      case: "Cambiar mayúsculas/minúsculas",
      trim: "Recortar",
      wrap: "Envolver",
      number: "Número"
    },
    caseTypes: {
      upper: "Mayúsculas",
      lower: "Minúsculas", 
      title: "Título",
      sentence: "Oración"
    },
    trimTypes: {
      all: "Todo",
      start: "Inicio",
      end: "Final",
      duplicates: "Duplicados"
    },
    numberActions: {
      remove: "Eliminar",
      format: "Formatear",
      extract: "Extraer"
    },
    numberFormat: "Formato de número",
    numberFormatPlaceholder: "Ejemplo: #,###.##",
    prefix: "Prefijo",
    suffix: "Sufijo", 
    prefixPlaceholder: "Añadir antes del texto",
    suffixPlaceholder: "Añadir después del texto",
    transformationNamePlaceholder: "Nombre de la transformación",
    transformationDescriptionPlaceholder: "Descripción de la transformación",
    searchPattern: "Patrón de búsqueda",
    searchPatternPlaceholder: "Texto a buscar",
    replacement: "Reemplazo",
    replacementPlaceholder: "Texto de reemplazo",
    selectIcon: "Seleccionar icono",
    removeCommas: "Eliminar comas",
    replaceNewlinesWithCommas: "Reemplazar saltos de línea por comas",
    replaceUnderscoresWithSpaces: "Reemplazar guiones bajos por espacios"
  },
  notifications: {
    imageCopied: "Imagen copiada al portapapeles",
    imageCopyFailed: "Error al copiar la imagen al portapapeles",
    folderCreated: "Carpeta creada correctamente",
    folderCreateError: "Error al crear la carpeta",
    generatingCaption: "Generando subtítulo...",
    captionGenerated: "Subtítulo generado",
    connectionLost: "Conexión perdida",
    connectionRestored: "Conexión restaurada"
  },
} as const satisfies Translations;
