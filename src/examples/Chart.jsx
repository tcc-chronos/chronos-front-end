import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const formatDateTime = dateString => {
  const date = new Date(dateString);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

const Chart = ({ chartData = [], loading, columnData }) => {
  const valores = chartData.length
    ? chartData.flatMap(d => [d.real, d.previsao]).filter(v => v != null)
    : [0];

  const yMinOriginal = Math.min(...valores);
  const yMaxOriginal = Math.max(...valores);
  const amplitude = yMaxOriginal - yMinOriginal;
  const padding = amplitude === 0 ? 0.1 : amplitude;
  const yMin = Math.floor(yMinOriginal - padding);
  const yMax = Math.ceil(yMaxOriginal + padding);

  const ChartComponent = (
    <ResponsiveContainer height='90%'>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis
          dataKey='dataHora'
          tickFormatter={formatDateTime}
          minTickGap={30}
        />
        <YAxis
          domain={[yMin, yMax]}
          tickFormatter={value => Number(value).toFixed(3)}
        />
        <Tooltip
          formatter={value => Number(value).toFixed(3)}
          labelFormatter={formatDateTime}
        />
        <Legend />
        <Line
          type='monotone'
          dataKey='real'
          stroke='#007bff'
          name='Valor Real'
          connectNulls={false}
          dot={({ cx, cy }) =>
            cx != null && cy != null ? (
              <circle
                key={`dot-${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={4}
                fill='#007bff'
              />
            ) : null
          }
          isAnimationActive={false}
        />
        <Line
          type='monotone'
          dataKey='previsao'
          stroke='#555'
          name='Previsão'
          strokeDasharray='5 5'
          dot={({ cx, cy }) =>
            cx != null && cy != null ? (
              <circle
                key={`dot-prev-${cx}-${cy}`}
                cx={cx}
                cy={cy}
                r={4}
                fill='#949496'
              />
            ) : null
          }
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className='flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-6 h-3/5 m-6'>
      {chartData.length === 0 ? (
        <p className='text-center mt-4 text-gray-500'>
          {loading ? 'Aguarde, modelo em treinamento' : 'Sem dados para exibir'}
        </p>
      ) : (
        <>
          <h2 className='text-xl font-semibold mb-4 text-center'>
            Previsão de: {columnData || 'campo não especificado'}
          </h2>
          {ChartComponent}
        </>
      )}
    </div>
  );
};

export default Chart;
