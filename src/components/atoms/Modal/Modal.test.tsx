import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Modal from './Modal';

describe('Modal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={mockOnClose} title='Test Modal'>
        <div>Content</div>
      </Modal>
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title='Test Modal'>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('renders modal without title', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title='Test Modal'>
        <div>Content</div>
      </Modal>
    );

    const closeButton = screen.getByLabelText('Fechar modal');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title='Test Modal'>
        <div>Content</div>
      </Modal>
    );

    const overlay = screen.getByRole('dialog');
    fireEvent.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when content is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title='Test Modal'>
        <div>Content</div>
      </Modal>
    );

    const content = screen.getByText('Content');
    fireEvent.click(content);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('does not close on overlay click when preventCloseOnOverlay is true', () => {
    render(
      <Modal
        isOpen={true}
        onClose={mockOnClose}
        title='Test Modal'
        preventCloseOnOverlay={true}
      >
        <div>Content</div>
      </Modal>
    );

    const overlay = screen.getByRole('dialog');
    fireEvent.click(overlay);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('closes on Escape key press', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title='Test Modal'>
        <div>Content</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('applies correct size classes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={mockOnClose} title='Test' size='sm'>
        <div>Content</div>
      </Modal>
    );

    let modalContent = screen.getByText('Test').parentElement?.parentElement;
    expect(modalContent).toHaveClass('max-w-md');

    rerender(
      <Modal isOpen={true} onClose={mockOnClose} title='Test' size='md'>
        <div>Content</div>
      </Modal>
    );

    modalContent = screen.getByText('Test').parentElement?.parentElement;
    expect(modalContent).toHaveClass('max-w-lg');

    rerender(
      <Modal isOpen={true} onClose={mockOnClose} title='Test' size='lg'>
        <div>Content</div>
      </Modal>
    );

    modalContent = screen.getByText('Test').parentElement?.parentElement;
    expect(modalContent).toHaveClass('max-w-2xl');

    rerender(
      <Modal isOpen={true} onClose={mockOnClose} title='Test' size='xl'>
        <div>Content</div>
      </Modal>
    );

    modalContent = screen.getByText('Test').parentElement?.parentElement;
    expect(modalContent).toHaveClass('max-w-4xl');
  });

  it('sets body overflow hidden when open', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title='Test Modal'>
        <div>Content</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body overflow when closed', () => {
    const { unmount } = render(
      <Modal isOpen={true} onClose={mockOnClose} title='Test Modal'>
        <div>Content</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('unset');
  });

  it('has proper accessibility attributes', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title='Test Modal'>
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('does not have aria-labelledby when no title is provided', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });
});
