import { useCallback, useEffect, useRef, useState } from 'react';
import { ModelsService } from '../services/models';
import { ModelsAdapter } from '../utils/modelsAdapter';
import type { Model } from '../types/training';

const DEFAULT_POLLING_INTERVAL = 10000;
const MAX_RETRY_ATTEMPTS = 3;

interface UseTrainingPollingOptions {
  models: Model[];
  onModelUpdate: (updatedModel: Model) => void;
  pollingInterval?: number;
  enabled?: boolean;
  maxRetries?: number;
}

interface UseTrainingPollingReturn {
  startPolling: () => void;
  stopPolling: () => void;
  isPolling: boolean;
  errorCount: number;
}

let sharedIntervalId: number | null = null;
let sharedIsPolling = false;
const pollingListeners = new Set<(isPolling: boolean) => void>();

const setSharedIsPolling = (value: boolean) => {
  if (sharedIsPolling !== value) {
    sharedIsPolling = value;
    pollingListeners.forEach(listener => listener(sharedIsPolling));
  }
};

export const useTrainingPolling = ({
  models,
  onModelUpdate,
  pollingInterval = DEFAULT_POLLING_INTERVAL,
  enabled = true,
  maxRetries = MAX_RETRY_ATTEMPTS,
}: UseTrainingPollingOptions): UseTrainingPollingReturn => {
  const [isPolling, setIsPolling] = useState(sharedIsPolling);
  const [errorCount, setErrorCount] = useState(0);
  const retryCountRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const listener = (polling: boolean) => {
      setIsPolling(polling);
    };
    pollingListeners.add(listener);
    return () => {
      pollingListeners.delete(listener);
    };
  }, []);

  const getModelsWithActiveTrainings = useCallback((): Model[] => {
    return models.filter(model => model.status === 'training');
  }, [models]);

  const fetchModelUpdate = useCallback(
    async (modelId: string): Promise<void> => {
      try {
        const apiModel = await ModelsService.getModel(modelId);
        const legacyModel = ModelsAdapter.apiModelToLegacy(apiModel);
        onModelUpdate(legacyModel);

        delete retryCountRef.current[modelId];
      } catch {
        const currentRetries = retryCountRef.current[modelId] || 0;
        retryCountRef.current[modelId] = currentRetries + 1;

        setErrorCount(prev => prev + 1);

        if (currentRetries >= maxRetries) {
          delete retryCountRef.current[modelId];
        }
      }
    },
    [onModelUpdate, maxRetries, setErrorCount]
  );

  const pollForUpdates = useCallback(async (): Promise<void> => {
    if (!enabled) {
      return;
    }

    const modelIds = getModelsWithActiveTrainings();

    if (modelIds.length === 0) {
      if (sharedIntervalId) {
        clearInterval(sharedIntervalId);
        sharedIntervalId = null;
        setSharedIsPolling(false);
      }
      return;
    }

    const updatePromises = modelIds.map(model => fetchModelUpdate(model.id));
    await Promise.allSettled(updatePromises);

    const updatedModelIds = getModelsWithActiveTrainings();
    if (updatedModelIds.length === 0 && sharedIntervalId) {
      clearInterval(sharedIntervalId);
      sharedIntervalId = null;
      setSharedIsPolling(false);
    }
  }, [enabled, getModelsWithActiveTrainings, fetchModelUpdate]);

  const startPolling = useCallback((): void => {
    if (sharedIntervalId || !enabled) return;

    pollForUpdates();

    sharedIntervalId = setInterval(pollForUpdates, pollingInterval);
    setSharedIsPolling(true);
  }, [enabled, pollingInterval, pollForUpdates]);

  const stopPolling = useCallback((): void => {
    if (sharedIntervalId) {
      clearInterval(sharedIntervalId);
      sharedIntervalId = null;
      setSharedIsPolling(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      stopPolling();
      return;
    }

    const modelsWithActiveTrainings = getModelsWithActiveTrainings();

    if (modelsWithActiveTrainings.length > 0) {
      if (isPolling) {
        stopPolling();
        setTimeout(() => startPolling(), 100);
      } else {
        startPolling();
      }
    } else if (modelsWithActiveTrainings.length === 0 && isPolling) {
      stopPolling();
    }
  }, [
    models,
    enabled,
    isPolling,
    getModelsWithActiveTrainings,
    startPolling,
    stopPolling,
  ]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    startPolling,
    stopPolling,
    isPolling,
    errorCount,
  };
};
