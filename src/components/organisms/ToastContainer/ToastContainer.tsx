import React from 'react';
import Toast from '../../atoms/Toast/Toast';
import { useNotifications } from '../../../hooks/useNotifications';

const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className='fixed top-4 right-4 z-50 space-y-2'>
      {notifications.map(notification => (
        <Toast
          key={notification.id}
          id={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
