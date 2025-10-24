import React from 'react';
import { Input, Icon, Tooltip } from '../../atoms';
import type { InputFieldProps } from './InputField.types';

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  error,
  hint,
  infoTooltip,
  required,
  labelClassName = '',
  className = '',
  size = 'md',
  onChange,
  leftIcon,
  rightIcon,
  ...inputProps
}) => {
  const hasError = !!error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className='space-y-1'>
      <div className='flex items-center gap-2'>
        <label
          htmlFor={id}
          className={`text-sm text-gray-900 ${labelClassName}`}
        >
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
        {infoTooltip && (
          <Tooltip content={infoTooltip} position='top' delay={300}>
            <Icon
              name='info'
              size='sm'
              className='text-functional-heavy-darkest hover:text-brand-primary-medium transition-colors cursor-help'
            />
          </Tooltip>
        )}
      </div>

      {/* Input */}
      <Input
        id={id}
        hasError={hasError}
        size={size}
        className={className}
        onChange={handleChange}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        aria-invalid={hasError}
        {...inputProps}
      />

      {/* Mensagem de ajuda ou erro */}
      {hint && !error && (
        <p id={`${id}-hint`} className='text-sm text-functional-heavy-medium'>
          {hint}
        </p>
      )}

      {error && (
        <p
          id={`${id}-error`}
          className='text-sm text-feedback-danger-medium flex items-center gap-1 text-wrap'
          role='alert'
        >
          <Icon name='error' size='sm' />
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
