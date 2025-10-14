import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConfirmDeleteModal, NewTrainingModal } from './ModalsContainer';

describe('ConfirmDeleteModal', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with title and message', () => {
    render(
      <ConfirmDeleteModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title='Confirmar Exclusão'
        message='Tem certeza que deseja excluir?'
      />
    );

    expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument();
    expect(
      screen.getByText('Tem certeza que deseja excluir?')
    ).toBeInTheDocument();
  });

  it('renders cancel and confirm buttons', () => {
    render(
      <ConfirmDeleteModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title='Test Title'
        message='Test message'
      />
    );

    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Excluir')).toBeInTheDocument();
  });

  it('renders custom confirm text when provided', () => {
    render(
      <ConfirmDeleteModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title='Test'
        message='Test'
        confirmText='Deletar'
      />
    );

    expect(screen.getByText('Deletar')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <ConfirmDeleteModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title='Test'
        message='Test'
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(
      <ConfirmDeleteModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title='Test'
        message='Test'
      />
    );

    const confirmButton = screen.getByText('Excluir');
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isLoading is true', () => {
    render(
      <ConfirmDeleteModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title='Test'
        message='Test'
        isLoading={true}
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    const confirmButton = screen.getByText(/Carregando|Excluir/);

    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toBeDisabled();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ConfirmDeleteModal
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title='Test'
        message='Test'
      />
    );

    expect(container.firstChild).toBeNull();
  });
});

describe('NewTrainingModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with model name in title', () => {
    render(
      <NewTrainingModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        modelName='Test Model'
      />
    );

    expect(
      screen.getByText('Novo Treinamento - Test Model')
    ).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(
      <NewTrainingModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        modelName='Test Model'
      />
    );

    expect(
      screen.getByText(
        'Configure os parâmetros para o novo treinamento do modelo.'
      )
    ).toBeInTheDocument();
  });

  it('renders data volume input field', () => {
    render(
      <NewTrainingModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        modelName='Test Model'
      />
    );

    expect(screen.getByLabelText(/Volume de dados/i)).toBeInTheDocument();
  });

  it('calls onSubmit with form data when submit button is clicked', async () => {
    render(
      <NewTrainingModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        modelName='Test Model'
      />
    );

    const input = screen.getByLabelText(/Volume de dados/i);
    fireEvent.change(input, { target: { value: '100' } });

    const submitButton = screen.getByText('Treinar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ dataVolume: 100 });
    });
  });

  it('resets form when modal is closed', () => {
    const { rerender } = render(
      <NewTrainingModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        modelName='Test Model'
      />
    );

    const input = screen.getByLabelText(/Volume de dados/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: '500' } });

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    rerender(
      <NewTrainingModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        modelName='Test Model'
      />
    );

    const newInput = screen.getByLabelText(
      /Volume de dados/i
    ) as HTMLInputElement;
    expect(newInput.value).toBe('1');
  });

  it('clears error when valid value is entered', async () => {
    render(
      <NewTrainingModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        modelName='Test Model'
      />
    );

    const input = screen.getByLabelText(/Volume de dados/i) as HTMLInputElement;
    const submitButton = screen.getByText('Treinar');

    // Forçar o valor diretamente no input para simular um valor inválido
    Object.defineProperty(input, 'value', {
      writable: true,
      value: '0',
    });
    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.click(submitButton);

    // Agora setar um valor válido
    fireEvent.change(input, { target: { value: '10' } });

    await waitFor(() => {
      expect(
        screen.queryByText('Volume de dados deve ser no mínimo 1')
      ).not.toBeInTheDocument();
    });
  });

  it('disables buttons when isLoading is true', () => {
    render(
      <NewTrainingModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        modelName='Test Model'
        isLoading={true}
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    const submitButton = screen.getByText(/Carregando|Treinar/);

    expect(cancelButton).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('renders hint text for data volume field', () => {
    render(
      <NewTrainingModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        modelName='Test Model'
      />
    );

    expect(
      screen.getByText('Quantidade mínima de dados para o treinamento')
    ).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <NewTrainingModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        modelName='Test Model'
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(
      <NewTrainingModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        modelName='Test Model'
      />
    );

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
