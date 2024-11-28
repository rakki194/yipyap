// src/components/Settings/Settings.tsx

import { Component, Show } from "solid-js";
import { useGallery } from "~/contexts/GalleryContext";
import { useTheme, Theme } from "~/contexts/theme";
import {
  SunIcon,
  MoonIcon,
  CloudIcon,
  DimensionsIcon,
  SizeIcon,
  TimeIcon,
} from "~/components/icons";
import "./Settings.css";

export const Settings: Component = () => {
  const gallery = useGallery();
  const theme = useTheme();

  return (
    <div class="settings-panel card">
      <h2>Settings</h2>

      <section>
        <h3>Appearance</h3>
        <div class="setting-group">
          <label>Theme</label>
          <div class="theme-buttons">
            <button
              class="icon"
              classList={{ active: theme.theme === "light" }}
              onClick={() => theme.setTheme("light")}
              title="Light theme"
              innerHTML={SunIcon}
            />
            <button
              class="icon"
              classList={{ active: theme.theme === "gray" }}
              onClick={() => theme.setTheme("gray")}
              title="Gray theme"
              innerHTML={CloudIcon}
            />
            <button
              class="icon"
              classList={{ active: theme.theme === "dark" }}
              onClick={() => theme.setTheme("dark")}
              title="Dark theme"
              innerHTML={MoonIcon}
            />
          </div>
        </div>

        <div class="setting-group">
          <label>View Mode</label>
          <select
            value={gallery.state.viewMode}
            onChange={(e) =>
              gallery.setViewMode(e.currentTarget.value as "grid" | "list")
            }
          >
            <option value="grid">Grid</option>
            <option value="list">List</option>
          </select>
        </div>
      </section>

      <section>
        <h3>Gallery</h3>
        <div class="setting-group">
          <label>Sort By</label>
          <select
            value={gallery.state.sort}
            onChange={(e) =>
              gallery.setSort(e.currentTarget.value as "name" | "date" | "size")
            }
          >
            <option value="name">Name</option>
            <option value="date">Modified Date</option>
            <option value="size">File Size</option>
          </select>
        </div>
      </section>
    </div>
  );
};
