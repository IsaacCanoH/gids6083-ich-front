import { Injectable, signal } from '@angular/core';
import { Notification, NotificationType } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly notificationsSignal = signal<Notification[]>([]);

  readonly notifications = this.notificationsSignal.asReadonly();

  show(type: NotificationType, title: string, message: string): void {
    const id = crypto.randomUUID();

    const notification: Notification = {
      id,
      type,
      title,
      message,
    };

    this.notificationsSignal.update((current) => [...current, notification]);

    setTimeout(() => this.remove(id), 5000);
  }

  remove(id: string): void {
    this.notificationsSignal.update((current) =>
      current.filter((n) => n.id !== id),
    );
  }

  success(title: string, message: string): void {
    this.show('success', title, message);
  }

  warning(title: string, message: string): void {
    this.show('warning', title, message);
  }

  error(title: string, message: string): void {
    this.show('danger', title, message);
  }
}
