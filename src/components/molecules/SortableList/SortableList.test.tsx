import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SortableList from './SortableList';
import type { Layer } from './SortableList.types';

vi.mock('sortablejs', () => ({
  default: {
    create: vi.fn(() => ({
      destroy: vi.fn(),
    })),
  },
}));

const mockLayersRNN: Layer[] = [
  {
    id: 'rnn-1',
    type: 'RNN',
    neurons: 64,
    dropout: 0.2,
  },
  {
    id: 'rnn-2',
    type: 'RNN',
    neurons: 32,
    dropout: 0.1,
  },
];

const mockLayersDense: Layer[] = [
  {
    id: 'dense-1',
    type: 'Dense',
    neurons: 16,
    dropout: 0.0,
  },
];

describe('SortableList', () => {
  const mockOnOrderChangeRNN = vi.fn();
  const mockOnOrderChangeDense = vi.fn();
  const mockOnRemoveLayer = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders RNN layers section', () => {
    render(
      <SortableList
        layersRNN={mockLayersRNN}
        layersDense={[]}
        onOrderChangeRNN={mockOnOrderChangeRNN}
        onOrderChangeDense={mockOnOrderChangeDense}
        onRemoveLayer={mockOnRemoveLayer}
      />
    );

    expect(screen.getByText('Camadas RNN:')).toBeInTheDocument();
  });

  it('renders Dense layers section', () => {
    render(
      <SortableList
        layersRNN={[]}
        layersDense={mockLayersDense}
        onOrderChangeRNN={mockOnOrderChangeRNN}
        onOrderChangeDense={mockOnOrderChangeDense}
        onRemoveLayer={mockOnRemoveLayer}
      />
    );

    expect(screen.getByText('Camadas Dense:')).toBeInTheDocument();
  });

  it('renders RNN layers with correct information', () => {
    render(
      <SortableList
        layersRNN={mockLayersRNN}
        layersDense={[]}
        onOrderChangeRNN={mockOnOrderChangeRNN}
        onOrderChangeDense={mockOnOrderChangeDense}
        onRemoveLayer={mockOnRemoveLayer}
      />
    );

    expect(screen.getAllByText('Camada RNN')).toHaveLength(2);
    expect(screen.getByText('64 neurônios | Dropout: 0.2')).toBeInTheDocument();
    expect(screen.getByText('32 neurônios | Dropout: 0.1')).toBeInTheDocument();
  });

  it('renders Dense layers with correct information', () => {
    render(
      <SortableList
        layersRNN={[]}
        layersDense={mockLayersDense}
        onOrderChangeRNN={mockOnOrderChangeRNN}
        onOrderChangeDense={mockOnOrderChangeDense}
        onRemoveLayer={mockOnRemoveLayer}
      />
    );

    expect(screen.getByText('Camada Dense')).toBeInTheDocument();
    expect(screen.getByText('16 neurônios | Dropout: 0')).toBeInTheDocument();
  });

  it('calls onRemoveLayer for RNN layer when delete button is clicked', () => {
    render(
      <SortableList
        layersRNN={mockLayersRNN}
        layersDense={[]}
        onOrderChangeRNN={mockOnOrderChangeRNN}
        onOrderChangeDense={mockOnOrderChangeDense}
        onRemoveLayer={mockOnRemoveLayer}
      />
    );

    const deleteButtons = screen.getAllByTitle('Remover camada');
    fireEvent.click(deleteButtons[0]);

    expect(mockOnRemoveLayer).toHaveBeenCalledWith('rnn-1', 'RNN');
  });

  it('calls onRemoveLayer for Dense layer when delete button is clicked', () => {
    render(
      <SortableList
        layersRNN={[]}
        layersDense={mockLayersDense}
        onOrderChangeRNN={mockOnOrderChangeRNN}
        onOrderChangeDense={mockOnOrderChangeDense}
        onRemoveLayer={mockOnRemoveLayer}
      />
    );

    const deleteButton = screen.getByTitle('Remover camada');
    fireEvent.click(deleteButton);

    expect(mockOnRemoveLayer).toHaveBeenCalledWith('dense-1', 'Dense');
  });

  it('shows empty state when no RNN layers', () => {
    render(
      <SortableList
        layersRNN={[]}
        layersDense={[]}
        onOrderChangeRNN={mockOnOrderChangeRNN}
        onOrderChangeDense={mockOnOrderChangeDense}
        onRemoveLayer={mockOnRemoveLayer}
      />
    );

    expect(
      screen.getByText('Nenhuma camada adicionada ainda.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Use o formulário acima para adicionar camadas.')
    ).toBeInTheDocument();
  });

  it('does not show empty state when layers exist', () => {
    render(
      <SortableList
        layersRNN={mockLayersRNN}
        layersDense={[]}
        onOrderChangeRNN={mockOnOrderChangeRNN}
        onOrderChangeDense={mockOnOrderChangeDense}
        onRemoveLayer={mockOnRemoveLayer}
      />
    );

    expect(
      screen.queryByText('Nenhuma camada adicionada ainda.')
    ).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <SortableList
        layersRNN={[]}
        layersDense={[]}
        onOrderChangeRNN={mockOnOrderChangeRNN}
        onOrderChangeDense={mockOnOrderChangeDense}
        onRemoveLayer={mockOnRemoveLayer}
        className='custom-class'
      />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('renders drag handles for layers', () => {
    const { container } = render(
      <SortableList
        layersRNN={mockLayersRNN}
        layersDense={[]}
        onOrderChangeRNN={mockOnOrderChangeRNN}
        onOrderChangeDense={mockOnOrderChangeDense}
        onRemoveLayer={mockOnRemoveLayer}
      />
    );

    const dragHandles = container.querySelectorAll('.drag-handle');
    expect(dragHandles.length).toBe(2);
  });

  it('renders multiple RNN and Dense layers together', () => {
    render(
      <SortableList
        layersRNN={mockLayersRNN}
        layersDense={mockLayersDense}
        onOrderChangeRNN={mockOnOrderChangeRNN}
        onOrderChangeDense={mockOnOrderChangeDense}
        onRemoveLayer={mockOnRemoveLayer}
      />
    );

    expect(screen.getAllByText('Camada RNN')).toHaveLength(2);
    expect(screen.getByText('Camada Dense')).toBeInTheDocument();
  });

  it('renders delete buttons for all layers', () => {
    render(
      <SortableList
        layersRNN={mockLayersRNN}
        layersDense={mockLayersDense}
        onOrderChangeRNN={mockOnOrderChangeRNN}
        onOrderChangeDense={mockOnOrderChangeDense}
        onRemoveLayer={mockOnRemoveLayer}
      />
    );

    const deleteButtons = screen.getAllByTitle('Remover camada');
    expect(deleteButtons).toHaveLength(3);
  });
});
