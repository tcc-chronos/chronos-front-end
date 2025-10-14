import { useApiErrorHandler } from '../../../hooks/useApiErrorHandler';
import { useEffect } from 'react';

export const ApiErrorInterceptor: React.FC = () => {
  const { handleApiError, handleApiSuccess } = useApiErrorHandler();

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        if (!response.ok) {
          const url = args[0] as string;
          const method = (args[1]?.method || 'GET').toUpperCase();

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

          console.warn(`API Error Interceptor: ${method} ${url}`, errorMessage);
        }

        return response;
      } catch (error) {
        const url = args[0] as string;
        const method = (args[1]?.method || 'GET').toUpperCase();

        console.warn(`API Error Interceptor: ${method} ${url}`, error);

        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [handleApiError, handleApiSuccess]);

  return null;
};

export default ApiErrorInterceptor;
