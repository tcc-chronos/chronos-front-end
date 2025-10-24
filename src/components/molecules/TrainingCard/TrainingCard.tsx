import React, { useMemo, useState } from 'react';
import { Trash2, Activity } from 'lucide-react';
import { IconButton, Tooltip } from '../../atoms';
import { TrainingDetailsModal } from '../ModalsContainer';
import {
  formatDateTimeToBrazilTimezone,
  formatNumberToLocale,
} from '../../../utils';
import type { TrainingCardProps } from './TrainingCard.types';

const TrainingCard: React.FC<TrainingCardProps> = ({ training, onDelete }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return formatDateTimeToBrazilTimezone(dateString);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      running: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      collecting_data: 'bg-yellow-100 text-yellow-800',
      preprocessing: 'bg-yellow-100 text-yellow-800',
      training: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || colors.pending;
  };

  const statusLabels: Record<TrainingCardProps['training']['status'], string> =
    {
      pending: 'Pendente',
      running: 'Em execução',
      completed: 'Concluído',
      failed: 'Falhou',
      collecting_data: 'Coletando dados',
      preprocessing: 'Pré-processando',
      training: 'Treinando',
    };

  const formatMetric = (value: number) => {
    return value.toFixed(4);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(training.id);
    }
  };

  const hasTrainingHistory = useMemo(() => {
    if (training.status !== 'completed') return false;

    const history = training.trainingHistory;
    if (!history) return false;

    const hasLossValues =
      Array.isArray(history.loss) && history.loss.length > 0;
    const hasValLossValues =
      Array.isArray(history.valLoss) && history.valLoss.length > 0;

    return hasLossValues || hasValLossValues;
  }, [training]);

  const handleOpenDetails = () => {
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  return (
    <>
      <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
        {/* Header com informações principais e ações */}
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
                {formatNumberToLocale(training.dataVolume)}
              </span>
            </div>
            <div>
              <span className='text-gray-500 grid grid-cols-2 text-xs gap-3'>
                Status
              </span>
              {training.status === 'failed' && training.error ? (
                <Tooltip content={training.error}>
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium cursor-help ${getStatusColor(
                      training.status
                    )}`}
                  >
                    {statusLabels[training.status] ?? training.status}
                  </span>
                </Tooltip>
              ) : (
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    training.status
                  )}`}
                >
                  {statusLabels[training.status] ?? training.status}
                </span>
              )}
            </div>
          </div>

          {(onDelete || hasTrainingHistory) && (
            <div className='flex justify-end'>
              {hasTrainingHistory && (
                <IconButton
                  icon={<Activity size={14} />}
                  onClick={handleOpenDetails}
                  size='sm'
                  ariaLabel='Ver detalhes do treinamento'
                  tooltip='Ver detalhes do treinamento'
                />
              )}
              {onDelete && (
                <IconButton
                  className={hasTrainingHistory ? 'ml-2' : undefined}
                  icon={<Trash2 size={14} />}
                  onClick={handleDelete}
                  size='sm'
                  ariaLabel='Excluir treinamento'
                  tooltip='Excluir treinamento'
                />
              )}
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

      <TrainingDetailsModal
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        training={hasTrainingHistory ? training : null}
      />
    </>
  );
};

export default TrainingCard;
