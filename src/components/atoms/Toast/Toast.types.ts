import type { Notification } from '../../../contexts/NotificationContext';

export interface ToastProps
  extends Pick<
    Notification,
    'id' | 'type' | 'title' | 'message' | 'isVisible'
  > {
  onClose: (id: string) => void;
}
