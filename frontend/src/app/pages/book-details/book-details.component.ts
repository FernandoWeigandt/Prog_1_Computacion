import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [NavbarComponent, ContextbarComponent],
  templateUrl: './book-details.component.html',
  styles: ``
})
export class BookDetailsComponent implements OnInit {
  bookId: number | null = null; // Number or null
  book: any | null = null;
  
  constructor(private route: ActivatedRoute) {}

  // This method is called when the component is initialized to get the book ID from the route
  // async/await is used to wait for the getBook method to finish (in other tread) while the 
  // component is initialized in the main tread (concurrency problem)
  async ngOnInit() {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    await this.getBook();
  }

  // This method is suposed to get the book based on the book ID making the proper http request to the backend
  getBook() {
    this.book = this.books.find(book => book.id === this.bookId);
  }

  // This books are just an example of the backend response (same as home books)
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
}
