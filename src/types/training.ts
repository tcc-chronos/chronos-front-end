export interface TrainingMetrics {
  mae: number;
  mse: number;
  rmse: number;
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
  rnnType: 'LSTM' | 'GRU' | 'SimpleRNN';
  createdAt: string;
  device: 'CPU' | 'GPU';
  attribute: string;
  status: 'idle' | 'training' | 'completed' | 'error';
  trainings: ModelTraining[];
}

export interface CreateTrainingRequest {
  modelId: string;
  dataVolume: number;
}

export interface TrainingFormData {
  dataVolume: number;
}
