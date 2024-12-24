import { createContext, useContext, ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";
import { useAppContext } from "./app";

export interface Transformation {
  id: string;
  name: string;
  description: string;
  action: (text: string) => string;
  icon: string;
}

interface TransformationsState {
  transformations: Transformation[];
}

interface TransformationsContextValue {
  state: TransformationsState;
  addTransformation: (transformation: Omit<Transformation, "id">) => void;
  removeTransformation: (id: string) => void;
  applyTransformation: (transformationId: string, text: string) => string;
}

const defaultTransformations: Transformation[] = [
  {
    id: "removeCommas",
    name: "tools.removeCommas",
    description: "Remove all commas from text",
    action: (text: string) => text.replace(/,/g, ""),
    icon: "sparkle",
  },
  {
    id: "replaceNewlines",
    name: "tools.replaceNewlinesWithCommas",
    description: "Replace newlines with commas",
    action: (text: string) => text.replace(/\n/g, ", "),
    icon: "textAlign",
  },
  {
    id: "replaceUnderscores",
    name: "tools.replaceUnderscoresWithSpaces",
    description: "Replace underscores with spaces",
    action: (text: string) => text.replace(/_/g, " "),
    icon: "textAlignDistributed",
  },
];

const TransformationsContext = createContext<TransformationsContextValue>();

export const TransformationsProvider: ParentComponent = (props) => {
  const { t } = useAppContext();
  const [state, setState] = createStore<TransformationsState>({
    transformations: defaultTransformations,
  });

  const addTransformation = (transformation: Omit<Transformation, "id">) => {
    const id = Math.random().toString(36).substring(7);
    setState("transformations", (prev) => [...prev, { ...transformation, id }]);
  };

  const removeTransformation = (id: string) => {
    setState("transformations", (prev) => prev.filter((t) => t.id !== id));
  };

  const applyTransformation = (transformationId: string, text: string) => {
    const transformation = state.transformations.find((t) => t.id === transformationId);
    if (!transformation) return text;
    return transformation.action(text);
  };

  const value: TransformationsContextValue = {
    state,
    addTransformation,
    removeTransformation,
    applyTransformation,
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