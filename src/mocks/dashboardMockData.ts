// Mock data para testes visuais dos componentes Dashboard
// Este arquivo pode ser removido após integração com a API real

import type { ChartDataPoint } from '../components/organisms/LineChart/LineChart.types';
import type { TrainingMetrics } from '../components/organisms/TrainingMetricsReport/TrainingMetricsReport.types';

export const mockChartData: ChartDataPoint[] = [
  { dataHora: '2024-01-15T08:00:00', real: 23.5, previsao: 23.2 },
  { dataHora: '2024-01-15T09:00:00', real: 24.1, previsao: 24.3 },
  { dataHora: '2024-01-15T10:00:00', real: 25.8, previsao: 25.5 },
  { dataHora: '2024-01-15T11:00:00', real: 27.2, previsao: 27.8 },
  { dataHora: '2024-01-15T12:00:00', real: 28.9, previsao: 28.5 },
  { dataHora: '2024-01-15T13:00:00', real: 29.5, previsao: 29.8 },
  { dataHora: '2024-01-15T14:00:00', real: 28.7, previsao: 28.9 },
  { dataHora: '2024-01-15T15:00:00', real: 27.3, previsao: 27.1 },
  { dataHora: '2024-01-15T16:00:00', real: null, previsao: 26.2 },
  { dataHora: '2024-01-15T17:00:00', real: null, previsao: 25.4 },
  { dataHora: '2024-01-15T18:00:00', real: null, previsao: 24.8 },
];

export const mockTrainingMetrics: TrainingMetrics = {
  success: true,
  training_time: 127.5,
  training_datetime: '2024-01-15T07:30:00',
  mean_absolute_error: 0.342,
  root_mean_squared_error: 0.518,
  model_type: 'LSTM',
  data_volume: 15420,
};

export const mockFailedTrainingMetrics: TrainingMetrics = {
  success: false,
  training_time: 15.2,
  training_datetime: '2024-01-14T18:45:00',
  mean_absolute_error: 2.145,
  root_mean_squared_error: 3.872,
  model_type: 'GRU',
  data_volume: 8750,
};
