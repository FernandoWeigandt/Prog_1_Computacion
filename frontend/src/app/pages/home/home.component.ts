import { BooksService } from './../../services/books.service';
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

  searchQuery: string = '';
  books:any[] = []
  totalBooks:number = 0
  page:number = 1
  stars = 3
  pages:number = 1
  filteredBooks:any[] = []

  search() {
    this.filteredBooks = this.books.filter(book => book.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  constructor(private booksService: BooksService) { }

  ngOnInit(): void {this.getBooks(1)}

  getBooks(page: Number) {
    this.booksService.getBooks(page).subscribe((answer: any) => {
      console.log(answer);
      this.books = answer.books || [];
      this.filteredBooks = [...this.books]
      this.page = answer.page;
      this.totalBooks = answer.total;
      this.pages = answer.pages;
    })
  }
}
