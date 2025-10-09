import { api } from './api';
import type { ApiModel } from '../types/training';
import type { CreateModelPayload } from '../store/trainingSidebarStore';

// Device types
export interface DeviceEntity {
  entity_name: string;
  attributes: string[];
}

export interface DeviceType {
  entity_type: string;
  entities: DeviceEntity[];
}

export interface DevicesResponse {
  devices: DeviceType[];
}

// Model types
export interface ModelType {
  value: string;
  label: string;
}

/**
 * Models service - handles all model-related API calls
 */
export class ModelsService {
  /**
   * Fetch all models from the backend
   */
  static async getModels(): Promise<ApiModel[]> {
    return api.get<ApiModel[]>('/models');
  }

  /**
   * Fetch a specific model by ID
   */
  static async getModel(id: string): Promise<ApiModel> {
    return api.get<ApiModel>(`/models/${id}`);
  }

  /**
   * Create a new model
   */
  static async createModel(modelData: CreateModelPayload): Promise<ApiModel> {
    return api.post<ApiModel>('/models', modelData);
  }

  /**
   * Update an existing model
   */
  static async updateModel(
    id: string,
    modelData: Partial<
      Omit<ApiModel, 'id' | 'created_at' | 'updated_at' | 'trainings'>
    >
  ): Promise<ApiModel> {
    return api.put<ApiModel>(`/models/${id}`, modelData);
  }

  /**
   * Delete a model
   */
  static async deleteModel(id: string): Promise<void> {
    return api.delete<void>(`/models/${id}`);
  }

  /**
   * Create a new training job for a model
   */
  static async createTraining(
    modelId: string,
    trainingData: { dataVolume: number }
  ): Promise<void> {
    // Convert dataVolume to last_n for the API
    const payload = { last_n: trainingData.dataVolume };
    return api.post<void>(`/models/${modelId}/training-jobs`, payload);
  }

  /**
   * Delete a training
   */
  static async deleteTraining(
    modelId: string,
    trainingId: string
  ): Promise<void> {
    return api.delete<void>(`/models/${modelId}/training-jobs/${trainingId}`);
  }

  /**
   * Get available model types
   */
  static async getModelTypes(): Promise<ModelType[]> {
    return api.get<ModelType[]>('/models/types');
  }
}

/**
 * Devices service - handles device-related API calls
 */
export class DevicesService {
  /**
   * Fetch all devices from the backend
   */
  static async getDevices(): Promise<DevicesResponse> {
    return api.get<DevicesResponse>('/devices/?service=smart&service_path=%2F');
  }
}
