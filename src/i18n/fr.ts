import { getPathSeparator } from "~/i18n";

export default {
  common: {
    close: "Fermer",
    delete: "Supprimer",
    cancel: "Annuler",
    save: "Enregistrer",
    edit: "Modifier",
    add: "Ajouter",
    remove: "Retirer",
    loading: "Chargement...",
    error: "Erreur",
    success: "Succès",
    confirm: "Confirmer",
    download: "Télécharger",
    path: "Chemin",
    size: "Taille",
    date: "Date",
    name: "Nom",
    type: "Type",
    actions: "Actions",
    search: "Rechercher...",
    filter: "Filtrer",
    apply: "Appliquer",
    reset: "Réinitialiser",
    selected: "Sélectionné",
    all: "Tout",
    none: "Aucun",
    pathSeparator: getPathSeparator("fr"),
    toggleTheme: "Changer de thème",
    theme: "Thème",
    returnToFrontPage: "Retour à la page d'accueil",
    home: "Accueil",
    openSettings: "Ouvrir les paramètres",
  },
  settings: {
    title: "Paramètres",
    appearance: "Apparence",
    theme: {
      light: "Clair",
      gray: "Gris",
      dark: "Sombre",
      banana: "Banane",
      strawberry: "Fraise",
      peanut: "Cacahuète",
      christmas: "Noël",
      halloween: "Halloween",
    },
    layoutOptions: "Options de mise en page",
    disableAnimations: "Désactiver les animations",
    language: "Langue",
    disableJapanese: "Désactiver le texte japonais",
    modelSettings: "Paramètres du modèle",
    jtp2ModelPath: "Chemin du modèle JTP2",
    jtp2TagsPath: "Chemin des tags JTP2",
    downloadModel: "Télécharger le modèle (1.8GB)",
    downloadTags: "Télécharger les tags (195KB)",
    viewMode: "Mode d'affichage",
    gridView: "Vue en grille",
    listView: "Vue en liste",
    sortBy: "Trier par",
    sortByName: "Trier par nom",
    sortByDate: "Trier par date",
    sortBySize: "Trier par taille",
    experimentalFeatures: "Fonctionnalités expérimentales",
    enableZoom: "Activer le zoom d'image",
    enableMinimap: "Activer la minimap en zoom",
    instantDelete: "Activer la suppression instantanée",
    warning: "Avertissement",
    gallery: "Galerie",
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
    imageWork: "Travailler avec les images",
    audioWork: "Travailler avec l'audio",
  },
  gallery: {
    addTag: "Ajouter un tag...",
    addCaption: "Ajouter une légende...",
    quickJump: "Aller au dossier...",
    loadingFolders: "Chargement des dossiers...",
    noResults: "Aucun résultat trouvé",
    folderCount: "{count} dossiers",
    deleteConfirm: "Voulez-vous vraiment supprimer cette image ?",
    deleteSuccess: "Image supprimée avec succès",
    deleteError: "Erreur lors de la suppression",
    savingCaption: "Enregistrement de la légende...",
    savedCaption: "Légende enregistrée",
    errorSavingCaption: "Erreur lors de l'enregistrement de la légende",
    emptyFolder: "Ce dossier est vide",
    dropToUpload: "Déposez les fichiers ici pour télécharger",
    uploadProgress: "Téléchargement de {count} fichiers...",
    processingImage: "Traitement de l'image...",
    generateTags: "Générer les tags",
    generatingTags: "Génération des tags...",
    removeTags: "Supprimer les tags",
    createCaption: "Créer une légende",
    captionTypes: {
      txt: "Créer un nouveau fichier texte",
      tags: "Créer un nouveau fichier .tags",
      caption: "Créer un nouveau fichier .caption",
      wd: "Créer un nouveau fichier .wd"
    },
  },
  shortcuts: {
    title: "Raccourcis clavier",
    galleryNavigation: "Navigation dans la galerie",
    quickFolderSwitch: "Changement rapide de dossier",
    aboveImage: "Image au-dessus",
    belowImage: "Image en-dessous",
    previousImage: "Image précédente",
    nextImage: "Image suivante",
    togglePreview: "Basculer l'aperçu",
    tagNavigation: "Navigation des tags",
    previousTag: "Tag précédent",
    nextTag: "Tag suivant",
    switchTagBubble: "Passer à l'édition des bulles de tags",
    switchTagInput: "Passer à la saisie de tags",
    cycleCaptions: "Parcourir les légendes",
    firstTagRow: "Premier tag de la ligne",
    lastTagRow: "Dernier tag de la ligne",
    doubleShift: "Double Maj",
    shift: "Maj",
    del: "Suppr",
    removeTag: "Supprimer le tag",
    other: "Autre",
    esc: "Échap",
    closePreview: "Fermer l'aperçu/modal",
    deleteImage: "Supprimer l'image",
    toggleImagePreview: "Basculer l'aperçu",
  },
  imageViewer: {
    zoomIn: "Zoom avant",
    zoomOut: "Zoom arrière",
    resetZoom: "Réinitialiser le zoom",
    toggleMinimap: "Basculer la minimap",
    previousImage: "Image précédente",
    nextImage: "Image suivante",
    copyPath: "Copier le chemin",
    openInNewTab: "Ouvrir dans un nouvel onglet",
    fitToScreen: "Ajuster à l'écran",
    actualSize: "Taille réelle",
    rotateLeft: "Rotation à gauche",
    rotateRight: "Rotation à droite",
    downloadImage: "Télécharger l'image",
    imageInfo: "Informations sur l'image",
    dimensions: "Dimensions",
  },
};
