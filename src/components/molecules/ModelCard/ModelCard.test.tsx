import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ModelCard from './ModelCard';
import type { Model } from '../../../types/training';

const mockModel: Model = {
  id: 'model-1',
  name: 'Test Model',
  rnnType: 'LSTM',
  createdAt: '2024-01-15T10:00:00Z',
  device: 'sensor-123',
  attribute: 'temperature',
  status: 'idle',
  trainings: [
    {
      id: 'training-1',
      trainingDate: '2024-01-16T10:00:00Z',
      dataVolume: 1000,
      status: 'completed',
      error: null,
      metrics: {
        mae: 0.1234,
        mse: 0.5678,
        rmse: 0.9012,
        theil_u: 0.3456,
      },
    },
    {
      id: 'training-2',
      trainingDate: '2024-01-17T10:00:00Z',
      dataVolume: 2000,
      status: 'running',
      error: null,
      metrics: {
        mae: 0,
        mse: 0,
        rmse: 0,
        theil_u: 0,
      },
    },
  ],
};

describe('ModelCard', () => {
  const mockOnToggleExpanded = vi.fn();
  const mockOnCopyParams = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnNewTraining = vi.fn();
  const mockOnDeleteTraining = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders model information correctly', () => {
    render(
      <ModelCard
        model={mockModel}
        isExpanded={false}
        onToggleExpanded={mockOnToggleExpanded}
        onCopyParams={mockOnCopyParams}
        onDelete={mockOnDelete}
        onNewTraining={mockOnNewTraining}
        onDeleteTraining={mockOnDeleteTraining}
      />
    );

    expect(screen.getByText('Test Model')).toBeInTheDocument();
    expect(screen.getByText('LSTM')).toBeInTheDocument();
    expect(screen.getByText('sensor-123')).toBeInTheDocument();
    expect(screen.getByText('temperature')).toBeInTheDocument();
    expect(screen.getByText('Inativo')).toBeInTheDocument();
  });

  it('formats date correctly', () => {
    render(
      <ModelCard
        model={mockModel}
        isExpanded={false}
        onToggleExpanded={mockOnToggleExpanded}
        onCopyParams={mockOnCopyParams}
        onDelete={mockOnDelete}
        onNewTraining={mockOnNewTraining}
      />
    );

    expect(screen.getByText('15/01/2024')).toBeInTheDocument();
  });

  it('calls onCopyParams when copy button is clicked', () => {
    render(
      <ModelCard
        model={mockModel}
        isExpanded={false}
        onToggleExpanded={mockOnToggleExpanded}
        onCopyParams={mockOnCopyParams}
        onDelete={mockOnDelete}
        onNewTraining={mockOnNewTraining}
      />
    );

    const copyButton = screen.getByLabelText('Copiar parâmetros');
    fireEvent.click(copyButton);

    expect(mockOnCopyParams).toHaveBeenCalledTimes(1);
  });

  it('calls onNewTraining when play button is clicked', () => {
    render(
      <ModelCard
        model={mockModel}
        isExpanded={false}
        onToggleExpanded={mockOnToggleExpanded}
        onCopyParams={mockOnCopyParams}
        onDelete={mockOnDelete}
        onNewTraining={mockOnNewTraining}
      />
    );

    const playButton = screen.getByLabelText('Novo treinamento');
    fireEvent.click(playButton);

    expect(mockOnNewTraining).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <ModelCard
        model={mockModel}
        isExpanded={false}
        onToggleExpanded={mockOnToggleExpanded}
        onCopyParams={mockOnCopyParams}
        onDelete={mockOnDelete}
        onNewTraining={mockOnNewTraining}
      />
    );

    const deleteButton = screen.getByLabelText('Excluir modelo');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('calls onToggleExpanded when expand button is clicked', () => {
    render(
      <ModelCard
        model={mockModel}
        isExpanded={false}
        onToggleExpanded={mockOnToggleExpanded}
        onCopyParams={mockOnCopyParams}
        onDelete={mockOnDelete}
        onNewTraining={mockOnNewTraining}
      />
    );

    const expandButton = screen.getByLabelText('Mostrar treinamentos');
    fireEvent.click(expandButton);

    expect(mockOnToggleExpanded).toHaveBeenCalledTimes(1);
  });

  it('shows trainings when expanded', () => {
    render(
      <ModelCard
        model={mockModel}
        isExpanded={true}
        onToggleExpanded={mockOnToggleExpanded}
        onCopyParams={mockOnCopyParams}
        onDelete={mockOnDelete}
        onNewTraining={mockOnNewTraining}
        onDeleteTraining={mockOnDeleteTraining}
      />
    );

    expect(screen.getByText('Treinamentos (2)')).toBeInTheDocument();
    expect(screen.getByText(/16\/01\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/17\/01\/2024/)).toBeInTheDocument();
  });

  it('hides trainings when not expanded', () => {
    render(
      <ModelCard
        model={mockModel}
        isExpanded={false}
        onToggleExpanded={mockOnToggleExpanded}
        onCopyParams={mockOnCopyParams}
        onDelete={mockOnDelete}
        onNewTraining={mockOnNewTraining}
      />
    );

    expect(screen.queryByText('Treinamentos (2)')).not.toBeInTheDocument();
  });

  it('shows empty state when no trainings', () => {
    const modelWithoutTrainings = { ...mockModel, trainings: [] };

    render(
      <ModelCard
        model={modelWithoutTrainings}
        isExpanded={true}
        onToggleExpanded={mockOnToggleExpanded}
        onCopyParams={mockOnCopyParams}
        onDelete={mockOnDelete}
        onNewTraining={mockOnNewTraining}
      />
    );

    expect(screen.getByText('Treinamentos (0)')).toBeInTheDocument();
    expect(
      screen.getByText('Nenhum treinamento realizado ainda.')
    ).toBeInTheDocument();
  });

  it('disables new training button when model is training', () => {
    const trainingModel = { ...mockModel, status: 'training' };

    render(
      <ModelCard
        model={trainingModel}
        isExpanded={false}
        onToggleExpanded={mockOnToggleExpanded}
        onCopyParams={mockOnCopyParams}
        onDelete={mockOnDelete}
        onNewTraining={mockOnNewTraining}
      />
    );

    const playButton = screen.getByLabelText('Novo treinamento');
    expect(playButton).toBeDisabled();
  });

  it('applies correct status colors', () => {
    const { rerender } = render(
      <ModelCard
        model={{ ...mockModel, status: 'idle' }}
        isExpanded={false}
        onToggleExpanded={mockOnToggleExpanded}
        onCopyParams={mockOnCopyParams}
        onDelete={mockOnDelete}
        onNewTraining={mockOnNewTraining}
      />
    );

    let statusBadge = screen.getByText('Inativo');
    expect(statusBadge).toHaveClass('bg-gray-100', 'text-gray-800');

    rerender(
      <ModelCard
        model={{ ...mockModel, status: 'training' }}
        isExpanded={false}
        onToggleExpanded={mockOnToggleExpanded}
        onCopyParams={mockOnCopyParams}
        onDelete={mockOnDelete}
        onNewTraining={mockOnNewTraining}
      />
    );

    statusBadge = screen.getByText('Treinando');
    expect(statusBadge).toHaveClass('bg-blue-100', 'text-blue-800');

    rerender(
      <ModelCard
        model={{ ...mockModel, status: 'completed' }}
        isExpanded={false}
        onToggleExpanded={mockOnToggleExpanded}
        onCopyParams={mockOnCopyParams}
        onDelete={mockOnDelete}
        onNewTraining={mockOnNewTraining}
      />
    );

    statusBadge = screen.getByText('Concluído');
    expect(statusBadge).toHaveClass('bg-green-100', 'text-green-800');

    rerender(
      <ModelCard
        model={{ ...mockModel, status: 'error' }}
        isExpanded={false}
        onToggleExpanded={mockOnToggleExpanded}
        onCopyParams={mockOnCopyParams}
        onDelete={mockOnDelete}
        onNewTraining={mockOnNewTraining}
      />
    );

    statusBadge = screen.getByText('Erro');
    expect(statusBadge).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('changes expand icon based on state', () => {
    const { rerender } = render(
      <ModelCard
        model={mockModel}
        isExpanded={false}
        onToggleExpanded={mockOnToggleExpanded}
        onCopyParams={mockOnCopyParams}
        onDelete={mockOnDelete}
        onNewTraining={mockOnNewTraining}
      />
    );

    expect(screen.getByLabelText('Mostrar treinamentos')).toBeInTheDocument();

    rerender(
      <ModelCard
        model={mockModel}
        isExpanded={true}
        onToggleExpanded={mockOnToggleExpanded}
        onCopyParams={mockOnCopyParams}
        onDelete={mockOnDelete}
        onNewTraining={mockOnNewTraining}
      />
    );

    expect(screen.getByLabelText('Ocultar treinamentos')).toBeInTheDocument();
  });

  it('renders training cards when expanded', () => {
    render(
      <ModelCard
        model={mockModel}
        isExpanded={true}
        onToggleExpanded={mockOnToggleExpanded}
        onCopyParams={mockOnCopyParams}
        onDelete={mockOnDelete}
        onNewTraining={mockOnNewTraining}
        onDeleteTraining={mockOnDeleteTraining}
      />
    );

    expect(screen.getByText('1.000')).toBeInTheDocument();
    expect(screen.getByText('2.000')).toBeInTheDocument();
  });
});
