import { useCallback } from 'react';

/**
 * Hook that provides a refresh function for models
 * This can be used by components that need to refresh the models list
 * without managing their own local state
 */
export const useModelsRefresh = () => {
  const refreshModels = useCallback(async () => {
    // Trigger a custom event that the ModelsList component can listen to
    window.dispatchEvent(new CustomEvent('refreshModels'));
  }, []);

  return { refreshModels };
};

export default useModelsRefresh;
