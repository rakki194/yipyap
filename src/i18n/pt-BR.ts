import { getPathSeparator } from "~/i18n";

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
    layoutOptions: "Opções de layout",
    disableAnimations: "Desativar animações",
    language: "Idioma",
    disableJapanese: "Desativar texto japonês",
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
  },
  gallery: {
    addTag: "Adicionar tag...",
    addCaption: "Adicionar legenda...",
    quickJump: "Ir para pasta...",
    loadingFolders: "Carregando pastas...",
    noResults: "Nenhum resultado encontrado",
    folderCount: "{count} pastas",
    deleteConfirm: "Tem certeza que deseja excluir esta imagem?",
    deleteSuccess: "Imagem excluída com sucesso",
    deleteError: "Erro ao excluir imagem",
    savingCaption: "Salvando legenda...",
    savedCaption: "Legenda salva",
    errorSavingCaption: "Erro ao salvar legenda",
    emptyFolder: "Esta pasta está vazia",
    dropToUpload: "Solte arquivos aqui para fazer upload",
    uploadProgress: "Fazendo upload de {count} arquivos...",
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
  },
  shortcuts: {
    title: "Atalhos do teclado",
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
}; 