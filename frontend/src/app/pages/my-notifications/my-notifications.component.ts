import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginateComponent } from '../../components/paginate/paginate.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NotificationTileComponent } from "../../components/notification-tile/notification-tile.component";
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'app-my-notifications',
  standalone: true,
  imports: [CommonModule,PaginateComponent, NavbarComponent, ContextbarComponent, NotificationTileComponent],
  templateUrl: './my-notifications.component.html',
  styles: ``
})
export class MyNotificationsComponent implements OnInit {

  notifications: any[] = [];

  constructor(
    private notificationService: NotifyService
  ) {}

  ngOnInit(): void {
    this.getNotifications();
  }

  getNotifications() {
    this.notificationService.getNotifications().subscribe((answer: any) => {
      this.notifications = answer.notifications;
      console.log(this.notifications);
    })
  }
}
