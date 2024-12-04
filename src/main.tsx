import { render, ErrorBoundary } from "solid-js/web";
import type { ParentComponent } from "solid-js";
import { Router } from "@solidjs/router";
import { routes } from "./router";
import "./styles.css";

const Layout: ParentComponent = (props) => {
  return <>{props.children}</>;
};

render(
  () => (
    <ErrorBoundary
      fallback={
        <div class="error-message">
          Something went wrong.
          <br />
          <a href="/">Return to front page</a>
        </div>
      }
    >
      <Router root={Layout}>{routes}</Router>
    </ErrorBoundary>
  ),
  document.body as HTMLElement
);
