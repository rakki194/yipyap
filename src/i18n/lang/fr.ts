import { getPathSeparator } from "~/i18n";
import type { Translations, TranslationParams } from "../types";
import { createPluralTranslation } from "../plurals";

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
    language: "Langue",
    description: "Une application de visualisation et de gestion d'images",
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
      "high-contrast-black": "Contraste élevé (noir)",
      "high-contrast-inverse": "Contraste élevé (inversé)",
    },
    disableAnimations: "Désactiver les animations",
    disableAnimationsTooltip: "Désactiver toutes les animations pour de meilleures performances",
    language: "Langue",
    languageTooltip: "Changer la langue de l'interface",
    disableNonsense: "Désactiver le texte japonais",
    disableNonsenseTooltip: "Masquer le texte japonais et autres éléments sans sens",
    modelSettings: (params: TranslationParams) => "Paramètres du modèle",
    jtp2ModelPath: "Chemin du modèle JTP2",
    jtp2ModelPathTooltip: "Chemin vers le fichier du modèle JTP2",
    jtp2TagsPath: "Chemin des tags JTP2",
    jtp2TagsPathTooltip: "Chemin vers le fichier des tags JTP2",
    jtp2Threshold: "Seuil des tags JTP2",
    jtp2ThresholdTooltip: "Seuil de confiance pour inclure les tags (0.0 à 1.0)",
    jtp2ForceCpu: "Forcer le CPU pour JTP2",
    jtp2ForceCpuTooltip: "Forcer JTP2 à utiliser le CPU au lieu du GPU",
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
    enableZoomTooltip: "Activer le zoom et le déplacement dans la visionneuse d'images",
    enableMinimap: "Activer la minimap",
    enableMinimapTooltip: "Afficher la minimap lors du zoom pour une navigation plus facile",
    alwaysShowCaptionEditor: "Toujours afficher l'éditeur de légende",
    alwaysShowCaptionEditorTooltip: "Garder l'éditeur de légende toujours déplié",
    instantDelete: "Suppression instantanée",
    instantDeleteTooltip: "Supprimer les fichiers sans dialogue de confirmation",
    warning: "Avertissement",
    gallery: "Galerie",
    preserveLatents: "Conserver les latents",
    preserveLatentsTooltip: "Conserver les variables latentes de génération d'images pour une réutilisation ultérieure",
    preserveTxt: "Conserver les fichiers TXT",
    preserveTxtTooltip: "Conserver les fichiers TXT contenant les paramètres de génération",
    thumbnailSize: "Taille des vignettes",
    thumbnailSizeDescription: "Taille des vignettes en pixels (ex: 250)",
    thumbnailSizeUpdateError: "Erreur lors de la mise à jour de la taille des vignettes",
    wdv3ModelName: "Modèle WDv3",
    wdv3ModelNameTooltip: "Sélectionner l'architecture du modèle WDv3 (ViT, SwinV2, ou ConvNext)",
    wdv3GenThreshold: "Seuil des tags généraux",
    wdv3GenThresholdTooltip: "Seuil de confiance pour les tags généraux (0.35 par défaut)",
    wdv3CharThreshold: "Seuil des tags de personnages",
    wdv3CharThresholdTooltip: "Seuil de confiance pour les tags de personnages (0.75 par défaut)",
    wdv3ConfigUpdateError: "Échec de la mise à jour des paramètres WDv3",
    wdv3ForceCpu: "Forcer le CPU pour WDv3",
    wdv3ForceCpuTooltip: "Forcer WDv3 à utiliser le CPU au lieu du GPU",
  },
  tools: {
    removeCommas: "Supprimer les virgules",
    replaceNewlinesWithCommas: "Remplacer les sauts de ligne par des virgules",
    replaceUnderscoresWithSpaces: "Remplacer les tirets bas par des espaces",
    transformations: "Transformations",
    transformationType: "Type de transformation",
    transformationTypes: {
      searchReplace: "Rechercher et remplacer",
      case: "Casse",
      trim: "Supprimer les espaces",
      wrap: "Entourer",
      number: "Numéro"
    },
    caseTypes: {
      upper: "MAJUSCULES",
      lower: "minuscules",
      title: "Titre",
      sentence: "Phrase"
    },
    trimTypes: {
      all: "Tout",
      start: "Début",
      end: "Fin",
      duplicates: "Doublons"
    },
    numberActions: {
      remove: "Supprimer",
      format: "Formater",
      extract: "Extraire"
    },
    numberFormat: "Format du numéro",
    numberFormatPlaceholder: "Ex: 001, 01, 1",
    prefix: "Préfixe",
    suffix: "Suffixe",
    prefixPlaceholder: "Entrer un préfixe",
    suffixPlaceholder: "Entrer un suffixe",
    transformationNamePlaceholder: "Nom de la transformation",
    transformationDescriptionPlaceholder: "Description de la transformation",
    searchPattern: "Motif de recherche",
    searchPatternPlaceholder: "Entrer un motif de recherche",
    replacement: "Remplacement",
    replacementPlaceholder: "Entrer un texte de remplacement",
    selectIcon: "Sélectionner une icône",
    addTransformation: "Ajouter une transformation"
  },
  gallery: {
    addTag: "Ajouter un tag",
    addCaption: "Ajouter une légende",
    quickJump: "Saut rapide",
    loadingFolders: "Chargement des dossiers...",
    pathNotFound: "Chemin introuvable",
    uploadFiles: "Télécharger des fichiers",
    deleteCurrentFolder: "Supprimer le dossier actuel",
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
