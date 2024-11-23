import { createSignal, For } from "solid-js";
import { A } from "@solidjs/router";
import HomeIcon from "@fluentui/svg-icons/icons/home_24_regular.svg?raw";
import SunIcon from "@fluentui/svg-icons/icons/weather_sunny_24_regular.svg?raw";
import MoonIcon from "@fluentui/svg-icons/icons/weather_moon_24_regular.svg?raw";

export const Breadcrumb = (props: { path: string }) => {
  const getInitialTheme = () => {
    const savedTheme = document.cookie.match(/theme=(light|dark)/)?.[1];
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return document.body.classList.contains('dark-mode');
  };

  const [isDark, setIsDark] = createSignal(getInitialTheme());
  const crumbs = () => props.path.split("/").filter(Boolean) || [];

  const toggleDarkMode = () => {
    const newIsDark = !isDark();
    document.body.classList.toggle('dark-mode');
    document.cookie = `theme=${newIsDark ? 'dark' : 'light'}; max-age=${60 * 60 * 24 * 365}; path=/`;
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
