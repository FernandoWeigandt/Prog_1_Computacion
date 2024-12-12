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
  page: number = 1;
  pages: number = 1;
  totalNotifications: number = 0;

  constructor(
    private notificationService: NotifyService
  ) {}

  ngOnInit(): void {
    this.getNotifications(1);
  }

  getNotifications(page: number) {
    this.notificationService.getNotifications(page).subscribe((answer: any) => {
      this.page = answer.page;
      this.pages = answer.pages;
      this.totalNotifications = answer.total;
      this.notifications = answer.notifications;
    })
  }

  deleteNotification(id: number) {
    this.notificationService.deleteNotification(id).subscribe((answer: any) => {
      this.getNotifications(1);
    }, error => {
      this.showAlert('Ocurrio un error al eliminar la notificación.', 'danger')
    })
  }

  showAlert(message: string, type: 'danger' | 'success') {
    const alertPlaceholder = document.getElementById('notificationAlertPlaceholder')
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
    alertPlaceholder?.append(wrapper)
  }
}
