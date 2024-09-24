import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [],
  templateUrl: './book.component.html',
  styles: ``
})
export class BookComponent {
  @Input() title:string = 'Default title';
  @Input() author:string = 'Default author';
  @Input() gender:string = 'Default gender';
  @Input() quantity:number = 1;
}
