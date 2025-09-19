import React from 'react';
import { Trash2 } from 'lucide-react';
import { IconButton } from '../../atoms';
import type { TrainingCardProps } from './TrainingCard.types';

const TrainingCard: React.FC<TrainingCardProps> = ({ training, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      running: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const formatMetric = (value: number) => {
    return value.toFixed(4);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(training.id);
    }
  };

  return (
    <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
      <div className='flex items-center justify-between'>
        <div className='flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm'>
          {/* Data de treinamento */}
          <div>
            <span className='text-gray-500 block text-xs'>
              Data de treinamento
            </span>
            <span className='font-medium text-black'>
              {formatDate(training.trainingDate)}
            </span>
          </div>

          {/* Volume de dados */}
          <div>
            <span className='text-gray-500 block text-xs'>Volume de dados</span>
            <span className='font-medium text-black'>
              {training.dataVolume.toLocaleString()}
            </span>
          </div>

          {/* Métricas */}
          <div>
            <span className='text-gray-500 block text-xs'>MAE</span>
            <span className='font-medium text-black'>
              {formatMetric(training.metrics.mae)}
            </span>
          </div>

          <div>
            <span className='text-gray-500 block text-xs'>MSE</span>
            <span className='font-medium text-black'>
              {formatMetric(training.metrics.mse)}
            </span>
          </div>

          <div>
            <span className='text-gray-500 block text-xs'>RMSE</span>
            <span className='font-medium text-black'>
              {formatMetric(training.metrics.rmse)}
            </span>
          </div>

          {/* Status */}
          <div className='flex items-center justify-between'>
            <div>
              <span className='text-gray-500 block text-xs'>Status</span>
              <span
                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  training.status
                )}`}
              >
                {training.status}
              </span>
            </div>

            {/* Delete button */}
            {onDelete && (
              <IconButton
                icon={<Trash2 size={14} />}
                onClick={handleDelete}
                size='sm'
                ariaLabel='Excluir treinamento'
                tooltip='Excluir treinamento'
                className='ml-2'
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingCard;
