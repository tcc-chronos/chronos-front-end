export interface PredictionDataPoint {
  timestamp: string;
  value: number;
}

export interface PredictionResult {
  step: number;
  value: number;
  timestamp: string;
}

export interface PredictionTrainingMetrics {
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

export interface PredictionModelInfo {
  name: string;
  description: string;
  model_type: string;
  epochs: number;
  batch_size: number;
  learning_rate: number;
}

export interface PredictionMetadata {
  entity_type: string;
  entity_id: string;
  feature: string;
  model_status: string;
  training_metrics: PredictionTrainingMetrics;
  model_info: PredictionModelInfo;
  training_job_metadata_id: string;
  model_artifact_id: string;
  x_scaler_artifact_id: string;
  y_scaler_artifact_id: string;
  stored_metadata: {
    model_id: string;
    training_job_id: string;
    timestamp: string;
    window_size: number;
    feature_columns: string[];
    training_history: {
      best_epoch: number;
      epochs_trained: number;
      history: {
        loss: number[];
        val_loss: number[];
      };
    };
    test_metrics: PredictionTrainingMetrics;
    training_duration: number;
    data_info: {
      total_points: number;
      train_sequences: number;
      val_sequences: number;
      test_sequences: number;
      validation_ratio: number;
      test_ratio: number;
    };
    model_config: {
      model_type: string;
      rnn_layers: Array<{
        units: number;
        dropout: number;
        recurrent_dropout: number;
      }>;
      dense_layers: Array<{
        units: number;
        dropout: number;
        activation: string;
      }>;
      batch_size: number;
      epochs: number;
      learning_rate: number;
      validation_ratio: number;
      test_ratio: number;
      lookback_window: number;
      forecast_horizon: number;
    };
  };
}

export interface PredictionResponse {
  model_id: string;
  training_job_id: string;
  lookback_window: number;
  forecast_horizon: number;
  generated_at: string;
  context_window: PredictionDataPoint[];
  predictions: PredictionResult[];
  metadata: PredictionMetadata;
}
