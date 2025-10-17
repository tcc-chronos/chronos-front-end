import { useCallback } from 'react';
import { usePrediction } from '../contexts';
import { useNotifications } from './useNotifications';
import { ModelsService } from '../services/models';
import type { PredictionResponse } from '../types/prediction';

interface UsePredictionSubmissionReturn {
  submitPrediction: (
    modelId: string,
    trainingId: string,
    suppressNotification?: boolean
  ) => Promise<void>;
  isLoading: boolean;
  predictionData: PredictionResponse | null;
  clearPrediction: () => void;
}

/**
 * Hook para gerenciar submissão de predições
 */
export const usePredictionSubmission = (): UsePredictionSubmissionReturn => {
  const { predictionData, setPredictionData, isLoading, setIsLoading } =
    usePrediction();
  const { addNotification } = useNotifications();

  const submitPrediction = useCallback(
    async (
      modelId: string,
      trainingId: string,
      suppressNotification = false
    ): Promise<void> => {
      if (!modelId || !trainingId) {
        addNotification({
          type: 'error',
          title: 'Erro',
          message:
            'Selecione um modelo e um treinamento para fazer a predição.',
        });
        return;
      }

      setIsLoading(true);

      try {
        const result = await ModelsService.predict(modelId, trainingId);

        setPredictionData(result);

        // Não exibir notificação se solicitado (durante polling)
        if (!suppressNotification) {
          addNotification({
            type: 'success',
            title: 'Predição Concluída',
            message: `Predição realizada com sucesso para ${result.metadata.feature}!`,
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Erro ao realizar predição. Tente novamente.';

        addNotification({
          type: 'error',
          title: 'Erro na Predição',
          message: errorMessage,
        });

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [addNotification, setIsLoading, setPredictionData]
  );

  const clearPrediction = useCallback(() => {
    setPredictionData(null);
  }, [setPredictionData]);

  return {
    submitPrediction,
    isLoading,
    predictionData,
    clearPrediction,
  };
};
