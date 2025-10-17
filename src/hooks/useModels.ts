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

// Shared state across all useModels instances (singleton pattern)
let sharedModels: Model[] = [];
let sharedLoading = true;
let sharedError: string | null = null;
let fetchPromise: Promise<void> | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5000;
const listeners = new Set<
  (models: Model[], loading: boolean, error: string | null) => void
>();

const notifyListeners = () => {
  listeners.forEach(listener =>
    listener(sharedModels, sharedLoading, sharedError)
  );
};

const sharedFetchModels = async (
  handleApiError: (error: unknown, context?: string) => void
): Promise<void> => {
  if (fetchPromise) {
    return fetchPromise;
  }

  const now = Date.now();
  if (sharedModels.length > 0 && now - lastFetchTime < CACHE_DURATION) {
    return Promise.resolve();
  }

  sharedLoading = true;
  sharedError = null;
  notifyListeners();

  fetchPromise = (async () => {
    try {
      const apiModels = await ModelsService.getModels();
      sharedModels = apiModels.map(ModelsAdapter.apiModelToLegacy);
      sharedError = null;
      lastFetchTime = Date.now();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao carregar modelos';
      sharedError = errorMessage;
      handleApiError(err, 'Carregamento de modelos');
    } finally {
      sharedLoading = false;
      fetchPromise = null;
      notifyListeners();
    }
  })();

  return fetchPromise;
};

export const useModels = (): UseModelsReturn => {
  const [models, setModels] = useState<Model[]>(sharedModels);
  const [loading, setLoading] = useState(sharedLoading);
  const [error, setError] = useState<string | null>(sharedError);

  const { handleApiError, handleApiSuccess } = useApiErrorHandler();

  useEffect(() => {
    const listener = (
      newModels: Model[],
      newLoading: boolean,
      newError: string | null
    ) => {
      setModels(newModels);
      setLoading(newLoading);
      setError(newError);
    };

    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const fetchModels = useCallback(async () => {
    await sharedFetchModels(handleApiError);
  }, [handleApiError]);

  const deleteModel = useCallback(
    async (modelId: string) => {
      try {
        sharedError = null;
        notifyListeners();
        await ModelsService.deleteModel(modelId);
        lastFetchTime = 0;
        await fetchModels();
        handleApiSuccess('Modelo deletado com sucesso');
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao deletar modelo';
        sharedError = errorMessage;
        notifyListeners();
        handleApiError(err, 'Remoção de modelo');
        throw err;
      }
    },
    [fetchModels, handleApiError, handleApiSuccess]
  );

  const createTraining = useCallback(
    async (request: CreateTrainingRequest) => {
      try {
        sharedError = null;
        notifyListeners();
        await ModelsService.createTraining(request.modelId, {
          dataVolume: request.dataVolume,
        });
        lastFetchTime = 0;
        await fetchModels();
        handleApiSuccess(
          'Treinamento criado com sucesso',
          'O treinamento foi iniciado e você pode acompanhar o progresso.'
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao criar treinamento';
        sharedError = errorMessage;
        notifyListeners();
        handleApiError(err, 'Criação de treinamento');
        throw err;
      }
    },
    [fetchModels, handleApiError, handleApiSuccess]
  );

  const deleteTraining = useCallback(
    async (modelId: string, trainingId: string) => {
      try {
        sharedError = null;
        notifyListeners();
        await ModelsService.deleteTraining(modelId, trainingId);
        lastFetchTime = 0;
        await fetchModels();
        handleApiSuccess('Treinamento deletado com sucesso');
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro ao deletar treinamento';
        sharedError = errorMessage;
        notifyListeners();
        handleApiError(err, 'Remoção de treinamento');
        throw err;
      }
    },
    [fetchModels, handleApiError, handleApiSuccess]
  );

  const copyModelParams = useCallback(
    async (modelId: string) => {
      try {
        setError(null);

        const modelData = await ModelsService.getModel(modelId);

        const { setFields, shouldFetchDevices } =
          useTrainingSidebarStore.getState();

        const sidebarData = {
          rnn_type: modelData.model_type as 'gru' | 'lstm',
          entity_type: modelData.entity_type,
          entity_id: modelData.entity_id,
          feature: modelData.feature,
          column_data: modelData.feature,
          epochs: modelData.epochs,
          forecast_horizon: modelData.forecast_horizon,
          lookback_window: modelData.lookback_window,
          learning_rate: modelData.learning_rate,
          early_stopping_patience: modelData.early_stopping_patience,
          multi_feature: false,
          batch_size: modelData.batch_size,
          rnn_units: modelData.rnn_layers.map(layer => ({
            neurons: layer.units,
            dropout: layer.dropout,
          })),
          dense_units: modelData.dense_layers.map(layer => ({
            neurons: layer.units,
            dropout: layer.dropout,
          })),
          dense_activation: modelData.dense_layers[0]?.activation || 'relu',
          bidirecional: modelData.rnn_layers.some(
            layer => layer.recurrent_dropout > 0
          ),
        };

        setFields(sidebarData);

        if (shouldFetchDevices()) {
          window.dispatchEvent(
            new CustomEvent('refreshDevicesForCopiedParams', {
              detail: {
                entity_type: modelData.entity_type,
                entity_id: modelData.entity_id,
                feature: modelData.feature,
              },
            })
          );
        }

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
        throw err;
      }
    },
    [handleApiError, handleApiSuccess]
  );

  const handleModelUpdate = useCallback((updatedModel: Model) => {
    const oldModel = sharedModels.find(m => m.id === updatedModel.id);

    if (oldModel) {
      const oldModelJson = JSON.stringify(oldModel);
      const updatedModelJson = JSON.stringify(updatedModel);

      if (oldModelJson === updatedModelJson) {
        return;
      }
    }

    sharedModels = sharedModels.map(model =>
      model.id === updatedModel.id ? updatedModel : model
    );

    notifyListeners();
  }, []);

  const hasActiveTrainings = models.some(model => model.status === 'training');

  const { isPolling } = useTrainingPolling({
    models,
    onModelUpdate: handleModelUpdate,
    pollingInterval: 10000,
    enabled: hasActiveTrainings,
  });

  useEffect(() => {
    fetchModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      lastFetchTime = 0;
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
    isPolling,
  };
};
