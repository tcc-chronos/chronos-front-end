import React, { useState, useCallback, useEffect } from 'react';
import { SidebarContext } from '../contexts/SidebarContext';
import type { SidebarProviderProps } from '../types/sidebar';
import type { SidebarItemProps } from '../components/molecules/SidebarItem/SidebarItem.types';

const SIDEBAR_STORAGE_KEY = 'chronos-sidebar-active-item';

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
}) => {
  const [items, setItems] = useState<SidebarItemProps[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(() => {
    // Carregar o item ativo do localStorage na inicialização
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SIDEBAR_STORAGE_KEY);
    }
    return null;
  });

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
    // Persistir no localStorage
    if (typeof window !== 'undefined') {
      if (id) {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, id);
      } else {
        localStorage.removeItem(SIDEBAR_STORAGE_KEY);
      }
    }
  }, []);

  // Verificar se o item ativo ainda existe quando os itens mudarem
  useEffect(() => {
    if (activeItemId && items.length > 0) {
      const itemExists = items.some(item => item.id === activeItemId);
      if (!itemExists) {
        // Se o item ativo não existe mais, limpar a seleção
        setActiveItem(null);
      }
    }
  }, [items, activeItemId, setActiveItem]);

  const clearItems = useCallback(() => {
    setItems([]);
    setActiveItem(null);
  }, [setActiveItem]);

  const clearItemsPreservingActive = useCallback(() => {
    setItems([]);
    // Não limpa o activeItemId, mantendo a seleção
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
        clearItemsPreservingActive,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
