import type { ReactNode } from 'react';

export interface SidebarContentProps {
  title: string;
  children: ReactNode;
  className?: string;
  headerActions?: ReactNode;
  footer?: ReactNode;
  variant?: 'default' | 'compact' | 'detailed';
}
