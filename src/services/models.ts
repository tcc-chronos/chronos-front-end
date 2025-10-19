import { api } from './api';
import type { ApiModel, ApiTraining } from '../types/training';
import type { CreateModelPayload } from '../store/trainingSidebarStore';
import type { DevicesResponse, ModelType } from '../types/api';
import type { PredictionResponse } from '../types/prediction';

export type { ModelType, DevicesResponse };

export class ModelsService {
  static async getModels(): Promise<ApiModel[]> {
    return api.get<ApiModel[]>('/models');
  }

  static async getModel(id: string): Promise<ApiModel> {
    const [model, trainings] = await Promise.all([
      api.get<ApiModel>(`/models/${id}`),
      ModelsService.getModelTrainings(id).catch(() => []),
    ]);

    const mergedTrainings = ModelsService.mergeTrainings(
      model.trainings ?? [],
      trainings
    );

    return {
      ...model,
      trainings: mergedTrainings,
    };
  }

  static async createModel(modelData: CreateModelPayload): Promise<ApiModel> {
    return api.post<ApiModel>('/models', modelData);
  }

  static async updateModel(
    id: string,
    modelData: Partial<
      Omit<ApiModel, 'id' | 'created_at' | 'updated_at' | 'trainings'>
    >
  ): Promise<ApiModel> {
    return api.put<ApiModel>(`/models/${id}`, modelData);
  }

  static async deleteModel(id: string): Promise<void> {
    return api.delete<void>(`/models/${id}`);
  }

  static async createTraining(
    modelId: string,
    trainingData: { dataVolume: number }
  ): Promise<void> {
    const payload = { last_n: trainingData.dataVolume };
    return api.post<void>(`/models/${modelId}/training-jobs`, payload);
  }

  static async deleteTraining(
    modelId: string,
    trainingId: string
  ): Promise<void> {
    return api.delete<void>(`/models/${modelId}/training-jobs/${trainingId}`);
  }

  static async getModelTrainings(modelId: string): Promise<ApiTraining[]> {
    return api.get<ApiTraining[]>(`/models/${modelId}/training-jobs`);
  }

  private static mergeTrainings(
    baseTrainings: ApiTraining[] = [],
    detailTrainings: ApiTraining[] = []
  ): ApiTraining[] {
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

    return Array.from(trainingsMap.values());
  }

  static async predict(
    modelId: string,
    trainingId: string
  ): Promise<PredictionResponse> {
    return api.post<PredictionResponse>(
      `/models/${modelId}/training-jobs/${trainingId}/predict`
    );
  }

  static async getModelTypes(): Promise<ModelType[]> {
    return api.get<ModelType[]>('/models/types');
  }
}

export class DevicesService {
  static async getDevices(): Promise<DevicesResponse> {
    return api.get<DevicesResponse>('/devices/?service=smart&service_path=%2F');
  }
}
