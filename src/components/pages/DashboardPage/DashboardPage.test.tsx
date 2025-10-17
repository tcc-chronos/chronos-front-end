import { screen } from '@testing-library/react';
import { render } from '../../../test/test-utils';
import { describe, it, expect } from 'vitest';
import DashboardPage from './DashboardPage';

describe('DashboardPage', () => {
  it('renders main heading', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders line chart component', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Sem dados para exibir')).toBeInTheDocument();
  });

  it('renders training metrics report', () => {
    render(<DashboardPage />);
    expect(
      screen.getByRole('region', { name: 'Gráfico de previsão' })
    ).toBeInTheDocument();
  });

  it('does not render removed content', () => {
    render(<DashboardPage />);

    expect(screen.queryByText('Analytics')).not.toBeInTheDocument();
    expect(screen.queryByText('Projetos')).not.toBeInTheDocument();
    expect(screen.queryByText('Relatórios')).not.toBeInTheDocument();
    expect(screen.queryByText('Como usar')).not.toBeInTheDocument();
  });
});
