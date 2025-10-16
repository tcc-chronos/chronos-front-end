import React from 'react';
import type { TrainingMetricsReportProps } from './TrainingMetricsReport.types';

const formatDatetime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString('pt-BR', { hour12: false });
};

const TrainingMetricsReport: React.FC<TrainingMetricsReportProps> = ({
  metrics,
  className = '',
}) => {
  if (!metrics) return null;

  const {
    success,
    training_time,
    training_datetime,
    mean_absolute_error,
    mean_squared_error,
    root_mean_squared_error,
    theil_u,
  } = metrics;

  return (
    <div className={className}>
      <h2 className='text-2xl font-bold text-gray-800 mb-4'>
        Relatório de Treinamento
      </h2>
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4'>
        {/* Card de Informações de Treinamento */}
        <div className='lg:col-span-2 xl:col-span-1 bg-white rounded-2xl shadow-lg p-6 space-y-4'>
          <h3 className='text-lg font-semibold text-gray-700 mb-3 border-b border-gray-200 pb-2'>
            Informações do Treinamento
          </h3>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600 font-medium'>Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  success
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {success ? 'Sucesso' : 'Falha'}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600 font-medium'>
                Último treinamento:
              </span>
              <span className='text-gray-800'>
                {formatDatetime(training_datetime)}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600 font-medium'>
                Tempo de treinamento:
              </span>
              <span className='text-gray-800 font-semibold'>
                {training_time.toFixed(1)}s
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
              <p className='text-green-600 font-bold text-4xl'>
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
            <p className='text-purple-600 font-bold text-4xl'>
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
              <p className='text-orange-600 font-bold text-4xl'>
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
