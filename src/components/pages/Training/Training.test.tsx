import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Training } from '../..';

// Wrapper para componentes que usam Router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Training Component', () => {
  it('renders without crashing', () => {
    const { container } = renderWithRouter(<Training />);
    expect(container).toBeInTheDocument();
  });
});
