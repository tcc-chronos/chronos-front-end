import { useContext } from 'react';
import { SidebarContext } from '../contexts/SidebarContext';
import type { SidebarContextType } from '../types/sidebar';

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
