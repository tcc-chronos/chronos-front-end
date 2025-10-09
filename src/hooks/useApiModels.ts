import { useState, useEffect, useCallback } from 'react';
import { ModelsService } from '../services/models';
import type { ApiModel } from '../types/training';
import { useApiErrorHandler } from './useApiErrorHandler';

interface UseApiModelsReturn {
  models: ApiModel[];
  loading: boolean;
  error: string | null;
  refetchModels: () => Promise<void>;
  deleteModel: (modelId: string) => Promise<void>;
  createTraining: (modelId: string) => Promise<void>;
  deleteTraining: (modelId: string, trainingId: string) => Promise<void>;
}

export const useApiModels = (): UseApiModelsReturn => {
  const [models, setModels] = useState<ApiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { handleApiError, handleApiSuccess } = useApiErrorHandler();

  const fetchModels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedModels = await ModelsService.getModels();
      setModels(fetchedModels);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao carregar modelos';
      setError(errorMessage);
      handleApiError(err, 'Carregamento de modelos');
      console.error('Error fetching models:', err);
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  const deleteModel = useCallback(
    async (modelId: string) => {
      try {
        setError(null);
        await ModelsService.deleteModel(modelId);
        // Remove the model from local state
        setModels(prev => prev.filter(model => model.id !== modelId));
        handleApiSuccess('Modelo deletado com sucesso');
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao deletar modelo';
        setError(errorMessage);
        handleApiError(err, 'Remoção de modelo');
        console.error('Error deleting model:', err);
        throw err; // Re-throw to let the component handle it
      }
    },
    [handleApiError, handleApiSuccess]
  );

  const createTraining = useCallback(
    async (modelId: string) => {
      try {
        setError(null);
        await ModelsService.createTraining(modelId, { dataVolume: 1000 });
        // Refresh models to get the new training
        await fetchModels();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao criar treinamento'
        );
        console.error('Error creating training:', err);
        throw err; // Re-throw to let the component handle it
      }
    },
    [fetchModels]
  );

  const deleteTraining = useCallback(
    async (modelId: string, trainingId: string) => {
      try {
        setError(null);
        await ModelsService.deleteTraining(modelId, trainingId);
        // Remove the training from local state
        setModels(prev =>
          prev.map(model =>
            model.id === modelId
              ? {
                  ...model,
                  trainings: model.trainings.filter(
                    training => training.id !== trainingId
                  ),
                }
              : model
          )
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Erro ao deletar treinamento'
        );
        console.error('Error deleting training:', err);
        throw err; // Re-throw to let the component handle it
      }
    },
    []
  );

  // Fetch models on mount
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return {
    models,
    loading,
    error,
    refetchModels: fetchModels,
    deleteModel,
    createTraining,
    deleteTraining,
  };
};
