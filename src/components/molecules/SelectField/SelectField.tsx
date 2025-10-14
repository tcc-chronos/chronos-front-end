import React from 'react';
import Select from '../../atoms/Select/Select';
import Icon from '../../atoms/Icon/Icon';
import Tooltip from '../../atoms/Tooltip/Tooltip';
import type { SelectFieldProps } from './SelectField.types';

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  error,
  hint,
  infoTooltip,
  required = false,
  labelClassName = '',
  className = '',
  ...selectProps
}) => {
  const hasError = !!error;

  return (
    <div className='space-y-1'>
      {/* Label com tooltip de informação */}
      <div className='flex items-center gap-2'>
        <label
          htmlFor={id}
          className={`block font-regular text-functional-heavy-darkest ${labelClassName}`}
        >
          {label}
          {required && (
            <span
              className='text-feedback-danger-medium ml-1'
              aria-label='required'
            >
              *
            </span>
          )}
        </label>

        {infoTooltip && (
          <Tooltip content={infoTooltip} position='top' delay={300}>
            <Icon
              name='info'
              size='sm'
              className='text-functional-heavy-medium hover:text-brand-primary-medium transition-colors cursor-help'
            />
          </Tooltip>
        )}
      </div>

      {/* Select */}
      <Select
        id={id}
        hasError={hasError}
        className={className}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        aria-invalid={hasError}
        {...selectProps}
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
          className='text-sm text-feedback-danger-medium flex items-center gap-1'
          role='alert'
        >
          <Icon name='error' size='sm' />
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectField;
