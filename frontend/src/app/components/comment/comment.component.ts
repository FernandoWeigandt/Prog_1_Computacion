import { Component, Input } from '@angular/core';
import { StarsComponent } from '../stars/stars.component';
import { AuthService } from '../../services/auth.service';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'comment',
  standalone: true,
  imports: [StarsComponent],
  templateUrl: './comment.component.html',
  styles: ``
})
export class CommentComponent {
  @Input() id: number = 0;
  @Input() user: any = {};
  @Input() date: string = '';
  @Input() rating: number = 0;
  @Input() body: string = '';
  @Input() self_comment: boolean = false;

  constructor(
    private authService: AuthService,
    private commentService: CommentService
  ) {}

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  deleteComment() {
    this.commentService.deleteComment(this.id).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  getUserImage(user: any) {
    if (!user?.image || user?.image === '') {
      return `https://via.placeholder.com/150?text=${user?.name[0]}${user?.lastname[0]}`;
    }
    return user?.image;
  }
}