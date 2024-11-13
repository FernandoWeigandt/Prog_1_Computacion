import { BooksService } from './../../services/books.service';
import { Component } from '@angular/core';
import { BookComponent } from '../../components/book/book.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { PaginateComponent } from '../../components/paginate/paginate.component';
import { SearchComponent } from '../../components/search/search.component';
import { SearchService } from '../../services/search.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookComponent, SearchComponent, NavbarComponent, ContextbarComponent, PaginateComponent],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {

  searchQuery: string = '';
  books:any[] = []
  totalBooks:number = 0
  page:number = 1
  stars = 0
  pages:number = 1

  constructor(
    private booksService: BooksService,
    private searchService: SearchService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentPage = sessionStorage.getItem('currentPage');
    if (currentPage) {
      this.getBooks(parseInt(currentPage));
    } else {
      this.getBooks(1);
    }
    this.search();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get isLibrarian(): boolean {
    return this.authService.isLibrarian();
  }

  getBooks(page: number) {
    sessionStorage.setItem('currentPage', String(page));
    this.booksService.getBooks(page).subscribe((answer: any) => {
      this.books = answer.books || [];
      this.page = answer.page;
      this.stars = answer.rating;
      this.totalBooks = answer.total;
      this.pages = answer.pages;
    })
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  image(book: any): string {
    if (book.image === 'None') {
      return 'media/default-book-cover.jpg'
    } else {
      return book.image
    }
  }

  search(): void {
    this.searchService.searchQuery$.subscribe((searchQuery) => {
      this.searchQuery = searchQuery;
      console.log(searchQuery);
      if (this.searchQuery === 'clean') {
        sessionStorage.removeItem('currentPage');
        this.getBooks(1);
      }
      this.booksService.getBooksBySearchQuery(searchQuery).subscribe((answer: any) => {
        this.books = answer.books || [];
        this.page = answer.page;
        this.totalBooks = answer.total;
        this.pages = answer.pages;
      });
    });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
