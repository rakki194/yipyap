/**
 * Text Transformation System
 * 
 * This module provides a comprehensive system for managing and applying text transformations
 * in the application. It includes a context provider and hooks for handling various types
 * of text transformations like search/replace, case changes, trimming, wrapping, and number
 * formatting.
 * 
 * The system supports both built-in default transformations and custom user-defined
 * transformations. All transformations are persisted in localStorage and can be
 * enabled/disabled individually.
 * 
 * @example
 * ```tsx
 * // Wrap your application with the provider
 * const App = () => (
 *   <TransformationsProvider>
 *     <YourComponents />
 *   </TransformationsProvider>
 * );
 * 
 * // Use transformations in your components
 * const TextEditor = () => {
 *   const { 
 *     state, 
 *     addTransformation, 
 *     toggleTransformation, 
 *     applyEnabledTransformations 
 *   } = useTransformations();
 * 
 *   // Add a custom transformation
 *   const addCustomReplace = () => {
 *     addTransformation({
 *       name: "Replace Dashes",
 *       description: "Replace dashes with spaces",
 *       type: "searchReplace",
 *       pattern: "-",
 *       replacement: " ",
 *       icon: "textAlign"
 *     });
 *   };
 * 
 *   // Apply transformations to text
 *   const processText = (text: string) => {
 *     return applyEnabledTransformations(text);
 *   };
 * 
 *   return (
 *     <div>
 *       <button onClick={addCustomReplace}>Add Custom Transform</button>
 *       {state.transformations.map(transform => (
 *         <label key={transform.id}>
 *           <input
 *             type="checkbox"
 *             checked={transform.enabled}
 *             onChange={() => toggleTransformation(transform.id)}
 *           />
 *           {transform.name}
 *         </label>
 *       ))}
 *       <textarea 
 *         onChange={e => processText(e.target.value)}
 *       />
 *     </div>
 *   );
 * };
 * ```
 * 
 * @module TransformationSystem
 * @description
 * The system provides a rich set of transformation capabilities including search/replace operations,
 * case modifications, text trimming, content wrapping, and number formatting. All transformations
 * are automatically persisted to storage, maintaining state between sessions, and the system fully
 * supports custom user-defined transformations alongside the built-in ones.
 *
 * Multiple transformations can be applied in batch operations for efficient text processing, with
 * the entire system being built on type-safe definitions to ensure reliability and maintainability.
 * This comprehensive approach allows for flexible and powerful text manipulation while maintaining
 * strict type safety throughout the codebase.
 */

import { createContext, useContext, ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";
import { useAppContext } from "./app";

/**
 * Defines the available types of transformations supported by the system.
 * Each type corresponds to a specific kind of text transformation operation.
 */
export type TransformationType = 
  | "searchReplace" 
  | "case" 
  | "trim" 
  | "wrap" 
  | "number";

/**
 * Base interface for all transformation types. Contains common properties that
 * every transformation must implement.
 * 
 * @property id - Unique identifier for the transformation
 * @property name - Display name of the transformation
 * @property description - Detailed description of what the transformation does
 * @property icon - Icon identifier for UI representation
 * @property enabled - Whether the transformation is currently active
 * @property isCustom - Whether this is a user-defined transformation
 * @property type - The specific type of transformation
 */
export interface BaseTransformation {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  isCustom?: boolean;
  type: TransformationType;
}

/**
 * Search and replace transformation that replaces all occurrences of a pattern
 * with a specified replacement text.
 * 
 * @property pattern - The text or regex pattern to search for
 * @property replacement - The text to replace matches with
 */
export interface SearchReplaceTransformation extends BaseTransformation {
  type: "searchReplace";
  pattern: string;
  replacement: string;
}

/**
 * Case transformation that modifies the letter casing of text.
 * 
 * @property caseType - The type of case transformation to apply:
 *   - upper: Convert to uppercase
 *   - lower: Convert to lowercase
 *   - title: Capitalize first letter of each word
 *   - sentence: Capitalize first letter of sentences
 */
export interface CaseTransformation extends BaseTransformation {
  type: "case";
  caseType: "upper" | "lower" | "title" | "sentence";
}

/**
 * Trim transformation that removes whitespace from text.
 * 
 * @property trimType - The type of trimming to apply:
 *   - all: Trim both ends
 *   - start: Trim start only
 *   - end: Trim end only
 *   - duplicates: Remove duplicate whitespace
 */
export interface TrimTransformation extends BaseTransformation {
  type: "trim";
  trimType: "all" | "start" | "end" | "duplicates";
}

/**
 * Wrap transformation that adds prefix and suffix text.
 * 
 * @property prefix - Text to add before the content
 * @property suffix - Text to add after the content
 */
export interface WrapTransformation extends BaseTransformation {
  type: "wrap";
  prefix: string;
  suffix: string;
}

/**
 * Number transformation that handles numeric content in text.
 * 
 * @property numberAction - The type of number operation:
 *   - remove: Remove all numbers
 *   - format: Format numbers according to pattern
 *   - extract: Extract only the numbers
 * @property format - Optional format pattern for number formatting
 */
export interface NumberTransformation extends BaseTransformation {
  type: "number";
  numberAction: "remove" | "format" | "extract";
  format?: string;
}

/**
 * Union type of all possible transformation types.
 * Used for type-safe handling of transformations throughout the system.
 */
export type Transformation = 
  | SearchReplaceTransformation 
  | CaseTransformation 
  | TrimTransformation 
  | WrapTransformation 
  | NumberTransformation;

/**
 * State interface for the transformations context.
 * Contains the list of all available transformations.
 */
interface TransformationsState {
  transformations: Transformation[];
}

/**
 * Context value interface that defines the shape of the transformations context.
 * Provides access to transformation state and methods for managing transformations.
 * 
 * @property state - Current state of transformations
 * @property addTransformation - Add a new transformation
 * @property removeTransformation - Remove an existing transformation
 * @property toggleTransformation - Toggle a transformation's enabled state
 * @property applyTransformation - Apply a single transformation
 * @property applyEnabledTransformations - Apply all enabled transformations
 * @property updateTransformation - Update an existing transformation
 */
interface TransformationsContextValue {
  state: TransformationsState;
  addTransformation: (transformation: Omit<Transformation, "id" | "enabled" | "isCustom">) => void;
  removeTransformation: (id: string) => void;
  toggleTransformation: (id: string) => void;
  applyTransformation: (transformationId: string, text: string) => string;
  applyEnabledTransformations: (text: string) => string;
  updateTransformation: (id: string, transformation: Omit<Transformation, "id" | "enabled" | "isCustom">) => void;
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

/**
 * Applies a single transformation to the given text based on the transformation type
 * and its specific configuration.
 * 
 * @param transformation - The transformation to apply
 * @param text - The input text to transform
 * @returns The transformed text
 */
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
          // Split into sentences and process each one
          return text.split(/(?<=[.!?]\s+)/).map(sentence => {
            const lowered = sentence.toLowerCase();
            return lowered.charAt(0).toUpperCase() + lowered.slice(1);
          }).join('');
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

/**
 * Loads transformations from localStorage, merging them with default transformations
 * while preserving enabled states. Creates a fresh set of default transformations if
 * no stored transformations exist.
 * 
 * @returns An array of transformations combining defaults and stored custom transformations
 */
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

/**
 * Persists transformations to localStorage. Saves both custom transformations and
 * the enabled states of default transformations.
 * 
 * @param transformations - The array of transformations to save
 */
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

/**
 * Provider component that manages the transformation system state and operations.
 * Initializes with default transformations and provides methods for managing and
 * applying transformations through context.
 * 
 * @param props - Component props including children
 */
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

  const updateTransformation = (id: string, transformation: Omit<Transformation, "id" | "enabled" | "isCustom">) => {
    setState("transformations", (prev) => {
      const existingTransform = prev.find((t) => t.id === id);
      if (!existingTransform || !existingTransform.isCustom) return prev;

      const newTransformations = prev.map((t) => 
        t.id === id ? { 
          ...transformation, 
          id, 
          enabled: existingTransform.enabled, 
          isCustom: true 
        } as Transformation : t
      );
      saveTransformations(newTransformations);
      return newTransformations;
    });
  };

  const value: TransformationsContextValue = {
    state,
    addTransformation,
    removeTransformation,
    toggleTransformation,
    applyTransformation,
    applyEnabledTransformations,
    updateTransformation,
  };

  return (
    <TransformationsContext.Provider value={value}>
      {props.children}
    </TransformationsContext.Provider>
  );
};

/**
 * Hook that provides access to the transformation system context. Must be used
 * within a TransformationsProvider component.
 * 
 * @throws Error if used outside of a TransformationsProvider
 * @returns The transformation context value containing state and methods
 */
export const useTransformations = () => {
  const context = useContext(TransformationsContext);
  if (!context) {
    throw new Error("useTransformations must be used within a TransformationsProvider");
  }
  return context;
}; 