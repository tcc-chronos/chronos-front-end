import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BasicTrainingSidebarContent from './BasicTrainingSidebarContent';

// Mock do store
const mockSetField = vi.fn();
vi.mock('../../../store/trainingSidebarStore', () => ({
  useTrainingSidebarStore: vi.fn(() => ({
    rnn_type: undefined,
    device: undefined,
    attribute: undefined,
    epochs: undefined,
    n_steps_ahead: undefined,
    setField: mockSetField,
  })),
}));

describe('BasicTrainingSidebarContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<BasicTrainingSidebarContent />);

    expect(screen.getByLabelText(/tipo de rnn/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dispositivo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/atributo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/épocas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/janela de previsão/i)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(<BasicTrainingSidebarContent />);

    const submitButton = screen.getByRole('button', {
      name: /treinar modelo/i,
    });
    expect(submitButton).toBeInTheDocument();
  });

  it('submit button is disabled when form is invalid', () => {
    render(<BasicTrainingSidebarContent />);

    const submitButton = screen.getByRole('button', {
      name: /treinar modelo/i,
    });
    expect(submitButton).toBeDisabled();
  });

  it('applies custom className', () => {
    const { container } = render(
      <BasicTrainingSidebarContent className='custom-class' />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('disables attribute field when no device is selected', () => {
    render(<BasicTrainingSidebarContent />);

    const attributeSelect = screen.getByLabelText(/atributo/i);
    expect(attributeSelect).toBeDisabled();
  });

  it('renders RNN type options correctly', () => {
    render(<BasicTrainingSidebarContent />);

    const rnnTypeSelect = screen.getByLabelText(/tipo de rnn/i);
    const options = rnnTypeSelect.querySelectorAll('option');

    // Should have placeholder + 2 options (LSTM, GRU)
    expect(options).toHaveLength(3);
    expect(options[1]).toHaveValue('lstm');
    expect(options[1]).toHaveTextContent('LSTM');
    expect(options[2]).toHaveValue('gru');
    expect(options[2]).toHaveTextContent('GRU');
  });

  it('renders with SidebarContent wrapper', () => {
    render(<BasicTrainingSidebarContent />);

    expect(screen.getByText('Configuração de Treinamento')).toBeInTheDocument();
  });

  it('has proper form structure', () => {
    const { container } = render(<BasicTrainingSidebarContent />);

    const form = container.querySelector('.space-y-4');
    expect(form).toBeInTheDocument();
  });

  it('renders all required field indicators', () => {
    render(<BasicTrainingSidebarContent />);

    const requiredMarks = screen.getAllByLabelText('required');
    expect(requiredMarks).toHaveLength(5); // All fields are required
  });
});
