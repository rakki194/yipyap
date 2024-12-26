import { createContext, useContext, ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";
import { useAppContext } from "./app";

export type TransformationType = 
  | "searchReplace" 
  | "case" 
  | "trim" 
  | "wrap" 
  | "number";

export interface BaseTransformation {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  isCustom?: boolean;
  type: TransformationType;
}

export interface SearchReplaceTransformation extends BaseTransformation {
  type: "searchReplace";
  pattern: string;
  replacement: string;
}

export interface CaseTransformation extends BaseTransformation {
  type: "case";
  caseType: "upper" | "lower" | "title" | "sentence";
}

export interface TrimTransformation extends BaseTransformation {
  type: "trim";
  trimType: "all" | "start" | "end" | "duplicates";
}

export interface WrapTransformation extends BaseTransformation {
  type: "wrap";
  prefix: string;
  suffix: string;
}

export interface NumberTransformation extends BaseTransformation {
  type: "number";
  numberAction: "remove" | "format" | "extract";
  format?: string;
}

export type Transformation = 
  | SearchReplaceTransformation 
  | CaseTransformation 
  | TrimTransformation 
  | WrapTransformation 
  | NumberTransformation;

interface TransformationsState {
  transformations: Transformation[];
}

interface TransformationsContextValue {
  state: TransformationsState;
  addTransformation: (transformation: Omit<Transformation, "id" | "enabled" | "isCustom">) => void;
  removeTransformation: (id: string) => void;
  toggleTransformation: (id: string) => void;
  applyTransformation: (transformationId: string, text: string) => string;
  applyEnabledTransformations: (text: string) => string;
}

const defaultTransformations: Transformation[] = [
  {
    id: "default_removeCommas",
    name: "tools.removeCommas",
    description: "Remove all commas from text",
    type: "searchReplace",
    pattern: ",",
    replacement: "",
    icon: "sparkle",
    enabled: false,
    isCustom: false,
  },
  {
    id: "default_replaceNewlines",
    name: "tools.replaceNewlinesWithCommas",
    description: "Replace newlines with commas",
    type: "searchReplace",
    pattern: "\n",
    replacement: ", ",
    icon: "textAlign",
    enabled: false,
    isCustom: false,
  },
  {
    id: "default_replaceUnderscores",
    name: "tools.replaceUnderscoresWithSpaces",
    description: "Replace underscores with spaces",
    type: "searchReplace",
    pattern: "_",
    replacement: " ",
    icon: "textAlignDistributed",
    enabled: false,
    isCustom: false,
  },
];

const STORAGE_KEY = "yipyap:transformations";

const applyTransformationToText = (transformation: Transformation, text: string): string => {
  switch (transformation.type) {
    case "searchReplace":
      return text.replace(new RegExp(transformation.pattern, "g"), transformation.replacement);
    
    case "case":
      switch (transformation.caseType) {
        case "upper":
          return text.toUpperCase();
        case "lower":
          return text.toLowerCase();
        case "title":
          return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        case "sentence":
          return text.replace(/(^\w|\.\s+\w)/g, letter => letter.toUpperCase());
      }
      break;

    case "trim":
      switch (transformation.trimType) {
        case "all":
          return text.trim();
        case "start":
          return text.trimStart();
        case "end":
          return text.trimEnd();
        case "duplicates":
          return text.replace(/\s+/g, " ");
      }
      break;

    case "wrap":
      return `${transformation.prefix}${text}${transformation.suffix}`;

    case "number":
      switch (transformation.numberAction) {
        case "remove":
          return text.replace(/\d+/g, "");
        case "format":
          if (transformation.format) {
            return text.replace(/\d+/g, (num) => {
              try {
                return new Intl.NumberFormat(undefined, {
                  minimumIntegerDigits: parseInt(transformation.format || "1"),
                }).format(parseInt(num));
              } catch {
                return num;
              }
            });
          }
          return text;
        case "extract":
          const numbers = text.match(/\d+/g);
          return numbers ? numbers.join(" ") : text;
      }
      break;
  }
  return text;
};

const loadTransformations = (): Transformation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultTransformations;

    const storedTransformations = JSON.parse(stored) as Transformation[];
    
    // Merge stored transformations with defaults, preserving enabled states
    return defaultTransformations.map(defaultTransform => {
      const storedTransform = storedTransformations.find(t => t.id === defaultTransform.id);
      return storedTransform ? { ...defaultTransform, enabled: storedTransform.enabled } : defaultTransform;
    }).concat(storedTransformations.filter(t => t.isCustom));
  } catch {
    return defaultTransformations;
  }
};

const saveTransformations = (transformations: Transformation[]) => {
  // Save both custom transformations and enabled states of default transformations
  const toStore = [
    ...transformations.filter(t => t.isCustom),
    ...transformations.filter(t => !t.isCustom).map(t => ({ 
      id: t.id, 
      enabled: t.enabled 
    }))
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
};

const TransformationsContext = createContext<TransformationsContextValue>();

export const TransformationsProvider: ParentComponent = (props) => {
  const { t } = useAppContext();
  const initialTransformations = loadTransformations();

  const [state, setState] = createStore<TransformationsState>({
    transformations: initialTransformations,
  });

  const addTransformation = (transformation: Omit<Transformation, "id" | "enabled" | "isCustom">) => {
    const id = `custom_${Math.random().toString(36).substring(7)}`;
    setState("transformations", (prev) => {
      const newTransformation = { 
        ...transformation, 
        id, 
        enabled: false, 
        isCustom: true 
      } as Transformation;
      const newTransformations = [...prev, newTransformation];
      saveTransformations(newTransformations);
      return newTransformations;
    });
  };

  const removeTransformation = (id: string) => {
    setState("transformations", (prev) => {
      const newTransformations = prev.filter((t) => t.id !== id);
      saveTransformations(newTransformations);
      return newTransformations;
    });
  };

  const toggleTransformation = (id: string) => {
    setState("transformations", (prev) => {
      const newTransformations = prev.map((t) => 
        t.id === id ? { ...t, enabled: !t.enabled } : t
      );
      saveTransformations(newTransformations);
      return newTransformations;
    });
  };

  const applyTransformation = (transformationId: string, text: string) => {
    const transformation = state.transformations.find((t) => t.id === transformationId);
    if (!transformation) return text;
    return applyTransformationToText(transformation, text);
  };

  const applyEnabledTransformations = (text: string) => {
    return state.transformations.reduce((result, transformation) => {
      if (transformation.enabled) {
        return applyTransformationToText(transformation, result);
      }
      return result;
    }, text);
  };

  const value: TransformationsContextValue = {
    state,
    addTransformation,
    removeTransformation,
    toggleTransformation,
    applyTransformation,
    applyEnabledTransformations,
  };

  return (
    <TransformationsContext.Provider value={value}>
      {props.children}
    </TransformationsContext.Provider>
  );
};

export const useTransformations = () => {
  const context = useContext(TransformationsContext);
  if (!context) {
    throw new Error("useTransformations must be used within a TransformationsProvider");
  }
  return context;
}; 