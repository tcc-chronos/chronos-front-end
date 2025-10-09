import React, { useState, useCallback } from 'react';
import {
  NotificationContext,
  type Notification,
  type NotificationContextType,
} from '../contexts/NotificationContext';

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isVisible: false }
          : notification
      )
    );

    // Remove completely after animation
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 300);
  }, []);

  const addNotification = useCallback(
    (
      notification: Omit<Notification, 'id' | 'isVisible' | 'createdAt'>
    ): string => {
      const id = generateId();
      const newNotification: Notification = {
        ...notification,
        id,
        isVisible: true,
        createdAt: new Date(),
        duration: notification.duration ?? 5000, // Default 5 seconds
      };

      setNotifications(prev => [...prev, newNotification]);

      // Auto-dismiss if duration > 0
      if (newNotification.duration && newNotification.duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }

      return id;
    },
    [generateId, removeNotification]
  );

  const clearAll = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isVisible: false }))
    );

    // Remove all after animation
    setTimeout(() => {
      setNotifications([]);
    }, 300);
  }, []);

  // Convenience methods
  const addError = useCallback(
    (title: string, message?: string, duration = 8000): string => {
      return addNotification({ type: 'error', title, message, duration });
    },
    [addNotification]
  );

  const addSuccess = useCallback(
    (title: string, message?: string, duration = 4000): string => {
      return addNotification({ type: 'success', title, message, duration });
    },
    [addNotification]
  );

  const addWarning = useCallback(
    (title: string, message?: string, duration = 6000): string => {
      return addNotification({ type: 'warning', title, message, duration });
    },
    [addNotification]
  );

  const addInfo = useCallback(
    (title: string, message?: string, duration = 5000): string => {
      return addNotification({ type: 'info', title, message, duration });
    },
    [addNotification]
  );

  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    addError,
    addSuccess,
    addWarning,
    addInfo,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
