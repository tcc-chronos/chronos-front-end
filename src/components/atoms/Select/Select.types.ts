export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    'onChange' | 'value' | 'size'
  > {
  label?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  options: SelectOption[];
  placeholder?: string;
  hasError?: boolean;
  errorMessage?: string;
  tooltip?: string;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  emptyMessage?: string;
}
