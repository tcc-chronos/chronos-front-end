import React, { useState, useMemo, useCallback, useRef } from 'react';
import { formatDateTimeToBrazilTimezone } from '../../../utils';
import RechartsWrapper from './RechartsWrapper';
import type { LineChartProps } from './LineChart.types';

const formatDateTime = (dateString: string): string => {
  return formatDateTimeToBrazilTimezone(dateString);
};

const LineChart: React.FC<LineChartProps> = ({
  data = [],
  columnName = 'campo não especificado',
  loading = false,
  className = '',
  isPollingActive = false,
}) => {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Usar useRef para controlar atualizações e evitar loops infinitos
  const lastDataTimestamp = useRef<string>('');
  const stableDataRef = useRef<LineChartProps['data']>([]);

  // Estabilizar dados para evitar loops com Recharts
  const stableData = useMemo(() => {
    if (data.length === 0) {
      stableDataRef.current = [];
      return [];
    }

    // Só atualizar se os dados realmente mudaram
    const newTimestamp = `${data.length}-${data[0]?.dataHora || ''}-${data[data.length - 1]?.dataHora || ''}`;

    if (newTimestamp !== lastDataTimestamp.current) {
      lastDataTimestamp.current = newTimestamp;
      stableDataRef.current = [...data]; // Criar nova referência estável

      if (isPollingActive) {
        setLastUpdate(new Date());
      }
    }

    return stableDataRef.current;
  }, [data, isPollingActive]);

  // Processar dados para mostrar apenas os últimos 50% dos valores reais
  const processedData = useMemo(() => {
    if (stableData.length === 0) return [];

    // Primeiro, identificar quais pontos são dados reais (não previsões)
    const realDataPoints = stableData.map((point, index) => ({
      ...point,
      originalIndex: index,
      isRealData:
        point.real !== null &&
        point.real !== undefined &&
        (point.previsao === null || point.previsao === undefined),
    }));

    // Contar quantos pontos são dados reais
    const realDataCount = realDataPoints.filter(
      point => point.isRealData
    ).length;

    // Calcular quantos dos últimos pontos reais devem ser mostrados (50%)
    const pointsToShow = Math.ceil(realDataCount * 0.5);

    // Encontrar os índices dos últimos 50% dos dados reais
    const realDataIndices = realDataPoints
      .filter(point => point.isRealData)
      .map(point => point.originalIndex)
      .slice(-pointsToShow); // Pegar apenas os últimos 50%

    // Filtrar dados para incluir apenas:
    // 1. Todos os pontos de previsão
    // 2. Apenas os últimos 50% dos dados reais
    // 3. Pontos de conexão relevantes
    return stableData.filter((point, index) => {
      const isRealData = point.real !== null && point.real !== undefined;
      const isPredictionData =
        point.previsao !== null && point.previsao !== undefined;
      const isConnectionData =
        point.conexao !== null && point.conexao !== undefined;

      // Sempre incluir previsões
      if (isPredictionData) {
        return true;
      }

      // Para dados reais, incluir apenas se estiver nos últimos 50%
      if (isRealData && !isPredictionData) {
        return realDataIndices.includes(index);
      }

      // Para pontos de conexão, incluir apenas se conectam pontos visíveis
      if (isConnectionData) {
        // Verificar se o ponto anterior ou próximo está visível
        const prevIndex = index - 1;
        const nextIndex = index + 1;

        const prevVisible =
          prevIndex >= 0 &&
          ((stableData[prevIndex]?.previsao !== null &&
            stableData[prevIndex]?.previsao !== undefined) ||
            realDataIndices.includes(prevIndex));

        const nextVisible =
          nextIndex < stableData.length &&
          ((stableData[nextIndex]?.previsao !== null &&
            stableData[nextIndex]?.previsao !== undefined) ||
            realDataIndices.includes(nextIndex));

        return prevVisible || nextVisible;
      }

      return false;
    });
  }, [stableData]);
  const valores = useMemo(() => {
    if (!processedData.length) return [0];
    return processedData
      .flatMap(d => [d.real, d.previsao, d.conexao])
      .filter((v): v is number => v !== null && v !== undefined);
  }, [processedData]);

  const { yMin, yMax } = useMemo(() => {
    const yMinOriginal = Math.min(...valores);
    const yMaxOriginal = Math.max(...valores);
    return {
      yMin: yMinOriginal - 0.1,
      yMax: yMaxOriginal + 0.1,
    };
  }, [valores]);

  // Memoize tooltip functions to prevent re-renders
  const tooltipFormatter = useCallback((value: number, name: string) => {
    // Ocultar a linha de conexão na tooltip
    if (name === 'conexao') return [null, null];

    // Formatar valores com 3 casas decimais
    return [value.toFixed(3), name];
  }, []);

  const tooltipLabelFormatter = useCallback((label: string) => {
    // Garantir que a data seja formatada corretamente
    if (!label) return 'Data não disponível';

    try {
      return formatDateTime(label);
    } catch {
      return label; // Retorna o valor original se houver erro
    }
  }, []);

  return (
    <div
      className={`flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg p-6 focus:outline-none focus:ring-0 outline-none ${className}`}
      role='region'
      aria-label='Gráfico de previsão'
      style={{ outline: 'none' }}
    >
      {data.length === 0 ? (
        <p className='text-center mt-4 text-gray-500'>
          {loading ? 'Carregando...' : 'Sem dados para exibir'}
        </p>
      ) : (
        <>
          <div className='w-full flex items-center justify-between mb-4'>
            <div className='flex-1'>
              <h2 className='text-xl font-semibold text-gray-800'>
                {columnName}
              </h2>
              {isPollingActive && lastUpdate && (
                <p className='text-xs text-gray-500 mt-1'>
                  Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
                </p>
              )}
            </div>
          </div>
          <RechartsWrapper
            data={processedData}
            yMin={yMin}
            yMax={yMax}
            formatDateTime={formatDateTime}
            tooltipFormatter={tooltipFormatter}
            tooltipLabelFormatter={tooltipLabelFormatter}
          />
        </>
      )}
    </div>
  );
};

export default LineChart;
