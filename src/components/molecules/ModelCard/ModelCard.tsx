import React from 'react';
import { ChevronDown, ChevronUp, Copy, Trash2, Play } from 'lucide-react';
import { IconButton } from '../../atoms';
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
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      idle: 'bg-gray-100 text-gray-800',
      training: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.idle;
  };

  const isTraining = model.status === 'training';

  return (
    <div className='bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow'>
      {/* Card Header */}
      <div className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <h3 className='text-md font-semibold text-gray-900 mb-2'>
              {model.name}
            </h3>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm'>
              <div>
                <span className='text-gray-500 block'>Tipo de RNN</span>
                <span className='font-medium text-black'>{model.rnnType}</span>
              </div>
              <div>
                <span className='text-gray-500 block'>Data de criação</span>
                <span className='font-medium text-black'>
                  {formatDate(model.createdAt)}
                </span>
              </div>
              <div>
                <span className='text-gray-500 block'>Dispositivo</span>
                <span className='font-medium text-black'>{model.device}</span>
              </div>
              <div>
                <span className='text-gray-500 block'>Atributo</span>
                <span className='font-medium text-black'>
                  {model.attribute}
                </span>
              </div>
              <div>
                <span className='text-gray-500 block'>Status</span>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    model.status
                  )}`}
                >
                  {model.status}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center space-x-2 ml-6'>
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

      {/* Trainings List */}
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
