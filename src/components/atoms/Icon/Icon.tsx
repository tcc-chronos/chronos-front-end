import React from 'react';
import type { IconProps } from './Icon.types';

const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  className = '',
  color = 'currentColor',
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const getIconPath = () => {
    switch (name) {
      case 'info':
        return (
          <path
            fillRule='evenodd'
            d='M8 1.5c-3.6 0-6.5 2.9-6.5 6.5S4.4 14.5 8 14.5s6.5-2.9 6.5-6.5S11.6 1.5 8 1.5zM8 2.5c3 0 5.5 2.5 5.5 5.5S11 13.5 8 13.5 2.5 11 2.5 8 5 2.5 8 2.5zm0 2c.3 0 .5.2.5.5v4c0 .3-.2.5-.5.5s-.5-.2-.5-.5V5c0-.3.2-.5.5-.5zm0 6c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z'
            clipRule='evenodd'
          />
        );
      case 'warning':
        return (
          <path
            fillRule='evenodd'
            d='M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z'
            clipRule='evenodd'
          />
        );
      case 'error':
        return (
          <path
            fillRule='evenodd'
            d='M8 1.5c-3.6 0-6.5 2.9-6.5 6.5S4.4 14.5 8 14.5s6.5-2.9 6.5-6.5S11.6 1.5 8 1.5zM8 2.5c3 0 5.5 2.5 5.5 5.5S11 13.5 8 13.5 2.5 11 2.5 8 5 2.5 8 2.5zm2.5 2L8 7 5.5 4.5 4.5 5.5 7 8l-2.5 2.5 1 1L8 9l2.5 2.5 1-1L9 8l2.5-2.5-1-1z'
            clipRule='evenodd'
          />
        );
      case 'success':
        return (
          <path
            fillRule='evenodd'
            d='M8 1.5c-3.6 0-6.5 2.9-6.5 6.5S4.4 14.5 8 14.5s6.5-2.9 6.5-6.5S11.6 1.5 8 1.5zM8 2.5c3 0 5.5 2.5 5.5 5.5S11 13.5 8 13.5 2.5 11 2.5 8 5 2.5 8 2.5zm2.28 2.22L7 7.5 5.72 6.22l-.72.72L7 9l4-4-.72-.72z'
            clipRule='evenodd'
          />
        );
      case 'chevron-down':
        return (
          <path
            fillRule='evenodd'
            d='M4.293 6.293a1 1 0 0 1 1.414 0L8 8.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z'
            clipRule='evenodd'
          />
        );
      case 'chevron-up':
        return (
          <path
            fillRule='evenodd'
            d='M11.707 9.707a1 1 0 0 1-1.414 0L8 7.414 5.707 9.707a1 1 0 0 1-1.414-1.414l3-3a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414z'
            clipRule='evenodd'
          />
        );
      default:
        return null;
    }
  };

  return (
    <svg
      className={`${sizes[size]} ${className}`}
      fill={color}
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
    >
      {getIconPath()}
    </svg>
  );
};

export default Icon;
