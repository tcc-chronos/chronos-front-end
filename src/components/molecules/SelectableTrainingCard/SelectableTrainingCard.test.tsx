import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectableTrainingCard from './SelectableTrainingCard';
import type { ModelTraining } from '../../../types/training';

const mockTraining: ModelTraining = {
  id: '1',
  trainingDate: '2024-01-01T12:00:00Z',
  dataVolume: 1000,
  status: 'completed',
  error: null,
  metrics: {
    mae: 0.1234,
    mse: 0.5678,
    rmse: 0.7536,
    theil_u: 0.0123,
  },
};

describe('SelectableTrainingCard', () => {
  it('renders training information', () => {
    render(
      <SelectableTrainingCard training={mockTraining} modelId='model-1' />
    );
    expect(screen.getByText('Volume de dados: 1.000')).toBeInTheDocument();
    expect(screen.getByText('0.123')).toBeInTheDocument();
    expect(screen.getByText('0.754')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const handleSelect = vi.fn();
    render(
      <SelectableTrainingCard
        training={mockTraining}
        modelId='model-1'
        onSelect={handleSelect}
      />
    );

    const card = screen.getByRole('button');
    fireEvent.click(card);

    expect(handleSelect).toHaveBeenCalledWith('1');
  });

  it('shows selected state with visual indicator', () => {
    render(
      <SelectableTrainingCard
        training={mockTraining}
        modelId='model-1'
        isSelected
      />
    );

    const card = screen.getByRole('button');
    expect(card).toHaveClass('border-blue-500');
    expect(card).toHaveClass('bg-blue-50');
  });

  it('disables selection for non-completed trainings', () => {
    const pendingTraining = { ...mockTraining, status: 'pending' as const };
    const { container } = render(
      <SelectableTrainingCard training={pendingTraining} modelId='model-1' />
    );

    const card = container.firstChild;
    expect(card).toHaveClass('cursor-not-allowed');
    expect(card).toHaveClass('opacity-60');
    expect(card).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows check icon for completed trainings', () => {
    render(
      <SelectableTrainingCard training={mockTraining} modelId='model-1' />
    );

    const checkIcon = screen.getByRole('button');
    expect(checkIcon).toBeInTheDocument();
  });
});
