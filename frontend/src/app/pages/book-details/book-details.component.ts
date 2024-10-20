import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { StarsComponent } from '../../components/stars/stars.component';
import { CommentComponent } from '../../components/comment/comment.component';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [NavbarComponent, ContextbarComponent, StarsComponent, CommentComponent],
  templateUrl: './book-details.component.html',
  styles: ``
})
export class BookDetailsComponent implements OnInit {
  bookId: number | null = null; // Number or null
  title: string = '';
  image: string = '';
  gender: string = '';
  author: string = '';
  rating: number = 0;
  quantity: number = 0;
  description: string = '';
  comments: any[] = [];


  constructor(private route: ActivatedRoute, private bookService: BookService) {}

  // This method is called when the component is initialized to get the book ID from the route
  // async/await is used to wait for the getBook method to finish (in other tread) while the
  // component is initialized in the main tread (concurrency problem)
  ngOnInit() {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.getBook(this.bookId);
  }

  getBook(id: Number) {
    this.bookService.getBook(id).subscribe((answer:any) => {
      console.log(answer)
      this.title = answer.title
      this.image = answer.image
      this.gender = answer.gender
      this.author = answer.author
      this.rating = answer.rating
      this.quantity = answer.quantity
      this.description = answer.description
      this.comments = answer.comments
    })
  }
}
