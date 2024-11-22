import { createSignal, JSX } from "solid-js";

interface ErrorBoundaryProps {
  fallback: JSX.Element;
  children: JSX.Element;
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
  const [hasError, setHasError] = createSignal(false);

  // This method can be called to set the error state
  const setError = () => setHasError(true);

  return hasError() ? props.fallback : props.children;
}
