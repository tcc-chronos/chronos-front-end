import type { PredictionResponse } from '../types/prediction';
import type { ChartDataPoint } from '../components/organisms/LineChart/LineChart.types';
import type { TrainingMetrics } from '../components/organisms/TrainingMetricsReport/TrainingMetricsReport.types';

/**
 * Converte os dados da resposta da API de predição para o formato do gráfico
 * Exibe os pontos do context_window (valores reais) e as predictions (valores previstos)
 * Inclui uma linha de conexão pontilhada entre o último ponto real e a primeira previsão
 */
export const convertPredictionToChartData = (
  prediction: PredictionResponse
): ChartDataPoint[] => {
  const chartData: ChartDataPoint[] = [];

  prediction.context_window.forEach(point => {
    chartData.push({
      dataHora: point.timestamp,
      real: point.value,
      previsao: null,
      conexao: null,
    });
  });

  const lastContextPoint =
    prediction.context_window[prediction.context_window.length - 1];
  const firstPrediction = prediction.predictions[0];

  if (lastContextPoint && firstPrediction) {
    chartData[chartData.length - 1].conexao = lastContextPoint.value;
    chartData.push({
      dataHora: firstPrediction.timestamp,
      real: null,
      previsao: firstPrediction.value,
      conexao: firstPrediction.value,
    });

    prediction.predictions.slice(1).forEach(pred => {
      chartData.push({
        dataHora: pred.timestamp,
        real: null,
        previsao: pred.value,
        conexao: null,
      });
    });
  } else {
    prediction.predictions.forEach(pred => {
      chartData.push({
        dataHora: pred.timestamp,
        real: null,
        previsao: pred.value,
        conexao: null,
      });
    });
  }

  return chartData;
};

/**
 * Converte as métricas da resposta da API para o formato do TrainingMetricsReport
 */
export const convertPredictionToTrainingMetrics = (
  prediction: PredictionResponse
): TrainingMetrics => {
  const { training_metrics, stored_metadata, model_info } = prediction.metadata;

  return {
    success: true, // Se chegou até aqui, a predição foi bem-sucedida
    training_time: stored_metadata.training_duration,
    training_datetime: prediction.generated_at,
    mean_absolute_error: training_metrics.mae,
    mean_squared_error: training_metrics.mse,
    root_mean_squared_error: training_metrics.rmse,
    theil_u: training_metrics.theil_u,
    model_type: model_info.model_type,
    data_volume: stored_metadata.data_info.total_points,
  };
};

/**
 * Extrai o nome da feature/atributo dos dados da predição
 * Formato: {feature} - {entity_id}
 */
export const getPredictionFeatureName = (
  prediction: PredictionResponse
): string => {
  const featureName = prediction.metadata.feature;
  const entityId = prediction.metadata.entity_id;

  return `${featureName} - ${entityId}`;
};
