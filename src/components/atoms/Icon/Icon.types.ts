export interface IconProps {
  name:
    | 'info'
    | 'warning'
    | 'error'
    | 'success'
    | 'chevron-down'
    | 'chevron-up';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  color?: string;
}
