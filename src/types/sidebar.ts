import type { ReactNode } from 'react';
import type { SidebarItemProps } from '../components/molecules/SidebarItem/SidebarItem.types';

export interface SidebarContextType {
  items: SidebarItemProps[];
  activeItemId: string | null;
  addItem: (item: SidebarItemProps) => void;
  removeItem: (id: string) => void;
  setActiveItem: (id: string | null) => void;
  clearItems: () => void;
}

export interface SidebarProviderProps {
  children: ReactNode;
}
