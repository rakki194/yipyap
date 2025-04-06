import { render } from "solid-js/web";
import { type ParentComponent } from "solid-js";
import { Router } from "@solidjs/router";
import { routes } from "./router";
import { AppProvider } from "./contexts/app";
import { CaptionerProvider } from "./contexts/captioners";
import { NotificationContainer } from "./components/Notification/NotificationContainer";
import useConnectionStatus from "./composables/useConnectionStatus";
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

render(
  () => (
    <Router root={Layout}>{routes}</Router>
  ),
  document.body as HTMLElement
);
