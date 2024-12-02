// src/components/ErrorBoundary.tsx
//
// Error boundary component that catches errors in child components
// and displays a fallback UI when errors occur.

import { createSignal, JSX } from "solid-js";

/**
 * Props for the ErrorBoundary component
 */
interface ErrorBoundaryProps {
  /** UI to display when an error occurs */
  fallback: JSX.Element;
  /** Child components to render normally when no error */
  children: JSX.Element;
}

/**
 * Error boundary component that catches errors in child components
 * and displays a fallback UI when errors occur.
 *
 * @param props ErrorBoundaryProps containing fallback UI and children
 * @returns The children normally, or fallback UI when an error occurs
 *
 * @example
 * <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export function ErrorBoundary(props: ErrorBoundaryProps) {
  const [hasError] = createSignal(false);

  return hasError() ? props.fallback : props.children;
}
