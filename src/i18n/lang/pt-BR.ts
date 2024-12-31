import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "../types";

export default {
  common: {
    close: "Fechar",
    delete: "Excluir",
    cancel: "Cancelar",
    save: "Salvar",
    edit: "Editar",
    add: "Adicionar",
    remove: "Remover",
    loading: "Carregando...",
    error: "Erro",
    success: "Sucesso",
    confirm: "Confirmar",
    download: "Baixar",
    path: "Caminho",
    size: "Tamanho",
    date: "Data",
    name: "Nome",
    type: "Tipo",
    actions: "Ações",
    search: "Pesquisar...",
    filter: "Filtrar",
    apply: "Aplicar",
    reset: "Redefinir",
    selected: "Selecionado",
    all: "Todos",
    none: "Nenhum",
    pathSeparator: getPathSeparator("pt-BR"),
    toggleTheme: "Alternar tema",
    theme: "Tema",
    returnToFrontPage: "Voltar à página inicial",
    home: "Início",
    openSettings: "Abrir configurações",
    create: "Criar",
    creating: "Criando",
    language: "Idioma",
    description: "Descrição",
  },
  settings: {
    title: "Configurações",
    appearance: "Aparência",
    theme: {
      light: "Claro",
      gray: "Cinza",
      dark: "Escuro",
      banana: "Banana",
      strawberry: "Morango",
      peanut: "Amendoim",
      christmas: "Natal",
      halloween: "Halloween",
      "high-contrast-black": "Alto Contraste Preto",
      "high-contrast-inverse": "Alto Contraste Inverso",
    },
    disableAnimations: "Desativar animações",
    disableAnimationsTooltip: "Desative todas as animações no aplicativo",
    language: "Idioma",
    languageTooltip: "Escolha o idioma da interface",
    disableNonsense: "Desativar texto japonês",
    disableNonsenseTooltip: "Desative o texto japonês no aplicativo",
    modelSettings: "Configurações do modelo",
    jtp2ModelPath: "Caminho do modelo JTP2",
    jtp2ModelPathTooltip: "Caminho para o arquivo do modelo JTP2 (.safetensors)",
    jtp2TagsPath: "Caminho das tags JTP2",
    jtp2TagsPathTooltip: "Caminho para o arquivo de tags JTP2 (.json)",
    jtp2Threshold: "Limite JTP2",
    jtp2ThresholdTooltip: "Limite de confiança para incluir tags (0.0 a 1.0)",
    jtp2ForceCpu: "Forçar CPU JTP2",
    jtp2ForceCpuTooltip: "Forçar JTP2 a usar CPU em vez de GPU",
    wdv3ModelName: "Modelo WDv3",
    wdv3ModelNameTooltip: "Selecionar arquitetura do modelo WDv3 (ViT, SwinV2 ou ConvNext)",
    wdv3GenThreshold: "Limite geral WDv3",
    wdv3GenThresholdTooltip: "Limite de confiança para tags gerais (padrão: 0.35)",
    wdv3CharThreshold: "Limite de personagens WDv3",
    wdv3CharThresholdTooltip: "Limite de confiança para tags de personagens (padrão: 0.75)",
    wdv3ConfigUpdateError: "Erro ao atualizar configuração WDv3",
    wdv3ForceCpu: "Forçar CPU WDv3",
    wdv3ForceCpuTooltip: "Forçar WDv3 a usar CPU em vez de GPU",
    downloadModel: "Baixar modelo (1.8GB)",
    downloadTags: "Baixar tags (195KB)",
    viewMode: "Modo de visualização",
    gridView: "Visualização em grade",
    listView: "Visualização em lista",
    sortBy: "Ordenar por",
    sortByName: "Ordenar por nome",
    sortByDate: "Ordenar por data",
    sortBySize: "Ordenar por tamanho",
    experimentalFeatures: "Recursos experimentais",
    enableZoom: "Ativar zoom",
    enableZoomTooltip: "Ative o recurso de zoom para imagens",
    enableMinimap: "Ativar minimapa ao dar zoom",
    enableMinimapTooltip: "Mostre o minimapa ao dar zoom em imagens",
    alwaysShowCaptionEditor: "Sempre mostrar editor de legendas",
    alwaysShowCaptionEditorTooltip: "Sempre mostre o editor de legendas na galeria",
    instantDelete: "Ativar exclusão instantânea (pula confirmação)",
    instantDeleteTooltip: "Exclua arquivos instantaneamente sem diálogo de confirmação",
    warning: "Aviso",
    gallery: "Galeria",
    preserveLatents: "Preservar Latents",
    preserveLatentsTooltip: "Mantenha os arquivos .npz (latent) ao mover ou excluir imagens.",
    preserveTxt: "Preservar .txt",
    preserveTxtTooltip: "Mantenha os arquivos .txt ao mover ou excluir imagens.",
    thumbnailSize: "Tamanho das miniaturas",
    thumbnailSizeDescription: "Ajuste o tamanho das miniaturas na visualização em grade",
    thumbnailSizeUpdateError: "Erro ao atualizar tamanho das miniaturas",
  },
  gallery: {
    addTag: "Adicionar tag",
    addCaption: "Adicionar legenda",
    quickJump: "Ir para pasta...",
    loadingFolders: "Carregando pastas...",
    noResults: "Nenhum resultado encontrado",
    pathNotFound: "Caminho não encontrado",
    folderCount: (params?: TranslationParams) => `${params?.count ?? 0} pastas`,
    deleteConfirm: "Tem certeza que deseja excluir esta imagem?",
    deleteSuccess: "Imagem excluída com sucesso",
    deleteError: "Erro ao excluir imagem",
    savingCaption: "Salvando legenda...",
    savedCaption: "Legenda salva",
    errorSavingCaption: "Erro ao salvar legenda",
    emptyFolder: "Esta pasta está vazia",
    dropToUpload: "Solte arquivos aqui para fazer upload",
    uploadProgress: (params?: TranslationParams) => {
      if (!params?.count) return 'Fazendo upload de arquivos...';
      return `Fazendo upload de ${params.count} arquivos...`;
    },
    uploadProgressPercent: (params?: TranslationParams) => `Fazendo upload... ${params?.progress}%`,
    processingImage: "Processando imagem...",
    processingImages: (params?: TranslationParams) => `Processando ${params?.count ?? 0} imagens...`,
    generateTags: "Gerar tags",
    generatingTags: "Gerando tags...",
    removeTags: "Remover tags",
    createCaption: "Criar legenda",
    captionTypes: {
      txt: "Criar novo arquivo de texto",
      tags: "Criar novo arquivo .tags",
      caption: "Criar novo arquivo .caption",
      wd: "Criar novo arquivo .wd"
    },
    noCaptionFiles: "Ainda não há arquivos de legenda!",
    fileCount: (params?: TranslationParams) => `${params?.count ?? 0} arquivos`,
    imageCount: (params?: TranslationParams) => `${params?.count ?? 0} imagens`,
    foundFolders: (params?: TranslationParams) => `${params?.count ?? 0} pastas encontradas`,
    selectedCount: (params?: TranslationParams) => `${params?.count ?? 0} selecionados`,
    selectAll: "Selecionar todos",
    createFolder: "Criar pasta",
    moveToFolder: (params?: TranslationParams) => `Mover para pasta "${params?.name ?? ''}"`,
    deletedCount: (params?: TranslationParams) => `${params?.count ?? 0} itens excluídos`,
    uploadError: "Erro ao fazer upload do arquivo",
    dropOverlay: "Solte os arquivos aqui",
    deselectAll: "Desmarcar todos",
    deleteSelected: "Excluir selecionados",
    confirmMultiDelete: ({ folders = 0, images = 0 }) => {
      if (folders && images) {
        return `Tem certeza que deseja excluir ${folders} pastas e ${images} imagens?`;
      } else if (folders) {
        return `Tem certeza que deseja excluir ${folders} pastas?`;
      }
      return `Tem certeza que deseja excluir ${images} imagens?`;
    },
    confirmFolderDelete: ({ name = "" }) => `Tem certeza que deseja excluir a pasta ${name}?`,
    someFolderDeletesFailed: "Algumas pastas não puderam ser excluídas",
    folderDeleteError: "Erro ao excluir pasta",
    deletingFile: "Excluindo arquivo...",
    fileDeleteSuccess: "Arquivo excluído com sucesso",
    fileDeleteError: "Erro ao excluir arquivo",
    folderLocation: (params?: TranslationParams) => `em ${params?.name ?? ''}`,
    workWithFolder: (params?: TranslationParams) => `Trabalhar com ${params?.name ?? ''}`,
    folderNamePlaceholder: "Nome da pasta",
    deleteConfirmation: "Confirmar exclusão",
    filesExceedLimit: "Limite de arquivos excedido",
    noFilesToUpload: "Nenhum arquivo para upload",
    processingFiles: "Processando arquivos...",
    uploadComplete: "Upload concluído",
    uploadFailed: "Falha no upload",
    deletingFiles: (params?: TranslationParams) => {
      if (!params?.count) return 'Excluindo arquivos...';
      return `Excluindo ${params.count} arquivos...`;
    },
    deleteComplete: "Exclusão concluída",
    deleteFailed: "Falha na exclusão",
    generatingCaption: "Gerando legenda...",
    captionGenerated: "Legenda gerada",
  },
  shortcuts: {
    title: "Atalhos do teclado",
    galleryNavigation: "Navegação da galeria",
    quickFolderSwitch: "Troca rápida de pasta",
    aboveImage: "Imagem acima",
    belowImage: "Imagem abaixo",
    previousImage: "Imagem anterior",
    nextImage: "Próxima imagagem",
    togglePreview: "Alternar pré-visualização",
    tagNavigation: "Navegação de tags",
    previousTag: "Tag anterior",
    nextTag: "Próxima tag",
    switchTagBubble: "Mudar para bolhas de tag",
    switchTagInput: "Mudar para entrada de tag",
    cycleCaptions: "Circular legendas",
    firstTagRow: "Primeira tag da linha",
    lastTagRow: "Última tag da linha",
    doubleShift: "Shift duplo",
    shift: "Shift",
    del: "Del",
    removeTag: "Remover tag",
    other: "Outros",
    esc: "Esc",
    closePreview: "Fechar pré-visualização/modal",
    deleteImage: "Excluir imagem",
    toggleImagePreview: "Alternar pré-visualização da imagem",
    copyToClipboard: "Copiar imagem para área de transferência",
  },
  imageViewer: {
    zoomIn: "Aumentar zoom",
    zoomOut: "Diminuir zoom",
    resetZoom: "Redefinir zoom",
    toggleMinimap: "Alternar minimapa",
    previousImage: "Imagem anterior",
    nextImage: "Próxima imagem",
    copyPath: "Copiar caminho",
    openInNewTab: "Abrir em nova aba",
    fitToScreen: "Ajustar à tela",
    actualSize: "Tamanho real",
    rotateLeft: "Girar para a esquerda",
    rotateRight: "Girar para a direita",
    downloadImage: "Baixar imagem",
    imageInfo: "Informações da imagem",
    dimensions: "Dimensões",
  },
  tools: {
    removeCommas: "Remover vírgulas",
    replaceNewlinesWithCommas: "Substituir quebras de linha por vírgulas",
    replaceUnderscoresWithSpaces: "Substituir sublinhados por espaços",
    transformations: "Transformações",
    addTransformation: "Adicionar transformação",
    transformationType: "Tipo de transformação",
    transformationTypes: {
      searchReplace: "Pesquisar e substituir",
      case: "Transformação de caso",
      trim: "Aparar texto",
      wrap: "Envolver texto",
      number: "Ações numéricas"
    },
    caseTypes: {
      upper: "MAIÚSCULAS",
      lower: "minúsculas",
      title: "Título",
      sentence: "Sentença"
    },
    trimTypes: {
      all: "Todos os espaços",
      start: "Início",
      end: "Fim",
      duplicates: "Duplicados"
    },
    numberActions: {
      remove: "Remover números",
      format: "Formatar números",
      extract: "Extrair números"
    },
    numberFormat: "Formato do número",
    numberFormatPlaceholder: "Digite o formato do número...",
    prefix: "Prefixo",
    suffix: "Sufixo",
    prefixPlaceholder: "Digite o prefixo...",
    suffixPlaceholder: "Digite o sufixo...",
    transformationNamePlaceholder: "Digite o nome da transformação...",
    transformationDescriptionPlaceholder: "Digite a descrição da transformação...",
    searchPattern: "Padrão de pesquisa",
    searchPatternPlaceholder: "Digite o padrão de pesquisa...",
    replacement: "Substituição",
    replacementPlaceholder: "Digite o texto de substituição...",
    selectIcon: "Selecionar ícone"
  },
  notifications: {
    imageCopied: "Imagem copiada para área de transferência",
    imageCopyFailed: "Falha ao copiar imagem para área de transferência",
    folderCreated: "Pasta criada com sucesso",
    folderCreateError: "Erro ao criar pasta",
    generatingCaption: "Gerando legenda...",
    captionGenerated: "Legenda gerada com sucesso",
    connectionLost: "Conexão perdida",
    connectionRestored: "Conexão restaurada"
  },
} as const satisfies Translations;
