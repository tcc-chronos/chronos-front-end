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
        console.warn(
          '⚠️ [PredictionPollingProvider] startPolling: modelId ou trainingId ausente'
        );
        return;
      }

      console.log('🚀 [PredictionPollingProvider] startPolling iniciado:', {
        modelId,
        trainingId,
        currentState: isPolling,
      });

      // Parar polling anterior se existir
      if (pollingIntervalRef.current) {
        console.log(
          '🔄 [PredictionPollingProvider] Limpando polling anterior...'
        );
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }

      // Salvar seleção atual
      currentSelectionRef.current = { modelId, trainingId };
      setIsPolling(true);

      // Executar a primeira predição imediatamente
      try {
        console.log(
          `🚀 [Polling] Iniciando polling - Primeira predição às ${new Date().toLocaleTimeString(
            'pt-BR',
            {
              timeZone: 'America/Sao_Paulo',
            }
          )}`
        );
        await submitPrediction(modelId, trainingId, true); // Suprimir notificação
        console.log(
          `✅ [Polling] Primeira predição concluída - Gráfico inicializado`
        );
      } catch (error) {
        console.error('❌ [Polling] Erro na predição inicial:', error);
        return; // Sair se houver erro na primeira predição
      }

      // Configurar polling a cada 10 segundos
      pollingIntervalRef.current = setInterval(async () => {
        const selection = currentSelectionRef.current;
        if (selection?.modelId && selection?.trainingId) {
          try {
            console.log(
              `🔄 [Polling] Executando predição às ${new Date().toLocaleTimeString(
                'pt-BR',
                {
                  timeZone: 'America/Sao_Paulo',
                }
              )}...`
            );
            await submitPrediction(
              selection.modelId,
              selection.trainingId,
              true
            ); // Suprimir notificação
            console.log(
              `✅ [Polling] Predição concluída - Gráfico atualizado às ${new Date().toLocaleTimeString(
                'pt-BR',
                {
                  timeZone: 'America/Sao_Paulo',
                }
              )}`
            );
          } catch (error) {
            console.error('❌ [Polling] Erro no polling de predição:', error);
          }
        } else {
          // Se não há seleção válida, parar o polling
          console.warn('⚠️ [Polling] Seleção inválida, parando polling');
          clearInterval(pollingIntervalRef.current!);
          pollingIntervalRef.current = null;
          setIsPolling(false);
        }
      }, 10000); // 10 segundos
    },
    [submitPrediction, isPolling]
  );

  const togglePolling = useCallback(
    (modelId: string, trainingId: string) => {
      console.log('🔄 [PredictionPollingProvider] togglePolling chamado:', {
        modelId,
        trainingId,
        isCurrentlyPolling: isPolling,
        isExplicitlyStopped,
        currentSelection: currentSelectionRef.current,
      });

      if (isPolling) {
        console.log(
          '⏹️ [PredictionPollingProvider] Parando polling explicitamente...'
        );
        setIsExplicitlyStopped(true);
        stopPolling();
      } else {
        console.log(
          '▶️ [PredictionPollingProvider] Iniciando polling e removendo flag de parada...'
        );
        setIsExplicitlyStopped(false);
        startPolling(modelId, trainingId);
      }
    },
    [isPolling, isExplicitlyStopped, startPolling, stopPolling]
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
      console.log(
        '🔄 [PredictionPolling] Pausando polling - usuário saiu do Dashboard'
      );
      stopPolling();
    } else if (
      isDashboardActive &&
      currentSelectionRef.current &&
      !isPolling &&
      !isExplicitlyStopped // Não retomar se foi explicitamente parado
    ) {
      console.log(
        '🔄 [PredictionPolling] Retomando polling - usuário voltou ao Dashboard'
      );

      // Aguardar um pouco para garantir que a página carregou completamente
      const timeoutId = setTimeout(() => {
        const { modelId, trainingId } = currentSelectionRef.current!;
        console.log(
          '📊 [PredictionPolling] Iniciando nova predição após retorno ao Dashboard'
        );
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
