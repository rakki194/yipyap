import { createSignal, For } from "solid-js";
import { A } from "@solidjs/router";
import { HomeIcon, SunIcon, MoonIcon } from "~/components/icons";

export const Breadcrumb = (props: { path: string }) => {
  const getInitialTheme = () => {
    return document.documentElement.dataset.theme === 'dark';
  };

  const [isDark, setIsDark] = createSignal(getInitialTheme());
  const crumbs = () => props.path.split("/").filter(Boolean) || [];

  const toggleDarkMode = () => {
    const newIsDark = !isDark();
    
    document.documentElement.dataset.theme = newIsDark ? 'dark' : 'light';
    
    document.cookie = `theme=${newIsDark ? "dark" : "light"}; max-age=${
      60 * 60 * 24 * 365
    }; path=/; SameSite=Strict`;
    
    setIsDark(newIsDark);
  };

  return (
    <nav class="breadcrumb">
      <div class="breadcrumb-content">
        <div class="breadcrumb-links">
          <A href="/gallery">
            <span innerHTML={HomeIcon} />
          </A>
          <For each={crumbs()}>
            {(crumb, index) => {
              const path = crumbs()
                .slice(0, index() + 1)
                .join("/");
              return (
                <>
                  {" / "}
                  <A href={`/gallery/${path}`}>{crumb}</A>
                </>
              );
            }}
          </For>
        </div>
        <button
          class="theme-toggle"
          onClick={toggleDarkMode}
          title={isDark() ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span innerHTML={isDark() ? SunIcon : MoonIcon} />
        </button>
      </div>
    </nav>
  );
};
