import { Component, Input, OnInit } from '@angular/core';
import { StarsComponent } from '../stars/stars.component';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'comment',
  standalone: true,
  imports: [StarsComponent],
  templateUrl: './comment.component.html',
  styles: ``
})
export class CommentComponent {
  @Input() user: any = {};
  @Input() date: string = '';
  @Input() rating: number = 0;
  @Input() body: string = '';
  @Input() self_comment: boolean = false;

  getUserImage(user: any) {
    if (!user?.image || user?.image === '') {
      return `https://via.placeholder.com/150?text=${user?.name[0]}${user?.lastname[0]}`;
    }
    return user?.image;
  }
}