import React from 'react';
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
import type { ChartDataPoint } from './LineChart.types';

interface RechartsWrapperProps {
  data: ChartDataPoint[];
  yMin: number;
  yMax: number;
  formatDateTime: (dateString: string) => string;
  tooltipFormatter: (value: number, name: string) => null[] | string[];
  tooltipLabelFormatter: (label: string) => string;
}

const RechartsWrapper: React.FC<RechartsWrapperProps> = React.memo(
  ({
    data,
    yMin,
    yMax,
    formatDateTime,
    tooltipFormatter,
    tooltipLabelFormatter,
  }) => {
    return (
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
            style={{ fontSize: '16px' }}
          />
          <YAxis
            domain={[yMin, yMax]}
            tickFormatter={(value: number) => value.toFixed(3)}
            stroke='#6b7280'
            style={{ fontSize: '16px' }}
            interval={'preserveEnd'}
            allowDecimals={true}
            tickSize={5}
          />
          <Tooltip
            formatter={tooltipFormatter}
            labelFormatter={tooltipLabelFormatter}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            labelStyle={{
              color: '#4b5563',
              fontWeight: '500',
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
            name=''
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
    );
  }
);

RechartsWrapper.displayName = 'RechartsWrapper';

export default RechartsWrapper;
