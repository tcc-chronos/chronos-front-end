import React, { useState, useCallback, useMemo } from 'react';
import {
  NotificationContext,
  type Notification,
  type NotificationContextType,
} from '../contexts/NotificationContext';

// Constants for better maintainability
const DEFAULT_NOTIFICATION_DURATION = 5000; // 5 seconds
const ANIMATION_DURATION = 300; // milliseconds

interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number; // Limit concurrent notifications
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 5,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Memoized ID generator for better performance
  const generateId = useCallback(() => {
    return `notification-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
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
    }, ANIMATION_DURATION);
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
        duration: notification.duration ?? DEFAULT_NOTIFICATION_DURATION,
      };

      // Limit concurrent notifications
      setNotifications(prev => {
        const updated = [...prev, newNotification];
        if (updated.length > maxNotifications) {
          // Remove oldest visible notifications
          const visibleNotifications = updated.filter(n => n.isVisible);
          const toRemove = visibleNotifications.slice(
            0,
            visibleNotifications.length - maxNotifications
          );
          toRemove.forEach(n => removeNotification(n.id));
          return updated.slice(-maxNotifications);
        }
        return updated;
      });

      // Auto-dismiss if duration > 0
      if (newNotification.duration && newNotification.duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }

      return id;
    },
    [generateId, removeNotification, maxNotifications]
  );

  const clearAll = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isVisible: false }))
    );

    // Remove all after animation
    setTimeout(() => {
      setNotifications([]);
    }, ANIMATION_DURATION);
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

  // Memoize context value to prevent unnecessary re-renders
  const contextValue: NotificationContextType = useMemo(
    () => ({
      notifications,
      addNotification,
      removeNotification,
      clearAll,
      addError,
      addSuccess,
      addWarning,
      addInfo,
    }),
    [
      notifications,
      addNotification,
      removeNotification,
      clearAll,
      addError,
      addSuccess,
      addWarning,
      addInfo,
    ]
  );

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
