import React, { useState, useCallback, useEffect } from 'react';
import type { NumberInputProps } from './NumberInput.types';

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  decimalPlaces = 2,
  allowNegative = true,
  hasError = false,
  size = 'md',
  disabled = false,
  placeholder,
  className = '',
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string>('');

  // Sincronizar valor interno com prop externa
  useEffect(() => {
    if (value !== undefined && value !== '') {
      setInternalValue(String(value));
    } else {
      setInternalValue('');
    }
  }, [value]);

  const formatNumber = useCallback(
    (num: number): string => {
      return Number(num.toFixed(decimalPlaces)).toString();
    },
    [decimalPlaces]
  );

  const parseInput = useCallback((inputValue: string): number | undefined => {
    if (!inputValue || inputValue === '' || inputValue === '-') {
      return undefined;
    }

    // Remove caracteres não numéricos exceto . e -
    const cleaned = inputValue.replace(/[^0-9.-]/g, '');

    // Verificar se é um número válido
    const parsed = parseFloat(cleaned);

    if (isNaN(parsed)) {
      return undefined;
    }

    return parsed;
  }, []);

  const validateNumber = useCallback(
    (num: number): boolean => {
      if (!allowNegative && num < 0) return false;
      if (min !== undefined && num < min) return false;
      if (max !== undefined && num > max) return false;
      return true;
    },
    [allowNegative, min, max]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;

      // Permitir entrada vazia e entrada incompleta (ex: "1.", "-", "0.")
      if (inputValue === '' || inputValue === '-' || inputValue.endsWith('.')) {
        setInternalValue(inputValue);
        if (inputValue === '') {
          onChange?.(undefined);
        }
        return;
      }

      // Verificar padrão básico para números decimais
      const numberPattern = allowNegative
        ? /^-?(\d+\.?\d*|\.\d+)$/
        : /^(\d+\.?\d*|\.\d+)$/;

      if (!numberPattern.test(inputValue)) {
        return; // Não atualizar se não for um padrão válido
      }

      setInternalValue(inputValue);

      const parsedValue = parseInput(inputValue);
      if (parsedValue !== undefined) {
        onChange?.(parsedValue);
      }
    },
    [allowNegative, parseInput, onChange]
  );

  const handleBlur = useCallback(() => {
    const parsedValue = parseInput(internalValue);

    if (parsedValue !== undefined && validateNumber(parsedValue)) {
      // Formatar o número no blur para exibição limpa
      const formattedValue = formatNumber(parsedValue);
      setInternalValue(formattedValue);
      onChange?.(parseFloat(formattedValue));
    } else if (internalValue && parsedValue !== undefined) {
      // Se o número não é válido pelas regras de min/max, mas é um número válido
      setInternalValue(internalValue);
    }
  }, [internalValue, parseInput, validateNumber, formatNumber, onChange]);

  const getBaseClasses = () => {
    return 'w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-medium focus:border-brand-primary-medium disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed';
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'px-3 py-1.5',
      md: 'px-4 py-2',
      lg: 'px-4 py-3',
    };
    return sizes[size];
  };

  const getVariantClasses = () => {
    if (hasError) {
      return 'border-feedback-danger-medium bg-feedback-danger-light/5 text-feedback-danger-dark placeholder-feedback-danger-medium/60';
    }

    return 'border-functional-heavy-light bg-functional-soft-lightest text-functional-heavy-darkest placeholder-functional-heavy-medium';
  };

  return (
    <input
      type='text'
      inputMode='decimal'
      value={internalValue}
      onChange={handleInputChange}
      onBlur={handleBlur}
      disabled={disabled}
      placeholder={placeholder}
      className={`${getBaseClasses()} ${getSizeClasses()} ${getVariantClasses()} ${className}`}
      {...props}
    />
  );
};

export default NumberInput;
