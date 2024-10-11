import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
      image: 'https://picsum.photos/200/300',
    },
    {
      id: 2,
      title: 'Book 2',
      gender: 'Gender 2',
      author: 'Author 2',
      quantity: 4,
      image: 'https://picsum.photos/200/300',
    },
    {
      id: 3,
      title: 'Book 3',
      gender: 'Gender 3',
      author: 'Author 3',
      quantity: 2,
      image: '',
    },
    {
      id: 4,
      title: 'Book 4',
      gender: 'Gender 4',
      author: 'Author 4',
      quantity: 4,
      image: 'https://picsum.photos/200/300',
    },
  ]

  // This line allows home component to use angular router service.
  // It just define a private attribute called router of type Router
  // and inject it in the constructor.
  constructor(private router: Router) {}

  // This method navigates to the book details page, passing the book's ID as a parameter.
  // Note that the router service is used to navigate.
  gotoBookDetails(id: number) {
    this.router.navigate(['/book', id]);
  }

  // This method is suposed to get the books from the backend (should ask for page number of pagination)
  getBooks() {
    return this.books
  }
}
