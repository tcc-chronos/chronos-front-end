import React, { useEffect, useMemo } from 'react';
import { Brain } from 'lucide-react';
import { useSidebar } from '../../../hooks/useSidebar';
import { usePrediction, usePredictionPolling } from '../../../contexts';
import { DashboardSidebarContent } from '../../molecules';
import { useModels } from '../../../hooks/useModels';
import { LineChart, TrainingMetricsReport } from '../../organisms';
import {
  convertPredictionToChartData,
  convertPredictionToTrainingMetrics,
  getPredictionFeatureName,
} from '../../../utils';
import type { ChartDataPoint } from '../../organisms/LineChart/LineChart.types';
import type { TrainingMetrics } from '../../organisms/TrainingMetricsReport/TrainingMetricsReport.types';

const DashboardPage: React.FC = () => {
  const { addItem, clearItems } = useSidebar();
  const { isPolling: isTrainingPolling } = useModels();
  const { isPolling: isPredictionPolling } = usePredictionPolling();
  const { predictionData, isLoading } = usePrediction();

  const chartData = useMemo<ChartDataPoint[]>(() => {
    if (!predictionData) {
      return [];
    }
    return convertPredictionToChartData(predictionData);
  }, [predictionData]);

  const trainingMetrics = useMemo<TrainingMetrics | null>(() => {
    if (!predictionData) return null;
    return convertPredictionToTrainingMetrics(predictionData);
  }, [predictionData]);

  const selectedColumn = useMemo<string>(() => {
    if (!predictionData) return 'Dados';
    return getPredictionFeatureName(predictionData);
  }, [predictionData]);

  useEffect(() => {
    clearItems();

    addItem({
      id: 'prediction',
      icon: <Brain className='w-6 h-6' />,
      label: 'Predição',
      tooltip: 'Fazer predições com modelos treinados',
      content: <DashboardSidebarContent />,
    });

    return () => {
      clearItems();
    };
  }, [addItem, clearItems]);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>

        {isTrainingPolling && (
          <div className='mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
            <p className='text-sm text-blue-800'>
              Existem treinamentos em andamento. Os modelos serão atualizados
              automaticamente.
            </p>
          </div>
        )}
      </div>

      <LineChart
        data={chartData}
        columnName={selectedColumn}
        loading={isLoading}
        className='min-h-[500px]'
        isPollingActive={isPredictionPolling}
      />

      <TrainingMetricsReport metrics={trainingMetrics} className='mt-6' />
    </div>
  );
};

export default DashboardPage;
