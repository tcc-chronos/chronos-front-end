import { useState, useEffect, useCallback } from 'react';
import { ModelsService, type ModelType } from '../services/models';
import { useApiErrorHandler } from './useApiErrorHandler';

interface UseModelTypesReturn {
  modelTypes: ModelType[];
  loading: boolean;
  error: string | null;
  fetchModelTypes: () => Promise<void>;
}

/**
 * Hook to fetch and manage model types from the API
 */
export const useModelTypes = (): UseModelTypesReturn => {
  const [modelTypes, setModelTypes] = useState<ModelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { handleApiError } = useApiErrorHandler();

  const fetchModelTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const types = await ModelsService.getModelTypes();
      setModelTypes(types);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao carregar tipos de modelo';
      setError(errorMessage);
      handleApiError(err, 'Carregamento de tipos de modelo');
      console.error('Error fetching model types:', err);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  // Fetch model types on mount
  useEffect(() => {
    fetchModelTypes();
  }, [fetchModelTypes]);

  return {
    modelTypes,
    loading,
    error,
    fetchModelTypes,
  };
};
