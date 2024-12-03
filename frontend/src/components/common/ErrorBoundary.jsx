import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to your error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-md w-full space-y-8 text-center'>
            <div>
              <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
                Something went wrong
              </h2>
              <p className='mt-2 text-sm text-gray-600'>
                We're sorry for the inconvenience. Please try refreshing the
                page.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className='mt-4 text-left bg-red-50 p-4 rounded-md'>
                <summary className='text-red-800 cursor-pointer'>
                  Error Details
                </summary>
                <pre className='mt-2 text-xs text-red-800 overflow-auto'>
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
