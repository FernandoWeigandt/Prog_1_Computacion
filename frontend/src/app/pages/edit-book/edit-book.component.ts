import { Component } from '@angular/core';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { BookService } from '../../services/book.service';
import { ActivatedRoute } from '@angular/router';
import { AuthorsService } from '../../services/authors.service';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [ContextbarComponent, NavbarComponent, ReactiveFormsModule],
  templateUrl: './edit-book.component.html',
  styles: ``
})
export class EditBookComponent {
  bookId: number | null = null; // Number or null
  title: string = '';
  image: string = '';
  gender: string = '';
  book_authors: string = '';
  authors: any[] = [];
  description: string = '';

  // Reactive Forms
  authorFilter = new FormControl('');

  constructor(
    private route: ActivatedRoute, 
    private bookService: BookService,
    private authorsService: AuthorsService
  ) {}

  ngOnInit() {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.getBook(this.bookId);
  }

  parseAuthors(authors: any): string {
    let result = '';
    for (let i = 0; i < authors.length; i++) {
      result += authors[i].name + ' ' + authors[i].lastname;
      if (i < authors.length - 1) {
        result += ', ';
      }
    }
    return result;
  }

  getAuthors(query: any) {
    try {
      query = query.data
    } catch (error) {
      console.error('Query not an string');
    }
    if (typeof query === 'string') {
      this.authorsService.getAuthors(query).subscribe((answer:any) => {
        this.authors = answer.authors
        console.log(this.authors)
      })
    } else {
      this.authorsService.getAuthors('').subscribe((answer:any) => {
      })
    }
  }

  addAuthor(author: any) {
    this.authors.push(author)
  }

  getBook(id: Number) {
    this.bookService.getBook(id).subscribe((answer:any) => {
      this.title = answer.title
      this.image = answer.image
      this.gender = answer.gender
      this.book_authors = this.parseAuthors(answer.authors)
      this.description = answer.description
    })
  }
}
