export interface TrainingMetrics {
  success: boolean;
  training_time: number;
  training_datetime: string;
  mean_absolute_error: number;
  mean_squared_error?: number;
  root_mean_squared_error: number;
  theil_u?: number;
  model_type?: string;
  data_volume?: number;
  // Novos campos baseados na resposta da API
  timestamp?: string;
  training_duration?: number;
  total_points?: number;
}

export interface TrainingMetricsReportProps {
  metrics: TrainingMetrics | null;
  className?: string;
}
