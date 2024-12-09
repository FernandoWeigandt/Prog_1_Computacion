import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rent',
  standalone: true,
  imports: [],
  templateUrl: './rent.component.html',
  styleUrl: './rent.component.css'
})
export class RentComponent {
  @Input() rent: any = {};

  ngOnInit() {
    console.log(this.rent);
  }

  get status(): string {
    if (this.rent.status === 'active') {
      return 'activo';
    } if (this.rent.status === 'pending') {
      return 'pendiente';
    } else {
      return 'atrasado';
    }
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
}