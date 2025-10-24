import type {
  ApiModel,
  ApiTraining,
  Model,
  ModelTraining,
  TrainingMetrics,
} from '../types/training';

export class ModelsAdapter {
  static apiModelToLegacy(
    apiModel: ApiModel,
    trainings?: ApiTraining[]
  ): Model {
    const baseTrainings = apiModel.trainings ?? [];
    const detailTrainings = trainings ?? [];

    const trainingsMap = new Map<string, ApiTraining>();

    baseTrainings.forEach(training => {
      trainingsMap.set(training.id, { ...training });
    });

    detailTrainings.forEach(training => {
      const existing = trainingsMap.get(training.id);
      trainingsMap.set(
        training.id,
        existing ? { ...existing, ...training } : { ...training }
      );
    });

    const normalizedTrainings = Array.from(trainingsMap.values());

    return {
      id: apiModel.id,
      name: apiModel.name,
      rnnType: apiModel.model_type.toUpperCase(),
      createdAt: apiModel.created_at,
      device: apiModel.entity_id,
      attribute: apiModel.feature,
      status: apiModel.status,
      epochsConfigured: apiModel.epochs ?? null,
      trainings: normalizedTrainings.map(training =>
        ModelsAdapter.apiTrainingToLegacy(training, apiModel.epochs)
      ),
    };
  }
  static apiTrainingToLegacy(
    apiTraining: ApiTraining,
    configuredEpochs?: number | null
  ): ModelTraining {
    const trainingHistory = apiTraining.training_history
      ? {
          bestEpoch: apiTraining.training_history.best_epoch,
          epochsTrained: apiTraining.training_history.epochs_trained,
          loss: apiTraining.training_history.history.loss,
          valLoss: apiTraining.training_history.history.val_loss,
        }
      : null;

    return {
      id: apiTraining.id,
      trainingDate: apiTraining.created_at,
      dataVolume:
        apiTraining.total_data_points_collected ??
        apiTraining.total_data_points_requested ??
        0,
      error: apiTraining.error,
      metrics: apiTraining.metrics
        ? ModelsAdapter.apiMetricsToLegacy(apiTraining.metrics)
        : {
            mae: 0,
            mse: 0,
            rmse: 0,
            theil_u: 0,
          },
      status: apiTraining.status,
      metadataArtifactId: apiTraining.metadata_artifact_id ?? null,
      configuredEpochs: configuredEpochs ?? null,
      trainingHistory,
    };
  }

  static apiMetricsToLegacy(
    apiMetrics: ApiTraining['metrics']
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
