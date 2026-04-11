export type NotificationType = 'success' | 'warning' | 'danger';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}
