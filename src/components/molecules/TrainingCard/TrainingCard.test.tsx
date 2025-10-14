import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TrainingCard from './TrainingCard';
import type { ModelTraining } from '../../../types/training';

const mockTraining: ModelTraining = {
  id: 'training-1',
  trainingDate: '2024-01-15T10:30:00Z',
  dataVolume: 5000,
  status: 'completed',
  metrics: {
    mae: 0.1234,
    mse: 0.5678,
    rmse: 0.7531,
    theil_u: 0.4321,
  },
};

describe('TrainingCard', () => {
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders training information correctly', () => {
    render(
      <TrainingCard
        training={mockTraining}
        modelId='model-1'
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
    expect(screen.getByText('5.000')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
  });

  it('renders all metrics correctly', () => {
    render(
      <TrainingCard
        training={mockTraining}
        modelId='model-1'
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('MAE')).toBeInTheDocument();
    expect(screen.getByText('0.1234')).toBeInTheDocument();

    expect(screen.getByText('MSE')).toBeInTheDocument();
    expect(screen.getByText('0.5678')).toBeInTheDocument();

    expect(screen.getByText('RMSE')).toBeInTheDocument();
    expect(screen.getByText('0.7531')).toBeInTheDocument();

    expect(screen.getByText('Theil U')).toBeInTheDocument();
    expect(screen.getByText('0.4321')).toBeInTheDocument();
  });

  it('formats metrics to 4 decimal places', () => {
    const trainingWithLargeMetrics: ModelTraining = {
      ...mockTraining,
      metrics: {
        mae: 1.23456789,
        mse: 2.34567891,
        rmse: 3.45678912,
        theil_u: 4.56789123,
      },
    };

    render(
      <TrainingCard
        training={trainingWithLargeMetrics}
        modelId='model-1'
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('1.2346')).toBeInTheDocument();
    expect(screen.getByText('2.3457')).toBeInTheDocument();
    expect(screen.getByText('3.4568')).toBeInTheDocument();
    expect(screen.getByText('4.5679')).toBeInTheDocument();
  });

  it('calls onDelete with training id when delete button is clicked', () => {
    render(
      <TrainingCard
        training={mockTraining}
        modelId='model-1'
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByLabelText('Excluir treinamento');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('training-1');
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('does not render delete button when onDelete is not provided', () => {
    render(<TrainingCard training={mockTraining} modelId='model-1' />);

    const deleteButton = screen.queryByLabelText('Excluir treinamento');
    expect(deleteButton).not.toBeInTheDocument();
  });

  it('applies correct status colors for pending', () => {
    render(
      <TrainingCard
        training={{ ...mockTraining, status: 'pending' }}
        modelId='model-1'
        onDelete={mockOnDelete}
      />
    );

    const statusBadge = screen.getByText('pending');
    expect(statusBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('applies correct status colors for running', () => {
    render(
      <TrainingCard
        training={{ ...mockTraining, status: 'running' }}
        modelId='model-1'
        onDelete={mockOnDelete}
      />
    );

    const statusBadge = screen.getByText('running');
    expect(statusBadge).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('applies correct status colors for completed', () => {
    render(
      <TrainingCard
        training={{ ...mockTraining, status: 'completed' }}
        modelId='model-1'
        onDelete={mockOnDelete}
      />
    );

    const statusBadge = screen.getByText('completed');
    expect(statusBadge).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('applies correct status colors for failed', () => {
    render(
      <TrainingCard
        training={{ ...mockTraining, status: 'failed' }}
        modelId='model-1'
        onDelete={mockOnDelete}
      />
    );

    const statusBadge = screen.getByText('failed');
    expect(statusBadge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('formats data volume with locale string', () => {
    render(
      <TrainingCard
        training={{ ...mockTraining, dataVolume: 1234567 }}
        modelId='model-1'
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('1.234.567')).toBeInTheDocument();
  });

  it('renders metrics section header', () => {
    render(
      <TrainingCard
        training={mockTraining}
        modelId='model-1'
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Métricas de Performance')).toBeInTheDocument();
  });

  it('renders with zero metrics', () => {
    const trainingWithZeroMetrics: ModelTraining = {
      ...mockTraining,
      metrics: {
        mae: 0,
        mse: 0,
        rmse: 0,
        theil_u: 0,
      },
    };

    render(
      <TrainingCard
        training={trainingWithZeroMetrics}
        modelId='model-1'
        onDelete={mockOnDelete}
      />
    );

    const zeroValues = screen.getAllByText('0.0000');
    expect(zeroValues).toHaveLength(4);
  });

  it('has proper layout structure', () => {
    const { container } = render(
      <TrainingCard
        training={mockTraining}
        modelId='model-1'
        onDelete={mockOnDelete}
      />
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-gray-50', 'rounded-lg', 'p-4', 'border');
  });
});
