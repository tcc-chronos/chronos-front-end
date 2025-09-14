import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SidebarItem from './SidebarItem';
import type { SidebarItemProps } from './SidebarItem.types';

// Mock do IconButton
vi.mock('../../atoms/IconButton', () => ({
  IconButton: ({
    icon,
    isActive,
    onClick,
    disabled,
    ariaLabel,
    tooltip,
    size,
  }: {
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    disabled: boolean;
    ariaLabel: string;
    tooltip?: string;
    size: string;
  }) => (
    <button
      data-testid='icon-button'
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={tooltip}
      className={`icon-button ${isActive ? 'active' : ''} size-${size}`}
    >
      {icon}
    </button>
  ),
}));

const mockIcon = <div data-testid='mock-icon'>🔍</div>;
const mockContent = <div data-testid='mock-content'>Test Content</div>;

const defaultProps: SidebarItemProps = {
  id: 'test-item',
  icon: mockIcon,
  label: 'Test Item',
};

describe('SidebarItem', () => {
  it('renders with basic props', () => {
    render(<SidebarItem {...defaultProps} />);

    const iconButton = screen.getByTestId('icon-button');
    expect(iconButton).toBeInTheDocument();
    expect(iconButton).toHaveAttribute('aria-label', 'Test Item');
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('calls onClick with correct id when clicked', () => {
    const mockOnClick = vi.fn();

    render(<SidebarItem {...defaultProps} onClick={mockOnClick} />);

    const iconButton = screen.getByTestId('icon-button');
    fireEvent.click(iconButton);

    expect(mockOnClick).toHaveBeenCalledWith('test-item');
  });

  it('does not call onClick when disabled', () => {
    const mockOnClick = vi.fn();

    render(
      <SidebarItem {...defaultProps} onClick={mockOnClick} disabled={true} />
    );

    const iconButton = screen.getByTestId('icon-button');
    fireEvent.click(iconButton);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when no onClick provided', () => {
    const mockOnClick = vi.fn();

    render(<SidebarItem {...defaultProps} />);

    const iconButton = screen.getByTestId('icon-button');
    fireEvent.click(iconButton);

    // Should not throw error when onClick is undefined
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('applies active state correctly', () => {
    render(<SidebarItem {...defaultProps} isActive={true} />);

    const iconButton = screen.getByTestId('icon-button');
    expect(iconButton).toHaveClass('active');
  });

  it('applies disabled state correctly', () => {
    render(<SidebarItem {...defaultProps} disabled={true} />);

    const iconButton = screen.getByTestId('icon-button');
    expect(iconButton).toBeDisabled();
  });

  it('passes tooltip to IconButton', () => {
    const tooltipText = 'This is a tooltip';

    render(<SidebarItem {...defaultProps} tooltip={tooltipText} />);

    const iconButton = screen.getByTestId('icon-button');
    expect(iconButton).toHaveAttribute('title', tooltipText);
  });

  it('applies custom className', () => {
    render(<SidebarItem {...defaultProps} className='custom-class' />);

    const container = screen
      .getByTestId('icon-button')
      .closest('.custom-class');
    expect(container).toBeInTheDocument();
  });

  it('passes additional props correctly', () => {
    render(
      <SidebarItem {...defaultProps} data-testid='sidebar-item-container' />
    );

    const container = screen.getByTestId('sidebar-item-container');
    expect(container).toBeInTheDocument();
  });

  it('hides content when not active', () => {
    render(
      <SidebarItem {...defaultProps} content={mockContent} isActive={false} />
    );

    expect(screen.queryByTestId('mock-content')).not.toBeInTheDocument();
  });

  it('shows hidden content when active and content is provided', () => {
    render(
      <SidebarItem {...defaultProps} content={mockContent} isActive={true} />
    );

    const contentContainer = screen.getByTestId('mock-content');
    expect(contentContainer).toBeInTheDocument();
    expect(contentContainer.closest('.hidden')).toBeInTheDocument();
  });

  it('does not render content div when no content provided', () => {
    render(<SidebarItem {...defaultProps} isActive={true} />);

    // Should not have a hidden content div when no content
    const hiddenDiv = screen.queryByTestId('mock-content');
    expect(hiddenDiv).not.toBeInTheDocument();
  });

  it('passes correct size to IconButton', () => {
    render(<SidebarItem {...defaultProps} />);

    const iconButton = screen.getByTestId('icon-button');
    expect(iconButton).toHaveClass('size-md');
  });

  it('handles complex icons correctly', () => {
    const complexIcon = (
      <svg data-testid='complex-icon' viewBox='0 0 24 24'>
        <path d='M12 2L2 7v10c0 5.55 3.84 9.95 9 10 5.16-.05 9-4.45 9-10V7l-10-5z' />
      </svg>
    );

    render(<SidebarItem {...defaultProps} icon={complexIcon} />);

    expect(screen.getByTestId('complex-icon')).toBeInTheDocument();
  });

  it('handles click without crashing when disabled and no onClick', () => {
    render(<SidebarItem {...defaultProps} disabled={true} />);

    const iconButton = screen.getByTestId('icon-button');

    // Should not crash when clicking disabled item without onClick
    expect(() => {
      fireEvent.click(iconButton);
    }).not.toThrow();
  });

  it('maintains proper structure with flex layout', () => {
    render(<SidebarItem {...defaultProps} />);

    const container = screen
      .getByTestId('icon-button')
      .closest('.flex.flex-col');
    expect(container).toBeInTheDocument();
  });

  it('centers IconButton properly', () => {
    render(<SidebarItem {...defaultProps} />);

    const buttonContainer = screen
      .getByTestId('icon-button')
      .closest('.flex.items-center.justify-center.p-2');
    expect(buttonContainer).toBeInTheDocument();
  });
});
