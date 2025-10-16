export interface PredictButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  modelId?: string;
  trainingId?: string;
  onSuccess?: () => void;
  isPolling?: boolean;
  onTogglePolling?: () => void;
}
