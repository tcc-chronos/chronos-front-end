import React, { useState } from 'react';
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

  // Wrapper para logar mudanças
  const setPredictionDataWithLog = (data: PredictionResponse | null) => {
    console.log('💾 [PredictionProvider] Atualizando predictionData:', {
      hasData: !!data,
      contextWindow: data?.context_window?.length,
      predictions: data?.predictions?.length,
      feature: data?.metadata?.feature,
    });
    setPredictionData(data);
  };

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
