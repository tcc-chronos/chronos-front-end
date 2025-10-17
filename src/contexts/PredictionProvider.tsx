import React, { useState, useCallback } from 'react';
import {
  PredictionContext,
  type PredictionContextType,
} from './PredictionContext';
import type { PredictionResponse } from '../types/prediction';

interface PredictionProviderProps {
  children: React.ReactNode;
}

export const PredictionProvider: React.FC<PredictionProviderProps> = ({
  children,
}) => {
  const [predictionData, setPredictionData] =
    useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Wrapper para logar mudanças sem forçar nova referência desnecessária
  const setPredictionDataWithLog = useCallback(
    (data: PredictionResponse | null) => {
      console.log('💾 [PredictionProvider] Atualizando predictionData:', {
        hasData: !!data,
        contextWindow: data?.context_window?.length,
        predictions: data?.predictions?.length,
        feature: data?.metadata?.feature,
        generatedAt: data?.generated_at,
        isNewData: data?.generated_at !== predictionData?.generated_at,
      });

      // Apenas atualizar se realmente mudou
      if (
        !data ||
        !predictionData ||
        data.generated_at !== predictionData.generated_at
      ) {
        setPredictionData(data);
      }
    },
    [predictionData]
  );

  const value: PredictionContextType = {
    predictionData,
    setPredictionData: setPredictionDataWithLog,
    isLoading,
    setIsLoading,
  };

  return (
    <PredictionContext.Provider value={value}>
      {children}
    </PredictionContext.Provider>
  );
};
