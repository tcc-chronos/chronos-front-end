import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { DefaultLayout } from '../..';

// Mock do Outlet do React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid='outlet'>Outlet Content</div>,
  };
});

// Wrapper para componentes que usam Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('DefaultLayout Template', () => {
  it('renders without crashing', () => {
    const { container } = renderWithRouter(<DefaultLayout />);
    expect(container).toBeInTheDocument();
  });

  it('renders the outlet for nested routes', () => {
    const { getByTestId } = renderWithRouter(<DefaultLayout />);
    expect(getByTestId('outlet')).toBeInTheDocument();
  });
});
