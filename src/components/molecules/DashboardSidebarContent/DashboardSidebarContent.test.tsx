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
    expect(screen.getByLabelText('Buscar modelos:')).toBeInTheDocument();
  });

  it('filters models by search query', () => {
    render(<DashboardSidebarContent />);

    const searchInput = screen.getByLabelText('Buscar modelos:');
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

  it('shows empty state when no models with completed trainings', () => {
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
        'Nenhum modelo com treinamento completo disponível para predição.'
      )
    ).toBeInTheDocument();
  });

  it('filters models to show only those with completed trainings', () => {
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

    // Deve mostrar apenas o modelo com treinamentos completos
    expect(screen.getByText('Modelo Teste 1')).toBeInTheDocument();
    expect(
      screen.queryByText('Modelo Sem Treinamentos')
    ).not.toBeInTheDocument();
  });

  it('filters models to exclude those with only non-completed trainings', () => {
    const modelsWithIncompleteTrainings = [
      ...mockModels,
      {
        id: 'model-3',
        name: 'Modelo Com Treinamentos Incompletos',
        rnnType: 'gru',
        device: 'Device-003',
        attribute: 'pressure',
        createdAt: '2024-01-03',
        status: 'training',
        trainings: [
          {
            id: 'training-2',
            trainingDate: '2024-01-03T12:00:00Z',
            dataVolume: 500,
            status: 'running' as const,
            metrics: { mae: 0, mse: 0, rmse: 0, theil_u: 0 },
          },
          {
            id: 'training-3',
            trainingDate: '2024-01-03T14:00:00Z',
            dataVolume: 750,
            status: 'failed' as const,
            metrics: { mae: 0, mse: 0, rmse: 0, theil_u: 0 },
          },
        ],
      },
    ];

    vi.mocked(useModels).mockReturnValue({
      models: modelsWithIncompleteTrainings,
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

    // Deve mostrar apenas o modelo com treinamentos completos
    expect(screen.getByText('Modelo Teste 1')).toBeInTheDocument();
    expect(
      screen.queryByText('Modelo Com Treinamentos Incompletos')
    ).not.toBeInTheDocument();
  });
});
