import type {
  ApiModel,
  Model,
  ModelTraining,
  TrainingMetrics,
} from '../types/training';

/**
 * Utility functions to adapt API models to legacy format
 */
export class ModelsAdapter {
  /**
   * Convert API model to legacy model format
   */
  static apiModelToLegacy(apiModel: ApiModel): Model {
    return {
      id: apiModel.id,
      name: apiModel.name,
      rnnType: apiModel.model_type.toUpperCase(),
      createdAt: apiModel.created_at,
      device: apiModel.entity_id, // Default value as API doesn't provide this
      attribute: apiModel.feature,
      status: apiModel.status,
      trainings: apiModel.trainings.map(ModelsAdapter.apiTrainingToLegacy),
    };
  }

  /**
   * Convert API training to legacy training format
   */
  static apiTrainingToLegacy(
    apiTraining: ApiModel['trainings'][number]
  ): ModelTraining {
    return {
      id: apiTraining.id,
      trainingDate: apiTraining.created_at,
      dataVolume: apiTraining.total_data_points_collected || 0,
      metrics: apiTraining.metrics
        ? ModelsAdapter.apiMetricsToLegacy(apiTraining.metrics)
        : {
            mae: 0,
            mse: 0,
            rmse: 0,
            theil_u: 0,
          },
      status: apiTraining.status,
    };
  }

  /**
   * Convert API metrics to legacy metrics format
   */
  static apiMetricsToLegacy(
    apiMetrics: ApiModel['trainings'][number]['metrics']
  ): TrainingMetrics {
    if (!apiMetrics) {
      return { mae: 0, mse: 0, rmse: 0, theil_u: 0 };
    }

    return {
      mae: apiMetrics.mae,
      mse: apiMetrics.mse,
      rmse: apiMetrics.rmse,
      theil_u: apiMetrics.theil_u,
    };
  }
}
