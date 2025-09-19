import { useState } from 'react';
import type { Model, CreateTrainingRequest } from '../types/training';

// Dados mockados
const MOCK_MODELS: Model[] = [
  {
    id: '1',
    name: 'Previsão de Vendas',
    rnnType: 'LSTM',
    createdAt: '2025-09-01T10:00:00Z',
    device: 'GPU',
    attribute: 'Vendas',
    status: 'idle',
    trainings: [
      {
        id: 't1',
        trainingDate: '2025-09-10T14:00:00Z',
        dataVolume: 1000,
        metrics: { mae: 0.12, mse: 0.03, rmse: 0.17 },
        status: 'completed',
      },
    ],
  },
  {
    id: '2',
    name: 'Previsão de Temperatura',
    rnnType: 'GRU',
    createdAt: '2025-08-15T09:30:00Z',
    device: 'CPU',
    attribute: 'Temperatura',
    status: 'idle',
    trainings: [],
  },
];

export const useModels = () => {
  const [models, setModels] = useState<Model[]>(MOCK_MODELS);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // Mock: não faz nada, apenas retorna os dados
  const fetchModels = async () => {};

  const deleteModel = async (modelId: string) => {
    setModels(prev => prev.filter(model => model.id !== modelId));
  };

  const createTraining = async (request: CreateTrainingRequest) => {
    const newTrainingId = `t${Math.random().toString(36).slice(2, 8)}`;
    const newTraining: Model['trainings'][number] = {
      id: newTrainingId,
      trainingDate: new Date().toISOString(),
      dataVolume: request.dataVolume,
      metrics: { mae: Math.random(), mse: Math.random(), rmse: Math.random() },
      status: 'running',
    };
    setModels(prev =>
      prev.map(model =>
        model.id === request.modelId
          ? {
              ...model,
              status: 'training',
              trainings: [...model.trainings, newTraining],
            }
          : model
      )
    );
    return newTraining;
  };

  const deleteTraining = async (modelId: string, trainingId: string) => {
    setModels(prev =>
      prev.map(model =>
        model.id === modelId
          ? {
              ...model,
              trainings: model.trainings.filter(t => t.id !== trainingId),
            }
          : model
      )
    );
  };

  const copyModelParams = (model: Model) => {
    // Mock: apenas loga
    console.log('Copiando parâmetros do modelo:', model);
  };

  return {
    models,
    loading,
    error,
    fetchModels,
    deleteModel,
    createTraining,
    deleteTraining,
    copyModelParams,
  };
};
