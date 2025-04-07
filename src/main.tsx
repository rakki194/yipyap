import { render } from "solid-js/web";
import { type ParentComponent } from "solid-js";
import { Router } from "@solidjs/router";
import { routes } from "./router";
import { AppProvider } from "./contexts/app";
import { CaptionerProvider } from "./contexts/captioners";
import { NotificationContainer } from "./components/Notification/NotificationContainer";
import useConnectionStatus from "./composables/useConnectionStatus";
import { logger } from "./utils/logger";
import "./styles.css";

// Component to monitor connection status
const ConnectionMonitor: ParentComponent = () => {
  useConnectionStatus();
  return null;
};

const Layout: ParentComponent = (props) => {
  return (
    <>
      <AppProvider>
        <CaptionerProvider>
          {props.children}
          <NotificationContainer />
          <ConnectionMonitor />
        </CaptionerProvider>
      </AppProvider>
    </>
  );
};

// Log application startup
logger.info(`YipYap application starting - v${import.meta.env.VITE_APP_VERSION || "dev"}`);
logger.info(`Environment: ${import.meta.env.MODE}`);

// Log any unhandled errors
window.addEventListener("error", (event) => {
  logger.error("Unhandled error:", event.error || new Error(event.message));
});

window.addEventListener("unhandledrejection", (event) => {
  logger.error("Unhandled promise rejection:", event.reason || new Error("Unknown promise rejection"));
});

render(
  () => (
    <Router root={Layout}>{routes}</Router>
  ),
  document.body as HTMLElement
);
