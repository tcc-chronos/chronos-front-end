import React from 'react';
import Icon from '../Icon/Icon';
import type { ToastProps } from './Toast.types';

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  isVisible,
  onClose,
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'error':
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: 'text-red-500',
          button: 'text-red-500 hover:text-red-700 hover:bg-red-100',
        };
      case 'success':
        return {
          container: 'bg-green-50 border-green-200 text-green-800',
          icon: 'text-green-500',
          button: 'text-green-500 hover:text-green-700 hover:bg-green-100',
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: 'text-yellow-500',
          button: 'text-yellow-500 hover:text-yellow-700 hover:bg-yellow-100',
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: 'text-blue-500',
          button: 'text-blue-500 hover:text-blue-700 hover:bg-blue-100',
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200 text-gray-800',
          icon: 'text-gray-500',
          button: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
        };
    }
  };

  const styles = getTypeStyles();

  const getIconName = (): 'error' | 'success' | 'warning' | 'info' => {
    switch (type) {
      case 'error':
        return 'error';
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <div
      className={`relative flex items-start p-4 mb-3 rounded-lg border shadow-lg max-w-md transform transition-all duration-300 ease-in-out ${
        isVisible
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      } ${styles.container}`}
      role='alert'
      aria-live='polite'
      aria-atomic='true'
    >
      {/* Icon */}
      <div className='flex-shrink-0'>
        <Icon name={getIconName()} size='md' className={styles.icon} />
      </div>

      {/* Content */}
      <div className='ml-3 flex-1'>
        <p className='text-sm font-semibold'>{title}</p>
        {message && <p className='mt-1 text-sm opacity-90'>{message}</p>}
      </div>

      {/* Close Button */}
      <button
        type='button'
        className={`ml-4 flex-shrink-0 rounded-md p-1.5 inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ${styles.button}`}
        onClick={() => onClose(id)}
        aria-label='Fechar notificação'
      >
        <svg
          className='h-4 w-4'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
