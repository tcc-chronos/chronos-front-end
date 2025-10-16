import React from 'react';
import { Check } from 'lucide-react';
import type { SelectableTrainingCardProps } from './SelectableTrainingCard.types';

const SelectableTrainingCard: React.FC<SelectableTrainingCardProps> = ({
  training,
  isSelected = false,
  onSelect,
  isPolling = false,
  isPredicting = false,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatMetric = (value: number) => {
    return value.toFixed(3);
  };

  const handleClick = () => {
    if (isPolling || isPredicting) {
      return;
    }

    if (onSelect && training.status === 'completed') {
      onSelect(training.id);
    }
  };

  const isSelectable =
    training.status === 'completed' && !isPolling && !isPredicting;
  const cardClasses = `
    relative bg-white rounded-lg p-4 border transition-all
    ${isSelectable ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed opacity-60'}
    ${
      isSelected
        ? 'border-blue-500 bg-blue-50 shadow-sm'
        : 'border-gray-200 hover:border-gray-300'
    }
  `;

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      role={isSelectable ? 'button' : undefined}
      tabIndex={isSelectable ? 0 : undefined}
      onKeyDown={
        isSelectable
          ? e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
              }
            }
          : undefined
      }
      aria-pressed={isSelected}
      aria-disabled={!isSelectable}
    >
      <div className='flex items-center justify-between mb-3'>
        <div className='flex flex-col'>
          <span className='text-sm font-medium text-gray-900'>
            {formatDate(training.trainingDate)}
          </span>
          <span className='text-xs text-gray-500 mt-1'>
            Volume de dados: {training.dataVolume.toLocaleString()}
          </span>
        </div>
      </div>

      <div className='grid gap-2'>
        <div className='grid grid-cols-2 gap-2 text-xs'>
          <div className='text-center p-2 bg-gray-50 rounded'>
            <div className='text-gray-500'>MAE</div>
            <div className='font-semibold text-gray-900'>
              {formatMetric(training.metrics.mae)}
            </div>
          </div>
          <div className='text-center p-2 bg-gray-50 rounded'>
            <div className='text-gray-500'>MSE</div>
            <div className='font-semibold text-gray-900'>
              {formatMetric(training.metrics.mse)}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2 text-xs'>
          <div className='text-center p-2 bg-gray-50 rounded'>
            <div className='text-gray-500'>RMSE</div>
            <div className='font-semibold text-gray-900'>
              {formatMetric(training.metrics.rmse)}
            </div>
          </div>
          <div className='text-center p-2 bg-gray-50 rounded'>
            <div className='text-gray-500'>Theil U</div>
            <div className='font-semibold text-gray-900'>
              {formatMetric(training.metrics.theil_u)}
            </div>
          </div>
        </div>
      </div>

      {training.status === 'completed' && (
        <div className='absolute top-3 right-3'>
          <div
            className={`
              w-6 h-6 rounded-full flex items-center justify-center transition-all
              ${
                isSelected
                  ? 'bg-blue-500 border-2 border-blue-500'
                  : 'border-1 border-blue-500 bg-transparent'
              }
            `}
          >
            <Check
              size={14}
              className={`
                transition-all
                ${isSelected ? 'text-white' : 'text-blue-500'}
              `}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectableTrainingCard;
