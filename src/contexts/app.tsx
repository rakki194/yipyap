import { createSignal, useContext, type ParentComponent } from "solid-js";
import { Location, useBeforeLeave, useLocation } from "@solidjs/router";
import { AppContext } from "~/contexts/contexts";
import { unwrap } from "solid-js/store";

export interface AppContext {
  readonly prevRoute: Location | undefined;
  readonly location: Location;
}

const createAppContext = (): AppContext => {
  const location = useLocation();
  if (import.meta.env.DEV) {
    console.log("createAppContext");
  }

  let prevRoute: Location | undefined;
  useBeforeLeave((e) => {
    if (import.meta.env.DEV) {
      console.debug("AppContext before-leave", {
        from: { ...e.from },
        to: e.to,
        defaultPrevented: e.defaultPrevented,
      });
    }
    if (e.defaultPrevented) {
      return;
    }
    // Navigation warnings should plug here (we have e.preventDefault)
    prevRoute = { ...e.from };
  });

  return {
    get prevRoute() {
      location.pathname; // Signal triggered by location change
      return prevRoute;
    },
    location,
  };
};

export const AppProvider: ParentComponent = (props) => {
  const value = createAppContext();
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext)!;
};
