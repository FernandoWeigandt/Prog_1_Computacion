import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'notification-tile',
  standalone: true,
  imports: [],
  templateUrl: './notification-tile.component.html',
  styles: ``
})
export class NotificationTileComponent {
  @Input() id:number = 0;
  @Input() title:string = 'Default title';
  @Input() notification_date:Date = new Date();
  @Input() body:string = 'Default message';
  @Input() note:string = 'Default note';
  @Input() type:string = 'warning';

  @Output() notificationDeleted = new EventEmitter();

  constructor(
    private notificationService: NotifyService
  ) {}

  getDateDifference(date: Date): string {
    const currentDate = new Date();
    const diffInMs = currentDate.getTime() - new Date(date).getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) {
      return '';
    } else if (diffInDays === 0) {
      return 'hoy';
    } else if (diffInDays < 7) {
      return `hace ${diffInDays} días`;
    } else if (diffInDays < 30) {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `hace ${diffInWeeks} ${diffInWeeks === 1 ? 'semana' : 'semanas'}`;
    } else if (diffInDays < 365) {
      const diffInMonths = Math.floor(diffInDays / 30);
      return `hace ${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`;
    } else {
      const diffInYears = Math.floor(diffInDays / 365);
      return `hace ${diffInYears} ${diffInYears === 1 ? 'año' : 'años'}`;
    }
  }

  markAsRead() {
    this.notificationDeleted.emit(this.id);
  }
}
