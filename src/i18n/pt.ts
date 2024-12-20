import { getPathSeparator } from "~/i18n";
import { getPortuguesePlural } from "./utils";
import type { Translations, TranslationParams } from "./types";

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
    pathSeparator: getPathSeparator("pt"),
    toggleTheme: "Alternar tema",
    theme: "Tema",
    returnToFrontPage: "Voltar à página inicial",
    home: "Início",
    openSettings: "Abrir configurações",
    create: "Criar",
    creating: "Criando...",
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
    },
    disableAnimations: "Desativar animações",
    language: "Idioma",
    disableNonsense: "Desativar texto japonês",
    modelSettings: "Configurações do modelo",
    jtp2ModelPath: "Caminho do modelo JTP2",
    jtp2TagsPath: "Caminho das tags JTP2",
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
    enableMinimap: "Ativar minimapa ao dar zoom",
    instantDelete: "Ativar exclusão instantânea (pula confirmação)",
    warning: "Aviso",
    gallery: "Galeria",
    preserveLatents: "Preservar Latents",
    preserveLatentsTooltip: "Mantenha os arquivos .npz (latent) ao excluir imagens.",
    preserveTxt: "Preservar .txt",
    preserveTxtTooltip: "Mantenha os arquivos .txt ao excluir imagens.",
    thumbnailSize: "Tamanho das miniaturas",
    thumbnailSizeDescription: "Ajuste o tamanho das miniaturas na visualização em grade",
    thumbnailSizeUpdateError: "Erro ao atualizar o tamanho das miniaturas",
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
    imageWork: "Trabalhar com imagens",
    audioWork: "Trabalhar com áudio",
    deselectAll: "Desmarcar todos",
    deleteSelected: "Excluir selecionados",
  },
  gallery: {
    addTag: "Adicionar tag...",
    addCaption: "Adicionar legenda...",
    quickJump: "Ir para pasta...",
    loadingFolders: "Carregando pastas...",
    noResults: "Nenhum resultado encontrado",
    folderCount: (params?: TranslationParams) => {
      const count = params?.count ?? 0;
      return getPortuguesePlural(count, {
        singular: "pasta",
        plural: "pastas"
      });
    },
    deleteConfirm: "Tem certeza que deseja excluir esta imagem?",
    deleteSuccess: "Imagem excluída com sucesso",
    deleteError: "Erro ao excluir imagem",
    savingCaption: "Salvando legenda...",
    savedCaption: "Legenda salva",
    errorSavingCaption: "Erro ao salvar legenda",
    emptyFolder: "Esta pasta está vazia",
    dropToUpload: "Solte arquivos aqui para fazer upload",
    uploadProgress: (params?: TranslationParams) => {
      if (!params?.count) return 'A carregar ficheiros...';
      return `A carregar ${params.count} ficheiros...`;
    },
    processingImage: "Processando imagem...",
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
    fileCount: (params?: TranslationParams) => {
      const count = params?.count ?? 0;
      return getPortuguesePlural(count, {
        singular: "arquivo",
        plural: "arquivos"
      });
    },
    imageCount: (params?: TranslationParams) => {
      const count = params?.count ?? 0;
      return getPortuguesePlural(count, {
        singular: "imagem",
        plural: "imagens"
      });
    },
    foundFolders: (params?: TranslationParams) => `${params?.count ?? 0} pastas encontradas`,
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
    processingImages: (params?: TranslationParams) => `Processando ${params?.count ?? 0} imagens...`,
    selectedCount: (params?: TranslationParams) => {
      const count = params?.count ?? 0;
      return getPortuguesePlural(count, {
        singular: "item selecionado",
        plural: "itens selecionados"
      });
    },
  },
  shortcuts: {
    title: "Atalhos de teclado",
    galleryNavigation: "Navegação da galeria",
    quickFolderSwitch: "Troca rápida de pasta",
    aboveImage: "Imagem acima",
    belowImage: "Imagem abaixo",
    previousImage: "Imagem anterior",
    nextImage: "Próxima imagem",
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
  },
  notifications: {
    imageCopied: "Imagem copiada para área de transferência",
    imageCopyFailed: "Falha ao copiar imagem para área de transferência",
    folderCreated: "Pasta criada com sucesso",
    folderCreateError: "Erro ao criar pasta"
  },
} as const satisfies Translations;
