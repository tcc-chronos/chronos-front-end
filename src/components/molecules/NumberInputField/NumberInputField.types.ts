import type { NumberInputProps } from '../../atoms/NumberInput/NumberInput.types';

export interface NumberInputFieldProps extends NumberInputProps {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  infoTooltip?: string;
  required?: boolean;
  labelClassName?: string;
}
