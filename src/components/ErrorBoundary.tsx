import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Uncaught error:', error, info.componentStack)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-kanade-charcoal flex items-center justify-center text-center px-6">
          <div>
            <p className="text-kanade-cream font-serif text-2xl mb-3">Something went wrong.</p>
            <p className="text-kanade-sand/70 text-sm mb-6">Please refresh the page to continue.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-full border border-kanade-rose/40 text-kanade-rose text-sm hover:bg-kanade-rose/10 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
