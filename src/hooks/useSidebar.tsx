import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  SidebarContextType,
  SidebarProviderProps,
} from '../types/sidebar';
import type { SidebarItemProps } from '../components/molecules/SidebarItem/SidebarItem.types';

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  const [items, setItems] = useState<SidebarItemProps[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const addItem = useCallback((item: SidebarItemProps) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        existingItem => existingItem.id === item.id
      );
      if (existingIndex !== -1) {
        const newItems = [...prev];
        newItems[existingIndex] = item;
        return newItems;
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setActiveItemId(prev => (prev === id ? null : prev));
  }, []);

  const setActiveItem = useCallback((id: string | null) => {
    setActiveItemId(id);
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
    setActiveItemId(null);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        items,
        activeItemId,
        addItem,
        removeItem,
        setActiveItem,
        clearItems,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
