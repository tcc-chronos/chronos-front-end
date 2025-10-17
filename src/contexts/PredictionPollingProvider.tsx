import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  PredictionPollingContext,
  type PredictionPollingContextType,
} from './PredictionPollingContext';
import { usePredictionSubmission } from '../hooks/usePredictionSubmission';
import { usePageLifecycle } from '../hooks/usePageLifecycle';

interface PredictionPollingProviderProps {
  children: React.ReactNode;
}

export const PredictionPollingProvider: React.FC<
  PredictionPollingProviderProps
> = ({ children }) => {
  const { submitPrediction } = usePredictionSubmission();
  const { isPageActive } = usePageLifecycle();
  const [isPolling, setIsPolling] = useState(false);
  const [isExplicitlyStopped, setIsExplicitlyStopped] = useState(false); // Novo estado
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
    // NÃO limpar currentSelectionRef para poder retomar depois
  }, []);

  const clearSelection = useCallback(() => {
    stopPolling();
    currentSelectionRef.current = null;
  }, [stopPolling]);

  const startPolling = useCallback(
    async (modelId: string, trainingId: string) => {
      if (!modelId || !trainingId) {
        return;
      }

      // Parar polling anterior se existir
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }

      // Salvar seleção atual
      currentSelectionRef.current = { modelId, trainingId };
      setIsPolling(true);

      // Executar a primeira predição imediatamente
      try {
        await submitPrediction(modelId, trainingId, true); // Suprimir notificação
      } catch {
        return; // Sair se houver erro na primeira predição
      }

      // Configurar polling a cada 10 segundos
      pollingIntervalRef.current = setInterval(async () => {
        const selection = currentSelectionRef.current;
        if (selection?.modelId && selection?.trainingId) {
          try {
            await submitPrediction(
              selection.modelId,
              selection.trainingId,
              true
            ); // Suprimir notificação
          } catch {
            // Error handled by hook
          }
        } else {
          // Se não há seleção válida, parar o polling
          clearInterval(pollingIntervalRef.current!);
          pollingIntervalRef.current = null;
          setIsPolling(false);
        }
      }, 10000); // 10 segundos
    },
    [submitPrediction]
  );

  const togglePolling = useCallback(
    (modelId: string, trainingId: string) => {
      if (isPolling) {
        setIsExplicitlyStopped(true);
        stopPolling();
      } else {
        setIsExplicitlyStopped(false);
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

  // Controlar polling baseado na página ativa
  useEffect(() => {
    const isDashboardActive = isPageActive('/dashboard');

    if (!isDashboardActive && isPolling) {
      stopPolling();
    } else if (
      isDashboardActive &&
      currentSelectionRef.current &&
      !isPolling &&
      !isExplicitlyStopped // Não retomar se foi explicitamente parado
    ) {
      // Aguardar um pouco para garantir que a página carregou completamente
      const timeoutId = setTimeout(() => {
        const { modelId, trainingId } = currentSelectionRef.current!;
        startPolling(modelId, trainingId);
      }, 500); // 500ms de delay

      // Cleanup do timeout se o componente for desmontado
      return () => clearTimeout(timeoutId);
    }
  }, [isPageActive, isPolling, isExplicitlyStopped, startPolling, stopPolling]);

  const value: PredictionPollingContextType = {
    isPolling,
    startPolling,
    stopPolling,
    togglePolling,
    clearSelection,
  };

  return (
    <PredictionPollingContext.Provider value={value}>
      {children}
    </PredictionPollingContext.Provider>
  );
};
