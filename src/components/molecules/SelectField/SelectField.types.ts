import type { SelectProps } from '../../atoms/Select/Select.types';

export interface SelectFieldProps
  extends Omit<SelectProps, 'label' | 'hasError' | 'errorMessage' | 'tooltip'> {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  infoTooltip?: string;
  required?: boolean;
  labelClassName?: string;
}
