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
export class CommentComponent implements OnInit {
  @Input() user_id: number = 0;
  @Input() rating: number = 0;
  @Input() body: string = '';
  user: any = null;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {this.getUser(this.user_id)}

  getUser(user_id: number): void {
    this.usersService.getUserName(user_id).subscribe((answer: any) => this.user = answer)
  }

  getUserImage(user: any) {
    if (!user?.image || user?.image === '') {
      return `https://via.placeholder.com/150?text= `;
    }
    return user?.image;
  }
}