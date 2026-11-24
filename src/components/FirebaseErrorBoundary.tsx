import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class FirebaseErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    let friendly = error.message || 'An unexpected application error occurred.';
    try {
      const parsed = JSON.parse(error.message) as {
        error?: string;
        operationType?: string;
        path?: string;
      };
      if (parsed?.error) {
        if (parsed.error.includes('Quota exceeded')) {
          friendly =
            'Daily free Firestore quota was reached. It resets tomorrow — please check your Firebase Firestore usage.';
        } else if (parsed.error.includes('permission') || parsed.error.includes('PERMISSION_DENIED')) {
          friendly = `Database access was denied for ${parsed.operationType ?? 'operation'} on ${parsed.path ?? 'resource'}. Please make sure you are signed in with a verified Google account.`;
        } else {
          friendly = parsed.error;
        }
      }
    } catch {
      // Keep plain error message
    }
    return { hasError: true, message: friendly };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-canvas flex min-h-[100dvh] items-center justify-center p-6 text-slate-900">
          <div className="w-full max-w-lg rounded-xl border border-red-200 bg-white p-7 space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 text-red-700">
              <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
              <h1 className="font-display text-lg font-semibold">Something went wrong</h1>
            </div>
            <p className="text-sm leading-relaxed text-slate-600">{this.state.message}</p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, message: '' });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1E40AF] transition-colors"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reload Course App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
