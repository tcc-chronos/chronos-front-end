import { createContext } from 'react';

export interface PageLifecycleContextType {
  currentPage: string;
  isPageActive: (page: string) => boolean;
}

export const PageLifecycleContext =
  createContext<PageLifecycleContextType | null>(null);
