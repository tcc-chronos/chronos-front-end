import { useState, useEffect, useCallback } from 'react';
import { ModelsService } from '../services/models';
import { ModelsAdapter } from '../utils/modelsAdapter';
import { useTrainingPolling } from './useTrainingPolling';
import { useTrainingSidebarStore } from '../store/trainingSidebarStore';
import { useApiErrorHandler } from './useApiErrorHandler';
import type { Model, CreateTrainingRequest } from '../types/training';

interface UseModelsReturn {
  models: Model[];
  loading: boolean;
  error: string | null;
  fetchModels: () => Promise<void>;
  deleteModel: (modelId: string) => Promise<void>;
  createTraining: (request: CreateTrainingRequest) => Promise<void>;
  deleteTraining: (modelId: string, trainingId: string) => Promise<void>;
  copyModelParams: (modelId: string) => Promise<void>;
  isPolling: boolean;
}

/**
 * Enhanced useModels hook that fetches data from the real API
 * while maintaining backward compatibility with existing components
 */
export const useModels = (): UseModelsReturn => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { handleApiError, handleApiSuccess } = useApiErrorHandler();

  const fetchModels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const apiModels = await ModelsService.getModels();
      // Convert API models to legacy format
      const legacyModels = apiModels.map(ModelsAdapter.apiModelToLegacy);
      setModels(legacyModels);
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
        // Refresh models list to ensure UI is up to date
        await fetchModels();
        handleApiSuccess('Modelo deletado com sucesso');
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao deletar modelo';
        setError(errorMessage);
        handleApiError(err, 'Remoção de modelo');
        console.error('Error deleting model:', err);
        throw err;
      }
    },
    [fetchModels, handleApiError, handleApiSuccess]
  );

  const createTraining = useCallback(
    async (request: CreateTrainingRequest) => {
      try {
        setError(null);
        await ModelsService.createTraining(request.modelId, {
          dataVolume: request.dataVolume,
        });
        // Refresh models to get the new training
        await fetchModels();
        handleApiSuccess(
          'Treinamento criado com sucesso',
          'O treinamento foi iniciado e você pode acompanhar o progresso.'
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao criar treinamento';
        setError(errorMessage);
        handleApiError(err, 'Criação de treinamento');
        console.error('Error creating training:', err);
        throw err;
      }
    },
    [fetchModels, handleApiError, handleApiSuccess]
  );

  const deleteTraining = useCallback(
    async (modelId: string, trainingId: string) => {
      try {
        setError(null);
        await ModelsService.deleteTraining(modelId, trainingId);
        // Refresh models list to ensure UI is up to date
        await fetchModels();
        handleApiSuccess('Treinamento deletado com sucesso');
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao deletar treinamento';
        setError(errorMessage);
        handleApiError(err, 'Remoção de treinamento');
        console.error('Error deleting training:', err);
        throw err;
      }
    },
    [fetchModels, handleApiError, handleApiSuccess]
  );

  const copyModelParams = useCallback(
    async (modelId: string) => {
      try {
        setError(null);

        // Fetch the complete model data from the API
        const modelData = await ModelsService.getModel(modelId);

        // Access the training sidebar store
        const { setFields } = useTrainingSidebarStore.getState();

        // Map API model data to sidebar store format
        const sidebarData = {
          rnn_type: modelData.model_type as 'gru' | 'lstm',
          entity_type: modelData.entity_type,
          entity_id: modelData.entity_id,
          feature: modelData.feature,
          column_data: modelData.feature, // Use feature as column_data
          epochs: modelData.epochs,
          forecast_horizon: modelData.forecast_horizon,
          lookback_window: modelData.lookback_window,
          learning_rate: modelData.learning_rate,
          early_stopping_patience: modelData.early_stopping_patience,
          multi_feature: false, // Default to single feature
          batch_size: modelData.batch_size,
          // Map RNN layers
          rnn_units: modelData.rnn_layers.map(layer => ({
            neurons: layer.units,
            dropout: layer.dropout,
          })),
          // Map Dense layers
          dense_units: modelData.dense_layers.map(layer => ({
            neurons: layer.units,
            dropout: layer.dropout,
          })),
          // Set dense activation from first dense layer
          dense_activation: modelData.dense_layers[0]?.activation || 'relu',
          // Set bidirectional based on recurrent_dropout > 0
          bidirecional: modelData.rnn_layers.some(
            layer => layer.recurrent_dropout > 0
          ),
        };

        // Update the sidebar store with the copied parameters
        setFields(sidebarData);

        console.log('Model parameters copied successfully:', modelData.name);

        handleApiSuccess(
          'Parâmetros copiados com sucesso!',
          `Os parâmetros do modelo "${modelData.name}" foram copiados para o formulário.`
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Erro ao copiar parâmetros do modelo';
        setError(errorMessage);
        handleApiError(err, 'Cópia de parâmetros');
        console.error('Error copying model params:', err);
        throw err;
      }
    },
    [handleApiError, handleApiSuccess]
  );

  // Handle model updates from polling
  const handleModelUpdate = useCallback((updatedModel: Model) => {
    setModels(prev =>
      prev.map(model => (model.id === updatedModel.id ? updatedModel : model))
    );
  }, []);

  // Training polling for real-time updates - only when models are training
  const hasActiveTrainings = models.some(model => {
    // If model is actively training, has active trainings
    if (model.status === 'training') {
      return true;
    }

    // Otherwise, check if there are any non-final trainings
    return model.trainings.some(
      training => training.status === 'pending' || training.status === 'running'
    );
  });

  const { isPolling } = useTrainingPolling({
    models,
    onModelUpdate: handleModelUpdate,
    pollingInterval: 5000, // Poll every 5 seconds
    enabled: hasActiveTrainings, // Only enabled when there are active trainings
  });

  // Debug logging for polling state
  useEffect(() => {
    console.log(
      `Training polling status: ${isPolling ? 'ACTIVE' : 'INACTIVE'} - Active trainings: ${hasActiveTrainings}`
    );
  }, [isPolling, hasActiveTrainings]);

  // Fetch models on mount
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  // Listen for refresh events
  useEffect(() => {
    const handleRefresh = () => {
      fetchModels();
    };

    window.addEventListener('refreshModels', handleRefresh);
    return () => {
      window.removeEventListener('refreshModels', handleRefresh);
    };
  }, [fetchModels]);

  return {
    models,
    loading,
    error,
    fetchModels,
    deleteModel,
    createTraining,
    deleteTraining,
    copyModelParams,
    isPolling, // Expose polling state
  };
};
