import { render } from "solid-js/web";
import type { ParentComponent } from "solid-js";
import { Router, Route } from "@solidjs/router";
import { routes } from "./router";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./styles.css";

const Layout: ParentComponent = (props) => {
  return <>{props.children}</>;
};

const initializeTheme = () => {
  const savedTheme = document.cookie.match(/theme=(light|dark)/)?.[1];
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    document.documentElement.dataset.theme = savedTheme;
  } else {
    document.documentElement.dataset.theme = prefersDark ? 'dark' : 'light';
    document.cookie = `theme=${prefersDark ? "dark" : "light"}; max-age=${60 * 60 * 24 * 365}; path=/`;
  }
};

initializeTheme();

render(
  () => (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Router root={Layout}>{routes}</Router>
    </ErrorBoundary>
  ),
  document.getElementById("app") as HTMLElement
);
