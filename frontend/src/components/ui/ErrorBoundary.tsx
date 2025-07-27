import { Component, type ErrorInfo, type ReactNode } from "react";
import { Triangle, ArrowClockwise, House } from "@phosphor-icons/react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Triangle className="w-8 h-8 text-error" />
              </div>
              
              <h1 className="text-xl font-bold text-text mb-3">
                Something went wrong
              </h1>
              
              <p className="text-text-muted mb-6">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                >
                  <ArrowClockwise className="w-4 h-4" />
                  Refresh Page
                </button>
                
                <button
                  onClick={() => window.location.href = "/"}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-border text-text rounded-lg hover:bg-surface-warm transition-colors font-medium"
                >
                  <House className="w-4 h-4" />
                  Go Home
                </button>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-text-muted cursor-pointer">
                    Error Details
                  </summary>
                  <pre className="mt-2 text-xs text-error bg-error/5 p-3 rounded border overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;