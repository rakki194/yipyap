/**
 * @description A navigation component that displays the current location in the gallery's
 * directory hierarchy along with relevant statistics and actions. The component is organized
 * into three main sections: navigation, statistics, and action buttons.
 * 
 * The breadcrumb provides:
 * - Directory path navigation through clickable segments
 * - File and folder statistics for the current directory
 * - Quick actions for common gallery operations
 * 
 * The layout is horizontally organized with:
 * - Left: BreadcrumbNavigation - Shows the current path and allows navigation
 * - Center: BreadcrumbStats - Displays folder statistics and selection info
 * - Right: BreadcrumbActions - Contains action buttons for gallery operations
 * 
 * @component
 * @example
 * ```tsx
 * <Breadcrumb />
 * ```
 */

import { Component, Show } from "solid-js";
import { useGallery } from "~/contexts/GalleryContext";
import { BreadcrumbNavigation } from "./BreadcrumbNavigation";
import { BreadcrumbStats } from "./BreadcrumbStats";
import { BreadcrumbActions } from "./BreadcrumbActions";
import "./Breadcrumb.css";

/**
 * The main Breadcrumb component that serves as a container for navigation,
 * statistics, and action elements in the gallery interface.
 * 
 * @returns A navigation bar containing path navigation, directory statistics,
 * and action buttons wrapped in a semantic nav element.
 */
export const Breadcrumb: Component = () => {
  const gallery = useGallery();
  
  return (
    <>
      <nav class="breadcrumb">
        <div class="breadcrumb-content">
          <BreadcrumbNavigation />
          <Show when={!gallery.data.error}>
            <BreadcrumbStats />
            <BreadcrumbActions />
          </Show>
        </div>
      </nav>
    </>
  );
};
