import React, { useEffect, useMemo } from 'react';
import { Brain } from 'lucide-react';
import { useSidebar } from '../../../hooks/useSidebar';
import { usePrediction, usePredictionPolling } from '../../../contexts';
import { DashboardSidebarContent } from '../../molecules';
import { LineChart, TrainingMetricsReport } from '../../organisms';
import {
  convertPredictionToChartData,
  convertPredictionToTrainingMetrics,
  getPredictionFeatureName,
} from '../../../utils';
import type { ChartDataPoint } from '../../organisms/LineChart/LineChart.types';
import type { TrainingMetrics } from '../../organisms/TrainingMetricsReport/TrainingMetricsReport.types';

const DashboardPage: React.FC = () => {
  const { addItem, clearItemsPreservingActive } = useSidebar();
  const { isPolling: isPredictionPolling } = usePredictionPolling();
  const { predictionData, isLoading } = usePrediction();

  useEffect(() => {
    return () => {};
  }, []);

  const chartData = useMemo<ChartDataPoint[]>(() => {
    if (!predictionData) {
      return [];
    }

    const converted = convertPredictionToChartData(predictionData);

    return converted;
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
    clearItemsPreservingActive();

    addItem({
      id: 'prediction',
      icon: <Brain className='w-6 h-6' />,
      label: 'Predição',
      tooltip: 'Fazer predições com modelos treinados',
      content: <DashboardSidebarContent />,
    });

    return () => {
      clearItemsPreservingActive();
    };
  }, [addItem, clearItemsPreservingActive]);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Painel</h1>
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
