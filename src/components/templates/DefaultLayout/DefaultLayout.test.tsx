import { render } from '../../../test/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { DefaultLayout } from '../..';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Outlet: () => <div data-testid='outlet'>Outlet Content</div>,
  };
});

describe('DefaultLayout Template', () => {
  it('renders without crashing', () => {
    const { container } = render(<DefaultLayout />);
    expect(container).toBeInTheDocument();
  });

  it('renders the outlet for nested routes', () => {
    const { getByTestId } = render(<DefaultLayout />);
    expect(getByTestId('outlet')).toBeInTheDocument();
  });
});
