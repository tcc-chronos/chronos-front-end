import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Documentation from './Documentation';
import { SidebarProvider } from '../../../contexts/SidebarProvider';

// Mock do JSON
vi.mock('../../../data/documentation.json', () => ({
  default: {
    title: 'Test Documentation',
    sections: [
      {
        id: 'intro',
        title: 'Introduction',
        content: 'Welcome',
      },
    ],
  },
}));

// Mock do useSidebar
const mockAddItem = vi.fn();
const mockClearItems = vi.fn();

vi.mock('../../../hooks/useSidebar', () => ({
  useSidebar: () => ({
    addItem: mockAddItem,
    clearItems: mockClearItems,
  }),
}));

describe('Documentation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders documentation page title', () => {
    render(
      <SidebarProvider>
        <Documentation />
      </SidebarProvider>
    );
    expect(screen.getByText('Test Documentation')).toBeInTheDocument();
  });

  it('renders sections from data', () => {
    render(
      <SidebarProvider>
        <Documentation />
      </SidebarProvider>
    );
    expect(screen.getByText('Introduction')).toBeInTheDocument();
  });

  it('configures sidebar on mount', () => {
    render(
      <SidebarProvider>
        <Documentation />
      </SidebarProvider>
    );
    expect(mockClearItems).toHaveBeenCalled();
    expect(mockAddItem).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'documentation',
        label: 'Navegação',
      })
    );
  });
});
