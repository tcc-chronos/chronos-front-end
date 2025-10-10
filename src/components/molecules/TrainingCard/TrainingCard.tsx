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
      {/* Header com informações principais e botão delete */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
          <div>
            <span className='text-gray-500 text-xs grid grid-cols-2 gap-3'>
              Data de treinamento
            </span>
            <span className='font-medium text-black text-sm'>
              {formatDate(training.trainingDate)}
            </span>
          </div>
          <div>
            <span className='text-gray-500 grid grid-cols-2 text-xs gap-3'>
              Volume de dados
            </span>
            <span className='font-medium text-black text-sm'>
              {training.dataVolume.toLocaleString()}
            </span>
          </div>
          <div>
            <span className='text-gray-500 grid grid-cols-2 text-xs gap-3'>
              Status
            </span>
            <span
              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                training.status
              )}`}
            >
              {training.status}
            </span>
          </div>
        </div>

        {/* Delete button */}
        {onDelete && (
          <div className='flex justify-end'>
            <IconButton
              icon={<Trash2 size={14} />}
              onClick={handleDelete}
              size='sm'
              ariaLabel='Excluir treinamento'
              tooltip='Excluir treinamento'
            />
          </div>
        )}
      </div>

      <div className='border-t border-gray-200 pt-3'>
        <h5 className='text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide'>
          Métricas de Performance
        </h5>
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm'>
          <div className='bg-white rounded p-2'>
            <span className='text-gray-500 block text-xs'>MAE</span>
            <span className='font-medium text-black'>
              {formatMetric(training.metrics.mae)}
            </span>
          </div>

          <div className='bg-white rounded p-2'>
            <span className='text-gray-500 block text-xs'>MSE</span>
            <span className='font-medium text-black'>
              {formatMetric(training.metrics.mse)}
            </span>
          </div>

          <div className='bg-white rounded p-2'>
            <span className='text-gray-500 block text-xs'>RMSE</span>
            <span className='font-medium text-black'>
              {formatMetric(training.metrics.rmse)}
            </span>
          </div>

          <div className='bg-white rounded p-2'>
            <span className='text-gray-500 block text-xs'>Theil U</span>
            <span className='font-medium text-black'>
              {formatMetric(training.metrics.theil_u)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingCard;
