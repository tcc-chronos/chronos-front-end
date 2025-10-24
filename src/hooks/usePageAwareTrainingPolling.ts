import { useEffect } from 'react';
import { usePageLifecycle } from './usePageLifecycle';
import { useTrainingPolling } from './useTrainingPolling';
import type { Model } from '../types/training';

interface UsePageAwareTrainingPollingOptions {
  models: Model[];
  onModelUpdate: (updatedModel: Model) => void;
  pollingInterval?: number;
  enabled?: boolean;
  targetPage: string; // Página onde o polling deve estar ativo
}

interface UsePageAwareTrainingPollingReturn {
  isPolling: boolean;
  errorCount: number;
}

export const usePageAwareTrainingPolling = ({
  models,
  onModelUpdate,
  pollingInterval = 10000,
  enabled = true,
  targetPage,
}: UsePageAwareTrainingPollingOptions): UsePageAwareTrainingPollingReturn => {
  const { isPageActive } = usePageLifecycle();
  const isOnTargetPage = isPageActive(targetPage);

  // Só habilitar o polling se estiver na página correta e se enabled for true
  const shouldEnablePolling = enabled && isOnTargetPage;

  const { startPolling, stopPolling, isPolling, errorCount } =
    useTrainingPolling({
      models,
      onModelUpdate,
      pollingInterval,
      enabled: shouldEnablePolling,
    });

  // Controlar polling baseado na mudança de página
  useEffect(() => {
    if (isOnTargetPage && enabled) {
      // Usuário entrou na página - verificar se há modelos em treinamento
      const hasActiveTrainings = models.some(
        model => model.status === 'training'
      );

      if (hasActiveTrainings && !isPolling) {
        startPolling();
      }
    } else if (!isOnTargetPage && isPolling) {
      stopPolling();
    }
  }, [
    isOnTargetPage,
    enabled,
    models,
    isPolling,
    startPolling,
    stopPolling,
    targetPage,
  ]);

  return {
    isPolling,
    errorCount,
  };
};
