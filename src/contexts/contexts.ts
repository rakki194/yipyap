import { createContext } from "solid-js";
import type { GalleryContextType } from "./gallery";
import type { ToastContextType } from "./Toast";

// This files only contain the base storages for contexts
// The actual API (context providers) are in GalleryContext.tsx or other tsx files

// Make them standalone so that HMR can keep them alive long enough
// (or choose to replace them with new instances)
export const GalleryContext = createContext<GalleryContextType>();

export const ToastContext = createContext<ToastContextType>();
