import { Component } from '@angular/core';
import { BookComponent } from '../../components/book/book.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookComponent, NavbarComponent, ContextbarComponent],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {
  books = [
    {
      id: 1,
      title: 'Book 1',
      gender: 'Gender 1',
      author: 'Author 1',
      quantity: 1,
    },
    {
      id: 2,
      title: 'Book 2',
      gender: 'Gender 2',
      author: 'Author 2',
      quantity: 4,
    },
    {
      id: 3,
      title: 'Book 3',
      gender: 'Gender 3',
      author: 'Author 3',
      quantity: 2,
    },
    {
      id: 4,
      title: 'Book 4',
      gender: 'Gender 4',
      author: 'Author 4',
      quantity: 4,
    },
  ]

  getBook(id: number) {
    return this.books.find(book => book.id === id)
  }
}
