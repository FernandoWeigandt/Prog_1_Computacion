import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NotifyService } from '../../services/notify.service';
import { AuthService } from '../../services/auth.service';
import { RentsService } from '../../services/rents.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-rent',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './rent.component.html',
  styleUrl: './rent.component.css'
})
export class RentComponent {
  @Input() rent: any = {};
  @Input() manageRents: boolean = false;
  @Output() renewClicked = new EventEmitter<string>();
  @Output() updatedRent = new EventEmitter

  constructor(
    private notificationService: NotifyService,
    private authService: AuthService,
    private rentService: RentsService
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
    const expirationDate = new Date(this.rent.init_date);
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

  updateRent() {
    const today = new Date();
    const tenDaysLater = new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000);
    const data = {
      "expiration_date": tenDaysLater.toISOString().slice(0, 10)
    }
    this.rentService.editRent(this.rent.id, data).subscribe(() => {
      this.updatedRent.emit('Se han añadido 10 días a partir de hoy.');
    }, () => {
      this.updatedRent.emit('Error al actualizar el prestamo.');
    });
  }

  deleteRent() {
    this.rentService.deleteRent(this.rent.id).subscribe(() => {
      this.updatedRent.emit('Prestamo Eliminado - Identificador:' + this.rent.id);
    }, () => {
      this.updatedRent.emit('Error al eliminar el prestamo.');
    });
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
        this.renewClicked.emit('Solicitud de renovación enviada a todos los bibliotecarios.');
      },
      error: (error) => {
        this.renewClicked.emit('Error al enviar la solicitud de renovación.');
      }
    });
  }
}