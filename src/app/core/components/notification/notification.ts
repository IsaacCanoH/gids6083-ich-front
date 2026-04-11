import { NotificationService } from './../../services/notification.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification {
  private readonly notificationSvc = inject(NotificationService);

  readonly notifications = this.notificationSvc.notifications;

  remove(id: string): void {
    this.notificationSvc.remove(id);
  }
}
