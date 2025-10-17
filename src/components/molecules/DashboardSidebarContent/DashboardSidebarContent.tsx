import React, { useState, useMemo, useEffect } from 'react';
import { Loader2, Search, ChevronUp, ChevronDown } from 'lucide-react';
import {
  SidebarContent,
  InputField,
  PredictButton,
  SelectableTrainingCard,
} from '../';
import { IconButton } from '../../atoms';
import { useModels } from '../../../hooks/useModels';
import { usePredictionPolling, usePrediction } from '../../../contexts';
import type { DashboardSidebarContentProps } from './DashboardSidebarContent.types';

const SELECTED_TRAINING_STORAGE_KEY = 'chronos-selected-training';
const EXPANDED_MODELS_STORAGE_KEY = 'chronos-expanded-models';

const DashboardSidebarContent: React.FC<DashboardSidebarContentProps> = ({
  className = '',
  ...props
}) => {
  const { models, loading } = useModels();
  const { isPolling, togglePolling } = usePredictionPolling();
  const { isLoading: isPredicting } = usePrediction();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModels, setExpandedModels] = useState<Set<string>>(() => {
    // Carregar modelos expandidos do localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(EXPANDED_MODELS_STORAGE_KEY);
        return saved ? new Set(JSON.parse(saved)) : new Set();
      } catch {
        return new Set();
      }
    }
    return new Set();
  });
  const [selectedTraining, setSelectedTraining] = useState<{
    modelId: string;
    trainingId: string;
  } | null>(() => {
    // Carregar treinamento selecionado do localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(SELECTED_TRAINING_STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const filteredModels = useMemo(() => {
    // Filtrar apenas modelos que têm treinamentos completos
    const modelsWithCompletedTrainings = models
      .filter(model => model.trainings && model.trainings.length > 0)
      .filter(model =>
        model.trainings.some(training => training.status === 'completed')
      )
      .map(model => ({
        ...model,
        // Filtrar apenas treinamentos completos dentro de cada modelo
        trainings: model.trainings.filter(
          training => training.status === 'completed'
        ),
      }));

    if (!searchQuery.trim()) return modelsWithCompletedTrainings;

    const query = searchQuery.toLowerCase();
    return modelsWithCompletedTrainings.filter(
      model =>
        model.name.toLowerCase().includes(query) ||
        model.rnnType.toLowerCase().includes(query) ||
        model.device.toLowerCase().includes(query) ||
        model.attribute.toLowerCase().includes(query)
    );
  }, [models, searchQuery]);

  // Validar se o treinamento selecionado ainda existe quando os modelos mudarem
  useEffect(() => {
    if (selectedTraining && models.length > 0) {
      const selectedModel = models.find(
        model => model.id === selectedTraining.modelId
      );
      const selectedTrainingExists = selectedModel?.trainings?.some(
        training => training.id === selectedTraining.trainingId
      );

      if (!selectedTrainingExists) {
        // Se o treinamento selecionado não existe mais, limpar a seleção
        setSelectedTraining(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem(SELECTED_TRAINING_STORAGE_KEY);
        }
      } else if (selectedModel) {
        // Se o modelo existe, garantir que está expandido para mostrar o treinamento selecionado
        setExpandedModels(prev => {
          if (!prev.has(selectedModel.id)) {
            const newSet = new Set(prev);
            newSet.add(selectedModel.id);

            if (typeof window !== 'undefined') {
              try {
                localStorage.setItem(
                  EXPANDED_MODELS_STORAGE_KEY,
                  JSON.stringify(Array.from(newSet))
                );
              } catch {
                // Failed to save to localStorage
              }
            }

            return newSet;
          }
          return prev;
        });
      }
    }
  }, [models, selectedTraining]);

  const handleToggleExpanded = (modelId: string) => {
    setExpandedModels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(modelId)) {
        newSet.delete(modelId);
        // Não limpar a seleção quando fechar o card
        // A seleção deve persistir mesmo com o card fechado
      } else {
        newSet.add(modelId);
      }

      // Persistir no localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(
            EXPANDED_MODELS_STORAGE_KEY,
            JSON.stringify(Array.from(newSet))
          );
        } catch {
          // Failed to save to localStorage
        }
      }

      return newSet;
    });
  };

  const handleSelectTraining = (modelId: string, trainingId: string) => {
    setSelectedTraining(prev => {
      const newSelection =
        prev?.modelId === modelId && prev?.trainingId === trainingId
          ? null
          : { modelId, trainingId };

      // Persistir no localStorage
      if (typeof window !== 'undefined') {
        try {
          if (newSelection) {
            localStorage.setItem(
              SELECTED_TRAINING_STORAGE_KEY,
              JSON.stringify(newSelection)
            );
          } else {
            localStorage.removeItem(SELECTED_TRAINING_STORAGE_KEY);
          }
        } catch {
          // Failed to save to localStorage
        }
      }

      return newSelection;
    });
  };

  const handleTogglePolling = () => {
    if (!selectedTraining?.modelId || !selectedTraining?.trainingId) return;

    togglePolling(selectedTraining.modelId, selectedTraining.trainingId);
  };

  if (loading) {
    return (
      <SidebarContent
        title='Predição de Modelos'
        variant='default'
        className={className}
        {...props}
      >
        <div className='flex items-center justify-center py-12'>
          <div className='flex items-center space-x-2 text-gray-500'>
            <Loader2 className='animate-spin' size={20} />
            <span>Carregando modelos...</span>
          </div>
        </div>
      </SidebarContent>
    );
  }

  return (
    <SidebarContent
      title='Selecionar Treinamento'
      variant='default'
      className={className}
      {...props}
    >
      <div className='space-y-4'>
        <InputField
          id='search-models'
          label='Buscar modelos:'
          placeholder='Buscar por nome, tipo, dispositivo...'
          value={searchQuery}
          onChange={setSearchQuery}
          size='md'
          leftIcon={<Search size={16} />}
        />

        <div className='space-y-3 max-h-[calc(100vh-290px)] overflow-y-auto'>
          {filteredModels.length === 0 ? (
            <div className='text-center py-8 text-gray-500 text-sm'>
              {searchQuery
                ? 'Nenhum modelo com treinamentos completos encontrado com este filtro.'
                : 'Nenhum modelo com treinamentos completos disponível para predição.'}
            </div>
          ) : (
            filteredModels.map(model => {
              const isExpanded = expandedModels.has(model.id);

              return (
                <div
                  key={model.id}
                  className={`bg-white rounded-lg border border-gray-200 shadow-sm`}
                >
                  <div className='p-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center space-x-2'>
                        <div>
                          <h3 className='text-sm font-semibold text-gray-900'>
                            {model.name}
                          </h3>
                        </div>
                      </div>

                      <IconButton
                        icon={
                          isExpanded ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )
                        }
                        onClick={() => handleToggleExpanded(model.id)}
                        ariaLabel={
                          isExpanded
                            ? 'Ocultar treinamentos'
                            : 'Mostrar treinamentos'
                        }
                        tooltip={
                          isExpanded
                            ? 'Ocultar treinamentos'
                            : 'Mostrar treinamentos'
                        }
                        disabled={model.trainings.length === 0}
                      />
                    </div>

                    <div className='space-y-2 text-nowrap'>
                      <div className='grid grid-cols-2 gap-2 text-xs'>
                        <div>
                          <span className='text-gray-500'>Tipo:</span>{' '}
                          <span className='font-medium text-gray-900'>
                            {model.rnnType.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className='text-gray-500'>Atributo:</span>{' '}
                          <span className='font-medium text-gray-900'>
                            {model.attribute}
                          </span>
                        </div>
                      </div>

                      <div className='grid grid-cols-1 gap-2 text-xs'>
                        <div>
                          <span className='text-gray-500'>Dispositivo:</span>{' '}
                          <span className='font-medium text-gray-900'>
                            {model.device}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isExpanded && model.trainings.length > 0 && (
                    <div className='border-t border-gray-200 p-4 space-y-3 bg-gray-50'>
                      {model.trainings.map(training => (
                        <SelectableTrainingCard
                          key={training.id}
                          training={training}
                          modelId={model.id}
                          isSelected={
                            selectedTraining?.modelId === model.id &&
                            selectedTraining?.trainingId === training.id
                          }
                          onSelect={(trainingId: string) =>
                            handleSelectTraining(model.id, trainingId)
                          }
                          isPolling={isPolling}
                          isPredicting={isPredicting}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className='fixed bottom-0 bg-white border-t border-gray-200 w-70 py-4'>
          <PredictButton
            variant='primary'
            fullWidth
            modelId={selectedTraining?.modelId}
            trainingId={selectedTraining?.trainingId}
            isPolling={isPolling}
            onTogglePolling={handleTogglePolling}
          />
        </div>
      </div>
    </SidebarContent>
  );
};

export default DashboardSidebarContent;
