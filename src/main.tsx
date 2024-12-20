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
import { NotificationContainer } from "./components/Notification/NotificationContainer";
import "./styles.css";

const CustomErrorBoundary: ParentComponent = (props) => {
  return (
    <ErrorBoundary
      fallback={
        <div class="error-message">
          Something went wrong.
          <br />
          <a href="/">Return to front page</a>
        </div>
      }
    >
      {props.children}
    </ErrorBoundary>
  );
};

const Layout: ParentComponent = (props) => {
  return (
    <>
      <AppProvider>
        <CustomErrorBoundary>{props.children}</CustomErrorBoundary>
        <NotificationContainer />
      </AppProvider>
    </>
  );
};

render(
  () => (
    <CustomErrorBoundary>
      <Router root={Layout}>{routes}</Router>
    </CustomErrorBoundary>
  ),
  document.body as HTMLElement
);
