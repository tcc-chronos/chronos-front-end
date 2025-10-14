import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Toast from './Toast';

describe('Toast', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders toast with title', () => {
    render(
      <Toast
        id='test-1'
        type='info'
        title='Test Title'
        isVisible={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders toast with title and message', () => {
    render(
      <Toast
        id='test-1'
        type='info'
        title='Test Title'
        message='Test message content'
        isVisible={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message content')).toBeInTheDocument();
  });

  it('calls onClose with correct id when close button is clicked', () => {
    render(
      <Toast
        id='test-toast-123'
        type='info'
        title='Test'
        isVisible={true}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByLabelText('Fechar notificação');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledWith('test-toast-123');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('applies correct styles for error type', () => {
    const { container } = render(
      <Toast
        id='test-1'
        type='error'
        title='Error'
        isVisible={true}
        onClose={mockOnClose}
      />
    );

    const toastContainer = container.firstChild as HTMLElement;
    expect(toastContainer).toHaveClass(
      'bg-red-50',
      'border-red-200',
      'text-red-800'
    );
  });

  it('applies correct styles for success type', () => {
    const { container } = render(
      <Toast
        id='test-1'
        type='success'
        title='Success'
        isVisible={true}
        onClose={mockOnClose}
      />
    );

    const toastContainer = container.firstChild as HTMLElement;
    expect(toastContainer).toHaveClass(
      'bg-green-50',
      'border-green-200',
      'text-green-800'
    );
  });

  it('applies correct styles for warning type', () => {
    const { container } = render(
      <Toast
        id='test-1'
        type='warning'
        title='Warning'
        isVisible={true}
        onClose={mockOnClose}
      />
    );

    const toastContainer = container.firstChild as HTMLElement;
    expect(toastContainer).toHaveClass(
      'bg-yellow-50',
      'border-yellow-200',
      'text-yellow-800'
    );
  });

  it('applies correct styles for info type', () => {
    const { container } = render(
      <Toast
        id='test-1'
        type='info'
        title='Info'
        isVisible={true}
        onClose={mockOnClose}
      />
    );

    const toastContainer = container.firstChild as HTMLElement;
    expect(toastContainer).toHaveClass(
      'bg-blue-50',
      'border-blue-200',
      'text-blue-800'
    );
  });

  it('applies visible animation classes when isVisible is true', () => {
    const { container } = render(
      <Toast
        id='test-1'
        type='info'
        title='Test'
        isVisible={true}
        onClose={mockOnClose}
      />
    );

    const toastContainer = container.firstChild as HTMLElement;
    expect(toastContainer).toHaveClass(
      'translate-x-0',
      'opacity-100',
      'scale-100'
    );
  });

  it('applies hidden animation classes when isVisible is false', () => {
    const { container } = render(
      <Toast
        id='test-1'
        type='info'
        title='Test'
        isVisible={false}
        onClose={mockOnClose}
      />
    );

    const toastContainer = container.firstChild as HTMLElement;
    expect(toastContainer).toHaveClass(
      'translate-x-full',
      'opacity-0',
      'scale-95'
    );
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(
      <Toast
        id='test-1'
        type='info'
        title='Test'
        isVisible={true}
        onClose={mockOnClose}
      />
    );

    const toastContainer = container.firstChild as HTMLElement;
    expect(toastContainer).toHaveAttribute('role', 'alert');
    expect(toastContainer).toHaveAttribute('aria-live', 'polite');
    expect(toastContainer).toHaveAttribute('aria-atomic', 'true');
  });

  it('renders icon based on type', () => {
    const { container } = render(
      <Toast
        id='test-1'
        type='success'
        title='Success'
        isVisible={true}
        onClose={mockOnClose}
      />
    );

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('does not render message when not provided', () => {
    render(
      <Toast
        id='test-1'
        type='info'
        title='Test Title'
        isVisible={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    const messageElements = screen.queryByText(/message/i);
    expect(messageElements).not.toBeInTheDocument();
  });
});
