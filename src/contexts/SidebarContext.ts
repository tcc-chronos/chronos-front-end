import { createContext } from 'react';
import type { SidebarContextType } from '../types/sidebar';

export const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined
);
