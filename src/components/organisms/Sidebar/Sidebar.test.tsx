import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Sidebar from './Sidebar';
import { SidebarProvider } from '../../../hooks/SidebarProvider';
import type { SidebarItemProps } from '../../molecules/SidebarItem/SidebarItem.types';

// Mock do hook useSidebar
const mockSetActiveItem = vi.fn();
const mockUseSidebar = {
  items: [] as SidebarItemProps[],
  activeItemId: null as string | null,
  setActiveItem: mockSetActiveItem,
  addItem: vi.fn(),
  removeItem: vi.fn(),
  clearItems: vi.fn(),
};

vi.mock('../../../hooks/useSidebarHook', () => ({
  useSidebar: () => mockUseSidebar,
  SidebarProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock items para teste
const mockSidebarItems: SidebarItemProps[] = [
  {
    id: 'analytics',
    icon: <div data-testid='analytics-icon'>📊</div>,
    label: 'Analytics',
    content: <div data-testid='analytics-content'>Analytics Content</div>,
  },
  {
    id: 'settings',
    icon: <div data-testid='settings-icon'>⚙️</div>,
    label: 'Settings',
    content: <div data-testid='settings-content'>Settings Content</div>,
  },
  {
    id: 'disabled-item',
    icon: <div data-testid='disabled-icon'>🚫</div>,
    label: 'Disabled',
    disabled: true,
  },
];

// Wrapper para testes
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>{children}</SidebarProvider>
);

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSidebar.items = mockSidebarItems;
    mockUseSidebar.activeItemId = null;
  });

  it('renders sidebar with correct base structure', () => {
    render(<Sidebar />, { wrapper: TestWrapper });

    const sidebar = screen.getByRole('complementary', { hidden: true });
    expect(sidebar).toHaveClass(
      'min-h-full',
      'bg-white',
      'border-r',
      'border-gray-200'
    );
  });

  it('renders all sidebar items', () => {
    render(<Sidebar />, { wrapper: TestWrapper });

    expect(screen.getByTestId('analytics-icon')).toBeInTheDocument();
    expect(screen.getByTestId('settings-icon')).toBeInTheDocument();
    expect(screen.getByTestId('disabled-icon')).toBeInTheDocument();
  });

  it('applies custom className correctly', () => {
    render(<Sidebar className='custom-sidebar' />, { wrapper: TestWrapper });

    const sidebar = screen.getByRole('complementary', { hidden: true });
    expect(sidebar).toHaveClass('custom-sidebar');
  });

  it('does not show expanded content when no item is active', () => {
    render(<Sidebar />, { wrapper: TestWrapper });

    expect(screen.queryByTestId('analytics-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('settings-content')).not.toBeInTheDocument();
  });

  it('shows expanded content when an item is active', () => {
    mockUseSidebar.activeItemId = 'analytics';
    mockUseSidebar.items = mockSidebarItems;

    render(<Sidebar />, { wrapper: TestWrapper });

    expect(screen.getByTestId('analytics-content')).toBeInTheDocument();
    expect(screen.queryByTestId('settings-content')).not.toBeInTheDocument();
  });

  it('displays active item label in expanded header', () => {
    mockUseSidebar.activeItemId = 'analytics';
    mockUseSidebar.items = mockSidebarItems;

    render(<Sidebar />, { wrapper: TestWrapper });

    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('shows close button when item is expanded', () => {
    mockUseSidebar.activeItemId = 'analytics';
    mockUseSidebar.items = mockSidebarItems;

    render(<Sidebar />, { wrapper: TestWrapper });

    const closeButton = screen.getByLabelText('Fechar painel');
    expect(closeButton).toBeInTheDocument();
  });

  it('calls setActiveItem when close button is clicked', () => {
    mockUseSidebar.activeItemId = 'analytics';
    mockUseSidebar.items = mockSidebarItems;

    render(<Sidebar />, { wrapper: TestWrapper });

    const closeButton = screen.getByLabelText('Fechar painel');
    fireEvent.click(closeButton);

    expect(mockSetActiveItem).toHaveBeenCalledWith(null);
  });

  it('handles position prop correctly', () => {
    render(<Sidebar position='right' />, { wrapper: TestWrapper });

    const sidebar = screen.getByRole('complementary', { hidden: true });
    expect(sidebar).toBeInTheDocument();
  });

  it('handles empty items array', () => {
    mockUseSidebar.items = [];

    render(<Sidebar />, { wrapper: TestWrapper });

    const sidebar = screen.getByRole('complementary', { hidden: true });
    expect(sidebar).toBeInTheDocument();
  });

  it('does not show expanded content for items without content', () => {
    const itemWithoutContent: SidebarItemProps = {
      id: 'no-content',
      icon: <div>🔍</div>,
      label: 'No Content',
    };

    mockUseSidebar.items = [itemWithoutContent];
    mockUseSidebar.activeItemId = 'no-content';

    render(<Sidebar />, { wrapper: TestWrapper });

    expect(screen.queryByText('No Content')).not.toBeInTheDocument();
  });

  it('switches between different active items correctly', () => {
    mockUseSidebar.activeItemId = 'settings';
    mockUseSidebar.items = mockSidebarItems;

    render(<Sidebar />, { wrapper: TestWrapper });

    expect(screen.getByTestId('settings-content')).toBeInTheDocument();
    expect(screen.queryByTestId('analytics-content')).not.toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('maintains fixed sidebar width', () => {
    render(<Sidebar />, { wrapper: TestWrapper });

    const fixedSidebar = screen.getByRole('complementary', {
      hidden: true,
    }).firstChild;
    expect(fixedSidebar).toHaveClass('w-20');
  });

  it('expanded content has correct width', () => {
    mockUseSidebar.activeItemId = 'analytics';
    mockUseSidebar.items = mockSidebarItems;

    render(<Sidebar />, { wrapper: TestWrapper });

    const expandedContent = screen
      .getByTestId('analytics-content')
      .closest('.w-80');
    expect(expandedContent).toHaveClass('w-80');
  });
});
