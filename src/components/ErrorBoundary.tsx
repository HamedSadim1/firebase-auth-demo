import React from "react";
import { getButtonClasses } from "../lib/styles";
import { cn } from "../lib/cn";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo): void {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-panel-line bg-panel p-8 text-center shadow-2xl">
            <h1 className="font-display text-xl font-bold text-text">
              Er is iets misgegaan
            </h1>
            <p className="mt-2 text-sm text-muted">
              Er is een onverwachte fout opgetreden. Herlaad de pagina om
              opnieuw te proberen.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={cn("mt-6", getButtonClasses())}
            >
              Herlaad de pagina
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
