import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import type { NavigationItem } from '../../molecules/Navigation/Navigation.types';

const mockNavigationItems: NavigationItem[] = [
  { label: 'Treinamentos', href: '/treinamentos' },
  { label: 'Painel', href: '/painel' },
  { label: 'Documentação', href: '/documentacao' },
];

// Wrapper para React Router
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Header', () => {
  it('renders logo with Chronos text', () => {
    render(<Header />, { wrapper: RouterWrapper });

    expect(screen.getByLabelText('Logotipo Chronos')).toBeInTheDocument();
    expect(screen.getByText('Chronos')).toBeInTheDocument();
  });

  it('renders default navigation items when none provided', () => {
    render(<Header />, { wrapper: RouterWrapper });

    expect(
      screen.getByRole('link', { name: 'Treinamentos' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Painel' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Documentação' })
    ).toBeInTheDocument();
  });

  it('renders custom navigation items when provided', () => {
    render(<Header navigationItems={mockNavigationItems} />, {
      wrapper: RouterWrapper,
    });

    expect(
      screen.getByRole('link', { name: 'Treinamentos' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Painel' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Documentação' })
    ).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Header className='custom-header' />, { wrapper: RouterWrapper });

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('custom-header');
  });

  it('applies correct logo size', () => {
    render(<Header logoSize='lg' />, { wrapper: RouterWrapper });

    const logo = screen.getByLabelText('Logotipo Chronos');
    expect(logo).toHaveClass('h-10', 'w-10');
  });

  it('has proper semantic structure', () => {
    render(<Header />, { wrapper: RouterWrapper });

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
