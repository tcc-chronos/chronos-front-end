import type { SidebarItemProps } from '../../molecules/SidebarItem/SidebarItem.types';

export interface SidebarProps {
  items: SidebarItemProps[];
  defaultActiveItemId?: string;
  onItemChange?: (activeItemId: string | null) => void;
  className?: string;
  position?: 'left' | 'right';
  isCollapsible?: boolean;
  isInitiallyCollapsed?: boolean;
}
