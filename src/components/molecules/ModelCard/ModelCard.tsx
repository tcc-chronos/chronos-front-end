import React from 'react';
import { ChevronDown, ChevronUp, Copy, Trash2, Play } from 'lucide-react';
import { IconButton } from '../../atoms';
import { formatDateOnlyToBrazilTimezone } from '../../../utils';
import TrainingCard from '../TrainingCard';
import type { ModelCardProps } from './ModelCard.types';

const ModelCard: React.FC<ModelCardProps> = ({
  model,
  isExpanded,
  onToggleExpanded,
  onCopyParams,
  onDelete,
  onNewTraining,
  onDeleteTraining,
}) => {
  const formatDate = (dateString: string) => {
    return formatDateOnlyToBrazilTimezone(dateString);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      idle: 'bg-gray-100 text-gray-800',
      draft: 'bg-gray-100 text-gray-800',
      training: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      trained: 'bg-green-100 text-green-800',
      created: 'bg-gray-100 text-gray-800',
      error: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.idle;
  };

  const statusLabels: Record<string, string> = {
    idle: 'Inativo',
    draft: 'Rascunho',
    training: 'Treinando',
    completed: 'Concluído',
    trained: 'Treinado',
    created: 'Criado',
    error: 'Erro',
  };

  const isTraining = model.status === 'training';

  return (
    <div className='bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
      <div className='p-6'>
        <div className='flex items-start justify-between sm:items-center flex-col sm:flex-row gap-4'>
          <div className='flex-1 w-full'>
            <h3 className='text-md font-semibold text-gray-900 mb-2'>
              {model.name}
            </h3>
            <div
              className='grid gap-4 text-sm'
              style={{
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              }}
            >
              <div className='min-w-0'>
                <span className='text-gray-500 block'>Tipo de RNN</span>
                <span className='font-medium text-black break-words'>
                  {model.rnnType}
                </span>
              </div>
              <div className='min-w-0'>
                <span className='text-gray-500 block'>Data de criação</span>
                <span className='font-medium text-black break-words'>
                  {formatDate(model.createdAt)}
                </span>
              </div>
              <div className='min-w-0 max-w-[150px]'>
                <span className='text-gray-500 block'>Dispositivo</span>
                <span className='font-medium text-black break-words hyphens-auto leading-tight'>
                  {model.device}
                </span>
              </div>
              <div className='min-w-0'>
                <span className='text-gray-500 block'>Atributo</span>
                <span className='font-medium text-black break-words'>
                  {model.attribute}
                </span>
              </div>
              <div className='min-w-0'>
                <span className='text-gray-500 block'>Status</span>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    model.status
                  )}`}
                >
                  {statusLabels[model.status] ?? model.status}
                </span>
              </div>
            </div>
          </div>

          <div className='flex items-center ml-0 sm:ml-6 lg:ml-6 flex-row sm:flex-col lg:flex-row space-x-2 sm:space-x-0 lg:space-x-2 space-y-0 sm:space-y-2 lg:space-y-0 w-full sm:w-auto lg:w-auto'>
            <IconButton
              icon={<Copy size={16} />}
              onClick={onCopyParams}
              ariaLabel='Copiar parâmetros'
              tooltip='Copiar parâmetros'
            />
            <IconButton
              icon={<Play size={16} />}
              onClick={onNewTraining}
              disabled={isTraining}
              ariaLabel='Novo treinamento'
              tooltip={
                isTraining
                  ? 'Aguarde o treinamento atual finalizar'
                  : 'Iniciar novo treinamento'
              }
            />
            <IconButton
              icon={<Trash2 size={16} />}
              onClick={onDelete}
              ariaLabel='Excluir modelo'
              tooltip='Excluir modelo'
            />
            <IconButton
              icon={
                isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />
              }
              onClick={onToggleExpanded}
              ariaLabel={
                isExpanded ? 'Ocultar treinamentos' : 'Mostrar treinamentos'
              }
              tooltip={
                isExpanded ? 'Ocultar treinamentos' : 'Mostrar treinamentos'
              }
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className='border-t border-gray-200 p-6 pt-4'>
          <h4 className='text-sm font-medium text-gray-900 mb-4'>
            Treinamentos ({model.trainings.length})
          </h4>
          {model.trainings.length === 0 ? (
            <p className='text-sm text-gray-500 italic'>
              Nenhum treinamento realizado ainda.
            </p>
          ) : (
            <div className='space-y-3'>
              {model.trainings.map(training => (
                <TrainingCard
                  key={training.id}
                  training={training}
                  modelId={model.id}
                  onDelete={onDeleteTraining}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelCard;
