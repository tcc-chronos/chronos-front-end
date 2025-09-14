import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Icon from './Icon';

describe('Icon', () => {
  it('renders icon correctly', () => {
    render(<Icon name='info' />);

    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies correct size classes', () => {
    render(<Icon name='info' size='lg' />);

    const icon = document.querySelector('svg');
    expect(icon).toHaveClass('w-6', 'h-6');
  });

  it('applies custom className', () => {
    render(<Icon name='info' className='custom-class' />);

    const icon = document.querySelector('svg');
    expect(icon).toHaveClass('custom-class');
  });

  it('applies custom color', () => {
    render(<Icon name='info' color='#ff0000' />);

    const icon = document.querySelector('svg');
    expect(icon).toHaveAttribute('fill', '#ff0000');
  });

  it('renders different icon types', () => {
    const { rerender } = render(<Icon name='info' />);
    expect(document.querySelector('svg')).toBeInTheDocument();

    rerender(<Icon name='warning' />);
    expect(document.querySelector('svg')).toBeInTheDocument();

    rerender(<Icon name='error' />);
    expect(document.querySelector('svg')).toBeInTheDocument();

    rerender(<Icon name='success' />);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });
});
