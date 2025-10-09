import { useCallback, useEffect, useRef } from 'react';
import { ModelsService } from '../services/models';
import { ModelsAdapter } from '../utils/modelsAdapter';
import type { Model } from '../types/training';

interface UseTrainingPollingProps {
  models: Model[];
  onModelUpdate: (updatedModel: Model) => void;
  pollingInterval?: number; // milliseconds
  enabled?: boolean;
}

interface UseTrainingPollingReturn {
  startPolling: () => void;
  stopPolling: () => void;
  isPolling: boolean;
}

/**
 * Hook to manage polling for training updates
 * Monitors models with pending/running trainings and updates them periodically
 */
export const useTrainingPolling = ({
  models,
  onModelUpdate,
  pollingInterval = 5000, // 5 seconds default
  enabled = true,
}: UseTrainingPollingProps): UseTrainingPollingReturn => {
  const intervalRef = useRef<number | null>(null);
  const isPollingRef = useRef(false);

  /**
   * Get models that have pending or running trainings
   */
  const getModelsWithPendingTrainings = useCallback((): string[] => {
    return models
      .filter(model =>
        model.trainings.some(
          training =>
            training.status === 'pending' || training.status === 'running'
        )
      )
      .map(model => model.id);
  }, [models]);

  /**
   * Fetch updated model data from API
   */
  const fetchModelUpdate = useCallback(
    async (modelId: string): Promise<void> => {
      try {
        const apiModel = await ModelsService.getModel(modelId);
        const legacyModel = ModelsAdapter.apiModelToLegacy(apiModel);
        onModelUpdate(legacyModel);
      } catch (error) {
        // For polling, we only log errors silently to avoid spam
        // Only show user notification for repeated failures
        console.error(`Error fetching model ${modelId} update:`, error);

        // Optional: Could implement a retry counter and only show error after N failures
        // handleApiError(error, `Atualização do modelo ${modelId}`);
      }
    },
    [onModelUpdate]
  );

  /**
   * Poll for updates on models with pending trainings
   */
  const pollForUpdates = useCallback(async (): Promise<void> => {
    if (!enabled) return;

    const modelIds = getModelsWithPendingTrainings();

    if (modelIds.length === 0) {
      // No models with pending trainings, stop polling
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        isPollingRef.current = false;
      }
      return;
    }

    // Fetch updates for all models with pending trainings
    const updatePromises = modelIds.map(fetchModelUpdate);
    await Promise.allSettled(updatePromises);
  }, [enabled, getModelsWithPendingTrainings, fetchModelUpdate]);

  /**
   * Start polling for training updates
   */
  const startPolling = useCallback((): void => {
    if (intervalRef.current || !enabled) return;

    // Initial poll
    pollForUpdates();

    // Set up interval
    intervalRef.current = setInterval(pollForUpdates, pollingInterval);
    isPollingRef.current = true;

    console.log('Training polling started');
  }, [enabled, pollingInterval, pollForUpdates]);

  /**
   * Stop polling for training updates
   */
  const stopPolling = useCallback((): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      isPollingRef.current = false;
      console.log('Training polling stopped');
    }
  }, []);

  /**
   * Auto-start/stop polling based on pending trainings
   */
  useEffect(() => {
    if (!enabled) {
      stopPolling();
      return;
    }

    const modelsWithPendingTrainings = getModelsWithPendingTrainings();

    if (modelsWithPendingTrainings.length > 0 && !isPollingRef.current) {
      startPolling();
    } else if (
      modelsWithPendingTrainings.length === 0 &&
      isPollingRef.current
    ) {
      stopPolling();
    }
  }, [
    models,
    enabled,
    getModelsWithPendingTrainings,
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
    isPolling: isPollingRef.current,
  };
};
