import { Component, Input } from '@angular/core';
import { Notifications } from '../../service/article.interface';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { NotificationsService } from '../../service/notifications.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-notification-preview',
  imports: [NgIf, NgFor, CommonModule],
  templateUrl: './notification-preview.component.html',
  styleUrl: './notification-preview.component.css'
})
export class NotificationPreviewComponent {
  constructor(private notificationService: NotificationsService) { }
  @Input() notifications: Notifications[] = [];

  removeNotification(index: number): void {
    // this.notifications.splice(index, 1);
    const notification = this.notifications[index];
    this.notificationService.deleteNotification(notification._id)
      .pipe(finalize(() => this.notifications.splice(index, 1)))
      .subscribe();
      window.location.reload();
  }

  removeAllNotification(): void {
    this.notificationService.deleteAllNotifications()
      .pipe(finalize(() => this.notifications = []))
      .subscribe();
    window.location.reload();
  }
}
