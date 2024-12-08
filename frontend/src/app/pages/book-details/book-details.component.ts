import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ContextbarComponent } from '../../components/contextbar/contextbar.component';
import { StarsComponent } from '../../components/stars/stars.component';
import { CommentComponent } from '../../components/comment/comment.component';
import { BookService } from '../../services/book.service';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    NavbarComponent,
    ContextbarComponent,
    StarsComponent,
    CommentComponent,
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './book-details.component.html',
  styles: `
  textarea:focus {
    outline: none;
    box-shadow: none;
  }
  `
})
export class BookDetailsComponent implements OnInit {
  bookId: number | null = null;
  title: string = '';
  image: string = '';
  gender: string = '';
  authors: string = '';
  rating: number = 0;
  quantity: number = 0;
  description: string = '';
  comments: any[] = [];
  self_comment: any = null;
  alertMessage: string | null = null;
  alertType: 'danger' | 'success' | null = null;

  constructor(
    private route: ActivatedRoute, 
    private bookService: BookService,
    private commentService: CommentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.getBook(this.bookId);
  }
  
  private fb = inject(NonNullableFormBuilder)
  commentForm = this.fb.group({
    body: ['', [
      Validators.required,
      Validators.maxLength(5000)
    ]],
    rate: ['3', [
      Validators.required,
    ]]
  })
  
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isUser(): boolean {
    return this.authService.isUser();
  }

  private parseAuthors(authors: any): string {
    let result = '';
    for (let i = 0; i < authors.length; i++) {
      result += authors[i].name + ' ' + authors[i].lastname;
      if (i < authors.length - 1) {
        result += ', ';
      }
    }
    return result;
  }

  private getBook(id: Number) {
    this.bookService.getBook(id).subscribe((answer:any) => {
      this.title = answer.title;
      this.image = answer.image;
      this.gender = answer.gender;
      this.authors = this.parseAuthors(answer.authors);
      this.rating = answer.rating;
      this.quantity = answer.quantity;
      this.description = answer.description;
      this.self_comment = answer.self_comment;
      this.comments = answer.comments;
    })
  }

  private showAlert(message: string, type: 'danger' | 'success') {
    this.alertMessage = message;
    this.alertType = type;
  }

  closeAlert() {
    this.alertMessage = null;
    this.alertType = null;
  }

  submitComment() {
    if (this.commentForm.valid) {
      const sanitizedBody = this.commentForm.value.body?.replace(/\s+$/, '');
      const sanitizedData = {
        ...this.commentForm.value,
        body: sanitizedBody,
        user_id: this.authService.userId,
        book_id: this.bookId
      };
      this.commentService.postComment(sanitizedData).subscribe({
        next: () => {
          this.showAlert('Comentario enviado exitosamente.', 'success');
          this.commentForm.reset();
          if (this.bookId) {
            this.getBook(this.bookId);
          } else {
            setTimeout(() => window.location.reload(), 500);
          }
        },
        error: (err) => {
          if (err.status === 400) {
            this.showAlert('Ya has comentado este libro.', 'danger');
          } else {
            this.showAlert('Ocurrió un error al enviar tu comentario. Por favor, inténtalo de nuevo más tarde.', 'danger');
          }
        }
      });
    }
  }
}
