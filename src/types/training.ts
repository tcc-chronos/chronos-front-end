// API Response Types (matching backend response)
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

export interface ApiTraining {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  start_time: string;
  end_time: string | null;
  error: string | null;
  data_collection_progress: number;
  total_data_points_requested: number;
  total_data_points_collected: number;
  created_at: string;
  updated_at: string;
  metrics: ApiTrainingMetrics | null;
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
  trainings: ApiTraining[];
}

// Legacy types for backward compatibility
export interface TrainingMetrics {
  mae: number;
  mse: number;
  rmse: number;
  theil_u: number;
}

export interface ModelTraining {
  id: string;
  trainingDate: string;
  dataVolume: number;
  metrics: TrainingMetrics;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface Model {
  id: string;
  name: string;
  rnnType: string;
  createdAt: string;
  device: string;
  attribute: string;
  status: string;
  trainings: ModelTraining[];
}

export interface CreateTrainingRequest {
  modelId: string;
  dataVolume: number;
}

export interface CreateTrainingData {
  dataVolume: number;
}

export interface TrainingFormData {
  dataVolume: number;
}
