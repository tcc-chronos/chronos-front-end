import { forwardRef } from 'react';
import type { ButtonProps } from './Button.types';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      loadingText = 'Carregando...',
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'cursor-pointer',
      'font-medium',
      'transition-all',
      'duration-200',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'disabled:cursor-not-allowed',
      'disabled:opacity-50',
      'border',
    ];

    const sizeClasses = {
      xs: ['px-2', 'py-1', 'text-xs', 'rounded'],
      sm: ['px-3', 'py-1.5', 'text-sm', 'rounded-md'],
      md: ['px-4', 'py-2', 'text-sm', 'rounded-md'],
      lg: ['px-6', 'py-3', 'text-base', 'rounded-lg'],
      xl: ['px-8', 'py-4', 'text-lg', 'rounded-lg'],
    };

    const variantClasses = {
      primary: [
        'bg-brand-primary-medium',
        'text-functional-soft-lightest',
        'border-brand-primary-medium',
        'hover:bg-brand-primary-dark',
        'hover:border-brand-primary-dark',
        'focus:ring-brand-primary-medium',
        'active:bg-brand-primary-darkest',
        'disabled:bg-brand-primary-light',
        'disabled:border-brand-primary-light',
      ],
      secondary: [
        'bg-functional-heavy-medium',
        'text-functional-soft-lightest',
        'border-functional-heavy-medium',
        'hover:bg-functional-heavy-dark',
        'hover:border-functional-heavy-dark',
        'focus:ring-functional-heavy-medium',
        'active:bg-functional-heavy-darkest',
        'disabled:bg-functional-heavy-light',
        'disabled:border-functional-heavy-light',
      ],
      outline: [
        'bg-transparent',
        'text-brand-primary-medium',
        'border-brand-primary-medium',
        'hover:bg-brand-primary-medium',
        'hover:text-functional-soft-lightest',
        'focus:ring-brand-primary-medium',
        'active:bg-brand-primary-dark',
        'disabled:text-brand-primary-light',
        'disabled:border-brand-primary-light',
        'disabled:hover:bg-transparent',
        'disabled:hover:text-brand-primary-light',
      ],
      ghost: [
        'bg-transparent',
        'text-brand-primary-medium',
        'border-transparent',
        'hover:bg-brand-primary-lightest',
        'hover:border-brand-primary-lightest',
        'focus:ring-brand-primary-medium',
        'active:bg-brand-primary-light',
        'disabled:text-brand-primary-light',
        'disabled:hover:bg-transparent',
      ],
      danger: [
        'bg-feedback-danger-medium',
        'text-functional-soft-lightest',
        'border-feedback-danger-medium',
        'hover:bg-feedback-danger-dark',
        'hover:border-feedback-danger-dark',
        'focus:ring-feedback-danger-medium',
        'active:bg-feedback-danger-dark',
        'disabled:bg-feedback-danger-light',
        'disabled:border-feedback-danger-light',
      ],
    };

    const LoadingSpinner = () => (
      <svg
        className='animate-spin mr-2 h-4 w-4'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
      >
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        ></circle>
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        ></path>
      </svg>
    );

    const buttonClasses = [
      ...baseClasses,
      ...sizeClasses[size],
      ...variantClasses[variant],
      fullWidth ? 'w-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <LoadingSpinner />}
        {leftIcon && !isLoading && <span className='mr-2'>{leftIcon}</span>}
        {isLoading ? loadingText : children}
        {rightIcon && !isLoading && <span className='ml-2'>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
