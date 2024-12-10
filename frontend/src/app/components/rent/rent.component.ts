import { Component, Input } from '@angular/core';
import { NotifyService } from '../../services/notify.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-rent',
  standalone: true,
  imports: [],
  templateUrl: './rent.component.html',
  styleUrl: './rent.component.css'
})
export class RentComponent {
  @Input() rent: any = {};
  @Input() manageRents: boolean = false;

  constructor(
    private notificationService: NotifyService,
    private authService: AuthService
  ) {}

  get status(): string {
    if (this.rent.status === 'active') {
      return 'activo';
    } if (this.rent.status === 'pending') {
      return 'pendiente';
    } else {
      return 'atrasado';
    }
  }

  get daysLeft(): number {
    const today = new Date();
    const expirationDate = new Date(this.rent.expiration_date);
    const timeDiff = expirationDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysLeft;
  }

  get statusColor(): string {
    if (this.rent.status === 'active') {
      return 'success';
    } if (this.rent.status === 'pending') {
      return 'warning';
    } else {
      return 'danger';
    }
  }

  sendRenewalRequest() {
    const data = {
      "title": "Solicitud de renovación de préstamo",
      "body": `El usuario ${this.authService.email} desea renovar el préstamo del libro ${this.rent.copy.title} (copia: ${this.rent.copy.id}).`,
      "note": `Identificador único del préstamo: ${this.rent.id}`,
      "category": "info"
    }
    this.notificationService.postNotification(data).subscribe({
      next: (response) => {
        console.log('Renovar solicitud enviada (broadcast): ', response);
      },
      error: (error) => {
        console.error('Error al enviar la solicitud de renovación del préstamo:', error);
      }
    });
  }
}