import { createContext, useContext } from 'react';
import type { PredictionResponse } from '../types/prediction';

export interface PredictionContextType {
  predictionData: PredictionResponse | null;
  setPredictionData: (data: PredictionResponse | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const PredictionContext = createContext<
  PredictionContextType | undefined
>(undefined);

export const usePrediction = (): PredictionContextType => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within a PredictionProvider');
  }
  return context;
};
