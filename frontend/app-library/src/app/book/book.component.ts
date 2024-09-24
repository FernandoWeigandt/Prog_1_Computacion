import { Component } from '@angular/core';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [],
  templateUrl: './book.component.html',
  styles: ``
})
export class BookComponent {
  title:string = 'Título';
  author:string = 'Autor';
  gender:string = 'Género';
  quantity:number = 1;
}
