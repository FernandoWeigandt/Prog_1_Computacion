import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { StarsComponent } from '../stars/stars.component';

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
  @Input() author:string = 'Default author';
  @Input() gender:string = 'Default gender';
  @Input() quantity:number = 1;
  @Input() rating: number = 0;
  @Input() image:string = 'media/default-book-cover.jpg';

  // This line allows book component to use angular router service.
  // It just define a private attribute called router of type Router
  // and inject it in the constructor.
  constructor(private router: Router) {}

  // This method navigates to the book details page, passing the book's ID as a parameter.
  // Note that the router service is used to navigate.
  gotoBookDetails() {
    this.router.navigate(['/book', this.id]);
  }
}
