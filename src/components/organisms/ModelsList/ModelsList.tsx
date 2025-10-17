import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ModelCard } from '../../molecules';
import {
  ConfirmDeleteModal,
  NewTrainingModal,
} from '../../molecules/ModalsContainer';
import { useModels } from '../../../hooks/useModels';
import type { Model, TrainingFormData } from '../../../types/training';
import type { ModelsListProps } from './ModelsList.types';

const ModelsList: React.FC<ModelsListProps> = ({ className = '' }) => {
  const {
    models,
    loading,
    deleteModel,
    createTraining,
    deleteTraining,
    copyModelParams,
  } = useModels();

  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    modelId: string | null;
    modelName: string;
    isTraining?: boolean;
    trainingId?: string;
  }>({
    isOpen: false,
    modelId: null,
    modelName: '',
  });
  const [trainingModalState, setTrainingModalState] = useState<{
    isOpen: boolean;
    model: Model | null;
  }>({
    isOpen: false,
    model: null,
  });
  const [actionLoading, setActionLoading] = useState<{
    deletingModel: string | null;
    deletingTraining: string | null;
    creatingTraining: string | null;
  }>({
    deletingModel: null,
    deletingTraining: null,
    creatingTraining: null,
  });

  const handleToggleExpanded = (modelId: string) => {
    setExpandedModels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(modelId)) {
        newSet.delete(modelId);
      } else {
        newSet.add(modelId);
      }
      return newSet;
    });
  };

  const handleDeleteModel = (model: Model) => {
    setDeleteModalState({
      isOpen: true,
      modelId: model.id,
      modelName: model.name,
    });
  };

  const confirmDeleteModel = async () => {
    if (!deleteModalState.modelId) return;

    try {
      setActionLoading(prev => ({
        ...prev,
        deletingModel: deleteModalState.modelId,
      }));
      await deleteModel(deleteModalState.modelId);
      setDeleteModalState({
        isOpen: false,
        modelId: null,
        modelName: '',
      });
    } catch {
      // Error handled by hook
    } finally {
      setActionLoading(prev => ({ ...prev, deletingModel: null }));
    }
  };

  const handleDeleteTraining = (modelId: string, trainingId: string) => {
    const model = models.find(m => m.id === modelId);

    setDeleteModalState({
      isOpen: true,
      modelId,
      modelName: model?.name || '',
      isTraining: true,
      trainingId,
    });
  };

  const confirmDeleteTraining = async () => {
    if (!deleteModalState.modelId || !deleteModalState.trainingId) return;

    try {
      setActionLoading(prev => ({
        ...prev,
        deletingTraining: deleteModalState.trainingId || null,
      }));
      await deleteTraining(
        deleteModalState.modelId,
        deleteModalState.trainingId
      );
      setDeleteModalState({
        isOpen: false,
        modelId: null,
        modelName: '',
      });
    } catch {
      // Error handled by hook
    } finally {
      setActionLoading(prev => ({ ...prev, deletingTraining: null }));
    }
  };

  const handleNewTraining = (model: Model) => {
    setTrainingModalState({
      isOpen: true,
      model,
    });
  };

  const confirmNewTraining = async (formData: TrainingFormData) => {
    if (!trainingModalState.model) return;

    try {
      setActionLoading(prev => ({
        ...prev,
        creatingTraining: trainingModalState.model!.id,
      }));
      await createTraining({
        modelId: trainingModalState.model.id,
        dataVolume: formData.dataVolume,
      });
      setTrainingModalState({
        isOpen: false,
        model: null,
      });
    } catch {
      // Error handled by hook
    } finally {
      setActionLoading(prev => ({ ...prev, creatingTraining: null }));
    }
  };

  const handleCopyParams = async (model: Model) => {
    await copyModelParams(model.id).catch(() => {});
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className='flex items-center space-x-2 text-gray-500'>
          <Loader2 className='animate-spin' size={20} />
          <span>Carregando modelos...</span>
        </div>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className='text-gray-500'>
          <h3 className='text-lg font-medium mb-2'>Nenhum modelo encontrado</h3>
          <p>Crie seu primeiro modelo utilizando a sidebar de configuração.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {models.map(model => (
        <ModelCard
          key={model.id}
          model={model}
          isExpanded={expandedModels.has(model.id)}
          onToggleExpanded={() => handleToggleExpanded(model.id)}
          onCopyParams={() => handleCopyParams(model)}
          onDelete={() => handleDeleteModel(model)}
          onNewTraining={() => handleNewTraining(model)}
          onDeleteTraining={(trainingId: string) =>
            handleDeleteTraining(model.id, trainingId)
          }
        />
      ))}

      <ConfirmDeleteModal
        isOpen={deleteModalState.isOpen}
        onClose={() =>
          setDeleteModalState({
            isOpen: false,
            modelId: null,
            modelName: '',
          })
        }
        onConfirm={
          deleteModalState.isTraining
            ? confirmDeleteTraining
            : confirmDeleteModel
        }
        title={
          deleteModalState.isTraining ? 'Excluir treinamento' : 'Excluir modelo'
        }
        message={
          deleteModalState.isTraining
            ? `Tem certeza que deseja excluir este treinamento? Esta ação não pode ser desfeita.`
            : `Tem certeza que deseja excluir o modelo "${deleteModalState.modelName}"? Todos os treinamentos associados também serão removidos. Esta ação não pode ser desfeita.`
        }
        confirmText='Excluir'
        isLoading={
          actionLoading.deletingModel === deleteModalState.modelId ||
          actionLoading.deletingTraining === deleteModalState.trainingId
        }
      />

      <NewTrainingModal
        isOpen={trainingModalState.isOpen}
        onClose={() =>
          setTrainingModalState({
            isOpen: false,
            model: null,
          })
        }
        onSubmit={confirmNewTraining}
        modelName={trainingModalState.model?.name || ''}
        isLoading={
          actionLoading.creatingTraining === trainingModalState.model?.id
        }
      />
    </div>
  );
};

export default ModelsList;
