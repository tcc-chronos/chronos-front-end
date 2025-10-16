import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../../test/test-utils';
import DashboardSidebarContent from './DashboardSidebarContent';
import { useModels } from '../../../hooks/useModels';

vi.mock('../../../hooks/useModels');

const mockModels = [
  {
    id: 'model-1',
    name: 'Modelo Teste 1',
    rnnType: 'lstm',
    device: 'Device-001',
    attribute: 'temperature',
    createdAt: '2024-01-01',
    status: 'trained',
    trainings: [
      {
        id: 'training-1',
        trainingDate: '2024-01-01T12:00:00Z',
        dataVolume: 1000,
        status: 'completed' as const,
        metrics: { mae: 0.1, mse: 0.2, rmse: 0.3, theil_u: 0.01 },
      },
    ],
  },
];

describe('DashboardSidebarContent', () => {
  beforeEach(() => {
    vi.mocked(useModels).mockReturnValue({
      models: mockModels,
      loading: false,
      error: null,
      deleteModel: vi.fn(),
      createTraining: vi.fn(),
      deleteTraining: vi.fn(),
      copyModelParams: vi.fn(),
      fetchModels: vi.fn(),
      isPolling: false,
    });
  });

  it('renders search input', () => {
    render(<DashboardSidebarContent />);
    expect(screen.getByLabelText('Buscar Modelos')).toBeInTheDocument();
  });

  it('filters models by search query', () => {
    render(<DashboardSidebarContent />);

    const searchInput = screen.getByLabelText('Buscar Modelos');
    fireEvent.change(searchInput, { target: { value: 'Teste 1' } });

    expect(screen.getByText('Modelo Teste 1')).toBeInTheDocument();
  });

  it('expands and collapses model trainings', () => {
    render(<DashboardSidebarContent />);

    const expandButton = screen.getByLabelText('Mostrar treinamentos');
    fireEvent.click(expandButton);

    expect(screen.getByText(/1.000/)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(useModels).mockReturnValue({
      models: [],
      loading: true,
      error: null,
      deleteModel: vi.fn(),
      createTraining: vi.fn(),
      deleteTraining: vi.fn(),
      copyModelParams: vi.fn(),
      fetchModels: vi.fn(),
      isPolling: false,
    });

    render(<DashboardSidebarContent />);
    expect(screen.getByText('Carregando modelos...')).toBeInTheDocument();
  });

  it('shows empty state when no models with trainings', () => {
    vi.mocked(useModels).mockReturnValue({
      models: [],
      loading: false,
      error: null,
      deleteModel: vi.fn(),
      createTraining: vi.fn(),
      deleteTraining: vi.fn(),
      copyModelParams: vi.fn(),
      fetchModels: vi.fn(),
      isPolling: false,
    });

    render(<DashboardSidebarContent />);
    expect(
      screen.getByText(
        'Nenhum modelo com treinamentos disponível para predição.'
      )
    ).toBeInTheDocument();
  });

  it('filters models to show only those with trainings', () => {
    const modelsWithAndWithoutTrainings = [
      ...mockModels,
      {
        id: 'model-2',
        name: 'Modelo Sem Treinamentos',
        rnnType: 'gru',
        device: 'Device-002',
        attribute: 'humidity',
        createdAt: '2024-01-02',
        status: 'created',
        trainings: [], // Sem treinamentos
      },
    ];

    vi.mocked(useModels).mockReturnValue({
      models: modelsWithAndWithoutTrainings,
      loading: false,
      error: null,
      deleteModel: vi.fn(),
      createTraining: vi.fn(),
      deleteTraining: vi.fn(),
      copyModelParams: vi.fn(),
      fetchModels: vi.fn(),
      isPolling: false,
    });

    render(<DashboardSidebarContent />);

    // Deve mostrar apenas o modelo com treinamentos
    expect(screen.getByText('Modelo Teste 1')).toBeInTheDocument();
    expect(
      screen.queryByText('Modelo Sem Treinamentos')
    ).not.toBeInTheDocument();
  });
});
