import { useCallback } from 'react';

export const useModelsRefresh = () => {
  const refreshModels = useCallback(async () => {
    window.dispatchEvent(new CustomEvent('refreshModels'));
  }, []);

  return { refreshModels };
};

export default useModelsRefresh;
