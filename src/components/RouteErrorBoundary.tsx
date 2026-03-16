import { Component, type ErrorInfo, type ReactNode } from "react";
import { RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RouteErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("RouteErrorBoundary caught:", error, info.componentStack);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.message?.includes("Failed to fetch dynamically imported module") ||
        this.state.error?.message?.includes("Loading chunk");

      return (
        <div className="flex min-h-[50vh] items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10">
              <RefreshCw className="h-5 w-5 text-destructive" />
            </div>
            <p className="font-display text-base font-semibold">
              {isChunkError ? "Update available" : "Something went wrong"}
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {isChunkError
                ? "A new version was deployed. Reload to get the latest."
                : "This page encountered an error. Try again or go back."}
            </p>
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={isChunkError ? () => window.location.reload() : this.handleRetry}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl active:scale-[0.98] transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                {isChunkError ? "Reload" : "Try again"}
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-secondary active:scale-[0.98] transition-all"
              >
                <Home className="h-3.5 w-3.5" />
                Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;
