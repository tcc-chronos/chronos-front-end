import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DataTrainingSidebarContent from './DataTrainingSidebarContent';

// Mock do store
vi.mock('../../../store/trainingSidebarStore', () => ({
  useTrainingSidebarStore: vi.fn(() => ({
    window_size: 60,
    learning_rate: 0.001,
    dropout_rate: 0.2,
    early_stopping_patience: 5,
    volume: 1000,
    setField: vi.fn(),
  })),
}));

describe('DataTrainingSidebarContent', () => {
  it('renders all form fields', () => {
    render(<DataTrainingSidebarContent />);

    expect(screen.getByLabelText(/janela de entrada/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/taxa de aprendizado/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/taxa de dropout/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/paciência de early stopping/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/volume de treinamento/i)).toBeInTheDocument();
  });

  it('renders with default className', () => {
    const { container } = render(<DataTrainingSidebarContent />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(<DataTrainingSidebarContent className='custom-class' />);

    expect(screen.getByText('Configuração de Dados')).toBeInTheDocument();
  });
});
