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

const DashboardSidebarContent: React.FC<DashboardSidebarContentProps> = ({
  className = '',
  ...props
}) => {
  const { models, loading } = useModels();
  const { isPolling, togglePolling, stopPolling } = usePredictionPolling();
  const { isLoading: isPredicting } = usePrediction();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());
  const [selectedTraining, setSelectedTraining] = useState<{
    modelId: string;
    trainingId: string;
  } | null>(null);

  const filteredModels = useMemo(() => {
    const modelsWithTrainings = models.filter(
      model => model.trainings && model.trainings.length > 0
    );

    if (!searchQuery.trim()) return modelsWithTrainings;

    const query = searchQuery.toLowerCase();
    return modelsWithTrainings.filter(
      model =>
        model.name.toLowerCase().includes(query) ||
        model.rnnType.toLowerCase().includes(query) ||
        model.device.toLowerCase().includes(query) ||
        model.attribute.toLowerCase().includes(query)
    );
  }, [models, searchQuery]);

  const handleToggleExpanded = (modelId: string) => {
    setExpandedModels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(modelId)) {
        newSet.delete(modelId);
        if (selectedTraining?.modelId === modelId) {
          setSelectedTraining(null);
        }
      } else {
        newSet.add(modelId);
      }
      return newSet;
    });
  };

  const handleSelectTraining = (modelId: string, trainingId: string) => {
    setSelectedTraining(prev => {
      if (prev?.modelId === modelId && prev?.trainingId === trainingId) {
        return null;
      }
      return { modelId, trainingId };
    });
  };

  const handleTogglePolling = () => {
    if (!selectedTraining?.modelId || !selectedTraining?.trainingId) return;

    togglePolling(selectedTraining.modelId, selectedTraining.trainingId);
  };

  useEffect(() => {
    if (isPolling) {
      stopPolling();
    }
  }, [
    selectedTraining?.modelId,
    selectedTraining?.trainingId,
    isPolling,
    stopPolling,
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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
          label='Buscar Modelos'
          placeholder='Buscar por nome, tipo, dispositivo...'
          value={searchQuery}
          onChange={setSearchQuery}
          size='md'
          leftIcon={<Search size={16} />}
        />

        <div className='space-y-3 max-h-[calc(100vh-290px)] overflow-y-auto pr-2'>
          {filteredModels.length === 0 ? (
            <div className='text-center py-8 text-gray-500 text-sm'>
              {searchQuery
                ? 'Nenhum modelo com treinamentos encontrado com este filtro.'
                : 'Nenhum modelo com treinamentos disponível para predição.'}
            </div>
          ) : (
            filteredModels.map(model => {
              const isExpanded = expandedModels.has(model.id);
              const hasCompletedTrainings = model.trainings.some(
                t => t.status === 'completed'
              );

              return (
                <div
                  key={model.id}
                  className='bg-white rounded-lg border border-gray-200 shadow-sm'
                >
                  <div className='p-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <div>
                        <h3 className='text-sm font-semibold text-gray-900'>
                          {model.name}
                        </h3>
                        <span className='font-light text-gray-900'>
                          {formatDate(model.createdAt)}
                        </span>
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

                    <div className='space-y-2'>
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

                    {!hasCompletedTrainings && model.trainings.length > 0 && (
                      <p className='text-xs text-yellow-600 mt-2'>
                        Nenhum treinamento completo disponível para predição.
                      </p>
                    )}
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
