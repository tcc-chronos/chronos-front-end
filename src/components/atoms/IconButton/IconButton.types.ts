export interface IconButtonProps {
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  tooltip?: string;
}
