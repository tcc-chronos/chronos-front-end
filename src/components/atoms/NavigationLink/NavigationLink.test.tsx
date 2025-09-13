import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import NavigationLink from './NavigationLink';

// Wrapper para React Router
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('NavigationLink', () => {
  it('renders link with correct text and href', () => {
    render(<NavigationLink href='/test'>Test Link</NavigationLink>, {
      wrapper: RouterWrapper,
    });

    const link = screen.getByRole('link', { name: 'Test Link' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('applies base classes correctly', () => {
    render(<NavigationLink href='/test'>Link</NavigationLink>, {
      wrapper: RouterWrapper,
    });

    const link = screen.getByRole('link', { name: 'Link' });
    expect(link).toHaveClass('px-3', 'py-2', 'rounded-md', 'font-secondary');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(
      <NavigationLink href='/test' onClick={handleClick}>
        Clickable Link
      </NavigationLink>,
      { wrapper: RouterWrapper }
    );

    const link = screen.getByRole('link', { name: 'Clickable Link' });
    fireEvent.click(link);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(
      <NavigationLink href='/test' className='custom-class'>
        Custom Link
      </NavigationLink>,
      { wrapper: RouterWrapper }
    );

    const link = screen.getByRole('link', { name: 'Custom Link' });
    expect(link).toHaveClass('custom-class');
  });
});
