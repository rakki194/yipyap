// src/components/ErrorBoundary.tsx
//
// Error boundary component that catches errors in child components
// and displays a fallback UI when errors occur.

import {
  createSignal,
  JSX,
  ErrorBoundary as SolidErrorBoundary,
} from "solid-js";
import "./ErrorBoundary.css";

/**
 * Props for the custom ErrorBoundary component.
 */
interface ErrorBoundaryProps {
  /** UI to display when an error occurs */
  fallback: JSX.Element;
  /** Child components to render normally when no error */
  children: JSX.Element;
}

/**
 * Custom ErrorBoundary component that utilizes SolidJS's ErrorBoundary.
 * It captures errors in child components and displays a fallback UI.
 *
 * @param props ErrorBoundaryProps containing fallback UI and children
 * @returns The children normally, or fallback UI when an error occurs
 */
export const ErrorBoundary = (props: ErrorBoundaryProps) => {
  const [hasError, setHasError] = createSignal(false);
  const [error, setError] = createSignal<Error | null>(null);

  const handleError = (err: Error) => {
    console.error("ErrorBoundary caught an error:", err);
    setError(err);
    setHasError(true);
  };

  return (
    <SolidErrorBoundary fallback={<>{props.fallback}</>}>
      {props.children}
    </SolidErrorBoundary>
  );
};
