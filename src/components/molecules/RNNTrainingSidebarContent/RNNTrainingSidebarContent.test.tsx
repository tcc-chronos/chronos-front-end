import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RNNTrainingSidebarContent from './RNNTrainingSidebarContent';

// Mock do store
vi.mock('../../../store/trainingSidebarStore', () => ({
  useTrainingSidebarStore: vi.fn(() => ({
    rnn_units: [128],
    dense_units: [64],
    setField: vi.fn(),
  })),
}));

// Mock do SortableList
vi.mock('../SortableList', () => ({
  SortableList: ({
    layersRNN,
    layersDense,
  }: {
    layersRNN: unknown[];
    layersDense: unknown[];
  }) => (
    <div data-testid='sortable-list'>
      <div data-testid='rnn-layers'>{layersRNN.length} RNN layers</div>
      <div data-testid='dense-layers'>{layersDense.length} Dense layers</div>
    </div>
  ),
}));

describe('RNNTrainingSidebarContent', () => {
  it('renders form fields', () => {
    render(<RNNTrainingSidebarContent />);

    expect(screen.getByLabelText(/neurônios/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo da camada/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /adicionar camada/i })
    ).toBeInTheDocument();
  });

  it('renders SortableList component', () => {
    render(<RNNTrainingSidebarContent />);

    expect(screen.getByTestId('sortable-list')).toBeInTheDocument();
    expect(screen.getByTestId('rnn-layers')).toHaveTextContent('1 RNN layers');
    expect(screen.getByTestId('dense-layers')).toHaveTextContent(
      '1 Dense layers'
    );
  });

  it('validates form before adding layer', () => {
    render(<RNNTrainingSidebarContent />);

    const addButton = screen.getByRole('button', { name: /adicionar camada/i });
    expect(addButton).toBeDisabled();
  });

  it('renders with custom className', () => {
    render(<RNNTrainingSidebarContent className='custom-class' />);

    expect(screen.getByText('Configuração de RNN')).toBeInTheDocument();
  });
});
