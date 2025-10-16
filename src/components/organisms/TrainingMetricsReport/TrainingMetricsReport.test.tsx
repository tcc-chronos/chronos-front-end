import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TrainingMetricsReport from './TrainingMetricsReport';
import type { TrainingMetrics } from './TrainingMetricsReport.types';

describe('TrainingMetricsReport', () => {
  const mockMetrics: TrainingMetrics = {
    success: true,
    training_time: 45.3,
    training_datetime: '2024-01-01T12:00:00',
    mean_absolute_error: 0.123,
    root_mean_squared_error: 0.456,
  };

  it('should return null when metrics is null', () => {
    const { container } = render(<TrainingMetricsReport metrics={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render training information', () => {
    render(<TrainingMetricsReport metrics={mockMetrics} />);

    expect(screen.getByText('Relatório de Treinamento')).toBeInTheDocument();
    expect(screen.getByText('Sucesso')).toBeInTheDocument();
    expect(screen.getByText('45.3s')).toBeInTheDocument();
  });

  it('should render MAE metric', () => {
    render(<TrainingMetricsReport metrics={mockMetrics} />);

    expect(screen.getByText('MAE')).toBeInTheDocument();
    expect(screen.getByText('0.123')).toBeInTheDocument();
  });

  it('should render RMSE metric', () => {
    render(<TrainingMetricsReport metrics={mockMetrics} />);

    expect(screen.getByText('RMSE')).toBeInTheDocument();
    expect(screen.getByText('0.456')).toBeInTheDocument();
  });

  it('should show failure status when success is false', () => {
    const failedMetrics = { ...mockMetrics, success: false };
    render(<TrainingMetricsReport metrics={failedMetrics} />);

    expect(screen.getByText('Falha')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <TrainingMetricsReport metrics={mockMetrics} className='custom-class' />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should format datetime correctly', () => {
    render(<TrainingMetricsReport metrics={mockMetrics} />);

    // A data será formatada de acordo com a localização pt-BR
    expect(screen.getByText(/01\/01\/2024/)).toBeInTheDocument();
  });
});
