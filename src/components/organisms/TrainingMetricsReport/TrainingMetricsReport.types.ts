export interface TrainingMetrics {
  success: boolean;
  training_time: number;
  training_datetime: string;
  mean_absolute_error: number;
  mean_squared_error?: number;
  root_mean_squared_error: number;
  theil_u?: number;
}

export interface TrainingMetricsReportProps {
  metrics: TrainingMetrics | null;
  className?: string;
}
