import { render, ErrorBoundary } from "solid-js/web";
import { type ParentComponent } from "solid-js";
import { Router } from "@solidjs/router";
import { routes } from "./router";
import { AppProvider } from "./contexts/app";
import { NotificationContainer } from "./components/Notification/NotificationContainer";
import useConnectionStatus from "./composables/useConnectionStatus";
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

// Component to monitor connection status
const ConnectionMonitor: ParentComponent = () => {
  useConnectionStatus();
  return null;
};

const Layout: ParentComponent = (props) => {
  return (
    <>
      <AppProvider>
        <CustomErrorBoundary>{props.children}</CustomErrorBoundary>
        <NotificationContainer />
        <ConnectionMonitor />
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
