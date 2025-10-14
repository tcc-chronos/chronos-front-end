import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ToastContainer from './ToastContainer';
import * as useNotificationsModule from '../../../hooks/useNotifications';
import type { Notification } from '../../../contexts/NotificationContext';

vi.mock('../../../hooks/useNotifications');

const createMockNotifications = (
  notifications: Partial<Notification>[]
): Notification[] => {
  return notifications.map(notif => ({
    id: notif.id || '1',
    type: notif.type || 'info',
    title: notif.title || 'Test',
    message: notif.message,
    isVisible: notif.isVisible ?? true,
    createdAt: notif.createdAt || new Date(),
    duration: notif.duration,
  }));
};

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when there are no notifications', () => {
    vi.spyOn(useNotificationsModule, 'useNotifications').mockReturnValue({
      notifications: [],
      removeNotification: vi.fn(),
      addNotification: vi.fn(),
      clearAll: vi.fn(),
      addError: vi.fn(),
      addSuccess: vi.fn(),
      addWarning: vi.fn(),
      addInfo: vi.fn(),
    });

    const { container } = render(<ToastContainer />);
    expect(container.firstChild).toBeNull();
  });

  it('renders notifications when they exist', () => {
    vi.spyOn(useNotificationsModule, 'useNotifications').mockReturnValue({
      notifications: createMockNotifications([
        {
          id: '1',
          type: 'success',
          title: 'Success Message',
          message: 'Operation completed successfully',
        },
      ]),
      removeNotification: vi.fn(),
      addNotification: vi.fn(),
      clearAll: vi.fn(),
      addError: vi.fn(),
      addSuccess: vi.fn(),
      addWarning: vi.fn(),
      addInfo: vi.fn(),
    });

    render(<ToastContainer />);

    expect(screen.getByText('Success Message')).toBeInTheDocument();
    expect(
      screen.getByText('Operation completed successfully')
    ).toBeInTheDocument();
  });

  it('renders multiple notifications', () => {
    vi.spyOn(useNotificationsModule, 'useNotifications').mockReturnValue({
      notifications: createMockNotifications([
        { id: '1', type: 'success', title: 'Success 1' },
        { id: '2', type: 'error', title: 'Error 1' },
        { id: '3', type: 'info', title: 'Info 1' },
      ]),
      removeNotification: vi.fn(),
      addNotification: vi.fn(),
      clearAll: vi.fn(),
      addError: vi.fn(),
      addSuccess: vi.fn(),
      addWarning: vi.fn(),
      addInfo: vi.fn(),
    });

    render(<ToastContainer />);

    expect(screen.getByText('Success 1')).toBeInTheDocument();
    expect(screen.getByText('Error 1')).toBeInTheDocument();
    expect(screen.getByText('Info 1')).toBeInTheDocument();
  });

  it('has proper positioning classes', () => {
    vi.spyOn(useNotificationsModule, 'useNotifications').mockReturnValue({
      notifications: createMockNotifications([{ id: '1', title: 'Test' }]),
      removeNotification: vi.fn(),
      addNotification: vi.fn(),
      clearAll: vi.fn(),
      addError: vi.fn(),
      addSuccess: vi.fn(),
      addWarning: vi.fn(),
      addInfo: vi.fn(),
    });

    const { container } = render(<ToastContainer />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass(
      'fixed',
      'top-4',
      'right-4',
      'z-50',
      'space-y-2'
    );
  });
});
