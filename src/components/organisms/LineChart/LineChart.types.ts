export interface ChartDataPoint {
  dataHora: string;
  real: number | null;
  previsao: number | null;
  conexao?: number | null; // Linha pontilhada de conexão entre real e previsão
}

export interface LineChartProps {
  data: ChartDataPoint[];
  columnName?: string;
  loading?: boolean;
  className?: string;
  isPollingActive?: boolean;
}
