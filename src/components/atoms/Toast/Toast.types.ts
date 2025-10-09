export interface ToastProps {
  id: string;
  type: 'error' | 'success' | 'warning' | 'info';
  title: string;
  message?: string;
  isVisible: boolean;
  onClose: (id: string) => void;
}
