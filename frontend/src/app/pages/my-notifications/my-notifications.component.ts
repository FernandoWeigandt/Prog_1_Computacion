import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginateComponent } from '../../components/paginate/paginate.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NotificationTileComponent } from "../../components/notification-tile/notification-tile.component";

@Component({
  selector: 'app-my-notifications',
  standalone: true,
  imports: [CommonModule,PaginateComponent, NavbarComponent, ContextbarComponent, MyNotificationsComponent, NotificationTileComponent],
  templateUrl: './my-notifications.component.html',
  styles: ``
})
export class MyNotificationsComponent {
  notifications = [
    {
      id : 4,
      title: 'Notificación de Atraso',
      date: new Date(2024, 8, 10),
      message: 'El prestamo de "Título 1" está atrasado. Por favor devuelva el libro o renueve su prestamo lo más pronto posible.',
      note: 'Fecha de entrega: 10-09-2024',
      type: 'warning'
    },
    {
      id : 3,
      title: 'Extensión de prestamo aprobada',
      date: new Date(2024, 8, 8),
      message: 'El prestamo de "Título 2" fue extendido 7 días. La nueva fecha de entrega es 25-09-2024.',
      note: 'Renovación de fecha de expiración.',
      type: 'good'
    },
    {
      id : 2,
      title: '¡Nuevas entregas en la Biblioteca!',
      date: new Date(2024, 4, 3),
      message: 'Tenemos nuevos libros disponibles en las secciones de Ficción y Ciencia. ¡Visite la biblioteca para ver los últimos títulos!',
      note: '¡No te los pierdas!',
      type: 'info'
    },
    {
      id : 1,
      title: 'Noticia de Renovación de la Biblioteca',
      date: new Date(2023, 10, 4),
      message: 'Se llevarán a cabo renovaciones en la plataforma de la Biblioteca desde el 1 de Octubre hasta el 15 de Octubre. Los servicios pueden verse limitados durante ese periodo.',
      note: 'Le pedimos disculpas por el inconveniente.',
      type: 'info'
    }
  ]
}
