import { create } from 'zustand';

export interface TrainingSidebarState {
  // Main
  rnn_type: 'gru' | 'lstm';
  device?: string;
  attribute?: string;
  column_data: string;
  epochs: number;
  n_steps_ahead: number;

  // DataConfig
  window_size: number;
  learning_rate: number;
  dropout_rate: number;
  early_stopping_patience: number;
  multi_feature: boolean;

  // RNNConfig
  rnn_units: number[];
  dense_units: number[];

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
  device: undefined,
  attribute: undefined,
  column_data: '',
  epochs: 1,
  n_steps_ahead: 1,
  window_size: 60,
  learning_rate: 0.001,
  dropout_rate: 0.2,
  early_stopping_patience: 5,
  multi_feature: false,
  rnn_units: [128],
  dense_units: [64],
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
