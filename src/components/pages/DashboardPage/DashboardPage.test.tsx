import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DashboardPage from './DashboardPage';
import { SidebarProvider } from '../../../hooks/SidebarProvider';

const DashboardPageWithProvider = () => (
  <SidebarProvider>
    <DashboardPage />
  </SidebarProvider>
);

describe('DashboardPage', () => {
  it('renders main heading', () => {
    render(<DashboardPageWithProvider />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders welcome message', () => {
    render(<DashboardPageWithProvider />);
    expect(
      screen.getByText(/Bem-vindo ao painel principal/)
    ).toBeInTheDocument();
  });

  it('renders simplified content', () => {
    render(<DashboardPageWithProvider />);

    // Verifica se o texto atualizado está presente
    expect(
      screen.getByText(/Use a sidebar para visualizar as métricas/)
    ).toBeInTheDocument();
  });

  it('does not render removed content', () => {
    render(<DashboardPageWithProvider />);

    // Verifica que o conteúdo removido não está mais presente
    expect(screen.queryByText('Analytics')).not.toBeInTheDocument();
    expect(screen.queryByText('Projetos')).not.toBeInTheDocument();
    expect(screen.queryByText('Relatórios')).not.toBeInTheDocument();
    expect(screen.queryByText('Como usar')).not.toBeInTheDocument();
  });
});
