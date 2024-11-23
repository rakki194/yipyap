import { createSignal, For } from "solid-js";
import { A } from "@solidjs/router";
import HomeIcon from "@fluentui/svg-icons/icons/home_24_regular.svg?raw";
import SunIcon from "@fluentui/svg-icons/icons/weather_sunny_24_regular.svg?raw";
import MoonIcon from "@fluentui/svg-icons/icons/weather_moon_24_regular.svg?raw";

export const Breadcrumb = (props: { path: string }) => {
  const [isDark, setIsDark] = createSignal(document.body.classList.contains('dark-mode'));
  const crumbs = () => props.path.split("/").filter(Boolean) || [];

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    setIsDark(!isDark());
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
