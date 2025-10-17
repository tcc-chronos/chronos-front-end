export interface InputFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'onChange'
  > {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  infoTooltip?: string;
  required?: boolean;
  labelClassName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  onChange?: (value: string) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
