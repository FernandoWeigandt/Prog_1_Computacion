import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { StarsComponent } from '../../components/stars/stars.component';
import { CommentComponent } from '../../components/comment/comment.component';
import { BookService } from '../../services/book.service';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [NavbarComponent, ContextbarComponent, StarsComponent, CommentComponent, FormsModule],
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
  comment_rate: number | string = 'Puntuación';
  comment_body: string = '';


  constructor(
    private route: ActivatedRoute, 
    private bookService: BookService,
    private commentService: CommentService
  ) {}

  ngOnInit() {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.getBook(this.bookId);
  }

  setRate(rating: number) {
    this.comment_rate = rating;
  }

  postComment() {
    const currentDate = new Date().toISOString().split('T')[0];
    const comment = {
      "book_id": this.bookId,
      "user_id": this.userId,
      "body": this.comment_body,
      "rate": this.comment_rate,
      "date": currentDate
    };
    this.commentService.postComment(comment).subscribe((response) => {
      console.log(response);
    })
  }

  get token(): any {
    return localStorage.getItem('token');
  }

  get userId(): any {
    const decoded: any = jwtDecode(this.token);
    return decoded.id;
  }

  getBook(id: Number) {
    this.bookService.getBook(id).subscribe((answer:any) => {
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
