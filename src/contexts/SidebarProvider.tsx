import React, { useState, useCallback } from 'react';
import { SidebarContext } from '../contexts/SidebarContext';
import type { SidebarProviderProps } from '../types/sidebar';
import type { SidebarItemProps } from '../components/molecules/SidebarItem/SidebarItem.types';

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
