import { useCallback, useEffect } from 'react';
import { ModelsService, type ModelType } from '../services/models';
import { useTrainingSidebarStore } from '../store/trainingSidebarStore';

interface UseModelTypesReturn {
  modelTypes: ModelType[];
  loading: boolean;
  error: string | null;
  fetchModelTypes: () => Promise<void>;
}

interface UseModelTypesOptions {
  autoFetch?: boolean;
}

export const useModelTypes = (
  options: UseModelTypesOptions = {}
): UseModelTypesReturn => {
  const { autoFetch = false } = options;

  const {
    modelTypes,
    modelTypesLoading: loading,
    modelTypesError: error,
    setModelTypes,
    setModelTypesLoading,
    setModelTypesError,
    shouldFetchModelTypes,
  } = useTrainingSidebarStore();

  const fetchModelTypes = useCallback(async (): Promise<void> => {
    if (!shouldFetchModelTypes()) {
      return;
    }

    setModelTypesLoading(true);
    setModelTypesError(null);

    try {
      const types = await ModelsService.getModelTypes();
      setModelTypes(types);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao carregar tipos de modelo';
      setModelTypesError(errorMessage);
      console.warn('useModelTypes: Failed to fetch model types', err);
    } finally {
      setModelTypesLoading(false);
    }
  }, [
    shouldFetchModelTypes,
    setModelTypes,
    setModelTypesLoading,
    setModelTypesError,
  ]);

  useEffect(() => {
    if (autoFetch) {
      fetchModelTypes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch]);

  return {
    modelTypes,
    loading,
    error,
    fetchModelTypes,
  };
};
