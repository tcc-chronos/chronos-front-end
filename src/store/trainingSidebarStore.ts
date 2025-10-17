import { create } from 'zustand';
import type { DeviceType } from '../types/api';
import type { ModelType } from '../services/models';

export interface LayerConfig {
  neurons: number;
  dropout: number;
}

export interface CreateModelPayload {
  name: string;
  description: string;
  model_type: 'lstm' | 'gru';
  entity_type: string;
  entity_id: string;
  feature: string;
  epochs: number;
  forecast_horizon: number;
  lookback_window: number;
  learning_rate: number;
  early_stopping_patience: number;
  batch_size: number;
  test_ratio: number;
  validation_ratio: number;
  rnn_layers: Array<{
    units: number;
    dropout: number;
    recurrent_dropout: number;
  }>;
  dense_layers: Array<{
    units: number;
    activation: string;
    dropout: number;
  }>;
}

export interface TrainingSidebarState {
  rnn_type?: 'gru' | 'lstm';
  entity_type?: string;
  entity_id?: string;
  feature?: string;
  column_data: string;
  epochs: number;
  forecast_horizon: number;
  lookback_window: number;
  learning_rate: number;
  early_stopping_patience?: number;
  multi_feature: boolean;
  rnn_units: LayerConfig[];
  dense_units: LayerConfig[];
  dense_activation: string;
  bidirecional: boolean;
  batch_size: number;
  devices: DeviceType[];
  devicesLoading: boolean;
  devicesError: string | null;
  devicesLastFetch: number | null;
  modelTypes: ModelType[];
  modelTypesLoading: boolean;
  modelTypesError: string | null;
  modelTypesLastFetch: number | null;
  setField: <K extends keyof TrainingSidebarState>(
    key: K,
    value: TrainingSidebarState[K]
  ) => void;
  setFields: (fields: Partial<TrainingSidebarState>) => void;
  setDevices: (devices: DeviceType[]) => void;
  setDevicesLoading: (loading: boolean) => void;
  setDevicesError: (error: string | null) => void;
  clearDevicesCache: () => void;
  shouldFetchDevices: () => boolean;
  setModelTypes: (modelTypes: ModelType[]) => void;
  setModelTypesLoading: (loading: boolean) => void;
  setModelTypesError: (error: string | null) => void;
  clearModelTypesCache: () => void;
  shouldFetchModelTypes: () => boolean;
  isValid: () => boolean;
  getCreateModelPayload: () => CreateModelPayload;
}

const CACHE_DURATION = 5 * 60 * 1000;

const defaultValues: Omit<
  TrainingSidebarState,
  | 'setField'
  | 'setFields'
  | 'setDevices'
  | 'setDevicesLoading'
  | 'setDevicesError'
  | 'clearDevicesCache'
  | 'shouldFetchDevices'
  | 'setModelTypes'
  | 'setModelTypesLoading'
  | 'setModelTypesError'
  | 'clearModelTypesCache'
  | 'shouldFetchModelTypes'
  | 'isValid'
  | 'getCreateModelPayload'
> = {
  rnn_type: undefined,
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
  devices: [],
  devicesLoading: false,
  devicesError: null,
  devicesLastFetch: null,
  modelTypes: [],
  modelTypesLoading: false,
  modelTypesError: null,
  modelTypesLastFetch: null,
};

export const useTrainingSidebarStore = create<TrainingSidebarState>(
  (set, get) => ({
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
    setDevices: (devices: DeviceType[]) => {
      set({
        devices,
        devicesError: null,
        devicesLastFetch: Date.now(),
      });
    },
    setDevicesLoading: (loading: boolean) => {
      set({ devicesLoading: loading });
    },
    setDevicesError: (error: string | null) => {
      set({ devicesError: error, devicesLoading: false });
    },
    clearDevicesCache: () => {
      set({
        devices: [],
        devicesError: null,
        devicesLastFetch: null,
        devicesLoading: false,
      });
    },
    shouldFetchDevices: (): boolean => {
      const state = get();
      if (state.devicesLoading) return false;
      if (
        state.devices.length > 0 &&
        state.devicesLastFetch &&
        Date.now() - state.devicesLastFetch < CACHE_DURATION
      ) {
        return false;
      }
      return true;
    },
    setModelTypes: (modelTypes: ModelType[]) => {
      set({
        modelTypes,
        modelTypesError: null,
        modelTypesLastFetch: Date.now(),
      });
    },
    setModelTypesLoading: (loading: boolean) => {
      set({ modelTypesLoading: loading });
    },
    setModelTypesError: (error: string | null) => {
      set({ modelTypesError: error, modelTypesLoading: false });
    },
    clearModelTypesCache: () => {
      set({
        modelTypes: [],
        modelTypesError: null,
        modelTypesLastFetch: null,
        modelTypesLoading: false,
      });
    },
    shouldFetchModelTypes: (): boolean => {
      const state = get();
      if (state.modelTypesLoading) return false;
      if (
        state.modelTypes.length > 0 &&
        state.modelTypesLastFetch &&
        Date.now() - state.modelTypesLastFetch < CACHE_DURATION
      ) {
        return false;
      }
      return true;
    },
    isValid: (): boolean => {
      const state = get();
      return !!(
        state.entity_type &&
        state.entity_id &&
        state.feature &&
        state.epochs > 0 &&
        state.forecast_horizon > 0 &&
        state.lookback_window > 0 &&
        state.learning_rate > 0 &&
        state.batch_size > 0 &&
        state.rnn_units.length > 0 &&
        state.dense_units.length > 0
      );
    },
    getCreateModelPayload: (): CreateModelPayload => {
      const state = get();
      if (!state.rnn_type) {
        throw new Error('RNN type is required');
      }
      const modelName = `${state.rnn_type.toUpperCase()} - ${state.feature}`;
      const description = `${state.rnn_type.toUpperCase()} model for ${state.feature} forecasting`;

      return {
        name: modelName,
        description,
        model_type: state.rnn_type,
        entity_type: state.entity_type!,
        entity_id: state.entity_id!,
        feature: state.feature!,
        epochs: state.epochs,
        forecast_horizon: state.forecast_horizon,
        lookback_window: state.lookback_window,
        learning_rate: state.learning_rate,
        early_stopping_patience: state.early_stopping_patience || 10,
        batch_size: state.batch_size,
        test_ratio: 0.15,
        validation_ratio: 0.15,
        rnn_layers: state.rnn_units.map((layer: LayerConfig) => ({
          units: layer.neurons,
          dropout: layer.dropout,
          recurrent_dropout: state.bidirecional ? 0.05 : 0,
        })),
        dense_layers: state.dense_units.map((layer: LayerConfig) => ({
          units: layer.neurons,
          activation: state.dense_activation,
          dropout: layer.dropout,
        })),
      };
    },
  })
);
