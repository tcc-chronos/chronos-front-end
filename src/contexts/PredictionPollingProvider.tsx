import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  PredictionPollingContext,
  type PredictionPollingContextType,
} from './PredictionPollingContext';
import { usePredictionSubmission } from '../hooks/usePredictionSubmission';

interface PredictionPollingProviderProps {
  children: React.ReactNode;
}

export const PredictionPollingProvider: React.FC<
  PredictionPollingProviderProps
> = ({ children }) => {
  const { submitPrediction } = usePredictionSubmission();
  const [isPolling, setIsPolling] = useState(false);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );
  const currentSelectionRef = useRef<{
    modelId: string;
    trainingId: string;
  } | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPolling(false);
    currentSelectionRef.current = null;
  }, []);

  const startPolling = useCallback(
    async (modelId: string, trainingId: string) => {
      if (!modelId || !trainingId) return;

      // Salvar seleção atual
      currentSelectionRef.current = { modelId, trainingId };

      // Executar a primeira predição imediatamente
      try {
        console.log(
          `🚀 [Polling] Iniciando polling - Primeira predição às ${new Date().toLocaleTimeString()}`
        );
        await submitPrediction(modelId, trainingId);
        console.log(
          `✅ [Polling] Primeira predição concluída - Gráfico inicializado`
        );
      } catch (error) {
        console.error('❌ [Polling] Erro na predição inicial:', error);
      }

      // Configurar polling a cada 1 minuto (60000ms)
      pollingIntervalRef.current = setInterval(async () => {
        const selection = currentSelectionRef.current;
        if (selection?.modelId && selection?.trainingId) {
          try {
            console.log(
              `🔄 [Polling] Executando predição às ${new Date().toLocaleTimeString()}...`
            );
            await submitPrediction(selection.modelId, selection.trainingId);
            console.log(
              `✅ [Polling] Predição concluída - Gráfico atualizado às ${new Date().toLocaleTimeString()}`
            );
          } catch (error) {
            console.error('❌ [Polling] Erro no polling de predição:', error);
          }
        }
      }, 10000); // 10 segundos

      setIsPolling(true);
    },
    [submitPrediction]
  );

  const togglePolling = useCallback(
    (modelId: string, trainingId: string) => {
      if (isPolling) {
        stopPolling();
      } else {
        startPolling(modelId, trainingId);
      }
    },
    [isPolling, startPolling, stopPolling]
  );

  // Limpar polling ao desmontar o componente
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const value: PredictionPollingContextType = {
    isPolling,
    startPolling,
    stopPolling,
    togglePolling,
  };

  return (
    <PredictionPollingContext.Provider value={value}>
      {children}
    </PredictionPollingContext.Provider>
  );
};
