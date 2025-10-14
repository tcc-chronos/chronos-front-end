import { createContext } from 'react';

export interface Notification {
  id: string;
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  isVisible: boolean;
  createdAt: Date;
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, 'id' | 'isVisible' | 'createdAt'>
  ) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  addError: (title: string, message?: string, duration?: number) => string;
  addSuccess: (title: string, message?: string, duration?: number) => string;
  addWarning: (title: string, message?: string, duration?: number) => string;
  addInfo: (title: string, message?: string, duration?: number) => string;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);
