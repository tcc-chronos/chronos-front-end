export interface ApiTrainingMetrics {
  mse: number;
  mae: number;
  rmse: number;
  theil_u: number;
  mape: number;
  r2: number;
  mae_pct: number;
  rmse_pct: number;
  best_train_loss: number;
  best_val_loss: number;
  best_epoch: number;
}

export interface ApiRnnLayer {
  units: number;
  dropout: number;
  recurrent_dropout: number;
}

export interface ApiDenseLayer {
  units: number;
  dropout: number;
  activation: string;
}

export interface ApiTrainingHistory {
  best_epoch: number;
  epochs_trained: number;
  history: {
    loss: number[];
    val_loss: number[];
  };
}

export interface ApiTraining {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  model_id: string;
  start_time?: string;
  end_time?: string | null;
  error?: string | null;
  data_collection_progress?: number;
  total_data_points_requested?: number;
  total_data_points_collected?: number;
  created_at: string;
  updated_at?: string;
  metrics?: ApiTrainingMetrics | null;
  metadata_artifact_id?: string | null;
  training_history?: ApiTrainingHistory | null;
  prediction_enabled?: boolean;
  next_prediction_at?: string | null;
}

export interface ApiModel {
  id: string;
  name: string;
  description: string;
  model_type: string;
  status: 'created' | 'trained' | 'training' | 'error';
  batch_size: number;
  epochs: number;
  learning_rate: number;
  validation_ratio: number;
  test_ratio: number;
  rnn_layers: ApiRnnLayer[];
  dense_layers: ApiDenseLayer[];
  early_stopping_patience: number;
  lookback_window: number;
  forecast_horizon: number;
  feature: string;
  entity_type: string;
  entity_id: string;
  created_at: string;
  updated_at: string;
  trainings?: ApiTraining[];
}

export interface TrainingMetrics {
  mae: number;
  mse: number;
  rmse: number;
  theil_u: number;
}

export interface TrainingHistory {
  bestEpoch: number;
  epochsTrained: number;
  loss: number[];
  valLoss: number[];
}

export interface ModelTraining {
  id: string;
  trainingDate: string;
  dataVolume: number;
  metrics: TrainingMetrics;
  error?: string | null;
  status:
    | 'pending'
    | 'running'
    | 'collecting_data'
    | 'preprocessing'
    | 'training'
    | 'completed'
    | 'failed';
  metadataArtifactId?: string | null;
  configuredEpochs?: number | null;
  trainingHistory?: TrainingHistory | null;
}

export interface Model {
  id: string;
  name: string;
  rnnType: string;
  createdAt: string;
  device: string;
  attribute: string;
  status: string;
  epochsConfigured?: number | null;
  trainings: ModelTraining[];
}

export interface CreateTrainingRequest {
  modelId: string;
  dataVolume: number;
}

export interface TrainingFormData {
  dataVolume: number;
}
