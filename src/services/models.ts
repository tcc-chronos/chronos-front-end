import { api } from './api';
import type { ApiModel } from '../types/training';
import type { CreateModelPayload } from '../store/trainingSidebarStore';
import type { DevicesResponse, ModelType } from '../types/api';
import type { PredictionResponse } from '../types/prediction';

export type { ModelType, DevicesResponse };

export class ModelsService {
  static async getModels(): Promise<ApiModel[]> {
    return api.get<ApiModel[]>('/models');
  }

  static async getModel(id: string): Promise<ApiModel> {
    return api.get<ApiModel>(`/models/${id}`);
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
