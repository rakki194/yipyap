import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "./types";
import { createPluralTranslation } from "./plurals";

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
    create: "Créer",
    creating: "Création...",
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
    disableAnimations: "Désactiver les animations",
    language: "Langue",
    disableNonsense: "Désactiver le nonsense",
    modelSettings: (params: TranslationParams) => "Paramètres du modèle",
    jtp2ModelPath: "Chemin du modèle JTP2",
    jtp2TagsPath: "Chemin des tags JTP2",
    downloadModel: "Télécharger le modèle",
    downloadTags: "Télécharger les tags",
    viewMode: "Mode d'affichage",
    gridView: "Vue en grille",
    listView: "Vue en liste",
    sortBy: "Trier par",
    sortByName: "Trier par nom",
    sortByDate: "Trier par date",
    sortBySize: "Trier par taille",
    experimentalFeatures: "Fonctionnalités expérimentales",
    enableZoom: "Activer le zoom",
    enableMinimap: "Activer la minimap",
    alwaysShowCaptionEditor: "Toujours afficher l'éditeur de légende",
    instantDelete: "Suppression instantanée",
    warning: "Avertissement",
    gallery: "Galerie",
    preserveLatents: "Préserver les latents",
    preserveLatentsTooltip: "Préserver les latents lors du déplacement des fichiers",
    preserveTxt: "Préserver les txt",
    preserveTxtTooltip: "Préserver les fichiers txt lors du déplacement des fichiers",
    thumbnailSize: "Taille des vignettes",
    thumbnailSizeDescription: "La taille des vignettes dans la galerie",
    thumbnailSizeUpdateError: "Échec de la mise à jour de la taille des vignettes",
  },
  tools: {
    removeCommas: "Supprimer les virgules",
    replaceNewlinesWithCommas: "Remplacer les sauts de ligne par des virgules",
    replaceUnderscoresWithSpaces: "Remplacer les tirets bas par des espaces",
  },
  frontPage: {
    subtitle: {
      1: "Un visualiseur d'images simple",
      2: "Avec un accent sur la simplicité",
      3: "Et une touche de magie",
      4: "Pour votre plaisir visuel",
      5: "Et votre tranquillité d'esprit",
      6: "Avec une pincée de fantaisie",
      7: "Et un soupçon de joie",
      8: "Juste pour vous",
    },
    imageWork: "Travail d'image",
    audioWork: "Travail audio",
    deselectAll: "Tout désélectionner",
    deleteSelected: "Supprimer la sélection",
  },
  gallery: {
    addTag: "Ajouter un tag",
    addCaption: "Ajouter une légende",
    quickJump: "Saut rapide",
    loadingFolders: "Chargement des dossiers...",
    noResults: "Aucun résultat",
    folderCount: createPluralTranslation({
      one: "1 dossier",
      other: "${count} dossiers"
    }, "fr"),
    fileCount: createPluralTranslation({
      one: "1 fichier",
      other: "${count} fichiers"
    }, "fr"),
    imageCount: createPluralTranslation({
      one: "1 image",
      other: "${count} images"
    }, "fr"),
    foundFolders: createPluralTranslation({
      one: "1 dossier trouvé",
      other: "${count} dossiers trouvés"
    }, "fr"),
    deletedCount: createPluralTranslation({
      one: "1 élément supprimé",
      other: "${count} éléments supprimés"
    }, "fr"),
    deleteConfirm: (params: TranslationParams) => {
      const name = params.name ?? "cet élément";
      return `Êtes-vous sûr de vouloir supprimer "${name}" ?`;
    },
    deleteSuccess: "Suppression réussie",
    deleteError: (params: TranslationParams) => {
      const name = params.name ?? "élément";
      return `Échec de la suppression de "${name}"`;
    },
    savingCaption: (params: TranslationParams) => {
      const name = params.name ?? "élément";
      return `Enregistrement de la légende pour "${name}"...`;
    },
    savedCaption: "Légende enregistrée",
    errorSavingCaption: (params: TranslationParams) => {
      const name = params.name ?? "élément";
      return `Échec de l'enregistrement de la légende pour "${name}"`;
    },
    emptyFolder: "Ce dossier est vide",
    dropToUpload: "Déposez les fichiers ici pour les télécharger",
    uploadProgress: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Téléchargement des fichiers...';
      }
      return createPluralTranslation({
        one: "Téléchargement d'1 fichier...",
        other: "Téléchargement de ${count} fichiers..."
      }, "fr")(params);
    },
    uploadProgressPercent: "Téléchargement... {progress}%",
    filesExceedLimit: "Fichiers trop volumineux : {files}",
    noFilesToUpload: "Aucun fichier à télécharger",
    processingFiles: "Traitement des fichiers...",
    uploadComplete: "Téléchargement terminé",
    uploadFailed: "Échec du téléchargement : {error}",
    deletingFiles: (params: TranslationParams) => {
      if (!params || typeof params.count !== 'number') {
        return 'Suppression des fichiers...';
      }
      return createPluralTranslation({
        one: "Suppression d'1 fichier...",
        other: "Suppression de ${count} fichiers..."
      }, "fr")(params);
    },
    deleteComplete: "Suppression terminée",
    deleteFailed: "Échec de la suppression",
    processingImage: (params: TranslationParams) => {
      const name = params.name ?? "image";
      return `Traitement de l'image "${name}"...`;
    },
    processingImages: createPluralTranslation({
      one: "Traitement d'1 image...",
      other: "Traitement de ${count} images..."
    }, "fr"),
    generatingCaption: "Génération de la légende...",
    captionGenerated: "Légende générée",
    generateTags: "Générer les tags",
    generatingTags: "Génération des tags...",
    removeTags: "Supprimer les tags",
    createCaption: "Créer une légende",
    captionTypes: {
      txt: "Txt",
      tags: "Tags",
      caption: "Légende",
      wd: "WD",
    },
    noCaptionFiles: "Aucun fichier de légende",
    uploadError: "Erreur de téléchargement",
    dropOverlay: "Relâchez pour télécharger",
    selectAll: "Tout sélectionner",
    deselectAll: "Tout désélectionner",
    deleteSelected: "Supprimer la sélection",
    confirmMultiDelete: (params: TranslationParams | null | undefined = {}) => {
      if (!params || typeof params !== 'object') {
        return 'Êtes-vous sûr de vouloir supprimer ces éléments ?';
      }
      const folders = typeof params.folders === 'number' ? params.folders : 0;
      const images = typeof params.images === 'number' ? params.images : 0;
      
      if (folders === 0 && images === 0) {
        return 'Êtes-vous sûr de vouloir supprimer ces éléments ?';
      }

      const parts = [];
      if (folders > 0) {
        parts.push(createPluralTranslation({
          one: "1 dossier",
          other: "${count} dossiers"
        }, "fr")({ count: folders }));
      }
      if (images > 0) {
        parts.push(createPluralTranslation({
          one: "1 image",
          other: "${count} images"
        }, "fr")({ count: images }));
      }
      return `Êtes-vous sûr de vouloir supprimer ${parts.join(" et ")} ?`;
    },
    confirmFolderDelete: (params: TranslationParams) => {
      const name = params.name ?? "dossier";
      return `Êtes-vous sûr de vouloir supprimer le dossier "${name}" et tout son contenu ?`;
    },
    someFolderDeletesFailed: "Certains dossiers n'ont pas pu être supprimés",
    folderDeleteError: "Échec de la suppression d'un ou plusieurs dossiers",
    deletingFile: "Suppression du fichier...",
    fileDeleteSuccess: "Fichier supprimé avec succès",
    fileDeleteError: "Échec de la suppression d'un ou plusieurs fichiers",
    createFolder: "Créer un dossier",
    folderNamePlaceholder: "Nom du dossier",
    deleteConfirmation: "Confirmation de suppression",
    selectedCount: createPluralTranslation({
      one: "1 élément sélectionné",
      other: "${count} éléments sélectionnés"
    }, "fr"),
    folderLocation: (params: TranslationParams) => {
      const name = params.name ?? "";
      return `Emplacement : ${name}`;
    },
    moveToFolder: (params: TranslationParams) => {
      const name = params.name ?? "dossier";
      return `Déplacer vers "${name}"`;
    },
    workWithFolder: (params: TranslationParams) => {
      const name = params.name ?? "dossier";
      return `Travailler avec "${name}"`;
    },
  },
  shortcuts: {
    title: "Raccourcis",
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
    switchTagBubble: "Basculer la bulle de tag",
    switchTagInput: "Basculer l'entrée de tag",
    cycleCaptions: "Faire défiler les légendes",
    firstTagRow: "Première ligne de tags",
    lastTagRow: "Dernière ligne de tags",
    doubleShift: "Double Shift",
    shift: "Shift",
    del: "Suppr",
    removeTag: "Supprimer le tag",
    other: "Autre",
    esc: "Échap",
    closePreview: "Fermer l'aperçu",
    deleteImage: "Supprimer l'image",
    toggleImagePreview: "Basculer l'aperçu de l'image",
    copyToClipboard: "Copier dans le presse-papiers",
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
  notifications: {
    imageCopied: "Image copiée",
    imageCopyFailed: "Échec de la copie de l'image",
    folderCreated: "Dossier créé",
    folderCreateError: "Erreur lors de la création du dossier",
    generatingCaption: "Génération de la légende...",
    captionGenerated: "Légende générée",
    connectionLost: "Connexion perdue",
    connectionRestored: "Connexion rétablie",
  },
} as const satisfies Translations;
