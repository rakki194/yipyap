import { createContext, useContext, ParentComponent } from "solid-js";
import { createStore } from "solid-js/store";
import {
  computeTagBackground,
  computeTagColor,
  computeHoverStyles,
  computeAnimation
} from "./themeUtils";

export type ThemeName = "dark" | "light" | "gray" | "banana" | "strawberry" | "peanut";

interface ThemeContext {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  getTagStyle: (tag: string) => {
    backgroundColor: string;
    color: string;
    hoverStyles: Record<string, string>;
    animation: string;
  };
}

const ThemeContext = createContext<ThemeContext>();

export const ThemeProvider: ParentComponent = (props) => {
  const [state, setState] = createStore({
    theme: (localStorage.getItem("theme") as ThemeName) || "light"
  });

  const getTagStyle = (tag: string) => {
    // Move all theme-specific styling logic here
    const styles = {
      backgroundColor: computeTagBackground(state.theme, tag),
      color: computeTagColor(state.theme, tag),
      hoverStyles: computeHoverStyles(state.theme),
      animation: computeAnimation(state.theme)
    };

    return styles;
  };

  const context: ThemeContext = {
    get theme() { return state.theme; },
    setTheme(theme: ThemeName) {
      setState("theme", theme);
      localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    },
    getTagStyle
  };

  return (
    <ThemeContext.Provider value={context}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}; 