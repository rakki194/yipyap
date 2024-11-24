import { render } from "solid-js/web";
import type { ParentComponent } from "solid-js";
import { Router } from "@solidjs/router";
import { routes } from "./router";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./styles.css";

const Layout: ParentComponent = (props) => {
  return <>{props.children}</>;
};

render(
  () => (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Router root={Layout}>{routes}</Router>
    </ErrorBoundary>
  ),
  document.getElementById("app") as HTMLElement
);
