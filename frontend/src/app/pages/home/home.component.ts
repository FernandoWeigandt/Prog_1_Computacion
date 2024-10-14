import { Component } from '@angular/core';
import { BookComponent } from '../../components/book/book.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { PaginateComponent } from '../../components/paginate/paginate.component';
import { SearchComponent } from '../../components/search/search.component';
import { BookDetailsComponent } from '../book-details/book-details.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookComponent, SearchComponent, NavbarComponent, ContextbarComponent, PaginateComponent, BookDetailsComponent],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {
  // This books are just an example of the backend response
  books = [
    {
      id: 1,
      title: 'Book 1',
      gender: 'Gender 1',
      author: 'Author 1',
      quantity: 1,
      rating: 4.2,
      image: 'https://picsum.photos/200/300',
    },
    {
      id: 2,
      title: 'Book 2',
      gender: 'Gender 2',
      author: 'Author 2',
      quantity: 4,
      rating: 5,
      image: 'https://picsum.photos/200/300',
    },
    {
      id: 3,
      title: 'Book 3',
      gender: 'Gender 3',
      author: 'Author 3',
      quantity: 2,
      rating: 3,
      image: '',
    },
    {
      id: 4,
      title: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perspiciatis magnam aut voluptatibus eum, mollitia ipsa aliquid.',
      gender: 'Gender 4',
      author: 'Author 4',
      quantity: 4,
      rating: 4.6,
      image: 'https://picsum.photos/200/300',
    },
  ]

  // This method is suposed to get the books from the backend (should ask for page number of pagination)
  getBooks() {
    return this.books
  }
}
