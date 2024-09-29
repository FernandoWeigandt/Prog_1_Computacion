import { Component, Input } from '@angular/core';

@Component({
  selector: 'component-book',
  standalone: true,
  imports: [],
  templateUrl: './book.component.html',
  styles: `@media (min-width: 768px) {
              .book-image {
                width: 160px !important;
              }
            }`
})
export class BookComponent {
  @Input() title:string = 'Default title';
  @Input() author:string = 'Default author';
  @Input() gender:string = 'Default gender';
  @Input() quantity:number = 1;
  @Input() image:string = 'https://picsum.photos/200/300';
}
