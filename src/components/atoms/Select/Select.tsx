import React, { forwardRef } from 'react';
import Tooltip from '../Tooltip';
import type { SelectProps } from './Select.types';

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      value,
      onChange,
      options,
      placeholder = 'Selecione...',
      hasError = false,
      errorMessage,
      tooltip,
      size = 'md',
      loading = false,
      emptyMessage = 'Nenhuma opção disponível',
      required = false,
      disabled = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      if (onChange) {
        // Convert to number if the original option value was a number
        const option = options.find(opt => String(opt.value) === selectedValue);
        if (option && typeof option.value === 'number') {
          onChange(Number(selectedValue));
        } else {
          onChange(selectedValue);
        }
      }
    };

    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-3 text-lg',
    };

    // Base classes for the select element
    const baseClasses = [
      'w-full',
      'border',
      'rounded-md',
      'bg-functional-soft-lightest',
      'text-functional-heavy-darkest',
      'transition-all',
      'duration-200',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-brand-primary-medium',
      'focus:border-brand-primary-medium',
      'disabled:bg-functional-soft-darkest',
      'disabled:text-functional-heavy-light',
      'disabled:cursor-not-allowed',
      'disabled:border-functional-heavy-lightest',
      sizeClasses[size],
    ];

    // Error and normal state classes
    const stateClasses = hasError
      ? [
          'border-feedback-danger-medium',
          'focus:ring-feedback-danger-medium',
          'focus:border-feedback-danger-medium',
        ]
      : [
          'border-functional-heavy-lightest',
          'hover:border-functional-heavy-light',
        ];

    const selectClasses = [...baseClasses, ...stateClasses, className].join(
      ' '
    );

    // Label classes
    const labelClasses = [
      'block',
      'text-sm',
      'font-medium',
      'text-functional-heavy-dark',
      'mb-1',
    ].join(' ');

    // Generate unique ID if not provided
    const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    const renderLabel = () => {
      if (!label) return null;

      const labelContent = (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
          {required && (
            <span className='text-feedback-danger-medium ml-1'>*</span>
          )}
        </label>
      );

      if (tooltip) {
        return (
          <Tooltip content={tooltip} position='top'>
            {labelContent}
          </Tooltip>
        );
      }

      return labelContent;
    };

    const renderSelect = () => (
      <select
        ref={ref}
        id={inputId}
        value={value || ''}
        onChange={handleChange}
        disabled={disabled || loading}
        required={required}
        className={selectClasses}
        {...props}
      >
        {/* Default placeholder option */}
        <option value='' disabled>
          {loading ? 'Carregando...' : placeholder}
        </option>

        {/* Show empty message when no options */}
        {options.length === 0 && !loading && (
          <option value='' disabled>
            {emptyMessage}
          </option>
        )}

        {/* Render actual options */}
        {options.map(option => (
          <option
            key={String(option.value)}
            value={String(option.value)}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    );

    return (
      <div className='w-full'>
        {renderLabel()}
        {renderSelect()}
        {hasError && errorMessage && (
          <p className='mt-1 text-sm text-feedback-danger-medium' role='alert'>
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
