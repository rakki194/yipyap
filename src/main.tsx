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
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  } else if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.body.classList.add('dark-mode');
    }
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
