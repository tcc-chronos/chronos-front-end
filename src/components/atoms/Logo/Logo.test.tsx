import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Logo from './Logo';

describe('Logo', () => {
  it('renders logo with text by default', () => {
    render(<Logo />);

    expect(screen.getByLabelText('Chronos Logo')).toBeInTheDocument();
    expect(screen.getByText('Chronos')).toBeInTheDocument();
  });

  it('renders logo without text when showText is false', () => {
    render(<Logo showText={false} />);

    expect(screen.getByLabelText('Chronos Logo')).toBeInTheDocument();
    expect(screen.queryByText('Chronos')).not.toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    render(<Logo size='lg' />);

    const logo = screen.getByLabelText('Chronos Logo');
    expect(logo).toHaveClass('h-10', 'w-10');
  });

  it('applies custom className', () => {
    render(<Logo className='custom-class' />);

    const container = screen.getByLabelText('Chronos Logo').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('applies correct text size classes', () => {
    render(<Logo size='xl' />);

    const text = screen.getByText('Chronos');
    expect(text).toHaveClass('text-2xl');
  });
});
