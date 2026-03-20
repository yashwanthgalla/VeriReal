import { Component, type ErrorInfo, type ReactNode } from 'react'

interface AppErrorBoundaryState {
  hasError: boolean
  message: string
}

interface AppErrorBoundaryProps {
  children: ReactNode
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
    message: '',
  }

  static getDerivedStateFromError(error: unknown): AppErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Unknown runtime error',
    }
  }

  componentDidCatch(error: unknown, errorInfo: ErrorInfo) {
    console.error('App runtime error:', error)
    console.error('Error info:', errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="relative mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <section className="mx-auto mt-16 w-full max-w-2xl rounded-3xl border border-rose-200 bg-rose-50 p-6">
            <h1 className="font-display text-2xl font-semibold text-rose-900">Application Error</h1>
            <p className="mt-2 text-sm text-rose-800">
              The app hit a runtime error. Please refresh after checking your environment setup.
            </p>
            <pre className="mt-4 overflow-auto rounded-xl bg-white p-3 text-xs text-rose-800">
              {this.state.message}
            </pre>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
