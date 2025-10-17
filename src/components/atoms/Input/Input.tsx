import React from 'react';
import type { InputProps } from './Input.types';

const Input: React.FC<InputProps> = ({
  hasError = false,
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses =
    'w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-medium focus:border-brand-primary-medium disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed';

  const errorClasses = hasError
    ? 'border-feedback-danger-medium focus:ring-feedback-danger-light focus:border-feedback-danger-medium'
    : 'border-gray-300 focus:ring-brand-primary-light focus:border-brand-primary-medium';

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const hasIcons = leftIcon || rightIcon;
  const inputClasses = `${baseClasses} ${errorClasses} ${sizes[size]} ${widthClass} ${hasIcons ? 'flex items-center' : ''} ${className}`;

  if (hasIcons) {
    return (
      <div className={`relative ${widthClass}`}>
        {leftIcon && (
          <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
            {leftIcon}
          </div>
        )}
        <input
          className={`${inputClasses} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''}`}
          disabled={disabled}
          {...props}
        />
        {rightIcon && (
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
            {rightIcon}
          </div>
        )}
      </div>
    );
  }

  return <input className={inputClasses} disabled={disabled} {...props} />;
};

export default Input;
