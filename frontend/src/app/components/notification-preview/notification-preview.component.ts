import { Component, Input } from '@angular/core';
import { Notifications } from '../../service/article.interface';
import { NgIf, NgFor, CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-preview',
  imports: [NgIf, NgFor, CommonModule],
  templateUrl: './notification-preview.component.html',
  styleUrl: './notification-preview.component.css'
})
export class NotificationPreviewComponent {
  @Input() notifications: Notifications[] = [];
}
