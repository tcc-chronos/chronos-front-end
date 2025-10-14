import React from 'react';
import type { IconButtonProps } from './IconButton.types';

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  isActive = false,
  onClick,
  size = 'md',
  disabled = false,
  className = '',
  ariaLabel,
  tooltip,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center cursor-pointer rounded-lg transition-all duration-200 focus:outline-none  disabled:opacity-50';

  const variants = {
    active:
      'bg-brand-primary-dark text-white shadow-sm hover:bg-brand-primary-darkest',
    inactive: 'text-gray-600 hover:bg-gray-200 hover:text-gray-900',
  };

  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const variantClass = isActive ? variants.active : variants.inactive;

  return (
    <button
      className={`${baseClasses} ${variantClass} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={tooltip}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;
