import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { StarsComponent } from '../stars/stars.component';
import { AuthService } from '../../services/auth.service';

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
  @Input() image:string = 'media/default-book-cover.jpg';

  // This line allows book component to use angular router service.
  // It just define a private attribute called router of type Router
  // and inject it in the constructor.
  constructor(private router: Router, private authService: AuthService) {}

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
}
