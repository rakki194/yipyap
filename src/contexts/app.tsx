import { createSignal, useContext, type ParentComponent } from "solid-js";
import { Location, useBeforeLeave } from "@solidjs/router";
import { AppContext } from "~/contexts/contexts";
import { unwrap } from "solid-js/store";

export interface AppContext {
  readonly prevRoute: Location | undefined;
}

const createAppContext = (): AppContext => {
  // FIXME: theme should be here
  const [prevRoute, setPrevRoute] = createSignal<Location>();

  if (import.meta.env.DEV) {
    console.log("createAppContext", prevRoute());
  }

  useBeforeLeave((e) => {
    if (import.meta.env.DEV) {
      console.debug("AppContext before-leave", e);
    }
    if (e.defaultPrevented) {
      return;
    }
    // Navigation warnings should plug here (we have e.preventDefault)
    setPrevRoute({ ...e.from });
  });

  return {
    get prevRoute() {
      return prevRoute();
    },
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
