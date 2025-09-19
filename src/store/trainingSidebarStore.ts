import { create } from 'zustand';

export interface LayerConfig {
  neurons: number;
  dropout: number;
}

export interface TrainingSidebarState {
  // Main
  rnn_type: 'gru' | 'lstm';
  entity_type?: string;
  entity_id?: string;
  feature?: string;
  column_data: string;
  epochs: number;
  forecast_horizon: number;
  // DataConfig
  lookback_window: number;
  learning_rate: number;
  early_stopping_patience?: number;
  multi_feature: boolean;
  // RNNConfig
  rnn_units: LayerConfig[];
  dense_units: LayerConfig[];
  // Extras
  dense_activation: string;
  bidirecional: boolean;
  batch_size: number;
  // Métodos
  setField: <K extends keyof TrainingSidebarState>(
    key: K,
    value: TrainingSidebarState[K]
  ) => void;
  setFields: (fields: Partial<TrainingSidebarState>) => void;
}

const defaultValues: Omit<TrainingSidebarState, 'setField' | 'setFields'> = {
  rnn_type: 'gru',
  entity_type: undefined,
  entity_id: undefined,
  feature: undefined,
  column_data: '',
  epochs: 1,
  forecast_horizon: 1,
  lookback_window: 60,
  learning_rate: 0.001,
  early_stopping_patience: 5,
  multi_feature: false,
  rnn_units: [{ neurons: 128, dropout: 0.2 }],
  dense_units: [{ neurons: 64, dropout: 0.2 }],
  dense_activation: 'relu',
  bidirecional: false,
  batch_size: 16,
};

export const useTrainingSidebarStore = create<TrainingSidebarState>(set => ({
  ...defaultValues,
  setField: <K extends keyof TrainingSidebarState>(
    key: K,
    value: TrainingSidebarState[K]
  ) => {
    set({ [key]: value } as Partial<TrainingSidebarState>);
  },
  setFields: (fields: Partial<TrainingSidebarState>) => {
    set(fields);
  },
}));
