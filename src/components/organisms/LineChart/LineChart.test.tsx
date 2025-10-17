import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LineChart from './LineChart';
import type { ChartDataPoint } from './LineChart.types';

describe('LineChart', () => {
  const mockData: ChartDataPoint[] = [
    { dataHora: '2024-01-01T00:00:00', real: 10, previsao: 9.5 },
    { dataHora: '2024-01-01T01:00:00', real: 12, previsao: 11.8 },
    { dataHora: '2024-01-01T02:00:00', real: null, previsao: 13.2 },
  ];

  it('should render loading message when loading is true', () => {
    render(<LineChart data={[]} loading={true} />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('should render empty state message when no data is provided', () => {
    render(<LineChart data={[]} loading={false} />);
    expect(screen.getByText('Sem dados para exibir')).toBeInTheDocument();
  });

  it('should render chart with data', () => {
    render(<LineChart data={mockData} columnName='Temperatura' />);
    expect(screen.getByText('Temperatura')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <LineChart data={mockData} className='custom-class' />
    );
    const chartContainer = container.querySelector('.custom-class');
    expect(chartContainer).toBeInTheDocument();
  });

  it('should have accessibility attributes', () => {
    render(<LineChart data={mockData} />);
    const region = screen.getByRole('region', {
      name: 'Gráfico de previsão',
    });
    expect(region).toBeInTheDocument();
  });
});
