import { useCallback, useEffect, useRef, useState } from 'react';
import { ModelsService } from '../services/models';
import { ModelsAdapter } from '../utils/modelsAdapter';
import type { Model } from '../types/training';

// Constants for better maintainability
const DEFAULT_POLLING_INTERVAL = 5000; // 5 seconds
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

/**
 * Hook to manage polling for training updates
 * Monitors models with pending/running trainings and updates them periodically
 * Includes error handling and automatic retry logic
 */
export const useTrainingPolling = ({
  models,
  onModelUpdate,
  pollingInterval = DEFAULT_POLLING_INTERVAL,
  enabled = true,
  maxRetries = MAX_RETRY_ATTEMPTS,
}: UseTrainingPollingOptions): UseTrainingPollingReturn => {
  const intervalRef = useRef<number | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const retryCountRef = useRef<Record<string, number>>({});

  /**
   * Get models that have active trainings that need polling
   * Considers both model status and individual training status
   * Stops polling when:
   * - Model status is not 'training' AND
   * - All trainings are in final state ('completed' or 'failed')
   */
  const getModelsWithActiveTrainings = useCallback((): string[] => {
    return models
      .filter(model => {
        // If model is actively training, keep polling
        if (model.status === 'training') {
          return true;
        }
      })
      .map(model => model.id);
  }, [models]);

  /**
   * Fetch updated model data from API with retry logic
   */
  const fetchModelUpdate = useCallback(
    async (modelId: string): Promise<void> => {
      try {
        const apiModel = await ModelsService.getModel(modelId);
        const legacyModel = ModelsAdapter.apiModelToLegacy(apiModel);
        onModelUpdate(legacyModel);

        // Reset retry count on success
        delete retryCountRef.current[modelId];
      } catch (error) {
        // Increment retry count for this specific model
        const currentRetries = retryCountRef.current[modelId] || 0;
        retryCountRef.current[modelId] = currentRetries + 1;

        setErrorCount(prev => prev + 1);

        // Log error for debugging
        console.error(
          `Error fetching model ${modelId} update (attempt ${currentRetries + 1}):`,
          error
        );

        // If max retries reached, remove from retry tracking
        if (currentRetries >= maxRetries) {
          delete retryCountRef.current[modelId];
          console.warn(
            `Max retries reached for model ${modelId}, stopping retries`
          );
        }
      }
    },
    [onModelUpdate, maxRetries, setErrorCount]
  );

  /**
   * Poll for updates on models with active trainings
   */
  const pollForUpdates = useCallback(async (): Promise<void> => {
    if (!enabled) return;

    const modelIds = getModelsWithActiveTrainings();

    if (modelIds.length === 0) {
      // No models with active trainings, stop polling
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsPolling(false);
        console.log('Training polling stopped - no active trainings');
      }
      return;
    }

    // Fetch updates for all models with active trainings
    const updatePromises = modelIds.map(fetchModelUpdate);
    await Promise.allSettled(updatePromises);

    // Check again after updates to see if any models finished training
    const updatedModelIds = getModelsWithActiveTrainings();
    if (updatedModelIds.length === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsPolling(false);
      console.log('Training polling stopped - all trainings completed');
    }
  }, [enabled, getModelsWithActiveTrainings, fetchModelUpdate]);

  /**
   * Start polling for training updates
   */
  const startPolling = useCallback((): void => {
    if (intervalRef.current || !enabled) return;

    // Initial poll
    pollForUpdates();

    // Set up interval
    intervalRef.current = setInterval(pollForUpdates, pollingInterval);
    setIsPolling(true);

    console.log('Training polling started');
  }, [enabled, pollingInterval, pollForUpdates]);

  /**
   * Stop polling for training updates
   */
  const stopPolling = useCallback((): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsPolling(false);
      console.log('Training polling stopped');
    }
  }, []);

  /**
   * Auto-start/stop polling based on active trainings
   */
  useEffect(() => {
    if (!enabled) {
      stopPolling();
      return;
    }

    const modelsWithActiveTrainings = getModelsWithActiveTrainings();

    if (modelsWithActiveTrainings.length > 0 && !isPolling) {
      startPolling();
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

  /**
   * Cleanup on unmount
   */
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
