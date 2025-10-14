import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PollingIndicator from './PollingIndicator';

describe('PollingIndicator', () => {
  it('renders nothing when isActive is false', () => {
    const { container } = render(<PollingIndicator isActive={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders indicator when isActive is true', () => {
    render(<PollingIndicator isActive={true} />);
    expect(screen.getByText('Atualizando...')).toBeInTheDocument();
  });

  it('renders custom text', () => {
    render(<PollingIndicator isActive={true} text='Processando dados...' />);
    expect(screen.getByText('Processando dados...')).toBeInTheDocument();
  });

  it('applies size classes correctly', () => {
    const { rerender, container } = render(
      <PollingIndicator isActive={true} size='sm' />
    );

    let indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('text-xs', 'px-2', 'py-1');

    rerender(<PollingIndicator isActive={true} size='md' />);
    indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('text-sm', 'px-3', 'py-2');

    rerender(<PollingIndicator isActive={true} size='lg' />);
    indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('text-base', 'px-4', 'py-3');
  });

  it('applies variant classes correctly', () => {
    const { rerender, container } = render(
      <PollingIndicator isActive={true} variant='primary' />
    );

    let indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass(
      'text-blue-600',
      'bg-blue-50',
      'border-blue-200'
    );

    rerender(<PollingIndicator isActive={true} variant='secondary' />);
    indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass(
      'text-gray-600',
      'bg-gray-50',
      'border-gray-200'
    );

    rerender(<PollingIndicator isActive={true} variant='success' />);
    indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass(
      'text-green-600',
      'bg-green-50',
      'border-green-200'
    );
  });

  it('applies custom className', () => {
    const { container } = render(
      <PollingIndicator isActive={true} className='custom-class' />
    );

    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('custom-class');
  });

  it('renders spinning icon', () => {
    const { container } = render(<PollingIndicator isActive={true} />);

    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('animate-spin');
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(<PollingIndicator isActive={true} />);

    const icon = container.querySelector('svg');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('uses default values when not provided', () => {
    const { container } = render(<PollingIndicator isActive={true} />);

    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('text-sm');
    expect(indicator).toHaveClass('text-blue-600');
    expect(screen.getByText('Atualizando...')).toBeInTheDocument();
  });
});
