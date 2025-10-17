import { useApiErrorHandler } from '../../../hooks/useApiErrorHandler';
import { useEffect } from 'react';

export const ApiErrorInterceptor: React.FC = () => {
  const { handleApiError, handleApiSuccess } = useApiErrorHandler();

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [handleApiError, handleApiSuccess]);

  return null;
};

export default ApiErrorInterceptor;
