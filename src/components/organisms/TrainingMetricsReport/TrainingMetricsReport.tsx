import React from 'react';
import type { TrainingMetricsReportProps } from './TrainingMetricsReport.types';

const TrainingMetricsReport: React.FC<TrainingMetricsReportProps> = ({
  metrics,
  className = '',
}) => {
  if (!metrics) return null;

  const {
    training_time,
    mean_absolute_error,
    mean_squared_error,
    root_mean_squared_error,
    theil_u,
    model_type,
    data_volume,
    // Novos campos
    training_duration,
    total_points,
  } = metrics;

  return (
    <div className={className}>
      <h2 className='text-xl font-semibold text-gray-900 mb-4'>
        Relatório de Treinamento
      </h2>
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4'>
        {/* Card de Informações de Treinamento */}
        <div className='lg:col-span-2 xl:col-span-1 bg-white rounded-2xl shadow-lg p-6 space-y-4'>
          <div className='space-y-3'>
            <div className='flex items-center'>
              <span className='text-gray-600 font-medium mr-2'>Tipo:</span>
              <span className='text-gray-800 font-semibold'>
                {model_type?.toUpperCase() || 'N/A'}
              </span>
            </div>
            <div className='flex items-center'>
              <span className='text-gray-600 font-medium mr-2'>Volume:</span>
              <span className='text-gray-800 font-semibold'>
                {total_points || data_volume
                  ? `${(total_points || data_volume)?.toLocaleString()} registros`
                  : 'N/A'}
              </span>
            </div>
            <div className='flex items-center'>
              <span className='text-gray-600 font-medium mr-2'>
                Tempo de treinamento:
              </span>
              <span className='text-gray-800 font-semibold'>
                {(training_duration || training_time)?.toFixed(1)}s
              </span>
            </div>
          </div>
        </div>

        {/* Card MAE */}
        <div className='bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center'>
          <div className='text-center'>
            <p className='text-gray-600 font-bold text-xl mb-2'>
              MAE
              <span className='block text-xs font-normal text-gray-500 mt-1'>
                Mean Absolute Error
              </span>
            </p>
            <p className='text-blue-600 font-bold text-4xl'>
              {mean_absolute_error.toFixed(3)}
            </p>
          </div>
        </div>

        {/* Card MSE */}
        {mean_squared_error !== undefined && (
          <div className='bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center'>
            <div className='text-center'>
              <p className='text-gray-600 font-bold text-xl mb-2'>
                MSE
                <span className='block text-xs font-normal text-gray-500 mt-1'>
                  Mean Squared Error
                </span>
              </p>
              <p className='text-blue-600 font-bold text-4xl'>
                {mean_squared_error.toFixed(3)}
              </p>
            </div>
          </div>
        )}

        {/* Card RMSE */}
        <div className='bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center'>
          <div className='text-center'>
            <p className='text-gray-600 font-bold text-xl mb-2'>
              RMSE
              <span className='block text-xs font-normal text-gray-500 mt-1'>
                Root Mean Squared Error
              </span>
            </p>
            <p className='text-blue-600 font-bold text-4xl'>
              {root_mean_squared_error.toFixed(3)}
            </p>
          </div>
        </div>

        {/* Card Theil U */}
        {theil_u !== undefined && (
          <div className='bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center'>
            <div className='text-center'>
              <p className='text-gray-600 font-bold text-xl mb-2'>
                Theil U
                <span className='block text-xs font-normal text-gray-500 mt-1'>
                  Theil Inequality Coefficient
                </span>
              </p>
              <p className='text-blue-600 font-bold text-4xl'>
                {theil_u.toFixed(3)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingMetricsReport;
