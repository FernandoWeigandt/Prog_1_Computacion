import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StarsComponent } from '../stars/stars.component';
import { AuthService } from '../../services/auth.service';
import { BookService } from '../../services/book.service';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'component-book',
  standalone: true,
  imports: [StarsComponent],
  templateUrl: './book.component.html',
  styles: `
  @media (min-width: 768px) {
    .book-image {
      width: 160px !important;
    }
  }`
})
export class BookComponent {
  @Input() id:number = 0;
  @Input() title:string = 'Default title';
  @Input() gender:string = 'Default gender';
  @Input() quantity:number = 1;
  @Input() status:string = 'status';
  @Input() comments_quantity:number = 0;
  @Input() rating: number = 0;
  @Input() authors: string = 'Desconocido';
  @Input() image:string = 'default-book-cover.jpg';
  @Input() available_copies:any[] = [];

  @Output() bookDeleted = new EventEmitter();
  @Output() errorBookDeleted = new EventEmitter();
  @Output() rented = new EventEmitter();

  // This line allows book component to use angular router service.
  // It just define a private attribute called router of type Router
  // and inject it in the constructor.
  constructor(
    private router: Router,
    private authService: AuthService,
    private bookService: BookService,
    private notificationService: NotifyService
  ) {}

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isUser(): boolean {
    return this.authService.isUser();
  }

  get isLibrarian(): boolean {
    return this.authService.isLibrarian();
  }

  get statusFormatted(): string {
    if (this.status === 'available') {
      return 'Disponible';
    } else {
      return 'Agotado';
    }
  }

  // This method navigates to the book details page, passing the book's ID as a parameter.
  // Note that the router service is used to navigate.
  gotoBookDetails() {
    this.router.navigate(['/book', this.id]);
  }

  deleteBookbtn() {
    this.bookService.deleteBook(this.id).subscribe(() => {
      this.bookDeleted.emit('Libro Eliminado - Identificador:' + this.id);      
    }, (error) => {
      this.errorBookDeleted.emit('Error al eliminar el libro. Recuerda que solo puedes eliminar libros sin prestamos.');
    });
  }
  
  get isRented(): boolean {
    return this.status !== 'available';
  }

  get parseAvailable(): string {
    let result: string = '';
    let comma: string = '';
    for (let copy of this.available_copies) {
      result += comma + copy.id;
      comma = ', ';
    }
    return result
  }

  rentBook() {
    this.notificationService.postNotification({
      title: 'Solicitud de prestamo',
      body: `El usuario ${this.authService.email} (Legajo: ${this.authService.userId}) desea adquirir el libro ${this.title} (Identificador único del libro: ${this.id}).`,
      note: `Identificadores de copias disponibles: ${this.parseAvailable}.`,
      category: 'warning',
    }).subscribe({next: (response) => {
        this.rented.emit('Solicitud de prestamo enviada a todos los bibliotecarios.');
      },error: (error) => {
        this.rented.emit('Error al enviar la solicitud de prestamo.');
      }
    });
  }
}
