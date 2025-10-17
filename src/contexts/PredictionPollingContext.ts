import { createContext, useContext } from 'react';

export interface PredictionPollingContextType {
  isPolling: boolean;
  startPolling: (modelId: string, trainingId: string) => void;
  stopPolling: () => void;
  togglePolling: (modelId: string, trainingId: string) => void;
  clearSelection: () => void;
}

export const PredictionPollingContext = createContext<
  PredictionPollingContextType | undefined
>(undefined);

export const usePredictionPolling = (): PredictionPollingContextType => {
  const context = useContext(PredictionPollingContext);
  if (!context) {
    throw new Error(
      'usePredictionPolling must be used within a PredictionPollingProvider'
    );
  }
  return context;
};
