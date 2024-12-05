import { render, ErrorBoundary } from "solid-js/web";
import { createSignal, type ParentComponent } from "solid-js";
import {
  Location,
  Router,
  useResolvedPath,
  useNavigate,
  useBeforeLeave,
  BeforeLeaveEventArgs,
} from "@solidjs/router";
import { routes } from "./router";
import { AppProvider } from "./contexts/app";
import "./styles.css";

const Layout: ParentComponent = (props) => {
  return (
    <>
      <AppProvider>{props.children}</AppProvider>
    </>
  );
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
