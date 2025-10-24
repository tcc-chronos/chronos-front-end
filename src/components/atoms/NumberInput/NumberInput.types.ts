export interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'onChange' | 'value' | 'size'
  > {
  value?: number | string;
  onChange?: (value: number | undefined) => void;
  min?: number;
  max?: number;
  decimalPlaces?: number;
  allowNegative?: boolean;
  hasError?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
