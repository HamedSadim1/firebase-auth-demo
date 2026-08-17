import React from "react";

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
              className="mt-6 w-full rounded-lg bg-linear-to-r from-amber to-amber-dark py-3 px-4 font-semibold text-[#14100a] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
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
