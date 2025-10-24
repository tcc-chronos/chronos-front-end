import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Navigation from './Navigation';
import type { NavigationItem } from './Navigation.types';

const mockItems: NavigationItem[] = [
  { label: 'Training', href: '/training' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Documentation', href: '/docs' },
];

// Wrapper para React Router
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Navigation', () => {
  it('renders all navigation items', () => {
    render(<Navigation items={mockItems} />, { wrapper: RouterWrapper });

    expect(screen.getByRole('link', { name: 'Training' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Documentation' })
    ).toBeInTheDocument();
  });

  it('applies correct href to links', () => {
    render(<Navigation items={mockItems} />, { wrapper: RouterWrapper });

    expect(screen.getByRole('link', { name: 'Training' })).toHaveAttribute(
      'href',
      '/training'
    );
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'href',
      '/dashboard'
    );
    expect(screen.getByRole('link', { name: 'Documentation' })).toHaveAttribute(
      'href',
      '/docs'
    );
  });

  it('calls onItemClick when item is clicked', () => {
    const handleItemClick = vi.fn();
    render(<Navigation items={mockItems} onItemClick={handleItemClick} />, {
      wrapper: RouterWrapper,
    });

    const trainingLink = screen.getByRole('link', { name: 'Training' });
    fireEvent.click(trainingLink);

    expect(handleItemClick).toHaveBeenCalledTimes(1);
    expect(handleItemClick).toHaveBeenCalledWith(
      mockItems[0],
      expect.any(Object)
    );
  });

  it('applies custom className', () => {
    render(<Navigation items={mockItems} className='custom-nav' />, {
      wrapper: RouterWrapper,
    });

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('custom-nav');
  });

  it('has proper accessibility attributes', () => {
    render(<Navigation items={mockItems} />, { wrapper: RouterWrapper });

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Navegação principal');
  });
});
