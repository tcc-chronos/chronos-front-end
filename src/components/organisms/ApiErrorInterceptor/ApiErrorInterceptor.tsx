import { useApiErrorHandler } from '../../../hooks/useApiErrorHandler';
import { useEffect } from 'react';

/**
 * Component to set up global API error handling
 * This should be placed in the app root to capture all API errors
 */
export const ApiErrorInterceptor: React.FC = () => {
  const { handleApiError, handleApiSuccess } = useApiErrorHandler();

  useEffect(() => {
    // Set up global error handling for fetch
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        if (!response.ok) {
          const url = args[0] as string;
          const method = (args[1]?.method || 'GET').toUpperCase();

          // Try to get error details from response
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.clone().json();
            if (errorData.detail) {
              errorMessage =
                typeof errorData.detail === 'string'
                  ? errorData.detail
                  : JSON.stringify(errorData.detail);
            } else if (errorData.message) {
              errorMessage = errorData.message;
            } else if (errorData.error) {
              errorMessage = errorData.error;
            }
          } catch {
            // Ignore parsing errors
          }

          const error = new Error(errorMessage);
          const context = `${method} ${url}`;

          // Skip notifications for polling requests to avoid spam
          const isPollingRequest =
            (url.includes('/models/') && method === 'GET') ||
            url.includes('/devices/');

          if (!isPollingRequest) {
            handleApiError(error, context);
          }
        }

        return response;
      } catch (error) {
        const url = args[0] as string;
        const method = (args[1]?.method || 'GET').toUpperCase();
        const context = `${method} ${url}`;

        // Skip notifications for polling requests to avoid spam
        const isPollingRequest =
          (url.includes('/models/') && method === 'GET') ||
          url.includes('/devices/');

        if (!isPollingRequest) {
          handleApiError(error, context);
        }

        throw error;
      }
    };

    // Cleanup function to restore original fetch
    return () => {
      window.fetch = originalFetch;
    };
  }, [handleApiError, handleApiSuccess]);

  return null; // This component doesn't render anything
};

export default ApiErrorInterceptor;
