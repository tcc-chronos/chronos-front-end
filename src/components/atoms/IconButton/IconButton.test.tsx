import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import IconButton from './IconButton';

const mockIcon = <span>📍</span>;

describe('IconButton', () => {
  it('renders with icon', () => {
    render(<IconButton icon={mockIcon} ariaLabel='Test icon' />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('📍')).toBeInTheDocument();
  });

  it('applies active styles when isActive is true', () => {
    render(<IconButton icon={mockIcon} isActive ariaLabel='Active icon' />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-brand-primary-dark', 'text-white');
  });

  it('applies inactive styles when isActive is false', () => {
    render(
      <IconButton icon={mockIcon} isActive={false} ariaLabel='Inactive icon' />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-gray-600');
    expect(button).not.toHaveClass('bg-brand-primary-dark');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(
      <IconButton
        icon={mockIcon}
        onClick={handleClick}
        ariaLabel='Clickable icon'
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct size classes', () => {
    render(<IconButton icon={mockIcon} size='lg' ariaLabel='Large icon' />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-12', 'h-12');
  });

  it('is disabled when disabled prop is true', () => {
    render(<IconButton icon={mockIcon} disabled ariaLabel='Disabled icon' />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      'disabled:opacity-50',
      'disabled:cursor-not-allowed'
    );
  });

  it('shows tooltip when provided', () => {
    render(
      <IconButton
        icon={mockIcon}
        tooltip='This is a tooltip'
        ariaLabel='Icon with tooltip'
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'This is a tooltip');
  });
});
