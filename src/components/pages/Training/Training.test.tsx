import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { SidebarProvider } from '../../../hooks/SidebarProvider';
import { Training } from '../..';

// Wrapper para componentes que usam Router e Sidebar
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <SidebarProvider>{component}</SidebarProvider>
    </BrowserRouter>
  );
};

describe('Training Component', () => {
  it('renders without crashing', () => {
    const { container } = renderWithProviders(<Training />);
    expect(container).toBeInTheDocument();
  });
});
