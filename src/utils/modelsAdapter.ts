import type {
  ApiModel,
  Model,
  ModelTraining,
  TrainingMetrics,
} from '../types/training';

export class ModelsAdapter {
  static apiModelToLegacy(apiModel: ApiModel): Model {
    return {
      id: apiModel.id,
      name: apiModel.name,
      rnnType: apiModel.model_type.toUpperCase(),
      createdAt: apiModel.created_at,
      device: apiModel.entity_id,
      attribute: apiModel.feature,
      status: apiModel.status,
      trainings: apiModel.trainings.map(ModelsAdapter.apiTrainingToLegacy),
    };
  }
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
