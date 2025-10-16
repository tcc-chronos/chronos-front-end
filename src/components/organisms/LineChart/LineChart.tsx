import React, { useState, useEffect } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { LineChartProps } from './LineChart.types';

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

const LineChart: React.FC<LineChartProps> = ({
  data = [],
  columnName = 'campo não especificado',
  loading = false,
  className = '',
  isPollingActive = false,
}) => {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (data.length > 0 && isPollingActive) {
      setLastUpdate(new Date());
    }
  }, [data, isPollingActive]);

  const valores = data.length
    ? data.flatMap(d => [d.real, d.previsao, d.conexao]).filter(v => v != null)
    : [0];

  const yMinOriginal = Math.min(...valores);
  const yMaxOriginal = Math.max(...valores);
  const amplitude = yMaxOriginal - yMinOriginal;
  const padding = amplitude === 0 ? 0.1 : amplitude;
  const yMin = Math.floor(yMinOriginal - padding);
  const yMax = Math.ceil(yMaxOriginal + padding);

  return (
    <div
      className={`flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-6 ${className}`}
      role='region'
      aria-label='Gráfico de previsão'
    >
      {data.length === 0 ? (
        <p className='text-center mt-4 text-gray-500'>
          {loading ? 'Aguarde, modelo em treinamento' : 'Sem dados para exibir'}
        </p>
      ) : (
        <>
          <div className='w-full flex items-center justify-between mb-4'>
            <div className='flex-1'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Previsão de: {columnName}
              </h2>
              {isPollingActive && lastUpdate && (
                <p className='text-xs text-gray-500 mt-1'>
                  Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
                </p>
              )}
            </div>
          </div>
          <ResponsiveContainer width='100%' height={400}>
            <RechartsLineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
              <XAxis
                dataKey='dataHora'
                tickFormatter={formatDateTime}
                minTickGap={30}
                stroke='#6b7280'
                style={{ fontSize: '12px' }}
              />
              <YAxis
                domain={[yMin, yMax]}
                tickFormatter={(value: number) => value.toFixed(3)}
                stroke='#6b7280'
                style={{ fontSize: '12px' }}
                interval={'preserveEnd'}
                allowDecimals={true}
                tickSize={5}
              />
              <Tooltip
                formatter={(value: number) => value.toFixed(3)}
                labelFormatter={formatDateTime}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '16px' }} iconType='line' />
              <Line
                type='monotone'
                dataKey='conexao'
                stroke='#9ca3af'
                strokeWidth={2}
                strokeDasharray='3 3'
                connectNulls={false}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
                legendType='none'
              />
              <Line
                type='monotone'
                dataKey='real'
                stroke='#3b82f6'
                name='Valor Real'
                strokeWidth={2}
                connectNulls={false}
                dot={{
                  r: 4,
                  fill: '#3b82f6',
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 6,
                  fill: '#2563eb',
                }}
                isAnimationActive={false}
              />
              <Line
                type='monotone'
                dataKey='previsao'
                stroke='#9ca3af'
                name='Previsão'
                strokeWidth={2}
                strokeDasharray='3 3'
                dot={{
                  r: 4,
                  fill: '#6b7280',
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 6,
                  fill: '#4b5563',
                }}
                isAnimationActive={false}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default LineChart;
